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

const MAX_LENGTH = 140;

export default function CustomFortuneSheet({
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

  const trimmedLength = useMemo(() => fortuneText.trim().length, [fortuneText]);

  useEffect(() => {
    if (visible) {
      setSelectedMood(initialMoodKey || null);
      setFortuneText(initialFortuneText || '');
    }
  }, [initialFortuneText, initialMoodKey, visible]);

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

  return (
    <PreviewModal animationType="slide" onRequestClose={handleClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetWrap}
          >
            <View style={styles.sheet}>
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
                <View style={styles.moodGrid}>
                  {moodOptions.map((option) => {
                    const isSelected = option.key === selectedMood;
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
                          isSelected ? styles.moodPillSelected : null,
                        ]}
                      >
                        <Text
                          adjustsFontSizeToFit
                          minimumFontScale={0.78}
                          numberOfLines={1}
                          style={[styles.moodPillText, isSelected ? styles.moodPillTextSelected : null]}
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
    gap: 5,
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
    fontSize: 11.5,
    fontWeight: '600',
    color: '#5d4330',
    letterSpacing: -0.12,
    lineHeight: 13,
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
