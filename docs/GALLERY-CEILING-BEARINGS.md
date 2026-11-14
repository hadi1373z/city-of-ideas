# Gallery column tops and ceiling spokes: factual bearing audit

Follow-up to `98b75032699ef3f78bc8c57b5eb325a1d49d5ad2`.
All 47 first readings and all eight Mathematics working floors remain complete.
The four original upper Gallery levels are a separate architectural scope.

This review adds tests and documentation only. It changes no production source,
geometry, matrix, resource, collision, UI, language, transfer or saved state.
Existing contacts and actual gaps are reported separately; none of the gaps
below is described as a repaired slab bearing.

## Retained owners

The source architecture and its installed quarter-turn retain one 174-instance
column batch, one 164-instance spoke batch and ten annular floor body/cap
meshes. The complete selected scope has twelve meshes and 338 instances.

| Source level | Floor feet | Outer columns | Ceiling spokes | Next slab underside |
| --- | --- | --- | --- | --- |
| 0 | .395 | 42 | 41 | 8 |
| 1 | 8.395 | 44 | 41 | 16 |
| 2 | 16.395 | 44 | 41 | 24 |
| 3 | 24.395 | 44 | 41 | 32 |

Columns keep their original twelve-sided .24/.28 radii, 7.3 m height and
radius57.3 placement. Spokes retain ten-sided .07 m sections, radial span
31..57.3 and centre Yfloor+7.18. The original selection omits three spokes
per level near the stairwell. Ground-level door-side columns remain omitted.
No column is added at a doorway or stair aperture.

## Column feet and actual upper gaps

All 174 column feet meet their original floor-body top within source Float32
roundoff. Whole-foot projection is clipped against actual floor triangles;
174 lower caps and 174 upper-cap projections have complete projected
coverage, with maximum ratio error9.67e-13. Each cap has twelve triangles.
There are 2,262 foot rays and 2,262 upper rays, covering each centre and all
twelve perimeter vertices.

The column bodies already pass through the original .025 m finish at
Yfloor+.37..+.395. All 174 positive .002 m cube cores (1,392 vertices)
lie inside the actual columns and finish, verified against real cap triangles.
No extra foot, pad or floor is justified by these lower contacts.

The upper caps end at Yfloor+7.650000095. The actual next slab underside
is Yfloor+8. Every upper-face ray therefore retains a
**.349999904633 m gap**. Full projected coverage above a cap does not turn
this gap into a contact. These 174 column/slab bearings remain unrepaired.

## Spoke contacts and upper-face gaps

At 163 outer ends, all eleven original cap vertices lie inside the matching
column: 1,793 vertices. Another 163 positive .002 m cube cores, .01 m
inward from each spoke terminal, confirm the existing joint volumes.
Together with the foot/finish checks this gives337 positive cores/
2,696 vertices. Existing joints are retained without extra sleeves or supports.

Ground-floor spoke ID30 ends at approximately
(-57.300001144, 7.179999828, 0) beside the west doorway and has no matching
outer column. That is one retained unmatched end, not an all-spokes-rooted
claim. The doorway stays clear; no post, barrier or invented support is added.

Nine actual upper-facet probes per spoke use three longitudinal stations and
three lateral offsets: 1,476 matched beam/slab ray pairs. They measure
**.749999694526..763364334409 m** to the next slab. The variation follows the
real ten-sided sections. A centreline, bounding cylinder or nominal .07 m
radius is not substituted for the upper face. These are existing gaps,
not ceiling suspension contacts or newly repaired bearings.

All complete column plans remain at least .719999236 m beyond the original
radius56.3 walking-centre limit. Spoke bottoms remain at least4.614999828 m
above a projected2.10 m standing envelope on their own floor. These are
specific radial/vertical separations, not a whole-building clearance or
capacity certificate. No walking bound or collision rule changes.

## Independent source and installed checks

The regression executes the original architecture builder and quarter-turn.
The pure measurement uses public static triangles, instance matrices, cap
clipping and rays only. DOM/storage/fetch and new geometry/material/texture/
light/instance constructors are denied. Every selected source vertex, index,
matrix and instance ID is hashed before and after inspection; none is omitted.
Fixture cleanup releases only its own synthetic resources.

The Node source renderer is r186; the installed app is r160. Their original
floor triangulations differ: each of ten body/cap meshes has5,436 position
vertices in r186 and5,460 in r160. They retain independent full fingerprints
rather than excluding triangles to force equality:

- r186 twelve-mesh/338-instance SHA256:
  `6dc4df6f5e051fd77905fe1f3a83584b3a559523c32d10c87f483b9209b1a737`.
- r160 twelve-mesh/338-instance SHA256:
  `ee0ddad8717b597ad05ff56d69af071fb5d1c0cf24e43d8491d5bc1839e7971a`.

All contact counts, cap-coverage results and gap ranges agree in the two
renderers. Native inspection also sends24 independent rays through all10,472
visible scene meshes at selected column/spoke locations on all four floors.
Their first overhead hits are the unchanged next slabs atY8/16/24/32.
No intervening support is inferred from appearance.

All124 release programs pass, including the strict older lift/frame, floor,
stair, raw/installed/prior geometry, private-boundary and once-only cleanup
controls. No old source profile, mask, ray, budget, ID or fingerprint is relaxed.
Original Babel65/41,893, complete73/43,867/88resources/39buffers/nine adapters
and full upper Gallery290 meshes/160 treads remain independently exact.

Native original floor arrivals and ordinary walks reach four inspection views.
The fourth flight retains all41 heights24.395..32.395 in both directions.
Five floor/FA views and two separate-camera column-cap/west-end close views
were visually inspected. Inspection renderer/function/ratio restore with the
visitor pose unchanged. Original catalogue handoffs, saved Czech, eleven ready
genuine pages, full old hashes and final explicit LOCAL committed-build assets
are recorded in the ledger and PR #5. Own preview only;
the user's headed preview remains under their control. Hardware controller A
remains separately untested.

At1280x720 the unchanged action dock overlaps parts of the two lower floor
buttons. QA clicks their exposed edges for actual pointer actions; this is
not an all-controls-clear or UI repair claim. Looking respects
the original -.8..+.75 pitch bounds. No forced click, direct visitor pose
assignment, automatic tour or collision bypass is introduced.

## Preservation and next area

The existing lift audit still distinguishes supported explicit interior
(54.2,12) arrivals from closed exterior side landings. Continuous upper glazing,
the original walking limit, supported ground/roof corrections and six guarded,
unrepaired .08 m book-floor stair-end gaps remain unchanged. The separate
[shaft/frame audit](GALLERY-LIFT-FRAME.md) retains all its contacts and gaps.

Keep all47 sourced readings and exact pointer/E/context/header/footer/Places/
directory/reader handoffs; raw drafts/carets/immutable first answers/keys;
original explicit experiments/saves; EN/DE/FA/CS, Persian RTL/formula LTR,
saved/local/global language boundaries and disclosed English gaps. Construction,
rendering, reading and locale add no private-memory/storage/progress access
or preference-write/experiment/discovery/audio/travel/floor action.

Preserve source/private coordinates, proper lower half-turn, island/Zarathustra,
book/ring/leaf/tip/fluids/glow, all160upper/40Babel/480helical treads/middle/well/
tunnel/earth cut, original eight-floor/24-ID Mathematics wing/stairs/lift/central
door/Faculty/covered route, Escher rooms/gates/public models/experiments/artwork,
eleven genuine scan bytes/editions/credits/rights/source/proximity/zoom and
approved cast/fixed voices/accepted recordings. No new part, reading, paper,
historical copy, quotation, testimony, source-fetch or certification claim.

Main6cab1c9 Proof feedback and e646bb2 exit/Controls remain separate and
unintegrated. Same branch/PR #5, exact Houses/Concurrent text and existing
conflict remain. No merge, reconciliation or deployment.

Next useful review: audit the original four upper Gallery annular inner
balcony guards: complete post feet, floor-cap contacts and actual post/upper/
middle-rail joints. This is distinct from the completed helical/Babel guards.
Keep all column/spoke gaps above, lift access limits, apertures, well,
terminal breaks, profiles, source/private coordinates, resources and original
actions. Only measured justified existing-face correction or a factual audit;
no new part, closure across a route, widened boundary, automatic travel,
ornament, historical copy or certification.
