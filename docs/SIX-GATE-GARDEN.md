# Six Gate Garden

The user approved sketch A of the neighbourhood studies on21 November2026.
This is the surface architecture around the existing central Gallery and six
pattern houses, rather than a replacement for those buildings or a new theme
for their content. The generated sketch is a concept, not measured source
geometry: real house centres, tangential doors, shafts and underground passages
remain authoritative in sixfold-house-network-model.js.

## Architecture and walking

six-gate-garden-model.js owns all placements, routes, footprints, columns,
furniture and planting reserves. The main shaded loop has centre radius105m
and eight metres of level walking width. The refined stone arcade has90 bays
between six open radial gateways. Two rows of stout limestone piers carry
180 deep masonry arches, individual voussoir joints, solid spandrels and a
continuous projecting cornice. Each gateway has a four-pier loggia with two
additional arched apertures and a small hipped slate roof centred on the loop,
rather than a detached thin shelter outside it. Fine bronze seams trim the
sloping slate roofs. There are no invisible doors or closed fence spans.

The two column rows stand outside the eight-metre walking band at radius100.1
and109.9m. Their1.10m square bases have conservative .78m circle colliders.
The lowest arch spring is2.85m, arch depth .84m, and roof eaves5.42m; ordinary
visitors have real headroom throughout. The slate ridge rises to6.52m.
Both sides of the covered promenade stay open. Walking feet stay atY.13m.
Real paving slabs have thickness .165m, including narrow actual overlaps at
rotated joins to avoid cracks after Float32 coordinate quantisation.

The later close-up identified twelve unintended sky slots: the curved arcade
ends at+/-0.07rad around each gate, while its rectangular loggia ends at
tangent+/-5.3m. Their roughly2m separation is now covered by twelve fitted
slate saddles, each with a continuous16cm stone soffit and closed fascia. Their
two slopes meet the exact unchanged arcade eave/ridge/eave profile and existing
loggia hip edge. The lowest face remains5.26m above ground; no column, arch,
collider, path, Gallery roof or original roof endpoint is moved. Fine bronze
seams use the existing batch. GARDEN_ROOF_JOINS owns their twelve polygons and
the map/full-crown footprints, all still walkThrough:true.

Each warped saddle quad uses identical triangle diagonals on top and underside.
Reversing all four underside corners would choose a different diagonal, causing
the upper slate to pierce the soffit despite matching endpoint thicknesses.
tests/six-gate-garden-roof-joins.mjs checks4056 actual roof/soffit rays,240 exact
abutment rays,1944 paired interior thickness probes and108 body-width route
rays, plus the narrow roof envelope, unchanged shared route/column data and
exactly-once disposal. Existing integration and forest tests also retain all455
street trees,170 planted beds and their exact instance poses. Browser proof:
design/visual-walk/garden-roof-joins-before.jpg and
design/visual-walk/garden-roof-joins-after.jpg.

The existing central block streets cross the arcade at the six30° sector
bisectors. An evenly spaced column grid would put a pair directly in each
street. gardenBayAngles starts with16 intervals per sector and omits each
bisector pier pair wherever its full base would occupy the5.5m crossing.
Both adjacent arches and roof polygons share the resulting wider span, with
no unsupported cut or roof gap. The resulting216 piers include24 gate piers.
GARDEN_RETAINED_CROSSINGS preserves those axes as walkable green/paved ground.
The user's later request retires the old30 grid ROAD STRIPS visually; their
coordinates still have safe body clearance, independently of the new garden walks.

An open inner promenade at radius74m joins the existing east/west Gallery
thresholds atX±67. Six radial routes begin at that promenade. They do not claim
six new openings through the Gallery wall. Each house route reaches local
radial125/tangent34 before turning toward the original doorway at local
tangent26. Quadratic corner rounds of roughly3.9–4.5m replace the hard elbows;
the outward street spur shares an exact point on the curved approach for guides.
This route passes around the source hexagon rather than
running through its solid radial wall. Its existing porch, interior floorY0,
eight original floors and source controller are unchanged. The source's
pre-existing .13m outer-ground/porch difference remains source-owned.

Six small paved garden courts provide12 off-route seats. Six contained low
planted beds sit opposite the house-door approaches. No tree is instantiated
inside the builder. Whole-crown planting queries and optional candidates are
exported for the root city owner to combine with every other building owner.
Six families of flat original ornamental motifs identify the loop sectors.
The restrained inset samples are not a claim that the whole promenade is an
exact mathematical Penrose or semiregular tessellation.

## Integration API

Import buildSixGateGarden(T,{paving=true,planting=true}={}) from
six-gate-garden-scene.js. It returns group, colliders, canStand and idempotent
dispose. Mount group once under the upper-city scene. Apply canStand only
for ordinary surface walking (feet nearY.13), never to underground controllers.
No update controller, modal, light, texture, character, progress or storage
hook is needed. The four material batches are all original procedural geometry.
Live installation now passes paving:false and mounts the broad stone belt from
six-gate-garden-paving.js; see docs/SIX-GATE-GARDEN-PAVING.md. The default paving
option remains for isolated architecture/support checks, not a second live layer.

Shared exports from the model:

- SIX_GATE_GARDEN: dimensions and surface ID.
- GARDEN_GATES / GARDEN_ENTRIES: six exact public gate positions and old doors.
- GARDEN_ROUTES: both loops, six rays, curved house approaches/courts/street joins.
- GARDEN_FOOTPRINTS:90 actual roof polygons, six loggia roof polygons,12 fitted
  roof-join polygons and18
  seat/bed footprints. Roofs have walkThrough:true: reserve their volume for
  planting and maps without treating the entire arcade as a solid collider.
- GARDEN_COLUMNS / GARDEN_COLLIDERS: actual bases and furniture.
- gardenBayAngles / GARDEN_RETAINED_CROSSINGS: supported arcade bay boundaries
  and the six untouched block-street crossings through the covered ring.
- gardenCanStand(x,z,padding=.3): only solid base/furniture exclusions.
- gardenSurfaceAt(x,z): the new .13m supported walking domain; null outside.
- gardenTreeClear(x,z,crownRadius): full crown clearance from roofs, source
  houses, central Gallery, routes and physical fixtures. Combine it with other
  owners' crown checks; it is not a replacement for the city's global audit.
- GARDEN_TREE_CANDIDATES: optional deterministic centres with crownRadius3.2m.

Root integration must add the shared paths and footprints to the map/street
authority and regenerate affected honeycomb wall openings. Existing cell walls
or source trees must not remain across a new gateway. Keep the open roofs
distinct from genuinely solid building footprints when checking walking.
The user's follow-up explicitly rejected the leftover solid low walls in the
sketch's open garden. All seven central cells are therefore openCells in the
shared street generator: their internal and perimeter honeycomb wall segments
are omitted from the real geometry and maps. Outer city court walls remain.
The existing six houses' source data and above/below-ground transforms do not
change. All new geometry is outside the central Gallery/Babel opening and
outside the six10.3m shaft openings. The r105 surface loop is not the existing
r106.3486743 underground loop: preserve both as separate physical layers.

## Verification

node tests/six-gate-garden.mjs uses the actual transformed source house mesh
and all new triangle buffers. A test-only spatial index accelerates native
Three.js Raycaster tests; it copies exact triangles rather than collision
proxies. The check covers31,392 body-width rays through both loops, gates,
elbow routes and source doorways,35,640 additional rays along all30 retained
central-grid edges, and10,446 real slab-support samples. Upward
coverage checks prove the new garden cannot cap Babel or any of the six
existing shaft holes. It checks the original house/network authority remains
unchanged, full-crown exclusions and bounded geometry. Owned cleanup releases
each new rendered resource exactly once without disposing source-house assets.
The refined architecture uses four finite material batches and fewer than
130,000 triangles, including its optional isolated paving.

This focused check does not certify unrelated Gallery roof approaches, source
trees or existing honeycomb walls. Root owns the combined live-city route/tree
audit and browser review after shared layout integration. Existing private
data, original voices, underground ownership and isolated editions are untouched.

## Flower beds around the existing trees

The user's later correction was to keep the trees and make planted areas around
them. This optional helper never moves/replaces trees or changes routes,
seats, colliders or candidates. The later independent stone-paving/arcade pass
refines the approved architecture and path corners while keeping the tree poses.

The optional buildGardenTreeBeds(T,actualPositions) export consumes the real
upper-city trees gathered by the root installer. Each input is {x,z,radius,
floorY?,trunkRadius?,id?}; the caller must choose radius against the combined
actual roads, roofs, columns, other trunks and existing source owners. Radius
defaults to3.5m and is never expanded beyond a supplied value (maximum4m).
floorY defaults to the .13m garden surface for trees whose metadata base isY0.
It may be supplied explicitly for a genuinely graded patch.

gardenTreeBedPlan exposes deterministic organic outlines, exact trunk gaps,
centres, radii and floor heights. The outline remains inside .98×radius. Soft
groundcover fills an annulus around a clear trunk gap of at least.68m. Curved
stone edging is only.14m above the ground; actual lavender/purple, yellow and
ivory petal fans rise no more than.46m. Each clump has original three-dimensional
petals, stems and tapered leaves, not a texture or a plain rectangular box.

The helper returns {group,beds,positions,dispose}. Its two owned material batches
remain separate from the existing four garden batches. There are no new trees,
lights, colliders, automatic saves or global planting exclusions. In particular,
do not feed these bed footprints back into global tree placement, which could
remove the very trees the user asked to keep. The root mounts/destroys the
optional helper with the upper garden and retains the exact original tree poses.

The focused test verifies18 cleared test trees:28,224 actual bed/flower triangles
across two batches, all vertices inside supplied radii, open trunk gaps, low
height bounds, original route/collider/tree arrays unchanged, and scoped
idempotent disposal without source-resource release. It also retains all prior
garden/retained-street/body-width/shaft checks. For other radii the exact cost is
320 surface triangles plus52×round(radius×9) flower triangles per tree, with a
minimum12 clumps; actual passed positions/radii are returned for root QA.

## Accepted forest after the night-park move

`accepted-street-trees.js` pins the455 existing live street-tree sites and
renderer/RNG order recovered from commit5913a80. The original placement hash
remains `e5d8ba834e82a1996f03c7c3696662976b6868ed5e10b9e8357f5583441df293`.
The live default `urbanPlanting` returns copies of this immutable authority;
regenerating the honeycomb roads or moving the park cannot add, remove or
reseed the existing forest. Explicit alternative plans retain the procedural
source branch. The vacated upper park stays clear pending its separate sketch.

`tests/street-tree-preservation.mjs` checks all455 current roof/wall/path
clearances, including the actual Escher rear dogleg footprint, and verifies
that the real renderer retains all17,290 leaf and7,280 trunk/fork instance
poses. In the real source-campus-before-district startup order, the mounted
collector still returns exactly170 beds with unchanged positions, radii and
ownership order (hash `6a36e9ed8958ef219e37c5ba3ec5ae23f3c6e5d969621705621511b8c3766a65`).
The ordinary urban integration suite keeps its original455/hash assertions;
only its obsolete upper pond-hole assertion changes to the now-vacant grass.
