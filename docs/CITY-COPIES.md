# Four named city copies

The four entries in `city-copies.json` publish at their own GitHub Pages paths:
`city-of-questions/`, `city-of-connections/`, `city-of-human-life/` and
`city-of-transformations/`. `city-copies/` is the comparison directory.

These begin as named playable copies of the existing city, not completed
implementations of the concept-map redesigns. Every copy pins its public source
to commit `944f69d4be1f7af55a64ba0feacc44d9e9f86955`. Future main-city changes
do not change this baseline. Each entry can later select its own source commit.

The build extracts only that commit's public `src` tree into one immutable
`_city-baselines/<sha>/` directory, retaining complete assets, credits and fixed
voices. The four HTML entries resolve original scripts, modules, images, films,
readers and version information against it using an early relative base URL.
Only the displayed city identity is overridden. There is no redirect or iframe
around the game. The original root entry remains byte-for-byte unchanged.

All entries remain on the existing GitHub Pages origin. The current private
connections, notes and browser progress retain their established storage keys;
this does not duplicate, export or migrate personal data. The existing private
guestbook works from the same origin. Future independent progress or content
changes should be deliberate, rather than silently rewriting existing saves.

Full Git history is fetched in the Pages workflow so the pinned source is
available. The complete release manifest includes the baseline and every copy.
`tests/city-copies.cjs` checks immutable pins, names, URL resolution, packaging,
language changes and preservation of the main entry. Browser checks are separate.
