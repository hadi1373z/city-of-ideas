NIETZSCHE A — GROOM AND PROPORTION STUDY A02

nietzsche-a.html opens a real rotatable GLB prototype with front, profile,
back, wireframe and turntable views. This is an early anatomical blockout;
the concept image's likeness and animation remain work in progress. It does not replace the production character.

The model contains actual mesh geometry, not an image pasted on a plane.
The project MakeHuman CC0-derived anatomical mesh provides the facial and
neck topology. The prototype reshapes that base and adds separate fitted
spectacles, tapered mesh hair grooms and a fitted costume study.
Revision A02 adds 480 eyebrow hairs, 520 moustache hairs and 720 scalp
fibres, with baked skin colour/normal maps embedded in the GLB. The torso
has rounded adult shoulders, a shorter exposed neck and an overlapping
collar. Shirt, lapels and tie follow the chest instead of intersecting it.
The existing Turing character is only read as source, never modified here.
Original anatomical credits: see ../README.txt and ../mesh-report.json.

Source: tools/build-nietzsche-study.py
Generator: Blender 4.5.9 LTS, portable official build.
Run Blender --background --python tools/build-nietzsche-study.py --
  --output OUTPUT_DIRECTORY --render --reference OPTIONAL_CONCEPT_IMAGE
The source exports a self-contained GLB, an editable .blend with the packed
concept reference when supplied, a model report, and three actual renders.

Local editable source and renders are in outputs/nietzsche-a-prototype.
The persistent English voice remains Kokoro am_fenrir; no audio is changed.

Reference candidate (reference only; no downloaded mesh incorporated):
https://cults3d.com/en/3d-model/art/friedrich-nietzsche-bust-german-philosopher
The listing includes a GLB, but is sold for 3D printing; suitability and
permission for game redistribution have not been established.
