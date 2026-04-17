/* Derived fortune pools and routing profiles. */

import { FORTUNES, FORTUNE_BUCKET_KEYS } from './fortunesRegistry.js';

function buildBaseFortuneLibrary() {
  const library = Object.fromEntries(FORTUNE_BUCKET_KEYS.map((bucket) => [bucket, []]));

  for (const fortune of FORTUNES) {
    if (!library[fortune.primaryBucket]) {
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

const FORTUNE_LIBRARY = {
  ...BASE_FORTUNE_LIBRARY,
  unknown: [...BASE_FORTUNE_LIBRARY.unknown],
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

export {
  FORTUNES,
  FORTUNE_LIBRARY,
  BLOCKED_HATE_TERMS,
  PROTECTED_GROUP_TERMS,
  HATE_PATTERNS,
  MOOD_BUCKET_PROFILES,
  BLOCKED_INPUT_FORTUNE,
};
