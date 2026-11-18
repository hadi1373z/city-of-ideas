# Earth around the real underground rooms

The section face no longer consists of two unbroken 512 m mineral slabs. Its
opaque earth and seam geometry subtract the actual intersection between the
current diameter plane and bounded underground structures. Moving the section
changes those intersections; an off-plane building does not cut a projected
hole through unrelated earth.

`world-section-earth.js` derives the six rotated house hexagons from the shared
source transforms, the joined corridor footprints from `sixfoldPassagePlan`, and
the museum rooms/stairwell from `ESCHER_DEPTH`. House floor/wall structures open
from Y-40.24 to the surface. Only the actual circular well basin continues to
Y-40.4. Corridor floor/roof structures open Y-40.24..-34.875. Museum openings
include the real floor, walls, roof and the lower room at Y-46. Earth remains
immediately beside and below each structure. The existing central gallery gap
and normal walking geometry are unchanged.

The resulting rectangle union is removed from both mineral panels and thin
seams. Four instanced draws remain bounded; the default east/west section uses
76 pieces. Angle changes replace instance buffers and release the previous
buffers, while an unchanged angle reuses them. The shared box and four materials
are released once with their owner.

`overview('section')` requests the initial +Z camera through the east and west
houses. The gallery retains manual rotation and pauses its automatic orbit in
section mode. `worldCylinder.section` exposes the active section for the complete
house-detail renderer. Standard materials, including newly loaded house finishes,
receive the same section plane and regain their original clipping state on exit.
The established upper-day/lower-night renderer keeps its two physical passes,
shared depth buffer and error-safe renderer/environment restoration.

`tests/world-section-earth.mjs` casts 209 rays through actual instanced earth
faces at rotated house, basin, passage and museum intersections; it also verifies
opaque neighbouring earth, off-plane rejection, resource reuse/disposal, the
default diameter and restoration of global and newly loaded material clipping.
The existing `world-cylinder.mjs` navigation/lifecycle suite and
`world-face-section-renderer.mjs` lighting/depth/restoration suite also pass.
