import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BLOCKED_HATE_TERMS,
  BLOCKED_INPUT_FORTUNE,
  FORTUNE_LIBRARY,
  HATE_PATTERNS,
  MOOD_BUCKET_PROFILES,
  PROTECTED_GROUP_TERMS,
} from '../data/fortunes';
import EMOTION_LEXICON from '../data/nrcEmotionLexicon.json';
import { MOOD_SCENE_KEYS } from '../data/scenes';

const USER_ID_STORAGE_KEY = '@fortune-cookie-daily/user-id';
const DAILY_SELECTION_STORAGE_KEY = '@fortune-cookie-daily/daily-selection';
const DEFAULT_SCENE_KEY = 'apricotMorning';

const LEGACY_EMOTION_TO_MOOD_BUCKET = {
  anger: 'angry',
  anticipation: 'hopeful',
  disgust: 'averse',
  fear: 'anxious',
  joy: 'happy',
  sadness: 'sad',
  surprise: 'surprised',
  trust: 'calm',
};

const LEGACY_EMOTION_WEIGHTS = {
  anger: 1.12,
  anticipation: 0.96,
  disgust: 0.72,
  fear: 1.08,
  joy: 1.04,
  sadness: 1.1,
  surprise: 0.9,
  trust: 1.0,
};

const MOOD_BUCKET_KEYS = [
  'happy',
  'hopeful',
  'calm',
  'tired',
  'lonely',
  'sad',
  'anxious',
  'angry',
  'confused',
  'surprised',
  'averse',
  'weird',
];

const MOOD_BUCKET_PRIORITY = [
  'happy',
  'hopeful',
  'calm',
  'tired',
  'lonely',
  'sad',
  'anxious',
  'angry',
  'confused',
  'surprised',
  'averse',
  'weird',
];

const STRONG_MOOD_HINTS = {
  happy: ['happy', 'joyful', 'excited', 'glad', 'delighted'],
  hopeful: ['hopeful', 'eager', 'expectant', 'optimistic'],
  sad: [
    'depressed',
    'depression',
    'sad',
    'down',
    'low',
    'hopeless',
    'heartbroken',
    'grieving',
    'miserable',
    'numb',
  ],
  calm: ['calm', 'safe', 'steady', 'secure', 'grounded', 'tender'],
  tired: ['tired', 'drained', 'exhausted', 'spent', 'weary', 'fatigued', 'sleepy', 'heavy', 'foggy'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'unseen', 'disconnected'],
  anxious: ['afraid', 'fearful', 'scared', 'terrified', 'panicked', 'anxious', 'restless', 'watchful'],
  angry: ['angry', 'furious', 'irritated', 'mad', 'resentful'],
  averse: ['disgusted', 'grossed', 'repulsed'],
  surprised: ['surprised', 'shocked', 'startled', 'stunned', 'unexpected'],
  confused: ['confused', 'unclear', 'lost', 'blank', 'unsure', 'puzzled'],
};

const CURATED_MOOD_WORDS = {
  angry: [
    'angry', 'annoyed', 'bitter', 'defensive', 'enraged', 'frustrated', 'furious', 'heated',
    'irritated', 'mad', 'outraged', 'resentful', 'agitated', 'aggravated',
    'antagonistic', 'argumentative', 'belligerent', 'bothered', 'combative', 'confrontational',
    'cranky', 'cross', 'exasperated', 'fuming', 'grumpy', 'huffy', 'hostile', 'impatient',
    'incensed', 'indignant', 'inflamed', 'irate', 'livid', 'offended', 'peeved', 'petty',
    'provoked', 'raging', 'riled', 'seething', 'snappy', 'sore', 'spiteful', 'stormy',
    'testy', 'touchy', 'vengeful', 'volatile', 'wrathful',
  ],
  hopeful: [
    'eager', 'excited', 'expectant', 'hopeful', 'optimistic', 'ready', 'alert',
    'ambitious', 'anticipatory', 'aspiring', 'attentive', 'awake', 'buoyant', 'charged',
    'confident', 'craving', 'curious', 'determined', 'driven', 'encouraged', 'energized',
    'enthusiastic', 'game', 'hungry', 'inspired', 'interested', 'intrigued', 'invested',
    'keyed', 'keen', 'longing', 'motivated', 'prepared', 'primed',
    'pumped', 'receptive', 'refreshed', 'revived', 'searching', 'seeking', 'striving',
    'yearning', 'adventurous', 'awaiting', 'enterprising',
  ],
  confused: [
    'baffled', 'conflicted', 'confused', 'jumbled', 'lost', 'mixed', 'puzzled',
    'torn', 'unclear', 'uncertain', 'unsure', 'ambivalent', 'bewildered', 'discombobulated',
    'disoriented', 'doubtful', 'drifting', 'hazy', 'hesitant', 'indecisive',
    'incoherent', 'muddled', 'murky', 'perplexed', 'questioning', 'scattered', 'scrambled',
    'split', 'stuck', 'unconvinced', 'undecided', 'unfocused', 'ungrounded', 'unresolved',
    'unsorted', 'vague', 'wavering', 'wondering', 'adrift', 'disjointed', 'floating',
    'tangled', 'thrown', 'unmoored', 'wobbly', 'disorganized', 'circling', 'disordered',
    'scrappy', 'messy', 'scruffy', 'rattled', 'scrutinizing', 'secondguessing', 'spiraling',
    'hesitating', 'ruminating', 'overthinking', 'pensive', 'displaced', 'turnedaround',
    'misaligned', 'unclearheaded', 'atsea', 'inbetween', 'unanchored', 'divided', 'uncertainly',
  ],
  averse: [
    'disgusted', 'grossed', 'repelled', 'repulsed', 'sickened', 'appalled', 'averse',
    'contaminated', 'contemptuous', 'creeped', 'disdainful', 'displeased', 'disturbed',
    'disgust', 'eww', 'filthy', 'gross', 'grimacing', 'icky', 'loathing', 'nauseated',
    'nauseous', 'queasy', 'recoiling', 'revolted', 'revolting', 'rancid', 'rank', 'revulsed',
    'rotten', 'squeamish', 'stale', 'tainted', 'turnedoff', 'uncomfortable', 'unclean',
    'unsettled', 'violated', 'yucky', 'disapproving', 'disenchanted', 'disillusioned',
    'grimy', 'sullied', 'sticky', 'foul', 'sour', 'polluted', 'toxic', 'putrid',
  ],
  anxious: [
    'afraid', 'anxious', 'nervous', 'overwhelmed', 'panicked', 'paranoid', 'scared',
    'stressed', 'tense', 'terrified', 'uneasy', 'worried', 'alarmed', 'apprehensive',
    'cautious', 'cornered', 'dreading', 'fearful', 'fragile', 'fretful', 'guarded',
    'insecure', 'intimidated', 'jittery', 'jumpy', 'pressured', 'shaky', 'spooked',
    'threatened', 'timid', 'twitchy', 'unnerved', 'unsafe', 'unsteady', 'vulnerable',
    'wary', 'panicky', 'frantic', 'haunted', 'petrified', 'trembling', 'foreboding',
    'frozen', 'shaken', 'hunted', 'exposed', 'skittish', 'selfconscious', 'suspicious',
    'edgy', 'restless', 'watchful',
  ],
  happy: [
    'cheerful', 'delighted', 'glad', 'grateful', 'happy', 'joyful', 'light', 'sexy',
    'spicy', 'sublime', 'amused', 'blissful', 'carefree', 'celebratory', 'charmed',
    'ecstatic', 'elated', 'enlivened', 'euphoric', 'flirty', 'free', 'friendly', 'fulfilled',
    'giddy', 'gleeful', 'glowing', 'jolly', 'laughing', 'lively', 'loved', 'lucky',
    'playful', 'pleased', 'proud', 'radiant', 'relieved', 'sparkly', 'sunny', 'thrilled',
    'vibrant', 'warm', 'welcomed', 'whimsical', 'wonderful', 'merry', 'beaming', 'sunlit',
    'rosy', 'upbeat', 'blessed',
  ],
  sad: [
    'depressed', 'down', 'empty', 'grieving', 'heartbroken', 'low',
    'melancholy', 'miserable', 'numb', 'sad', 'troubled', 'ashamed',
    'blue', 'broken', 'defeated', 'deflated', 'despairing', 'discouraged',
    'homesick', 'hopeless', 'hurt', 'inadequate',
    'languishing', 'pained', 'raw', 'regretful', 'rejected', 'rueful', 'small', 'sorrowful',
    'sorry', 'weepy', 'wounded', 'worthless',
    'bleak', 'crestfallen', 'hollow', 'forlorn', 'meh', 'blah',
  ],
  tired: [
    'tired', 'drained', 'depleted', 'exhausted', 'spent', 'weary', 'fatigued', 'burntout',
    'burnedout', 'wornout', 'sleepy', 'drowsy', 'heavy', 'foggy',
  ],
  lonely: [
    'lonely', 'alone', 'isolated', 'abandoned', 'unseen', 'leftout', 'unloved', 'unwanted',
    'forsaken', 'excluded', 'disconnected',
  ],
  surprised: [
    'shocked', 'startled', 'stunned', 'surprised', 'amazed', 'astonished', 'awed',
    'blindsided', 'dazzled', 'dumbfounded', 'flabbergasted', 'gobsmacked', 'jolted',
    'marveling', 'reeling', 'rocked', 'speechless', 'thunderstruck', 'unprepared',
    'unexpected', 'wonderstruck', 'wowed', 'abrupt', 'sudden', 'uncanny', 'wild', 'agog',
    'astounded', 'floored', 'gasping', 'incredulous', 'jarred', 'shellshocked', 'breathless',
    'confounded', 'disbelieving', 'overawed', 'unready', 'shook', 'wow', 'whoa',
    'nonplussed', 'stupefied', 'agape', 'starstruck', 'spellbound', 'awestruck',
    'astonied', 'sparkstruck', 'mesmerized',
  ],
  calm: [
    'calm', 'centered', 'content', 'grounded', 'peaceful', 'safe', 'secure', 'settled',
    'stable', 'steady', 'trusting', 'aligned', 'anchored', 'assured', 'balanced', 'clear',
    'collected', 'comfortable', 'comforted', 'composed', 'connected', 'cozy', 'held',
    'okay', 'protected', 'reassured', 'relaxed', 'reliable', 'rooted', 'soothed',
    'supported', 'whole', 'capable', 'certain', 'cushioned', 'eased', 'fortified',
    'gentle', 'harmonious', 'homey', 'intact', 'mellow', 'nourished', 'openhearted',
    'patient', 'quiet', 'resilient', 'rested', 'sheltered', 'steadying',
    'tender',
  ],
  weird: [
    'off', 'odd', 'strange', 'weird', 'blank', 'bored', 'dull', 'neutral',
    'abstract', 'absent', 'aloof', 'ambiguous', 'anonymous', 'bizarre', 'cloudy',
    'detached', 'distant', 'flat', 'funky', 'gray', 'indescribable',
    'intangible', 'liminal', 'muted', 'nebulous', 'obscure', 'offcenter', 'opaque',
    'peculiar', 'plain', 'random', 'shapeless', 'surreal', 'undefined', 'unmarked',
    'unnamed', 'unreadable', 'untitled', 'vacant', 'void', 'whatever', 'airy',
    'unclassifiable', 'floaty', 'neither', 'elsewhere', 'miscellaneous', 'wonky', 'eerie',
    'dreamy', 'hazyblank', 'nondescript', 'fuzzy', 'drifty', 'spacey', 'diffuse', 'untethered',
    'unplaceable', 'inexplicable', 'peculiarish', 'outofbody', 'unusual', 'idiosyncratic', 'vibey',
    'offbeat', 'leftfield', 'otherworldly', 'inbetweeny', 'indifferent',
  ],
};

const COMMON_MOOD_BUCKETS = Object.fromEntries(
  Object.entries(CURATED_MOOD_WORDS).flatMap(([bucket, words]) => (
    words.map((word) => [word, bucket])
  ))
);

const NRC_BUCKET_OVERRIDES = {
  abandoned: 'lonely',
  alone: 'lonely',
  disconnected: 'lonely',
  exhausted: 'tired',
  fatigued: 'tired',
  isolated: 'lonely',
  lonely: 'lonely',
  sleepy: 'tired',
  spent: 'tired',
  tired: 'tired',
  weary: 'tired',
};

const NRC_WORD_TO_MOOD_BUCKET = Object.fromEntries(
  Object.entries(EMOTION_LEXICON).map(([word, legacyEmotions]) => {
    const overriddenBucket = NRC_BUCKET_OVERRIDES[word];
    return [
      word,
      overriddenBucket || pickMoodBucketFromLegacyEmotions(legacyEmotions),
    ];
  })
);

const NRC_WORDS_BY_FIRST_LETTER = Object.keys(NRC_WORD_TO_MOOD_BUCKET).reduce((accumulator, word) => {
  const firstLetter = word[0];
  if (!accumulator[firstLetter]) {
    accumulator[firstLetter] = [];
  }

  accumulator[firstLetter].push(word);
  return accumulator;
}, {});

function buildBlockedAnalysis() {
  return {
    primaryEmotion: 'weird',
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
  const nextSelection = ensureSelectionMetadata(selection);
  await AsyncStorage.setItem(DAILY_SELECTION_STORAGE_KEY, JSON.stringify(nextSelection));
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

function createMoodScoreCard() {
  return MOOD_BUCKET_KEYS.reduce((accumulator, bucket) => {
    accumulator[bucket] = 0;
    return accumulator;
  }, {});
}

function rankMoodScores(scores) {
  return Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return MOOD_BUCKET_PRIORITY.indexOf(a[0]) - MOOD_BUCKET_PRIORITY.indexOf(b[0]);
    });
}

function pickMoodBucketFromLegacyEmotions(legacyEmotions) {
  const scores = createMoodScoreCard();

  for (const legacyEmotion of legacyEmotions) {
    const bucket = LEGACY_EMOTION_TO_MOOD_BUCKET[legacyEmotion];
    if (!bucket) {
      continue;
    }

    scores[bucket] += LEGACY_EMOTION_WEIGHTS[legacyEmotion] || 1;
  }

  return rankMoodScores(scores)[0]?.[0] || 'weird';
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
      primaryEmotion: 'weird',
      scores: {},
      source: 'empty',
    };
  }

  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  const curatedMoodBucket = findCuratedMoodBucket(tokens);

  if (curatedMoodBucket) {
    return {
      primaryEmotion: curatedMoodBucket,
      scores: { [curatedMoodBucket]: 10 },
      source: 'curated-mood',
    };
  }

  const directMoodBucket = findStrongMoodHint(tokens);

  if (directMoodBucket) {
    return {
      primaryEmotion: directMoodBucket,
      scores: { [directMoodBucket]: 10 },
      source: 'strong-hint',
    };
  }

  const scores = createMoodScoreCard();

  for (const token of tokens) {
    const exactMatchBucket = NRC_WORD_TO_MOOD_BUCKET[token];

    if (exactMatchBucket) {
      scores[exactMatchBucket] += 4;
      continue;
    }

    const similarWord = findSimilarMoodWord(token);
    if (!similarWord) {
      continue;
    }

    scores[NRC_WORD_TO_MOOD_BUCKET[similarWord]] += 1;
  }

  const rankedBuckets = rankMoodScores(scores);

  if (rankedBuckets.length === 0) {
    const guessedMoodBucket = guessMoodFromTone(tokens);
    return {
      primaryEmotion: guessedMoodBucket,
      scores,
      source: guessedMoodBucket === 'weird' ? 'fallback-weird' : 'fallback-tone',
    };
  }

  const [primaryEmotion] = rankedBuckets[0];

  return {
    primaryEmotion,
    scores,
    source: 'nrc-mood-map',
  };
}

function findStrongMoodHint(tokens) {
  for (const bucket of MOOD_BUCKET_KEYS) {
    const hints = STRONG_MOOD_HINTS[bucket] || [];
    if (tokens.some((token) => hints.includes(token))) {
      return bucket;
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

function guessMoodFromTone(tokens) {
  const calmWords = ['tender', 'gentle', 'soft', 'safe', 'settled'];
  const happyWords = ['effervescent', 'buoyant', 'sparkly', 'radiant'];
  const tiredWords = ['tired', 'drained', 'exhausted', 'spent', 'weary', 'fatigued', 'heavy', 'sleepy'];
  const lonelyWords = ['lonely', 'alone', 'isolated', 'abandoned', 'unseen', 'disconnected'];
  const angryWords = ['fraught', 'combative', 'heated'];
  const confusedWords = ['murky', 'foggy', 'unclear', 'jumbled', 'strange', 'mixed', 'scrambled'];
  const surprisedWords = ['shocked', 'startled', 'sudden', 'abrupt', 'unexpected'];
  const sadFlatWords = ['meh', 'blah'];
  const flatWords = ['bored', 'neutral', 'whatever'];
  const hopefulEndings = ['ful', 'ous', 'ant', 'ent', 'ive'];

  if (tokens.some((token) => calmWords.includes(token))) {
    return 'calm';
  }

  if (tokens.some((token) => happyWords.includes(token))) {
    return 'happy';
  }

  if (tokens.some((token) => tiredWords.includes(token))) {
    return 'tired';
  }

  if (tokens.some((token) => lonelyWords.includes(token))) {
    return 'lonely';
  }

  if (tokens.some((token) => angryWords.includes(token))) {
    return 'angry';
  }

  if (tokens.some((token) => confusedWords.includes(token))) {
    return 'confused';
  }

  if (tokens.some((token) => surprisedWords.includes(token))) {
    return 'surprised';
  }

  if (tokens.some((token) => sadFlatWords.includes(token))) {
    return 'sad';
  }

  if (tokens.some((token) => flatWords.includes(token))) {
    return 'weird';
  }

  if (tokens.some((token) => hopefulEndings.some((ending) => token.endsWith(ending)))) {
    return 'hopeful';
  }

  return 'weird';
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

function findSimilarMoodWord(token) {
  const candidateWords = NRC_WORDS_BY_FIRST_LETTER[token[0]] || [];

  for (const keyword of candidateWords) {
    if (isSimilarWord(token, keyword)) {
      return keyword;
    }
  }

  return null;
}

function buildFortunePool(analysis) {
  const { primaryEmotion } = analysis;
  const profile = MOOD_BUCKET_PROFILES[primaryEmotion] || MOOD_BUCKET_PROFILES.weird;
  if (profile.fortuneKey && FORTUNE_LIBRARY[profile.fortuneKey]) {
    return FORTUNE_LIBRARY[profile.fortuneKey];
  }

  return FORTUNE_LIBRARY.weird;
}

function pickSceneForSelection(analysis) {
  return MOOD_SCENE_KEYS[analysis.primaryEmotion] || MOOD_SCENE_KEYS.weird;
}

async function buildFortuneSelection(input, {
  dayKey,
  seedKey,
  persistSelection,
  excludeFortuneText = null,
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
      const storedSelection = await saveDailySelection(blockedSelection);
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
  const userId = await getOrCreateUserId();
  const pool = buildFortunePool(analysis);
  const seed = hashString(`${userId}|${seedKey}`);
  let fortuneText = pool[seed % pool.length];

  if (excludeFortuneText && pool.length > 1 && fortuneText === excludeFortuneText) {
    fortuneText = pool[(seed + 1) % pool.length];
  }

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
    const storedSelection = await saveDailySelection(selection);
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

export async function getDailyFortuneSelection(input) {
  const dayKey = getLocalDayKey();
  const existingSelection = await loadDailySelection();

  if (existingSelection?.dayKey === dayKey && existingSelection?.fortuneText) {
    const normalizedSelection = hasSelectionMetadata(existingSelection)
      ? existingSelection
      : await saveDailySelection(existingSelection);

    return {
      ...normalizedSelection,
      moderation: normalizedSelection.moderation || 'clean',
      fromCache: true,
    };
  }

  return buildFortuneSelection(input, {
    dayKey,
    seedKey: dayKey,
    persistSelection: true,
  });
}

export async function getOverrideFortuneSelection(input, overrideKey, options = {}) {
  const dayKey = getLocalDayKey();

  return buildFortuneSelection(input, {
    dayKey,
    seedKey: `${dayKey}|override|${overrideKey}`,
    persistSelection: false,
    excludeFortuneText: options.excludeFortuneText || null,
  });
}

export async function getReplacementFortuneSelection(input, {
  mode = 'daily',
  replacementKey = 1,
  excludeFortuneText = null,
} = {}) {
  const dayKey = getLocalDayKey();

  return buildFortuneSelection(input, {
    dayKey,
    seedKey: mode === 'override'
      ? `${dayKey}|override-replace|${replacementKey}`
      : `${dayKey}|replace|${replacementKey}`,
    persistSelection: mode !== 'override',
    excludeFortuneText,
  });
}

export async function getStoredDailyFortuneSelection() {
  const dayKey = getLocalDayKey();
  const selection = await loadDailySelection();

  if (!selection) {
    return null;
  }

  if (selection.dayKey === dayKey && selection.fortuneText) {
    return hasSelectionMetadata(selection)
      ? selection
      : saveDailySelection(selection);
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
