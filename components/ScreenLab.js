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
      <Switch onValueChange={onValueChange} value={value} />
    </View>
  );
}

export default function ScreenLab() {
  const [fortuneLength, setFortuneLength] = useState('medium');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isActionTrayExpanded, setIsActionTrayExpanded] = useState(true);
  const [isCreateFortuneSheetOpen, setIsCreateFortuneSheetOpen] = useState(false);
  const [isStreakBarExpanded, setIsStreakBarExpanded] = useState(false);
  const [isKeyboardSimulated, setIsKeyboardSimulated] = useState(false);
  const [isSafeAreaSimulated, setIsSafeAreaSimulated] = useState(true);

  const previewProps = useMemo(() => ({
    canReplaceCurrentFortune: true,
    currentFortuneIsFavorite: false,
    dailyWisdomLockSeconds: 0,
    dailyWisdomMessage: null,
    dailyWisdomNoticeToken: 0,
    favoriteFortunes: [],
    fortuneText: FORTUNE_PRESETS[fortuneLength],
    forcedActionTrayVisible: isActionTrayExpanded,
    forcedCustomFortuneSheetVisible: isCreateFortuneSheetOpen,
    forcedDrawerOpen: isDrawerExpanded,
    historyFortunes: [],
    isAnimating: false,
    isCookieOpened: true,
    isHydratingSelection: false,
    isPaperVisible: true,
    isPreparingNextFortune: false,
    moodInput: 'curious',
    onBeginMoodEntry: () => {},
    onMoodChange: () => {},
    onRemoveFavorite: () => {},
    onRequestReplace: () => {},
    onShareSavedFortune: () => {},
    onShareFortune: () => {},
    onSubmitMoodInput: () => {},
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
  }), [fortuneLength, isActionTrayExpanded, isCreateFortuneSheetOpen, isDrawerExpanded, isStreakBarExpanded]);

  return (
    <ScrollView
      contentContainerStyle={styles.pageContent}
      style={styles.page}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.controlsWrap}>
        <View style={styles.controlsCard}>
          <Text style={styles.eyebrow}>Developer Preview</Text>
          <Text style={styles.title}>Screen Lab</Text>
          <Text style={styles.subtitle}>
            Open this locally at `/screen-lab` while `expo start --web` is running.
          </Text>

          <View style={styles.controlsGrid}>
            <View style={styles.controlBlock}>
              <Text style={styles.controlLabel}>Fortune Length</Text>
              <SegmentedControl
                onChange={setFortuneLength}
                options={[
                  { label: 'Short', value: 'short' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Long', value: 'long' },
                ]}
                value={fortuneLength}
              />
            </View>

            <View style={styles.controlBlock}>
              <Text style={styles.controlLabel}>Stress Tests</Text>
              <ToggleRow
                label="Top drawer expanded"
                onValueChange={setIsDrawerExpanded}
                value={isDrawerExpanded}
              />
              <ToggleRow
                label="Action tray expanded"
                onValueChange={setIsActionTrayExpanded}
                value={isActionTrayExpanded}
              />
              <ToggleRow
                label="Create fortune sheet"
                onValueChange={setIsCreateFortuneSheetOpen}
                value={isCreateFortuneSheetOpen}
              />
              <ToggleRow
                label="Streak bar expanded"
                onValueChange={setIsStreakBarExpanded}
                value={isStreakBarExpanded}
              />
              <ToggleRow
                label="Keyboard simulation"
                onValueChange={setIsKeyboardSimulated}
                value={isKeyboardSimulated}
              />
              <ToggleRow
                label="Safe area simulation"
                onValueChange={setIsSafeAreaSimulated}
                value={isSafeAreaSimulated}
              />
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
    paddingTop: 18,
    paddingBottom: 32,
    gap: 24,
  },
  controlsWrap: {
    zIndex: 10,
  },
  controlsCard: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 20,
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
          top: 16,
          backdropFilter: 'blur(12px)',
        }
      : null),
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#9a6f48',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#2d241d',
  },
  subtitle: {
    marginTop: 6,
    color: '#6c5a4b',
    fontSize: 14,
    lineHeight: 20,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 18,
  },
  controlBlock: {
    minWidth: 280,
    flexGrow: 1,
    gap: 12,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#7a6655',
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  segmentedOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#f5ecdf',
    borderWidth: 1,
    borderColor: 'rgba(136, 102, 72, 0.16)',
    color: '#5b4534',
    fontWeight: '700',
  },
  segmentedOptionActive: {
    backgroundColor: '#f0d4ad',
    borderColor: '#d8a66b',
    color: '#3d2c1e',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 40,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 14,
    color: '#3d3025',
    fontWeight: '600',
  },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
