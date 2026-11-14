# Gallery ground-floor stair entry

This follow-up to f9c204807db5eeb9b73735a27a25175bdc06ace1 restores an
ordinary frontal walking approach onto the first upper Gallery flight.
All 47 first readings and eight Mathematics working floors remain complete.
There is no new geometry, reading, UI, resource or saved state.

## Reproduced handoff failure

The actual f9 Gallery `constrain` and Babel `guardGallery` functions reproduce
the native stall at X39.333829619 / Z-.052319856 / feet .395. A normal .2 m
forward movement proposed Z.147680144. Babel's opening guard ran first,
rejected a point beyond its Z.08 low-end allowance and restored the previous
position. The Gallery's existing valid stair entry was never consulted.
The same source guard remains on separate main e646bb2.

This is controller ownership at the shared front edge, not a missing tread.
All 160 upper and forty Babel treads, openings, soffit, two bearers and four
new bearer joints remain exact.

## Bounded correction

A three-line precheck in Gallery `constrain` delegates to the original
`updateGalleryAscent` only when:

- the actual Gallery source floor is zero;
- feet are within .01 m of the original Gallery base .395;
- the proposed Z increases from the supplied previous position; and
- the original `gallerySpiral.entryAt` returns a finite route position.

That original gate keeps its .28 m side inset, strict original run and
previous-position tolerance. Its admitted rectangle lies inside the unchanged
annular walking bounds. The original controller owns height, progress and floor
updates; the correction does not turn, centre or otherwise place the visitor.
Nonmatching moves continue through the unchanged Babel opening guard and
original Gallery constraints. No widened void, invented support or collision
bypass. Standstill/ordinary pose restoration does not qualify for this precheck.

Babel's entrance, direction/height/width guards, `begin`, `step`, `leave`,
look and held-input behavior are unchanged. Main e646bb2's separate walking-exit
pose/input and Controls/help/dock/mobile changes remain intact and unintegrated.
This review makes no verification claim for that separate main behavior.
The Gallery script cache key advances; integration preload/entry still match.

## Source and interaction checks

The regression executes the actual production constraint, original ascent
receiver, Babel guard/begin and shared route factory. It first fails against
the old runtime and passes with the correction:

- 175 frontal crossings in five lanes across frame intervals 1/120..1 second;
- nine retained side-void, height, floor, reverse and standstill cases;
- six original upper-floor forward/reverse entries;
- twenty original Babel descending entries, preserving held input/yaw/pitch;
- five complete source-level upper up/down walks, 41 heights each direction;
- the original explicit stair start with automatic touring still off.

Upper entry calls no Babel begin/cancel/input-clear/travel/locale action.
Private storage/progress/resident/memory and DOM getters are denied for those
crossings. No new renderer constructor, listener, key, model or preference.

All 124 release programs pass. Native ordinary pointer/W walking enters the
upper flight directly in centre/left/right lanes, recording all 41 heights
.395..8.395 up and down in each lane. No angled workaround, pose assignment,
automatic tour or collision bypass. Original explicit entrance and forty-step
Babel descent retain all 41 heights .395..-8. Original explicit Return to
gallery reaches feet .395 / Z12.

Eight first-catalogue pointer/E handoffs retain page0 / aaaaaa / empty prefix /
exact original source / same-pose close in EN/DE/FA/CS. Persian RTL, a held-W
modal-pause check, disclosed Czech English fallback, explicitly saved Czech
after a fresh document and all eleven ready genuine pages pass.

The frontal ground approach, first tread and Persian catalogue screenshots
were visually inspected. Independent headless 1280 x720 QA uses .35 walking
pixel ratio and restores 1. All own QA fields are removed and own browser is
closed. Zero application errors / one existing Three deprecation warning;
hardware controller A remains separately untested. Final explicit LOCAL
881-asset committed-build verification accompanies PR #5, with no default
public verification or deployment.

## Geometry and preservation

Every node/ID/profile/pose stays; no exclusions or relaxed budgets.

| Scope | Meshes / instances | r186 SHA256 | Native SHA256 |
| --- | --- | --- | --- |
| Raw Babel | 65 /41,893 | 7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66 | bfee858c1baef597d394141a48d49912d6aad76f3d9a83c69a8e4bbb58a4bc1d |
| Complete Babel | 73 /43,867 | c3043b5607ac002f942f78c60e71e76d72c42a93d61613594835018d82564e86 | 7448aaec470173d3fc3a474558e1604673045335ed41f2845ac2c95aebad2ccf |
| Full upper Gallery stairs | 290 /0 | ade8ee637f5c19d8ec5d543d1b2e9bf0e4d2ff3096eebe3b001797941dbb208a | ade8ee637f5c19d8ec5d543d1b2e9bf0e4d2ff3096eebe3b001797941dbb208a |

Complete Babel retains 88 owned geometry/material/texture resources and 39
instance buffers. All prior once-only/borrowed/foreign-resource cleanup checks
pass. No new draw, batch, geometry/material/texture/image/light/collider/pick/
reader or private state. All nine existing adapters and earlier independent
raw/prior/historical controls remain strict.

Keep every sourced reading and pointer/E/context/header/footer/Places/directory/
exact-reader route, raw drafts/carets/immutable first answers/keys, original
explicit saves/experiments, EN/DE/FA/CS/Persian RTL/formula LTR and local/global/
saved-language boundaries. Existing English gaps remain disclosed; no city-wide
Czech, invented quotation/testimony/historical object or source-fetch claim.
Reading/locale/rendering do not invoke this movement handoff.

Preserve source/private coordinates/proper lower half-turn, island/Zarathustra,
Babel book/ring/tip/fluids/glow/terraces/shaft, all 480 helical-gallery treads/
middle/well/tunnel/earth cut, eight-floor/24-ID Math wing/real stairs/lift/
central door/Faculty/covered walk, Escher gates/models/experiments/artwork,
eleven genuine scan bytes/editions/credits/rights/sources/zoom, approved cast/
fixed voices/recordings and every full preservation contract.

Same branch / PR #5. Exact Houses/Concurrent text and existing conflict stay;
no new merge, reconciliation or deployment. User's headed preview is untouched.

Next useful review: audit the remaining upper Gallery landing approaches with small frame-sized movements, especially the original .08 m hole margin and .02 m entry tolerance. Inspect actual support faces, previous/current poses and forward/reverse gates across all four retained flights before editing. Preserve this frontal fix, all 160 upper and forty Babel treads, bearer joints, source/private coordinates, original explicit actions and separate main work. Only a bounded correction within the existing physical route or a factual audit; no automatic tour/travel, broad collision bypass, extra geometry or unrelated ornament.
