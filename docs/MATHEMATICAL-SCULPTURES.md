# Four sculptures, four reading paths

The Mathematics reading hall now has one original procedural sculpture on each
of its four real floors. This adds a reason to compare the papers rather than
another display of unrelated objects. The existing eleven licensed original
first-page images, stable paper identifiers, edition notes and source/rights
records are preserved. No image, sculpture mesh, narration or private save is
downloaded or created by this module.

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
landing. A low 2.9-metre-radius plinth supports its object. The maximum court
collider radius is 3.4 m, plus the walking margin; all central stairs, the
inner circulation circuit, the r52 paper-viewing aisle and the western ground
exit remain open. Every sculpture stays below 3.8 m above its own floor.
Small 2.8×0.585 m plinth labels replace large freestanding signboards.

`buildMathematicalSculptures` adds exactly thirteen renderable objects and no
lights. The 400 sponge cubes, graph nodes/edges and four plinths use instancing.
Controls update actual geometry or instance state, then close the reader so
the visitor sees the result. Nothing animates continuously or advances itself.
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
finite geometry/headroom, the thirteen-object budget, clear physical routes,
real gallery collision composition, proximity-gated controls, curation identity
and owned cleanup without private-data access.
