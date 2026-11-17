# Cylinder birds: relief, paper wings and flight

The cylinder keeps its complete warm stone backing from Babel to the lower
building. Only the decorative bird field becomes less dense before the lower
rim. The real Escher entrance, middle landing and lower entrance remain open.
The pattern is original geometric work; it is not a reproduction of an Escher
print.

Open `?arrival=bird-transition` to inspect the lower transition directly. It
places the visitor on an existing lower spiral tread at roughly physical
Y −86m, facing the peeling wall with automatic travel disabled. It adds no
geometry and does not change normal walking. The destination is exposed as
`worldCylinder.visitBirdTransition()` for the same explicit arrival action.

The visual sequence has three connected stages:

1. The upper field is an edge-matched, fully tiled relief.
2. Retained non-departure motifs in rows 28–34 become paper-thin paired wings.
   Their fold increases towards the flight sources, with a gentle motion that
   keeps every vertex in the wall band. These 279 motifs are architectural
   details, rather than additional freely travelling birds. Thick flat relief
   and distant flat glyphs are omitted at exactly these cells, so the wing
   silhouettes never overlap a duplicate bird face.
3. The 64 real departure cells in rows 32–34 retain their exact master tile,
   position, scale and colour. The separate fixed flock peels from these cells
   in a clockwise wave, circles inside the shaft, rises in a helical ribbon,
   and folds into matching tiles on the observatory deck. Its floor pattern
   remains in place while the finite pool repeats its journey.

Rows 35–37 carry plain warm stone before the rim. They do not expose a grey gap
or continue the decorative field to the edge. The retained-cell mask and
height taper are shared with the distant proxy; paper wings remain visible in
both levels of detail. Reduced motion freezes the wall-wing pose and retains
the completed floor without the moving free flock.

`cylinder-metamorphosis-scene.js` owns the original tile and wall transition.
Its production configuration disables the old independent hover flock. The
close wall draws just one 7.44m relief band around the visitor's physical height,
using at most four merged batches. One faithful 2,060-triangle proxy covers all
other heights, excluding only the exact active band. Both modes retain the same
two instanced wing batches. This gives at most seven walking-view wall draws
and three distant-view wall draws. The complete wall remains allocated in ten
separately culled bands, while the actual submitted wall stays below 80,000
triangles at every height, including the proxy and thin wings. The full shaft
is not submitted and then discarded by a shader.
During a connected gallery route below physical feet Y −31.5m, Babel's complete
root is hidden behind its opaque floor. It is restored at the upper overlook,
outside the route, in cutaway and during teardown. Repeated photo preparation
preserves the original visibility record.
The continuous flock and completed floor are separately owned by
`bird-flight-model.js`, `bird-flight-scene.js` and `bird-flight.js` (seven draws).
All resources dispose through their existing owners.

Checks in `tests/cylinder-metamorphosis.mjs` inspect genuine flat wing geometry,
graded folds, motion, static reduced-motion poses, source-cell preservation,
proxy suppression, exact horizontal relief slices, per-height submitted geometry
budgets, real portal cuts, actual animated vertex clearance and
cleanup. `tests/bird-flight.mjs` covers departure/arrival correspondence,
continuous headings, circumferential coverage and more than 2,500 intersections
against actual stairs, deck, bridge and roof geometry. The integrated draw and
instance budget is checked in `tests/lower-face-visuals.mjs`.

The direct `?arrival=bird-transition` destination stands at the centre of an existing lower stair tread with automatic walking off. Its oblique view shows the partly folded wings against their stone backing; ordinary manual walking continues from that same real tread.
