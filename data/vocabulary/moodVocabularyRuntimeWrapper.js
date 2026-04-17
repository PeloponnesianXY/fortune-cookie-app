import { BUCKET_VOCAB } from './moodBucketVocabulary.js';

const MOOD_BUCKET_KEYS = Object.freeze(Object.keys(BUCKET_VOCAB));

// Runtime routing uses one authoritative deterministic lexicon: the curated
// single-token BUCKET_VOCAB source. Multi-word phrases are parked in
// futureExpansionMoodPhraseVocabulary.js for later UX support and do not
// participate in current production routing.
const DETERMINISTIC_BUCKET_WORDS = BUCKET_VOCAB;

export {
  DETERMINISTIC_BUCKET_WORDS,
  MOOD_BUCKET_KEYS,
};
