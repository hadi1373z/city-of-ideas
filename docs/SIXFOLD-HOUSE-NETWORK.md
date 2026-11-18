# Six Houses of Transformations: navigation and ownership

The complete eight-floor source house remains centred at source (125,0). Six
rigid instances occupy the six immediate honeycomb neighbours at radius
159.3486742963367 m. Their stable IDs, positions, source frames, names and finish
codes are defined in `sixfold-house-network-model.js`, rather than repeated in
scene, map and controller code.

| ID | Plan angle | Centre X, Z | Finish |
| --- | --- | --- | --- |
| east | 0° | 159.3486743, 0 | Penrose |
| southeast | 60° | 79.6743371, 138 | Hexagonal |
| southwest | 120° | -79.6743371, 138 | Triangular |
| west | 180° | -159.3486743, 0 | Square |
| northwest | 240° | -79.6743371, -138 | Octagon and square |
| northeast | 300° | 79.6743371, -138 | Trihexagonal |

The Three.js turn is the negative plan angle. `houseToWorld` and `houseToSource`
transform positions and yaw together; their Y coordinate and the source stair's
theta are unchanged. Each front (+Z) doorway is tangential to the ring, and each
west basement doorway points radially inward. `sixfoldWellHoles()` supplies the
six actual circular shaft cuts. The previous single-house geometry builder is
retained for source-architecture checks; it is not an extra live seventh house.

## One supported basement circuit

The six source west corridors meet a closed regular hexagonal loop at radius
106.3486742963367 m, exactly 53 m inward from each house centre. Walking feet are
Y -40. The physical passages are 4 m wide; the walking centre is restricted to
1.72 m from their axes. Floor thickness is .24 m and the ceiling underside is
Y -35.2, leaving 4.8 m clear headroom. The radial physical spur ends at source
X 102+2/√3, where the real doorway and annular room slab overlap. The navigation
join continues to source X104 inside that supported floor.

`NETWORK_PASSAGES` defines the six loop edges, six radial spurs and east branch.
The physical shell combines these segments with the existing Gallery/Escher
passage into one union. The source copies omit their original corridor meshes,
so overlapping shells do not seal a junction. Square 2 m end caps contain the
model's rounded walking caps at bends. Existing central earth and the protected
through-gallery remain separate owners.

The loop intersects the existing north/south passage at precisely
(70,62.957750669028066). This crossing has a real shared floor and open walls.
The network model owns a short sleeve on that existing passage; the original
world controller still owns ordinary north/south travel beyond it.

## Controller handoffs

`M.transformationHouse` remains one coordinator for all six buildings and the
network. `gallery.js` can retain its existing movement priority, camera easing
lookup and E/A interaction chain. `world-cylinder.js` can retain one aggregate
`built.group` for culling and underground lighting. Installing six independent
legacy controllers would give them conflicting capture, state and disposal
ownership; this implementation does not do that.

The shared model owns both release and capture exclusions:

- On the east branch, the network releases below X71.1. The gallery enters the
  network above X71.25 within the shared supported width. The explicit overlap
  leaves no gap, and the just-released part cannot recapture on the next frame.
- At the crossing, straight north/south travel at X70 remains gallery-owned.
  A gallery visitor stepping sideways beyond |X-70|1.2 can enter the network
  where its floor exists. A network visitor turning into the legacy passage
  releases at |Z-crossingZ|>3.6 while |X-70|<1.72. That same released sleeve is
  excluded from inactive capture.
- A ground-floor porch releases beyond source Z23.25; inactive house capture
  requires source Z≤23.1. The visible floor continues beyond both boundaries.
- `worldCylinder.route` prevents an inactive network controller from capturing
  the visitor while the gallery already owns their supported movement.

`shouldEnterFromGallery({x,z,y})`, `galleryHandoff({x,z,y})` and
`enterFromPassage({x,z,y,...})` take a **feet-height** world pose, Y -40 at these
joins. They do not take the eye-height player Y. World-cylinder must release its
route before calling `enterFromPassage`; the coordinator releases before calling
`worldCylinder.enterFromHouse`. No handoff teleports to another house or skips a
flight. `walkSixfoldNetwork` follows the original supported tread profile, rooms
and passages in short collision-checked substeps.

## Independent state and shared resources

Each house has independent temporary `shelfOpen`, pendulum `ratio`, `lastTheta`
and registered obstacle records. Only its own moving handle enables its shelf
control, and only its own nearby pendulums enable ratio changes. Room actions
require an actual annular floor or radial landing. Passing a room's Y while on a
stair does not make the visitor enter that room. Stale controls recheck the house,
floor, proximity, mode and pause state. No private storage is accessed.

The combined scene factory owns one immutable structural prototype, per-instance
moving nodes and lamps, shared static geometry/materials and separately owned
finish buffers. `ensureInterior()` makes the needed finish available on entry.
The aggregate scene update handles detail visibility near the visitor; only the
current physical house's lamps are enabled. Shared geometry is released once by
its owner after the clones have been detached; clone instance buffers and local
finish resources have their own lifetimes. The coordinator removes its aggregate
root and targets and restores applicable city wrappers on disposal.

## Public integration hooks

The original `step`, `visit`, `stop`, `openRoom`, `interact`, `enterFromPassage`,
`active`, `cameraY`, `shelfOpen` and `built` API remains. `visit()` defaults to the
east house. New helpers include:

- `visit(id)` and `enterHouse(id, sourcePose)` for explicit named destinations.
- `currentHouseId`, `roomAtPlayer()`, `sourcePlayer(id)` and `nearInteraction()`
  for physical content gates, and `stateFor(id)` for temporary public state.
- `registerRoomReader(id, fn)` to add source-bound teaching content inside the
  shared reader. The callback receives `{house,room,source,dialog,el,button,api}`.
- `registerRoomObstacle(id,{x,z,y,radius})`, or `{x,z,y,w,d}`, for real furniture
  added by a collection. Coordinates are source-local (including source X125).
  It returns a release function for scoped cleanup. For example, the migrated
  collection table at (109,8,0) uses radius3.65 and leaves the r12 circulation
  band open.

`startExtra('transformations')` visits the east house, and
`startExtra('transformations:'+id)` visits one of the other named entries.
Collection migration and tiling authoring have their own modules; they do not
change the original floor/stair model or any private residence coordinates.

## Verification

`tests/sixfold-house-network.mjs` checks exact sixfold centres, rigid pose/yaw
round trips, 48 real rooms, all448 supported treads in both directions for every
house, independent secret paths, every loop/spur in both directions, shell and
porch gates, real crossing coordinates and identical release/capture exclusions.

`tests/transformation-house-runtime.mjs` extends the original runtime regression
to all six source frames. It preserves held-input door exits, immediate tread
physics with camera-only smoothing, actual landing gates, nearby moving handles,
pendulum controls and clear original furniture circulation. It additionally
checks per-house state/lamps, stale cross-house controls, registered collection
obstacles, paused reading, the complete reverse circuit, all three legacy exit
directions, wrapper cleanup and zero private-data access. Actual scene floor,
roof, doorway and union-junction rays are checked by the physical scene suite.
