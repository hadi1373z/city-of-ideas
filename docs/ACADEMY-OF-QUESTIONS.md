# Academy of Questions

The approved six-house sketch replaces the previous philosophy rows in the main city. Six equal Greek-inspired courtyard houses face inward around a regular hexagonal square and continuous shaded stoa. This is an original city interpretation, not a reconstruction of Plato's historic Academy.

`academy-layout.js` is the authority for the six sites, rigid local/world transforms, door directions, shared routes, gateway and map/planting footprints. Centres sit40.6m from the quarter centre, each house has a14m regular-hexagonal wall and an open peristyle court. Real pitched terracotta roof rings shelter perimeter rooms; a columned porch connects each inward door to the common walk. The common court remains open above. Its benches and columns leave three body lanes clear along all routes. The west street approach turns outside the gateway before entering straight between the columns.

`philosopher-data.js` retains the six original identities, bilingual lessons, source URLs and reflection IDs: Plato, Aristotle, Epicurus, Ibn Sina, Confucius and Hypatia. There is one Plato house. `philosopher-quarter.js` builds supported roofs, actual wall apertures, real books/idea objects, furniture and shared paving with bounded vertex-colour batches and no new lights. The reading book is at local(3.9,1.36,-8.4), its desk moves with it to clear a peristyle column. Study points and colliders use the same rigid house transforms. All private reflection storage remains unchanged.

The urban model shares actual house/porch/stoa/gate footprints with the generated honeycomb layout, roads, coast maps and crown clearance. The common paved court is reserved from street trees. The crown regression projects the actual rotated house geometry rather than treating empty corners of a world-aligned bounding box as built space.

Verification: `tests/philosopher-quarter.mjs` checks connected routes, six identities, real solid boundaries and source links. `tests/philosopher-architecture.mjs` checks21,582 body rays, continuous floors, sheltered perimeter rooms, open courts, bounded geometry and idempotent resource disposal. `tests/city-urban-plan.mjs` checks the composed streets, current footprints and actual crown bounds.

Approved architecture boards: `design/academy/six-house-academy-approved-20261120.png` and `design/academy/courtyard-house-approved-20261120.png`. The room geometry interprets their equal-house plan in the existing game's visual style.
