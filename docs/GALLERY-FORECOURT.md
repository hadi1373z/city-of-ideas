# Continuous Gallery entrance and lift forecourt

The former rectangular raised road grades had abrupt side edges. Closing them
with vertical risers hid the green strips but still looked stepped. The current
forecourt replaces those strips with one continuous affine stone surface around
both main doors and the existing east side porch/lift.

`gallery-forecourt-data.js` is a shared classic-script authority, loaded before
`city-landscape.js`. Its 152 original triangles contain world X,Z,height. The
classic native `groundHeight` and ESM `gallery-forecourt-model.js` read precisely
the same data. `six-gate-garden-paving.js` clips the existing tile/joint batches
at those exact triangle edges, rather than interpolating an entire tile across
a slope change. There is no new horizontal overlay or vertical riser batch.

Original source walking anchors stay at .395m. The actual main/side porch slab
tops remain .46m and the lift platform top .395m, as in `gallery.js`; neither
their geometry nor their controllers are edited here. Exact original porch,
Gallery, house-shaft and organic tree-bed holes remain cut from both buffers.
The outer apron edges return to .13m. The two retained entry trees at(68,-8.5)
and(68,8.5) have flat .13m reserves enclosing their unchanged soil/rim contours.
No tree, bed or voice is moved or regenerated.

The east forecourt boundary is X54..73,Z-15..30, with the source porch/lift
outlines as fixed height constraints; the west boundary is X-73..-54,Z-14..14.
Internal triangle flips improve the original triangulation's smallest angles
without changing any boundary or plateau. This prevents narrow steep facets.
Regenerate deterministically with `node tools/generate-gallery-forecourt.mjs`.

`tests/gallery-forecourt.mjs` executes the actual classic height function,
checks232 independent shared triangle-edge transitions, then rays22,180 actual
tile samples against that native height. It also checks all170 actual garden
holes and the original soil levels. `tests/six-gate-garden-paving.mjs` retains
its25,640 physical route/annulus probes and exact protected source slabs/shafts.
Run the city-landscape, street-tree-preservation and city-urban-plan tests too.

The three explicitly selected bare source trees are omitted at(69.5,-25),
(69.75,25) and(72.5,-53). Their original random sequences are consumed, so every
retained leaf/trunk instance remains byte-identical. The455 accepted street
trees and170 planted gardens are unchanged. Entry tree crown pruning has not
been applied.
