import {
  BUCKET_VOCAB,
  SYNONYM_SNAPSHOT_META,
} from './vendor/moodSynonymSnapshot';

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

// Runtime helpers still distinguish direct vs broader accepted inputs,
// but both tables now derive from the canonical BUCKET_VOCAB source.
const EXACT_BUCKET_WORDS = Object.fromEntries(
  Object.entries(BUCKET_VOCAB).map(([bucket, vocabulary]) => [bucket, vocabulary.core])
);

const ALIAS_BUCKET_WORDS = Object.fromEntries(
  Object.entries(BUCKET_VOCAB).map(([bucket, vocabulary]) => [bucket, vocabulary.extended])
);

export {
  BUCKET_VOCAB,
  ALIAS_BUCKET_WORDS,
  EXACT_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
  SYNONYM_SNAPSHOT_META,
};
