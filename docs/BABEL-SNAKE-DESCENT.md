# One more floor in the gallery stairwell

A new flight sits directly beneath the existing gallery stairs, in the same x/z
footprint. It connects the ground-floor landing at z=11.2 with the underground
library floor at z=0. The centre, head width, forty treads and .28 m tread depth
match the upper flights. Its rise is about .21 m to meet the existing −8 m
terrace exactly. The original five library terraces, shelves, internal radial
flights, reading desks and finite 4^6 catalogue remain in place.

The shared layout defines the ground-floor and vault-ceiling openings, entry,
flight and lower landing. A 6.4 m deep bottom overlook meets the original first terrace and shares its
floor material;
its curved edge fills only the void inside that terrace rather than drawing an
overlapping floor. Balcony rails leave an opening at this join. Upper and lower
stairs share the already loaded snake drawing, sampled in world coordinates.
The library owns its shader and geometry, and does not dispose that borrowed
texture. Handrails, nosings, vertical risers and opening guards follow the
same stair treatment. The snake drawing warms toward the library palette with depth. Oak cheek walls
support small tiered bookcases beside the flight, using the existing book, brass
and lamp materials. The underground vault opening widens around this join; the
original ground slab opening and forty-tread footprint stay exact. No separate
destination board is added.

The old northern opening is closed by the ordinary gallery and vault geometry.
The gallery plinth and island retain their full basement void. The gallery guard
allows the existing upward flight at its lower end, and starts the underground
route only at the descending flight’s ground-floor landing. Walking into that
landing preserves a held movement key. The same route can be climbed back.
The explicit return button and direct library preview remain available.
Lighting restoration and existing book interaction gates are preserved.

Checks compare the upper/lower footprint and head measurements, every new physical
tread against navigation height, shaft headroom, left/centre/right descent, the
landing-to-ring connection, original reversible flights, floor holes, borrowed
texture ownership and the finite-catalogue tests. Entrance preview:
`?arrival=babel-stairs`; direct underground preview: `?arrival=babel`.

The final terrace now opens eastward through two omitted shelf bays. The full
book-and-joinery cut provides a clear doorway at least 4 m wide from the original
last aisle into the through-gallery's top bridge (x=9..18, z=±1.8, y=−24). The
original five terraces, four radial flights, five catalogue desks and central
book well remain. The pit base is built as a centre disk r=0..13.9 and an outer
ring r=18.1..57.4, leaving a real open annulus for the deeper route at r=16. No
floor, ceiling beam or shelf geometry spans that shaft at the old base height.

Geometry checks raycast the complete annular opening and the four-metre doorway,
verify shared overlook/floor and lamp materials, and verify each owned geometry,
material and label texture is disposed exactly once. The borrowed snake drawing
and optional borrowed landing material remain owned by their callers.


## Finished opening and single-owner landings

The oak reveal follows the actual widened rectangular ceiling cut on all four sides. A pitched oak soffit and side bearers finish the visible underside of the first upper gallery flight, without moving any of its original treads or the snake drawing. All headroom probes and the reversible stair footprint remain required. Balcony rails now have an oak grip, a lower brass rail and wider posts seated on low footings; radial stair rails have continuous upper/lower members and post feet.

At the last terrace, the outer floor is geometrically clipped at the through-gallery bridge rectangle (X9..18, Z±1.8), so the bridge alone supplies that surface. The last tread of each original radial flight is supplied by its existing lower terrace rather than a coplanar extra box. Flat bands use 320 angular segments to retain the established 65-draw / 380k-triangle budget with the stronger rail joinery. No polygon-offset decal or raised walking surface hides the overlap.

The same repair covers the gallery–Escher corridor: its floor and ceiling rectangles are partitioned into a non-overlapping union. The floor begins at the central gallery spur endpoint and ends exactly at the museum vestibule floor boundary. Collision models, transfers, room locations, notes and voices are unchanged. tests/library-surface-joins.mjs rays the combined scenes so a duplicate floor cannot be concealed by testing each builder alone.

The measured first-upper-flight follow-up in [GALLERY-FLIGHT-BEARINGS.md](GALLERY-FLIGHT-BEARINGS.md)
adds four small bearer/tread contact patches without moving the soffit or source stairs.
It also records the existing frontal upper-entry guard limitation separately from
successful angled walking; movement code remains unchanged in that support review.
