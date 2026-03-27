import React, { memo } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

const COOKIE_CLOSED_IMAGE = require('../assets/cookie/closed-2.png');
const COOKIE_OPEN_IMAGE = require('../assets/cookie/open.png');

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
  translateY: 36,
};

const OPEN_COOKIE_FIT = {
  width: 392,
  height: 258,
  translateX: -2,
  translateY: 38,
};

const PAPER_SIZE = {
  width: 250,
  minHeight: 74,
};

function CookieShell({
  fortuneText,
  isOpened,
  isPaperVisible,
  paperProgress,
}) {
  const paperWrapStyle = isPaperVisible
    ? {
        opacity: paperProgress.interpolate({
          inputRange: [0, 0.08, 1],
          outputRange: [0, 0.72, 1],
        }),
        transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [32, 18],
        }),
      },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-1deg', '-3deg'],
            }),
          },
        ],
      }
    : { opacity: 0 };

  const paperShadowStyle = isPaperVisible
    ? {
        opacity: paperProgress.interpolate({
          inputRange: [0, 0.12, 1],
          outputRange: [0, 0.12, 0.22],
        }),
        transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [34, 22],
        }),
      },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-1deg', '-3deg'],
            }),
          },
        ],
      }
    : { opacity: 0 };

  return (
    <View style={styles.cookieShellFrame}>
      <View style={styles.frameWrap}>
        <Image
          resizeMode="contain"
          source={COOKIE_CLOSED_IMAGE}
          style={[
            styles.frameImage,
            styles.closedImageFit,
            isOpened ? styles.inactiveImage : styles.activeImage,
          ]}
        />
        <Image
          resizeMode="contain"
          source={COOKIE_OPEN_IMAGE}
          style={[
            styles.frameImage,
            styles.openImageFit,
            isOpened ? styles.activeImage : styles.inactiveImage,
          ]}
        />
      </View>

      <Animated.View pointerEvents="none" style={[styles.paperShadow, paperShadowStyle]} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.paperWrap,
          paperWrapStyle,
          {
            backgroundColor: '#fffefb',
            borderColor: '#c7ced8',
          },
        ]}
      >
        <View style={styles.paperGrain} />
        <View style={[styles.paperCorner, styles.paperCornerTopLeft]} />
        <View style={[styles.paperCorner, styles.paperCornerTopRight]} />
        <View style={[styles.paperCorner, styles.paperCornerBottomLeft]} />
        <View style={[styles.paperCorner, styles.paperCornerBottomRight]} />
        <Text style={styles.paperText}>
          {fortuneText || ''}
        </Text>
      </Animated.View>
    </View>
  );
}

export { COOKIE_SHELL_FRAME };
export default memo(CookieShell);

const styles = StyleSheet.create({
  cookieShellFrame: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
    alignItems: 'center',
  },
  frameWrap: {
    width: COOKIE_IMAGE_FRAME.width,
    height: COOKIE_IMAGE_FRAME.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameImage: {
    position: 'absolute',
  },
  activeImage: {
    opacity: 1,
    zIndex: 2,
  },
  inactiveImage: {
    opacity: 0,
    zIndex: 1,
  },
  closedImageFit: {
    width: CLOSED_COOKIE_FIT.width,
    height: CLOSED_COOKIE_FIT.height,
    transform: [
      { translateX: CLOSED_COOKIE_FIT.translateX },
      { translateY: CLOSED_COOKIE_FIT.translateY },
      { rotate: '-8deg' },
    ],
  },
  openImageFit: {
    width: OPEN_COOKIE_FIT.width,
    height: OPEN_COOKIE_FIT.height,
    transform: [
      { translateX: OPEN_COOKIE_FIT.translateX },
      { translateY: OPEN_COOKIE_FIT.translateY },
      { rotate: '-2deg' },
    ],
  },
  paperShadow: {
    position: 'absolute',
    top: 86,
    width: 214,
    height: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(70, 78, 92, 0.12)',
    zIndex: 4,
  },
  paperWrap: {
    position: 'absolute',
    top: 64,
    width: PAPER_SIZE.width,
    minHeight: PAPER_SIZE.minHeight,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    shadowColor: '#6a7382',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 5,
  },
  paperGrain: {
    position: 'absolute',
    top: 7,
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: 'rgba(140, 152, 168, 0.18)',
  },
  paperCorner: {
    position: 'absolute',
    backgroundColor: '#1f63b7',
  },
  paperCornerTopLeft: {
    top: -1,
    left: -1,
    width: 26,
    height: 3,
  },
  paperCornerTopRight: {
    top: -1,
    right: -1,
    width: 12,
    height: 3,
  },
  paperCornerBottomLeft: {
    bottom: -1,
    left: -1,
    width: 32,
    height: 8,
  },
  paperCornerBottomRight: {
    right: -1,
    bottom: -1,
    width: 9,
    height: 9,
  },
  paperText: {
    fontFamily: FORTUNE_FONT_FAMILY,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.04,
    color: '#1f4f93',
  },
});
