# City of Ideas — persistent character voices

User instruction reaffirmed 2026-11-03: keep each character's voice fixed across
future requests, scenes, dialogue additions, and the entire conversation. Reuse
the saved setup without repeating service selection or account setup.

## Established English cast

| Character | Kokoro voice | Language | Character direction |
| --- | --- | --- | --- |
| Socrates | `bm_george` | `en-gb` | Warm, patient, curious |
| Nietzsche | `am_fenrir` | `en-us` | Firm, precise, thoughtful |
| Zarathustra / زرتشت | `bm_fable` | `en-gb` | Resonant, reflective storyteller |
| Frank Ramsey | `bm_lewis` | `en-gb` | Youthful, clear, conversational |
| Alan Turing | `bm_daniel` | `en-gb` | Restrained, analytical, reflective |
| Anonymous | `am_michael` | `en-us` | Grounded, direct, questioning |

Use free local **Kokoro-82M v1.0**, **kokoro-onnx 0.4.7**, speed **1.0**.
The authoritative record is `src/ramsey-film/assets/voice-cast.json`: it stores
voice IDs, exact settings, model/voice-bank hashes, scripts, cue timings, and
recording hashes. Preserve those identities unless the user explicitly requests
a voice change. Character directions guide performance, not claims of authentic
historical voices.

## Zarathustra visual direction

On 2026-11-06 the user selected **B — Persian scholar** from the visual board.
Keep the direction around thirty: swept-back dark wavy hair, a short beard,
ivory tunic and an indigo mantle with a restrained woven border. Do not reopen
the A/B/C choice. The concept is an artistic interpretation, not a historical
portrait. Use a properly credited existing GLB as an anatomical base. New mesh
studies remain separate from the live cast until they are ready for animation.
The character's established `bm_fable` voice remains fixed.

## Continue voice work

- All 46 conversation lines are recorded. Both five-minute tracks use the same
  six voices. English Socrates in the desk-book opening uses `bm_george` too.
- The city and standalone film share `assets/conversation-1.mp3` and
  `assets/conversation-2.mp3` under `src/ramsey-film/`. Update them together.
- Reuse `tools/render-ramsey-voices.py` and `tools/assemble-ramsey-voices.py`.
  Consult `src/ramsey-film/README.txt` for regeneration instructions.
- Existing local environment: `../../work/kokoro-env`; models:
  `../../work/kokoro-model`; original generated cues and preview:
  `../ramsey-voice-references/kokoro` (paths relative to this repository).
  If absent on another machine, recreate the environment from the saved model
  version and verify the hashes in the cast record.
- Preserve completed recordings and exact dialogue. Do not regenerate already
  accepted lines unnecessarily. Keep full speech, captions, and gestures aligned;
  never cut words or accelerate speech merely to fit a slot.
- Do not return to HeyGen for routine voice work: its free quota was exhausted,
  and the user explicitly switched to a free solution. Its partial recordings
  are development backups, not the active cast.
- Do not introduce generic browser-voice fallbacks or choose a different voice
  for a later chapter. Other language introductions retain their existing
  localized recordings; the established conversation cast is English.
- Save any future character's voice assignment once and reuse it thereafter.
  Update the cast record and relevant provenance hashes after audio edits.
- Verify with the relevant voice checks in `tests/ramsey-room.mjs`, source
  integrity checks, and playback across the five-minute boundary when changed.


## Island layout and first house studies

The approved world is one circular cylinder with two physical inhabited faces,
not a separate remote Graveyard world. Its radius is 570 m and thickness is 96 m,
with Zarathustra Gallery at the upper centre (0, 0), ocean around the edge, and
Babel in the shared central structure. Preserve the upper island geometry in
`src/island-layout.js`. The lower face retains logical source coordinates around
(−2160, −65); `src/world-cylinder-model.js` applies a proper rigid half-turn about
X with physical mapping X=logicalX+2160, Y=−96−logicalY, Z=−logicalZ−65. Never bake
this transform into individual buildings, voices, saved positions or notes.

The Faculty of Mathematics occupies the lower central annulus directly opposite
the upper Gallery. Its working eight-floor source wing is immediately west at
logical (−2240, −65), connected by a real covered walk; Ramsey House remains
beside that wing using its existing placement helper. Preserve the original
mathematical floors, Atlas/actions, lift and lesson content. The central Faculty
roof, oculus, shelves and shell are in `src/math-faculty-*.js`; do not duplicate
the source interior or cover the central helical well.

`src/world-cylinder.js` owns lower-frame mounting, physical camera/photo/lantern
poses, reversible through-gallery navigation, the middle gravity turn and the
live 3D pond crossing. The Gallery → Babel → central spiral → lower Faculty
route and its Escher museum spur are physical connected routes. The park pond
is a live render of the same lower face with original boats and basin preserved.
Keep the through-gallery and pond marked on the map. Read
`docs/WORLD-CYLINDER.md`, `docs/TWO-FACE-GALLERY.md`,
`docs/ESCHER-DEPTH.md` and `docs/POND-WORLD-WINDOW.md` before changing these joins.
The optional future crossing video is configured by `pondTransitionVideo` in
`src/city-config.js`; null uses the live 3D journey. No new voice provider or
recording is required. All established Kokoro voices and private data remain
unchanged.

The user requested new houses with only names and small features for now.
`src/foundation-houses-data.js` records six first studies (Freud, Chomsky, Borges,
Calvino, Ada Lovelace and Ursula Le Guin), their shared coordinates and later
expansion directions. Keep these stable when developing the houses further.
The small Freud city room is separate from the House of Psychoanalysis side
project, which remains at the design stage.


## Ocean voyage

`src/ocean-voyage*.js` adds an embarkable paper boat at the eastern shore.
`ocean-voyage-model.js` owns water bounds, motion and six original poems in
English, Persian and German. Preserve their original-writing attribution; they
are not historical quotations. Sailing uses a first-person vehicle hook in
`gallery.js`, preserves the island walking boundary, and cancels cleanly on
city travel. No character voice assignments or recordings are used or changed.


## Underground Library of Babel

The gallery’s snake-head ground-floor stairwell leads to a five-terrace circular
library below the same building. `babel-layout.js` supplies the bounds shared
by the real gallery slab opening and the library navigation. Preserve the holes
in the slab, floor-ink shader, gallery plinth, island foundation and lawn; do not
cover the descent with a new ground plane. Library geometry is an original
interpretation of the user-supplied circular library image; the image itself is
not published. The interactive catalogue is explicitly a finite 4^6-symbol
experiment, not all possible books. Keep its source attribution and restore
surface lighting on exit. Voices and private notes remain untouched.

The Babel entry is one additional flight directly beneath the existing gallery
stairs, in the same x/z footprint. It descends from the ground-floor landing
at z=11.2 to the underground floor at z=0. The old narrow northern stair is removed.
`babel-layout.js` shares the opening, landing and walk geometry. Read
`docs/BABEL-SNAKE-DESCENT.md` before changing this route.

Chomsky and Ada Lovelace now have working English investigations in their
existing foundation houses. Preserve the grammar/stack/parse models, addition
registers, contextual first conjectures and explicit private saves. Read
`docs/HOUSE-INVESTIGATIONS.md` before extending those rooms.

The existing central volcano now sits above a contained inverted glass reservoir.
Its r21 mouth aligns with the volcano and the central opening in Babel’s timber
ceiling; its tip meets the existing open book's centre seam at Y−25.651827.
Keep the shared book/contact dimensions in babel-reading-book-model.js and the
restrained static contact glow. The default view sits on the lowest terrace,
slightly off-axis so a railing post does not hide the meeting point. Read
`docs/BABEL-THERMAL-VAULT.md` before changing the cone, fluids or headroom.

On 2026-11-08 the user made the Babel volcanic-reservoir view the default
arrival for the bare city address. Keep this start in city-integration.js after
all scene/start-mode installers. Explicit arrival links retain their destination,
and the desk-book introduction remains available from the city overview.

## Connected exploration polish

Startup feedback in startup-progress.js reports actual coordinator stages; keep
head module preloads for the main graph and the five delayed source factories.
Original Dalí pages load asynchronously through their existing texture loader.
Do not restore a painting-byte gate or block private-home restoration on it.

Deep Babel hides the concealed upper city only below the first terrace; the
real stairwell overlook remains visible. Restore culling on every mode change.
The lower landscape has a connected meadow circuit, inlet and two level timber
crossings. Apply lowerLandscape.canStand alongside source/faculty collisions;
keep the original shore promenade continuous and all walking feet at .13m.

Connected questions is optional, folded and uses only real walkable routes.
The Mathematics working-wing guide uses actual source floor models and lift
metadata: ground-floor visitors exit through the central hall and open front
doors, upper floors use the lift. Keep solid laboratory windows distinct from
the central doorway. No guide action moves the visitor or writes notes unless
the visitor explicitly requests an existing interaction. Read docs/STARTUP.md,
docs/CONNECTED-QUESTIONS.md and docs/lower-face-visuals.md before extending.

## Original paper monitors

The original eleven former blank panels in the lower Mathematics reading hall now show
permanent original first-page facsimiles. `historic-papers-data.js` keeps each
work's image, edition/page choice, source links, author credit, reuse terms and
English discussion question together. Preserve the genuine local scans and
their attribution; do not replace them with generated paper pages or assume
free access alone permits republication. Some historical works are monographs
and their original title pages are identified honestly in the reader.

`paper-monitors.js` owns page textures, frames, nearby actions and the zoomable
reader. It loads the images asynchronously and releases loading textures as
they are replaced. The pure gallery builder retains the stone pedestals and
exposes the lower-local slots; keep its resource disposal scoped to its own
geometry. Both lower walking and annular gallery walking must apply the monitor
colliders while leaving the west doorway and viewing aisle clear. The map's
Historic papers destination and `?arrival=paper-monitors` visit the real ring;
the bare city address still defaults to Babel. Read docs/PAPER-MONITORS.md and
docs/PAPER-COLLECTION.md before extending the collection. Voices, notes and
account connections are unaffected.

The lower Mathematics rotunda hands movement to the ordinary lower grounds in
the shared outer-floor band and west walkout overlap. Reuse the same handoff
predicate when releasing a gallery route and at both controller capture sites;
otherwise each frame can recapture the short deck and trap a visitor at its
finite edge. Keep canLower collision checks on ground movement and capture.
Regression checks must continue past local X -64, turn onto the covered walk,
reach the working wing and return to the hall; stopping at the first route-null
frame does not prove that a visitor can leave.

Both physical faces share ocean-surface.js for water colour, foam, waves and fog. Update both materials from the same scene fog and reduced-motion setting. The annular earth core below Babel (r21.7..58, Y-95.9..-26.6) encloses the stair shaft; retain the east Escher tunnel cut at Y-40.2..-34.7 and Z+/-2.3. Do not replace these earth walls with a sky-filled opening.

## City version 2

On 2026-11-16 the user requested a new default version without the mountain, retaining version 1 in code. Git tag `city-v1-before-mountain-removal` preserves the complete prior city. Keep `CITY_CONFIG.edition=2` and `mountainEnabled=false` for current development. Do not restore the mountain, its automatic climbing capture or summit bridge to the live city. The gallery, central volcano, Babel, lower face and all existing houses remain. See docs/CITY-VERSIONS.md for restoration.

## House of Transformations

Keep the three hexagonal mathematical pavilions. The separate solid house at (125,0) occupies the retired mountain site, with eight floors and a real stair to the -40 tunnel and existing route to the lower face. Read docs/HOUSE-OF-TRANSFORMATIONS.md before changing its ground cut, floor/stair joins, secret bookcase or navigation handoff. Do not restore the mountain over this house.


## Tiling, night face and four reading floors

The upper city is permanently day; the lower CITY face is permanently night. This does not make the new House of Transformations a night-world. Keep its Light-Well Observatory on the upper side. World-cylinder owns navy lower sky/fog, moonlight, warm campus lights and scoped lower pond captures; restore upper state after every crossing and render pass.

The house now has full matched Penrose rhomb floors, shallow vaulted ceilings, an unfolded continuous wall field across all 48 panels and fine inlays on its 448 tread caps. Each room landing has four flat cap sectors and sixty supported risers per turn; preserve the exact flat landing profile and continuous rounded guard joins. Preserve true door/window apertures, floor/stair heights, open wells and original quiet trim. Nearby shelf/pendulum operations require physical proximity; passing a floor height on a stair does not enter that room.

The retaining cylinder below Babel carries original interlocking bird tiles that gradually separate into an articulated flock. This is original geometry, not a copied Escher print. Preserve opaque earth behind it, all stair/door clearances, reduced-motion poses and batched rendering.

Twenty-seven credited genuine historical/publisher opening pages now occupy four actual connected lower reading floors: foundations (6), geometry/analysis/symmetry (8), computation (6), probability/learning (7). Preserve the original eleven full scans byte-for-byte; their reduced display derivatives are separate. The glazed mezzanines retain stone bearing bands and safe physical walk surfaces. Preserve stable paperId binding and slot floorY gates. The original lower through-gallery and west exit stay intact. Read docs/PAPER-GALLERY.md before changing the new rising stair, mezzanines, raised Faculty roof or controller handoff.

The lower rotunda now has a curved glass roof and a real central observatory deck at localY22.13, reached by80 supported stairs above the highest paper floor. Keep the old well and reversible controller handoff open. Read docs/NIGHT-OBSERVATORY.md and docs/NIGHT-SKY-SOURCES.md before changing it. The real2848-star HYGv4.1 adaptation retains its CC BY-SA4.0 credit/license/source/modification notice. Chart seasons change only the stated Earth teaching sky, never the city’s permanent day/night rule.

The lower observatory has a professional articulated reflector, real catalogue study and an optional immersive telescope view. Preserve the physical station gate, fixed player position while observing, FOV/photo agreement, scene restoration and asynchronous fullscreen ownership handling. The simultaneous cylinder cutaway renders upper daylight and lower night in clipped passes, restoring all renderer state. Do not paint the lower ocean across the upper horizon.

The city centre has a sixfold civic structure: circular Gallery promenade, rotated hexagonal walk, six view axes and paired hexagonal courts. Keep all existing destinations connected and actual house footprints reflected in the EN/DE/FA maps. New houses such as Maps, Light, Faraday, Topology, Darwin Glasshouse and Commons remain proposals until built with meaningful content; do not claim these proposals are present.

The wall-to-flock transition uses one continuous painted field, an ordered wave
of full-size curved relief skins and 64 live source cells. Static relief/proxy
must omit the live source cells: each flying bird owns its own flat wall pose.
The same closed skin bends only its wings, pins the original head/beak, grows
volume and returns exactly to its ceiling outline. Do not restore the old two
hinged halves, separate spherical head, random shrinking stickers or long black
quill strokes. Production uses the continuous painted field instead of visible
horizontal LOD bands. Read docs/CYLINDER-BIRD-TRANSITION.md for ownership,
clearances, source-size preservation and render budgets.

The House of Transformations well also cuts the main gallery plinth in gallery.js, whose 153 m outer radius reaches beneath this house. Preserve the exact localXY/worldXZ mapping of the additional houseWell hole; cutting only city/coast grounds leaves a dark cap at Y -.25. Tests must raycast the actual root annulus helper and transformed plinth with the house, not only the standalone house.

City redesign studies from 17 November 2026: A is a sixfold garden-city framework; B uses woven concentric rings; C uses two connected Archimedean spirals; D uses Penrose courtyards. The user requested brainstorming first, so these studies do not change the live arrangement. Keep the central Gallery/Babel/observatory axis, circular ocean boundary and existing personal homes in the comparison. These letters refer to city layouts, separately from Zarathustra character choice B.

The bird destination is now the observatory CEILING underside, not its walking floor. Preserve the downward normals, shared slab thickness, 15mm reveal and upward settlement beneath the real deck. All64 birds use the same ceiling tile mapping and colour; final routes remain below the platform. The glass roof and real star sky remain clear. Use ?arrival=ceiling-mosaic for the looking-up preview.

For the A city-layout study, the user rejected both distorted hexagons and an overly compact central plan. The revised proposal should spread regular honeycomb neighbourhoods across the usable island. The user permits reshaping P (park) and moving H (homes) to the other, night face; H is not to be deleted. These are design directions, not a migration of private data or a completed live rearrangement. Preserve home contents and the pond crossing when later implementing the approved layout.

The central passage now replaces the final half-turn of each old helix with one supported full-circle gravity stair. Its shared moving frame rolls gradually from upper +Y to lower -Y; progress is controlled by walking distance and reverses with movement. Preserve the actual 200 upper + 240 turning + 200 lower treads, matching continuous rails, eye/lantern/photo poses and the retired flat-middle exclusion. Do not restore switchHalf, a timed camera flip or a ghost middle deck. See docs/TWO-FACE-GALLERY.md and tests/gravity-stair.mjs.

The geometry reading floor now also has an original Mobius ribbon with a walking ant. Keep its shared placement transform, continuous two-circuit orientation, stance-foot contact, reduced-motion pause and proximity-gated study controls. All five sculpture courts and 27 genuine opening pages remain. Do not copy an Escher print or external sculpture mesh; preserve the explicit museum/artist references in docs/MATHEMATICAL-SCULPTURES.md.

The night sky now cycles horizon-eligible original constellation figures about every 24 seconds on a fixed dated chart. Keep automatic changes independent of chart time, star positions and camera aim. Preserve Pause/Play/Next, manual selection and hidden-line pause, reduced-motion manual mode, modal/hidden/off-face clock suspension, name/direction cues and the unchanged HYG credits. See constellation-tour-model.js and tests/night-sky-tour.mjs.

On 18 November 2026 the user approved the honeycomb maze city (layout A), with linked courtyard routes and existing real underground shortcuts. The live upper city now has 37 regular 92-metre hexagonal blocks, 106 block-edge streets and 29 regrouped working public buildings. The park and its pond, central Gallery, Proof Atelier, House of Transformations and Escher routes retain their shared physical anchors. Keep generated honeycomb-city-layout.js synchronized using tools/render-honeycomb-layout.mjs and validate against the real source footprints; do not restore a blocking runtime layout solve. All physical walls must retain actual path and door openings.

The personal-home neighbourhood is now presented on the lower night face using night-home-layout.js, preserving original source IDs, rooms, documents and notes. The old upper reserve no longer blocks public streets. Preserve all existing maximum 128-home source-home capacity, parcel/route batching, lower collision delegation outside the old campus, minimap paths and immediate same-count rebuild mounting. Read docs/HONEYCOMB-CITY.md and docs/NIGHT-HOME-NEIGHBOURHOOD.md before changing these placements.

On 18 November 2026 the user finally chose Penrose TILING for the ground Mathematics floor after trying mirror and informational-display directions. Keep this final choice; the facts experiment remains saved but dormant and the mirror branch is retained only as an experiment. Preserve the open stair shaft, exact floor geometry, quiet circulation bands and glazed upper mezzanines.

The optional informative-floor experiment remains in floor-facts.js and docs/FLOOR-FACTS.md for later reuse, but is not installed in the live city. Do not restore its changing cards or floor hint over the chosen Penrose floor.

The user rejected the first minor honeycomb rearrangement. The current redesign replaces the noncentral streets with regular block-edge roads and groups29 existing working public buildings in six inhabited arcade courts, rather than scattering old buildings beside decorative hex lines. Keep actual paving composed from the same complete route authority used by map/navigation tests; hidden legacy paving is not proof that a road is visible. The six philosopher houses now have distinct source-owned roofs and sheltered fronts in philosopher-quarter.js, while books, idea objects and study positions remain stable. ?arrival=city-plan opens the real upper aerial plan; the bare address still opens Babel.

The chosen ground Mathematics floor is now penrose-reading-floor.js: a complete finite field of true paired Robinson rhombs, quiet inner/outer stone circulation bands and restrained brass joints. It borrows only the original ground annulus material; preserve exact geometry/normals/indices, the stair shaft and upper glazing, normal night lighting/fog/clipping, one owned texture and safe original-material restoration. No floor text, hint, timers or mirror pass is installed. Read docs/PENROSE-READING-FLOOR.md.

The Commons of Care now occupies southern upper-city hex(−2,3), centred at(−79.67433714816835,414), with its approach at z428 connected to the street junction at z506. Keep its placement and path shared through humanity-commons-model.js. It is an original fictional ethical experiment, not an optimal ethics score. Its three allocation rules change six visible water units for reported needs[1,2,5]. Preserve the assumptions and unmet/above-report disclosure, physical access/collision gates, original pavilion and explicit-only Carry this question notebook action; no automatic personal-data writes. See docs/HUMANITY-COMMONS.md. All street trees must clear building roofs and door paths by their crown extent, including the hexagonal Penrose pavilions, not only by trunk centre.

Six original sector learning places occupy the six symmetric outer hexagon centres: Graph Garden, Probability Pavilion, Listening Court, Mapmakers Square, Light Court and Symmetry Garden. Their shared model defines exact footprints, level doorstep connectors and street spurs; geometry, map and planting must use those same authorities. Keep their manual experiments mathematically correct, source-linked shared reader, physical E/A gates and explicit-only Carry this question actions. No new voice service or automated personal-data write is involved. Read docs/CITY-LEARNING-PLACES.md before changing them.

The explicitly requested Archetypes quarter occupies(-318.6973486,276), with four walkable illustrated houses: Persona/Masks, Shadow/Encounter, Trickster/Crossroads and Transformation/Seven Gates. Teach historical Jungian ideas as an interpretive framework; preserve the distinction between original cultural narratives and the clearly labelled original Jungian readings. Keep the four genuine Met CC0 photographs, exact metadata/hashes and honest uncertain-identity captions, culturally specific Oxford/Perseus/IAAP sources, no diagnosis/type scoring and only explicit Carry this question writes. The separately proposed Freud House of Psychoanalysis remains design-stage. Read docs/ARCHETYPES-QUARTER.md.


## Sixfold honeycomb houses —18 November2026

The live centre now has one Gallery cell and six complete eight-floor Houses of Transformations at the exact six neighbouring regular-hex centres R=sqrt(3)*92m. Keep all30 unique central-cell edges physically paved, real tangential door approaches and map footprints synchronized. Retire the old125m house instance, misaligned76m precinct and box/zigzag campus paths. Six real shaft cuts share city-config.houseWells, coast lawn, foundation and analytically notched153m Gallery plinth. Source HOUSE at125 remains a reusable prototype, never a second live instance.

The six fields are genuine Penrose, hexagonal, triangular, square, octagon/square4.8.8 and trihexagonal3.6.3.6 tilings across floors, unfolded walls, ceilings and treads. Share structural geometry, use coarse above-ground shells at distance and lazily build compact two-draw finishes; only the current house lamps activate. One coordinator owns all house/stair/basement movement, independent shelves/pendulums, camera easing and the reversible Escher/Gallery crossing. The basement circuit is actual supported geometry with open physical junctions, not portals. Read docs/SIXFOLD-HOUSE-NETWORK.md and docs/SIXFOLD-TILINGS.md.

The three original pavilion investigations move into first-upper-floor study tables in the west, northwest and northeast copies. Preserve the original aperiodic/inflation/symmetry IDs, exact substitution models and controls; their separate shells and centre-blocking approaches are dormant source code. Pattern guides qualify finite patches and local angle sums, and only visible physically eligible controls may change experiments. Never use a generic aperiodicity claim for the five periodic fields.

The latest park instruction is ONLY to shift it upward: keep its walls. The complete source park now mounts at(0,.015,-375), scale.65,45m north of the previous position, retaining118 people, original tools/seeds/pond/boats and all source-local coordinates. Five grass courts compensate in local space to remain on the city lattice. Keep city-config.parkSite, IDEAS_PARK_SITE, source CITY.PARK, coast map/paths, pond cameras and origami friends consistent;1240 actual crowns clear the six roofs and the shoreline promenade.

Saved artist editions use a presentation-only wrapper in the empty outer eastern cell(398.3716857,138), preserving all20 source slots, records, room/study actions and source indices. Keep its56m full-crown reserve and real approach; do not move private data or confuse this capacity with the separate128-home night neighbourhood. Existing fixed Kokoro voices/recordings, accounts, notes, original paper credits and the unmerged PR5 remain untouched.

The latest coast request matches the park green on the existing lawn surfaces, using owned clones of the original park Standard material and two contiguous urban material groups; no thin coincident grass overlay. The four lower Mathematics facade levels now have160 genuine curved glass panes and fine edge joints, with the existing west opening preserved. The world section cuts actual six-house/basement/corridor/Escher cavities from its mineral face, starts on the east-west house axis and keeps surrounding earth opaque. Full source house interiors appear only where the chosen section plane intersects them; manual section rotation remains available without automatic drift. Read docs/WORLD-SECTION-VOIDS.md.

The coastal map has a distinct Middle layer plan using real sixfold, Gallery and
Escher footprints and honest depth labels. Keep it synchronized with those shared
models. city-lawn-palette.js owns seaside/map grass colour and whole-cell selection;
clone the source park material without introducing another coincident lawn skin.

Makers courtyard now mounts as one rigid source district at(239.0230114,-170),
inside hex(2,-1). makers-site.js owns its three roof footprints and real access
paths. Keep source rooms/cargo anchors local and preserve the separate Proof
Atelier at(215,-78). Map, planting and wall clipping use the shared site.
The basement corridor walls have 0.28m outward masonry thickness to survive
close-camera near clipping; keep joins open and hide distant surface-only house
shells during underground walking. Never replace these walls with zero-depth planes.

The paper gallery now contains35 distinct genuine first pages across8/10/8/9
collections. Eight modern mathematical detours in historic-papers-surprises-data.js
add brief hooks, assumptions and questions; preserve all previous27 records and
full images unchanged. New 800px display derivatives have their own provenance.
Keep explicit CC BY4.0 only where printed (Bach2017); other JMLR entries use the
publisher policy without inventing a version. Preserve category/proximity gates,
room caption hooks and the saved original scans. Read docs/PAPER-COLLECTION.md.

## City guestbook

The public visitor-comment service lives separately in workspace services/city-guestbook, Sites project appgprj_6afe0785a2d08191949699269510429c. Preserve its own D1 table and owner-only inbox; never connect it to the private House database. The city opens its form through city-guestbook.js. See docs/CITY-GUESTBOOK.md. No raw network addresses or public comment listing; secrets stay in runtime configuration.

## Physical Escher house stair and aluminium cylinder

The rear Escher alcove now leads to eight actual switchback flights (320 treads) from .13m to the existing museum at −40m. Preserve escher-descent-model.js as the shared authority for the real lawn/civic grass/paving/foundation opening, house floor, shaft, museum ceiling/divider cuts, section and map. Park and Study remain linked doors; the Escher surface threshold must not teleport underground. Root ground substeps capture the narrow stair mouth even after a slow frame; the stair group belongs to the museum root so underground culling keeps it visible. Keep .3m wall clearance, double-sided enclosing masonry, reversible floor ownership and modal pause. Returning from below may open the physical shutter without marking the perspective puzzle solved or writing progress.

The cylinder lining is now brushed-silver aluminium with Phong specular response and subtle grain. Keep the original ivory/ochre/slate birds and all 64 departure/ceiling bindings unchanged. Both the painted field and optional relief use the same exposed silver finish. See docs/CYLINDER-BIRD-TRANSITION.md.

## Separate city editions · 20 November 2026

The user requires the original `https://hadi1373z.github.io/city-of-ideas/` to stay unaffected by edition experiments. Develop those under `edition_*` paths, never install their guidance in the original `src/index.html`. `city-copies.json` and `tools/city-copies.cjs` build four preserved starting copies and three focused prototypes, all against the pinned public source at `944f69d4be1f7af55a64ba0feacc44d9e9f86955`. Existing city-of-* addresses remain aliases. See docs/CITY-COPIES.md.

The learning edition means MATHEMATICS learning. It starts at the existing Proof Atelier and connects its six workshops/twelve deeper problems, the counterexample walk and paper gallery. Discovery starts at Escher, Making at Origami. Their optional journey controls delegate to actual original activities and never award completion for visiting. These are curated experience prototypes, not completed new architectural layouts. Preserve original voices, accounts, private data and independently saved last-workbench/next-unfinished navigation.


## Rebuilt Mathematics edition · 20 November 2026

The latest user direction replaces the Mathematics prototype with a real smaller mathematical city. Keep this isolated in editions/mathematics and its two published routes. The main city and other editions must remain unchanged. Read docs/MATHEMATICS-CITY.md. Six mathematical houses and their shared gardens surround the complete original Proof Atelier; the park is woven between houses, not copied as a separate district. Reuse the pinned public Atelier and paper sources, existing progress, distinct resume/next-unfinished navigation and credits. Campus notes have their own explicit-save key. Keep actual map footprints, roads, front doors, collision domain and full-crown planting synchronized. Preserve the nonmodal-workbench movement return value so phone arrows close its panel and keep moving.

## Explicit main-city house requests · 20 November 2026

The user separately authorized improvements to the existing main-city Origami
house, Cage listening house and the pictured Escher hexagonal cloister. These
are main-city work; keep all edition baselines unchanged. Origami's roof strips
must remain real glazed openings, its floor a flat crease pattern, and its live
controls must preserve private drafts and the movement return convention. Read
docs/ORIGAMI-HOUSE.md. Cage compares the same event inventory under different
rest arrangements and invites untimed environmental listening without recording;
read docs/CAGE-LISTENING-HOUSE.md. Preserve the established cast and recordings.

At the user's request, Mirzakhani's Curved Space building is absent from the live
main city. SEMINAR_HOUSE_ARCHIVE retains its model/lesson definition and existing
personal storage; do not recreate its building, path, map landmark or collider
through the live SEMINAR_HOUSES list.

Escher now follows the approved reference at
design/escher/hexagonal-cloister-approved.png. Read docs/ESCHER-DEPTH.md.
escher-cloister-layout.js is the shared polygon authority for the vaulted court
at−40m, upper arcades at−34m, three hexagonal wings, lower cloister at−46m and
both real connecting stairs. Keep all floor cuts, collision piers/plinths,
height-aware routes, middle map and mineral section synchronized. The preserved
320-tread surface descent has a narrow six-sided entrance annex; its proportions
are constrained by the established shaft. Travel buttons are explicit convenient
travel, independent of the uninterrupted walk. The lower well closes at−50m.

The cloister detail pass subtracts vertical doorway intervals rather than full
wall heights. Keep the low corridor headers, upper-wing arcade/vault clearance,
continuous switchback rails and supported landing returns. Regression checks
include tests/escher-shell.mjs and tests/escher-stair-details.mjs. Origami's
supported Miura portico shares its outline with the urban plan; its arrival is
at(229,92), outside the Escher annex. Gate all Origami context and operations by
actual surface feet height so its prompt never appears in the museum below.

Origami now also has a front construction desk with two exact dog/cat flat-fold
lessons. Keep origami-fold-workbench.js and its UI controller separate from the
old boat/crane milestone activities. Preserve rigid hinge motion, temporary
guide fold/unfold, behind-fold clearance, reversible scrubbing/rotation, manual
reduced-motion mode and visit-local controls. The original lessonStates remain
the completed-diagram authority; no automatic achievement or notebook write.
See docs/ORIGAMI-HOUSE.md and tests/origami-fold-workbench.mjs.

The Escher detail repair clips museum masonry AND blind panels out of the entire
surface-descent shaft; verify both scene roots together. Reserve all three real
print frames from decorative bays. The west vestibule aperture matches the
actual4m by4.8m tunnel, including navigation jambs. escher-stone-details.js owns
the shallow exterior and wall-mounted stair reliefs; do not restore intrusive
cross-flight arches. The southeast basement connector at(70,115)–(68.8,120)
is a supported two-way route with hysteretic controller handoff; keep maps,
cavities and held-input integration synchronized with its shared passage model.

The user approved one larger hexagonal House of Perspectives surface pavilion on20 November2026. Read the surface section of docs/ESCHER-DEPTH.md. Keep its actual glazed lantern, single unified silhouette and shared footprint/entry authority. Preserve the perspective experiment's fixed228,115 origin independently of the new front threshold; its rear passage and original shaft stay connected. The old exterior-detail helper is dormant; its shaft relief remains live.

The philosophy quarter now follows the approved six-house Academy sketch. Read docs/ACADEMY-OF-QUESTIONS.md. academy-layout.js owns six equal inward-facing courtyard sites, local/world transforms, Greek gateway, shaded hexagonal square, actual porches and routes. Keep one Plato house, original reading/source/reflection IDs, all six supported open-sky courts and full-width route clearance. Do not restore the former modern rows or unrotated book/study coordinates. Main-city changes do not alter isolated edition baselines.


Socrates’ original six-room public house now occupies eastern hex(3,0) beside the paper-boat landing. Read docs/SOCRATES-SHORE.md. socrates-site.js owns the rigid source placement(507,40), arrival and street approach; map, planting and urban footprints share it. Do not restore the old southwest house/marker or move its source-local contents/IDs.

The31 Escher shaft arches are closed18cm-deep niches, shared by stone detail and masonry carving. Museum cuts extend22cm into the28cm shaft walls to preserve overlap without filling the recesses. All flight and landing floors now meet the enclosing walls; remove all wall-facing rails, including those in front of the flight alcoves, while retaining guards only beside open inter-flight drops and short landing returns. descentFloorBounds shares the solid support strips independently of the established navigation bands. Combined scene rays in tests/escher-stair-details.mjs verify the cavities, wall-side tread support, continuous landings and178 supported post joins.

The daytime House of Light occupies hex(1,2). Read docs/HOUSE-OF-LIGHT.md. Preserve its real transparent shell, roof lantern,61 overhead rods, physical open routes and live mirror with oblique camera clipping. Keep map, planting and walking tied to house-of-light-model.js, controls physically gated and notebook writes explicit. Do not introduce a global clipping-plane mutation during nested mirror capture; it hides instanced transparent rods in the main pass.
