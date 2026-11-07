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

The public city is a circular island centred on Zarathustra Gallery at (0, 0),
with ocean surrounding every side. Preserve this geometry and the separate
Graveyard world. `src/island-layout.js` defines the island.

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
