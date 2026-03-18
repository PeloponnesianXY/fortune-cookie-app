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
