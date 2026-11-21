# The glazed Gallery threshold

The21 November close view showed the original entrance as a heavy dark portal
and an almost unreadable overhead name. gallery-entrance.js now keeps the same
sliding-glass construction but uses restrained warm-bronze mullions, a warm
ivory header fascia, narrow flush reveals and dark lettering on both sides.
Two fine bronze header seams finish the fascia. Four tiny self-luminous edge
strips make the fixed sidelights legible without adding a PointLight or casting
a new glow over the surrounding trees.

All original door poses and operation remain: the two opposite ground openings
stay at facade radius57.75m, with their source porch floor atY.395m. Retracted
leaves remain parallel to the glazing beside the2.5m clear corridor. The top of
the header still meets the existing transom at worldY3.875m. Tall outer mullions
continue into the upper glazing. Nothing creates a new awning, deep portico,
projecting arch, ramp, slab, ground surface, tree reserve or private-data write.

The original translated Gallery name and city-language repaint mechanism remain
the authority. Each side has its own FrontSide label and opposite rotation;
lettering is never mirrored through a shared double-sided plane. Labels sit
13mm in front of the header face and are genuinely the first visible surface
from their respective approaches.
Their local UVs crop only the shared sign canvas's transparent margins, making
the existing Persian/English/German name more legible within the same fascia.
The original translated canvas and its live language repaint remain unchanged.

tests/gallery-doors.mjs executes the real source architecture and actual door
builder together. It checks both opposite entrances, retracted leaves, body
rays out toX+/-1.24m at four heights in both directions, all upper glazing and
the exact facade/transom connection. It also checks the lighter materials,
bounded flush reveals, zero added lights and actual unobstructed front-facing
name planes. Walking controllers, gallery.js slabs and source tree geometry
are owned elsewhere and unchanged by this finish pass.
