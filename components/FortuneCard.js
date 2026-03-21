import React, { memo } from 'react';
import {
  Animated,
  ScrollView,
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
  fortuneText,
  isAnimating,
  isCookieOpened,
  isPaperVisible,
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
      disabled={isAnimating}
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
          {isAnimating ? 'Opening...' : 'Ready for your fortune?'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default function FortuneCard({
  analysisSummary,
  fortuneText,
  isAnimating,
  isCookieOpened,
  isPaperVisible,
  moodInput,
  onMoodChange,
  onOpenFortune,
  paperProgress,
  scene,
  shellProgress,
  statusMessage,
}) {
  const { height: viewportHeight } = useWindowDimensions();
  const stageMinHeight = Math.max(Math.round(viewportHeight * 0.74), 540);
  const stageTopPadding = Math.max(Math.round(viewportHeight * 0.18), 110);
  const stageBottomPadding = Math.max(Math.round(viewportHeight * 0.08), 48);
  const inputBottomGap = Math.max(Math.round(viewportHeight * 0.08), 34);

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onMoodChange}
              placeholder="How are you feeling?"
              placeholderTextColor={scene.accentSoft}
              style={[
                styles.input,
                {
                  backgroundColor: scene.input,
                  borderColor: scene.inputBorder,
                  color: scene.textPrimary,
                },
              ]}
              value={moodInput}
            />
          </View>

          <View style={[styles.stageAuraPool, { backgroundColor: scene.stageAura }]} />
          <View style={[styles.stageHaze, { backgroundColor: scene.mist }]} />

          <CookieStage
            fortuneText={fortuneText}
            isAnimating={isAnimating}
            isCookieOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            onPress={onOpenFortune}
            paperProgress={paperProgress}
            scene={scene}
            shellProgress={shellProgress}
          />
        </View>

        <View style={styles.footerStack}>
          {analysisSummary ? (
            <View
              style={[
                styles.devChip,
                {
                  backgroundColor: scene.input,
                  borderColor: scene.inputBorder,
                },
              ]}
            >
              <Text style={[styles.devMoodText, { color: scene.cue }]}>
                Detected: {analysisSummary.primaryMood}
                {analysisSummary.secondaryMood ? ` + ${analysisSummary.secondaryMood}` : ''}
                {` (${analysisSummary.source})`}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.devFooterText, { color: scene.textSecondary }]}>
            {statusMessage}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
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
    top: 56,
    right: 24,
    width: 198,
    height: 198,
    borderRadius: 999,
    opacity: 0.62,
  },
  celestialDisc: {
    position: 'absolute',
    top: 102,
    right: 86,
    width: 72,
    height: 72,
    borderRadius: 999,
    opacity: 0.88,
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
    left: -42,
    right: -42,
    bottom: 76,
    height: 236,
    borderTopLeftRadius: 240,
    borderTopRightRadius: 240,
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
    left: -20,
    right: -20,
    bottom: -20,
    height: 170,
    opacity: 0.35,
  },
  landscapeStage: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  inputFloat: {
    width: '84%',
    maxWidth: 412,
    alignSelf: 'center',
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    shadowColor: '#70523d',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 1,
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 17,
    fontSize: 20,
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
    marginTop: 4,
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
  footerStack: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 6,
    paddingBottom: 4,
  },
  devChip: {
    alignSelf: 'center',
    marginTop: 2,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.88,
  },
  devMoodText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.14,
  },
  devFooterText: {
    width: '100%',
    maxWidth: 330,
    alignSelf: 'center',
    marginTop: 8,
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
    opacity: 0.5,
  },
});
