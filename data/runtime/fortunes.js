/* Runtime fortune copy and bucket profiles. */

import { FORTUNES, FORTUNE_BUCKET_KEYS } from '../fortunesRegistry.js';

function buildBaseFortuneLibrary() {
  const library = Object.fromEntries(FORTUNE_BUCKET_KEYS.map((bucket) => [bucket, []]));

  for (const fortune of FORTUNES) {
    if (!fortune.active || !library[fortune.primaryBucket]) {
      continue;
    }

    library[fortune.primaryBucket].push(fortune.text);

    for (const bucket of fortune.alsoFits || []) {
      if (!library[bucket]) {
        continue;
      }

      library[bucket].push(fortune.text);
    }
  }

  return library;
}

const BASE_FORTUNE_LIBRARY = buildBaseFortuneLibrary();

const BLOCKED_HATE_TERMS = [
  'kike',
  'chink',
  'spic',
  'wetback',
  'faggot',
  'dyke',
  'tranny',
  'nigger',
  'nigga',
  'raghead',
  'hitler',
  'nazi',
  'nazis',
  'neo-nazi',
  'neonazi',
  'kkk',
  'whitepower',
  'white supremacist',
  'supremacist',
  'gypsy',
  'gypsies',
];

const PROTECTED_GROUP_TERMS = [
  'jews',
  'jewish',
  'muslims',
  'muslim',
  'christians',
  'christian',
  'black people',
  'black',
  'white people',
  'asian people',
  'asians',
  'latinos',
  'latinas',
  'mexicans',
  'immigrants',
  'gay people',
  'gays',
  'lesbians',
  'trans people',
  'transgender',
  'women',
  'disabled people',
  'roma',
  'romani',
  'gypsy',
  'gypsies',
];

const HATE_PATTERNS = [
  /\bi hate\s+([a-z]+\s+)?(people|jews|jewish|muslims|muslim|christians|christian|gays|lesbians|women|immigrants|mexicans|asians|latinos|latinas|roma|romani|gypsy|gypsies)\b/,
  /\b([a-z]+\s+)?(people|jews|jewish|muslims|muslim|christians|christian|gays|lesbians|women|immigrants|mexicans|asians|latinos|latinas|roma|romani|gypsy|gypsies)\s+(are|is)\s+(evil|bad|gross|disgusting|inferior|vermin|animals)\b/,
  /\bkill\s+(all\s+)?([a-z]+\s+)?(jews|muslims|gays|lesbians|women|immigrants|mexicans|asians|latinos|latinas|roma|romani|gypsy|gypsies)\b/,
  /\b(jews|jewish|muslims|muslim|christians|christian|gays|lesbians|women|immigrants|mexicans|asians|latinos|latinas|roma|romani|gypsy|gypsies)\s+(suck|stink|are awful|are horrible|are trash)\b/,
];

const { weird: LEGACY_WEIRD_FORTUNES, ...CORE_FORTUNE_LIBRARY } = BASE_FORTUNE_LIBRARY;
const EMOTIONAL_FORTUNES = [
  ...BASE_FORTUNE_LIBRARY.caring,
  ...BASE_FORTUNE_LIBRARY.grateful,
  ...BASE_FORTUNE_LIBRARY.sad,
  ...BASE_FORTUNE_LIBRARY.romantic,
];
const ENGAGED_FORTUNES = [
  ...BASE_FORTUNE_LIBRARY.confident,
  ...BASE_FORTUNE_LIBRARY.happy,
  ...BASE_FORTUNE_LIBRARY.hopeful,
  ...BASE_FORTUNE_LIBRARY.wowed,
];

const FORTUNE_LIBRARY = {
  ...CORE_FORTUNE_LIBRARY,
  proud: [...BASE_FORTUNE_LIBRARY.proud],
  caring: [...BASE_FORTUNE_LIBRARY.caring],
  emotional: [...new Set(EMOTIONAL_FORTUNES)],
  engaged: [...new Set(ENGAGED_FORTUNES)],
  grateful: [...BASE_FORTUNE_LIBRARY.grateful],
  wowed: [...BASE_FORTUNE_LIBRARY.wowed],
  shaken: [...BASE_FORTUNE_LIBRARY.shaken],
  confident: [...BASE_FORTUNE_LIBRARY.confident],
  frustrated: [...BASE_FORTUNE_LIBRARY.frustrated],
  guilty: [...BASE_FORTUNE_LIBRARY.guilty],
  jealous: [...BASE_FORTUNE_LIBRARY.jealous],
  embarrassed: [...BASE_FORTUNE_LIBRARY.embarrassed],
  hungry: [...BASE_FORTUNE_LIBRARY.hungry],
  sick: [...BASE_FORTUNE_LIBRARY.sick],
  wired: [...BASE_FORTUNE_LIBRARY.wired],
  distracted: [...BASE_FORTUNE_LIBRARY.distracted],
  stressed: [...BASE_FORTUNE_LIBRARY.stressed],
  neutral: [...BASE_FORTUNE_LIBRARY.neutral],
  numb: [...BASE_FORTUNE_LIBRARY.numb],
  romantic: [...BASE_FORTUNE_LIBRARY.romantic],
  // Unknown intentionally keeps the mystery-style corpus for unmatched inputs.
  unknown: [...LEGACY_WEIRD_FORTUNES],
};

const MOOD_BUCKET_PROFILES = {
  happy: { fortuneKey: 'happy', tone: 'uplifting', valence: 'positive', energy: 'high' },
  hopeful: { fortuneKey: 'hopeful', tone: 'encouraging', valence: 'positive', energy: 'medium' },
  proud: { fortuneKey: 'proud', tone: 'affirming', valence: 'positive', energy: 'medium' },
  confident: { fortuneKey: 'confident', tone: 'affirming', valence: 'positive', energy: 'medium' },
  calm: { fortuneKey: 'calm', tone: 'grounding', valence: 'positive', energy: 'low' },
  caring: { fortuneKey: 'caring', tone: 'warm', valence: 'positive', energy: 'medium' },
  emotional: { fortuneKey: 'emotional', tone: 'tender', valence: 'neutral', energy: 'low' },
  engaged: { fortuneKey: 'engaged', tone: 'energizing', valence: 'positive', energy: 'medium' },
  grateful: { fortuneKey: 'grateful', tone: 'appreciative', valence: 'positive', energy: 'low' },
  wowed: { fortuneKey: 'wowed', tone: 'expansive', valence: 'positive', energy: 'high' },
  shaken: { fortuneKey: 'shaken', tone: 'alert', valence: 'neutral', energy: 'medium' },
  confused: { fortuneKey: 'confused', tone: 'guiding', valence: 'neutral', energy: 'medium' },
  anxious: { fortuneKey: 'anxious', tone: 'reassuring', valence: 'negative', energy: 'high' },
  angry: { fortuneKey: 'angry', tone: 'grounding', valence: 'negative', energy: 'high' },
  frustrated: { fortuneKey: 'frustrated', tone: 'steadying', valence: 'negative', energy: 'medium' },
  sad: { fortuneKey: 'sad', tone: 'comforting', valence: 'negative', energy: 'low' },
  disgusted: { fortuneKey: 'disgusted', tone: 'protective', valence: 'negative', energy: 'medium' },
  lonely: { fortuneKey: 'lonely', tone: 'companionable', valence: 'negative', energy: 'low' },
  guilty: { fortuneKey: 'guilty', tone: 'gentle', valence: 'negative', energy: 'low' },
  jealous: { fortuneKey: 'jealous', tone: 'steadying', valence: 'negative', energy: 'medium' },
  embarrassed: { fortuneKey: 'embarrassed', tone: 'light', valence: 'neutral', energy: 'medium' },
  tired: { fortuneKey: 'tired', tone: 'restorative', valence: 'negative', energy: 'low' },
  sick: { fortuneKey: 'sick', tone: 'restorative', valence: 'negative', energy: 'low' },
  hungry: { fortuneKey: 'hungry', tone: 'restorative', valence: 'negative', energy: 'medium' },
  wired: { fortuneKey: 'wired', tone: 'settling', valence: 'neutral', energy: 'high' },
  distracted: { fortuneKey: 'distracted', tone: 'refocusing', valence: 'neutral', energy: 'medium' },
  stressed: { fortuneKey: 'stressed', tone: 'stabilizing', valence: 'negative', energy: 'high' },
  neutral: { fortuneKey: 'neutral', tone: 'plainspoken', valence: 'neutral', energy: 'low' },
  numb: { fortuneKey: 'numb', tone: 'soft', valence: 'negative', energy: 'low' },
  romantic: { fortuneKey: 'romantic', tone: 'playful', valence: 'positive', energy: 'medium' },
  unknown: { fortuneKey: 'unknown', tone: 'open', valence: 'neutral', energy: 'medium' },
};

const BLOCKED_INPUT_FORTUNE =
  'A kinder fortune waits when the mood is named without turning anyone into a target.';
const UNKNOWN_INPUT_FORTUNES = [
  'Until I learn what your word means, live long and prosper. And stretch.',
  'Mysterious input detected. Proceed with grace.',
  'Your word is new to me. Your future remains bright.',
  'The cookie oracle is puzzled, not displeased. Carry on.',
  'Unknown word. Excellent aura. Continue accordingly.',
];

export {
  FORTUNES,
  FORTUNE_LIBRARY,
  BLOCKED_HATE_TERMS,
  PROTECTED_GROUP_TERMS,
  HATE_PATTERNS,
  MOOD_BUCKET_PROFILES,
  BLOCKED_INPUT_FORTUNE,
  UNKNOWN_INPUT_FORTUNES,
};
