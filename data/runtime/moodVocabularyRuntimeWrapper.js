import {
  BUCKET_VOCAB,
  OPEN_FALLBACK_META,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
} from './moodBucketVocabulary.js';

const MOOD_BUCKET_KEYS = [
  'caring',
  'wowed',
  'angry',
  'anxious',
  'embarrassed',
  'emotional',
  'engaged',
  'calm',
  'confident',
  'confused',
  'distracted',
  'disgusted',
  'frustrated',
  'grateful',
  'guilty',
  'happy',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'neutral',
  'numb',
  'proud',
  'romantic',
  'sad',
  'sick',
  'stressed',
  'shaken',
  'tired',
  'unknown',
  'wired',
];

const LEGACY_BUCKET_NORMALIZATION = {
  averse: 'disgusted',
  weird: 'confused',
  loving: 'caring',
  affectionate: 'caring',
  remorseful: 'guilty',
  unbalanced: 'distracted',
  surprised: 'shaken',
  blindsided: 'shaken',
  amazed: 'wowed',
  delighted: 'wowed',
  awkward: 'embarrassed',
  embarassed: 'embarrassed',
  overwhelmed: 'stressed',
  focused: 'engaged',
  mysterious: 'confused',
};

const HANDCRAFTED_BUCKET_WORDS = Object.fromEntries(
  Object.entries(BUCKET_VOCAB).map(([bucket, words]) => [bucket, words])
);

const OPEN_FALLBACK_BUCKET_WORDS = Object.fromEntries(
  Object.entries(OPEN_FALLBACK_VOCAB).map(([bucket, words]) => [bucket, words])
);

function mergeBucketWords(...bucketWordMaps) {
  const merged = new Map();

  for (const bucketWordMap of bucketWordMaps) {
    for (const [bucket, words] of Object.entries(bucketWordMap)) {
      if (!merged.has(bucket)) {
        merged.set(bucket, new Set());
      }

      for (const word of words || []) {
        merged.get(bucket).add(word);
      }
    }
  }

  return Object.fromEntries(
    [...merged.entries()].map(([bucket, words]) => [bucket, [...words]])
  );
}

// Runtime routing now uses one authoritative deterministic lexicon:
// curated BUCKET_VOCAB first, generated fallback vocab second, deduped by bucket.
const DETERMINISTIC_BUCKET_WORDS = mergeBucketWords(
  HANDCRAFTED_BUCKET_WORDS,
  OPEN_FALLBACK_BUCKET_WORDS
);

export {
  BUCKET_VOCAB,
  DETERMINISTIC_BUCKET_WORDS,
  HANDCRAFTED_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
  OPEN_FALLBACK_BUCKET_WORDS,
  OPEN_FALLBACK_META,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
};
