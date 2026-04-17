import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { PreviewLayoutProvider, PreviewSafeAreaView } from './PreviewLayoutContext';

export default function PreviewFrame({
  children,
  height,
  insets,
  keyboardVisible,
  label,
  visualScale = 1,
  width,
}) {
  const scaledFrameWidth = Math.round((width + 18) * visualScale);
  const scaledFrameHeight = Math.round((height + 18) * visualScale);

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.metrics}>{width} x {height} pt</Text>
      </View>

      <View style={{ width: scaledFrameWidth, height: scaledFrameHeight }}>
        <View
          style={[
            styles.deviceFrame,
            {
              width: width + 18,
              height: height + 18,
              transform: [{ scale: visualScale }],
              transformOrigin: 'top center',
            },
          ]}
        >
          <View style={styles.speaker} />
          <PreviewLayoutProvider
            value={{
              height,
              width,
              insets,
              keyboardVisible,
            }}
          >
            <View style={[styles.viewport, { width, height }]}>
              <PreviewSafeAreaView style={styles.safeAreaViewport}>
                {children}
              </PreviewSafeAreaView>
            </View>
          </PreviewLayoutProvider>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 6,
  },
  header: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    color: '#2d241d',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  metrics: {
    color: '#7a6758',
    fontSize: 12,
    fontWeight: '600',
  },
  deviceFrame: {
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(67, 52, 40, 0.2)',
    padding: 9,
    backgroundColor: '#17120e',
    shadowColor: '#120d09',
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    alignItems: 'center',
  },
  speaker: {
    position: 'absolute',
    top: 18,
    width: 110,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    zIndex: 1,
  },
  viewport: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: '#fff8ef',
    ...(Platform.OS === 'web'
      ? {
          transform: 'translateZ(0)',
        }
      : null),
  },
  safeAreaViewport: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
