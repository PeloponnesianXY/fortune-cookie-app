import {
  BUCKET_VOCAB,
  SYNONYM_SNAPSHOT_META,
} from './moodBucketVocabulary';

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

export {
  BUCKET_VOCAB,
  HANDCRAFTED_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
  SYNONYM_SNAPSHOT_META,
};
