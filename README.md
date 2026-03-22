# Fortune Cookie Daily

Small Expo app that:

- takes a mood input
- maps it to a mood/tone locally
- reveals one saved fortune per day

## Project structure

```text
App.js
components/
  CookieShell.js
  FortuneCard.js
data/
  fortunes.js
  scenes.js
utils/
  fortuneLogic.js
assets/
  cookie/
    closed.png
    open.png
```

## What is live now

- `assets/cookie/closed.png`: closed cookie image
- `assets/cookie/open.png`: broken/open cookie image
- `components/CookieShell.js`: cookie image swap + paper overlay
- `utils/fortuneLogic.js`: mood analysis, moderation, daily persistence

Old visual experiments and export artifacts were removed so the repo reflects the current app instead of abandoned approaches.

## Run locally

Install dependencies:

```bash
npm install
```

Start Expo web:

```bash
npm run web
```

If PowerShell does not see `npm`, use:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cmd /c npm run web
```

## Hidden test commands

These are development shortcuts for testing the app without waiting for the next calendar day:

- `override <mood>`
  - Bypasses the once-per-day lock.
  - Uses the text after `override` as the actual mood input.
  - Examples: `override happy`, `override stressed`
  - After an override fortune is shown, the bottom cue becomes `Ready for another fortune?`, and tapping the cookie resets the UI for another immediate test run.

- `resetfortune`
  - Clears the saved daily fortune from local storage.
  - After typing it, tap the cookie to reset the app back to a fresh closed-cookie state for today.

## iOS release path

1. Create an Expo account.
2. Enroll in the Apple Developer Program.
3. Log in:

```bash
eas login
```

4. Build for iOS in the cloud:

```bash
eas build --platform ios
```

5. Submit to App Store Connect:

```bash
eas submit --platform ios
```

## Notes

- The app uses local persistence via `AsyncStorage` to keep exactly one normal fortune per calendar day on the device.
- The cookie visuals are intentionally asset-driven now: one closed image, one open image, and an in-app paper overlay.
