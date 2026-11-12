# Houses of form and listening

Open `?arrival=seminar-houses` for the directory, or visit map markers 6–8.
Direct arrivals: `?arrival=seminar:noether`, `?arrival=seminar:mirzakhani`,
`?arrival=seminar:cage`. The entrances are actual openings in the same city.
Walk through, press E/A while facing an exhibit or in the room, or use the
visible reading action. Hardware controller A is not directly verified; the
existing room/target and focused-button interaction routes are preserved.

## Architecture and connection

Three original architectural interpretations occupy the southern garden, facing
north into one shared lane. They are not reconstructions of historical homes.

- Noether (-104,316): curved stone/glass rotunda, supported brass columns,
  annular roof with open oculus, analytic orbit sculpture and reading table.
- Mirzakhani (0,345): turquoise vaulted ribbons, roof supports, open entrance,
  upright Poincaré disk, endpoint studies and a book table.
- Cage (104,316): butterfly timber roof with attached underside fins, garden
  seating and a sixteen-block original score on a supported table.

The smooth route meets the existing southern lane at (182,210), continues to
(182,282), and branches into all three doors. Benches sit off the walking line.
Existing island geometry, roads and buildings are not moved. Existing map SVG
geometries are unchanged; an additive path overlay and three native markers
locate the houses. Small-screen marker callouts preserve actual anchor pins and
avoid overlapping labels. Original five destinations and the walking guide stay.

## Intellectual scope

Every house has five original reading sections, an interactive mathematical or
critical comparison, a further challenge and links to primary sources. All new
house reading/control copy supports EN/DE/FA/CS. The reader's language choices
are local to these houses; this does not claim full city-wide Czech coverage.
Persian text is RTL; formula blocks and pitch order remain LTR. Explicitly saved
questions enter the existing private notebook; experiment choices never save a
reflection automatically. Drafts and experiment state otherwise last this visit.
The six established Kokoro voices and accepted recordings are untouched.

Noether uses exact solutions of two autonomous ideal oscillators, not integration.
For m=1, L=1/2(vx²+vy²)−1/2(x²+ω²y²), x=3 cos t, y=2 sin(ωt).
With ω=1, H=6.5 and J=x vy−y vx=6. With ω=2, H=12.5 but dJ/dt=−3xy.
Each case is a distinct predefined system; changing cases is not a simulated
mid-motion spring switch. The reading distinguishes continuous symmetry,
Euler–Lagrange solutions, boundary terms and gauge/discrete caveats. Challenge:
general radial potential V(x²+y²). Source: Emmy Noether's 1918 paper, Tavel
translation, https://arxiv.org/abs/physics/0503066 .

Mirzakhani constructs orthogonal circles for the curvature −1 Poincaré metric,
compares exact geodesic distance with numerical metric length of the Euclidean
chord, and distinguishes the simply connected disk from a closed surface.
The advanced section states the asymptotic c(X)L^(6g−6) for simple closed
geodesics on a fixed closed hyperbolic genus-g surface, g≥2; the model does not
compute those counts or prove Mirzakhani's theorem. The physical room is still
Euclidean. Source papers:
https://annals.math.princeton.edu/wp-content/uploads/annals-v168-n1-p03.pdf
and https://www.math.stonybrook.edu/~mlyubich/Archive/Geometry/Teichmuller%20Space/Mirz3.pdf .

Cage distinguishes chance composition, performer indeterminacy and environmental
unpredictability. The original four-second, sixteen-slot score uses a seeded
finite generator over rest and three pitches. It is pseudorandom, reproducible,
and not an implementation of Cage's score or a claim of independent physical
randomness. Sound is quiet local sine synthesis, opt-in, stoppable and bounded;
no microphone, recording, provider, permission or external audio asset is used.
The expected twelve sounding slots belongs to an explicitly ideal independent
uniform model, not a guarantee for each generated sequence. Source museum record:
https://www.moma.org/collection/works/163616 . No image or score is reproduced.

## Implementation and verification

- `seminar-houses-data.js`: shared stable positions, names and paths.
- `seminar-house-models.js`: exact oscillator, disk metric/geodesics/quadrature,
  seeded score and original pitch palette.
- `seminar-houses-scene.js`: owned geometry, batching, colliders and visual states.
- `seminar-houses-copy.js`: original four-language readings and prompts.
- `seminar-houses.js` / CSS: accessible reader, in-room action, notebook and sound.

All 68 release test programs passed. The new tests check oscillator energy and
finite-difference angular-momentum identity, orthogonal circle construction,
distance symmetry and a known radial distance, numerical chord inequality,
seed determinism, four-language copy, all entrances/aisles/routes against the
actual source districts, bounded draws and resource disposal. UI tests cover
room fallback, independent drafts, explicit note writes, phase and case changes,
source links, language/focus and optional sound success/stop/unavailability.

Native browser review walked through all three entrances and opened readings
with E. The broken-rotation case visibly becomes a figure-eight and changes J
while retaining H. Mirzakhani's boundary case gives geodesic 4.2203 versus chord
4.2778; its physical arc changes. Cage's blocks change with the seed; actual
browser sound starts and stops. German and Persian at 623×604 have matching
573px reader client/scroll widths; Persian is RTL. Czech at 390×844 has matching
339px widths; an unsaved synthetic mixed-language draft survives language/case
changes. No browser console errors were logged. The temporary viewport was reset.
The final phone map separates the three callouts. Public deployment and screenshots
are verified separately before claiming the changes live.

The hourly house-detail review series in PR #5 is separate and remains unmerged.
Limitations: these are bounded seminar encounters, not complete courses, a full
hyperbolic world, research-proof assistants or a reproduction of Cage's practice.
