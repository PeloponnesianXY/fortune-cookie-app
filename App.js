import React from 'react';
import { Platform } from 'react-native';

import FortuneHomeScreen from './components/FortuneHomeScreen';
import ScreenLab from './components/ScreenLab';

function isScreenLabRoute() {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const currentUrl = new URL(window.location.href);

  return currentUrl.pathname === '/screen-lab'
    || currentUrl.pathname.endsWith('/screen-lab')
    || currentUrl.searchParams.get('screenLab') === '1'
    || currentUrl.hash === '#/screen-lab';
}

export default function App() {
  // Dev-only browser entry point for layout work: open `/screen-lab` locally on Expo web.
  if (isScreenLabRoute()) {
    return <ScreenLab />;
  }

  return <FortuneHomeScreen />;
}
