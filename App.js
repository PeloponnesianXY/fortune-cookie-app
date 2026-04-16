import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FortuneHomeScreen from './components/FortuneHomeScreen';

function isSemanticLabRoute() {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const { hash, pathname, search } = window.location;
  const normalizedPathname = pathname.replace(/\/+$/, '');
  const normalizedHash = hash.replace(/\/+$/, '');
  return (
    normalizedPathname === '/semantic-lab'
    || normalizedPathname === '/lab'
    || search.includes('semanticLab=1')
    || normalizedHash === '#/semantic-lab'
    || normalizedHash === '#/lab'
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
