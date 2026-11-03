NIETZSCHE A — FIRST MODEL CONSTRUCTION STUDY

nietzsche-a.html opens a real rotatable GLB prototype with front, profile,
back, wireframe and turntable views. This is an early anatomical blockout;
the concept image's likeness, flowing hair, surface detail and animation
remain work in progress. It does not replace the production character.

The model contains actual mesh geometry, not an image pasted on a plane.
The project MakeHuman CC0-derived anatomical mesh provides the facial and
neck topology. The prototype reshapes that base and adds separate fitted
spectacles, moustache volumes, hair shaping and an editable costume study.
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
