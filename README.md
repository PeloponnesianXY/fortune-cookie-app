# Fortune Cookie for Your Mood

Expo app that takes a one-word mood input, routes it to one local mood bucket, and reveals one matching fortune and scene.

## Live architecture

- Runtime routing is local and deterministic.
- Runtime path is: moderation -> exact vocab -> morphology -> fuzzy -> `unknown`.
- The canonical mood vocabulary lives in `data/runtime/moodBucketVocabulary.js`.
- The canonical fortune registry lives in `data/fortunesRegistry.js`.
- Runtime fortune pools are derived in `data/runtime/fortunes.js`.
- Semantic Lab is a dev-only web inspector for routing plus advisory vector diagnostics.

## Project structure

```text
App.js
components/
  CookieShell.js
  CreatedFortunesSheet.js
  CustomFortuneSheet.js
  FortuneActionTray.js
  FortuneCard.js
  FortuneHomeContent.js
  FortuneHomeScreen.js
  FortuneLibrarySheet.js
  PreviewFrame.js
  PreviewLayoutContext.js
  PreviewModal.js
  SafetyLockScreen.js
  SemanticLab.js
  StreakStatus.js
data/
  fortunesRegistry.js
  runtime/
    fortunes.js
    moodBucketVocabulary.js
    moodVocabularyRuntimeWrapper.js
    scenes.js
    semanticFallbackData.js
scripts/
  validateSceneMapping.js
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

- `components/FortuneHomeScreen.js`: app state orchestration, reveal flow, streaks, safety lock, persistence handoff
- `components/FortuneHomeContent.js`: shared main screen renderer
- `components/FortuneCard.js`: prompt, cookie, sheets, drawer, and action tray layout
- `components/SemanticLab.js`: dev-only browser lab for inspecting routing and vector suggestions
- `data/fortunesRegistry.js`: canonical source of truth for all live fortunes
- `data/runtime/fortunes.js`: derived runtime fortune pools
- `data/runtime/moodBucketVocabulary.js`: canonical deterministic accepted-input vocabulary
- `data/runtime/moodVocabularyRuntimeWrapper.js`: thin runtime wrapper for bucket keys and legacy aliases
- `data/runtime/scenes.js`: scene library and bucket-to-scene mapping
- `utils/fortuneLogic.js`: moderation, normalization, routing, selection, and daily-state logic
- `utils/semanticFallback.js`: lab-only vector suggestion logic used by Semantic Lab

## Fortune model

Fortunes live once in `data/fortunesRegistry.js`.

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
| `stressed` | 13 | 60 | 73 |
| `shaken` | 26 | 24 | 50 |
| `anxious` | 28 | 19 | 47 |
| `frustrated` | 5 | 29 | 34 |
| `tired` | 28 | 6 | 34 |
| `confused` | 23 | 10 | 33 |
| `hopeful` | 20 | 12 | 32 |
| `angry` | 24 | 6 | 30 |
| `calm` | 21 | 9 | 30 |
| `distracted` | 2 | 25 | 27 |
| `lonely` | 16 | 8 | 24 |
| `sad` | 23 | 1 | 24 |
| `grateful` | 16 | 6 | 22 |
| `guilty` | 16 | 6 | 22 |
| `hungry` | 22 | 0 | 22 |
| `neutral` | 22 | 0 | 22 |
| `sick` | 12 | 10 | 22 |
| `confident` | 6 | 15 | 21 |
| `jealous` | 18 | 3 | 21 |
| `emotional` | 20 | 0 | 20 |
| `engaged` | 20 | 0 | 20 |
| `happy` | 19 | 1 | 20 |
| `numb` | 15 | 5 | 20 |
| `romantic` | 19 | 1 | 20 |
| `wired` | 6 | 14 | 20 |
| `wowed` | 14 | 6 | 20 |
| `embarrassed` | 12 | 8 | 20 |
| `caring` | 15 | 3 | 18 |
| `proud` | 11 | 5 | 16 |
| `disgusted` | 19 | 0 | 19 |
| `unknown` | 10 | 0 | 10 |

## Labs

### Semantic Lab

Semantic Lab is a dev-only browser route for checking how the live classifier routes words.

- Route options:
  - `/lab`
  - `/semantic-lab`
  - `?semanticLab=1`
  - `#/lab`
  - `#/semantic-lab`
- Uses the live deterministic runtime path.
- Also shows advisory vector suggestions from `utils/semanticFallback.js`.
- Vector suggestions are diagnostic only; they are not part of production app routing.

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

Open Semantic Lab locally on web:

```text
http://localhost:8081/lab
```

Expo may choose a different port if `8081` is busy, so use the printed local URL.

## Safety lock

- Exact-match high-risk words bypass the fortune flow and show a locked safety screen.
- The lock is session-only.
- Restarting the app clears the lock.
- The safety path does not create a fortune or save history/favorites.

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
