# Ant-free open Möbius lattice

The two existing Möbius display sites now share one original open-lattice
sculpture. It has four thick ivory longitudinal rails,36 transverse rungs and
108 genuinely open rectangular cells, a separated figure-eight crossing, and
two small metal support stems. No ants, hidden creature meshes, creature motion
or live creature controls are installed.

`mobius-lattice-model.js` owns the mathematical frame, ideal carrier connectivity
and actual extruded beam mesh. `mobius-lattice-scene.js` owns its two draw meshes
and their resources. Escher's5×5 dark-green plinth moves from(224,155) to(218.5,155),
clear of the inner arcade piers and with the study-door landing at(223,155),
with topY−39.65 and sculpture centreY−37.8. The same builder occupies the existing
Möbius court on the Mathematics geometry floor, facing its inner viewing aisle.
That court keeps its floor, collider, plaque, visit placement and paper bindings;
only the existing Möbius base receives a dark-green instance tint.

## One half-twist, two visible loops

The closed centreline is initially

```text
C(u) = (2.2 sin u, .55 cos u, .85 sin 2u), 0 ≤ u ≤ 2π.
```

A rigid coordinate rotation makes its two figure-eight lobes readable from a
standing aisle. The apparent crossing is not an intersection: the two centreline
points are separated in depth by1.1m. The finite-width beams retain a measured
clear gap. This is one continuous centreline, not two independent ring objects.

A width vector is parallel-transported along the sampled tangent field. Its
closed-curve holonomy is measured, then a distributed correction makes the final
width vector exactly the negative of the initial width vector. This correction
need not itself equalπ: the transported frame has already accumulated rotation.
The resulting frame has

```text
N(u+2π) = −N(u)
X(u,v) = C(u) + vN(u)
X(u+2π,v) = X(u,−v).
```

The local normal also reverses after one centreline circuit and returns after
two. The four visible rail positions use width offsets
`[−1,−1/3,1/3,1]×.36m`. At the actual rendered seam, each rail's indices continue
onto the opposite width rail, with the bevelled solid cross-section reversed.
There are no terminal caps, hidden flat band or separate torus completing the
shape. The joined longitudinal beam skins are closed and share seam indices
for smooth normals.

The ideal supporting band has Euler characteristic0, one boundary component and
an inconsistent global orientation. Tests establish these from its actual
reversed-seam carrier connectivity. The holes and ordinary three-dimensional
solid beams must be distinguished from that ideal band: this does not claim
that each closed beam skin is a one-sided two-dimensional surface.

## Geometry, supports and rendering

Rails and rungs have real eight-corner bevelled cross-sections,52mm wide and
64mm deep before the uniform0.90 display scale.36 capped crossbars intersect
the longitudinal members at their actual joints, leaving the cells open. The
model is not a line material, alpha-cut texture or a flat ribbon with painted
rectangles. The ivory material gives visible front, back and bevel faces.

The builder accepts `{scale,centreY,baseY,yaw}` and returns `group`, `body`,
`mesh`, `supports`, `contacts`, `data`, `contract`, `counts` and idempotent
`dispose`. Two support contacts are obtained by upward rays against the real
lower beam geometry; each stem ends at its first hit without piercing a higher
member. The existing host owns the plinth. The sculpture has no canvas, lights,
external assets, animation loop, voice, private storage or network access.
It uses two draws and13,392 triangles including the instanced stems.

The main mathematical gallery's live reader now describes tracing the outside
rail and inspecting the crossing. It has no retired walking/pause/step controls.
All other sculpture controls, height/proximity gates, curated original and
SURPRISE paper links, calculations and explicit study actions remain intact.

## Preserved original mathematics

The original `mobiusPoint`, `mobiusDifferential`, `mobiusRibbon`,
`mobiusAntPose`, `mobiusFootPoint`, rigid display helpers and continuous4π frame
remain in `mathematical-sculptures-model.js`. The old scene construction is
available only through the explicit `legacyMobius:true` builder option, for
preserved baseline tests and later authorized work. The live default constructs
no such creature objects, `MOBIUS_ANT_ENABLED` is false, and its state starts with
`running:false`. A geometry reference that happens to contain ants does not
provide permission to restore them to either live site.

The artistic reference remains Escher's Möbius Strip II, with its existing
museum source link. The lattice is original procedural interpretation: no print,
image, museum mesh or generated workboard is used as a scene texture.

## Checks

`node tests/mobius-lattice.mjs` verifies the actual half-twist seam, reversed
width/normal frame,4π return, one carrier boundary/nonorientability, closed
extruded rail edges, finite unit normals,108 real through-hole rays, depth
separation, physical support contacts, original site/plinth/aisle bounds,
absence of live creature objects, paper bindings and exactly-once composed
resource disposal.

`tests/mathematical-sculptures.mjs` retains the original watertight-ribbon,
curved-foot, continuous-frame and gait tests using the explicit legacy builder.
Its live controller tests now require the still, creature-free lattice and honest
reader while preserving collision, study controls, original-paper curation and
private-storage guards. Existing Clebsch, Escher runtime, cloister-shell, stair
and connected-journey checks remain required.
