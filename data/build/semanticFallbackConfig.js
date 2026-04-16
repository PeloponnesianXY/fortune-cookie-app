const SEMANTIC_BUILD_SETTINGS = {
  allowedWordPattern: '^[a-z]+$',
  minWordLength: 3,
  maxAnchorsPerBucket: 8,
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
  runtimeKeepWordsByBucket: {
    anxious: ['fraught', 'panicky', 'apprehensive'],
    embarrassed: ['mortified', 'sheepish'],
    emotional: ['wistful', 'stirred', 'teary'],
    lonely: ['adrift', 'unmoored'],
    sad: ['deflated', 'wrecked', 'desolate'],
    shaken: ['unnerved', 'blindsided'],
    stressed: ['frazzled', 'overloaded'],
    tired: ['haggard', 'rundown'],
    wired: ['jittery', 'overstimulated'],
  },
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
