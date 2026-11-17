# The inhabited honeycomb city

The approved A layout is now a physical neighbourhood fabric around the retained
Gallery, rather than a second schematic map. Thirty-seven exact pointy-top
hexagons of side92m fit the570m circular island. The Gallery and northern park
remain protected spaces;33 walk courts form a connected graph with41
shared gate passages and alternate loops. Exactly six axial coastal approaches
join the continuous promenade; six deliberate gateways meet real retained
campus roads. The replaced irregular outer circuit and obsolete north, west
and south coastal spokes are removed from the physical route authorities.

The neighbourhood lanes are3.2m wide, with quiet grey-green paving. The5.2m
gateways and uninterrupted coast promenade use lighter stone. Warm wall
copings make the exact regular courts clearer than their inner paths. The
route hierarchy is shared by actual geometry, tree clearance, gate clipping
and the three generated maps; it is not a map drawn over obsolete streets.

Five contiguous regular hexagonal lawns replace the park's isolated circular
grass disc. The existing pond, nine garden collections, people, tools, seeds
and source-local saved positions retain their original transforms. Only the
grass substrate extends into the northern city courts. The map uses the same
five92m cells; the pond still looks into the real night face.

Low stone walls and warm copings follow the hexagon edges. Their real solid
colliders have the same gate gaps as the paving. A retained doorway or street
cuts an actual gap through the wall field. Walls stop around the pond/park and
central Gallery/Transformation complex. The walls stay1.55m high, preserving
sight of the Gallery and nearby roofs above them.

## Learning destinations inside the plan

Fifteen existing public houses have moved as complete source-owned interiors:

- Freud, Chomsky and Borges face the western Court of Stories and Language.
- Calvino, Ada Lovelace and Le Guin face the matching eastern court.
- The six philosopher homes share the western regular Court of Questions.
- Noether, Mirzakhani and Cage face three connected southern hexagonal courts.

Their actual source authorities supply the geometry, entrance/spawn positions,
collisions, study gates, directory visits and map outlines. House IDs, lesson
content, local experiments and saved study keys remain stable. The substantial
Proof Atelier and its saved workbenches, Escher's house/museum, original artist
studios, Origami house, Penrose pavilions and House of Transformations keep their
connected working interiors.

This is a city of courts and alternate paths, not a locked puzzle maze. The
coast promenade and sixfold Gallery campus provide orientation. A road ends at
a real existing doorway or meets another path; anonymous unused streets are not
presented as new teaching houses.

## Real underground routes

The dashed map passages identify actual existing walkable corridors atY−40:
the Babel/central-gallery route to the House of Transformations and its Escher
museum spur. These are the selected C-style connections through the thickness
of the island. The map does not invent a staircase beneath a threshold portal.
The source Escher surface threshold retains its explicit linked-entry behaviour.

Personal homes now mount on the night face without rewriting their source
designs or stored contents. SeeNIGHT-HOME-NEIGHBOURHOOD.md for bounded lots,
real access paths, collision composition and rebuild ownership. The upper map
therefore no longer reserves an empty southwest home block.

## Startup and rendering

`city-hex-layout.js` supplies the regular grid and public district anchors.
`honeycomb-city-model.js` constructs the graph, checks full-width routes against
source building/furniture footprints and clips real gate intervals. That solve
is not performed on the visitor's loading path. Its generated result is
committed in`honeycomb-city-layout.js`; regenerate it after source placements
change with`node tools/render-honeycomb-layout.mjs`, then regenerate the three
maps with`node tools/render-coastal-plan.mjs`.

An independent source-consistency check hashes the regenerated plan and the
committed static plan after checking its physical geometry. On the development
machine the refined module import measured about34ms and planting about26ms
for610 street trees. These are local timings, not a performance guarantee on
every device. Paving uses two geometry batches for the two street ranks.
Hex courts, seats, walls
and copings use eight draw meshes; natural tree foliage/branches retain their
shared instanced rendering. No new per-court or per-home lights were added.

## Verification

`tests/city-urban-plan.mjs` tests exact regular cells, a connected graph with
loops, source door connectivity from the real Gallery west entrance, full-width
walking against real artist/author/philosopher/seminar architecture and maze
solids, exactly six physical campus/coast gateways, protected central/pond
routes, trees clear of walls, finite geometry and owned disposal.
The source-specific foundation, philosopher and seminar suites test their real
entries and furniture; coastal-map and Origami tests verify the generated maps
and retained shoreline route. The pond suite also measures the actual batched
grass area and corner coordinates against the five mapped hexagonal lawns,
while retaining all original fountain and borrowed-geometry ownership checks.
The full city release check remains required.
