# Leaving the Ramsey table after the complete recording

The six original actors now visibly stand and walk through the native house's
real front door after the existing two-part recording has completely ended.
This is original scene choreography. It changes no dialogue, cue, audio file,
cast identity, asset credit, Kokoro voice or saved setting.

`ramsey-conversation.js` exposes `completed` in its existing state and change
notification. Only the second audio track's actual `ended` event sets it true.
Sampling or seeking to600 seconds does not. Pause preserves a genuine ending;
seeking or replay clears it. All existing timing, volume, mute, caption and
two-track handoff behavior remains.

`ramsey-departure-model.js` owns visit-local blocking in native house coordinates.
Six starts are staggered by2.6 seconds. Each person rises over1.4 seconds, with
a small continuous inward movement while the real chair pulls back. The actor
then sidesteps the chair, follows the outside aisle around the actual hexagonal
table, passes between the front jambs at local Z−3.08 and keeps walking to
Z−6.2. The chair returns once its occupant clears it. Individual actors remain
visible for several seconds after crossing the door, then leave the scene.
The current sequence completes in about32 seconds and freezes its end clock.

The existing actors supply both poses and walking gait. During the rise,
`ramseyStandingPose` blends their original position/quaternion/scale and drape
states; the illustrated actors' alternative garments switch halfway through.
No actor or material is replaced. Reduced motion retains necessary continuous
travel while the original adapters suppress gait and decorative sway.

Routes reserve a.34m body radius, keep actors apart and use the native table,
lamp and bookcase geometry. `ramsey-native-house.js` now reads the actual chair
positions for collision, so the temporary movement has no stale chair collider.
The original seat descriptors and acquaintance-map geometry remain fixed.

The departure clock runs only while the visitor is inside the real room at its
ground height, the page is visible and no modal is open. Visibility events pause
audio immediately and clear the frame-clock origin. Manual Pause/Resume leaving
uses the existing conversation button after the audio ends; Restart and seeking
below the end immediately restore all six seated poses and chair positions.
After everyone exits, the button offers Replay conversation as before.
`ramseyRoom.departure` reports active/elapsed/paused/complete and all current
person poses independently of the finished recording's time/playing state.
No state is written to private storage.

Run `node tests/ramsey-departure.mjs`, `node tests/ramsey-room.mjs`,
`node tests/ramsey-city-presentation.mjs`, `node tests/character-scale.mjs` and
`node tests/city-discoveries-ui.mjs`. The focused test checks3736 full-body
table/chair/bookcase/lamp/door route points, mutual spacing, continuous positions,
visible progress outside, correct ending/reset/pause/mute/reduced-motion gates
and owned teardown. It loads the actual six procedural/rigged actors and checks
their visible deformed mesh vertices through the real jamb/header corridor with
their existing walking gait. Original tests continue to verify all46 complete
lines, fixed cast references, exact scripts and shared audio recordings.
