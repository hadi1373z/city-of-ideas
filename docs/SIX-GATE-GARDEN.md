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
and eight metres of level walking width. Forty-eight arcade bays sit between
six open radial gateways. Two rows of supported cream-stone columns carry
ninety-six real shallow elliptical arches and a slate roof with bronze seams.
Each gateway has a separate four-column loggia, two actual arched apertures
and a hipped slate roof. There are no invisible doors or closed fence spans.

The two column rows stand outside the eight-metre walking band at radius100.1
and109.9m. Their .43m bases have matching colliders. The lowest arch spring is
2.75m and roof eaves4.95m; ordinary visitors have real headroom throughout.
Both sides of the covered promenade stay open. Walking feet stay atY.13m.
Real paving slabs have thickness .165m, including narrow actual overlaps at
rotated joins to avoid cracks after Float32 coordinate quantisation.

The existing central block streets cross the arcade at the six30° sector
bisectors. An evenly spaced column grid would put a pair directly in each
street. gardenBayBoundary shifts only that shared pair tangentially4.5m at
the inner row, retaining every other column and all six house loggias. Both
adjacent arches and roof polygons use the same shifted boundary; there is no
unsupported cut or roof gap. GARDEN_RETAINED_CROSSINGS records the six existing
5.5m-wide crossing reserves for planting. All30 existing central grid edges
remain public routes, independently of the six new house rays.

An open inner promenade at radius74m joins the existing east/west Gallery
thresholds atX±67. Six radial routes begin at that promenade. They do not claim
six new openings through the Gallery wall. Each house route reaches local
radial125/tangent34 before turning along tangent34 to the original doorway
at local tangent26. This elbow passes around the source hexagon rather than
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

Shared exports from the model:

- SIX_GATE_GARDEN: dimensions and surface ID.
- GARDEN_GATES / GARDEN_ENTRIES: six exact public gate positions and old doors.
- GARDEN_ROUTES: both loops, six rays, house elbows, courts and street joins.
- GARDEN_FOOTPRINTS:48 actual roof polygons, six loggia roof polygons and18
  seat/bed footprints. Roofs have walkThrough:true: reserve their volume for
  planting and maps without treating the entire arcade as a solid collider.
- GARDEN_COLUMNS / GARDEN_COLLIDERS: actual bases and furniture.
- gardenBayBoundary / GARDEN_RETAINED_CROSSINGS: supported arcade bay boundaries
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
proxies. The check covers30,906 body-width rays through both loops, gates,
elbow routes and source doorways,35,640 additional rays along all30 retained
central-grid edges, and10,284 real slab-support samples. Upward
coverage checks prove the new garden cannot cap Babel or any of the six
existing shaft holes. It checks the original house/network authority remains
unchanged, full-crown exclusions and bounded geometry. Owned cleanup releases
each new rendered resource exactly once without disposing source-house assets.
The scene uses four finite material batches and fewer than65,000 triangles.

This focused check does not certify unrelated Gallery roof approaches, source
trees or existing honeycomb walls. Root owns the combined live-city route/tree
audit and browser review after shared layout integration. Existing private
data, original voices, underground ownership and isolated editions are untouched.

## Flower beds around the existing trees

The user's later correction was to keep the trees and make planted areas around
them. It does not authorize moving/replacing trees or changing the accepted
paths and seats. The original GARDEN_ROUTES, GARDEN_COLLIDERS,
GARDEN_TREE_CANDIDATES and four-batch garden architecture remain unchanged.

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
