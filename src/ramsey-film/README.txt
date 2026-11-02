CITY OF IDEAS - RESTORED ILLUSTRATED CAST / 04

Socrates, Nietzsche and Zarathustra use their earlier illustrated appearances.
The replacement faces, hair shells, beards and tubular garments from edition 03
were rejected and are no longer active. Anonymous, Ramsey and Turing keep their
edition 03 GLBs unchanged. The table, scene, interactions and film are retained.

Open index.html for gameplay, film.html for the paused interactive film, or
studio.html to compare front, three-quarter and side views of all six figures.

DOWNLOADS
assets/turing.glb, ramsey.glb and anonymous.glb retain weighted skeletons,
standing / seated clips, and their existing materials. Turing and Ramsey have
facial morphs; Anonymous keeps its rigid mask and hood.
assets/socrates.glb, nietzsche.glb and zarathustra.glb contain the restored
illustrated geometry, with two baked pose groups and standing / seated clips.
These three downloads have NO skin rig or facial morphs. Gameplay and studio
use the original procedural character definitions for gestures and blinking;
those definitions are supplied in assets/legacy-actors.js.
The pose downloads use approximate glTF PBR versions of the original toon
materials; their shapes match the illustrated characters. They are restoration
assets, not new production character sculpts. See mesh-report.json for details.
All assets use metres, Y up, facing -Z.

QUALITY AND CHECKS
All six GLB files pass Khronos validation. Actual Three.js scene logic checks
cover original character restoration, all six cast slots, Play/Pause, user audio
gesture, 32 film camera shots, proof diagrams and studio controls.
Previews are offline renders of actual geometry with approximate lighting,
not browser screenshots. Current browser playback was not rechecked because
browser preview was unavailable. Mobile performance, file-URL launching and
external retargeting remain unverified. Cinematic references were inaccessible.

PROVENANCE
Original scene: city-of-ideas-ramsey-render-error-fixed.html from the user's files.
Turing/Ramsey anatomical base: MakeHuman CC0 core assets and sculpting targets.
https://www.makehumancommunity.org/about/license.html
https://github.com/makehumancommunity/makehuman/tree/master/makehuman/data
Three.js r160, GLTFLoader, GLTFExporter: MIT; vendor/THREE-LICENSE.txt.
The original scene and audio retain their original provenance and ownership.

Edition 07 - 2026-11-02
Ramsey House is now a native part of the city scene, with the same player,
camera and walking controls on both sides of its doorway. The table, six
characters, walls, roof and window are real city geometry. No iframe or scene
switch is used when entering. The conversation starts with E / A or the room
button, pauses when you leave, and can resume from that point on returning.
The standalone film and studio remain available separately. Shared room
geometry lives in ../ramsey-room-scene.js. The city streams the original two
recordings from assets/conversation-1.mp3 and conversation-2.mp3, using the
audio clock for captions and speaking gestures. No voice recording changed.
Nietzsche and Zarathustra retain their restored illustrated models.

VOICE CONTINUITY RECORD - 2026-11-02
assets/voice-cast.json is the permanent cast record. It preserves reference
recording hashes, exact cue times, transcripts and stable character voice keys.
The original provider, model and voice IDs are UNKNOWN. Do not infer them.
When replacing speech, record the actual provider, model, voice ID and all
settings in that file. Use the same cast across both recordings and city scenes.
The first five minutes are approved; the second-half mismatch is NOT FIXED.
Socrates, Nietzsche and Zarathustra have no spoken reference in the first half.
Their first later appearances are recorded as unconfirmed references only.
The city and both standalone players now use the same external MP3 files.
A failed recording must not silently switch to a generic browser voice.
