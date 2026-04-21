import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const AUTO_COLLAPSE_MS = 4200;

function formatDayLabel(dayCount) {
  return `${dayCount} ${dayCount === 1 ? 'day' : 'days'}`;
}

function formatCollapsedLabel(streakCount, tierTitle) {
  if (streakCount <= 0) {
    return 'Begin your daily streak';
  }

  if (tierTitle) {
    return `${formatDayLabel(streakCount)} - ${tierTitle}`;
  }

  return formatDayLabel(streakCount);
}

function formatExpandedTitle(streakCount, tierTitle) {
  if (streakCount <= 0) {
    return 'Begin your streak';
  }

  const streakHeadline = `${streakCount}-day streak!`;

  if (tierTitle) {
    return `${streakHeadline} You are a ${tierTitle}`;
  }

  return streakHeadline;
}

export default function StreakStatus({
  collapsedWidth = 146,
  expandedWidth: expandedCardWidth = 292,
  streakCount,
  tierTitle,
  nextTierTitle,
  daysToNextTier,
  celebrationToken,
  forcedExpanded,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const collapseTimerRef = useRef(null);
  const hasShownIntroRef = useRef(false);

  function clearCollapseTimer() {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }

  function animateExpanded(nextExpanded) {
    setIsExpanded(nextExpanded);
    Animated.timing(progress, {
      toValue: nextExpanded ? 1 : 0,
      duration: nextExpanded ? 240 : 180,
      easing: nextExpanded ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();
  }

  function scheduleCollapse() {
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(() => {
      animateExpanded(false);
      setIsCelebrating(false);
    }, AUTO_COLLAPSE_MS);
  }

  function openExpanded({ celebration = false } = {}) {
    setIsCelebrating(celebration);
    animateExpanded(true);
    scheduleCollapse();
  }

  useEffect(() => () => {
    clearCollapseTimer();
  }, []);

  useEffect(() => {
    if (typeof forcedExpanded === 'boolean') {
      clearCollapseTimer();
      setIsCelebrating(false);
      animateExpanded(forcedExpanded);
    }
  }, [forcedExpanded]);

  useEffect(() => {
    if (typeof forcedExpanded === 'boolean') {
      return;
    }

    if (hasShownIntroRef.current || streakCount <= 0) {
      return;
    }

    hasShownIntroRef.current = true;
    openExpanded();
  }, [streakCount]);

  useEffect(() => {
    if (typeof forcedExpanded === 'boolean') {
      return;
    }

    if (!celebrationToken) {
      return;
    }

    openExpanded({ celebration: true });

    pulse.setValue(0);
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 0,
        bounciness: 10,
        speed: 13,
        useNativeDriver: true,
      }),
    ]).start();
  }, [celebrationToken, pulse]);

  const collapsedText = formatCollapsedLabel(streakCount, tierTitle);
  const expandedTitle = formatExpandedTitle(streakCount, tierTitle);

  const animatedCardWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedWidth, expandedCardWidth],
  });
  const expandedMinHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 50],
  });
  const detailOpacity = progress;
  const collapsedOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <Animated.View
      style={[
        styles.shadowWrap,
        isCelebrating ? styles.shadowWrapCelebrating : null,
        {
          transform: [{ scale: pulseScale }],
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Streak status"
        onPress={typeof forcedExpanded === 'boolean' ? undefined : () => openExpanded({ celebration: false })}
      >
        <Animated.View
          style={[
            styles.card,
            isExpanded ? styles.cardExpanded : null,
            isCelebrating ? styles.cardCelebrating : null,
            {
              width: animatedCardWidth,
              minHeight: expandedMinHeight,
            },
          ]}
        >
          <Animated.Text
            allowFontScaling={false}
            adjustsFontSizeToFit
            minimumFontScale={0.74}
            numberOfLines={1}
            style={[styles.collapsedText, { opacity: collapsedOpacity }]}
          >
            {collapsedText}
          </Animated.Text>

          <Animated.View
            pointerEvents="none"
            style={[styles.expandedContent, { opacity: detailOpacity }]}
          >
            {isCelebrating && tierTitle ? (
              <>
                <Text
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  numberOfLines={1}
                  style={styles.celebrationEyebrow}
                >
                  New tier unlocked
                </Text>
                <Text
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                  numberOfLines={1}
                  style={styles.celebrationTitle}
                >
                  {tierTitle}
                </Text>
              </>
            ) : (
              <>
                <Text
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  minimumFontScale={0.62}
                  numberOfLines={1}
                  style={styles.expandedPrimary}
                >
                  {expandedTitle}
                </Text>
                {streakCount > 0 && nextTierTitle && daysToNextTier ? (
                  <Text
                    allowFontScaling={false}
                    adjustsFontSizeToFit
                    minimumFontScale={0.78}
                    numberOfLines={1}
                    style={styles.expandedMeta}
                  >
                    {daysToNextTier} more {daysToNextTier === 1 ? 'day' : 'days'} until {nextTierTitle}
                  </Text>
                ) : streakCount <= 0 ? (
                  <Text
                    allowFontScaling={false}
                    adjustsFontSizeToFit
                    minimumFontScale={0.78}
                    numberOfLines={1}
                    style={styles.expandedMeta}
                  >
                    {"Open today's fortune to begin"}
                  </Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    adjustsFontSizeToFit
                    minimumFontScale={0.78}
                    numberOfLines={1}
                    style={styles.expandedMeta}
                  >
                    {"You are one of a kind!"}
                  </Text>
                )}
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 22,
    shadowColor: '#6f4d30',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  shadowWrapCelebrating: {
    shadowOpacity: 0.16,
    shadowRadius: 20,
  },
  card: {
    position: 'relative',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(142, 104, 69, 0.18)',
    backgroundColor: 'rgba(250, 242, 229, 0.95)',
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden',
  },
  cardExpanded: {
    backgroundColor: 'rgba(255, 247, 228, 0.98)',
    borderColor: 'rgba(196, 156, 104, 0.24)',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardCelebrating: {
    backgroundColor: 'rgba(255, 241, 212, 0.99)',
    borderColor: 'rgba(177, 129, 75, 0.28)',
    paddingTop: 4,
    paddingBottom: 4,
  },
  collapsedText: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    left: 12,
    right: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.12,
    lineHeight: 18,
    color: '#5b3d26',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  expandedContent: {
    position: 'absolute',
    top: 8,
    left: 18,
    right: 18,
    bottom: 8,
    justifyContent: 'center',
    gap: 0,
  },
  expandedPrimary: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.12,
    color: '#5a3b23',
    lineHeight: 19,
  },
  expandedMeta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.12,
    lineHeight: 15,
    color: '#1f1a17',
    textAlign: 'center',
  },
  celebrationEyebrow: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 11,
    textTransform: 'uppercase',
    color: '#916335',
    opacity: 0.82,
    textAlign: 'center',
  },
  celebrationTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.12,
    lineHeight: 17,
    color: '#5a3b23',
    textAlign: 'center',
  },
});
