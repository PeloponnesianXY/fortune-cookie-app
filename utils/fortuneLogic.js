import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLOCKED_HATE_TERMS,
  BLOCKED_INPUT_FORTUNE,
  COMBO_FORTUNES,
  FORTUNE_LIBRARY,
  HATE_PATTERNS,
  MOOD_FALLBACKS,
  MOOD_PROFILES,
  MOOD_TAXONOMY,
  PROTECTED_GROUP_TERMS,
  TONE_FORTUNES,
} from '../data/fortunes';
import { SCENE_GROUPS } from '../data/scenes';

const USER_ID_STORAGE_KEY = '@fortune-cookie-daily/user-id';
const DAILY_SELECTION_STORAGE_KEY = '@fortune-cookie-daily/daily-selection';
const DEFAULT_SCENE_KEY = 'apricotMorning';

function buildBlockedAnalysis() {
  return {
    primaryMood: 'unknown',
    secondaryMood: null,
    scores: {},
    source: 'blocked-hate',
  };
}

function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createUserId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `fortune-user-${random}`;
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

async function loadDailySelection() {
  const raw = await AsyncStorage.getItem(DAILY_SELECTION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveDailySelection(selection) {
  await AsyncStorage.setItem(DAILY_SELECTION_STORAGE_KEY, JSON.stringify(selection));
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function moderateMoodInput(input) {
  const normalized = input.trim().toLowerCase();
  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);

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
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return {
      primaryMood: 'unknown',
      secondaryMood: null,
      scores: {},
      source: 'empty',
    };
  }

  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  const scores = Object.keys(MOOD_TAXONOMY).reduce((accumulator, mood) => {
    accumulator[mood] = 0;
    return accumulator;
  }, {});

  for (const [mood, keywords] of Object.entries(MOOD_TAXONOMY)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        scores[mood] += keyword.includes(' ') ? 5 : 2;
      }

      for (const token of tokens) {
        if (token === keyword) {
          scores[mood] += 4;
        } else if (isSimilarWord(token, keyword)) {
          scores[mood] += 1;
        }
      }
    }
  }

  const rankedMoods = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (rankedMoods.length === 0) {
    const guessedMood = guessMoodFromTone(tokens);
    return {
      primaryMood: guessedMood,
      secondaryMood: null,
      scores,
      source: guessedMood === 'unknown' ? 'fallback-unknown' : 'fallback-tone',
    };
  }

  const [primaryMood, primaryScore] = rankedMoods[0];
  const secondaryEntry = rankedMoods.find(
    ([mood, score]) => mood !== primaryMood && score >= Math.max(2, primaryScore - 2)
  );

  return {
    primaryMood,
    secondaryMood: secondaryEntry ? secondaryEntry[0] : null,
    scores,
    source: 'taxonomy',
  };
}

function isSimilarWord(inputWord, keyword) {
  if (inputWord.length < 4 || keyword.includes(' ')) {
    return false;
  }

  if (inputWord[0] !== keyword[0]) {
    return false;
  }

  const distance = levenshteinDistance(inputWord, keyword);
  return distance <= 2 && Math.abs(inputWord.length - keyword.length) <= 2;
}

function guessMoodFromTone(tokens) {
  const positiveEndings = ['ful', 'ous', 'ant', 'ent', 'ive'];
  const softWords = ['tender', 'gentle', 'soft', 'open'];
  const brightWords = ['effervescent', 'buoyant', 'sparkly', 'radiant'];
  const sharpWords = ['fraught', 'combative', 'heated'];
  const foggyWords = ['murky', 'foggy', 'unclear', 'jumbled'];
  const flatWords = ['bored', 'meh', 'blah', 'neutral', 'whatever'];

  if (tokens.some((token) => softWords.includes(token))) {
    return 'calm';
  }

  if (tokens.some((token) => brightWords.includes(token))) {
    return 'happy';
  }

  if (tokens.some((token) => sharpWords.includes(token))) {
    return 'stressed';
  }

  if (tokens.some((token) => foggyWords.includes(token))) {
    return 'confused';
  }

  if (tokens.some((token) => flatWords.includes(token))) {
    return 'unknown';
  }

  if (tokens.some((token) => positiveEndings.some((ending) => token.endsWith(ending)))) {
    return 'hopeful';
  }

  return 'unknown';
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function buildFortunePool(analysis) {
  if (analysis.source === 'fallback-unknown') {
    return FORTUNE_LIBRARY.mysterious;
  }

  const { primaryMood, secondaryMood } = analysis;
  const moodPair = [primaryMood, secondaryMood].filter(Boolean).sort().join('|');

  if (moodPair && COMBO_FORTUNES[moodPair]) {
    return COMBO_FORTUNES[moodPair];
  }

  if (FORTUNE_LIBRARY[primaryMood]) {
    return FORTUNE_LIBRARY[primaryMood];
  }

  const fallbackMood = MOOD_FALLBACKS[primaryMood];
  if (fallbackMood && FORTUNE_LIBRARY[fallbackMood]) {
    return FORTUNE_LIBRARY[fallbackMood];
  }

  const profile = MOOD_PROFILES[primaryMood] || MOOD_PROFILES.unknown;
  return TONE_FORTUNES[profile.tone] || FORTUNE_LIBRARY.unknown;
}

function resolveSceneGroup(valence) {
  if (valence === 'negative') {
    return SCENE_GROUPS.negative;
  }

  if (valence === 'positive') {
    return SCENE_GROUPS.positive;
  }

  return SCENE_GROUPS.neutral;
}

function pickSceneForSelection(analysis, seed) {
  const profile = MOOD_PROFILES[analysis.primaryMood] || MOOD_PROFILES.unknown;
  const sceneGroup = resolveSceneGroup(profile.valence);
  return sceneGroup[seed % sceneGroup.length];
}

async function buildFortuneSelection(input, { dayKey, seedKey, persistSelection }) {
  const moderationResult = moderateMoodInput(input);

  if (moderationResult.moderation === 'blocked-hate') {
    const blockedSelection = {
      moderation: 'blocked-hate',
      fortuneText: BLOCKED_INPUT_FORTUNE,
      analysis: buildBlockedAnalysis(),
      sceneKey: 'moonlitDunes',
      dayKey,
    };

    if (persistSelection) {
      await saveDailySelection(blockedSelection);
    }

    return {
      ...blockedSelection,
      fromCache: false,
    };
  }

  const analysis = analyzeMoodInput(moderationResult.sanitizedInput);
  const userId = await getOrCreateUserId();
  const pool = buildFortunePool(analysis);
  const seed = hashString(`${userId}|${seedKey}`);
  const fortuneText = pool[seed % pool.length];
  const sceneKey = pickSceneForSelection(analysis, seed);
  const selection = {
    analysis,
    dayKey,
    fortuneText,
    sceneKey,
    moderation: 'clean',
  };

  if (persistSelection) {
    await saveDailySelection(selection);
  }

  return {
    ...selection,
    fromCache: false,
  };
}

export async function getDailyFortuneSelection(input) {
  const dayKey = getLocalDayKey();
  const existingSelection = await loadDailySelection();

  if (existingSelection?.dayKey === dayKey && existingSelection?.fortuneText) {
    return {
      ...existingSelection,
      moderation: existingSelection.moderation || 'clean',
      fromCache: true,
    };
  }

  return buildFortuneSelection(input, {
    dayKey,
    seedKey: dayKey,
    persistSelection: true,
  });
}

export async function getOverrideFortuneSelection(input, overrideKey) {
  const dayKey = getLocalDayKey();

  return buildFortuneSelection(input, {
    dayKey,
    seedKey: `${dayKey}|override|${overrideKey}`,
    persistSelection: false,
  });
}

export async function getStoredDailyFortuneSelection() {
  const dayKey = getLocalDayKey();
  const selection = await loadDailySelection();

  if (!selection) {
    return null;
  }

  if (selection.dayKey === dayKey && selection.fortuneText) {
    return selection;
  }

  await AsyncStorage.removeItem(DAILY_SELECTION_STORAGE_KEY);
  return null;
}

export function getDefaultSceneKey() {
  return DEFAULT_SCENE_KEY;
}
