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

const SNAPSHOT_EXACT_BUCKET_WORDS = {
  amazed: [
    'amazed', 'astounded', 'awe', 'awestruck', 'astonished', 'speechless', 'overcome',
    'wondering', 'marveling', 'marvelled', 'dazzled', 'staggered', 'wowed', 'starstruck',
    'wonderstruck', 'awed', 'openmouthed',
  ],
  angry: [
    'angry', 'enraged', 'agitated', 'hateful', 'hostile', 'resentful', 'contemptuous',
    'mad', 'furious', 'heated', 'livid', 'wrathful', 'seething', 'incensed', 'outraged',
    'irate', 'fuming', 'cross', 'antagonistic',
  ],
  anxious: [
    'anxious', 'nervous', 'worried', 'agonized', 'fear', 'fearful', 'scared', 'frightened',
    'terrified', 'panicked', 'hysterical', 'horrified', 'dreadful', 'insecure', 'inferior',
    'inadequate', 'shy', 'apprehensive', 'uneasy', 'timid', 'paranoid', 'watchful',
    'skittish', 'fretful', 'alarmed', 'trepidatious', 'jumpy', 'guarded', 'wary',
  ],
  awkward: [
    'awkward', 'cringe', 'uncomfortable', 'self conscious', 'awkwardness', 'socially awkward',
    'self consciousness', 'sheepish', 'clumsy', 'fumbling', 'gawky', 'stilted', 'ungainly',
    'self aware', 'embarrassing', 'strained',
  ],
  calm: [
    'calm', 'peaceful', 'serene', 'tranquil', 'settled', 'steady', 'grounded', 'soft',
    'centered', 'composed', 'placid', 'mellow', 'still', 'soothed', 'restful', 'unruffled',
    'collected', 'quiet', 'balanced', 'equable',
  ],
  confused: [
    'confused', 'perplexed', 'weird', 'unclear', 'mixed', 'uncertain', 'unbalanced',
    'imbalanced', 'lopsided', 'strange', 'baffled', 'puzzled', 'disoriented', 'muddled',
    'scrambled', 'discombobulated', 'tangled', 'murky', 'bewildering', 'fogbound',
  ],
  distracted: [
    'distracted', 'scattered', 'unfocused', 'foggy', 'scatterbrained', 'disorganized',
    'spacey', 'absentminded', 'preoccupied', 'drifting', 'inattentive', 'diverted',
    'sidetracked', 'wandering', 'frayed', 'fragmented',
  ],
  disgusted: [
    'disgusted', 'revolted', 'grossed out', 'grossed', 'repulsed', 'icky', 'eww',
    'nauseated', 'sickened', 'queasy', 'skeeved out', 'repelled', 'appalled', 'turned off',
  ],
  frustrated: [
    'frustrated', 'annoyed', 'irritable', 'aggravated', 'exasperated', 'crabby',
    'petulant', 'grouchy', 'fed up', 'worked up', 'bothered', 'vexed', 'put out',
    'stymied', 'thwarted', 'irked', 'testy',
  ],
  grateful: [
    'grateful', 'gratitude', 'appreciative', 'thankful', 'blessed', 'appreciating',
    'beholden', 'indebted', 'moved to gratitude', 'obliged', 'thank filled',
  ],
  guilty: [
    'guilty', 'ashamed', 'embarrassed', 'regretful', 'mortified', 'shameful',
    'remorseful', 'remorse', 'regret', 'sorry', 'self blaming', 'self reproachful',
    'contrite', 'penitent', 'compunctious',
  ],
  happy: [
    'happy', 'joy', 'delighted', 'jovial', 'pleased', 'satisfied', 'content', 'cheerful',
    'playful', 'amused', 'excited', 'enthusiastic', 'zealous', 'eager', 'stimulated',
    'energized', 'euphoric', 'jubilant', 'elated', 'enchanted', 'rapturous', 'enthralled',
    'glad', 'joyful', 'radiant', 'buoyant', 'sparkly', 'upbeat', 'lively', 'sunny',
    'gleeful', 'thrilled', 'merry', 'blissful', 'chipper', 'festive',
  ],
  hopeful: [
    'hopeful', 'optimistic', 'proud', 'illustrious', 'triumphant', 'encouraged',
    'promising', 'looking forward', 'possibility', 'expectant', 'aspiring', 'bullish',
    'high hopes', 'assured', 'positive minded', 'confident about', 'buoyed', 'heartened',
  ],
  hungry: [
    'hungry', 'starving', 'famished', 'peckish', 'craving', 'ravenous', 'underfed',
    'snacky', 'ready to eat', 'empty stomached', 'in need of food',
  ],
  jealous: [
    'jealous', 'envious', 'jealousy', 'envy', 'covetous', 'possessive', 'territorial',
    'green eyed', 'green with envy', 'begrudging', 'coveting',
  ],
  lonely: [
    'lonely', 'isolated', 'neglected', 'alone', 'disconnected', 'abandoned', 'left out',
    'homesick', 'unseen', 'unwanted', 'cast aside', 'outcast', 'adrift', 'solitary',
    'companionless',
  ],
  loving: [
    'affectionate', 'warmhearted', 'tender', 'compassionate', 'caring', 'sentimental',
    'moved', 'touched', 'romantic', 'passionate', 'enamored', 'warm hearted',
    'warm heart', 'gentle', 'kind', 'softhearted', 'flirty', 'smitten', 'in love',
    'adoring', 'devoted', 'fond', 'cherishing', 'nurturing', 'doting', 'sweet on',
    'caressing', 'heartful',
  ],
  numb: [
    'numb', 'meh', 'blah', 'flat', 'empty', 'blank', 'hollow', 'vacant', 'detached',
    'checked out', 'shut down', 'emotionless', 'deadened', 'unfeeling', 'dulled',
    'disengaged', 'blunted', 'muted',
  ],
  sad: [
    'sad', 'unhappy', 'gloomy', 'hopeless', 'depressed', 'miserable', 'dismayed',
    'displeased', 'disappointed', 'disillusioned', 'disheartened', 'hurt', 'disturbed',
    'pain', 'hurting', 'heartbroken', 'blue', 'low', 'grieving', 'sorrowful', 'destroyed',
    'dumb', 'stupid', 'idiot', 'fool', 'worthless', 'downcast', 'glum', 'melancholy',
    'crestfallen', 'bereft', 'forlorn', 'despondent', 'wounded', 'crushed', 'mournful',
    'woeful', 'heavyhearted',
  ],
  stressed: [
    'stressed', 'overwhelmed', 'overloaded', 'swamped', 'buried', 'burnt out', 'burned out',
    'burn out', 'loaded down', 'too much', 'frazzled', 'maxed out', 'stretched thin',
    'pressed', 'under pressure', 'snowed under', 'strained', 'at capacity', 'taxed',
  ],
  surprised: [
    'surprised', 'stunned', 'bewildered', 'shocked', 'startled', 'jolted', 'blindsided',
    'plot twist', 'unexpected', 'caught off guard', 'taken aback', 'thrown', 'jarred',
    'sideswiped', 'surprise struck', 'nonplussed',
  ],
  tired: [
    'tired', 'exhausted', 'drained', 'weary', 'fatigued', 'sleepy', 'spent', 'worn out',
    'burned', 'burntout', 'burnedout', 'drowsy', 'sluggish', 'listless', 'beat',
    'pooped', 'wiped out', 'knackered', 'droopy',
  ],
  unknown: [],
  wired: [
    'wired', 'antsy', 'restless', 'jittery', 'shaky', 'twitchy', 'amped', 'buzzing',
    'wired up', 'overcaffeinated', 'keyed up', 'pinging', 'revved up', 'humming',
    'overstimulated', 'amped up',
  ],
};

const SNAPSHOT_ALIAS_BUCKET_WORDS = {
  amazed: ['mind blown', 'full of wonder', 'in awe'],
  angry: ['ready to fight', 'seeing red', 'hot under the collar'],
  anxious: ['on edge', 'high strung', 'white knuckled', 'bracing'],
  awkward: ['ill at ease', 'socially off', 'cringey'],
  calm: ['at ease', 'at peace', 'cool headed', 'easygoing'],
  confused: ['all over the place', 'hard to place', 'not sure'],
  distracted: ['all over the map', 'can not focus', 'hard to focus'],
  disgusted: ['grossed out badly', 'completely grossed out'],
  frustrated: ['at my limit', 'ready to snap', 'getting nowhere'],
  grateful: ['full of thanks', 'counting blessings'],
  guilty: ['full of regret', 'beating myself up', 'carrying guilt'],
  happy: ['in good spirits', 'feeling good', 'on top of the world'],
  hopeful: ['glass half full', 'cautiously hopeful', 'good about this'],
  hungry: ['need food', 'need a snack', 'running on empty'],
  jealous: ['feeling possessive', 'feeling envious'],
  lonely: ['on my own', 'by myself', 'feeling left out'],
  loving: ['full of affection', 'full of love', 'soft for someone'],
  numb: ['nothing much', 'feeling nothing', 'kind of blank'],
  sad: ['feeling low', 'not okay', 'down in the dumps'],
  stressed: ['under strain', 'up to here', 'too much on my plate'],
  surprised: ['did not see that coming', 'out of nowhere', 'came from left field'],
  tired: ['out of gas', 'running on fumes', 'need sleep'],
  unknown: [],
  wired: ['full of static', 'too revved up', 'all buzzed up'],
};

export {
  SNAPSHOT_ALIAS_BUCKET_WORDS,
  SNAPSHOT_EXACT_BUCKET_WORDS,
  SYNONYM_SNAPSHOT_META,
};
