import React, { createContext, useContext } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const ZERO_INSETS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const PreviewLayoutContext = createContext(null);

export function PreviewLayoutProvider({ children, value }) {
  return (
    <PreviewLayoutContext.Provider value={value || null}>
      {children}
    </PreviewLayoutContext.Provider>
  );
}

export function usePreviewLayout() {
  const windowDimensions = useWindowDimensions();
  const previewLayout = useContext(PreviewLayoutContext);
  const liveInsets = useSafeAreaInsets();

  return {
    height: previewLayout?.height ?? windowDimensions.height,
    width: previewLayout?.width ?? windowDimensions.width,
    insets: previewLayout?.insets ?? liveInsets ?? ZERO_INSETS,
    keyboardVisible: previewLayout?.keyboardVisible ?? null,
    isPreview: Boolean(previewLayout),
  };
}

export function PreviewSafeAreaView({ children, style }) {
  const previewLayout = useContext(PreviewLayoutContext);

  if (!previewLayout) {
    return <SafeAreaView style={style}>{children}</SafeAreaView>;
  }

  return (
    <View
      style={[
        style,
        {
          paddingTop: previewLayout.insets?.top ?? 0,
          paddingRight: previewLayout.insets?.right ?? 0,
          paddingBottom: previewLayout.insets?.bottom ?? 0,
          paddingLeft: previewLayout.insets?.left ?? 0,
        },
      ]}
    >
      {children}
    </View>
  );
}
