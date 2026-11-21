# One circular world with two physical faces

The upper city and the former remote Graveyard district now inhabit opposite
faces of one circular cylinder. The approved dimensions are radius **570 m**,
thickness **96 m**, upper reference plane **Y=0**, lower reference plane
**Y=−96**, and middle plane **Y=−48**. Ocean surrounds the circumference. This
is a change in physical presentation and connected travel; the original lower
source objects, tools, mathematical content, recordings and private saves retain
their identities.

## Coordinate contract

`src/world-cylinder-model.js` is authoritative for the world frame. Lower
simulation coordinates remain ordinary +Y-up logical coordinates around
`{x:-2160,z:-65}`. Their physical rendering uses one proper rigid transform:

```text
physical X = logical X + 2160
physical Y = -96 - logical Y
physical Z = -logical Z - 65
```

This is a half-turn about X plus translation, with determinant +1. It preserves
handedness, scale, relative distances and the source animation coordinate system.
It is not a negative-scale reflection. The logical lower origin maps to physical
`(0,-96,0)`; a lower floor at logical Y=.13 renders at physical Y=−96.13.
`lowerPhysical`, `physicalToLower`, `lowerLocal` and `lowerMatrix` must agree.

## Permanent day and night

The upper city remains in daylight; the lower inhabited face is permanently
night. This is a property of the two faces, not a clock, visitor setting, or a
night mode inside the House of Transformations. The lower face uses fixed navy
sky and fog, cool moonlight, warm campus lights and a darker exposure of the
shared ocean shader. Interior reading lights and original paper pages remain
readable. Changing face, leaving overview, and a reduced-motion crossing restore
the upper environment without retaining the lower fog or light intensities.

`withLowerEnvironment(render)` scopes the lower sky/fog and reading lights for
the live pond render, restoring the upper scene even when rendering throws.
Ideas Park now lives on the night face. Its original pond captures actual
upper daylight through `withUpperEnvironment(render)`, which restores all
visibility, lighting, fog and upper-sea state after the pass.

## Wall becoming birds

`cylinder-metamorphosis-scene.js` adds an original interlocking bird relief to
the inside of the retaining cylinder beneath Babel. Its master polygon is made
by exchanging opposite edges of a unit square. The planar tile has matching
translated edges; its horizontal repeat wraps the cylinder. This is an original
Escher-inspired construction, not a reproduction of a print.

The lower rows progressively separate and lead to a flock with articulated
wings. Relief and motion remain outside the stone stair and arches, clear of
the east doorway and middle platform. Reduced motion freezes the flock at a
deliberate pose. The opaque earth core remains behind the relief. The module
owns its geometry, animation and disposal; it does not modify navigation,
recordings, personal storage or asset credits.

Do not translate individual source meshes or rewrite stored positions to physical
coordinates. `mountLowerWorld` identifies wholly remote scene subtrees, preserves
their original parents and parent-world transforms in wrappers, and mounts those
wrappers into `built.lowerFrame`. Mixed upper/lower roots are inspected rather
than moved wholesale. Camera, photo camera and the live lantern use the same
proper lower frame. Picking must use that physical camera against transformed
geometry. Source animation continues in its original local coordinates.

The lower ground is circular, with walking bounded to radius 565. Its land starts
outside the real central gallery aperture at r58; the cylinder edge is r570.
The obsolete independent Graveyard ground is hidden after mounting, with its
visibility restored on cleanup. It must not cover the lower central opening.
The old source district's collision delegates remain authoritative for its rooms;
new lower land and Faculty/landscape solids need their own bounds and colliders.

## The shared central structure

Zarathustra Gallery remains at the upper centre. Its snake-head staircase enters
the same five-terrace Babel library, with floors at Y −8, −12, −16, −20 and −24.
The finite catalogue, all five reading desks and four original radial flights
remain. Babel is one shared interior along the cylinder axis, not a second copy
on the lower face.

The last Babel aisle opens through two omitted east shelf bays into a bridge at
X9..18, Z±1.8, Y−24. The pit base at Y−26.5 consists of a central disk r0..13.9
and an outer ring r18.1..57.4, leaving a real open shaft for the through-gallery.
The original book well now contains 64 individual upright books around a quiet
reading plinth, all inside r4.2 and below 2.4 m above the base. Keep their display
clear of the final terrace aisle and the spiral shaft. The upper overlook uses
the first terrace's floor material and keeps its exact gallery stair opening.
See `BABEL-SNAKE-DESCENT.md` for that join and borrowed-resource ownership.

`src/two-face-gallery-model.js` retains the original complete three-turn,
240-step helices as an inspection model. The live controller and scene use only
their first **200 treads, through angle 5π**, radius 16 and width 3.2. The upper
half begins at `(16,-24,0)`. The lower half retains local +Y-up coordinates and
the same rigid physical frame as all other lower rooms. The two retired last
half-turns and coincident middle rectangles are absent from the live scene and
cannot be acquired by the live controller.

`gravity-stair-model.js` and `gravity-stair-scene.js` join the two retained
helices with **240 shallow, gradually tilted planar treads** and closed risers.
The route circles the shaft once, from physical `(-16,-44,0)` to
`(-16,-56.0216667,0)`, with matched approach slopes. Its width remains 3.2 m.
The approximately 101 m walk gradually rolls the local up vector from +Y to −Y;
quintic roll easing has zero speed at both joins. Continuous rounded handrails
follow that same moving frame and meet the existing r14.34/r17.66 rails. The
old timed 850 ms camera flip and relocation at the middle plane are removed.

Walking distance controls roll: stopping holds the current position and angle,
and reversing retraces them. Keys and touch/gamepad inputs share local forward
and strafe movement, bounded inside the real rails. Yaw and pitch remain free
in the moving frame. The first-person camera, photo camera and live lantern use
the same frame; the night environment blends by passage progress. On either
exit the physical eye position and look are converted back to the original
rigid side without resetting pitch or turning the visitor around. A short
supported approach overlap retains the actual old tread heights, so capture
does not snap the visitor ahead. Modal readers pause the walk normally.

The model retains feet height, unwrapped angle, side and surface layer when
choosing a tread. A shared X/Z position is insufficient to change floors or pick
another coil. Preserve the `galleryTheta`, `galleryLayer` and `gallerySide`
contract; ordinary movement cannot snap a player onto an overlapping route.
The controller owns handoffs between Babel, spiral, tunnel, lower annulus and
lower ground. Unrelated travel or leaving city mode must relinquish the route.

The western exit overlaps the ordinary lower ground before the finite walkout
deck ends. The shared exterior-handoff predicate releases gallery ownership
there and prevents both automatic capture sites from immediately taking it back.
This applies to the outer annular floor band too. In that overlap, ordinary
lower-ground movement still passes through `canLower`, including the Faculty,
paper monitors, landscape, original source walls and ocean boundary. An invalid
central-gallery surface still blocks entry into the open well. Do not fix an
exit trap by removing solid windows or disabling collision delegates.

The regression walks beyond local X -64, turns past the deck's Z edge, follows
the complete covered connector to the working Mathematics entrance and returns
to the rotunda. A check that only reaches the first route-null frame misses the
repeated-capture trap.

The Faculty of Mathematics is the lower central annular building directly
opposite the upper Gallery. `src/math-faculty-model.js` and
`src/math-faculty-scene.js` add the central rotunda's annular roof and open oculus,
arcade, eight discipline book bays and real reader/floor actions around the
retained gallery floor and colonnade. The central well stays open. Its working
eight-floor source wing is west at logical `(−2240,−65)`, local `(−80,0)`; the
covered walk follows the model's actual connector to the existing front door.
The native mathematical rooms, partitions, floors, shelves, Atlas actions, lift
and lessons stay the working interior. Only precisely identified exterior shell
nodes may be hidden when replacing that shell. Ramsey House remains beside the
working wing through `ramseyPlacement`, retaining its offset, recordings and
conversation cast. Do not introduce a second teaching interior as decoration.

## Escher's physical spur

The upper spiral has an open second-turn landing at angle 4π, Y−40. Its spur
runs X15.7..22, Z±2 and joins the real four-metre tunnel at `(22,-40,0)`.
`GALLERY_TUNNEL` defines the continuous centreline:

```text
(22,0) → (70,0) → (70,115) → (135,115), floor Y=-40
```

The final opening enters the Escher museum west vestibule. The tunnel, corner
turning spaces and museum boundary contain real floor/roof/wall geometry and
matching navigation; no wall, foundation face or portal plane may span the join.
The museum consumes its handoff frame and returns through `setGalleryExit` to
`worldCylinder.enterTunnel`. The world controller stops museum navigation before
assuming the tunnel. Keep the Y−40 and active-mode gates on both sides.

`src/escher-depth-*.js` adds the connected original experiments and rooms below
the existing Escher house. The original upper house, puzzle and artwork credits
remain intact. Other museum surface entrances are explicit linked thresholds,
not claims of unmodelled physical staircases. `ESCHER-DEPTH.md` describes the
individual room bounds, experiments, threshold rules and attribution.

## Pond window and crossing

`src/pond-world-window-*.js` uses the existing park fountain at logical
`(−2200,−430)` on the night face. Its centre shows a projective live render of
the same scene's upper daylight. `night-park-model.js` owns that shared site,
all five moved lawns, the real approach and lantern positions.
The raised centre is removed from its real static batches while the pale rim,
lower basin and animated paper boats remain. The water window contributes no
floor or collision surface. Do not replace it with an image or duplicate city.

Capture runs before the ordinary main render, after the host has prepared the
physical camera; photos use the same ordering. The module guards recursion,
restores all renderer state and temporary root visibility even after errors,
and restores borrowed fountain geometry on cleanup. Capture is proximity- and
frustum-gated, throttled, and uses a small render target. Details, exact geometry
and resource ownership are in `POND-WORLD-WINDOW.md`.

The pond context offers **Look through the pond** and **Travel to the other
face**. The second delegates to `worldCylinder.travelFromPond`. The default is
a live 3D camera journey around the actual cylinder edge, followed by arrival on
the opposite face. From the night park it returns to the upper approach at
`(0,.13,−222)`. It has a skip action and honours reduced motion. It creates no
speech or video recording. `src/city-config.js` keeps `pondTransitionVideo:null`;
a future published video path can opt into the host's video transition. The
current feature must remain usable without that optional future asset. Leaving,
skipping, changing modes and teardown must release any transition camera/media
and return input ownership cleanly.

The coastal map marks the central through-gallery and the pond crossing at the
existing Gallery and Ideas Park coordinates. `coastal-map-data.js` owns the
world-to-map overlay; `coastal-map.js` owns the selection/visit interface. The
lower minimap in the world controller must identify the central Faculty,
working west wing, Ramsey, preserved lower destinations and current logical
player position with the same lower-local conversion. Update labels, pins,
arrival destinations and collision ownership together if a source destination
moves. Do not change upper east/west orientation for RTL interface text.

## Maintenance ownership and integration order

| Owner | Responsibility |
| --- | --- |
| `world-cylinder-model.js` | Dimensions, proper lower transform, lower bounds and tunnel centreline |
| `world-cylinder-scene.js` | Cylinder, lower land/ocean/aperture, tunnel, landscape, lower mounting and owned resources |
| `world-cylinder.js` | Navigation ownership, supported gradual gravity stair, lower collision composition, source mounting lifecycle, camera/photo/lantern transforms, world overview, journey, map and lighting restoration |
| `two-face-gallery-model.js` / `two-face-gallery-scene.js` | Matching helical surfaces, bridge/spur/platform geometry, rails, floor and reversible route contract |
| `babel-layout.js` / `babel-library*.js` | Original gallery opening, upper descent, five terraces/catalogue, real pit/shelf cuts and Babel entry/return ownership |
| `math-faculty-model.js` / `math-faculty-scene.js` | Central annulus, wing shell/covered join, discipline actions, exact native shell selection and new solid colliders |
| `escher-depth-*.js` | Museum geometry/experiments, actual gallery boundary and museum navigation lifecycle |
| `night-park-model.js` / `night-park.js` | Complete original park placement, shared lawns/arrival/path/lantern reserves, local lighting and owned cleanup |
| `pond-world-window-*.js` | Existing-fountain cut, live opposite-face capture, contextual pond actions and complete renderer/borrowed-geometry restoration |
| `gallery.js` / `city-integration.js` | Installer order, input arbitration, render/camera hooks and existing source/tool integration |

Install the night-park source-parent placement before park companions and the
coastal tree-bed collector. Then install source districts and Babel, Escher depth, the world
cylinder/Faculty, and finally the pond. In the movement loop, offer Escher depth
control first, then the world cylinder, then Babel, before ordinary walking.
Only one owner consumes a frame. A held movement key is preserved when walking
between physically connected routes. Use the existing modal/reader pause gates
for both manual and guided travel, and relinquish ownership on unrelated travel.

Source hemisphere/directional lights are dimmed and restored by the world
controller for active underground travel; the museum uses its own lamps and
restores background/fog. Lower light belongs to the lower physical face. Any
section-view clipping, temporary scene culling, renderer settings, borrowed
materials and source visibility must be restored on exit and page teardown.
Owned resources are disposed once; mounted source geometry/materials, textures,
animations and existing tools remain owned by their original modules.

Do not touch private notes, stored user content or the established voice cast
when maintaining these structures. Persistent voice instructions and exact
Kokoro assignments remain in `AGENTS.md` and
`src/ramsey-film/assets/voice-cast.json`. Keep all existing source artwork credits
and the mathematical/library explanations and links.

## Verification and previews

Relevant checks are `tests/world-cylinder.mjs`, `tests/gravity-stair.mjs`, `tests/two-face-gallery.mjs`,
`tests/babel-snake-descent.mjs`, `tests/babel-library.mjs`,
`tests/escher-depth-model.mjs`, `tests/escher-depth-runtime.mjs`,
`tests/pond-world-window.mjs`, `tests/math-faculty.mjs` and
`tests/lower-face-visuals.mjs`. They cover the proper transform, source animation
preservation, reversible route/tread geometry, physical tunnel and apertures,
Faculty bounds/working-floor actions, pond capture restoration and resource
cleanup. The full project check remains required before release. Browser review
covers picking, keyboard/controller travel, physical camera turn, cutaway
readability, live pond parallax, the centre book ring and source-room UI.

Current local preview arrivals include `?arrival=gravity-turn`, `?arrival=babel-stairs`, `?arrival=babel`,
`?arrival=through-gallery`, `?arrival=lower-face`, `?arrival=world-section`,
`?arrival=escher-depth` and `?arrival=pond-crossing`. The pond arrival stops beside
the existing basin; crossing remains an explicit action.

## Ocean consistency and central earth

Upper and lower water use the same unlit ocean shader in ocean-surface.js, with identical shoreline palette, foam and fog handling. Each owns its material and time uniforms. World updates preserve reduced motion and the active scene fog.

Below Babel, three closed annular earth layers occupy radii 21.7 to 58 from Y-26.6 to -95.9. The middle layer has a real east-facing rectangular cut at Z +/-2.3 and Y-40.2..-34.7 for the existing Escher corridor. The spiral well remains hollow inside r21.7; Babel and lower Faculty floors remain separate. These layers give the cutaway real earth behind the central shaft rather than exposing sky.

The complete park move, original 620 trees/1240 crown instances,31 shifted/97
unchanged supported home parcels,12 lanterns and held-input verification are
documented in `NIGHT-IDEAS-PARK.md`. The source IDs, voices and private data
remain unchanged.
