# Five sculptures, four reading paths

The Mathematics reading hall has an original procedural sculpture on each
of its four real floors, plus a Möbius band with a walking ant on the geometry floor. This adds a reason to compare the papers rather than
another display of unrelated objects. The existing eleven licensed original
first-page images, stable paper identifiers, edition notes and source/rights
records are preserved. No external image or sculptural mesh is downloaded. No narration or private
save is created by this module.

## Selection and sequence

This is an intentional trail through 27 distinct works, not a historical ranking or a claim that these
works exhaust mathematics and computing. Each entry has a preparation note,
selection rationale and a question. Original monograph title pages remain
identified as title pages; the visitor follows the original-work link for the
argument rather than being promised a complete paper on one monitor.

1. **Foundations:** Boole, Frege and Peano separate algebra, logical syntax and
   axioms; Dedekind and Bolzano expose completeness and continuity; Hilbert
   turns historical open problems into questions about what a solution requires.
2. **Geometry and analysis:** Euclid introduces constructions; Euler connects
   graphs and polyhedral invariants; Gauss, Riemann and Klein compare intrinsic
   measurements and transformation groups; Fourier and Noether connect analysis
   to mathematical physics with their necessary hypotheses.
3. **Computation:** Babbage starts from reliable execution and printing;
   Menabrea/Lovelace opens the distinction between quantities and operations.
   LIBLINEAR, AdaGrad and SDCA distinguish objectives, solvers and convergence
   certificates; kernel ICA asks what the computed contrast can establish.
4. **Probability and learning:** Bayes supplies inverse inference; LDA and the
   kernel two-sample test distinguish model assumptions and calibrated evidence;
   feature selection and forest consistency separate evaluation from asymptotic
   claims. Scikit-learn is a modern bridge to reproducible evaluation; Dropout
   extends the path to regularization. The modern papers are not substitutes for
   the historical foundations or as the indisputably greatest paper in its field.

`CURATED_FLOOR_PATHS` and `PAPER_CURATION` in
`src/mathematical-sculptures-model.js` hold the sequence, role, prerequisite,
rationale and reading question. The collection guide shows that material in
English. “Face this original first page” turns the visitor toward the physical
monitor; it does not teleport them or bypass the existing reader’s floor and
distance gates.

## Original mathematical constructions

**Boolean B₄:** the sixteen subsets of a four-element set form the vertices;
each of thirty-two edges changes one membership bit. The graph is projected
from four to three dimensions, with a controllable four-dimensional rotation.
Bit controls change the highlighted subset and its incident relations. It is
the undirected cover graph of the Boolean lattice, not a rank-arranged Hasse
diagram and not a model of all Boolean functions of four variables.

The artistic direction of making higher-dimensional structure inspectable was
informed by [Julius von Bismarck and Benjamin Maus’s Arts at CERN tesseract
commission](https://arts.cern/commission/round-about-four-dimensions/).
The object here is a separate original procedural graph, not a reproduction of
that kinetic sculpture. The finite-lattice reference is the
[MIT Boolean-lattice lecture](https://math.mit.edu/~apost/courses/18.212_2025/davit/davit_18.212_lec_10.pdf).

**Enneper patch:** the polynomial parametrization uses
`(u-u³/3+uv², u²-v², v-v³/3+u²v)`, a coordinate permutation of the
[UCI Virtual Math Museum equations](https://webapps.math.uci.edu/~vmm/Surface/enneper/enneper.html).
The domain can shrink from ±1.1 to ±0.8; the grid follows parameter curves.
Before the display scale, `E=G=(1+u²+v²)²`, `F=0`, `H=0` and
`K=-4/(1+u²+v²)^4`. Zero mean curvature is not zero Gaussian curvature or a
blanket claim of global area minimality. No museum image/model was copied.

**Möbius band and ant:** a solid, original parametric ribbon sits opposite the
Enneper patch on the geometry floor. Its ideal middle surface is
`((R+v*cos(u/2))*cos(u), v*sin(u/2), (R+v*cos(u/2))*sin(u))`, with display
local radius 1.65 m, half-width .58 m and a 55 mm physical thickness. A separate
uniform 0.84 display scale and 50° rigid tilt turn the opening toward the inner
viewing aisle, centred 2 m above the floor. The band remains recognisable from
ordinary standing height rather than appearing edge-on. These placement
transforms act identically on the ribbon, ant frame and curved-foot contact;
they do not alter the mathematical surface or its one-sidedness. Two upright
bronze supports meet the placed lower rim. The plinth, plaque and court stay
upright; the ribbon, supports and moving ant fit between .36 m and 3.8 m
above this floor. The shell is
closed across the reversed seam, with one continuous gold boundary. The small
physical thickness is explicitly distinguished from the ideal one-sided surface.

A red ant has six articulated legs, two feelers, three body segments and two
eyes. Each stance foot follows the actual curved ribbon rather than a flat
moving frame. Its oriented centreline frame uses continuous tangent, width
vector and surface normal: after `2π` the centreline position returns and the
normal is reversed; after `4π` the entire frame returns. A two-circuit journey
takes 32 seconds. This makes one-sidedness inspectable as movement instead of
an unexplained flip or teleport.

The sculpture's English study action offers pause/resume, quarter-lap stepping
and restart. The mathematical question asks visitors to derive
`X(u+2π,v)=X(u,−v)` and compare a full-twist band. Reduced motion freezes
automatic walking while retaining explicit quarter-lap steps. Hidden documents
and open study panels pause the same shared city-clock simulation; there is no
second animation loop and no accumulated jump after returning to the tab.

The artistic reference is the museum's account of
[Escher's Möbius Strip II (1963)](https://www.escherinhetpaleis.nl/en/about-escher/masterpieces/mobius-strip-ii).
No print, image, museum mesh or external model is copied. This is original
mathematical teaching geometry, not a reproduction of the artwork.

**Finite Menger sponge:** split each cube into twenty-seven cubelets, omit the
centre and six face centres, and recurse in each survivor. Orders zero, one
and two contain 1, 20 and 400 cubes. The retained-volume fraction is
`(20/27)^n`. The finite object is not claimed to be an infinite fractal or a
universal computer. The artistic reference is
[Bathsheba Grossman’s own Menger Sponge description](https://www.bathsheba.com/gallery/archive/menger/),
with [Henry Segerman’s mathematical-sculpture practice](https://www.segerman.org/)
as further exploration. Their meshes and images are not reused.

**Gaussian relative likelihood:** a correlated two-dimensional Gaussian model
with known covariance `Σ=[[1,.6],[.6,1]]` is centred at its sample-mean maximum.
The surface is `L(μ)/L(μ̂)`; height is normalized to one. Its contours are
likelihood ratios, not unqualified posterior probabilities or confidence
regions. Controls compare one observation, four conditionally independent
observations, and four exact copies of one observation. The latter keeps
effective `n=1`. For the stipulated independent model, `I_n=nΣ⁻¹` and widths
contract as `n^(-1/2)`.

The mathematical reference is
[Cosma Shalizi’s author-hosted multivariate-inference notes](https://www.stat.cmu.edu/~cshalizi/uADA/12/lectures/ADAfaEPoV.pdf).
The broader constructive approach was informed by
[George W. Hart’s own geometric-sculpture portfolio](https://www.georgehart.com/sculpture/sculpture.html).
The likelihood surface, contour treatment, lesson text and arrangement are
original teaching material. The reading explicitly asks which model criticism
would invalidate an apparent gain in information.

## Architecture, interaction and bounds

Each court lies at radius 38 m, 0.55 radians from its floor’s radial stair
landing. The additional Möbius court mirrors the Enneper court across the
geometry floor’s radial landing (−0.55 instead of +0.55 radians). A low 2.9-metre-radius plinth supports its object. The maximum court
collider radius is 3.4 m, plus the walking margin; all central stairs, the
inner circulation circuit, the r52 paper-viewing aisle and the western ground
exit remain open. Every sculpture stays below 3.8 m above its own floor.
The clear radial landing leads to the r44.9 front reading circuit, which
connects every monitor without crossing a sculpture court. Small 2.8×0.585 m
plinth labels replace large freestanding signboards.

`buildMathematicalSculptures` adds exactly nineteen renderable objects and no
lights. The 400 sponge cubes, graph nodes/edges, five plinths, ant body, eyes,
limbs and two ribbon supports use instancing. Controls update actual geometry
or instance state, then close the reader so the visitor sees the result. Only
the ant advances continuously, using the existing city update clock.
The visit state is in memory only; the module never reads browser storage.

Install `installMathematicalSculptures(M,T)` after the paper gallery and monitors.
The root offers `.interact()` before other E/A readers and composes
`.canStand(localX,localZ,feetY)` with both gallery and ordinary lower movement.
Target actions and the dialog require the same actual floor and at most six
metres from the corresponding court. Travelling away closes the reader; stale
buttons cannot change a sculpture from another floor.

`tests/mathematical-sculptures.mjs` checks the graph degrees/ranks and 24 maximal
chains, independent differential geometry, disjoint recursive cube interiors
and volume, likelihood Hessian/information, exact duplicate-evidence behavior,
finite geometry/headroom, the nineteen-object budget, a watertight twisted
ribbon seam with outward normals, the ant’s continuous orientation double
cover and exact curved-foot contact, shared-clock pause/reduced-motion/hidden
state behavior, identical mathematical-to-display placement for the ribbon and
ant, inward-facing opening, supported lower rim and swept headroom, clear physical routes,
real gallery collision composition, proximity-gated controls, curation identity
and owned cleanup without private-data access.


## Further sculpture candidates — not built

These references are design candidates, not claims that their objects or art
are in the city. Each needs a mathematical investigation and an original model
or separately licensed asset before implementation.

- **The Eightfold Way / Klein quartic:** a finite sculpture leading to a study
  of symmetry, genus and the relation between a hyperbolic tiling and its
  compact quotient. Start from [Carlo Séquin's account of the sculpture and
  its mathematics](https://people.eecs.berkeley.edu/~sequin/PAPERS/2008_G4G8_8foldWay.pdf).
- **Gyroid labyrinth:** inspect the two intertwined channels and distinguish
  a useful trigonometric approximation from an exact minimal surface. The
  artist's [Gyroid commission](https://www.bathsheba.com/gallery/commissions/gyroid-rust/)
  is a reference for sculpture at architectural scale; its geometry or images
  are not licensed assets for this project by default.
