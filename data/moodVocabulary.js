import {
  BUCKET_VOCAB,
  SYNONYM_SNAPSHOT_META,
} from './vendor/moodSynonymSnapshot';
import {
  OPEN_FALLBACK_VOCAB,
} from './vendor/openFallbackVocab';

const MOOD_BUCKET_KEYS = [
  'happy',
  'hopeful',
  'proud',
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

const HANDCRAFTED_BUCKET_WORDS = Object.fromEntries(
  Object.entries(BUCKET_VOCAB).map(([bucket, words]) => [bucket, words])
);

const OPEN_FALLBACK_BUCKET_WORDS = Object.fromEntries(
  Object.entries(OPEN_FALLBACK_VOCAB).map(([bucket, words]) => [bucket, words])
);

export {
  BUCKET_VOCAB,
  HANDCRAFTED_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
  OPEN_FALLBACK_BUCKET_WORDS,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
};
