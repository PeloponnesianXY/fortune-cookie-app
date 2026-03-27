import React, { memo, useState } from 'react';
import {
  Animated,
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
  const { height: viewportHeight } = useWindowDimensions();
  const topPadding = Math.max(Math.round(viewportHeight * 0.15), 86);
  const gapAfterInput = Math.max(Math.round(viewportHeight * 0.035), 24);
  const isFortuneRevealed = Boolean(isPaperVisible && fortuneText);

  function openLibrary(library) {
    setActiveLibrary(library);
  }

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop scene={scene} />

      <View style={styles.contentFrame}>
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
              style={styles.topBarButton}
            >
              <Text style={[styles.topBarButtonText, { color: scene.textPrimary }]}>
                Favorites
              </Text>
            </Pressable>
          </View>
        </View>

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

        {isFortuneRevealed ? (
          <>
            <View style={styles.actionRow}>
              <Pressable
                onPress={onToggleFavorite}
                style={[styles.actionButton, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}
              >
                <Text style={[styles.actionButtonText, { color: scene.textPrimary }]}>
                  {currentFortuneIsFavorite ? 'Unfavorite' : 'Favorite'}
                </Text>
              </Pressable>

              <Pressable
                onPress={onShareFortune}
                style={[styles.actionButton, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}
              >
                <Text style={[styles.actionButtonText, { color: scene.textPrimary }]}>
                  Share
                </Text>
              </Pressable>

              {canReplaceCurrentFortune ? (
                <Pressable
                  onPress={onRequestReplace}
                  style={[styles.actionButton, { backgroundColor: scene.panel, borderColor: scene.panelBorder }]}
                >
                  <Text style={[styles.actionButtonText, { color: scene.textPrimary }]}>
                    Replace
                  </Text>
                </Pressable>
              ) : null}
            </View>

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
          </>
        ) : null}
      </View>

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
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
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
    left: 28,
    width: 156,
    height: 156,
    borderRadius: 999,
    opacity: 0.52,
  },
  sunDisc: {
    position: 'absolute',
    top: 72,
    left: 72,
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
  actionRow: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 22,
  },
  actionButton: {
    minHeight: 44,
    minWidth: 110,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    flexGrow: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  replaceConfirmCard: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
