# The garden-house facades

The21November screenshot still showed small rectangular windows, dark horizontal
stripes and broad unarticulated walls behind the garden arcade. The live six
houses now use an original optional limestone facade in sixfold-house-facade.js:
three tall arched bays per facet/storey, deep actual window reveals, pale arch
stones, slim recessed bronze frames, corner pilasters and stepped string courses.
The ground doorway retains its original5.6m-wide,4.6m-high rectangular clearance;
its shallow arch begins above that rectangle. The existing named title mounts
on solid masonry above the arch. It is not a sign across a doorway void.

This branch omits the old above-ground walls and dark skirting beams before
building the new perforated walls. It does not place decorative arches over
opaque source windows. The optional gardenFacade flag is false by default in
buildTransformationHouse and enabled only by the six live-house owner. All
eight floors,448 treads, landings, lower walls, furniture, moving shelves,
pendulums, source door positions and native navigation remain unchanged. The
existing patterned roof and lantern are independent and unchanged.

The same flag passes through buildHouseTiling/createHouseWallTiling. Only the
three above-ground storeys use the shared curved opening polygons, expanded
slightly for calm interior reveals. Without this change, the old interior tile
finish would fill the new windows when a near house activated. All five lower
storeys and the entire default legacy finish retain their original crops.

The facade owns three mesh/material batches and one original pale mineral-grain
DataTexture. Values stay in238..253; mipmaps/linear filtering prevent distant
noise. The same actual geometry appears in both near and far presentations.
Original floor and house transforms remain authoritative. Owned resources are
released once by the structural prototype, after its six instances are removed.

The garden paving additionally uses subtle65cm staggered stone courses without
changing any of its positions, colours, holes, grades or two-draw topology. See
SIX-GATE-GARDEN-PAVING.md. No tree or planted bed is changed.

Focused verification: tests/sixfold-house-facade.mjs compares independent3092f82
fingerprints for the complete default house and all walking buffers, checks5760
actual aperture rays(including1280 through activated compact interior finishes),
972 enclosing masonry rays,270 original doorway body rays, six true near/far
transforms, every lower crop and exactly-once cleanup. The existing house-tiling,
sixfold-tilings and patterned-roof checks also pass. Garden stone finish tests
retain the pre-change position/colour/index fingerprints.

The local link ?arrival=garden-houses gives an ordinary ground-level approach
at(92,.13,0), facing the east house through the original arcade gate. Other
arrivals are unchanged. These changes move the architecture toward the approved
Six Gate Garden study; they are not a claim of exact watercolor-sketch fidelity.
The final corrected-grain browser review remained unavailable after the browser
connection failed; geometry/support checks are not a substitute for that review.
