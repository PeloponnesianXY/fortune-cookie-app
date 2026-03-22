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

const ALTAR_FRAME = {
  width: 500,
  height: 294,
};

const ALTAR_GRID = {
  col: ALTAR_FRAME.width / 3,
  row: ALTAR_FRAME.height / 3,
};

const SceneBackdrop = memo(function SceneBackdrop({ scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.skyBloom, { backgroundColor: scene.wash }]} />
      <View style={[styles.sceneWash, { backgroundColor: scene.wash }]} />
      <View style={[styles.celestialHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.celestialDisc, { backgroundColor: scene.celestial }]} />
      <View style={[styles.horizonBloom, { backgroundColor: scene.stageAura }]} />
      <View style={[styles.cloud, styles.cloudOne, { backgroundColor: scene.cloud }]} />
      <View style={[styles.cloud, styles.cloudTwo, { backgroundColor: scene.cloudAlt }]} />
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
      <View style={[styles.ridgeBack, { backgroundColor: scene.ridgeBack }]} />
      <View style={[styles.ridgeMid, { backgroundColor: scene.ridgeMid }]} />
      <View style={[styles.ridgeFront, { backgroundColor: scene.ridgeFront }]} />
      <View style={[styles.ridgeHighlight, { backgroundColor: scene.ridgeHighlight }]} />
      <View style={[styles.sceneMist, { backgroundColor: scene.mist }]} />
      <View style={[styles.lowerVeil, { backgroundColor: scene.mist }]} />
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
  const cookieGlowStyle = {
    opacity: shellProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.16, 0.32],
    }),
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1.06],
        }),
      },
    ],
  };

  const paperGlowStyle = {
    opacity: paperProgress.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0.18, 0.08],
    }),
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -92],
        }),
      },
      {
        scaleY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1.18],
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
        <View
          style={[
            styles.stagePanel,
            {
              backgroundColor: scene.panel,
              borderColor: scene.panelBorder,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.paperGlow,
            paperGlowStyle,
            { backgroundColor: scene.stageAura },
          ]}
        />

        <Animated.View
          style={[
            styles.cookieGlow,
            cookieGlowStyle,
            { backgroundColor: scene.cookieGlow },
          ]}
        />

        <View style={[styles.cookieNest, { backgroundColor: scene.stageLine }]} />
        <View style={[styles.cookieNestHighlight, { backgroundColor: scene.paper }]} />

        <View style={styles.cookieImageFrame}>
          <CookieShell
            fortuneText={fortuneText}
            isOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            paperProgress={paperProgress}
            scene={scene}
          />
        </View>

        <View style={styles.cookieShadow} />
      </View>

      <View style={styles.cookieCuePill}>
        <Text style={[styles.cookieCueText, { color: scene.cue }]}>
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
  paperProgress,
  scene,
  shellProgress,
}) {
  const { height: viewportHeight } = useWindowDimensions();
  const stageMinHeight = Math.max(Math.round(viewportHeight * 0.66), 480);
  const stageTopPadding = Math.max(Math.round(viewportHeight * 0.14), 96);
  const stageBottomPadding = Math.max(Math.round(viewportHeight * 0.015), 6);
  const inputBottomGap = Math.max(Math.round(viewportHeight * 0.045), 18);

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <View style={styles.contentFrame}>
        <View
          style={[
            styles.landscapeStage,
            {
              minHeight: stageMinHeight,
              paddingTop: stageTopPadding,
              paddingBottom: stageBottomPadding,
            },
          ]}
        >
          <View
            style={[
              styles.inputFloat,
              {
                backgroundColor: scene.panel,
                borderColor: scene.panelBorder,
                marginBottom: inputBottomGap,
              },
            ]}
          >
            <Text style={[styles.inputLabel, { color: scene.accent }]}>
              Which <Text style={styles.underlinedWord}>one</Text> word best describes your mood?
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: scene.input,
                  borderColor: scene.inputBorder,
                },
              ]}
            >
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isHydratingSelection}
                onChangeText={onMoodChange}
                placeholder=""
                placeholderTextColor={scene.accentSoft}
                selectionColor={scene.accent}
                style={[styles.input, { color: scene.textPrimary }]}
                value={moodInput}
              />
            </View>
          </View>

          <View style={[styles.stageAuraPool, { backgroundColor: scene.stageAura }]} />
          <View style={[styles.stageHaze, { backgroundColor: scene.mist }]} />

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentFrame: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 0,
  },
  skyBloom: {
    position: 'absolute',
    top: -170,
    left: -120,
    right: -120,
    height: 420,
    borderBottomLeftRadius: 260,
    borderBottomRightRadius: 260,
    opacity: 0.72,
  },
  sceneWash: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    height: 360,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    opacity: 0.66,
  },
  celestialHalo: {
    position: 'absolute',
    top: 24,
    right: 8,
    width: 176,
    height: 176,
    borderRadius: 999,
    opacity: 0.54,
  },
  celestialDisc: {
    position: 'absolute',
    top: 68,
    right: 60,
    width: 64,
    height: 64,
    borderRadius: 999,
    opacity: 0.82,
  },
  horizonBloom: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 170,
    height: 220,
    borderRadius: 999,
    opacity: 0.52,
  },
  cloud: {
    position: 'absolute',
    borderRadius: 999,
  },
  cloudOne: {
    top: 178,
    left: 26,
    width: 156,
    height: 48,
    opacity: 0.56,
  },
  cloudTwo: {
    top: 142,
    right: 112,
    width: 136,
    height: 40,
    opacity: 0.48,
  },
  star: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#fff8ef',
  },
  ridgeBack: {
    position: 'absolute',
    left: -90,
    right: -90,
    bottom: 250,
    height: 244,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    opacity: 0.72,
  },
  ridgeMid: {
    position: 'absolute',
    left: -62,
    right: -56,
    bottom: 164,
    height: 240,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    opacity: 0.88,
  },
  ridgeFront: {
    position: 'absolute',
    left: -70,
    right: -70,
    bottom: -46,
    height: 410,
    borderTopLeftRadius: 280,
    borderTopRightRadius: 280,
  },
  ridgeHighlight: {
    position: 'absolute',
    left: 56,
    right: 70,
    bottom: 240,
    height: 56,
    borderRadius: 999,
    opacity: 0.44,
  },
  sceneMist: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: 102,
    height: 172,
    borderRadius: 999,
    opacity: 0.6,
  },
  lowerVeil: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -110,
    height: 320,
    opacity: 0.42,
  },
  landscapeStage: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  inputFloat: {
    width: '99%',
    maxWidth: 540,
    alignSelf: 'center',
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 7,
    shadowColor: '#70523d',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 1,
    zIndex: 8,
  },
  inputRow: {
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 46,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputLabel: {
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  underlinedWord: {
    textDecorationLine: 'underline',
  },
  input: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 18,
    paddingVertical: 9,
  },
  stageAuraPool: {
    position: 'absolute',
    bottom: 106,
    left: 8,
    right: 8,
    height: 248,
    borderRadius: 999,
    opacity: 0.52,
  },
  stageHaze: {
    position: 'absolute',
    bottom: 82,
    left: -24,
    right: -24,
    height: 154,
    borderRadius: 999,
    opacity: 0.46,
  },
  cookieTapArea: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  cookieStage: {
    width: '100%',
    minHeight: 390,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  stagePanel: {
    position: 'absolute',
    bottom: 20,
    width: '94%',
    maxWidth: ALTAR_FRAME.width,
    height: ALTAR_FRAME.height,
    borderRadius: 44,
    borderWidth: 1,
    opacity: 0.72,
    shadowColor: '#6a4b38',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
  },
  paperGlow: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 1.78,
    width: ALTAR_GRID.col * 1.58,
    height: ALTAR_GRID.row * 1.7,
    borderRadius: 999,
    opacity: 0.84,
  },
  cookieGlow: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 0.57,
    width: ALTAR_GRID.col * 2.32,
    height: ALTAR_GRID.row * 2.2,
    borderRadius: 999,
    opacity: 0.92,
  },
  cookieNest: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 0.57,
    width: ALTAR_GRID.col * 2.24,
    height: ALTAR_GRID.row * 0.42,
    borderRadius: 999,
    opacity: 0.78,
  },
  cookieNestHighlight: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 0.82,
    width: ALTAR_GRID.col * 1.56,
    height: ALTAR_GRID.row * 0.14,
    borderRadius: 999,
    opacity: 0.28,
  },
  cookieImageFrame: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 0.1,
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieShadow: {
    position: 'absolute',
    bottom: ALTAR_GRID.row * 0.08,
    width: ALTAR_GRID.col * 1.62,
    height: ALTAR_GRID.row * 0.3,
    borderRadius: 999,
    backgroundColor: 'rgba(66, 46, 35, 0.14)',
  },
  cookieCuePill: {
    marginTop: -2,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 249, 240, 0.28)',
  },
  cookieCueText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
