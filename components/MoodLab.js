import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getMoodLabSelection } from '../utils/fortuneLogic';

const DEFAULT_INPUT = '';
const MAX_ROWS = 30;

function formatConfidence(value) {
  if (typeof value !== 'number') {
    return '0.000';
  }

  return value.toFixed(3);
}

export default function MoodLab() {
  const [inputValue, setInputValue] = useState(DEFAULT_INPUT);
  const [draftInput, setDraftInput] = useState('');
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedInputs = useMemo(() => (
    inputValue
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, MAX_ROWS)
  ), [inputValue]);

  useEffect(() => {
    let isActive = true;

    async function loadRows() {
      if (normalizedInputs.length === 0) {
        setIsLoading(false);
        setRows([]);
        return;
      }

      setIsLoading(true);
      try {
        const nextRows = await Promise.all(
          normalizedInputs.map(async (input, index) => {
            const selection = await getMoodLabSelection(input);

            return {
              id: `${input}-${index}`,
              input,
              mood: selection.analysis?.primaryEmotion || 'weird',
              confidence: selection.analysis?.confidence ?? 0,
              fortuneText: selection.fortuneText || '',
              moderation: selection.moderation || 'clean',
              source: selection.analysis?.source || 'unknown',
            };
          })
        );

        if (!isActive) {
          return;
        }

        setRows(nextRows);
        setIsLoading(false);
      } catch {
        if (!isActive) {
          return;
        }

        setRows([]);
        setIsLoading(false);
      }
    }

    loadRows();

    return () => {
      isActive = false;
    };
  }, [normalizedInputs]);

  function handleSubmitWord() {
    const nextWord = draftInput.trim();

    if (!nextWord) {
      return;
    }

    setInputValue((currentValue) => {
      const existingWords = currentValue
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      return [...existingWords, nextWord].slice(0, MAX_ROWS).join('\n');
    });
    setDraftInput('');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
      style={styles.page}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Mood Lab</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            blurOnSubmit={false}
            editable
            enterKeyHint="done"
            multiline={false}
            onChangeText={setDraftInput}
            onSubmitEditing={handleSubmitWord}
            placeholder="Enter words"
            placeholderTextColor="#947f6c"
            spellCheck={false}
            style={[styles.input, styles.headerInput]}
            importantForAutofill="no"
            value={draftInput}
          />
        </View>

        <View style={styles.headerMeta}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Rows</Text>
            <Text style={styles.metaValue}>{rows.length}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Max</Text>
            <Text style={styles.metaValue}>{MAX_ROWS}</Text>
          </View>
          <Pressable
            onPress={() => {
              setDraftInput('');
              setInputValue('');
            }}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.workspace}>
        <View style={styles.resultsPanel}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.panelLabel}>Results</Text>
            </View>
            {isLoading ? <ActivityIndicator color="#8a5a31" size="small" /> : null}
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.inputColumn]}>Input</Text>
            <Text style={[styles.headerCell, styles.moodColumn]}>Mood</Text>
            <Text style={[styles.headerCell, styles.confidenceColumn]}>Confidence</Text>
            <Text style={[styles.headerCell, styles.sourceColumn]}>Source</Text>
            <Text style={[styles.headerCell, styles.fortuneColumn]}>Fortune</Text>
          </View>

          {rows.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No rows yet</Text>
              <Text style={styles.emptyText}>Enter words above to preview the mapping.</Text>
            </View>
          ) : (
            rows.map((row) => (
              <View key={row.id} style={styles.resultRow}>
                <Text style={[styles.bodyCell, styles.inputColumn, styles.inputValue]}>{row.input}</Text>
                <Text style={[styles.bodyCell, styles.moodColumn, styles.moodValue]}>
                  {row.mood}
                  {row.moderation !== 'clean' ? ' blocked' : ''}
                </Text>
                <Text style={[styles.bodyCell, styles.confidenceColumn]}>{formatConfidence(row.confidence)}</Text>
                <Text style={[styles.bodyCell, styles.sourceColumn]}>{row.source}</Text>
                <Text style={[styles.bodyCell, styles.fortuneColumn]}>{row.fortuneText}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#efe5d6',
  },
  pageContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  headerCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 249, 241, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.14)',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky',
          top: 10,
          zIndex: 10,
          backdropFilter: 'blur(12px)',
        }
      : null),
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#7b5d43',
  },
  headerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  metaPill: {
    borderRadius: 999,
    backgroundColor: '#f5e7d2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 72,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8e735a',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38281c',
  },
  resetButton: {
    borderRadius: 999,
    backgroundColor: '#d8a66b',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2f2015',
  },
  workspace: {
    width: '100%',
  },
  resultsPanel: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#fffdf9',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.14)',
    padding: 16,
    gap: 10,
  },
  panelLabel: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: '#7a5d44',
  },
  headerInput: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#f8ecdc',
    borderWidth: 1,
    borderColor: 'rgba(140, 109, 83, 0.14)',
    maxWidth: 520,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 15,
    lineHeight: 20,
    color: '#33261d',
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
        }
      : null),
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 89, 58, 0.12)',
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: '#86674d',
  },
  resultRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#fff8f1',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.08)',
    alignItems: 'flex-start',
  },
  bodyCell: {
    fontSize: 13,
    lineHeight: 18,
    color: '#392b20',
  },
  inputColumn: {
    width: 90,
  },
  moodColumn: {
    width: 88,
  },
  confidenceColumn: {
    width: 84,
    fontVariant: ['tabular-nums'],
  },
  sourceColumn: {
    width: 110,
  },
  fortuneColumn: {
    flex: 1,
    minWidth: 220,
  },
  moodValue: {
    textTransform: 'capitalize',
    fontWeight: '700',
    color: '#6d4625',
  },
  inputValue: {
    fontWeight: '700',
    color: '#2e2219',
  },
  emptyState: {
    borderRadius: 16,
    backgroundColor: '#fff8f0',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#463326',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: '#806855',
  },
});
