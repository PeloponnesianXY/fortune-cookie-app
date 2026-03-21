import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Asset } from 'expo-asset';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import FortuneCard from './components/FortuneCard';
import { SCENE_LIBRARY } from './data/scenes';
import { getDailyFortuneSelection, getDefaultSceneKey } from './utils/fortuneLogic';

const COOKIE_CLOSED_IMAGE = require('./assets/cookie/closed.png');
const COOKIE_OPEN_IMAGE = require('./assets/cookie/open.png');

const COOKIE_TIMINGS = {
  shell: 1000,
  paperDelay: 140,
  paperStart: 140,
  paperDuration: 280,
};

const REVEAL_PHASE = {
  IDLE: 'idle',
  OPENING: 'opening',
  OPENED: 'opened',
};

export default function App() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [sceneKey, setSceneKey] = useState(getDefaultSceneKey());
  const [revealPhase, setRevealPhase] = useState(REVEAL_PHASE.IDLE);
  const [assetsReady, setAssetsReady] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const paperRevealTimer = useRef(null);

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;
  const isAnimating = revealPhase === REVEAL_PHASE.OPENING;
  const isCookieOpened = revealPhase !== REVEAL_PHASE.IDLE;
  const isPaperVisible = revealPhase === REVEAL_PHASE.OPENED;

  function clearPaperRevealTimer() {
    if (paperRevealTimer.current) {
      clearTimeout(paperRevealTimer.current);
      paperRevealTimer.current = null;
    }
  }

  useEffect(() => () => {
    clearPaperRevealTimer();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function preloadAssets() {
      try {
        await Asset.loadAsync([COOKIE_CLOSED_IMAGE, COOKIE_OPEN_IMAGE]);
      } finally {
        if (isMounted) {
          setAssetsReady(true);
        }
      }
    }

    preloadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateStatusMessage(selection) {
    void selection;
  }

  function runCookieAnimation(selection) {
    setFortuneText(selection.fortuneText);
    setAnalysisSummary(selection.analysis);
    setSceneKey(selection.sceneKey);
    setRevealPhase(REVEAL_PHASE.IDLE);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
    clearPaperRevealTimer();

    setRevealPhase(REVEAL_PHASE.OPENING);
    paperRevealTimer.current = setTimeout(() => {
      setRevealPhase(REVEAL_PHASE.OPENED);
      paperRevealTimer.current = null;
    }, COOKIE_TIMINGS.paperDelay);

    Animated.parallel([
      Animated.timing(shellProgress, {
        toValue: 1,
        duration: COOKIE_TIMINGS.shell,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(COOKIE_TIMINGS.paperStart),
        Animated.timing(paperProgress, {
          toValue: 1,
          duration: COOKIE_TIMINGS.paperDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setRevealPhase(REVEAL_PHASE.OPENED);
      updateStatusMessage(selection);
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
    <View style={[styles.appRoot, { backgroundColor: scene.sky }]}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: scene.sky }]} />
      <ExpoStatusBar style={scene.statusBar} />
      <StatusBar barStyle={scene.statusBar === 'light' ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={styles.safeArea}>
        {assetsReady ? (
          <FortuneCard
            analysisSummary={analysisSummary}
            fortuneText={fortuneText}
            isAnimating={isAnimating}
            isCookieOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            moodInput={moodInput}
            onMoodChange={setMoodInput}
            onOpenFortune={openFortune}
            paperProgress={paperProgress}
            scene={scene}
            shellProgress={shellProgress}
          />
        ) : (
          <View style={styles.loadingScreen} />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingScreen: {
    flex: 1,
  },
});
