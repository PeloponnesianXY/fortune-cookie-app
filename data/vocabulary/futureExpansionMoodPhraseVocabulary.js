// Reserved multi-word mood phrases for future input expansion.
// The current app only accepts single-token runtime mood inputs.
// These phrases are kept separate so the live routing corpus stays aligned with current UX.
const FUTURE_EXPANSION_MOOD_PHRASE_VOCAB = {
  caring: [
    'warm heart',
    'warm hearted'
  ],
  wowed: [
    'in awe',
    'mind blown',
    'pleasantly surprised'
  ],
  angry: [
    'seeing red'
  ],
  anxious: [
    'high strung',
    'on edge',
    'white knuckled'
  ],
  embarrassed: [
    'less than',
    'second rate',
    'self conscious',
    'self consciousness',
    'socially awkward',
    'socially off'
  ],
  calm: [
    'at ease',
    'at peace',
    'cool headed'
  ],
  confident: [
    'self assured',
    'self trusting',
    'self-assured',
    'self-trusting'
  ],
  confused: [
    'not sure'
  ],
  disgusted: [
    'grossed out',
    'skeeved out'
  ],
  frustrated: [
    'fed up',
    'getting nowhere',
    'let down',
    'put out',
    'worked up'
  ],
  grateful: [
    'counting blessings'
  ],
  guilty: [
    'carrying guilt',
    'self blaming',
    'self reproachful'
  ],
  happy: [
    'feeling good'
  ],
  hopeful: [
    'cautiously hopeful',
    'confident about',
    'high hopes',
    'looking forward',
    'positive minded'
  ],
  proud: [
    'earned this',
    'feeling accomplished',
    'self respecting',
    'standing tall'
  ],
  hungry: [
    'need food'
  ],
  jealous: [
    'feeling envious',
    'feeling possessive',
    'green eyed'
  ],
  lonely: [
    'by myself',
    'cast aside',
    'left out'
  ],
  romantic: [
    'in love',
    'sweet on',
    'turned on'
  ],
  numb: [
    'checked out',
    'feeling nothing',
    'nothing much',
    'shut down'
  ],
  neutral: [
    'so so'
  ],
  sad: [
    'feeling low',
    'not okay'
  ],
  stressed: [
    'at capacity',
    'burn out',
    'burned out',
    'burnt out',
    'loaded down',
    'maxed out',
    'snowed under',
    'stretched thin',
    'too much',
    'under pressure',
    'under strain'
  ],
  shaken: [
    'surprise struck',
    'taken aback'
  ],
  tired: [
    'need sleep',
    'wiped out',
    'worn out'
  ],
  wired: [
    'amped up',
    'keyed up',
    'revved up',
    'wired up'
  ]
};

export { FUTURE_EXPANSION_MOOD_PHRASE_VOCAB };
