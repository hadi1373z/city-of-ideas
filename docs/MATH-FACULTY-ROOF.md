# Annular Faculty · roof bearings on the retained gallery

This architectural follow-up continues review `264f988`. All 47 first readings
remain complete. It fits the existing annular Faculty roof to the original lower
gallery's columns and west doorway header; it adds no lot, room, teaching
interior, first reading, historical reconstruction or certification claim.

## Measured installed contacts

The original 192-sided roof remains exact: inner radius21.5/Y11.8 and outer
radius61/Y7.65. The forty existing timber rafters run from radius22.1 to59.4.
Their previous pitch incorrectly used the roof's full4.15m fall over that shorter
span. At radius57.8 on the west axis, the actual roof is Y7.986203 while the old
rafter top was Y7.783541: a .202662m gap. At radius59.2 the gap was .211337m.
Near radius22.5 the old rafter instead crossed .016084m into the roof.
Native installed rays confirm the west-axis values; this is not a measurement
of a hidden source-only roof.

The original gallery has39 retained columns at radius57.8, ending at Y7.33.
The omitted western column is replaced by the existing open doorway: its two
piers carry a header ending at Y6.505. Neither the column tops nor that header
met the old rafter underside. No extra floor column is needed.

## Fitted construction

All forty rafters now follow the actual roof facets. At each angle the builder
uses that facet's radial height, length and pitch, with .002m concealed top
engagement. Their .17m depth and .16m width remain. The roof's surface vertices,
triangles, profile and open oculus remain byte-for-byte unchanged.

Forty short wedge bearings fill the remaining support intervals. Thirty-nine
have .70m radial/.72m tangential bases on the original column tops at Y7.33;
one has the same footprint on the actual west doorway header at Y6.505.
Sloping tops meet the corresponding rafter undersides. On the west axis the
underside is now Y7.817267. The taller western bearing stays entirely above the
real header, leaving the original doorway clear. The other bearings remain
over the retained column footprints. No duplicate column enters a floor aisle,
paper viewing space, west exit or central well.

The two original bronze edges also seat on the actual roof profile, as closed
.035m sections rather than suspended horizontal planes, with .003m concealed
roof engagement to avoid coincident visible underside faces. The oculus rim keeps
its radius21.5..22 footprint. The eave keeps radius60.4..61.1, including its
existing .1m outer projection; its inboard section bears on the roof. Neither
changes the original roof or central opening.

## Scope, transforms and ownership

The original Faculty owner merges the forty bearings into one geometry using
its existing stone material. It adds one owned geometry and one draw:33 instead
of32. Instance count stays1718. Only the forty enumerated rafter instance
matrices change. The two existing bronze geometries are rebuilt by their same
owner; no material, texture, light, instance batch, collider, pick, listener, UI,
progress key or reading is added. All Faculty colliders remain22, original
working-wing source counts remain ground24/upper15, and all16 exact Atlas/floor
targets remain. Proper lower-frame mapping is inherited once.

The repaired covered walk, working-wing entrance/identity/roof, genuine stairs,
lift, all eight floors/24 concept IDs, source/private coordinates, windows,
furniture, voices and recordings remain. Existing EN/DE/FA/CS controls/readings
and Persian RTL remain; no legacy/private text translation is claimed.
Construction and rendering have no private-memory/storage/progress access or
experiment, audio, travel, floor-selection or language-write behavior.

## Verification

`tests/math-faculty-roof.mjs` runs from the existing Faculty release check.
It independently checks3000 rafter/roof intersections across length and width,
560 bearing/base/underside contacts on real retained gallery geometry,1152
closed-rim contacts, the exact original roof surface, clear well and proper
inverted composition. The one added geometry releases exactly once.

The independently measured `264f988` fingerprint keeps all1678 other original
Faculty instances exact. All1736 original lower-gallery instances remain exact,
including columns, doorway, treads, rails and paper pedestals. The earlier
`20c7ad1` fingerprint also remains: only the forty former rafter matrices are
explicitly restored for that historical comparison; the actual new profiles
are tested separately. This does not treat the forty changed rafters as
unchanged. Original colliders/targets,5565 covered-walk/turn samples,28296 source
room envelopes and44 ground-bearing corners remain in the passing check.

All121 release programs pass. Native before/after evidence, walking, language
views, eleven loaded genuine pages and final local asset verification are
recorded in the hourly ledger/PR #5. The user's headed preview remains under
their control. Review only: no merge or deployment.
