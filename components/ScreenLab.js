import React, { useMemo, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import FortuneHomeContent from './FortuneHomeContent';
import PreviewFrame from './PreviewFrame';
import { MOOD_SCENE_KEYS, SCENE_LIBRARY } from '../data/runtime/scenes';

const FORTUNE_PRESETS = {
  short: 'A tiny shift in perspective will clear more than today.',
  medium: 'What feels tangled right now is already loosening. Keep going with a lighter grip and let the next good clue find you.',
  long: 'The answer you want is not hiding from you. It is arriving one calm choice at a time, and the more gently you move through today, the more clearly the right door will stand out from all the noisy ones.',
};

const LAB_HISTORY_FORTUNES = [
  {
    id: 'lab-history-1',
    text: 'A calmer answer is already finding its way to you.',
    mood: 'calm',
    category: 'calm',
    createdAt: '2026-04-03T14:22:00.000Z',
    latestCreatedAt: '2026-04-03T14:22:00.000Z',
    isFavorite: true,
    favoritedAt: '2026-04-03T14:24:00.000Z',
    repeatCount: 1,
  },
  {
    id: 'lab-history-2',
    text: 'The next small step will feel kinder than the big worry.',
    mood: 'anxious',
    category: 'anxious',
    createdAt: '2026-04-03T12:08:00.000Z',
    latestCreatedAt: '2026-04-03T12:08:00.000Z',
    isFavorite: false,
    favoritedAt: null,
    repeatCount: 1,
  },
  {
    id: 'lab-history-3',
    text: 'A clean boundary will protect more peace than drama ever could.',
    mood: 'angry',
    category: 'angry',
    createdAt: '2026-04-03T09:41:00.000Z',
    latestCreatedAt: '2026-04-03T09:41:00.000Z',
    isFavorite: true,
    favoritedAt: '2026-04-03T09:43:00.000Z',
    repeatCount: 1,
  },
];

const LAB_FAVORITE_FORTUNES = [
  {
    id: 'lab-history-1',
    text: 'A calmer answer is already finding its way to you.',
    mood: 'calm',
    category: 'calm',
    createdAt: '2026-04-03T14:22:00.000Z',
    isFavorite: true,
    favoritedAt: '2026-04-03T14:24:00.000Z',
  },
  {
    id: 'lab-history-3',
    text: 'A clean boundary will protect more peace than drama ever could.',
    mood: 'angry',
    category: 'angry',
    createdAt: '2026-04-03T09:41:00.000Z',
    isFavorite: true,
    favoritedAt: '2026-04-03T09:43:00.000Z',
  },
];

const PREVIEW_DEVICES = [
  {
    key: 'se',
    label: '4.7-inch Class, such as iPhone SE (2022)',
    width: 375,
    height: 667,
    displayDiagonalInches: 4.7,
    insets: { top: 20, right: 0, bottom: 0, left: 0 },
  },
  {
    key: 'iphone14',
    label: '6.1-inch Class, such as iPhone 14',
    width: 390,
    height: 844,
    displayDiagonalInches: 6.1,
    insets: { top: 47, right: 0, bottom: 34, left: 0 },
  },
  {
    key: 'proMax',
    label: '6.7-inch Class, such as iPhone 14 Pro Max',
    width: 430,
    height: 932,
    displayDiagonalInches: 6.7,
    insets: { top: 59, right: 0, bottom: 34, left: 0 },
  },
];

const DISPLAY_REFERENCE_KEY = 'iphone14';
const DISPLAY_REFERENCE_SCALE = 0.85;

function getDisplayWidthInches({ displayDiagonalInches, height, width }) {
  const aspectRatio = height / width;

  return displayDiagonalInches / Math.sqrt(1 + aspectRatio * aspectRatio);
}

const DISPLAY_REFERENCE_DEVICE = PREVIEW_DEVICES.find((device) => device.key === DISPLAY_REFERENCE_KEY);
const DISPLAY_REFERENCE_WIDTH_RATIO = getDisplayWidthInches(DISPLAY_REFERENCE_DEVICE) / DISPLAY_REFERENCE_DEVICE.width;
const SCENE_OPTIONS = Object.keys(SCENE_LIBRARY).map((key) => ({
  key,
  label: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase()),
}));

function formatLabel(value) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());
}

const SCENE_OPTION_GROUPS = [
  {
    key: 'landing',
    label: 'Landing',
    sceneKeys: ['sunlitAir'],
  },
  {
    key: 'good',
    label: 'Good',
    sceneKeys: ['goldenQuiet', 'firstLight', 'roseBlush'],
  },
  {
    key: 'notGreat',
    label: 'Not great',
    sceneKeys: ['emberField', 'heatHaze', 'softStatic'],
  },
  {
    key: 'couldGoEitherWay',
    label: 'Could go either way',
    sceneKeys: ['fogDrift'],
  },
  {
    key: 'unknown',
    label: 'Unknown',
    sceneKeys: ['plainLight'],
  },
];

function getDisplayPreviewScale(device) {
  const widthRatio = getDisplayWidthInches(device) / device.width;

  return Math.round((DISPLAY_REFERENCE_SCALE * (widthRatio / DISPLAY_REFERENCE_WIDTH_RATIO)) * 1000) / 1000;
}

function SegmentedControl({ onChange, options, value }) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Text
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segmentedOption, isActive ? styles.segmentedOptionActive : null]}
          >
            {option.label}
          </Text>
        );
      })}
    </View>
  );
}

function ToggleRow({ label, onValueChange, value }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        onValueChange={onValueChange}
        value={value}
        style={Platform.OS === 'web' ? { transform: [{ scale: 0.8 }] } : undefined}
      />
    </View>
  );
}

export default function ScreenLab() {
  const [fortuneLength, setFortuneLength] = useState('medium');
  const [selectedSceneKey, setSelectedSceneKey] = useState('sunlitAir');
  const [isSceneLegendOpen, setIsSceneLegendOpen] = useState(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isActionTrayExpanded, setIsActionTrayExpanded] = useState(false);
  const [isCreateFortuneSheetOpen, setIsCreateFortuneSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isStreakBarExpanded, setIsStreakBarExpanded] = useState(false);
  const [isKeyboardSimulated, setIsKeyboardSimulated] = useState(false);
  const [isSafeAreaSimulated, setIsSafeAreaSimulated] = useState(true);
  const [isCookieOpened, setIsCookieOpened] = useState(false);
  const [isLockWarningVisible, setIsLockWarningVisible] = useState(false);
  const [isSavedToFavoritesNoticeVisible, setIsSavedToFavoritesNoticeVisible] = useState(false);

  const previewProps = useMemo(() => ({
    canReplaceCurrentFortune: true,
    currentFortuneIsFavorite: false,
    dailyWisdomLockSeconds: isLockWarningVisible ? 32 : 0,
    dailyWisdomMessage: isLockWarningVisible ? 'Fortune cooldown active. Please wait 32 seconds.' : null,
    dailyWisdomNoticeToken: isLockWarningVisible ? 1 : 0,
    favoriteFortunes: LAB_FAVORITE_FORTUNES,
    fortuneText: FORTUNE_PRESETS[fortuneLength],
    forcedActionTrayVisible: isActionTrayExpanded,
    forcedCustomFortuneNotice: isSavedToFavoritesNoticeVisible
      ? 'Saved to Calm fortunes and added to Favorites'
      : null,
    forcedCustomFortuneSheetVisible: isCreateFortuneSheetOpen,
    forcedDrawerOpen: isHistorySheetOpen ? false : isDrawerExpanded,
    forcedLibraryOpen: isHistorySheetOpen ? 'history' : null,
    historyFortunes: LAB_HISTORY_FORTUNES,
    isAnimating: false,
    isCookieOpened,
    isHydratingSelection: false,
    isPaperVisible: isCookieOpened,
    isPreparingNextFortune: false,
    moodInput: 'curious',
    onBeginMoodEntry: () => {},
    onMoodChange: () => {},
    onRemoveFavorite: () => {},
    onRequestReplace: () => {},
    onSaveCreatedFortuneFavorite: () => {},
    onShareSavedFortune: () => {},
    onShareFortune: () => {},
    onSubmitMoodInput: () => {},
    onToggleSavedFavorite: () => {},
    onToggleFavorite: () => {},
    paperProgress: new Animated.Value(1),
    scene: SCENE_LIBRARY[selectedSceneKey] || SCENE_LIBRARY.sunlitAir,
    shellProgress: new Animated.Value(1),
    streakCelebrationToken: 0,
    streakCount: 12,
    streakDaysToNextTier: 8,
    streakForcedExpanded: isStreakBarExpanded,
    streakNextTierTitle: 'Snack Prophet',
    streakTierTitle: 'Fortune Chaser',
  }), [
    fortuneLength,
    isActionTrayExpanded,
    isCookieOpened,
    isCreateFortuneSheetOpen,
    isDrawerExpanded,
    isHistorySheetOpen,
    isLockWarningVisible,
    isSavedToFavoritesNoticeVisible,
    isStreakBarExpanded,
    selectedSceneKey,
  ]);

  const sceneGroups = [{
    key: selectedSceneKey,
    label: SCENE_OPTIONS.find((option) => option.key === selectedSceneKey)?.label || 'Scene',
    previewProps,
  }];

  const sceneLegendRows = useMemo(
    () => {
      const groupedBuckets = [
        {
          key: 'good',
          label: 'Good',
          buckets: ['caring', 'grateful', 'happy', 'calm', 'engaged', 'wowed', 'emotional', 'hopeful', 'proud', 'confident', 'romantic'],
        },
        {
          key: 'notGreat',
          label: 'Not great',
          buckets: ['angry', 'disgusted', 'frustrated', 'jealous', 'anxious', 'guilty', 'lonely', 'numb', 'sad', 'sick', 'tired', 'distracted', 'embarrassed', 'hungry', 'shaken', 'stressed', 'wired'],
        },
        {
          key: 'couldGoEitherWay',
          label: 'Could go either way',
          buckets: ['confused', 'neutral'],
        },
        {
          key: 'unknown',
          label: 'Unknown',
          buckets: ['unknown'],
        },
      ];

      return groupedBuckets.map((group) => ({
        ...group,
        scenes: Array.from(new Set(group.buckets.map((bucketKey) => MOOD_SCENE_KEYS[bucketKey]))).map((sceneKey) => {
          const scene = SCENE_LIBRARY[sceneKey];
          const rows = group.buckets
            .filter((bucketKey) => MOOD_SCENE_KEYS[bucketKey] === sceneKey)
            .sort((left, right) => formatLabel(left).localeCompare(formatLabel(right)))
            .map((bucketKey) => ({
              bucketKey,
              bucketLabel: formatLabel(bucketKey),
            }));

          return {
            sceneKey,
            sceneLabel: formatLabel(sceneKey),
            palette: scene
              ? [scene.sky, scene.celestial, scene.accent]
              : ['#ddd', '#ccc', '#bbb'],
            rows,
          };
        }),
      }));
    },
    []
  );

  return (
    <ScrollView
      contentContainerStyle={styles.pageContent}
      style={styles.page}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.controlsWrap}>
        <View style={styles.controlsCard}>
          <View style={styles.controlsBar}>
            <View style={styles.brandBlock}>
              <Text style={styles.eyebrow}>Screen Lab</Text>
            </View>

            <View style={styles.fortuneLengthBlock}>
              <Text style={styles.controlLabel}>Fortune</Text>
              <SegmentedControl
                onChange={setFortuneLength}
                options={[
                  { label: 'S', value: 'short' },
                  { label: 'M', value: 'medium' },
                  { label: 'L', value: 'long' },
                ]}
                value={fortuneLength}
              />
            </View>

            <View style={styles.sceneBlock}>
              <Pressable
                onPress={() => setIsSceneLegendOpen((current) => !current)}
                style={({ pressed }) => [
                  styles.sceneLegendButton,
                  pressed ? styles.sceneLegendButtonPressed : null,
                ]}
              >
                <Text style={styles.sceneLegendButtonText}>
                  Color Scheme {isSceneLegendOpen ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
              {isSceneLegendOpen ? (
                <View style={styles.sceneLegendCard}>
                  {sceneLegendRows.map((group) => (
                    <View key={group.key} style={styles.sceneLegendGroup}>
                      <Text style={styles.sceneLegendGroupTitle}>{group.label}</Text>
                      {group.scenes.map((sceneGroup) => (
                        <View key={`${group.key}-${sceneGroup.sceneKey}`} style={styles.sceneLegendSceneGroup}>
                          <View style={styles.sceneLegendSceneHeader}>
                            <View style={styles.sceneLegendPalette}>
                              {sceneGroup.palette.map((color, index) => (
                                <View
                                  key={`${sceneGroup.sceneKey}-${index}`}
                                  style={[styles.sceneLegendSwatch, { backgroundColor: color }]}
                                />
                              ))}
                            </View>
                            <Text style={styles.sceneLegendScene}>{sceneGroup.sceneLabel}</Text>
                          </View>
                          {sceneGroup.rows.map((row) => (
                            <View key={row.bucketKey} style={styles.sceneLegendRow}>
                              <Text style={styles.sceneLegendBucket}>{row.bucketLabel}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null}
              {SCENE_OPTION_GROUPS.map((group) => (
                <View key={group.key} style={styles.sceneOptionGroupRow}>
                  <Text style={styles.sceneOptionGroupLabel}>{group.label}</Text>
                  <View style={styles.sceneOptions}>
                    {group.sceneKeys.map((sceneKey) => {
                      const option = SCENE_OPTIONS.find((candidate) => candidate.key === sceneKey);

                      if (!option) {
                        return null;
                      }

                      const isActive = selectedSceneKey === option.key;

                      return (
                        <Text
                          key={option.key}
                          onPress={() => setSelectedSceneKey(option.key)}
                          style={[styles.sceneOption, isActive ? styles.sceneOptionActive : null]}
                        >
                          {option.label}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.togglesGrid}>
              <ToggleRow label="Action tray" onValueChange={setIsActionTrayExpanded} value={isActionTrayExpanded} />
              <ToggleRow label="Create sheet" onValueChange={setIsCreateFortuneSheetOpen} value={isCreateFortuneSheetOpen} />
              <ToggleRow label="Drawer" onValueChange={setIsDrawerExpanded} value={isDrawerExpanded} />
              <ToggleRow label="History" onValueChange={setIsHistorySheetOpen} value={isHistorySheetOpen} />
              <ToggleRow label="Keyboard" onValueChange={setIsKeyboardSimulated} value={isKeyboardSimulated} />
              <ToggleRow label="Lock warning" onValueChange={setIsLockWarningVisible} value={isLockWarningVisible} />
              <ToggleRow label="Open cookie" onValueChange={setIsCookieOpened} value={isCookieOpened} />
              <ToggleRow
                label="Saved notice"
                onValueChange={setIsSavedToFavoritesNoticeVisible}
                value={isSavedToFavoritesNoticeVisible}
              />
              <ToggleRow label="Safe area" onValueChange={setIsSafeAreaSimulated} value={isSafeAreaSimulated} />
              <ToggleRow label="Streak bar" onValueChange={setIsStreakBarExpanded} value={isStreakBarExpanded} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.framesWrap}>
        {sceneGroups.map((group) => (
          <View key={group.key} style={styles.sceneGroup}>
            <View style={styles.sceneFramesWrap}>
              {PREVIEW_DEVICES.map((device) => (
                <PreviewFrame
                  key={`${group.key}-${device.key}`}
                  height={device.height}
                  insets={isSafeAreaSimulated ? device.insets : { top: 0, right: 0, bottom: 0, left: 0 }}
                  keyboardVisible={isKeyboardSimulated}
                  label={device.label}
                  visualScale={getDisplayPreviewScale(device)}
                  width={device.width}
                >
                  <FortuneHomeContent {...group.previewProps} />
                </PreviewFrame>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#efe5d6',
  },
  pageContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 10,
  },
  controlsWrap: {
    zIndex: 10,
  },
  controlsCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.14)',
    shadowColor: '#5e4631',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky',
          top: 10,
          backdropFilter: 'blur(12px)',
        }
      : null),
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  brandBlock: {
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#2d241d',
  },
  fortuneLengthBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneBlock: {
    gap: 8,
    minWidth: 440,
    marginLeft: 'auto',
    alignItems: 'flex-start',
  },
  sceneLegendButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3e5d3',
    borderWidth: 1,
    borderColor: 'rgba(164, 122, 82, 0.22)',
  },
  sceneLegendButtonPressed: {
    opacity: 0.85,
  },
  sceneLegendButtonText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#7a6655',
  },
  sceneLegendCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 244, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
  },
  sceneLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sceneLegendGroup: {
    gap: 6,
  },
  sceneLegendGroupTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  sceneLegendSceneGroup: {
    gap: 4,
  },
  sceneLegendSceneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneLegendBucket: {
    width: 110,
    fontSize: 11,
    fontWeight: '700',
    color: '#49392d',
  },
  sceneLegendSceneWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneLegendPalette: {
    width: 54,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
  },
  sceneLegendSwatch: {
    flex: 1,
  },
  sceneLegendScene: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7a6655',
  },
  sceneOptionGroupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'flex-start',
  },
  sceneOptionGroupLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8a735f',
    width: 146,
    paddingTop: 8,
    textAlign: 'left',
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#7a6655',
  },
  segmented: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentedOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#f5ecdf',
    borderWidth: 1,
    borderColor: 'rgba(136, 102, 72, 0.16)',
    color: '#5b4534',
    fontSize: 12,
    fontWeight: '700',
  },
  segmentedOptionActive: {
    backgroundColor: '#f0d4ad',
    borderColor: '#d8a66b',
    color: '#3d2c1e',
  },
  sceneOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: 720,
    flex: 1,
    justifyContent: 'flex-start',
  },
  sceneOption: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#f5ecdf',
    borderWidth: 1,
    borderColor: 'rgba(136, 102, 72, 0.16)',
    color: '#5b4534',
    fontSize: 11,
    fontWeight: '700',
  },
  sceneOptionActive: {
    backgroundColor: '#f0d4ad',
    borderColor: '#d8a66b',
    color: '#3d2c1e',
  },
  togglesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    rowGap: 2,
    minWidth: 360,
    marginLeft: 'auto',
    justifyContent: 'flex-end',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    minWidth: 160,
    flexBasis: '30%',
    flexGrow: 1,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#3d3025',
    fontWeight: '600',
    textAlign: 'right',
  },
  framesWrap: {
    width: '100%',
    gap: 24,
  },
  sceneGroup: {
    gap: 10,
  },
  sceneFramesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
