const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const args = new Set(process.argv.slice(2));
const forceDownload = args.has('--force');
const includeMemolonArchive = args.has('--include-memolon-archive');
const extractMemolonEnglish = args.has('--extract-memolon-english');

const ROOT_DIR = path.join(__dirname, '..');
const TARGET_DIR = path.join(ROOT_DIR, 'data', 'source', 'open-lexicon-raw');
const README_PATH = path.join(TARGET_DIR, 'README.md');
const SOURCES_PATH = path.join(TARGET_DIR, 'sources.json');

const SOURCE_SPECS = [
  {
    key: 'openEnglishWordNet',
    name: 'Open English WordNet',
    url: 'https://en-word.net/static/english-wordnet-2024.xml.gz',
    license: 'CC BY 4.0',
    filename: 'open-english-wordnet-2024.xml.gz',
    required: true,
  },
  {
    key: 'pureEmotionLexicon',
    name: 'Pure Emotion Lexicon',
    url: 'https://raw.githubusercontent.com/GiannisHaralabopoulos/Lexicon/master/lexicon.csv',
    license: 'MIT',
    filename: 'pure-emotion-lexicon.csv',
    required: true,
  },
  {
    key: 'memolonOverview',
    name: 'MEmoLon overview',
    url: 'https://zenodo.org/api/records/3756607/files/lexicons_overview.csv/content',
    license: 'CC BY 4.0',
    filename: 'memolon-lexicons-overview.csv',
    required: true,
  },
];

const OPTIONAL_SPECS = [
  {
    key: 'memolonArchive',
    name: 'MEmoLon grouped archive',
    url: 'https://zenodo.org/api/records/3756607/files/MTL_grouped.zip/content',
    license: 'CC BY 4.0',
    filename: 'memolon-mtl-grouped.zip',
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function downloadFile(url, destinationPath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'fortune-cookie-open-fallback-bootstrap/1.0',
        'Accept': '*/*',
      },
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        resolve(downloadFile(response.headers.location, destinationPath));
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Download failed for ${url} with status ${response.statusCode}`));
        return;
      }

      const output = fs.createWriteStream(destinationPath);
      response.pipe(output);
      output.on('finish', () => {
        output.close(() => resolve());
      });
      output.on('error', reject);
    });

    request.on('error', reject);
  });
}

function maybeDownload(spec) {
  const destinationPath = path.join(TARGET_DIR, spec.filename);
  if (!forceDownload && fs.existsSync(destinationPath)) {
    return Promise.resolve({
      ...spec,
      destinationPath,
      downloaded: false,
    });
  }

  return downloadFile(spec.url, destinationPath)
    .then(() => ({
      ...spec,
      destinationPath,
      downloaded: true,
    }));
}

function extractMemolonEnglishTsv() {
  const archivePath = path.join(TARGET_DIR, 'memolon-mtl-grouped.zip');
  const englishPath = path.join(TARGET_DIR, 'memolon-eng.tsv');

  if (!fs.existsSync(archivePath)) {
    throw new Error('Cannot extract memolon-eng.tsv because memolon-mtl-grouped.zip is not present.');
  }

  if (process.platform !== 'win32') {
    throw new Error('Automatic memolon-eng.tsv extraction is currently implemented only on Windows. Extract en.tsv from the archive manually on other platforms.');
  }

  const extractCommand = [
    '$archive = Join-Path (Get-Location) "data\\source\\open-lexicon-raw\\memolon-mtl-grouped.zip"',
    '$target = Join-Path (Get-Location) "data\\source\\open-lexicon-raw\\memolon-eng.tsv"',
    'Add-Type -AssemblyName System.IO.Compression.FileSystem',
    '$zip = [System.IO.Compression.ZipFile]::OpenRead($archive)',
    'try {',
    '  $entry = $zip.Entries | Where-Object { $_.FullName -eq "en.tsv" } | Select-Object -First 1',
    '  if (-not $entry) { throw "Could not find en.tsv inside memolon-mtl-grouped.zip." }',
    '  [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $target, $true)',
    '} finally {',
    '  $zip.Dispose()',
    '}',
  ].join('; ');

  const result = spawnSync('powershell', ['-Command', extractCommand], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'Failed to extract memolon-eng.tsv from archive.');
  }

  return englishPath;
}

function writeMetadata(records) {
  const metadata = {
    generatedAt: new Date().toISOString(),
    sourceFiles: records.map((record) => ({
      name: record.name,
      url: record.url,
      license: record.license,
      localFilename: path.basename(record.destinationPath),
      downloadedThisRun: Boolean(record.downloaded),
    })),
    notes: [
      'These files are vendored raw sources for the offline open fallback vocabulary build.',
      'Runtime does not fetch network data. The app reads only generated local artifacts.',
      'MEmoLon support is optional at build time unless memolon-eng.tsv is extracted locally.',
    ],
  };

  fs.writeFileSync(SOURCES_PATH, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  const lines = [
    '# Open Lexicon Raw Sources',
    '',
    'Vendored local raw files for building the lower-trust open fallback vocabulary.',
    'Runtime never fetches these from the network.',
    '',
    '## Files',
    '',
    ...metadata.sourceFiles.flatMap((record) => [
      `- ${record.localFilename}`,
      `  - source: ${record.name}`,
      `  - url: ${record.url}`,
      `  - license: ${record.license}`,
      `  - downloaded this run: ${record.downloadedThisRun ? 'yes' : 'no'}`,
    ]),
    '',
    '## Optional MEmoLon English extraction',
    '',
    '- The official MEmoLon archive is large. Download it only when you want tertiary signal support from `memolon-eng.tsv`.',
    '- Run `node scripts/bootstrapOpenLexicons.js --include-memolon-archive --extract-memolon-english` on Windows to vendor the archive and extract the English TSV automatically.',
    '- If `memolon-eng.tsv` is absent, the open fallback build still works in reduced mode using WordNet, the Pure Emotion Lexicon, and manual overrides.',
    '',
  ];

  fs.writeFileSync(README_PATH, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  ensureDir(TARGET_DIR);

  const records = [];
  for (const spec of SOURCE_SPECS) {
    try {
      records.push(await maybeDownload(spec));
    } catch (error) {
      if (spec.required) {
        throw error;
      }
    }
  }

  if (includeMemolonArchive) {
    records.push(await maybeDownload(OPTIONAL_SPECS[0]));
  }

  if (extractMemolonEnglish) {
    const extractedPath = extractMemolonEnglishTsv();
    records.push({
      key: 'memolonEnglish',
      name: 'MEmoLon English TSV',
      url: 'https://zenodo.org/api/records/3756607/files/MTL_grouped.zip/content',
      license: 'CC BY 4.0',
      destinationPath: extractedPath,
      downloaded: includeMemolonArchive,
    });
  }

  writeMetadata(records);

  const downloadedCount = records.filter((record) => record.downloaded).length;
  console.log(`Bootstrapped ${records.length} local source file(s). Downloaded ${downloadedCount} in this run.`);
  console.log(`Raw files live in ${path.relative(ROOT_DIR, TARGET_DIR)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
