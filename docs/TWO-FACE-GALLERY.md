# Central gallery through the island

The central shaft continues the last Babel terrace into the island's thickness. The island is 96 units thick. The handoff between the two gravity frames is the plane at physical Y = −48. This module does not move the player between frames or install itself in Babel; the host controller owns those transitions.

`src/two-face-gallery-model.js` is the geometry authority. `UPPER` and `LOWER` share a radius of 16, a width of 3.2, three complete turns and 240 real stone treads each. Their walkable radial interval is 14.455–17.545, leaving a small inset inside the geometry at 14.4–17.6 and its rails. The upper route runs from Y = −24 to −48. The lower route uses **local +Y-up coordinates** and runs from Y = 0.13 to −48. At each tread boundary the height changes by one rise; `heightAt` returns the actual flat tread height. The final endpoint belongs to the middle platform. Passing `{continuous:true}` to `heightAt` or `pointAt` returns the underlying helical profile for inspection only.

## Scene contract

`buildTwoFaceGallery(THREE, {side:'upper'|'lower', lights:true})` returns `{group, walking, lamps, side, descriptor, contract, counts, dispose}`. It requires the project's existing Three.js namespace and no canvas, network service or asset. Each side has 240 real annular treads, 13 brass arches, 13 luminous globes and four shaft lights. The lower side adds one light over its annular room. `counts` also reports the actual walking and draw mesh counts. Geometry and joinery are batched. `walking` contains only real floor, tread, bridge and platform meshes, allowing a downward ray to inspect the same heights used by navigation. Decorative rails, shell, arches and artwork remain in `group`. The lower face is an annular stone room with concentric brass inlays, relief constellations and seating at the outer wall; there are no placeholder sign boards.

The upper group remains at (0, 0, 0). The lower group is built around local (0, 0) and must be placed into the host's inverted lower frame. The project currently uses virtual old coordinates (−2160, −65), with physical mapping `X=logicalX+2160; Y=-96-logicalY; Z=-logicalZ-65`. Do not bake that translation or half-turn into individual gallery meshes. Both middle decks are the same symmetric rectangle so they coincide after the host's frame change.

`dispose()` detaches the group and disposes only its own geometry, materials and instanced meshes. It is safe to call twice. `lamps.visible` may be set independently by the host.

## Connections and exact host cuts

| Connection | Local bounds | Height |
| --- | --- | --- |
| Babel to upper stair | X 9–18, Z ±1.8 | −24 |
| Upper second-turn tunnel spur | X 15.7–22, Z ±2 | −40 |
| Middle handoff platform, both sides | X 12.8–20.8, Z ±3.2 | −48 |
| Lower face bridge | X 16–20, Z ±1.8 | 0.13 |
| Lower face annular room | Radius 19–58 | 0.13 |
| Lower western walkout | X −64 to −56, Z ±2.5 | 0.13 |

The tunnel spur meets the host tunnel at `(22,-40,0)`. Its landing is on unwrapped angle `4π`. The main stair ends at `(16,-48,0)` with unwrapped angle `6π`. The lower walkout meets the host land at `(-64,.13,0)`. Deck rails have genuine gaps at tangential stair mouths, and the western doorway is physically open.

The host relinquishes gallery ownership in the walkout's shared exterior area
before its finite edge. Both automatic capture sites use that same handoff rule,
allowing a visitor to continue west and turn onto the covered connector under
ordinary lower-ground collision checks. Returning through the overlap captures
the gallery again at its interior side. Tests must continue beyond the deck's
X and Z bounds and return; reaching the first handoff frame alone is insufficient.

The host must cut the **last Babel terrace's bookshelf bays beside angle zero**. On the current 30-bay shelf at radius 13, skipping bays with `abs(atan2(sin(a),cos(a))) < 3/13` removes the two bays centered near ±0.105 radians. This opens the bridge corridor through their full depth. Preserve the last terrace floor; it meets the bridge over X 9–13.4. Any Babel inner or outer rail intersecting this corridor must have the same gap.

The old Babel pit floor at Y = −26.5 requires a real annular hole with inner radius 14 and outer radius 18. Keep both the central disk and the outer floor; neither may contain triangles spanning the hole. The host must also exclude the central shaft and the tunnel's envelope from the island's thickness filler. The gallery's shell is at radius 21.2, with an open positive-X slot wide enough for the 4-unit tunnel spur. Do not insert a foundation face or disk through either spiral or its middle landing.

## Navigation contract

`pointAt(theta, side, {radius, continuous})` returns `{x,y,z,theta}`. `headingAt(theta,side)` returns the normalized 3D tangent for increasing angle and a `yaw` using the city's forward convention `(-sin(yaw),-cos(yaw))`.

`nearestTheta(x,z,side,{feetY,lastTheta,maxThetaDelta,feetTolerance})` returns an unwrapped angle or `null`. A finite **feet height is mandatory**. Candidates must be inside the walkable radius, within 0.43 units of the actual tread, and within 0.34 radians of `lastTheta` when supplied. Thus coincident plan coordinates on other turns cannot capture a visitor. `surfaceAt(x,z,feetY,{side,lastTheta,layer})` adds the actual bridges, spur, middle, floor and west walkout. It returns `{side,layer,kind,theta,y}` or `null`. Layers are `spiral`, `top`, `spur`, `mid`, `floor` and `walkout`. Endpoint layers can acquire only the nearby end of the spiral; a middle platform cannot acquire a first-turn tread.

`walkGallery(player,dx,dz,{side,eye:1.8,lastTheta,layer})` mutates the player's `x`, `y`, `z`, `galleryTheta`, `galleryLayer` and `gallerySide`. It returns `{moved,blocked,side,theta,layer,surface,feetY}`. Movement is subdivided into at most 0.12-unit pieces; a rejected edge retains the last supported position. An invalid initial surface is rejected without moving or snapping. `eye` is the player's eye-to-feet distance and must match the host. `side`, `lastTheta` and `layer` default to the player's saved gallery fields. Reversing movement simply reverses the unwrapped angle; there is no one-way gate.

The host explicitly chooses when to transfer between Babel, the upper stair, the tunnel and the lower face. It should initialize `galleryTheta` and `galleryLayer` at the matching endpoint, use the returned layer, and preserve those fields while walking. Gravity changes belong only on the broad coincident middle platforms. The model never flips gravity, teleports to a floor or infers the side from an overlapping X/Z position.

Run `node tests/two-face-gallery.mjs`. It checks both routes in both directions at the center and both walkable edges, real ray/tread agreement on every tread, heading orientation, feet and layer rejection, the upper bridge and spur, the safe middle, the lower annulus and west door, batching limits and resource cleanup.
