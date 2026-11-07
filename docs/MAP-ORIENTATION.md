# Map orientation — 2026-11-07

Critique: the overview could identify destinations but not the visitor. A person
walking away from a familiar entrance had to guess where they were and which
way they were facing. That weakened free exploration despite the new map.

The overview now takes an in-memory snapshot of the current walking coordinates
whenever it opens. A hollow blue compass halo marks that position without
covering the destination number or intercepting its button. Its arrow and text
show geographic facing. Persian keeps east and west fixed. A selected place
shows a clearly labelled horizontal map distance, not a route length or ETA.
The marker does not move when a different destination is selected.

Below-gallery visitors receive a dashed halo and an underground label. Positions
outside the island (including the separate Graveyard world and ocean sailing)
receive an explanation instead of a false point clamped to the shore. Invalid
coordinates are omitted. No position is saved or transmitted by this feature.
The existing five landmarks, SVG geometry, route guide and travel remain intact.

Model/copy: `src/coastal-position.js`. Rendering: `src/coastal-map.js`.
The existing overview integration passes the current player position, yaw and
Babel active state. Automated checks cover the map projection, headings/wrap,
invalid and off-island input, localized strings/numbers, underground disclosure,
selection versus position, private storage and preserved original geometry.
Native browser review covers actual walking/turning followed by reopening,
keyboard selection, Persian RTL and an actual Babel underground arrival.

Reassessment: visitors can now locate and orient themselves. It remains a
snapshot, not live GPS guidance. Distances are horizontal map distances; the
feature does not compute a collision-safe path, walking time or indoor floors.
The hourly house-detail series remains separately unmerged in PR #5.
