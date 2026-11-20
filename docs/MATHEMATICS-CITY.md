# City of Mathematics

The user authorised a substantive mathematics-only redesign, including removal,
simplification and new construction, while preserving the original city and other
editions. The entrance is `edition_math_learning/`; `city-of-mathematics/` remains
an identical alias. `editions/mathematics` contains the separate application.

The builder installs only these two routes. It reuses the pinned public Three.js,
Proof Atelier and paper resources without loading `city-integration.js`, the old
park or unrelated installers. Main `src` and the other six editions are unchanged.

## Connected architecture

Six houses on a regular hexagonal ring surround the full original Proof Atelier.
A hexagonal street, six doorstep approaches, garden crossings and an outer
promenade form one continuous collision-checked walking domain. Houses have
distinct roofs, glass sides, wide level front doorways, tiled floors and benches.
The Atelier retains its original six physical workbenches and original sources.

The park is inherent in the city: six shared gardens occupy gaps between houses,
joining both adjacent streets and the outer promenade. Outdoor exhibits continue
their neighbouring house's investigation. Reading garden has a small pond and
supported bridge. Full tree crowns clear both roofs and streets. The map draws
the actual street segments and house footprints, with the current player marker.
Map travel is explicit fast travel to real doorsteps, not automatic walking.

This simplified edition has no inherited underground shafts or false doors. The
original two-face city remains intact at the main address and in its other copies.

## Working learning places

- **Proof Atelier:** six workshops, twelve deeper problems, finite checks,
  original arguments and graph certificate. Existing storage, independent
  last-workbench resume and next-unfinished navigation remain authoritative.
- **Symmetry:** compose hexagon rotations/reflections; the physical sculpture's
  vertex poses agree with the permutation. Explain the twelve symmetries.
- **Chance:** exact birthday probabilities with explicit independent uniform
  365-day assumptions. Seeded samples colour real beads; samples are not proofs.
- **Infinity:** edit a binary matrix and construct its diagonal complement.
  Separate the finite witness from the general infinite-sequence proof.
- **Topology:** a parametrised Möbius band with an ant following an off-centre
  4π-return path. Its pose follows the continuous local surface normal. Explain
  the seam, the 2π centreline exception and the absence of a global front side.
- **Algorithms:** step Euclid's division algorithm. Inspect the preserved common
  divisors and strictly decreasing remainder; compare Fibonacci inputs.
- **Reading:** all35 credited genuine opening pages in four original collections,
  retaining source, reuse terms, scope, captions and discussion questions.

Campus drafts stay in memory until **Keep my argument**. A separate browser-local
campus notebook supports reload and JSON download without changing original notes
or account connections. Proof Atelier keeps its established storage key. Prose is
not machine graded and arrival earns no completion. No cross-device sync is claimed.

## Controls and checks

WASD/arrows move, dragging looks, E opens nearby work and M opens the map. Phone
walking buttons occupy a separate bottom zone. Walking closes the nonmodal
workbench with the movement return value without clearing the held direction.
Reading dialogs are closeable and modal. Released buttons, cancellation, lost
capture, blur and hidden documents clear input. Reduced motion stops automatic
sculpture animation. Fixed repeated meshes are batched; moving exhibits stay
independent. Trees share geometry and materials. Voice recordings remain untouched.

`tests/math-campus.mjs` independently enumerates small birthday experiments,
divisors and diagonal witnesses, checks dihedral permutations against physical
vertex poses, verifies the Möbius seam/return, floods the collision domain to
connect all doors/gardens, checks glass/crown clearance and explicit note saves.
Existing Atelier model/UI and publication-isolation tests remain required.
Browser inspection is separate; no actual two-hour user study is claimed.
