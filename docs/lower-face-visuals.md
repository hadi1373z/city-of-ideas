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
positions are removed. Six continuous walks connect the destinations. Flush
forecourts join the object-market approach, mathematics approach, Ramsey reading
walk and the three travel-station entrances. Low elliptical planted beds and
fourteen clustered-canopy trees frame the edges, leaving the central paths and
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
its existing lower collision checks. `built.lowerPaths` exposes the six route
centerlines in local lower-face coordinates, together with their widths.

All court, planting, timber, seat and light-strip geometry is instanced. Resources
belong to the cylinder's existing owned set and are disposed with it. No voice,
note, save or external service is used.

Verification: `node tests/lower-face-visuals.mjs` checks finite geometry, bounded
draws/instances, clear path widths and unchanged entry clearance, actual paving
under the inverted coordinate frame, batched edge courses and owned cleanup.
`tests/world-cylinder.mjs` and `tests/two-face-gallery.mjs` continue to pass.
