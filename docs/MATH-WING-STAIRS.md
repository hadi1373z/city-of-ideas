# Mathematics working wing · continuous stairs and circulation

On 2026-11-09 the user identified the original eight-floor wing's architecture
and stairs as the main problem, ahead of further ornament. The original source
provided five short decorative steps at each level and explicit floor transfers;
those steps did not connect the four-metre storeys. This revision gives the
existing building a continuous walking staircase and a legible circulation bay.
It remains the source working wing at logical (-2240,-65), not the annular
Faculty, a replacement campus or a new lot.

## Geometry and route

`math-wing-stairs-model.js` defines seven two-flight storey connections inside
the existing right-hand stair area. Each flight has eleven rises of 2/11 metres,
ten horizontal treads with .28-metre going, and 1.4-metre gross width. A
full-width 3.2 × 1.4-metre half-storey landing joins the flights. The original
floor's front landing joins each storey to its existing rooms and lift. There
are 140 new tread surfaces, 154 height changes/riser faces, and seven turning
landings. These dimensions describe this designed digital building; no physical
building-code certification or structural engineering claim is made.

Seven genuine upper-floor openings occupy local x=3.6..7, z=2..6.2. Four slab
bands surround each opening; the original ground slab stays intact. Walking
treads, closed riser faces, side stringers, supported landing frames, handrails
and guard posts occupy the corresponding geometry. Side/back guards enclose
the well; the central gap and unavailable flight at the top/bottom are closed.
Riser faces sit behind their tread fronts. At shared surface boundaries the
walker uses the highest reachable support rather than standing inside the next
riser. Ceiling and slab edges leave headroom along the full route.

Two continuous timber piers frame the real stair bay on the existing facade,
at source-local x=2.2/7, z=8.68. Their stone feet meet the existing plaza plinth;
their tops meet the retained facade soffit. Their two ground-level colliders
leave the original three-metre central entrance and covered approach clear.
The classrooms, library corner, laboratory table, Atlas, seats, windows and
lift retain their positions and source payloads.

Eight ceiling-supported entry-facing direction boards distinguish the library
on the left from stairs/lift on the right. Own labels support EN/DE/FA/CS.
Arrows retain their physical directions; Persian labels use RTL canvas shaping.
Boards are front-facing so text/arrows are not mirrored through their backs.
The source floor-name plaques remain above them; the boards clear ordinary
walking head height and do not block the Atlas sightline.

All stair/slab/frame pieces use three owned instance batches. Eight direction
planes make eleven draw meshes in a canvas-capable browser, rather than one
draw per tread/rail. Locale changes redraw existing owned textures without
allocating a new set. There are no new image assets, recordings or lights.

## Deliberate, reversible source adaptations

This is a narrow user-authorized architectural exception to the earlier detail
passes' preservation of the original solid slabs and decorative stair landmark.
It does not relax those earlier standalone source fingerprints or reinterpret
their reading content. `math-wing-stairs-scene.js` recognises only verified
public Math models, exact floor-surface flags/dimensions, the five original
step shapes, two landmark rails and associated physical stair-transfer plaques.

After the existing exterior deduplication, 77 original visible meshes are
retired: seven solid upper slabs, forty decorative steps, sixteen rails and
fourteen stair-transfer plaques. The eight landmark collision boxes are removed;
two actual stair-bay pier boxes are added on the ground floor. Installed source
collider counts are therefore 24 on ground and 15 on each upper floor. Original
approach arrays and all floor/lift/reader payloads remain unchanged. The original
lift buttons and accessible Building guide retain explicit floor transfers;
the retired decorative stand-in is not restored.

No source geometry, material, texture, userData or saved coordinate is rewritten.
Owned slab bands/stairs/signs supply the new physical structure. Disposal or
missing/replaced owners restore exactly the retired visibility and removed
collider references, remove only owned pier colliders, and release owned instance
buffers/geometries/materials/textures once. Mixed source instance batches are
not edited. All other colliders, solid windows, rooms, 24 concept IDs, books,
Atlas, furniture, private imports and six earlier floor companions remain.
Topology adds its independent seventh reading/detail companion.

The group inherits the original mathematics transform and proper lower-face
parent. Local height is applied once. No lower half-turn is baked into source
coordinates, private notes, transfers or saved poses. The annular Faculty,
covered walk, 480-tread gallery/gravity turn, Escher/Babel/ocean routes and
eleven genuine paper monitors retain their own geometry and resource ownership.

## Walking, interfaces and private state

`math-wing-stairs.js` owns only movement near the new stairwell. Its hook runs
before the existing lower-world walker and yields elsewhere. It subdivides
motion to at most .06 metres and permits at most .205 metres of height change
per substep; it does not skip risers, teleport to floors or follow an automatic
route. Ordinary forward/back/strafe/turn and existing controller input work.
Modals pause movement and turning. Reading and locale events never move the
visitor, select a floor or start sound.

On reaching an actual full-floor landing, the walker delegates the original
public floor-selection method to keep source floor/cargo metadata coherent.
It does not invoke the lift animation. Between floors, a distinct stair region
hides wrong-floor companion encounters. The existing folded Way out guide
retains its actual ground doorway and proximity-gated source lift; direction
boards and the new four-language stair status make the walking alternative
visible. The status keeps Persian prose RTL and level numbers in an LTR bdi.

An explicit arrival at an old flat-floor point now inside an unsupported opening
uses the same floor's front landing at local (5.3,6.9). The input pose object and
saved coordinates are not rewritten. The normal arrival/cancellation chain is
delegated with its original receiver. Valid arrivals and all reading routes
keep their original behavior. No private-memory/storage API is read or written;
private drafts, carets, first answers, imports, explicit saves and existing keys
retain their owners. There is no new saved stair/diagram/progress state.

## Verification

`tests/math-wing-stairs.mjs` walks all eight levels up and down in 2,356 measured
movement samples, checking every height increment and real geometry headroom.
It tests slab openings, guard/gap/closed-end rejection, exact source resource/
payload preservation and restoration, all three-metre entrance samples, pier
support, proper lower frame, public language/arrow direction, one-sided signs,
owned textures/buffers, modal pause and same-floor arrival fallback. Private
memory/storage getters throw during runtime tests. Missing/custom owners reject
the adapter and replacement/disposal release only owned resources once.

All 119 release programs and final affected checks pass. Native WASD traversal
reaches every floor at the actual source heights and returns to ground, with
the matching source floor state at each landing. Walking adds no storage write
in the isolated test session. The original lift, reader handoffs, Topology
companion, four-language/mobile/RTL behavior and final artifact are checked in
the hourly ledger and PR #5. Hardware controller A is not separately tested.
No PR merge or deployment.

The later installed-entrance/roof audit is in `MATH-WING-ENTRANCE.md`. It
resolves the live facade's porch, paving and active roof alongside the source
room: three noninteractive identity planes are replaced by one supported
four-language board, and four thin header-to-ceiling bearing strips close the
measured installed gap. The stair adapter's 77 retirements and collision
contract stay unchanged; the two adapters together retire 80 name/slab/stand-in
meshes. All 47 first readings and all eight walking floors remain.
