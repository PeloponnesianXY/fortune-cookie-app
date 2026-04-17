const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REGISTRY_FILE_PATH = path.resolve(__dirname, '../data/fortunes/fortunesRegistry.js');
const CANONICAL_BUCKET_KEYS = [
  'caring',
  'wowed',
  'angry',
  'anxious',
  'embarrassed',
  'calm',
  'confident',
  'confused',
  'distracted',
  'disgusted',
  'emotional',
  'engaged',
  'frustrated',
  'grateful',
  'guilty',
  'happy',
  'hopeful',
  'hungry',
  'jealous',
  'lonely',
  'neutral',
  'numb',
  'proud',
  'romantic',
  'sad',
  'sick',
  'stressed',
  'shaken',
  'tired',
  'unknown',
  'wired',
];
const STORAGE_BUCKET_KEYS = [...CANONICAL_BUCKET_KEYS];

function normalizeStorageBucketKey(bucket) {
  return bucket;
}

function normalizeUiBucketKey(bucket) {
  return bucket;
}

function sortBucketKeys(bucketKeys) {
  return [...bucketKeys].sort((left, right) => {
    const leftIndex = STORAGE_BUCKET_KEYS.indexOf(left);
    const rightIndex = STORAGE_BUCKET_KEYS.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
}

function serializeValue(value, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);
  const childIndent = '  '.repeat(indentLevel + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    return `[\n${value.map((item) => `${childIndent}${serializeValue(item, indentLevel + 1)}`).join(',\n')}\n${indent}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }

    return `{\n${entries.map(([key, item]) => `${childIndent}${key}: ${serializeValue(item, indentLevel + 1)}`).join(',\n')}\n${indent}}`;
  }

  return JSON.stringify(value);
}

function buildRegistrySource({ fortunes, bucketKeys = STORAGE_BUCKET_KEYS }) {
  const nextBucketKeys = sortBucketKeys(bucketKeys);
  const nextFortunes = [...fortunes].sort((left, right) => (
    left.id.localeCompare(right.id)
  ));

  return [
    `const FORTUNE_BUCKET_KEYS = ${serializeValue(nextBucketKeys)};`,
    '',
    `const FORTUNES = ${serializeValue(nextFortunes)};`,
    '',
    'export { FORTUNES, FORTUNE_BUCKET_KEYS };',
    '',
  ].join('\n');
}

function loadRegistryModule() {
  const source = fs.readFileSync(REGISTRY_FILE_PATH, 'utf8');
  const executableSource = source.replace(
    /export\s*\{\s*FORTUNES\s*,\s*FORTUNE_BUCKET_KEYS\s*\};?\s*$/,
    'module.exports = { FORTUNES, FORTUNE_BUCKET_KEYS };'
  );

  const context = {
    module: { exports: {} },
    exports: {},
  };

  vm.runInNewContext(executableSource, context, { filename: REGISTRY_FILE_PATH });
  return context.module.exports;
}

function readRegistry() {
  const registry = loadRegistryModule();
  const bucketKeys = Array.isArray(registry.FORTUNE_BUCKET_KEYS)
    ? registry.FORTUNE_BUCKET_KEYS
    : STORAGE_BUCKET_KEYS;
  const fortunes = Array.isArray(registry.FORTUNES) ? registry.FORTUNES : [];

  return {
    bucketKeys: sortBucketKeys(bucketKeys),
    fortunes: fortunes.map((fortune) => ({
      id: fortune.id,
      text: fortune.text,
      primaryBucket: normalizeStorageBucketKey(fortune.primaryBucket),
      alsoFits: Array.isArray(fortune.alsoFits)
        ? sortBucketKeys(fortune.alsoFits.map((bucket) => normalizeStorageBucketKey(bucket)))
        : [],
      scope: fortune.scope === 'shared' ? 'shared' : 'specific',
    })),
  };
}

function writeRegistry({ fortunes, bucketKeys }) {
  const source = buildRegistrySource({
    fortunes: fortunes.map((fortune) => ({
      id: fortune.id,
      text: fortune.text,
      primaryBucket: normalizeStorageBucketKey(fortune.primaryBucket),
      alsoFits: sortBucketKeys(
        (fortune.alsoFits || []).map((bucket) => normalizeStorageBucketKey(bucket))
      ),
      scope: fortune.scope === 'shared' ? 'shared' : 'specific',
    })),
    bucketKeys,
  });

  fs.writeFileSync(REGISTRY_FILE_PATH, source, 'utf8');
}

function toUiFortune(fortune) {
  return {
    ...fortune,
    primaryBucket: normalizeUiBucketKey(fortune.primaryBucket),
    alsoFits: (fortune.alsoFits || []).map((bucket) => normalizeUiBucketKey(bucket)),
  };
}

module.exports = {
  CANONICAL_BUCKET_KEYS,
  REGISTRY_FILE_PATH,
  STORAGE_BUCKET_KEYS,
  buildRegistrySource,
  normalizeStorageBucketKey,
  normalizeUiBucketKey,
  readRegistry,
  toUiFortune,
  writeRegistry,
};
