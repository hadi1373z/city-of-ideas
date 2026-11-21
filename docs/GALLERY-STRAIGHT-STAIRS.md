# Head-width gallery stairs

Current specification: actual straight steps, one snake-head width, carrying the existing snake drawing and climbing in the snake's direction. The measured head contour spans reference pixels 263–351 on a 596-pixel-wide image mapped to 96 city units. Both head and staircase width are 14.1745 units.

Four flights connect all four gallery levels and the roof. Each has 40 horizontal treads, 0.2-unit vertical risers and 0.28-unit tread depth. The flights begin at world (43, 0) and ascend toward positive Z, matching the head's mouth direction along the gallery edge. Floor landings connect successive flights; the guided climb follows those landings. Manual entry, exit and descent work at both ends.

The original attributed ouroboros reference texture is shared with the staircase. World-coordinate projection keeps its scale and orientation consistent across the floor, treads and risers. The staircase borrows this texture without owning or disposing it. Separate raised eye details are omitted wherever an upper floor has a stairwell opening, avoiding floating duplicate eyes above the painted steps.

Upper floor slabs and their decorative drawing share the same rectangular opening bounds; crossing ceiling beams are omitted. Handrails and opening guards leave both ends open. The floor map follows the new orientation. The baby-facing doorway, lift, book chapters and original mountain route remain available.

Verification: full source/integration release suite passed. Geometry tests cover all 160 real tread surfaces, exact 1:1 width ratio, heading along the snake, shared drawing texture, four book-level heights and roof and both entry directions. Real Chromium checks cover manual ascent/descent, the guided climb to the roof, 160 headroom rays and inspection of the artwork from above.

The internal gallery-spiral.js filename and diagnostic factory remain compatible with existing callers; visible labels say stairs.
The roof now connects to the four-turn mountain summit through a broad crawling path; see [Gallery roof and crawling connection](GALLERY-ROOF-CRAWLING.md).

The physical floor cuts include an80mm construction allowance beyond the
treads. Five flush stone/ink aprons now complete those joints, including the
ground threshold over the Babel continuation. They stay wholly within the
existing rectangular cuts; the exact tread width, opening, heights, model
route and roof headroom remain unchanged. The first/last ends and stepped
soffit returns are closed. Existing cheek and bottom faces now point outward,
so the real one-sided material stays visible when viewed from below. All
joinery shares the existing stair geometry, material and borrowed drawing.

`tests/gallery-stair-joins.mjs` builds the actual source floor rings with their
actual entrance rotation and the real Babel continuation. It checks225
single-owner support rays across all five levels,1280 bottom/side/end/soffit
rays and600 headroom probes including the actual Babel continuation. The original160-tread, Babel, doorway, roof and
surface-owner suites remain required.
