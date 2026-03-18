# ComfyUI cookie workflow

Goal: generate matching cookie-state assets that can be dropped into the Expo app without changing UI code.

## Recommended workflow

1. Choose one visual direction first.
   - Example: `stylized product illustration`, `storybook cut-out`, or `soft premium bakery render`.
   - Do not switch style keywords between states.

2. Lock camera and framing.
   - Keep the cookie centered.
   - Keep the same three-quarter angle.
   - Keep the same focal length / crop feel.
   - Reuse the same canvas size for every state.

3. Lock lighting.
   - Use one light direction, ideally upper-left.
   - Keep shadow softness consistent.

4. Generate states in this order:
   - closed
   - cracked
   - open halves
   - paper
   - optional shadow

5. Save the exact prompt and seed metadata for each accepted state.
   - If a later state drifts, return to the saved workflow instead of rewriting from scratch.

## Practical ComfyUI setup

- Save one reusable workflow JSON per style direction.
- Keep shared text blocks in the prompt templates under `assets/cookie/prompts/`.
- Reuse:
  - same positive prompt base
  - same negative prompt base
  - same canvas size
  - same sampler family
  - same CFG range
- Change only the state-specific wording for `closed`, `cracked`, or `open`.

## Export guidance

- Preferred output for V1:
  - PNG with transparent background, or
  - PNG on a flat background that is easy to remove cleanly
- Keep state names predictable:
  - `classic-cookie-closed.png`
  - `classic-cookie-cracked.png`
  - `classic-cookie-open.png`
  - `classic-cookie-paper.png`

## Handoff into the repo

Drop generated images into:

- `assets/cookie/generated/closed/`
- `assets/cookie/generated/cracked/`
- `assets/cookie/generated/open/`
- `assets/cookie/generated/paper/`

Then update:

- `assets/cookie/manifests/classic-cookie.json`
- `src/lib/cookieAssets.js`

If you later author motion, export frames into:

- `assets/cookie/frames/classic/`

Then regenerate the frame index with:

```bash
node creative-pipeline/scripts/generate-frame-index.mjs assets/cookie/frames/classic
```
