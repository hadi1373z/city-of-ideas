# Archetypes quarter

Four built, public houses occupy the validated empty honeycomb cell centred at
(-318.6973486, 276). The quarter occupies a 55 m radius and is separate from the
small existing Freud house and the design-stage House of Psychoanalysis. No
existing residence, private content or character voice has been moved or changed.

## Physical rooms and routes

The four 18 × 18 m houses sit at the cardinal offsets ±31 m, facing a central
court. Their original silhouettes are gabled, paired, shallow gabled and stepped.
Every house has a continuous supported floor at Y .13, a roof, solid rear/front
walls, true side-window apertures with glass, a 3.5 m high open entrance and
grounded porch columns. Actual jambs leave a 3.08 m wide doorway. A table and
bench remain outside the two metre central walking aisle. Three court benches
leave all four spokes and the southeast street connector unobstructed.

`archetypes-quarter-model.js` is the shared source of footprints, level door
paths, the southeast connector, entry transforms, body obstacles and interaction
gates. The street agent owns broad paving and tree clearance; this scene owns
house/porch slabs and a small court inlay. The connector runs from the court via
(+22,+22), (+22,+58) to the actual honeycomb vertex (0,+92). Roof/porch footprints
include the full local Z 12.5 m overhang. The level route and every house doorway
are physically reversible.

## Stories, concepts and working objects

English is the default for new learning content. Each house has three original
narrative stages totalling 159–176 words, a 67–72 word concept, an explicitly
labelled original Jungian reading, another cultural/historical reading and a
critical question. The selected pairings are proposed by this project; they are
not claims that Jung interpreted these particular narratives.

| House | Story | Original table mechanism |
| --- | --- | --- |
| Masks / Persona | Dionysus and Pentheus, Euripides’ *Bacchae* | A cut-out geometric mask turns and two open profiles appear. |
| Encounter / Shadow | The changing Akkadian Gilgamesh/Enkidu arc | Two abstract forms turn, meet and stand beside an empty place. |
| Crossroads / Trickster | The newborn Hermes, Homeric Hymn 4 | Track arrows reverse and a seven-string lyre turns toward an exchange marker. |
| Seven Gates / Transformation | Inana’s descent, Oxford ETCSL 1.4.1 | Seven tokens are removed at miniature gates; a return path retains an obligation marker. |

The reader has Story, Concept, Interpretation and Sources & image sections. Stage
controls update real scene objects manually; there is no automatic animation or
new scene light. There are 91 mesh draws in the standalone quarter, with repeated
stone, joinery and gate components instanced. New writing distinguishes a useful
social persona from lying, includes positive unrealised capacities in shadow,
and preserves the costly conditions of Inana’s return. It treats Jungian theory
as a historical interpretive framework, culturally specific myths as more than
psychological examples, and archetypes as no fixed universal/personality list.
There is no quiz, diagnosis, assessment or religious truth claim.

## Genuine images and attribution

Four interior walls display genuine Metropolitan Museum of Art Open Access
images. All four object API records returned `isPublicDomain: true` and a nonempty
`primaryImageSmall`. The exact returned bytes are preserved in `*-original.jpg`;
separate `*-display.jpg` files are proportional JPEG derivatives without crops or
retouching. The originals and derivatives total about 410 KB. Each plane and
reader image preserves the actual source aspect ratio. Loading is asynchronous;
an unavailable texture leaves its contextual caption and source links available.

The authoritative local record is `src/assets/archetypes-quarter/credits.json`,
which records object IDs, titles, cultures, dates, credit lines, object/API/image
URLs, CC0 links, source/display dimensions, modifications and both SHA-256 hashes.
The reader exposes that record, the unchanged source image and museum links.

| Met object | Cultural context and caption limit |
| --- | --- |
| [241313](https://www.metmuseum.org/art/collection/search/241313) | Dionysos mask, Cypriot, 2nd century BCE(?); later than the play, not its stage illustration. |
| [324421](https://www.metmuseum.org/art/collection/search/324421) | Sumerian contest seal and modern impression, ca. 2600–2350 BCE; identification of such heroes as Gilgamesh/Enkidu remains uncertain. |
| [251800](https://www.metmuseum.org/art/collection/search/251800) | Attic lekythos with Hermes, attributed to the Tithonos Painter, ca. 480–470 BCE; the traveling god, not the cattle-theft episode. |
| [327044](https://www.metmuseum.org/art/collection/search/327044) | Babylonian openwork plaque, ca. 2000–1600 BCE; rosettes are identified by the museum as Inanna/Ishtar symbols, but the function is uncertain and the object does not depict the descent. |

Narrative sources are [Euripides via Perseus](https://atlas.perseus.tufts.edu/library/urn:cts:greekLit:tlg0006.tlg017.perseus-eng2/),
[Homeric Hymn 4 via Perseus](https://atlas.perseus.tufts.edu/library/urn:cts:greekLit:tlg0013.tlg004.perseus-eng2/),
[Oxford ETCSL](https://etcsl.orinst.ox.ac.uk/section1/tr141.htm) and
[Ira Spar’s Met essay](https://www.metmuseum.org/essays/gilgamesh).
The Hermes text was additionally checked against the
[Perseus scholarly XML edition](https://github.com/PerseusDL/canonical-greekLit/blob/master/data/tlg0013/tlg004/tlg0013.tlg004.perseus-eng2.xml),
Hugh G. Evelyn-White’s 1914 translation. No wording is reproduced from that text.
Conceptual sources include IAAP’s articles on
[persona](https://iaap.org/jung-analytical-psychology/short-articles-on-analytical-psychology/persona-2/),
[shadow](https://iaap.org/jung-analytical-psychology/short-articles-on-analytical-psychology/the-shadow/)
and [Jung’s Collected Works 9.1 abstracts](https://iaap.org/resources/academic-resources/collected-works-abstracts/volume-9-1-archetypes-collective-unconscious/).
The reader also links Princeton’s *Four Archetypes* publication record. All
retellings, questions and interpretations are original writing, without quotations.

## Integration, gates and privacy

Install `installArchetypesQuarter(M,T)` after visitor memory and the city scene
are available. Include `archetypes-quarter.css`. The public API is
`M.archetypesQuarter` / `window.CITY_ARCHETYPES`:

- `visit(id)` arrives at an actual exterior door; it never opens the reader.
- `visitCourt()` arrives in the open court.
- `interact(id)` / `open(id)` opens only from the correct physical room, at
  ground eye height, in city mode, in range and without another modal.
- `setStage(id,n)` changes one temporary story state, with physical/mode/height
  and foreign-modal checks. `state` has no storage of its own.
- `dispose()` removes owned targets, resources, UI and applicable wrapper hooks.
- `built.ready` resolves after local image success/failure, and resolves safely
  on early disposal. Late textures are released exactly once.

`startExtra('archetypes-quarter')` and `startExtra('archetype:'+id)` supply map
destinations. Matching `?arrival=` values reach those same real entries. Target
inspection and room tools use the physical reader gate; crossing a roof height
or selecting an object through a wall does not enter a room. Exiting, changing
mode or changing height closes an open reader. Source references are static
links; there are no external runtime content requests or new services.
An immersive telescope view, hidden document, map, book reader or exhibit panel
pauses all quarter controls. The temporary room hint has its own dismiss button
and stays above the shared touch-control clearance on small or coarse screens.

Only clicking **Carry this question** calls the existing
`M.visitorMemory.store.question('archetype-'+id,'personal',prompt)`. No visit,
stage change, tab, drawing or reader opening writes a note, discovery, answer or
assessment. Missing/full/unavailable storage produces copyable feedback instead
of claiming success. No direct local/session storage, new account, voice change,
or private-data migration is used.

## Checks

Run `node tests/archetypes-quarter.mjs` and
`node tests/archetypes-quarter-ui.mjs`. The tests raycast actual rotated and
instanced door/headroom/wall/window/roof geometry; sample every public path and
reverse exit; check real obstacles, story lengths and scene state; verify all
eight image hashes and JPEG sizes; and exercise storage failures, foreign modals,
height/mode/room gates, delegated city hooks and asynchronous resource cleanup.
Integrated city/map/browser checks remain part of the root integration run.
