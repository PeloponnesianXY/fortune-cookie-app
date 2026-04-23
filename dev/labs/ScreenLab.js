import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';

import CookieShell, { getOpenedCookieImageBottom } from '../../components/home/CookieShell';
import FortuneHomeContent from '../../components/home/FortuneHomeContent';
import PreviewFrame from '../../components/preview/PreviewFrame';
import { FORTUNES } from '../../data/fortunes/fortunesRegistry';
import { MOOD_SCENE_KEYS, SCENE_LIBRARY } from '../../data/scenes/scenes';

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
    platform: 'ios',
    width: 375,
    height: 667,
    displayDiagonalInches: 4.7,
    insets: { top: 20, right: 0, bottom: 0, left: 0 },
  },
  {
    key: 'iphone14',
    label: '6.1-inch Class, such as iPhone 14',
    platform: 'ios',
    width: 390,
    height: 844,
    displayDiagonalInches: 6.1,
    insets: { top: 47, right: 0, bottom: 34, left: 0 },
  },
  {
    key: 'iphone16',
    label: '6.1-inch Class, such as iPhone 16',
    platform: 'ios',
    width: 393,
    height: 852,
    displayDiagonalInches: 6.12,
    insets: { top: 59, right: 0, bottom: 34, left: 0 },
  },
  {
    key: 'iphone16Plus',
    label: '6.7-inch Class, such as iPhone 16 Plus',
    platform: 'ios',
    width: 430,
    height: 932,
    displayDiagonalInches: 6.69,
    insets: { top: 59, right: 0, bottom: 34, left: 0 },
  },
  {
    key: 'galaxyA56',
    label: '6.7-inch Class, such as Galaxy A56 5G',
    platform: 'android',
    width: 412,
    height: 892,
    displayDiagonalInches: 6.7,
    insets: { top: 32, right: 0, bottom: 16, left: 0 },
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

function getPreviewDeviceShortLabel(device) {
  if (device.key === 'se') {
    return 'SE';
  }

  if (device.key === 'iphone14') {
    return '14';
  }

  if (device.key === 'iphone16') {
    return '16';
  }

  if (device.key === 'iphone16Plus') {
    return '16 Plus';
  }

  if (device.key === 'galaxyA56') {
    return 'A56';
  }

  return device.label;
}

const FORTUNE_FIT_DEVICES = PREVIEW_DEVICES.map((device) => ({
  key: device.key,
  label: getPreviewDeviceShortLabel(device),
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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [selectedSceneKey, setSelectedSceneKey] = useState('sunlitAir');
  const [selectedPreviewDeviceKeys, setSelectedPreviewDeviceKeys] = useState(['galaxyA56']);
  const [isSceneLegendOpen, setIsSceneLegendOpen] = useState(false);
  const [isPaperFitOpen, setIsPaperFitOpen] = useState(false);
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
  const selectedSampleLineCounts = selectedSampleId ? (fortuneFitLineCounts[selectedSampleId] || {}) : {};
  const selectedSampleFitVerdict = getFitVerdict(selectedSampleLineCounts);
  const selectedSampleFitTone = getFitVerdictTone(selectedSampleLineCounts);
  const selectedPreviewDevices = PREVIEW_DEVICES.filter((device) => selectedPreviewDeviceKeys.includes(device.key));
  const resolvedPreviewDevices = selectedPreviewDevices.length ? selectedPreviewDevices : [PREVIEW_DEVICES[0]];
  const isDesktopLayout = windowWidth >= 1120;
  const selectedSceneLabel = SCENE_OPTIONS.find((option) => option.key === selectedSceneKey)?.label || 'Scene';
  const stageHeaderHeight = isDesktopLayout ? 112 : 92;
  const estimatedShellPadding = isDesktopLayout ? 40 : 28;
  const stageWidthEstimate = isDesktopLayout ? Math.max(520, windowWidth - 348) : Math.max(320, windowWidth - 28);
  const previewHeightBudget = Math.max(360, windowHeight - stageHeaderHeight - estimatedShellPadding);
  const previewColumns = isDesktopLayout
    ? Math.min(resolvedPreviewDevices.length, resolvedPreviewDevices.length > 2 ? 3 : 2)
    : 1;
  const previewWidthBudget = Math.max(
    280,
    Math.floor((stageWidthEstimate - 48 - ((previewColumns - 1) * 20)) / previewColumns)
  );
  const previewScale = resolvedPreviewDevices.reduce((smallestScale, device) => {
    const fittedPreviewScale = Math.min(
      getDisplayPreviewScale(device),
      previewHeightBudget / (device.height + 18),
      previewWidthBudget / (device.width + 18)
    );

    return Math.min(smallestScale, fittedPreviewScale);
  }, Number.POSITIVE_INFINITY);
  const resolvedPreviewScale = Math.max(
    isDesktopLayout ? 0.44 : 0.5,
    Math.round(previewScale * 1000) / 1000
  );

  const togglePreviewDevice = (deviceKey) => {
    setSelectedPreviewDeviceKeys((current) => {
      if (current.includes(deviceKey)) {
        return current.length === 1
          ? current
          : current.filter((key) => key !== deviceKey);
      }

      return [...current, deviceKey];
    });
  };

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
  const shouldRevealFortuneForPreview = isCookieOpened || isActionTrayExpanded;

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
    isCookieOpened: shouldRevealFortuneForPreview,
    isHydratingSelection: false,
    isPaperVisible: shouldRevealFortuneForPreview,
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
    isCreateFortuneSheetOpen,
    isDrawerExpanded,
    isHistorySheetOpen,
    isLockWarningVisible,
    isSavedToFavoritesNoticeVisible,
    isStreakBarExpanded,
    previewFortuneText,
    selectedSceneKey,
    shouldRevealFortuneForPreview,
  ]);

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
    <View style={[styles.page, { height: windowHeight }]}>
      <View style={[styles.pageContent, isDesktopLayout ? styles.pageContentDesktop : styles.pageContentCompact]}>
        <View style={[styles.layoutShell, isDesktopLayout ? styles.layoutShellDesktop : styles.layoutShellCompact]}>
          <View style={[styles.controlColumn, isDesktopLayout ? styles.controlColumnDesktop : null]}>
            <ScrollView
              contentContainerStyle={styles.controlColumnContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.sidebarSection}>
                <View style={styles.sidebarSectionHeader}>
                  <Text style={styles.sidebarSectionEyebrow}>Device</Text>
                  <Text style={styles.sidebarSectionTitle}>Preview targets</Text>
                </View>
                <View style={styles.devicePickerGrid}>
                  {PREVIEW_DEVICES.map((device) => {
                    const isActive = resolvedPreviewDevices.some((candidate) => candidate.key === device.key);

                    return (
                      <Pressable
                        key={device.key}
                        onPress={() => togglePreviewDevice(device.key)}
                        style={({ pressed }) => [
                          styles.devicePickerCard,
                          isActive ? styles.devicePickerCardActive : null,
                          pressed ? styles.devicePickerCardPressed : null,
                        ]}
                      >
                        <View style={styles.devicePickerRow}>
                          <View style={[styles.devicePickerCheckbox, isActive ? styles.devicePickerCheckboxActive : null]}>
                            {isActive ? <View style={styles.devicePickerCheckboxDot} /> : null}
                          </View>
                          <View style={styles.devicePickerCopy}>
                            <Text style={[styles.devicePickerCode, isActive ? styles.devicePickerCodeActive : null]}>
                              {getPreviewDeviceShortLabel(device)}
                            </Text>
                            <Text style={[styles.devicePickerLabel, isActive ? styles.devicePickerLabelActive : null]}>
                              {device.label.replace('6.7-inch Class, such as ', '').replace('6.1-inch Class, such as ', '').replace('4.7-inch Class, such as ', '')}
                            </Text>
                            <Text style={[styles.devicePickerMeta, isActive ? styles.devicePickerMetaActive : null]}>
                              {device.width} x {device.height} pt
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.sidebarSection}>
                <View style={styles.sidebarSectionHeader}>
                  <Text style={styles.sidebarSectionEyebrow}>State</Text>
                  <Text style={styles.sidebarSectionTitle}>UI switches</Text>
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

              <View style={styles.sidebarSection}>
                <View style={styles.sidebarSectionHeader}>
                  <Text style={styles.sidebarSectionEyebrow}>Scene</Text>
                  <Text style={styles.sidebarSectionTitle}>Color direction</Text>
                </View>
                <View style={styles.utilityButtonRow}>
                  <Pressable
                    onPress={() => setIsPaperFitOpen((current) => !current)}
                    style={({ pressed }) => [
                      styles.utilityCard,
                      pressed ? styles.utilityCardPressed : null,
                    ]}
                  >
                    <Text style={styles.utilityCardEyebrow}>Paper Fit</Text>
                    <Text style={styles.utilityCardTitle}>
                      {isPaperFitOpen ? 'Hide sampler' : 'Show sampler'}
                    </Text>
                    <View style={styles.paperFitToggleMetaRow}>
                      <Text style={styles.utilityCardMeta}>{selectedSampleFitVerdict}</Text>
                      <View
                        style={[
                          styles.paperFitToggleDot,
                          selectedSampleFitTone === 'good'
                            ? styles.paperFitToggleDotGood
                            : selectedSampleFitTone === 'bad'
                              ? styles.paperFitToggleDotBad
                              : styles.paperFitToggleDotNeutral,
                        ]}
                      />
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => setIsSceneLegendOpen((current) => !current)}
                    style={({ pressed }) => [
                      styles.utilityCard,
                      styles.utilityCardSecondary,
                      pressed ? styles.utilityCardPressed : null,
                    ]}
                  >
                    <Text style={styles.utilityCardEyebrow}>Palette</Text>
                    <Text style={styles.utilityCardTitle}>
                      {isSceneLegendOpen ? 'Hide legend' : 'Show legend'}
                    </Text>
                    <Text style={styles.utilityCardMeta}>Scene mapping</Text>
                  </Pressable>
                </View>
                <View style={styles.sceneSectionBody}>
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

              {isPaperFitOpen ? (
                <View style={styles.paperFitInlineCard}>
                  <View style={styles.fortuneFitHeader}>
                    <View style={styles.fortuneFitHeaderCopy}>
                      <Text style={styles.fortuneFitEyebrow}>Paper Fit</Text>
                      <Text style={styles.fortuneFitTitle}>10 live fortunes</Text>
                      <Text style={styles.fortuneFitSubtitle}>
                        Tap a fortune to load it into the preview.
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
                    style={styles.fortuneFitInlineList}
                    contentContainerStyle={styles.fortuneFitListContent}
                    nestedScrollEnabled
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
              ) : null}
            </ScrollView>
          </View>

          <View style={styles.previewColumn}>
            <View style={styles.previewStageCard}>
              <View style={styles.previewStageHeader}>
                <View style={styles.previewStageHeaderCopy}>
                  <Text style={styles.previewStageEyebrow}>Live Preview</Text>
                  <Text style={styles.previewStageTitle}>
                    {resolvedPreviewDevices.length === 1 ? resolvedPreviewDevices[0].label : `${resolvedPreviewDevices.length} selected screens`}
                  </Text>
                  <Text style={styles.previewStageMeta}>
                    {resolvedPreviewDevices.map((device) => getPreviewDeviceShortLabel(device)).join(', ')}
                    {'  '}|{'  '}
                    {selectedSceneLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.previewStageSurface}>
                <View style={styles.previewGrid}>
                  {resolvedPreviewDevices.map((device) => (
                    <View
                      key={device.key}
                      style={[
                        styles.previewDeviceCard,
                        isDesktopLayout ? styles.previewDeviceCardDesktop : null,
                      ]}
                    >
                      <View style={styles.previewDeviceCardHeader}>
                        <Text style={styles.previewDeviceCardTitle}>{device.label}</Text>
                        <Text style={styles.previewDeviceCardMeta}>{device.width} x {device.height} pt</Text>
                      </View>
                      <PreviewFrame
                        height={device.height}
                        insets={isSafeAreaSimulated ? device.insets : { top: 0, right: 0, bottom: 0, left: 0 }}
                        keyboardVisible={isKeyboardSimulated}
                        label={device.label}
                        previewPlatform={device.platform}
                        showHeader={false}
                        visualScale={resolvedPreviewScale}
                        width={device.width}
                      >
                        <FortuneHomeContent {...previewProps} />
                      </PreviewFrame>
                    </View>
                  ))}
                </View>
              </View>
            </View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#eadfce',
  },
  pageContent: {
    flex: 1,
  },
  pageContentDesktop: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  pageContentCompact: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  layoutShell: {
    flex: 1,
    gap: 18,
  },
  layoutShellDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  layoutShellCompact: {
    flexDirection: 'column',
  },
  controlColumn: {
    borderRadius: 28,
    backgroundColor: 'rgba(255, 250, 244, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(110, 82, 58, 0.1)',
    shadowColor: '#5e4631',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
    overflow: 'hidden',
  },
  controlColumnDesktop: {
    width: 248,
  },
  controlColumnContent: {
    padding: 10,
    gap: 8,
  },
  sidebarSection: {
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: 'rgba(110, 82, 58, 0.09)',
    gap: 12,
  },
  sidebarSectionHeader: {
    gap: 2,
  },
  sidebarSectionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#98745b',
  },
  sidebarSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#342821',
    ...(Platform.OS === 'web' ? { fontFamily: 'Georgia' } : null),
  },
  devicePickerGrid: {
    gap: 6,
  },
  devicePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  devicePickerCheckbox: {
    width: 18,
    height: 18,
    marginTop: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(122, 90, 64, 0.22)',
    backgroundColor: 'rgba(255, 252, 247, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicePickerCheckboxActive: {
    borderColor: 'rgba(255, 247, 239, 0.68)',
    backgroundColor: 'rgba(255, 247, 239, 0.14)',
  },
  devicePickerCheckboxDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#fff7ef',
  },
  devicePickerCopy: {
    flex: 1,
    minWidth: 0,
  },
  devicePickerCard: {
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: '#f7efe5',
    borderWidth: 1,
    borderColor: 'rgba(122, 90, 64, 0.1)',
    gap: 0,
  },
  devicePickerCardActive: {
    backgroundColor: '#2f241d',
    borderColor: '#2f241d',
  },
  devicePickerCardPressed: {
    opacity: 0.88,
  },
  devicePickerCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2f241d',
  },
  devicePickerCodeActive: {
    color: '#fff7ef',
  },
  devicePickerLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: '#6f5948',
    fontWeight: '600',
  },
  devicePickerLabelActive: {
    color: 'rgba(255, 247, 239, 0.88)',
  },
  devicePickerMeta: {
    fontSize: 9.5,
    color: '#957a67',
    fontWeight: '600',
  },
  devicePickerMetaActive: {
    color: 'rgba(255, 247, 239, 0.68)',
  },
  utilityButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  utilityCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f5ebdb',
    borderWidth: 1,
    borderColor: 'rgba(155, 116, 81, 0.14)',
    gap: 4,
  },
  utilityCardSecondary: {
    backgroundColor: '#f8f1e6',
  },
  utilityCardPressed: {
    opacity: 0.88,
  },
  utilityCardEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#94735b',
  },
  utilityCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3d2f26',
    ...(Platform.OS === 'web' ? { fontFamily: 'Georgia' } : null),
  },
  utilityCardMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#705a48',
  },
  paperFitToggleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  paperFitToggleMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7a6655',
  },
  sceneSectionBody: {
    gap: 12,
  },
  paperFitToggleDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  paperFitToggleDotGood: {
    backgroundColor: '#6ca36b',
  },
  paperFitToggleDotBad: {
    backgroundColor: '#c3755f',
  },
  paperFitToggleDotNeutral: {
    backgroundColor: '#b6a694',
  },
  sceneRows: {
    gap: 8,
    minWidth: 0,
  },
  sceneTopGroupsRow: {
    gap: 8,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  sceneTopGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sceneTopGroupUnknown: {
    marginLeft: 0,
  },
  sceneLegendCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#f9f3ea',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
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
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#92725a',
    width: 116,
    paddingTop: 6,
    textAlign: 'left',
  },
  sceneOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-start',
  },
  sceneOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f6ecdf',
    borderWidth: 1,
    borderColor: 'rgba(136, 102, 72, 0.16)',
    color: '#5a4535',
    fontSize: 11,
    fontWeight: '700',
  },
  sceneOptionActive: {
    backgroundColor: '#2f241d',
    borderColor: '#2f241d',
    color: '#fff7ef',
  },
  togglesGrid: {
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f8f1e7',
    borderWidth: 1,
    borderColor: 'rgba(110, 82, 58, 0.08)',
  },
  toggleLabel: {
    flex: 1,
    marginRight: 10,
    fontSize: 13,
    color: '#3d3025',
    fontWeight: '600',
    textAlign: 'left',
  },
  previewColumn: {
    flex: 1,
    minWidth: 0,
  },
  previewStageCard: {
    flex: 1,
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: 'rgba(250, 244, 235, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(110, 82, 58, 0.1)',
    shadowColor: '#5e4631',
    shadowOpacity: 0.08,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 5,
    gap: 10,
  },
  previewStageHeader: {
    paddingHorizontal: 6,
    gap: 2,
  },
  previewStageHeaderCopy: {
    gap: 4,
  },
  previewStageEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#8d6e58',
  },
  previewStageTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: '#3d2c1e',
    ...(Platform.OS === 'web' ? { fontFamily: 'Georgia' } : null),
  },
  previewStageMeta: {
    fontSize: 13,
    color: '#7d6654',
    fontWeight: '600',
  },
  previewStageSurface: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 229, 214, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(132, 99, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  previewStageSurfaceContent: {
    flexGrow: 1,
  },
  previewGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 20,
  },
  previewDeviceCard: {
    alignItems: 'center',
    gap: 10,
  },
  previewDeviceCardDesktop: {
    minWidth: 280,
  },
  previewDeviceCardHeader: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
  },
  previewDeviceCardTitle: {
    color: '#3d2c1e',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    ...(Platform.OS === 'web' ? { fontFamily: 'Georgia' } : null),
  },
  previewDeviceCardMeta: {
    color: '#7d6654',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  framesWrap: {
    width: '100%',
    gap: 24,
  },
  sceneFramesDock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  deviceRail: {
    width: 112,
    borderRadius: 16,
    padding: 10,
    gap: 8,
    backgroundColor: 'rgba(255, 248, 240, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
    alignSelf: 'stretch',
  },
  deviceRailEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#7b6351',
  },
  deviceRailButton: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f7eee3',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.1)',
    gap: 2,
  },
  deviceRailButtonActive: {
    backgroundColor: '#2f241c',
    borderColor: '#2f241c',
  },
  deviceRailButtonPressed: {
    opacity: 0.85,
  },
  deviceRailButtonTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2f241c',
  },
  deviceRailButtonTitleActive: {
    color: '#fff8ef',
  },
  deviceRailButtonMeta: {
    fontSize: 11,
    color: '#7d6756',
  },
  deviceRailButtonMetaActive: {
    color: 'rgba(255, 248, 239, 0.72)',
  },
  paperFitInlineCard: {
    width: '100%',
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
  fortuneFitInlineList: {
    maxHeight: 240,
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
  sceneFramesScroller: {
    width: '100%',
  },
  sceneFramesScrollerContent: {
    paddingRight: 24,
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
