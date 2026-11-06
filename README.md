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
