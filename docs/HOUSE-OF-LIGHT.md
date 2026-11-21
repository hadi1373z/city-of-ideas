# House of Light

The main daytime city now includes the user's glass-pavilion proposal in southeastern
hex(1,2), centred at(318.6973485926734,276). It is one regular hexagonal shell,
31m in radius, with transparent roof facets, a glazed roof lantern, supported gold
columns, level front/rear entrances and continuous circulation. The approved
image is retained in design/house-of-light/approved.png; its depicted historical
setting and people are reference only, not published assets.

house-of-light-model.js is the shared placement, footprint, path, collision and
station authority. The main city, honeycomb plan, planting exclusions and three
localized coastal maps use it. The two approaches join actual hexagon street
vertices. Direct arrival is ?arrival=house-of-light. Ground-height checks keep
the pavilion out of underground walking, region and interaction ownership.

Five original works invite a prediction and a physical comparison:

- Suspended spectrum:61 glass rods, fixed geometry, adjustable hue and rotation.
  Motion starts only on request, pauses away/hidden and respects reduced motion.
- Three lights: exact ideal RGB addition, with adjustable red, green and blue.
- The same grey: identical inner display values in different surrounds, with a
  revealable continuous bridge.
- Through two filters: channel-wise transmission multiplication; the reader
  explicitly distinguishes this model from real continuous spectra.
- Looking twice: a real reflected camera view down a framed passage, rather
  than a painted image or a claim of an infinitely recursive mirror.

These are original educational installations, not reproductions attributed to
historical light artists. The former static rainbow fan is replaced with a real
horizontal planar reflection of the61 hanging rods and suspension. Its selective
512px transparent capture borrows their actual geometry, instance matrices,
instance colours and current world transform. Manual hue/rotation and slow play
therefore reach the floor together. The soft48%-strength circular reflection
leaves the existing tiles visible; it does not simulate spectral caustics or
reflect the entire city. Source references are the
[Exploratorium light-mixing exhibit](https://annex.exploratorium.edu/exhibits/mix_n_match/)
and [OpenStax plane mirrors](https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors).
The passage and floor512px render targets and oblique reflected-camera clipping follow the
standard construction documented by
[Three.js Reflector](https://threejs.org/docs/pages/Reflector.html) and its
[r160 reference implementation](https://github.com/mrdoob/three.js/blob/r160/examples/jsm/objects/Reflector.js).
Nested capture preserves renderer state; it never changes global clipping during
the main pass. Reflection runs only nearby, in the surface city and from the
mirror's front. Owned textures, geometry, materials, UI and hooks are released.

Controls open only beside the corresponding work, return focus to walking and
make visit-local changes. There is no automatic notebook or progress write.
Only Carry this question uses the existing private notebook. No account,
recording, voice provider, character or isolated edition changes are introduced.

tests/house-of-light.mjs checks6312 body-width route samples, floor support,
actual geometry containment, prism headroom, display models and mirror clipping/
state restoration. tests/house-of-light-ui.mjs checks physical eligibility,
controls, reduced motion, hidden-page/underground isolation and cleanup. The
urban-plan check also compares actual transformed pavilion and Commons geometry
against every source/urban/coastal tree crown.

tests/house-of-light-floor-reflection.mjs checks27 colour/rotation/viewpoint
combinations, independently reflected viewing rays, horizontal clipping,
shared source attributes, selective capture, playback, pause and cleanup.

The21November daytime visual pass now retains each source cylinder's smooth
inverse-transpose normal through the bronze structure batch. Expanded triangle
normal recomputation previously made the round columns and roof beams appear
faceted. Caps/boxes keep sharp normals; all positions, colours,UVs,indices,
instance poses,61rods and both mirror captures remain unchanged. The new
tests/house-of-light-shading.mjs compares actual geometry bytes and independently
checks the transformed primitive normals; it is included in release checks.
