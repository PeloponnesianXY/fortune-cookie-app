import React, { memo } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

const COOKIE_CLOSED_IMAGE = require('../assets/cookie/closed.png');
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
  translateX: -4,
  translateY: 8,
};

const OPEN_COOKIE_FIT = {
  width: 428,
  height: 282,
  translateX: -2,
  translateY: 18,
};

const PAPER_SIZE = {
  width: 208,
  minHeight: 48,
};

function CookieShell({
  fortuneText,
  isOpened,
  isPaperVisible,
  paperProgress,
  scene,
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
              outputRange: [18, 0],
            }),
          },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-2deg', '-4deg'],
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
              outputRange: [20, 2],
            }),
          },
          {
            rotate: paperProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['-2deg', '-4deg'],
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
          source={isOpened ? COOKIE_OPEN_IMAGE : COOKIE_CLOSED_IMAGE}
          style={[
            styles.frameImage,
            isOpened ? styles.openImageFit : styles.closedImageFit,
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
            backgroundColor: scene.paper,
            borderColor: scene.paperBorder,
          },
        ]}
      >
        <View style={styles.paperTopSheen} />
        <View style={[styles.paperTab, styles.paperTabLeft]} />
        <View style={[styles.paperTab, styles.paperTabRight]} />
        <View style={styles.paperCurlLeft} />
        <View style={styles.paperCurlRight} />
        <View style={styles.paperBottomShade} />
        <Text numberOfLines={3} style={[styles.paperText, { color: scene.textPrimary }]}>
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
  closedImageFit: {
    width: CLOSED_COOKIE_FIT.width,
    height: CLOSED_COOKIE_FIT.height,
    transform: [
      { translateX: CLOSED_COOKIE_FIT.translateX },
      { translateY: CLOSED_COOKIE_FIT.translateY },
    ],
  },
  openImageFit: {
    width: OPEN_COOKIE_FIT.width,
    height: OPEN_COOKIE_FIT.height,
    transform: [
      { translateX: OPEN_COOKIE_FIT.translateX },
      { translateY: OPEN_COOKIE_FIT.translateY },
    ],
  },
  paperShadow: {
    position: 'absolute',
    top: 64,
    width: 196,
    height: 28,
    borderRadius: 18,
    backgroundColor: 'rgba(48, 32, 20, 0.16)',
  },
  paperWrap: {
    position: 'absolute',
    top: 52,
    width: PAPER_SIZE.width,
    minHeight: PAPER_SIZE.minHeight,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    shadowColor: '#6e4d36',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  paperTopSheen: {
    position: 'absolute',
    top: 2,
    left: 18,
    right: 18,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  paperTab: {
    position: 'absolute',
    top: 10,
    width: 6,
    height: 9,
    backgroundColor: '#284493',
  },
  paperTabLeft: {
    left: -1,
  },
  paperTabRight: {
    right: -1,
  },
  paperCurlLeft: {
    position: 'absolute',
    top: 5,
    left: 6,
    bottom: 5,
    width: 13,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
  },
  paperCurlRight: {
    position: 'absolute',
    top: 5,
    right: 6,
    bottom: 5,
    width: 11,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(226, 212, 192, 0.3)',
  },
  paperBottomShade: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 3,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 191, 162, 0.14)',
  },
  paperText: {
    fontFamily: FORTUNE_FONT_FAMILY,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.06,
  },
});
