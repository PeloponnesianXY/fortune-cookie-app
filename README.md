# Fortune Cookie for Your Mood

Small Expo app that:

- takes a one-word mood input
- maps it to one detected emotion locally
- routes that emotion into one of 12 runtime fortune buckets
- reveals fortunes locally on device, with pacing that changes as the day goes on

## Project structure

```text
App.js
components/
  CookieShell.js
  FortuneCard.js
  FortuneLibrarySheet.js
  SafetyLockScreen.js
data/
  fortunes.js
  scenes.js
utils/
  savedFortunes.js
  streaks.js
  fortuneLogic.js
assets/
  appicon_B2.png
  cookie/
    closed-2.png
    open.png
```

## What is live now

- `assets/appicon_B2.png`: app icon for the next native build
- `assets/cookie/closed-2.png`: closed cookie image
- `assets/cookie/open.png`: broken/open cookie image
- `components/CookieShell.js`: cookie image swap + paper overlay
- `components/FortuneCard.js`: main single-screen layout, drawer chrome, prompt, and cookie presentation
- `components/FortuneLibrarySheet.js`: lightweight history/favorites sheet with tap-to-share fortune cards
- `components/SafetyLockScreen.js`: full-session lock screen for exact-match high-risk input
- `data/fortunes.js`: merged 12-bucket runtime fortune library
- `data/scenes.js`: dedicated scene per detected emotion bucket
- `utils/fortuneLogic.js`: emotion analysis, high-level moderation hooks, scene selection, day-state tracking, and replacement selection
- `utils/savedFortunes.js`: local history/favorites persistence
- `utils/streaks.js`: local daily streak persistence

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

## Standalone support page

This repo now also includes a static support landing page for App Review:

- `index.html`: standalone support/privacy/contact landing page
- `support.html`: redirect to `index.html`
- `support.css`: styling for the support page
- `netlify.toml`: Netlify publish and redirect config

If you host this repo as a static site, the root URL will open the support page directly.

## Hidden test commands

These are development shortcuts for testing the app state:

- `reset`
  - Clears the current day state from local storage.
  - Press Enter to reset the app back to a fresh closed-cookie state for today.

## Safety lock

- Exact-match high-risk words now bypass the fortune flow and immediately show a locked safety screen.
- The lock is session-only and cannot be dismissed from inside the app.
- Restarting the app clears the lock.
- The safety path does not create a fortune and does not save to history or favorites.

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

- The app uses local persistence via `AsyncStorage` to keep the current day state on device, including pacing/count information and replacement continuity.
- Daily streaks, history, favorites, and the one-time replace mechanic are all stored or coordinated locally on device only.
- The classifier now uses a mood-first path: a curated 500-word dictionary runs first, then the bundled NRC lexicon is flattened to one runtime mood bucket per word as fallback coverage.
- The app now runs on a single-mood path: one word in, one detected mood out, then one matching fortune pool and scene.
- The runtime fortune system now uses 12 mood buckets:
  - `happy`
  - `hopeful`
  - `calm`
  - `tired`
  - `lonely`
  - `sad`
  - `anxious`
  - `angry`
  - `confused`
  - `surprised`
  - `disgusted`
  - `weird`
- Older emotion-taxonomy writing was merged into those 12 runtime mood buckets so the content model matches the live taxonomy.
- Unknown or unmapped inputs fall back to the `weird` path instead of generating a separate generic bucket.
- Each detected emotion now maps to its own dedicated scene instead of drawing from broader positive/negative/neutral scene groups.
- The cookie visuals are intentionally asset-driven now: one closed image, one open image, and an in-app paper overlay.
