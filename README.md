# City of Ideas

A Persian/English/German walking city containing the four-floor Zarathustra gallery, a mountain ascent with 81 stations, Socrates’ house, the artists’ neighborhood, Mathematics Institute, Makers’ City, the object market, and Ideas Park.

The philosophers’ quarter adds six explorable homes for Plato, Aristotle, Epicurus, Hypatia, Confucius and Ibn Sina. Choose **Philosophers’ homes** on the welcome screen, **Philosophers** while walking, or follow the western path from the object market. Each imagined home contains a concept object, a bilingual reading guide with an attributed source, and an independent browser-local reflection. The city map includes the quarter and its connecting paths.

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

Choose **Walk with Socrates** for a warm illustrated guide and seven episode rehearsals with captions, camera framing and optional browser speech. Ideas Park has two roaming paper friends with seven-step dog and cat origami lessons, before/after diagrams and fold checkpoints. The gallery doorway faces the mountain baby; its snake-head landing leads to three straight stair flights connecting all four levels. Each flight has 40 actual steps and is the same width as the head contour, aligned with the snake’s direction and carrying its original drawing across the steps. Floor landings link the flights, with manual walking and a guided climb.
