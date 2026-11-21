# Public artwork exhibition database

The isolated `src/art-exhibition/` subpage contains280 records at
`/city-of-ideas/art-exhibition/`. All280 objects retain their pre-online fields,
including all212 earlier accepted records and original100 notes/questions.
All80 accepted local CC0 JPEGs and75 city bindings remain unchanged.

## Image sources versus loaded pictures

There are173 image-bound records:80 local files,75 existing city image bindings
and21 official online Chicago bindings, with overlaps.19 records gain their first
image source from this online addition. This is not proof that173 remote pictures
have decoded. `image_bound_records` reports sources; the page separately reports
actual loaded, awaiting and failed image states for the current view. The legacy
`counts.visible_artworks` field means source-bound records only.

All100 cached Chicago objects have image IDs; only21 carry the museum's
`is_public_domain=true` flag. `remote-image-bindings.json` preserves those flags,
image IDs and documented843px URLs.79 false flags receive no inferred permission.
107 records remain without permitted image bindings. Every one remains searchable
and is listed in `missing-images.json`.

The city tab shows75 genuine works already displayed by public city owners:
60 original artist-gallery works, three studio paintings, four Dali paintings,
four Escher lithographs and four artifact photographs. Sculpture photographs,
documentary photographs, designs, prints and artifacts are labelled separately
from paintings. Repeated frames and source copies do not inflate the count.

Separate city bindings preserve source versions and credits; Cleveland and
Indianapolis Red Fuji impressions remain distinct. Public runtime resolves
existing city pictures relative to the city files. The standalone download uses
public absolute URLs for those dependencies and needs internet. No additional
copy of the reserved Escher/Dali images is bundled.

## Refresh and verification

Canonical study: sibling `../art-exhibition-catalogue/`. Run its
`node work/validate.cjs`, then refresh this runtime package:

```text
node tools/package-art-exhibition.cjs
node tools/check-art-exhibition.cjs
```

The existing recursive build copies the page. Check a completed build with
`node tools/check-art-exhibition.cjs _site/art-exhibition`. Counts derive from the
shared database/summary. The publication manifest records exact payload hashes.
Only runtime data,80 images and source audits are copied; research scripts,
screenshots, preserved snapshots and ZIP files are excluded.

Source checks verify280 objects preserved,80 exact image hashes,75 existing city
hashes,21 cached public-domain flags/image IDs, CSV, filters, all city viewers and
load/error counter functions. These tests are not browser decoding or layout
proof. Parent browser review supplies that evidence separately; earlier
80-image/212-record screenshots remain historical.

## Rights and access

Local CMA files retain individual CC0 metadata. City sources report14 CC0 files,
53 other public-domain/source-specific reproductions and eight reserved images.
Existing display is not a new licence or worldwide public-domain declaration.
All20 Escher source records retain their verified print techniques; four have
existing city pictures,16 remain official viewing references. No generated
substitute is presented as a genuine artwork.

A normal Chrome visit automatically completed the museum's source verification
and displayed the genuine Turner image. The earlier automated403 did not prove
museum permission denial. One successful top-level image does not prove every
embedded image loads. Failed cards retain museum and official-image links.
No cookies or secrets were exported. Commons429 requests were not retried.
Full source, image rights and access audits remain in the public data/provenance.

This is a separate exhibition; it does not change the city's3D scenes or visitor
data. It uses no account, external scripts, visitor storage, analytics or API key.
