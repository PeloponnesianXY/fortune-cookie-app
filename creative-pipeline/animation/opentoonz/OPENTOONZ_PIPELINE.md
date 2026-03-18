# OpenToonz pipeline

Use this when you want a short 2D cookie-break authored animation from generated state art.

## Best use here

OpenToonz is a solid fit for:

- 2D cut-out style animation
- light timing polish
- frame-by-frame tweaks to the crack and paper reveal

For this app, numbered PNG frames are the recommended first export format.

## Suggested process

1. Import generated state images as source levels.
   - closed
   - cracked
   - open
   - optional paper

2. Animate a concise beat.
   - small wiggle
   - crack
   - separation
   - paper reveal

3. Keep the total duration short.
   - target 0.8 to 1.2 seconds

4. Export numbered PNG frames.
   - fixed canvas size
   - transparent background if possible
   - consistent naming so the frame-index script can read them

## Lottie note

Do not plan on OpenToonz being a clean one-click Lottie source.

Frame-sequence playback is the safer V1 path for this Expo app. Only pursue Lottie if the animation is truly suited to vector-style export and the handoff format is reliable.
