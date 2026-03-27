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
import { SCENE_LIBRARY } from './data/scenes';
import { syncAppBadgeAsync } from './utils/appBadge';
import {
  clearAllStoredFortuneState,
  getDailyFortuneSelection,
  getDefaultSceneKey,
  getOverrideFortuneSelection,
  getStoredDailyFortuneSelection,
} from './utils/fortuneLogic';
import {
  collapseFortuneRuns,
  createSavedFortuneRecord,
  getSavedFortunesSnapshot,
  saveFortuneToHistory,
  toggleFavoriteFortune,
} from './utils/savedFortunes';

const COOKIE_CLOSED_IMAGE = require('./assets/cookie/closed-2.png');
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

const LOCKED_TOMORROW_MESSAGES = [
  'A new fortune awaits you tomorrow',
  'Return tomorrow for what\u2019s next',
  'One day, one fortune. See you tomorrow',
  'Let today\u2019s words settle. Tomorrow brings more',
  'This fortune is yours for today. Tomorrow, a new one',
  'The cookie has spoken. Tomorrow, it speaks again',
  'The cookie is quiet now. Try again tomorrow',
  'No peeking into the future. One day, one fortune',
  'Even fortune cookies need rest. See you tomorrow',
  'The cookie sleeps now. Tomorrow, it whispers again',
  'Patience\u2026 tomorrow brings a new fortune',
  'The cookie keeps its secrets until tomorrow',
  'All in good time. Your next fortune comes tomorrow',
  'Come back tomorrow \u2014 the cookie will be ready',
  'Your next fortune is waiting\u2026 just not yet',
  'The cookie rests now. Tomorrow, it returns',
];

function pickRandomLockedTomorrowMessage() {
  const index = Math.floor(Math.random() * LOCKED_TOMORROW_MESSAGES.length);
  return LOCKED_TOMORROW_MESSAGES[index];
}

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

export default function App() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [storedTodaySelection, setStoredTodaySelection] = useState(null);
  const [currentFortuneRecord, setCurrentFortuneRecord] = useState(null);
  const [historyFortunes, setHistoryFortunes] = useState([]);
  const [favoriteFortunes, setFavoriteFortunes] = useState([]);
  const [sceneKey, setSceneKey] = useState(getDefaultSceneKey());
  const [revealPhase, setRevealPhase] = useState(REVEAL_PHASE.IDLE);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isHydratingSelection, setIsHydratingSelection] = useState(true);
  const [isOverrideLoopActive, setIsOverrideLoopActive] = useState(false);
  const [isShowingOverrideFortune, setIsShowingOverrideFortune] = useState(false);
  const [lockedTomorrowMessage, setLockedTomorrowMessage] = useState(() => (
    pickRandomLockedTomorrowMessage()
  ));

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const paperRevealTimer = useRef(null);
  const isOpeningRef = useRef(false);
  const overrideAttemptRef = useRef(0);

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;
  const isAnimating = revealPhase === REVEAL_PHASE.OPENING;
  const overrideCommand = parseOverrideCommand(moodInput);
  const isResetCommandActive = isResetFortuneCommand(moodInput);
  const isOverrideInputActive = overrideCommand.isOverride;
  const hasActionableInput = Boolean(moodInput.trim());
  const hasOpenedToday = Boolean(storedTodaySelection);
  const isLockedForToday = (
    hasOpenedToday
    && !isShowingOverrideFortune
    && !isOverrideInputActive
    && !isResetCommandActive
  );
  const isCookieOpened = revealPhase !== REVEAL_PHASE.IDLE;
  const isPaperVisible = revealPhase === REVEAL_PHASE.OPENED;
  const collapsedHistoryFortunes = collapseFortuneRuns(historyFortunes, 10);
  const isCurrentFortuneFavorite = Boolean(
    currentFortuneRecord
    && favoriteFortunes.some((favorite) => favorite.id === currentFortuneRecord.id)
  );
  const cookieCueText = isOverrideLoopActive || isShowingOverrideFortune
    ? 'Ready for another fortune?'
    : !hasActionableInput
      ? 'One fortune a day only. Make it count!'
    : isResetCommandActive
      ? 'Press enter to reset today'
    : isLockedForToday
      ? lockedTomorrowMessage
      : 'Ready for your fortune?';
  const isCookieInteractionDisabled = (
    isHydratingSelection
    || isLockedForToday
    || (!hasActionableInput && !isShowingOverrideFortune && !isOverrideLoopActive)
  );

  async function resetTodayFortune() {
    Keyboard.dismiss();
    await clearAllStoredFortuneState();
    setStoredTodaySelection(null);
    setIsShowingOverrideFortune(false);
    setIsOverrideLoopActive(false);
    overrideAttemptRef.current = 0;
    setMoodInput('');
    setLockedTomorrowMessage(pickRandomLockedTomorrowMessage());
    resetCookiePresentation();
  }

  function clearPaperRevealTimer() {
    if (paperRevealTimer.current) {
      clearTimeout(paperRevealTimer.current);
      paperRevealTimer.current = null;
    }
  }

  function resetCookiePresentation() {
    clearPaperRevealTimer();
    setFortuneText('');
    setCurrentFortuneRecord(null);
    setSceneKey(getDefaultSceneKey());
    setRevealPhase(REVEAL_PHASE.IDLE);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
  }

  function showSelection(selection) {
    setFortuneText(selection.fortuneText);
    setCurrentFortuneRecord(createSavedFortuneRecord(selection, selection.inputMood || ''));
    setSceneKey(selection.sceneKey || getDefaultSceneKey());
    setRevealPhase(REVEAL_PHASE.OPENED);
    shellProgress.setValue(1);
    paperProgress.setValue(1);
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
      message: `My fortune from Fortune Cookie Daily: ${currentFortuneRecord.text}`,
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
        const [snapshot, storedSelection] = await Promise.all([
          getSavedFortunesSnapshot(),
          getStoredDailyFortuneSelection(),
        ]);

        if (!isMounted) {
          return;
        }

        applySavedFortunesSnapshot(snapshot);

        if (storedSelection) {
          setStoredTodaySelection(storedSelection);
          showSelection(storedSelection);
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
    if (isLockedForToday) {
      setLockedTomorrowMessage((currentMessage) => currentMessage || pickRandomLockedTomorrowMessage());
      return;
    }

    setLockedTomorrowMessage(pickRandomLockedTomorrowMessage());
  }, [isLockedForToday]);

  useEffect(() => {
    if (storedTodaySelection && !isShowingOverrideFortune && !isOverrideInputActive) {
      showSelection(storedTodaySelection);
    }
  }, [isOverrideInputActive, isShowingOverrideFortune]);

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
        const refreshedSelection = await getStoredDailyFortuneSelection();

        setStoredTodaySelection(refreshedSelection);

        if (refreshedSelection) {
          if (!isShowingOverrideFortune && !isOverrideInputActive) {
            showSelection(refreshedSelection);
          }
          return;
        }

        if (!isShowingOverrideFortune) {
          setIsShowingOverrideFortune(false);
          setIsOverrideLoopActive(false);
          resetCookiePresentation();
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [isOverrideInputActive, isShowingOverrideFortune]);

  useEffect(() => {
    if (!isOverrideInputActive && !isShowingOverrideFortune) {
      setIsOverrideLoopActive(false);
    }
  }, [isOverrideInputActive, isShowingOverrideFortune]);

  function runCookieAnimation(selection, onReveal) {
    let didReveal = false;

    function revealOnce() {
      if (didReveal) {
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
    setRevealPhase(REVEAL_PHASE.IDLE);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
    clearPaperRevealTimer();

    setRevealPhase(REVEAL_PHASE.OPENING);
    paperRevealTimer.current = setTimeout(() => {
      revealOnce();
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
      revealOnce();
    });
  }

  async function openFortune() {
    if (isAnimating || isOpeningRef.current || isHydratingSelection) {
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
      setIsOverrideLoopActive(isOverrideInputActive);

      if (storedTodaySelection && !isOverrideInputActive) {
        showSelection(storedTodaySelection);
      } else {
        resetCookiePresentation();
      }

      return;
    }

    if (isLockedForToday) {
      return;
    }

    if (!hasActionableInput) {
      return;
    }

    isOpeningRef.current = true;

    try {
      const selection = isOverrideInputActive
        ? await getOverrideFortuneSelection(overrideCommand.mood, overrideAttemptRef.current += 1)
        : await getDailyFortuneSelection(moodInput);
      const savedFortuneRecord = createSavedFortuneRecord(
        selection,
        isOverrideInputActive ? overrideCommand.mood : moodInput
      );

      if (isOverrideInputActive) {
        setIsOverrideLoopActive(true);
        setIsShowingOverrideFortune(true);
      } else {
        setStoredTodaySelection(selection);
        setIsOverrideLoopActive(false);
        setIsShowingOverrideFortune(false);
      }

      setCurrentFortuneRecord(savedFortuneRecord);
      runCookieAnimation(selection, () => {
        handleFortuneRevealed(savedFortuneRecord);
      });
    } finally {
      isOpeningRef.current = false;
    }
  }

  async function submitMoodInput() {
    if (isOpeningRef.current || isHydratingSelection) {
      return;
    }

    if (!hasActionableInput && !isShowingOverrideFortune && !isOverrideLoopActive) {
      return;
    }

    Keyboard.dismiss();
    await openFortune();
  }

  return (
    <View style={[styles.appRoot, { backgroundColor: scene.sky }]}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: scene.sky }]} />
      <ExpoStatusBar style={scene.statusBar} />
      <StatusBar barStyle={scene.statusBar === 'light' ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={styles.safeArea}>
        {assetsReady ? (
          <FortuneCard
            currentFortuneIsFavorite={isCurrentFortuneFavorite}
            cookieCueText={cookieCueText}
            favoriteFortunes={favoriteFortunes}
            fortuneText={fortuneText}
            historyFortunes={collapsedHistoryFortunes}
            isAnimating={isAnimating}
            isCookieOpened={isCookieOpened}
            isHydratingSelection={isHydratingSelection}
            isPaperVisible={isPaperVisible}
            isTapDisabled={isCookieInteractionDisabled}
            moodInput={moodInput}
            onMoodChange={(nextValue) => setMoodInput(normalizeMoodInput(nextValue))}
            onRemoveFavorite={handleRemoveFavorite}
            onOpenFortune={openFortune}
            onShareFortune={handleShareFortune}
            onSubmitMoodInput={submitMoodInput}
            onToggleFavorite={handleToggleFavorite}
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
