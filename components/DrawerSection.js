import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DrawerSection({ label, children, labelColor, style }) {
  return (
    <View style={[styles.section, style]}>
      {label ? (
        <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>
          {label}
        </Text>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  label: {
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.62,
  },
  content: {
    gap: 8,
    alignItems: 'center',
  },
});
