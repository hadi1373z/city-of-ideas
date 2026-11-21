# Six Gate Garden · the six patterned house roofs

The user rejected the leftover plain coloured pyramids after approving the
Six Gate Garden A reference. The six existing houses now have nearly level,
pale honey-limestone roofs with inset mathematical tile fields, raised stone
borders and a narrow brass edge cap. This changes only their visible roofs.
The central Gallery roof and its materials are not part of this change.

`sixfold-house-roof-model.js` owns the source-frame dimensions and finite roof
fields. It reuses `createHouseTiling`, including exact parent polygons, stable
parent IDs, true crop boundaries and grout applied before clipping. The six
fields follow each existing `h.pattern`: Penrose, hexagonal, triangular, square,
octagon-square and trihexagonal. They are coarser than the interior tiles so
their geometry remains legible from the garden aerial view. The Penrose field
is a finite Robinson-substitution crop, not a proof of infinite aperiodicity.

`buildSixfoldHouseRoof(THREE,{pattern})` in the new roof scene returns
`{group,model,meshes,dispose}`. The source centre remains X125. Roof slab
undersideY23.97 overlaps the source wall topY24 and stays above the unchanged
interior crown maximumY23.95. The bearing slab ends atY24.31, real inset tile
prisms atY24.415 and raised stone parapet atY24.88. Its outer radius25 matches
the old roof envelope, preserving every footprint, doorway, shaft and pose.
No full-roof transparent material or second decorative floating roof is added.

The original small radius3.8 central glazed lantern footprint remains the only
glass element. It now meets a real cut through the stone roof; a restrained
stone sill and six slender brass mullions support its shallow glazed cap.
The original interior tiled crown is deliberately unchanged. Do not describe
this as a newly opened through-well or change the observatory lesson.

The six-house owner calls the source house builder with `includeRoof:false`.
Neither detailed clones nor distant shells therefore contain the old cone or
its coloured material overrides. Each house instead mounts one persistent
patterned roof outside the near/far toggle, at the exact original house
transform. That same object remains visible in both modes and follows the
existing underground exterior hiding/restoration rule. The reusable legacy
source house keeps its default old roof when called independently; it is not
another live instance. All source walking geometry, eight floors, 448 treads,
landings, doors, ceiling crown, secret shelf, room IDs and pendulum poses remain
unchanged.

There are three owned material batches per roof: opaque stone/tile geometry,
quiet brass framing, and the small transparent lantern. They use no textures,
lights, animations, state storage or network requests. Tile fields contain
31–150 parent cells, depending on pattern; final roofs have3,940–7,188
triangles. Idempotent cleanup releases only their own buffers and materials.

Run `node tests/sixfold-garden-roofs.mjs`. It checks actual tile/slab/rim mesh
heights and bounds, exact finite field area and pre-crop joints, rays through
the glazed roof cut, front-side tile visibility, source wall bearing and crown
clearance, original walking buffers and furniture poses byte-for-byte, exact
world transforms, no old live cones, persistent near/far geometry, underground
culling/restoration and once-only scoped disposal. Also run the existing
`transformation-house.mjs`, `sixfold-house-network.mjs` and
`sixfold-tilings.mjs` checks. Root owns the final integrated browser comparison
against the approved sketch and ordinary live-city release checks.
