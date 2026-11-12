# The existing park pond as a living world window

This feature uses the existing **Central Question Fountain** at the heart of Ideas Park. Its raised center is replaced by the live view of the other face. The existing pool, pale outer rim, lower water and paper boats remain in their original positions. The feature adds no floor and changes no walking bounds.

The source geometry in `park.js` places the lower water cylinder at local Y 1.26, height 0.18, radius 11.1. `city.js` places that park at `(0,.015,-330)` with scale 0.65. Therefore its actual water top is Y **0.8925**, centered at **X 0, Z −330**, with radius **7.215**. The upper bowl's outer radius is 3.237 in world units. The existing floating paper boats remain on their original radius **4.29**, with their original animation.

`pond-world-window-model.js` exports `POND_SOURCE`, `POND_WORLD_WINDOW`, `pondDescriptor`, `pondToLower`, `lowerToPond`, `withinPondWindow` and `besidePond`. The default descriptor includes a safe ground entry at `{x:0,z:-320.9,y:.13,yaw:0}` and an interaction radius of 14.95. The descriptor's center is suitable for the host's map marker. The helper derives its geometry from the actual park transform supplied by `M.city.PARK`.

## Rendering the actual other face

`installPondWorldWindow(M, THREE, options)` creates one thin circular water mesh, at Y 0.8985, with radius 6.9225. Its center is open to the live view. It remains inside the existing lower water basin and below the animated halo. Its small separation and polygon offset avoid fighting the existing water. The shader's depth test preserves the paper boats above the water; the existing original lower water remains beneath the overlay. The new mesh is explicitly decorative and not walkable. It contributes no collision surface.

`pond-world-window-center.js` removes only the actual raised pedestal, bronze bowl rim, upper bowl water, gold sphere and jet particles. The park originally batches these static objects with scenery elsewhere in the park, so hiding the shared material mesh would hide unrelated scenery. Instead, the helper locates the four original fountain pick proxies, replaces only the three affected rendered geometry buffers with copies omitting their central triangles, and hides those four proxies and the jet Points. The exact local cut is radius ≤5.051 and Y ≥0.949; the basin and pale outer rim lie outside it. The animated halo remains. `api.fountainCenter.stats` reports the actual affected batches, triangles and hidden objects. All original geometries, materials, visibility and pick-layer masks are retained and restored by cleanup. Only the new replacement geometry copies are disposed.

The window is a live projective render of the **same scene's actual lower frame**. There is no photograph, pre-rendered image, duplicated city, video asset or second invented world. The default destination is the existing lower garden center at physical `(-200,-96,0)`, derived from `M.city.GRAVEYARD` through the existing `lowerPhysical` model. The source camera is mapped through the pond with an 18× magnification and a half turn about X, so a camera above the pond becomes a camera beneath the lower face with up `(0,-1,0)`. Its position, angle and natural parallax follow the current main camera.

During capture, the renderer sees the real `M.worldCylinder.built.lowerFrame` and its lower daylight. The module temporarily shows only lower roots named `Ramsey House…` or `Return door…`, since those source modules hide their whole buildings while the player is on the upper face. It preserves every other lower root's source visibility, including unselected mathematical floors and the obsolete independent graveyard ground. All visibility is restored after the pass, including when rendering throws. The portal itself is hidden during capture and a separate recursion guard rejects nested capture calls.

The target is 384×384 by default, clamped to 256–512 by `options.resolution`. Capture is throttled to 100 ms by `options.interval`, runs only while the camera is above and within 125 units of the pond, and rejects a pond outside the camera frustum. The water's small shader distortion continues between captures. The module restores render target, active cube face and mip level, viewport, scissor, scissor test, clear color and alpha, auto-clear, XR and shadow auto-update state.

## Exact host integration

After installing the world cylinder, install the pond module and include `pond-world-window.css`:

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

The pond-side English context has two actions: **Look through the pond** and **Travel to the other face**. Travel calls the host's `M.worldCylinder.travelFromPond()`. The host owns the transition, optional later video and actual arrival in the Edge universe. This module does not invent a film or alter any character, speech or private data. The travel action is disabled until that host method exists.

The host owns map integration and should mark both this pond and the through-gallery. `POND_WORLD_WINDOW` is re-exported by `pond-world-window.js`, while `M.pondWorldWindow.pond` reflects the installed park and lower-world positions.

Run `node tests/pond-world-window.mjs`. It builds the actual source park, verifies that the four raised center objects and particles are gone from its real rendered batches, rays the preserved pale rim and lower water, restores every borrowed geometry and layer mask, and verifies no borrowed resource was disposed. It also checks source fountain dimensions, boat bounds, physical forward/inverse mapping, camera orientation, full center-disk geometry, contextual travel action, live lower-root visibility, recursion guard, throttling, complete state restoration after success and failure, and owned resource cleanup. The test renderer inspects the same scene and lower-frame object identities; a browser render remains the host integration check.
