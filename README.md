# City of Ideas

An AI made city project under development.


Live target: https://hadi1373z.github.io/city-of-ideas/


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