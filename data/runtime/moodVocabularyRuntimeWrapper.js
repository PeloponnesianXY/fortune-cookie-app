import { BUCKET_VOCAB } from './moodBucketVocabulary.js';

const MOOD_BUCKET_KEYS = Object.freeze(Object.keys(BUCKET_VOCAB));

const LEGACY_BUCKET_NORMALIZATION = {
  averse: 'disgusted',
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

// Runtime routing uses one authoritative deterministic lexicon: the curated
// BUCKET_VOCAB source. Generated fallback vocab stays available for tooling,
// but no longer participates in production routing.
const DETERMINISTIC_BUCKET_WORDS = BUCKET_VOCAB;

export {
  DETERMINISTIC_BUCKET_WORDS,
  LEGACY_BUCKET_NORMALIZATION,
  MOOD_BUCKET_KEYS,
};
