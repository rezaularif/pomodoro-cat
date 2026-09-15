const { execFileSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const { join } = require("node:path");
const { packageManager, installArgs, dependencyHash, managerPackage } = require("./dependencies.cjs");
const cwd = process.cwd();
const statusFile = join(cwd, ".git/studio-preview-status.json");
const metroLog = join(cwd, ".git/studio-metro.log");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function command(bin, args, options = {}) {
  return String(execFileSync(bin, args, { cwd, encoding: "utf8", timeout: 120000, ...options }) ?? "").trim();
}
function status(phase, message, sha) {
  fs.writeFileSync(statusFile + ".tmp", JSON.stringify({ phase, message, sha, updatedAt: Date.now() }));
  fs.renameSync(statusFile + ".tmp", statusFile);
}
function install() {
  const info = packageManager(cwd);
  if (!info.version || !info.locked) throw new Error("Commit a pinned packageManager and lockfile before previewing.");
  status("loading", `Installing ${info.name} dependencies`);
  let current = "";
  try { current = command(info.name, ["--version"]); } catch {}
  if (current !== info.version) {
    command("npm", ["install", "--global", managerPackage(info), "--no-audit", "--no-fund"], { stdio: "inherit" });
  }
  command(info.name, installArgs(info), { stdio: "inherit", timeout: 20 * 60_000 });
  command("node", [join(cwd, "node_modules/expo/bin/cli"), "install", "--check"], { stdio: "inherit" });
}
async function bundleReady() {
  let lastError = "Metro did not become ready";
  const deadline = Date.now() + 5 * 60_000;
  while (Date.now() < deadline) {
    try {
      const manifestResponse = await fetch("http://127.0.0.1:8081/", {
        headers: { "expo-platform": "ios", accept: "application/expo+json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!manifestResponse.ok) throw new Error(`Metro manifest returned ${manifestResponse.status}`);
      const manifest = await manifestResponse.json();
      const url = new URL(manifest.launchAsset?.url);
      if (!["127.0.0.1", "localhost"].includes(url.hostname) || url.port !== "8081") {
        throw new Error("Metro returned an unexpected bundle URL");
      }
      const bundle = await fetch(url, { signal: AbortSignal.timeout(180000) });
      if (!bundle.ok) throw new Error(`Metro bundle failed (${bundle.status}): ${(await bundle.text()).slice(0, 1500)}`);
      for await (const _chunk of bundle.body) { /* warm without retaining the bundle */ }
      command("xcrun", ["simctl", "openurl", "booted", "exp://127.0.0.1:8081"]);
      return;
    } catch (error) { lastError = error.message; }
    await sleep(2000);
  }
  throw new Error(lastError);
}
async function start(initial = false) {
  status("loading", "Starting Metro and iOS Expo Go", command("git", ["rev-parse", "HEAD"]));
  if (!initial) {
    try {
      const pids = command("lsof", ["-ti", "tcp:8081", "-sTCP:LISTEN"]).split(/\s+/);
      for (const pid of pids) if (/^\d+$/.test(pid)) process.kill(Number(pid), "SIGTERM");
    } catch {}
    for (let n = 0; n < 30; n++) {
      try { command("lsof", ["-ti", "tcp:8081", "-sTCP:LISTEN"]); await sleep(200); } catch { break; }
    }
  }
  const fd = fs.openSync(metroLog, "w", 0o600);
  const child = spawn(process.execPath, [
    join(cwd, "node_modules/expo/bin/cli"), "start", "--go", "--localhost", "--port", "8081",
    ...(initial ? ["--ios"] : []),
  ], { cwd, detached: true, env: { ...process.env, CI: "1" }, stdio: ["ignore", fd, fd] });
  fs.closeSync(fd);
  child.on("error", error => status("error", error.message));
  child.unref();
  await bundleReady();
  const sha = command("git", ["rev-parse", "HEAD"]);
  status("ready", "Bundle ready; iOS Expo Go launched", sha);
}
async function watch() {
  const branch = process.env.STUDIO_BRANCH;
  if (!branch || branch.startsWith("-") || /[\r\n\0]/.test(branch)) throw new Error("STUDIO_BRANCH is required");
  let hash = dependencyHash(cwd);
  let attempted = command("git", ["rev-parse", "HEAD"]);
  for (;;) {
    await sleep(5000);
    try { command("git", ["fetch", "origin", branch], { timeout: 30000 }); }
    catch (error) { console.error("Fetch failed; retrying:", error.message); continue; }
    try {
      const sha = command("git", ["rev-parse", "FETCH_HEAD"]);
      if (sha === attempted) continue;
      attempted = sha;
      status("loading", "Synchronizing the latest commit", sha);
      command("git", ["reset", "--hard", sha]);
      const nextHash = dependencyHash(cwd);
      if (nextHash !== hash) { install(); hash = nextHash; }
      await start();
    } catch (error) {
      status("error", error.message.slice(0, 2000), attempted);
    }
  }
}
if (require.main === module) {
  Promise.resolve().then(async () => {
    if (process.argv[2] === "install") install();
    else if (process.argv[2] === "start") await start(true);
    else if (process.argv[2] === "watch") await watch();
    else throw new Error("Unknown preview action");
  }).catch(error => {
    status("error", error.message.slice(0, 2000));
    console.error(error.message);
    process.exitCode = 1;
  });
}
module.exports = { install, bundleReady };
