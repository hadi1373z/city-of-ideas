CITY OF IDEAS - CONTINUOUS RAMSEY HOUSE / LOCAL VOICES / SUITS / 10

Walk into Ramsey House in the city with the same camera and controls. E / A
starts or pauses the conversation. Leaving pauses; returning allows resume.
The standalone film and character studio remain available separately.
Room geometry is shared through ../ramsey-room-scene.js. Nietzsche uses the
supplied textured portrait; Zarathustra and Socrates retain their illustrated actors.

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

NIETZSCHE OPTION A CONSTRUCTION STUDY - 2026-11-03
prototypes/nietzsche-a.html is a separate static bust study with orbit, zoom,
front/profile/back, face detail and wireframe controls. It is an early geometric
study, not a finished likeness or an animated replacement. Production models
and every saved voice remain unchanged. Source: tools/build-nietzsche-study.py.
The editable .blend, packed concept reference and three actual mesh renders are
in the local outputs/nietzsche-a-prototype folder. Further sculpting of the
likeness, hair silhouette and garment detail is required. Model report and
construction credits are in prototypes/model-study.json and README.txt.


WARDROBE AND ACQUAINTANCE MAP - 2026-11-04
CITY OF IDEAS - SUIT VARIANTS AND ACQUAINTANCE MAP / 10

Ramsey, Turing and Nietzsche have individual outfits adapted from the supplied
Man Black Business Suit: shaped lapels, layered fronts, trousers, cuffs, buttons
and fabric normal maps. Ramsey wears navy with a burgundy tie, Turing charcoal
with a muted green tie, and Nietzsche a longer near-black jacket with warmer
waistcoat and linen tones. Turing and Ramsey retain their existing head geometry, hair, spectacles,
facial morphs, hands and shoes. Nietzsche uses the supplied portrait aligned
to face forward, with a local bilateral correction beneath the moustache.
His face is retained, while the source bust clothing is trimmed away and its
neck is extended inside the business suit collar (see edition 11 below). Anonymous, Socrates and Zarathustra
are unchanged. The new suits have weighted sleeves / trousers and seatedDrape
shapes for the coat and shirt, included in the exported pose clips.

The coffee cups, individual writing notebooks / pages and open desk book have
been removed. There is one graph sheet, exactly centered over the hexagonal
table. Each named node lies toward its person's seat. In the fictional gathering:
Nietzsche knows Zarathustra and Socrates; Socrates knows Ramsey; Ramsey knows
Turing; Turing knows Zarathustra. These five pairs are red. Every other pair
among the five is blue (not acquainted). Anonymous's five pairs remain unknown,
shown as gray dashes. Node positions and pair states do not change to an
invented relation during the film. Its five-person example omits Anonymous
while keeping the other five nodes on their own table sectors.

The recorded fictional film dialogue is retained. Its general six-person
Ramsey theorem assumes every edge is classified. This gathering leaves
Anonymous unclassified; its partial map is not a complete two-colour K6.
The five specified acquaintance pairs form a C5, and neither colour among
those five contains a triangle.

OPEN / DOWNLOAD
index.html: gameplay; film.html: paused interactive film; studio.html: character
views, wireframe, standing/seated poses and individual GLB downloads.
assets/turing.glb, ramsey.glb, nietzsche.glb and anonymous.glb have weighted rigs.
Turing and Ramsey retain four facial morphs. Nietzsche's source face and the
Anonymous mask are static. Speaking uses their head / arm gestures.
Socrates and Zarathustra retain the earlier illustrated procedural actors;
their GLBs contain two baked poses without a skin rig.
Units are metres, Y is up, characters face -Z. See mesh-report.json,
wardrobe-report.json, scene-checks.json and validation.json for details.

VERIFICATION / LIMITS
All six GLBs pass Khronos validation with zero errors and zero warnings.
The release checks cover centered paper, exact fixed pair states, unknown
Anonymous links, seat-node alignment, garment weight normalization, pose clips,
retained Turing/Ramsey head attributes, fixed voices and the rest of the city.
Headless Chrome / WebGL previews show front, three-quarter and side views,
standing and seated, in the actual studio. The shared room, film table view
and native city room are also checked in the browser. See scene-checks.json.

The visual result is a stylized game cast, not finished cinematic realism.
Nietzsche's source face is static. Original baked shading and natural facial
asymmetry remain, despite reducing the lower-lip/chin geometry mismatch.
Clothes use linear skinning and authored seated morphs, without cloth simulation.
Extreme external retargeting, mobile performance and file-URL launching are
unverified. Model downloads are separate GLBs; serve the game over HTTP.

SUIT ATTRIBUTION - CC BY 4.0
Man Black Business Suit by Style3D CG (https://sketchfab.com/Style3DMeta).
https://sketchfab.com/3d-models/man-black-business-suit-7a669a06fb954d459985ccaa98672177
License: https://creativecommons.org/licenses/by/4.0/
Adapted from the user-supplied file: optimized geometry and textures, new fit,
colour variants, skin weights and seated garment morphs. Original title,
author and license metadata are retained in each derivative GLB and report.

OTHER PROVENANCE
Nietzsche head: user-supplied source/model.glb. Original conditions continue to
apply; no author/license metadata was present in that file.
Original scene: city-of-ideas-ramsey-render-error-fixed.html from the user's files.
Turing/Ramsey anatomical base: MakeHuman CC0 core assets and sculpting targets.
https://www.makehumancommunity.org/about/license.html
Three.js r160 and its loader/exporter: MIT; vendor/THREE-LICENSE.txt.
The original scene and audio retain their original provenance and ownership.

ADDITIONAL CLOTHING STYLE REFERENCE - CC BY 4.0
Indian Man in suit by Pixel_Monster (https://sketchfab.com/ar.jethin).
https://sketchfab.com/3d-models/indian-man-in-suit-985dd9756d89464b9380414b5b12d8aa
https://creativecommons.org/licenses/by/4.0/
Used as a shoulder, sleeve and restrained clothing reference; its identity
and head are not imported. The derivatives above use the Style3D garment.

TARGET
https://hadi1373z.github.io/city-of-ideas/
Integrated into the native walkable room and the shared standalone film.
Recorded voice files, exact dialogue and the Nietzsche A prototype are preserved.

NIETZSCHE PORTRAIT / SUIT JOIN - 2026-11-04 / 11
The supplied portrait's old clothing and added collar-base mesh are removed.
The retained face and neck move down 45 mm as one piece. A continuous skin
extension follows the exact clipped anatomical contour and fits inside the
existing business suit's restored shirt collar. The rear neck tapers inside
the jacket. Original seam normals and bone weights are shared, preserving
the join during seated and speaking gestures. Original face maps are retained;
three small baked skin transition maps prevent a stretched clothing texture.
The other five characters, recorded voices and Option A study are unchanged.

Reproduce: extract assets/nietzsche.glb from city commit c9a8df3 as INPUT.glb,
then run node tools/refit-nietzsche-neck.mjs INPUT.glb OUTPUT.glb REPORT.json.
The script checks the source hash and uses Python, numpy and Pillow for the
neck atlas. Its portrait base and suit credits above continue to apply.
neck-fit-report.json records the cut, alignment, extension and preserved parts.

NIETZSCHE HEAD / SUIT PROPORTIONS - 2026-11-04 / 12
The supplied head is uniformly scaled to 88% around the neck anchor. The
portrait shape, hair and maps are retained. The anatomical neck extension
is regenerated against the same suit collar, with matching seam weights
and normals. Standing full-body and seated speaking views are checked.
The other characters, suit, voices and separate Option A study are unchanged.
The source and reproduction command remain tools/refit-nietzsche-neck.mjs.

NIETZSCHE HEAD / SUIT PROPORTIONS - 2026-11-04 / 13
Head scale is now 79.2% of the original supplied portrait: another 10% smaller
than edition 12. Uniform scaling preserves the likeness. The neck extension
is regenerated from the resized contour to the same suit collar.

NIETZSCHE WHOLE CHARACTER / 14 - 2026-11-05
The complete person is uniformly enlarged by 10%, preserving edition 13's
head-to-suit proportion. A shared skeleton transform scales the portrait,
neck, suit, hands and shoes together. Standing feet and seated hip retain
their contact anchors; the portable clips and live actor use the same fit.
The six fixed character voices and other character assets are unchanged.
