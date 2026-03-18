import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { COOKIE_STATIC_STATES } from './animationTypes';
import { getCookieImageForState, getPaperOverlayStyle, getShadowStyle } from '../../lib/cookiePlayback';

const FORTUNE_FONT_FAMILY = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export default function FortuneCookieStatic({
  fortuneText,
  isOpened,
  pack,
  scene,
}) {
  const frameSize = pack.frameSize || { width: 248, height: 198 };
  const imageSource = getCookieImageForState(
    pack,
    isOpened ? COOKIE_STATIC_STATES.OPEN : COOKIE_STATIC_STATES.CLOSED
  );
  const paperOverlay = getPaperOverlayStyle(pack);
  const shadow = getShadowStyle(pack);
  const paperFrameStyle = {
    left: frameSize.width * paperOverlay.x,
    top: frameSize.height * paperOverlay.y,
    width: frameSize.width * paperOverlay.width,
    minHeight: frameSize.height * paperOverlay.height,
  };

  return (
    <View style={[styles.frame, frameSize]}>
      <Image resizeMode="contain" source={imageSource} style={styles.image} />

      {isOpened ? (
        <View
          pointerEvents="none"
          style={[
            styles.paperOverlay,
            {
              ...paperFrameStyle,
              backgroundColor: scene.paper,
              borderColor: scene.paperBorder,
              opacity: paperOverlay.maskOpacity,
              transform: [{ rotate: `${paperOverlay.rotationDeg}deg` }],
            },
          ]}
        >
          <Text style={[styles.paperText, { color: scene.textPrimary }]}>
            {fortuneText || 'Tap the cookie to reveal a fortune.'}
          </Text>
        </View>
      ) : null}

      <View
        pointerEvents="none"
        style={[
          styles.shadow,
          {
            opacity: shadow.opacity,
            transform: [
              { scaleX: shadow.scale },
              { translateY: frameSize.height * shadow.translateY },
            ],
          },
        ]}
      />
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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paperText: {
    fontSize: 8.5,
    lineHeight: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.1,
    fontFamily: FORTUNE_FONT_FAMILY,
  },
  shadow: {
    position: 'absolute',
    bottom: 12,
    width: '70%',
    height: 22,
    borderRadius: 999,
    backgroundColor: 'rgba(66, 46, 35, 0.12)',
  },
});
