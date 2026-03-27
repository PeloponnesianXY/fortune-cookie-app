import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  InputAccessoryView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
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

const SceneBackdrop = memo(function SceneBackdrop({ scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.topGlow, { backgroundColor: scene.wash }]} />
      <View style={[styles.sunHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.sunDisc, { backgroundColor: scene.celestial }]} />
      <View style={[styles.cloud, { backgroundColor: scene.cloud }]} />
      <View style={[styles.bottomField, { backgroundColor: scene.field }]} />
      <View style={[styles.bottomMist, { backgroundColor: scene.mist }]} />
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
  cookieCueText,
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
          />
        </Animated.View>
      </View>

      <View
        style={[
          styles.cookieCueWrap,
          {
            backgroundColor: scene.cueSurface,
            borderColor: scene.cueBorder,
          },
        ]}
      >
        <Text style={[styles.cookieCueText, { color: scene.textPrimary }]}>
          {isAnimating ? 'Opening...' : cookieCueText}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default function FortuneCard({
  canReplaceCurrentFortune,
  currentFortuneIsFavorite,
  cookieCueText,
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
  onCancelReplace,
  onConfirmReplace,
  onMoodChange,
  onRemoveFavorite,
  onOpenFortune,
  onRequestReplace,
  onShareFortune,
  onSubmitMoodInput,
  onToggleFavorite,
  paperProgress,
  scene,
  shellProgress,
  streakLabel,
}) {
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [areActionsVisible, setAreActionsVisible] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { height: viewportHeight } = useWindowDimensions();
  const topBarProgress = useRef(new Animated.Value(1)).current;
  const actionBarProgress = useRef(new Animated.Value(1)).current;
  const hideTopBarTimerRef = useRef(null);
  const hideActionsTimerRef = useRef(null);
  const idleKeyboardTimerRef = useRef(null);
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
  const topPadding = Math.min(Math.max(Math.round(viewportHeight * 0.24), 176), 220);
  const gapAfterInput = Math.max(Math.round(viewportHeight * 0.02), 14);
  const cookieStageMinHeight = Math.min(Math.max(Math.round(viewportHeight * 0.24), 210), 268);
  const isFortuneRevealed = Boolean(isPaperVisible && fortuneText);

  function clearTopBarHideTimer() {
    if (hideTopBarTimerRef.current) {
      clearTimeout(hideTopBarTimerRef.current);
      hideTopBarTimerRef.current = null;
    }
  }

  function clearActionHideTimer() {
    if (hideActionsTimerRef.current) {
      clearTimeout(hideActionsTimerRef.current);
      hideActionsTimerRef.current = null;
    }
  }

  function clearIdleKeyboardTimer() {
    if (idleKeyboardTimerRef.current) {
      clearTimeout(idleKeyboardTimerRef.current);
      idleKeyboardTimerRef.current = null;
    }
  }

  function animateTopBarVisibility(nextVisible) {
    setIsTopBarVisible(nextVisible);
    Animated.timing(topBarProgress, {
      toValue: nextVisible ? 1 : 0,
      duration: nextVisible ? 320 : 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  function animateActionVisibility(nextVisible) {
    setAreActionsVisible(nextVisible);
    Animated.timing(actionBarProgress, {
      toValue: nextVisible ? 1 : 0,
      duration: nextVisible ? 320 : 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  function scheduleTopBarHide() {
    clearTopBarHideTimer();

    if (activeLibrary) {
      return;
    }

    hideTopBarTimerRef.current = setTimeout(() => {
      animateTopBarVisibility(false);
    }, 5000);
  }

  function showTopBar() {
    animateTopBarVisibility(true);
    scheduleTopBarHide();
  }

  function scheduleActionHide() {
    clearActionHideTimer();

    if (!isFortuneRevealed || isReplaceConfirmVisible) {
      return;
    }

    hideActionsTimerRef.current = setTimeout(() => {
      animateActionVisibility(false);
    }, 5000);
  }

  function showActions() {
    animateActionVisibility(true);
    scheduleActionHide();
  }

  function handleTopBarInteraction() {
    if (!isTopBarVisible) {
      showTopBar();
      return;
    }

    scheduleTopBarHide();
  }

  function handleActionInteraction() {
    if (!areActionsVisible) {
      showActions();
      return;
    }

    scheduleActionHide();
  }

  function openLibrary(library) {
    clearTopBarHideTimer();
    animateTopBarVisibility(true);
    setActiveLibrary(library);
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

  useEffect(() => {
    if (activeLibrary) {
      clearTopBarHideTimer();
      animateTopBarVisibility(true);
      return;
    }

    if (isTopBarVisible) {
      scheduleTopBarHide();
    }
  }, [activeLibrary, isTopBarVisible]);

  useEffect(() => {
    if (!isFortuneRevealed || isReplaceConfirmVisible) {
      clearActionHideTimer();
      animateActionVisibility(true);
      return;
    }

    if (areActionsVisible) {
      scheduleActionHide();
    }
  }, [areActionsVisible, isFortuneRevealed, isReplaceConfirmVisible]);

  useEffect(() => () => {
    clearTopBarHideTimer();
    clearActionHideTimer();
    clearIdleKeyboardTimer();
  }, []);

  useEffect(() => {
    scheduleIdleKeyboardDismiss(moodInput);
  }, [isInputFocused, moodInput]);

  const topBarAnimatedStyle = {
    opacity: topBarProgress,
    transform: [
      {
        translateY: topBarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-18, 0],
        }),
      },
    ],
  };

  const topHandleAnimatedStyle = {
    opacity: topBarProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: topBarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  };

  const actionRowAnimatedStyle = {
    opacity: actionBarProgress,
    transform: [
      {
        translateY: actionBarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  const actionHandleAnimatedStyle = {
    opacity: actionBarProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 0],
    }),
    transform: [
      {
        translateY: actionBarProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
    ],
  };

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <ScrollView
        alwaysBounceVertical={isInputFocused}
        bounces={isInputFocused}
        contentContainerStyle={styles.contentFrame}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.topChrome,
            topBarAnimatedStyle,
          ]}
          pointerEvents={isTopBarVisible ? 'auto' : 'none'}
        >
          <View
            style={[
              styles.topBar,
              { backgroundColor: scene.panel, borderColor: scene.panelBorder },
            ]}
          >
            <Text style={[styles.streakText, { color: scene.textSecondary || scene.textPrimary }]}>
              {streakLabel}
            </Text>

            <View
              style={[
                styles.libraryGroup,
                { backgroundColor: scene.input, borderColor: scene.inputBorder },
              ]}
            >
              <Pressable
                hitSlop={6}
                onPress={() => openLibrary('history')}
                onPressIn={handleTopBarInteraction}
                style={styles.topBarButton}
              >
                <Text style={[styles.topBarButtonText, { color: scene.textPrimary }]}>
                  History
                </Text>
              </Pressable>

              <View style={[styles.topBarDivider, { backgroundColor: scene.panelBorder }]} />

              <Pressable
                hitSlop={6}
                onPress={() => openLibrary('favorites')}
                onPressIn={handleTopBarInteraction}
                style={styles.topBarButton}
              >
                <Text style={[styles.topBarButtonText, { color: scene.textPrimary }]}>
                  Favorites
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents={isTopBarVisible ? 'none' : 'auto'}
          style={[
            styles.topHandleWrap,
            topHandleAnimatedStyle,
          ]}
        >
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 24, right: 24 }}
            onPress={showTopBar}
            style={styles.topHandlePressable}
          >
            <View style={[styles.topHandle, { backgroundColor: scene.panelBorder }]} />
          </Pressable>
        </Animated.View>

        <View style={[styles.inputCard, { backgroundColor: scene.panel, borderColor: scene.panelBorder, marginTop: topPadding }]}>
          <Text style={[styles.inputLabel, { color: scene.accent }]}>
            Which <Text style={styles.underlinedWord}>one</Text> word best describes your mood?
          </Text>
          <View style={[styles.inputRow, { backgroundColor: scene.input, borderColor: scene.inputBorder }]}>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              blurOnSubmit={false}
              editable={!isHydratingSelection}
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
                setIsInputFocused(true);
                scheduleIdleKeyboardDismiss(moodInput);
              }}
              onSubmitEditing={onSubmitMoodInput}
              placeholder=""
              placeholderTextColor={scene.accentSoft}
              returnKeyType="done"
              selectionColor={scene.accent}
              style={[styles.input, { color: scene.textPrimary }]}
              value={moodInput}
            />
          </View>
        </View>

        <View style={{ height: gapAfterInput }} />

        <CookieStage
          cookieCueText={cookieCueText}
          fortuneText={fortuneText}
          isAnimating={isAnimating}
          isCookieOpened={isCookieOpened}
          isPaperVisible={isPaperVisible}
          isTapDisabled={isTapDisabled}
          onPress={onOpenFortune}
          paperProgress={paperProgress}
          scene={scene}
          shellProgress={shellProgress}
          stageMinHeight={cookieStageMinHeight}
        />

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
            ) : (
              <>
                <Animated.View
                  pointerEvents={areActionsVisible ? 'auto' : 'none'}
                  style={[
                    styles.actionRowWrap,
                    actionRowAnimatedStyle,
                  ]}
                  >
                    <View
                      style={[
                        styles.actionGroup,
                        { backgroundColor: scene.input, borderColor: scene.inputBorder },
                      ]}
                    >
                      <Pressable
                        onPress={() => {
                          handleActionInteraction();
                          onToggleFavorite();
                        }}
                        onPressIn={handleActionInteraction}
                        style={styles.actionGroupButton}
                      >
                        <Text style={[styles.actionGroupButtonText, { color: scene.textPrimary }]}>
                          {currentFortuneIsFavorite ? 'Unfavorite' : 'Favorite'}
                        </Text>
                      </Pressable>

                      <View style={[styles.actionGroupDivider, { backgroundColor: scene.inputBorder }]} />

                      <Pressable
                        onPress={() => {
                          handleActionInteraction();
                          onShareFortune();
                        }}
                        onPressIn={handleActionInteraction}
                        style={styles.actionGroupButton}
                      >
                        <Text style={[styles.actionGroupButtonText, { color: scene.textPrimary }]}>
                          Share
                        </Text>
                      </Pressable>

                      {canReplaceCurrentFortune ? (
                        <>
                          <View style={[styles.actionGroupDivider, { backgroundColor: scene.inputBorder }]} />

                          <Pressable
                            onPress={() => {
                              handleActionInteraction();
                              onRequestReplace();
                            }}
                            onPressIn={handleActionInteraction}
                            style={styles.actionGroupButton}
                          >
                            <Text style={[styles.actionGroupButtonText, { color: scene.textPrimary }]}>
                              Replace
                            </Text>
                          </Pressable>
                        </>
                      ) : null}
                    </View>
                  </Animated.View>

                <Animated.View
                  pointerEvents={areActionsVisible ? 'none' : 'auto'}
                  style={[
                    styles.actionHandleWrap,
                    actionHandleAnimatedStyle,
                  ]}
                >
                  <Pressable
                    hitSlop={{ top: 8, bottom: 8, left: 28, right: 28 }}
                    onPress={showActions}
                    style={styles.actionHandlePressable}
                  >
                    <View style={[styles.actionHandle, { backgroundColor: scene.panelBorder }]} />
                  </Pressable>
                </Animated.View>
              </>
            )}
          </View>
        ) : null}
      </ScrollView>

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
        favoriteCount={favoriteFortunes.length}
        favorites={favoriteFortunes}
        history={historyFortunes}
        historyCount={historyFortunes.length}
        onClose={() => setActiveLibrary(null)}
        onRemoveFavorite={onRemoveFavorite}
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
  topChrome: {
    position: 'absolute',
    top: 12,
    left: 22,
    right: 22,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 18,
    zIndex: 10,
  },
  topHandleWrap: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9,
  },
  topHandlePressable: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  topHandle: {
    width: 64,
    height: 6,
    borderRadius: 999,
    opacity: 0.55,
  },
  streakText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  libraryGroup: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 4,
  },
  topBarButton: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  topBarButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  topBarDivider: {
    width: 1,
    height: 16,
    opacity: 0.75,
  },
  topGlow: {
    position: 'absolute',
    top: -140,
    left: -40,
    right: -40,
    height: 330,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    opacity: 0.82,
  },
  sunHalo: {
    position: 'absolute',
    top: 8,
    left: 30,
    width: 148,
    height: 148,
    borderRadius: 999,
    opacity: 0.44,
  },
  sunDisc: {
    position: 'absolute',
    top: 50,
    left: 70,
    width: 58,
    height: 58,
    borderRadius: 999,
    opacity: 0.88,
  },
  cloud: {
    position: 'absolute',
    top: 146,
    left: 34,
    width: 156,
    height: 36,
    borderRadius: 999,
    opacity: 0.26,
  },
  bottomField: {
    position: 'absolute',
    left: -30,
    right: -30,
    bottom: -24,
    height: 250,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    opacity: 0.72,
  },
  bottomMist: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 96,
    height: 96,
    borderRadius: 999,
    opacity: 0.14,
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
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  inputLabel: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  underlinedWord: {
    textDecorationLine: 'underline',
  },
  inputRow: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    fontSize: 17,
    paddingVertical: 8,
  },
  cookieTapArea: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 2,
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
    marginTop: -6,
  },
  cookieCueWrap: {
    width: '100%',
    maxWidth: 540,
    minHeight: 52,
    marginTop: -46,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cookieCueText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  actionGroup: {
    width: '100%',
    maxWidth: 540,
    minHeight: 36,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionRowWrap: {
    width: '100%',
  },
  actionZone: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    marginTop: 6,
    minHeight: 74,
    justifyContent: 'flex-start',
  },
  actionGroupButton: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  actionGroupButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  actionGroupDivider: {
    width: 1,
    height: 16,
    opacity: 0.75,
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
  actionHandleWrap: {
    alignItems: 'center',
    marginTop: -4,
    paddingTop: 8,
    paddingBottom: 4,
  },
  actionHandlePressable: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  actionHandle: {
    width: 64,
    height: 6,
    borderRadius: 999,
    opacity: 0.55,
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
