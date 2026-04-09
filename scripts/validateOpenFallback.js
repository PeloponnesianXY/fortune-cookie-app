const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const rootDir = path.join(__dirname, '..');
  const logicModule = await import(pathToFileURL(
    path.join(rootDir, 'utils', 'fortuneLogic.js')
  ).href);

  const { analyzeMoodInput } = logicModule;
  const samples = [
    'despondent',
    'downhearted',
    'ill',
    'unwell',
    'unremarkable',
    'wistful',
    'rundown',
    'worried',
    'giddy',
    'xyzzymood',
  ];

  const rows = samples.map((input) => {
    const analysis = analyzeMoodInput(input);
    return {
      input,
      source: analysis.source,
      bucket: analysis.primaryEmotion,
      handcrafted: analysis.lab?.handcrafted?.bucket || 'unknown',
      openFallback: analysis.lab?.openFallback?.bucket || 'unknown',
      semantic: analysis.lab?.semantic?.bucket || 'unknown',
    };
  });

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
