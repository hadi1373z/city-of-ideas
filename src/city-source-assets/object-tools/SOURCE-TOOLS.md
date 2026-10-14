# Genuine source tools and integration

Source: House of Ideas commit `48ccb361e8e64857f4e9f94f4598d8dc97970e00`, read-only discovery checkout. Source-specific model/image/project attribution is retained in `CITY_SOURCES.OBJECTS`, genuine source records, original artist Credits pages and `SOURCE-ADAPTERS.md`. Project-source labels are preserved; no blanket license replaces them. Official Three r160 GLTFLoader is MIT, with its included upstream license.

## Object API

Load the existing global `assets/three.min.js`, then `city-sources.js`, then `object-tools.js` as classic scripts. `CITY_OBJECT_TOOLS.ready === true` means that module and its source dependencies initialized. `CITY_OBJECT_TOOLS.OBJECTS` contains all 104 source entries: 36 genuine GLBs, 4 learning furnishings, 4 idea objects, 60 paintings. All ten original musical posters retain actual local song WAVs, source records and original compositions. Playback is initiated by the visitor, never by loading the city.

```js
const objectUI = CITY_OBJECT_TOOLS.initObjectStore({
  document, window,
  onChoose: item => constructionUI.show(item),
  onVisit: () => openOrWalkToMarket(),
  onVisitObject: id => walkToMarketDisplay(id),
  onActivity: item => learningUI.showActivity({
    title: item.title, text: item.description, homeAction: item.action
  })
});
await objectUI.ready;
objectUI.setLanguage('fa');
objectUI.show(null, 'explore-pendulum-lab');
```

The owner supplies actual callbacks. Names in the example for walking/learning are integration placeholders, not exported implemented functions. The exact genuine source app wires `onChoose` to `constructionUI.show(item)`; construction opens its Objects tab with the selected entry and saves only when the visitor builds a new home. `onChoose(item)` receives the full catalogue record. `show(callback, itemId, filter='All objects')` overrides that handler with `callback(item)` for a construction draft. `onVisitObject(id)` receives a string catalogue ID, including IDs such as `painting:water-lilies`; the original scene uses `visitMarketObject(id)`. `onActivity(item)` receives the full record; the original app visits the display and invokes `cityTravelUI.showActivity({title:item.title,text:item.description,homeAction:item.action})`. `onVisit()` takes no argument. The continuous city owner should walk/target these same physical exhibits rather than switch city pages.

Returned controller: `show`, `close`, `play(id)`, `stopMusic`, `dispose`, `setLanguage`, `dialog`, `musicBar`, `ready` Promise. `ready` waits for the shared public artist-content dictionary and fills Persian painting counterparts. No existing HTML slot is required: the original factory creates its dialog, music bar and preview host. Source toolbar buttons are appended only if `.world-controls` exists; the owner can use its own buttons to call the controller. The bounded source stylesheet is automatically loaded from `city-source-assets/object-tools/object-tools.css` and scoped to the source controls. All paths are relative and work beneath a GitHub Pages project prefix.

Only the open object panel owns the genuine preview renderer. It is disposed, its context released, and its canvas removed on every dialog close. Pending models that finish after close are disposed. The main continuous city continues using its original renderer. Original music deliberately continues when the catalogue closes; Stop music ends it, matching source behavior.

Pure/source APIs are also exposed: `createObjectViewer`, `extractObjectPreview`, `matchesObject`, `createExplorationActivity(document,id)`, `pendulumPeriod`, `numberEvidence`, `moveHanoi`, `EXPLORATION_OBJECTS`, `buildExplorationObject`, `translate`, `translationCoverage`. Experiments use their real source controls/state/calculations; no random placeholder response or substituted mesh is used.

## Exact function inventory and parity

| Genuine source module/export | Dependencies | Preserved adapter behavior | Owner responsibility / remaining scope |
| --- | --- | --- | --- |
| `object-market-scene.js`: `buildObjectMarket`, `MARKET_STALLS` | Store records; preview loader | Physical 104 displays, colliders, nearest-preview loading, update/suspend/dispose, inspection metadata | Continuous scene transforms and actual walking; call update with market-local coordinates |
| `object-store.js`: `STORE_OBJECTS`, `storeAssetUrl`, `assignStoreObject` | Bundled models, paintings, clone, construction | All records/files/provenance preserved in CITY_SOURCES; audio restored | `assignStoreObject` is part of construction/state infrastructure, not falsely simulated here |
| `object-store-ui.js`: `initObjectStore` | Store records, storePreview, createObjectViewer, exploration activity | All104 search/category/12-card paging, full inspection/source/license/SHA/version/modification details, rotation, screenshots, genuine songs, visit/use/learning callback buttons | Construction use and saved reflection callbacks supplied by genuine home/learning infrastructure |
| `object-preview.js`: `createObjectViewer`, `extractObjectPreview`, `matchesObject` | Existing Three instance | Source drag yaw/pitch, rotate buttons, framed preview, thumbnail capture, extraction and disposal | No source object pan/zoom controls or standalone GLB export exist; these are not invented parity requirements |
| `exploration-activities.js`: `createExplorationActivity` | `pendulumPeriod`, `numberEvidence`, `moveHanoi` | Die samples/reset; pendulum length/gravity/period; Möbius tracing; RGB swatch; legal Hanoi moves/reset; prime/factor evidence | Source experiment state lasts while the panel is open; save uses a separate genuine learning reflection workflow |
| `exploration-objects.js`: `EXPLORATION_OBJECTS`, `pendulumPeriod`, `numberEvidence`, `moveHanoi`, `buildExplorationObject` | Existing Three instance for its procedural builder | Genuine metadata, math and original optional procedural builder | Source copies remain static sculptures; controls explicitly model/test rather than pretending to animate GLBs |
| `designer-ui.js`: `initDesignerUI` | clone/validateHouse, validateGlb/validateDesignObjects/isAssetId/DESIGN_LIMITS/DESIGN_ACTIONS, pragueDate/reflect | Read-only audit confirmed real functionality | Owner home factory: import self-contained GLB≤12MiB, ≤24 designs, edit title/action/note/scale/rotation/offsets, tour/discuss/remove, reflection save, house JSON import/export, design package import≤48MiB/export≤32MiB GLBs |
| `design-objects.js`: `validateGlb`, `validateDesignObjects`, `isAssetId`, `DESIGN_LIMITS`, `DESIGN_ACTIONS` | Bounded pure validators | Genuine source loader/catalogue bytes validated separately | Reuse full validators for actual custom-model import; do not substitute a basic extension check |
| `design-scene.js`: `parseDesign`, `createDesignLayer`, `findDesignPosition`, `DISPLAY_BUDGET` | Three/GLTFLoader, GLB validator, navigation/sharedEdge | Actual source GLBs use compatible r160 loader, genuine geometry, disposal | Home scene bridges: `suggestDesignPosition`, tour/return, placement/collision and save infrastructure |
| `construction-ui.js`: `initConstruction` → `{show}` | constructionDraft/connect/add/validate/prepare, Store assign, residence data/scene, findDesignPosition | Store callback shape retained | Owner genuine construction draft/build workflow and state persistence |
| `art-city-scene.js`: `buildArtCity` | Ten ARTISTS, local artworks, existing Three | All ten houses/60 original images and attribution/colliders/approaches | Shared scene placement and physical navigation |
| `art-city-navigation.js`: `findCityPath` | District canStand/bounds/colliders | Audited genuine collision-aware .4-grid route planner with bounded search | Reusable candidate for actual source visit/tour callbacks; not exposed in this adapter yet |
| `art-city-ui.js`: `initArtCityUI` → render/show/showArtist/close/onHomeChange | pragueDate/reflect, artists, home save/read-only context, scene, examineArtist | Full independent artist website content/tool counterpart supplied separately | Genuine home observation save≤1200 chars/day/room, artist discussion, context/draft preservation need home/artist controllers |
| `artists-websites.html`: original ten pagesets, `ArtistSites.initialize/announce`, route `navigate`, hub `showSite/hydrateArtwork` | Browser DOM, existing60 bundled WEBPs | All130 pages, full work detail/about/chronology/contact/credits/extra, original scripts/styles, search/filter, zoom/copy citation, grid/list, drafts, specific art tools | Same-page iframe/tool panel shell; QA-owned full authored-content FA dictionary |
| `artist-dialogue.js`: `artistOpening`, `artistQuestions`, `artistPersona`, `artistConversation`, `converseWithArtist`, `appendArtistReply` | Artist catalogue, CITY_LIMITS/validateCityNetwork | Read-only audit: genuine offline interpretive source dialogue exists | Owner public resident/network infrastructure. These are fictional learning prompts, not historical quotes or migrated private conversations |
| `artist-resident-ui.js`: `initArtistResidentUI` → show/close/render/nextQuestion | Artist dialogue, scene presence, network save/reload; optional provider callbacks | Audited source transcript/drafts/suggested questions/presence gating | Offline can work from fresh public state; ChatGPT/API providers require actual separate connection/backend and are not fabricated here |
| `artist-homes-ui.js`: `initArtistHomesUI` → show/close/render | Artist catalogue; artistHomeArchive/propose/decide/improvementBrief; features/atmospheres | Audited review/approve/decline/preserved-edition visits/exported GitHub brief | Owner fresh public proposals/network persistence. Export downloads a local brief; it does not publish/send a message |

Original source app imports the broader eleven-entry artist catalogue, including Dalí. This transferred district intentionally preserves the specified original ten-artist renderer/catalogue; Dalí and private saved artist house editions are not silently fabricated or claimed transferred.

## Localization and preservation

`CITY_OBJECT_TOOLS.setLanguage('fa'|'en')` updates source UI and dynamic experiment outputs without resetting number values, die/Hanoi/Möbius state or user input. Original English object title/creator/license attribution remains; Persian title counterparts are additional. All44 genuine model/furniture/idea public summaries and titles have authored Persian counterparts in `object-fa.js`. All60 painting descriptions are exact matches in the artist translation inventory and consume the QA-owned `artist-sites/public-fa.js`. Shared categories/controls, source-label prefixes and every experiment control/output have real Persian entries/formatters. `translationCoverage()` reports actual availability, independent of active language. User notes and callback state are never auto-translated.

Artist API: `CITY_ARTIST_SITES.entryFor(artistId,workId?,lang?)`, `pageFor(artistId,page,lang)`, `setFrameLanguage(frame,lang)`, `artists`, `byId`. Their reversible dictionary hook responds to `postMessage({type:'city-language',lang:'fa'|'en'})` only from its same-origin parent and sets body[data-language]. English always restores original authored strings. The complete deduplicated authored inventory has1038 source strings; full page-content translations are a distinct `public-fa.js` asset maintained by the assigned translation agent. No selector-only claim of full translation is made.

All ten research contact forms retain genuine source behavior: download a local research inquiry draft; no message is sent. Original institution/source links open only after visitor action. No backend credential, private data, outgoing messaging or remote automatic media request is added by these modules.

## Verification

Classic-script syntax checked. All130 page maps/60 reused image references and original script bodies are preserved and compiled independently. Original36 GLB SHA256 checks, valid self-contained GLBv2, supported required extension KHR_texture_transform, and30 actual untextured GLTF parsing checks passed in the source adapter work. All10 WAVs retain original-byte SHA256 records in audio-audit.json. Source experiment smoke instantiated all six genuine controls, checked die/Hanoi/Möbius actions, pendulum length-ratio math, prime/factor results, illegal Hanoi rejection and Persian dynamic output. Complete WebGL UI/iframe/clipboard/audio playback checks remain owner browser QA; this adapter task did not launch a browser.
