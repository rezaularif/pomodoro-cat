# Mobile app — Expo + React Native

This project is an **Expo** app. It is being built inside Sim Studio, a desktop
app that streams a live iOS Simulator of this repo from a GitHub Actions macOS
runner (via native-sim + @expo/serve-sim).

## Rules for the agent

- **Never run a local iOS/Android native build.** No `xcodebuild`, no
  `expo prebuild`, no `pod install`, no `eas build`. The preview lives on
  the cloud runner; local native builds are slow, huge, and pointless here.
- Local checks that ARE fine: `npx tsc --noEmit`, `npm run lint`, `npm test`.
- **Stay Expo Go compatible** unless the user explicitly asks for native code:
  only Expo SDK libraries (`npx expo install <pkg>`), no custom native
  modules or config plugins that add native code.
- Write real React Native code — StyleSheet, SafeAreaView, Pressable, proper
  touch targets. Make the UI polished: this is a consumer-facing mobile app.
- When you finish a change, just leave the files written. The desktop app
  commits + pushes; the runner pulls and Metro fast-refreshes the simulator.
- If you add a dependency, always use `npx expo install` so the version
  matches the Expo SDK.
