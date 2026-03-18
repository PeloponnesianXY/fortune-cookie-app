import fs from 'node:fs';
import path from 'node:path';

const folderArg = process.argv[2];

if (!folderArg) {
  console.error('Usage: node creative-pipeline/scripts/make-contact-sheet.mjs <frames-folder>');
  process.exit(1);
}

const folderPath = path.resolve(folderArg);
const frames = fs.readdirSync(folderPath)
  .filter((file) => /\.png$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Frame Contact Sheet</title>
  <style>
    body { font-family: sans-serif; margin: 24px; background: #f4efe8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
    figure { margin: 0; background: white; padding: 8px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    img { width: 100%; display: block; background: repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 16px 16px; }
    figcaption { font-size: 12px; margin-top: 6px; word-break: break-all; }
  </style>
</head>
<body>
  <h1>Frame Contact Sheet</h1>
  <div class="grid">
    ${frames.map((file) => `<figure><img src="./${file}" alt="${file}"><figcaption>${file}</figcaption></figure>`).join('\n    ')}
  </div>
</body>
</html>`;

const outputPath = path.join(folderPath, 'contact-sheet.html');
fs.writeFileSync(outputPath, html);
console.log(`Wrote ${outputPath}`);
