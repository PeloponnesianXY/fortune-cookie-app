import React, { useState } from 'react';
import {
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
  const [isCookieOpened, setIsCookieOpened] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;

  function runCookieAnimation(selection) {
    setFortuneText(selection.fortuneText);
    setAnalysisSummary(selection.analysis);
    setSceneKey(selection.sceneKey);
    setIsAnimating(true);
    setIsCookieOpened(true);
    setAnimationKey((current) => current + 1);
  }

  function handleAnimationComplete() {
    setIsAnimating(false);

    if (analysisSummary?.source === 'blocked-hate') {
      setStatusMessage('Try naming your mood without targeting a group of people.');
      return;
    }

    setStatusMessage((currentMessage) => (
      currentMessage.includes('Saved for today') || currentMessage.includes('Same day')
        ? currentMessage
        : 'Saved for today. That mood will pull this fortune until tomorrow.'
    ));
  }

  async function openFortune() {
    if (isAnimating) {
      return;
    }

    const selection = await getDailyFortuneSelection(moodInput);
    if (selection.moderation === 'blocked-hate') {
      setStatusMessage('Try naming your mood without targeting a group of people.');
    } else if (selection.fromCache) {
      setStatusMessage('Same day, same mood, same fortune.');
    } else {
      setStatusMessage('Saved for today. That mood will pull this fortune until tomorrow.');
    }
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
        isOpened={isCookieOpened}
        animationKey={animationKey}
        moodInput={moodInput}
        onMoodChange={setMoodInput}
        onOpenFortune={openFortune}
        onAnimationComplete={handleAnimationComplete}
        packId="classic-cookie"
        reducedMotion={false}
        scene={scene}
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
