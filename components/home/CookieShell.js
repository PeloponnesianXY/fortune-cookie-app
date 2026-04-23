import React, { memo } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

const COOKIE_CLOSED_IMAGE = require('../../assets/cookie/closed-2.png');
const COOKIE_OPEN_IMAGE = require('../../assets/cookie/open-final.png');

const FORTUNE_FONT_FAMILY = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const COOKIE_SHELL_FRAME = {
  width: 484,
  height: 304,
};

const COOKIE_IMAGE_FRAME = {
  width: 484,
  height: 210,
};

const CLOSED_COOKIE_FIT = {
  width: 330,
  height: 220,
  translateX: -14,
  translateY: 18,
};

const OPEN_COOKIE_FIT = {
  width: 474,
  height: 304,
  translateX: 0,
  translateY: 18,
};

const PAPER_SIZE = {
  width: 364,
  minHeight: 68,
};
const SE_PAPER_IMAGE_DROP = 10;

function scaleValue(value, scale) {
  return Math.round(value * scale * 10) / 10;
}

function getPaperTextMetrics(text, scale) {
  const normalizedText = String(text || '').trim();
  const characterCount = normalizedText.length;

  let baseFontSize = 13;
  let baseLineHeight = 17;

  if (characterCount <= 42) {
    baseFontSize = 17;
    baseLineHeight = 22;
  } else if (characterCount <= 56) {
    baseFontSize = 15.5;
    baseLineHeight = 20;
  } else if (characterCount <= 72) {
    baseFontSize = 14;
    baseLineHeight = 18;
  }

  return {
    fontSize: Math.max(11.5, scaleValue(baseFontSize, scale)),
    lineHeight: Math.max(14, scaleValue(baseLineHeight, scale)),
  };
}

function balanceFortuneText(text) {
  if (!text || text.includes('\n')) {
    return text || '';
  }

  const words = text.trim().split(/\s+/);

  // Short-to-medium fortunes look best when we can avoid a single orphaned word line.
  if (words.length < 5 || words.length > 15) {
    return text;
  }

  const joinedLength = words.join(' ').length;
  let bestSplit = -1;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const leftWords = words.slice(0, index);
    const rightWords = words.slice(index);
    const left = leftWords.join(' ');
    const right = rightWords.join(' ');

    if (leftWords.length < 2 || rightWords.length < 2) {
      continue;
    }

    let score = Math.abs(left.length - right.length);

    if (right.length <= 6) {
      score += 30;
    } else if (right.length <= 10) {
      score += 12;
    }

    const leftRatio = left.length / joinedLength;
    const rightRatio = right.length / joinedLength;
    if (leftRatio < 0.34 || rightRatio < 0.34) {
      score += 10;
    }

    if (score < bestScore) {
      bestScore = score;
      bestSplit = index;
    }
  }

  if (bestSplit === -1 || bestScore > 18) {
    return text;
  }

  return `${words.slice(0, bestSplit).join(' ')}\n${words.slice(bestSplit).join(' ')}`;
}

function getOpenedCookieImageBottom(scale = 1, imageVerticalOffset = 0) {
  return scaleValue(OPEN_COOKIE_FIT.translateY + imageVerticalOffset + OPEN_COOKIE_FIT.height, scale);
}

function CookieShell({
  fortuneText,
  imageVerticalOffset = 0,
  isOpened,
  isPaperVisible,
  onPaperTextMeasure,
  onPaperTextLayout,
  paperLift = 0,
  paperCueProgress,
  paperProgress,
  shellProgress,
  scale = 1,
  paperMaxWidth,
}) {
  const shellFrame = {
    width: scaleValue(COOKIE_SHELL_FRAME.width, scale),
    height: scaleValue(COOKIE_SHELL_FRAME.height, scale),
  };
  const cookieImageFrame = {
    width: scaleValue(COOKIE_IMAGE_FRAME.width, scale),
    height: scaleValue(COOKIE_IMAGE_FRAME.height, scale),
  };
  const closedCookieFit = {
    width: scaleValue(CLOSED_COOKIE_FIT.width, scale),
    height: scaleValue(CLOSED_COOKIE_FIT.height, scale),
    translateX: scaleValue(CLOSED_COOKIE_FIT.translateX, scale),
    translateY: scaleValue(CLOSED_COOKIE_FIT.translateY + imageVerticalOffset, scale),
  };
  const openCookieFit = {
    width: scaleValue(OPEN_COOKIE_FIT.width, scale),
    height: scaleValue(OPEN_COOKIE_FIT.height, scale),
    translateX: scaleValue(OPEN_COOKIE_FIT.translateX, scale),
    translateY: scaleValue(OPEN_COOKIE_FIT.translateY + imageVerticalOffset, scale),
  };
  const paperWidth = Math.min(
    scaleValue(PAPER_SIZE.width, scale),
    paperMaxWidth || Number.POSITIVE_INFINITY
  );
  const paperMinHeight = scaleValue(PAPER_SIZE.minHeight, scale);
  const sePaperLift = scale < 0.86 ? scaleValue(14 - SE_PAPER_IMAGE_DROP, scale) : 0;
  const resolvedPaperLift = sePaperLift + scaleValue(paperLift, scale);
  const paperTop = scaleValue(-28, scale) - resolvedPaperLift;
  const paperShadowTop = scaleValue(-6, scale) - resolvedPaperLift;
  const paperShadowWidth = scaleValue(214, scale);
  const paperShadowHeight = scaleValue(24, scale);
  const paperShadowRadius = scaleValue(18, scale);
  const paperPaddingHorizontal = scaleValue(18, scale);
  const paperPaddingVertical = scaleValue(12, scale);
  const paperBorderRadius = Math.max(2, scaleValue(2, scale));
  const balancedFortuneText = balanceFortuneText(fortuneText || '');
  const paperTextMetrics = getPaperTextMetrics(balancedFortuneText, scale);
  const paperTextSize = paperTextMetrics.fontSize;
  const paperTextLineHeight = paperTextMetrics.lineHeight;
  const paperGrainTop = scaleValue(7, scale);
  const paperGrainInset = scaleValue(8, scale);
  const paperCornerTopLeftWidth = scaleValue(26, scale);
  const paperCornerTopRightWidth = scaleValue(12, scale);
  const paperCornerBottomLeftWidth = scaleValue(32, scale);
  const paperCornerBottomLeftHeight = scaleValue(8, scale);
  const paperCornerBottomRightSize = scaleValue(9, scale);
  const handlePaperTextLayout = (event) => {
    onPaperTextLayout?.(event);
  };
  const handlePaperTextMeasure = (event) => {
    if (!onPaperTextMeasure) {
      return;
    }

    const textHeight = event?.nativeEvent?.layout?.height || 0;
    onPaperTextMeasure({
      height: textHeight,
      lineHeight: paperTextLineHeight,
    });
  };

  const openCookieStyle = shellProgress
    ? {
        opacity: shellProgress.interpolate({
          inputRange: [0, 0.18, 0.5, 1],
          outputRange: [0.18, 0.44, 0.82, 1],
        }),
      }
    : null;

  const paperWrapStyle = isPaperVisible
    ? {
        opacity: paperProgress.interpolate({
          inputRange: [0, 0.18, 0.6, 1],
          outputRange: [0, 0.16, 0.82, 1],
        }),
        transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [scaleValue(40, scale), scaleValue(18, scale)],
        }),
      },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-0.5deg', '-3deg'],
            }),
          },
          ...(paperCueProgress
            ? [
                {
                  translateX: paperCueProgress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [scaleValue(-7, scale), 0, scaleValue(7, scale)],
                  }),
                },
                {
                  rotate: paperCueProgress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-1.8deg', '0deg', '1.8deg'],
                  }),
                },
              ]
            : []),
        ],
      }
    : { opacity: 0 };

  const paperShadowStyle = isPaperVisible
    ? {
        opacity: paperProgress.interpolate({
          inputRange: [0, 0.24, 1],
          outputRange: [0, 0.04, 0.22],
        }),
        transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [scaleValue(42, scale), scaleValue(22, scale)],
        }),
      },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-0.5deg', '-3deg'],
            }),
          },
        ],
      }
    : { opacity: 0 };

  return (
    <View style={[styles.cookieShellFrame, shellFrame]}>
      <View style={[styles.frameWrap, cookieImageFrame]}>
        {isOpened ? (
          <Animated.Image
            resizeMode="contain"
            source={COOKIE_OPEN_IMAGE}
            style={[
              styles.frameImage,
              {
                width: openCookieFit.width,
                height: openCookieFit.height,
                transform: [
                  { translateX: openCookieFit.translateX },
                  { translateY: openCookieFit.translateY },
                  { rotate: '-2deg' },
                ],
              },
              openCookieStyle,
              styles.openImageLayer,
            ]}
          />
        ) : (
          <Image
            resizeMode="contain"
            source={COOKIE_CLOSED_IMAGE}
            style={[
              styles.frameImage,
              {
                width: closedCookieFit.width,
                height: closedCookieFit.height,
                transform: [
                  { translateX: closedCookieFit.translateX },
                  { translateY: closedCookieFit.translateY },
                  { rotate: '-8deg' },
                ],
              },
            ]}
          />
        )}
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.paperShadow,
          paperShadowStyle,
          {
            top: paperShadowTop,
            width: paperShadowWidth,
            height: paperShadowHeight,
            borderRadius: paperShadowRadius,
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.paperWrap,
          paperWrapStyle,
          {
            top: paperTop,
            width: paperWidth,
            minHeight: paperMinHeight,
            borderRadius: paperBorderRadius,
            paddingHorizontal: paperPaddingHorizontal,
            paddingVertical: paperPaddingVertical,
            backgroundColor: '#fffefb',
            borderColor: '#c7ced8',
          },
        ]}
      >
        <View
          style={[
            styles.paperGrain,
            {
              top: paperGrainTop,
              left: paperGrainInset,
              right: paperGrainInset,
            },
          ]}
        />
        <View
          style={[
            styles.paperCorner,
            {
              top: -1,
              left: -1,
              width: paperCornerTopLeftWidth,
              height: 3,
            },
          ]}
        />
        <View
          style={[
            styles.paperCorner,
            {
              top: -1,
              right: -1,
              width: paperCornerTopRightWidth,
              height: 3,
            },
          ]}
        />
        <View
          style={[
            styles.paperCorner,
            {
              bottom: -1,
              left: -1,
              width: paperCornerBottomLeftWidth,
              height: paperCornerBottomLeftHeight,
            },
          ]}
        />
        <View
          style={[
            styles.paperCorner,
            {
              right: -1,
              bottom: -1,
              width: paperCornerBottomRightSize,
              height: paperCornerBottomRightSize,
            },
          ]}
        />
        <Text
          onLayout={handlePaperTextMeasure}
          onTextLayout={handlePaperTextLayout}
          style={[styles.paperText, { fontSize: paperTextSize, lineHeight: paperTextLineHeight }]}
        >
          {balancedFortuneText}
        </Text>
      </Animated.View>
    </View>
  );
}

export { COOKIE_SHELL_FRAME, getOpenedCookieImageBottom };
export default memo(CookieShell);

const styles = StyleSheet.create({
  cookieShellFrame: {
    alignItems: 'center',
  },
  frameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameImage: {
    position: 'absolute',
  },
  openImageLayer: {
    zIndex: 3,
  },
  paperShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(70, 78, 92, 0.12)',
    zIndex: 4,
  },
  paperWrap: {
    position: 'absolute',
    borderWidth: 1,
    justifyContent: 'center',
    shadowColor: '#6a7382',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 5,
  },
  paperGrain: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(140, 152, 168, 0.18)',
  },
  paperCorner: {
    position: 'absolute',
    backgroundColor: '#1f63b7',
  },
  paperText: {
    fontFamily: FORTUNE_FONT_FAMILY,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.04,
    color: '#1f4f93',
  },
});
