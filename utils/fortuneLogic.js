import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLOCKED_HATE_TERMS,
  BLOCKED_INPUT_FORTUNE,
  FORTUNE_LIBRARY,
  HATE_PATTERNS,
  MOOD_BUCKET_PROFILES,
  UNKNOWN_INPUT_FORTUNES,
  PROTECTED_GROUP_TERMS,
} from '../data/fortunes';
import {
  ALIAS_BUCKET_WORDS,
  EXACT_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
} from '../data/moodVocabulary';
import { MOOD_SCENE_KEYS } from '../data/scenes';
import { getLocalDayKey } from './dateUtils';

const USER_ID_STORAGE_KEY = '@fortune-cookie-daily/user-id';
const DAY_STATE_STORAGE_KEY = '@fortune-cookie-daily/day-state';
const DEFAULT_SCENE_KEY = 'apricotMorning';
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
  'stab',
  'stabbing',
  'shoot',
  'shooting',
  'massacre',
]);

const MOOD_BUCKET_PRIORITY = [...MOOD_BUCKET_KEYS];

const EXACT_WORD_TO_BUCKET = createLookupTable(EXACT_BUCKET_WORDS);
const ALIAS_WORD_TO_BUCKET = createLookupTable(ALIAS_BUCKET_WORDS);

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
} = {}) {
  return {
    primaryEmotion,
    confidence,
    scores: createMoodScoreCard(primaryEmotion, score),
    source,
  };
}

function findBucketInLookup(normalizedInput, tokens, lookupTable) {
  const phraseMatch = lookupTable[normalizedInput];
  if (phraseMatch) {
    return {
      bucket: phraseMatch,
      source: 'phrase',
    };
  }

  for (const token of tokens) {
    const tokenMatch = lookupTable[token];
    if (tokenMatch) {
      return {
        bucket: tokenMatch,
        source: 'token',
      };
    }
  }

  return null;
}

function normalizeLookupKeyLegacyDuplicate(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    && normalizedSelection.sceneKey === 'stoneVeil'
  ) {
    normalizedSelection.sceneKey = MOOD_SCENE_KEYS[normalizedSelection.analysis.primaryEmotion]
      || normalizedSelection.sceneKey;
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
  return HIGH_RISK_WORDS.has(normalizeHighRiskInput(input));
}

function roundConfidence(value) {
  return Math.max(0, Math.min(1, Math.round(value * 1000) / 1000));
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
      source: 'empty',
    });
  }

  const tokens = tokenizeMoodInput(normalized);
  const exactMatch = findBucketInLookup(normalized, tokens, EXACT_WORD_TO_BUCKET);
  if (exactMatch) {
    return buildAnalysis(exactMatch.bucket, {
      confidence: roundConfidence(exactMatch.source === 'phrase' ? 1 : 0.96),
      source: exactMatch.source === 'phrase' ? 'exact-manual' : 'exact-manual-token',
    });
  }

  const aliasMatch = findBucketInLookup(normalized, tokens, ALIAS_WORD_TO_BUCKET);
  if (aliasMatch) {
    return buildAnalysis(aliasMatch.bucket, {
      confidence: roundConfidence(aliasMatch.source === 'phrase' ? 0.86 : 0.74),
      source: 'alias-map',
      score: 8,
    });
  }

  return buildAnalysis('unknown', {
    confidence: 0,
    score: 0,
    source: 'unknown-fallback',
  });
}

function buildFortunePool(analysis) {
  const { primaryEmotion } = analysis;
  if (primaryEmotion === 'unknown') {
    return FORTUNE_LIBRARY.unknown;
  }

  const profile = MOOD_BUCKET_PROFILES[primaryEmotion] || MOOD_BUCKET_PROFILES.unknown;
  if (profile.fortuneKey && FORTUNE_LIBRARY[profile.fortuneKey]) {
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
  // TODO: Gradually revise fortune copy so lines do not explicitly name the routed bucket
  // unless they still read naturally after many distinct user words collapse into one bucket.
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

function pickUnknownInputFortune(seed) {
  return UNKNOWN_INPUT_FORTUNES[seed % UNKNOWN_INPUT_FORTUNES.length];
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
  const fortuneText = isUnknownInput
    ? pickUnknownInputFortune(seed)
    : pickFortuneTextFromPools({
      builtInPool,
      customPool,
      excludeFortuneText,
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

export async function getMoodLabSelection(input, { randomSeed = '' } = {}) {
  const normalizedInput = input.trim().toLowerCase();

  return buildFortuneSelection(normalizedInput, {
    dayKey: 'mood-lab',
    seedKey: `mood-lab|${normalizedInput || 'empty'}|${randomSeed}`,
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

export { MOOD_BUCKET_KEYS };
