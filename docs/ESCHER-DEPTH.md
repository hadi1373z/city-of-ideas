# Escher underground museum

`src/escher-depth-model.js`, `src/escher-depth-scene.js`, and
`src/escher-depth.js` add one connected museum within the island. All coordinates
are ordinary city coordinates with +Y up. The upper Escher house remains at
`(228, 115)`, including its original viewpoint stair, shutters, reproductions,
links, and artwork credits. The saved alignment state and credited prints remain unchanged.

## Physical plan

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
