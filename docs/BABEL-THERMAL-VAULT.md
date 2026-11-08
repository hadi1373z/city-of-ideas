# Babel's inverted glass reservoir

`src/babel-thermal-vault.js` builds an original sculptural reservoir directly
under the existing central volcano in Zarathustra Gallery. The volcano is at the
gallery centre with radius 21; it is not the separate mountain destination. The
reservoir is an inverted cone with a broad circular mouth at ground/roof level
and a narrow point above the centre of the library. Amber and rust-coloured fluid
is visibly contained behind glass. This is an artistic object, with no claim to
thermal engineering, geology or a simulation of molten material.

## Exact geometry and clearance

`BABEL_THERMAL_VAULT` is the dimension contract. The outer mouth has radius 21
at Y−.55 and tapers to radius zero at Y−20. The glass has a real inner conical
wall, a narrow closed top lip and a transparent circular lid. Its inner mouth
radius is 20.86 and inner point is Y−19.8. The fluid is a separately closed solid
inside it, with radius 20.5 at Y−.78 and point at Y−19.55. Its surface stays above
the inner glass wall and below the lid; it does not protrude into the library.

A transparent cylindrical collar at r21 extends from Y−3.3 to Y−.55. It joins
the real circular aperture in the retained outer annular ceiling. The cone
itself crosses Y−2.8 at radius about 18.57, so omitting this collar would leave a
visible gap between the vessel and a radius-21 ceiling cut.

`thermalVaultHeightAt(r)` returns the outer cone height for r0..21 and `null`
outside. The slope is `−20 + 19.45*r/21`. The existing terraces at r49/39/29/19/9
and Y−8/−12/−16/−20/−24 retain their floors, shelves and radial flights. The
lowest terrace's inner physical edge has about 8.82 m to the cone; the final
radial stair has at least 12.34 m; the deep through-gallery entrance at r14.4
has about 17.34 m. The central base lies 6.5 m below the cone point. The entry
stair's full x footprint lies outside r21, so the new reservoir does not cross
the existing gallery stairwell or require a rectangular cut in its own glass.

The host must retain the enlarged rectangular stairwell opening in the **outer
annular ceiling**, together with the new radius-21 aperture. Preserve all original
slab, ink shader, plinth, island and lawn openings. The remaining ceiling is
r21..58. Remove the old centre-spanning wooden ceiling beams and start any
retained outer beam at r21. Do not add an opaque disk or foundation through the
glass reservoir, its visible cone or the deep r14.4..17.6 walking shaft below.

## API and ownership

```js
import {buildBabelThermalVault} from './babel-thermal-vault.js';
const thermalVault = buildBabelThermalVault(THREE);
babelGroup.add(thermalVault.group);
// The normal scene update receives seconds and the existing motion preference.
thermalVault.update(timeSeconds, reducedMotion);
// In the owning library's cleanup:
thermalVault.dispose();
```

The return value contains `group`, `glass`, `lid`, `collar`, `fluid`,
`glassMaterial`, `fluidMaterial`, `contract`, `counts`, `update` and `dispose`.
Every geometry, material and instanced mesh belongs to this module. Disposal is
idempotent and removes only the module's own group/resources. There are no
borrowed materials, textures, canvas, external assets, voices, stored data or
network services. The host owns the original annular ceiling, its cuts, entry
navigation, source artwork and update hook.

The glass is transparent physical material with depth writing disabled; it must
remain distinguishable from the warm liquid. The original procedural fluid
shader uses slowly drifting folds and veins in restrained amber/rust tones. It
updates one time uniform without reallocating or editing geometry. Passing
`reduced=true` fixes that uniform to zero, preserving a still readable pattern.
There are no particles, animated lights or placeholder panels. Ten thin dark
metal meridians and two restrained circular seals describe the glass structure.
The whole reservoir uses seven mesh draws and 6,160 triangles including instances.

## Verification

Run `node tests/babel-thermal-vault.mjs`. It checks consistency with the actual
central volcano, the cone form through real upward rays, finite vertices/normals
and instance transforms, the collar's ceiling interface, every fluid vertex's
containment, 4,540 headroom probes over actual terrace/radial/entry/deep-stair
geometry and shelf tops, the draw/triangle budget, reduced motion and exactly-once
resource disposal. Root integration must also retain the existing Babel tests
and receive browser review of the transparent layering and the outer ceiling's
real circular and rectangular holes.
