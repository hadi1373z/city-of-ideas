# House of Ideas deployment mapping

Verified read-only on **14 October 2026, 13:14 Europe/Prague**.

The existing [House of Ideas Pages site](https://hadi1373z.github.io/house-of-ideas/) serves its current GitHub build. The separate Sites snapshot contains newer Zarathustra/Park additions that were **not pushed to House of Ideas GitHub**. Sites publication does not update this repository or trigger its Pages workflow.

## Branch, source and build

| Item | Verified mapping |
| --- | --- |
| Repository | [hadi1373z/house-of-ideas](https://github.com/hadi1373z/house-of-ideas) |
| Branch | `main` |
| Source | `web/` |
| Build | [scripts/build-pages.mjs](https://github.com/hadi1373z/house-of-ideas/blob/main/scripts/build-pages.mjs) copies `web/` to `dist/pages/` and sets `data-mode="preview"` |
| Deployment | [.github/workflows/pages.yml](https://github.com/hadi1373z/house-of-ideas/blob/main/.github/workflows/pages.yml) uploads and deploys `dist/pages/` |
| Trigger | Relevant `main` pushes or manual dispatch; no Sites source-transfer step |
| Latest deployed commit | [`a0fca474bf9201d54ed4b154a4c7ba3935f5ae0a`](https://github.com/hadi1373z/house-of-ideas/commit/a0fca474bf9201d54ed4b154a4c7ba3935f5ae0a), “Add six physical exploration objects with offline experiments” |
| Successful workflow | [Run 38417055563](https://github.com/hadi1373z/house-of-ideas/actions/runs/38417055563), the same commit |
| Deployment record | `7041795415`, `github-pages`, status `success` on 13 October 2026 at 16:52:41 Prague |

## Live-byte verification

Independent HTTP requests returned 200 and matched the committed build byte-for-byte for `index.html`, `app.js`, `scene.js`, `residence-scene-v1.js`, `object-market-scene.js`, `exploration-objects.js`, `world-guide.js`, and `object-store/models.json`.

The served HTML SHA-256 was `8ee1aa3b74b510d4fa2506b2e34c96861e7b828b2ef7d193093ad2e27a5ef43a`, last modified on 13 October at 16:52:33 Prague. Cache-busted requests also matched. The cache policy was `max-age=600`. No service-worker file or registration was found in the committed project. These checks verify server content; they do not inspect an individual browser's already-open tab.

## Separate source additions

The downloaded Sites source snapshot has its own HEAD, `48ccb361e8e64857f4e9f94f4598d8dc97970e00` (“Update Site source”), and no Git remote configured. It contains **23 additional web files** absent from House GitHub HEAD, including the Zarathustra page, script and book, plus Park `unified-world.js`, `world-rules.js`, and `zarathustra-gallery-integrated-v1.js`.

The snapshot's entry page adds “Ideas Park · shared world” and “House of Zarathustra” links. Those changes are absent from GitHub and its served HTML. Among the 236 shared web files, 110 match exactly, 124 differ only in line endings, and two have semantic changes: `index.html` and `style.css`. A transfer followed by a checked commit and push is required for these additions to reach a GitHub Pages target.

## Backend and persistence distinction

The [House publishing documentation](https://github.com/hadi1373z/house-of-ideas/blob/main/PUBLISHING.md) identifies Pages as an in-memory demonstration. Its preview changes last for the visit and can disappear after reload. The local server and private Sites Worker are separate execution and storage environments; Pages does not execute authenticated archives, local ChatGPT integration, or nightly server reviews.

The private Sites URL returned HTTP 401 to unauthenticated inspection. This audit compared downloaded source and public GitHub deployment evidence; it does not claim that private data or a signed-in backend session migrated.
