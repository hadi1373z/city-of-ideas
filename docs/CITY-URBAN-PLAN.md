# A sixfold civic core and inhabited districts

The November 17 layout moves real public houses, their doors, furniture,
colliders and arrivals. It replaces the isolated outer houses and crowded
artist arrangement with connected districts. It adds no new account, asset,
private save format or large destination board.

The Gallery stays at `(0,0)`, Transformations at `(125,0)`, the park and living
pond at `(0,-330)`, and the three mathematical pavilions retain their positions.
Escher stays at `(228,115)`, beside its existing museum threshold. The lower
face, underground museums and the complete Proof Atelier footprint stay fixed.

- Freud, Chomsky and Borges face east toward the western letters court. Its
  walk joins the philosophers' lane and Gallery approach.
- Calvino, Ada and Le Guin face west toward the eastern making court, beside
  the study houses and Makers' Library.
- The fifteen artist destinations form garden, form/perspective and working
  studio courts. Fourteen houses move; Escher stays fixed. Saved source gallery
  editions keep their own coordinates and contents.
- Noether, Mirzakhani and Cage form a southeast garden crescent reached from
  both the Gallery and artists. This keeps the southwest free for personal
  homes, including their existing entrances and expanding source lots.

The November 17 refinement adds a deliberately symmetric civic core. A regular
hexagonal avenue of circumradius 108 m is rotated 15 degrees, avoiding the
three retained mathematical pavilions rather than cutting through them. Six
short view avenues join a circular Gallery promenade at radius 76 m. Twelve
small hexagonal courts form six reflected pairs. The avenues and court shapes
have actual sixfold rotational and reflection symmetry. Six outer approaches
bend around existing buildings and join the inhabited districts; the complete
city is not claimed to be globally symmetric. The park, private homes and
substantial existing destinations retain their footprints.

`src/city-urban-plan-model.js` defines this core, the outer civic circuit,
district approaches, twenty paved courts, protected home area and deterministic street planting.
`src/city-urban-plan-scene.js` builds batched paving, low planted edges and
seats. The twelve open civic courts share just two additional geometry batches;
they contain no bench, sign or planter in their walking area.
`coastal-city-scene.js` renders the streets and applies their tree/seat
collisions. Artist lanes and doorway branches use the shared artist plan;
study branches derive from the study-house data. Existing shoreline and park
routes remain in the network.

The artist plan SVG and three coastal SVGs are generated from the same layout
data. The coastal maps now display actual source floor outlines rather than
uniform dots: rotated foundation homes, philosopher floors, artist galleries,
studios, the circular Noether house, the two other seminar houses, Origami,
the Proof Atelier extension and Escher's rear museum connector. Hover titles
identify the buildings; restrained district labels preserve readability.
The version-2 map displays the actual Transformations hexagon in place of
the old mountain marker. The southwest reserve is shown without accessing or
drawing personal saved home designs. Translated text never mirrors geography.
Regenerate using `tools/render-artist-quarter-plan.cjs`
and `tools/render-coastal-plan.mjs` after future public-layout changes.

`tests/city-urban-plan.mjs` samples the streets against actual foundation,
seminar, study, philosopher, pavilion and new planting/seat colliders; samples
the entire width of every new core/approach against actual source artist
architecture and furniture, the studios, Escher and Transformations; verifies
the sixfold/reflection court pairs and exact map projections;
verifies
that public entries connect to the Gallery's existing west exit; protects the
saved-home area; and bounds the new court draw calls. Artist tests additionally
walk every actual artist door/branch and retained source-edition lanes. Coastal
and origami tests verify the map and the complete source coastal walking route.
These checks do not claim user-tested enjoyment or arbitrary oversized private
house footprints outside the original lot contract.
