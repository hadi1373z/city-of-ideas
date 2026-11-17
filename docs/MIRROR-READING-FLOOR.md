# The Mathematics reading-floor mirror

The existing ground-floor annulus at lower-local Y=.13, radii 19–58m, now has
one live planar mirror material. The original mesh, triangle indices, central
opening, stair and west-door joins stay the walking authority. No second floor
or image plane is placed over it. Brass inlays and collection borders remain
independent physical details. The three upper glazed mezzanines retain their
glass panes and stone bearing bands.

`installMirrorReadingFloor(M,T)` installs after the world cylinder and night sky.
It borrows the exact floor mesh from `worldCylinder.lower.walking`, saving its
material and render callbacks. Its one owned render target is 512×512 on desktop
and 256×256 on a small/coarse-pointer device. No external texture, asset request,
storage, voice or account state is used.

The camera has already received the lower world's rigid transform. The mirror
therefore derives its plane from the real mesh's transformed vertices/normals,
not from the player's old logical coordinates. The physical plane is Y=−96.13
with a downward-facing normal. Eye, forward direction and up direction reflect
across that plane once. An oblique near plane removes earth-side geometry from
the reflection, and the existing annulus projects the actual rendered view.

The planar-camera/oblique-clipping technique follows the
[Three.js Reflector](https://threejs.org/docs/pages/Reflector.html) approach.
Its MIT notice is retained in the helper; the full license already ships in
`src/city-source-assets/home-tools/vendor/LICENSE-three.txt`. No additional
Three.js runtime or addon is loaded. The annular material, lifecycle and
city-specific capture are original integration work.

Only nearby, front-facing lower-city views capture. Looking away at the sky,
hidden pages, section overviews and immersive sky mode do not incur a mirror
pass. A stationary camera reuses the image between 300ms updates; movement uses
a 90ms interval, with longer intervals on mobile. A photo camera gets its own
fresh projection, and returning to the ordinary camera refreshes that view.
Nested pond/reflection views use a quiet surface fallback rather than starting
another offscreen pass. This is one real room reflection, not recursive mirrors.

Every capture restores render target/face/mip, viewport, scissor, clear state,
XR/shadow settings, global/local clipping and depth-write state even if a render
throws. Camera-centred star and constellation groups regain their original
local transform after the virtual camera recentres them. Floor visibility and
the recursion guard restore in the same `finally` block. Teardown restores the
borrowed callbacks/material and disposes only the new material/render target.

`tests/mirror-reading-floor.mjs` independently checks reflection/involution,
actual physical floor plane, projected rays and oblique clipping, immutable
camera/geometry, moving/still reuse, photo refresh, nested/hidden/mode gates,
resource ownership and exception restoration including a cleared clipping
array. Visual browser review remains necessary for GPU output and comfort.
