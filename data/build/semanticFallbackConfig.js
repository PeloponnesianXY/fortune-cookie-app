const SEMANTIC_BUILD_SETTINGS = {
  allowedWordPattern: '^[a-z]+$',
  minWordLength: 3,
  pruneMinSimilarity: 0.38,
  forceIncludeWords: [
    'defeated',
    'assaulted',
    'attacked',
    'excited',
    'exhilarated',
    'content',
    'nostalgic',
    'satisfied',
    'sick',
    'nauseated',
    'queasy',
    'feverish',
    'dizzy',
    'hungover',
  ],
};

const SEMANTIC_FALLBACK_SETTINGS = {
  minInputLength: 3,
  minSimilarity: 0.4,
  minMargin: 0.03,
  rejectWords: [
    'serious',
    'flamboyant',
    'unwilling',
    'embarrassed',
    'disheartened',
    'discouraged',
    'depressed',
    'spent',
    'lost',
  ],
};

export {
  SEMANTIC_BUILD_SETTINGS,
  SEMANTIC_FALLBACK_SETTINGS,
};
