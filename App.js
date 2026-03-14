import React, { useRef, useState } from 'react';
import {
  Animated,
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

const COOKIE_LEFT_IMAGE = require('./assets/cookie-left.png');
const COOKIE_RIGHT_IMAGE = require('./assets/cookie-right.png');
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
};

const MOOD_FALLBACKS = {
  grateful: 'happy',
  lonely: 'sad',
  angry: 'stressed',
  romantic: 'hopeful',
  confident: 'focused',
  confused: 'unknown',
};

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

function pickFortune(mood) {
  const resolvedMood = FORTUNE_LIBRARY[mood] ? mood : (MOOD_FALLBACKS[mood] || 'unknown');
  const fortunes = FORTUNE_LIBRARY[resolvedMood] || FORTUNE_LIBRARY.unknown;
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

function buildFortunePool(analysis) {
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

function FortuneCookieButton({
  disabled,
  fortuneText,
  isAnimating,
  onPress,
  shellProgress,
  paperProgress,
  sparkleProgress,
}) {
  const cookieImageStyle = {
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-2deg'],
        }),
      },
    ],
  };

  const leftCookieStyle = {
    transform: [
      {
        translateX: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -28],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -14],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-22deg'],
        }),
      },
    ],
  };

  const rightCookieStyle = {
    transform: [
      {
        translateX: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 22],
        }),
      },
      {
        translateY: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
      {
        rotate: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '15deg'],
        }),
      },
    ],
  };

  const paperStyle = {
    opacity: paperProgress,
    transform: [
      {
        translateY: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [28, -146],
        }),
      },
      {
        scale: paperProgress.interpolate({
          inputRange: [0, 0.75, 1],
          outputRange: [0.74, 0.9, 1],
        }),
      },
      {
        rotate: paperProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['3deg', '-2deg'],
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
      outputRange: [0, 0.24],
    }),
    transform: [
      {
        scale: shellProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1.08],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} disabled={disabled} style={styles.cookieTapArea}>
      <View style={styles.cookieStage}>
        <Animated.View style={[styles.sparkleBurst, burstStyle]}>
          <View style={[styles.sparkleDot, styles.sparkleTop]} />
          <View style={[styles.sparkleDot, styles.sparkleLeft]} />
          <View style={[styles.sparkleDot, styles.sparkleRight]} />
          <View style={[styles.sparkleDot, styles.sparkleBottom]} />
        </Animated.View>

        <Animated.View style={[styles.fortuneSlip, paperStyle]}>
          <View style={styles.fortunePaperCurlLeft} />
          <View style={styles.fortunePaperCurlRight} />
          <View style={styles.fortuneSlipEdge} />
          <View style={styles.fortunePaperCrease} />
          <Text style={styles.fortuneSlipText}>{fortuneText || 'Tap the cookie to reveal a saying.'}</Text>
        </Animated.View>

        <Animated.View style={[styles.cookieGlow, cookieGlowStyle]} />

        <Animated.View style={[styles.cookieImageFrame, cookieImageStyle]}>
          <Animated.View style={[styles.cookieHalfFrame, styles.cookieLeftFrame, leftCookieStyle]}>
            <Image source={COOKIE_LEFT_IMAGE} style={styles.cookieLeftImage} resizeMode="contain" />
          </Animated.View>
          <Animated.View style={[styles.cookieHalfFrame, styles.cookieRightFrame, rightCookieStyle]}>
            <Image source={COOKIE_RIGHT_IMAGE} style={styles.cookieRightImage} resizeMode="contain" />
          </Animated.View>
        </Animated.View>

        <View style={styles.cookieShadow} />
      </View>

      <Text style={styles.cookieLabel}>
        {isAnimating ? 'Breaking the cookie open...' : 'Tap the fortune cookie'}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [moodInput, setMoodInput] = useState('');
  const [fortuneText, setFortuneText] = useState('');
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [recentFortunes, setRecentFortunes] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Development mode: every tap gives you a new fortune.');
  const [isAnimating, setIsAnimating] = useState(false);

  const shellProgress = useRef(new Animated.Value(0)).current;
  const paperProgress = useRef(new Animated.Value(0)).current;
  const sparkleProgress = useRef(new Animated.Value(0)).current;

  function runCookieAnimation(nextFortune, analysis) {
    setFortuneText(nextFortune);
    setAnalysisSummary(analysis);
    setIsAnimating(true);
    shellProgress.setValue(0);
    paperProgress.setValue(0);
    sparkleProgress.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(shellProgress, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleProgress, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(paperProgress, {
        toValue: 1,
        duration: 430,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      setStatusMessage('Development mode is on, so you can keep tapping for new fortunes.');
    });
  }

  function openFortune() {
    if (isAnimating) {
      return;
    }

    const analysis = analyzeMoodInput(moodInput);
    const fortune = pickFortuneForAnalysis(analysis, recentFortunes);
    setRecentFortunes((current) => [fortune, ...current].slice(0, 8));
    runCookieAnimation(fortune, analysis);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backgroundGlowOne} />
        <View style={styles.backgroundGlowTwo} />
        <View style={styles.backgroundGlowThree} />

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Daily Fortune</Text>
          <Text style={styles.title}>A small ritual for whatever mood you brought today.</Text>
          <Text style={styles.subtitle}>
            Name the feeling, tap the cookie, and let the message rise out. We kept development mode on, so every tap gives you a fresh reveal.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
          <Text style={styles.sectionCaption}>A single word or short phrase is enough.</Text>
          <TextInput
            value={moodInput}
            onChangeText={setMoodInput}
            placeholder="Try: hopeful, stressed, sleepy, excited"
            placeholderTextColor="#9a7650"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.stageCard}>
            <Text style={styles.stageTitle}>Open today&apos;s cookie</Text>
            <FortuneCookieButton
              disabled={isAnimating}
              fortuneText={fortuneText}
              isAnimating={isAnimating}
              onPress={openFortune}
              shellProgress={shellProgress}
              paperProgress={paperProgress}
              sparkleProgress={sparkleProgress}
            />
          </View>

          <Text style={styles.helperText}>{statusMessage}</Text>
          {analysisSummary ? (
            <Text style={styles.devMoodText}>
              Detected: {analysisSummary.primaryMood}
              {analysisSummary.secondaryMood ? ` + ${analysisSummary.secondaryMood}` : ''}
              {` (${analysisSummary.source})`}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7ead2',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#f7ead2',
  },
  backgroundGlowOne: {
    position: 'absolute',
    top: 24,
    left: -36,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 247, 232, 0.85)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    right: -30,
    top: 250,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: 'rgba(226, 189, 126, 0.26)',
  },
  backgroundGlowThree: {
    position: 'absolute',
    left: 60,
    top: 420,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  heroCard: {
    backgroundColor: 'rgba(255, 252, 246, 0.94)',
    borderRadius: 34,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(181, 144, 88, 0.14)',
    shadowColor: '#9b7a45',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: '#b28a56',
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    color: '#3b2a18',
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: '#6b5844',
  },
  card: {
    backgroundColor: 'rgba(255, 252, 246, 0.9)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(181, 144, 88, 0.14)',
    shadowColor: '#9b7a45',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3f2e1d',
    marginBottom: 6,
  },
  sectionCaption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7d6a54',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#fffdf8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#3f2500',
    borderWidth: 1,
    borderColor: '#ead8ba',
  },
  stageCard: {
    marginTop: 18,
    backgroundColor: 'rgba(250, 242, 226, 0.82)',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(204, 175, 129, 0.22)',
  },
  stageTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: '#a68454',
  },
  cookieTapArea: {
    marginTop: 10,
    alignItems: 'center',
  },
  cookieStage: {
    width: '100%',
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 24,
  },
  sparkleBurst: {
    position: 'absolute',
    top: 48,
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#f8e8b7',
    shadowColor: '#fff5d8',
    shadowOpacity: 0.65,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  sparkleTop: {
    top: 0,
  },
  sparkleBottom: {
    bottom: 10,
  },
  sparkleLeft: {
    left: 16,
    top: 52,
  },
  sparkleRight: {
    right: 16,
    top: 52,
  },
  fortuneSlip: {
    position: 'absolute',
    bottom: 108,
    width: 256,
    minHeight: 42,
    backgroundColor: '#fffbf1',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e7dcc3',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    shadowColor: '#6c4415',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fortuneSlipEdge: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    width: 2,
    borderRadius: 2,
    backgroundColor: '#efe2bb',
  },
  fortunePaperCurlLeft: {
    position: 'absolute',
    left: -1,
    top: 7,
    bottom: 7,
    width: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: 'rgba(214, 198, 165, 0.18)',
  },
  fortunePaperCurlRight: {
    position: 'absolute',
    right: -1,
    top: 7,
    bottom: 7,
    width: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(214, 198, 165, 0.18)',
  },
  fortunePaperCrease: {
    position: 'absolute',
    top: 7,
    bottom: 7,
    right: 10,
    width: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(198, 176, 134, 0.32)',
  },
  fortuneSlipText: {
    paddingLeft: 8,
    paddingRight: 12,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#53402d',
    textAlign: 'center',
    letterSpacing: 0.15,
    fontFamily: FORTUNE_FONT_FAMILY,
  },
  cookieGlow: {
    position: 'absolute',
    bottom: 34,
    width: 236,
    height: 148,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 223, 171, 0.45)',
  },
  cookieImageFrame: {
    position: 'absolute',
    bottom: 26,
    width: 220,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookieHalfFrame: {
    position: 'absolute',
    bottom: 0,
  },
  cookieLeftFrame: {
    left: 18,
  },
  cookieRightFrame: {
    right: 8,
  },
  cookieLeftImage: {
    width: 104,
    height: 176,
  },
  cookieRightImage: {
    width: 128,
    height: 176,
  },
  cookieShadow: {
    position: 'absolute',
    bottom: 12,
    width: 186,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(118, 88, 42, 0.14)',
  },
  cookieLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#6c563a',
  },
  helperText: {
    marginTop: 16,
    color: '#8a7458',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  devMoodText: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    color: '#ab926f',
    letterSpacing: 0.3,
    textTransform: 'lowercase',
  },
});
