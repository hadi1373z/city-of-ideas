# Escher underground museum

`src/escher-depth-model.js`, `src/escher-depth-scene.js`, and
`src/escher-depth.js` add one connected museum within the island. All coordinates
are ordinary city coordinates with +Y up. The upper Escher house remains at
`(228, 115)`, including its original viewpoint stair, shutters, reproductions,
links, and artwork credits. The saved alignment state and credited prints remain unchanged.

## Physical plan

The detail pass closes each boundary in three dimensions. Short connecting
passages remove only their actual vertical doorway interval; masonry remains
above their roofs. Ground-floor mouths cannot become empty balcony exits.
Upper wing arcade caps fit below their own vaults. The shell check casts more
than8000horizontal, diagonal and upward rays from real walkable positions on all
three levels; only the actual west tunnel aperture is allowed to remain open.

The gallery connector meets an actual six-metre opening in the west vestibule
wall at `(135, 115, -40)`. There is no wall or portal plane across this opening.
The navigable floor extends to `x=134.4` for an overlap with the tunnel. The
entrance placement for `enter('gallery')` is `(136.4, 115, -40)` and faces east.

The approved cutaway reference is retained at
`design/escher/hexagonal-cloister-approved.png` as design evidence, outside the
published source assets. The built interpretation follows its hexagonal massing,
two-level stone arcades, vaulted ribs, teal recessed bays, geometric court floor
and tall brass focal sculpture. It uses ordinary, walkable Euclidean geometry;
it is not an Escher work or an exact historical architectural reconstruction.

| Space | Plan | Floor / upper gallery | Vault apex |
| --- | --- | --- | --- |
| Gallery vestibule | x134.4–143, z112–118, enclosed corridor | −40 | −33.5 |
| Central court | hexagon centred 197,115, radius 24m | −40 / −34 | −23.6 |
| Perspective wing | hexagon centred 157.63,115, radius 18m | −40 / −34 | −26.8 |
| Tessellation wing | hexagon centred 216.69,80.9, radius18m | −40 / −34 | −26.8 |
| Topology & relations wing | hexagon centred216.69,149.1, radius18m | −40 / −34 | −26.8 |
| Lower cloister | hexagon centred197,166, outer radius 22m, inner radius 12m | −46 | −39.5 |

The west court stair has 48 real treads from −40 to −34. Its opening is cut from
the upper gallery, while routes under it exclude insufficient headroom. Three
upper corridors join the wing balconies to the court gallery. The south stair
has48 real treads from−40 to −46, with actual openings in both court and lower
cloister walls. Its solid side walls and balustrades prohibit side exits before
the landing. The lower well has opaque inner walls and a closed basin at −50.

`escher-cloister-layout.js` supplies shared convex room polygons, ring sectors,
stair bounds and ceilings. The floor navigator selects by previous feet height;
rooms stacked at the same x/z cannot snap visitors between storeys. Floor meshes
and roofs are clipped around the shaft and physical stairs. Perimeter openings,
cases, sculpture plinths and arcade piers are represented in real navigation.
The ivory/sage/ochre court rosette is clipped around stairs and central plinth.
The middle-layer map and mineral section use those same polygons, not bounding
rectangles that invent space around the hexagonal rooms.

Two linked surface doors and one physical house stair lead to the same museum:

| Door ID | Surface door | Interior landing |
| --- | --- | --- |
| `escher` | Rear alcove `(228,104,.13)` | Eight real flights to `(225,107,−40)` |
| `park` | Park approach `(−84,−110,.13)` | West passage `(174,114,−40)` |
| `study` | Study-house lane `(256,−112,.13)` | `(221,155,−40)` |

The Park and Study doors retain their linked thresholds. The Escher-house doorway no longer jumps between levels: it opens onto a real 40.13m descent. The original Escher threshold
requires `window.CITY_ESCHER.passageOpen`. The other two doors do not bypass or
change the original house puzzle. Surface activation requires city mode and a
valid surface height. Returning through a door places the visitor safely south
of its threshold with a short re-entry cooldown.

## Integration

Install after the existing city installers, and include `escher-depth.css`:

```js
import {installEscherDepth} from './escher-depth.js';
const escherDepth = installEscherDepth(M, THREE, {
  onGalleryExit(point) {
    // Activate the gallery connector's navigation at this ordinary floor point.
    // point is {x:134.9, z:<visitor z>, y:-40, yaw, pitch}; y is FLOOR height.
    galleryDepth.enterFromEscher(point);
  }
});
```

The callback name in the example is illustrative; the gallery connector owns its
actual API. `setGalleryExit(fn)` can attach the callback after both installers
exist. When the active visitor walks west past `x=135.15`, within `z=112.5…117.5`,
the museum restores its lighting, stops its navigation and invokes the callback.
The connector should place the visitor at the given floor point and assume
movement on the following frame. The museum consumes the current frame. Without
a callback the visitor is held safely inside the vestibule with a status message.

The connector should call `M.escherDepth.enter('gallery')` when walking east
across its matching boundary. Gate the connector's handoff by actual mode and
floor height, so neither a surface visit nor an unrelated world can activate it.

Runtime API:

- `step(dt, {forward, strafe, turn, boost})`: call before ordinary movement.
  Returns `true` while it owns navigation, including when paused by a modal or
  reader. Uses the same inputs for keyboard and controller. `dt` is seconds.
- `checkPortals(time)`: surface proximity / threshold entry and active validity;
  `time` is seconds. It is also called by the module's `M.city.update` wrapper.
  Calling it again in the root loop is safe.
- `interact()`: call before ordinary interaction. Opens a nearby exhibit, enters
  a surface threshold, or leaves at a nearby interior door marker.
- `enter('gallery'|'escher'|'park'|'study')`, `leave(id?)`, `active` getter.
- `travel('court'|'upper')`: explicit optional convenience travel within an active
  museum visit. The visible buttons say Travel; neither changes investigation
  progress nor presents a jump as walking. Both destinations also have real
  reversible walking routes.
- `stop()`: relinquish museum control without moving the player, for connected
  navigation and external travel.
- `setGalleryExit(fn)`, `galleryBoundary`, `progress` getter, `built` scene.

`M.player.y` remains the normal eye height above an ordinary +Y floor. The module
uses `M.arrive`, `M.setCityMode` and `M.clearMovement`, guards mode and height, and
relinquishes control on unrelated travel. It wraps existing target, region and
update handlers while delegating other kinds. Owned meshes and target entries
are removed on `pagehide`; foreign scene resources are preserved.
The world-cylinder installer owns source hemisphere/directional-light dimming.
This museum does not change those lights; it enables only its owned ambient and
point lights, and temporarily adjusts and restores the scene background/fog.

## Experiments and provenance

- **One triangle, several depths:** three physically separated rods are scaled
  along rays from one eye point. Their projected endpoints agree there and
  separate after a sideways step. The player must face the geometry and hold a
  genuinely aligned view; a UI button never sets the solved state. Three floor
  marks and a look button make the experiment usable with either control scheme.
- **Edges that agree:** edit two opposite edge pairs and three contour shapes.
  An eight-by-four mosaic updates in the room. Matching both translated edge
  pairs removes their boundary discrepancy. The claim is limited to this
  construction, not to a classification of every tessellation.
- **Can every flight rise?:** change four signed flights in a small stair model.
  A visible red seam shows the closure gap. A route in ordinary space closes
  vertically only when its signed height changes sum to zero. All four rising
  flights give +8; a closed choice includes descents. The walkable museum stair
  is separate and always physically valid.

These are original geometric experiments and English explanations, not works by
M. C. Escher or reconstructions of his historical prints. Existing artwork
credits remain in the upper house. The module does not access private notes,
visitor saves, character voices, recordings, or external services. New experiment
state exists only in memory for the current page visit.

## Verification

```text
node tests/escher-depth-model.mjs
node tests/escher-depth-runtime.mjs
```

The pure test explores every room, door and exhibit through actual collision
navigation and reverses those routes; checks each stair tread; tests the gallery
aperture, walls, voids and large movements; verifies projective alignment and
geometric edge pairing; and exhausts all sixteen loop choices. Runtime checks
cover scene geometry, real floor/roof and tread rays, shared interior entry,
gates, mode/height guards, modal pauses, return handoff, lighting and owned cleanup.

## House as museum entrance pavilion

The surface house keeps its footprint, four credited prints, alignment puzzle and saved passage. A continuous shallow barrel vault replaces the old open beams; its sealed end cheeks meet the door lintels. An original periodic three-colour lozenge field covers the floor and curves over the ceiling, creating a cube/perspective ambiguity without claiming Penrose aperiodicity. The museum route panel is on the right wall before the shutters, so the underground destination is visible on arrival. Brass alcove inlays preserve the entrance axis. Waterfall is preserved on the alcove’s west wall. Behind it, eight connected switchbacks with 320 real treads descend to the existing museum. No automatic portal activation remains at this house; walking owns progress in both directions. The surface puzzle panel is now height-gated so it cannot appear over the museum below.

## Print-to-experiment journeys

Each upper-house print now offers a specific study prompt. Following a print selects an in-memory question and points toward the existing rear threshold; it neither transports the visitor nor bypasses the alignment puzzle. Museum guidance names the physical route. Ascending and Descending leads to the signed-flight model with a four-up reset; Waterfall and Relativity lead to the separated-depth projection experiment (which does not model different gravity fields); Drawing Hands leads to a two-task dependency experiment at the reading desk. These are original finite models, with their limits stated. No new achievements or automatic private-note writes are introduced.

Direct surface arrival: `?arrival=escher-house`. Roof/floor support, grazing edge closure, both doorways and the original projection are checked in `tests/escher-entrance-architecture.mjs`.

## Physical house descent · 18 November 2026

`escher-descent-model.js` shares eight 12m flights, seven turning landings, the top alcove opening and the exact bottom museum doorway. `escher-descent.js` builds supported pale treads, slate enclosing walls and repeated low arcades inspired by Escher’s spatial layering; it is original ordinary Euclidean architecture. The first flight cuts the actual lawn, island foundation and alcove floor. The shaft cuts both intersected museum ceilings and the room divider. Thick walls enclose the entire journey. The mineral section and middle-layer map include this actual shaft.

The controller retains visitor position at both seams, chooses a floor only near the previous height, pauses for modals and releases movement in the outgoing direction. Walking away from the bottom landing cannot recapture it. Returning from below opens the physical surface shutter without recording a solved puzzle or changing private progress. Park and Study surface doors remain at their original coordinates; Study now lands in the southeast wing. `tests/escher-descent.mjs` checks every tread at three widths, headroom, both directions and actual ground removal; the runtime fixture drives the real controller all the way down and up without a jump.

## Quiet stair entrance

The museum-side return stair has a bevelled stone arch, continuous bronze reveal, warm recessed edge strips and a shallow fan-shaped floor approach. STAIR_PORTAL in escher-descent-model.js shares the actual clear opening and jamb collision bounds. The existing eight flights, tread heights and handoffs remain. The old floating stair caption, black rectangular floor marker and large surface-house name sign are removed; all four credited prints remain.

## Surface stair pavilion · 20 November 2026

The exposed sloping cover formerly looked like a ramp into reversed signage.
It is replaced with a genuine six-sided stair pavilion, with a six-facet hipped
cap and chamfered rear. Its solid rear and side walls conceal the shallow lawn
cut. The shared DESCENT_ANNEX polygon drives the actual masonry, roof and
body-expanded surface collision.
The pavilion is deliberately long and narrow to fit the established shaft; it
is not the broad regular surface hexagon drawn in the reference. Achieving those
exact proportions would require moving the original house, lanes and proven
ground cuts. The underground hexagonal court/wing arrangement is built, while
the original rectangular credited-print gallery remains the approach.

The real front capture interval, first-flight headroom, eight switchbacks and
bottom arch remain. Signs are front-facing, so the back of an entrance caption
cannot become a misleading reversed doorway.

The route guide's museum graph now follows the new ground aisles, upper rings
and lower annulus. Each candidate edge is checked in both directions against the
height-aware navigator; the guide never reuses the retired rectangular floor plan.
`tests/sixfold-world-integration.mjs` holds forward through the actual tunnel,
perspective aisle and return seam. `tests/connected-journey.mjs` includes upper
and lower floor routes as well as the unchanged city learning journey.

## Stair rail and enclosure repair

All 320 surface-descent treads and 96 museum treads retain their original
positions and reversible controllers. Surface rail posts now reach the actual
interpolated handrail height, instead of ending below its slope. Each of the
seven turning landings joins both flights with supported guards along the open inter-flight edges
and a short inner return over the gap between lanes. Top and bottom guards
continue onto their real entry/exit landings and end against posts with turned
returns. Rounded joints and rails use two owned instance batches.

The museum stairs have matching measured post heights and flat landing returns.
The lower stair's tall side enclosure now has headers over both actual doorways:
2.65m clearance at the court and 4.65m at the lower cloister. The lower header
overlaps the cloister vault and reaches the stair lid, closing the former
upper-gallery sightline into the island exterior. The upper stair remains open
within the already closed main court vault.

`tests/escher-stair-details.mjs` checks 178 post-to-rail joins against their
physical meshes, supported rail endings, and 5,400 bidirectional shoulder/torso
rays across every tread, all surface turns and lateral museum-stair entrances.
It also checks the high view above the lower doorway. These complement vertical
floor/headroom rays: an unobstructed downward ray alone cannot rule out a wall
across an entrance or a disconnected handrail. Closed shaft walls beyond a
switchback remain intentional; the continuous guard now makes its turn legible.

## Pavilion and combined-scene repair · 20 November 2026

The surface gallery, rear alcove and narrow stair annex share pale masonry,
stone base courses, bronze cornices and opaque recessed arch reliefs. The original
roof, credited prints, puzzle and stair footprint stay intact. Stair landing
recesses attach to the enclosing walls; the former cross-flight arches are gone.
Warm strips are owned unlit materials, without additional point lights.

All museum box solids and mouldings subtract the complete surface stair shaft
in plan before batching. Testing the isolated stair was insufficient: the old
wing wall crossed flights six and seven. The stair body sweeps now run against
both museum and stair geometry together. Artwork reserves remove decorative
bays behind/over the genuine prints, with27 first-surface visibility rays.

The west vestibule retains its6m width but narrows at the actual4m-wide,4.8m-high
Gallery tunnel mouth. Jamb collision and handoff width match that doorway; the
side strips and header close the former views into empty earth.

## Approved surface pavilion · 20 November 2026

The user's approved reference is `design/escher/hexagonal-pavilion-approved-20261120.png`. The main-city house is now one regular hexagon (27.5m radius, centre239.023011444505,138), not three rectangular boxes. `escher-pavilion-model.js` supplies its physical outline, front threshold and planting reserve; `escher-pavilion-scene.js` owns the pale masonry, arched entrance/recesses, original bird frieze, continuous clipped lozenge floor, roof facets, six-column arcade and actual transparent glass lantern. The scaled design deliberately fits the original eight-flight shaft without moving its real mouth or underground destination. The narrow shaft annex retains its original position and joins the relocated hexagon through the enclosed rear link.

The perspective experiment uses the pavilion's actual experimentOrigin, now239.023011444505,139, with all viewing markers and exact alignment translated together. Never derive its origin from the building's front door; explicit historical builder coordinates remain supported for isolated baseline tests. The three genuine print frames move onto clear inner wall faces; the gated Waterfall alcove, source attribution and original interaction IDs remain. The entrance and source gallery routes/map share the new threshold. No image from the reference board is used as a scene texture. Tests check floor support, roof/glass closure, the real stair opening, print visibility, full-body entry lanes and preserved puzzle alignment.

The pavilion court also contains an original anamorphic frame sculpture on a low off-axis plinth. Its twelve edges occupy three real depths; their projections meet at exactly eight shared corners only from the brass stud. It leaves the original gate puzzle and its comparison marks unchanged. The masonry recesses are intentionally opaque arched panels, while only the central lantern is actual glass.


## Recessed stair alcoves and wall-backed turns · 21 November 2026

The31 stair-wall arch panels now have real18cm-deep closed recesses, with stone jambs, sills and curved soffits. escher-stone-details.js supplies one shared niche layout; escher-descent.js subtracts those exact cavities from the shaft masonry. The museum floor/vault cut extends22cm into the28cm shaft enclosure, preserving6cm of overlap and preventing a separate museum slab from filling a niche. Combined-scene rays verify the actual18cm backs.

All seven turning landings extend to the enclosing side/end walls. The end-wall-facing cross-rail is removed; supported guards along the open inter-flight edges and the short inter-flight return still protect the real drops. The user can turn on continuous floor without a railing in front of the solid wall. Flight treads, fixed voices, private data and reversible controller handoff remain unchanged.


The user clarified that wall-facing flight rails must be removed too. All eight flights and both end landings now have solid bearing strips to the shaft walls, while the established navigation bands remain unchanged. descentFloorBounds shares these actual support extents. The only shaft guards follow the open inter-flight drops and their short landing returns; none run in front of the wall alcoves. A regression checks every widened tread at the wall and rejects any outer-wall rail path.

The31 niches now have93cm sill origins,55cm higher than before. The three on
the first flight move to fractions .72/.86/1 and narrow to1.4m so their raised
crowns fit below the actual ground ceiling. escher-niche-ornaments.js fills the
backs with original cobalt/turquoise/ivory eight-point-star tilework and four
rows of recessed faceted vault cells inspired by the user's reference. All
ornament remains45–180mm behind the wall face. These are procedural geometric
interpretations, not a photograph texture or a claim of a historical replica.
Two geometry batches share one glazed material. Combined-scene tests retain
opaque18cm backs, check visible tiles and genuinely three-dimensional cells in
every niche, and prove all original stair/landing routes remain clear.

## Centred pavilion and paper courtyard · 21 November 2026

The user moved Origami, Noether and Cage out of Escher's block to the previously
vacant hex(−1,3), centred at(79.67433714816835,414). Origami is at
(79.67433714816835,385) facing +Z; Noether and Cage are at
(45.67433714816835,437) and(113.67433714816835,437), facing north. Their shared
courtyard runs along Z414 to the eastern hex boundary X159.3486742963367.
The old local paths, map labels and furniture sites move with the actual houses.
Mirzakhani remains archived and absent from the live city. Folding/listening/
symmetry lesson IDs, explicit private saves and recorded voices are unchanged.

The main Escher hexagon is centred exactly in hex(1,1) at
(239.023011444505,138); the source group is at(239.023011444505,.13,139) because
its local centre is Z−1. The front threshold is at Z164.41569860407205. Its real
surface approach goes south to Z178, east to X284, north to Z138, then joins the
block's eastern boundary. It does not draw a road through the hexagon's floor.

The eight-flight shaft stays at X223.8..229.2, Z90.6..106.6, with first tread
start(228,104) and entry(228,105.5). Its lawn/foundation cuts,320 treads, museum
exit, Babel tunnel and underground guide graph retain their exact coordinates.
A roughly10.18m enclosed rear link runs along X228 from Z104 to the new north
wall at Z114.18430139592795. A real off-axis doorway passes through that wall;
its mouldings, floor, side walls and roof share the opening. The gated alcove
continues inside to Z119.98430139592795. The real first-flight cut is subtracted
from the link slab, leaving the original descent open. The Waterfall print and
route panel remain tied to this gated alcove.

`pavilionRearLink` exposes the exact connection; `pavilionFootprint` includes its
true concave rear extension AND the unchanged above-ground shaft annex down to
Z96.1 for maps, collision reserves and planting. General polygon containment is
required for this outline. The main `pavilionPolygon` remains a regular six-sided
polygon; the connection does not distort it. Legacy explicit builder placements
preserve their old relative alcove for edition and architecture baselines. Live
perspective geometry follows the new group origin through `experimentOrigin`,
so its correct view and wrong-position rejection remain exact.

`tests/escher-house-relocation.mjs` checks shared coordinates and old-path
removal;990 full-body rays, slab/headroom support and real enclosing sides along
the new connector; the unchanged first-flight opening; actual new perspective
alignment and rejected side view; and legacy builder compatibility. Existing
Escher descent, shaft/museum combined geometry, source activity and street tests
remain required. Generated map assets are rebuilt from the changed authorities.
