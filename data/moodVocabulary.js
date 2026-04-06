import {
  SNAPSHOT_ALIAS_BUCKET_WORDS,
  SNAPSHOT_EXACT_BUCKET_WORDS,
  SYNONYM_SNAPSHOT_META,
} from './vendor/moodSynonymSnapshot';

const MOOD_BUCKET_KEYS = [
  'happy',
  'hopeful',
  'calm',
  'loving',
  'grateful',
  'amazed',
  'surprised',
  'confused',
  'anxious',
  'angry',
  'frustrated',
  'sad',
  'disgusted',
  'lonely',
  'guilty',
  'jealous',
  'awkward',
  'tired',
  'hungry',
  'wired',
  'distracted',
  'stressed',
  'numb',
  'unknown',
];

const LEGACY_BUCKET_NORMALIZATION = {
  averse: 'disgusted',
  weird: 'confused',
  romantic: 'loving',
  overwhelmed: 'stressed',
  focused: 'hopeful',
  confident: 'hopeful',
  mysterious: 'confused',
};

const EXACT_BUCKET_WORDS = SNAPSHOT_EXACT_BUCKET_WORDS;
const ALIAS_BUCKET_WORDS = SNAPSHOT_ALIAS_BUCKET_WORDS;

export {
  ALIAS_BUCKET_WORDS,
  EXACT_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
  SYNONYM_SNAPSHOT_META,
};
