# Opening the city without a silent wait

The default entrance is still Babel's volcanic reservoir. Explicit arrival links
and the optional desk-book start keep their existing routes. This work changes
startup dependencies and feedback, not destinations, saved notes or voices.

## Observed loading structure

Before editing, a public visit could render the old base island while the header
remained hidden by `cinematic-pending`. There was no visible explanation between
the early Three.js loading screen and completion of `city-integration.js`.

A local traversal of relative static imports in the baseline integration graph
(commit `352a230`)
counted **125 modules / 1,467,653 JavaScript bytes** before its entry code can
execute. This is a source dependency measurement, not a browser timing result.
Once the principal scene is available, `sourceFactories()` dynamically requests
eleven source entries. Five were absent from that first static graph:

- `math-city-scene.js`
- `makers-city-scene.js`
- `dali-house-scene.js`
- `artist-city-editions.js`
- `neighborhood.js`

Head `modulepreload` links for the integration entry and these five source
entries start their requests earlier and allow the browser's module cache to
deduplicate shared dependencies. They do not download the complete hidden
House tool application or change its authentication and restoration behavior.

## Feedback ownership

`startup-progress.js` is a small classic script. Load its CSS in the head and
execute it immediately after `#loading` in the body, before the main scene and
module graph. It installs `window.CITY_STARTUP`:

```js
CITY_STARTUP.stage('source-modules');
CITY_STARTUP.stage('mathematics');
CITY_STARTUP.stage('studios');
CITY_STARTUP.stage('connected');
CITY_STARTUP.stage('entrance');
CITY_STARTUP.ready();
```

`createExtraDistricts` reports its four real milestones through the optional
`onProgress(stage)` callback. The principal coordinator calls `ready()` only
after all installers and the chosen/default arrival have completed. Its catch
path calls `fail()`. A critical gallery/integration script load failure also
shows the fixed failure state. A failed individual painting does not.

The panel uses no percentage or invented progress. A twelve-second timer only
reveals a slow-connection explanation and a manual reload action. Stage changes
are announced politely; reduced-motion visitors receive a stationary indicator.
The panel removes itself after readiness, clears its timer/listeners, and
restores its owned `aria-busy` state on teardown. It reads no personal storage,
backend credentials, private text or account information.

## Non-blocking original painting loads

The initial empty city network has no approved artist editions, so Dalí image
prefetches were **not** the fresh-default loading bottleneck. They did block
restoring an approved Dalí edition: four sequential fetch → blob → object-URL
operations had to finish before any replacement city layer could become ready.
One unavailable painting could reject the entire restoration.

The adapter now supplies the same four original `DALI_ARTIST.works` records and
bundled `./dali-house/*.jpg` paths directly to the source edition factory. Its
existing texture loader resolves those paths, displays the real images on
completion, preserves aspect ratios and credits, and marks an individual image
unavailable on failure. There is no substitute artwork, synchronous image gate,
duplicate fetch/blob copy or new asset. No private source record is rewritten.

The source integration test verifies **zero upfront painting-byte fetches** for
both fresh startup and a restored Dalí edition, all four original image paths
still requested, all twenty-four math concepts, 128 math actions, original
navigation, original artist lots and preserved synthetic private homes.

Run `node tests/startup-progress.cjs` and `node tests/extra-districts.mjs` for
the focused checks. Browser startup timing depends on cache, network and device;
do not present dependency counts as a guaranteed loading duration.
