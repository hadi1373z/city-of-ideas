# The Mathematics floor as a quiet information display

The lower Mathematics **ground-floor annulus** now carries seven rotating,
original English mathematics and computing cards. This replaces the proposed
mirror direction. It is an opaque floor display, without reflections, glass,
another floor mesh or a new light.

`installFloorFacts(M,T)` borrows the existing mesh whose
`userData.gallerySurface` is `floor`, at lower-local Y .13 and radii 19–58 m.
It replaces only that mesh's material. Positions, indices, normals, the open
stair shaft and all walking/collision rules remain the original ones. Other
architecture shares the former stone material, so it is neither changed nor
disposed. The new material includes the renderer's standard clipping hooks,
including `mvPosition`, so cylinder section passes can still clip the floor.

One 1024×768 CanvasTexture is sampled in four repeated radial cards centred at
radius 40 m. Each card is 20 m across and 13.5 m deep; its complete corners stay
within radii 30–48 m. The top of each card points outward and reads from the
inner circulation aisle. The existing proper lower-world half-turn is applied
once by the host; card text never receives an additional inversion.

Radii 19–25 and 51–58 stay plain and calm. The existing r39 brass inlay passes
through the deliberately empty gap between each diagram and its body text.
Each floor card uses one 12–20-word hook and an original diagram. The full
35–50-word qualified explanation remains in the optional reader. All drawings and
wording are original City of Ideas material; no source image, recording or external mesh is used. The canvas is
redrawn only when the selected fact changes. Floor hooks use at most three
large lines with generous empty space; the floor is not a paragraph-sized carpet. Automatic changes fade the card
through its own background, without animating the walking surface.

## Facts, qualifications and sources

- **Birthday matches:** 23 independent uniform 365-day birthdays give
  `1 − ∏(1 − i/365) = 0.5072972343239857` for at least one matching pair.
  There are 253 unordered pairs. This is distinct from a designated person's
  birthday matching someone else. The assumptions and experiment are supported
  by [Harvard CS50's original probability exercise](https://cs50.harvard.edu/college/2026/fall/psets/6/probability/).
- **Möbius band:** one continuous ideal surface and one boundary; a continuous
  local normal along the centreline reverses after one circuit and returns after
  two. The physical-thickness qualification remains explicit. The direct museum
  reference is [Escher in The Palace's Möbius Strip II](https://www.escherinhetpaleis.nl/en/about-escher/masterpieces/mobius-strip-ii).
- **Königsberg bridges:** the original seven-edge graph has degrees 5, 3, 3 and
  3. Four odd vertices obstruct an edge-once trail. The source is
  [Euler's argument in Alexander Aycock's university-hosted translation](https://download.uni-mainz.de/mathematik/Algebraische%20Geometrie/Euler-Kreis%20Mainz/E53.pdf),
  particularly paragraphs 8–9. The card does not mistake the route for a
  vertex-once Hamiltonian problem.
- **Life glider:** the five-cell B3/S23 pattern reproduces its shape after four
  generations with translation (1,1). Cells switch state; individual cells do
  not physically travel. The simulation is verified independently in the local
  test and supported by section 2.7 of
  [Edward Powley's cellular-automaton thesis](https://www.cs.york.ac.uk/nature/group/theses/EdPowley.pdf).
- **Infinitely many primes:** multiplying a finite prime list and adding one
  produces a number with a prime factor missing from that list. The number need
  not itself be prime: 30031 has factor 59. This follows
  [Euclid, Elements IX.20, in David Joyce's edition](https://mathcs.clarku.edu/~djoyce/elements/bookIX/propIX20.html).
- **Three bits:** three binary choices have eight settings; equal probabilities
  give three bits of entropy. Unequal probabilities can lower entropy, rather
  than invalidating the eight-setting capacity. The direct primary source is
  [Shannon's 1948 paper](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf).
- **Universal simulation:** a fixed universal Turing machine can simulate a
  described machine. This does not decide all mathematical questions or whether
  every simulated program stops. See section 6 of
  [Turing's original paper](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf).

## Timing, controls and ownership

One fact lasts about 36 seconds with a 1.1-second fade around a change. The city
update clock owns timing; there is no interval or independent animation loop.
The sequence runs only on the actual lower ground floor, with a visible page
and no reader/map/modal/immersive-sky view. Hidden or off-floor time cannot
catch up through missed cards. Reduced motion defaults to manual changes.

A compact **Read the floor** button appears near a card, above the folded
reading guide and reserved mobile movement zone. Its width follows the label
rather than forcing the label to wrap. Its close button dismisses this optional hint. The
optional DOM reader presents the same full text, a question and source links,
plus Pause/Play and Next. It never opens automatically or announces a changing
fact every 36 seconds. Existing original-paper and sculpture actions retain
priority. Keyboard E is captured only for a valid nearby floor action; the
actual floor is also a normal picking target for controller fallback.

API: `M.floorFacts.visit()`, `.open()` / `.interact()`, `.next()`,
`.setPlaying(boolean)`, `.fact`, `.playing`, `.near`, and `.dispose()`.
`visit()` uses a real safe ground-floor pose at radius 29 m looking outward.
Disposal restores the borrowed material/metadata and previous hooks, releases
only the owned material/texture, removes targets/controls/listeners and restores
diagnostic attributes. No personal storage, account, voice or catalogue asset
is read or changed.

`tests/floor-facts.mjs` checks all seven numerical/graph examples, card
orientation and bounds, the real borrowed annulus under the lower half-turn,
preserved geometry and shared stone, clipping hooks, timing/fades, every card
draw, DOM source links, physical/floor/modal gates, keyboard priority,
reduced-motion manual access, hint dismissal and exact cleanup.
