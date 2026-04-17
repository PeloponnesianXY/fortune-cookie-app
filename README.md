# Fortune Cookie for Your Mood

Expo app that takes a one-word mood input, routes it to one local mood bucket, and reveals one matching fortune and scene.

## Live architecture

- Runtime routing is local and deterministic.
- Runtime path is: moderation -> exact vocab -> morphology -> fuzzy -> `unknown`.
- The canonical mood vocabulary lives in `data/vocabulary/moodBucketVocabulary.js`.
- The canonical fortune registry lives in `data/fortunes/fortunesRegistry.js`.
- Runtime fortune pools are derived in `data/fortunes/fortuneLibrary.js`.
- Fortune Lab is a dev-only web editor for the canonical fortune registry.
- Semantic Lab is a dev-only web inspector for routing plus advisory vector diagnostics.
- Screen Lab is a dev-only web preview surface for layout and state checks.
- Custom fortunes are locally moderated before save, including embedded high-risk self-harm terms.

## Project structure

```text
App.native.js
App.web.js
components/
  home/
    CookieShell.js
    DrawerItem.js
    DrawerSection.js
    FortuneActionTray.js
    FortuneCard.js
    FortuneHomeContent.js
    FortuneHomeScreen.js
    SafetyLockScreen.js
    StreakStatus.js
  preview/
    PreviewFrame.js
    PreviewLayoutContext.js
    PreviewModal.js
  sheets/
    CreatedFortunesSheet.js
    CustomFortuneSheet.js
    FortuneLibrarySheet.js
dev/
  labs/
    ClassicFortuneLab.js
    FortuneLab.js
    ScreenLab.js
    SemanticLab.js
    WebLabRouter.js
    WebLabRouter.web.js
  semanticLab/
    semanticFallback.js
    semanticLabSelection.js
    semanticLabSelection.web.js
data/
  fortunes/
    fortunesRegistry.js
    fortuneLibrary.js
  scenes/
    scenes.js
  semanticLab/
    semanticFallbackData.js
  vocabulary/
    futureExpansionMoodPhraseVocabulary.js
    moodBucketVocabulary.js
tools/
  fortuneLab/
    registryStore.js
    server.js
  validate/
    sceneMapping.js
utils/
  appBadge.js
  customFortunes.js
  dateUtils.js
  fortuneLogic.js
  savedFortunes.js
  semanticFallback.js
  streaks.js
assets/
  appicon_B2.png
  cookie/
    closed-2.png
    open-final.png
index.html
support.html
support.css
netlify.toml
```

## Key files

- `components/home/FortuneHomeScreen.js`: app state orchestration, reveal flow, streaks, safety lock, persistence handoff
- `components/home/FortuneHomeContent.js`: shared main screen renderer
- `components/home/FortuneCard.js`: prompt, cookie, sheets, drawer, and action tray layout
- `dev/labs/FortuneLab.js`: dev-only browser lab for editing the canonical fortune registry
- `dev/labs/SemanticLab.js`: dev-only browser lab for inspecting routing and vector suggestions
- `dev/labs/ScreenLab.js`: dev-only browser preview surface for layout, state review, and paper-fit sampling
- `dev/labs/WebLabRouter.web.js`: web-only lab route switch
- `data/fortunes/fortunesRegistry.js`: canonical source of truth for all live fortunes
- `data/fortunes/fortuneLibrary.js`: derived runtime fortune pools
- `data/vocabulary/moodBucketVocabulary.js`: canonical deterministic accepted-input vocabulary
- `data/scenes/scenes.js`: scene library and bucket-to-scene mapping
- `utils/fortuneLogic.js`: moderation, normalization, routing, selection, and daily-state logic
- `dev/semanticLab/semanticFallback.js`: lab-only vector suggestion logic used by Semantic Lab
- `tools/fortuneLab/server.js`: local Node API for Fortune Lab editing
- `tools/fortuneLab/registryStore.js`: file IO helpers for the canonical fortune registry
- `tools/validate/sceneMapping.js`: CLI validation for bucket-to-scene consistency

## Fortune model

Fortunes live once in `data/fortunes/fortunesRegistry.js`.

Each record has:

- `id`
- `text`
- `primaryBucket`
- `alsoFits`
- `scope`

Inactive fortunes were removed from the repo. The registry is live-only now.

## Fortune counts

Current live fortune counts by bucket:

| Bucket | Primary | AlsoFits | Total |
|---|---:|---:|---:|
| `stressed` | 13 | 58 | 71 |
| `shaken` | 25 | 24 | 49 |
| `anxious` | 27 | 18 | 45 |
| `tired` | 28 | 6 | 34 |
| `frustrated` | 5 | 27 | 32 |
| `confused` | 23 | 8 | 31 |
| `hopeful` | 20 | 10 | 30 |
| `angry` | 24 | 5 | 29 |
| `calm` | 19 | 8 | 27 |
| `distracted` | 2 | 23 | 25 |
| `lonely` | 16 | 8 | 24 |
| `grateful` | 16 | 6 | 22 |
| `hungry` | 22 | 0 | 22 |
| `neutral` | 22 | 0 | 22 |
| `sad` | 21 | 1 | 22 |
| `sick` | 12 | 10 | 22 |
| `guilty` | 16 | 5 | 21 |
| `romantic` | 19 | 1 | 20 |
| `jealous` | 17 | 3 | 20 |
| `disgusted` | 19 | 0 | 19 |
| `caring` | 18 | 1 | 19 |
| `confident` | 6 | 13 | 19 |
| `wired` | 4 | 14 | 18 |
| `emotional` | 17 | 0 | 17 |
| `happy` | 17 | 0 | 17 |
| `numb` | 13 | 4 | 17 |
| `wowed` | 11 | 6 | 17 |
| `engaged` | 16 | 0 | 16 |
| `embarrassed` | 9 | 7 | 16 |
| `proud` | 10 | 5 | 15 |
| `unknown` | 9 | 0 | 9 |

## Labs

### Fortune Lab

Fortune Lab is a dev-only browser route for editing the canonical fortune registry.

- Route options:
  - `/fortune-lab`
  - `?fortuneLab=1`
  - `#/fortune-lab`
- Requires the local API:
  - `npm run fortune-lab:server`

### Semantic Lab

Semantic Lab is a dev-only browser route for checking how the live classifier routes words.

- Route options:
  - `/lab`
  - `/semantic-lab`
  - `?semanticLab=1`
  - `#/lab`
  - `#/semantic-lab`
- Uses the live deterministic runtime path.
- Also shows advisory vector suggestions from `dev/semanticLab/semanticFallback.js`.
- Vector suggestions are diagnostic only; they are not part of production app routing.

### Screen Lab

Screen Lab is a dev-only browser route for layout and state review.

- Route options:
  - `/screen-lab`
  - `?screenLab=1`
  - `#/screen-lab`
- Includes a paper-fit sampler that renders 10 random live fortunes against the real cookie paper on SE, iPhone 14, and Pro Max class layouts.
- It is not part of the shipped native app path.

## Run locally

Install dependencies:

```bash
npm install
```

Start Expo web:

```bash
npm run web
```

Start the Fortune Lab API in a separate terminal when using Fortune Lab:

```bash
npm run fortune-lab:server
```

If PowerShell does not see `npm`, use:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cmd /c npm run web
```

Open Semantic Lab locally on web:

```text
http://localhost:8081/lab
```

Open Screen Lab locally on web:

```text
http://localhost:8081/screen-lab
```

Open Fortune Lab locally on web:

```text
http://localhost:8081/fortune-lab
```

Expo may choose a different port if `8081` is busy, so use the printed local URL.

## Safety lock

- Exact-match high-risk words bypass the fortune flow and show a locked safety screen.
- Custom fortunes also block embedded high-risk terms such as self-harm language inside longer sentences.
- The lock is session-only.
- Restarting the app clears the lock.
- The safety path does not create a fortune or save history/favorites.

## Cleanup notes

- Local test artifacts such as `.edge-headless/` and `classic-lab-shot.png` are ignored and should not be committed.
- `dist/` is generated output and is ignored.

## Support page

The repo root also contains the static support page used for review/deployment:

- `index.html`
- `support.html`
- `support.css`
- `netlify.toml`

## Notes

- The app uses `AsyncStorage` for local daily state, streaks, history, favorites, and created fortunes.
- Runtime fortune selection is single-path: one input, one detected bucket, one matching fortune pool, one scene.
- The runtime bucket set is:
  - `caring`
  - `wowed`
  - `angry`
  - `anxious`
  - `embarrassed`
  - `emotional`
  - `engaged`
  - `calm`
  - `confident`
  - `confused`
  - `distracted`
  - `disgusted`
  - `frustrated`
  - `grateful`
  - `guilty`
  - `happy`
  - `hopeful`
  - `proud`
  - `hungry`
  - `jealous`
  - `lonely`
  - `romantic`
  - `numb`
  - `neutral`
  - `sad`
  - `stressed`
  - `shaken`
  - `tired`
  - `sick`
  - `unknown`
  - `wired`
