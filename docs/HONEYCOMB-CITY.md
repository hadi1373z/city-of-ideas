# The inhabited honeycomb city

The approved regular honeycomb now changes the actual city streets and the
placement of working buildings. It is not a decorative graph over the old city.
Thirty-seven exact92m hexagons fit inside the570m circular island. The central
Gallery cell and all six immediately adjacent cells now retain every actual
regular block edge. Six complete Transformations houses occupy those six cells,
each with its own tiling and a tangential doorway-to-vertex approach. The former
76m misaligned inner ring,125m source precinct and central box/zigzag streets are
retired from live paving and maps. At the preserved Proof Atelier corner one
street narrows to4.3m; all other standard block streets remain5.5m wide.

The existing park moves as one source-local presentation to(0,−375), preserving
its pond, people, seeds and tools. Its actual158m envelope replaces the old
oversized181m road exclusion, revealing the six northern hex edges. The park
still fits inside the shoreline promenade. The Gallery's two real graded doors
and return lift join the same regular grid. No diagonal campus joins are needed.
The live graph has131 shared block edges,95 junctions and189 gated wall
segments. Six clear coastal approaches continue to the ocean promenade.

## Six inhabited collections

Twenty-nine original public buildings now occupy six compact street blocks:

| Collection | Real source buildings | Block centre X,Z |
| --- | --- | --- |
| Questions | Six philosopher homes | −318.697,0 |
| Stories and language | Six foundation houses facing a shared courtyard | −159.349,276 |
| Garden galleries | Monet, Van Gogh, Hilma af Klint, Morris | −398.372,138 |
| Form galleries | Kandinsky, Hokusai, Rodin, Mondrian, Lange, Klee |398.372,−138 |
| Working studios | Dalí, Cézanne, Morisot, Seurat |159.349,276 |
| Advanced seminars | Noether, Mirzakhani, Cage |239.023,138 |

These are their original content-bearing rooms, artwork, residents, furniture,
study models and doorway interactions, relocated through their placement owners.
IDs, saved study keys, private editions and source artwork credits remain stable.
The original source Dalí adapter assumed that no northern galleries could occur
below its old minimumZ; the public layout wrapper now recomputes that bound from
all actual houses. Artist courtyard notifications are limited to the three real
courts, rather than the large bounding rectangle between disjoint collections.

Each inhabited block has a substantial covered hexagonal perimeter arcade:
82.5m side length, a6.2m-wide roof band, paired columns and a real3.2m pedestrian
loop. Supports avoid all street/door routes; central passages remain open.
The arcades frame occupied collections and provide covered walking space; they
are not empty teaching-room shells. Low walls sit inside the other street blocks,
with source-clipped gate gaps, a warm coping and a flush2.4m-wide stone foot.
Alternating lawn tones make wholly clear outer cells legible at overview scale.
No lawn surface crosses the protected Gallery/Babel/Transformation or pond areas.

The original Gallery/Babel/observatory axis, six transformed houses, substantial
Proof Atelier and saved workbenches, Escher's real museum/tunnel anchor and Origami
house remain fixed. Their true source approaches meet the new street network.
Five connected hexagonal park lawns retain the original pond, nine garden
collections, people, tools, planted seeds and source-local coordinates. Only the
grass substrate changes. The pond continues to show the same real night face.

## Source authority and private data

`city-hex-layout.js` records the regular grid and inhabited block anchors.
Foundation, philosopher, seminar and artist placement authorities own their real
rooms, doors, colliders, spawn points and map outlines. Source rooms are not copied.
`city.js` no longer creates the retired diagonal outer roads; `buildCityCoast`
combines the retained threshold roads with the new block-edge network. The same
route set governs paving, tree clearance, wall gates and generated map geometry.
The source artist map fits its new three separated court bounds.

The actual shared paving builder consumes the complete `urbanRoutes()` authority,
including philosopher lanes/thresholds, seminar and study approaches and the exact
artist doorway spurs. Hiding retired source paving therefore cannot hide the new
door paths. The scene suite raycasts the two real visible road meshes along every
composed route, rather than accepting route metadata as proof of rendered paving.

The central campus now uses the same polygonal authority in the original source
landscape and shared paving: a76m Gallery hexagon, a compact32m hexagon around
Transformations and straight graded door/lift spines. Both old64m circular
promenades and the sweeping entrance curve are retired at their source factory.
Origami installation never resurfaces old landscape path rows. Existing doorway
height functions remain exact; shared geometry includes their grade breakpoints
and properly joined closed corners. Only Transformations' real south door gets
a doorway approach; its north wall remains a window.

Six outer learning-place spurs, Commons of Care and the Jungian quarter's actual
door lanes and southeast connector now enter the shared route/footprint authority.
Their owners supply exact canopy, roof, porch and doorstep footprints. They are
included in paving, gate clipping, map outlines and tree planning.

All upper street-tree owners use a shared seven-metre roof/porch clearance. The
natural-tree factory independently protects the fixed Gallery, Transformations,
Socrates, Makers and all six complete house roofs even before other scenes load. The
old paired-promenade tree ring is removed. Urban, coastal and artist street trees
share the full current building/place footprint guard; the Jungian quarter's
reserved ground stays clear as its rooms are built. The three standalone Penrose pavilion shells retire after their lessons move
into the western, northwestern and northeastern house rooms. Their legacy source
builders and study IDs remain available. Original park garden trees
retain their own source planting and garden clearance; indoor plants are untouched.

Covered arcades are architecture too: their complete6.2m roof bands participate
in the same tree exclusion. Inner-courtyard planting is offset away from those
eaves. The regression first reproduced a crown/arcade overlap, then verifies
actual generated crown bounds against each transformed roof's oriented volume.

The dashed underground routes show the physicalY−40 six-house loop, six real
radial spurs, the Gallery branch and retained Escher museum spur. Surface arrivals
are not described as physical passages. All six10.3m live wells are cut from the
actual coast, foundation and153m Gallery plinth surfaces; the retired125m shaft
closes. Boundary-intersecting plinth holes use real circular notches rather than
invalid holes outside a shape. The legacy standalone house keeps its125m source
geometry and single-well tests.

Approved saved artist editions move through a presentation wrapper into the
empty eastern cell at(398.372,138). Their twenty original source slots, records,
artworks and studies remain unchanged. Actual roof/feature bounds fit the56m
whole-crown reserve, and a shared real3.4m approach joins the cell's northern
vertex. The wrapper translates collision/entry/action metadata while retaining
the source factory's original spatial index. Personal homes remain on the night
face without rewriting designs, documents or contents; seeNIGHT-HOME-NEIGHBOURHOOD.md.

## Startup, rendering and checks

The builder solves public street/source-footprint clearance offline. Its generated
result is committed in`honeycomb-city-layout.js`; run
`node tools/render-honeycomb-layout.mjs`, `node tools/render-coastal-plan.mjs` and
`node tools/render-artist-quarter-plan.cjs` after relevant placement changes.
An independent consistency check regenerates the graph and compares its hash.
A local measurement gave66ms module import and74ms layout of330 street trees;
these are development-machine timings, not a promise for every visitor.

Two shared paving batches remain. Urban courts, walls, copings/feet, lawn field,
seats and all six arcades use nine draw meshes. Natural trees retain shared
instanced foliage/branch geometry. No per-block or per-home point lights were added.

`tests/city-urban-plan.mjs` independently checks every real junction/door reaches
the Gallery, every street is a true92m hexagon edge, all six arcade walks and new
streets across their full width against source buildings and posts, protected
floor holes by actual rays, regular civic symmetry, finite geometry and exactly
once disposal. The artist suite verifies actual relocated furniture, resident
navigation, original artwork, source editions and all door/walking routes.
Coastal/artist map generation, Origami, foundation, philosopher and seminar suites
cover their source-specific entry and geometry contracts. The pond suite measures
actual batched park area/corners while retaining original fountain ownership.
The full city release suite and integrated browser inspection remain required.
