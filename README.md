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
