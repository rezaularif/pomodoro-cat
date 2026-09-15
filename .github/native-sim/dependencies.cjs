const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { createHash } = require("node:crypto");

const locks = { npm: "package-lock.json", pnpm: "pnpm-lock.yaml", yarn: "yarn.lock", bun: "bun.lock" };
function packageManager(dir) {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const declared = pkg.packageManager?.match(/^(npm|pnpm|yarn|bun)@(\d+\.\d+\.\d+)(?:\+sha\d+\.[a-f0-9]+)?$/);
  if (pkg.packageManager && !declared) throw new Error("Use a pinned npm, pnpm, yarn or bun packageManager version.");
  const found = Object.entries(locks).filter(([, name]) => existsSync(join(dir, name))).map(([pm]) => pm);
  if (existsSync(join(dir, "bun.lockb")) && !found.includes("bun")) found.push("bun");
  if (found.length > 1) throw new Error("Multiple package-manager lockfiles found. Keep the one this project uses.");
  if (declared && found.length && declared[1] !== found[0]) throw new Error("packageManager and lockfile disagree.");
  const name = declared?.[1] || found[0] || "npm";
  return { name, version: declared?.[2], locked: found.length > 0 };
}
function installArgs(info) {
  if (info.name === "npm") return [info.locked ? "ci" : "install", "--no-audit", "--no-fund"];
  if (info.name === "yarn") return info.version?.startsWith("1.")
    ? ["install", ...(info.locked ? ["--frozen-lockfile"] : [])]
    : ["install", ...(info.locked ? ["--immutable"] : [])];
  return ["install", ...(info.locked ? ["--frozen-lockfile"] : [])];
}
function managerPackage(info) {
  const name = info.name === "yarn" && !info.version.startsWith("1.") ? "@yarnpkg/cli-dist" : info.name;
  return `${name}@${info.version}`;
}
function dependencyHash(dir) {
  const hash = createHash("sha256");
  for (const file of ["package.json", ...Object.values(locks), "bun.lockb", ".npmrc", ".yarnrc.yml", "pnpm-workspace.yaml"]) {
    if (existsSync(join(dir, file))) hash.update(file).update(readFileSync(join(dir, file)));
  }
  return hash.digest("hex");
}
module.exports = { packageManager, installArgs, dependencyHash, managerPackage };
