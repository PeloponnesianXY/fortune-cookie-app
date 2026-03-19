import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import FortuneCard from './components/FortuneCard';
import { SCENE_LIBRARY } from './data/scenes';
import { getDailyFortuneSelection, getDefaultSceneKey } from './utils/fortuneLogic';

export default function App() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [sceneKey, setSceneKey] = useState(getDefaultSceneKey());
  const [statusMessage, setStatusMessage] = useState(
    'Daily mode: the same mood gets the same fortune for the rest of the day.'
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;

  function runCookieAnimation(selection) {
    setFortuneText(selection.fortuneText);
    setAnalysisSummary(selection.analysis);
    setSceneKey(selection.sceneKey);
    setIsAnimating(true);
    shellProgress.setValue(0);
    paperProgress.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(shellProgress, {
          toValue: 1,
          duration: 1260,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(620),
          Animated.timing(paperProgress, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      setIsAnimating(false);

      if (selection.moderation === 'blocked-hate') {
        setStatusMessage('Try naming your mood without targeting a group of people.');
        return;
      }

      setStatusMessage(
        selection.fromCache
          ? 'Same day, same mood, same fortune.'
          : 'Saved for today. That mood will pull this fortune until tomorrow.'
      );
    });
  }

  async function openFortune() {
    if (isAnimating) {
      return;
    }

    const selection = await getDailyFortuneSelection(moodInput);
    runCookieAnimation(selection);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: scene.sky }]}>
      <ExpoStatusBar style={scene.statusBar} />
      <StatusBar barStyle={scene.statusBar === 'light' ? 'light-content' : 'dark-content'} />

      <FortuneCard
        analysisSummary={analysisSummary}
        fortuneText={fortuneText}
        isAnimating={isAnimating}
        moodInput={moodInput}
        onMoodChange={setMoodInput}
        onOpenFortune={openFortune}
        paperProgress={paperProgress}
        scene={scene}
        shellProgress={shellProgress}
        statusMessage={statusMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
