# The inhabited mind

The user-approved sculpture sketch is now the authority for the existing outdoor
de Chirico installation at `(226, .13, 202)`. This is new original geometry, an
artistic interpretation, not a replica or licensed reproduction of the painting.
The existing philosophy exhibition ID, artist, artwork reference, private-note
IDs, other three artworks and original arrival `(226,191)` are preserved.

`de-chirico-model.js` owns placement, palette, four miniature towers, two figures,
four banded square columns, a complete visitor loop and height-aware solids.
`de-chirico-scene.js` owns the meshes and resources. The old public builder in
`de-chirico-exhibit.js` delegates to it. `idea-exhibitions.js` adds the existing
city collision chain, restoring it on disposal if it still owns that wrapper.

The two similarly proportioned ivory mannequins have tapered faceted robes,
separate hem folds, inclined faceless oval heads and timber-coloured articulated
arms. Presented arms have actual shoulder/elbow/wrist hinge discs and pins,
upturned palms, four independently bent fingers and an opposing thumb. Quiet
outside arms rest alongside the robe. The four separate square towers are yellow,
teal (tallest), terracotta and dark stone. Extruded jamb/spandrel geometry leaves
real arched ground openings; higher arched windows have recessed solid backs.
Their openings are miniature sculpture details, narrower than a person.

The original 13×10m warm stone plinth stays flush with the source ground. A small
engraved eye lies at world(226,188), 14m in front of the sculpture centre on the
public approach, giving the tall columns room in the frame. The original arrival
is unchanged at(226,191). From this negative-Z view the towers read yellow, teal,
terracotta and dark from left to right; the side plaque is at negative localX,
which appears on the viewer's right. Nothing tall occupies the
main sightline. A sloped low plaque sits to the right. The complete perimeter
route passes around figures and towers and between the square columns. No tree,
existing route, room, painting or neighbouring building was moved or removed.

All grain and plaque lettering are generated locally; no external images or new
lights are loaded. Repeated masonry, fingers and hinges share geometry through
instancing. The complete installation uses29 meshes/draws and201 detail instances
(about16,155 rendered triangles). There are no timers, animation loops, storage
writes or audio changes. Resources are explicitly owned and disposed once.

The21 November daytime visual walk refined only the mineral finish. The
original tiny grain was invisible from the actual arrival and the stone read
as uniform plastic. A deterministic seamless field now combines broad, very
restrained near-white colour modulation with fine height and matte roughness.
Colour values stay within.93..1 in sRGB, preserving the palette and the warm
ivory; height/roughness textures remain linear data. Ivory uses1.5mm nominal
bump scale and other masonry4mm. Tall column instances deliberately omit bump
because their stretched unit-box UVs otherwise suggest false vertical fluting.
All three256px texture sheets share three bulk canvas uploads. No geometry,
lights, destinations, trees, collisions or draw counts change.

The visual walk inspected the Academy entrance, its central court and frontal/
oblique views of this installation using real walking controls. This material
polish does not claim an exact match to the watercolor concept's surrounding
arcades, paving, planting or illustrative lighting. Browser proof is saved in
design/visual-walk/de-chirico-material-before.jpg and
design/visual-walk/de-chirico-material-after.jpg.

Verification: `node tests/de-chirico.mjs` and `node tests/idea-exhibitions.mjs`.
The shared finish, seam periodicity, colour/data spaces, canvas upload path and
texture cleanup are checked by `node tests/de-chirico-finish.mjs`.
The new suite probes real portal apertures, solid jambs, recessed window backs,
outward-facing robe normals, both visible heads from the marked view, body-radius
clearance and actual flush support along the walking loop, height gating and
idempotent shared resource disposal. Browser visual review remains a separate
release check; numerical geometry tests do not claim a measured aesthetic result.
