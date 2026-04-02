import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PreviewModal from './PreviewModal';
import { usePreviewLayout } from './PreviewLayoutContext';

const MAX_LENGTH = 140;

function getMoodPillTypography(width, height) {
  if (height >= 900 || width >= 430) {
    return { fontSize: 14, lineHeight: 16, minimumFontScale: 0.92 };
  }

  if (height >= 800 || width >= 390) {
    return { fontSize: 13.5, lineHeight: 15, minimumFontScale: 0.82 };
  }

  return { fontSize: 11.5, lineHeight: 13, minimumFontScale: 0.82 };
}

function getMoodPillLayout(width, height) {
  if (height >= 800 || width >= 390) {
    return { gap: 4, width: '24%' };
  }

  return { gap: 5, width: '23.5%' };
}

export default function CustomFortuneSheet({
  collapsedTopAnchor,
  collapsedEstimatedHeight,
  collapsedMaxWidth,
  initialFortuneText,
  initialMoodKey,
  isEditing,
  errorMessage,
  moodOptions,
  onCancel,
  onDismissError,
  onSave,
  saving,
  visible,
}) {
  const [selectedMood, setSelectedMood] = useState(initialMoodKey || null);
  const [fortuneText, setFortuneText] = useState(initialFortuneText || '');
  const [collapsedHeight, setCollapsedHeight] = useState(collapsedEstimatedHeight || 0);
  const [anchoredTop, setAnchoredTop] = useState(null);
  const previewLayout = usePreviewLayout();

  const trimmedLength = useMemo(() => fortuneText.trim().length, [fortuneText]);
  const moodPillTypography = useMemo(
    () => getMoodPillTypography(previewLayout.width, previewLayout.height),
    [previewLayout.height, previewLayout.width]
  );
  const moodPillLayout = useMemo(
    () => getMoodPillLayout(previewLayout.width, previewLayout.height),
    [previewLayout.height, previewLayout.width]
  );
  const isCollapsed = !selectedMood;
  const collapsedTop = collapsedTopAnchor != null ? Math.max(12, Math.round(collapsedTopAnchor)) : null;
  const sheetTop = anchoredTop ?? collapsedTop;

  useEffect(() => {
    if (visible) {
      setSelectedMood(initialMoodKey || null);
      setFortuneText(initialFortuneText || '');
      setCollapsedHeight(collapsedEstimatedHeight || 0);
      setAnchoredTop(null);
    }
  }, [collapsedEstimatedHeight, initialFortuneText, initialMoodKey, visible]);

  useEffect(() => {
    if (!visible || collapsedTop == null) {
      return;
    }

    if (isCollapsed) {
      setAnchoredTop(collapsedTop);
    }
  }, [collapsedTop, isCollapsed, visible]);

  function handleClose() {
    Keyboard.dismiss();
    setSelectedMood(null);
    setFortuneText('');
    onCancel();
  }

  async function handleSave() {
    Keyboard.dismiss();
    const didSave = await onSave({
      moodKey: selectedMood,
      fortuneText,
    });

    if (didSave) {
      setSelectedMood(null);
      setFortuneText('');
    }
  }

  function handleSheetLayout(event) {
    if (!isCollapsed) {
      return;
    }

    const nextHeight = Math.round(event.nativeEvent.layout.height);

    if (nextHeight > 0 && nextHeight !== collapsedHeight) {
      setCollapsedHeight(nextHeight);
    }
  }

  return (
    <PreviewModal animationType="slide" onRequestClose={handleClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[
              styles.sheetWrap,
              sheetTop != null
                ? { justifyContent: 'flex-start', paddingTop: sheetTop }
                : null,
            ]}
          >
            <View
              onLayout={handleSheetLayout}
              style={[
                styles.sheet,
                isCollapsed
                  ? {
                      alignSelf: 'center',
                      width: '100%',
                      maxWidth: collapsedMaxWidth || '100%',
                    }
                  : null,
              ]}
            >
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>
                    {isEditing ? 'Edit your fortune' : 'Create your own fortune'}
                  </Text>
                </View>
                <Pressable hitSlop={8} onPress={handleClose}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.moodGrid, { gap: moodPillLayout.gap }]}>
                  {moodOptions.map((option) => {
                    const isSelected = option.key === selectedMood;
                    const isLongMoodLabel = option.key === 'disgusted';
                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => {
                          if (errorMessage) {
                            onDismissError?.();
                          }
                          setSelectedMood(option.key);
                        }}
                        style={[
                          styles.moodPill,
                          { width: moodPillLayout.width },
                          isSelected ? styles.moodPillSelected : null,
                        ]}
                      >
                        <Text
                          adjustsFontSizeToFit
                          minimumFontScale={isLongMoodLabel ? 0.74 : moodPillTypography.minimumFontScale}
                          numberOfLines={1}
                          style={[
                            styles.moodPillText,
                            {
                              fontSize: isLongMoodLabel
                                ? moodPillTypography.fontSize - 1
                                : moodPillTypography.fontSize,
                              lineHeight: isLongMoodLabel
                                ? moodPillTypography.lineHeight - 1
                                : moodPillTypography.lineHeight,
                            },
                            isSelected ? styles.moodPillTextSelected : null,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {selectedMood ? (
                  <View style={styles.formCard}>
                    <TextInput
                      multiline
                      maxLength={MAX_LENGTH}
                      onChangeText={(nextValue) => {
                        if (errorMessage) {
                          onDismissError?.();
                        }
                        setFortuneText(nextValue);
                      }}
                      placeholder="Write a warm, whimsical fortune"
                      placeholderTextColor="#b2957f"
                      style={styles.input}
                      textAlignVertical="top"
                      value={fortuneText}
                    />
                    <View style={styles.formFooter}>
                      <Text style={styles.counterText}>{trimmedLength}/{MAX_LENGTH}</Text>
                      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    </View>
                    <View style={styles.actions}>
                      <Pressable onPress={handleClose} style={[styles.actionButton, styles.secondaryButton]}>
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        disabled={saving}
                        onPress={handleSave}
                        style={[styles.actionButton, styles.primaryButton, saving ? styles.actionButtonDisabled : null]}
                      >
                        <Text style={styles.primaryButtonText}>
                          {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </PreviewModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 23, 20, 0.32)',
  },
  safeArea: {
    flex: 1,
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '78%',
    backgroundColor: '#fff8f1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4f3828',
    letterSpacing: -0.2,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8d6748',
  },
  scrollContent: {
    paddingBottom: 2,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: '#fffdf9',
    width: '23.5%',
    minHeight: 30,
    paddingHorizontal: 8,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodPillSelected: {
    backgroundColor: '#f6dcc0',
    borderColor: '#ddb17a',
  },
  moodPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5d4330',
    letterSpacing: -0.12,
    lineHeight: 15,
    textAlign: 'center',
  },
  moodPillTextSelected: {
    color: '#4f3622',
  },
  formCard: {
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: 'rgba(255, 251, 245, 0.96)',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  input: {
    minHeight: 68,
    fontSize: 15,
    lineHeight: 20,
    color: '#3f2c20',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  formFooter: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9d7f68',
  },
  errorText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    color: '#9f4f42',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    minHeight: 36,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#fffdf9',
    borderColor: 'rgba(149, 114, 85, 0.16)',
  },
  primaryButton: {
    backgroundColor: '#f4e7da',
    borderColor: 'rgba(163, 117, 80, 0.22)',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3828',
    letterSpacing: -0.12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3828',
    letterSpacing: -0.12,
  },
});
