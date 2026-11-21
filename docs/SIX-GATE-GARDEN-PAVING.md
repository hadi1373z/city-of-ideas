# The broad stone belt and green garden courts

The user asked to remove the old crossing road strips and match approved sketch
A more faithfully. Its composition is a broad paved belt between the central
Gallery and stone arcade, with six green outer leaf gardens and a curved stone
walk to each actual house door. It is not an entirely paved seven-hexagon plaza.

six-gate-garden-paving.js owns this new public surface and the separate
retirement mask for legacy visual roads. GARDEN_STONE_BELT is exactly
{inner:58,outer:110.5}. It now meets the real Gallery edge: the former protected
r58..70 lawn ring is paved with the same material and tile grid. The original
r58 floor and its edge torus remain source-owned. Cream/honey diamond-set stone tiles are2.6m across,
with restrained teal/brass sector bands and thin stone-coloured joints. Both
owned mesh buffers normally lie atY.13m, have upward normals and are ordinary opaque
Lambert surfaces, with small polygon offsets to resolve their joint/inset
ordering. There is no mirror, monitor, text texture or independent light.

The field includes the belt, GARDEN_ROUTES, six small seating courts and short
door aprons. It leaves the outer gardens green. It cuts the complete existing
house hexagons with a.15m margin and preserves their existing front porches,
rather than putting the new stone finish over a source floor. Exterior aprons
end at the original porches; the original Y0 porch/.13m outer-ground difference
remains source-owned. All six shaft openings are inside those protected holes.
Only the actual central r58 Gallery floor is protected. Its circumscribed
256-edge clipping boundary has a maximum4.4mm reveal, entirely behind the
source's r58 stone edge torus; no new vertex covers the Gallery floor or Babel.
The two actual source door porches, side porch and lift platform also remain
open holes in both new buffers. Their exact transformed source rectangles are
GALLERY_SOURCE_PORCHES; these are actual slab footprints, not a broad lawn reserve.

The tiles replace the old exterior road-grade strips instead of covering them.
Their affine patches are cut at every original height breakpoint and follow
createCityLandscape.groundHeight: the two east/west thresholds rise fromY.13
toY.395 over the existing three-metre grades, and the side-return spine retains
its original fourteen- and eighteen-metre slopes. The existing walking function,
source porches, floor elevations and doorway controllers do not change.
gardenPavingHeight is the shared visible-height authority; the builder returns
heightAt for its actual stone domain. The two material batches still own the
whole field, including these graded pieces. There is no second flat skin over
a ramp, and the retired legacy road triangles are absent beneath the new grades.

## Public APIs

- GARDEN_PAVING_CELLS: exact union of the seven regular side92m central cells.
- GARDEN_STONE_BELT: inner/outer radii used by the mesh and map.
- GALLERY_SOURCE_PORCHES: exact protected source porch and lift rectangles.
- gardenPavingHeight(x,z): the original flat/graded walking height, null inside
  the actual Gallery floor. The builder's heightAt additionally checks its real
  stone domain and active tree-bed holes.
- gardenPrecinctContains(x,z): retirement mask for OLD road strips inside the
  seven-cell union, with the actual central r58 Gallery floor excluded. The true outer
  boundary centre-lines remain available because their outside half-road stays;
  shared internal hex edges retire.
- clipGardenLegacyPolyline(points): surviving outside-mask runs for maps/guides.
  Internally samples at≤.65m and bisects transitions, then removes collinear
  sampling points while preserving real bends and boundary intersections.
- subtractGardenPaving(T,geometry): removes the retirement mask from actual
  world-XZ road triangle buffers. It preserves the actual source Gallery floor, every
  attribute, interpolation and material groups. It returns new geometry and
  never mutates/disposes the borrowed source geometry. Root applies it only to
  legacy road/edge buffers, never to buildings, source floors or landscape trees.
- gardenPavingContains(x,z,{treeBeds=[]}={}): the ACTUAL new stone field rather
  than the larger road-retirement mask.
- buildGardenPaving(T,{treeBeds=[]}={}): returns {group,triangles,contains,heightAt,dispose}.
  Pass actual collected tree-bed plans (their organic outline arrays) to cut the
  soil and trunk areas out of both stone/joint buffers. No bed/tree pose changes.

The live stone field replaces the older per-path slabs: call
buildSixGateGarden(T,{paving:false}) for the architecture. Root mounts the new
field after actual tree-bed collection and gives it the same upper-city culling
and owned disposal. Original grid coordinates remain walkable for compatibility;
their obsolete surface strips and map road lines are clipped by the mask.

Tile vertices share a.1mm output quantisation grid before Float32 storage, so
separately clipped tile/domain pieces meet without hairline support cracks.
Straight path joins overlap3.5cm before final clipping. All protected openings
are cut from the resulting actual triangle buffers, including concave organic
bed outlines. There is no broad replacement plane across a shaft.

## Verification and bounds

node tests/six-gate-garden-paving.mjs checks25,640 actual downward route/annulus probes
plus a dense independent comparison against the unchanged source grade function;
upward flat/graded normals; source floor,
porch, Gallery, shaft and organic bed holes; exact rounded guide joins; green
outer courts; interpolated road height/UV/colour and material groups; immutable
source/bed/tree inputs and scoped idempotent cleanup. It executes the real
source porch/lift creation statements and tests their transformed slabs together
with the new field: no tiled skins over source floors, no lawn seam at the
porch/facade joins, and preserved inner-tree soil holes in the newly paved ring.

The field uses two bounded draws and fewer than200,000 triangles. The expanded
r58 field without bed cutouts contains84,595 triangles in the focused build.
The actual live count additionally includes its retained organic soil holes.
Root owns final live counts, combined
route/grade/tree checks, rendered comparison against A and deployment validation.
