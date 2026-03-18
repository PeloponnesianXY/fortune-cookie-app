# Fortune Cookie Daily

`Fortune Cookie Daily` is an Expo/React Native app that gives the user one fortune-cookie-style saying per day based on their mood.

This stack is aimed at the cheapest and easiest App Store path from a Windows PC:

- Build the app on Windows
- Test with Expo tooling
- Use Expo cloud builds for iOS
- Submit to the App Store without needing a personal Mac in the normal case

## Current status

The repo contains the app source and Expo configuration, but this machine does not currently have `Node.js` or `npm` installed, so dependencies were not installed here.

## Install prerequisites on Windows

1. Install Node.js LTS:
   - https://nodejs.org/
2. Open a new terminal in this folder.
3. Install dependencies:

```bash
npm install
```

4. Install Expo CLI tools if needed:

```bash
npm install -g eas-cli
```

## Run locally

```bash
npx expo start
```

You can then test with:

- Expo Go on an iPhone for quick checks
- an Android emulator if you have one
- a development build later when needed

## iOS release path without using a Mac

1. Create an Expo account.
2. Enroll in the Apple Developer Program.
3. Log in:

```bash
eas login
```

4. Configure the project:

```bash
eas build:configure
```

5. Build for iOS in the cloud:

```bash
eas build --platform ios
```

6. Submit to App Store Connect:

```bash
eas submit --platform ios
```

Expo can handle a lot of the signing flow, but Apple account setup is still required.

## Suggested next steps

- Install Node.js and run `npm install`
- Set your bundle identifier in `app.json`
- Replace the placeholder app icon and splash assets
- Test the daily fortune behavior on a real phone
- Create App Store listing assets and copy

## Creative asset pipeline for fortune cookie visuals

The app code is now separated from the cookie art pipeline.

- App logic lives in the normal React Native components and utility files.
- Cookie visual packs live under `assets/cookie/`.
- External generation and animation workflow notes live under `creative-pipeline/`.

### Recommended V1 approach

1. Generate matching cookie state images with ComfyUI.
2. Optionally author motion in Blender Grease Pencil or OpenToonz.
3. Export numbered PNG frames.
4. Drop those files into the cookie asset folders.
5. Update the manifest and asset registry.

Frame sequences are the recommended V1 delivery format because they are the safest fit for the current Expo app. Lottie is optional later, but only for animations that are actually suitable for that format.

### Where things go

- Manifests: `assets/cookie/manifests/`
- Generated state images: `assets/cookie/generated/`
- Frame sequences: `assets/cookie/frames/`
- Optional Lottie files: `assets/cookie/lottie/`
- Prompt templates: `assets/cookie/prompts/`
- ComfyUI notes and exports: `creative-pipeline/comfyui/`
- Animation handoff notes: `creative-pipeline/animation/`
- Helper scripts: `creative-pipeline/scripts/`

### Runtime integration

The app reads cookie packs through:

- `src/lib/cookieAssets.js`
- `src/lib/cookiePlayback.js`
- `src/components/FortuneCookie/FortuneCookieAnimation.js`

If a pack is incomplete, the app falls back to static-state playback instead of crashing.

### Useful commands

```bash
npm run cookie:validate
npm run cookie:frame-index
npm run cookie:normalize
npm run cookie:contact-sheet
```
