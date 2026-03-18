import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import FortuneCookieAnimation from '../src/components/FortuneCookie/FortuneCookieAnimation';

function SceneBackdrop({ scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.sceneWash, { backgroundColor: scene.wash }]} />
      <View style={[styles.celestialHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.celestialDisc, { backgroundColor: scene.celestial }]} />
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
    </View>
  );
}

function CookieStage({
  animationKey,
  fortuneText,
  isAnimating,
  isOpened,
  onAnimationComplete,
  onPress,
  packId,
  reducedMotion,
  scene,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.94}
      disabled={isAnimating}
      onPress={onPress}
      style={styles.cookieTapArea}
    >
      <View style={styles.cookieStage}>
        <View style={[styles.paperGlow, { backgroundColor: scene.stageAura, opacity: isOpened ? 0.12 : 0.04 }]} />
        <View style={[styles.cookieGlow, { backgroundColor: scene.cookieGlow, opacity: isOpened ? 0.28 : 0.16 }]} />
        <View style={[styles.cookieNest, { backgroundColor: scene.stageLine }]} />

        <View style={styles.cookieImageFrame}>
          <FortuneCookieAnimation
            animationKey={animationKey}
            fortuneText={fortuneText}
            isOpened={isOpened}
            onAnimationComplete={onAnimationComplete}
            packId={packId}
            reducedMotion={reducedMotion}
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
}

export default function FortuneCard({
  analysisSummary,
  animationKey,
  fortuneText,
  isAnimating,
  isOpened,
  moodInput,
  onAnimationComplete,
  onMoodChange,
  onOpenFortune,
  packId,
  reducedMotion,
  scene,
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
            animationKey={animationKey}
            fortuneText={fortuneText}
            isAnimating={isAnimating}
            isOpened={isOpened}
            onAnimationComplete={onAnimationComplete}
            onPress={onOpenFortune}
            packId={packId}
            reducedMotion={reducedMotion}
            scene={scene}
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
    paddingTop: 24,
    paddingBottom: 28,
  },
  sceneWash: {
    position: 'absolute',
    top: -110,
    left: -70,
    right: -70,
    height: 390,
    borderBottomLeftRadius: 210,
    borderBottomRightRadius: 210,
  },
  celestialHalo: {
    position: 'absolute',
    top: 64,
    right: 32,
    width: 168,
    height: 168,
    borderRadius: 999,
    opacity: 0.7,
  },
  celestialDisc: {
    position: 'absolute',
    top: 104,
    right: 76,
    width: 78,
    height: 78,
    borderRadius: 999,
    opacity: 0.9,
  },
  cloud: {
    position: 'absolute',
    borderRadius: 999,
  },
  cloudOne: {
    top: 170,
    left: 34,
    width: 124,
    height: 42,
    opacity: 0.82,
  },
  cloudTwo: {
    top: 150,
    right: 132,
    width: 112,
    height: 36,
    opacity: 0.74,
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
    height: 240,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeMid: {
    position: 'absolute',
    left: -60,
    right: -50,
    bottom: 162,
    height: 240,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeFront: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: 78,
    height: 230,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeHighlight: {
    position: 'absolute',
    left: 42,
    right: 42,
    bottom: 230,
    height: 48,
    borderRadius: 999,
  },
  sceneMist: {
    position: 'absolute',
    left: -30,
    right: -30,
    bottom: 110,
    height: 150,
    borderRadius: 999,
  },
  landscapeStage: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  inputFloat: {
    width: '88%',
    maxWidth: 430,
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#70523d',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
  },
  input: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 19,
  },
  stageAuraPool: {
    position: 'absolute',
    bottom: 100,
    left: 28,
    right: 28,
    height: 188,
    borderRadius: 999,
  },
  stageHaze: {
    position: 'absolute',
    bottom: 72,
    left: -10,
    right: -10,
    height: 116,
    borderRadius: 999,
    opacity: 0.42,
  },
  cookieTapArea: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  cookieStage: {
    width: '100%',
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 18,
  },
  paperGlow: {
    position: 'absolute',
    bottom: 146,
    width: 190,
    height: 136,
    borderRadius: 999,
  },
  cookieGlow: {
    position: 'absolute',
    bottom: 44,
    width: 256,
    height: 164,
    borderRadius: 999,
  },
  cookieNest: {
    position: 'absolute',
    bottom: 40,
    width: 248,
    height: 32,
    borderRadius: 999,
    opacity: 0.7,
  },
  cookieImageFrame: {
    position: 'absolute',
    bottom: 28,
    width: 248,
    height: 198,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieShadow: {
    position: 'absolute',
    bottom: 16,
    width: 176,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(66, 46, 35, 0.12)',
  },
  cookieCuePill: {
    marginTop: 10,
  },
  cookieCueText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.08,
  },
  footerStack: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    marginTop: 12,
    paddingBottom: 6,
  },
  devChip: {
    alignSelf: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  devMoodText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.14,
  },
  devFooterText: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    opacity: 0.58,
  },
});
