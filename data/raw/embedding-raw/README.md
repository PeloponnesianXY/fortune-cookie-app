Optional raw embedding assets for the semantic fallback build step can live here.

Current repo state:
- Runtime uses the committed generated data in `../semanticFallbackData.js`.
- `scripts/buildSemanticFallback.js` currently builds compact bucket centroids and a pruned
  semantic input dictionary from the open-source `wink-embeddings-sg-100d` package.
- No raw dump is required for the current build path.

Why this folder still exists:
- If you later swap to a different local GloVe / fastText / word2vec source, this is the intended
  staging area.
- Runtime should still ship only compact generated artifacts, never the raw embedding dump.

Guardrails:
- No network downloads at runtime.
- Keep `unknown` out of prototype construction.
- Review generated diffs before committing.
