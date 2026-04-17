import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FortuneHomeScreen from './components/home/FortuneHomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <FortuneHomeScreen />
    </SafeAreaProvider>
  );
}
