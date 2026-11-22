# Recessed blue stair alcoves

Implemented 21 November and refined 22 November 2026 in the actual Escher descent. The original
31 aperture positions, widths and spring heights remain. The approved cobalt,
turquoise, ivory and restrained gold direction replaces the old projecting
triangular ornaments with carved three-dimensional cavities.

`escher-niche-model.js` owns the profiles. Each recess is .60m deep. Six hood
courses are shallower at the top and deeper below; each course also recedes
symmetrically from either side toward the centre. Its 1,105 individual pockets
have three regular half-hexagon wall facets. The lower chamber has three equal
length vertical facets fitted to its original aperture. The broader chamber is
hexagon-like, rather than a mathematically regular half hexagon.

The original inner shaft stays fixed. Its masonry thickens outward to .74m;
the museum finish is clipped .64m beyond the inner shaft and the outer solid
band is guarded. The original bottom doorway remains open through that band.
Earth-section cuts follow the real outer masonry. No flight, landing, rail,
source walking surface or controller dimension is moved to obtain depth.

`escher-niche-recess-scene.js` batches the tiled chambers and small carved
pockets into two meshes. The22 November refinement uses one original2048px
ceramic atlas with four separate compositions: a16-point central medallion and
three small ogives, fine floral vines for the side walls, a scrolling border,
and a tiny palmette for the actual pocket faces and curved ceilings. Each wall
panel fits one real equal facet rather than repeating a checkerboard of stars.
Border UVs unroll along the original pointed frame with short repeat modules;
its original geometry also receives a lapis edge finish at oblique views.
The six hood courses use taller lancet mouths, scalloped lips and actual raised,
bevelled gold ribs that follow the roofs into the recess. Eleven thin curved
gold ribs also fan from the forward crown into the deeply recessed return.
The original stone
frame is coated only within its existing footprint, with1mm ceramic skin and
bounded gold crests. Its cover never bridges the real opening. All interiors
remain behind the unchanged wall plane. The surrounding shaft finish is deep
green, independently of the unchanged stair/nosing materials.
Two pooled warm lights illuminate only the closest ledges while the real stair
controller is active; stopping hides both. The lights have no shadows, do not
reallocate during movement, and never modify the sun or world lighting.
There is no per-cell light or claim of physically simulated tile glazing.
The old ornament builder remains as unused historical source only.

Local viewing: `?arrival=escher-alcoves` starts at the existing lower stair mouth
(225,106.5), feet -40m, through the real reversible controller. It is an explicit
visitor shortcut like the existing museum arrivals; normal entrances and puzzle
behaviour remain. Returning from below uses the established passage behaviour.
Append `&view=detail` for a frontal comparison from the actual original tread at
(225.5,101.65), with feet height selected by `descentSurface`. The same walking
controller remains active; this view adds neither a floor nor a new stair route.

Validation includes frozen pre-change instance/geometry hashes for all320
treads/nosings,9 landings,98 posts,2 rail batches and all31 niche centres;
3,315 measured equal pocket facets and4,575 physical depth rays; actual two-way
stair movement, body/headroom and combined pavilion/museum connection tests.
The ceramic test checks seamless bytes, colour/bump spaces, mipmaps and cleanup.
Actual city browser review confirmed climbing the original flight and the blue
interior surfaces from the low stair view. An exposed stone arch return found
during that review was tiled on its real32-segment profile, with regression
rays from the exact reported camera pose. The refined scene uses251,192 ornament
triangles in two shared batches. Saved proof:
`design/visual-walk/escher-blue-alcoves-built.jpg`.
The refinement also validates every blue-frame vertex and triangle centroid
against the original32-segment stone envelope, full ownership of all geometry,
fitted atlas UV bounds, actual raised gold, a bounded light pool and reversible
native control. The initial21 November screenshot is retained as history;
the22 November detail screenshot records the refined execution:
`design/visual-walk/escher-blue-alcoves-ornate-20261122.jpg`.
Run `tests/escher-blue-alcoves.mjs`, `tests/escher-niche-tile-finish.mjs`,
`tests/escher-stair-details.mjs`, `tests/escher-descent.mjs`,
`tests/escher-depth-model.mjs`, `tests/escher-depth-runtime.mjs`,
`tests/escher-shell.mjs`, `tests/escher-rear-portal.mjs`, and
`tests/world-section-earth.mjs`.

This is original geometric interpretation of the approved concept, not a
historical scanned muqarnas model or a pixel-exact reproduction of the sketch.
No voice, private-store or night-world work is part of this change.

The 22 November wall-attachment correction places the pointed-arch spandrels
on the shared shaft face, rather than 15–20mm in front of it. This removes the
floating rectangular shoulder seam. The superseded exposed landing rim/light
bars are removed; the concealed inner ledges and two pooled lights remain.
`tests/escher-niche-wall-attachment.mjs` checks 62 actual shoulder ray hits
against the shaft planes and 28 ray hits at the former isolated bars. The new
test first failed on the original offset geometry, then passed after correction.
All original stair and alcove origins remain unchanged.
