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

import { getMoodLabSelection, MOOD_BUCKET_KEYS } from '../utils/fortuneLogic';

const MAX_ROWS = 100;
const MOOD_LAB_STORAGE_KEY = 'fortune-cookie:mood-lab:entries';
const MOOD_PILLS = [...MOOD_BUCKET_KEYS]
  .filter((mood) => mood !== 'unknown')
  .sort((left, right) => left.localeCompare(right));

function formatMoodLabel(value) {
  if (!value) {
    return 'Unknown';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatConfidence(value) {
  if (typeof value !== 'number') {
    return '0.000';
  }

  return value.toFixed(3);
}

function formatSemanticDebug(semantic) {
  if (!semantic) {
    return '';
  }

  if (!semantic.debug) {
    if (semantic.reason === 'no-vector') {
      return 'No compact vector available for this input.';
    }

    if (semantic.reason === 'too-short') {
      return 'Semantic fallback skipped because the input is too short.';
    }

    if (semantic.reason === 'invalid-input') {
      return 'Semantic fallback only runs on single-word inputs.';
    }

    if (semantic.reason === 'filtered-nonmood') {
      return 'Semantic fallback skipped because this reads more like a descriptor than a mood.';
    }

    return semantic.reason || '';
  }

  const bestScore = formatConfidence(semantic.debug.bestScore);
  const runnerUpScore = formatConfidence(semantic.debug.runnerUpScore);
  const bestBucket = formatMoodLabel(semantic.debug.bestBucket || semantic.bucket || 'unknown');
  const runnerUpBucket = formatMoodLabel(semantic.debug.runnerUpBucket || 'unknown');

  if (semantic.accepted) {
    return `Accepted semantic pick: ${bestBucket} (${bestScore}) over ${runnerUpBucket} (${runnerUpScore}).`;
  }

  if (semantic.reason === 'below-threshold') {
    return `Rejected semantic pick: ${bestBucket} scored ${bestScore}, below the acceptance cutoff. Next was ${runnerUpBucket} at ${runnerUpScore}.`;
  }

  return `Semantic check compared ${bestBucket} (${bestScore}) with ${runnerUpBucket} (${runnerUpScore}).`;
}

function getSemanticPreviewBucket(semantic) {
  if (!semantic?.accepted || !semantic.bucket) {
    return 'unknown';
  }

  return semantic.bucket;
}

function getSemanticWinnerBucket(source, semantic) {
  if (source !== 'embedding_fallback') {
    return 'unknown';
  }

  return getSemanticPreviewBucket(semantic);
}

function loadStoredEntries() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MOOD_LAB_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry) => entry && typeof entry.input === 'string')
      .map((entry, index) => ({
        id: entry.id || `mood-lab-entry-restored-${index}`,
        input: entry.input,
        nonce: entry.nonce || Math.random().toString(36).slice(2, 10),
      }))
      .slice(-MAX_ROWS);
  } catch {
    return [];
  }
}

export default function MoodLab() {
  const [entries, setEntries] = useState(() => loadStoredEntries());
  const [draftInput, setDraftInput] = useState('');
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedEntries = useMemo(() => (
    [...entries]
      .reverse()
      .map((entry) => ({
        ...entry,
        input: entry.input.trim(),
      }))
      .filter((entry) => Boolean(entry.input))
      .slice(0, MAX_ROWS)
  ), [entries]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(MOOD_LAB_STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ROWS)));
    } catch {
      // Ignore local persistence failures in the dev-only lab.
    }
  }, [entries]);

  useEffect(() => {
    let isActive = true;

    async function loadRows() {
      if (normalizedEntries.length === 0) {
        setIsLoading(false);
        setRows([]);
        return;
      }

      setIsLoading(true);
      try {
        const nextRows = await Promise.all(
          normalizedEntries.map(async (entry, index) => {
            const selection = await getMoodLabSelection(entry.input, {
              randomSeed: entry.nonce,
            });

            return {
              id: entry.id || `${entry.input}-${index}`,
              input: entry.input,
              parsedInput: selection.analysis?.lab?.parsed?.standardizedInput || selection.inputMood || entry.input,
              mood: selection.analysis?.primaryEmotion || 'unknown',
              handcraftedMood: selection.analysis?.lab?.handcrafted?.bucket || 'unknown',
              openFallbackMood: selection.analysis?.lab?.openFallback?.bucket || 'unknown',
              source: selection.analysis?.source || 'unknown',
              embeddingMood: getSemanticWinnerBucket(
                selection.analysis?.source || 'unknown',
                selection.analysis?.lab?.semantic
              ),
              fortuneText: selection.fortuneText || '',
              moderation: selection.moderation || 'clean',
              semantic: selection.analysis?.lab?.semantic || null,
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
  }, [normalizedEntries]);

  function handleSubmitWord() {
    const nextWord = draftInput.trim();

    if (!nextWord) {
      return;
    }

    setEntries((currentEntries) => [
      ...currentEntries,
      {
        id: `mood-lab-entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        input: nextWord,
        nonce: Math.random().toString(36).slice(2, 10),
      },
    ].slice(-MAX_ROWS));
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
          <View style={styles.headerTopRow}>
            <Text style={styles.eyebrow}>Mood Lab</Text>
            <View style={styles.moodPillRow}>
              {MOOD_PILLS.map((mood) => (
                <View key={mood} style={styles.moodPill}>
                  <Text style={styles.moodPillText}>{mood}</Text>
                </View>
              ))}
            </View>
          </View>
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
              setEntries([]);
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
            <Text style={[styles.headerCell, styles.inputColumn]}>Parsed</Text>
            <Text style={[styles.headerCell, styles.moodColumn]}>Handcrafted</Text>
            <Text style={[styles.headerCell, styles.moodColumn]}>Open Fallback</Text>
            <Text style={[styles.headerCell, styles.moodColumn]}>Vector Match</Text>
            <Text style={[styles.headerCell, styles.semanticColumn]}>Vector Audit</Text>
            <Text style={[styles.headerCell, styles.moodColumn]}>Final</Text>
            <Text style={[styles.headerCell, styles.sourceColumn]}>Source</Text>
            <Text style={[styles.headerCell, styles.fortuneColumn]}>Fortune</Text>
          </View>

          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={styles.resultsScroller}
            contentContainerStyle={styles.resultsScrollerContent}
          >
            {rows.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No rows yet</Text>
                <Text style={styles.emptyText}>Enter words above to preview the mapping.</Text>
              </View>
            ) : (
              rows.map((row) => (
                <View key={row.id} style={styles.resultRow}>
                  <Text style={[styles.bodyCell, styles.inputColumn, styles.inputValue]}>{row.input}</Text>
                  <Text style={[styles.bodyCell, styles.inputColumn]}>{row.parsedInput}</Text>
                  <Text style={[styles.bodyCell, styles.moodColumn]}>
                    {formatMoodLabel(row.handcraftedMood)}
                  </Text>
                  <Text style={[styles.bodyCell, styles.moodColumn]}>
                    {formatMoodLabel(row.openFallbackMood)}
                  </Text>
                  <Text style={[styles.bodyCell, styles.moodColumn]}>
                    {formatMoodLabel(row.embeddingMood)}
                  </Text>
                  <Text style={[styles.bodyCell, styles.semanticColumn]}>
                    {formatSemanticDebug(row.semantic) || '-'}
                  </Text>
                  <Text style={[styles.bodyCell, styles.moodColumn, styles.moodValue]}>
                    {formatMoodLabel(row.mood)}
                    {row.moderation !== 'clean' ? ' blocked' : ''}
                  </Text>
                  <Text style={[styles.bodyCell, styles.sourceColumn]}>{row.source}</Text>
                  <Text style={[styles.bodyCell, styles.fortuneColumn]}>{row.fortuneText}</Text>
                </View>
              ))
            )}
          </ScrollView>
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#7b5d43',
  },
  moodPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  moodPill: {
    borderRadius: 999,
    backgroundColor: '#f3e4d0',
    borderWidth: 1,
    borderColor: 'rgba(135, 101, 70, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  moodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#775b43',
    textTransform: 'capitalize',
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
    minHeight: 0,
  },
  resultsScroller: {
    maxHeight: 920,
  },
  resultsScrollerContent: {
    paddingBottom: 6,
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
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
        }
      : null),
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
    width: 96,
  },
  moodColumn: {
    width: 112,
  },
  sourceColumn: {
    width: 144,
  },
  semanticColumn: {
    width: 176,
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
