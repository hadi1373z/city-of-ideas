# Preserved homes on the night face

The approved honeycomb redesign moves the appended personal-home neighbourhood
to the lower, permanently night face. This is a presentation change. Each home
keeps its original ID, edition, room coordinates, floors, furniture, notes,
imported assets, links and local source renderer. No saved house is rewritten.
The original Socrates city residence remains its original public destination.

`night-home-layout.js` owns a deterministic table of 131 clear parcels, enough
for the source neighbourhood validator's existing maximum of 128 editions.
New editions retain their first assigned lot index. The earliest houses form a
southern neighbourhood around lower-local `(-108,378)`. Later parcels extend
over the same circular lower face. They are possible locations, not empty
houses: only actual source neighbourhood records create geometry.

The source model confines all rooms to its 20 by 16 grid. At the unchanged
1.35 presentation scale, the full room footprint fits within local
`±13.5 × ±10.8` metres. Established parcels use54-metre spacing; replacement yards remain separated
by at least52 metres in X or54 in Z. Their source yard bounds,
door approaches and original local collision delegates are retained. There is
no new runtime size rejection or new limit on preserved documents.

Parcel selection avoids the real inlet, existing campus, meadow circuit and
complete night-park reserve. New lower planting clears every full house yard. A connected graph of four-metre stone walks joins
the real meadow-circuit point `(-30,175)` to each source home entrance. Source
logical coordinates are still used: lower-local X minus2160, Z minus65. The
world's existing proper half-turn then places each mounted home on the actual
lower face. Home meshes never receive a second baked reflection.

Shared route trunks and overlapping collinear segments have one physical
owner. All active access paving is merged into one mesh, with one instanced
parcel mesh beside it. Per-home routes stay separate as metadata for the map
and navigation checks. No point light is added per house; the existing lower
moonlight and ambient lighting illuminate the preserved source facades.

`extra-districts.js` exposes in-memory `homeLayout` positions and paths for the
lower minimap, plus an `onGeometryChanged` lifecycle subscription. The world
subscribes before late house restoration. Rebuilding the same number of homes
therefore remounts replacement source groups immediately; an unrelated object
count change is not required. Rescanning releases a stale wrapper without
disposing its source contents again. Teardown unsubscribes cleanly.

Lower-ground movement composes the original district collision delegate across
the whole lower face, including homes outside the old Graveyard rectangle.
The finite coast, inlet, Faculty, monitors and landscape guards remain active.
The generic Homes marker and actual access paths appear on the lower minimap;
no private title or note is needed to draw them.

`tests/night-home-neighborhood.mjs` samples 72,083 route points against the
actual landscape's solid obstacles, checks all128 supported source footprints
on dry bounded land, builds four real source editions and checks their doors,
walls and routes, replaces a home without changing the object count, and
verifies exact single-frame mounting and source-safe wrapper cleanup. It uses
synthetic documents and rejects any attempted browser-storage access. Existing
world, home-restoration, appended-district and complete paper-gallery route
checks also remain required.

The complete Ideas Park relocation uses the fixed presentation replacements
and paths in `night-home-park-layout.js`. Of the128 supported parcels,31 shift
and97 keep their established positions;131 possible slots remain available.
Source IDs, rooms, notes and edition coordinates are unchanged. Access paths
clear actual trees, full yards and real original house walls. See
`NIGHT-IDEAS-PARK.md` for the shared spatial and maintenance authority.
