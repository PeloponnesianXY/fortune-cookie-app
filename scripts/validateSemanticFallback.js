const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const rootDir = path.join(__dirname, '..');
  const semanticModule = await import(pathToFileURL(
    path.join(rootDir, 'utils', 'semanticFallback.js')
  ).href);
  const snapshotModule = await import(pathToFileURL(
    path.join(rootDir, 'data', 'runtime', 'moodVocabularyRuntimeWrapper.js')
  ).href);

  const { analyzeSemanticFallbackInput } = semanticModule;
  const { DETERMINISTIC_BUCKET_WORDS } = snapshotModule;

  const deterministicLookup = Object.fromEntries(
    Object.entries(DETERMINISTIC_BUCKET_WORDS).flatMap(([bucket, words]) => (
      words.map((word) => [word, bucket])
    ))
  );

  const samples = [
    'happy',
    'giddy',
    'hopeful',
    'great',
    'gutted',
    'shattered',
    'unnerved',
    'adrift',
    'deflated',
    'wrecked',
    'fraught',
    'desolate',
    'unmoored',
    'haggard',
    'raw',
  ];

  const rows = samples.map((input) => {
    const lexicalBucket = deterministicLookup[input] || null;
    const semanticResult = lexicalBucket ? null : analyzeSemanticFallbackInput(input);

    return {
      input,
      source: lexicalBucket ? 'deterministic' : (semanticResult?.accepted ? 'vector_suggestion' : 'unknown'),
      bucket: lexicalBucket || semanticResult?.bucket || 'unknown',
      semanticResult: semanticResult || null,
    };
  });

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
