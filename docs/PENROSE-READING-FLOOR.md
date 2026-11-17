# Penrose stonework in the Mathematics reading hall

The user's final choice is a tiled ground floor. The lower Mathematics hall now
uses a quiet ivory and muted teal Penrose field with fine brass-coloured joints.
The temporary changing-fact display remains a separate dormant experiment; no
fact interface, mirror, reflection pass or animation is part of this finish.

`penrose-reading-floor.js` reuses `createPenroseRhombPatch` from the existing
House of Transformations. Seven Robinson subdivisions of a radius-90 decagonal
seed are paired across shared bases into genuine 36°/144° thin and 72°/108° thick
rhombs. Every displayed parent is paired. Their edges are approximately 3.10 m;
there are no randomly scattered, stretched or rotated replacement diamonds.
The finite substitution patch illustrates Penrose order; a finite floor alone
does not prove aperiodicity of an infinite extension.

One 2048-pixel canvas records the original full parent rhombs in a single
lower-local coordinate frame. A planar map crops that field between radii
24.2 and 52 m. The inner 19–24.2 m circulation band and outer 52–58 m reading/exit
aisle stay plain stone. The existing fine circular inlays remain in place.
No new decorative geometry competes with the paper monitors or sculpture courts.

`installPenroseReadingFloor(M,T)` borrows the exact existing mesh tagged
`gallerySurface='floor'`. It changes only its material. The annulus's positions,
index, normals, absent UV attribute, height .13, open central well and collision
surfaces remain unchanged. The three glazed upper floors retain their materials.
The owned Lambert material uses planar local-position mapping and preserves
Three's standard lighting, fog and clipping chunks for the cylinder cutaway and
pond. It adds no lights, DOM controls, movement/update hook, timer, asset fetch,
private-data access or voice change.

The returned `M.penroseReadingFloor` supplies `visit()` for the supported r29
ground view and `dispose()` for exact original-material restoration. Cleanup
disposes only its owned texture and material. The shared source stone, floor
geometry, upper glazing and other scene resources remain owned by their builders.

`node tests/penrose-reading-floor.mjs` checks true rhomb side lengths and angles,
pairing, deterministic field coverage and absence of positive-area overlaps,
standard shader clipping/fog hooks, the actual annulus and lower half-turn
raycasts, source material/geometry preservation, safe visit and cleanup.
