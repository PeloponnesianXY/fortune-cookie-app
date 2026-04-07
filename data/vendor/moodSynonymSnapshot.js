// Repo-local synonym snapshot for mood routing.
// Source references:
// - WordNet 3.0 license text (Princeton / OSI-approved WordNet license)
// - zaibacu/thesaurus format notes: WordNet-derived English thesaurus in JSONL form
//
// This file is intentionally static and bucketed for product use. The app should only
// read these local tables at runtime, never perform live synonym lookups.

const SYNONYM_SNAPSHOT_META = {
  snapshotName: 'fortune-cookie-mood-synonyms',
  snapshotVersion: 1,
  sources: [
    {
      name: 'WordNet 3.0',
      url: 'https://opensource.org/license/wordnet',
      license: 'WordNet',
    },
    {
      name: 'zaibacu/thesaurus',
      url: 'https://github.com/zaibacu/thesaurus',
      notes: 'Offline English thesaurus extracted from WordNet and stored as JSONL.',
    },
  ],
  note:
    'Terms are statically bucket-allocated for this app. Source synonym resources inform expansion, but final bucket placement is product-curated.',
};

// Canonical bucket vocabulary for mood routing.
// - `core` holds high-confidence direct words.
// - `extended` holds broader accepted inputs that should still route to the same bucket.
const BUCKET_VOCAB = {
  amazed: {
    core: [
      'amazed', 'astounded', 'awe', 'awestruck', 'astonished', 'speechless', 'overcome',
      'marveling', 'marvelled', 'dazzled', 'staggered', 'wowed', 'starstruck',
      'wonderstruck', 'awed',
    ],
    extended: ['mind blown', 'full of wonder', 'in awe', 'mesmerized', 'spellbound'],
  },
  angry: {
    core: [
      'angry', 'enraged', 'hateful', 'hostile', 'resentful', 'contemptuous',
      'mad', 'furious', 'heated', 'livid', 'wrathful', 'seething', 'incensed', 'outraged',
      'irate', 'fuming', 'antagonistic',
    ],
    extended: ['ready to fight', 'seeing red', 'hot under the collar', 'pissed', 'raging', 'steamed'],
  },
  anxious: {
    core: [
      'anxious', 'nervous', 'worried', 'agonized', 'fear', 'fearful', 'scared', 'frightened',
      'terrified', 'panicked', 'hysterical', 'horrified', 'insecure',
      'shy', 'apprehensive', 'uneasy', 'timid', 'paranoid', 'watchful',
      'skittish', 'fretful', 'alarmed', 'trepidatious', 'jumpy', 'wary',
      'agitated',
    ],
    extended: ['on edge', 'high strung', 'white knuckled', 'bracing', 'tense', 'rattled', 'unsettled', 'unnerved'],
  },
  awkward: {
    core: [
      'awkward', 'cringe', 'uncomfortable', 'self conscious', 'awkwardness', 'socially awkward',
      'self consciousness', 'sheepish', 'clumsy', 'fumbling', 'gawky', 'stilted', 'ungainly',
      'inferior', 'inadequate', 'less than', 'not good enough',
      'second rate',
    ],
    extended: ['ill at ease', 'socially off', 'cringey', 'dorky', 'inept'],
  },
  calm: {
    core: [
      'calm', 'peaceful', 'serene', 'tranquil', 'settled', 'steady', 'grounded', 'soft',
      'centered', 'composed', 'placid', 'mellow', 'still', 'soothed', 'restful', 'unruffled',
      'collected', 'quiet', 'balanced', 'equable',
    ],
    extended: ['at ease', 'at peace', 'cool headed', 'easygoing', 'relaxed', 'zen'],
  },
  confused: {
    core: [
      'confused', 'perplexed', 'weird', 'unclear', 'mixed', 'uncertain', 'unbalanced',
      'imbalanced', 'lopsided', 'strange', 'baffled', 'puzzled', 'disoriented', 'muddled',
      'scrambled', 'discombobulated', 'tangled', 'murky', 'fogbound',
      'wondering', 'bewildered', 'nonplussed', 'foggy',
    ],
    extended: ['all over the place', 'hard to place', 'not sure', 'lost', 'unsure', 'undecided'],
  },
  distracted: {
    core: [
      'distracted', 'scattered', 'unfocused', 'scatterbrained', 'disorganized',
      'spacey', 'absentminded', 'preoccupied', 'drifting', 'inattentive', 'diverted',
      'sidetracked', 'wandering',
    ],
    extended: ['all over the map', 'can not focus', 'hard to focus', 'daydreaming'],
  },
  disgusted: {
    core: [
      'disgusted', 'revolted', 'grossed out', 'grossed', 'repulsed', 'icky', 'eww',
      'nauseated', 'sickened', 'queasy', 'skeeved out', 'repelled',
    ],
    extended: ['grossed out badly', 'completely grossed out', 'gross', 'nasty', 'vile', 'revolting'],
  },
  frustrated: {
    core: [
      'frustrated', 'annoyed', 'irritable', 'aggravated', 'exasperated', 'crabby',
      'petulant', 'grouchy', 'fed up', 'worked up', 'bothered', 'vexed', 'put out',
      'stymied', 'thwarted', 'irked', 'testy', 'disappointed', 'disillusioned',
      'disheartened', 'underwhelmed', 'let down', 'cross', 'displeased',
    ],
    extended: ['at my limit', 'ready to snap', 'getting nowhere', 'this is disappointing', 'blocked', 'stuck', 'hassled', 'peeved', 'miffed'],
  },
  grateful: {
    core: [
      'grateful', 'gratitude', 'appreciative', 'thankful', 'blessed', 'appreciating',
    ],
    extended: ['full of thanks', 'counting blessings', 'fortunate'],
  },
  guilty: {
    core: [
      'guilty', 'ashamed', 'embarrassed', 'regretful', 'mortified', 'shameful',
      'remorseful', 'remorse', 'regret', 'sorry', 'self blaming', 'self reproachful',
      'contrite', 'penitent',
    ],
    extended: ['full of regret', 'beating myself up', 'carrying guilt', 'apologetic', 'repentant', 'culpable', 'rueful'],
  },
  happy: {
    core: [
      'happy', 'joy', 'delighted', 'jovial', 'pleased', 'satisfied', 'content', 'cheerful',
      'playful', 'amused', 'excited', 'enthusiastic', 'eager',
      'energized', 'euphoric', 'jubilant', 'elated', 'enchanted', 'rapturous', 'enthralled',
      'glad', 'joyful', 'radiant', 'buoyant', 'sparkly', 'upbeat', 'lively', 'sunny',
      'gleeful', 'thrilled', 'merry', 'blissful', 'chipper',
    ],
    extended: ['in good spirits', 'feeling good', 'on top of the world', 'ecstatic', 'giddy', 'lighthearted'],
  },
  hopeful: {
    core: [
      'hopeful', 'optimistic', 'encouraged',
      'promising', 'looking forward', 'possibility', 'expectant', 'aspiring', 'bullish',
      'high hopes', 'assured', 'positive minded', 'confident about', 'buoyed', 'heartened',
    ],
    extended: ['glass half full', 'cautiously hopeful', 'good about this', 'reassured'],
  },
  proud: {
    core: [
      'proud', 'pride', 'prideful', 'accomplished', 'fulfilled', 'self assured', 'dignified',
      'validated', 'self respecting', 'standing tall', 'pleased with myself', 'triumphant',
    ],
    extended: ['holding my head high', 'feeling accomplished', 'earned this'],
  },
  hungry: {
    core: [
      'hungry', 'starving', 'famished', 'peckish', 'craving', 'ravenous', 'underfed',
      'snacky', 'ready to eat', 'in need of food',
    ],
    extended: ['need food', 'need a snack', 'running on empty', 'starved', 'unsated', 'voracious'],
  },
  jealous: {
    core: [
      'jealous', 'envious', 'jealousy', 'envy', 'covetous', 'possessive', 'territorial',
      'green eyed', 'green with envy', 'begrudging', 'coveting',
    ],
    extended: ['feeling possessive', 'feeling envious'],
  },
  lonely: {
    core: [
      'lonely', 'isolated', 'neglected', 'alone', 'disconnected', 'abandoned', 'left out',
      'homesick', 'unseen', 'unwanted', 'cast aside', 'outcast', 'adrift', 'solitary',
      'companionless',
    ],
    extended: ['on my own', 'by myself', 'feeling left out', 'lonesome', 'friendless', 'alienated'],
  },
  loving: {
    core: [
      'affectionate', 'warmhearted', 'tender', 'compassionate', 'caring', 'sentimental',
      'moved', 'touched', 'romantic', 'passionate', 'enamored', 'warm hearted',
      'warm heart', 'gentle', 'kind', 'softhearted', 'flirty', 'smitten', 'in love',
      'adoring', 'devoted', 'fond', 'cherishing', 'nurturing', 'doting', 'sweet on',
    ],
    extended: ['full of affection', 'full of love', 'soft for someone'],
  },
  numb: {
    core: [
      'numb', 'meh', 'blah', 'flat', 'empty', 'blank', 'hollow', 'vacant', 'detached',
      'checked out', 'shut down', 'emotionless', 'deadened', 'unfeeling', 'dulled',
      'disengaged', 'blunted', 'muted',
    ],
    extended: ['nothing much', 'feeling nothing', 'kind of blank', 'apathetic', 'desensitized'],
  },
  sad: {
    core: [
      'sad', 'unhappy', 'gloomy', 'hopeless', 'depressed', 'miserable', 'dismayed',
      'hurt', 'disturbed',
      'pain', 'hurting', 'heartbroken', 'blue', 'low', 'grieving', 'sorrowful', 'destroyed',
      'dumb', 'stupid', 'idiot', 'fool', 'worthless', 'downcast', 'glum', 'melancholy',
      'crestfallen', 'bereft', 'forlorn', 'despondent', 'wounded', 'crushed', 'mournful',
      'woeful', 'heavyhearted',
    ],
    extended: ['feeling low', 'not okay', 'down in the dumps', 'tearful', 'aching', 'somber', 'broken', 'pained', 'shattered', 'gutted', 'useless'],
  },
  stressed: {
    core: [
      'stressed', 'overwhelmed', 'overloaded', 'swamped', 'buried', 'burnt out', 'burned out',
      'burn out', 'loaded down', 'too much', 'frazzled', 'maxed out', 'stretched thin',
      'pressed', 'under pressure', 'snowed under', 'strained', 'at capacity', 'taxed',
      'frayed', 'fragmented', 'burntout', 'burnedout',
    ],
    extended: ['under strain', 'up to here', 'too much on my plate', 'harried', 'scrambling', 'pressured'],
  },
  surprised: {
    core: [
      'surprised', 'stunned', 'shocked', 'startled', 'jolted', 'blindsided',
      'plot twist', 'unexpected', 'caught off guard', 'taken aback', 'thrown', 'jarred',
      'sideswiped', 'surprise struck',
    ],
    extended: ['did not see that coming', 'out of nowhere', 'came from left field', 'aghast', 'dumbfounded', 'gobsmacked'],
  },
  tired: {
    core: [
      'tired', 'exhausted', 'drained', 'weary', 'fatigued', 'sleepy', 'spent', 'worn out',
      'drowsy', 'sluggish', 'listless', 'beat',
      'pooped', 'wiped out', 'knackered', 'droopy',
    ],
    extended: ['out of gas', 'running on fumes', 'need sleep', 'lethargic', 'bushed', 'dozy'],
  },
  unknown: {
    core: [],
    extended: [],
  },
  wired: {
    core: [
      'wired', 'antsy', 'restless', 'jittery', 'shaky', 'twitchy', 'amped', 'buzzing',
      'wired up', 'overcaffeinated', 'keyed up', 'pinging', 'revved up',
      'overstimulated', 'amped up',
    ],
    extended: ['full of static', 'too revved up', 'all buzzed up', 'hyper'],
  },
};

export {
  BUCKET_VOCAB,
  SYNONYM_SNAPSHOT_META,
};
