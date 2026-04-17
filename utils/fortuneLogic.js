import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLOCKED_HATE_TERMS,
  BLOCKED_INPUT_FORTUNE,
  FORTUNE_LIBRARY,
  HATE_PATTERNS,
  MOOD_BUCKET_PROFILES,
  PROTECTED_GROUP_TERMS,
} from '../data/runtime/fortunes.js';
import {
  DETERMINISTIC_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
} from '../data/runtime/moodVocabularyRuntimeWrapper.js';
import { MOOD_SCENE_KEYS, SCENE_LIBRARY } from '../data/runtime/scenes.js';
import { getLocalDayKey } from './dateUtils.js';

const USER_ID_STORAGE_KEY = '@fortune-cookie-daily/user-id';
const DAY_STATE_STORAGE_KEY = '@fortune-cookie-daily/day-state';
const DEFAULT_SCENE_KEY = 'sunlitAir';
const HIGH_RISK_WORDS = new Set([
  'suicide',
  'suicidal',
  'selfharm',
  'unalive',
  'kms',
  'killmyself',
  'overdose',
  'murder',
  'murderous',
  'homicide',
  'homicidal',
  'kill',
  'killing',
  'violent',
  'stab',
  'stabbing',
  'shoot',
  'shooting',
  'massacre',
]);

const MOOD_BUCKET_PRIORITY = [...MOOD_BUCKET_KEYS];
const DETERMINISTIC_WORD_TO_BUCKET = createLookupTable(DETERMINISTIC_BUCKET_WORDS);
// Runtime routing is intentionally lexical-first:
// deterministic exact -> morphology -> fuzzy -> unknown
// Vector embeddings stay available only as a lab/debug suggestion layer.
const SINGLE_TOKEN_VOCAB_CANDIDATES = Object.entries(DETERMINISTIC_WORD_TO_BUCKET)
  .filter(([word]) => !word.includes(' '))
  .map(([word, bucket]) => ({ word, bucket }));
const MORPHOLOGY_IRREGULAR_MAP = {
  anxiety: 'anxious',
  confusion: 'confused',
  frustration: 'frustrated',
  gratitude: 'grateful',
  happier: 'happy',
  happiest: 'happy',
  jealousy: 'jealous',
  loneliness: 'lonely',
  sadder: 'sad',
  saddest: 'sad',
  slighted: 'betrayed',
};

const DERIVATIONAL_IRREGULAR_MAP = {
  affection: 'affectionate',
  anticipation: 'anticipatory',
  emotion: 'emotional',
  engagement: 'engaged',
  nostalgia: 'nostalgic',
  romance: 'romantic',
};
const FUZZY_MIN_LENGTH = 4;
const FUZZY_MAX_LENGTH_DELTA = 2;
const FUZZY_MIN_SCORE = 0.8;
const FUZZY_MIN_MARGIN = 0.08;

function createLookupTable(bucketWords) {
  return Object.fromEntries(
    Object.entries(bucketWords).flatMap(([bucket, words]) => (
      words.map((word) => [normalizeLookupKey(word), bucket])
    ))
  );
}

function normalizeLookupKey(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMoodBucketKey(moodKey) {
  return LEGACY_BUCKET_NORMALIZATION[moodKey] || moodKey;
}

function tokenizeMoodInput(normalizedInput) {
  return normalizedInput.split(' ').filter(Boolean);
}

function isKnownMoodWord(candidate) {
  return Boolean(DETERMINISTIC_WORD_TO_BUCKET[candidate]);
}

function firstKnownMoodWord(candidates) {
  const seen = new Set();

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeLookupKey(candidate);
    if (!normalizedCandidate || seen.has(normalizedCandidate)) {
      continue;
    }

    seen.add(normalizedCandidate);
    if (isKnownMoodWord(normalizedCandidate)) {
      return normalizedCandidate;
    }
  }

  return null;
}

function createMoodScoreCard(primaryEmotion = null, score = 0) {
  return MOOD_BUCKET_PRIORITY.reduce((accumulator, bucket) => {
    accumulator[bucket] = bucket === primaryEmotion ? score : 0;
    return accumulator;
  }, {});
}

function buildAnalysis(primaryEmotion, {
  confidence,
  source,
  score = 10,
  semanticDebug = null,
  lab = null,
} = {}) {
  return {
    primaryEmotion,
    confidence,
    scores: createMoodScoreCard(primaryEmotion, score),
    source,
    ...(semanticDebug ? { semanticDebug } : {}),
    ...(lab ? { lab } : {}),
  };
}

function findBucketInLookup(normalizedInput, tokens, lookupTable) {
  const phraseMatch = lookupTable[normalizedInput];
  if (phraseMatch) {
    return {
      bucket: phraseMatch,
      source: 'phrase',
      matchedTerm: normalizedInput,
    };
  }

  for (const token of tokens) {
    const tokenMatch = lookupTable[token];
    if (tokenMatch) {
      return {
        bucket: tokenMatch,
        source: 'token',
        matchedTerm: token,
      };
    }
  }

  return null;
}

function tryMorphology(normalizedInput) {
  const exactIrregularMatch = MORPHOLOGY_IRREGULAR_MAP[normalizedInput];
  if (exactIrregularMatch && isKnownMoodWord(exactIrregularMatch)) {
    return exactIrregularMatch;
  }

  const derivationalIrregularMatch = DERIVATIONAL_IRREGULAR_MAP[normalizedInput];
  if (derivationalIrregularMatch && isKnownMoodWord(derivationalIrregularMatch)) {
    return derivationalIrregularMatch;
  }

  const derivationalCandidates = [];

  if (normalizedInput.endsWith('ness') && normalizedInput.length > 6) {
    const stem = normalizedInput.slice(0, -4);
    derivationalCandidates.push(stem);

    if (stem.endsWith('i')) {
      derivationalCandidates.push(`${stem.slice(0, -1)}y`);
    }
  }

  if (normalizedInput.endsWith('osity') && normalizedInput.length > 7) {
    derivationalCandidates.push(`${normalizedInput.slice(0, -5)}ous`);
  }

  if (normalizedInput.endsWith('ity') && normalizedInput.length > 5) {
    const stem = normalizedInput.slice(0, -3);
    derivationalCandidates.push(stem);
    derivationalCandidates.push(`${stem}e`);
  }

  if (normalizedInput.endsWith('ation') && normalizedInput.length > 7) {
    const stem = normalizedInput.slice(0, -5);
    derivationalCandidates.push(`${stem}ate`);
    derivationalCandidates.push(`${stem}ated`);
    derivationalCandidates.push(`${stem}atory`);
  }

  if (normalizedInput.endsWith('sion') && normalizedInput.length > 6) {
    const stem = normalizedInput.slice(0, -4);
    derivationalCandidates.push(`${stem}sed`);
    derivationalCandidates.push(`${stem}sive`);
  }

  if (normalizedInput.endsWith('tion') && normalizedInput.length > 6) {
    const stem = normalizedInput.slice(0, -4);
    derivationalCandidates.push(`${stem}ted`);
  }

  const derivationalMatch = firstKnownMoodWord(derivationalCandidates);
  if (derivationalMatch) {
    return derivationalMatch;
  }

  const suffixTransforms = [
    {
      suffix: 'iest',
      transform: (value) => `${value.slice(0, -4)}y`,
    },
    {
      suffix: 'ier',
      transform: (value) => `${value.slice(0, -3)}y`,
    },
    {
      suffix: 'ily',
      transform: (value) => `${value.slice(0, -3)}y`,
    },
    {
      suffix: 'ly',
      transform: (value) => value.slice(0, -2),
    },
    {
      suffix: 'ed',
      transform: (value) => value.slice(0, -2),
    },
    {
      suffix: 'est',
      transform: (value) => value.slice(0, -3),
    },
    {
      suffix: 'er',
      transform: (value) => value.slice(0, -2),
    },
    {
      suffix: 'ing',
      transform: (value) => value.slice(0, -3),
    },
  ];

  for (const { suffix, transform } of suffixTransforms) {
    if (!normalizedInput.endsWith(suffix) || normalizedInput.length <= suffix.length + 1) {
      continue;
    }

    const transformed = transform(normalizedInput);
    if (isKnownMoodWord(transformed)) {
      return transformed;
    }
  }

  return null;
}

function getDamerauLevenshteinDistance(source, target) {
  const sourceLength = source.length;
  const targetLength = target.length;
  const matrix = Array.from({ length: sourceLength + 1 }, () => (
    new Array(targetLength + 1).fill(0)
  ));

  for (let i = 0; i <= sourceLength; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= targetLength; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= sourceLength; i += 1) {
    for (let j = 1; j <= targetLength; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );

      if (
        i > 1
        && j > 1
        && source[i - 1] === target[j - 2]
        && source[i - 2] === target[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[sourceLength][targetLength];
}

function getSharedPrefixLength(left, right) {
  const limit = Math.min(left.length, right.length);
  let index = 0;

  while (index < limit && left[index] === right[index]) {
    index += 1;
  }

  return index;
}

function isSafeFuzzyCandidate(inputWord, candidateWord) {
  if (!inputWord || !candidateWord) {
    return false;
  }

  if (inputWord[0] !== candidateWord[0]) {
    return false;
  }

  const requiredPrefixLength = inputWord.length >= 5 ? 2 : 1;
  return getSharedPrefixLength(inputWord, candidateWord) >= requiredPrefixLength;
}

function tryFuzzyMatch(normalizedInput) {
  if (normalizedInput.length < FUZZY_MIN_LENGTH) {
    return null;
  }

  const scoredCandidates = SINGLE_TOKEN_VOCAB_CANDIDATES
    .filter(({ word }) => Math.abs(word.length - normalizedInput.length) <= FUZZY_MAX_LENGTH_DELTA)
    .map(({ word, bucket }) => {
      const distance = getDamerauLevenshteinDistance(normalizedInput, word);
      const score = 1 - (distance / Math.max(normalizedInput.length, word.length));

      return {
        word,
        bucket,
        score,
      };
    })
    .filter(({ word }) => isSafeFuzzyCandidate(normalizedInput, word))
    .filter(({ score }) => score >= FUZZY_MIN_SCORE)
    .sort((left, right) => right.score - left.score || left.word.localeCompare(right.word));

  if (scoredCandidates.length === 0) {
    return null;
  }

  const [bestCandidate, secondCandidate] = scoredCandidates;
  const competingBucket = secondCandidate && secondCandidate.bucket !== bestCandidate.bucket;
  if (competingBucket && (bestCandidate.score - secondCandidate.score) < FUZZY_MIN_MARGIN) {
    return null;
  }

  return bestCandidate;
}

function normalizeStoredSelection(selection) {
  if (!selection || typeof selection !== 'object') {
    return selection;
  }

  const normalizedPrimaryEmotion = normalizeMoodBucketKey(selection.analysis?.primaryEmotion);
  const normalizedAnalysis = selection.analysis
    ? {
        ...selection.analysis,
        primaryEmotion: normalizedPrimaryEmotion,
      }
    : selection.analysis;

  const backfilledAnalysis = (
    normalizedAnalysis
    && typeof normalizedAnalysis.confidence !== 'number'
    && selection.inputMood
    && selection.moderation === 'clean'
  )
    ? {
        ...normalizedAnalysis,
        ...analyzeMoodInput(selection.inputMood),
      }
    : normalizedAnalysis;

  const normalizedSelection = {
    ...selection,
    analysis: backfilledAnalysis,
  };

  if (
    normalizedSelection.analysis?.primaryEmotion
    && !SCENE_LIBRARY[normalizedSelection.sceneKey]
  ) {
    normalizedSelection.sceneKey = MOOD_SCENE_KEYS[normalizedSelection.analysis.primaryEmotion]
      || DEFAULT_SCENE_KEY;
  }

  return normalizedSelection;
}

function buildBlockedAnalysis() {
  return buildAnalysis('unknown', {
    confidence: 0,
    score: 0,
    source: 'blocked-hate',
  });
}

function createUserId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `fortune-user-${random}`;
}

function createFortuneId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `fortune-${Date.now()}-${random}`;
}

function hasSelectionMetadata(selection) {
  return Boolean(selection?.id && selection?.createdAt);
}

async function getOrCreateUserId() {
  const existing = await AsyncStorage.getItem(USER_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const nextId = createUserId();
  await AsyncStorage.setItem(USER_ID_STORAGE_KEY, nextId);
  return nextId;
}

async function loadDayState() {
  const raw = await AsyncStorage.getItem(DAY_STATE_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return normalizeStoredSelection(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function saveDayState(selection) {
  const nextSelection = normalizeStoredSelection(ensureSelectionMetadata(selection));
  await AsyncStorage.setItem(DAY_STATE_STORAGE_KEY, JSON.stringify(nextSelection));
  return nextSelection;
}

function ensureSelectionMetadata(selection) {
  if (!selection) {
    return null;
  }

  return {
    ...selection,
    id: selection.id || createFortuneId(),
    createdAt: selection.createdAt || new Date().toISOString(),
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeHighRiskInput(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '');
}

export function isHighRiskMoodInput(input) {
  const rawInput = String(input || '').toLowerCase().trim();
  if (!rawInput) {
    return false;
  }

  const collapsedInput = normalizeHighRiskInput(rawInput);
  if (HIGH_RISK_WORDS.has(collapsedInput)) {
    return true;
  }

  const normalizedWordTokens = rawInput
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s_-]+/)
    .map((token) => normalizeHighRiskInput(token))
    .filter(Boolean);

  return normalizedWordTokens.some((token) => HIGH_RISK_WORDS.has(token));
}

function roundConfidence(value) {
  return Math.max(0, Math.min(1, Math.round(value * 1000) / 1000));
}

function buildDeterministicMoodAnalysis(normalized) {
  if (!normalized) {
    return buildAnalysis('unknown', {
      confidence: 0,
      score: 0,
      source: 'unknown',
    });
  }

  const tokens = tokenizeMoodInput(normalized);
  const deterministicMatch = findBucketInLookup(normalized, tokens, DETERMINISTIC_WORD_TO_BUCKET);
  if (deterministicMatch) {
    return buildAnalysis(deterministicMatch.bucket, {
      confidence: roundConfidence(deterministicMatch.source === 'phrase' ? 1 : 0.96),
      source: 'deterministic',
    });
  }

  if (tokens.length === 1) {
    const morphologyCandidate = tryMorphology(normalized);
    if (morphologyCandidate) {
      const morphologyTokens = tokenizeMoodInput(morphologyCandidate);
      const deterministicMorphologyMatch = findBucketInLookup(
        morphologyCandidate,
        morphologyTokens,
        DETERMINISTIC_WORD_TO_BUCKET
      );
      if (deterministicMorphologyMatch) {
        return buildAnalysis(deterministicMorphologyMatch.bucket, {
          confidence: 0.9,
          source: 'morphology',
          score: 9,
        });
      }
    }

    const fuzzyMatch = tryFuzzyMatch(normalized);
    if (fuzzyMatch) {
      return buildAnalysis(fuzzyMatch.bucket, {
        confidence: roundConfidence(fuzzyMatch.score),
        source: 'fuzzy',
        score: 7,
      });
    }
  }

  return buildAnalysis('unknown', {
    confidence: 0,
    score: 0,
    source: 'unknown',
  });
}

function buildParsedInputLabData(normalized) {
  if (!normalized) {
    return {
      normalizedInput: '',
      standardizedInput: '',
      stage: 'empty',
    };
  }

  const tokens = tokenizeMoodInput(normalized);
  const deterministicMatch = findBucketInLookup(normalized, tokens, DETERMINISTIC_WORD_TO_BUCKET);
  if (deterministicMatch) {
    return {
      normalizedInput: normalized,
      standardizedInput: deterministicMatch.matchedTerm || normalized,
      stage: 'deterministic',
    };
  }

  if (tokens.length === 1) {
    const morphologyCandidate = tryMorphology(normalized);
    if (morphologyCandidate) {
      const morphologyMatch = findBucketInLookup(
        morphologyCandidate,
        tokenizeMoodInput(morphologyCandidate),
        DETERMINISTIC_WORD_TO_BUCKET
      );

      if (morphologyMatch) {
        return {
          normalizedInput: normalized,
          standardizedInput: morphologyCandidate,
          stage: 'morphology',
        };
      }
    }

    const fuzzyMatch = tryFuzzyMatch(normalized);
    if (fuzzyMatch) {
      return {
        normalizedInput: normalized,
        standardizedInput: fuzzyMatch.word,
        stage: 'fuzzy',
      };
    }
  }

  return {
    normalizedInput: normalized,
    standardizedInput: normalized,
    stage: 'normalized',
  };
}

export function moderateMoodInput(input) {
  const normalized = normalizeLookupKey(input);
  const tokens = tokenizeMoodInput(normalized);

  const hasBlockedHateTerm = BLOCKED_HATE_TERMS.some((term) => (
    term.includes(' ') ? normalized.includes(term) : tokens.includes(term)
  ));
  const hasBlockedPattern = HATE_PATTERNS.some((pattern) => pattern.test(normalized));
  const hasTargetedGroupPhrase = PROTECTED_GROUP_TERMS.some((term) => normalized.includes(term))
    && /\b(hate|against|inferior|disgusting|gross|evil|vermin|animals|suck|stink|trash|awful|horrible)\b/.test(normalized);

  if (hasBlockedHateTerm || hasBlockedPattern || hasTargetedGroupPhrase) {
    return {
      moderation: 'blocked-hate',
      sanitizedInput: '',
    };
  }

  return {
    moderation: 'clean',
    sanitizedInput: normalized,
  };
}

export function analyzeMoodInput(input) {
  const normalized = normalizeLookupKey(input);
  if (!normalized) {
    return buildAnalysis('unknown', {
      confidence: 0,
      score: 0,
      source: 'unknown',
      lab: {
        deterministic: {
          bucket: 'unknown',
          source: 'unknown',
          confidence: 0,
        },
      },
    });
  }

  const deterministicAnalysis = buildDeterministicMoodAnalysis(normalized);
  const parsedLab = buildParsedInputLabData(normalized);
  const lab = {
    parsed: parsedLab,
    deterministic: {
      bucket: deterministicAnalysis.primaryEmotion || 'unknown',
      source: deterministicAnalysis.source || 'unknown',
      confidence: deterministicAnalysis.confidence ?? 0,
    },
  };

  if (deterministicAnalysis.primaryEmotion !== 'unknown') {
    return {
      ...deterministicAnalysis,
      lab,
    };
  }

  return buildAnalysis('unknown', {
    confidence: 0,
    score: 0,
    source: 'unknown',
    lab,
  });
}

function buildFortunePool(analysis) {
  const { primaryEmotion } = analysis;
  if (primaryEmotion === 'unknown') {
    return FORTUNE_LIBRARY.unknown;
  }

  const profile = MOOD_BUCKET_PROFILES[primaryEmotion] || MOOD_BUCKET_PROFILES.unknown;
  if (profile.fortuneKey && FORTUNE_LIBRARY[profile.fortuneKey]?.length) {
    return FORTUNE_LIBRARY[profile.fortuneKey];
  }

  return FORTUNE_LIBRARY.unknown;
}

export function moderateCustomFortuneText(input) {
  const moderationResult = moderateMoodInput(input);
  if (moderationResult.moderation !== 'clean') {
    return moderationResult;
  }

  if (isHighRiskMoodInput(input)) {
    return {
      moderation: 'blocked-danger',
      sanitizedInput: '',
    };
  }

  return {
    moderation: 'clean',
    sanitizedInput: input.trim(),
  };
}

async function buildWeightedFortunePools(analysis, { includeCustomFortunes = true } = {}) {
  const builtInPool = buildFortunePool(analysis);

  if (!includeCustomFortunes) {
    return {
      builtInPool,
      customPool: [],
    };
  }

  const { loadCustomFortunes } = require('./customFortunes');
  const customFortunes = await loadCustomFortunes();
  const customPool = customFortunes[analysis.primaryEmotion] || [];

  return {
    builtInPool,
    customPool,
  };
}

function pickFortuneTextFromPools({
  builtInPool,
  customPool,
  excludeFortuneText,
  seed,
}) {
  const weightedSource = customPool.length > 0 && seed % 10 < 2 ? 'custom' : 'built-in';
  const orderedPools = weightedSource === 'custom'
    ? [customPool, builtInPool]
    : [builtInPool, customPool];

  for (const pool of orderedPools) {
    if (!pool || pool.length === 0) {
      continue;
    }

    const candidateIndex = seed % pool.length;
    const candidate = pool[candidateIndex];

    if (excludeFortuneText && pool.length > 1 && candidate === excludeFortuneText) {
      return pool[(candidateIndex + 1) % pool.length];
    }

    if (candidate !== excludeFortuneText || pool.length === 1) {
      return candidate;
    }
  }

  return builtInPool[seed % builtInPool.length];
}

function pickSceneForSelection(analysis) {
  return MOOD_SCENE_KEYS[analysis.primaryEmotion] || MOOD_SCENE_KEYS.unknown;
}

async function buildFortuneSelection(input, {
  dayKey,
  seedKey,
  persistSelection,
  excludeFortuneText = null,
  includeCustomFortunes = true,
}) {
  const moderationResult = moderateMoodInput(input);

  if (moderationResult.moderation === 'blocked-hate') {
    const blockedSelection = {
      moderation: 'blocked-hate',
      fortuneText: BLOCKED_INPUT_FORTUNE,
      analysis: buildBlockedAnalysis(),
      inputMood: '',
      sceneKey: DEFAULT_SCENE_KEY,
      dayKey,
    };

    if (persistSelection) {
      const storedSelection = await saveDayState(blockedSelection);
      return {
        ...storedSelection,
        fromCache: false,
      };
    }

    return {
      ...ensureSelectionMetadata(blockedSelection),
      fromCache: false,
    };
  }

  const analysis = analyzeMoodInput(moderationResult.sanitizedInput);
  const isUnknownInput = analysis.primaryEmotion === 'unknown';
  const userId = await getOrCreateUserId();
  const { builtInPool, customPool } = await buildWeightedFortunePools(analysis, {
    includeCustomFortunes,
  });
  const seed = hashString(`${userId}|${seedKey}`);
  const fortuneText = pickFortuneTextFromPools({
    builtInPool,
    customPool,
    excludeFortuneText: isUnknownInput ? null : excludeFortuneText,
    seed,
  });

  const sceneKey = pickSceneForSelection(analysis);
  const selection = {
    analysis,
    dayKey,
    fortuneText,
    inputMood: moderationResult.sanitizedInput,
    sceneKey,
    moderation: 'clean',
  };

  if (persistSelection) {
    const storedSelection = await saveDayState(selection);
    return {
      ...storedSelection,
      fromCache: false,
    };
  }

  return {
    ...ensureSelectionMetadata(selection),
    fromCache: false,
  };
}

export async function getSemanticLabBaseSelection(input, { randomSeed = '' } = {}) {
  const normalizedInput = input.trim().toLowerCase();

  return buildFortuneSelection(normalizedInput, {
    dayKey: 'semantic-lab',
    seedKey: `semantic-lab|${normalizedInput || 'empty'}|${randomSeed}`,
    includeCustomFortunes: false,
    persistSelection: false,
  });
}

export async function getDailyFortuneSelection(input) {
  const dayKey = getLocalDayKey();
  const existingSelection = await loadDayState();
  const nextDailyFortuneCount = existingSelection?.dayKey === dayKey
    ? Math.max(existingSelection.dailyFortuneCount || 0, 0) + 1
    : 1;

  const nextSelection = await buildFortuneSelection(input, {
    dayKey,
    seedKey: `${dayKey}|fortune|${nextDailyFortuneCount}`,
    persistSelection: false,
  });

  return saveDayState({
    ...nextSelection,
    dayKey,
    dailyFortuneCount: nextDailyFortuneCount,
    moderation: nextSelection.moderation || 'clean',
    fromCache: false,
  });
}

export async function getReplacementFortuneSelection(input, {
  replacementKey = 1,
  excludeFortuneText = null,
} = {}) {
  const dayKey = getLocalDayKey();
  const existingSelection = await loadDayState();

  const replacementSelection = await buildFortuneSelection(input, {
    dayKey,
    seedKey: `${dayKey}|replace|${replacementKey}`,
    persistSelection: false,
    excludeFortuneText,
  });

  return saveDayState({
    ...replacementSelection,
    dayKey,
    dailyFortuneCount: existingSelection?.dayKey === dayKey
      ? Math.max(existingSelection.dailyFortuneCount || 1, 1)
      : 1,
    moderation: replacementSelection.moderation || 'clean',
    fromCache: false,
  });
}

export async function getStoredFortuneDayState() {
  const dayKey = getLocalDayKey();
  const selection = await loadDayState();

  if (!selection) {
    return null;
  }

  if (selection.dayKey === dayKey && selection.fortuneText) {
    const normalizedSelection = {
      ...selection,
      dailyFortuneCount: Math.max(selection.dailyFortuneCount || 1, 1),
      moderation: selection.moderation || 'clean',
    };

    return hasSelectionMetadata(normalizedSelection)
      ? normalizedSelection
      : saveDayState(normalizedSelection);
  }

  await AsyncStorage.removeItem(DAY_STATE_STORAGE_KEY);
  return null;
}

export async function clearStoredFortuneDayState() {
  await AsyncStorage.removeItem(DAY_STATE_STORAGE_KEY);
}

export async function clearAllStoredFortuneState() {
  await AsyncStorage.multiRemove([
    USER_ID_STORAGE_KEY,
    DAY_STATE_STORAGE_KEY,
  ]);
}

export function getDefaultSceneKey() {
  return DEFAULT_SCENE_KEY;
}

export { MOOD_BUCKET_KEYS, roundConfidence };
