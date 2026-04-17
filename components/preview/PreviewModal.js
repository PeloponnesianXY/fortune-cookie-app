import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { usePreviewLayout } from './PreviewLayoutContext';

export default function PreviewModal({
  animationType,
  children,
  onRequestClose,
  transparent,
  visible,
}) {
  const { isPreview } = usePreviewLayout();

  if (isPreview) {
    if (!visible) {
      return null;
    }

    return (
      <View style={styles.previewOverlay}>
        {children}
      </View>
    );
  }

  return (
    <Modal
      animationType={animationType}
      onRequestClose={onRequestClose}
      transparent={transparent}
      visible={visible}
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
});
