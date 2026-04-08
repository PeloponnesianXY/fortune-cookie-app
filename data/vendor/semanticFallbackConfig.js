const SEMANTIC_BUILD_SETTINGS = {
  allowedWordPattern: '^[a-z]+$',
  minWordLength: 4,
  pruneMinSimilarity: 0.5,
};

const SEMANTIC_FALLBACK_SETTINGS = {
  minInputLength: 4,
  minSimilarity: 0.58,
  minMargin: 0.05,
};

export {
  SEMANTIC_BUILD_SETTINGS,
  SEMANTIC_FALLBACK_SETTINGS,
};
