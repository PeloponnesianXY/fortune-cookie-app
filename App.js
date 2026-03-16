import React, { useRef, useState } from 'react';
import {
  Animated,
  useWindowDimensions,
  Easing,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const COOKIE_LEFT_IMAGE = require('./assets/cookie-left-4.png');
const COOKIE_RIGHT_IMAGE = require('./assets/cookie-right-4.png');
const COOKIE_SINGLE_IMAGE = require('./assets/single-cookie-3.png');
// Drop in a transparent animated WebP/APNG here later and switch the render mode to "animated".
const COOKIE_SHELL_RENDER_MODE = 'hybrid';
const COOKIE_ANIMATED_SHELL_SOURCE = null;
const COOKIE_SHELL_FRAME = {
  width: 236,
  height: 192,
};
const FORTUNE_FONT_FAMILY = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const FORTUNE_LIBRARY = {
  calm: [
    'Your calm is not boring. It is excellent strategy in a cute outfit.',
    'The quiet version of your brilliance is still very much the brilliance.',
    'A gentle pace will somehow beat the dramatic one again.',
    'You are allowed to treat peace like a skill, because it is.',
    'Your steady energy will make the noisy people seem very silly.',
    'Not rushing will turn out to be the flex.',
    'A calm mind is about to notice what chaos kept missing.',
    'Your grounded mood has excellent timing.',
    'Today rewards the person who does not panic for sport.',
    'Your nervous system would like a gold star and a snack.',
    'Staying centered is, in fact, a power move.',
    'Your softness today is giving quietly unbeatable energy.',
  ],
  happy: [
    'Your spark is loud in the best possible way, and it is pulling good things closer.',
    'This is peak main-character energy, so please act accordingly.',
    'Your joy is about to make ordinary timing feel suspiciously lucky.',
    'Something fun is more likely to happen because you walked in like this.',
    'Your excitement has excellent instincts, so follow it.',
    'The room is better because your energy entered it.',
    'Today wants to meet you at your level, which is very high and very cute.',
    'Your good mood is about to make one tiny thing feel huge in the best way.',
    'This bright version of you is attracting momentum.',
    'Your joy has the kind of timing people call lucky.',
    'Yes, lean into the excitement. It knows something.',
    'The universe is responding well to your current vibe.',
  ],
  stressed: [
    'You are protected from the lie that says everything must be solved at once.',
    'One small step will help you more than ten stressed spirals.',
    'Pressure is loud, but you are still the one in charge here.',
    'Be very kind to yourself. The day will go better that way.',
    'What feels urgent may look far less powerful after one slow breath.',
    'You are doing better than the stress is letting you believe.',
    'Today favors the protected heart, not the punished one.',
    'Set one burden down and watch your mind get smarter immediately.',
    'Gentleness will rescue more of this day than force will.',
    'Your job is not to carry all of it at the same time.',
    'Relief begins the minute you stop treating yourself like an emergency.',
    'You are allowed to handle this in the safest possible way.',
  ],
  sad: [
    'Your heart is allowed to be heavy and still be held with care.',
    'Nothing is wrong with the pace of your healing today.',
    'Be tender with yourself. That is the brave move now.',
    'This feeling does not get to define your whole story.',
    'Even a quiet day of surviving still counts as progress.',
    'You are not failing. You are feeling, and there is a difference.',
    'A softer day may be exactly what carries you through.',
    'Let kindness reach you before expectations do.',
    'Your sadness deserves warmth, not criticism.',
    'Something comforting is trying to find you, even now.',
    'The ache is real, and so is your ability to outlast it.',
    'Protect your heart today like it belongs to someone you love.',
  ],
  tired: [
    'Your battery icon is not a moral report card.',
    'Today may be powered by snacks, lower standards, and charm.',
    'A strategic amount of doing less will look weirdly genius.',
    'Low energy is not failure. It is just deeply unglamorous information.',
    'You are still impressive, just on energy-saving mode.',
    'A slower plan is still a plan, and honestly a better one today.',
    'Protect your remaining energy like it is concert money.',
    'Your best move may be to stop pretending you are at one hundred percent.',
    'Rest is trying to flirt with you again.',
    'Being tired does not cancel your usefulness, only your patience for nonsense.',
    'A smaller to-do list is about to look very elegant on you.',
    'This is a good day for fewer things and better vibes.',
  ],
  anxious: [
    'You are safer than this feeling is making it seem.',
    'The next small step will protect you better than the next big worry.',
    'Not every alarm in your body is an instruction.',
    'Be very gentle with yourself until your thoughts stop sprinting.',
    'The future does not need to be solved before you can breathe.',
    'Your anxious mind deserves reassurance, not punishment.',
    'Come back to the next five minutes. They are much kinder than the whole future.',
    'You can trust yourself with what is real, not just what feels scary.',
    'You are allowed to move carefully and still call that brave.',
    'This wave will pass more gently if you stop fighting it alone in your head.',
    'There is more safety around you than anxiety is willing to admit.',
    'Let the kindest voice inside you answer first.',
  ],
  hopeful: [
    'Your hope has excellent taste and strong timing.',
    'This bright little instinct in you is worth following fast.',
    'Something is shifting, and your hope noticed first.',
    'Yes, keep believing a little harder today.',
    'Your optimism is not random. It is picking up a signal.',
    'Good momentum loves to meet someone who still believes.',
    'The version of you that wants to keep going is onto something.',
    'Your hopeful energy is opening the room before you even walk in.',
    'This could absolutely be the start of a better stretch.',
    'Your future likes the way you are showing up to it today.',
    'A little more trust in yourself will go a long way right now.',
    'The good thing may be closer than your caution thinks.',
  ],
  focused: [
    'Your focus is hot right now, so point it at something worthy.',
    'This is the kind of energy that gets real things done fast.',
    'Your attention is sharp, and today it is going to pay you back.',
    'The important thing is about to get very lucky that you showed up like this.',
    'Momentum is already looking for you.',
    'Your concentration has entered the chat and it means business.',
    'This clear-headed version of you is extremely powerful.',
    'Keep your eyes on the real thing and let the rest be background noise.',
    'Today rewards the person who stays locked in and a little bit unstoppable.',
    'Your discipline is about to make something look easy.',
    'You are one focused stretch away from feeling very proud of yourself.',
    'Your energy knows exactly where it wants to go today.',
  ],
  grateful: [
    'Your gratitude is amplifying the good stuff like a very stylish spotlight.',
    'What you appreciate today is about to feel even bigger.',
    'Your thankful heart has excellent luck.',
    'Noticing what is good is turning into momentum now.',
    'Your appreciation is giving the whole day extra voltage.',
    'Gratitude looks extremely powerful on you today.',
    'The good thing you noticed is only getting better from here.',
    'Your heart is tuned to abundance today, and it is paying off.',
    'The more you savor this, the more alive the day gets.',
    'Your thankfulness is changing the atmosphere around you in real time.',
    'This warm, bright feeling is about to attract more of itself.',
    'Today favors the person who notices the blessing and means it.',
  ],
  lonely: [
    'Loneliness is not proof that you are hard to reach or hard to love.',
    'Be extra kind to yourself until closeness finds its way back in.',
    'This quiet feeling does not get to tell the whole story about your life.',
    'Wanting connection is a tender thing, not an embarrassing one.',
    'You are still deeply worth showing up for today.',
    'Protect your heart from the lie that says distance means unworthiness.',
    'Even a lonely day cannot erase your place in other people\'s care.',
    'Let this be a day of gentle reaching, especially toward yourself.',
    'A softer moment of connection may be closer than it feels.',
    'Your heart is asking for warmth, and that is an honorable request.',
    'This ache will not be the final word on belonging.',
    'You are not outside of love just because today feels quiet.',
  ],
  angry: [
    'Your anger is trying to protect something real, so handle it like something valuable.',
    'You do not need to explode to prove your point.',
    'Hold onto your power. Do not spend it all in one hot moment.',
    'A clear boundary will serve you better than a dramatic reaction.',
    'What upset you matters, and you can answer it without losing yourself.',
    'Let the heat cool just enough for your wisdom to catch up.',
    'Protect your peace first, then decide what deserves your energy.',
    'Your anger can become clarity if you treat it carefully.',
    'Strength today looks like precision, not destruction.',
    'The most powerful move may be the one you make after the fire settles.',
    'You are allowed to be fierce and still be kind to yourself.',
    'This feeling is asking for protection, not chaos.',
  ],
  romantic: [
    'Your heart is glowing a little, and it looks fantastic on you.',
    'A sincere little gesture is about to hit way harder than a grand one.',
    'Your softer side has very good romantic timing today.',
    'This is excellent weather for honest affection.',
    'A sweet moment is more available than it seems.',
    'Your tenderness is magnetic right now.',
    'Today rewards the person willing to be just a little more open.',
    'Love likes your current energy very much.',
    'If your heart wants to say something honest, let it.',
    'Your warmth is doing more than you realize.',
    'The little spark is real, so treat it like it matters.',
    'Something simple and genuine could feel kind of magical today.',
  ],
  confident: [
    'Your confidence is correctly calibrated and ready for something bold.',
    'Walk into the day like it has been expecting you.',
    'This is not the moment to shrink.',
    'Your self-trust is about to make something easier than usual.',
    'You are more ready than the timid version of you keeps claiming.',
    'Your energy says yes before doubt gets a turn.',
    'Today likes the version of you that takes up space.',
    'The room will adjust. Go ahead and be solid.',
    'Back yourself first and watch the rest follow.',
    'This is very good timing for believing in yourself out loud.',
    'Your certainty is making the path look clearer already.',
    'Confidence is not too much today. It is exactly enough.',
  ],
  confused: [
    'Confusion is annoying, but it is not the same thing as doom.',
    'The map is blurry, so today we are navigating by vibes and one sensible step.',
    'You do not need a full life thesis by lunchtime.',
    'Clarity may arrive fashionably late, so start without it.',
    'Being puzzled is not a character defect, just deeply inconvenient.',
    'One true next step will outperform twenty dramatic guesses.',
    'Your brain may be tangled, but your next move can still be simple.',
    'Uncertainty is rude, but survivable.',
    'Stop interrogating yourself like a suspect and take one kind next step.',
    'This will make more sense after motion, not before.',
    'Even a confused little walk forward still counts as forward.',
    'Today does not require perfect clarity, only decent instincts.',
  ],
  mysterious: [
    'A feeling without a name may be carrying a message that prefers dim lighting.',
    'Today\'s mood arrives in smoke and symbols; let it keep a little of its privacy.',
    'What refuses a label may still know exactly where it is leading you.',
    'The unreadable feeling is not empty. It is simply not explaining itself yet.',
    'Something quiet and strange is moving under the surface, and it may be wiser than it looks.',
    'The unnamed mood has chosen intrigue over clarity, which is admittedly powerful.',
    'Not every feeling wants to be translated before it is trusted.',
    'A little mystery around the heart can still point toward truth.',
    'What feels inscrutable now may reveal itself only after you stop interrogating it.',
    'Some moods arrive like riddles because direct language would be too easy.',
    'Your inner weather appears to be written in moonlight and subtext today.',
    'The unclassifiable feeling may be less lost than it is quietly unfolding.',
  ],
  unknown: [
    'Your mood may be a mystery, but luckily you are still allowed snacks and tenderness.',
    'Not everything needs a perfect label to be handled wisely.',
    'A mixed vibe is still, in fact, a vibe.',
    'Today may be emotionally abstract, and that is somehow fine.',
    'You are allowed to be hard to categorize and still very valid.',
    'The feeling may be blurry, but the next kind move is not.',
    'Some moods are just jazz, not spreadsheets.',
    'Uncertainty can still be navigated with a little humor and decent instincts.',
    'Undefined does not mean unimportant.',
    'Your emotional weather report may be chaos with a chance of insight.',
    'It is okay if the feeling is weird. You are still allowed to work with it.',
    'When in doubt, choose the kinder interpretation and a glass of water.',
  ],
};

const MOOD_TAXONOMY = {
  calm: [
    'calm', 'peaceful', 'steady', 'balanced', 'fine', 'relaxed', 'content', 'centered',
    'grounded', 'okay', 'at ease', 'peace', 'serene', 'tranquil', 'settled', 'mellow',
    'soft', 'safe',
  ],
  happy: [
    'happy', 'great', 'good', 'joy', 'excited', 'grateful', 'cheerful', 'delighted',
    'upbeat', 'amazing', 'thrilled', 'glad', 'effervescent', 'buoyant', 'sunny',
    'playful', 'lighthearted', 'elated', 'gleeful', 'giddy', 'sparkly',
  ],
  stressed: [
    'stress', 'stressed', 'overwhelmed', 'burned', 'pressure', 'busy', 'frazzled',
    'swamped', 'tense', 'burnout', 'stretched', 'chaotic', 'strained', 'buried',
    'underwater', 'under pressure', 'maxed out', 'upset', 'frayed', 'off',
  ],
  sad: [
    'sad', 'down', 'blue', 'lonely', 'hurt', 'grief', 'heartbroken', 'heavy',
    'empty', 'low', 'depressed', 'melancholy', 'sorrowful', 'gloomy', 'tearful',
    'wistful', 'fragile', 'raw', 'numb',
  ],
  tired: [
    'tired', 'drained', 'sleepy', 'exhausted', 'fatigue', 'worn out', 'wiped', 'beat',
    'low energy', 'burnt out', 'drowsy', 'spent', 'weary', 'sluggish', 'running on empty',
  ],
  anxious: [
    'anxious', 'anxiety', 'nervous', 'worried', 'afraid', 'panicked', 'uneasy',
    'on edge', 'fearful', 'restless', 'spiraling', 'scared', 'fraught', 'jittery',
    'apprehensive', 'antsy',
  ],
  hopeful: [
    'hopeful', 'optimistic', 'ready', 'motivated', 'open', 'encouraged', 'inspired',
    'positive', 'looking forward', 'expectant', 'ambitious', 'dreaming', 'aspiring',
    'promising', 'possibility',
  ],
  focused: [
    'focused', 'productive', 'determined', 'locked in', 'clear', 'dialed in',
    'intentional', 'driven', 'sharp', 'disciplined', 'in the zone', 'concentrated',
    'committed', 'resolved',
  ],
  grateful: [
    'grateful', 'thankful', 'appreciative', 'blessed', 'fortunate', 'moved', 'touched',
    'appreciating',
  ],
  lonely: [
    'lonely', 'isolated', 'alone', 'disconnected', 'left out', 'unseen', 'abandoned',
    'apart',
  ],
  angry: [
    'angry', 'mad', 'furious', 'annoyed', 'irritated', 'resentful', 'frustrated',
    'outraged', 'bitter', 'agitated', 'pissed', 'heated',
  ],
  romantic: [
    'romantic', 'loving', 'flirty', 'smitten', 'affectionate', 'in love', 'tender',
    'adoring', 'infatuated',
  ],
  confident: [
    'confident', 'bold', 'assured', 'capable', 'strong', 'empowered', 'fearless',
    'self-assured', 'certain',
  ],
  confused: [
    'confused', 'unsure', 'uncertain', 'lost', 'torn', 'mixed up', 'puzzled', 'unclear',
    'conflicted', 'disoriented',
  ],
  unknown: [
    'bored', 'blah', 'meh', 'whatever', 'indifferent', 'blank', 'so so', 'mixed',
    'neutral', 'fine i guess',
  ],
};

const MOOD_FALLBACKS = {
  grateful: 'happy',
  lonely: 'sad',
  angry: 'stressed',
  romantic: 'hopeful',
  confident: 'focused',
  confused: 'unknown',
};

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

const MOOD_PROFILES = {
  calm: { tone: 'grounding', valence: 'positive', energy: 'low' },
  happy: { tone: 'uplifting', valence: 'positive', energy: 'high' },
  stressed: { tone: 'grounding', valence: 'negative', energy: 'high' },
  sad: { tone: 'comforting', valence: 'negative', energy: 'low' },
  tired: { tone: 'restorative', valence: 'neutral', energy: 'low' },
  anxious: { tone: 'reassuring', valence: 'negative', energy: 'high' },
  hopeful: { tone: 'encouraging', valence: 'positive', energy: 'medium' },
  focused: { tone: 'energizing', valence: 'positive', energy: 'medium' },
  grateful: { tone: 'uplifting', valence: 'positive', energy: 'medium' },
  lonely: { tone: 'comforting', valence: 'negative', energy: 'low' },
  angry: { tone: 'grounding', valence: 'negative', energy: 'high' },
  romantic: { tone: 'gentle', valence: 'positive', energy: 'medium' },
  confident: { tone: 'energizing', valence: 'positive', energy: 'high' },
  confused: { tone: 'guiding', valence: 'neutral', energy: 'medium' },
  unknown: { tone: 'general', valence: 'neutral', energy: 'medium' },
};

const COMBO_FORTUNES = {
  'anxious|hopeful': [
    'Fear and hope can share a room; let hope choose the seat nearest the door.',
    'You do not need to stop trembling before you keep moving forward.',
    'A nervous heart can still be pointing toward something worth trusting.',
    'The future may feel loud, but your hope is already answering back.',
  ],
  'sad|hopeful': [
    'A heavy day can still carry a living spark inside it.',
    'Grief and hope are not opposites when both are telling the truth.',
    'Something gentle may grow here even if the ground still feels tender.',
    'The light ahead does not erase the ache; it simply means the ache is not alone.',
  ],
  'stressed|tired': [
    'Today asks for one honest task and one honest pause.',
    'You do not need more force; you need a gentler strategy.',
    'A tired mind under pressure is asking for mercy before brilliance.',
    'Restoring your energy may be the most productive choice available.',
  ],
  'tired|focused': [
    'Protect your energy and spend it only where it truly matters today.',
    'A slow, precise effort may outperform a fast, exhausted one.',
    'Your focus will serve you best when it is paired with restraint.',
    'Choose the essential task and let that be enough for now.',
  ],
  'happy|grateful': [
    'Joy deepens when it pauses long enough to notice what made it possible.',
    'What delights you today may become even brighter when you honor it.',
    'A grateful heart gives happiness somewhere lasting to land.',
    'Today\'s sweetness may grow simply because you stopped to savor it.',
  ],
  'angry|confident': [
    'Your strongest move today may be a clear boundary delivered without heat.',
    'Certainty becomes powerful when it does not need to shout.',
    'What angers you may be pointing toward the standard you are ready to defend.',
    'Stand firm, then choose the response you can still respect tomorrow.',
  ],
  'confused|hopeful': [
    'You do not need the whole map to trust the next promising turn.',
    'A hopeful step can clarify what thinking alone cannot.',
    'The answer may begin as direction before it becomes certainty.',
    'Stay open; the next useful clue may arrive once you start moving.',
  ],
  'lonely|romantic': [
    'The heart that longs deeply also recognizes warmth more quickly when it comes.',
    'What feels far away now may answer a quiet invitation sooner than expected.',
    'Tenderness often arrives first as a small sign worth noticing.',
    'Leave a little room today for affection to find you honestly.',
  ],
};

const TONE_FORTUNES = {
  grounding: FORTUNE_LIBRARY.calm,
  uplifting: FORTUNE_LIBRARY.happy,
  comforting: FORTUNE_LIBRARY.sad,
  restorative: FORTUNE_LIBRARY.tired,
  reassuring: FORTUNE_LIBRARY.anxious,
  encouraging: FORTUNE_LIBRARY.hopeful,
  energizing: FORTUNE_LIBRARY.focused,
  gentle: FORTUNE_LIBRARY.romantic,
  guiding: FORTUNE_LIBRARY.confused,
  general: FORTUNE_LIBRARY.unknown,
};

const BLOCKED_INPUT_FORTUNE =
  'A kinder fortune waits when the mood is named without turning anyone into a target.';

function moderateMoodInput(input) {
  const normalized = input.trim().toLowerCase();
  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);

  const hasBlockedHateTerm = BLOCKED_HATE_TERMS.some((term) => (
    term.includes(' ') ? normalized.includes(term) : tokens.includes(term)
  ));
  const hasBlockedPattern = HATE_PATTERNS.some((pattern) => pattern.test(normalized));
  const hasTargetedGroupPhrase = PROTECTED_GROUP_TERMS.some((term) => normalized.includes(term))
    && /\b(hate|against|inferior|disgusting|gross|evil|vermin|animals|suck|stink|trash|awful|horrible)\b/.test(normalized);

  if (hasBlockedHateTerm || hasBlockedPattern || hasTargetedGroupPhrase) {
    return {
      moderation: 'blocked-hate',
      sanitizedInput: '',
    };
  }

  return {
    moderation: 'clean',
    sanitizedInput: normalized,
  };
}

const BASE_SCENE = {
  textPrimary: '#3d2c20',
  textSecondary: '#6a5544',
  accent: '#8d5f3d',
  accentSoft: '#b07b55',
  panel: 'rgba(255, 248, 240, 0.78)',
  panelBorder: 'rgba(148, 110, 83, 0.14)',
  input: 'rgba(255, 252, 247, 0.82)',
  inputBorder: 'rgba(150, 111, 82, 0.16)',
  paper: '#fffaf0',
  paperBorder: '#e5d7bc',
  paperTint: 'rgba(213, 194, 160, 0.18)',
  paperEdge: '#ecdfbc',
  stageAura: 'rgba(255, 235, 197, 0.42)',
  stageLine: 'rgba(255, 241, 218, 0.72)',
  cookieGlow: 'rgba(255, 225, 184, 0.34)',
  cue: '#6a503a',
  statusBar: 'dark',
  stars: [],
};

const SCENE_LIBRARY = {
  apricotMorning: {
    ...BASE_SCENE,
    sky: '#f5e6d5',
    wash: 'rgba(255, 244, 227, 0.82)',
    celestial: '#f8d79f',
    celestialHalo: 'rgba(255, 223, 168, 0.55)',
    cloud: 'rgba(255, 251, 243, 0.64)',
    cloudAlt: 'rgba(255, 244, 231, 0.58)',
    mist: 'rgba(255, 249, 241, 0.72)',
    ridgeBack: '#e1ba94',
    ridgeMid: '#c98e73',
    ridgeFront: '#8f6358',
    ridgeHighlight: 'rgba(255, 242, 214, 0.26)',
  },
  seashellCove: {
    ...BASE_SCENE,
    sky: '#ede3d8',
    wash: 'rgba(250, 244, 238, 0.82)',
    celestial: '#f4d3b1',
    celestialHalo: 'rgba(244, 211, 177, 0.52)',
    cloud: 'rgba(252, 250, 247, 0.62)',
    cloudAlt: 'rgba(247, 239, 228, 0.56)',
    mist: 'rgba(248, 242, 234, 0.72)',
    ridgeBack: '#cfc1b1',
    ridgeMid: '#b49582',
    ridgeFront: '#756059',
    ridgeHighlight: 'rgba(255, 245, 229, 0.22)',
  },
  goldenFields: {
    ...BASE_SCENE,
    sky: '#fae1be',
    wash: 'rgba(255, 238, 207, 0.8)',
    celestial: '#ffc56e',
    celestialHalo: 'rgba(255, 201, 123, 0.55)',
    cloud: 'rgba(255, 247, 228, 0.58)',
    cloudAlt: 'rgba(255, 238, 214, 0.52)',
    mist: 'rgba(255, 248, 232, 0.68)',
    ridgeBack: '#efbe7f',
    ridgeMid: '#cf855c',
    ridgeFront: '#92564a',
    ridgeHighlight: 'rgba(255, 239, 190, 0.24)',
    stageAura: 'rgba(255, 220, 163, 0.44)',
    cookieGlow: 'rgba(255, 208, 148, 0.38)',
  },
  roseLagoon: {
    ...BASE_SCENE,
    sky: '#f6ddd5',
    wash: 'rgba(255, 243, 237, 0.84)',
    celestial: '#f5bea7',
    celestialHalo: 'rgba(245, 190, 167, 0.5)',
    cloud: 'rgba(255, 248, 243, 0.62)',
    cloudAlt: 'rgba(252, 236, 231, 0.58)',
    mist: 'rgba(255, 245, 240, 0.72)',
    ridgeBack: '#dfb0a2',
    ridgeMid: '#b77971',
    ridgeFront: '#7d5552',
    ridgeHighlight: 'rgba(255, 234, 225, 0.22)',
  },
  lilacDusk: {
    ...BASE_SCENE,
    sky: '#ebe0e5',
    wash: 'rgba(247, 240, 245, 0.74)',
    celestial: '#f2d2bc',
    celestialHalo: 'rgba(242, 210, 188, 0.42)',
    cloud: 'rgba(252, 247, 250, 0.48)',
    cloudAlt: 'rgba(242, 232, 238, 0.42)',
    mist: 'rgba(246, 240, 244, 0.56)',
    ridgeBack: '#c8b5c1',
    ridgeMid: '#95738b',
    ridgeFront: '#59475a',
    ridgeHighlight: 'rgba(250, 240, 246, 0.18)',
    stageAura: 'rgba(234, 215, 226, 0.36)',
    cookieGlow: 'rgba(238, 210, 205, 0.24)',
  },
  moonlitDunes: {
    ...BASE_SCENE,
    sky: '#e8e1df',
    wash: 'rgba(244, 239, 236, 0.7)',
    celestial: '#f4efe6',
    celestialHalo: 'rgba(244, 239, 230, 0.34)',
    cloud: 'rgba(248, 245, 242, 0.46)',
    cloudAlt: 'rgba(240, 235, 233, 0.4)',
    mist: 'rgba(242, 238, 235, 0.52)',
    ridgeBack: '#c6bbb7',
    ridgeMid: '#96857f',
    ridgeFront: '#655554',
    ridgeHighlight: 'rgba(249, 242, 238, 0.16)',
    stageAura: 'rgba(233, 224, 214, 0.32)',
    cookieGlow: 'rgba(225, 210, 192, 0.22)',
    stars: [
      { top: 86, left: '16%', size: 5, opacity: 0.7 },
      { top: 124, left: '24%', size: 3, opacity: 0.56 },
      { top: 112, right: '18%', size: 4, opacity: 0.62 },
      { top: 168, right: '24%', size: 3, opacity: 0.44 },
      { top: 154, left: '12%', size: 2, opacity: 0.54 },
    ],
  },
};

const SCENE_GROUPS = {
  negative: ['lilacDusk', 'moonlitDunes'],
  neutral: ['apricotMorning', 'seashellCove'],
  positive: ['goldenFields', 'roseLagoon'],
};

function analyzeMoodInput(input) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return {
      primaryMood: 'unknown',
      secondaryMood: null,
      scores: {},
      source: 'empty',
    };
  }

  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);
  const scores = Object.keys(MOOD_TAXONOMY).reduce((accumulator, mood) => {
    accumulator[mood] = 0;
    return accumulator;
  }, {});

  for (const [mood, keywords] of Object.entries(MOOD_TAXONOMY)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        scores[mood] += keyword.includes(' ') ? 5 : 2;
      }

      for (const token of tokens) {
        if (token === keyword) {
          scores[mood] += 4;
        } else if (isSimilarWord(token, keyword)) {
          scores[mood] += 1;
        }
      }
    }
  }

  const rankedMoods = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (rankedMoods.length === 0) {
    const guessedMood = guessMoodFromTone(tokens);
    return {
      primaryMood: guessedMood,
      secondaryMood: null,
      scores,
      source: guessedMood === 'unknown' ? 'fallback-unknown' : 'fallback-tone',
    };
  }

  const [primaryMood, primaryScore] = rankedMoods[0];
  const secondaryEntry = rankedMoods.find(
    ([mood, score]) => mood !== primaryMood && score >= Math.max(2, primaryScore - 2)
  );

  return {
    primaryMood,
    secondaryMood: secondaryEntry ? secondaryEntry[0] : null,
    scores,
    source: 'taxonomy',
  };
}

function isSimilarWord(inputWord, keyword) {
  if (inputWord.length < 4 || keyword.includes(' ')) {
    return false;
  }

  if (inputWord[0] !== keyword[0]) {
    return false;
  }

  const distance = levenshteinDistance(inputWord, keyword);
  return distance <= 2 && Math.abs(inputWord.length - keyword.length) <= 2;
}

function guessMoodFromTone(tokens) {
  const positiveEndings = ['ful', 'ous', 'ant', 'ent', 'ive'];
  const softWords = ['tender', 'gentle', 'soft', 'open'];
  const brightWords = ['effervescent', 'buoyant', 'sparkly', 'radiant'];
  const sharpWords = ['fraught', 'combative', 'heated'];
  const foggyWords = ['murky', 'foggy', 'unclear', 'jumbled'];
  const flatWords = ['bored', 'meh', 'blah', 'neutral', 'whatever'];

  if (tokens.some((token) => softWords.includes(token))) {
    return 'calm';
  }

  if (tokens.some((token) => brightWords.includes(token))) {
    return 'happy';
  }

  if (tokens.some((token) => sharpWords.includes(token))) {
    return 'stressed';
  }

  if (tokens.some((token) => foggyWords.includes(token))) {
    return 'confused';
  }

  if (tokens.some((token) => flatWords.includes(token))) {
    return 'unknown';
  }

  if (tokens.some((token) => positiveEndings.some((ending) => token.endsWith(ending)))) {
    return 'hopeful';
  }

  return 'unknown';
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function buildFortunePool(analysis) {
  if (analysis.source === 'fallback-unknown') {
    return FORTUNE_LIBRARY.mysterious;
  }

  const { primaryMood, secondaryMood } = analysis;
  const moodPair = [primaryMood, secondaryMood].filter(Boolean).sort().join('|');

  if (moodPair && COMBO_FORTUNES[moodPair]) {
    return COMBO_FORTUNES[moodPair];
  }

  if (FORTUNE_LIBRARY[primaryMood]) {
    return FORTUNE_LIBRARY[primaryMood];
  }

  const fallbackMood = MOOD_FALLBACKS[primaryMood];
  if (fallbackMood && FORTUNE_LIBRARY[fallbackMood]) {
    return FORTUNE_LIBRARY[fallbackMood];
  }

  const profile = MOOD_PROFILES[primaryMood] || MOOD_PROFILES.unknown;
  return TONE_FORTUNES[profile.tone] || FORTUNE_LIBRARY.unknown;
}

function pickFortuneForAnalysis(analysis, recentFortunes) {
  const pool = buildFortunePool(analysis);
  const availableFortunes = pool.filter((fortune) => !recentFortunes.includes(fortune));
  const candidatePool = availableFortunes.length > 0 ? availableFortunes : pool;
  return candidatePool[Math.floor(Math.random() * candidatePool.length)];
}

function resolveSceneGroup(valence) {
  if (valence === 'negative') {
    return SCENE_GROUPS.negative;
  }

  if (valence === 'positive') {
    return SCENE_GROUPS.positive;
  }

  return SCENE_GROUPS.neutral;
}

function pickNextSceneKey(analysis, currentSceneKey, turnCount) {
  const profile = MOOD_PROFILES[analysis.primaryMood] || MOOD_PROFILES.unknown;
  const sceneGroup = resolveSceneGroup(profile.valence);
  const currentIndex = sceneGroup.indexOf(currentSceneKey);

  if (currentIndex >= 0) {
    return sceneGroup[(currentIndex + 1) % sceneGroup.length];
  }

  return sceneGroup[turnCount % sceneGroup.length];
}

function SceneBackdrop({ scene }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.sceneWash, { backgroundColor: scene.wash }]} />
      <View style={[styles.celestialHalo, { backgroundColor: scene.celestialHalo }]} />
      <View style={[styles.celestialDisc, { backgroundColor: scene.celestial }]} />
      <View style={[styles.cloud, styles.cloudOne, { backgroundColor: scene.cloud }]} />
      <View style={[styles.cloud, styles.cloudTwo, { backgroundColor: scene.cloudAlt }]} />
      {scene.stars.map((star, index) => (
        <View
          key={`${star.top}-${index}`}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              right: star.right,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
      <View style={[styles.ridgeBack, { backgroundColor: scene.ridgeBack }]} />
      <View style={[styles.ridgeMid, { backgroundColor: scene.ridgeMid }]} />
      <View style={[styles.ridgeFront, { backgroundColor: scene.ridgeFront }]} />
      <View style={[styles.ridgeHighlight, { backgroundColor: scene.ridgeHighlight }]} />
      <View style={[styles.sceneMist, { backgroundColor: scene.mist }]} />
    </View>
  );
}

function CookieShell({ shellProgress }) {
  const closedShellOpacity = shellProgress.interpolate({
    inputRange: [0, 0.08, 0.18, 1],
    outputRange: [1, 1, 0, 0],
  });

  const closedCookieStyle = {
    opacity: closedShellOpacity,
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 0.12, 1],
          outputRange: [1, 0.985, 0.96],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
      },
    ],
  };

  const leftCookieStyle = {
    transform: [
      {
        translateX: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -30],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -18],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-24deg'],
        }),
      },
    ],
  };

  const rightCookieStyle = {
    transform: [
      {
        translateX: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 26],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '18deg'],
        }),
      },
    ],
  };

  if (COOKIE_SHELL_RENDER_MODE === 'animated' && COOKIE_ANIMATED_SHELL_SOURCE) {
    const animatedShellStyle = {
      opacity: shellProgress.interpolate({
        inputRange: [0, 0.08, 1],
        outputRange: [1, 1, 0],
      }),
      transform: [
        {
          scale: shellProgress.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [1, 0.985, 1],
          }),
        },
      ],
    };

    return (
      <Animated.Image
        resizeMode="contain"
        source={COOKIE_ANIMATED_SHELL_SOURCE}
        style={[
          styles.cookieAnimatedShell,
          animatedShellStyle,
        ]}
      />
    );
  }

  if (COOKIE_SHELL_RENDER_MODE === 'hybrid') {
    const splitShellStyle = {
      opacity: shellProgress.interpolate({
        inputRange: [0, 0.08, 0.18, 1],
        outputRange: [0, 0, 1, 1],
      }),
    };

    return (
      <View style={styles.cookieHybridShell}>
        <Animated.Image
          resizeMode="contain"
          source={COOKIE_SINGLE_IMAGE}
          style={[styles.cookieClosedShell, closedCookieStyle]}
        />

        <Animated.View style={[styles.cookieSplitShell, splitShellStyle]}>
          <Animated.View style={[styles.cookieHalfFrame, styles.cookieLeftFrame, leftCookieStyle]}>
            <Image source={COOKIE_LEFT_IMAGE} style={styles.cookieLeftImage} resizeMode="contain" />
          </Animated.View>
          <Animated.View style={[styles.cookieHalfFrame, styles.cookieRightFrame, rightCookieStyle]}>
            <Image source={COOKIE_RIGHT_IMAGE} style={styles.cookieRightImage} resizeMode="contain" />
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  if (COOKIE_SHELL_RENDER_MODE === 'illustrated') {
    const centerFoldStyle = {
      opacity: shellProgress.interpolate({
        inputRange: [0, 0.22, 1],
        outputRange: [0.92, 0.66, 0],
      }),
      transform: [
        {
          translateY: shellProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10],
          }),
        },
        {
          scaleY: shellProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.72],
          }),
        },
      ],
    };

    return (
      <View style={styles.cookieIllustratedShell}>
        <Animated.View style={[styles.cookieCenterFold, centerFoldStyle]} />

        <Animated.View style={[styles.cookieHalfFrame, styles.cookieLeftFrame, leftCookieStyle]}>
          <View style={[styles.cookieHalfIllustration, styles.cookieHalfIllustrationLeft]}>
            <View style={styles.cookieHalfBody} />
            <View style={styles.cookieHalfRim} />
            <View style={[styles.cookieHalfHighlight, styles.cookieHalfHighlightLeft]} />
            <View style={[styles.cookieHalfShadow, styles.cookieHalfShadowLeft]} />
            <View style={[styles.cookieHalfPocket, styles.cookieHalfPocketLeft]} />
            <View style={[styles.cookieHalfCrease, styles.cookieHalfCreaseLeft]} />
            <View style={[styles.cookieHalfBase, styles.cookieHalfBaseLeft]} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.cookieHalfFrame, styles.cookieRightFrame, rightCookieStyle]}>
          <View style={[styles.cookieHalfIllustration, styles.cookieHalfIllustrationRight]}>
            <View style={styles.cookieHalfBody} />
            <View style={styles.cookieHalfRim} />
            <View style={[styles.cookieHalfHighlight, styles.cookieHalfHighlightRight]} />
            <View style={[styles.cookieHalfShadow, styles.cookieHalfShadowRight]} />
            <View style={[styles.cookieHalfPocket, styles.cookieHalfPocketRight]} />
            <View style={[styles.cookieHalfCrease, styles.cookieHalfCreaseRight]} />
            <View style={[styles.cookieHalfBase, styles.cookieHalfBaseRight]} />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.cookieSplitShell}>
      <Animated.View style={[styles.cookieHalfFrame, styles.cookieLeftFrame, leftCookieStyle]}>
        <Image source={COOKIE_LEFT_IMAGE} style={styles.cookieLeftImage} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.cookieHalfFrame, styles.cookieRightFrame, rightCookieStyle]}>
        <Image source={COOKIE_RIGHT_IMAGE} style={styles.cookieRightImage} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

function FortuneCookieButton({
  disabled,
  fortuneText,
  isAnimating,
  onPress,
  paperProgress,
  scene,
  shellProgress,
  sparkleProgress,
}) {
  const paperStyle = {
    opacity: paperProgress,
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [32, -168],
        }),
      },
      {
        scale: paperProgress.interpolate({
          inputRange: [0, 0.74, 1],
          outputRange: [0.74, 0.92, 1],
        }),
      },
      {
        rotate: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['3deg', '-1.6deg'],
        }),
      },
    ],
  };

  const burstStyle = {
    opacity: sparkleProgress,
    transform: [
      {
        scale: sparkleProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1.15],
        }),
      },
    ],
  };

  const cookieGlowStyle = {
    opacity: shellProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.16, 0.32],
    }),
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1.06],
        }),
      },
    ],
  };

  const paperGlowStyle = {
    opacity: paperProgress.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0.18, 0.08],
    }),
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -92],
        }),
      },
      {
        scaleY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1.18],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      activeOpacity={0.94}
      disabled={disabled}
      onPress={onPress}
      style={styles.cookieTapArea}
    >
      <View style={styles.cookieStage}>
        <Animated.View
          style={[
            styles.paperGlow,
            paperGlowStyle,
            { backgroundColor: scene.stageAura },
          ]}
        />

        <Animated.View style={[styles.sparkleBurst, burstStyle]}>
          <View style={[styles.sparkleDot, styles.sparkleTop]} />
          <View style={[styles.sparkleDot, styles.sparkleLeft]} />
          <View style={[styles.sparkleDot, styles.sparkleRight]} />
          <View style={[styles.sparkleDot, styles.sparkleBottom]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.fortuneSlip,
            paperStyle,
            {
              backgroundColor: scene.paper,
              borderColor: scene.paperBorder,
              shadowColor: scene.ridgeFront,
            },
          ]}
        >
          <View style={[styles.fortuneSlipTopRule, { backgroundColor: scene.paperEdge }]} />
          <View style={[styles.fortuneSlipBottomRule, { backgroundColor: scene.paperTint }]} />
          <View style={[styles.fortuneSlipInnerGlow, { backgroundColor: scene.paperTint }]} />
          <View style={[styles.fortunePaperCurlLeft, { backgroundColor: scene.paperTint }]} />
          <View style={[styles.fortunePaperCurlRight, { backgroundColor: scene.paperTint }]} />
          <View style={[styles.fortuneSlipEdge, { backgroundColor: scene.paperEdge }]} />
          <View style={[styles.fortunePaperCrease, { backgroundColor: scene.paperTint }]} />
          <Text style={[styles.fortuneSlipText, { color: scene.textPrimary }]}>
            {fortuneText || 'Tap the cookie to reveal a fortune.'}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cookieGlow,
            cookieGlowStyle,
            { backgroundColor: scene.cookieGlow },
          ]}
        />

        <View style={[styles.cookieNest, { backgroundColor: scene.stageLine }]} />

        <View style={styles.cookieImageFrame}>
          <CookieShell shellProgress={shellProgress} />
        </View>

        <View style={styles.cookieShadow} />
      </View>

      <View style={styles.cookieCuePill}>
        <Text style={[styles.cookieCueText, { color: scene.cue }]}>
          {isAnimating ? 'Opening...' : 'Ready for your fortune?'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  const { height: viewportHeight } = useWindowDimensions();
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [recentFortunes, setRecentFortunes] = useState([]);
  const [sceneKey, setSceneKey] = useState('apricotMorning');
  const [statusMessage, setStatusMessage] = useState(
    'Development mode: new fortune every tap.'
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const sparkleProgress = useRef(new Animated.Value(0)).current;

  const scene = SCENE_LIBRARY[sceneKey] || SCENE_LIBRARY.apricotMorning;
  const stageMinHeight = Math.max(Math.round(viewportHeight * 0.74), 540);
  const stageTopPadding = Math.max(Math.round(viewportHeight * 0.18), 110);
  const stageBottomPadding = Math.max(Math.round(viewportHeight * 0.08), 48);
  const inputBottomGap = Math.max(Math.round(viewportHeight * 0.08), 34);

  function runCookieAnimation(nextFortune, analysis, nextSceneKey) {
    setFortuneText(nextFortune);
    setAnalysisSummary(analysis);
    setSceneKey(nextSceneKey);
    setIsAnimating(true);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
    sparkleProgress.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(shellProgress, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleProgress, {
          toValue: 1,
          duration: 230,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(paperProgress, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.back(0.8)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      setStatusMessage('Development mode: tap again for another fortune.');
    });
  }

  function openFortune() {
    if (isAnimating) {
      return;
    }

    const moderationResult = moderateMoodInput(moodInput);

    if (moderationResult.moderation === 'blocked-hate') {
      const blockedAnalysis = {
        primaryMood: 'unknown',
        secondaryMood: null,
        scores: {},
        source: 'blocked-hate',
      };
      setStatusMessage(
        'Try naming your mood without targeting a group of people.'
      );
      runCookieAnimation(BLOCKED_INPUT_FORTUNE, blockedAnalysis, 'moonlitDunes');
      return;
    }

    const analysis = analyzeMoodInput(moderationResult.sanitizedInput);
    const fortune = pickFortuneForAnalysis(analysis, recentFortunes);
    const nextSceneKey = pickNextSceneKey(analysis, sceneKey, recentFortunes.length);
    setRecentFortunes((current) => [fortune, ...current].slice(0, 8));
    runCookieAnimation(fortune, analysis, nextSceneKey);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: scene.sky }]}>
      <ExpoStatusBar style={scene.statusBar} />
      <StatusBar barStyle={scene.statusBar === 'light' ? 'light-content' : 'dark-content'} />

      <View style={[styles.screen, { backgroundColor: scene.sky }]}>
        <SceneBackdrop scene={scene} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.landscapeStage,
              {
                minHeight: stageMinHeight,
                paddingTop: stageTopPadding,
                paddingBottom: stageBottomPadding,
              },
            ]}
          >
            <View
              style={[
                styles.inputFloat,
                {
                  backgroundColor: scene.panel,
                  borderColor: scene.panelBorder,
                  marginBottom: inputBottomGap,
                },
              ]}
            >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setMoodInput}
                placeholder="How are you feeling?"
                placeholderTextColor={scene.accentSoft}
                style={[
                  styles.input,
                  {
                    backgroundColor: scene.input,
                    borderColor: scene.inputBorder,
                    color: scene.textPrimary,
                  },
                ]}
                value={moodInput}
              />
            </View>

            <View style={[styles.stageAuraPool, { backgroundColor: scene.stageAura }]} />
            <View style={[styles.stageHaze, { backgroundColor: scene.mist }]} />
            <FortuneCookieButton
              disabled={isAnimating}
              fortuneText={fortuneText}
              isAnimating={isAnimating}
              onPress={openFortune}
              paperProgress={paperProgress}
              scene={scene}
              shellProgress={shellProgress}
              sparkleProgress={sparkleProgress}
            />
          </View>

          <View style={styles.footerStack}>
            {analysisSummary ? (
              <View
                style={[
                  styles.devChip,
                  {
                    backgroundColor: scene.input,
                    borderColor: scene.inputBorder,
                  },
                ]}
              >
                <Text style={[styles.devMoodText, { color: scene.cue }]}>
                  Detected: {analysisSummary.primaryMood}
                  {analysisSummary.secondaryMood ? ` + ${analysisSummary.secondaryMood}` : ''}
                  {` (${analysisSummary.source})`}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.devFooterText, { color: scene.textSecondary }]}>
              {statusMessage}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  sceneWash: {
    position: 'absolute',
    top: -110,
    left: -70,
    right: -70,
    height: 390,
    borderBottomLeftRadius: 210,
    borderBottomRightRadius: 210,
  },
  celestialHalo: {
    position: 'absolute',
    top: 64,
    right: 32,
    width: 168,
    height: 168,
    borderRadius: 999,
    opacity: 0.7,
  },
  celestialDisc: {
    position: 'absolute',
    top: 104,
    right: 76,
    width: 78,
    height: 78,
    borderRadius: 999,
    opacity: 0.9,
  },
  cloud: {
    position: 'absolute',
    borderRadius: 999,
  },
  cloudOne: {
    top: 170,
    left: 34,
    width: 124,
    height: 42,
    opacity: 0.82,
  },
  cloudTwo: {
    top: 150,
    right: 132,
    width: 112,
    height: 36,
    opacity: 0.74,
  },
  star: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#fff8ef',
  },
  ridgeBack: {
    position: 'absolute',
    left: -90,
    right: -90,
    bottom: 250,
    height: 240,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeMid: {
    position: 'absolute',
    left: -60,
    right: -50,
    bottom: 162,
    height: 240,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeFront: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: 78,
    height: 230,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  ridgeHighlight: {
    position: 'absolute',
    left: 42,
    right: 42,
    bottom: 230,
    height: 48,
    borderRadius: 999,
  },
  sceneMist: {
    position: 'absolute',
    left: -30,
    right: -30,
    bottom: 110,
    height: 150,
    borderRadius: 999,
  },
  landscapeStage: {
    marginTop: 0,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  inputFloat: {
    width: '88%',
    maxWidth: 430,
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#70523d',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
  },
  stageAuraPool: {
    position: 'absolute',
    bottom: 100,
    left: 28,
    right: 28,
    height: 188,
    borderRadius: 999,
  },
  stageHaze: {
    position: 'absolute',
    bottom: 72,
    left: -10,
    right: -10,
    height: 116,
    borderRadius: 999,
    opacity: 0.42,
  },
  footerStack: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    marginTop: 12,
    paddingBottom: 6,
  },
  input: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 19,
  },
  cookieTapArea: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  cookieStage: {
    width: '100%',
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 18,
  },
  paperGlow: {
    position: 'absolute',
    bottom: 162,
    width: 176,
    height: 148,
    borderRadius: 999,
  },
  sparkleBurst: {
    position: 'absolute',
    top: 76,
    width: 124,
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 241, 200, 0.72)',
    shadowColor: '#fff8e0',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  sparkleTop: {
    top: 0,
  },
  sparkleBottom: {
    bottom: 6,
  },
  sparkleLeft: {
    left: 12,
    top: 42,
  },
  sparkleRight: {
    right: 12,
    top: 42,
  },
  fortuneSlip: {
    position: 'absolute',
    bottom: 132,
    width: 304,
    minHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  fortuneSlipTopRule: {
    position: 'absolute',
    top: 5,
    left: 12,
    right: 12,
    height: 1,
    opacity: 0.85,
  },
  fortuneSlipBottomRule: {
    position: 'absolute',
    bottom: 5,
    left: 12,
    right: 12,
    height: 1,
    opacity: 0.35,
  },
  fortuneSlipInnerGlow: {
    position: 'absolute',
    top: 8,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 8,
    opacity: 0.32,
  },
  fortuneSlipEdge: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 6,
    width: 1.5,
    borderRadius: 2,
    opacity: 0.75,
  },
  fortunePaperCurlLeft: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: -1,
    width: 9,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    opacity: 0.52,
  },
  fortunePaperCurlRight: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    right: -1,
    width: 9,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    opacity: 0.52,
  },
  fortunePaperCrease: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    right: 10,
    width: 1.5,
    borderRadius: 2,
    opacity: 0.54,
  },
  fortuneSlipText: {
    paddingLeft: 10,
    paddingRight: 14,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.05,
    fontFamily: FORTUNE_FONT_FAMILY,
  },
  cookieGlow: {
    position: 'absolute',
    bottom: 44,
    width: 256,
    height: 164,
    borderRadius: 999,
  },
  cookieNest: {
    position: 'absolute',
    bottom: 40,
    width: 248,
    height: 32,
    borderRadius: 999,
    opacity: 0.7,
  },
  cookieImageFrame: {
    position: 'absolute',
    bottom: 34,
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieHybridShell: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
  },
  cookieClosedShell: {
    position: 'absolute',
    bottom: 8,
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  cookieIllustratedShell: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
  },
  cookieCenterFold: {
    position: 'absolute',
    left: '50%',
    marginLeft: -13,
    bottom: 32,
    width: 26,
    height: 112,
    borderRadius: 18,
    backgroundColor: '#d6a565',
    borderWidth: 1,
    borderColor: 'rgba(152, 103, 48, 0.2)',
  },
  cookieSplitShell: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
  },
  cookieAnimatedShell: {
    width: COOKIE_SHELL_FRAME.width,
    height: COOKIE_SHELL_FRAME.height,
  },
  cookieHalfFrame: {
    position: 'absolute',
    bottom: 0,
  },
  cookieLeftFrame: {
    left: 34,
  },
  cookieRightFrame: {
    right: 28,
  },
  cookieHalfIllustration: {
    width: 104,
    height: 164,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cookieHalfIllustrationLeft: {
    transform: [{ rotate: '-16deg' }],
  },
  cookieHalfIllustrationRight: {
    transform: [{ rotate: '16deg' }],
  },
  cookieHalfBody: {
    position: 'absolute',
    bottom: 14,
    width: 88,
    height: 134,
    borderRadius: 48,
    backgroundColor: '#e5b976',
    borderWidth: 1.5,
    borderColor: '#c7924f',
  },
  cookieHalfRim: {
    position: 'absolute',
    bottom: 18,
    width: 80,
    height: 124,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: 'rgba(255, 243, 217, 0.22)',
  },
  cookieHalfHighlight: {
    position: 'absolute',
    top: 26,
    width: 16,
    height: 68,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 244, 217, 0.38)',
  },
  cookieHalfHighlightLeft: {
    left: 26,
    transform: [{ rotate: '-8deg' }],
  },
  cookieHalfHighlightRight: {
    right: 26,
    transform: [{ rotate: '8deg' }],
  },
  cookieHalfShadow: {
    position: 'absolute',
    bottom: 28,
    width: 28,
    height: 92,
    borderRadius: 24,
    backgroundColor: 'rgba(159, 104, 44, 0.16)',
  },
  cookieHalfShadowLeft: {
    right: 16,
  },
  cookieHalfShadowRight: {
    left: 16,
  },
  cookieHalfPocket: {
    position: 'absolute',
    bottom: 26,
    width: 20,
    height: 84,
    borderRadius: 18,
    backgroundColor: 'rgba(120, 72, 28, 0.18)',
  },
  cookieHalfPocketLeft: {
    right: 18,
    transform: [{ rotate: '6deg' }],
  },
  cookieHalfPocketRight: {
    left: 18,
    transform: [{ rotate: '-6deg' }],
  },
  cookieHalfCrease: {
    position: 'absolute',
    bottom: 22,
    width: 12,
    height: 92,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 234, 191, 0.18)',
  },
  cookieHalfCreaseLeft: {
    right: 28,
  },
  cookieHalfCreaseRight: {
    left: 28,
  },
  cookieHalfBase: {
    position: 'absolute',
    bottom: 0,
    width: 54,
    height: 30,
    borderRadius: 18,
    backgroundColor: '#d09a58',
    borderWidth: 1,
    borderColor: 'rgba(154, 102, 49, 0.22)',
  },
  cookieHalfBaseLeft: {
    left: 24,
    transform: [{ rotate: '-10deg' }],
  },
  cookieHalfBaseRight: {
    right: 24,
    transform: [{ rotate: '10deg' }],
  },
  cookieLeftImage: {
    width: 92,
    height: 154,
  },
  cookieRightImage: {
    width: 96,
    height: 154,
  },
  cookieShadow: {
    position: 'absolute',
    bottom: 16,
    width: 176,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(66, 46, 35, 0.12)',
  },
  cookieCuePill: {
    marginTop: 10,
  },
  cookieCueText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.08,
  },
  devChip: {
    alignSelf: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  devMoodText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.14,
  },
  devFooterText: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    opacity: 0.58,
  },
});
