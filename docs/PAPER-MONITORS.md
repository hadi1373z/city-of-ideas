# Original first pages in the lower Mathematics hall

The 27 inward-facing frames are distributed across four connected reading floors
(6 foundations, 8 geometry/analysis, 6 computation, 7 probability/learning; see
PAPER-GALLERY.md). They show actual first-page image assets from the
curated Mathematics / Computer Science paper catalogue. The page is visible in
the 3D room at all times; reading it does not require opening a panel. The same
geometry is captured by the live pond window. There is no rotating selection,
generated substitute page, narration, account connection or private storage.

The pure lower-gallery builder supplies a stone pedestal for each slot and exposes
`lower.paperSlots`. The image installer owns the frames, pages, author/year
strips and reader dialog; it never disposes the gallery's geometry or materials.

## Slot and catalogue contract

Install after the world cylinder has created `M.worldCylinder.lower`:

```js
const monitors = installPaperMonitors(M, THREE, {papers});
```

The installer reads `M.worldCylinder.lower.paperSlots`, falling back to
`lower.group.userData.paperSlots` and then the identical pure model's slot
generator. Each slot uses ordinary lower-local +Y-up coordinates:

```js
{
  id: 'paper-slot-boole', // stable article binding
  paperId: 'boole',
  floor: 0, floorId: 'foundations', floorY: 0.13,
  angle: -0.45,
  x: Math.cos(-0.45) * 48,
  z: Math.sin(-0.45) * 48,
  y: 2.28,
  width: 2.8,
  height: 3.1
}
```

Each collection's arc is centred on its floor landing. At radius 48 m, adjacent
articles are separated by 0.18 radians; all 6–8 monitors are visible from the
approach without surrounding the entire ring. Pedestals sit 0.4 m inward from
their actual slot positions; conservative colliders sit 0.25 m inward. There
is no hardcoded stand radius that can detach from the frames. The actual western
doorway remains free. Pages use yaw `-angle-PI/2`, so their original front faces point inward.
The group is a child of the existing lower-gallery group, which already owns
the logical lower origin and proper physical half-turn. Never translate these
page meshes separately into world coordinates.

Provide exactly one paper per slot. A slot with `paperId` binds by stable catalogue ID independently of list order; a slot without it retains the legacy ordered-fixture contract. Required fields are
`id`, `title`, `author`, `year`, `imageUrl`, `sourceUrl`, `rights`, `why`.
`pdfUrl` is optional/null when only an archive viewer is available. The curated
records also retain `credit`, `scanNote`, `rightsUrl`, and any `format`/`fullLabel`.
`displayImageUrl` optionally supplies a smaller faithful adaptation for the 3D
texture; the modal reader always uses the full `imageUrl`. Fixtures or records
without a separate display image retain the original-image loader fallback.
The stable id uses lowercase letters, numbers and hyphens. `imageUrl` resolves
relative to the installer module; published local first-page assets are
preferred. The source/PDF URLs must be the actual original or repository links.
Keep the image asset, title, author/year, source citation and rights record
together when changing a selection. Do not replace missing documents with a
generated imitation or a title-only page and present it as the original.

Images load asynchronously without gating the city. Until an asset is ready,
its white placeholder explicitly says **Loading the original first page**.
An image error produces an explicit unavailable message with the paper's true
title. Successful images preserve their aspect ratio inside the frame. Their
unlit sRGB material keeps the printed page readable under the existing room
lighting. Replaced placeholder textures are disposed immediately and removed
from the owned set, avoiding retained high-resolution placeholder canvases.

`ready` resolves to one `ready` / `error` status per slot (or `disposed` if teardown
wins the race). `pages` exposes per-slot `paper`, `slot`, `page` and `status` for
QA. The public debug DOM dataset on `#world` includes `paperMonitorsReady`,
`paperMonitorsTotal` and `paperMonitorsErrors`; the native browser can confirm
that all 27 genuine images loaded without accessing application internals.

## Reading and navigation

Pages are city action targets with `userData.paperMonitor = paper.id`. Both the
target handler and the reader action require ordinary lower-face city mode,
feet at the slot’s `floorY` (within .30m) and distance at most 4.2m from that actual frame. Floors above and below cannot remotely activate the page.
An upper visitor looking through the pond cannot remotely activate a paper.
The nearby **Read first page** button follows the same gate. Opening a reader
clears movement; closing it, or travelling away, releases the reader cleanly.

The responsive dialog contains the original first-page image, 100/150/200%
zoom, the exact title/byline, the catalogue's explanation of why the paper
matters, exact attribution, original-edition/page-selection note, rights text,
a clickable reuse/license record, and original-work/source links. An archive
viewer or absent PDF uses the catalogue's honest label (or View original work),
rather than claiming to link a complete paper PDF. It uses the
existing modal keyboard/controller controls and retains the underlying 3D
scene. Zoom does not alter the source image or private notes.

`colliders` and `canStand(localX, localZ, feetY)` describe the frame and retained
pedestal footprint as conservative oriented boxes. Apply this additional guard
in both the lower outdoor navigation and the lower annular-gallery walker;
otherwise the separate gallery route could walk through a frame. The reading
aisle at r52 and the actual western doorway remain clear. These solids do not
cover the central well, gallery bridges or original source rooms.

## Ownership and checks

`dispose()` removes only its action targets, DOM and owned group, restores its
handlers only when still installed, and releases owned geometries/materials/
textures once. The group contains one frame batch and 54 page/caption draws.
The room textures are capped at 900 pixels on the long edge, so the expanded
collection uses fewer decoded texture pixels than the previous eleven full scans.
Late loader callbacks after teardown cannot reattach pages, change public
status, recreate fallback images, or dispose a texture twice. Outstanding ready
promises resolve on teardown rather than keeping the installer alive.

The pure lower-gallery disposer must dispose instance buffers only when their
geometry is in that builder's own resource set. This matters because the page
frame batch is attached beneath the gallery but remains owned by this installer.

`node tests/paper-monitors.mjs` checks all 27 slots, per-floor counts and western gap, aspect
ratios, actual inward page geometry under the proper lower transform, loading
and error pages, nonblocking image callbacks, lower-floor/proximity gates,
modal zoom and exact source/rights links, unchanged borrowed gallery resources,
immediate placeholder release, late-callback cleanup and no personal-storage
access. The fixtures use explicitly synthetic documents; the release must also
validate and visually inspect the curated real assets and all 27 loaded
page states before publication.

The release check imports `historic-papers-data.js` and validates all 27
actual bundled WebP headers, nonempty/resolution-bounded image bytes, distinct
assets and complete credit/edition/license records. It additionally hashes the
original eleven full-page files and their catalogue records, allowing only the
new compact-display URL. Their 1,745,902 original image bytes remain unchanged.
Reader links retain access to the source edition at its original available resolution.
