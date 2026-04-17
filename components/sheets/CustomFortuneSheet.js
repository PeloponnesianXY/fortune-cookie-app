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

import PreviewModal from '../preview/PreviewModal';
import { usePreviewLayout } from '../preview/PreviewLayoutContext';

const MAX_LENGTH = 140;

function getMoodPillTypography(width, height) {
  if (height < 720 || width <= 375) {
    return { fontSize: 12.3, lineHeight: 14.2 };
  }

  if (height >= 900 || width >= 430) {
    return { fontSize: 14, lineHeight: 16 };
  }

  if (height >= 800 || width >= 390) {
    return { fontSize: 13, lineHeight: 15 };
  }

  return { fontSize: 12, lineHeight: 14 };
}

function getMoodPillLayout(width, height) {
  if (height < 720 || width <= 375) {
    return { gap: 4 };
  }

  if (height >= 800 || width >= 390) {
    return { gap: 6 };
  }

  return { gap: 5 };
}

function getMoodSectionGap(sectionKey, width, height) {
  const { gap } = getMoodPillLayout(width, height);

  // Keep the negative row a touch tighter on SE and Max widths so
  // the final pill can stay on the second row without shrinking all sections.
  if (sectionKey === 'negative' && width <= 375) {
    return Math.max(3, gap - 1);
  }

  if (sectionKey === 'negative' && width >= 430) {
    return Math.max(2, gap - 2);
  }

  return gap;
}

function getSheetWidth(width) {
  if (width <= 375) {
    return '98%';
  }

  if (width >= 390 && width < 430) {
    return '98.5%';
  }

  if (width >= 430) {
    return '95%';
  }

  return '97%';
}

export default function CustomFortuneSheet({
  collapsedTopAnchor,
  collapsedEstimatedHeight,
  collapsedMaxWidth,
  initialFortuneText,
  initialMoodKey,
  isEditing,
  errorMessage,
  moodSections,
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
  const [isComposerFocused, setIsComposerFocused] = useState(false);
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
  const sheetWidth = useMemo(() => getSheetWidth(previewLayout.width), [previewLayout.width]);
  const isVeryCompactSheet = previewLayout.height < 720 || previewLayout.width <= 375;
  const isCollapsed = !selectedMood;
  const collapsedTop = collapsedTopAnchor != null ? Math.max(12, Math.round(collapsedTopAnchor)) : null;
  const sheetTop = anchoredTop ?? collapsedTop;

  useEffect(() => {
    if (visible) {
      setSelectedMood(initialMoodKey || null);
      setFortuneText(initialFortuneText || '');
      setCollapsedHeight(collapsedEstimatedHeight || 0);
      setAnchoredTop(null);
      setIsComposerFocused(false);
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
    setIsComposerFocused(false);
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
      setIsComposerFocused(false);
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
                {
                  width: sheetWidth,
                  alignSelf: 'center',
                  maxWidth: collapsedMaxWidth || '100%',
                },
                isVeryCompactSheet ? styles.sheetCompact : null,
              ]}
            >
              <View style={styles.header}>
                <View>
                  <Text style={[styles.title, isVeryCompactSheet ? styles.titleCompact : null]}>
                    {isEditing ? 'Edit your fortune' : 'Create your own fortune'}
                  </Text>
                  {!isEditing ? (
                    <Text style={[styles.subtitle, isVeryCompactSheet ? styles.subtitleCompact : null]}>
                      I&apos;m feeling...
                    </Text>
                  ) : null}
                </View>
                <Pressable hitSlop={8} onPress={handleClose}>
                  <Text style={[styles.closeText, isVeryCompactSheet ? styles.closeTextCompact : null]}>
                    Close
                  </Text>
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {!isComposerFocused ? moodSections.map((section, sectionIndex) => (
                  <View
                    key={section.key}
                    style={sectionIndex === 0 ? styles.firstMoodSection : sectionIndex > 0 ? styles.moodSection : null}
                  >
                    <View style={styles.moodSectionHeader}>
                      <Text style={[styles.moodSectionLabel, isVeryCompactSheet ? styles.moodSectionLabelCompact : null]}>
                        {section.label}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.moodGrid,
                        {
                          gap: getMoodSectionGap(section.key, previewLayout.width, previewLayout.height),
                        },
                      ]}
                    >
                      {section.options.map((option) => {
                        const isSelected = option.key === selectedMood;
                        const useTighterNegativePills =
                          section.key === 'negative' &&
                          (previewLayout.width <= 375 || previewLayout.width >= 430);
                        const useTightestNegativePills =
                          section.key === 'negative' && previewLayout.width >= 430;
                        return (
                          <Pressable
                            key={option.key}
                            onPress={() => {
                              if (errorMessage) {
                                onDismissError?.();
                              }
                              setSelectedMood(option.key);
                              setIsComposerFocused(true);
                            }}
                            style={[
                              styles.moodPill,
                              isVeryCompactSheet ? styles.moodPillCompact : null,
                              useTighterNegativePills ? styles.moodPillTight : null,
                              useTighterNegativePills && isVeryCompactSheet ? styles.moodPillCompactTight : null,
                              useTightestNegativePills ? styles.moodPillWideScreenTight : null,
                              isSelected ? styles.moodPillSelected : null,
                            ]}
                          >
                            <Text
                              style={[
                                styles.moodPillText,
                                {
                                  fontSize: moodPillTypography.fontSize,
                                  lineHeight: moodPillTypography.lineHeight,
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
                  </View>
                )) : null}

                {selectedMood ? (
                  <View style={styles.formCard}>
                    {isComposerFocused ? (
                      <View style={styles.selectedMoodRow}>
                        <Text style={styles.selectedMoodLabel}>Mood</Text>
                        <View style={styles.selectedMoodPill}>
                          <Text style={styles.selectedMoodPillText}>
                            {moodSections
                              .flatMap((section) => section.options)
                              .find((option) => option.key === selectedMood)?.label || selectedMood}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    <TextInput
                      multiline
                      maxLength={MAX_LENGTH}
                      onBlur={() => setIsComposerFocused(false)}
                      onChangeText={(nextValue) => {
                        if (errorMessage) {
                          onDismissError?.();
                        }
                        setFortuneText(nextValue);
                      }}
                      onFocus={() => setIsComposerFocused(true)}
                      placeholder="Write a warm, whimsical fortune"
                      placeholderTextColor="#b2957f"
                      style={[styles.input, isVeryCompactSheet ? styles.inputCompact : null]}
                      textAlignVertical="top"
                      value={fortuneText}
                    />
                    <View style={[styles.formFooter, isVeryCompactSheet ? styles.formFooterCompact : null]}>
                      <Text style={[styles.counterText, isVeryCompactSheet ? styles.counterTextCompact : null]}>
                        {trimmedLength}/{MAX_LENGTH}
                      </Text>
                      {errorMessage ? (
                        <Text style={[styles.errorText, isVeryCompactSheet ? styles.errorTextCompact : null]}>
                          {errorMessage}
                        </Text>
                      ) : null}
                    </View>
                    <View style={[styles.actions, isVeryCompactSheet ? styles.actionsCompact : null]}>
                      <Pressable
                        onPress={handleClose}
                        style={[styles.actionButton, styles.secondaryButton, isVeryCompactSheet ? styles.actionButtonCompact : null]}
                      >
                        <Text style={[styles.secondaryButtonText, isVeryCompactSheet ? styles.actionButtonTextCompact : null]}>
                          Cancel
                        </Text>
                      </Pressable>
                      <Pressable
                        disabled={saving}
                        onPress={handleSave}
                        style={[
                          styles.actionButton,
                          styles.primaryButton,
                          isVeryCompactSheet ? styles.actionButtonCompact : null,
                          saving ? styles.actionButtonDisabled : null,
                        ]}
                      >
                        <Text style={[styles.primaryButtonText, isVeryCompactSheet ? styles.actionButtonTextCompact : null]}>
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
    maxHeight: '74%',
    backgroundColor: '#fff8f1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  sheetCompact: {
    maxHeight: '74%',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4f3828',
    letterSpacing: -0.2,
  },
  titleCompact: {
    fontSize: 17,
    lineHeight: 21,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: '#8f6b4f',
    fontWeight: '600',
  },
  subtitleCompact: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 14,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8d6748',
  },
  closeTextCompact: {
    fontSize: 12.5,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  firstMoodSection: {
    marginTop: 4,
  },
  moodSection: {
    marginTop: 4,
  },
  moodSectionHeader: {
    marginBottom: 3,
    paddingLeft: 2,
  },
  moodSectionLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#9b7960',
  },
  moodSectionLabelCompact: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.7,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  moodPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: '#fffdf9',
    minHeight: 30,
    maxWidth: '100%',
    paddingHorizontal: 11,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  moodPillCompact: {
    minHeight: 28,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  moodPillTight: {
    paddingHorizontal: 9,
  },
  moodPillCompactTight: {
    paddingHorizontal: 7,
  },
  moodPillWideScreenTight: {
    paddingHorizontal: 7,
  },
  moodPillSelected: {
    backgroundColor: '#f6dcc0',
    borderColor: '#ddb17a',
  },
  moodPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5d4330',
    letterSpacing: -0.08,
    lineHeight: 14,
    textAlign: 'center',
    flexShrink: 1,
  },
  moodPillTextSelected: {
    color: '#4f3622',
  },
  formCard: {
    marginTop: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: 'rgba(255, 251, 245, 0.96)',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  selectedMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  selectedMoodLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8f6b4f',
  },
  selectedMoodPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: '#fffdf9',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedMoodPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5d4330',
  },
  input: {
    minHeight: 54,
    fontSize: 15,
    lineHeight: 20,
    color: '#3f2c20',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputCompact: {
    minHeight: 46,
    fontSize: 14,
    lineHeight: 18,
  },
  formFooter: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  formFooterCompact: {
    marginTop: 4,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9d7f68',
  },
  counterTextCompact: {
    fontSize: 11,
  },
  errorText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    color: '#9f4f42',
    fontWeight: '600',
  },
  errorTextCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionsCompact: {
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    minHeight: 34,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  actionButtonCompact: {
    minHeight: 30,
    borderRadius: 12,
    paddingHorizontal: 12,
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
  actionButtonTextCompact: {
    fontSize: 13,
  },
});
