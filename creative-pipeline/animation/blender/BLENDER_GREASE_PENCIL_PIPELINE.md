# Blender Grease Pencil pipeline

Use this when you want a stylized 0.8 to 1.2 second cookie-break authored animation.

## Best use here

Blender Grease Pencil is a good fit for:

- 2D or cut-out motion
- stylized cookie wiggle and crack timing
- paper reveal staging
- export to numbered PNG frames

For this app, numbered PNG frames are the safest first delivery format.

## Suggested process

1. Import the generated state images.
   - closed cookie
   - cracked cookie
   - open cookie
   - optional paper layer

2. Build a short timing plan.
   - 0.0s to 0.2s: subtle wiggle / anticipation
   - 0.2s to 0.45s: crack event
   - 0.45s to 0.9s: separation and paper reveal

3. Keep the animation simple.
   - tiny wiggle before crack
   - controlled separation, not an explosion
   - paper reveal slightly delayed after crack

4. Export numbered PNG frames.
   - transparent background preferred
   - fixed frame size matching the manifest
   - file names like `classic-cookie-0001.png`

## Lottie note

Do not assume a one-click Blender to Lottie pipeline.

For this app, PNG frame export is the safer and more realistic first handoff. Use Lottie only if the animation is intentionally authored in a format that converts cleanly to vector-based playback.
