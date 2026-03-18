import fs from 'node:fs';
import path from 'node:path';

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error('Usage: node creative-pipeline/scripts/validate-cookie-manifest.mjs <manifest.json>');
  process.exit(1);
}

const absolutePath = path.resolve(manifestPath);
const manifest = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

const requiredTopLevel = ['id', 'styleName', 'type', 'states', 'recommendedTiming', 'paperReveal'];
const requiredStates = ['closed', 'cracked', 'open', 'paper'];
const allowedTypes = new Set(['image-sequence', 'lottie', 'static-state']);
const errors = [];

for (const key of requiredTopLevel) {
  if (!(key in manifest)) {
    errors.push(`Missing top-level field: ${key}`);
  }
}

if (manifest.type && !allowedTypes.has(manifest.type)) {
  errors.push(`Unsupported manifest type: ${manifest.type}`);
}

for (const stateKey of requiredStates) {
  if (!manifest.states || !(stateKey in manifest.states)) {
    errors.push(`Missing states.${stateKey}`);
  }
}

if (manifest.frames?.index) {
  const frameIndexPath = path.resolve(path.dirname(absolutePath), '..', manifest.frames.index);
  if (!fs.existsSync(frameIndexPath)) {
    errors.push(`Frame index file not found: ${manifest.frames.index}`);
  }
}

if (typeof manifest.recommendedTiming?.totalDurationMs !== 'number') {
  errors.push('recommendedTiming.totalDurationMs must be a number');
}

if (typeof manifest.paperReveal?.x !== 'number' || typeof manifest.paperReveal?.y !== 'number') {
  errors.push('paperReveal.x and paperReveal.y must be numbers');
}

if (errors.length > 0) {
  console.error(`Manifest invalid: ${absolutePath}`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Manifest valid: ${absolutePath}`);
