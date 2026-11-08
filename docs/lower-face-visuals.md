# Lower-face landscape

The scene in `world-cylinder-scene.js` now frames the preserved lower-world
buildings with warm, unpatterned stone, darker meadow greens and restrained
planting. The current campus places the working Mathematics wing at local
`(-80,0)` and Ramsey House at `(-121,2)` alongside the central Faculty rotunda.
The gallery, garden markers, Object Market, travel stations and return door
retain their established positions. This landscape never moves source geometry.

The gallery approach first exits the real western opening to `(-64,0)`, then
bends through `(-64,18)` and `(-101,18)` around the working Mathematics wing,
passing beside Ramsey House and the return door into the broad garden court.
The academic branch ends at the actual Math spawn `(-80,32.8)`; the reading branch
ends at the actual Ramsey entry `(-121,6.8)`. Obsolete courts at their former
positions are removed. Six continuous campus walks connect the destinations. Flush
forecourts join the object-market approach, mathematics approach, Ramsey reading
walk and the three travel-station entrances. Low elliptical planted beds and
visible branching trees frame the edges, leaving the central paths and
all established entrances clear. Two open pergolas and three small stone seats
give the existing public reading areas shade and enclosure without adding houses
or destination boards. Small inset light strips remain steady and require no
point lights or animation.

Three instanced mineral tones describe nine broad courses around the cylinder's
outer wall, making its physical thickness readable. These are original scene
geometry, with no claim to historical geology. Lower-face daylight has been
reduced slightly to keep pale markers and courts distinct from their backgrounds.

`built.sectionCut` is an owned, initially hidden presentation group for the
section overview. Four instanced meshes describe the actual y=0 to y=−96
thickness across local x=−570…−58 and x=58…570 on the z=0 diameter plane. The
116m central opening keeps the real Babel / gallery shaft visible. The controller
may enable it only for the section and set its Y rotation to the camera's orbit
angle. It does not change the island, floors, doors, routes or navigation in
ordinary views. Double-sided mineral panels and quiet horizontal seams make
the thickness legible without text boards or additional animated materials.

`built.lowerObstacles` exposes every new solid as conservative circles with
`{x,z,radius,r,kind,space:'logical-lower'}`. Coordinates use the preserved source
world: local X minus 2160, local Z minus 65. The world controller can add these to
its existing lower collision checks. `built.lowerPaths` exposes the eight route
centerlines in local lower-face coordinates, together with their widths.

All court, planting, timber, seat and light-strip geometry is instanced. Resources
belong to the cylinder's existing owned set and are disposed with it. No voice,
note, save or external service is used.

Verification: `node tests/lower-face-visuals.mjs` checks finite geometry, bounded
draws/instances, clear path widths and unchanged entry clearance, actual paving
under the inverted coordinate frame, batched edge courses and owned cleanup.
`tests/world-cylinder.mjs` and `tests/two-face-gallery.mjs` continue to pass.

## Meadow, inlet and shore circuit

`lower-landscape-model.js` and `lower-landscape-scene.js` extend the campus into
three broad landscape zones: soft-edged silver-green meadow clearings, an inlet
with reed banks reaching the ocean, and an irregular slate shore. Twelve small
groves give the outward walks shade and visual depth while keeping the outer
landscape calm. The former fourteen closed canopy trees are replaced, together
with the groves, by 180 trees with visible tapered forks and individually shaped
leaves. The foliage method is adapted from this project's existing upper-city
trees, with a bounded lower-face cluster budget. No texture downloads, external
assets, extra houses or destination boards are added.

A smooth 1,980m circuit branches from the quiet garden at local (-191,-4), passes
through the meadows and across the inlet, and rejoins the existing travel-station
walk at (-101,85). A connected eastern branch reaches the ocean overlook at
(520,134), with a broad landward opening, a low outward rail and two stone seats.
The ring at radius536 remains a complete shore promenade: a second curved timber
footbridge crosses the inlet mouth where it meets the ocean. Both bridges have
real decks and rail gaps and retain the .13m reference feet height.

The exposed `built.lowerLandscape.canStand(localX,localZ)` rejects open water
except these physical bridge spans. Apply it only to ordinary ground walking,
in addition to the world controller's existing source/Faculty/solid checks.
The central island aperture and all source lots stay untouched. Landscape solids
are already appended to `built.lowerObstacles`; route lines are already appended
to `built.lowerPaths`. Coordinates in `lowerLandscape.anchors` and `contract`
are explicitly local lower coordinates, before the rigid half-turn. Convert
them to logical source coordinates with X-2160,Z-65 for the simulation.

The main bridge occupies local X283.8..297.2,Z-80..18. The shore bridge follows
radius536, width9, angle-0.24..-0.025 radians. The overlook anchor is (520,134),
feetY.13, radius11, with outward yaw -atan2(520,134). These anchors describe actual
connected walkable places and may be used by the shared guide and minimap.

The complete cylinder is 44 mesh draws / 7,687 instances. The extension is 15
mesh draws and 277,932 triangles, mostly small leaves and forked branches. It
is part of the lower frame and follows that frame's visibility, so it does not
render over the default Babel view. Repeated geometry is instanced; no per-frame
animation or point lights are added. Owned resources register with the cylinder's
existing owned set. The child disposer removes its group and releases only its
own instance resources before the cylinder cleanup traverses remaining geometry;
future host-owned guide meshes are not disposed by the landscape.

`node tests/lower-landscape.mjs` checks 7,113 full-width/source/shore probes, open
water rejection, both real inverted bridge decks, complete shore walking, route
and overlook joins, geometry budgets, natural tree construction and strict
resource ownership. `lower-face-visuals.mjs` keeps the original entrance/Faculty
clearance checks and physical paving rays across all eight walks.
