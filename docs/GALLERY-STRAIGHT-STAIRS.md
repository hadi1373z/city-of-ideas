# Straight gallery stairs

Replaces the circular ramp following the user's correction: actual stairs, with each flight three times the snake head's width. The measured head contour spans source pixels 263–351 on the 596-pixel-wide reference mapped to 96 city units: 14.1745 units. The staircase width is exactly three times that, 42.5235 units.

Three stacked straight flights connect the four levels. Each has 40 horizontal treads, vertical risers of 0.2 units and a tread depth of 0.28 units. Flights run from x=43 at the head to x=31.8. Visitors use the floor landings around the side of the stairwell to reach the next flight. The guided climb follows these landings without circling the gallery. Both ends of every flight support manual entry and exit, including descent. The doorway still faces the mountain baby.

Upper floor slabs and their decorative inlays share a rectangular opening; crossing ceiling beams are omitted. Handrails and opening guards leave the ends open. The floor map shows the broad rectangular stairs. Existing lift, book chapters, exhibits and mountain route remain available.

Verification: full source/integration release suite passed. Geometry tests raycast every one of the 120 tread surfaces, check exact width ratio, stepped heights, all four levels, both entry directions and gallery-safe landing coordinates. In a real Chromium preview, manual ascent and descent worked, the guided route reached level four, and 120 upward rays found no head obstruction over any tread. The screenshot was inspected from the flight's side as well as from the walking view.

The internal `gallery-spiral.js` filename and diagnostic factory name remain compatible with existing callers; visible labels now say stairs.
