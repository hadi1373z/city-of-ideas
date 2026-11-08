# Escher underground museum

`src/escher-depth-model.js`, `src/escher-depth-scene.js`, and
`src/escher-depth.js` add one connected museum within the island. All coordinates
are ordinary city coordinates with +Y up. The upper Escher house remains at
`(228, 115)`, including its original viewpoint stair, shutters, reproductions,
links, and artwork credits. This module does not change the house or its save.

## Physical plan

The gallery connector meets an actual six-metre opening in the west vestibule
wall at `(135, 115, -40)`. There is no wall or portal plane across this opening.
The navigable floor extends to `x=134.4` for an overlap with the tunnel. The
entrance placement for `enter('gallery')` is `(136.4, 115, -40)` and faces east.

| Room | X bounds | Z bounds | Floor | Ceiling |
| --- | --- | --- | --- | --- |
| Gallery vestibule | 134.4–160 | 105–125 | −40 | −29 |
| Hall of connected views | 160–194 | 98–132 | −40 | −29 |
| Perspective chamber | 194–232 | 98–132 | −40 | −29 |
| Tessellation chamber | 194–232 | 66–98 | −40 | −29 |
| Room of three doors | 232–270 | 98–132 | −40 | −29 |
| Stair | 181–188 | 132–156 | −40 to −46 | −29 |
| Closed-loop chamber | 160–232 | 156–184 | −46 | −35 |

Six-metre shared doorways connect the main rooms. A seven-metre-wide stair with
48 real treads connects the main hall to the lower chamber, and can be walked
in both directions. Walls, roof slabs, exhibit cases, floor bounds and treads
are real geometry; navigation uses the same coordinates. The floor has no
invisible route into the surrounding solid island.

Three surface thresholds lead to this same geometry, rather than loading a page
or creating a second copy:

| Door ID | Surface door | Interior landing |
| --- | --- | --- |
| `escher` | Escher rear alcove `(228,104,.13)` | `(240,115,−40)` |
| `park` | Park approach `(−84,−110,.13)` | Hall `(174,114,−40)` |
| `study` | Study-house lane `(256,−112,.13)` | `(260,121,−40)` |

The doors are linked thresholds between surface and interior. They do not claim
to contain an unmodelled forty-metre staircase. The original Escher threshold
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
