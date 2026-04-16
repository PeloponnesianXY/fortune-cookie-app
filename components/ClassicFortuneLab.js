import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_PORT = 4312;
const ACCEPTED_CURRENT_STORAGE_KEY = 'classic-fortune-lab:accepted-current:v1';
const SUSPECT_FORTUNE_SUGGESTIONS = {
  anxious: {
    f_0329: 'A fearful heart mistakes many shadows for danger.',
    f_0331: 'Trust the facts before you trust the fright.',
    f_0333: 'Safety does not always require an answer at once.',
    f_0336: 'Your courage may be clearer than your worry admits.',
    f_0338: 'A startled body is not always a threatened one.',
    f_0340: 'A calm look at things may improve the picture.',
    f_0341: 'Your situation may be safer than your nerves report.',
    f_0342: 'Not every alarm deserves obedience.',
    f_0346: 'A loud fear is not always a true one.',
    f_0352: 'A dark thought is still only a passing guest.',
    f_0353: 'The mind predicts storms the sky never sends.',
    f_0357: 'Fear tells vivid stories and calls them facts.',
  },
  sad: {
    f_0247: 'A heavy hour is not the whole tale.',
    f_0251: 'This shadow may pass sooner than it promises.',
    f_0252: 'Comfort is honorable company on a dark day.',
    f_0255: 'Sorrow speaks boldly and is not always correct.',
    f_0256: 'Tonight asks for rest, not a heroic return.',
    f_0258: 'A small comfort may do a large kindness.',
    f_0259: 'To endure the day is already an achievement.',
    f_0265: 'Sadness can sound wise without being right.',
    f_0267: 'A feeling may speak elegantly and still mislead.',
    f_0278: 'A little laughter may loosen a stubborn cloud.',
  },
  sick: {
    f_0820: 'Recovery favors those who stop arguing with the weather.',
    f_0821: 'The body speaks plainly, if not politely.',
    f_0822: 'Rest is a worthy labor when the body is strained.',
    f_0823: 'A gentler day may be today’s best medicine.',
    f_0824: 'Tea, stillness, and a pillow may outrank ambition.',
    f_0825: 'Broth may accomplish more today than bravery.',
    f_0826: 'The body usually wins its debates.',
    f_0857: 'The wisest schedule today may be the softest one.',
    f_0858: 'Symptoms seldom ask permission to be believed.',
    f_0859: 'The body sometimes requests a slower hour.',
    f_0860: 'Recovery begins when resistance ends.',
    f_0861: 'Today may reward comfort more than standards.',
  },
  emotional: {
    f_0710: 'What moves you reveals what matters.',
    f_0711: 'Some truths enter by the heart.',
    f_0712: 'The heart recognizes what the mind meets later.',
    f_0714: 'What touches you may leave a useful mark.',
    f_0715: 'Some truths are felt before they are spoken.',
    f_0718: 'A deep stir often means something worth noticing.',
    f_0719: 'A moved heart points toward meaning.',
    f_0720: 'Some tides bring more than water.',
    f_0804: 'What strikes the heart rarely does so without reason.',
    f_0805: 'What lands deeply usually matters.',
  },
  engaged: {
    f_0693: 'A lively mind makes strong company.',
    f_0694: 'Interest often points toward opportunity.',
    f_0695: 'An open mind is already halfway there.',
    f_0696: 'This is a good hour to follow your interest.',
    f_0697: 'Good energy often finds an open door.',
    f_0698: 'A ready spirit attracts discovery.',
    f_0699: 'Notice what brightens your attention.',
    f_0700: 'An eager spirit travels well.',
    f_0701: 'Something worthwhile may be nearing clarity.',
    f_0749: 'This moment may offer more than first appears.',
  },
  unknown: {
    f_0702: 'Unknown word. Bright fortune.',
    f_0703: 'This mood is nameless here, but luck remains fluent.',
    f_0704: 'The fortune cannot name this feeling, yet smiles anyway.',
    f_0705: 'A puzzled cookie may still predict pleasant things.',
    f_0706: 'No label here. Good fortune continues.',
    f_0811: 'Unknown to the cookie, not to destiny.',
    f_0812: 'The fortune shrugs and keeps favoring you.',
    f_0813: 'The oracle cannot sort this word. Your odds remain handsome.',
    f_0814: 'This word is new. Fortune is not alarmed.',
    f_0815: 'An unnamed mood may still lead to a lucky day.',
  },
  guilty: {
    f_0280: 'Conscience guides best without becoming a judge.',
    f_0282: 'Repair is more useful than punishment.',
    f_0283: 'Guilt is a signal, not a residence.',
    f_0294: 'Amend what you can and spare yourself the theater.',
    f_0296: 'A clean amends outweigh a grand remorse.',
    f_0864: 'Guilt should open a path, not a prison.',
    f_0865: 'Responsibility is useful; replay is vanity.',
    f_0866: 'Let conscience advise you, not sentence you.',
  },
  numb: {
    f_0305: 'A flat day is still a real one.',
    f_0314: 'Feeling returns best when not dragged indoors.',
    f_0321: 'Numbness often leaves by teaspoons.',
    f_0827: 'Some systems can barely whisper on hard days.',
    f_0828: 'Numbness often follows great fatigue.',
    f_0830: 'When all is quiet, begin with what is true.',
    f_0831: 'Low light is not darkness.',
    f_0863: 'Numbness may be a passage, not a home.',
  },
};

const ORIGINAL_SUSPECT_FORTUNES = {
  anxious: {
    f_0329: 'Not every feeling in your body is warning you of danger.',
    f_0331: 'Trust yourself with what is real, not just what feels scary.',
    f_0333: 'You do not need to solve this to be safe right now.',
    f_0336: 'You are doing better than your mind is letting you believe.',
    f_0338: "Your body can feel scared even when you're actually okay.",
    f_0340: 'Your mind deserves a peaceful reality check.',
    f_0341: 'You are safer than this feeling is making it seem.',
    f_0342: 'Not every alarm in your body is an instruction.',
    f_0346: 'This feeling is persuasive, not necessarily accurate.',
    f_0352: 'A frightening thought is still only a thought.',
    f_0353: 'Your mind loves prediction; reality loves evidence.',
    f_0357: 'A pained mind is a gifted storyteller, not a reliable witness.',
  },
  sad: {
    f_0247: 'This feeling does not define your whole story.',
    f_0251: 'This heaviness may visit, but it does not own you.',
    f_0252: "You're allowed to need comfort first today.",
    f_0255: 'This feeling is real; it is also a terrible narrator.',
    f_0256: 'You do not need a comeback arc by tonight.',
    f_0258: 'Tiny comforts can do serious work right now.',
    f_0259: 'Getting through today still counts as progress.',
    f_0265: 'Heavy feelings can be sincere and still exaggerate.',
    f_0267: 'This feeling is eloquent, not necessarily correct.',
    f_0278: 'Laughter can trick your body and mind into easing up.',
  },
  sick: {
    f_0820: 'Recovery begins when you stop negotiating with symptoms.',
    f_0821: 'Your body is telling the truth with poor bedside manners.',
    f_0822: 'Rest is still progress when the body is under strain.',
    f_0823: 'A quieter day may be the kindest answer available.',
    f_0824: 'This day yearns for tea and a pillow, not heroics.',
    f_0825: 'Today may be better answered with broth than bravery.',
    f_0826: 'Negotiating with your body can only have one outcome.',
    f_0857: 'The wisest plan today may be the gentlest one.',
    f_0858: 'Your symptoms are not asking for your opinion.',
    f_0859: 'This body has earned a slower conversation with the day.',
    f_0860: 'Recovery begins the moment you stop pushing back.',
    f_0861: 'Today may be for comfort, fluids, and lowered standards.',
  },
  emotional: {
    f_0710: 'What moves you is part of what matters to you.',
    f_0711: 'This feeling is carrying more truth than words can hold.',
    f_0712: 'The heart has its own way of recognizing meaning.',
    f_0714: 'What touches you leaves behind its own kind of wisdom.',
    f_0715: 'Some truths are felt before they are understood.',
    f_0718: 'This moment is brushing against something deep in you.',
    f_0719: 'A stirred heart is a compass pointing to what matters.',
    f_0720: 'Some emotions arrive like a tide carrying meaning.',
    f_0804: 'What hits the heart rarely does so by accident.',
    f_0805: 'What lands deeply usually has deep meaning.',
  },
  engaged: {
    f_0693: 'You are alive to this moment in all the right ways.',
    f_0694: 'This mood is pulling you toward something worth finding.',
    f_0695: 'Your mind is open, awake, and ready to move.',
    f_0696: 'This is a good mood for following what pulls you forward.',
    f_0697: 'This is the kind of energy that opens doors.',
    f_0698: 'Something in you is ready for motion, discovery, or both.',
    f_0699: 'You are in a good place to notice what sparks.',
    f_0700: 'This is a strong moment for interest, motion, and lightness.',
    f_0701: 'You are closer than usual to something that clicks.',
    f_0749: 'The moment is giving you more to work with.',
  },
  unknown: {
    f_0702: 'The Cookie Oracle does not know this one. Your future is still bright.',
    f_0703: 'This mood is new to the cookie, but not to fortune.',
    f_0704: 'The fortune cannot name this feeling. It still likes your chances.',
    f_0705: 'The cookie is puzzled. Your prospects remain excellent.',
    f_0706: 'The fortune has no label for this one. Good things still apply.',
    f_0811: 'The cookie cannot place this mood. The future remains generous.',
    f_0812: 'The fortune shrugs politely. Your future still looks favorable.',
    f_0813: 'The oracle cannot decode this one. It still approves your odds.',
    f_0814: 'The cookie does not know this word. It still predicts good things.',
    f_0815: 'The fortune is puzzled, but not pessimistic.',
  },
  guilty: {
    f_0280: 'A conscience can guide without putting you on trial.',
    f_0282: 'Repair does more good than self-attack ever will.',
    f_0283: 'Guilt is a message, not a permanent address.',
    f_0294: 'Repair what you can. Release what you cannot relive usefully.',
    f_0296: 'A decent amend beats an immaculate guilt spiral.',
    f_0864: 'This feeling needs amends and a real path forward, not a cell.',
    f_0865: 'Responsibility is useful; replays of the moment are not.',
    f_0866: 'Allow conscience to be your guide, not your jailer.',
  },
  numb: {
    f_0305: 'Flat is still a feeling, just with the volume lowered.',
    f_0314: 'You do not have to force feeling to welcome its return.',
    f_0321: 'Numbness often lifts by teaspoons, not thunderclaps.',
    f_0827: 'Sometimes your system struggles to even whisper.',
    f_0828: 'Numbness often means something is too tired to shout.',
    f_0830: 'When nothing feels loud, a good start is what feels true.',
    f_0831: 'Flat is not absence of light. It is lowered wattage.',
    f_0863: 'Numbness can be a bridge, not a destination.',
  },
};

const ORIGINAL_BORDERLINE_FORTUNES = {
  neutral: {
    f_0034: 'Not every moment needs a dramatic opinion.',
    f_0036: 'You do not owe every day a grand emotional arc.',
    f_0037: 'Ordinary is sometimes just reality without stage lights.',
    f_0042: 'You are allowed to move without crisis or euphoria.',
  },
  grateful: {
    f_0059: 'Noticing what is here changes what here feels like.',
    f_0060: 'Abundance sometimes arrives dressed as enough.',
  },
  caring: {
    f_0685: 'Affection is its own kind of wisdom.',
    f_0709: 'Some feelings arrive softly and stay a long time.',
  },
  happy: {
    f_0208: 'Life is made of moments like this. Step back to appreciate.',
    f_0221: 'This may be your nature getting interrupted less.',
  },
  proud: {
    f_0236: 'Some wins arrive without confetti and still matter more.',
    f_0245: 'Some outcomes fit better because you grew into them.',
  },
  hopeful: {
    f_0708: 'There is meaning in what is stirring inside you.',
  },
  numb: {
    f_0325: 'A flat day can still register one kind thing.',
  },
  jealous: {
    f_0490: 'Someone else’s shine is not proof of your dimness.',
    f_0494: 'Wanting can be useful once it stops staring sideways.',
  },
  disgusted: {
    f_0515: 'Your body often spots trouble before your mind explains it.',
    f_0520: 'Your taste is part of your wisdom. It is allowed to vote.',
  },
  romantic: {
    f_0726: 'Small gestures are the currency of relationships that last.',
    f_0727: 'Romance flourishes when curiosity about the other is a habit.',
  },
  emotional: {
    f_0712: 'The heart has its own way of recognizing meaning.',
    f_0874: 'Some feelings arrive carrying more than one meaning.',
  },
};

const BORDERLINE_FORTUNE_SUGGESTIONS = {
  neutral: {
    f_0034: 'A plain hour needs no ceremony.',
    f_0036: 'Not every day requires a grand design.',
    f_0037: 'Ordinary often arrives without trumpets.',
    f_0042: 'A quiet day may still be a sound one.',
  },
  grateful: {
    f_0059: 'Notice what is here, and it becomes more so.',
    f_0060: 'Enough often arrives in humble clothes.',
  },
  caring: {
    f_0685: 'Affection has wisdom of its own.',
    f_0709: 'Some feelings arrive softly and remain.',
  },
  happy: {
    f_0208: 'A bright moment deserves a second look.',
    f_0221: 'This may be your truest nature, lightly revealed.',
  },
  proud: {
    f_0236: 'A quiet victory still counts in full.',
    f_0245: 'Some outcomes fit because you grew to meet them.',
  },
  hopeful: {
    f_0708: 'What stirs within may yet prove useful.',
  },
  numb: {
    f_0325: 'Even a flat day may notice one kind thing.',
  },
  jealous: {
    f_0490: "Another's shine need not dim your own lamp.",
    f_0494: 'Wanting is useful once it looks ahead.',
  },
  disgusted: {
    f_0515: 'The body often sees the trouble first.',
    f_0520: "Taste is one of wisdom's quieter votes.",
  },
  romantic: {
    f_0726: 'Small gestures often keep love well-fed.',
    f_0727: 'Romance thrives where curiosity is practiced.',
  },
  emotional: {
    f_0712: 'The heart often recognizes meaning first.',
    f_0874: 'Some feelings arrive bearing more than one meaning.',
  },
};

const ORIGINAL_NEXT_BATCH_FORTUNES = {
  angry: {
    f_0437: 'Strong feelings are human. Harm is still a choice.',
    f_0438: 'Ask what this feeling is protecting before reacting.',
    f_0446: "Don't spend all your power in one hot moment.",
    f_0457: 'Refusing to give others power over our feelings is a win.',
    f_0462: 'Some feelings are self-respect refusing to sit down.',
  },
  anxious: {
    f_0347: 'A feeling in your body is not a forecast.',
    f_0351: 'Your mind can sound very certain without good evidence.',
    f_0360: 'Your mind sometimes writes fiction and calls it planning.',
  },
  caring: {
    f_0744: "The way to change others' minds is with affection, not anger.",
  },
  confident: {
    f_0691: 'The next move does not need a louder voice, only yours.',
  },
  confused: {
    f_0536: 'Your mind may be tangled; your next move can be simple.',
    f_0558: 'Right answers arrive only after the wrong ones get tired.',
  },
  disgusted: {
    f_0516: 'What feels wrong does not always need to be rationalized.',
    f_0525: 'This feeling can be discernment that has run out of patience.',
  },
  distracted: {
    f_0591: 'The day may improve if only one thing has the microphone.',
  },
  embarrassed: {
    f_0576: 'Every room contains at least one invisible blooper reel.',
    f_0842: 'A bruised self-image is still only bruised, not broken.',
  },
  emotional: {
    f_0775: 'Some feelings glow longer than the moment that made them.',
  },
  grateful: {
    f_0836: 'You can travel the world and find home held it all along.',
  },
  happy: {
    f_0207: 'This feeling may know exactly what it needs. Listen to it.',
    f_0755: 'Little is needed to be happy; it is all within yourself.',
  },
  jealous: {
    f_0794: 'A jealous feeling sometimes reveals a wish asking for room.',
    f_0796: 'Sometimes envy is desire before it has found its language.',
    f_0873: 'Envy asks a rude question that may still be worth hearing.',
  },
  lonely: {
    f_0187: 'This feeling is real, but not the whole truth.',
  },
  romantic: {
    f_0743: 'Passion gives a kiss its sweetness; affection sanctifies it.',
    f_0770: 'The human heart opens to the heart that opens in return.',
  },
  sad: {
    f_0257: 'Not every dark day is a deep truth.',
  },
  shaken: {
    f_0654: 'Not every jolt is a warning. Some are invitations.',
    f_0659: "If you are always on autopilot, you'll forget how to drive.",
  },
};

const NEXT_BATCH_FORTUNE_SUGGESTIONS = {
  angry: {
    f_0437: 'Strong weather in you need not choose the ending.',
    f_0438: 'Ask what this protects before answering with heat.',
    f_0446: 'Save some strength for the hour after this one.',
    f_0457: 'Keeping your center is a quiet kind of win.',
    f_0462: 'Some refusals are dignity declining a bad seat.',
  },
  anxious: {
    f_0347: 'A passing signal need not predict the whole sky.',
    f_0351: 'Certainty can arrive before the facts do.',
    f_0360: 'Imagination can borrow the coat of planning.',
  },
  caring: {
    f_0744: 'Affection often changes more than argument can.',
  },
  confident: {
    f_0691: 'The next move may ask for steadiness, not volume.',
  },
  confused: {
    f_0536: 'A tangled hour may still allow one simple step.',
    f_0558: 'Answers often arrive after the noise grows tired.',
  },
  disgusted: {
    f_0516: 'What repels you need not earn a long defense.',
    f_0525: 'Discernment can grow sharp when patience runs thin.',
  },
  distracted: {
    f_0591: 'The day may improve when one thing holds the floor.',
  },
  embarrassed: {
    f_0576: 'Every room keeps a private archive of missteps.',
    f_0842: 'A bruised self-image is hurt, not ruined.',
  },
  emotional: {
    f_0775: 'Some moments glow longer than the hour that made them.',
  },
  grateful: {
    f_0836: 'You may travel far and still find home kept pace with you.',
  },
  happy: {
    f_0207: 'This bright hour may already know its next step.',
    f_0755: 'A little may be enough to brighten the day.',
  },
  jealous: {
    f_0794: 'A jealous hour may be naming a wish that needs air.',
    f_0796: 'Sometimes envy is desire before it finds better manners.',
    f_0873: 'Envy asks a rude question that may still be useful.',
  },
  lonely: {
    f_0187: 'This ache is real, though it may not tell the whole story.',
  },
  romantic: {
    f_0743: 'Passion sweetens the moment; kindness lets it last.',
    f_0770: 'A human heart opens more easily to what opens back.',
  },
  sad: {
    f_0257: 'A dark day need not become a lasting verdict.',
  },
  shaken: {
    f_0654: 'Not every jolt is a verdict; some are a summons to wake.',
    f_0659: 'Too much autopilot can make the road feel borrowed.',
  },
};

function mergeReviewMaps(primaryMap, secondaryMap) {
  const merged = { ...primaryMap };

  for (const [bucket, entries] of Object.entries(secondaryMap)) {
    merged[bucket] = {
      ...(merged[bucket] || {}),
      ...entries,
    };
  }

  return merged;
}

const REVIEW_FORTUNE_SUGGESTIONS = mergeReviewMaps(
  mergeReviewMaps(
    SUSPECT_FORTUNE_SUGGESTIONS,
    BORDERLINE_FORTUNE_SUGGESTIONS,
  ),
  NEXT_BATCH_FORTUNE_SUGGESTIONS,
);

const ORIGINAL_REVIEW_FORTUNES = mergeReviewMaps(
  mergeReviewMaps(
    ORIGINAL_SUSPECT_FORTUNES,
    ORIGINAL_BORDERLINE_FORTUNES,
  ),
  ORIGINAL_NEXT_BATCH_FORTUNES,
);

const BUCKET_ORDER = Object.keys(REVIEW_FORTUNE_SUGGESTIONS);

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'before', 'but', 'by',
  'can', 'do', 'does', 'for', 'from', 'has', 'have', 'if', 'in', 'into', 'is',
  'it', 'its', 'just', 'may', 'more', 'most', 'need', 'not', 'of', 'on', 'or',
  'so', 'some', 'still', 'than', 'that', 'the', 'their', 'them', 'there', 'this',
  'to', 'today', 'too', 'under', 'very', 'what', 'when', 'with', 'without', 'you',
  'your',
]);

const RETRY_TEMPLATES_BY_BUCKET = {
  anxious: [
    'A wary mind often mistakes {keyword} for danger.',
    'Not every shadow cast by {keyword} deserves your fear.',
    'The nerves often enlarge what {keyword} only hints at.',
    'Fear gives {keyword} a larger costume than it earned.',
    'A troubled heart may overread the signs around {keyword}.',
  ],
  sad: [
    'Even {keyword} may pass more quietly than it arrives.',
    'A dark hour around {keyword} is not the whole story.',
    'Sorrow gives {keyword} a longer echo than it deserves.',
    'A little mercy may lighten the weight of {keyword}.',
    'Time often softens what {keyword} first makes heavy.',
  ],
  sick: [
    'The body keeps its own counsel about {keyword}.',
    'A gentle answer often serves {keyword} best.',
    'When {keyword} calls the hour, softness is good sense.',
    'The body argues plainly when {keyword} has its say.',
    'Rest often settles what {keyword} stirs.',
  ],
  emotional: [
    '{keyword} may reveal more than words can carry.',
    'A stirred heart often knows why {keyword} matters.',
    'What {keyword} touches may not be trivial.',
    'Some feelings around {keyword} arrive before explanation.',
    'The heart often recognizes {keyword} ahead of the mind.',
  ],
  engaged: [
    'A bright interest in {keyword} may lead somewhere useful.',
    '{keyword} often rewards the curious spirit.',
    'Attention given to {keyword} may not be wasted.',
    'A lively mind finds openings near {keyword}.',
    'Curiosity about {keyword} often points the right way.',
  ],
  unknown: [
    'The oracle lacks a name for this and still predicts favor.',
    'This word is unclear here, but fortune remains cheerful.',
    'The cookie cannot sort this one and remains optimistic.',
    'An unnamed mood may still lead to a fortunate hour.',
    'No clear label appears, yet luck keeps its appointment.',
  ],
  guilty: [
    '{keyword} asks for repair, not a sentence.',
    'A clear conscience prefers amends to torment.',
    '{keyword} is better answered by repair than replay.',
    'Conscience grows wiser when {keyword} opens a path forward.',
    'Let {keyword} teach, but not govern the whole house.',
  ],
  numb: [
    '{keyword} may be quiet without being gone.',
    'A dim hour around {keyword} is still a living one.',
    'What feels muted in {keyword} may yet return.',
    'Even low light around {keyword} is not darkness.',
    '{keyword} sometimes speaks in whispers before it returns.',
  ],
  fallback: [
    '{keyword} may mean less harm than it first suggests.',
    'A calmer look at {keyword} may improve the picture.',
    'Time often restores the scale of {keyword}.',
    '{keyword} may yet prove gentler than it appears.',
    'A wiser hour may make better sense of {keyword}.',
  ],
};

function extractFortuneKeyword(text) {
  const words = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^'+|'+$/g, ''))
    .filter(Boolean);

  const preferred = words.find((word) => word.length >= 5 && !STOP_WORDS.has(word));
  if (preferred) {
    return preferred;
  }

  const fallback = words.find((word) => word.length >= 3 && !STOP_WORDS.has(word));
  return fallback || 'it';
}

function buildRetrySuggestion(fortune, previousSuggestion, attempt) {
  const templates = RETRY_TEMPLATES_BY_BUCKET[fortune.primaryBucket] || RETRY_TEMPLATES_BY_BUCKET.fallback;
  const keyword = extractFortuneKeyword(fortune.text);
  const idNumber = Number.parseInt(String(fortune.id || '').replace(/\D+/g, ''), 10) || 0;

  for (let offset = 0; offset < templates.length; offset += 1) {
    const template = templates[(idNumber + attempt + offset) % templates.length];
    const candidate = template.replace(/\{keyword\}/g, keyword);
    if (candidate !== previousSuggestion && candidate !== fortune.text) {
      return candidate;
    }
  }

  return previousSuggestion || templates[0].replace(/\{keyword\}/g, keyword);
}

function getApiBaseUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return `http://127.0.0.1:${API_PORT}`;
  }

  const hostname = window.location.hostname || '127.0.0.1';
  const apiHostname = hostname === 'localhost' ? '127.0.0.1' : hostname;

  return `http://${apiHostname}:${API_PORT}`;
}

function formatBucketLabel(bucket) {
  return bucket.charAt(0).toUpperCase() + bucket.slice(1);
}

function getEditorTextSizing(text) {
  const length = String(text || '').trim().length;

  if (length >= 56) {
    return {
      fontSize: 10,
      lineHeight: 14,
      paddingHorizontal: 6,
    };
  }

  if (length >= 48) {
    return {
      fontSize: 11,
      lineHeight: 15,
      paddingHorizontal: 7,
    };
  }

  return {
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
  };
}

function loadAcceptedCurrentIds() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(ACCEPTED_CURRENT_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue.filter((value) => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function persistAcceptedCurrentIds(acceptedCurrentIds) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(ACCEPTED_CURRENT_STORAGE_KEY, JSON.stringify(acceptedCurrentIds));
  } catch {
    // Ignore local review-persistence failures in the dev-only lab.
  }
}

export default function ClassicFortuneLab() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [fortunes, setFortunes] = useState([]);
  const [currentDrafts, setCurrentDrafts] = useState({});
  const [drafts, setDrafts] = useState({});
  const [dismissedIds, setDismissedIds] = useState([]);
  const [acceptedCurrentIds, setAcceptedCurrentIds] = useState(() => loadAcceptedCurrentIds());
  const [retryCounts, setRetryCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [saveError, setSaveError] = useState('');
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  const hydrateReviewState = useCallback((incomingFortunes) => {
    setFortunes(incomingFortunes);
    setCurrentDrafts(() => {
      const nextCurrentDrafts = {};

      for (const [bucket, suggestions] of Object.entries(REVIEW_FORTUNE_SUGGESTIONS)) {
        for (const fortuneId of Object.keys(suggestions)) {
          const liveFortune = incomingFortunes.find((fortune) => fortune.id === fortuneId && fortune.primaryBucket === bucket);
          if (liveFortune) {
            nextCurrentDrafts[fortuneId] = liveFortune.text;
          }
        }
      }

      return nextCurrentDrafts;
    });
    setDrafts(() => {
      const nextDrafts = {};

      for (const [bucket, suggestions] of Object.entries(REVIEW_FORTUNE_SUGGESTIONS)) {
        for (const [fortuneId, suggestion] of Object.entries(suggestions)) {
          const liveFortune = incomingFortunes.find((fortune) => fortune.id === fortuneId && fortune.primaryBucket === bucket);
          if (liveFortune) {
            nextDrafts[fortuneId] = suggestion;
          }
        }
      }

      return nextDrafts;
    });
  }, []);

  const loadFortunes = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/fortunes`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Classic Fortune Lab API is unavailable.');
      }

      const payload = await response.json();
      const incomingFortunes = Array.isArray(payload.fortunes) ? payload.fortunes : [];
      hydrateReviewState(incomingFortunes);
      setDismissedIds([]);
      setPendingUpdates({});
      setPendingDeletions([]);
      setSaveError('');
    } catch (error) {
      setLoadError(
        error.message
          || 'Classic Fortune Lab could not reach the local API.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, hydrateReviewState]);

  useEffect(() => {
    let isActive = true;
    loadFortunes().catch(() => {
      // loadFortunes already updates local error state.
    });

    return () => {
      isActive = false;
    };
  }, [loadFortunes]);

  useEffect(() => {
    persistAcceptedCurrentIds(acceptedCurrentIds);
  }, [acceptedCurrentIds]);

  const bucketSections = useMemo(() => {
    const fortunesByBucket = BUCKET_ORDER.map((bucket) => {
      const liveBucketFortunes = fortunes.filter((fortune) => fortune.primaryBucket === bucket);
      const suspectIds = new Set(Object.keys(REVIEW_FORTUNE_SUGGESTIONS[bucket] || {}));
      const suspectFortunes = liveBucketFortunes
        .filter((fortune) => suspectIds.has(fortune.id))
        .filter((fortune) => {
          const originalText = ORIGINAL_REVIEW_FORTUNES[bucket]?.[fortune.id];
          return !originalText || fortune.text === originalText;
        })
        .filter((fortune) => !acceptedCurrentIds.includes(fortune.id))
        .filter((fortune) => !dismissedIds.includes(fortune.id))
        .sort((left, right) => left.id.localeCompare(right.id));

      return {
        bucket,
        totalInBucket: liveBucketFortunes.length,
        suspectFortunes,
      };
    }).filter((section) => section.suspectFortunes.length > 0);

    return fortunesByBucket;
  }, [acceptedCurrentIds, dismissedIds, fortunes]);

  function updateDraft(fortuneId, value) {
    setDrafts((current) => ({
      ...current,
      [fortuneId]: value,
    }));
    setSaveError('');
  }

  function updateCurrentDraft(fortuneId, value) {
    setCurrentDrafts((current) => ({
      ...current,
      [fortuneId]: value,
    }));
    setSaveError('');
  }

  function dismissFortuneId(fortuneId) {
    setDismissedIds((current) => (
      current.includes(fortuneId) ? current : [...current, fortuneId]
    ));
  }

  function restoreFortuneId(fortuneId) {
    setDismissedIds((current) => current.filter((id) => id !== fortuneId));
  }

  function markAcceptedCurrentId(fortuneId) {
    setAcceptedCurrentIds((current) => (
      current.includes(fortuneId) ? current : [...current, fortuneId]
    ));
  }

  function unmarkAcceptedCurrentId(fortuneId) {
    setAcceptedCurrentIds((current) => current.filter((id) => id !== fortuneId));
  }

  function handleResetAcceptedCurrentRows() {
    setAcceptedCurrentIds([]);
  }

  function handleTryAgain(fortune) {
    setSaveError('');
    setRetryCounts((current) => {
      const nextCount = (current[fortune.id] || 0) + 1;
      const nextSuggestion = buildRetrySuggestion(
        fortune,
        String(drafts[fortune.id] || '').trim(),
        nextCount,
      );

      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [fortune.id]: nextSuggestion,
      }));

      return {
        ...current,
        [fortune.id]: nextCount,
      };
    });
  }

  async function processChange(body) {
    const response = await fetch(`${apiBaseUrl}/api/fortunes/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Unable to process change.');
    }

    return response.json();
  }

  async function handleAccept(fortune) {
    const nextText = String(drafts[fortune.id] || '').trim();
    if (!nextText) {
      return;
    }

    dismissFortuneId(fortune.id);
    setSaveError('');
    setPendingDeletions((current) => current.filter((id) => id !== fortune.id));
    setPendingUpdates((current) => ({
      ...current,
      [fortune.id]: {
        id: fortune.id,
        text: nextText,
        buckets: [fortune.primaryBucket, ...(fortune.alsoFits || [])],
      },
    }));
    setFortunes((current) => current.map((entry) => (
      entry.id === fortune.id
        ? {
            ...entry,
            text: nextText,
          }
        : entry
    )));
  }

  async function handleAcceptCurrent(fortune) {
    const nextText = String(currentDrafts[fortune.id] || '').trim();
    if (!nextText) {
      return;
    }

    dismissFortuneId(fortune.id);
    setSaveError('');

    if (nextText === fortune.text) {
      markAcceptedCurrentId(fortune.id);
      return;
    }

    setPendingDeletions((current) => current.filter((id) => id !== fortune.id));
    setPendingUpdates((current) => ({
      ...current,
      [fortune.id]: {
        id: fortune.id,
        text: nextText,
        buckets: [fortune.primaryBucket, ...(fortune.alsoFits || [])],
      },
    }));
    setFortunes((current) => current.map((entry) => (
      entry.id === fortune.id
        ? {
            ...entry,
            text: nextText,
          }
        : entry
    )));
  }

  function handleDelete(fortune) {
    dismissFortuneId(fortune.id);
    setSaveError('');
    setPendingUpdates((current) => {
      const next = { ...current };
      delete next[fortune.id];
      return next;
    });
    setPendingDeletions((current) => (
      current.includes(fortune.id) ? current : [...current, fortune.id]
    ));
    setFortunes((current) => current.filter((entry) => entry.id !== fortune.id));
  }

  const pendingUpdateList = useMemo(
    () => Object.values(pendingUpdates),
    [pendingUpdates]
  );
  const pendingChangeCount = pendingUpdateList.length + pendingDeletions.length;

  async function handleSaveBatch() {
    if (pendingChangeCount === 0) {
      return;
    }

    setIsSavingBatch(true);
    setSaveError('');

    try {
      await processChange({
        deletions: pendingDeletions,
        creations: [],
        updates: pendingUpdateList,
      });
      setPendingUpdates({});
      setPendingDeletions([]);
      setDismissedIds([]);
    } catch (error) {
      setSaveError(error.message || 'Unable to save review batch.');
    } finally {
      setIsSavingBatch(false);
    }
  }

  function handleDiscardBatch() {
    loadFortunes().catch(() => {
      // loadFortunes already updates local error state.
    });
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent} stickyHeaderIndices={[1]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Classic Fortune Lab</Text>
        <Text style={styles.subtitle}>
          Review actions are staged locally. Save the batch when you are ready to write changes to the registry.
        </Text>
        <View style={styles.batchToolbar}>
          <View style={styles.batchPill}>
            <Text style={styles.batchPillLabel}>Pending</Text>
            <Text style={styles.batchPillValue}>{pendingChangeCount}</Text>
          </View>
          <Pressable
            disabled={pendingChangeCount === 0 || isSavingBatch}
            onPress={handleSaveBatch}
            style={[
              styles.batchPrimaryButton,
              (pendingChangeCount === 0 || isSavingBatch) ? styles.batchButtonDisabled : null,
            ]}
          >
            <Text style={styles.batchPrimaryButtonText}>
              {isSavingBatch ? 'Saving...' : 'Save batch'}
            </Text>
          </Pressable>
          <Pressable
            disabled={pendingChangeCount === 0 || isSavingBatch}
            onPress={handleDiscardBatch}
            style={[
              styles.batchSecondaryButton,
              (pendingChangeCount === 0 || isSavingBatch) ? styles.batchButtonDisabled : null,
            ]}
          >
            <Text style={styles.batchSecondaryButtonText}>Discard batch</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.globalLegendWrap}>
        <View style={styles.bucketLegendRow}>
          <Text style={[styles.bucketLegendText, styles.idColumn]}>ID</Text>
          <Text style={[styles.bucketLegendText, styles.pairColumn]}>Current</Text>
          <Text style={[styles.bucketLegendText, styles.pairColumn]}>Suggested rewrite</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#8a5b2a" />
          <Text style={styles.loadingText}>Loading suspect fortunes...</Text>
        </View>
      ) : null}

      {loadError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : null}

      {saveError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{saveError}</Text>
        </View>
      ) : null}

      {!isLoading && !loadError && bucketSections.length === 0 ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>No review rows remain in the current live file.</Text>
          {acceptedCurrentIds.length > 0 ? (
            <Pressable onPress={handleResetAcceptedCurrentRows} style={styles.resetAcceptedButton}>
              <Text style={styles.resetAcceptedButtonText}>Show accepted current rows</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!isLoading && !loadError ? (
        bucketSections.map((section) => (
          <View key={section.bucket} style={styles.bucketCard}>
            <View style={styles.bucketHeader}>
              <Text style={styles.bucketTitle}>{formatBucketLabel(section.bucket)}</Text>
              <Text style={styles.bucketCount}>{section.totalInBucket}</Text>
            </View>

            {section.suspectFortunes.map((fortune) => {
              const isBusy = isSavingBatch || busyId === fortune.id;

                return (
                  <View key={fortune.id} style={styles.fortuneCard}>
                    <Text style={styles.fortuneIdText}>{fortune.id}</Text>

                    <View style={styles.pairColumn}>
                      <TextInput
                        multiline={false}
                        onChangeText={(value) => updateCurrentDraft(fortune.id, value)}
                        style={[
                          styles.suggestionInput,
                          styles.currentColumn,
                          getEditorTextSizing(currentDrafts[fortune.id] || fortune.text),
                        ]}
                        numberOfLines={1}
                        value={currentDrafts[fortune.id] || fortune.text}
                      />

                      <View style={[styles.actionsColumn, styles.currentActionsColumn]}>
                        <Pressable
                          disabled={isBusy}
                          onPress={() => handleAcceptCurrent(fortune)}
                          style={({ pressed }) => [
                            styles.acceptButton,
                            (pressed || isBusy) ? styles.acceptButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => handleDelete(fortune)}
                          style={({ pressed }) => [
                            styles.deleteButton,
                            pressed ? styles.deleteButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.deleteButtonText}>X</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.pairColumn}>
                      <TextInput
                        multiline={false}
                        onChangeText={(value) => updateDraft(fortune.id, value)}
                        style={[
                          styles.suggestionInput,
                          styles.suggestedColumn,
                          getEditorTextSizing(drafts[fortune.id] || ''),
                        ]}
                        numberOfLines={1}
                        value={drafts[fortune.id] || ''}
                      />

                      <Text style={styles.charCountText}>
                        {String(drafts[fortune.id] || '').trim().length}
                      </Text>

                      <View style={styles.actionsColumn}>
                        <Pressable
                          disabled={isBusy || !String(drafts[fortune.id] || '').trim()}
                          onPress={() => handleAccept(fortune)}
                          style={({ pressed }) => [
                            styles.acceptButton,
                            (pressed || isBusy) ? styles.acceptButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.acceptButtonText}>{isBusy ? '...' : 'Accept'}</Text>
                        </Pressable>

                        <Pressable
                          disabled={isBusy}
                          onPress={() => handleTryAgain(fortune)}
                          style={({ pressed }) => [
                            styles.secondaryButton,
                            (pressed || isBusy) ? styles.secondaryButtonPressed : null,
                          ]}
                        >
                          <Text style={styles.secondaryButtonText}>Try again</Text>
                        </Pressable>
                      </View>
                    </View>
                </View>
              );
            })}
          </View>
        ))
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#efe5d6',
  },
  pageContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  header: {
    gap: 2,
  },
  globalLegendWrap: {
    backgroundColor: '#efe5d6',
    paddingTop: 2,
    paddingBottom: 4,
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky',
          top: 0,
        }
      : null),
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6a5747',
  },
  batchToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  batchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3e2cf',
  },
  batchPillLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7b5733',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  batchPillValue: {
    minWidth: 18,
    fontSize: 12,
    fontWeight: '900',
    color: '#33271d',
    textAlign: 'center',
  },
  batchPrimaryButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#d8a66b',
  },
  batchPrimaryButtonText: {
    color: '#2f2015',
    fontWeight: '900',
    fontSize: 11,
  },
  batchSecondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#efe2d0',
    borderWidth: 1,
    borderColor: '#d4bea4',
  },
  batchSecondaryButtonText: {
    color: '#6a4d2d',
    fontWeight: '800',
    fontSize: 11,
  },
  batchButtonDisabled: {
    opacity: 0.5,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
  },
  loadingText: {
    fontSize: 14,
    color: '#58483b',
  },
  resetAcceptedButton: {
    borderRadius: 999,
    backgroundColor: '#d8a66b',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  resetAcceptedButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2f2015',
  },
  errorCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f9e0db',
    borderWidth: 1,
    borderColor: '#d69a8f',
  },
  errorText: {
    color: '#6f2f24',
    fontWeight: '700',
  },
  bucketCard: {
    gap: 4,
    padding: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 250, 244, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.12)',
  },
  bucketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  bucketTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#33271d',
  },
  bucketCount: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    textAlign: 'center',
    backgroundColor: '#f3e2cf',
    color: '#7b5733',
    fontWeight: '800',
    fontSize: 12,
  },
  bucketLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 250, 244, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.08)',
  },
  bucketLegendText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
  },
  idColumn: {
    width: 50,
  },
  pairColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: 8,
  },
  bucketLegendActions: {
    width: 62,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
    textAlign: 'center',
  },
  bucketLegendCurrentActions: {
    width: 92,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#8a735f',
    textAlign: 'center',
  },
  fortuneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: 'rgba(104, 80, 58, 0.08)',
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2d8cf',
    borderWidth: 1,
    borderColor: '#d7a79a',
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    color: '#6a2f26',
    fontWeight: '900',
  },
  fortuneIdText: {
    width: 50,
    fontSize: 11,
    fontWeight: '800',
    color: '#8a735f',
  },
  currentColumn: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  suggestedColumn: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  currentText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#3f3126',
  },
  suggestionInput: {
    minHeight: 0,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(141, 108, 73, 0.2)',
    fontSize: 12,
    lineHeight: 16,
    color: '#2f241c',
  },
  charCountText: {
    width: 28,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: '#8a735f',
  },
  actionsColumn: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  currentActionsColumn: {
    width: 84,
    gap: 4,
  },
  acceptButton: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 5,
    backgroundColor: '#d8a66b',
  },
  acceptButtonPressed: {
    opacity: 0.8,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 5,
    backgroundColor: '#efe2d0',
    borderWidth: 1,
    borderColor: '#d4bea4',
  },
  secondaryButtonPressed: {
    opacity: 0.8,
  },
  acceptButtonText: {
    color: '#2f2015',
    fontWeight: '900',
    fontSize: 10,
  },
  secondaryButtonText: {
    color: '#6a4d2d',
    fontWeight: '800',
    fontSize: 10,
  },
});
