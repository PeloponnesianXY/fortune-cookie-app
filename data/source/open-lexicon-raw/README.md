# Open Lexicon Raw Sources

Vendored local raw files for building the lower-trust open fallback vocabulary.
Runtime never fetches these from the network.

## Files

- open-english-wordnet-2024.xml.gz
  - source: Open English WordNet
  - url: https://en-word.net/static/english-wordnet-2024.xml.gz
  - license: CC BY 4.0
  - downloaded this run: yes
- pure-emotion-lexicon.csv
  - source: Pure Emotion Lexicon
  - url: https://raw.githubusercontent.com/GiannisHaralabopoulos/Lexicon/master/lexicon.csv
  - license: MIT
  - downloaded this run: yes
- memolon-lexicons-overview.csv
  - source: MEmoLon overview
  - url: https://zenodo.org/api/records/3756607/files/lexicons_overview.csv/content
  - license: CC BY 4.0
  - downloaded this run: yes

## Optional MEmoLon English extraction

- The official MEmoLon archive is large. Download it only when you want tertiary signal support from `memolon-eng.tsv`.
- Run `node scripts/bootstrapOpenLexicons.js --include-memolon-archive --extract-memolon-english` on Windows to vendor the archive and extract the English TSV automatically.
- If `memolon-eng.tsv` is absent, the open fallback build still works in reduced mode using WordNet, the Pure Emotion Lexicon, and manual overrides.

