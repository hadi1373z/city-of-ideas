# Clebsch cubic on the existing Escher plinth

The user's pictured grey, three-lobed surface with bright straight lines is
represented by a real computed Clebsch diagonal cubic. It occupies the existing
empty dark **reading desk** plinth at X218..222, Z143..145, floor Y−40 and top
Y−39.58. This is the actual plinth beneath the unchanged **WHICH HAND COMES
FIRST?** sign, not a new pedestal placed from the screenshot's camera position.
The plinth, navigation footprint, Drawing Hands/dependency activity, prints,
other topology models, building and underground connections are unchanged.

`clebsch-cubic-model.js` owns the exact mathematical construction and numerical
surface. `clebsch-cubic-scene.js` owns its three draw meshes. The museum scene
mounts that owned group on its existing plinth; the model adds a separate nearby
`clebsch` reader point. The museum controller reuses its ordinary proximity,
feet-height and modal gates for a read-only explanation and sources. The small
caption is attached to the plinth's front face. It does not replace the large
Drawing Hands sign or hang across the model.

## Mathematical construction

The authoritative projective equations are

```text
X0 + X1 + X2 + X3 + X4 = 0
X0³ + X1³ + X2³ + X3³ + X4³ = 0.
```

See the [University of Tokyo model collection](https://www.ms.u-tokyo.ac.jp/models_e/27cubic_e.html)
and [Thomas Bauer's Marburg description](https://www.mathematik.uni-marburg.de/~tbauer/clebsch.htm).
The latter gives the equivalent equation after eliminating X4. The
[MathWorld description](https://mathworld.wolfram.com/ClebschDiagonalCubic.html)
also discusses the real lines, triple-line meeting points and choice of affine
view. These sources support the mathematics; no source image or mesh is copied.

The display uses the affine hyperplane `n·X=1`, with
`n=(3,3,3,−2,−7)/√80`, inside `sum Xi=0`. This is the same plane at infinity
as `X0+X1+X2+X3/2=0`, restricted to that sum-zero space and normalized. It
preserves the threefold symmetry in the first three homogeneous coordinates.
An orthonormal basis B of the kernel of both sum and n supplies ordinary 3D
coordinates `X=n+Bp`. The exact displayed polynomial is therefore
`F(p)=sum_i(n_i+B_i·p)^3`. Its gradient supplies smooth analytic mesh normals.
A final rigid orientation and uniform scale place the sculpture on its plinth.

All 27 real projective lines are built explicitly, rather than approximated by
curves drawn on the mesh:

- Fifteen lines have one coordinate zero and the other four paired into two
  opposite pairs. There are five choices of the zero coordinate and three pairings.
- Twelve further lines are the distinct S5 orbit of the span of
  `cos(2πk/5)` and `sin(2πk/5)`, k=0..4. Their coordinate sums and cubic sums
  vanish identically; the fivefold trigonometric harmonics give this directly.
  Orthogonal projectors identify equivalent spans without relying on basis signs.

Each projective line plane is intersected algebraically with `n·X=1`, producing
an exact affine point and straight direction. All 27 lines remain finite in this
chart. The furthest line's nearest point is at radius about2.32379. Consequently
all 27 cross the display ball of radius2.65. Their finite displayed segments are
clipped analytically to that same ball. Their **entire** affine lines, including
points well beyond the displayed endpoints, satisfy the cubic.

The three black dots are exact finite Eckardt points of smallest radius: three
of the 27 lines meet at each. They are not arbitrary highlights or an assertion
that these are all the surface's triple points. The repeated red, blue, green,
orange, purple, cyan, pink and yellow palette helps trace straight lines; it
makes no claim about temperature, curvature or a particular line classification.

## Surface, appearance and scope

The grey surface is a numerical marching-tetrahedra approximation on a44-cell
axis grid. Edge roots use bisection on the exact polynomial. Sphere-cut edge
vertices are projected to both the cubic and sphere, avoiding residual errors
from simply interpolating a clipped triangle. The open spherical boundary is a
display cut, not an edge of the full projective surface. There is no giant flat
plane or opaque bounding sphere behind the lobes.

The model has29,932 grey triangles. The uniform display radius is0.88m; the
actual surface and coloured tube vertices stay inside the existing4m×2m plinth
and rest above its top. Both grey faces use a light neutral material with a little
fill emission for readability under the museum's existing warm lighting. Straight
coloured tubes use unlit, untone-mapped instance colours so their hues remain
vivid. Three black instanced spheres mark the exact meeting points. The three
sculpture meshes add no lights, animation, canvas, external assets or services.
The composed museum remains48 mesh draws in the tested fixture.

`buildClebschCubic(THREE)` returns its group, surface, lines, markers, pure model
data, targets, counts and idempotent `dispose`. The module releases only its own
geometries, materials and instance objects. The museum detaches/disposes the
sculpture before its own resource traversal, keeping composed cleanup exact.
The mathematical typed arrays are immutable computed data cached for the page.
No voice, saved achievement, private note or storage is accessed.

## Verification

Run `node tests/clebsch-cubic.mjs`, then the existing Escher depth/runtime,
cloister shell and connected-journey checks. The focused test proves:

- 27 distinct exact lines, in the15+12 construction, with full-line cubic residuals;
- three exact triple-line points and polynomial/sphere residuals for every mesh vertex;
- finite geometry, analytic normals, actual vivid instance colours and both grey faces;
- 81 physical rays from line centres to the rendered surface;
- the actual transformed prototype bounds above the correct existing plinth,
  clear viewing aisle and unchanged dependency activity;
- the real reader's nearby/wrong-location/wrong-floor/modal rules and source links;
- exactly-once composed disposal and bounded draw/triangle counts.

The parent integration owns cache tags, release checks, build/publication and
browser review. A reference screenshot is not used as a scene texture.
