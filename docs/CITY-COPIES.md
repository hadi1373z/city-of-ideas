# City editions

The original four copies now publish at `edition_questions/`, `edition_connections/`,
`edition_human_life/` and `edition_transformations/`. The initial city-of-* addresses
remain working aliases. `editions/` and `city-copies/` list all seven entries.

These begin as named playable copies of the existing city, not completed
implementations of the concept-map redesigns. Every copy pins its public source
to commit `944f69d4be1f7af55a64ba0feacc44d9e9f86955`. Future main-city changes
do not change this baseline. Each entry can later select its own source commit.

The build extracts only that commit's public `src` tree into one immutable
`_city-baselines/<sha>/` directory, retaining complete assets, credits and fixed
voices. The edition HTML entries resolve original scripts, modules, images, films,
readers and version information against it using an early relative base URL.
The initial four override only the displayed city identity. There is no redirect or iframe
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

## Three focused experiences

`edition_math_learning/` starts at the Proof Atelier and offers an optional Math journey through its six workshops/twelve deeper problems, the Library–Workshop–Dialogue counterexample investigation and the original paper gallery. `edition_discovery/` starts at Escher’s surface house and connects perspective, the Sixth Guest and Ramsey’s graph experiment. `edition_making/` starts at Origami and connects folding, the Makers courtyard and Cage’s constrained score.

These are curated playable prototypes using existing activities, not newly constructed city architectures. A head initializer sets a default arrival only when no explicit arrival was supplied. A ready-gated client adds one optional journey button and a closeable dialog; all actions delegate to original public APIs. It does not mark progress for visits, begin challenges automatically or write notes. The original src tree is unchanged and never loads this client. Existing tools retain their own explicit progress and notebook behavior.


## Rebuilt Mathematics city

The Mathematics edition now has its own compact campus, six mathematical houses, connected shared gardens, new streets and the full existing Proof Atelier. It is no longer the old city with an optional guide. Its new campus notebook is separate; the original Atelier progress remains shared deliberately. The other editions keep their previous implementations. See [MATHEMATICS-CITY.md](MATHEMATICS-CITY.md).
