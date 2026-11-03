CITY OF IDEAS - CONTINUOUS RAMSEY HOUSE / LOCAL VOICES / 08

Walk into Ramsey House in the city with the same camera and controls. E / A
starts or pauses the conversation. Leaving pauses; returning allows resume.
The standalone film and character studio remain available separately.
Room geometry is shared through ../ramsey-room-scene.js. Nietzsche and
Zarathustra retain their restored illustrated appearances.

VOICE CAST - 2026-11-03
All 46 English dialogue turns now use local Kokoro-82M v1.0 synthesis.
No paid account, network speech service or browser voice is needed to play them.
Anonymous: am_michael. Ramsey: bm_lewis. Turing: bm_daniel.
Socrates: bm_george. Nietzsche: am_fenrir. Zarathustra: bm_fable.
These are fictional character performances, not historical voice recreations.
Each character uses one fixed voice in both halves. Socrates uses bm_george
in the English desk-book introduction too. Other language introductions retain
their existing localized recordings; the Ramsey conversation is English.

assets/voice-cast.json records every voice ID, language, speed, exact submitted
text, individual cue duration/hash, model and voice-bank hashes, runtime version,
reference excerpts and both final recording hashes. All lines fit their existing
slots without truncation, speeding or pitch shifting. The recordings are the same
in the city, index.html and film.html. Device-voice substitution is disabled.
Waveforms and durations were checked automatically. Aesthetic listening review
by the user remains necessary. Listen to the six-character preview to judge fit.

REGENERATE
Install kokoro-onnx in a local Python environment. Download kokoro-v1.0.onnx
and voices-v1.0.bin from the runtime project's model-files-v1.1 release.
Run tools/render-ramsey-voices.py --model-dir PATH --output CLIPS from the repo.
Then run tools/assemble-ramsey-voices.py --clips CLIPS. FFmpeg must be available.
The model is about 325 MB and the voice bank about 28 MB; neither is shipped
to website visitors. The website receives only the finished audio recordings.
https://github.com/thewh1teagle/kokoro-onnx (runtime: MIT)
https://huggingface.co/hexgrad/Kokoro-82M (model: Apache-2.0)
https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md

MODEL AND SCENE PROVENANCE
Original scene: city-of-ideas-ramsey-render-error-fixed.html from the user's files.
Turing/Ramsey anatomical base: MakeHuman CC0 core assets and sculpting targets.
https://www.makehumancommunity.org/about/license.html
Three.js and GLTFLoader: MIT; vendor/THREE-LICENSE.txt.
Anonymous, Ramsey and Turing retain their rigged GLB models. Socrates, Nietzsche
and Zarathustra retain the original procedural illustrated character definitions
in assets/legacy-actors.js; their downloadable pose GLBs are not skin rigs.
The original audio and partial HeyGen recordings remain in local development
backups and repository history. The current release uses the complete Kokoro cast.

CHARACTER REFINEMENT - 2026-11-03
Nietzsche has a fitted scalp, smaller recessed eyes, closer wire glasses and
cleaner moustache contours. Anonymous has a shorter mask nose and the raised
grey nose-contour strips are removed. Ramsey and Turing have smoothed nape
surfaces and gradually blended neck skin weights. All six seated characters
have relaxed open hands, with the rigged forearms lowered toward the table.
The GLB downloads and embedded assets match the room geometry. All six pass
Khronos glTF validation with zero errors and zero warnings. The studio includes
a rear-view control to inspect neck shape. Voices and recordings are unchanged.
