# Fortune Cookie for Your Mood

Small Expo app that:

- takes a one-word mood input
- maps it to one detected emotion locally
- routes that emotion into one of 27 runtime fortune buckets
- reveals fortunes locally on device, with pacing that changes as the day goes on
- includes a dev-only Mood Lab route on web for mood mapping inspection
- includes a dev-only Screen Lab route on web for layout and state previews

## Key project structure

```text
App.js
components/
  CookieShell.js
  FortuneCard.js
  FortuneHomeContent.js
  FortuneHomeScreen.js
  FortuneLibrarySheet.js
  MoodLab.js
  CreatedFortunesSheet.js
  CustomFortuneSheet.js
  PreviewFrame.js
  PreviewLayoutContext.js
  PreviewModal.js
  SafetyLockScreen.js
  ScreenLab.js
  StreakStatus.js
data/
  runtime/
    fortunes.js
    moodBucketVocabulary.js
    moodVocabulary.js
    openFallbackVocab.js
    scenes.js
    semanticFallbackData.js
  build/
    openFallbackOverrides.json
    semanticFallbackConfig.js
  source/
    embedding-raw/
    open-lexicon-raw/
utils/
  appBadge.js
  customFortunes.js
  savedFortunes.js
  streaks.js
  fortuneLogic.js
assets/
  appicon_B2.png
  cookie/
    closed-2.png
    open-final.png
```

`data/` is organized by lifecycle:

- `data/runtime/`: files the app imports directly while running
- `data/build/`: human-edited build inputs and tuning knobs
- `data/source/`: heavyweight offline source material used to generate runtime data

## What is live now

- `assets/appicon_B2.png`: app icon for the next native build
- `assets/cookie/closed-2.png`: closed cookie image
- `assets/cookie/open-final.png`: broken/open cookie image
- `components/FortuneHomeScreen.js`: app state orchestration, asset hydration, streaks, pacing, safety lock, and reveal flow
- `components/FortuneHomeContent.js`: shared home-screen renderer used by production and Screen Lab
- `components/FortuneCard.js`: main single-screen layout, drawer chrome, prompt, cookie presentation, action tray, and sheet entry points
- `components/CookieShell.js`: cookie image swap + paper overlay
- `components/FortuneLibrarySheet.js`: history/favorites sheet with tap-to-share fortune cards
- `components/MoodLab.js`: dev-only browser lab for inspecting parsed input, handcrafted routing, open fallback routing, vector fallback, final bucket selection, source, and fortune output
- `components/CustomFortuneSheet.js`: create or edit a custom fortune locally on device
- `components/CreatedFortunesSheet.js`: browse, edit, and delete created fortunes by mood
- `components/SafetyLockScreen.js`: full-session lock screen for exact-match high-risk input
- `components/StreakStatus.js`: streak progress, tiers, and celebration UI
- `data/runtime/fortunes.js`: runtime fortune library keyed to the live mood buckets
- `data/runtime/scenes.js`: shared scene library plus bucket-to-scene mapping for the live mood set
- `data/runtime/moodVocabulary.js`: live bucket list plus runtime handcrafted lookup tables derived from the canonical vocabulary source
- `data/runtime/moodBucketVocabulary.js`: canonical handcrafted bucket vocabulary source (`BUCKET_VOCAB`) with one flat accepted-input list per bucket
- `data/runtime/openFallbackVocab.js`: generated lower-trust exact-match fallback vocabulary built offline from open lexical resources
- `data/build/openFallbackOverrides.json`: human-editable allow/deny controls for the generated open fallback layer
- `data/build/semanticFallbackConfig.js`: semantic fallback thresholds, anchors, keep-lists, and reject-lists used when rebuilding the compact semantic runtime data
- `data/runtime/semanticFallbackData.js`: generated compact runtime semantic fallback dataset loaded by the app after lexical matching fails
- `data/source/embedding-raw/`: optional offline staging area for heavyweight embedding assets used to build semantic runtime data
- `data/source/open-lexicon-raw/`: vendored local raw lexical sources used to build `openFallbackVocab.js`
- `scripts/bootstrapOpenLexicons.js`: one-time downloader that vendors the raw open lexical source files into the repo
- `scripts/buildOpenFallbackVocab.js`: deterministic offline builder for the generated open fallback layer
- `scripts/validateOpenFallback.js`: deterministic sanity-check helper for the open fallback path
- `utils/fortuneLogic.js`: input normalization, vocabulary lookup, conservative morphology/fuzzy matching, moderation hooks, scene selection, and day-state tracking
- `utils/customFortunes.js`: local persistence and validation for user-created fortunes
- `utils/savedFortunes.js`: local history/favorites persistence
- `utils/streaks.js`: local daily streak persistence
- `utils/appBadge.js`: native badge sync hooks for saved-state signals

Old visual experiments and export artifacts were removed so the repo reflects the current app instead of abandoned approaches.

## Mood Lab

Mood Lab is a dev-only browser route for checking how the live classifier routes words.

- Route options:
  - `/mood-lab`
  - `?moodLab=1`
  - `#/mood-lab`
- Entry point: `App.js` only enables it in `__DEV__` on web
- Main file: `components/MoodLab.js`
- Runtime source: `utils/fortuneLogic.js` via `getMoodLabSelection`

Current Mood Lab behavior includes:

- entering single words or short phrases and appending them to a local results table
- showing the parsed input, handcrafted bucket, open fallback bucket, vector match, vector audit, final bucket, source, and selected fortune for each row
- keeping up to 100 recent rows in browser `localStorage`
- using the same bucket mapping and fortune selection logic as the app, without persisting daily fortune state

## Screen Lab

Screen Lab is a dev-only browser route for layout and UI-state review.

- Route options:
  - `/screen-lab`
  - `?screenLab=1`
  - `#/screen-lab`
- Entry point: `App.js` only enables it in `__DEV__` on web
- Main file: `components/ScreenLab.js`
- Preview support: `components/PreviewFrame.js`, `components/PreviewLayoutContext.js`, and `components/PreviewModal.js`

Current Screen Lab controls include:

- three device classes: 4.7-inch, 6.1-inch, and 6.7-inch
- short, medium, and long fortune presets
- toggles for action tray, create sheet, drawer, history sheet, keyboard simulation, lock warning, open-cookie state, safe area simulation, and streak bar
- shared rendering through `FortuneHomeContent`, so the lab previews the same home UI used by the app

## Run locally

Install dependencies:

```bash
npm install
```

Bootstrap and build the offline open lexical fallback layer:

```bash
npm run bootstrap:open-lexicons
npm run build:open-fallback
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

Open Screen Lab locally on web:

```text
http://localhost:8081/screen-lab
```

Open Mood Lab locally on web:

```text
http://localhost:8081/mood-lab
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
- User-created fortunes are also stored locally on device only.
- The classifier now derives its handcrafted runtime lookups from the canonical `BUCKET_VOCAB` source in `data/runtime/moodBucketVocabulary.js`.
- The handcrafted runtime vocabulary is still the source of truth. The generated open fallback vocabulary in `data/runtime/openFallbackVocab.js` is lower trust and only runs as a later exact-match tier.
- The app now runs on a single-mood path: one word in, one detected mood out, then one matching fortune pool and scene.
- Mood input processing is deterministic and local: safety checks, handcrafted exact lookup, generated open fallback exact lookup, conservative morphology handling, strict typo-tolerant fuzzy matching, semantic fallback, then `unknown` fallback.
- Mood Lab uses that same live routing path for inspection, but does not save daily state or custom-fortune weighting into the main app flow.
- The runtime fortune system now uses 27 mood buckets:
  - `happy`
  - `hopeful`
  - `proud`
  - `calm`
  - `loving`
  - `grateful`
  - `amazed`
  - `surprised`
  - `confused`
  - `anxious`
  - `angry`
  - `frustrated`
  - `sad`
  - `disgusted`
  - `lonely`
  - `guilty`
  - `jealous`
  - `awkward`
  - `neutral`
  - `sick`
  - `tired`
  - `hungry`
  - `wired`
  - `distracted`
  - `stressed`
  - `numb`
  - `unknown`
- Older emotion-taxonomy writing was merged into the current runtime bucket system so the content model matches the live taxonomy.
- Unknown or unmapped inputs now fall back to the dedicated `unknown` bucket.
- Buckets now map into a seven-scene shared library through `data/runtime/scenes.js`, rather than broad positive/negative/neutral scene groups.
- The cookie visuals are intentionally asset-driven now: one closed image, one open image, and an in-app paper overlay.
