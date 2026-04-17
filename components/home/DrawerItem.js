import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DrawerItem({
  label,
  onPress,
  textColor,
  backgroundColor,
  borderColor,
  detail,
  accessibilityLabel,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      style={[
        styles.item,
        backgroundColor ? { backgroundColor } : null,
        borderColor ? { borderColor } : null,
      ]}
    >
      <View style={styles.copyBlock}>
        <Text style={[styles.label, textColor ? { color: textColor } : null]}>{label}</Text>
        {detail ? (
          <Text style={[styles.detail, textColor ? { color: textColor } : null]}>
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    minHeight: 46,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  copyBlock: {
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  detail: {
    fontSize: 12.5,
    lineHeight: 17,
    opacity: 0.68,
    fontWeight: '500',
  },
});
