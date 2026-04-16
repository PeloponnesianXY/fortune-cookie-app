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
    pathname === '/semantic-lab'
    || search.includes('semanticLab=1')
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
