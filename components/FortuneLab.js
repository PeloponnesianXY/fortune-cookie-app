import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_PORT = 4312;
const DEFAULT_BUCKET_ORDER = [
  'caring',
  'engaged',
  'wowed',
  'angry',
  'anxious',
  'embarrassed',
  'calm',
  'confident',
  'confused',
  'distracted',
  'disgusted',
  'emotional',
  'frustrated',
  'grateful',
  'guilty',
  'happy',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'neutral',
  'numb',
  'proud',
  'romantic',
  'sad',
  'sick',
  'stressed',
  'shaken',
  'tired',
  'wired',
];
const POSITIVE_BUCKETS = [
  'caring',
  'calm',
  'confident',
  'engaged',
  'grateful',
  'happy',
  'hopeful',
  'proud',
  'romantic',
  'wowed',
];
const NEUTRAL_BUCKETS = [
  'confused',
  'emotional',
  'neutral',
];
const NEGATIVE_BUCKETS = [
  'angry',
  'anxious',
  'distracted',
  'embarrassed',
  'disgusted',
  'frustrated',
  'guilty',
  'hungry',
  'jealous',
  'lonely',
  'numb',
  'sad',
  'shaken',
  'sick',
  'stressed',
  'tired',
  'wired',
];
const HIDDEN_BUCKET_COLUMNS = ['unknown'];
const FORTUNE_ROW_HEIGHT = 41;
const SECTION_HEADER_HEIGHT = 30;
const TEMP_FORTUNE_ID_PREFIX = 'temp-fortune-';
const ALL_BUCKETS = [...new Set([
  ...DEFAULT_BUCKET_ORDER,
  ...POSITIVE_BUCKETS,
  ...NEUTRAL_BUCKETS,
  ...NEGATIVE_BUCKETS,
  ...HIDDEN_BUCKET_COLUMNS,
])];

function getApiBaseUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return `http://127.0.0.1:${API_PORT}`;
  }

  return `http://${window.location.hostname || '127.0.0.1'}:${API_PORT}`;
}

function formatBucketLabel(bucket) {
  if (!bucket) {
    return 'Unknown';
  }

  if (bucket === 'unknown') {
    return 'Unknown';
  }

  if (bucket === 'caring') {
    return 'Affectionate';
  }

  if (bucket === 'guilty') {
    return 'Remorseful';
  }

  if (bucket === 'distracted') {
    return 'Unbalanced';
  }

  return bucket.charAt(0).toUpperCase() + bucket.slice(1);
}

function computeScope(buckets) {
  return buckets.length > 1 ? 'shared' : 'specific';
}

function formatScopeLabel(buckets) {
  return buckets.length > 1 ? 'many' : '1 bucket';
}

function sortFortunes(fortunes, bucketOrder) {
  return [...fortunes].sort((left, right) => {
    const leftIndex = bucketOrder.indexOf(left.primaryBucket);
    const rightIndex = bucketOrder.indexOf(right.primaryBucket);

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return left.id.localeCompare(right.id);
  });
}

function replaceFortune(currentFortunes, nextFortune, bucketOrder) {
  return sortFortunes(
    currentFortunes.map((fortune) => (
      fortune.id === nextFortune.id ? nextFortune : fortune
    )),
    bucketOrder
  );
}

function createDraftFortune(bucket) {
  return {
    id: `${TEMP_FORTUNE_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: '',
    primaryBucket: bucket,
    alsoFits: [],
    buckets: [bucket],
    scope: 'specific',
    active: true,
  };
}

function getSectionedFortunes(fortunes, bucketOrder) {
  const grouped = new Map(bucketOrder.map((bucket) => [bucket, []]));

  for (const fortune of fortunes) {
    if (!grouped.has(fortune.primaryBucket)) {
      grouped.set(fortune.primaryBucket, []);
    }

    grouped.get(fortune.primaryBucket).push(fortune);
  }

  return bucketOrder
    .map((bucket) => ({
      bucket,
      fortunes: grouped.get(bucket) || [],
    }));
}

function flattenSectionedFortunes(sectionedFortunes) {
  const items = [];

  for (const section of sectionedFortunes) {
    items.push({
      id: `section:${section.bucket}`,
      kind: 'section',
      bucket: section.bucket,
      count: section.fortunes.length,
    });

    for (const fortune of section.fortunes) {
      items.push({
        id: fortune.id,
        kind: 'fortune',
        fortune,
      });
    }
  }

  return items;
}

function getColumnBucketOrder(bucketOrder) {
  const visibleBuckets = bucketOrder.filter((bucket) => !HIDDEN_BUCKET_COLUMNS.includes(bucket));
  const seen = new Set();
  const preferredOrder = [
    ...POSITIVE_BUCKETS,
    ...NEUTRAL_BUCKETS,
    ...NEGATIVE_BUCKETS,
  ];

  const ordered = preferredOrder.filter((bucket) => {
    if (!visibleBuckets.includes(bucket) || seen.has(bucket)) {
      return false;
    }

    seen.add(bucket);
    return true;
  });

  const leftovers = visibleBuckets
    .filter((bucket) => !seen.has(bucket))
    .sort((left, right) => left.localeCompare(right));

  return [...ordered, ...leftovers];
}

function getDisplayBucketOrder(bucketOrder) {
  const visibleBuckets = getColumnBucketOrder(bucketOrder);
  const hiddenBuckets = bucketOrder.filter((bucket) => HIDDEN_BUCKET_COLUMNS.includes(bucket));
  return [...visibleBuckets, ...hiddenBuckets];
}

function normalizeBucketOrder(bucketOrder) {
  const incoming = Array.isArray(bucketOrder) ? bucketOrder : [];
  const seen = new Set();
  const normalized = [];

  for (const bucket of [...incoming, ...ALL_BUCKETS]) {
    if (!bucket || seen.has(bucket)) {
      continue;
    }

    seen.add(bucket);
    normalized.push(bucket);
  }

  return normalized;
}

function BucketCheckbox({ checked, label, onPress }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={[styles.checkbox, checked ? styles.checkboxChecked : null]}
    >
      <Text style={[styles.checkboxText, checked ? styles.checkboxTextChecked : null]}>
        {checked ? '✓' : ''}
      </Text>
    </Pressable>
  );
}

const SectionHeaderRow = memo(function SectionHeaderRow({ bucket, count, onAddRow }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderInline}>
        <Text style={styles.sectionTitle}>{formatBucketLabel(bucket)}</Text>
        <Text style={styles.sectionCount}>{count}</Text>
        <Pressable onPress={() => onAddRow(bucket)} hitSlop={6} style={styles.sectionAddInlineButton}>
          <Text style={styles.sectionAddInlineText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
});

const FortuneRow = memo(function FortuneRow({
  columnBucketOrder,
  fortune,
  focusedFortuneId,
  onDelete,
  onTextBlur,
  onTextChange,
  onTextFocus,
  onToggleBucket,
}) {
  return (
    <View style={styles.row}>
      <TextInput
        blurOnSubmit
        editable
        multiline={false}
        numberOfLines={1}
        onFocus={() => onTextFocus(fortune.id)}
        onBlur={() => onTextBlur(fortune)}
        onChangeText={(nextText) => onTextChange(fortune.id, nextText)}
        onSubmitEditing={() => onTextBlur(fortune)}
        selectTextOnFocus
        style={[
          styles.textInput,
          styles.textColumn,
          focusedFortuneId === fortune.id ? styles.textInputFocused : null,
        ]}
        value={fortune.text}
      />
      <View style={[styles.scopeBadge, styles.scopeColumn]}>
        <Text style={styles.scopeText}>{formatScopeLabel(fortune.buckets)}</Text>
      </View>
      <View style={[styles.lenBadge, styles.lenColumn]}>
        <Text style={styles.lenText}>{fortune.text.length}</Text>
      </View>
      <View style={[styles.deleteColumn, styles.deleteWrap]}>
        <Pressable onPress={() => onDelete(fortune.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>X</Text>
        </Pressable>
      </View>
      {columnBucketOrder.map((bucket) => (
        <View key={`${fortune.id}:${bucket}`} style={[styles.bucketColumn, styles.bucketCell]}>
          <BucketCheckbox
            checked={fortune.buckets.includes(bucket)}
            label={`${fortune.id}-${bucket}`}
            onPress={() => onToggleBucket(fortune, bucket)}
          />
        </View>
      ))}
    </View>
  );
});

export default function FortuneLab() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [bucketOrder, setBucketOrder] = useState(DEFAULT_BUCKET_ORDER);
  const [fortunes, setFortunes] = useState([]);
  const [baselineFortunes, setBaselineFortunes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [focusedFortuneId, setFocusedFortuneId] = useState(null);
  const [isProcessingChanges, setIsProcessingChanges] = useState(false);
  const displayBucketOrder = useMemo(() => getDisplayBucketOrder(bucketOrder), [bucketOrder]);
  const sectionedFortunes = useMemo(
    () => getSectionedFortunes(fortunes, displayBucketOrder),
    [displayBucketOrder, fortunes]
  );
  const flatListItems = useMemo(() => flattenSectionedFortunes(sectionedFortunes), [sectionedFortunes]);
  const flatListMetrics = useMemo(() => {
    let offset = 0;

    return flatListItems.map((item) => {
      const length = item.kind === 'section' ? SECTION_HEADER_HEIGHT : FORTUNE_ROW_HEIGHT;
      const metric = { length, offset };
      offset += length;
      return metric;
    });
  }, [flatListItems]);
  const columnBucketOrder = useMemo(() => getColumnBucketOrder(bucketOrder), [bucketOrder]);
  const hasPendingChanges = useMemo(() => {
    const baselineMap = new Map(baselineFortunes.map((fortune) => [fortune.id, fortune]));
    const currentMap = new Map(fortunes.map((fortune) => [fortune.id, fortune]));

    if (baselineMap.size !== currentMap.size) {
      return true;
    }

    for (const [id, currentFortune] of currentMap.entries()) {
      const baselineFortune = baselineMap.get(id);
      if (!baselineFortune) {
        return true;
      }

      if (
        baselineFortune.text !== currentFortune.text
        || baselineFortune.primaryBucket !== currentFortune.primaryBucket
        || (baselineFortune.buckets || []).join('|') !== (currentFortune.buckets || []).join('|')
      ) {
        return true;
      }
    }

    return false;
  }, [baselineFortunes, fortunes]);

  async function loadFortunes() {
    setIsLoading(true);
    setLoadError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/fortunes`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Fortune Lab API is unavailable.');
      }

      const payload = await response.json();
      const nextBucketOrder = normalizeBucketOrder(payload.bucketOrder || DEFAULT_BUCKET_ORDER);
      const nextFortunes = Array.isArray(payload.fortunes) ? payload.fortunes : [];

      setBucketOrder(nextBucketOrder);
      const sortedFortunes = sortFortunes(nextFortunes, nextBucketOrder);
      setFortunes(sortedFortunes);
      setBaselineFortunes(sortedFortunes);
    } catch (error) {
      setLoadError(
        error.message
          || `Start the local API with \`node scripts/fortuneLabServer.js\` and reload this lab.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFortunes();
  }, [apiBaseUrl]);

  const handleTextChange = useCallback((fortuneId, nextText) => {
    setFortunes((current) => {
      const nextFortunes = current.map((fortune) => {
        if (fortune.id !== fortuneId) {
          return fortune;
        }

        return {
          ...fortune,
          text: nextText,
        };
      });
      return nextFortunes;
    });
    setSaveError('');
  }, []);

  const handleTextBlur = useCallback((fortune) => {
    setFocusedFortuneId((current) => (
      current === fortune.id ? null : current
    ));
  }, []);

  const handleTextFocus = useCallback((fortuneId) => {
    setFocusedFortuneId(fortuneId);
  }, []);

  const handleBucketToggle = useCallback((fortune, bucket) => {
    const nextBuckets = fortune.buckets.includes(bucket)
      ? fortune.buckets.filter((value) => value !== bucket)
      : [...fortune.buckets, bucket];

    if (nextBuckets.length === 0) {
      setSaveError('Each fortune needs at least one bucket.');
      return;
    }

    const primaryBucket = nextBuckets.includes(fortune.primaryBucket)
      ? fortune.primaryBucket
      : nextBuckets[0];
    const alsoFits = nextBuckets.filter((value) => value !== primaryBucket);
    const nextFortune = {
      ...fortune,
      primaryBucket,
      alsoFits,
      buckets: nextBuckets,
      scope: computeScope(nextBuckets),
    };

    setSaveError('');
    setFortunes((current) => replaceFortune(current, nextFortune, bucketOrder));
  }, [bucketOrder]);

  const handleDelete = useCallback((fortuneId) => {
    setFortunes((current) => current.filter((fortune) => fortune.id !== fortuneId));
    setSaveError('');
  }, []);

  const handleAddFortuneRow = useCallback((bucket) => {
    const nextFortune = createDraftFortune(bucket);
    setFortunes((current) => sortFortunes([...current, nextFortune], displayBucketOrder));
    setFocusedFortuneId(nextFortune.id);
    setSaveError('');
  }, [displayBucketOrder]);

  const renderFlatListItem = useCallback(({ item }) => {
    if (item.kind === 'section') {
      return (
        <SectionHeaderRow
          bucket={item.bucket}
          count={item.count}
          onAddRow={handleAddFortuneRow}
        />
      );
    }

    return (
      <FortuneRow
        columnBucketOrder={columnBucketOrder}
        fortune={item.fortune}
        focusedFortuneId={focusedFortuneId}
        onDelete={handleDelete}
        onTextBlur={handleTextBlur}
        onTextChange={handleTextChange}
        onTextFocus={handleTextFocus}
        onToggleBucket={handleBucketToggle}
      />
    );
  }, [
    columnBucketOrder,
    focusedFortuneId,
    handleAddFortuneRow,
    handleDelete,
    handleTextBlur,
    handleTextChange,
    handleTextFocus,
    handleBucketToggle,
  ]);

  const keyExtractor = useCallback((item) => item.id, []);
  const getItemLayout = useCallback((_, index) => ({
    ...flatListMetrics[index],
    index,
  }), [flatListMetrics]);

  async function handleProcessChanges() {
    const baselineMap = new Map(baselineFortunes.map((fortune) => [fortune.id, fortune]));
    const currentMap = new Map(fortunes.map((fortune) => [fortune.id, fortune]));
    const deletions = baselineFortunes
      .filter((fortune) => !currentMap.has(fortune.id))
      .map((fortune) => fortune.id);
    const creations = fortunes.filter((fortune) => fortune.id.startsWith(TEMP_FORTUNE_ID_PREFIX));
    const updates = fortunes.filter((fortune) => {
      if (fortune.id.startsWith(TEMP_FORTUNE_ID_PREFIX)) {
        return false;
      }

      const baselineFortune = baselineMap.get(fortune.id);
      if (!baselineFortune) {
        return false;
      }

      return (
        baselineFortune.text !== fortune.text
        || baselineFortune.primaryBucket !== fortune.primaryBucket
        || (baselineFortune.buckets || []).join('|') !== (fortune.buckets || []).join('|')
      );
    });

    if (deletions.length === 0 && creations.length === 0 && updates.length === 0) {
      return;
    }

    setIsProcessingChanges(true);
    setSaveError('');

    try {
      for (const fortuneId of deletions) {
        const response = await fetch(`${apiBaseUrl}/api/fortunes/${fortuneId}`, {
          method: 'DELETE',
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || 'Unable to delete fortune.');
        }
      }

      for (const fortune of creations) {
        const response = await fetch(`${apiBaseUrl}/api/fortunes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: fortune.text,
            buckets: fortune.buckets,
          }),
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || 'Unable to create fortune.');
        }
      }

      for (const fortune of updates) {
        const response = await fetch(`${apiBaseUrl}/api/fortunes/${fortune.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: fortune.text,
            buckets: fortune.buckets,
          }),
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || 'Unable to save fortune.');
        }
      }

      await loadFortunes();
    } catch (error) {
      setSaveError(error.message || 'Unable to process changes.');
    } finally {
      setIsProcessingChanges(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
      style={styles.page}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Fortune Lab</Text>
          <Text style={styles.title}>Canonical fortune editor</Text>
        </View>
        <View style={styles.headerMeta}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Active fortunes</Text>
            <Text style={styles.metaValue}>{fortunes.length}</Text>
          </View>
          <Pressable
            disabled={!hasPendingChanges || isProcessingChanges}
            onPress={handleProcessChanges}
            style={[
              styles.processButton,
              (!hasPendingChanges || isProcessingChanges) ? styles.processButtonDisabled : null,
            ]}
          >
            <Text style={styles.processButtonText}>
              {isProcessingChanges ? 'Processing...' : 'Process Changes'}
            </Text>
          </Pressable>
          <Pressable onPress={loadFortunes} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Reload</Text>
          </Pressable>
        </View>
      </View>

      {loadError ? (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>API offline</Text>
          <Text style={styles.noticeText}>
            {loadError}
          </Text>
        </View>
      ) : null}

      {saveError ? (
        <View style={[styles.noticeCard, styles.noticeCardWarning]}>
          <Text style={styles.noticeTitle}>Process issue</Text>
          <Text style={styles.noticeText}>{saveError}</Text>
        </View>
      ) : null}

      <View style={styles.workspace}>
        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#8a5a31" size="small" />
            <Text style={styles.loadingText}>Loading fortunes...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.horizontalScroller}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.textColumn]}>Fortune</Text>
                <Text style={[styles.headerCell, styles.scopeColumn]}>Type</Text>
                <Text style={[styles.headerCell, styles.lenColumn]}>Len</Text>
                <Text style={[styles.headerCell, styles.deleteColumn]}>Del</Text>
                {columnBucketOrder.map((bucket) => (
                  <View
                    key={bucket}
                    style={[styles.headerCell, styles.bucketColumn, styles.verticalHeaderWrap, styles.bucketCell]}
                  >
                    <Text style={styles.verticalHeaderText}>{formatBucketLabel(bucket)}</Text>
                  </View>
                ))}
              </View>

              <FlatList
                data={flatListItems}
                getItemLayout={getItemLayout}
                initialNumToRender={40}
                keyExtractor={keyExtractor}
                maxToRenderPerBatch={60}
                removeClippedSubviews={Platform.OS !== 'web'}
                renderItem={renderFlatListItem}
                showsVerticalScrollIndicator
                style={styles.virtualizedList}
                windowSize={12}
              />
            </View>
          </ScrollView>
        )}
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
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 10,
  },
  headerCard: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#7b5d43',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#332419',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#7d6450',
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  metaPill: {
    borderRadius: 18,
    backgroundColor: '#f5e7d2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 92,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#8e735a',
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38281c',
  },
  refreshButton: {
    borderRadius: 999,
    backgroundColor: '#d8a66b',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  processButton: {
    borderRadius: 999,
    backgroundColor: '#b97937',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  processButtonDisabled: {
    opacity: 0.45,
  },
  processButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff9f1',
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2f2015',
  },
  noticeCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.14)',
    backgroundColor: '#fff7ee',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  noticeCardWarning: {
    backgroundColor: '#fff1ea',
    borderColor: 'rgba(159, 79, 66, 0.18)',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: '#7a5d44',
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5f4735',
  },
  workspace: {
    borderRadius: 22,
    backgroundColor: '#fffdf9',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.14)',
    paddingTop: 14,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  loadingCard: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#6f5643',
    fontWeight: '700',
  },
  horizontalScroller: {
    width: '100%',
  },
  virtualizedList: {
    maxHeight: 900,
  },
  tableHeader: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
    paddingTop: 0,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 89, 58, 0.12)',
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  headerCell: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#86674d',
    textAlign: 'center',
  },
  verticalHeaderWrap: {
    height: 82,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'visible',
    paddingBottom: 12,
  },
  verticalHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#86674d',
    textTransform: 'uppercase',
    ...(Platform.OS === 'web'
      ? {
          position: 'absolute',
          bottom: 14,
          left: -14,
          writingDirection: 'ltr',
          transform: [{ rotate: '-60deg' }],
          width: 72,
          textAlign: 'center',
          lineHeight: 10,
          whiteSpace: 'nowrap',
          overflow: 'visible',
        }
      : null),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    height: 30,
  },
  sectionHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#493526',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8d7158',
  },
  sectionAddInlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionAddInlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8d7158',
    lineHeight: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#fff8f1',
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.08)',
    alignItems: 'center',
    marginBottom: 3,
    height: 38,
  },
  textColumn: {
    width: 344,
  },
  scopeColumn: {
    width: 52,
  },
  deleteColumn: {
    width: 34,
  },
  lenColumn: {
    width: 30,
  },
  bucketColumn: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bucketCell: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(122, 89, 58, 0.24)',
    backgroundColor: 'rgba(168, 133, 98, 0.05)',
  },
  textInput: {
    height: 32,
    borderRadius: 9,
    backgroundColor: '#fffdf9',
    borderWidth: 1,
    borderColor: 'rgba(140, 109, 83, 0.14)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 12,
    lineHeight: 15,
    color: '#33261d',
    textAlignVertical: 'top',
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
        }
      : null),
  },
  textInputFocused: {
    borderColor: '#d8a66b',
    backgroundColor: '#fffaf3',
  },
  scopeBadge: {
    height: 32,
    borderRadius: 9,
    backgroundColor: '#f5e7d2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  scopeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'none',
    letterSpacing: 0.2,
    color: '#6f553f',
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
        }
      : null),
  },
  deleteWrap: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  lenBadge: {
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f6efe5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lenText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.1,
    color: '#7b6049',
  },
  deleteButton: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#f3d4c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7b3427',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(122, 89, 58, 0.18)',
    backgroundColor: '#fffdf9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#d8a66b',
    borderColor: '#be8c55',
  },
  checkboxText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'transparent',
    textTransform: 'uppercase',
  },
  checkboxTextChecked: {
    color: '#2f2015',
  },
});
