import fs from 'node:fs';
import path from 'node:path';

const sourceDirArg = process.argv[2];
const packId = process.argv[3] || 'classic-cookie';
const targetRoot = path.resolve('assets/cookie/generated');

if (!sourceDirArg) {
  console.error('Usage: node creative-pipeline/scripts/normalize-cookie-assets.mjs <source-dir> [pack-id]');
  process.exit(1);
}

const sourceDir = path.resolve(sourceDirArg);
const expectedFiles = {
  closed: `${packId}-closed.png`,
  cracked: `${packId}-cracked.png`,
  open: `${packId}-open.png`,
  paper: `${packId}-paper.png`,
};

for (const [state, fileName] of Object.entries(expectedFiles)) {
  const src = path.join(sourceDir, fileName);
  if (!fs.existsSync(src)) {
    console.warn(`Skipping missing file: ${src}`);
    continue;
  }

  const targetDir = path.join(targetRoot, state);
  fs.mkdirSync(targetDir, { recursive: true });
  const dest = path.join(targetDir, fileName);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}
