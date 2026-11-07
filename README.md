# City of Ideas

An AI made city project under development.


Live target: https://hadi1373z.github.io/city-of-ideas/

## Day 1 · City Map 1.1

Open **City overview** to explore the coastal map. Five numbered map buttons and
an equivalent destination list select Zarathustra Gallery, Ideas Park, Socrates’
House, the Artists’ Quarter garden court and Paper-Boat Lookout. Selection updates
a live location-information panel; **Visit this place** uses the existing city
travel controls. Selection alone never moves the visitor or writes saved data.

The optional dashed walking guide follows existing paths from the gallery’s west
approach to the artists’ garden court, retraces that short approach, and continues
east past the House of Origami to the lookout. It is a map overlay, not automatic
walking. The guide also has text directions. The other existing city destinations,
six foundation houses, ocean voyage and 3D overview remain available below the map.

English, German and Persian share the same physical coordinates. Persian controls
use RTL layout while east and west remain fixed on the map. Native buttons support
keyboard and controller focus; the dialog retains Escape/close and focus return.
Selection and route visibility survive reopening and language changes for this
visit. No new storage key is used.

`src/coastal-map-data.js` owns the five existing anchors, guide and localized copy;
`src/coastal-map.js` renders the controls inside the existing overview dialog.
`src/coastal-city-plan.js` remains the source for all three SVGs; regenerate them
with `node tools/render-coastal-plan.mjs`. Improved sea, shoreline and label styling
does not alter any original shape, path, building or label position. The gallery
remains `(460,460)` in the `920 × 920` viewBox, the island radius remains `399`, and
the continuous promenade radius remains `375.2`.

Run `node tools/check.cjs` and `node tools/build.cjs`. The release checks include
`tests/coastal-map.mjs`, which pins all 97 original shape/label geometries to the
pre-change map and samples the full overlay against the existing path network.
`tests/origami-house-ui.mjs` covers all five selections in all three languages,
pressed states, live information, guarded travel, guide toggling, focus/state
retention, private-note preservation and the retained overview/house controls.


The [ten-minute 3D film and room](https://hadi1373z.github.io/city-of-ideas/ramsey-film/) and [character studio](https://hadi1373z.github.io/city-of-ideas/ramsey-film/studio.html) are preserved as a separate edition. Source: `src/ramsey-film/`. Its README records character provenance and known visual limitations.
# Learning in the Makers courtyard

`?arrival=learning-lab` opens **The counterexample walk**, a self-paced Library →
Workshop → Dialogue House journey. Visitors first choose checks for a one-way
rule, reveal physical hinged cards, explain the counterexample, then transfer
the method to shuffled parcel cards. An optional framed-art problem provides
fresh practice. The 10–15 minute label is a suggested exploration pace, not a
measured completion time or enforced timer.

The Library book and both experiment boards are additive objects in the existing
Makers houses. Source furniture, residents and private notes are preserved.
`learning-lab-state.js` owns validated local progress; `learning-lab-scene.js`
owns removable geometry; `learning-lab.js` connects physical room entry, keyboard
and controller-accessible dialogs, and the existing private notebook. The first
test plan remains beside the later explanation. No reflections leave browser
storage; no voice identity, recording or provider changes accompany this lesson.

Teaching references: [forall x: Calgary, Truth-functional connectives](https://forallx.openlogicproject.org/html/Ch10.html)
and [Eric Pacuit, Reasoning Experiments](https://logic-probability.pacuit.org/docs/reasoning/experiments/).
The four-card selection format is established; card backs, parcel/practice cases
and lesson wording are original. The explanation distinguishes a material
conditional from its converse, a finite test from a universal claim, and formal
rules from richer everyday uses of “if”. There are no empirical performance or
diagnostic claims. English, German and Persian teaching copy lives separately in
`learning-lab-copy.js`. State/geometry and room-to-notebook flow are covered by
`tests/learning-lab.mjs` and `tests/learning-lab-ui.mjs` in the release checks.

## Advanced study houses

`?arrival=advanced-study` visits three new, walkable houses north of the Makers
courtyard. Use `&house=proof`, `&house=uncertainty`, or `&house=computation` for
a particular entrance. These are additive buildings in the same city scene,
connected to the existing western Makers approach by smooth garden routes.

- **Proof:** colouring invariants, an equal-colour connected board with a genuine
  Hall obstruction, an actual maximum bipartite matching, the quantified theorem,
  an alternating-path proof sketch, and a seminar-to-room transfer problem.
- **Uncertainty:** expected-frequency bars and computed posterior odds, variable
  priors, conditional independence versus an exact copied report, log odds, and
  scrutiny of the likelihood model. All rates describe fictional components.
- **Computation:** bounded, deterministic toy-program execution, explicit halting
  and repeated-state evidence, both branches of a hypothetical diagonal decider,
  recognition versus decision, and a dovetailing question. No arbitrary code is
  executed; a timeout is never presented as proof of non-halting.

Each house has five reading sections, experiment feedback, sources and an open
reflection. There is no completion badge or claim of automatic essay grading.
First conjectures and later reasoning are separate in the existing private
notebook. Additional local state uses `city-of-ideas:advanced-houses:v1`; it does
not rewrite existing personal notes. Controls and house names support English,
German and Persian; advanced reading is explicitly labelled as English for now.
There is no generated speech or change to the saved six-character voice cast.

The original explanations and board cases are in `study-houses-data.js`.
References include Hirata's MIT matching notes and the formal mathlib Hall
statement, Imai's probability lectures and Harvard Stat 110, Turing's 1936 paper
and Aaronson's MIT computability notes. Exact source links are attached to each
house. `study-house-models.js` contains testable mathematical operations;
`study-houses-scene.js` owns the geometry; `study-houses.js` owns the additive UI
and interaction hooks. `tests/study-houses.mjs` independently checks matching
against exact search and walks routes against the real source district layer;
`tests/study-houses-ui.mjs` checks physical entry, experiments, private notebook
history, focus, language disclosure and removal of only owned objects.

## Circular island and House of Origami

`?arrival=island` opens the unobstructed full-island overview.
The public city is one circular island centred on Zarathustra Gallery at world (0, 0).
`src/island-layout.js` owns its 570 m shoreline, 552 m lawn, 565 m walking limit,
536 m shoreline loop and the eastern paper-boat lookout. Ocean surrounds all
360 degrees. The previous offset land disc and straight eastern coast are removed.
The overview fits the entire circle in portrait and landscape and uses a separate
near plane for stable ground depth at that distance; walking restores the close
near plane. Private notes, existing house coordinates and the separate graveyard
world are preserved. New woodland avoids the park, paths and western home lots.

`?arrival=origami-house` approaches a new paper atelier between the artists'
quarter and the eastern ocean. `?arrival=coast` visits its paper-boat lookout.
The existing Zarathustra gallery stays at the civic centre (world 0,0). City
Overview now offers a gallery-centred coastal plan; its 3D view also faces the
gallery. The small city map uses the same centre and includes the ocean. The
separate Graveyard of Ideas retains its own map and world visibility rules.

The house has a supported folded-plate roof, clear central doorway, real window
openings, suspended paper cranes and three working stations. Its Miura model is
a finite, zero-thickness patch of 32 rigid parallelograms controlled by one fold
tilt. Coordinates preserve all panel edge lengths, angles and areas; this is a
kinematic model, not a paper-stiffness or collision solver. The crease lab keeps
Kawasaki–Justin's unassigned single-vertex angle condition separate from
Maekawa's necessary mountain/valley count and from global foldability. The boat
workshop reuses the saved multilingual traditional-boat milestones, explicitly
labelled as sketches rather than a continuous layer simulation.

After the boat sequence, visitors can release their paper boat at the ocean
lookout. Completed boat work from the existing park guide counts too. The boat
follows the same analytic water height as the sea shader. Reduced motion freezes
the water and boat and applies fold changes immediately. The digital voyage is
identified as art, not a claim that ordinary paper survives indefinitely in water.
Personal folds, colour, launch state and reflection use the new local key
`city-of-ideas:house-of-origami:v1`; existing private notes and original lesson
completion keys are preserved. Reflections also enter the existing notebook.

The new architecture, coast, map and mathematical geometry are original code.
Sources attached to the house include Schenk & Guest (2013), Wei et al. (2013),
Adachi/Ishibashi/Kume on flat folding, and the existing traditional boat guide.
Existing folded-paper boat/crane builders and their credits are reused. No
character geometry, accepted recordings or fixed Kokoro voice settings change.
All new instruction and controls support English, German and Persian.

`origami-house-math.js` owns coordinates and validated progress;
`origami-house-scene.js` owns the ateliers; `coastal-city-scene.js` owns the sea
and route geometry; `origami-house.js` connects them to the existing city.
`node tools/render-coastal-plan.mjs` regenerates the three map SVGs from the
actual artist-quarter plan and study-house coordinates. Release tests verify
rigid-fold invariants across the full tilt range, source-clear walking routes,
saved lesson compatibility, physical entry and launch guards, local notes,
theorem feedback, map identity, language parity and owned-resource cleanup.

## Exhibitions of Ideas

`?arrival=ideas-gallery` opens four curated, idea-led exhibitions without
replacing any existing artist house. A question and an artwork lead to a real
walkable stop; the visitor can retain each open question in the existing private
notebook. The theme names and visitor prompts are available in English, German
and Persian.

- **Philosophy — Giorgio de Chirico, *Le trouble du philosophe* (1925–26).**
  `?arrival=philosophy-art` approaches the *Metaphysical shore* in the artists’
  quarter, an original three-dimensional scene with anonymous figures, columns,
  a miniature city, and a place to reconsider the view. The 1926 painting is held
  by the Museo del Novecento in Milan. An external attribution link opens a
  reference page; its reproduction is not copied into the public site.
- **Time — Salvador Dalí, *The Persistence of Memory* (1931).**
  The exhibition visits the already existing dream residence.
- **Perception — Georges Seurat, *Study for “A Sunday on La Grande Jatte”*
  (1884).** The existing colour-distance experiment remains interactive.
- **Representation — Paul Cézanne, *Still Life with Apples and a Pot of
  Primroses* (ca. 1890).** The existing still-life rotation activity remains
  interactive.

New scene and its source/rights disclosure live in `de-chirico-exhibit.js`;
curation, keyboard-accessible dialog, routes, source links, and private question
hooks live in `idea-exhibitions.js`. Both are additive to
`artist-quarter.js`. Release checks include
`tests/idea-exhibitions.mjs` and `tests/artist-quarter-ui.mjs`.

## New house foundations

The six houses in `src/foundation-houses-data.js` are deliberately first-stage
architectural shells, not completed learning experiences or reconstructions of
real buildings. Each has a localised name, an open entrance, a single original
feature and a saved direction for later development:

| House | First feature | Later direction |
| --- | --- | --- |
| Freud | Red couch and window | Dreams and memory |
| Chomsky | Wooden branching relief | Language and argument |
| Borges | Small library and desk book | Branching reading journeys |
| Calvino | Vault and nested viewing frames | Different readings of one city |
| Ada Lovelace | Skylight and mounted brass wheel | Patterns and computation |
| Ursula Le Guin | Open courtyard and two seats at a hearth | Imagined societies |

The west arc joins the existing western island road; the east arc joins the
origami-to-shore route. Every house faces the gallery. `?arrival=new-houses`
opens the directory; `?arrival=house:freud` (and each of the other stable IDs)
approaches its front. The island map and small walking map use the same layout.
Static details are batched, plot clearings exclude trees, and tests sample the
rotated entrances and both lanes against original district collisions.

The separate House of Psychoanalysis remains a design study. This small city
room does not implement its underground or therapeutic experience. No cast,
recording, private-note or account-connection data is changed by these shells.


### The paper sea

A large embarkable origami boat waits at the eastern landing, reached from the city map or `?arrival=ocean`. Board there with E, controller A, or the shore button. The connected folded-paper hull reuses `src/origami-boat.js`; no sail or mast has been added. It floats, leaves a wake and carries the first-person view across the ocean. W / up accelerates, S / down slows, A / D or the controller left stick steers, and normal drag/right-stick controls look around. On-screen steering is available on touch screens. The return control (or controller B) takes the visitor safely back to the landing.

Six original short poems for City of Ideas drift across the view in English, Persian or German, following sailing time. They can be hidden, and sailing can be paused to read. Reduced-motion preferences remove text drift and boat rocking. These poems are original project writing, not attributed quotations or translations of a historical poet. There is no added narration and the fixed Kokoro cast is unchanged. No notes, accounts or persistent visitor records are written by this voyage.

Sailing is limited to the surrounding sea, with the island excluded and an outer current boundary. Navigation to another city destination cancels the voyage instead of moving the visitor back onto the boat. Sailing state remains local to the current visit; boats are not synchronized between visitors.


### Library of Babel beneath Zarathustra Gallery

The gallery now has a real stairwell on its northern ground-floor ring, opening into a five-terrace circular underground library. The shape is an original interpretation of the visitor’s supplied concentric-library illustration and Borges’ library idea, not a reconstruction of Borges’ fictional architecture. The reference picture is not bundled or used as a texture. The library remains physically under the gallery at the island centre, with continuous stairs in both directions; existing upper gallery floors, the ocean voyage, houses and source districts remain in place.

`src/babel-layout.js` supplies the shared stairwell bounds; `babel-library-model.js` defines walkable terraces, reversible stair heights and a small finite combination library; `babel-library-scene.js` creates the vault, balconies, dense book bindings, reading desks and stair geometry with shared instanced meshes. The gallery slab, ouroboros ink layer and old solid plinth all leave the stairwell open. Island ground and foundation leave the gallery footprint hollow above the vault.

Use **Library of Babel** in the city map to reach its gallery entrance; walk down, or use E/controller A at the entrance. The direct `?arrival=babel` link begins on the first underground balcony. Walk between rings using their actual stairs; the return button is an additional way back to the gallery. Nearby reading desks open a catalogue experiment: four symbols in six places generate 4,096 unique pages, with a reversible address and prefix filtering. The bindings are architectural scenery; this demonstration does not claim to contain all possible literature. The explanatory text is original and links to [Jonathan Basile’s digital Library of Babel](https://libraryofbabel.info/About.html) for further reading. No Borges prose or other protected book text is reproduced.

UI is available in English, Persian and German. Prefix experiments remain in session memory; this feature does not modify personal notes or accounts. The six established Kokoro voices and recordings are unchanged. Underground lighting is restored when leaving or travelling elsewhere.

## House detail review series

The unpublished `feat/hourly-house-details` series starts with Borges’ reading
room: shelf returns, desk furnishings, three sourced reading sections and a
two-context interpretation exercise in EN/DE/FA/CS. Czech is selectable for these
house readings and controls; untranslated city content uses English.
Open `?arrival=house:borges`, enter the house and choose **Read at the desk**.
The room can explicitly travel to the existing Babel stairwell. No notes or
recordings are changed. See `docs/HOURLY-HOUSE-DETAILS.md` for scope and next work.
