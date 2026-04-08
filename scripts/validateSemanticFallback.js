const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const rootDir = path.join(__dirname, '..');
  const semanticModule = await import(pathToFileURL(
    path.join(rootDir, 'utils', 'semanticFallback.js')
  ).href);
  const snapshotModule = await import(pathToFileURL(
    path.join(rootDir, 'data', 'vendor', 'moodSynonymSnapshot.js')
  ).href);

  const { getSemanticFallbackMatch } = semanticModule;
  const { BUCKET_VOCAB } = snapshotModule;

  const handcraftedLookup = Object.fromEntries(
    Object.entries(BUCKET_VOCAB).flatMap(([bucket, words]) => (
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
    const lexicalBucket = handcraftedLookup[input] || null;
    const semanticResult = lexicalBucket ? null : getSemanticFallbackMatch(input);

    return {
      input,
      source: lexicalBucket ? 'handcrafted' : (semanticResult?.accepted ? 'embedding_fallback' : 'unknown'),
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
