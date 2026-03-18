import fs from 'node:fs';
import path from 'node:path';

const folderArg = process.argv[2];
const fpsArg = Number.parseInt(process.argv[3] || '12', 10);

if (!folderArg) {
  console.error('Usage: node creative-pipeline/scripts/generate-frame-index.mjs <frames-folder> [fps]');
  process.exit(1);
}

const folderPath = path.resolve(folderArg);
const files = fs.readdirSync(folderPath)
  .filter((file) => /\.png$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const frameDurationMs = Math.round(1000 / fpsArg);
const frames = files.map((file, index) => ({
  index,
  file,
  durationMs: frameDurationMs,
}));

const output = {
  generatedAt: new Date().toISOString(),
  fps: fpsArg,
  frames,
};

const outputPath = path.join(folderPath, 'frame-index.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${outputPath} with ${frames.length} frame(s).`);
