# Mathematics faculty opposite Zarathustra

`math-faculty-scene.js` builds a central open faculty rotunda around the existing
lower-gallery annulus, and an attached working west wing. Its group uses local
+Y coordinates. Position it at `(-2160,0,-65)` under the existing lower frame to
place the circular faculty directly opposite the Zarathustra Gallery.

The source Mathematics Institute cannot be centred in the well: its eight solid
24×18 floor slabs cover the centre and overlap the helical treads at radii
14.4–17.6. Its original interior instead occupies the agreed west wing, local
centre `(-80,0)`, logical origin `(-2240,-65)`. All eight four-metre floor levels,
the lift at local wing-relative `(9.6,5)`, the entry `(0,9.6)`, ground spawn
`(0,32.8)`, original atlas and all 24 concept IDs remain the actual source model.

The new rotunda reuses the existing forty columns at radius 57.8. An annular
timber and warm-metal roof rises from 7.65m eaves to an open radius-21.5 oculus at
11.8m. No new floor, column, dome cap or decoration fills the central well. An
exterior arcade, shallow stone arches and eight book-lined bays frame the
existing annular space. Every bay opens its corresponding original Atlas and
offers an explicit transfer to the real working floor; the rotunda does not
replace lessons with invented boards or inactive rooms.

A flush covered connector walks from `(-58,0)` through `(-64,0)`, `(-64,26)` and
`(-80,26)` to the native front entry `(-80,9.6)`. The first turn exits the genuine
western opening before continuing outside the circular facade. The route is
checked against the source ground-floor obstacles, including its existing plaza
sculptures. A restrained stone-and-timber west-wing facade follows the native
four-metre floor rhythm, retains the real entrance, and provides aligned windows
and a roof for the occupied source rooms.

## Integration

```js
const faculty = buildMathFaculty(THREE);
faculty.group.position.set(-2160, 0, -65);
worldCylinder.built.lowerFrame.add(faculty.group);
M.city.targets.push(...faculty.targets);
```

`faculty.targets` carry the existing `mathAction: 'atlas'` / `'floor'`,
`mathFloor`, `floorIndex` and `targetFloor` metadata. Delegate them to the current
Mathematics interaction handler. Source placement, floor transfers, maps and
navigation ownership remain with the main coordinator.

`faculty.canStand(localX,localZ,feetY)` and `faculty.colliders` cover only new
architecture. Apply these in addition to the existing lower-gallery and source
wing navigation, including when the existing annular-floor navigator owns the
visitor. The circular facade has a real western opening. The source wing itself
continues using its authoritative original collision model.

Optional `faculty.nativeShellNodes(mathModels)` returns only source meshes
explicitly marked `userData.window === true` or `userData.roof === true`.
These can be hidden while the new visual shell is installed. It never selects
source floors, partitions, furniture, action nodes or mixed instance batches.
The coordinator should save and restore those original visibility values when
disposing. The new builder itself does not mutate any source model.

Call `faculty.dispose()` and remove its targets on cleanup. Geometry, materials
and textures are owned by the new group. No notes, private saves, voices,
recordings or canonical source assets are changed.

Run `node tests/math-faculty.mjs` to verify the real oculus/doorway gaps, roof,
source-compatible connector, original concept inventory, eight floor actions,
safe shell selection, lower-world placement, finite batched geometry and cleanup.
