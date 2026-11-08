# Socrates residence · claims and reasons

The original public residence remains at root (-96, 100), scale 1.7. The Study
is source room `math`, not a new lot or a reconstructed historical room.
`socrates-study.js` installs a public reading companion after `study-book.js`.

The desk receives two aprons, four leg joints and a backed two-card rack with
two posts resting on its original top. Four small chair joints connect the
original feet to the seat. The cards' straight rules and open bracket are
original city prompts, not ancient objects, quotations or a symbol alphabet.
The rack clears the lamp, pencil cup, open book/stand and original notebook.
No source mesh, collider, furniture position, doorway or walking lane moves.

All added resources belong to a separate scene group. Desk/chair subgroups copy
the source furniture's world matrices. They are never children of the source
owner, whose disposer recursively releases its descendants. Replacement removes
the old picks and disposes each owned resource once. Non-ground floors hide the
additions. A missing or custom room is skipped.

Eligibility compares only the canonical public rooms, doors, residence, stairs
and shared-approach fields against the original public template. It verifies
the actual Study furniture, desk top, reading-book identity and source furniture
transforms. Custom idea/design displays in this room are rejected. Private
`ideas`, `learning` and `resident` values are not inspected. Room metadata with
custom getters is rejected without invoking those getters. No private progress
or storage is needed to build, open or localize the companion.

The original EN/DE/FA/CS reading distinguishes Plato's representations of
Socrates from a historical verbatim record. It paraphrases the examination of
claimed wisdom in *Apology* 21b–23b and the request for a common account rather
than examples alone in *Euthyphro* 6d–6e. Both source pages were accessed:

- [Plato, Apology, Jowett translation](https://classics.mit.edu/Plato/apology.html)
- [Plato, Euthyphro, Jowett translation](https://classics.mit.edu/Plato/euthyfro.html)

A separate original city exercise tests whether a quiet room is always good
for reading, supplies a reason and considers the countercase of unusable light.
The revised claim is not presented as proved. The exercise has no score, saved
answer or new progress key. No historical quotation is invented.

Pointer/aimed E on the rack, the inside Study context, the original book reader
footer and the welcome Places controls reach this companion. The original
book's E capture yields only for a ray aimed at the rack. Elsewhere its existing
interaction remains. Closing a companion opened from the chapter reader reveals
the retained reader again; the explicit book action keeps the original read
entry. Outside the verified Study, that action is replaced by the existing
approach to Socrates' residence. Reading alone never travels or starts audio.

Local reading language does not change the saved city preference. Persian prose
is RTL. The original source tools, private text, Zarathustra's 81 chapters and
editions, accepted opening recordings and fixed Socrates appearance/voice remain.
The book/recorded opening keep their own languages and disclosed Czech English
fallback. The city-written opening and separate theatre/rehearsal stay distinct
from historical evidence. This pass does not claim city-wide Czech translation.

While incorporating main 352a230, native QA found the map could not leave the
new underground default for an ordinary surface destination. The existing
explicit quick-start now probes collisions synchronously in the destination
surface context, restores the old pose, and only then calls the existing arrival
chain. Blocked destinations retain the old pose. This preserves the Babel,
Escher and two-face stop/lighting hooks rather than assigning a surface pose
behind their backs. It adds no automatic travel or new destination.

Latest main dbad28c, a descendant of 352a230, is also incorporated in the final
two-parent review ancestry. Its startup progress/preloads, asynchronous original
Dalí texture loading, deep-Babel culling, connected lower landscape/bridges and
folded Connected questions/Mathematics exit guide remain. Read docs/STARTUP.md,
docs/CONNECTED-QUESTIONS.md and docs/lower-face-visuals.md before changing those
joins. Their new interface text remains English as disclosed.

`tests/socrates-study.mjs` uses the independently measured original public
289-node interior fingerprint
`692c09c8fda3d1cedddba0e925762ea79f7c5c849337e216bdd9155301182123`.
It checks source resources/metadata/transforms/visibility, the supported rack
and furniture, real ray, owned cleanup, replacement/custom guards, unchanged
source interactions/colliders, all four actual readings/RTL and book handoffs.
Private-field getters, browser storage and visitor memory are forbidden during
the reading tests. The real extracted quick-start is tested from underground
and lower-face starts, including a blocked destination.
