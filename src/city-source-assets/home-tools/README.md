# Original House tools in City of Ideas

This adapter retains the actual House of Ideas browser modules and complete bundled collections. It changes the application shell, transport and `createScene` renderer entry point. `scene-original.js` preserves the source geometry builder; it is used only for detached object inspection, never as a destination walking renderer.

## Preserved tools

Room and idea editing, floor-plan editing, home/resident tools, Socratic reflection and rule-based conversations, private conversation archive/import/export, explicit development-draft approval/export, daily on-page learning review, learning trails and practice history, construction and residence assignments, artist conversations/approved home editions, original paintings/descriptions/credits, object catalogue, playable music, mathematical concepts and the actual Atlas reader, travelling collections/city journals, GLB design import/editing and portable design packages, and preserved home editions remain driven by the original modules and validators.

The small 3D model viewers in the original object library/store are retained, including rotation controls. There is no additional walking canvas, world animation loop, or destination keyboard capture. Parent-city movement remains in the common City scene. Original artist websites and the complete embedded mathematics reader remain bundled.

## City bridge contract

Keep a single same-origin iframe mounted so unsent drafts survive opening and closing the tools. Set its URL to this directory's `index.html?lang=en` or `?lang=fa`.

After `CITY_HOME_TOOLS_READY`, the iframe exposes `CITY_HOME_TOOLS`:

- `open(tool, payload)`: tool IDs `home`, `rooms`, `notes`, `journal`, `socrates`, `conversations`, `learning`, `construction`, `design`, `objects`, `world`, `artists`, `mathematics`, `atlas`, `collection`, `editions`; also `idea`, `painting`, `artist`, `concept`, `activity` with the original stable object IDs.
- `readState()`: cloned house, neighbourhood, independent city network, revision, loading/saving state and storage mode. Keep this user-private state out of logs and publication.
- `setCityContext(context)`: current common-world `cityId`, `roomId`, `floor`, `artistId`, `position`, `outside`, resident proximity/state, optional focused interaction.
- `pick(originalInteraction)`: original artwork, book, resident, idea, object-store, mathematical or domestic activity event.
- `reload()`: explicitly reload the selected storage service.

`CITY_HOME_SCENE` messages carry `{method,args}` for original scene actions. Parent should implement room/entrance travel, floors, artist entrances, market targets, landmarks, residence updates and imported-design placement in the common world. `load`, `setNeighborhood` and `setCityNetwork` carry state changes; they are not instructions to clear other city districts. Parent can also send `CITY_HOME_CONTEXT`, `CITY_HOME_PICK`, `CITY_HOME_OPEN`, `CITY_HOME_LANGUAGE` (or `city-language`) and `CITY_HOME_RESIDENT_VISIT`. All received messages require the exact same origin and parent window. `CITY_HOME_CLOSE` asks the parent to hide, not unload, the iframe.

## Storage and cloud connection

Default **browser-local** mode uses its own IndexedDB database, `city-of-ideas-house-tools-v1`. This is separate from original private online data. House writes use atomic revision checks; earlier editions remain intact. Archive import deduplicates stable identities and never clears existing messages. Conversation archives and development briefs have independent transaction versions so they cannot stale an unrelated house edit.

The complete browser backup includes homes, notes, conversations, briefs, opaque accepted metadata, unmodified imported source records, and stored GLB bytes with hash verification. Imports append preserved homes rather than overwrite current homes. Colliding incoming home IDs are remapped while the raw original source record is retained. If both imported and existing archives have independent city networks, the incoming complete network is retained in its unmodified source backup rather than destructively replacing the active one; use the original collection import for an explicit merge of travelling cargo/journals.

Connect uses the parent's `CITY_HOUSE_SERVICE` client. `connect()` must complete before a deliberate storage-mode switch; requests then call its `fetch(path,options)` response-compatible transport to the original authenticated service. The adapter never receives identity credentials or API keys. A failed cloud mutation is not retried or redirected into browser storage. Browser records survive switching back. The root must install/deploy the original service's approved bridge and supply the client; a copied static iframe does not establish signed-in access.

Hosted AI inference remains unavailable, matching the original service. No paid API request is made. The existing local House ChatGPT connection remains an explicit original local workflow, with exported conversation files for deliberate import. The original private service does not upload new GLBs; browser mode does. The on-page daily review is not a background server/scheduler. Full headset operation remains unverified.

## Languages and private text

English retains the original complete English tool UI. The language control reads “Switch to Persian” in English. Persian display translations cover the tool menu, primary editing/archive/navigation controls and all 60 artwork titles and descriptions. Source citations and original credits remain intact. Additional long original lessons, help/error templates and the embedded Atlas/artist websites retain their original text unless their own language support applies; broader public literal translation can be added without changing stored content.

User notes, room writing, user-assigned names, journals, imported designs and conversation transcripts are excluded from automatic translation. Rendered private text is marked `data-private-text`; input/textarea values are never changed by language selection. IDs, saved documents and history do not depend on language.

## Validation

`node adapter-tests.mjs` checks stable note IDs/text, opaque house/edition metadata, immutable earlier editions, restart persistence, stale-revision and competing-write conflicts, append-only conversation import, independent archive revision, explicit development approval, blocked paid AI routes, and 60 translated artwork descriptions.

Real Chromium checks completed for note creation and reload persistence, preserved edition creation, offline Socratic dialogue and archive appearance, original construction UI, English/Persian direction/control changes, unchanged private note content/ID, and absence of a walking canvas. These checks used synthetic browser records. Original signed-in cloud persistence and the final common-world scene-command wiring require separate integration verification by the city owner.
