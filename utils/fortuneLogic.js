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

const LEGACY_EMOTION_TO_MOOD_BUCKET = {
  anger: 'angry',
  anticipation: 'hopeful',
  disgust: 'disgusted',
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
  'disgusted',
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
  'disgusted',
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
  disgusted: ['disgusted', 'grossed', 'repulsed'],
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
    'pissy', 'snippy', 'salty', 'crabby', 'bitchy', 'petulant', 'grouchy',
  ],
  hopeful: [
    'eager', 'excited', 'expectant', 'hopeful', 'optimistic', 'ready', 'alert',
    'ambitious', 'anticipatory', 'aspiring', 'attentive', 'awake', 'buoyant', 'charged',
    'confident', 'curious', 'determined', 'driven', 'encouraged', 'energized',
    'enthusiastic', 'game', 'inspired', 'interested', 'intrigued', 'invested',
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
    'unbalanced', 'imbalanced', 'lopsided',
  ],
  disgusted: [
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
    'dumb', 'stupid', 'idiot', 'idiotic', 'fool', 'foolish', 'moron', 'dense',
    'dimwitted', 'dopey', 'airhead', 'dunce', 'boneheaded', 'brainless', 'obtuse', 'destroyed',
  ],
  tired: [
    'tired', 'drained', 'depleted', 'exhausted', 'spent', 'weary', 'fatigued', 'burntout',
    'burnedout', 'wornout', 'sleepy', 'drowsy', 'heavy', 'foggy',
    'hungry', 'craving', 'starving', 'famished', 'ravenous', 'peckish',
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
  airhead: 'sad',
  alone: 'lonely',
  bitchy: 'angry',
  boneheaded: 'sad',
  brainless: 'sad',
  crabby: 'angry',
  craving: 'tired',
  dense: 'sad',
  disconnected: 'lonely',
  destroyed: 'sad',
  dopey: 'sad',
  dumb: 'sad',
  dunce: 'sad',
  exhausted: 'tired',
  famished: 'tired',
  fatigued: 'tired',
  fool: 'sad',
  foolish: 'sad',
  grouchy: 'angry',
  hungry: 'tired',
  imbalanced: 'confused',
  idiot: 'sad',
  idiotic: 'sad',
  isolated: 'lonely',
  lopsided: 'confused',
  lonely: 'lonely',
  moron: 'sad',
  obtuse: 'sad',
  peckish: 'tired',
  petulant: 'angry',
  pissy: 'angry',
  ravenous: 'tired',
  salty: 'angry',
  sleepy: 'tired',
  snippy: 'angry',
  spent: 'tired',
  starving: 'tired',
  stupid: 'sad',
  tired: 'tired',
  unbalanced: 'confused',
  weary: 'tired',
};

let _nrcWordToMoodBucket = null;

function normalizeMoodBucketKey(moodKey) {
  if (moodKey === 'averse') {
    return 'disgusted';
  }

  return moodKey;
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

function ensureNrcLookups() {
  if (_nrcWordToMoodBucket) {
    return;
  }

  const EMOTION_LEXICON = require('../data/nrcEmotionLexicon.json');

  _nrcWordToMoodBucket = Object.fromEntries(
    Object.entries(EMOTION_LEXICON).map(([word, legacyEmotions]) => {
      const overriddenBucket = NRC_BUCKET_OVERRIDES[word];
      return [
        word,
        overriddenBucket || pickMoodBucketFromLegacyEmotions(legacyEmotions),
      ];
    })
  );

}

function getNrcWordToMoodBucket() {
  ensureNrcLookups();
  return _nrcWordToMoodBucket;
}

function buildBlockedAnalysis() {
  return {
    primaryEmotion: 'weird',
    confidence: 0,
    scores: {},
    source: 'blocked-hate',
  };
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

function roundConfidence(value) {
  return Math.max(0, Math.min(1, Math.round(value * 1000) / 1000));
}

function getTopScoreGapConfidence(rankedBuckets) {
  if (!rankedBuckets.length) {
    return 0;
  }

  const topScore = rankedBuckets[0][1];
  const secondScore = rankedBuckets[1]?.[1] || 0;
  const totalScore = rankedBuckets.reduce((sum, [, score]) => sum + score, 0);

  if (topScore <= 0 || totalScore <= 0) {
    return 0;
  }

  const dominance = topScore / totalScore;
  const separation = topScore / (topScore + secondScore || 1);

  return roundConfidence((dominance * 0.65) + (separation * 0.35));
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
      confidence: 0,
      scores: {},
      source: 'empty',
    };
  }

  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  const curatedMoodMatch = findCuratedMoodMatch(tokens);

  if (curatedMoodMatch) {
    const isExactMoodLabel = curatedMoodMatch.token === curatedMoodMatch.bucket;
    const confidence = isExactMoodLabel ? 1 : 0.72;

    return {
      primaryEmotion: curatedMoodMatch.bucket,
      confidence,
      scores: { [curatedMoodMatch.bucket]: 10 },
      source: 'curated-mood',
    };
  }

  const strongMoodMatch = findStrongMoodHintMatch(tokens);

  if (strongMoodMatch) {
    const confidence = strongMoodMatch.token === strongMoodMatch.bucket ? 1 : 0.88;

    return {
      primaryEmotion: strongMoodMatch.bucket,
      confidence,
      scores: { [strongMoodMatch.bucket]: 10 },
      source: 'strong-hint',
    };
  }

  const scores = createMoodScoreCard();

  for (const token of tokens) {
    const exactMatchBucket = getNrcWordToMoodBucket()[token];

    if (exactMatchBucket) {
      scores[exactMatchBucket] += 4;
    }
  }

  const rankedBuckets = rankMoodScores(scores);

  if (rankedBuckets.length === 0) {
    const guessedMoodBucket = guessMoodFromTone(tokens);
    return {
      primaryEmotion: guessedMoodBucket,
      confidence: guessedMoodBucket === 'weird' ? 0 : 0.28,
      scores,
      source: guessedMoodBucket === 'weird' ? 'fallback-weird' : 'fallback-tone',
    };
  }

  const [primaryEmotion] = rankedBuckets[0];
  const baseConfidence = getTopScoreGapConfidence(rankedBuckets);
  const confidence = Math.max(baseConfidence, 0.78);

  return {
    primaryEmotion,
    confidence,
    scores,
    source: 'nrc-mood-map',
  };
}

function findStrongMoodHintMatch(tokens) {
  for (const bucket of MOOD_BUCKET_KEYS) {
    const hints = STRONG_MOOD_HINTS[bucket] || [];
    for (const token of tokens) {
      if (hints.includes(token)) {
        return { bucket, token };
      }
    }
  }

  return null;
}

function findCuratedMoodMatch(tokens) {
  for (const token of tokens) {
    if (COMMON_MOOD_BUCKETS[token]) {
      return {
        bucket: COMMON_MOOD_BUCKETS[token],
        token,
      };
    }
  }

  return null;
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

  return 'weird';
}

function buildFortunePool(analysis) {
  const { primaryEmotion } = analysis;
  const profile = MOOD_BUCKET_PROFILES[primaryEmotion] || MOOD_BUCKET_PROFILES.weird;
  if (profile.fortuneKey && FORTUNE_LIBRARY[profile.fortuneKey]) {
    return FORTUNE_LIBRARY[profile.fortuneKey];
  }

  return FORTUNE_LIBRARY.weird;
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

function pickUnknownInputFortune(seed) {
  return UNKNOWN_INPUT_FORTUNES[seed % UNKNOWN_INPUT_FORTUNES.length];
}

function pickSceneForSelection(analysis) {
  return MOOD_SCENE_KEYS[analysis.primaryEmotion] || MOOD_SCENE_KEYS.weird;
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
  const isUnknownInput = analysis.source === 'fallback-weird';
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
