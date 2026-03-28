import React, { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Animated,
  Easing,
  Keyboard,
  SafeAreaView,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Asset } from 'expo-asset';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import FortuneCard from './components/FortuneCard';
import SafetyLockScreen from './components/SafetyLockScreen';
import { SCENE_LIBRARY } from './data/scenes';
import { syncAppBadgeAsync } from './utils/appBadge';
import {
  clearAllStoredFortuneState,
  getDailyFortuneSelection,
  getDefaultSceneKey,
  getOverrideFortuneSelection,
  getReplacementFortuneSelection,
  getStoredDailyFortuneSelection,
} from './utils/fortuneLogic';
import {
  collapseFortuneRuns,
  createSavedFortuneRecord,
  getSavedFortunesSnapshot,
  saveFortuneToHistory,
  toggleFavoriteFortune,
} from './utils/savedFortunes';
import {
  getStoredStreak,
  registerDailyStreak,
} from './utils/streaks';

const COOKIE_CLOSED_IMAGE = require('./assets/cookie/closed-2.png');
const COOKIE_OPEN_IMAGE = require('./assets/cookie/open.png');

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

const HIGH_RISK_WORDS = new Set([
  'suicide',
  'suicidal',
  'selfharm',
  'unalive',
  'kms',
  'killmyself',
  'overdose',
  'murder',
  'murderous',
  'homicide',
  'homicidal',
  'kill',
  'killing',
  'stab',
  'stabbing',
  'shoot',
  'shooting',
  'massacre',
]);

function parseOverrideCommand(input) {
  const match = input.match(/^\s*override\b(.*)$/i);

  if (!match) {
    return {
      isOverride: false,
      mood: input,
    };
  }

  return {
    isOverride: true,
    mood: match[1].trim(),
  };
}

function isResetFortuneCommand(input) {
  return /^\s*reset\s*$/i.test(input);
}

function normalizeMoodInput(input) {
  const normalized = input.replace(/\s+/g, ' ').trimStart();

  if (!normalized) {
    return '';
  }

  const overrideMatch = normalized.match(/^override(?:\s+([^\s]+)?)?/i);
  if (overrideMatch) {
    const overrideMood = overrideMatch[1] || '';
    return overrideMood ? `override ${overrideMood}` : 'override';
  }

  const [firstWord = ''] = normalized.split(' ');
  return firstWord;
}

function normalizeHighRiskInput(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '');
}

function isHighRiskMoodInput(input) {
  return HIGH_RISK_WORDS.has(normalizeHighRiskInput(input));
}

function getDailyFortuneCount(selection) {
  return Math.max(selection?.dailyFortuneCount || 0, 0);
}

export default function App() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [storedTodaySelection, setStoredTodaySelection] = useState(null);
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
  const [isOverrideLoopActive, setIsOverrideLoopActive] = useState(false);
  const [isShowingOverrideFortune, setIsShowingOverrideFortune] = useState(false);
  const [hasUsedReplacement, setHasUsedReplacement] = useState(false);
  const [isReplaceConfirmVisible, setIsReplaceConfirmVisible] = useState(false);
  const [currentFortuneContext, setCurrentFortuneContext] = useState(null);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const paperRevealTimer = useRef(null);
  const isOpeningRef = useRef(false);
  const overrideAttemptRef = useRef(0);
  const replacementAttemptRef = useRef(0);
  const revealSessionRef = useRef(0);

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;
  const isAnimating = revealPhase === REVEAL_PHASE.OPENING;
  const overrideCommand = parseOverrideCommand(moodInput);
  const isResetCommandActive = isResetFortuneCommand(moodInput);
  const isOverrideInputActive = overrideCommand.isOverride;
  const hasActionableInput = Boolean(moodInput.trim());
  const dailyFortuneCount = getDailyFortuneCount(storedTodaySelection);
  const isCookieOpened = cookieShellState === COOKIE_SHELL_STATE.OPEN;
  const isPaperVisible = isCookieOpened && revealPhase !== REVEAL_PHASE.IDLE;
  const collapsedHistoryFortunes = collapseFortuneRuns(historyFortunes, 10);
  const isCurrentFortuneFavorite = Boolean(
    currentFortuneRecord
    && favoriteFortunes.some((favorite) => favorite.id === currentFortuneRecord.id)
  );
  const streakLabel = streakCount === 1 ? '1-day streak' : streakCount > 1 ? `${streakCount}-day streak` : 'Start a streak';
  const canReplaceCurrentFortune = Boolean(
    currentFortuneRecord
    && isPaperVisible
    && !hasUsedReplacement
    && !isAnimating
  );
  const isCookieInteractionDisabled = (
    isHydratingSelection
    || (!hasActionableInput && !isShowingOverrideFortune && !isOverrideLoopActive)
  );
  const dailyWisdomMessage = dailyFortuneCount >= 3
    ? 'A cookie can only offer so much wisdom in a day. The next ones will arrive a little more slowly.'
    : null;

  async function resetTodayFortune() {
    Keyboard.dismiss();
    await clearAllStoredFortuneState();
    setStoredTodaySelection(null);
    setIsShowingOverrideFortune(false);
    setIsOverrideLoopActive(false);
    setIsPreparingNextFortune(false);
    setHasUsedReplacement(false);
    setIsReplaceConfirmVisible(false);
    setCurrentFortuneContext(null);
    overrideAttemptRef.current = 0;
    replacementAttemptRef.current = 0;
    setMoodInput('');
    resetCookiePresentation();
  }

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

  function beginFortuneSession(sessionContext) {
    setCurrentFortuneContext(sessionContext);
    setHasUsedReplacement(false);
    setIsReplaceConfirmVisible(false);
    replacementAttemptRef.current = 0;
  }

  function showSelection(selection, record) {
    setFortuneText(selection.fortuneText);
    setCurrentFortuneRecord(record || createSavedFortuneRecord(selection, selection.inputMood || ''));
    setSceneKey(selection.sceneKey || getDefaultSceneKey());
    setCookieShellState(COOKIE_SHELL_STATE.OPEN);
    setRevealPhase(REVEAL_PHASE.OPENED);
    shellProgress.setValue(1);
    paperProgress.setValue(1);
  }

  function presentStoredSelection(selection) {
    beginFortuneSession({
      mood: selection.inputMood || selection.analysis?.primaryEmotion || '',
      isOverride: false,
    });
    showSelection(
      selection,
      createSavedFortuneRecord(selection, selection.inputMood || '')
    );
  }

  function exitOverrideLoop() {
    setIsShowingOverrideFortune(false);
    setIsOverrideLoopActive(false);
    setHasUsedReplacement(false);
    setIsReplaceConfirmVisible(false);
    setCurrentFortuneContext(null);
    replacementAttemptRef.current = 0;
    resetCookiePresentation();
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
          getStoredDailyFortuneSelection(),
          getStoredStreak(),
        ]);

        if (!isMounted) {
          return;
        }

        applySavedFortunesSnapshot(snapshot);
        setStreakCount(storedStreak.count);

        if (storedSelection) {
          setStoredTodaySelection(storedSelection);
          presentStoredSelection(storedSelection);
        } else {
          resetCookiePresentation();
        }
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
    if (
      storedTodaySelection
      && !isPreparingNextFortune
      && !isShowingOverrideFortune
      && !isOverrideInputActive
      && currentFortuneRecord?.id !== storedTodaySelection.id
    ) {
      presentStoredSelection(storedTodaySelection);
    }
  }, [currentFortuneRecord?.id, isOverrideInputActive, isPreparingNextFortune, isShowingOverrideFortune, storedTodaySelection]);

  useEffect(() => {
    if (isHydratingSelection) {
      return undefined;
    }

    let isMounted = true;

    async function syncBadge() {
      await syncAppBadgeAsync(Boolean(storedTodaySelection));
    }

    if (isMounted) {
      syncBadge();
    }

    return () => {
      isMounted = false;
    };
  }, [isHydratingSelection, storedTodaySelection]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      (async () => {
        const [refreshedSelection, storedStreak] = await Promise.all([
          getStoredDailyFortuneSelection(),
          getStoredStreak(),
        ]);

        setStreakCount(storedStreak.count);
        setStoredTodaySelection(refreshedSelection);

        if (refreshedSelection) {
          if (!isPreparingNextFortune && !isShowingOverrideFortune && !isOverrideInputActive) {
            presentStoredSelection(refreshedSelection);
          }
          return;
        }

        if (!isShowingOverrideFortune) {
          exitOverrideLoop();
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [isOverrideInputActive, isPreparingNextFortune, isShowingOverrideFortune]);

  useEffect(() => {
    if (!isOverrideInputActive && !isShowingOverrideFortune) {
      setIsOverrideLoopActive(false);
    }
  }, [isOverrideInputActive, isShowingOverrideFortune]);

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

    const riskCandidate = isOverrideInputActive ? overrideCommand.mood : moodInput;
    if (isHighRiskMoodInput(riskCandidate)) {
      Keyboard.dismiss();
      clearPaperRevealTimer();
      setIsReplaceConfirmVisible(false);
      setIsShowingOverrideFortune(false);
      setIsOverrideLoopActive(false);
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

    if (isShowingOverrideFortune) {
      setIsShowingOverrideFortune(false);
      setIsReplaceConfirmVisible(false);
      setIsOverrideLoopActive(isOverrideInputActive);

      if (storedTodaySelection && !isOverrideInputActive) {
        presentStoredSelection(storedTodaySelection);
      } else {
        exitOverrideLoop();
      }

      return;
    }

    if (!hasActionableInput) {
      return;
    }

    isOpeningRef.current = true;

    try {
      setIsPreparingNextFortune(false);
      const isOverrideMode = isOverrideInputActive;
      const sessionMood = isOverrideMode ? overrideCommand.mood : moodInput;
      const selection = isOverrideMode
        ? await getOverrideFortuneSelection(sessionMood, overrideAttemptRef.current += 1)
        : await getDailyFortuneSelection(sessionMood);
      const savedFortuneRecord = createSavedFortuneRecord(
        selection,
        sessionMood
      );
      beginFortuneSession({
        mood: sessionMood || selection.inputMood || selection.analysis?.primaryEmotion || '',
        isOverride: isOverrideMode,
      });

      if (isOverrideMode) {
        setIsOverrideLoopActive(true);
        setIsShowingOverrideFortune(true);
      } else {
        setStoredTodaySelection(selection);
        setIsOverrideLoopActive(false);
        setIsShowingOverrideFortune(false);

        const streakSnapshot = await registerDailyStreak(selection.dayKey);
        setStreakCount(streakSnapshot.count);
      }

      setIsReplaceConfirmVisible(false);
      const revealFortune = () => {
        setCurrentFortuneRecord(savedFortuneRecord);
        runCookieAnimation(selection, () => {
          handleFortuneRevealed(savedFortuneRecord);
        });
      };
      revealFortune();
    } finally {
      isOpeningRef.current = false;
    }
  }

  async function submitMoodInput() {
    if (isSafetyLocked || isOpeningRef.current || isHydratingSelection) {
      return;
    }

    if (!hasActionableInput && !isShowingOverrideFortune && !isOverrideLoopActive) {
      return;
    }

    Keyboard.dismiss();
    await openFortune();
  }

  function handleBeginMoodEntry() {
    setMoodInput('');
    setIsPreparingNextFortune(true);
    setIsReplaceConfirmVisible(false);
    setCurrentFortuneContext(null);
    setIsShowingOverrideFortune(false);
    setIsOverrideLoopActive(false);
    setHasUsedReplacement(false);
    resetCookiePresentation();
  }

  function handleRequestReplace() {
    if (!canReplaceCurrentFortune) {
      return;
    }

    Keyboard.dismiss();
    setIsReplaceConfirmVisible(true);
  }

  function handleCancelReplace() {
    setIsReplaceConfirmVisible(false);
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
        mode: currentFortuneContext.isOverride ? 'override' : 'daily',
        replacementKey: replacementAttemptRef.current += 1,
        excludeFortuneText: currentFortuneRecord.text,
      });
      const replacementRecord = createSavedFortuneRecord(replacementSelection, replacementMood);

      if (!currentFortuneContext.isOverride) {
        setStoredTodaySelection(replacementSelection);
      }

      setHasUsedReplacement(true);
      setIsReplaceConfirmVisible(false);
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
        <SafeAreaView style={styles.safeArea}>
          {assetsReady ? (
            <FortuneCard
              currentFortuneIsFavorite={isCurrentFortuneFavorite}
              favoriteFortunes={favoriteFortunes}
              fortuneText={fortuneText}
              historyFortunes={collapsedHistoryFortunes}
              isAnimating={isAnimating}
              isCookieOpened={isCookieOpened}
              isHydratingSelection={isHydratingSelection}
              isPaperVisible={isPaperVisible}
              isReplaceConfirmVisible={isReplaceConfirmVisible}
              isTapDisabled={isCookieInteractionDisabled}
              moodInput={moodInput}
              onBeginMoodEntry={handleBeginMoodEntry}
              onCancelReplace={handleCancelReplace}
              onConfirmReplace={handleConfirmReplace}
              onMoodChange={(nextValue) => setMoodInput(normalizeMoodInput(nextValue))}
              onRemoveFavorite={handleRemoveFavorite}
              onOpenFortune={openFortune}
              onRequestReplace={handleRequestReplace}
              onShareSavedFortune={handleShareSavedFortune}
              onShareFortune={handleShareFortune}
              onSubmitMoodInput={submitMoodInput}
              onToggleFavorite={handleToggleFavorite}
              paperProgress={paperProgress}
              scene={scene}
              shellProgress={shellProgress}
              streakLabel={streakLabel}
              canReplaceCurrentFortune={canReplaceCurrentFortune}
              dailyWisdomMessage={dailyWisdomMessage}
            />
          ) : (
            <View style={styles.loadingScreen} />
          )}
        </SafeAreaView>
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
