# A continuous wall-to-flight transformation

The painted bird field, curved relief and living flock use the same original
opposite-edge tile. This is original geometry, not a copied Escher print.
The complete cylinder and its real doors remain. Its exposed lining is now brushed-silver aluminium, with a restrained specular response and subtle directional grain. The original ivory, ochre and slate birds retain their colours, shape, animated ownership and landing positions.

The dense field is a single continuous painted surface. The long black feather
strokes are removed; only small eyes remain. Production uses no horizontal
relief LOD bands, avoiding the visible shading stripes between bands.

A smooth threefold wave opens the lower field. Motifs keep their original size
instead of randomly shrinking into isolated stickers. One instanced curved skin
lifts their wings progressively. The head and beak remain pinned; the whole head
is never treated as a hinged wing.

Exactly 64 source cells belong to the live flock. These cells are omitted from
both the static relief and the painted proxy, so a moving bird never sits over
an opaque duplicate. The living skin itself supplies the flat wall pose,
slowly peels away, gains thickness and begins its clockwise wall orbit. It
retains the source's width and height through phase .14 and resizes gradually
only after leaving the wall. Head, eye, beak, wings and body stay on one surface;
there is no separate rounded head that can detach from the printed silhouette.

The subsequent safe gate, two-turn cylindrical ascent, west-side bridge
clearance and observatory ceiling arrivals remain. Inflation and bending reverse as
all 64 skins settle exactly into their matching downward-facing ceiling outlines. A fixed pool
repeats the journey, with an opaque depth-writing ordered fade only at its
concealed reset. Reduced motion retains static architecture and the completed
ceiling without free flight.

`bird-morph-geometry.js` owns the shared closed skin, smooth wing envelope,
curved wall mapping, geometric inflation and matching CPU deformation used for
checks. Its normals follow the actual deformed surface. No long quill lines
are added in the shared material.

The production wall uses two draws: one 2,060-triangle faithful painted cylinder
and one curved-relief instance batch, together below 60,000 submitted triangles.
The former sliced relief remains available for isolated geometry diagnostics,
not the live finish. The free flock plus four ceiling batches uses five draws.
All owned geometry, materials, textures and instances dispose normally.

During a connected gallery route below physical feet Y -31.5m, Babel is hidden
behind its opaque floor and restored on ascent, exit, cutaway and teardown.
The direct `?arrival=bird-transition` destination stands on the centre of a real
lower tread, with an oblique wall view and automatic walking off. Ordinary
manual walking continues from that exact tread.

Checks preserve tile adjacency, complete backing, aperture clearance, source
identity, the absence of duplicate proxy glyphs and black strokes, pinned heads,
full-size peeling, actual deformed wing/rim vertices, all 64 ceiling matches,
architectural path intersections, reduced motion and cleanup. Browser checks
remain necessary for shader compilation and visual quality.

The user moved the destination from the deck floor to its ceiling underside.
The mosaic spans radius7.16, faces down and sits at lower-localY21.875, 15mm
below the structural slab (deckY22.13, thickness.24). Eye inlays and fully
flattened skins sit another1mm toward the viewer. No pattern is laid on the
walking floor. The final helix rises only toY19.9, approaches atY20.6, then
settles upward; whole-skin clearance is checked against the actual slab.
`?arrival=ceiling-mosaic` opens a real reading-hall position looking up at it.
