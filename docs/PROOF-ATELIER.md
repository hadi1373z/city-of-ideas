# One house for a long learning visit

The House of Proof now opens into the Proof Atelier: six connected workbenches
on one level, in the same city scene. This develops one substantial destination
rather than adding six small houses. Entry remains through the existing house
at (215, −94); its rear wall has a real 3.6-metre passage. The old board moves
beside that opening and remains usable.

The atelier occupies x=206…224, z=−88…−68. The first longer layout overlapped the
Makers' Library; the final three paired bays stop before the original Makers'
district bounds. Source bounds, original approach anchors, the foyer opening and
the central aisle are checked. Walking back through the original foyer was also
verified in the actual browser, without a page change or room transition.

The vaulted roof has curved timber ribs and separated bands admitting sky views.
Low dividers let visitors see into the next workshop. Exhibits stand on supported
frames beside reading ledges and four-legged seats. Only fixed architecture is
instanced; experiment meshes remain individually editable. The floor stays at
the original .13-metre height. Island geometry and nearby house lots are retained.

## The learning route

The suggested durations total 120 minutes. They are planning estimates for
reading, experimenting and attempting proofs, not observed user-study timings.
Visitors may skip ahead, pause, revisit, or spend longer on twelve deeper
problems. No timer or waiting gate inflates the session.

1. **Colour, 15 minutes:** construct a tiling, then use an invariant to rule out
   another board. Deeper work changes the region and the allowed piece.
2. **Hall, 20 minutes:** select a deficient subset, then add exactly one edge to
   repair the original instance. Deeper work challenges degree-based claims.
3. **Exchange, 20 minutes:** trace and flip a checked alternating path. Deeper
   work proves the symmetric-difference characterisation of maximum matching.
4. **Duality, 20 minutes:** construct a cover meeting a matching bound. Deeper
   work examines odd cycles and fractional relaxations.
5. **Prices, 25 minutes:** construct a bijection and feasible row/column prices
   with zero gap. All nine inequalities are checked. Deeper work studies price
   normalisation and the hypotheses of complementary slackness.
6. **Studio, 20 minutes:** construct a connected balanced seven-edge graph, a
   Hall witness, a three-edge matching and a three-vertex cover. Deeper work asks
   for unbounded families and selective repairs.

All examples, explanations and architecture are original teaching material.
Primary further readings link to Jonathan Hirata's MIT matching notes, Michel
Goemans's MIT bipartite-matching notes, and Lau–Ravi–Singh's author-hosted book.
The advanced text is English; English/German/Persian/Czech names and navigation follow
the city language, with an explicit language disclosure. Text direction is kept
separate for English mathematics and Persian navigation.

## Persistence and limits

`city-of-ideas:proof-atelier:v1` is a separate local key. It keeps experiments,
milestone checks, hint/discussion choices, active workshop and explicitly saved
arguments. Textarea drafts stay in memory until “Keep my argument” is chosen;
experiment changes do not silently save those drafts. The same explicit save can
add the reasoning to the existing personal notebook. A verified studio graph is
kept as a separate finite certificate so subsequent edits do not change it.
Existing private keys, voices, recordings and asset credits are unaffected.

Resume remembers the last physical workbench separately from the chapter being
read. Opening an earlier reading or the route directory does not change that
destination. Its button names the destination before moving; a separate next
unfinished-room button follows the learning sequence. The latter is absent when
all arguments and milestones are kept. Earlier saves lack a workbench history,
so their last selected chapter supplies the initial fallback without discarding
notes, model state or certificates. New workbench visits establish the dedicated
resume position. Reload, earlier-chapter reading, both navigation choices and
legacy/invalid resume fields are covered by regression checks.

Finite certificates are checked; free prose is not machine graded. This is not
an arbitrary proof assistant, an unrestricted graph editor or a general Hungarian
solver. A completed milestone records a past check; current model validity is
shown by the current experiment. Progress without a kept argument remains open.

## Verification

- Enumerated all 512 three-by-three bipartite graphs against independent matching
  and cover enumeration; checked alternating reachability certificates.
- Enumerated all six small assignments and 4,096 price vectors; checked bounds
  against the independently enumerated optimum.
- Exercised the actual six UI paths, explicit saves versus private drafts,
  malformed storage, retained carets/RTL and owned resource disposal.
- Native browser checks completed all six experiments, revealed a deeper
  discussion, reloaded saved work and walked through the real foyer passage.
- At 390×844 the workbench controls and physical matrix remained visible with
  equal content/client widths; Persian navigation and English reading direction
  were inspected. Temporary viewport changes were reset.

The design supports a serious long visit. Enjoyment and actual time spent still
need feedback from the user rather than being inferred from a test suite.
