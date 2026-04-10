const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pathToFileURL } = require('url');

const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'data', 'source', 'open-lexicon-raw');
const OUTPUT_PATH = path.join(ROOT_DIR, 'data', 'runtime', 'moodBucketVocabulary.js');
const OVERRIDES_PATH = path.join(ROOT_DIR, 'data', 'build', 'openFallbackOverrides.json');

const WORDNET_PATH = path.join(RAW_DIR, 'open-english-wordnet-2024.xml.gz');
const PURE_LEXICON_PATH = path.join(RAW_DIR, 'pure-emotion-lexicon.csv');
const MEMOLON_ENGLISH_PATH = path.join(RAW_DIR, 'memolon-eng.tsv');

const MIN_ACCEPT_SCORE = 3.5;
const MIN_MARGIN = 0.5;
const MAX_BUCKET_EVIDENCE_GAPLESS = 1;
const AUTO_ACCEPT_BUCKETS = new Set([
  'wowed',
  'angry',
  'anxious',
  'embarrassed',
  'calm',
  'confused',
  'distracted',
  'disgusted',
  'frustrated',
  'grateful',
  'guilty',
  'happy',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'caring',
  'neutral',
  'numb',
  'proud',
  'sad',
  'sick',
  'stressed',
  'shaken',
  'tired',
  'wired',
]);
const WORDNET_ONLY_OK_BUCKETS = new Set([
  'wowed',
  'anxious',
  'embarrassed',
  'calm',
  'confused',
  'distracted',
  'disgusted',
  'frustrated',
  'grateful',
  'guilty',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'neutral',
  'numb',
  'stressed',
  'shaken',
  'tired',
  'wired',
]);
const PURE_EMOTION_KEYS = ['anticipation', 'joy', 'trust', 'fear', 'sadness', 'disgust', 'anger', 'surprise'];

const BUCKET_COMPATIBILITY = {
  wowed: {
    pure: ['surprise', 'joy'],
    memolonEmotions: ['surprise', 'joy'],
    memolon: { valenceMin: 0.52, arousalMin: 0.5 },
  },
  angry: {
    pure: ['anger'],
    memolonEmotions: ['anger'],
    memolon: { arousalMin: 0.55, valenceMax: 0.48 },
  },
  anxious: {
    pure: ['fear'],
    memolonEmotions: ['fear'],
    memolon: { arousalMin: 0.52, valenceMax: 0.5 },
  },
  embarrassed: {
    pure: ['fear', 'sadness'],
    memolonEmotions: ['fear', 'sadness'],
    memolon: { valenceMax: 0.52 },
  },
  calm: {
    pure: ['trust'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.52, arousalMax: 0.48 },
  },
  confused: {
    pure: ['surprise', 'fear'],
    memolonEmotions: ['fear', 'surprise'],
  },
  distracted: {
    pure: [],
    memolonEmotions: [],
  },
  disgusted: {
    pure: ['disgust'],
    memolonEmotions: ['disgust'],
    memolon: { valenceMax: 0.46 },
  },
  frustrated: {
    pure: ['anger'],
    memolonEmotions: ['anger', 'sadness'],
    memolon: { arousalMin: 0.5, valenceMax: 0.5 },
  },
  grateful: {
    pure: ['trust', 'joy'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.58 },
  },
  guilty: {
    pure: ['sadness', 'fear'],
    memolonEmotions: ['sadness', 'fear'],
    memolon: { valenceMax: 0.48 },
  },
  happy: {
    pure: ['joy'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.6, arousalMin: 0.45 },
  },
  hopeful: {
    pure: ['anticipation', 'joy', 'trust'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.56 },
  },
  hungry: {
    pure: [],
    memolonEmotions: [],
  },
  jealous: {
    pure: ['anger'],
    memolonEmotions: ['anger', 'sadness'],
    memolon: { valenceMax: 0.5 },
  },
  lonely: {
    pure: ['sadness'],
    memolonEmotions: ['sadness'],
    memolon: { valenceMax: 0.5 },
  },
  caring: {
    pure: ['trust', 'joy'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.58 },
  },
  neutral: {
    pure: [],
    memolonEmotions: [],
    memolon: { valenceMin: 0.45, valenceMax: 0.58, arousalMax: 0.5 },
  },
  numb: {
    pure: ['sadness'],
    memolonEmotions: ['sadness'],
    memolon: { arousalMax: 0.48 },
  },
  proud: {
    pure: ['joy', 'trust'],
    memolonEmotions: ['joy'],
    memolon: { valenceMin: 0.6 },
  },
  sad: {
    pure: ['sadness'],
    memolonEmotions: ['sadness'],
    memolon: { valenceMax: 0.48 },
  },
  sick: {
    pure: ['disgust'],
    memolonEmotions: ['disgust', 'sadness'],
    memolon: { valenceMax: 0.48 },
  },
  stressed: {
    pure: ['fear'],
    memolonEmotions: ['fear', 'anger'],
    memolon: { arousalMin: 0.55, valenceMax: 0.5 },
  },
  shaken: {
    pure: ['surprise'],
    memolonEmotions: ['surprise'],
    memolon: { arousalMin: 0.5 },
  },
  tired: {
    pure: ['sadness'],
    memolonEmotions: ['sadness'],
    memolon: { arousalMax: 0.5 },
  },
  wired: {
    pure: ['anticipation'],
    memolonEmotions: ['fear', 'joy'],
    memolon: { arousalMin: 0.62 },
  },
};

function normalizeWord(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z]+/g, ' ');
}

function normalizeCandidate(value) {
  const normalized = normalizeWord(value).replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.includes(' ')) {
    return null;
  }

  if (!/^[a-z]+$/.test(normalized)) {
    return null;
  }

  if (normalized.length < 3) {
    return null;
  }

  return normalized;
}

function csvSplit(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseOpenEnglishWordNet(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      lemmaToSynsets: new Map(),
      synsetToLemmas: new Map(),
      senseToLemma: new Map(),
      derivationTargets: new Map(),
    };
  }

  const xml = zlib.gunzipSync(fs.readFileSync(filePath)).toString('utf8');
  const entryPattern = /<LexicalEntry id="([^"]+)">([\s\S]*?)<\/LexicalEntry>/g;
  const lemmaToSynsets = new Map();
  const synsetToLemmas = new Map();
  const senseToLemma = new Map();
  const derivationTargets = new Map();

  for (const match of xml.matchAll(entryPattern)) {
    const entryBody = match[2];
    const lemmaMatch = entryBody.match(/<Lemma writtenForm="([^"]+)"/);
    if (!lemmaMatch) {
      continue;
    }

    const normalizedLemma = normalizeCandidate(lemmaMatch[1]);
    if (!normalizedLemma) {
      continue;
    }

    const sensePattern = /<Sense id="([^"]+)" synset="([^"]+)">([\s\S]*?)<\/Sense>|<Sense id="([^"]+)" synset="([^"]+)"\s*\/>/g;
    for (const senseMatch of entryBody.matchAll(sensePattern)) {
      const senseId = senseMatch[1] || senseMatch[4];
      const synsetId = senseMatch[2] || senseMatch[5];
      const senseBody = senseMatch[3] || '';

      if (!senseId || !synsetId) {
        continue;
      }

      senseToLemma.set(senseId, normalizedLemma);

      if (!lemmaToSynsets.has(normalizedLemma)) {
        lemmaToSynsets.set(normalizedLemma, new Set());
      }
      lemmaToSynsets.get(normalizedLemma).add(synsetId);

      if (!synsetToLemmas.has(synsetId)) {
        synsetToLemmas.set(synsetId, new Set());
      }
      synsetToLemmas.get(synsetId).add(normalizedLemma);

      for (const relationMatch of senseBody.matchAll(/<SenseRelation relType="([^"]+)" target="([^"]+)"/g)) {
        if (relationMatch[1] !== 'derivation') {
          continue;
        }

        if (!derivationTargets.has(senseId)) {
          derivationTargets.set(senseId, new Set());
        }

        derivationTargets.get(senseId).add(relationMatch[2]);
      }
    }
  }

  return {
    lemmaToSynsets,
    synsetToLemmas,
    senseToLemma,
    derivationTargets,
  };
}

function parsePureEmotionLexicon(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return new Map();
  }

  const header = csvSplit(lines[0]).map((value) => value.trim().toLowerCase());
  const columnIndex = Object.fromEntries(header.map((value, index) => [value, index]));
  const termsIndex = columnIndex.terms;

  const scoreKeys = header.filter((value) => (
    value
    && !['', 'stem', 'terms', 'total'].includes(value)
  ));

  const lexicon = new Map();

  for (const line of lines.slice(1)) {
    const values = csvSplit(line);
    const terms = (values[termsIndex] || '').split(/\s+/).map(normalizeCandidate).filter(Boolean);
    if (terms.length === 0) {
      continue;
    }

    const scores = Object.fromEntries(scoreKeys.map((key) => [key, Number(values[columnIndex[key]] || 0)]));

    for (const term of terms) {
      const current = lexicon.get(term) || {};
      for (const key of scoreKeys) {
        current[key] = Math.max(current[key] || 0, scores[key] || 0);
      }
      lexicon.set(term, current);
    }
  }

  return lexicon;
}

function parseMemolonEnglish(filePath) {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return new Map();
  }

  const header = lines[0].split('\t').map((value) => value.trim().toLowerCase());
  const columnIndex = Object.fromEntries(header.map((value, index) => [value, index]));
  const lexicon = new Map();

  for (const line of lines.slice(1)) {
    const values = line.split('\t');
    const word = normalizeCandidate(values[columnIndex.word]);
    if (!word) {
      continue;
    }

    lexicon.set(word, {
      valence: Number(values[columnIndex.valence] || 0),
      arousal: Number(values[columnIndex.arousal] || 0),
      dominance: Number(values[columnIndex.dominance] || 0),
      joy: Number(values[columnIndex.joy] || 0),
      anger: Number(values[columnIndex.anger] || 0),
      sadness: Number(values[columnIndex.sadness] || 0),
      fear: Number(values[columnIndex.fear] || 0),
      disgust: Number(values[columnIndex.disgust] || 0),
      surprise: Number(values[columnIndex.surprise] || 0),
    });
  }

  return lexicon;
}

function getWordNetCandidateEvidence(seed, wordnetData) {
  const evidence = new Map();
  const synsets = wordnetData.lemmaToSynsets.get(seed);
  if (!synsets) {
    return evidence;
  }

  for (const synsetId of synsets) {
    const lemmas = wordnetData.synsetToLemmas.get(synsetId) || new Set();
    for (const lemma of lemmas) {
      if (lemma === seed) {
        continue;
      }

      const entry = evidence.get(lemma) || {
        wordnetSynonymSeeds: new Set(),
        wordnetDerivationSeeds: new Set(),
      };
      entry.wordnetSynonymSeeds.add(seed);
      evidence.set(lemma, entry);
    }
  }

  for (const [senseId, targetSenseIds] of wordnetData.derivationTargets.entries()) {
    if (wordnetData.senseToLemma.get(senseId) !== seed) {
      continue;
    }

    for (const targetSenseId of targetSenseIds) {
      const targetLemma = wordnetData.senseToLemma.get(targetSenseId);
      if (!targetLemma || targetLemma === seed) {
        continue;
      }

      const entry = evidence.get(targetLemma) || {
        wordnetSynonymSeeds: new Set(),
        wordnetDerivationSeeds: new Set(),
      };
      entry.wordnetDerivationSeeds.add(seed);
      evidence.set(targetLemma, entry);
    }
  }

  return evidence;
}

function getPureLexiconScore(bucket, pureScores) {
  if (!pureScores) {
    return 0;
  }

  const compatibleKeys = BUCKET_COMPATIBILITY[bucket]?.pure || [];
  if (compatibleKeys.length === 0) {
    return 0;
  }

  const compatibleScore = compatibleKeys.reduce((total, key) => total + (pureScores[key] || 0), 0);
  const incompatibleScore = PURE_EMOTION_KEYS
    .filter((key) => !compatibleKeys.includes(key))
    .reduce((best, key) => Math.max(best, pureScores[key] || 0), 0);

  if (compatibleScore <= 0) {
    return 0;
  }

  if (incompatibleScore > compatibleScore) {
    return 0;
  }

  return compatibleScore >= 2 ? 1.25 : 0.75;
}

function getMemolonScore(bucket, memolonScores) {
  if (!memolonScores) {
    return 0;
  }

  const compatibility = BUCKET_COMPATIBILITY[bucket];
  if (!compatibility) {
    return 0;
  }

  let score = 0;
  const emotionKeys = compatibility.memolonEmotions || [];
  const emotionSupport = emotionKeys.reduce((total, key) => total + (memolonScores[key] || 0), 0);

  if (emotionSupport >= 1.2) {
    score += 0.75;
  } else if (emotionSupport >= 0.7) {
    score += 0.35;
  }

  const range = compatibility.memolon;
  if (range) {
    const passesRange = (
      (range.valenceMin === undefined || memolonScores.valence >= range.valenceMin)
      && (range.valenceMax === undefined || memolonScores.valence <= range.valenceMax)
      && (range.arousalMin === undefined || memolonScores.arousal >= range.arousalMin)
      && (range.arousalMax === undefined || memolonScores.arousal <= range.arousalMax)
    );

    if (passesRange) {
      score += 0.5;
    }
  }

  return score;
}

function isPlausibleInputWord(word) {
  if (!word) {
    return false;
  }

  if (word.length < 3 || word.length > 16) {
    return false;
  }

  if (/ly$/.test(word) && word.length > 6) {
    return false;
  }

  if (/ness$/.test(word) || /tion$/.test(word) || /ment$/.test(word) || /ity$/.test(word)) {
    return false;
  }

  if (/ship$/.test(word) || /hood$/.test(word) || /ism$/.test(word) || /ist$/.test(word)) {
    return false;
  }

  if (/less$/.test(word) && word.length > 8) {
    return false;
  }

  return true;
}

function scoreCandidate(bucket, candidate, evidence, pureLexicon, memolonLexicon) {
  let score = 0;

  const synonymSeedCount = evidence.wordnetSynonymSeeds.size;
  const derivationSeedCount = evidence.wordnetDerivationSeeds.size;

  score += synonymSeedCount * 4;
  score += derivationSeedCount * 1.5;

  if (synonymSeedCount > 1) {
    score += (synonymSeedCount - 1) * 0.5;
  }

  score += getPureLexiconScore(bucket, pureLexicon.get(candidate));
  score += getMemolonScore(bucket, memolonLexicon.get(candidate));

  return Math.round(score * 100) / 100;
}

function hasExtraSupport(bucket, candidate, evidence, pureLexicon, memolonLexicon) {
  const pureScore = getPureLexiconScore(bucket, pureLexicon.get(candidate));
  const memolonScore = getMemolonScore(bucket, memolonLexicon.get(candidate));

  if (!AUTO_ACCEPT_BUCKETS.has(bucket)) {
    return memolonScore > 0;
  }

  if (pureScore > 0 || memolonScore > 0) {
    return true;
  }

  if (WORDNET_ONLY_OK_BUCKETS.has(bucket)) {
    return (
      evidence.wordnetSynonymSeeds.size >= 1
      || evidence.wordnetDerivationSeeds.size >= 1
    );
  }

  return (
    evidence.wordnetSynonymSeeds.size >= 2
    || evidence.wordnetDerivationSeeds.size >= 2
  );
}

function getEmptyBucketMap(bucketKeys) {
  return Object.fromEntries(bucketKeys.map((bucket) => [bucket, []]));
}

function buildOutputModule(payload) {
  return `// Repo-local handcrafted bucket vocabulary for mood routing.
// Source references:
// - WordNet 3.0 license text (Princeton / OSI-approved WordNet license)
// - zaibacu/thesaurus format notes: WordNet-derived English thesaurus in JSONL form
//
// This file is intentionally static and bucketed for product use. The app should only
// read these local tables at runtime, never perform live synonym lookups.

const SYNONYM_SNAPSHOT_META = ${JSON.stringify(payload.handcraftedMeta, null, 2)};

// Canonical handcrafted bucket vocabulary for mood routing.
// Each bucket owns one flat accepted-input list.
const BUCKET_VOCAB = ${JSON.stringify(payload.handcraftedVocab, null, 2)};

// Offline-generated lower-trust exact-match fallback vocabulary.
// Handcrafted BUCKET_VOCAB remains the source of truth and always routes first.
const OPEN_FALLBACK_META = ${JSON.stringify(payload.meta, null, 2)};

const OPEN_FALLBACK_VOCAB = ${JSON.stringify(payload.vocab, null, 2)};

export {
  BUCKET_VOCAB,
  OPEN_FALLBACK_META,
  OPEN_FALLBACK_VOCAB,
  SYNONYM_SNAPSHOT_META,
};
`;
}

async function main() {
  const runtimeModule = await import(pathToFileURL(
    path.join(ROOT_DIR, 'data', 'runtime', 'moodBucketVocabulary.js')
  ).href);

  const { BUCKET_VOCAB, SYNONYM_SNAPSHOT_META } = runtimeModule;
  const overrides = loadJson(OVERRIDES_PATH);
  const wordnetData = parseOpenEnglishWordNet(WORDNET_PATH);
  const pureLexicon = parsePureEmotionLexicon(PURE_LEXICON_PATH);
  const memolonLexicon = parseMemolonEnglish(MEMOLON_ENGLISH_PATH);

  const bucketKeys = Object.keys(BUCKET_VOCAB);
  const handcraftedByBucket = Object.fromEntries(
    bucketKeys.map((bucket) => [
      bucket,
      new Set((BUCKET_VOCAB[bucket] || []).map(normalizeCandidate).filter(Boolean)),
    ])
  );
  const handcraftedGlobal = new Set(
    Object.values(BUCKET_VOCAB).flat().map(normalizeCandidate).filter(Boolean)
  );
  const globalDeny = new Set((overrides.globalDeny || []).map(normalizeCandidate).filter(Boolean));
  const denyByBucket = Object.fromEntries(
    bucketKeys.map((bucket) => [
      bucket,
      new Set(((overrides.denyByBucket || {})[bucket] || []).map(normalizeCandidate).filter(Boolean)),
    ])
  );
  const allowByBucket = Object.fromEntries(
    bucketKeys.map((bucket) => [
      bucket,
      new Set(((overrides.allowByBucket || {})[bucket] || []).map(normalizeCandidate).filter(Boolean)),
    ])
  );

  const candidateScores = new Map();

  for (const [bucket, words] of Object.entries(BUCKET_VOCAB)) {
    if (bucket === 'unknown') {
      continue;
    }

    const seenCandidates = new Map();
    for (const seed of words.map(normalizeCandidate).filter(Boolean)) {
      const evidenceMap = getWordNetCandidateEvidence(seed, wordnetData);
      for (const [candidate, evidence] of evidenceMap.entries()) {
        const existing = seenCandidates.get(candidate) || {
          wordnetSynonymSeeds: new Set(),
          wordnetDerivationSeeds: new Set(),
        };

        evidence.wordnetSynonymSeeds.forEach((value) => existing.wordnetSynonymSeeds.add(value));
        evidence.wordnetDerivationSeeds.forEach((value) => existing.wordnetDerivationSeeds.add(value));
        seenCandidates.set(candidate, existing);
      }
    }

    for (const [candidate, evidence] of seenCandidates.entries()) {
      if (!isPlausibleInputWord(candidate)) {
        continue;
      }

      if (handcraftedGlobal.has(candidate)) {
        continue;
      }

      if (globalDeny.has(candidate) || denyByBucket[bucket].has(candidate)) {
        continue;
      }

      const bucketMap = candidateScores.get(candidate) || {};
      bucketMap[bucket] = {
        score: scoreCandidate(bucket, candidate, evidence, pureLexicon, memolonLexicon),
        evidence,
      };
      candidateScores.set(candidate, bucketMap);
    }
  }

  const outputVocab = getEmptyBucketMap(bucketKeys);
  const rejections = [];

  for (const [candidate, bucketMap] of candidateScores.entries()) {
    const ranked = Object.entries(bucketMap)
      .map(([bucket, info]) => ({ bucket, score: info.score, evidence: info.evidence }))
      .sort((left, right) => right.score - left.score || left.bucket.localeCompare(right.bucket));

    const [best, runnerUp] = ranked;
    if (!best) {
      continue;
    }

    const margin = best.score - (runnerUp?.score || 0);
    if (best.score < MIN_ACCEPT_SCORE) {
      rejections.push({ candidate, reason: 'below-threshold', bestBucket: best.bucket, bestScore: best.score });
      continue;
    }

    if (!hasExtraSupport(best.bucket, candidate, best.evidence, pureLexicon, memolonLexicon)) {
      rejections.push({
        candidate,
        reason: 'wordnet-only',
        bestBucket: best.bucket,
        bestScore: best.score,
      });
      continue;
    }

    if (runnerUp && margin < MIN_MARGIN) {
      rejections.push({
        candidate,
        reason: 'ambiguous',
        bestBucket: best.bucket,
        bestScore: best.score,
        runnerUpBucket: runnerUp.bucket,
        runnerUpScore: runnerUp.score,
      });
      continue;
    }

    const nonTrivialBuckets = ranked.filter((entry) => entry.score >= MIN_ACCEPT_SCORE - MAX_BUCKET_EVIDENCE_GAPLESS);
    if (nonTrivialBuckets.length > 2) {
      rejections.push({
        candidate,
        reason: 'too-many-compatible-buckets',
        bestBucket: best.bucket,
        bestScore: best.score,
      });
      continue;
    }

    outputVocab[best.bucket].push(candidate);
  }

  for (const [bucket, allowSet] of Object.entries(allowByBucket)) {
    for (const candidate of allowSet) {
      if (!candidate || handcraftedGlobal.has(candidate) || globalDeny.has(candidate) || denyByBucket[bucket].has(candidate)) {
        continue;
      }

      outputVocab[bucket].push(candidate);
    }
  }

  for (const bucket of bucketKeys) {
    if (bucket === 'unknown') {
      outputVocab[bucket] = [];
      continue;
    }

    outputVocab[bucket] = [...new Set(outputVocab[bucket])].sort();
  }

  const meta = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceFilesUsed: {
      wordNet: fs.existsSync(WORDNET_PATH),
      pureEmotionLexicon: fs.existsSync(PURE_LEXICON_PATH),
      memolonEnglish: fs.existsSync(MEMOLON_ENGLISH_PATH),
    },
    acceptance: {
      minAcceptScore: MIN_ACCEPT_SCORE,
      minMargin: MIN_MARGIN,
      note: 'WordNet proposes candidates; Pure Emotion Lexicon and optional MEmoLon add only conservative fit signals.',
    },
    countsByBucket: Object.fromEntries(bucketKeys.map((bucket) => [bucket, outputVocab[bucket].length])),
    rejectedCandidateCount: rejections.length,
  };

  fs.writeFileSync(OUTPUT_PATH, buildOutputModule({
    handcraftedMeta: SYNONYM_SNAPSHOT_META,
    handcraftedVocab: BUCKET_VOCAB,
    meta,
    vocab: outputVocab,
  }), 'utf8');

  console.log(JSON.stringify({
    generatedBuckets: meta.countsByBucket,
    sourceFilesUsed: meta.sourceFilesUsed,
    sampleAccepted: Object.fromEntries(
      Object.entries(outputVocab)
        .filter(([, words]) => words.length > 0)
        .slice(0, 8)
        .map(([bucket, words]) => [bucket, words.slice(0, 6)])
    ),
    sampleRejected: rejections.slice(0, 12),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
