# City of Ideas

A Persian/English/German walking city containing the four-floor Zarathustra gallery, a mountain ascent with 81 stations, Socrates’ house, the artists’ neighborhood, Mathematics Institute, Makers’ City, the object market, and Ideas Park.

The philosophers’ quarter adds six explorable homes for Plato, Aristotle, Epicurus, Hypatia, Confucius and Ibn Sina. Choose **Philosophers’ homes** on the welcome screen, **Philosophers** while walking, or follow the western path from the object market. Each imagined home contains a concept object, a bilingual reading guide with an attributed source, and an independent browser-local reflection. The city map includes the quarter and its connecting paths.

Choose **Summit story** before starting the mountain to play the child’s crawl, leap into the crater, and the Übermensch’s emergence. The event has optional camera following, skip/replay controls and reduced-motion support. **Free exploration** retains the original roof invitation. The quieter mountain paving, mineral retaining faces, softer bronze and grouped entrance planting preserve the symmetrical bridge. See [Summit story and design update](docs/SUMMIT-STORY.md).

The gallery has two opposite ground-level entrances, including one facing the mountain. The final roof stair has a longer opening with clear headroom; all flights are centered on the snake head. The raised volcano keeps the child’s landing and figure reveal aligned with its brighter crater.

Use **Fast** for quicker movement, **Light** to hide or restore the following lantern, and **Music** to choose one of the ten existing instrumental compositions. Keyboard shortcuts are **F**, **L**, and **M**. Controller D-pad or left stick selects controls in an open panel; the bottom face button activates and the right face button closes the innermost panel. **Menu** enters or leaves control selection. If the view drifts, open Help, release the sticks, and select **Center controller**; calibration lasts for that connection. Text entry and some embedded tools still require their own keyboard controls.


Live target: https://hadi1373z.github.io/city-of-ideas/

The repository’s `src/` is the explicit, reviewed source snapshot. GitHub Actions checks it, builds `_site/`, publishes that artifact, then compares the live version and asset hashes. It does not fetch or automatically synchronize a different Sites project or a different chat’s workspace.

## Run and publish

Requires Node.js 22 or newer; the site build has no dependency installation step.

```powershell
node tests/check-source.cjs
node tools/build.cjs
node tools/preview.cjs
```

The preview uses `/city-of-ideas/`, matching the GitHub Pages base path. After reviewing an approved source update, commit and push to `main`; the Pages workflow runs. Its deployment must pass `tools/verify-live.cjs` against the exact commit.

To import a new, stable builder snapshot, run `node tools/import-source.cjs <absolute-dist-directory>`. The transfer hashes source before and after copying, rejects changes during transfer, excludes credentials and project identity state, and preserves the previous snapshot in a local backup. Review the resulting diff before committing. This transfer is intentional; cloud edits do not magically reach GitHub.

Original artwork, model, music and book source credits remain beside the source assets. Private user notes, histories, authentication, local storage exports and credentials are never repository content. See `docs/` for verified function coverage and data migration constraints.

Public controls support Persian, English and German. The book reader offers the full German original, Thomas Common English, and a clearly labelled Persian AI draft, with chapter comparison and translation notes. Some imported articles retain their source language. Private authored text stays unchanged when the interface language changes. See docs/TRANSLATION-CREDITS.md.

The original private House service has an installed authenticated popup bridge. Connecting a live account requires explicit consent in that original service window; publication does not grant account access. No live-account save test is claimed by the automated fixture checks.

Choose **Walk with Socrates** for a warm illustrated guide and seven episode rehearsals with captions, camera framing and optional browser speech. Ideas Park has two flying birds made only from folded paper, with a seven-step bird lesson and retained dog/cat lessons, before/after diagrams and fold checkpoints. The gallery entrance is on its western outside face, opposite the mountain entrance on the eastern outside face. The snake-head landing leads to four straight stair flights connecting the four book levels and roof. Each flight has 40 actual steps and is the same width as the head contour, aligned with the snake’s direction and carrying its original drawing across the steps. Floor landings link the flights, with manual walking and a guided climb.

The five city utility buttons have been removed from the lower toolbar. Origami lessons open when you meet a bird. The four-turn mountain trail begins at (179.5, 0), joins the hillside with stone embankments, and passes above the separate camel and lion terraces with clear underpasses. A summit landing joins the shared infinity roof. The infant crawls straight west from (125, 0) to (24.75, 0), facing the gallery opening and its enlarged luminous figure. The final stairwell is capped below the crawling route while retaining headroom and roof access. Both outer radii remain 58; the return lift stays off the central route.

## Controller preview

The root walking scene supports a connected browser gamepad: left stick moves, right stick looks, left-stick click runs, the bottom face button opens the nearby interaction, and Start enters the city from the welcome view. Face-button labels depend on the controller mode. Movement uses the same collision paths as keyboard/touch, with an 18% stick dead zone and analog speed. Input is suspended while readers, exhibit panels, dialogs, or lift transitions are active. Close panels with touch/keyboard. Embedded tools keep their own controls.

Pair the controller before opening the city, enter walking mode, then press a button to expose the controller to the browser. Hardware testing on Android with an 8BitDo Pro 2 remains required. Button remapping and new puzzle rooms are not part of this first patch. Run `node tests/gamepad-input.cjs` for synthetic input checks.

### Playable houses and summit route

The question room now has two seats at a shared table, and study desks reserve a reachable standing aisle. In the House tools navigation (or Socrates’ conversation panel in the original edition), **Examine a claim** opens a four-step, explicitly scripted exercise in English, German or Persian. Its conclusion is saved locally in this browser and can be revisited there; it is separate from private conversation history.

Dalí’s four frames now contain catalogue-sourced painting images, fitted to their original aspect ratios. Source URLs and SHA-256 checksums are recorded in `src/city-source-assets/home-tools/dali-house/painting-sources.json`; attribution remains in the work inspector. A **Look → notice → record** action leads into the existing learning-journal form. Artist sculptures use smoother surfaces and a finer Dalí moustache.

The connected roofs have a warm straight route inlay using the same snake-skin pattern, with deeper bridge edges. At the roof or summit, **Begin the child’s journey to the volcano** starts the crawl/leap/emergence event without resetting a crawl already in progress.

Music: **V**, **R2**, or **Play/Mute music** toggles playback directly; **M / Music** opens track selection. Starting playback requires an intentional action. Standard L2 remains unassigned; the reported language change still needs reproduction on the physical controller.

### Rooftop simplification

The infinity-shaped elevated loops and their collision surfaces have been removed. The gallery roof, summit terrace, direct bridge and baby-to-volcano path remain. The return lift now lands within the straight bridge, and the aerial controls use plain roof-view labels.

### Origami flock

Eight differently coloured single-sheet paper birds fly around the park entrance in separate short routes, with varied sizes, folded wing poses and animation timing. They have no added bodies, eyes, legs or other attachments. Approaching any bird opens the existing paper-bird folding lesson; the dog and cat lessons remain available in that guide. Reduced-motion mode holds the paper poses still.

### Crane and butterfly additions

The park now also has two paper cranes and three paper butterflies: 13 creatures across three 3D types. Cranes glide slowly with occasional wing folds; butterflies follow compact loops with faster wing opening and closing. All visible shapes are connected folded-paper panels, without added animal bodies, eyes, legs or antennae. These are stylized folded surfaces, not a physical square-to-model simulator.

Approaching a new creature opens its corresponding English/German/Persian folding guide. The crane has twelve milestones and the butterfly ten; the original sketches are orientation aids, explicitly distinct from the simulated flat folds in the simpler lessons. Full illustrated traditional instructions remain linked from [Origami-Fun’s crane guide](https://www.origami-fun.com/origami-crane.html) and [butterfly guide](https://www.origami-fun.com/origami-butterfly.html). Movement pauses near visitors, during a lesson, and in reduced-motion mode.
