Open lexical raw inputs for the fallback mood-routing tier belong in this folder.

Current repo state:
- The app reads the committed generated output in `../openFallbackVocab.js`.
- `scripts/buildOpenFallbackVocab.js` applies repo-local bucket overrides from `../openFallbackOverrides.json`.
- Large third-party raw dumps are intentionally not committed here right now.

If you regenerate this layer later:
1. Place any raw open-lexicon extracts here.
2. Keep them offline and local-only.
3. Run `npm run build:open-fallback-vocab`.
4. Review the generated `openFallbackVocab.js` diff before shipping.

Design guardrails:
- Handcrafted `BUCKET_VOCAB` remains the source of truth.
- This folder only supports a lower-priority fallback tier.
- `unknown` should stay empty.
