# The existing park pond as a living world window

This feature uses the existing **Central Question Fountain** at the heart of Ideas Park. Its raised center is replaced by the live view of the other face. The existing pool, pale outer rim, lower water and paper boats remain in their original positions. The feature adds no floor and changes no walking bounds.

The source geometry in `park.js` places the lower water cylinder at local Y 1.26, height 0.18, radius 11.1. The complete park now has logical parent `(−2200,.015,−430)` on the night face, at unchanged scale 0.65. Its logical water top is Y **0.8925** and its physical water top is **−96.8925**, centred at physical **X−40,Z365**, with radius **7.215**. The upper bowl's outer radius is 3.237 in world units. The existing floating paper boats remain on their original radius **4.29**, with their original animation.

`pond-world-window-model.js` exports `POND_SOURCE`, `POND_WORLD_WINDOW`, `pondDescriptor`, `pondToLower`, `lowerToPond`, `withinPondWindow` and `besidePond`. The legacy default descriptor retains the former upper-source entry for regression coverage. The installed night descriptor has ground entry `{x:-2200,z:-420.9,y:.13,yaw:0}` and an interaction radius of 14.95. It also supplies `face`, `destinationFace` and `physicalSource`, so logical tool coordinates and physical capture coordinates stay distinct. The descriptor's center is suitable for the host's map marker. The helper derives its geometry from the actual park transform supplied by `M.city.PARK`.

## Rendering the actual other face

`installPondWorldWindow(M, THREE, options)` creates one thin circular water mesh, at Y 0.8985, with radius 6.9225. Its center is open to the live view. It remains inside the existing lower water basin and below the animated halo. Its small separation and polygon offset avoid fighting the existing water. The shader's depth test preserves the paper boats above the water; the existing original lower water remains beneath the overlay. The new mesh is explicitly decorative and not walkable. It contributes no collision surface.

`pond-world-window-center.js` removes only the actual raised pedestal, bronze bowl rim, upper bowl water, gold sphere and jet particles. The park originally batches these static objects with scenery elsewhere in the park, so hiding the shared material mesh would hide unrelated scenery. Instead, the helper locates the four original fountain pick proxies, replaces only the three affected rendered geometry buffers with copies omitting their central triangles, and hides those four proxies and the jet Points. The exact local cut is radius ≤5.051 and Y ≥0.949; the basin and pale outer rim lie outside it. The animated halo remains. `api.fountainCenter.stats` reports the actual affected batches, triangles and hidden objects. All original geometries, materials, visibility and pick-layer masks are retained and restored by cleanup. Only the new replacement geometry copies are disposed.

The window is a live projective render of the **same scene's real upper face** from the relocated night park. It uses no photograph, duplicate city or recorded film. The installed destination is the upper approach at physical
`(0,0,−222)`. The physical source plane is derived by the existing lower half-turn. An 18× magnification and half-turn about X maps a camera above the night pond to a +Y-up camera above the daylight face. Position, angle and parallax follow both first-person and photo cameras. The legacy upper-to-lower descriptor and capture branch remain tested separately.

For the night-side capture, `worldCylinder.withUpperEnvironment` restores actual upper visibility from the main frame's culling ledger, hides the lower frame/lamps, restores the original daylight sun, background, fog and upper-sea fog uniforms, and restores every borrowed state in a finally block. Hidden original rooms keep their intended visibility. The portal is hidden while capturing and the recursion guard rejects nested captures. Legacy upper-side captures retain the original lower-root visibility rules.

The target is 384×384 by default, clamped to 256–512 by `options.resolution`. Capture is throttled to 100 ms by `options.interval`, runs only while the camera is above and within 125 units of the pond, and rejects a pond outside the camera frustum. The water's small shader distortion continues between captures. The module restores render target, active cube face and mip level, viewport, scissor, scissor test, clear color and alpha, auto-clear, XR and shadow auto-update state.

## Exact host integration

Install the night-park placement before its companions and tree-bed collection. After installing the world cylinder, install the pond module and include `pond-world-window.css`:

```js
import {installPondWorldWindow} from './pond-world-window.js';
installPondWorldWindow(M, THREE);
```

Immediately before the normal main scene render, after the host has prepared the physical camera:

```js
window.CITY_MAIN?.pondWorldWindow?.renderWindow(renderer, scene, camera);
renderer.render(scene, camera);
```

The same hook can precede a first-person photo render with its own camera. The hook must remain outside recursive renderer callbacks. No renderer monkey patch is required.

The installer sets `M.pondWorldWindow` and returns `{group,surface,target,camera,pond,portalMatrix,fountainCenter,renderWindow,lookThrough,dispose,frames,near,rendering}`. `renderWindow(renderer,scene,camera,{time,force})` returns whether it captured a new frame; `time` uses milliseconds. `lookThrough()` turns the visitor's existing look toward the water, preserving the visitor's position. `dispose()` safely removes only owned mesh resources, target and contextual UI, restores the original fountain geometry and visibility and its own city-update wrapper, and may be called twice.

The pond-side English context has two actions: **Look through the pond** and **Travel to the other face**. Travel calls the host's `M.worldCylinder.travelFromPond()`. The host owns the transition, optional later video and actual arrival on the opposite physical face. This module does not invent a film or alter any character, speech or private data. The travel action is disabled until that host method exists.

The host owns map integration and should mark both this pond and the through-gallery. `POND_WORLD_WINDOW` is re-exported by `pond-world-window.js`, while `M.pondWorldWindow.pond` reflects the installed park and opposite-face positions.

Run `node tests/pond-world-window.mjs`. It builds the actual source park, verifies that the four raised center objects and particles are gone from its real rendered batches, rays the preserved pale rim and lower water, restores every borrowed geometry and layer mask, and verifies no borrowed resource was disposed. It also checks source fountain dimensions, boat bounds, physical forward/inverse mapping, camera orientation, full center-disk geometry, contextual travel action, live lower-root visibility, recursion guard, throttling, complete state restoration after success and failure, and owned resource cleanup. The test renderer inspects the same scene and lower-frame object identities; a browser render remains the host integration check.

The complete park now moves to the permanently night face. Source people,620 trees/1240 crown instances, tools, seeds and all original boats retain their identities and local positions. The five lawn source offsets are frozen to their former site; they move rigidly with the same parent. The pond now looks back to daylight and its live crossing returns to the upper approach. See `NIGHT-IDEAS-PARK.md` and run `node tests/night-park.mjs` for the opposite-direction render, held-input walking, height gates, reverse travel and cleanup checks.
