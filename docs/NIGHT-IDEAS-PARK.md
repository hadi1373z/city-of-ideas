# Original Ideas Park on the night face

The complete original Atlas park now belongs to the permanently night face.
`night-park-model.js` is its spatial authority. Its logical source parent is
at **(−2200,.015,−430)**, scale **.65**; the lower-local centre is
**(−40,−365)**. The existing world half-turn maps that parent to the physical
lower face. Individual people, seeds, district/tool anchors and animations
retain their original local coordinates and IDs.

The source builder contains **118 people and 620 original trees**, rendered as
**1240 crown instances**. All survive. The five original lawn hexes also move
with the park. Their source offsets are frozen to the former day site at
`(0,−375)`, rather than recomputed from the relocated configuration. The full
five-lawn footprint, including its eastern extension, fits inside the coast.
The vacated five upper cells remain open grass pending the user's replacement
sketch; this change adds no replacement buildings there.

## Arrival, walking and light

`installNightPark(M,T)` runs before `installOrigamiPark`, discoveries/question
companions and the coastal tree-bed collector. It moves the existing park
parent, updates the shared `PARK` and landmark, intercepts the existing `park`
destination and exposes `M.nightPark`. It does not rebuild the original park.

The arrival is logical **(−2320,.13,−365)**, lower-local **(−160,−300)**,
on the existing meadow circuit, facing into the park. `NIGHT_PARK_APPROACH`
defines a five-metre level walk ending outside the original fountain rim.
Feet stay at logical **.13**. Movement remains the ordinary held-input lower
controller, including the original source collision delegates, Faculty,
landscape, inlet and coast guards. `?arrival=ideas-park` and the existing Park
choice use the same visit function.

The native classic city, district planner and Graveyard wrapper all accept the
same physical night disk (565 m usable radius about logical −2160,−65).
The old Graveyard content rectangle and dynamically restored home bounds must
never limit night walking. The regression builds the actual classic city and
source park, original appended districts and travel-station colliders, then
installs the real Graveyard and cylinder wrappers before driving held input
from the Faculty circuit through the park and back. It also checks the arrival
and four neighbouring positions, both sides of the entire native coast, and
night coast/void rejection before any private home is loaded.

Twelve warm lanterns have actual bronze standards and glowing panes. Four
pooled point lights illuminate the nearest fixtures; all twelve remain visibly
lit. Fixtures and the new path use three draw meshes and shared resources.
The real posts contribute conservative walking collisions. Park interaction
prompts require the correct face and ground height. Source origami birds,
three floating paper boats, the question crane and the discoveries boats
follow the same logical park placement and are mounted through the one lower
frame. Their lessons and storage keys are unchanged.

## Home and landscape clearance

The complete park reserve is the union of its activity circle and all five
actual lawn polygons. The former home table offered 131 possible parcels for
the unchanged128-edition source limit. **31 of the first128 presentation
parcels move;97 keep their established positions.** Including the three unused
future slots,33 of 131 change. The fixed index-to-parcel table is in
`night-home-park-layout.js`; source home IDs, editions, rooms, notes and private
storage are never inputs to this migration.

Replacement lots clear complete original roofs and yards. Public access paths
use fixed, simplified waypoints generated offline from a three-metre dry-land
graph, so the browser performs no placement search. Shared roads retain their
existing single owner. `tests/helpers/night-park-access.mjs` regenerates access
waypoints from these fixed parcels and the actual lower solids when necessary.

The newer lower-landscape planting respects the park, arrival path and all
complete home yards. Its resulting tree count is **136**, separate from the
unchanged 620 original park trees. This is a precise planting reserve; neither
source park trees nor private house contents are trimmed or copied.

## The pond now looks back to daylight

The original fountain basin, rim, lower water and boats remain. Its live water
window now captures the **upper face of the same scene** from the night park.
The descriptor supplies both logical source coordinates and its physical
source plane. A physical half-turn with 18× magnification gives a correctly
oriented +Y-up daylight camera. Main and photo captures use the same mapping.

`worldCylinder.withUpperEnvironment` temporarily restores actual upper root
visibility, daylight, sun intensity, fog and upper-sea fog uniforms, then
restores the current night frame even after an exception. The water overlay
keeps its recursion, frustum, proximity and throttling guards. Renderer target,
viewport, scissor, clear, XR and shadow state remain scoped to the capture.
The original legacy upper-to-lower descriptor remains available for regression
coverage; the installed descriptor follows the shared live park site.

“Travel to the other face” uses the existing live 3D crossing in reverse and
arrives at the former upper approach **(0,.13,−222)**. Reduced motion and Skip
finish at that same valid day position. Optional future `pondTransitionVideo`
configuration remains unchanged; no video or voice asset is introduced.

## Ownership and verification

`night-park-model.js` owns site/entry/lawns/path/lantern reserves;
`night-park.js` owns the new fixtures, light pool and source-parent placement;
the original park and companion modules own their contents. World-cylinder
mounting owns the physical half-turn. Coastal and night maps consume the same
model. Every new resource is disposed by its owner; borrowed source geometry
is restored and never disposed by the relocation.

Run `node tests/night-park.mjs`, `node tests/park-relocation.mjs`,
`node tests/night-home-neighborhood.mjs`, `node tests/pond-world-window.mjs`,
`node tests/world-cylinder.mjs`, `node tests/lower-landscape.mjs`,
`node tests/city-discoveries-ui.mjs`, `node tests/question-walk.mjs` and
`node tests/origami-bird.mjs`. The park check exercises 1190 held-input steps
from the real lower hall exit to the park and back, pause/height/post gates,
real post rays, source-anchor preservation, all 128 roof/yard reserves, live
daylight water captures including thrown renders, reverse travel and strict
owned cleanup. The home check probes 72,083 actual route points and real source
doors/walls. Synthetic tests reject private-storage access.
