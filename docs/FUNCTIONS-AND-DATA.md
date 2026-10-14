# Original functions and private data

This is a source audit dated **14 October 2026**. It records what City of Ideas must preserve. It does not claim that the new city's interactions, translations or private-data migration have been verified. Deployment and feature validation must be reported separately.

**خلاصه:** تعدادها و قابلیت‌های زیر از کد اصلی استخراج شده‌اند. اتصال شهر به حساب ابری از پنجرهٔ مجازِ سرویس اصلی انجام می‌شود؛ داده‌ها در همان حساب می‌مانند. انتشار گیت‌هاب به‌تنهایی مجوز اتصال نیست. داده‌های محلی پارک و خواننده در مبدأ دیگر، به ورود پشتیبان سازگار نیاز دارند. رمز، کلید API و اطلاعات ورود وارد مخزن نمی‌شوند.

## Complete collections

| Original source | Verified collection |
|---|---|
| House of Ideas artist galleries | 10 original artists, six attributed works each: **60 bundled paintings** |
| House artist catalogue | **11 residents / 64 work records**, including Dalí's four original study diagrams with museum links; those diagrams are not reproductions of his paintings |
| House object store | **104 entries**: 36 GLB models, four learning furnishings, four idea cues and 60 paintings |
| Model collections | Six external sample models, six project furniture models, eight thinking artifacts, ten music sculptures and six exploration objects; **ten bundled audio tracks** |
| House learning | Six books, six Hidden Patterns quests; Mathematics Institute with eight floors and 24 concepts |
| Ideas Park | **118 thinkers, 150 explained connections, nine gardens, twelve 15-minute missions, five landmarks and eight reading paths** |
| Park's complete Atlas reader | 118 profiles, **31 extended articles and twelve idea lenses** |
| House's separate Mathematics Atlas snapshot | **131 profiles, 49 extended articles, 181 connections, thirteen lenses, eight paths and twenty publication records** |

The two Atlas snapshots differ and must retain their own provenance. The Park's abbreviated `catalogue.json` does not contain the complete reader articles. The House also includes the self-contained artist websites file. Transferring several example paintings or only the catalogue is not full migration.

Evidence: original House `web/art-city-data.js`, `artist-catalog.js`, `object-store.js`, `object-store/models.js`, `books.js`, `learning-trail.js`, `math-city-data.js`, `math-city/atlas/index.html`; original Park `dist/catalogue.json`, `park-content.js` and `atlas.html`. Counts were computed from exported arrays and embedded reader data, not inferred from interface labels.

## Original behaviors to preserve

| Area | Implemented original behavior |
|---|---|
| Home and rooms | Walk/interact, sit/stand, rest/tea, books/pages, notes and journal; stable room/idea IDs; room name/purpose/colour/brightness/arrival writing; idea reassignment and functional objects |
| Building and history | Floor-plan editor, connected doors/stairs, one to three residence floors, painting/furnishing/model placement; spatial changes create independent neighbouring editions and preserve earlier homes |
| Socrates and learning | Moving/summonable resident, guided conversations and critique, saved observations/preferences/decisions, explicit approve/decline, reflections/daily reviews; six spatial quests with practice/recall progress and passport export |
| Artists | Every work's description/credit/rights/source, previous/next work, full image and looking exercises, artist websites, saved observations/conversations, independently approved artist-house editions and transcript-free development briefs |
| Market and design | Search/categories/paging, real 3D previews and rotation, source/licence records, music controls, six interactive experiments; validated static GLB import, assigned function/note/transform, design tours, house JSON and portable design-package import/export |
| City collection | Idea/book copies, placement at city anchors, reading/activities/discussion, per-city journals, preserved notes and mergeable collection export/import; Mathematics Institute and original Atlas monitor |
| Private archive | Earlier conversation pages, full private dialogue export, explicit duplicate-safe import, evidence selection, development draft, separate approval and approved-brief download |
| Park | All people/connections/search, maps and destinations, routes/trails, real walking/joystick controls, twelve missions with persisted drafts and optional start/pause/reset timer, saved planted results, editable personal grove and mergeable seed backups |
| Full reader | Articles/section links/contents, equations and copy controls, search/filters/lenses/questions, graph plus explained list, directed/undirected route search, timeline, saved/read marks, notes, resume/history, appearance/focus settings, shelf JSON and notebook text export |

A language switch must preserve stable IDs, progress and authored text. Private notes must not be translated or rewritten automatically. Building entrance clicks must retain artwork, music, experiment and tool selection behavior. Source files being present does not demonstrate that these behaviors work in the shared city.

## What GitHub Pages can and cannot provide

The original House has three separate modes:

- Its GitHub Pages edition is an **in-memory preview**. `scripts/build-pages.mjs` selects `data-mode="preview"`; `web/app.js` uses a temporary request shim and reconstructs starter state on reload.
- Its local edition saves private `data/house.json`, model assets and retained conversations through the Node server. Revision checks and atomic writes protect data; background reviews run only while that local server runs.
- Its private online edition uses a Sites Worker and D1 storage. It requires a Sites-authenticated visitor identity for every private query. Mutations require the same origin, JSON and `X-House-Request: 1`. The original frontend uses same-origin `/api` requests. There is no cross-origin CORS/account bridge in this source.

**Pages hosts static frontend assets; it does not execute that Worker or the local server.** Replacing `/api` with the old cloud URL cannot fabricate its authenticated account or bypass its origin checks. An intact cloud integration requires a supported authenticated original-origin mechanism and its own verified behavior. A service link remains available but does not itself satisfy continuous city interaction or shared-city cloud parity.

The intact account route is [House of Ideas · Private Online](https://house-of-ideas-online.nutmeg-ibex-4408.chatgpt.site/). Sign in there with the same ChatGPT account to access the existing cloud neighbourhood and Conversations tools. The original local ChatGPT-plan connection remains at the local House installation, normally `http://127.0.0.1:4317/#chatgpt` while its server is running. Cloud sign-in establishes identity, not inference. The hosted source deliberately has no paid inference transport; remote chat routes direct the user to the local integration.

Original cloud budgets are 1.3 MB per neighbourhood, 10,000 append-only archived messages and 1,000 development briefs. Failed capacity/revision checks preserve existing records and drafts. GLB uploads are a local capability, not an original cloud capability. No new API key, paid inference, background scheduler or automatic repository writer is needed or authorized by this migration.

## Safe migration of existing private records

First keep backups from the original edition. Use only the intended local import interface once its migration checks pass; private backups must remain outside the public repository.

| Existing data | Supported original export | What it carries |
|---|---|---|
| Private online House | While signed in, open [complete neighbourhood export](https://house-of-ideas-online.nutmeg-ibex-4408.chatgpt.site/api/house/export) | Every home, active home, room/idea data and city-network state; conversation archive is exported separately |
| Private online archive | Conversations → download private conversation file, or [signed-in archive export](https://house-of-ideas-online.nutmeg-ibex-4408.chatgpt.site/api/conversations/file) | Retained conversations and archived development briefs |
| Local House | Preserve the entire existing `data/` folder; local `/api/house/export` plus the private conversation download are available after opening the local house | Whole local neighbourhood and, separately, retained dialogue; preserve model files as well |
| Park grove | Original Park → Your idea grove → Export grove | Seeds, visited profiles, mission completions and draft text; original JSON export does not include its running timer |
| Atlas reader shelf | Original reader → My shelf / Reading room → Backup | Saved/read profiles, notes, answers, history, reading position and preferences |
| One designed home | Design workshop → house JSON or portable design package | One selected home; package embeds its local GLBs. This is not a complete neighbourhood/archive backup |

Park and standalone reader data are browser-origin-local. Data on `*.chatgpt.site` cannot automatically appear on `hadi1373z.github.io`; the unchanged key only carries over within the same origin. The isolated House Atlas monitor has session-only notes and explicit export. Use its backup before leaving if notes were written there.

Original Park imports merge stable seed IDs and preserve existing entries. Original reader imports offer merge as the default, combine conflicting notes, and require confirmation before replacing a shelf. House conversation imports copy dialogue only and deduplicate stable message identities; they do not transfer credentials, homes or approval authority. A new whole-neighbourhood importer must preserve **all** old editions, unknown authored metadata and the separate retained archive; importing only `backup.house` is insufficient.

**Exact input for a chosen file migration:** the user's explicitly chosen signed-in neighbourhood/archive exports and, where relevant, Park/reader backup files. Credentials, password, API key, cookies and account tokens are not needed. This audit does not assert that these files were obtained or imported. Authenticated original-backend integration is a separate implementation prerequisite, not something a private export can solve.

The authenticated popup connection is installed in [backend-integration](../backend-integration/README.md) and deployed to the original service as version 20. The City transport is installed in the original House tool frontend. It keeps data in its original account and database, using the unchanged API. Real session approval, opener survival and saved-state rendering/persistence require separate verification; deployment and fake-only tests do not prove those outcomes. Once that connection is granted, cloud exports are optional backups; browser-local Park/reader data from another origin still needs compatible backup transfer.

## Source provenance

| Source record | Verified identifier |
|---|---|
| Downloaded House Sites source, clean checkout | `48ccb361e8e64857f4e9f94f4598d8dc97970e00`, 14 October 2026 |
| House `online/source.json` recorded canonical offline source | [`a0fca474bf9201d54ed4b154a4c7ba3935f5ae0a`](https://github.com/hadi1373z/house-of-ideas/commit/a0fca474bf9201d54ed4b154a4c7ba3935f5ae0a) |
| Downloaded Ideas Park Sites source, clean checkout | `84f9f1d141e1a4dda4caa04d26476e958af42c19`, 14 October 2026 |
| House Atlas `source.json` recorded source | [`90a6dab9f7ae7b54bb34e0d7d8cabac155775e40`](https://github.com/hadi1373z/atlas-of-ideas/commit/90a6dab9f7ae7b54bb34e0d7d8cabac155775e40) |
| Canonical House Atlas Git blob | 977,348 bytes; SHA-256 `bd07240709cc2626f581556f1b272bc8e118a20a98da4ce2e3b711f3aa4d2da4` |
| Canonical artist websites Git blob | 29,473,162 bytes; SHA-256 `5fa732497902c19009f7164612846345c513888f2f21436f1bb93dd8cca168d6` |

The initial Windows checkout expanded line endings to CRLF, changing the Atlas file's bytes/hash to 978,790 bytes / `723ab770c80780741a8d32803c405561590dcef5ef43f4109e8910de9f6d1c10`. Reading the raw `HEAD:web/math-city/atlas/index.html` Git blob independently confirmed the manifest's exact 977,348-byte hash above. The artist websites blob was likewise checked directly. The discrepancy was checkout newline transformation, not stale authored content; extracting canonical blobs with `git archive` restores exact source bytes. The City repository's `src/** -text` rule protects transferred source bytes. Collection counts are unchanged by line endings.

These source IDs do not establish the new city deployment, its live build version, completed bilingual content or tested function parity. Those require the delivered build and browser/deployment evidence.
