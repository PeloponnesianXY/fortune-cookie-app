# Fortune Cookie for Your Mood

Small Expo app that:

- takes a one-word mood input
- maps it to one detected emotion locally
- routes that emotion into one of 31 runtime fortune buckets
- reveals fortunes locally on device, with pacing that changes as the day goes on
- derives runtime fortune pools from one canonical fortune registry
- includes a dev-only Fortune Lab route on web for canonical fortune editing
- includes a dev-only Semantic Lab route on web for mood mapping inspection
- includes a dev-only Screen Lab route on web for layout and state previews

## Key project structure

```text
App.js
components/
  CookieShell.js
  FortuneCard.js
  FortuneHomeContent.js
  FortuneHomeScreen.js
  FortuneLab.js
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
  fortunesRegistry.js
  runtime/
    fortunes.js
    moodBucketVocabulary.js
    moodVocabularyRuntimeWrapper.js
    scenes.js
    semanticFallbackData.js
  build/
    openFallbackOverrides.json
    semanticSeedVocabulary.js
    semanticFallbackConfig.js
  source/
    embedding-raw/
    open-lexicon-raw/
scripts/
  fortuneLabServer.js
  fortuneRegistryStore.js
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
- `components/FortuneLab.js`: dev-only browser lab for editing the canonical fortune registry
- `components/MoodLab.js`: dev-only browser lab for inspecting parsed input, deterministic routing, advisory vector embeddings suggestions, final bucket selection, source, and fortune output
- `components/CustomFortuneSheet.js`: create or edit a custom fortune locally on device
- `components/CreatedFortunesSheet.js`: browse, edit, and delete created fortunes by mood
- `components/SafetyLockScreen.js`: full-session lock screen for exact-match high-risk input
- `components/StreakStatus.js`: streak progress, tiers, and celebration UI
- `data/fortunesRegistry.js`: canonical source-of-truth fortune registry, with one record per fortune
- `data/runtime/fortunes.js`: runtime fortune library keyed to the live mood buckets and derived from `data/fortunesRegistry.js`
- `data/runtime/scenes.js`: shared scene library plus bucket-to-scene mapping for the live mood set
- `data/runtime/moodVocabularyRuntimeWrapper.js`: live bucket list plus runtime lookup tables derived from the canonical vocabulary source
- `data/runtime/moodBucketVocabulary.js`: canonical runtime vocabulary module containing the merged deterministic bucket vocabulary source (`BUCKET_VOCAB`) and the generated lexical source material (`OPEN_FALLBACK_VOCAB`) used to build it
- `data/build/openFallbackOverrides.json`: human-editable allow/deny controls for the generated lexical source material before it is merged into the deterministic runtime vocabulary
- `data/build/semanticSeedVocabulary.js`: human-edited seed words used when rebuilding the vector embeddings suggestion data
- `data/build/semanticFallbackConfig.js`: vector embeddings suggestion thresholds, anchors, keep-lists, and reject-lists used when rebuilding the runtime data
- `data/runtime/semanticFallbackData.js`: generated runtime vector embeddings dataset used by Semantic Lab diagnostics and offline validation
- `data/source/embedding-raw/`: optional offline staging area for heavyweight embedding assets used to build vector embeddings fallback data
- `data/source/open-lexicon-raw/`: vendored local raw lexical sources used to build the generated lexical source material before runtime merging
- `scripts/fortuneLabServer.js`: local-only Node API for reading/writing the canonical fortune registry on disk during Fortune Lab sessions
- `scripts/fortuneRegistryStore.js`: canonical registry read/write helpers used by the Fortune Lab API
- `scripts/bootstrapOpenLexicons.js`: one-time downloader that vendors the raw open lexical source files into the repo
- `scripts/buildOpenFallbackVocab.js`: deterministic offline builder for the generated lexical source material
- `scripts/validateOpenFallback.js`: deterministic sanity-check helper for the lexical-source build path
- `utils/fortuneLogic.js`: input normalization, vocabulary lookup, conservative morphology/fuzzy matching, moderation hooks, scene selection, and day-state tracking
- `utils/customFortunes.js`: local persistence and validation for user-created fortunes
- `utils/savedFortunes.js`: local history/favorites persistence
- `utils/streaks.js`: local daily streak persistence
- `utils/appBadge.js`: native badge sync hooks for saved-state signals

Old visual experiments and export artifacts were removed so the repo reflects the current app instead of abandoned approaches.

## Fortune model

Fortunes now live in one canonical registry:

- `data/fortunesRegistry.js`

Each record exists once, with:

- `id`
- `text`
- `primaryBucket`
- `alsoFits`
- `scope`
- `active`

The runtime bucket arrays are derived from that registry in `data/runtime/fortunes.js`.

Special handling:

- storage keeps the legacy mystery bucket as `weird`
- runtime exposes that bucket as `unknown`
- `unknown` is intentionally hidden from Create Your Own and Fortune Lab column editing, but still exists in runtime behavior

## Fortune Lab

Fortune Lab is a dev-only browser route for editing the canonical fortune registry.

- Route options:
  - `/fortune-lab`
  - `?fortuneLab=1`
  - `#/fortune-lab`
- Entry point: `App.js` only enables it in `__DEV__` on web
- Main file: `components/FortuneLab.js`
- Local API: `scripts/fortuneLabServer.js`
- Registry IO: `scripts/fortuneRegistryStore.js`

Current Fortune Lab behavior includes:

- showing all fortunes in one long editor, grouped by bucket
- ordering bucket sections and columns to match the user-facing Create Your Own mood order
- inline editing of fortune text
- one checkbox column per editable mood bucket
- local browser draft persistence for unprocessed changes
- `Process Changes`, which sends one batch request to the local Node API and writes `data/fortunesRegistry.js`
- `Discard Draft`, which clears the local browser draft and reloads from the canonical file
- dev-only local use on web; it is not part of the shipped native app

## Semantic Lab

Semantic Lab is a dev-only browser route for checking how the live classifier routes words and for inspecting advisory vector suggestions.

- Route options:
  - `/lab`
  - `/semantic-lab`
  - `?semanticLab=1`
  - `#/lab`
  - `#/semantic-lab`
- Entry point: `App.js` only enables it in `__DEV__` on web
- Main file: `components/MoodLab.js`
- Runtime source: `utils/fortuneLogic.js` via `getMoodLabSelection`

Current Semantic Lab behavior includes:

- entering single words or short phrases and appending them to a local results table
- showing the parsed input, deterministic bucket, advisory vector suggestion, final bucket, source, and selected fortune for each row
- keeping up to 100 recent rows in browser `localStorage`
- using the same deterministic bucket mapping and fortune selection logic as the app, without persisting daily fortune state
- showing vector embeddings as a lab-only suggestion layer, not as part of live app routing

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

Start the local Fortune Lab API in a separate terminal when using Fortune Lab:

```bash
npm run fortune-lab:server
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

Open Semantic Lab locally on web:

```text
http://localhost:8081/lab
```

Expo may choose a different port if `8081` is busy, so use whatever local URL the dev server prints.

Open Fortune Lab locally on web:

```text
http://localhost:8081/fortune-lab
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
- The classifier now derives one merged deterministic runtime lookup from the canonical `BUCKET_VOCAB` source in `data/runtime/moodBucketVocabulary.js`.
- The generated lexical source material still lives in `data/runtime/moodBucketVocabulary.js`, but it is merged into the deterministic runtime lookup before the app runs instead of acting as a separate later exact-match tier.
- The app now runs on a single-mood path: one word in, one detected mood out, then one matching fortune pool and scene.
- Mood input processing is deterministic and local: safety checks, deterministic exact lookup, conservative morphology handling, strict typo-tolerant fuzzy matching, then `unknown` fallback.
- Semantic Lab uses that same live deterministic routing path for inspection, but does not save daily state or custom-fortune weighting into the main app flow.
- Vector embeddings remain in the repo as tooling and lab diagnostics, not as part of live production mood routing.
- The runtime fortune system now uses 31 mood buckets:
  - `caring`
  - `engaged`
  - `emotional`
  - `happy`
  - `hopeful`
  - `proud`
  - `calm`
  - `grateful`
  - `wowed`
  - `shaken`
  - `confused`
  - `anxious`
  - `angry`
  - `frustrated`
  - `sad`
  - `disgusted`
  - `lonely`
  - `guilty`
  - `jealous`
  - `embarrassed`
  - `neutral`
  - `romantic`
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
- Create Your Own uses user-facing labels for several buckets:
  - `Affectionate` -> `caring`
  - `Remorseful` -> `guilty`
  - `Unbalanced` -> `distracted`
- Buckets now map into a seven-scene shared library through `data/runtime/scenes.js`, rather than broad positive/negative/neutral scene groups.
- The cookie visuals are intentionally asset-driven now: one closed image, one open image, and an in-app paper overlay.
