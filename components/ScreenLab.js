import React, { useMemo, useState } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import FortuneHomeContent from './FortuneHomeContent';
import PreviewFrame from './PreviewFrame';
import { SCENE_LIBRARY } from '../data/scenes';

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
    label: 'iPhone SE Class',
    width: 375,
    height: 667,
    displayDiagonalInches: 4.7,
    insets: { top: 20, right: 0, bottom: 0, left: 0 },
  },
  {
    key: 'iphone14',
    label: 'iPhone 14 Class',
    width: 390,
    height: 844,
    displayDiagonalInches: 6.1,
    insets: { top: 47, right: 0, bottom: 34, left: 0 },
  },
  {
    key: 'proMax',
    label: 'Pro Max Class',
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
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isActionTrayExpanded, setIsActionTrayExpanded] = useState(false);
  const [isCreateFortuneSheetOpen, setIsCreateFortuneSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isStreakBarExpanded, setIsStreakBarExpanded] = useState(false);
  const [isKeyboardSimulated, setIsKeyboardSimulated] = useState(false);
  const [isSafeAreaSimulated, setIsSafeAreaSimulated] = useState(false);
  const [isCookieOpened, setIsCookieOpened] = useState(true);
  const [isLockWarningVisible, setIsLockWarningVisible] = useState(false);

  const previewProps = useMemo(() => ({
    canReplaceCurrentFortune: true,
    currentFortuneIsFavorite: false,
    dailyWisdomLockSeconds: isLockWarningVisible ? 32 : 0,
    dailyWisdomMessage: isLockWarningVisible ? 'Fortune cooldown active. Please wait 32 seconds.' : null,
    dailyWisdomNoticeToken: isLockWarningVisible ? 1 : 0,
    favoriteFortunes: LAB_FAVORITE_FORTUNES,
    fortuneText: FORTUNE_PRESETS[fortuneLength],
    forcedActionTrayVisible: isActionTrayExpanded,
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
    scene: SCENE_LIBRARY.apricotMorning,
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
    isStreakBarExpanded,
  ]);

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

            <View style={styles.togglesGrid}>
              <ToggleRow label="Action tray" onValueChange={setIsActionTrayExpanded} value={isActionTrayExpanded} />
              <ToggleRow label="Create sheet" onValueChange={setIsCreateFortuneSheetOpen} value={isCreateFortuneSheetOpen} />
              <ToggleRow label="Drawer" onValueChange={setIsDrawerExpanded} value={isDrawerExpanded} />
              <ToggleRow label="History" onValueChange={setIsHistorySheetOpen} value={isHistorySheetOpen} />
              <ToggleRow label="Keyboard" onValueChange={setIsKeyboardSimulated} value={isKeyboardSimulated} />
              <ToggleRow label="Lock warning" onValueChange={setIsLockWarningVisible} value={isLockWarningVisible} />
              <ToggleRow label="Open cookie" onValueChange={setIsCookieOpened} value={isCookieOpened} />
              <ToggleRow label="Safe area" onValueChange={setIsSafeAreaSimulated} value={isSafeAreaSimulated} />
              <ToggleRow label="Streak bar" onValueChange={setIsStreakBarExpanded} value={isStreakBarExpanded} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.framesWrap}>
        {PREVIEW_DEVICES.map((device) => (
          <PreviewFrame
            key={device.key}
            height={device.height}
            insets={isSafeAreaSimulated ? device.insets : { top: 0, right: 0, bottom: 0, left: 0 }}
            keyboardVisible={isKeyboardSimulated}
            label={device.label}
            visualScale={getDisplayPreviewScale(device)}
            width={device.width}
          >
            <FortuneHomeContent {...previewProps} />
          </PreviewFrame>
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
  togglesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    rowGap: 2,
    minWidth: 360,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 160,
    flexBasis: '30%',
    flexGrow: 1,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#3d3025',
    fontWeight: '600',
  },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
