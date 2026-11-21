# The main city's paper house

The existing Origami house keeps its footprint, boat route, crane lesson, rigid
Miura model, crease laboratory and explicit-save private notebook. The house now
expresses the folds physically: a clipped, flat Miura crease floor continues
through the room, and two glazed roof strips cut actual openings in the folded
roof plates. Glass never overlays an opaque plate. Roof framing is instanced.

At each nearby physical desk, a compact nonmodal workbench leaves the model
visible. Explicit station travel places the camera before facing the work.
The fold slider updates the same control and table cells while preserving an
unsaved notebook draft. Keyboard movement closes the workbench; typing into a
field keeps it open. Touch arrows use the existing movement-return convention.
Full reading remains modal, and the original mathematical limitations and
source links remain available.

Architecture checks raycast actual roof holes, glass and complete floor coverage;
UI checks cover live updates, movement return, private drafts and the original
boat-to-shore journey. Browser inspection confirmed the visible sheet folding
and flattening alongside the controls. This is a rigid-panel teaching model,
not a paper-material simulation.

The next detail pass makes the entrance visible from the street: a supported,
closed Miura canopy uses the same rigid-panel construction as the main desk.
Its two posts stay outside the four-metre approach, and the existing paper cranes
are larger. The shared urban footprint and EN/DE/FA maps include the canopy.
The house now occupies the north side of the shared paper/seminar courtyard in
hex(−1,3), at(79.67433714816835,385), facing +Z. Arrival is
at(79.67433714816835,401), with its threshold atZ396 and inside arrival atZ390.5.
Noether and Cage face it from(45.67433714816835,437) and
(113.67433714816835,437). The shared court runs atZ414 and joins the eastern
hex edge at(159.3486742963367,414). The old Escher-side Origami paths are removed.
These placements and paths share PAPER_SEMINAR_COURT in city-hex-layout.js;
map labels and the coastal walking guide use the same live coordinates.

Surface eligibility uses actual feet height. Walking in the Escher museum below
the same x/z cannot display Origami's prompt, claim its region or operate its
paper model. Existing folding progress, boat activity and notebooks are retained.

## Step-by-step 3D construction

The front desk now holds an inclined, supported folding cradle. Visitors choose
the dog or cat face lesson, read each original instruction, play or reverse the
selected fold, scrub its motion, and rotate the entire display. Guide creases
fold and reopen; the cat's behind-fold moves behind the sheet. Setup and final
hand-drawing steps remain stationary. Playback stops after one step, pauses on
leaving/closing/foreign reading, and reduced-motion mode uses manual scrubbing.

origami-fold-workbench.js splits the existing lesson polygons at the crease and
rotates moving panels rigidly about it. Completed diagrams agree with the
original lessonStates; one zero-thickness sheet retains its total area and panel
edge lengths. This does not model paper stiffness, thickness or self-collision.
The existing boat and crane activities remain distinct; their milestone sketches
are not presented as a continuously simulated construction.

The new workbench uses visit-local state and preserves the explicit-save private
notebook. Tests exhaust1414fold frames and31084panel edges, check clearances,
reverse replay, stable buffers, UI playback/slider behavior and unchanged notes.
