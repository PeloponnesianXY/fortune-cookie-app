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
const EXPANDED_MOOD_KEYS = ['caring', 'guilty', 'embarrassed', 'distracted'];

function getMoodPillTypography(width, height) {
  if (height < 720 || width <= 375) {
    return { fontSize: 10, lineHeight: 11, minimumFontScale: 0.62 };
  }

  if (height >= 900 || width >= 430) {
    return { fontSize: 14, lineHeight: 16, minimumFontScale: 0.92 };
  }

  if (height >= 800 || width >= 390) {
    return { fontSize: 13, lineHeight: 15, minimumFontScale: 0.74 };
  }

  return { fontSize: 11.5, lineHeight: 13, minimumFontScale: 0.82 };
}

function getMoodPillLayout(width, height) {
  if (height < 720 || width <= 375) {
    return { gap: 3, width: '19%' };
  }

  if (height >= 800 || width >= 390) {
    return { gap: 3, width: '24.25%' };
  }

  return { gap: 5, width: '23.5%' };
}

function getSheetWidth(width) {
  if (width <= 375) {
    return '98%';
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
  const [hoveredMoodKey, setHoveredMoodKey] = useState(null);
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
  const sheetWidth = useMemo(() => getSheetWidth(previewLayout.width), [previewLayout.width]);
  const isVeryCompactSheet = previewLayout.height < 720 || previewLayout.width <= 375;
  const isCollapsed = !selectedMood;
  const collapsedTop = collapsedTopAnchor != null ? Math.max(12, Math.round(collapsedTopAnchor)) : null;
  const sheetTop = anchoredTop ?? collapsedTop;

  useEffect(() => {
    if (visible) {
      setSelectedMood(initialMoodKey || null);
      setFortuneText(initialFortuneText || '');
      setHoveredMoodKey(null);
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
                { width: sheetWidth, alignSelf: 'center' },
                isVeryCompactSheet ? styles.sheetCompact : null,
                isCollapsed
                  ? {
                      maxWidth: collapsedMaxWidth || '100%',
                    }
                  : null,
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
                {moodSections.map((section, sectionIndex) => (
                  <View
                    key={section.key}
                    style={sectionIndex > 0 ? styles.moodSection : null}
                  >
                    <View style={styles.moodSectionHeader}>
                      <Text style={[styles.moodSectionLabel, isVeryCompactSheet ? styles.moodSectionLabelCompact : null]}>
                        {section.label}
                      </Text>
                    </View>
                    <View style={[styles.moodGrid, { gap: moodPillLayout.gap }]}>
                      {section.options.map((option) => {
                        const isSelected = option.key === selectedMood;
                        const isAlwaysExpanded = EXPANDED_MOOD_KEYS.includes(option.key);
                        const isExpandedOnHover = Platform.OS === 'web'
                          && isAlwaysExpanded
                          && hoveredMoodKey === option.key;
                        return (
                          <Pressable
                            key={option.key}
                            onHoverIn={() => {
                              if (isAlwaysExpanded) {
                                setHoveredMoodKey(option.key);
                              }
                            }}
                            onHoverOut={() => setHoveredMoodKey((current) => (
                              current === option.key ? null : current
                            ))}
                            onPress={() => {
                              if (errorMessage) {
                                onDismissError?.();
                              }
                              setSelectedMood(option.key);
                            }}
                            style={[
                              styles.moodPill,
                              isVeryCompactSheet ? styles.moodPillCompact : null,
                              { width: moodPillLayout.width },
                              isExpandedOnHover ? styles.moodPillHoverExpanded : null,
                              isSelected ? styles.moodPillSelected : null,
                            ]}
                          >
                            <Text
                              adjustsFontSizeToFit
                              minimumFontScale={moodPillTypography.minimumFontScale}
                              numberOfLines={1}
                              style={[
                                styles.moodPillText,
                                {
                                  fontSize: moodPillTypography.fontSize,
                                  lineHeight: moodPillTypography.lineHeight,
                                },
                                isAlwaysExpanded ? styles.moodPillTextAlwaysExpanded : null,
                                isVeryCompactSheet && isAlwaysExpanded ? styles.moodPillTextCompactLong : null,
                                isExpandedOnHover ? styles.moodPillTextHoverExpanded : null,
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
                ))}

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
    maxHeight: '78%',
    backgroundColor: '#fff8f1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sheetCompact: {
    maxHeight: '78%',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
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
  titleCompact: {
    fontSize: 17,
    lineHeight: 21,
  },
  subtitle: {
    marginTop: 4,
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
    paddingBottom: 2,
  },
  moodSection: {
    marginTop: 6,
  },
  moodSectionHeader: {
    marginBottom: 4,
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
    width: '23.5%',
    minHeight: 28,
    paddingHorizontal: 8,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodPillCompact: {
    minHeight: 25,
    paddingHorizontal: 4,
  },
  moodPillHoverExpanded: {
    zIndex: 2,
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
  moodPillTextAlwaysExpanded: {
    fontSize: 10.5,
  },
  moodPillTextHoverExpanded: {
    fontSize: 10.25,
  },
  moodPillTextCompactLong: {
    fontSize: 9.35,
  },
  formCard: {
    marginTop: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: 'rgba(255, 251, 245, 0.96)',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  input: {
    minHeight: 62,
    fontSize: 15,
    lineHeight: 20,
    color: '#3f2c20',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputCompact: {
    minHeight: 52,
    fontSize: 14,
    lineHeight: 18,
  },
  formFooter: {
    marginTop: 6,
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
    marginTop: 8,
  },
  actionsCompact: {
    gap: 8,
    marginTop: 6,
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
  actionButtonCompact: {
    minHeight: 32,
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
