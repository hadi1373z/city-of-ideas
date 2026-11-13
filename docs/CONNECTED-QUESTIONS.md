# Connected questions: Babel, Escher and Mathematics

`connected-journey-model.js` and `connected-journey.js` add an optional folded
guide to the existing connected rooms. They create no destination, actor,
dialogue recording, private save or automatic camera movement. The default
Babel arrival remains exactly where the user approved it.

The English sequence develops one question rather than counting visits:

- **Babel:** a finite catalogue enumerates 4,096 six-symbol pages over four
  symbols. A visitor can try the actual reading desk and prefix controls, then
  consider what evidence would justify a claim on one of the pages.
- **Escher:** the existing physically separated rods align from one viewpoint.
  Moving sideways exposes the depth information lost in projection. The
  ordinary south stair then reaches the real closure experiment: a closed
  route has zero total signed height change.
- **Mathematics:** the lower rotunda's existing Logic and Computation bay
  transfers explicitly to the original working floor. The guide asks which
  assumptions and arguments support an explanation. The mathematical rooms,
  reader, lessons, lift and credits remain owned by their source modules.
- **The sea overlook:** a short opt-in prediction asks whether passage to the
  other face is a reflection or a rotation. Its answer compares East→East,
  North→South and Up→Down. Reversing two axes retains handedness, represented
  by the product (+1)(−1)(−1)=+1. This describes the actual proper half-turn of
  this designed world, rather than a physical or historical claim about Earth.

These are original connecting questions about the installed experiments.
They are not quotations or purported historical statements by the residents.
The original catalogue and Escher artwork/source links remain in their rooms.

Inside the original Mathematics working wing, the folded guide is labelled
**Way out · Mathematics**. Its ground-floor exit is the real central hall and
front doorway. Side-room routes pass through their middle partition opening;
the new open door leaves and covered-connector posts also constrain the route.
Upper floors offer the installed walking stairs or the original lift. The
default walking route ends at the current full-floor stair landing, before the
descending flight. A separate choice shows the route to the actual lift.
**Take the lift to ground floor** is offered only near that floor's real lift
anchor, at the matching floor height, and delegates the original source floor
action. It never moves a visitor automatically or treats a window as an exit.
The guide uses the current source
model, original transform and live collision callback from `CITY_EXTRAS`; a
missing model or a height between source floors supplies no invented route.

## Working-wing stairs and exit guidance

`math-wing-wayfinding-copy.js` supplies EN/DE/FA/CS copy for the Mathematics
Way out panel only; Persian prose is RTL. The remaining Connected questions
sequence and lower-world overview keep their disclosed English copy. No legacy
Math lesson, catalogue, paper reader, imported text or private note is translated.

When `mathWingStairs.built` is present, an upper floor offers **Route to stair
landing** and **Route to lift**. Choosing either changes only the visit's route
destination. **Show route** remains a separate opt-in action; neither choice
moves, turns, starts a lift, selects a floor or enables a hidden trail. Without
the installed stair owner the guide retains only the original lift route.
The existing nearby lift action remains available with either route selected.

The stair destination is the centre of the descending lane on the current
full-floor landing, source-local `(6.2, 6.9)`, derived from `WING_STAIRS` bounds.
It is an actual supported floor-landing surface. Cues lead through the original
partition openings and stop there, rather than drawing a flat path across the
new slab opening. The live source/cargo collision callback, Faculty solids,
stair opening and actual guard bands are checked for every segment. The lift
destination retains the original floor's landing metadata. Ground-floor cues
retain the real doorway and covered connection.

Instructions distinguish the broad half-storey turning landing from a full-floor
landing. Visitors descend the real flights themselves. Between source floors
this panel and its dots hide; the existing four-language stair status remains
the guide. At the next full-floor landing the original walker updates the source
floor/cargo owner, and Way out can offer that floor's route. Guidance never
invokes this update or the same-floor explicit-arrival fallback.

The route destination is visit-only and the existing explicit show/hide state
remains visit-only. Locale events read just the public city language and redraw
public copy; they do not write the saved preference, read storage/private memory,
inspect book colours, change experiments/discoveries/audio or alter raw drafts,
carets, first answers, imports or saves. Disposal removes the owned locale
listener along with the original owned panel/dot resources. Other owners remain.

`tests/connected-journey.mjs` now composes the actual stair adapter and checks
3,900 additional installed route points across all eight floors and both upper
destinations, alongside 7,861 original physical probes. Ordinary `wingStep`
traverses each path without a height jump. Stair routes end on verified full-floor
landings; voids, guards, solid windows and a blocked live landing reject invalid
cues. Four languages, destination choice without movement or automatic trail,
missing-owner lift fallback, intermediate-floor hiding, unchanged source payloads,
nearby-only lift delegation, denied private/storage access and owned cleanup pass.

The panel follows the measured bottom of the real header with an eight-pixel
gap, including wrapped Czech mobile controls. Existing maximum height and
scrolling remain, and Math reading/stair controls continue below the actual
expanded guide. At 390×844, Czech begins at 94px after an 86px header; Persian
begins at 91px after an 83px header. Both have 308px client/scroll width.

All 121 release programs pass. Independent Chrome checks both choices without
movement or storage writes, visible four-language desktop copy, Czech/Persian
mobile and RTL, and ordinary descent from Logic (feet28.13) through the turning
landing (26.13) to Topology (24.13). The source floor remains index7 between
floors, then becomes index6 at the real full-floor landing. The original nearby
lift returns to ground; original partition openings and the central front doors
still provide the exit. A synthetic unsaved Functions reflection retains the
same input, raw text and caret3–8 through direct guide rendering and a local
Czech/Persian companion return. Global city English remains unchanged by that
local reading. Explicit global Czech survives a fresh document, and all eleven
genuine pages report ready. The user's headed preview is not controlled by QA.

## Integration and maintenance

After Babel, Escher, the world cylinder and pond are installed, call:

```js
import {installConnectedJourney} from './connected-journey.js';
installConnectedJourney(M, THREE);
```

Include `connected-journey.css`. Installation wraps `M.city.update`, checks the
current room and real floor, and exposes `M.connectedJourney`. It can run before
the default `visitThermal()` call: the following update discovers the arrival.
The existing root rendering/camera hooks need no change.

`#connected-journey` starts folded. Native summary, button and focus behavior
work with keyboard and the host's normal controller panel controls. Unfolding
does not enable a trail. **Show walking route** explicitly enables small
noninteractive floor dots; it never turns or moves the visitor. Existing
experiments can be opened only inside their original interaction distances.
Closing, choosing another route, leaving these rooms or opening a modal does
not hijack input. The guide stays optional, including the catalogue visit.

The dots are one owned instanced mesh under `worldCylinder.built.group`, which
survives the host's underground source culling. Ordinary upper positions stay
ordinary; lower positions use `lowerPhysical`. The library route uses its real
floor navigator, the spiral uses real tread heights, and museum paths use a
small checked graph through actual doors and stairs. Paths stop at nearby
physical boundaries and update as the visitor crosses them. The lower Faculty
route circles the well and reaches its real Logic bay; it never crosses the
well. No hidden floor, collision, wall opening or saved location is changed.

The shoreline question is shown only near
`worldCylinder.built.lowerLandscape.anchors.overlook`, in lower-local space,
within eight metres on the ordinary lower ground floor. Missing anchors create
no fallback point or question. Its prediction and the fact that the catalogue
dialogue was opened last only for this visit. They are not achievements or
inferences about what the visitor learned. No storage APIs are read or written.

API: `{panel, group, render(force), interact(), dispose(), context,
routeVisible, catalogueOpened}`. `dispose()` removes only owned UI, dots,
geometry and material and restores its update wrapper when it still owns it.
The dots do not participate in picking. The API does not own or mutate source
room, art, character, note, voice, floor or renderer resources.

## Checks and browser review

Run `node tests/connected-journey.mjs`. It probes library arcs and descending
flights, both spiral frames, the real tunnel in both directions, museum cases,
doorways and all 48 south-stair treads through the native floor model. It also
checks the lower Logic bay and exact shore anchor, proximity-only actions,
folded opt-in behavior, modal hiding, unchanged visitor pose, denied storage,
source update preservation and owned cleanup. All eight original Mathematics
models are instantiated for exit tests, including both side rooms, the front
window approach, the real covered connection and upper-floor lift metadata.

In browser, open the bare city address, unfold **Connected questions · Babel**
and choose **Show walking route**. Follow the terrace to the reading desk; the
guide's reading action appears only when close enough. After opening the actual
catalogue, closing it updates the route toward the real next passage. Check the
same guide in `?arrival=escher-depth` and the lower Faculty. The source HUD and
keyboard/controller movement keep their existing owners. At the real sea
overlook, make either prediction and inspect the before/after direction table.

For DOM-based QA, `#connected-journey` exposes `data-place`, `data-route` and
`data-route-points`; these contain only current public UI state. Stable buttons
are `#connected-journey-route` and `#connected-journey-action`.
