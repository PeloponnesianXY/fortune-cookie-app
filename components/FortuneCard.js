import React, { memo } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import CookieShell, { COOKIE_SHELL_FRAME } from './CookieShell';

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
      <View style={styles.cookieStage}>
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
  cookieCueText,
  fortuneText,
  isAnimating,
  isCookieOpened,
  isHydratingSelection,
  isPaperVisible,
  isTapDisabled,
  moodInput,
  onMoodChange,
  onOpenFortune,
  onSubmitMoodInput,
  paperProgress,
  scene,
  shellProgress,
}) {
  const { height: viewportHeight } = useWindowDimensions();
  const topPadding = Math.max(Math.round(viewportHeight * 0.3), 232);
  const gapAfterInput = Math.max(Math.round(viewportHeight * 0.04), 28);

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <View style={styles.contentFrame}>
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
              onChangeText={onMoodChange}
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentFrame: {
    flex: 1,
    paddingHorizontal: 22,
  },
  topGlow: {
    position: 'absolute',
    top: -110,
    left: -40,
    right: -40,
    height: 330,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    opacity: 0.82,
  },
  sunHalo: {
    position: 'absolute',
    top: 30,
    right: 28,
    width: 156,
    height: 156,
    borderRadius: 999,
    opacity: 0.52,
  },
  sunDisc: {
    position: 'absolute',
    top: 72,
    right: 72,
    width: 62,
    height: 62,
    borderRadius: 999,
    opacity: 0.94,
  },
  cloud: {
    position: 'absolute',
    top: 170,
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
    bottom: -40,
    height: 310,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    opacity: 0.9,
  },
  bottomMist: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 118,
    height: 120,
    borderRadius: 999,
    opacity: 0.18,
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
  },
  cookieStage: {
    width: '100%',
    minHeight: 320,
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
    marginTop: -64,
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
});
