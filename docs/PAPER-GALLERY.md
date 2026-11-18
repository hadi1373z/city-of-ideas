# Four connected reading floors

The lower Mathematics rotunda has four collections in the same physical lower
frame. The ground aisle and western exit remain at local Y=.13; three actual
annular mezzanines stand at 4.13, 8.13 and 12.13. A 96-tread continuation rises
above the original through-gallery stair and connects the four broad landings.
The existing 240-step descent to the middle of the world is preserved.

| Floor | Collection | Original pages | Reading question |
| --- | --- | --- | --- |
| 1 | Foundations and logic | 6: Boole; Frege; Peano; Dedekind; Bolzano; Hilbert | What makes a definition support a proof? |
| 2 | Geometry, analysis and symmetry | 8: Euclid; Euler bridges; Euler polyhedra; Gauss; Riemann; Klein; Fourier; Noether | Which structure survives a change of representation? |
| 3 | Machines and symbolic computation | 6: Babbage; Menabrea/Lovelace; LIBLINEAR; AdaGrad; SDCA; kernel ICA | When does a calculation become a general method? |
| 4 | Probability and learning | 7: Bayes/Price; LDA; kernel two-sample testing; feature selection; forest consistency; Scikit-learn; Dropout | Which assumptions make an inference trustworthy? |

This is a curated path through 27 distinct genuine facsimiles, not a
ranking of all mathematical papers or repeated copies on every floor. The
monographs and original title pages retain their honest edition labels. Read
PAPER-COLLECTION.md and the two appended catalogue modules for original sources
and reuse records. The original eleven records and full scans remain intact.
Eight public-domain classical openings and eight CC BY JMLR first pages expand
the collections. No generated facsimile, voice or private save is introduced.

`paper-gallery-model.js` owns the four floor heights, negative-angle rising
stair, radial landings and per-floor slot records. `paperId` binds each slot to
the catalogue independently of display order; `floorY` supplies the actual feet
height for reader proximity and monitor collision. A monitor cannot be activated
from the floor above or below it, or remotely through the pond.

Each floor's compact arc is centred on its real landing at radius 48 m with
0.18-radian spacing. Pedestals and collision boxes derive from the same actual
slots. The inward reading position is around radius 44.9 m; the outer radius
52 m aisle, sculpture courts, west exit and central stair remain clear. The
3D pages use 900-pixel-high display adaptations while the reader opens the
unchanged full-size first-page images. These are reduced faithful originals,
not new typesetting or title-only substitutes.

`paper-gallery-scene.js` builds the three mezzanines, stair, rails and floor
identity plaques. The existing ground floor is borrowed. Faculty roof, eaves
and glazing rise to enclose the new storeys. The category guide is folded and
dismissible; it describes all four collections without moving the visitor.
Point lights are limited to the visitor's reading floor.

Install `installPaperGallery` after the world cylinder and before the paper
monitors. Its movement hook runs before `worldCylinder.step`; capturing the new
floors releases the old route without moving the player. Ordinary ground travel
takes over at the shared outer band and west doorway. The same ground landing
also allows continued descent along the original through-gallery stair. Modal
readers pause motion; arrival elsewhere stops gallery ownership.

Direct visits use `?arrival=paper-gallery:foundations`, `:geometry`,
`:computation` and `:learning`. These are ordinary destination links; the floor
guide itself does not teleport visitors. The legacy `paper-monitors` destination
still opens the same lower reading hall.

Each collection now has a supporting original mathematical sculpture and an
explicit core/bridge/extension reading path. The English guide supplies
preparation, selection rationale and a question for every work; Scikit-learn
and Dropout are identified as modern extensions. The new sculpture controls
change the physical objects without touching notes or the original facsimiles.
See [MATHEMATICAL-SCULPTURES.md](MATHEMATICAL-SCULPTURES.md) for the equations,
artist inspiration, primary references, collision bounds and interpretation.

Facade correction: glass extends continuously from each floor to the next,
ending at the real 16.4m eaves. The west opening exists only below the 4.13m
first mezzanine; upper floors have a complete glazed circumference and matching
wall collision. Keep this distinction instead of a full-height unglazed slit.
