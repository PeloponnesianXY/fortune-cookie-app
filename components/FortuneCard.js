import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import CookieShell, { COOKIE_SHELL_FRAME } from './CookieShell';
import DrawerItem from './DrawerItem';
import DrawerSection from './DrawerSection';
import FortuneActionTray from './FortuneActionTray';
import FortuneLibrarySheet from './FortuneLibrarySheet';
import StreakStatus from './StreakStatus';

const SUPPORT_URL = 'https://fortunecookieappsupport.netlify.app/';

const SceneBackdrop = memo(function SceneBackdrop({ scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.topGlow, { backgroundColor: scene.wash }]} />
      <View style={[styles.sunHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.sunDisc, { backgroundColor: scene.celestial }]} />
      <View style={[styles.cloud, { backgroundColor: scene.cloud }]} />
      {scene.stars.map((star, index) => (
        <View
          key={`${star.top}-${index}`}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              right: star.right,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
});

const CookieStage = memo(function CookieStage({
  fortuneText,
  isCookieOpened,
  isPaperVisible,
  onPress,
  paperCueProgress,
  paperProgress,
  shellProgress,
  stageMinHeight,
}) {
  const cookieLiftStyle = {
    transform: [
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [7, 0],
        }),
      },
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  };

  return (
    <Pressable
      accessibilityRole={isPaperVisible ? 'button' : undefined}
      onPress={isPaperVisible ? onPress : undefined}
      style={styles.cookieTapArea}
    >
      <View style={[styles.cookieStage, { minHeight: stageMinHeight }]}>
        <Animated.View style={[styles.cookieImageFrame, cookieLiftStyle]}>
          <CookieShell
            fortuneText={fortuneText}
            isOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            paperCueProgress={paperCueProgress}
            paperProgress={paperProgress}
            shellProgress={shellProgress}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
});

export default function FortuneCard({
  canReplaceCurrentFortune,
  currentFortuneIsFavorite,
  dailyWisdomLockSeconds,
  dailyWisdomMessage,
  dailyWisdomNoticeToken,
  favoriteFortunes,
  fortuneText,
  historyFortunes,
  isCookieOpened,
  isHydratingSelection,
  isPaperVisible,
  moodInput,
  onBeginMoodEntry,
  onMoodChange,
  onRemoveFavorite,
  onRequestReplace,
  onShareSavedFortune,
  onShareFortune,
  onSubmitMoodInput,
  onToggleFavorite,
  paperProgress,
  scene,
  shellProgress,
  streakCelebrationToken,
  streakCount,
  streakDaysToNextTier,
  streakNextTierTitle,
  streakTierTitle,
}) {
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDailyWisdomLockActive, setIsDailyWisdomLockActive] = useState(false);
  const [isDailyWisdomVisible, setIsDailyWisdomVisible] = useState(Boolean(dailyWisdomMessage));
  const [isActionTrayVisible, setIsActionTrayVisible] = useState(false);
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const drawerProgress = useRef(new Animated.Value(0)).current;
  const dailyWisdomProgress = useRef(new Animated.Value(dailyWisdomMessage ? 1 : 0)).current;
  const paperCueProgress = useRef(new Animated.Value(0)).current;
  const idleKeyboardTimerRef = useRef(null);
  const dailyWisdomTimerRef = useRef(null);
  const dailyWisdomShowTimerRef = useRef(null);
  const actionTrayTimerRef = useRef(null);
  const paperCueLoopRef = useRef(null);
  const inputRef = useRef(null);
  const cookieTopPadding = Math.min(Math.max(Math.round(viewportHeight * 0.235), 176), 224);
  const promptTopGap = Math.max(Math.round(viewportHeight * 0.002), 0);
  const cookieStageMinHeight = Math.min(Math.max(Math.round(viewportHeight * 0.15), 142), 184);
  const drawerWidth = Math.min(Math.round(viewportWidth * 0.68), 276);
  const isFortuneRevealed = Boolean(isPaperVisible && fortuneText);
  const isPromptTemporarilyLocked = isDailyWisdomLockActive;
  const drawerPalette = {
    panel: '#fff8f1',
    border: 'rgba(111, 75, 48, 0.18)',
    title: 'rgba(91, 63, 41, 0.72)',
    itemFill: '#fffdf9',
    itemBorder: 'rgba(128, 89, 58, 0.18)',
    text: '#3f2c20',
    detail: '#75543d',
    motif: 'rgba(159, 114, 80, 0.22)',
  };
  const actionTrayPalette = {
    card: 'rgba(255, 250, 243, 0.96)',
    cardBorder: 'rgba(138, 98, 67, 0.18)',
    label: scene.accent,
    text: scene.textPrimary,
    strongText: '#4c331f',
    buttonFill: scene.input,
    buttonBorder: 'rgba(140, 104, 76, 0.18)',
    primaryFill: '#f6d8b4',
    primaryBorder: '#ddb17a',
    accentFill: '#f4e7da',
    accentBorder: 'rgba(163, 117, 80, 0.22)',
  };
  function clearIdleKeyboardTimer() {
    if (idleKeyboardTimerRef.current) {
      clearTimeout(idleKeyboardTimerRef.current);
      idleKeyboardTimerRef.current = null;
    }
  }

  function clearDailyWisdomTimer() {
    if (dailyWisdomTimerRef.current) {
      clearTimeout(dailyWisdomTimerRef.current);
      dailyWisdomTimerRef.current = null;
    }
  }

  function clearDailyWisdomShowTimer() {
    if (dailyWisdomShowTimerRef.current) {
      clearTimeout(dailyWisdomShowTimerRef.current);
      dailyWisdomShowTimerRef.current = null;
    }
  }

  function clearActionTrayTimer() {
    if (actionTrayTimerRef.current) {
      clearTimeout(actionTrayTimerRef.current);
      actionTrayTimerRef.current = null;
    }
  }

  function hideActionTray() {
    clearActionTrayTimer();
    setIsActionTrayVisible(false);
  }

  function showActionTrayTemporarily() {
    clearActionTrayTimer();
    setIsActionTrayVisible(true);
    actionTrayTimerRef.current = setTimeout(() => {
      setIsActionTrayVisible(false);
      actionTrayTimerRef.current = null;
    }, 2000);
  }

  function openLibrary(library) {
    setActiveLibrary(library);
  }

  function animateDrawer(nextOpen, onComplete) {
    if (nextOpen) {
      setIsDrawerOpen(true);
    }

    Animated.timing(drawerProgress, {
      toValue: nextOpen ? 1 : 0,
      duration: nextOpen ? 260 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!nextOpen && finished) {
        setIsDrawerOpen(false);
      }

      onComplete?.(finished);
    });
  }

  function openDrawer() {
    animateDrawer(true);
  }

  function closeDrawer(onComplete) {
    animateDrawer(false, onComplete);
  }

  function handleDrawerSelect(callback) {
    closeDrawer(() => {
      callback?.();
    });
  }

  function handleOpenSupport() {
    handleDrawerSelect(() => {
      Linking.openURL(SUPPORT_URL).catch(() => {});
    });
  }

  function scheduleIdleKeyboardDismiss(nextValue = moodInput) {
    clearIdleKeyboardTimer();

    if (!isInputFocused || nextValue.trim()) {
      return;
    }

    idleKeyboardTimerRef.current = setTimeout(() => {
      inputRef.current?.blur();
    }, 10000);
  }

  useEffect(() => () => {
    clearIdleKeyboardTimer();
    clearDailyWisdomTimer();
    clearDailyWisdomShowTimer();
    clearActionTrayTimer();
    paperCueLoopRef.current?.stop();
    paperCueProgress.stopAnimation();
  }, []);

  useEffect(() => {
    if (!isFortuneRevealed) {
      clearActionTrayTimer();
      setIsActionTrayVisible(false);
      paperCueLoopRef.current?.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
      return undefined;
    }

    if (isActionTrayVisible) {
      paperCueLoopRef.current?.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
      return undefined;
    }

    const cueLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(250),
        Animated.sequence([
          Animated.timing(paperCueProgress, {
            toValue: 1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: -1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: 1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: -1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: 0,
            duration: 90,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(5000),
      ])
    );

    paperCueLoopRef.current = cueLoop;
    cueLoop.start();

    return () => {
      cueLoop.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
    };
  }, [isActionTrayVisible, isFortuneRevealed, paperCueProgress]);

  useEffect(() => {
    scheduleIdleKeyboardDismiss(moodInput);
  }, [isInputFocused, moodInput]);

  useEffect(() => {
    clearDailyWisdomShowTimer();
    clearDailyWisdomTimer();

    if (!dailyWisdomMessage || dailyWisdomLockSeconds <= 0) {
      setIsDailyWisdomLockActive(false);
      Animated.timing(dailyWisdomProgress, {
        toValue: 0,
        duration: 420,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsDailyWisdomVisible(false);
        }
      });
      return undefined;
    }

    setIsDailyWisdomLockActive(true);
    setIsDailyWisdomVisible(false);
    dailyWisdomProgress.setValue(0);
    dailyWisdomShowTimerRef.current = setTimeout(() => {
      setIsDailyWisdomVisible(true);
      Animated.timing(dailyWisdomProgress, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      dailyWisdomShowTimerRef.current = null;
    }, 1000);

    dailyWisdomTimerRef.current = setTimeout(() => {
      clearDailyWisdomShowTimer();
      Animated.timing(dailyWisdomProgress, {
        toValue: 0,
        duration: 480,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsDailyWisdomVisible(false);
          setIsDailyWisdomLockActive(false);
        }
      });
      dailyWisdomTimerRef.current = null;
    }, dailyWisdomLockSeconds * 1000);

    return () => {
      clearDailyWisdomTimer();
    };
  }, [dailyWisdomLockSeconds, dailyWisdomMessage, dailyWisdomNoticeToken, dailyWisdomProgress]);

  useEffect(() => {
    if (isPromptTemporarilyLocked && isInputFocused) {
      inputRef.current?.blur();
    }
  }, [isInputFocused, isPromptTemporarilyLocked]);

  const dailyWisdomAnimatedStyle = {
    opacity: dailyWisdomProgress,
    transform: [
      {
        translateY: dailyWisdomProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const drawerPanelAnimatedStyle = {
    transform: [
      {
        translateX: drawerProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-drawerWidth - 24, 0],
        }),
      },
    ],
  };

  const drawerBackdropAnimatedStyle = {
    opacity: drawerProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.44],
    }),
  };
  const shouldPrepareFreshEntry = Boolean(
    moodInput
    || isCookieOpened
    || isPaperVisible
  );

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <View style={styles.contentFrame}>
        <View
          pointerEvents="box-none"
          style={styles.headerChrome}
        >
          <Pressable
            hitSlop={8}
            onPress={openDrawer}
            style={[styles.menuButton, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
          >
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
          </Pressable>
          <StreakStatus
            celebrationToken={streakCelebrationToken}
            daysToNextTier={streakDaysToNextTier}
            nextTierTitle={streakNextTierTitle}
            streakCount={streakCount}
            tierTitle={streakTierTitle}
          />
        </View>

        <View style={styles.mainFlow}>
        <View style={{ height: cookieTopPadding }} />

        <View style={styles.dailyWisdomSlot}>
          {dailyWisdomMessage && isDailyWisdomVisible ? (
            <Animated.View
              style={[
                styles.dailyWisdomCard,
                dailyWisdomAnimatedStyle,
                { backgroundColor: scene.panel, borderColor: scene.panelBorder },
              ]}
            >
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                numberOfLines={1}
                style={[styles.dailyWisdomText, { color: scene.accent }]}
              >
                {dailyWisdomMessage}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <CookieStage
          fortuneText={fortuneText}
          isCookieOpened={isCookieOpened}
          isPaperVisible={isPaperVisible}
          onPress={showActionTrayTemporarily}
          paperCueProgress={paperCueProgress}
          paperProgress={paperProgress}
          shellProgress={shellProgress}
          stageMinHeight={cookieStageMinHeight}
        />

        <View style={{ height: promptTopGap }} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 132 : 0}
          style={styles.promptSection}
        >
          <View
            style={[styles.inputCard, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}
          >
            <Text style={[
              styles.inputLabel,
              { color: scene.accent },
              isPromptTemporarilyLocked ? styles.inputLabelLocked : null,
            ]}>
              Describe your mood in one word
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: scene.input,
                  borderColor: isInputFocused ? scene.accent : scene.inputBorder,
                },
                isPromptTemporarilyLocked ? styles.inputRowLocked : null,
                isInputFocused ? styles.inputRowFocused : null,
              ]}
            >
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                blurOnSubmit={false}
                editable={!isHydratingSelection && !isPromptTemporarilyLocked}
                ref={inputRef}
                onBlur={() => {
                  setIsInputFocused(false);
                  clearIdleKeyboardTimer();
                }}
                onChangeText={(nextValue) => {
                  onMoodChange(nextValue);
                  scheduleIdleKeyboardDismiss(nextValue);
                }}
                onFocus={() => {
                  if (isPromptTemporarilyLocked) {
                    inputRef.current?.blur();
                    return;
                  }

                  setIsInputFocused(true);
                  if (shouldPrepareFreshEntry) {
                    onBeginMoodEntry?.();
                  }
                  scheduleIdleKeyboardDismiss('');
                }}
                onSubmitEditing={() => {
                  inputRef.current?.blur();
                  onSubmitMoodInput();
                }}
                placeholder="tired, excited, restless..."
                placeholderTextColor={scene.accentSoft}
                returnKeyType="done"
                selectionColor={scene.accent}
                style={[
                  styles.input,
                  { color: scene.textPrimary },
                  isPromptTemporarilyLocked ? styles.inputLocked : null,
                ]}
                value={moodInput}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        {isFortuneRevealed ? (
          <View
            style={[
              styles.actionZone,
              {
                position: 'absolute',
                top: cookieTopPadding + 116 + cookieStageMinHeight + 52,
              },
            ]}
          >
            <FortuneActionTray
              canReplace={canReplaceCurrentFortune}
              isFavorite={currentFortuneIsFavorite}
              onReplace={onRequestReplace}
              onShare={onShareFortune}
              onToggleFavorite={onToggleFavorite}
              palette={actionTrayPalette}
              visible={isActionTrayVisible}
            />
          </View>
        ) : null}
        </View>
      </View>

      {isDrawerOpen ? (
        <View pointerEvents="box-none" style={styles.drawerLayer}>
          <Animated.View style={[styles.drawerBackdrop, drawerBackdropAnimatedStyle]}>
            <Pressable onPress={() => closeDrawer()} style={StyleSheet.absoluteFill} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerPanel,
              drawerPanelAnimatedStyle,
              {
                width: drawerWidth,
                backgroundColor: drawerPalette.panel,
                borderColor: drawerPalette.border,
              },
            ]}
          >
            <Text style={[styles.drawerTitle, { color: drawerPalette.title }]}>Menu</Text>

            <DrawerSection label="Browse" labelColor={drawerPalette.title}>
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="History"
                onPress={() => handleDrawerSelect(() => openLibrary('history'))}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="Favorites"
                onPress={() => handleDrawerSelect(() => openLibrary('favorites'))}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                detail="Questions, feedback, or help"
                label="Support"
                onPress={handleOpenSupport}
                textColor={drawerPalette.text}
              />
            </DrawerSection>

            <View style={styles.drawerCalmSpace} />
            <View style={styles.drawerMotif} pointerEvents="none">
              <View style={[styles.drawerMotifLine, { backgroundColor: drawerPalette.motif }]} />
              <View style={[styles.drawerMotifDot, { backgroundColor: drawerPalette.motif }]} />
              <View style={[styles.drawerMotifLineShort, { backgroundColor: drawerPalette.motif }]} />
            </View>
          </Animated.View>
        </View>
      ) : null}
      <FortuneLibrarySheet
        activeLibrary={activeLibrary || 'history'}
        favorites={favoriteFortunes}
        history={historyFortunes}
        onClose={() => setActiveLibrary(null)}
        onRemoveFavorite={onRemoveFavorite}
        onShareItem={onShareSavedFortune}
        onSelectLibrary={setActiveLibrary}
        visible={Boolean(activeLibrary)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentFrame: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerChrome: {
    position: 'absolute',
    top: 18,
    left: 22,
    right: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 12,
  },
  mainFlow: {
    flexGrow: 1,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  menuLine: {
    width: 16,
    height: 1.5,
    borderRadius: 999,
  },
  topGlow: {
    position: 'absolute',
    top: -88,
    left: -18,
    right: -18,
    height: 332,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    opacity: 0.5,
  },
  sunHalo: {
    position: 'absolute',
    top: 74,
    right: 46,
    width: 128,
    height: 128,
    borderRadius: 999,
    opacity: 0.24,
  },
  sunDisc: {
    position: 'absolute',
    top: 112,
    right: 82,
    width: 52,
    height: 52,
    borderRadius: 999,
    opacity: 0.68,
  },
  cloud: {
    position: 'absolute',
    top: 224,
    right: 34,
    width: 142,
    height: 28,
    borderRadius: 999,
    opacity: 0.12,
  },
  star: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#fff8ef',
  },
  inputCard: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    zIndex: 2,
    elevation: 4,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 9,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  inputLabelLocked: {
    opacity: 0.45,
  },
  inputRow: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 14,
    justifyContent: 'center',
    zIndex: 3,
  },
  inputRowFocused: {
    shadowColor: '#6d4e37',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  inputRowLocked: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    fontSize: 16,
    paddingVertical: 5,
  },
  inputLocked: {
    opacity: 0.5,
  },
  cookieTapArea: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  cookieStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieImageFrame: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  dailyWisdomSlot: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    height: 116,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  dailyWisdomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  promptSection: {
    marginTop: 16,
  },
  dailyWisdomText: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },
  actionZone: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    marginTop: 14,
    minHeight: 8,
    justifyContent: 'flex-start',
  },
  drawerLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    justifyContent: 'flex-start',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#201715',
  },
  drawerPanel: {
    minHeight: '100%',
    borderRightWidth: 1,
    paddingTop: 78,
    paddingHorizontal: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 10, height: 0 },
    elevation: 14,
  },
  drawerTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginLeft: 4,
  },
  drawerCalmSpace: {
    flex: 1,
    minHeight: 28,
  },
  drawerMotif: {
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  drawerMotifLine: {
    width: 54,
    height: 1.5,
    borderRadius: 999,
    marginBottom: 10,
  },
  drawerMotifDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginBottom: 10,
    marginLeft: 10,
  },
  drawerMotifLineShort: {
    width: 28,
    height: 1.5,
    borderRadius: 999,
    marginLeft: 18,
  },
});
