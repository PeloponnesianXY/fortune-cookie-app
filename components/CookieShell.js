import React, { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

const COOKIE_FRAMES = [
  require('../assets/cookie/frames/sora_v1/frame_001.png'),
  require('../assets/cookie/frames/sora_v1/frame_002.png'),
  require('../assets/cookie/frames/sora_v1/frame_003.png'),
  require('../assets/cookie/frames/sora_v1/frame_004.png'),
  require('../assets/cookie/frames/sora_v1/frame_005.png'),
  require('../assets/cookie/frames/sora_v1/frame_006.png'),
  require('../assets/cookie/frames/sora_v1/frame_007.png'),
  require('../assets/cookie/frames/sora_v1/frame_008.png'),
  require('../assets/cookie/frames/sora_v1/frame_009.png'),
  require('../assets/cookie/frames/sora_v1/frame_010.png'),
  require('../assets/cookie/frames/sora_v1/frame_011.png'),
  require('../assets/cookie/frames/sora_v1/frame_012.png'),
  require('../assets/cookie/frames/sora_v1/frame_013.png'),
  require('../assets/cookie/frames/sora_v1/frame_014.png'),
  require('../assets/cookie/frames/sora_v1/frame_015.png'),
  require('../assets/cookie/frames/sora_v1/frame_016.png'),
  require('../assets/cookie/frames/sora_v1/frame_017.png'),
  require('../assets/cookie/frames/sora_v1/frame_018.png'),
];

const FORTUNE_FONT_FAMILY = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const COOKIE_SHELL_FRAME = {
  width: 308,
  height: 282,
};

export default function CookieShell({ fortuneText, paperProgress, scene, shellProgress }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const listenerId = shellProgress.addListener(({ value }) => {
      const nextIndex = Math.min(
        COOKIE_FRAMES.length - 1,
        Math.max(0, Math.floor(value * (COOKIE_FRAMES.length - 0.001)))
      );
      setFrameIndex(nextIndex);
    });

    return () => {
      shellProgress.removeListener(listenerId);
    };
  }, [shellProgress]);

  const frameSequenceStyle = {
    transform: [
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [16, 6, 0],
        }),
      },
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 0.16, 1],
          outputRange: [0.97, 0.99, 1],
        }),
      },
    ],
  };

  const paperWrapStyle = {
    opacity: paperProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 0.7, 1],
    }),
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [22, -8],
        }),
      },
      {
        rotate: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['-3deg', '-6deg'],
        }),
      },
    ],
  };

  const paperShadowStyle = {
    opacity: paperProgress.interpolate({
      inputRange: [0, 0.12, 1],
      outputRange: [0, 0.16, 0.28],
    }),
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [24, -6],
        }),
      },
      {
        rotate: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['-3deg', '-6deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.cookieShellFrame}>
      <Animated.Image
        resizeMode="cover"
        source={COOKIE_FRAMES[frameIndex]}
        style={[styles.sequenceImage, frameSequenceStyle]}
      />

      <View
        pointerEvents="none"
        style={[styles.sourcePaperMask, { backgroundColor: scene.sky }]}
      />
      <View
        pointerEvents="none"
        style={[styles.watermarkMask, { backgroundColor: scene.sky }]}
      />

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
        <View style={[styles.paperTab, styles.paperTabLeft]} />
        <View style={[styles.paperTab, styles.paperTabRight]} />
        <View style={styles.paperCurlLeft} />
        <View style={styles.paperCurlRight} />
        <Text numberOfLines={3} style={[styles.paperText, { color: scene.textPrimary }]}>
          {fortuneText || ''}
        </Text>
      </Animated.View>
    </View>
  );
}

export { COOKIE_SHELL_FRAME };

const styles = StyleSheet.create({
  cookieShellFrame: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
    overflow: 'hidden',
  },
  sequenceImage: {
    position: 'absolute',
    bottom: -184,
    width: 308,
    height: 563,
    alignSelf: 'center',
  },
  sourcePaperMask: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 170,
    height: 80,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    opacity: 0.98,
  },
  watermarkMask: {
    position: 'absolute',
    left: 8,
    bottom: 2,
    width: 92,
    height: 34,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    opacity: 0.98,
  },
  paperShadow: {
    position: 'absolute',
    top: 68,
    left: 96,
    width: 154,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(48, 32, 20, 0.12)',
  },
  paperWrap: {
    position: 'absolute',
    top: 56,
    left: 88,
    width: 164,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: 'center',
  },
  paperTab: {
    position: 'absolute',
    top: 10,
    width: 7,
    height: 11,
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
    top: 4,
    left: 5,
    bottom: 4,
    width: 14,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
  },
  paperCurlRight: {
    position: 'absolute',
    top: 4,
    right: 5,
    bottom: 4,
    width: 12,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    backgroundColor: 'rgba(226, 212, 192, 0.34)',
  },
  paperText: {
    fontFamily: FORTUNE_FONT_FAMILY,
    fontSize: 10.5,
    lineHeight: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
