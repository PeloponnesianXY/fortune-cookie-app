import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import CookieShell, { COOKIE_SHELL_FRAME, getOpenedCookieImageBottom } from './CookieShell';
import CreatedFortunesSheet from '../sheets/CreatedFortunesSheet';
import CustomFortuneSheet from '../sheets/CustomFortuneSheet';
import DrawerItem from './DrawerItem';
import DrawerSection from './DrawerSection';
import FortuneActionTray from './FortuneActionTray';
import FortuneLibrarySheet from '../sheets/FortuneLibrarySheet';
import StreakStatus from './StreakStatus';
import { usePreviewLayout } from '../preview/PreviewLayoutContext';
import {
  buildCreatedFortuneSections,
  clearAllCustomFortunes,
  deleteCustomFortune,
  formatMoodBucketLabel,
  loadCustomFortunes,
  saveCustomFortune,
  updateCustomFortune,
} from '../../utils/customFortunes';
import { MOOD_BUCKET_KEYS } from '../../utils/fortuneLogic';
import appConfig from '../../app.json';

const CONTENT_FRAME_PADDING_BOTTOM = 20;
const APP_VERSION = appConfig?.expo?.version || '1.0.2';
// Master prompt sits in a flex column with a tall cookieSection minHeight; overflow can ignore
// contentFrame padding. Pin the prompt above the gesture area on Android instead of flex-end.
const ANDROID_MASTER_PROMPT_BOTTOM_GAP = 12;
const ANDROID_MASTER_PROMPT_BOTTOM_INSET_MIN = 28;

const SUPPORT_URL = 'https://fortunecookieappsupport.netlify.app/';
const BASE_CONTENT_MAX_WIDTH = 540;
const SE_BASELINE_USABLE_HEIGHT = 647;
const COOKIE_DROP_FACTOR = 0.08;
const MAX_COOKIE_DROP = 18;
const PROMPT_LIFT_FACTOR = 0.22;
const MAX_PROMPT_BOTTOM_INSET = 44;
const ACTION_TRAY_IMAGE_GAP_FACTOR = 0.005;
const MIN_ACTION_TRAY_IMAGE_GAP = 0;
const MAX_ACTION_TRAY_IMAGE_GAP = 2;
const ACTION_TRAY_VISUAL_LIFT_FACTOR = 0.78;
const MIN_ACTION_TRAY_VISUAL_LIFT = 62;
const MAX_ACTION_TRAY_VISUAL_LIFT = 80;
const ACTION_TRAY_ROOMINESS_GAP_FACTOR = 0.065;
const MAX_ACTION_TRAY_ROOMINESS_GAP = 30;
const COOKIE_ROOMINESS_DROP_FACTOR = 0.16;
const COOKIE_ROOMINESS_CURVE_FACTOR = 0.0003;
const MAX_COOKIE_ROOMINESS_DROP = 110;
const TALL_ANDROID_ACTION_TRAY_DROP = 8;
const TALL_ANDROID_PAPER_LIFT = 18;
const TALL_ANDROID_CUSTOM_NOTICE_LIFT = 40;
const GLOBAL_CUSTOM_NOTICE_LIFT = 14;
const LOCK_ALERT_NOTICE_CLEARANCE = 54;
const TALL_ANDROID_LOCK_ALERT_NOTICE_CLEARANCE = 76;
const SAVED_NOTICE_SUN_GAP = 36;
const IOS_SIX_ONE_PAPER_LIFT = 40;
const CREATE_FORTUNE_TOP_GAP_FACTOR = 0.014;
const MIN_CREATE_FORTUNE_TOP_GAP = 10;
const MAX_CREATE_FORTUNE_TOP_GAP = 18;
const ESTIMATED_CREATE_FORTUNE_COLLAPSED_HEIGHT = 156;
const CUSTOM_NOTICE_GAP_FACTOR = 0.018;
const MIN_CUSTOM_NOTICE_GAP = 10;
const MAX_CUSTOM_NOTICE_GAP = 18;
const SE_CUSTOM_NOTICE_LIFT = 30;

const CREATE_FORTUNE_MOOD_SECTIONS = [
  {
    key: 'positive',
    label: 'Good',
    moods: [
      'calm',
      'caring',
      'confident',
      'engaged',
      'grateful',
      'happy',
      'hopeful',
      'proud',
      'romantic',
      'wowed',
    ],
  },
  {
    key: 'negative',
    label: 'Not great',
    moods: [
      'angry',
      'anxious',
      'embarrassed',
      'frustrated',
      'jealous',
      'numb',
      'sad',
      'shaken',
      'tired',
      'wired',
    ],
  },
  {
    key: 'neutral',
    label: 'Could go either way',
    moods: [
      'bored',
      'confused',
      'emotional',
      'neutral',
    ],
  },
].map((section) => {
  const options = section.moods
    .map((key) => ({
      key,
      label: formatMoodBucketLabel(key),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return {
    ...section,
    options,
  };
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createCustomFavoriteRecord(moodKey, fortuneText) {
  const normalizedId = `${moodKey}:${fortuneText.trim().toLowerCase().replace(/\s+/g, '-')}`;

  return {
    id: `custom-fortune:${normalizedId}`,
    text: fortuneText,
    mood: formatMoodBucketLabel(moodKey),
    category: moodKey,
    createdAt: new Date().toISOString(),
    isFavorite: true,
    favoritedAt: null,
  };
}

function getLayoutMode(width, usableHeight) {
  if (usableHeight < 670) {
    return 'veryCompact';
  }

  if (usableHeight < 720 || width < 375) {
    return 'compact';
  }

  if (usableHeight > 810) {
    return 'roomy';
  }

  return 'standard';
}

function createLayoutMetrics(width, height, insets = { top: 0, bottom: 0 }, platform = Platform.OS) {
  const rawUsableHeight = height - (insets.top || 0) - (insets.bottom || 0);
  const isIosSixOneClass = platform === 'ios'
    && width >= 390
    && width <= 393
    && rawUsableHeight >= 758
    && rawUsableHeight <= 764;
  const metricWidth = isIosSixOneClass ? 390 : width;
  const usableHeight = isIosSixOneClass ? 763 : rawUsableHeight;
  const layoutMode = getLayoutMode(metricWidth, usableHeight);
  const isVeryCompact = layoutMode === 'veryCompact';
  const isCompact = layoutMode === 'compact' || isVeryCompact;
  const isRoomy = layoutMode === 'roomy';
  const isAndroid = platform === 'android';
  const isTallAndroidPhone = isAndroid && isRoomy && metricWidth >= 390;
  const extraUsableHeight = Math.max(0, usableHeight - SE_BASELINE_USABLE_HEIGHT);
  const horizontalPadding = clamp(Math.round(metricWidth * 0.055), 14, 24);
  const contentMaxWidth = Math.min(BASE_CONTENT_MAX_WIDTH, metricWidth - horizontalPadding * 2);
  const menuButtonSize = isVeryCompact ? 34 : isCompact ? 36 : isRoomy ? 42 : 38;
  const menuButtonRadius = Math.round(menuButtonSize * 0.37);
  const menuLineWidth = Math.round(menuButtonSize * 0.42);
  const menuLineHeight = isVeryCompact ? 1.4 : 1.5;
  const menuGap = isVeryCompact ? 3 : 4;
  const streakScale = isVeryCompact ? 0.9 : isCompact ? 0.94 : isRoomy ? 1.04 : 1;
  const streakRightNudge = isVeryCompact ? 8 : 0;
  const streakAvailableWidth = metricWidth - horizontalPadding * 2 - menuButtonSize - 12;
  const streakCollapsedWidth = clamp(Math.round(streakAvailableWidth * 0.64), 160, 204);
  const streakExpandedWidth = clamp(Math.round(streakAvailableWidth), 246, 304);
  const headerTop = isVeryCompact ? 10 : isCompact ? 12 : isRoomy ? 22 : 18;
  const cookieScale = isVeryCompact
    ? 0.84
    : isCompact
      ? 0.8
      : isTallAndroidPhone
        ? 0.92
        : isRoomy
          ? 0.98
          : 0.88;
  const cookieFrameHeight = Math.round(COOKIE_SHELL_FRAME.height * cookieScale);
  const cookieStageMinHeight = isVeryCompact
    ? cookieFrameHeight + 10
    : isCompact
      ? cookieFrameHeight + 18
      : isRoomy
        ? cookieFrameHeight + 34
        : cookieFrameHeight + 24;
  const promptGap = isVeryCompact ? 8 : isCompact ? 10 : isRoomy ? 18 : 14;
  const promptBottomInset = clamp(
    Math.round(extraUsableHeight * PROMPT_LIFT_FACTOR),
    0,
    MAX_PROMPT_BOTTOM_INSET
  ) + (isVeryCompact ? 8 : 0) - (isVeryCompact ? 0 : isCompact ? 0 : isRoomy ? 0 : 22);
  const cookieImageOffset = clamp(
    Math.round(extraUsableHeight * COOKIE_DROP_FACTOR),
    0,
    MAX_COOKIE_DROP
  ) - (isVeryCompact ? 0 : isCompact ? 0 : isRoomy ? 0 : 20);
  const cookieImageBottom = getOpenedCookieImageBottom(cookieScale, cookieImageOffset);
  const actionTrayImageGap = clamp(
    Math.round(usableHeight * ACTION_TRAY_IMAGE_GAP_FACTOR),
    MIN_ACTION_TRAY_IMAGE_GAP,
    MAX_ACTION_TRAY_IMAGE_GAP
  );
  const actionTrayRoominessGap = clamp(
    Math.round(extraUsableHeight * ACTION_TRAY_ROOMINESS_GAP_FACTOR),
    0,
    MAX_ACTION_TRAY_ROOMINESS_GAP
  ) - (isTallAndroidPhone ? 8 : 0);
  const promptFloatClearance = isVeryCompact ? 76 : isCompact ? 62 : isRoomy ? 74 : 68;
  const actionTrayEstimatedHeight = isVeryCompact ? 88 : isCompact ? 92 : isRoomy ? 100 : 96;
  const actionTrayVisualLift = clamp(
    Math.round(actionTrayEstimatedHeight * ACTION_TRAY_VISUAL_LIFT_FACTOR),
    MIN_ACTION_TRAY_VISUAL_LIFT,
    MAX_ACTION_TRAY_VISUAL_LIFT
  );
  const actionTrayTop = Math.round(
    cookieImageBottom + actionTrayImageGap + actionTrayRoominessGap - actionTrayVisualLift
  ) + (isTallAndroidPhone ? TALL_ANDROID_ACTION_TRAY_DROP : 0);
  const dailyWisdomSlotHeight = isVeryCompact
    ? 80
    : isCompact
      ? 88
      : isTallAndroidPhone
        ? 104
        : isRoomy
          ? 124
          : 104;
  const dailyWisdomBottom = isVeryCompact
    ? 66
    : isCompact
      ? 52
      : isTallAndroidPhone
        ? 72
        : isRoomy
          ? 86
          : 92;
  const cookieRoominessDrop = clamp(
    Math.round(
      extraUsableHeight * COOKIE_ROOMINESS_DROP_FACTOR
      + extraUsableHeight * extraUsableHeight * COOKIE_ROOMINESS_CURVE_FACTOR
    ),
    0,
    MAX_COOKIE_ROOMINESS_DROP
  );
  const cookieCenterHeightBasis = isIosSixOneClass ? usableHeight : height;
  const desiredCookieCenterY = Math.round(cookieCenterHeightBasis * (isTallAndroidPhone ? 0.515 : 0.62))
    + Math.round(cookieRoominessDrop * (isTallAndroidPhone ? 0.18 : 1));
  const maxCookieTopSpacing = 172 + clamp(Math.round(extraUsableHeight * 0.3), 0, 72);
  const cookieTopSpacing = clamp(
    Math.round(desiredCookieCenterY - dailyWisdomSlotHeight - cookieFrameHeight / 2),
    56,
    maxCookieTopSpacing
  );
  const createFortuneTopGap = clamp(
    Math.round(usableHeight * CREATE_FORTUNE_TOP_GAP_FACTOR),
    MIN_CREATE_FORTUNE_TOP_GAP,
    MAX_CREATE_FORTUNE_TOP_GAP
  );
  const streakHeaderHeight = Math.round(48 * streakScale);
  const headerChromeClearance = Math.max(menuButtonSize, streakHeaderHeight);
  const createFortuneTopAnchor = headerTop + headerChromeClearance + createFortuneTopGap;
  const customNoticeGap = clamp(
    Math.round(usableHeight * CUSTOM_NOTICE_GAP_FACTOR),
    MIN_CUSTOM_NOTICE_GAP,
    MAX_CUSTOM_NOTICE_GAP
  );
  const customNoticeTop = createFortuneTopAnchor + ESTIMATED_CREATE_FORTUNE_COLLAPSED_HEIGHT + customNoticeGap
    - GLOBAL_CUSTOM_NOTICE_LIFT
    - (isVeryCompact ? SE_CUSTOM_NOTICE_LIFT : 0)
    - (isTallAndroidPhone ? TALL_ANDROID_CUSTOM_NOTICE_LIFT : 0)
    + (isVeryCompact ? 12 : isCompact ? 10 : isRoomy ? 16 : 14);
  const keyboardOffset = isVeryCompact ? 108 : isCompact ? 118 : 132;
  const topGlowHeight = isVeryCompact ? 226 : isCompact ? 252 : isRoomy ? 356 : 304;
  const topGlowTop = isVeryCompact ? -56 : isCompact ? -64 : isRoomy ? -92 : -78;
  const haloSize = isVeryCompact ? 88 : isCompact ? 102 : isRoomy ? 136 : 118;
  const discSize = isVeryCompact ? 38 : isCompact ? 44 : isRoomy ? 58 : 50;
  const cloudWidth = isVeryCompact ? 92 : isCompact ? 110 : isRoomy ? 154 : 132;
  const cloudHeight = Math.round(cloudWidth * 0.2);
  const scene = {
    topGlow: {
      top: topGlowTop,
      left: -horizontalPadding,
      right: -horizontalPadding,
      height: topGlowHeight,
      borderBottomLeftRadius: Math.round(topGlowHeight * 0.66),
      borderBottomRightRadius: Math.round(topGlowHeight * 0.66),
    },
    sunHalo: {
      top: isVeryCompact ? 66 : isCompact ? 72 : isRoomy ? 86 : 78,
      right: isVeryCompact ? 20 : isCompact ? 28 : isRoomy ? 50 : 40,
      width: haloSize,
      height: haloSize,
    },
    sunDisc: {
      top: isVeryCompact ? 92 : isCompact ? 104 : isRoomy ? 124 : 114,
      right: isVeryCompact ? 46 : isCompact ? 56 : isRoomy ? 86 : 76,
      width: discSize,
      height: discSize,
    },
    cloud: {
      top: isVeryCompact ? 176 : isCompact ? 194 : isRoomy ? 244 : 216,
      right: isVeryCompact ? 12 : isCompact ? 20 : isRoomy ? 36 : 28,
      width: cloudWidth,
      height: cloudHeight,
    },
  };

  return {
    actionTrayEstimatedHeight,
    actionTrayTop,
    contentMaxWidth,
    createFortuneTopAnchor,
    customNoticeTop,
    cookieImageOffset,
    cookieScale,
    cookieStageMinHeight,
    cookieTopSpacing,
    dailyWisdomBottom,
    dailyWisdomSlotHeight,
    headerTop,
    horizontalPadding,
    keyboardOffset,
    layoutMode,
    menuButtonRadius,
    menuButtonSize,
    menuGap,
    menuLineHeight,
    menuLineWidth,
    promptFloatClearance,
    promptBottomInset,
    promptGap,
    paperLift: isIosSixOneClass
      ? IOS_SIX_ONE_PAPER_LIFT
      : isTallAndroidPhone
        ? TALL_ANDROID_PAPER_LIFT
        : isVeryCompact
          ? 0
          : isCompact
            ? 0
            : isRoomy
              ? 0
              : 28,
    promptSectionOffset: isVeryCompact ? -16 : 0,
    scene,
    streakCollapsedWidth,
    streakExpandedWidth,
    streakScale,
    streakRightNudge,
  };
}

const SceneBackdrop = memo(function SceneBackdrop({ metrics, scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.topGlow, metrics.scene.topGlow, { backgroundColor: scene.wash }]} />
      <View style={[styles.sunHalo, metrics.scene.sunHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.sunDisc, metrics.scene.sunDisc, { backgroundColor: scene.celestial }]} />
      <View style={[styles.cloud, metrics.scene.cloud, { backgroundColor: scene.cloud }]} />
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
  fortuneText,
  imageVerticalOffset,
  isCookieOpened,
  isPaperVisible,
  onPress,
  paperCueProgress,
  paperLift,
  paperProgress,
  shellProgress,
  shellScale,
  stageMinHeight,
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
  const isCookieTapEnabled = Boolean(isPaperVisible && onPress);

  return (
    <View style={[styles.cookieStage, { minHeight: stageMinHeight }]}>
      <View
        accessible={isCookieTapEnabled}
        accessibilityRole={isCookieTapEnabled ? 'button' : undefined}
        focusable={false}
        onResponderRelease={isCookieTapEnabled ? onPress : undefined}
        onStartShouldSetResponder={() => isCookieTapEnabled}
        style={styles.cookieTapArea}
      >
        <Animated.View style={[styles.cookieImageFrame, cookieLiftStyle]}>
          <CookieShell
            fortuneText={fortuneText}
            imageVerticalOffset={imageVerticalOffset}
            isOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            paperLift={paperLift}
            scale={shellScale}
            paperCueProgress={paperCueProgress}
            paperProgress={paperProgress}
            shellProgress={shellProgress}
          />
        </Animated.View>
      </View>
    </View>
  );
});

export default function FortuneCard({
  canReplaceCurrentFortune,
  currentFortuneIsFavorite,
  dailyWisdomLockSeconds,
  dailyWisdomMessage,
  dailyWisdomNoticeToken,
  favoriteFortunes,
  fortuneText,
  forcedActionTrayVisible,
  forcedCustomFortuneNotice,
  forcedCustomFortuneSheetVisible,
  forcedDrawerOpen,
  forcedLibraryOpen,
  historyFortunes,
  isCookieOpened,
  isHydratingSelection,
  isPaperVisible,
  moodInput,
  onBeginMoodEntry,
  onMoodChange,
  onRemoveFavorite,
  onRequestReplace,
  onSaveCreatedFortuneFavorite,
  onShareSavedFortune,
  onShareFortune,
  onSubmitMoodInput,
  onTriggerSafetyLock,
  onToggleSavedFavorite,
  onToggleFavorite,
  paperProgress,
  scene,
  shellProgress,
  streakCelebrationToken,
  streakCount,
  streakDaysToNextTier,
  streakForcedExpanded,
  streakNextTierTitle,
  streakTierTitle,
}) {
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDailyWisdomLockActive, setIsDailyWisdomLockActive] = useState(false);
  const [isDailyWisdomVisible, setIsDailyWisdomVisible] = useState(Boolean(dailyWisdomMessage));
  const [isActionTrayVisible, setIsActionTrayVisible] = useState(false);
  const [isCustomFortuneSheetVisible, setIsCustomFortuneSheetVisible] = useState(false);
  const [isCreatedFortunesSheetVisible, setIsCreatedFortunesSheetVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [customFortuneError, setCustomFortuneError] = useState('');
  const [isSavingCustomFortune, setIsSavingCustomFortune] = useState(false);
  const [customFortuneNotice, setCustomFortuneNotice] = useState('');
  const [createdFortuneSections, setCreatedFortuneSections] = useState([]);
  const [editingCustomFortune, setEditingCustomFortune] = useState(null);
  const [actionTrayHeight, setActionTrayHeight] = useState(0);
  const previewLayout = usePreviewLayout();
  const viewportHeight = previewLayout.height;
  const viewportWidth = previewLayout.width;
  const drawerProgress = useRef(new Animated.Value(0)).current;
  const dailyWisdomProgress = useRef(new Animated.Value(dailyWisdomMessage ? 1 : 0)).current;
  const paperCueProgress = useRef(new Animated.Value(0)).current;
  const idleKeyboardTimerRef = useRef(null);
  const dailyWisdomTimerRef = useRef(null);
  const dailyWisdomShowTimerRef = useRef(null);
  const actionTrayTimerRef = useRef(null);
  const paperCueLoopRef = useRef(null);
  const customFortuneNoticeTimerRef = useRef(null);
  const promptLiftProgress = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const metrics = useMemo(
    () => createLayoutMetrics(viewportWidth, viewportHeight, previewLayout.insets, previewLayout.platform),
    [previewLayout.insets, previewLayout.platform, viewportHeight, viewportWidth]
  );
  const simulatedKeyboardPlatform = previewLayout.platform || Platform.OS;
  const simulatedKeyboardHeight = simulatedKeyboardPlatform === 'ios'
    ? clamp(Math.round(viewportHeight * 0.215), 168, 208)
    : clamp(Math.round(viewportHeight * 0.31), 180, 286);
  const drawerWidth = Math.min(Math.round(viewportWidth * 0.68), 276);
  const isFortuneRevealed = Boolean(isPaperVisible && fortuneText);
  const isDrawerForced = typeof forcedDrawerOpen === 'boolean';
  const isActionTrayForced = typeof forcedActionTrayVisible === 'boolean';
  const isCustomFortuneSheetForced = typeof forcedCustomFortuneSheetVisible === 'boolean';
  const isLibraryForced = forcedLibraryOpen === 'history' || forcedLibraryOpen === 'favorites';
  const effectiveKeyboardVisible = previewLayout.keyboardVisible ?? isKeyboardVisible;
  const isDrawerShown = isDrawerForced ? forcedDrawerOpen : isDrawerOpen;
  const resolvedActiveLibrary = isLibraryForced ? (activeLibrary || forcedLibraryOpen) : activeLibrary;
  const actionTrayVisible = isActionTrayForced ? forcedActionTrayVisible : isActionTrayVisible;
  const customFortuneSheetVisible = isCustomFortuneSheetForced
    ? forcedCustomFortuneSheetVisible
    : isCustomFortuneSheetVisible;
  const resolvedCustomFortuneNotice = forcedCustomFortuneNotice ?? customFortuneNotice;
  const shouldLiftMasterPrompt = effectiveKeyboardVisible && !customFortuneSheetVisible;
  const shouldShowSimulatedKeyboard = Boolean(previewLayout.isPreview && effectiveKeyboardVisible);
  const resolvedActionTrayHeight = actionTrayHeight || metrics.actionTrayEstimatedHeight;
  const cookieSectionMinHeight = metrics.actionTrayTop + resolvedActionTrayHeight;
  const customFortuneNoticeTop = metrics.scene.sunDisc.top - SAVED_NOTICE_SUN_GAP;
  const isPromptTemporarilyLocked = isDailyWisdomLockActive;
  const drawerPalette = {
    panel: '#fff8f1',
    border: 'rgba(111, 75, 48, 0.18)',
    title: 'rgba(91, 63, 41, 0.72)',
    itemFill: '#fffdf9',
    itemBorder: 'rgba(128, 89, 58, 0.18)',
    text: '#3f2c20',
    detail: '#75543d',
    motif: 'rgba(159, 114, 80, 0.22)',
  };
  const actionTrayPalette = {
    card: 'rgba(255, 250, 243, 0.96)',
    cardBorder: 'rgba(138, 98, 67, 0.18)',
    label: scene.accent,
    text: scene.textPrimary,
    strongText: '#4c331f',
    buttonFill: scene.input,
    buttonBorder: 'rgba(140, 104, 76, 0.18)',
    primaryFill: '#f6d8b4',
    primaryBorder: '#ddb17a',
    accentFill: '#f4e7da',
    accentBorder: 'rgba(163, 117, 80, 0.22)',
  };
  function clearIdleKeyboardTimer() {
    if (idleKeyboardTimerRef.current) {
      clearTimeout(idleKeyboardTimerRef.current);
      idleKeyboardTimerRef.current = null;
    }
  }

  function clearDailyWisdomTimer() {
    if (dailyWisdomTimerRef.current) {
      clearTimeout(dailyWisdomTimerRef.current);
      dailyWisdomTimerRef.current = null;
    }
  }

  function clearDailyWisdomShowTimer() {
    if (dailyWisdomShowTimerRef.current) {
      clearTimeout(dailyWisdomShowTimerRef.current);
      dailyWisdomShowTimerRef.current = null;
    }
  }

  function clearActionTrayTimer() {
    if (actionTrayTimerRef.current) {
      clearTimeout(actionTrayTimerRef.current);
      actionTrayTimerRef.current = null;
    }
  }

  function clearCustomFortuneNoticeTimer() {
    if (customFortuneNoticeTimerRef.current) {
      clearTimeout(customFortuneNoticeTimerRef.current);
      customFortuneNoticeTimerRef.current = null;
    }
  }

  function showCustomFortuneNotice(message) {
    clearCustomFortuneNoticeTimer();
    setCustomFortuneNotice(message);
    customFortuneNoticeTimerRef.current = setTimeout(() => {
      setCustomFortuneNotice('');
      customFortuneNoticeTimerRef.current = null;
    }, 2200);
  }

  async function refreshCreatedFortunes() {
    const fortunes = await loadCustomFortunes();
    setCreatedFortuneSections(buildCreatedFortuneSections(fortunes));
  }

  function hideActionTray() {
    clearActionTrayTimer();
    setIsActionTrayVisible(false);
  }

  function showActionTrayTemporarily() {
    clearActionTrayTimer();
    setIsActionTrayVisible(true);
    actionTrayTimerRef.current = setTimeout(() => {
      setIsActionTrayVisible(false);
      actionTrayTimerRef.current = null;
    }, 2000);
  }

  function handleActionTrayLayout(event) {
    const nextHeight = Math.round(event.nativeEvent.layout.height);

    if (nextHeight > 0 && nextHeight !== actionTrayHeight) {
      setActionTrayHeight(nextHeight);
    }
  }

  function openLibrary(library) {
    setActiveLibrary(library);
  }

  function dismissMasterPromptKeyboardImmediately() {
    clearIdleKeyboardTimer();
    Keyboard.dismiss();
    inputRef.current?.blur();
    setIsInputFocused(false);
    setIsKeyboardVisible(false);
    promptLiftProgress.stopAnimation();
    promptLiftProgress.setValue(0);
  }

  function animateDrawer(nextOpen, onComplete) {
    if (nextOpen) {
      setIsDrawerOpen(true);
    }

    Animated.timing(drawerProgress, {
      toValue: nextOpen ? 1 : 0,
      duration: nextOpen ? 260 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!nextOpen && finished) {
        setIsDrawerOpen(false);
      }

      onComplete?.(finished);
    });
  }

  function openDrawer() {
    if (isDrawerForced) {
      return;
    }

    dismissMasterPromptKeyboardImmediately();
    animateDrawer(true);
  }

  function closeDrawer(onComplete) {
    if (isDrawerForced) {
      onComplete?.(true);
      return;
    }

    animateDrawer(false, onComplete);
  }

  function handleDrawerSelect(callback) {
    closeDrawer(() => {
      callback?.();
    });
  }

  function handleOpenSupport() {
    handleDrawerSelect(() => {
      Linking.openURL(SUPPORT_URL).catch(() => {});
    });
  }

  function scheduleIdleKeyboardDismiss(nextValue = moodInput) {
    clearIdleKeyboardTimer();

    if (!isInputFocused || nextValue.trim()) {
      return;
    }

    idleKeyboardTimerRef.current = setTimeout(() => {
      inputRef.current?.blur();
    }, 10000);
  }

  useEffect(() => () => {
    clearIdleKeyboardTimer();
    clearDailyWisdomTimer();
    clearDailyWisdomShowTimer();
    clearActionTrayTimer();
    clearCustomFortuneNoticeTimer();
    paperCueLoopRef.current?.stop();
    paperCueProgress.stopAnimation();
  }, []);

  useEffect(() => {
    refreshCreatedFortunes();
  }, []);

  useEffect(() => {
    if (!isFortuneRevealed) {
      clearActionTrayTimer();
      setIsActionTrayVisible(false);
      paperCueLoopRef.current?.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
      return undefined;
    }

    if (actionTrayVisible) {
      paperCueLoopRef.current?.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
      return undefined;
    }

    const cueLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(250),
        Animated.sequence([
          Animated.timing(paperCueProgress, {
            toValue: 1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: -1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: 1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: -1,
            duration: 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(paperCueProgress, {
            toValue: 0,
            duration: 90,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(5000),
      ])
    );

    paperCueLoopRef.current = cueLoop;
    cueLoop.start();

    return () => {
      cueLoop.stop();
      paperCueProgress.stopAnimation();
      paperCueProgress.setValue(0);
    };
  }, [actionTrayVisible, isFortuneRevealed, paperCueProgress]);

  useEffect(() => {
    scheduleIdleKeyboardDismiss(moodInput);
  }, [isInputFocused, moodInput]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isDrawerForced) {
      return undefined;
    }

    setIsDrawerOpen(forcedDrawerOpen);
    drawerProgress.stopAnimation();
    drawerProgress.setValue(forcedDrawerOpen ? 1 : 0);
    return undefined;
  }, [drawerProgress, forcedDrawerOpen, isDrawerForced]);

  useEffect(() => {
    if (forcedLibraryOpen == null) {
      setActiveLibrary(null);
      return undefined;
    }

    if (!isLibraryForced) {
      return undefined;
    }

    setActiveLibrary(forcedLibraryOpen);
    return undefined;
  }, [forcedLibraryOpen, isLibraryForced]);

  useEffect(() => {
    Animated.timing(promptLiftProgress, {
      toValue: shouldLiftMasterPrompt ? 1 : 0,
      duration: Platform.OS === 'ios' ? 240 : 180,
      easing: shouldLiftMasterPrompt ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [promptLiftProgress, shouldLiftMasterPrompt]);

  useEffect(() => {
    clearDailyWisdomShowTimer();
    clearDailyWisdomTimer();

    if (!dailyWisdomMessage || dailyWisdomLockSeconds <= 0) {
      setIsDailyWisdomLockActive(false);
      Animated.timing(dailyWisdomProgress, {
        toValue: 0,
        duration: 420,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsDailyWisdomVisible(false);
        }
      });
      return undefined;
    }

    setIsDailyWisdomLockActive(true);
    setIsDailyWisdomVisible(false);
    dailyWisdomProgress.setValue(0);
    dailyWisdomShowTimerRef.current = setTimeout(() => {
      setIsDailyWisdomVisible(true);
      Animated.timing(dailyWisdomProgress, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      dailyWisdomShowTimerRef.current = null;
    }, 1000);

    dailyWisdomTimerRef.current = setTimeout(() => {
      clearDailyWisdomShowTimer();
      Animated.timing(dailyWisdomProgress, {
        toValue: 0,
        duration: 480,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsDailyWisdomVisible(false);
          setIsDailyWisdomLockActive(false);
        }
      });
      dailyWisdomTimerRef.current = null;
    }, dailyWisdomLockSeconds * 1000);

    return () => {
      clearDailyWisdomTimer();
    };
  }, [dailyWisdomLockSeconds, dailyWisdomMessage, dailyWisdomNoticeToken, dailyWisdomProgress]);

  useEffect(() => {
    if (isPromptTemporarilyLocked && isInputFocused) {
      inputRef.current?.blur();
    }
  }, [isInputFocused, isPromptTemporarilyLocked]);

  const dailyWisdomAnimatedStyle = {
    opacity: dailyWisdomProgress,
    transform: [
      {
        translateY: dailyWisdomProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const drawerPanelAnimatedStyle = {
    transform: [
      {
        translateX: drawerProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-drawerWidth - 24, 0],
        }),
      },
    ],
  };

  const drawerBackdropAnimatedStyle = {
    opacity: drawerProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.44],
    }),
  };
  const promptLiftDistance = metrics.cookieStageMinHeight + metrics.promptFloatClearance;
  const promptDockAnimatedStyle = {
    transform: [
      {
        translateY: promptLiftProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -promptLiftDistance],
        }),
      },
    ],
  };
  const shouldPrepareFreshEntry = Boolean(
    moodInput
    || isCookieOpened
    || isPaperVisible
  );

  const androidMasterPromptBottom = (
    ANDROID_MASTER_PROMPT_BOTTOM_GAP
    + Math.max(previewLayout.insets?.bottom ?? 0, ANDROID_MASTER_PROMPT_BOTTOM_INSET_MIN)
  );

  return (
    <View style={[styles.screen, { backgroundColor: scene.sky }]}>
      <SceneBackdrop metrics={metrics} scene={scene} />

      <View
        style={[
          styles.contentFrame,
          { paddingHorizontal: metrics.horizontalPadding },
        ]}
      >
        <View
          pointerEvents="box-none"
          style={[
            styles.headerChrome,
            {
              top: metrics.headerTop,
              left: metrics.horizontalPadding,
              right: metrics.horizontalPadding,
            },
          ]}
        >
          <Pressable
            hitSlop={8}
            onPress={openDrawer}
            style={[
              styles.menuButton,
              {
                width: metrics.menuButtonSize,
                height: metrics.menuButtonSize,
                borderRadius: metrics.menuButtonRadius,
                gap: metrics.menuGap,
                backgroundColor: scene.input,
                borderColor: scene.inputBorder,
              },
            ]}
          >
            {[0, 1, 2].map((lineIndex) => (
              <View
                key={lineIndex}
                style={[
                  styles.menuLine,
                  {
                    width: metrics.menuLineWidth,
                    height: metrics.menuLineHeight,
                    backgroundColor: scene.textPrimary,
                  },
                ]}
              />
            ))}
          </Pressable>
          <View style={{ transform: [{ translateX: metrics.streakRightNudge }, { scale: metrics.streakScale }] }}>
            <StreakStatus
              celebrationToken={streakCelebrationToken}
              collapsedWidth={metrics.streakCollapsedWidth}
              daysToNextTier={streakDaysToNextTier}
              expandedWidth={metrics.streakExpandedWidth}
              nextTierTitle={streakNextTierTitle}
              streakCount={streakCount}
              forcedExpanded={streakForcedExpanded}
              tierTitle={streakTierTitle}
            />
          </View>
        </View>

        {resolvedCustomFortuneNotice ? (
          <View
            style={[
              styles.customFortuneNoticeWrap,
              {
                left: metrics.horizontalPadding,
                right: metrics.horizontalPadding,
                top: customFortuneNoticeTop,
              },
            ]}
            pointerEvents="none"
          >
            <View style={[styles.customFortuneNotice, styles.customFortuneNoticeNeutral]}>
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                numberOfLines={1}
                style={[styles.customFortuneNoticeText, styles.customFortuneNoticeTextNeutral]}
              >
                {resolvedCustomFortuneNotice}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.mainFlow}>
        <View style={{ height: metrics.cookieTopSpacing }} />

        <View style={[styles.dailyWisdomSlot, { maxWidth: metrics.contentMaxWidth, height: metrics.dailyWisdomSlotHeight }]}>
          {dailyWisdomMessage && isDailyWisdomVisible ? (
            <Animated.View
              style={[
                styles.dailyWisdomCard,
                styles.dailyWisdomCardNeutral,
                dailyWisdomAnimatedStyle,
                {
                  bottom: metrics.dailyWisdomBottom,
                },
              ]}
            >
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                numberOfLines={1}
                style={[styles.dailyWisdomText, styles.dailyWisdomTextNeutral]}
              >
                {dailyWisdomMessage}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <View
          style={[
            styles.cookieSection,
            { maxWidth: metrics.contentMaxWidth, minHeight: cookieSectionMinHeight },
          ]}
        >
          <CookieStage
            fortuneText={fortuneText}
            imageVerticalOffset={metrics.cookieImageOffset}
            isCookieOpened={isCookieOpened}
            isPaperVisible={isPaperVisible}
            onPress={showActionTrayTemporarily}
            paperCueProgress={paperCueProgress}
            paperLift={metrics.paperLift}
            paperProgress={paperProgress}
            shellProgress={shellProgress}
            shellScale={metrics.cookieScale}
            stageMinHeight={metrics.cookieStageMinHeight}
          />

          {isFortuneRevealed ? (
            <View
              style={[
                styles.actionZone,
                {
                  top: metrics.actionTrayTop,
                  maxWidth: metrics.contentMaxWidth,
                },
              ]}
            >
              <FortuneActionTray
                canReplace={canReplaceCurrentFortune}
                isFavorite={currentFortuneIsFavorite}
                onReplace={onRequestReplace}
                onLayout={handleActionTrayLayout}
                onShare={onShareFortune}
                onToggleFavorite={onToggleFavorite}
                palette={actionTrayPalette}
                visible={actionTrayVisible}
              />
            </View>
          ) : null}
        </View>

        {Platform.OS !== 'android' ? (
          <Animated.View
            style={[
              styles.promptDock,
              promptDockAnimatedStyle,
              {
                paddingTop: metrics.promptGap,
                paddingBottom: shouldLiftMasterPrompt ? 0 : metrics.promptBottomInset,
                justifyContent: shouldLiftMasterPrompt ? 'flex-start' : 'flex-end',
              },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'position' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? metrics.keyboardOffset : 0}
              style={styles.promptSection}
            >
              <View
                style={[
                  styles.inputCard,
                  styles.inputCardNeutral,
                  {
                    maxWidth: metrics.contentMaxWidth,
                    marginTop: metrics.promptSectionOffset,
                  },
                ]}
              >
                <Text style={[
                  styles.inputLabel,
                  styles.inputLabelNeutral,
                  isPromptTemporarilyLocked ? styles.inputLabelLocked : null,
                ]}>
                  Describe your mood in one word
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    {
                      backgroundColor: scene.input,
                      borderColor: isInputFocused ? scene.accent : scene.inputBorder,
                    },
                    isPromptTemporarilyLocked ? styles.inputRowLocked : null,
                    isInputFocused ? styles.inputRowFocused : null,
                  ]}
                >
                  <TextInput
                    autoCapitalize="words"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    editable={!isHydratingSelection && !isPromptTemporarilyLocked}
                    ref={inputRef}
                    onBlur={() => {
                      setIsInputFocused(false);
                      clearIdleKeyboardTimer();
                    }}
                    onChangeText={(nextValue) => {
                      onMoodChange(nextValue);
                      scheduleIdleKeyboardDismiss(nextValue);
                    }}
                    onFocus={() => {
                      if (isPromptTemporarilyLocked) {
                        inputRef.current?.blur();
                        return;
                      }

                      setIsInputFocused(true);
                      if (shouldPrepareFreshEntry) {
                        onBeginMoodEntry?.();
                      }
                      scheduleIdleKeyboardDismiss('');
                    }}
                    onSubmitEditing={() => {
                      inputRef.current?.blur();
                      onSubmitMoodInput();
                    }}
                    placeholder="tired, excited, restless..."
                    placeholderTextColor={scene.accentSoft}
                    returnKeyType="done"
                    selectionColor={scene.accent}
                    style={[
                      styles.input,
                      { color: scene.textPrimary },
                      isPromptTemporarilyLocked ? styles.inputLocked : null,
                    ]}
                    value={moodInput}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        ) : null}
        </View>
      </View>

      {Platform.OS === 'android' ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.androidMasterPromptOverlay,
            promptDockAnimatedStyle,
            {
              paddingHorizontal: metrics.horizontalPadding,
              bottom: androidMasterPromptBottom,
              paddingTop: metrics.promptGap,
              paddingBottom: shouldLiftMasterPrompt ? 0 : metrics.promptBottomInset,
              justifyContent: shouldLiftMasterPrompt ? 'flex-start' : 'flex-end',
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={undefined}
            style={styles.promptSection}
          >
            <View
              style={[
                styles.inputCard,
                styles.inputCardNeutral,
                {
                  maxWidth: metrics.contentMaxWidth,
                  marginTop: metrics.promptSectionOffset,
                },
              ]}
            >
              <Text style={[
                styles.inputLabel,
                styles.inputLabelNeutral,
                isPromptTemporarilyLocked ? styles.inputLabelLocked : null,
              ]}>
                Describe your mood in one word
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: scene.input,
                    borderColor: isInputFocused ? scene.accent : scene.inputBorder,
                  },
                  isPromptTemporarilyLocked ? styles.inputRowLocked : null,
                  isInputFocused ? styles.inputRowFocused : null,
                ]}
              >
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  editable={!isHydratingSelection && !isPromptTemporarilyLocked}
                  ref={inputRef}
                  onBlur={() => {
                    setIsInputFocused(false);
                    clearIdleKeyboardTimer();
                  }}
                  onChangeText={(nextValue) => {
                    onMoodChange(nextValue);
                    scheduleIdleKeyboardDismiss(nextValue);
                  }}
                  onFocus={() => {
                    if (isPromptTemporarilyLocked) {
                      inputRef.current?.blur();
                      return;
                    }

                    setIsInputFocused(true);
                    if (shouldPrepareFreshEntry) {
                      onBeginMoodEntry?.();
                    }
                    scheduleIdleKeyboardDismiss('');
                  }}
                  onSubmitEditing={() => {
                    inputRef.current?.blur();
                    onSubmitMoodInput();
                  }}
                  placeholder="tired, excited, restless..."
                  placeholderTextColor={scene.accentSoft}
                  returnKeyType="done"
                  selectionColor={scene.accent}
                  style={[
                    styles.input,
                    { color: scene.textPrimary },
                    isPromptTemporarilyLocked ? styles.inputLocked : null,
                  ]}
                  value={moodInput}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      ) : null}

      {isDrawerShown ? (
        <View pointerEvents="box-none" style={styles.drawerLayer}>
          <Animated.View style={[styles.drawerBackdrop, drawerBackdropAnimatedStyle]}>
            <Pressable onPress={() => closeDrawer()} style={StyleSheet.absoluteFill} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerPanel,
              drawerPanelAnimatedStyle,
              {
                width: drawerWidth,
                backgroundColor: drawerPalette.panel,
                borderColor: drawerPalette.border,
              },
            ]}
          >
            <Text style={[styles.drawerTitle, { color: drawerPalette.title }]}>Menu</Text>

            <DrawerSection label="Browse" labelColor={drawerPalette.title}>
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="History"
                onPress={() => handleDrawerSelect(() => openLibrary('history'))}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="Favorites"
                onPress={() => handleDrawerSelect(() => openLibrary('favorites'))}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="Create your own fortune"
                onPress={() => handleDrawerSelect(() => {
                  setEditingCustomFortune(null);
                  setIsCustomFortuneSheetVisible(true);
                })}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                label="Your created fortunes"
                onPress={() => handleDrawerSelect(() => setIsCreatedFortunesSheetVisible(true))}
                textColor={drawerPalette.text}
              />
              <DrawerItem
                backgroundColor={drawerPalette.itemFill}
                borderColor={drawerPalette.itemBorder}
                detail="Questions, feedback, or help"
                label="Support"
                onPress={handleOpenSupport}
                textColor={drawerPalette.text}
              />
            </DrawerSection>

            <View style={styles.drawerCalmSpace} />
            <View style={styles.drawerFooter}>
              <Text style={[styles.drawerVersionText, { color: drawerPalette.title }]}>
                Version {APP_VERSION}
              </Text>
            </View>
            <View style={styles.drawerMotif} pointerEvents="none">
              <View style={[styles.drawerMotifLine, { backgroundColor: drawerPalette.motif }]} />
              <View style={[styles.drawerMotifDot, { backgroundColor: drawerPalette.motif }]} />
              <View style={[styles.drawerMotifLineShort, { backgroundColor: drawerPalette.motif }]} />
            </View>
          </Animated.View>
        </View>
      ) : null}
      <FortuneLibrarySheet
        activeLibrary={resolvedActiveLibrary || 'history'}
        favorites={favoriteFortunes}
        history={historyFortunes}
        onClose={() => {
          if (isLibraryForced) {
            return;
          }

          setActiveLibrary(null);
        }}
        onRemoveFavorite={onRemoveFavorite}
        onShareItem={onShareSavedFortune}
        onToggleFavorite={onToggleSavedFavorite}
        onSelectLibrary={setActiveLibrary}
        visible={Boolean(resolvedActiveLibrary)}
      />
      <CustomFortuneSheet
        collapsedTopAnchor={metrics.createFortuneTopAnchor}
        collapsedEstimatedHeight={ESTIMATED_CREATE_FORTUNE_COLLAPSED_HEIGHT}
        collapsedMaxWidth={metrics.contentMaxWidth}
        errorMessage={customFortuneError}
        initialFortuneText={editingCustomFortune?.text || ''}
        initialMoodKey={editingCustomFortune?.moodKey || null}
        isEditing={Boolean(editingCustomFortune)}
        moodSections={CREATE_FORTUNE_MOOD_SECTIONS}
        onCancel={() => {
          if (isCustomFortuneSheetForced) {
            return;
          }

          setCustomFortuneError('');
          setEditingCustomFortune(null);
          setIsCustomFortuneSheetVisible(false);
        }}
        onDismissError={() => setCustomFortuneError('')}
        onSave={async ({ moodKey, fortuneText: nextFortuneText }) => {
          setIsSavingCustomFortune(true);

          try {
            const result = editingCustomFortune
              ? await updateCustomFortune({
                  previousMoodKey: editingCustomFortune.moodKey,
                  previousFortuneText: editingCustomFortune.text,
                  nextMoodKey: moodKey,
                  nextFortuneText,
                })
              : await saveCustomFortune({
                  moodKey,
                  fortuneText: nextFortuneText,
                });

            if (!result.ok) {
              if (result.moderation === 'blocked-danger') {
                setCustomFortuneError('');
                setEditingCustomFortune(null);
                setIsCustomFortuneSheetVisible(false);
                onTriggerSafetyLock?.();
                return false;
              }

              setCustomFortuneError(result.error);
              return false;
            }

            setCustomFortuneError('');
            setEditingCustomFortune(null);
            setIsCustomFortuneSheetVisible(false);
            await refreshCreatedFortunes();

            if (!editingCustomFortune) {
              await onSaveCreatedFortuneFavorite?.(createCustomFavoriteRecord(
                moodKey,
                result.savedFortune
              ));
            }

            showCustomFortuneNotice(
              editingCustomFortune
                ? `Updated in ${formatMoodBucketLabel(moodKey)} fortunes`
                : `Saved to ${formatMoodBucketLabel(moodKey)} fortunes and added to Favorites`
            );
            return true;
          } catch {
            setCustomFortuneError('This fortune could not be saved right now.');
            return false;
          } finally {
            setIsSavingCustomFortune(false);
          }
        }}
        saving={isSavingCustomFortune}
        visible={customFortuneSheetVisible}
      />
      <CreatedFortunesSheet
        onClearAll={async () => {
          await clearAllCustomFortunes();
          await refreshCreatedFortunes();
          showCustomFortuneNotice('Cleared all created fortunes');
        }}
        onDeleteFortune={async (item) => {
          await deleteCustomFortune({
            moodKey: item.moodKey,
            fortuneText: item.text,
          });
          await refreshCreatedFortunes();
          showCustomFortuneNotice(`Deleted from ${formatMoodBucketLabel(item.moodKey)} fortunes`);
        }}
        onEditFortune={(item) => {
          setCustomFortuneError('');
          setEditingCustomFortune(item);
          setIsCreatedFortunesSheetVisible(false);
          setIsCustomFortuneSheetVisible(true);
        }}
        onShareFortune={onShareSavedFortune}
        onClose={() => setIsCreatedFortunesSheetVisible(false)}
        sections={createdFortuneSections}
        visible={isCreatedFortunesSheetVisible}
      />
      {shouldShowSimulatedKeyboard ? (
        <View
          pointerEvents="none"
          style={[
            styles.simulatedKeyboardLayer,
            simulatedKeyboardPlatform === 'android' ? styles.simulatedAndroidKeyboardLayer : styles.simulatedIosKeyboardLayer,
            { height: simulatedKeyboardHeight },
          ]}
        >
          {simulatedKeyboardPlatform === 'android' ? (
            <>
              <View style={styles.simulatedKeyboardToolbar}>
                <View style={styles.simulatedKeyboardToolbarChip}>
                  <Text style={styles.simulatedKeyboardToolbarText}>smart</Text>
                </View>
                <View style={styles.simulatedKeyboardToolbarIcons}>
                  {['😊', '⋯', '⚙', '🎤'].map((item) => (
                    <View key={item} style={styles.simulatedKeyboardToolbarIcon}>
                      <Text style={styles.simulatedKeyboardToolbarIconText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.simulatedKeyboardSuggestionRow}>
                {['curious', 'curious.', 'curiously'].map((item, index) => (
                  <View
                    key={item}
                    style={[
                      styles.simulatedKeyboardSuggestion,
                      index === 1 ? styles.simulatedKeyboardSuggestionActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.simulatedKeyboardSuggestionText,
                        index === 1 ? styles.simulatedKeyboardSuggestionTextActive : null,
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.simulatedKeyboardRow}>
                {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
                  <View key={key} style={styles.simulatedKeyboardKey}>
                    <Text style={styles.simulatedKeyboardKeyText}>{key}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.simulatedKeyboardRow, styles.simulatedKeyboardRowInset]}>
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((key) => (
                  <View key={key} style={styles.simulatedKeyboardKey}>
                    <Text style={styles.simulatedKeyboardKeyText}>{key}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.simulatedKeyboardRow}>
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpecialKey, styles.simulatedKeyboardWideKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>⇧</Text>
                </View>
                {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((key) => (
                  <View key={key} style={styles.simulatedKeyboardKey}>
                    <Text style={styles.simulatedKeyboardKeyText}>{key}</Text>
                  </View>
                ))}
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpecialKey, styles.simulatedKeyboardWideKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>⌫</Text>
                </View>
              </View>
              <View style={styles.simulatedKeyboardBottomRow}>
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpecialKey, styles.simulatedKeyboardActionKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>123</Text>
                </View>
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpecialKey, styles.simulatedKeyboardEmojiKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>😊</Text>
                </View>
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpaceKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>space</Text>
                </View>
                <View style={[styles.simulatedKeyboardKey, styles.simulatedKeyboardSpecialKey, styles.simulatedKeyboardActionKey]}>
                  <Text style={styles.simulatedKeyboardKeyText}>↵</Text>
                </View>
              </View>
              <View style={styles.simulatedKeyboardNavRow}>
                <Text style={styles.simulatedKeyboardNavText}>▵</Text>
                <View style={styles.simulatedKeyboardHomeIndicator} />
                <Text style={styles.simulatedKeyboardNavText}>◯</Text>
              </View>
            </>
          ) : (
            <View style={styles.simulatedIosKeyboardWrap}>
              <View style={styles.simulatedIosPredictionBar}>
                {['curious', 'for', 'the'].map((item, index) => (
                  <View key={item} style={styles.simulatedIosPredictionSegment}>
                    <Text
                      style={[
                        styles.simulatedIosPredictionText,
                        index === 0 ? styles.simulatedIosPredictionTextStrong : null,
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.simulatedIosRowsWrap}>
                <View style={styles.simulatedIosKeyboardRow}>
                  {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
                    <View key={key} style={styles.simulatedIosLetterKey}>
                      <Text style={styles.simulatedIosLetterKeyText}>{key}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.simulatedIosKeyboardRow, styles.simulatedIosKeyboardRowMedium]}>
                  {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((key) => (
                    <View key={key} style={styles.simulatedIosLetterKey}>
                      <Text style={styles.simulatedIosLetterKeyText}>{key}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.simulatedIosKeyboardRow, styles.simulatedIosKeyboardRowTight]}>
                  <View style={styles.simulatedIosUtilityKey}>
                    <Text style={styles.simulatedIosUtilityKeyText}>shift</Text>
                  </View>
                  {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((key) => (
                    <View key={key} style={styles.simulatedIosLetterKey}>
                      <Text style={styles.simulatedIosLetterKeyText}>{key}</Text>
                    </View>
                  ))}
                  <View style={styles.simulatedIosUtilityKey}>
                    <Text style={styles.simulatedIosUtilityKeyText}>delete</Text>
                  </View>
                </View>
                <View style={styles.simulatedIosBottomRow}>
                  <View style={styles.simulatedIosBottomUtilityKey}>
                    <Text style={styles.simulatedIosUtilityKeyText}>123</Text>
                  </View>
                  <View style={styles.simulatedIosBottomUtilityKey}>
                    <Text style={styles.simulatedIosUtilityKeyText}>emoji</Text>
                  </View>
                  <View style={styles.simulatedIosSpaceKey}>
                    <Text style={styles.simulatedIosSpaceText}>space</Text>
                  </View>
                  <View style={styles.simulatedIosBottomUtilityKey}>
                    <Text style={styles.simulatedIosUtilityKeyText}>return</Text>
                  </View>
                </View>
              </View>
              <View style={styles.simulatedIosHomeIndicatorWrap}>
                <View style={styles.simulatedKeyboardHomeIndicator} />
              </View>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentFrame: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: CONTENT_FRAME_PADDING_BOTTOM,
  },
  headerChrome: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 12,
  },
  customFortuneNoticeWrap: {
    position: 'absolute',
    bottom: 398,
    left: 22,
    right: 22,
    alignItems: 'center',
    zIndex: 14,
  },
  customFortuneNotice: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  customFortuneNoticeNeutral: {
    backgroundColor: 'rgba(255, 251, 245, 0.96)',
    borderColor: 'rgba(24, 20, 16, 0.14)',
  },
  customFortuneNoticeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.12,
  },
  customFortuneNoticeTextNeutral: {
    color: '#181410',
  },
  mainFlow: {
    flexGrow: 1,
  },
  menuButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6d4e37',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  menuLine: {
    borderRadius: 999,
  },
  topGlow: {
    position: 'absolute',
    opacity: 0.5,
  },
  sunHalo: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.24,
  },
  sunDisc: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.68,
  },
  cloud: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
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
    zIndex: 2,
    elevation: 4,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 7,
    shadowColor: '#6d4e37',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  inputCardNeutral: {
    backgroundColor: 'rgba(251, 247, 242, 0.96)',
    borderColor: 'rgba(120, 106, 92, 0.12)',
  },
  inputLabel: {
    marginBottom: 4,
    marginLeft: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  inputLabelNeutral: {
    color: '#2f2924',
  },
  inputLabelLocked: {
    opacity: 0.45,
  },
  inputRow: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: 12,
    justifyContent: 'center',
    zIndex: 3,
  },
  inputRowFocused: {
    shadowColor: '#6d4e37',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  inputRowLocked: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    fontSize: 15,
    paddingVertical: 1,
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
        }
      : null),
  },
  inputLocked: {
    opacity: 0.5,
  },
  cookieTapArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieImageFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieSection: {
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  dailyWisdomSlot: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  dailyWisdomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dailyWisdomCardNeutral: {
    backgroundColor: 'rgba(255, 251, 245, 0.96)',
    borderColor: 'rgba(24, 20, 16, 0.14)',
  },
  promptSection: {
    width: '100%',
    alignSelf: 'center',
  },
  promptDock: {
    flexGrow: 1,
    width: '100%',
  },
  androidMasterPromptOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 18,
    elevation: 18,
  },
  dailyWisdomText: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },
  dailyWisdomTextNeutral: {
    color: '#181410',
  },
  actionZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    alignSelf: 'center',
    minHeight: 8,
    justifyContent: 'flex-start',
  },
  drawerLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    justifyContent: 'flex-start',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#201715',
  },
  drawerPanel: {
    minHeight: '100%',
    borderRightWidth: 1,
    paddingTop: 78,
    paddingHorizontal: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 10, height: 0 },
    elevation: 14,
  },
  drawerTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginLeft: 4,
  },
  drawerCalmSpace: {
    flex: 1,
    minHeight: 28,
  },
  drawerFooter: {
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  drawerVersionText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.72,
    letterSpacing: 0.2,
  },
  drawerMotif: {
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  drawerMotifLine: {
    width: 54,
    height: 1.5,
    borderRadius: 999,
    marginBottom: 10,
  },
  drawerMotifDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginBottom: 10,
    marginLeft: 10,
  },
  drawerMotifLineShort: {
    width: 28,
    height: 1.5,
    borderRadius: 999,
    marginLeft: 18,
  },
  simulatedKeyboardLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#d6d0c9',
    borderTopWidth: 1,
    borderColor: 'rgba(73, 56, 43, 0.1)',
    paddingHorizontal: 7,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 5,
    justifyContent: 'flex-start',
  },
  simulatedAndroidKeyboardLayer: {
    backgroundColor: '#d6d0c9',
  },
  simulatedIosKeyboardLayer: {
    backgroundColor: '#d9dde3',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 6,
    gap: 3,
  },
  simulatedKeyboardToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  simulatedKeyboardToolbarChip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
  },
  simulatedKeyboardToolbarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#5a5048',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  simulatedKeyboardToolbarIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  simulatedKeyboardToolbarIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  simulatedKeyboardToolbarIconText: {
    fontSize: 10,
    color: '#5a5048',
  },
  simulatedKeyboardSuggestionRow: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 2,
  },
  simulatedKeyboardSuggestion: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  simulatedKeyboardSuggestionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  simulatedKeyboardSuggestionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5a5048',
  },
  simulatedKeyboardSuggestionTextActive: {
    color: '#2f2924',
  },
  simulatedKeyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  simulatedKeyboardRowInset: {
    paddingHorizontal: 10,
  },
  simulatedKeyboardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 1,
  },
  simulatedKeyboardKey: {
    minWidth: 24,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#f8f5f1',
    borderWidth: 1,
    borderColor: 'rgba(67, 52, 40, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    shadowColor: '#6a5647',
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  simulatedKeyboardSpecialKey: {
    backgroundColor: '#c7c0b8',
  },
  simulatedKeyboardWideKey: {
    minWidth: 38,
  },
  simulatedKeyboardActionKey: {
    minWidth: 40,
  },
  simulatedKeyboardEmojiKey: {
    minWidth: 46,
  },
  simulatedKeyboardSpaceKey: {
    minWidth: 128,
  },
  simulatedKeyboardKeyText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#3c3027',
  },
  simulatedIosKeyboardWrap: {
    gap: 4,
  },
  simulatedIosPredictionBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(82, 88, 97, 0.14)',
  },
  simulatedIosPredictionSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  simulatedIosPredictionText: {
    fontSize: 10,
    color: '#69707a',
    fontWeight: '500',
  },
  simulatedIosPredictionTextStrong: {
    color: '#2e343b',
    fontWeight: '600',
  },
  simulatedIosRowsWrap: {
    gap: 6,
  },
  simulatedIosKeyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  simulatedIosKeyboardRowMedium: {
    paddingHorizontal: 12,
  },
  simulatedIosKeyboardRowTight: {
    gap: 4,
  },
  simulatedIosLetterKey: {
    minWidth: 28,
    height: 31,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderColor: 'rgba(67, 52, 40, 0.02)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6c737c',
    shadowOpacity: 0.14,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  simulatedIosLetterKeyText: {
    fontSize: 12,
    color: '#2e343b',
    fontWeight: '500',
  },
  simulatedIosUtilityKey: {
    backgroundColor: '#b8bec8',
    borderColor: 'rgba(67, 52, 40, 0.02)',
    borderWidth: 1,
    minWidth: 44,
    height: 31,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  simulatedIosBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 0,
  },
  simulatedIosBottomUtilityKey: {
    minWidth: 48,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#b8bec8',
    borderWidth: 1,
    borderColor: 'rgba(67, 52, 40, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  simulatedIosSpaceKey: {
    minWidth: 152,
    backgroundColor: '#ffffff',
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(67, 52, 40, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulatedIosUtilityKeyText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#40464f',
    textTransform: 'lowercase',
    letterSpacing: 0.1,
  },
  simulatedIosSpaceText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2f343b',
  },
  simulatedIosHomeIndicatorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  simulatedKeyboardNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginTop: 1,
  },
  simulatedKeyboardNavText: {
    fontSize: 11,
    color: 'rgba(44, 34, 27, 0.5)',
  },
  simulatedKeyboardHomeIndicator: {
    width: 94,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(44, 34, 27, 0.34)',
  },
});
