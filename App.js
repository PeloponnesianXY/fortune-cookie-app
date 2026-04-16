import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FortuneHomeScreen from './components/FortuneHomeScreen';

function isSemanticLabRoute() {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const { hash, pathname, search } = window.location;
  return (
    pathname === '/mood-lab'
    || pathname === '/semantic-lab'
    || search.includes('moodLab=1')
    || search.includes('semanticLab=1')
    || hash === '#/mood-lab'
    || hash === '#/semantic-lab'
  );
}

export default function App() {
  const rootContent = isSemanticLabRoute()
    ? React.createElement(require('./components/MoodLab').default)
    : <FortuneHomeScreen />;

  return (
    <SafeAreaProvider>
      {rootContent}
    </SafeAreaProvider>
  );
}
