# Recessed blue stair alcoves

Implemented 21 November 2026 in the actual Escher museum descent. The original
31 aperture positions, widths and spring heights remain. The approved cobalt,
turquoise, ivory and restrained gold direction replaces the old projecting
triangular ornaments with carved three-dimensional cavities.

`escher-niche-model.js` owns the profiles. Each recess is .60m deep. Six hood
courses are shallower at the top and deeper below; each course also recedes
symmetrically from either side toward the centre. Its 985 individual pockets
have three regular half-hexagon wall facets. The lower chamber has three equal
length vertical facets fitted to its original aperture. The broader chamber is
hexagon-like, rather than a mathematically regular half hexagon.

The original inner shaft stays fixed. Its masonry thickens outward to .74m;
the museum finish is clipped .64m beyond the inner shaft and the outer solid
band is guarded. The original bottom doorway remains open through that band.
Earth-section cuts follow the real outer masonry. No flight, landing, rail,
source walking surface or controller dimension is moved to obtain depth.

`escher-niche-recess-scene.js` batches the tiled chambers and small carved
pockets into two meshes. Original seamless cobalt floral/star ceramic uses a
512px colour map and a shallow neutral bump map. Fine gold seams and warm
self-luminous concealed ledge strips accompany existing stair illumination;
there is no added per-cell light or claim of physically simulated tile glazing.
The old ornament builder remains as unused historical source only.

Local viewing: `?arrival=escher-alcoves` starts at the existing lower stair mouth
(225,106.5), feet -40m, through the real reversible controller. It is an explicit
visitor shortcut like the existing museum arrivals; normal entrances and puzzle
behaviour remain. Returning from below uses the established passage behaviour.

Validation includes frozen pre-change instance/geometry hashes for all320
treads/nosings,9 landings,98 posts,2 rail batches and all31 niche centres;
2,955 measured equal pocket facets and4,095 physical depth rays; actual two-way
stair movement, body/headroom and combined pavilion/museum connection tests.
The ceramic test checks seamless bytes, colour/bump spaces, mipmaps and cleanup.
Actual city browser review confirmed climbing the original flight and the blue
interior surfaces from the low stair view. An exposed stone arch return found
during that review was tiled on its real32-segment profile, with regression
rays from the exact reported camera pose. The final scene uses189,917 ornament
triangles in two shared batches. Saved proof:
`design/visual-walk/escher-blue-alcoves-built.jpg`.
Run `tests/escher-blue-alcoves.mjs`, `tests/escher-niche-tile-finish.mjs`,
`tests/escher-stair-details.mjs`, `tests/escher-descent.mjs`,
`tests/escher-depth-model.mjs`, `tests/escher-depth-runtime.mjs`,
`tests/escher-shell.mjs`, `tests/escher-rear-portal.mjs`, and
`tests/world-section-earth.mjs`.

This is original geometric interpretation of the approved concept, not a
historical scanned muqarnas model or a pixel-exact reproduction of the sketch.
No voice, private-store or night-world work is part of this change.
