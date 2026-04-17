import { SEMANTIC_FALLBACK_DATA } from '../../data/semanticLab/semanticFallbackData';

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function roundSemanticValue(value) {
  return Math.round(value * 1000) / 1000;
}

function getBucketScore(inputVector, bucket, prototype) {
  const prototypeScore = cosineSimilarity(inputVector, prototype);
  const anchorEntries = SEMANTIC_FALLBACK_DATA.bucketAnchors?.[bucket] || [];
  const bestAnchorScore = anchorEntries.reduce((bestScore, entry) => (
    Math.max(bestScore, cosineSimilarity(inputVector, entry.vector))
  ), 0);

  if (!anchorEntries.length) {
    return prototypeScore;
  }

  return (prototypeScore * 0.65) + (bestAnchorScore * 0.35);
}

function analyzeSemanticFallbackInput(normalizedInput) {
  if (!normalizedInput || normalizedInput.includes(' ')) {
    return {
      accepted: false,
      bucket: null,
      debug: null,
      reason: 'invalid-input',
    };
  }

  if (normalizedInput.length < SEMANTIC_FALLBACK_DATA.settings.minInputLength) {
    return {
      accepted: false,
      bucket: null,
      debug: null,
      reason: 'too-short',
    };
  }

  if ((SEMANTIC_FALLBACK_DATA.settings.rejectWords || []).includes(normalizedInput)) {
    return {
      accepted: false,
      bucket: null,
      debug: null,
      reason: 'filtered-nonmood',
    };
  }

  const inputVector = SEMANTIC_FALLBACK_DATA.inputVectors[normalizedInput];
  if (!inputVector) {
    return {
      accepted: false,
      bucket: null,
      debug: null,
      reason: 'no-vector',
    };
  }

  const rankedBuckets = Object.entries(SEMANTIC_FALLBACK_DATA.bucketPrototypes)
    .map(([bucket, prototype]) => ({
      bucket,
      score: getBucketScore(inputVector, bucket, prototype),
    }))
    .sort((left, right) => right.score - left.score || left.bucket.localeCompare(right.bucket));

  const [best, runnerUp] = rankedBuckets;
  if (!best) {
    return null;
  }

  const bestScore = roundSemanticValue(best.score);
  const runnerUpScore = roundSemanticValue(runnerUp?.score || 0);
  const margin = roundSemanticValue(bestScore - runnerUpScore);
  const debug = {
    bestBucket: best.bucket,
    bestScore,
    runnerUpBucket: runnerUp?.bucket || null,
    runnerUpScore,
    margin,
  };

  if (bestScore < SEMANTIC_FALLBACK_DATA.settings.minSimilarity) {
    return {
      accepted: false,
      bucket: best.bucket,
      debug,
      reason: 'below-threshold',
    };
  }

  if (margin < SEMANTIC_FALLBACK_DATA.settings.minMargin) {
    return {
      accepted: false,
      bucket: best.bucket,
      debug,
      reason: 'below-margin',
    };
  }

  return {
    accepted: true,
    bucket: best.bucket,
    confidence: bestScore,
    debug,
  };
}

export {
  analyzeSemanticFallbackInput,
};
