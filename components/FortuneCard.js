import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import CookieShell, { COOKIE_SHELL_FRAME } from './CookieShell';
import FortuneLibrarySheet from './FortuneLibrarySheet';

const KEYBOARD_ACCESSORY_ID = 'fortune-mood-keyboard-accessory';
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
  isAnimating,
  isCookieOpened,
  isPaperVisible,
  isTapDisabled,
  onPress,
  paperProgress,
  scene,
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
    <TouchableOpacity
      activeOpacity={0.94}
      disabled={isAnimating || isTapDisabled}
      onPress={onPress}
      style={styles.cookieTapArea}
    >
      <View style={[styles.cookieStage, { minHeight: stageMinHeight }]}>
        <Animated.View style={[styles.cookieImageFrame, cookieLiftStyle]}>
          <CookieShell
            fortuneText={fortuneText}
            isOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            paperProgress={paperProgress}
            shellProgress={shellProgress}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
});

export default function FortuneCard({
  canReplaceCurrentFortune,
  currentFortuneIsFavorite,
  dailyWisdomMessage,
  favoriteFortunes,
  fortuneText,
  historyFortunes,
  isAnimating,
  isCookieOpened,
  isHydratingSelection,
  isPaperVisible,
  isReplaceConfirmVisible,
  isTapDisabled,
  moodInput,
  onBeginMoodEntry,
  onCancelReplace,
  onConfirmReplace,
  onMoodChange,
  onRemoveFavorite,
  onOpenFortune,
  onRequestReplace,
  onShareSavedFortune,
  onShareFortune,
  onSubmitMoodInput,
  onToggleFavorite,
  paperProgress,
  scene,
  shellProgress,
  streakLabel,
}) {
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDailyWisdomVisible, setIsDailyWisdomVisible] = useState(Boolean(dailyWisdomMessage));
  const { height: viewportHeight } = useWindowDimensions();
  const drawerProgress = useRef(new Animated.Value(0)).current;
  const dailyWisdomProgress = useRef(new Animated.Value(dailyWisdomMessage ? 1 : 0)).current;
  const idleKeyboardTimerRef = useRef(null);
  const dailyWisdomTimerRef = useRef(null);
  const dailyWisdomShowTimerRef = useRef(null);
  const inputRef = useRef(null);
  const keyboardAccessoryPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => (
        Math.abs(gestureState.dy) > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 18) {
          inputRef.current?.blur();
        }
      },
    })
  ).current;
  const cookieTopPadding = Math.min(Math.max(Math.round(viewportHeight * 0.235), 176), 224);
  const promptTopGap = Math.max(Math.round(viewportHeight * 0.002), 0);
  const cookieStageMinHeight = Math.min(Math.max(Math.round(viewportHeight * 0.15), 142), 184);
  const isFortuneRevealed = Boolean(isPaperVisible && fortuneText);
  const isPromptTemporarilyLocked = Boolean(dailyWisdomMessage && isDailyWisdomVisible);
  const celebratoryStreakLabel = streakLabel === 'Start a streak' ? 'Start your streak!' : `${streakLabel}!`;

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
  }, []);

  useEffect(() => {
    scheduleIdleKeyboardDismiss(moodInput);
  }, [isInputFocused, moodInput]);

  useEffect(() => {
    clearDailyWisdomShowTimer();
    clearDailyWisdomTimer();

    if (!dailyWisdomMessage) {
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

    dailyWisdomProgress.setValue(0);
    dailyWisdomShowTimerRef.current = setTimeout(() => {
      setIsDailyWisdomVisible(true);
      Animated.timing(dailyWisdomProgress, {
        toValue: 1,
        duration: 560,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      dailyWisdomShowTimerRef.current = null;

      dailyWisdomTimerRef.current = setTimeout(() => {
        Animated.timing(dailyWisdomProgress, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setIsDailyWisdomVisible(false);
          }
        });
        dailyWisdomTimerRef.current = null;
      }, 3600);
    }, 2000);

    return () => {
      clearDailyWisdomShowTimer();
      clearDailyWisdomTimer();
    };
  }, [dailyWisdomMessage, dailyWisdomProgress]);

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
          outputRange: [-280, 0],
        }),
      },
    ],
  };

  const drawerBackdropAnimatedStyle = {
    opacity: drawerProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.26],
    }),
  };

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <View style={styles.contentFrame}>
        <View style={styles.menuChrome} pointerEvents="box-none">
          <Pressable
            hitSlop={8}
            onPress={openDrawer}
            style={[styles.menuButton, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
          >
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
            <View style={[styles.menuLine, { backgroundColor: scene.textPrimary }]} />
          </Pressable>
        </View>

        <View style={styles.topChrome} pointerEvents="none">
          <View
            style={[
              styles.topBar,
              styles.streakBar,
              { backgroundColor: '#ffd77a', borderColor: '#f5bc37' },
            ]}
          >
            <Text style={[styles.streakText, styles.streakTextCentered, styles.streakTextCelebratory]}>
              {celebratoryStreakLabel}
            </Text>
          </View>
        </View>

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
              <Text style={[styles.dailyWisdomText, { color: scene.accent }]}>
                {dailyWisdomMessage}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <CookieStage
          fortuneText={fortuneText}
          isAnimating={isAnimating}
          isCookieOpened={isCookieOpened}
          isPaperVisible={isPaperVisible}
          isTapDisabled={isTapDisabled || isPromptTemporarilyLocked}
          onPress={onOpenFortune}
          paperProgress={paperProgress}
          scene={scene}
          shellProgress={shellProgress}
          stageMinHeight={cookieStageMinHeight}
        />

        <View style={{ height: promptTopGap }} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          enabled={Platform.OS === 'ios'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 52 : 0}
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
                inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
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

                  onBeginMoodEntry?.();
                  setIsInputFocused(true);
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
          <View style={styles.actionZone}>
            {isReplaceConfirmVisible ? (
              <View style={[styles.replaceConfirmCard, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}>
                <Text style={[styles.replaceConfirmText, { color: scene.textPrimary }]}>
                  A new fortune will replace this one.
                </Text>

                <View style={styles.replaceConfirmActions}>
                  <Pressable
                    onPress={onCancelReplace}
                    style={[styles.replaceConfirmButton, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
                  >
                    <Text style={[styles.replaceConfirmButtonText, { color: scene.textPrimary }]}>
                      Keep this one
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={onConfirmReplace}
                    style={[styles.replaceConfirmButton, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}
                  >
                    <Text style={[styles.replaceConfirmButtonText, { color: scene.textPrimary }]}>
                      Replace it
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
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
              { backgroundColor: scene.panel, borderColor: scene.panelBorder },
            ]}
          >
            <Text style={[styles.drawerTitle, { color: scene.textPrimary }]}>Menu</Text>

            <Pressable
              onPress={() => handleDrawerSelect(() => openLibrary('history'))}
              style={[styles.drawerItem, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
            >
              <Text style={[styles.drawerItemText, { color: scene.textPrimary }]}>History</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDrawerSelect(() => openLibrary('favorites'))}
              style={[styles.drawerItem, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
            >
              <Text style={[styles.drawerItemText, { color: scene.textPrimary }]}>Favorites</Text>
            </Pressable>

            <View style={[styles.drawerDivider, { backgroundColor: scene.panelBorder }]} />

            <Pressable
              disabled={!isFortuneRevealed}
              onPress={() => handleDrawerSelect(onShareFortune)}
              style={[
                styles.drawerItem,
                { backgroundColor: scene.input, borderColor: scene.inputBorder },
                !isFortuneRevealed && styles.drawerItemDisabled,
              ]}
            >
              <Text style={[styles.drawerItemText, { color: scene.textPrimary }, !isFortuneRevealed && styles.drawerItemTextDisabled]}>
                Share
              </Text>
            </Pressable>

            <Pressable
              disabled={!isFortuneRevealed}
              onPress={() => handleDrawerSelect(onToggleFavorite)}
              style={[
                styles.drawerItem,
                { backgroundColor: scene.input, borderColor: scene.inputBorder },
                !isFortuneRevealed && styles.drawerItemDisabled,
              ]}
            >
              <Text style={[styles.drawerItemText, { color: scene.textPrimary }, !isFortuneRevealed && styles.drawerItemTextDisabled]}>
                {currentFortuneIsFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>

            {canReplaceCurrentFortune ? (
              <Pressable
                onPress={() => handleDrawerSelect(onRequestReplace)}
                style={[styles.drawerItem, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
              >
                <Text style={[styles.drawerItemText, { color: scene.textPrimary }]}>Replace</Text>
              </Pressable>
            ) : null}

            <View style={[styles.drawerDivider, { backgroundColor: scene.panelBorder }]} />

            <Pressable
              onPress={handleOpenSupport}
              style={[styles.drawerItem, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}
            >
              <Text style={[styles.drawerItemText, { color: scene.textPrimary }]}>Support</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}

      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
          <View
            style={[
              styles.keyboardAccessory,
              {
                backgroundColor: scene.panel,
                borderTopColor: scene.panelBorder,
              },
            ]}
            {...keyboardAccessoryPanResponder.panHandlers}
          >
            <Pressable
              hitSlop={{ top: 6, bottom: 6, left: 24, right: 24 }}
              onPress={() => inputRef.current?.blur()}
              style={styles.keyboardHandlePressable}
            >
              <View style={[styles.keyboardHandle, { backgroundColor: scene.panelBorder }]} />
            </Pressable>
          </View>
        </InputAccessoryView>
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
  menuChrome: {
    position: 'absolute',
    top: 18,
    left: 22,
    zIndex: 12,
  },
  topChrome: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 999,
    zIndex: 10,
    shadowColor: '#e5ba65',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  streakBar: {
    minHeight: 32,
    minWidth: 172,
    paddingVertical: 7,
    paddingHorizontal: 16,
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
  streakText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.15,
  },
  streakTextCentered: {
    textAlign: 'center',
  },
  streakTextCelebratory: {
    color: '#8a5a17',
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
    paddingTop: 13,
    paddingBottom: 11,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  inputLabelLocked: {
    opacity: 0.45,
  },
  inputRow: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 42,
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
    paddingVertical: 7,
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
    maxWidth: 420,
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
    marginTop: -14,
  },
  dailyWisdomText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  actionZone: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    marginTop: 16,
    minHeight: 12,
    justifyContent: 'flex-start',
  },
  replaceConfirmCard: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  drawerLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    justifyContent: 'flex-start',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#150f0d',
  },
  drawerPanel: {
    width: 272,
    maxWidth: '78%',
    minHeight: '100%',
    borderRightWidth: 1,
    paddingTop: 88,
    paddingHorizontal: 18,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 22,
    shadowOffset: { width: 8, height: 0 },
    elevation: 10,
  },
  drawerTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 14,
  },
  drawerItem: {
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 6,
  },
  drawerItemDisabled: {
    opacity: 0.4,
  },
  drawerItemText: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  drawerItemTextDisabled: {
    opacity: 0.88,
  },
  drawerDivider: {
    height: 1,
    opacity: 0.45,
    marginVertical: 10,
  },
  keyboardAccessory: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
  },
  keyboardHandlePressable: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  keyboardHandle: {
    width: 72,
    height: 5,
    borderRadius: 999,
    opacity: 0.58,
  },
  replaceConfirmText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  replaceConfirmActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  replaceConfirmButton: {
    minHeight: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    flexGrow: 1,
  },
  replaceConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.12,
  },
});
