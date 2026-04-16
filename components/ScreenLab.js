import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import CookieShell, { getOpenedCookieImageBottom } from './CookieShell';
import FortuneHomeContent from './FortuneHomeContent';
import PreviewFrame from './PreviewFrame';
import { FORTUNES } from '../data/fortunesRegistry';
import { MOOD_SCENE_KEYS, SCENE_LIBRARY } from '../data/runtime/scenes';

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
const FORTUNE_FIT_SAMPLE_SIZE = 10;
const SCENE_OPTIONS = Object.keys(SCENE_LIBRARY).map((key) => ({
  key,
  label: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase()),
}));

const FORTUNE_FIT_DEVICES = PREVIEW_DEVICES.map((device) => ({
  key: device.key,
  label: device.key === 'se' ? 'SE' : device.key === 'iphone14' ? '14' : 'Pro Max',
  scale: getDisplayPreviewScale(device),
}));

function sampleFortunes(seed, count) {
  const fortunes = [...FORTUNES];
  if (fortunes.length === 0) {
    return [];
  }

  let state = seed >>> 0;
  const nextRandom = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let index = fortunes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [fortunes[index], fortunes[swapIndex]] = [fortunes[swapIndex], fortunes[index]];
  }

  return fortunes.slice(0, Math.min(count, fortunes.length)).map((fortune, index) => ({
    sampleId: `${fortune.id}-${seed}-${index}`,
    id: fortune.id,
    text: fortune.text,
    primaryBucket: fortune.primaryBucket,
  }));
}

function getFitVerdict(lineCounts) {
  const values = Object.values(lineCounts).filter((value) => typeof value === 'number');
  if (values.length === 0) {
    return 'Measuring';
  }

  const worstLineCount = Math.max(...values);
  if (worstLineCount <= 2) {
    return 'Fits';
  }

  return 'Spills';
}

function getFitVerdictTone(lineCounts) {
  const values = Object.values(lineCounts).filter((value) => typeof value === 'number');
  if (values.length === 0) {
    return 'neutral';
  }

  return Math.max(...values) <= 2 ? 'good' : 'bad';
}

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

const TOP_SCENE_OPTION_GROUP_KEYS = ['landing', 'unknown'];

function getDisplayPreviewScale(device) {
  const widthRatio = getDisplayWidthInches(device) / device.width;

  return Math.round((DISPLAY_REFERENCE_SCALE * (widthRatio / DISPLAY_REFERENCE_WIDTH_RATIO)) * 1000) / 1000;
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
  const initialFortuneFitSeed = useRef(Date.now() >>> 0).current;
  const [fortuneFitSeed, setFortuneFitSeed] = useState(initialFortuneFitSeed);
  const [fortuneFitLineCounts, setFortuneFitLineCounts] = useState({});
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  const sampledFortunes = useMemo(
    () => sampleFortunes(fortuneFitSeed, FORTUNE_FIT_SAMPLE_SIZE),
    [fortuneFitSeed]
  );

  useEffect(() => {
    if (!sampledFortunes.length) {
      setSelectedSampleId(null);
      return;
    }

    if (!sampledFortunes.some((fortune) => fortune.sampleId === selectedSampleId)) {
      setSelectedSampleId(sampledFortunes[0].sampleId);
    }
  }, [sampledFortunes, selectedSampleId]);

  const selectedSample = useMemo(
    () => sampledFortunes.find((fortune) => fortune.sampleId === selectedSampleId) || null,
    [sampledFortunes, selectedSampleId]
  );

  const handlePaperTextLayout = (sampleId, deviceKey) => (event) => {
    const nextLineCount = event?.nativeEvent?.lines?.length || 0;
    if (!nextLineCount) {
      return;
    }

    setFortuneFitLineCounts((current) => {
      const currentEntry = current[sampleId] || {};
      if (currentEntry[deviceKey] === nextLineCount) {
        return current;
      }

      return {
        ...current,
        [sampleId]: {
          ...currentEntry,
          [deviceKey]: nextLineCount,
        },
      };
    });
  };

  const handlePaperTextMeasure = (sampleId, deviceKey) => ({ height, lineHeight }) => {
    if (!height || !lineHeight) {
      return;
    }

    const nextLineCount = Math.max(1, Math.round(height / lineHeight));

    setFortuneFitLineCounts((current) => {
      const currentEntry = current[sampleId] || {};
      if (currentEntry[deviceKey] === nextLineCount) {
        return current;
      }

      return {
        ...current,
        [sampleId]: {
          ...currentEntry,
          [deviceKey]: nextLineCount,
        },
      };
    });
  };

  const previewFortuneText = selectedSample?.text || sampledFortunes[0]?.text || '';

  const previewProps = useMemo(() => ({
    canReplaceCurrentFortune: true,
    currentFortuneIsFavorite: false,
    dailyWisdomLockSeconds: isLockWarningVisible ? 32 : 0,
    dailyWisdomMessage: isLockWarningVisible ? 'Fortune cooldown active. Please wait 32 seconds.' : null,
    dailyWisdomNoticeToken: isLockWarningVisible ? 1 : 0,
    favoriteFortunes: LAB_FAVORITE_FORTUNES,
    fortuneText: previewFortuneText,
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
    isActionTrayExpanded,
    isCookieOpened,
    isCreateFortuneSheetOpen,
    isDrawerExpanded,
    isHistorySheetOpen,
    isLockWarningVisible,
    isSavedToFavoritesNoticeVisible,
    isStreakBarExpanded,
    previewFortuneText,
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

  const topSceneGroups = useMemo(
    () => SCENE_OPTION_GROUPS.filter((group) => TOP_SCENE_OPTION_GROUP_KEYS.includes(group.key)),
    []
  );
  const remainingSceneGroups = useMemo(
    () => SCENE_OPTION_GROUPS.filter((group) => !TOP_SCENE_OPTION_GROUP_KEYS.includes(group.key)),
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

            <View style={styles.sceneBlock}>
              <View style={styles.sceneControlsRow}>
                <Pressable
                  onPress={() => setIsSceneLegendOpen((current) => !current)}
                  style={({ pressed }) => [
                    styles.sceneLegendButton,
                    pressed ? styles.sceneLegendButtonPressed : null,
                  ]}
                >
                  <Text style={styles.sceneLegendButtonText}>
                    Color Scheme
                  </Text>
                </Pressable>

                <View style={styles.sceneRows}>
                  <View style={styles.sceneTopGroupsRow}>
                    {topSceneGroups.map((group) => (
                      <View
                        key={group.key}
                        style={[
                          styles.sceneTopGroup,
                          group.key === 'unknown' ? styles.sceneTopGroupUnknown : null,
                        ]}
                      >
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

                  {remainingSceneGroups.map((group) => (
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
              </View>
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
            </View>
          </View>
        </View>
      </View>

      <View style={styles.framesWrap}>
        <View style={styles.paperFitSplit}>
          <View style={styles.fortuneFitCard}>
            <View style={styles.fortuneFitHeader}>
              <View style={styles.fortuneFitHeaderCopy}>
                <Text style={styles.fortuneFitEyebrow}>Paper Fit</Text>
                <Text style={styles.fortuneFitTitle}>10 live fortunes</Text>
                <Text style={styles.fortuneFitSubtitle}>
                  Tap a fortune to load it into the previews.
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setFortuneFitSeed(Date.now() >>> 0);
                  setFortuneFitLineCounts({});
                }}
                style={styles.fortuneFitRefreshButton}
              >
                <Text style={styles.fortuneFitRefreshButtonText}>Sample 10</Text>
              </Pressable>
            </View>
            <View style={styles.fortuneFitLegendRow}>
              <Text style={[styles.fortuneFitHeaderCell, styles.fortuneFitBucketColumn]}>Bucket</Text>
              <Text style={[styles.fortuneFitHeaderCell, styles.fortuneFitCharsColumn]}>Chars</Text>
              <Text style={[styles.fortuneFitHeaderCell, styles.fortuneFitTextColumn]}>Fortune</Text>
            </View>
            <ScrollView
              style={styles.fortuneFitList}
              contentContainerStyle={styles.fortuneFitListContent}
              showsVerticalScrollIndicator
            >
              {sampledFortunes.map((fortune) => {
                const isSelected = fortune.sampleId === selectedSampleId;

                return (
                  <View
                    key={fortune.sampleId}
                    style={[
                      styles.fortuneFitRow,
                      isSelected ? styles.fortuneFitRowSelected : null,
                    ]}
                  >
                    <Text style={[styles.fortuneFitCell, styles.fortuneFitBucketColumn]}>{formatLabel(fortune.primaryBucket)}</Text>
                    <Text style={[styles.fortuneFitCell, styles.fortuneFitCharsColumn]}>{fortune.text.length}</Text>
                    <Pressable
                      onPress={() => setSelectedSampleId(fortune.sampleId)}
                      style={styles.fortuneFitTextPressable}
                    >
                      <Text style={[styles.fortuneFitCell, styles.fortuneFitTextColumn, styles.fortuneFitTextLink]}>
                        {fortune.text}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>

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
      </View>

      <View pointerEvents="none" style={styles.measurementStage}>
        {sampledFortunes.map((fortune) => (
          <View key={`measure-${fortune.sampleId}`} style={styles.measurementSample}>
            {FORTUNE_FIT_DEVICES.map((device) => (
              <View key={`${fortune.sampleId}-${device.key}`} style={styles.measurementDeviceWrap}>
                <CookieShell
                  fortuneText={fortune.text}
                  imageVerticalOffset={0}
                  isOpened
                  isPaperVisible
                  onPaperTextMeasure={handlePaperTextMeasure(fortune.sampleId, device.key)}
                  onPaperTextLayout={handlePaperTextLayout(fortune.sampleId, device.key)}
                  paperProgress={new Animated.Value(1)}
                  shellProgress={new Animated.Value(1)}
                  scale={device.scale}
                />
                <View style={{ height: getOpenedCookieImageBottom(device.scale) }} />
              </View>
            ))}
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
    alignItems: 'flex-start',
    gap: 20,
    flexWrap: 'wrap',
  },
  brandBlock: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#2d241d',
  },
  sceneBlock: {
    gap: 2,
    minWidth: 440,
    marginLeft: 'auto',
    alignItems: 'flex-start',
  },
  sceneControlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sceneRows: {
    gap: 3,
    minWidth: 0,
    flex: 1,
  },
  sceneTopGroupsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 18,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  sceneTopGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  sceneTopGroupUnknown: {
    marginLeft: 'auto',
  },
  sceneLegendButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    minWidth: 132,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    gap: 6,
    justifyContent: 'flex-start',
  },
  sceneOptionGroupLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8a735f',
    width: 138,
    paddingTop: 3,
    textAlign: 'left',
  },
  sceneOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    maxWidth: 720,
    flex: 1,
    justifyContent: 'flex-start',
  },
  sceneOption: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#f5ecdf',
    borderWidth: 1,
    borderColor: 'rgba(136, 102, 72, 0.16)',
    color: '#5b4534',
    fontSize: 10,
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
    gap: 12,
    rowGap: 2,
    minWidth: 320,
    maxWidth: 720,
    marginLeft: 0,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    minWidth: 150,
    flexBasis: '31%',
    flexGrow: 0,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#3d3025',
    fontWeight: '600',
    textAlign: 'left',
  },
  framesWrap: {
    width: '100%',
    gap: 24,
  },
  paperFitSplit: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  fortuneFitCard: {
    width: 420,
    flexShrink: 0,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.14)',
    gap: 8,
  },
  fortuneFitHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  fortuneFitHeaderCopy: {
    flex: 1,
  },
  fortuneFitEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  fortuneFitTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d241d',
  },
  fortuneFitSubtitle: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: '#6e5b4a',
  },
  fortuneFitRefreshButton: {
    borderRadius: 999,
    backgroundColor: '#d8a66b',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  fortuneFitRefreshButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2f2015',
  },
  fortuneFitLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(104, 80, 58, 0.12)',
    paddingBottom: 6,
  },
  fortuneFitList: {
    maxHeight: 420,
  },
  fortuneFitListContent: {
    paddingBottom: 4,
  },
  fortuneFitHeaderCell: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#86674d',
  },
  fortuneFitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(104, 80, 58, 0.08)',
  },
  fortuneFitRowSelected: {
    backgroundColor: 'rgba(240, 212, 173, 0.28)',
  },
  fortuneFitCell: {
    fontSize: 11,
    lineHeight: 16,
    color: '#3d3025',
  },
  fortuneFitBucketColumn: {
    width: 74,
  },
  fortuneFitCharsColumn: {
    width: 38,
    textAlign: 'center',
  },
  fortuneFitTextColumn: {
    flex: 1,
  },
  fortuneFitTextPressable: {
    flex: 1,
  },
  fortuneFitTextLink: {
    textDecorationLine: 'underline',
  },
  sceneGroup: {
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  sceneFramesWrap: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  measurementStage: {
    position: 'absolute',
    left: -10000,
    top: 0,
    opacity: 0,
  },
  measurementSample: {
    flexDirection: 'row',
  },
  measurementDeviceWrap: {
    width: 420,
    height: 340,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
