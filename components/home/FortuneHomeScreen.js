import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  Animated,
  Easing,
  Keyboard,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Asset } from 'expo-asset';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import FortuneHomeContent from './FortuneHomeContent';
import { PreviewSafeAreaView } from '../preview/PreviewLayoutContext';
import SafetyLockScreen from './SafetyLockScreen';
import { SCENE_LIBRARY } from '../../data/scenes/scenes';
import { syncAppBadgeAsync } from '../../utils/appBadge';
import {
  clearAllStoredFortuneState,
  getDailyFortuneSelection,
  getDefaultSceneKey,
  getReplacementFortuneSelection,
  getStoredFortuneDayState,
  isHighRiskMoodInput,
} from '../../utils/fortuneLogic';
import {
  collapseFortuneRuns,
  createSavedFortuneRecord,
  getSavedFortunesSnapshot,
  saveFortuneToFavorites,
  saveFortuneToHistory,
  toggleFavoriteFortune,
} from '../../utils/savedFortunes';
import {
  getStoredStreak,
  registerDailyStreak,
} from '../../utils/streaks';

const COOKIE_CLOSED_IMAGE = require('../../assets/cookie/closed-2.png');
const COOKIE_OPEN_IMAGE = require('../../assets/cookie/open-final.png');

const COOKIE_TIMINGS = {
  shell: 1320,
  paperDelay: 0,
  paperStart: 0,
  paperDuration: 460,
};

const REVEAL_PHASE = {
  IDLE: 'idle',
  OPENING: 'opening',
  OPENED: 'opened',
};

const COOKIE_SHELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
};

function isResetFortuneCommand(input) {
  return /^\s*reset\s*$/i.test(input);
}

function normalizeMoodInput(input) {
  const normalized = input.replace(/\s+/g, ' ').trimStart();

  if (!normalized) {
    return '';
  }

  const [firstWord = ''] = normalized.split(' ');
  return firstWord;
}

function getDailyWisdomLockSeconds(fortuneCount) {
  if (fortuneCount < 3) {
    return 0;
  }

  return Math.min(2 ** (fortuneCount - 1), 64);
}

const STREAK_TIERS = [
  { minDays: 1, title: 'Crumb Collector' },
  { minDays: 5, title: 'Cookie Regular' },
  { minDays: 10, title: 'Fortune Chaser' },
  { minDays: 20, title: 'Snack Prophet' },
  { minDays: 50, title: 'Cookie Master' },
  { minDays: 100, title: 'Oracle of Crumbs' },
  { minDays: 1000, title: 'Cookie Emperor' },
];

function getStreakTierTitle(streakCount) {
  for (let i = STREAK_TIERS.length - 1; i >= 0; i -= 1) {
    if (streakCount >= STREAK_TIERS[i].minDays) {
      return STREAK_TIERS[i].title;
    }
  }

  return null;
}

function getNextStreakTier(streakCount) {
  for (const tier of STREAK_TIERS) {
    if (streakCount < tier.minDays) {
      return tier;
    }
  }

  return null;
}

export default function FortuneHomeScreen() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [storedDayState, setStoredDayState] = useState(null);
  const [sessionFortuneCount, setSessionFortuneCount] = useState(0);
  const [currentFortuneRecord, setCurrentFortuneRecord] = useState(null);
  const [historyFortunes, setHistoryFortunes] = useState([]);
  const [favoriteFortunes, setFavoriteFortunes] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [sceneKey, setSceneKey] = useState(getDefaultSceneKey());
  const [revealPhase, setRevealPhase] = useState(REVEAL_PHASE.IDLE);
  const [cookieShellState, setCookieShellState] = useState(COOKIE_SHELL_STATE.CLOSED);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isSafetyLocked, setIsSafetyLocked] = useState(false);
  const [isHydratingSelection, setIsHydratingSelection] = useState(true);
  const [isPreparingNextFortune, setIsPreparingNextFortune] = useState(false);
  const [hasUsedReplacement, setHasUsedReplacement] = useState(false);
  const [currentFortuneContext, setCurrentFortuneContext] = useState(null);
  const [dailyWisdomNotice, setDailyWisdomNotice] = useState(null);
  const [streakCelebrationToken, setStreakCelebrationToken] = useState(0);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const paperRevealTimer = useRef(null);
  const isOpeningRef = useRef(false);
  const replacementAttemptRef = useRef(0);
  const revealSessionRef = useRef(0);

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.sunlitAir;
  const isAnimating = revealPhase === REVEAL_PHASE.OPENING;
  const isResetCommandActive = isResetFortuneCommand(moodInput);
  const hasActionableInput = Boolean(moodInput.trim());
  const isCookieOpened = cookieShellState === COOKIE_SHELL_STATE.OPEN;
  const isPaperVisible = isCookieOpened && revealPhase !== REVEAL_PHASE.IDLE;
  const collapsedHistoryFortunes = useMemo(() => collapseFortuneRuns(historyFortunes, 10), [historyFortunes]);
  const isCurrentFortuneFavorite = Boolean(
    currentFortuneRecord
    && favoriteFortunes.some((favorite) => favorite.id === currentFortuneRecord.id)
  );
  const streakTierTitle = getStreakTierTitle(streakCount);
  const nextStreakTier = getNextStreakTier(streakCount);
  const daysToNextStreakTier = nextStreakTier
    ? Math.max(nextStreakTier.minDays - streakCount, 0)
    : 0;
  const canReplaceCurrentFortune = Boolean(
    currentFortuneRecord
    && isPaperVisible
    && !hasUsedReplacement
    && !isAnimating
  );
  const dailyWisdomLockSeconds = dailyWisdomNotice?.seconds || 0;
  const dailyWisdomMessage = dailyWisdomNotice?.message || null;

  function clearPaperRevealTimer() {
    if (paperRevealTimer.current) {
      clearTimeout(paperRevealTimer.current);
      paperRevealTimer.current = null;
    }
  }

  function resetCookiePresentation() {
    revealSessionRef.current += 1;
    clearPaperRevealTimer();
    shellProgress.stopAnimation();
    paperProgress.stopAnimation();
    setFortuneText('');
    setCurrentFortuneRecord(null);
    setSceneKey(getDefaultSceneKey());
    setCookieShellState(COOKIE_SHELL_STATE.CLOSED);
    setRevealPhase(REVEAL_PHASE.IDLE);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
  }

  async function resetTodayFortune() {
    Keyboard.dismiss();
    await clearAllStoredFortuneState();
    setStoredDayState(null);
    setSessionFortuneCount(0);
    setDailyWisdomNotice(null);
    setIsPreparingNextFortune(false);
    setHasUsedReplacement(false);
    setCurrentFortuneContext(null);
    replacementAttemptRef.current = 0;
    setMoodInput('');
    resetCookiePresentation();
  }

  function beginFortuneSession(sessionContext) {
    setCurrentFortuneContext(sessionContext);
    setHasUsedReplacement(false);
    replacementAttemptRef.current = 0;
  }

  function applySavedFortunesSnapshot(snapshot) {
    setHistoryFortunes(snapshot.history);
    setFavoriteFortunes(snapshot.favorites);
  }

  async function handleFortuneRevealed(record) {
    const snapshot = await saveFortuneToHistory(record);
    applySavedFortunesSnapshot(snapshot);
  }

  async function handleToggleFavorite() {
    if (!currentFortuneRecord) {
      return;
    }

    const snapshot = await toggleFavoriteFortune(currentFortuneRecord);
    const updatedFavorite = snapshot.favorites.find((favorite) => favorite.id === currentFortuneRecord.id);
    applySavedFortunesSnapshot(snapshot);
    setCurrentFortuneRecord((currentRecord) => (
      currentRecord
        ? {
            ...currentRecord,
            isFavorite: snapshot.isFavorite,
            favoritedAt: updatedFavorite?.favoritedAt || null,
          }
        : currentRecord
    ));
  }

  async function handleRemoveFavorite(record) {
    const snapshot = await toggleFavoriteFortune(record);
    applySavedFortunesSnapshot(snapshot);
    setCurrentFortuneRecord((currentRecord) => (
      currentRecord?.id === record.id
        ? {
            ...currentRecord,
            isFavorite: false,
            favoritedAt: null,
          }
        : currentRecord
    ));
  }

  async function handleToggleSavedFavorite(record) {
    const snapshot = await toggleFavoriteFortune(record);
    applySavedFortunesSnapshot(snapshot);
    const updatedFavorite = snapshot.favorites.find((favorite) => favorite.id === record.id);
    setCurrentFortuneRecord((currentRecord) => (
      currentRecord?.id === record.id
        ? {
            ...currentRecord,
            isFavorite: snapshot.isFavorite,
            favoritedAt: updatedFavorite?.favoritedAt || null,
          }
        : currentRecord
    ));
  }

  async function handleSaveCreatedFortuneFavorite(record) {
    const snapshot = await saveFortuneToFavorites(record);
    applySavedFortunesSnapshot(snapshot);
  }

  async function handleShareFortune() {
    if (!currentFortuneRecord?.text) {
      return;
    }

    await Share.share({
      message: `My fortune from Fortune Cookie for Your Mood: ${currentFortuneRecord.text}`,
    });
  }

  async function handleShareSavedFortune(record) {
    if (!record?.text) {
      return;
    }

    await Share.share({
      message: `My fortune from Fortune Cookie for Your Mood: ${record.text}`,
    });
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

  useEffect(() => {
    let isMounted = true;

    async function hydrateAppState() {
      try {
        const [snapshot, storedSelection, storedStreak] = await Promise.all([
          getSavedFortunesSnapshot(),
          getStoredFortuneDayState(),
          getStoredStreak(),
        ]);

        if (!isMounted) {
          return;
        }

        applySavedFortunesSnapshot(snapshot);
        setStreakCount(storedStreak.count);
        setStoredDayState(storedSelection);
        setSessionFortuneCount(0);
        setDailyWisdomNotice(null);
        resetCookiePresentation();
      } finally {
        if (isMounted) {
          setIsHydratingSelection(false);
        }
      }
    }

    hydrateAppState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isHydratingSelection) {
      return undefined;
    }

    let isMounted = true;

    async function syncBadge() {
      try {
        await syncAppBadgeAsync(Boolean(storedDayState));
      } catch {
        // Badge sync should never block or crash the core fortune flow.
      }
    }

    if (isMounted) {
      syncBadge();
    }

    return () => {
      isMounted = false;
    };
  }, [isHydratingSelection, storedDayState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      (async () => {
        const [refreshedSelection, storedStreak] = await Promise.all([
          getStoredFortuneDayState(),
          getStoredStreak(),
        ]);

        setStreakCount(storedStreak.count);
        setStoredDayState(refreshedSelection);
        setDailyWisdomNotice(null);
      })();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  function runCookieAnimation(selection, onReveal) {
    const revealSessionId = revealSessionRef.current + 1;
    revealSessionRef.current = revealSessionId;
    let didReveal = false;

    function revealOnce() {
      if (didReveal || revealSessionRef.current !== revealSessionId) {
        return;
      }

      didReveal = true;
      setRevealPhase(REVEAL_PHASE.OPENED);

      if (onReveal) {
        onReveal();
      }
    }

    setFortuneText(selection.fortuneText);
    setSceneKey(selection.sceneKey);
    setCookieShellState(COOKIE_SHELL_STATE.CLOSED);
    setRevealPhase(REVEAL_PHASE.IDLE);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
    clearPaperRevealTimer();

    setCookieShellState(COOKIE_SHELL_STATE.OPEN);
    setRevealPhase(REVEAL_PHASE.OPENING);
    paperRevealTimer.current = setTimeout(() => {
      revealOnce();
      paperRevealTimer.current = null;
    }, COOKIE_TIMINGS.paperDelay);

    Animated.parallel([
      Animated.timing(shellProgress, {
        toValue: 1,
        duration: COOKIE_TIMINGS.shell,
        easing: Easing.out(Easing.cubic),
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
    ]).start(({ finished }) => {
      if (!finished || revealSessionRef.current !== revealSessionId) {
        return;
      }

      revealOnce();
    });
  }

  async function openFortune() {
    if (
      isSafetyLocked
      || isAnimating
      || isOpeningRef.current
      || isHydratingSelection
    ) {
      return;
    }

    if (isHighRiskMoodInput(moodInput)) {
      Keyboard.dismiss();
      clearPaperRevealTimer();
      setCurrentFortuneContext(null);
      setIsSafetyLocked(true);
      return;
    }

    if (isResetCommandActive) {
      isOpeningRef.current = true;

      try {
        await resetTodayFortune();
      } finally {
        isOpeningRef.current = false;
      }

      return;
    }

    if (!hasActionableInput) {
      return;
    }

    isOpeningRef.current = true;

    try {
      setIsPreparingNextFortune(true);
      const sessionMood = moodInput;
      const selection = await getDailyFortuneSelection(sessionMood);
      const nextFortuneCount = sessionFortuneCount + 1;
      const savedFortuneRecord = createSavedFortuneRecord(selection, sessionMood);
      beginFortuneSession({
        mood: sessionMood || selection.inputMood || selection.analysis?.primaryEmotion || '',
      });
      setStoredDayState(selection);

      const streakSnapshot = await registerDailyStreak(selection.dayKey);
      const previousTierTitle = getStreakTierTitle(streakCount);
      const nextTierTitle = getStreakTierTitle(streakSnapshot.count);
      setStreakCount(streakSnapshot.count);
      if (
        streakSnapshot.didAdvance
        && nextTierTitle
        && nextTierTitle !== previousTierTitle
      ) {
        setStreakCelebrationToken(Date.now());
      }
      setSessionFortuneCount(nextFortuneCount);
      const nextLockSeconds = getDailyWisdomLockSeconds(nextFortuneCount);
      setDailyWisdomNotice(
        nextLockSeconds > 0
          ? {
              id: Date.now(),
              seconds: nextLockSeconds,
              message: `The cookie is getting tired. It will now rest for ${nextLockSeconds} seconds`,
            }
          : null
      );

      setCurrentFortuneRecord(savedFortuneRecord);
      runCookieAnimation(selection, () => {
        setIsPreparingNextFortune(false);
        handleFortuneRevealed(savedFortuneRecord);
      });
    } finally {
      isOpeningRef.current = false;
    }
  }

  async function submitMoodInput() {
    if (isSafetyLocked || isOpeningRef.current || isHydratingSelection) {
      return;
    }

    if (!hasActionableInput) {
      return;
    }

    Keyboard.dismiss();
    await openFortune();
  }

  function handleBeginMoodEntry() {
    setMoodInput('');
    setDailyWisdomNotice(null);
    setIsPreparingNextFortune(true);
    setCurrentFortuneContext(null);
    setHasUsedReplacement(false);
    resetCookiePresentation();
  }

  function handleRequestReplace() {
    if (!canReplaceCurrentFortune) {
      return;
    }

    handleConfirmReplace();
  }

  async function handleConfirmReplace() {
    if (
      !currentFortuneRecord
      || !currentFortuneContext
      || hasUsedReplacement
      || isAnimating
      || isOpeningRef.current
      || isHydratingSelection
    ) {
      return;
    }

    isOpeningRef.current = true;

    try {
      Keyboard.dismiss();
      const replacementMood = currentFortuneContext.mood
        || currentFortuneRecord.mood
        || currentFortuneRecord.category
        || '';
      const replacementSelection = await getReplacementFortuneSelection(replacementMood, {
        replacementKey: replacementAttemptRef.current += 1,
        excludeFortuneText: currentFortuneRecord.text,
      });
      const replacementRecord = createSavedFortuneRecord(replacementSelection, replacementMood);

      setStoredDayState(replacementSelection);
      setDailyWisdomNotice(null);
      setHasUsedReplacement(true);
      setCurrentFortuneRecord(replacementRecord);
      runCookieAnimation(replacementSelection, () => {
        handleFortuneRevealed(replacementRecord);
      });
    } finally {
      isOpeningRef.current = false;
    }
  }

  return (
    <View style={[styles.appRoot, { backgroundColor: scene.sky }]}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: scene.sky }]} />
      <ExpoStatusBar style={isSafetyLocked ? 'dark' : scene.statusBar} />
      <StatusBar barStyle={isSafetyLocked || scene.statusBar !== 'light' ? 'dark-content' : 'light-content'} />

      {isSafetyLocked ? (
        <SafetyLockScreen />
      ) : (
        <PreviewSafeAreaView style={styles.safeArea}>
          {assetsReady ? (
            <FortuneHomeContent
              canReplaceCurrentFortune={canReplaceCurrentFortune}
              currentFortuneIsFavorite={isCurrentFortuneFavorite}
              dailyWisdomLockSeconds={dailyWisdomLockSeconds}
              dailyWisdomMessage={dailyWisdomMessage}
              dailyWisdomNoticeToken={dailyWisdomNotice?.id || 0}
              favoriteFortunes={favoriteFortunes}
              fortuneText={fortuneText}
              forcedActionTrayVisible={undefined}
              forcedDrawerOpen={undefined}
              historyFortunes={collapsedHistoryFortunes}
              isAnimating={isAnimating}
              isCookieOpened={isCookieOpened}
              isHydratingSelection={isHydratingSelection}
              isPaperVisible={isPaperVisible}
              isPreparingNextFortune={isPreparingNextFortune}
              moodInput={moodInput}
              onBeginMoodEntry={handleBeginMoodEntry}
              onMoodChange={(nextValue) => setMoodInput(normalizeMoodInput(nextValue))}
              onRemoveFavorite={handleRemoveFavorite}
              onRequestReplace={handleRequestReplace}
              onShareSavedFortune={handleShareSavedFortune}
              onShareFortune={handleShareFortune}
              onSaveCreatedFortuneFavorite={handleSaveCreatedFortuneFavorite}
              onSubmitMoodInput={submitMoodInput}
              onTriggerSafetyLock={() => setIsSafetyLocked(true)}
              onToggleSavedFavorite={handleToggleSavedFavorite}
              onToggleFavorite={handleToggleFavorite}
              paperProgress={paperProgress}
              scene={scene}
              shellProgress={shellProgress}
              streakCelebrationToken={streakCelebrationToken}
              streakCount={streakCount}
              streakDaysToNextTier={daysToNextStreakTier}
              streakNextTierTitle={nextStreakTier?.title || null}
              streakTierTitle={streakTierTitle}
            />
          ) : (
            <View style={styles.loadingScreen} />
          )}
        </PreviewSafeAreaView>
      )}
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
