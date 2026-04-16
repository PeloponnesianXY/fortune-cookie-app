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

const API_PORT = 4312;

const SUSPECT_FORTUNE_SUGGESTIONS = {
  anxious: {
    f_0329: 'A fearful heart mistakes many shadows for danger.',
    f_0331: 'Trust the facts before you trust the fright.',
    f_0333: 'Safety does not always require an answer at once.',
    f_0336: 'Your courage may be clearer than your worry admits.',
    f_0338: 'A startled body is not always a threatened one.',
    f_0340: 'A calm look at things may improve the picture.',
    f_0341: 'Your situation may be safer than your nerves report.',
    f_0342: 'Not every alarm deserves obedience.',
    f_0346: 'A loud fear is not always a true one.',
    f_0352: 'A dark thought is still only a passing guest.',
    f_0353: 'The mind predicts storms the sky never sends.',
    f_0357: 'Fear tells vivid stories and calls them facts.',
  },
  sad: {
    f_0247: 'A heavy hour is not the whole tale.',
    f_0251: 'This shadow may pass sooner than it promises.',
    f_0252: 'Comfort is honorable company on a dark day.',
    f_0255: 'Sorrow speaks boldly and is not always correct.',
    f_0256: 'Tonight asks for rest, not a heroic return.',
    f_0258: 'A small comfort may do a large kindness.',
    f_0259: 'To endure the day is already an achievement.',
    f_0265: 'Sadness can sound wise without being right.',
    f_0267: 'A feeling may speak elegantly and still mislead.',
    f_0278: 'A little laughter may loosen a stubborn cloud.',
  },
  sick: {
    f_0820: 'Recovery favors those who stop arguing with the weather.',
    f_0821: 'The body speaks plainly, if not politely.',
    f_0822: 'Rest is a worthy labor when the body is strained.',
    f_0823: 'A gentler day may be today’s best medicine.',
    f_0824: 'Tea, stillness, and a pillow may outrank ambition.',
    f_0825: 'Broth may accomplish more today than bravery.',
    f_0826: 'The body usually wins its debates.',
    f_0857: 'The wisest schedule today may be the softest one.',
    f_0858: 'Symptoms seldom ask permission to be believed.',
    f_0859: 'The body sometimes requests a slower hour.',
    f_0860: 'Recovery begins when resistance ends.',
    f_0861: 'Today may reward comfort more than standards.',
  },
  emotional: {
    f_0710: 'What moves you reveals what matters.',
    f_0711: 'Some truths enter by the heart.',
    f_0712: 'The heart recognizes what the mind meets later.',
    f_0714: 'What touches you may leave a useful mark.',
    f_0715: 'Some truths are felt before they are spoken.',
    f_0718: 'A deep stir often means something worth noticing.',
    f_0719: 'A moved heart points toward meaning.',
    f_0720: 'Some tides bring more than water.',
    f_0804: 'What strikes the heart rarely does so without reason.',
    f_0805: 'What lands deeply usually matters.',
  },
  engaged: {
    f_0693: 'A lively mind makes strong company.',
    f_0694: 'Interest often points toward opportunity.',
    f_0695: 'An open mind is already halfway there.',
    f_0696: 'This is a good hour to follow your interest.',
    f_0697: 'Good energy often finds an open door.',
    f_0698: 'A ready spirit attracts discovery.',
    f_0699: 'Notice what brightens your attention.',
    f_0700: 'An eager spirit travels well.',
    f_0701: 'Something worthwhile may be nearing clarity.',
    f_0749: 'This moment may offer more than first appears.',
  },
  unknown: {
    f_0702: 'Unknown word. Bright fortune.',
    f_0703: 'This mood is nameless here, but luck remains fluent.',
    f_0704: 'The fortune cannot name this feeling, yet smiles anyway.',
    f_0705: 'A puzzled cookie may still predict pleasant things.',
    f_0706: 'No label here. Good fortune continues.',
    f_0811: 'Unknown to the cookie, not to destiny.',
    f_0812: 'The fortune shrugs and keeps favoring you.',
    f_0813: 'The oracle cannot sort this word. Your odds remain handsome.',
    f_0814: 'This word is new. Fortune is not alarmed.',
    f_0815: 'An unnamed mood may still lead to a lucky day.',
  },
  guilty: {
    f_0280: 'Conscience guides best without becoming a judge.',
    f_0282: 'Repair is more useful than punishment.',
    f_0283: 'Guilt is a signal, not a residence.',
    f_0294: 'Amend what you can and spare yourself the theater.',
    f_0296: 'A clean amends outweigh a grand remorse.',
    f_0864: 'Guilt should open a path, not a prison.',
    f_0865: 'Responsibility is useful; replay is vanity.',
    f_0866: 'Let conscience advise you, not sentence you.',
  },
  numb: {
    f_0305: 'A flat day is still a real one.',
    f_0314: 'Feeling returns best when not dragged indoors.',
    f_0321: 'Numbness often leaves by teaspoons.',
    f_0827: 'Some systems can barely whisper on hard days.',
    f_0828: 'Numbness often follows great fatigue.',
    f_0830: 'When all is quiet, begin with what is true.',
    f_0831: 'Low light is not darkness.',
    f_0863: 'Numbness may be a passage, not a home.',
  },
};

const BUCKET_ORDER = Object.keys(SUSPECT_FORTUNE_SUGGESTIONS);

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'before', 'but', 'by',
  'can', 'do', 'does', 'for', 'from', 'has', 'have', 'if', 'in', 'into', 'is',
  'it', 'its', 'just', 'may', 'more', 'most', 'need', 'not', 'of', 'on', 'or',
  'so', 'some', 'still', 'than', 'that', 'the', 'their', 'them', 'there', 'this',
  'to', 'today', 'too', 'under', 'very', 'what', 'when', 'with', 'without', 'you',
  'your',
]);

const RETRY_TEMPLATES_BY_BUCKET = {
  anxious: [
    'A wary mind often mistakes {keyword} for danger.',
    'Not every shadow cast by {keyword} deserves your fear.',
    'The nerves often enlarge what {keyword} only hints at.',
    'Fear gives {keyword} a larger costume than it earned.',
    'A troubled heart may overread the signs around {keyword}.',
  ],
  sad: [
    'Even {keyword} may pass more quietly than it arrives.',
    'A dark hour around {keyword} is not the whole story.',
    'Sorrow gives {keyword} a longer echo than it deserves.',
    'A little mercy may lighten the weight of {keyword}.',
    'Time often softens what {keyword} first makes heavy.',
  ],
  sick: [
    'The body keeps its own counsel about {keyword}.',
    'A gentle answer often serves {keyword} best.',
    'When {keyword} calls the hour, softness is good sense.',
    'The body argues plainly when {keyword} has its say.',
    'Rest often settles what {keyword} stirs.',
  ],
  emotional: [
    '{keyword} may reveal more than words can carry.',
    'A stirred heart often knows why {keyword} matters.',
    'What {keyword} touches may not be trivial.',
    'Some feelings around {keyword} arrive before explanation.',
    'The heart often recognizes {keyword} ahead of the mind.',
  ],
  engaged: [
    'A bright interest in {keyword} may lead somewhere useful.',
    '{keyword} often rewards the curious spirit.',
    'Attention given to {keyword} may not be wasted.',
    'A lively mind finds openings near {keyword}.',
    'Curiosity about {keyword} often points the right way.',
  ],
  unknown: [
    'The oracle lacks a name for this and still predicts favor.',
    'This word is unclear here, but fortune remains cheerful.',
    'The cookie cannot sort this one and remains optimistic.',
    'An unnamed mood may still lead to a fortunate hour.',
    'No clear label appears, yet luck keeps its appointment.',
  ],
  guilty: [
    '{keyword} asks for repair, not a sentence.',
    'A clear conscience prefers amends to torment.',
    '{keyword} is better answered by repair than replay.',
    'Conscience grows wiser when {keyword} opens a path forward.',
    'Let {keyword} teach, but not govern the whole house.',
  ],
  numb: [
    '{keyword} may be quiet without being gone.',
    'A dim hour around {keyword} is still a living one.',
    'What feels muted in {keyword} may yet return.',
    'Even low light around {keyword} is not darkness.',
    '{keyword} sometimes speaks in whispers before it returns.',
  ],
  fallback: [
    '{keyword} may mean less harm than it first suggests.',
    'A calmer look at {keyword} may improve the picture.',
    'Time often restores the scale of {keyword}.',
    '{keyword} may yet prove gentler than it appears.',
    'A wiser hour may make better sense of {keyword}.',
  ],
};

function extractFortuneKeyword(text) {
  const words = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^'+|'+$/g, ''))
    .filter(Boolean);

  const preferred = words.find((word) => word.length >= 5 && !STOP_WORDS.has(word));
  if (preferred) {
    return preferred;
  }

  const fallback = words.find((word) => word.length >= 3 && !STOP_WORDS.has(word));
  return fallback || 'it';
}

function buildRetrySuggestion(fortune, previousSuggestion, attempt) {
  const templates = RETRY_TEMPLATES_BY_BUCKET[fortune.primaryBucket] || RETRY_TEMPLATES_BY_BUCKET.fallback;
  const keyword = extractFortuneKeyword(fortune.text);
  const idNumber = Number.parseInt(String(fortune.id || '').replace(/\D+/g, ''), 10) || 0;

  for (let offset = 0; offset < templates.length; offset += 1) {
    const template = templates[(idNumber + attempt + offset) % templates.length];
    const candidate = template.replace(/\{keyword\}/g, keyword);
    if (candidate !== previousSuggestion && candidate !== fortune.text) {
      return candidate;
    }
  }

  return previousSuggestion || templates[0].replace(/\{keyword\}/g, keyword);
}

function getApiBaseUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return `http://127.0.0.1:${API_PORT}`;
  }

  return `http://${window.location.hostname || '127.0.0.1'}:${API_PORT}`;
}

function formatBucketLabel(bucket) {
  return bucket.charAt(0).toUpperCase() + bucket.slice(1);
}

export default function ClassicFortuneLab() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [fortunes, setFortunes] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [dismissedIds, setDismissedIds] = useState([]);
  const [retryCounts, setRetryCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadFortunes() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await fetch(`${apiBaseUrl}/api/fortunes`, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Classic Fortune Lab API is unavailable.');
        }

        const payload = await response.json();
        if (!isActive) {
          return;
        }

        const incomingFortunes = Array.isArray(payload.fortunes) ? payload.fortunes : [];
        setFortunes(incomingFortunes);
        setDrafts(() => {
          const nextDrafts = {};

          for (const [bucket, suggestions] of Object.entries(SUSPECT_FORTUNE_SUGGESTIONS)) {
            for (const [fortuneId, suggestion] of Object.entries(suggestions)) {
              const liveFortune = incomingFortunes.find((fortune) => fortune.id === fortuneId && fortune.primaryBucket === bucket);
              if (liveFortune) {
                nextDrafts[fortuneId] = suggestion;
              }
            }
          }

          return nextDrafts;
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(
          error.message
            || 'Classic Fortune Lab could not reach the local API.'
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadFortunes();

    return () => {
      isActive = false;
    };
  }, [apiBaseUrl]);

  const bucketSections = useMemo(() => {
    const fortunesByBucket = BUCKET_ORDER.map((bucket) => {
      const liveBucketFortunes = fortunes.filter((fortune) => fortune.primaryBucket === bucket);
      const suspectIds = new Set(Object.keys(SUSPECT_FORTUNE_SUGGESTIONS[bucket] || {}));
      const suspectFortunes = liveBucketFortunes
        .filter((fortune) => suspectIds.has(fortune.id))
        .filter((fortune) => !dismissedIds.includes(fortune.id))
        .sort((left, right) => left.id.localeCompare(right.id));

      return {
        bucket,
        totalInBucket: liveBucketFortunes.length,
        suspectFortunes,
      };
    }).filter((section) => section.suspectFortunes.length > 0);

    return fortunesByBucket;
  }, [dismissedIds, fortunes]);

  function updateDraft(fortuneId, value) {
    setDrafts((current) => ({
      ...current,
      [fortuneId]: value,
    }));
  }

  function handleTryAgain(fortune) {
    setRetryCounts((current) => {
      const nextCount = (current[fortune.id] || 0) + 1;
      const nextSuggestion = buildRetrySuggestion(
        fortune,
        String(drafts[fortune.id] || '').trim(),
        nextCount,
      );

      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [fortune.id]: nextSuggestion,
      }));

      return {
        ...current,
        [fortune.id]: nextCount,
      };
    });
  }

  async function processChange(body) {
    const response = await fetch(`${apiBaseUrl}/api/fortunes/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Unable to process change.');
    }

    const payload = await response.json();
    const nextFortunes = Array.isArray(payload.fortunes) ? payload.fortunes : [];
    setFortunes(nextFortunes);
  }

  async function handleAccept(fortune) {
    const nextText = String(drafts[fortune.id] || '').trim();
    if (!nextText) {
      return;
    }

    setBusyId(fortune.id);

    try {
      await processChange({
        deletions: [],
        creations: [],
        updates: [{
          id: fortune.id,
          text: nextText,
          buckets: [fortune.primaryBucket, ...(fortune.alsoFits || [])],
        }],
      });
    } finally {
      setBusyId(null);
    }
  }

  function handleAcceptCurrent(fortune) {
    setDismissedIds((current) => (
      current.includes(fortune.id) ? current : [...current, fortune.id]
    ));
  }

  async function handleDelete(fortune) {
    setBusyId(fortune.id);

    try {
      await processChange({
        deletions: [fortune.id],
        creations: [],
        updates: [],
      });
      setDismissedIds((current) => (
        current.includes(fortune.id) ? current : [...current, fortune.id]
      ));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent} stickyHeaderIndices={[1]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Classic Fortune Lab</Text>
        <Text style={styles.subtitle}>
          Current Accept keeps the live fortune and hides it here. Current X deletes it. Suggested Accept overwrites the live fortune.
        </Text>
      </View>

      <View style={styles.globalLegendWrap}>
        <View style={styles.bucketLegendRow}>
          <Text style={[styles.bucketLegendText, styles.pairColumn]}>Current</Text>
          <Text style={[styles.bucketLegendText, styles.pairColumn]}>Suggested rewrite</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#8a5b2a" />
          <Text style={styles.loadingText}>Loading suspect fortunes...</Text>
        </View>
      ) : null}

      {loadError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : null}

      {!isLoading && !loadError ? (
        bucketSections.map((section) => (
          <View key={section.bucket} style={styles.bucketCard}>
            <View style={styles.bucketHeader}>
              <Text style={styles.bucketTitle}>{formatBucketLabel(section.bucket)}</Text>
              <Text style={styles.bucketCount}>{section.totalInBucket}</Text>
            </View>

            {section.suspectFortunes.map((fortune) => {
              const isBusy = busyId === fortune.id;

                return (
                  <View key={fortune.id} style={styles.fortuneCard}>
                    <View style={styles.pairColumn}>
                      <Text style={[styles.currentText, styles.currentColumn]} numberOfLines={2}>
                        {fortune.text}
                      </Text>

                      <View style={[styles.actionsColumn, styles.currentActionsColumn]}>
                        <Pressable
                          disabled={isBusy}
                          onPress={() => handleAcceptCurrent(fortune)}
                          style={({ pressed }) => [
                            styles.acceptButton,
                            (pressed || isBusy) ? styles.acceptButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => handleDelete(fortune)}
                          style={({ pressed }) => [
                            styles.deleteButton,
                            pressed ? styles.deleteButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.deleteButtonText}>X</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.pairColumn}>
                      <TextInput
                        multiline={false}
                        onChangeText={(value) => updateDraft(fortune.id, value)}
                        style={[styles.suggestionInput, styles.suggestedColumn]}
                        value={drafts[fortune.id] || ''}
                      />

                      <Text style={styles.charCountText}>
                        {String(drafts[fortune.id] || '').trim().length}
                      </Text>

                      <View style={styles.actionsColumn}>
                        <Pressable
                          disabled={isBusy || !String(drafts[fortune.id] || '').trim()}
                          onPress={() => handleAccept(fortune)}
                          style={({ pressed }) => [
                            styles.acceptButton,
                            (pressed || isBusy) ? styles.acceptButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.acceptButtonText}>{isBusy ? '...' : 'Accept'}</Text>
                        </Pressable>

                        <Pressable
                          disabled={isBusy}
                          onPress={() => handleTryAgain(fortune)}
                          style={({ pressed }) => [
                            styles.secondaryButton,
                            (pressed || isBusy) ? styles.secondaryButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.secondaryButtonText}>Try again</Text>
                        </Pressable>
                      </View>
                    </View>
                </View>
              );
            })}
          </View>
        ))
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#efe5d6',
  },
  pageContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  header: {
    gap: 2,
  },
  globalLegendWrap: {
    backgroundColor: '#efe5d6',
    paddingTop: 2,
    paddingBottom: 4,
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky',
          top: 0,
        }
      : null),
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6a5747',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
  },
  loadingText: {
    fontSize: 14,
    color: '#58483b',
  },
  errorCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f9e0db',
    borderWidth: 1,
    borderColor: '#d69a8f',
  },
  errorText: {
    color: '#6f2f24',
    fontWeight: '700',
  },
  bucketCard: {
    gap: 4,
    padding: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
  },
  bucketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  bucketTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#33271d',
  },
  bucketCount: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    textAlign: 'center',
    backgroundColor: '#f3e2cf',
    color: '#7b5733',
    fontWeight: '800',
    fontSize: 12,
  },
  bucketLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 250, 244, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.08)',
  },
  bucketLegendText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  pairColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: 8,
  },
  bucketLegendActions: {
    width: 62,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
    textAlign: 'center',
  },
  bucketLegendCurrentActions: {
    width: 92,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
    textAlign: 'center',
  },
  fortuneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.08)',
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2d8cf',
    borderWidth: 1,
    borderColor: '#d7a79a',
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    color: '#6a2f26',
    fontWeight: '900',
  },
  currentColumn: {
    width: '39%',
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  suggestedColumn: {
    width: '39%',
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  currentText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#3f3126',
  },
  suggestionInput: {
    minHeight: 0,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(141, 108, 73, 0.2)',
    fontSize: 12,
    lineHeight: 16,
    color: '#2f241c',
  },
  charCountText: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#8a735f',
  },
  actionsColumn: {
    width: 148,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
  },
  currentActionsColumn: {
    width: 98,
    gap: 6,
  },
  acceptButton: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#d8a66b',
  },
  acceptButtonPressed: {
    opacity: 0.8,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#efe2d0',
    borderWidth: 1,
    borderColor: '#d4bea4',
  },
  secondaryButtonPressed: {
    opacity: 0.8,
  },
  acceptButtonText: {
    color: '#2f2015',
    fontWeight: '900',
    fontSize: 11,
  },
  secondaryButtonText: {
    color: '#6a4d2d',
    fontWeight: '800',
    fontSize: 11,
  },
});
