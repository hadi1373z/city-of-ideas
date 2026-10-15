# Head-width gallery stairs

Current specification: actual straight steps, one snake-head width, carrying the existing snake drawing and climbing in the snake's direction. The measured head contour spans reference pixels 263–351 on a 596-pixel-wide image mapped to 96 city units. Both head and staircase width are 14.1745 units.

Three flights connect all four gallery levels. Each has 40 horizontal treads, 0.2-unit vertical risers and 0.28-unit tread depth. The flights begin at world (43, 0) and ascend toward positive Z, matching the head's mouth direction along the gallery edge. Floor landings connect successive flights; the guided climb follows those landings. Manual entry, exit and descent work at both ends.

The original attributed ouroboros reference texture is shared with the staircase. World-coordinate projection keeps its scale and orientation consistent across the floor, treads and risers. The staircase borrows this texture without owning or disposing it. Separate raised eye details are omitted wherever an upper floor has a stairwell opening, avoiding floating duplicate eyes above the painted steps.

Upper floor slabs and their decorative drawing share the same rectangular opening bounds; crossing ceiling beams are omitted. Handrails and opening guards leave both ends open. The floor map follows the new orientation. The baby-facing doorway, lift, book chapters and original mountain route remain available.

Verification: full source/integration release suite passed. Geometry tests cover all 120 real tread surfaces, exact 1:1 width ratio, heading along the snake, shared drawing texture, four-level heights and both entry directions. Real Chromium checks cover manual ascent/descent, the guided climb to level four, 120 headroom rays and inspection of the artwork from above.

The internal gallery-spiral.js filename and diagnostic factory remain compatible with existing callers; visible labels say stairs.