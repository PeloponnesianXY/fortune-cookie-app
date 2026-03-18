import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const COOKIE_SINGLE_IMAGE = require('../assets/single-cookie-3.png');
const COOKIE_BROKEN_IMAGE = require('../assets/broken-cookie-cutout-1.png');

const COOKIE_SHELL_FRAME = {
  width: 248,
  height: 198,
};

export default function CookieShell({ shellProgress }) {
  const closedShellOpacity = shellProgress.interpolate({
    inputRange: [0, 0.08, 0.18, 1],
    outputRange: [1, 1, 0, 0],
  });

  const closedCookieStyle = {
    opacity: closedShellOpacity,
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 0.12, 1],
          outputRange: [1, 0.985, 0.96],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
      },
    ],
  };

  const brokenShellStyle = {
    opacity: shellProgress.interpolate({
      inputRange: [0, 0.08, 0.18, 1],
      outputRange: [0, 0, 1, 1],
    }),
    transform: [
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -6],
        }),
      },
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.88, 1],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['5deg', '0deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.cookieHybridShell}>
      <Animated.Image
        resizeMode="contain"
        source={COOKIE_SINGLE_IMAGE}
        style={[styles.cookieClosedShell, closedCookieStyle]}
      />

      <Animated.Image
        resizeMode="contain"
        source={COOKIE_BROKEN_IMAGE}
        style={[styles.cookieBrokenShell, brokenShellStyle]}
      />
    </View>
  );
}

export { COOKIE_SHELL_FRAME };

const styles = StyleSheet.create({
  cookieHybridShell: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
  },
  cookieClosedShell: {
    position: 'absolute',
    bottom: 8,
    width: 186,
    height: 186,
    alignSelf: 'center',
  },
  cookieBrokenShell: {
    position: 'absolute',
    bottom: 6,
    width: 238,
    height: 159,
    alignSelf: 'center',
  },
});
