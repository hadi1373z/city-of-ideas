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
Upper floors lead to their actual lift. **Take the lift to ground floor** is
offered only near that floor's real lift anchor, at the matching floor height,
and delegates the original source floor action. It never moves a visitor
automatically or treats a window as an exit. The guide uses the current source
model, original transform and live collision callback from `CITY_EXTRAS`; a
missing model or a height between source floors supplies no invented route.

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
