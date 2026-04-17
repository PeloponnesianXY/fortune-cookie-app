import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function FortuneActionButton({
  label,
  iconName,
  onPress,
  palette,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: palette.buttonFill,
          borderColor: palette.buttonBorder,
        },
      ]}
    >
      <View style={styles.buttonContent}>
        <Text
          style={[
            styles.buttonText,
            {
              color: palette.text,
            },
          ]}
        >
          {label}
        </Text>
        <Ionicons color={palette.text} name={iconName} size={14} style={styles.buttonIcon} />
      </View>
    </Pressable>
  );
}

export default function FortuneActionTray({
  visible,
  onShare,
  onToggleFavorite,
  onReplace,
  isFavorite,
  canReplace,
  palette,
  onLayout,
}) {
  const [isMounted, setIsMounted] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
    }

    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 250 : 420,
      easing: visible ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!visible && finished) {
        setIsMounted(false);
      }
    });
  }, [progress, visible]);

  if (!isMounted) {
    return null;
  }

  const buttons = [
    { key: 'share', label: 'Share', iconName: 'share-outline', onPress: onShare },
    {
      key: 'favorite',
      label: isFavorite ? 'Unfavorite' : 'Favorite',
      iconName: isFavorite ? 'heart' : 'heart-outline',
      onPress: onToggleFavorite,
    },
    canReplace
      ? { key: 'replace', label: 'Replace', iconName: 'refresh-outline', onPress: onReplace }
      : null,
  ].filter(Boolean);

  return (
    <Animated.View
      onLayout={onLayout}
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrapper,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.985, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.card,
            borderColor: palette.cardBorder,
          },
        ]}
      >
        <Text style={[styles.label, { color: palette.label }]}>Current fortune</Text>
        <View style={styles.row}>
          {buttons.map((button) => (
            <FortuneActionButton
              key={button.key}
              label={button.label}
              iconName={button.iconName}
              onPress={button.onPress}
              palette={palette}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 7,
    paddingBottom: 8,
    shadowColor: '#5c4030',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  label: {
    marginBottom: 6,
    marginLeft: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
  },
  button: {
    minHeight: 34,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 0,
    flex: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.12,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
