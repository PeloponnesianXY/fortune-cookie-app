import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLOCKED_HATE_TERMS,
  BLOCKED_INPUT_FORTUNE,
  EMOTION_PROFILES,
  FORTUNE_LIBRARY,
  HATE_PATTERNS,
  PROTECTED_GROUP_TERMS,
} from '../data/fortunes';
import EMOTION_LEXICON from '../data/nrcEmotionLexicon.json';
import { EMOTION_SCENE_KEYS } from '../data/scenes';

const USER_ID_STORAGE_KEY = '@fortune-cookie-daily/user-id';
const DAILY_SELECTION_STORAGE_KEY = '@fortune-cookie-daily/daily-selection';
const DEFAULT_SCENE_KEY = 'apricotMorning';

const EMOTION_KEYS = [
  'anger',
  'anticipation',
  'confusion',
  'disgust',
  'fear',
  'joy',
  'sadness',
  'surprise',
  'trust',
];
const EMOTION_WORDS = Object.keys(EMOTION_LEXICON);
const STRONG_EMOTION_HINTS = {
  anger: ['angry', 'furious', 'irritated', 'mad', 'resentful'],
  anticipation: ['hopeful', 'eager', 'expectant', 'optimistic'],
  confusion: ['confused', 'unclear', 'lost', 'blank', 'unsure', 'puzzled'],
  disgust: ['disgusted', 'grossed', 'repulsed'],
  fear: ['afraid', 'fearful', 'scared', 'terrified', 'panicked', 'anxious'],
  joy: ['happy', 'joyful', 'excited', 'glad', 'delighted'],
  sadness: [
    'depressed',
    'depression',
    'sad',
    'down',
    'low',
    'hopeless',
    'heartbroken',
    'grieving',
    'lonely',
    'miserable',
    'numb',
  ],
  surprise: ['surprised', 'shocked', 'startled', 'stunned', 'unexpected'],
  trust: ['calm', 'safe', 'steady', 'secure', 'grounded'],
};
const COMMON_MOOD_BUCKETS = {
  angry: 'anger',
  annoyed: 'anger',
  bitter: 'anger',
  defensive: 'anger',
  enraged: 'anger',
  frustrated: 'anger',
  furious: 'anger',
  heated: 'anger',
  irritated: 'anger',
  mad: 'anger',
  outraged: 'anger',
  resentful: 'anger',
  upset: 'anger',

  eager: 'anticipation',
  excited: 'anticipation',
  expectant: 'anticipation',
  hopeful: 'anticipation',
  optimistic: 'anticipation',
  ready: 'anticipation',
  restless: 'anticipation',

  baffled: 'confusion',
  conflicted: 'confusion',
  confused: 'confusion',
  foggy: 'confusion',
  jumbled: 'confusion',
  lost: 'confusion',
  mixed: 'confusion',
  puzzled: 'confusion',
  torn: 'confusion',
  unclear: 'confusion',
  uncertain: 'confusion',
  unsure: 'confusion',

  disgusted: 'disgust',
  grossed: 'disgust',
  repelled: 'disgust',
  repulsed: 'disgust',
  sickened: 'disgust',

  afraid: 'fear',
  anxious: 'fear',
  nervous: 'fear',
  overwhelmed: 'fear',
  panicked: 'fear',
  paranoid: 'fear',
  scared: 'fear',
  stressed: 'fear',
  tense: 'fear',
  terrified: 'fear',
  uneasy: 'fear',
  worried: 'fear',

  cheerful: 'joy',
  delighted: 'joy',
  glad: 'joy',
  grateful: 'joy',
  happy: 'joy',
  joyful: 'joy',
  light: 'joy',

  depressed: 'sadness',
  down: 'sadness',
  drained: 'sadness',
  empty: 'sadness',
  grieving: 'sadness',
  heartbroken: 'sadness',
  lonely: 'sadness',
  low: 'sadness',
  melancholy: 'sadness',
  miserable: 'sadness',
  numb: 'sadness',
  sad: 'sadness',
  tired: 'sadness',
  troubled: 'sadness',

  shocked: 'surprise',
  startled: 'surprise',
  stunned: 'surprise',
  surprised: 'surprise',

  calm: 'trust',
  centered: 'trust',
  content: 'trust',
  grounded: 'trust',
  peaceful: 'trust',
  safe: 'trust',
  secure: 'trust',
  settled: 'trust',
  stable: 'trust',
  steady: 'trust',
  trusting: 'trust',

  off: 'unknown',
  odd: 'unknown',
  strange: 'unknown',
  weird: 'unknown',
  blank: 'unknown',
  dull: 'unknown',
  meh: 'unknown',
  blah: 'unknown',
  neutral: 'unknown',
};

function buildBlockedAnalysis() {
  return {
    primaryEmotion: 'unknown',
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
      primaryEmotion: 'unknown',
      scores: {},
      source: 'empty',
    };
  }

  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  const curatedEmotion = findCuratedMoodBucket(tokens);

  if (curatedEmotion) {
    return {
      primaryEmotion: curatedEmotion,
      scores: { [curatedEmotion]: 10 },
      source: 'curated-mood',
    };
  }

  const directEmotion = findStrongEmotionHint(tokens);

  if (directEmotion) {
    return {
      primaryEmotion: directEmotion,
      scores: { [directEmotion]: 10 },
      source: 'strong-hint',
    };
  }

  const scores = EMOTION_KEYS.reduce((accumulator, emotion) => {
    accumulator[emotion] = 0;
    return accumulator;
  }, {});

  for (const token of tokens) {
    const exactMatch = EMOTION_LEXICON[token];

    if (exactMatch) {
      for (const emotion of exactMatch) {
        scores[emotion] += 4;
      }
      continue;
    }

    const similarWord = findSimilarEmotionWord(token);
    if (!similarWord) {
      continue;
    }

    for (const emotion of EMOTION_LEXICON[similarWord]) {
      scores[emotion] += 1;
    }
  }

  const rankedEmotions = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (rankedEmotions.length === 0) {
    const guessedEmotion = guessEmotionFromTone(tokens);
    return {
      primaryEmotion: guessedEmotion,
      scores,
      source: guessedEmotion === 'unknown' ? 'fallback-unknown' : 'fallback-tone',
    };
  }

  const [primaryEmotion] = rankedEmotions[0];

  return {
    primaryEmotion,
    scores,
    source: 'emotion-lexicon',
  };
}

function findStrongEmotionHint(tokens) {
  for (const emotion of EMOTION_KEYS) {
    const hints = STRONG_EMOTION_HINTS[emotion] || [];
    if (tokens.some((token) => hints.includes(token))) {
      return emotion;
    }
  }

  return null;
}

function findCuratedMoodBucket(tokens) {
  for (const token of tokens) {
    if (COMMON_MOOD_BUCKETS[token]) {
      return COMMON_MOOD_BUCKETS[token];
    }
  }

  return null;
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

function guessEmotionFromTone(tokens) {
  const trustWords = ['tender', 'gentle', 'soft', 'safe', 'settled'];
  const joyWords = ['effervescent', 'buoyant', 'sparkly', 'radiant'];
  const angerWords = ['fraught', 'combative', 'heated'];
  const confusionWords = ['murky', 'foggy', 'unclear', 'jumbled', 'strange', 'mixed', 'scrambled'];
  const surpriseWords = ['shocked', 'startled', 'sudden', 'abrupt', 'unexpected'];
  const flatWords = ['bored', 'meh', 'blah', 'neutral', 'whatever'];
  const anticipationEndings = ['ful', 'ous', 'ant', 'ent', 'ive'];

  if (tokens.some((token) => trustWords.includes(token))) {
    return 'trust';
  }

  if (tokens.some((token) => joyWords.includes(token))) {
    return 'joy';
  }

  if (tokens.some((token) => angerWords.includes(token))) {
    return 'anger';
  }

  if (tokens.some((token) => confusionWords.includes(token))) {
    return 'confusion';
  }

  if (tokens.some((token) => surpriseWords.includes(token))) {
    return 'surprise';
  }

  if (tokens.some((token) => flatWords.includes(token))) {
    return 'unknown';
  }

  if (tokens.some((token) => anticipationEndings.some((ending) => token.endsWith(ending)))) {
    return 'anticipation';
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

function findSimilarEmotionWord(token) {
  for (const keyword of EMOTION_WORDS) {
    if (isSimilarWord(token, keyword)) {
      return keyword;
    }
  }

  return null;
}

function buildFortunePool(analysis) {
  const { primaryEmotion } = analysis;
  const profile = EMOTION_PROFILES[primaryEmotion] || EMOTION_PROFILES.unknown;
  if (profile.fortuneKey && FORTUNE_LIBRARY[profile.fortuneKey]) {
    return FORTUNE_LIBRARY[profile.fortuneKey];
  }

  return FORTUNE_LIBRARY.mysterious;
}

function pickSceneForSelection(analysis) {
  return EMOTION_SCENE_KEYS[analysis.primaryEmotion] || EMOTION_SCENE_KEYS.unknown;
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
  const sceneKey = pickSceneForSelection(analysis);
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

export async function clearStoredDailyFortuneSelection() {
  await AsyncStorage.removeItem(DAILY_SELECTION_STORAGE_KEY);
}

export async function clearAllStoredFortuneState() {
  await AsyncStorage.multiRemove([
    USER_ID_STORAGE_KEY,
    DAILY_SELECTION_STORAGE_KEY,
  ]);
}

export function getDefaultSceneKey() {
  return DEFAULT_SCENE_KEY;
}
