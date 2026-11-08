# City of Ideas — persistent character voices

User instruction reaffirmed 2026-11-03: keep each character's voice fixed across
future requests, scenes, dialogue additions, and the entire conversation. Reuse
the saved setup without repeating service selection or account setup.

## Established English cast

| Character | Kokoro voice | Language | Character direction |
| --- | --- | --- | --- |
| Socrates | `bm_george` | `en-gb` | Warm, patient, curious |
| Nietzsche | `am_fenrir` | `en-us` | Firm, precise, thoughtful |
| Zarathustra / زرتشت | `bm_fable` | `en-gb` | Resonant, reflective storyteller |
| Frank Ramsey | `bm_lewis` | `en-gb` | Youthful, clear, conversational |
| Alan Turing | `bm_daniel` | `en-gb` | Restrained, analytical, reflective |
| Anonymous | `am_michael` | `en-us` | Grounded, direct, questioning |

Use free local **Kokoro-82M v1.0**, **kokoro-onnx 0.4.7**, speed **1.0**.
The authoritative record is `src/ramsey-film/assets/voice-cast.json`: it stores
voice IDs, exact settings, model/voice-bank hashes, scripts, cue timings, and
recording hashes. Preserve those identities unless the user explicitly requests
a voice change. Character directions guide performance, not claims of authentic
historical voices.

## Zarathustra visual direction

On 2026-11-06 the user selected **B — Persian scholar** from the visual board.
Keep the direction around thirty: swept-back dark wavy hair, a short beard,
ivory tunic and an indigo mantle with a restrained woven border. Do not reopen
the A/B/C choice. The concept is an artistic interpretation, not a historical
portrait. Use a properly credited existing GLB as an anatomical base. New mesh
studies remain separate from the live cast until they are ready for animation.
The character's established `bm_fable` voice remains fixed.

## Continue voice work

- All 46 conversation lines are recorded. Both five-minute tracks use the same
  six voices. English Socrates in the desk-book opening uses `bm_george` too.
- The city and standalone film share `assets/conversation-1.mp3` and
  `assets/conversation-2.mp3` under `src/ramsey-film/`. Update them together.
- Reuse `tools/render-ramsey-voices.py` and `tools/assemble-ramsey-voices.py`.
  Consult `src/ramsey-film/README.txt` for regeneration instructions.
- Existing local environment: `../../work/kokoro-env`; models:
  `../../work/kokoro-model`; original generated cues and preview:
  `../ramsey-voice-references/kokoro` (paths relative to this repository).
  If absent on another machine, recreate the environment from the saved model
  version and verify the hashes in the cast record.
- Preserve completed recordings and exact dialogue. Do not regenerate already
  accepted lines unnecessarily. Keep full speech, captions, and gestures aligned;
  never cut words or accelerate speech merely to fit a slot.
- Do not return to HeyGen for routine voice work: its free quota was exhausted,
  and the user explicitly switched to a free solution. Its partial recordings
  are development backups, not the active cast.
- Do not introduce generic browser-voice fallbacks or choose a different voice
  for a later chapter. Other language introductions retain their existing
  localized recordings; the established conversation cast is English.
- Save any future character's voice assignment once and reuse it thereafter.
  Update the cast record and relevant provenance hashes after audio edits.
- Verify with the relevant voice checks in `tests/ramsey-room.mjs`, source
  integrity checks, and playback across the five-minute boundary when changed.


## Island layout and first house studies

The approved world is one circular cylinder with two physical inhabited faces,
not a separate remote Graveyard world. Its radius is 570 m and thickness is 96 m,
with Zarathustra Gallery at the upper centre (0, 0), ocean around the edge, and
Babel in the shared central structure. Preserve the upper island geometry in
`src/island-layout.js`. The lower face retains logical source coordinates around
(−2160, −65); `src/world-cylinder-model.js` applies a proper rigid half-turn about
X with physical mapping X=logicalX+2160, Y=−96−logicalY, Z=−logicalZ−65. Never bake
this transform into individual buildings, voices, saved positions or notes.

The Faculty of Mathematics occupies the lower central annulus directly opposite
the upper Gallery. Its working eight-floor source wing is immediately west at
logical (−2240, −65), connected by a real covered walk; Ramsey House remains
beside that wing using its existing placement helper. Preserve the original
mathematical floors, Atlas/actions, lift and lesson content. The central Faculty
roof, oculus, shelves and shell are in `src/math-faculty-*.js`; do not duplicate
the source interior or cover the central helical well.

`src/world-cylinder.js` owns lower-frame mounting, physical camera/photo/lantern
poses, reversible through-gallery navigation, the middle gravity turn and the
live 3D pond crossing. The Gallery → Babel → central spiral → lower Faculty
route and its Escher museum spur are physical connected routes. The park pond
is a live render of the same lower face with original boats and basin preserved.
Keep the through-gallery and pond marked on the map. Read
`docs/WORLD-CYLINDER.md`, `docs/TWO-FACE-GALLERY.md`,
`docs/ESCHER-DEPTH.md` and `docs/POND-WORLD-WINDOW.md` before changing these joins.
The optional future crossing video is configured by `pondTransitionVideo` in
`src/city-config.js`; null uses the live 3D journey. No new voice provider or
recording is required. All established Kokoro voices and private data remain
unchanged.

The user requested new houses with only names and small features for now.
`src/foundation-houses-data.js` records six first studies (Freud, Chomsky, Borges,
Calvino, Ada Lovelace and Ursula Le Guin), their shared coordinates and later
expansion directions. Keep these stable when developing the houses further.
The small Freud city room is separate from the House of Psychoanalysis side
project, which remains at the design stage.


## Ocean voyage

`src/ocean-voyage*.js` adds an embarkable paper boat at the eastern shore.
`ocean-voyage-model.js` owns water bounds, motion and six original poems in
English, Persian and German. Preserve their original-writing attribution; they
are not historical quotations. Sailing uses a first-person vehicle hook in
`gallery.js`, preserves the island walking boundary, and cancels cleanly on
city travel. No character voice assignments or recordings are used or changed.


## Underground Library of Babel

The gallery’s snake-head ground-floor stairwell leads to a five-terrace circular
library below the same building. `babel-layout.js` supplies the bounds shared
by the real gallery slab opening and the library navigation. Preserve the holes
in the slab, floor-ink shader, gallery plinth, island foundation and lawn; do not
cover the descent with a new ground plane. Library geometry is an original
interpretation of the user-supplied circular library image; the image itself is
not published. The interactive catalogue is explicitly a finite 4^6-symbol
experiment, not all possible books. Keep its source attribution and restore
surface lighting on exit. Voices and private notes remain untouched.

The Babel entry is one additional flight directly beneath the existing gallery
stairs, in the same x/z footprint. It descends from the ground-floor landing
at z=11.2 to the underground floor at z=0. The old narrow northern stair is removed.
`babel-layout.js` shares the opening, landing and walk geometry. Read
`docs/BABEL-SNAKE-DESCENT.md` before changing this route.

Chomsky and Ada Lovelace now have working English investigations in their
existing foundation houses. Preserve the grammar/stack/parse models, addition
registers, contextual first conjectures and explicit private saves. Read
`docs/HOUSE-INVESTIGATIONS.md` before extending those rooms.

The existing central volcano now sits above a contained inverted glass reservoir.
Its r21 mouth aligns with the volcano and the central opening in Babel’s timber
ceiling; its tip meets the existing open book's centre seam at Y−25.651827.
Keep the shared book/contact dimensions in babel-reading-book-model.js and the
restrained static contact glow. The default view sits on the lowest terrace,
slightly off-axis so a railing post does not hide the meeting point. Read
`docs/BABEL-THERMAL-VAULT.md` before changing the cone, fluids or headroom.

On 2026-11-08 the user made the Babel volcanic-reservoir view the default
arrival for the bare city address. Keep this start in city-integration.js after
all scene/start-mode installers. Explicit arrival links retain their destination,
and the desk-book introduction remains available from the city overview.

## Connected exploration polish

Startup feedback in startup-progress.js reports actual coordinator stages; keep
head module preloads for the main graph and the five delayed source factories.
Original Dalí pages load asynchronously through their existing texture loader.
Do not restore a painting-byte gate or block private-home restoration on it.

Deep Babel hides the concealed upper city only below the first terrace; the
real stairwell overlook remains visible. Restore culling on every mode change.
The lower landscape has a connected meadow circuit, inlet and two level timber
crossings. Apply lowerLandscape.canStand alongside source/faculty collisions;
keep the original shore promenade continuous and all walking feet at .13m.

Connected questions is optional, folded and uses only real walkable routes.
The Mathematics working-wing guide uses actual source floor models and lift
metadata: ground-floor visitors exit through the central hall and open front
doors, upper floors use the lift. Keep solid laboratory windows distinct from
the central doorway. No guide action moves the visitor or writes notes unless
the visitor explicitly requests an existing interaction. Read docs/STARTUP.md,
docs/CONNECTED-QUESTIONS.md and docs/lower-face-visuals.md before extending.

## Original paper monitors

The eleven former blank panels in the lower Mathematics reading hall now show
permanent original first-page facsimiles. `historic-papers-data.js` keeps each
work's image, edition/page choice, source links, author credit, reuse terms and
English discussion question together. Preserve the genuine local scans and
their attribution; do not replace them with generated paper pages or assume
free access alone permits republication. Some historical works are monographs
and their original title pages are identified honestly in the reader.

`paper-monitors.js` owns page textures, frames, nearby actions and the zoomable
reader. It loads the images asynchronously and releases loading textures as
they are replaced. The pure gallery builder retains the stone pedestals and
exposes the lower-local slots; keep its resource disposal scoped to its own
geometry. Both lower walking and annular gallery walking must apply the monitor
colliders while leaving the west doorway and viewing aisle clear. The map's
Historic papers destination and `?arrival=paper-monitors` visit the real ring;
the bare city address still defaults to Babel. Read docs/PAPER-MONITORS.md and
docs/PAPER-COLLECTION.md before extending the collection. Voices, notes and
account connections are unaffected.
