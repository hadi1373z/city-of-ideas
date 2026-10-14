# Math reader release checks

Run `node tests/math-reader-locale/test.mjs` from the repository root. This portable check reads the installed adapted reader, classic locale script and original Math monitor from `../../src/city-source-assets/home-tools/`. It uses only synthetic DOM/parent/state fixtures; no browser account, network, API, paid inference or private saved data is accessed.

It checks the canonical raw reader hash, exact untouched catalogue JSON (**131 profiles / 49 expanded / 181 connections / 13 lenses / 20 publications**), installed asset hashes, measured public short/UI coverage, bilingual labels/attributes, unchanged notes/answers/history/imported text/input values/caret, exact trusted-parent origin gate and public-only relay into the original opaque sandbox. It starts no renderer or original walking loop.

The public fixtures and dictionary are stored here for CI; they have no original workspace paths. `fixture-provenance.json` hashes each input. `coverage.json` lists the measured rendered strings and deliberate exceptions. **220 of 398 full authored article paragraphs retain their original English**; archived English Markdown and truncated article search excerpts are also retained. All 131 names/short biographies, 493 profile descriptions/questions, 188 section headings, 363 connection literals and 191 lens literals are mapped. This test is source/contract evidence and does not replace live visual or screen-reader acceptance.

The integration preparation/installer is intentionally separate. Root may add this `test.mjs` path to `tools/check.cjs` after installing the reviewed reader assets; no ignored integration directory is required for this CI entry point.
