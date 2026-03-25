# Fortune Cookie Daily

Small Expo app that:

- takes a one-word mood input
- maps it to one detected emotion locally
- routes that emotion into one of 9 runtime fortune buckets
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
  appicon_final_clean.png
  cookie/
    closed-2.png
    open.png
```

## What is live now

- `assets/appicon_final_clean.png`: app icon for the next native build
- `assets/cookie/closed-2.png`: closed cookie image
- `assets/cookie/open.png`: broken/open cookie image
- `components/CookieShell.js`: cookie image swap + paper overlay
- `data/fortunes.js`: merged 10-bucket runtime fortune library
- `data/scenes.js`: dedicated scene per detected emotion bucket
- `utils/fortuneLogic.js`: emotion analysis, moderation, scene selection, daily persistence

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

- `override <word>`
  - Bypasses the once-per-day lock.
  - Uses the text after `override` as the actual one-word input.
- Examples: `override happy`, `override weird`
  - After an override fortune is shown, the bottom cue becomes `Ready for another fortune?`, and tapping the cookie resets the UI for another immediate test run.

- `reset`
  - Clears the saved daily fortune from local storage.
  - Press Enter to reset the app back to a fresh closed-cookie state for today.

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
- The classifier now uses a mood-first path: a curated 500-word dictionary runs first, then the bundled NRC lexicon is flattened to one runtime mood bucket per word as fallback coverage.
- The app now runs on a single-mood path: one word in, one detected mood out, then one matching fortune pool and scene.
- The runtime fortune system now uses 10 mood buckets:
  - `happy`
  - `hopeful`
  - `calm`
  - `sad`
  - `anxious`
  - `angry`
  - `confused`
  - `surprised`
  - `averse`
  - `weird`
- Older emotion-taxonomy writing was merged into those 10 runtime mood buckets so the content model matches the live taxonomy.
- Unknown or unmapped inputs fall back to the `weird` path instead of generating a separate generic bucket.
- Each detected emotion now maps to its own dedicated scene instead of drawing from broader positive/negative/neutral scene groups.
- The cookie visuals are intentionally asset-driven now: one closed image, one open image, and an in-app paper overlay.
