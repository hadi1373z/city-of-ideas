# Six mathematical finishes for the full houses

`sixfold-tiling-model.js` supplies genuine parent polygons in one unshifted
coordinate field. IDs depend on lattice coordinates, never on crop size or a
random placement. The six pattern IDs are `penrose`, `hexagonal`, `triangular`,
`square`, `octagon-square` and `trihexagonal`.

The periodic constructions use exact regular polygons with one common side
length. Their interior vertex figures are respectively 6.6.6, six triangles,
4.4.4.4, 4.8.8 and 3.6.3.6. In the octagon-square field, regular octagons have
centres separated by `(1 + sqrt(2)) * edge`, and the intervening squares are
rotated 45 degrees. In the trihexagonal field, vertex-touching hexagons have a
triangular centre lattice with side `2 * edge`; two equilateral triangles fill
each fundamental cell. The Penrose construction retains the established
Robinson subdivision, paired bases, full coordinates and `rhomb-*` IDs. It is
a finite substitution crop, not a proof about every infinite extension.

The existing house model now accepts `pattern` in `createHouseTiling`,
`createHouseWallTiling`, `createHouseStairTiling` and
`createHouseLandingTiling`. The default is still Penrose. Only the parent
polygons change. The exact outer hexagon, circular-well exclusion, true
door/window/sill/lintel crops, convex subtraction fragments, insets and landing
domains are reused. Grout is applied before domain clipping, so a cut edge does
not acquire a false seam. Floors, ceilings, landings and crown share parent
coordinates and IDs; every wall unfolds from one perimeter-height field rather
than restarting at every room. The framed final wall seam is retained honestly.
Stair caps keep the same 448 tread heights and 64 geometric templates.

`buildHouseTiling(THREE, {pattern, compact:true})` is the recommended renderer
for the six-house installation. It combines all 29 original finish surfaces into
two material batches and preserves their supplied normals, positions and vertex
colours. `surfaceRecords` and the existing `floors`, `ceilings`, `walls`, etc.
arrays then contain inspection records with names, userData and
`range:{batch,start,count}` into `batches[batch].geometry`. They are metadata,
not separate render meshes. Without `compact:true`, these arrays retain the
original per-surface Mesh API. Default tests and geometry remain compatible.

All buffers retain the original house coordinate frame centred at X125; mounting
and rotating whole houses belongs to the shared parent/prototype owner. No new
ground, collision surface, light, texture, UI, voice or private state is added.
Each finish owns its two materials and geometry; disposing it cannot dispose a
shared house prototype. Intermediate geometry is released before GPU rendering
in compact mode. Final geometry uses approximately 4.2–8.6 MiB per pattern, with
two draw meshes rather than 29. Lazy construction/culling belongs to the host.

Run `node tests/sixfold-tilings.mjs`, `node tests/house-tiling.mjs` and
`node tests/transformation-house.mjs`. The new suite independently tests regular
edge lengths/angles, actual vertex figures, point coverage and polygon overlaps,
then checks all house areas/apertures and compares every original finish buffer
against its compact vertex range. No external images or copied meshes are used.
