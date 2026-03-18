import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { COOKIE_ANIMATION_TYPES } from './animationTypes';
import FortuneCookieStatic from './FortuneCookieStatic';
import { getCookiePack } from '../../lib/cookieAssets';
import { getCookieImageForState, getFrameDurationMs, getPaperOverlayStyle, resolveCookiePlayback } from '../../lib/cookiePlayback';

const FORTUNE_FONT_FAMILY = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export default function FortuneCookieAnimation({
  animationKey = 0,
  fortuneText,
  isOpened,
  onAnimationComplete,
  packId = 'classic-cookie',
  reducedMotion = false,
  scene,
}) {
  const { pack, mode } = useMemo(
    () => resolveCookiePlayback(packId, reducedMotion),
    [packId, reducedMotion]
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const paperProgress = useRef(new Animated.Value(isOpened ? 1 : 0)).current;

  useEffect(() => {
    let timeoutId;
    let intervalId;

    if (!isOpened) {
      setFrameIndex(0);
      paperProgress.stopAnimation();
      paperProgress.setValue(0);
      return undefined;
    }

    const notifyComplete = () => {
      if (typeof onAnimationComplete === 'function') {
        onAnimationComplete();
      }
    };

    if (mode !== COOKIE_ANIMATION_TYPES.IMAGE_SEQUENCE) {
      paperProgress.setValue(1);
      timeoutId = setTimeout(notifyComplete, 0);
      return () => clearTimeout(timeoutId);
    }

    const frames = pack.assets.frames;
    const frameDurationMs = getFrameDurationMs(pack);
    const paperDelay = pack.recommendedTiming?.paperRevealDelayMs || 260;

    setFrameIndex(0);
    paperProgress.setValue(0);
    timeoutId = setTimeout(() => {
      Animated.timing(paperProgress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.back(0.5)),
        useNativeDriver: true,
      }).start();
    }, paperDelay);

    if (frames.length <= 1) {
      notifyComplete();
      return () => clearTimeout(timeoutId);
    }

    let nextIndex = 0;
    intervalId = setInterval(() => {
      nextIndex += 1;
      if (nextIndex >= frames.length) {
        clearInterval(intervalId);
        notifyComplete();
        return;
      }
      setFrameIndex(nextIndex);
    }, frameDurationMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [animationKey, isOpened, mode, onAnimationComplete, pack, paperProgress]);

  if (mode !== COOKIE_ANIMATION_TYPES.IMAGE_SEQUENCE) {
    return (
      <FortuneCookieStatic
        fortuneText={fortuneText}
        isOpened={isOpened}
        pack={pack}
        scene={scene}
      />
    );
  }

  const frameSize = pack.frameSize || { width: 248, height: 198 };
  const currentFrame = pack.assets.frames[frameIndex] || getCookieImageForState(pack, 'open');
  const paperOverlay = getPaperOverlayStyle(pack);
  const paperFrameStyle = {
    left: frameSize.width * paperOverlay.x,
    top: frameSize.height * paperOverlay.y,
    width: frameSize.width * paperOverlay.width,
    minHeight: frameSize.height * paperOverlay.height,
  };
  const paperStyle = {
    opacity: paperProgress,
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      {
        rotate: `${paperOverlay.rotationDeg}deg`,
      },
    ],
  };

  return (
    <View style={[styles.frame, frameSize]}>
      <Image resizeMode="contain" source={currentFrame} style={styles.image} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.paperOverlay,
          paperStyle,
          {
            ...paperFrameStyle,
            backgroundColor: scene.paper,
            borderColor: scene.paperBorder,
          },
        ]}
      >
        <Text style={[styles.paperText, { color: scene.textPrimary, opacity: paperOverlay.maskOpacity }]}>
          {fortuneText || 'Tap the cookie to reveal a fortune.'}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paperOverlay: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
    opacity: 0.94,
  },
  paperText: {
    fontSize: 8.5,
    lineHeight: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.1,
    fontFamily: FORTUNE_FONT_FAMILY,
  },
});
