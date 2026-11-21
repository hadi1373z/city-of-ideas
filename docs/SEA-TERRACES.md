# Sea Terraces

The user's sixth coastal-hexagon vignette becomes a small, original daytime
terrace district in the outer part of hex(3,-3). The source Listening Court
already occupies that cell; it is retained, rather than described as an empty
site or replaced. This addition occupies only local u[-34,34],v[22,47] from
the shared cell centre(239.023011444505,-414). u is tangential(.8660254,.5),
and v points toward the sea(.5,-.8660254). All corners are within radius528m,
inside the existing shore promenade's533m inner edge and the552m lawn.

## Shared plan and walking

`src/sea-terraces-model.js` owns the visible footprint, all roof and obstacle
polygons, arrival, supported local paths and exact triangulated floor authority.
The three broad courts have original absolute feet heights.13,.37 and.61m.
A six-metre-wide central route uses six-metre-long gentle ramps atv23..29
andv32..38. Both ten-metre-wide side returns also descend laterally to.13m
at u+/-34. Root connects the retained Listening Court/street and shore loop to
these real ground-level edges; the district does not create an ocean platform.

The central guide ends atv44.5, before the local bronze guard atv46.6. The
guard protects only the raised central48m lip. Open side returns and the
independently owned continuous shoreline promenade remain outside it. No
enclosing district wall is added. The source Listening Court's radius17m,
original content, street anchor and existing north spur remain unchanged.

`seaTerraceFloorAt(x,z)` returns null outside actual stone, and the exact
rendered triangle height inside. `seaTerraceCanStand(x,z,feet,{radius,maxStep})`
is permissive outside and rejects new abrupt tier crossings over10cm inside.
The integration must also reject stepping straight OFF a raised edge onto
ordinary ground unless the new feet height is within this same allowance.
Keep the original global movement controller and use its existing extra-ground
and collision hooks; no new stair controller or teleport is needed.

`SEA_TERRACE_OBSTACLES` reserves the real pergola posts, benches, six low
planters, three open sea-view frames and the local front guard. Each obstacle
also exposes its world polygon for maps and the shared collision/planting plan.
Roof footprints are distinct from the walkable floor footprint. The public
arrival looks through the terraces toward the sea, with feet at.13m.

## Architecture and resource ownership

`buildSeaTerraces(T)` returns group,terrain,targets,worldPlan,floorAt and
idempotent dispose. The complete addition uses original sealed stone floor and
ramp patches, restrained actual paving joints, two slatted timber pergolas,
six slatted benches, three open stone view frames, low planted stone troughs
and the limited raised-edge guard. It adds no tree, artwork, voice, quotation,
light, overlay, account connection or private-data write. Existing trees are
not cleared or moved. The overhead upper sun and daytime culling remain root-owned.

Each stone patch has an opaque bottom and closed sides; a low camera cannot
see green ribbons through the tier faces. Every visible floor triangle uses
the same diagonal and interpolation as its model. Geometry is batched into
ten mesh draws plus one fine-joint LineSegments draw, approximately14888
mesh triangles. Materials/geometries/instance resources belong to this builder
and are released once. No borrowed source material or forest is disposed.

## Verification

Run `node tests/sea-terraces.mjs`. The focused check includes1800 rays against
actual floor triangles;2828 reversible centre-ramp, upper-crosswalk and side
ground-return steps;4536 actual mesh shoulder/head rays including the pergola
aisles; two opaque low-side tier-face probes; every physical obstacle;
finite transformed bounds; both side exits; Listening Court/ocean/promenade
reserves; and idempotent resource disposal. It builds the actual source campus,
accepted street forest and complete coast forest in order, then reads all573
mounted source tree sites. Every retained trunk clears the new pad and each
full seven-metre crown reserve clears the pergola roofs.

`sea-terraces-access.js` builds supporting stone along the clockwise20.5m
Listening Court approach and both shore links. `sea-terraces.js` installs the
original native movement/extra-ground hooks, current-feet collision handling,
localized region/arrival and owned cleanup. It mounts under the existing coast
root so normal upper/lower culling applies. `?arrival=sea-terraces`, the city map
and its extra destinations reach the same real entrance. The EN/DE/FA plans
include actual floor/roof footprints and paths. Only the chosen cell's six
perimeter wall segments are removed; all151 prior generated roads are exact.

`tests/sea-terraces-integration.mjs` drives the actual gallery.js ground/mover
functions through3372 held-input steps,3372 real supporting-floor probes and
20232 actual body/head rays. It combines the source city, Listening Court,
coast and new installed controller, testing both ramp directions, both ends,
both shore connections, forbidden raised lips/grass exits and reversible hooks.
Browser checks also walked the two central ramps and a side return to the
unchanged.13m coast. `design/visual-walk/sea-terraces-built-overview.jpg` shows
the assembled geometry from an elevated review camera, not a proposed sketch.
