import React from 'react';
import { Platform } from 'react-native';

import FortuneHomeScreen from './components/FortuneHomeScreen';
import MoodLab from './components/MoodLab';
import ScreenLab from './components/ScreenLab';

function matchesDevRoute(routeName) {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const currentUrl = new URL(window.location.href);
  const routePath = `/${routeName}`;
  const routeParam = `${routeName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;

  return currentUrl.pathname === routePath
    || currentUrl.pathname.endsWith(routePath)
    || currentUrl.searchParams.get(routeParam) === '1'
    || currentUrl.hash === `#${routePath}`;
}

export default function App() {
  // Dev-only browser entry point for layout work: open `/screen-lab` locally on Expo web.
  if (matchesDevRoute('screen-lab')) {
    return <ScreenLab />;
  }

  // Dev-only browser entry point for mood mapping inspection: open `/mood-lab` locally on Expo web.
  if (matchesDevRoute('mood-lab')) {
    return <MoodLab />;
  }

  return <FortuneHomeScreen />;
}
