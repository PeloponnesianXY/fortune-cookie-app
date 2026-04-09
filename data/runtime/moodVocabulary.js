import {
  BUCKET_VOCAB,
  OPEN_FALLBACK_META,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
} from './moodBucketVocabulary.js';

const MOOD_BUCKET_KEYS = [
  'amazed',
  'angry',
  'anxious',
  'awkward',
  'calm',
  'confused',
  'distracted',
  'frustrated',
  'disgusted',
  'grateful',
  'guilty',
  'happy',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'loving',
  'neutral',
  'numb',
  'proud',
  'sad',
  'sick',
  'stressed',
  'surprised',
  'tired',
  'unknown',
  'wired',
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
  OPEN_FALLBACK_META,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
};
