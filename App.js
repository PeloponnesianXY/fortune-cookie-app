import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DevWebLabs from './components/DevWebLabs';
import FortuneHomeScreen from './components/FortuneHomeScreen';

function getDevWebLabRoute() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return null;
  }

  const { hash, pathname, search } = window.location;
  const normalizedPathname = pathname.replace(/\/+$/, '');
  const normalizedHash = hash.replace(/\/+$/, '');

  if (
    normalizedPathname === '/semantic-lab'
    || normalizedPathname === '/lab'
    || search.includes('semanticLab=1')
    || normalizedHash === '#/semantic-lab'
    || normalizedHash === '#/lab'
  ) {
    return 'semantic';
  }

  if (
    normalizedPathname === '/screen-lab'
    || search.includes('screenLab=1')
    || normalizedHash === '#/screen-lab'
  ) {
    return 'screen';
  }

  if (
    normalizedPathname === '/fortune-lab'
    || search.includes('fortuneLab=1')
    || normalizedHash === '#/fortune-lab'
  ) {
    return 'fortune';
  }

  if (
    normalizedPathname === '/classic-fortune-lab'
    || search.includes('classicFortuneLab=1')
    || normalizedHash === '#/classic-fortune-lab'
  ) {
    return 'classic-fortune';
  }

  return null;
}

export default function App() {
  const devLabRoute = getDevWebLabRoute();
  let rootContent = <FortuneHomeScreen />;

  if (devLabRoute) {
    rootContent = <DevWebLabs route={devLabRoute} />;
  }

  return (
    <SafeAreaProvider>
      {rootContent}
    </SafeAreaProvider>
  );
}
