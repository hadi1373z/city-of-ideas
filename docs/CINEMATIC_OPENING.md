# Cinematic opening

The main city begins with a first-person reading of the opening of *Thus Spoke Zarathustra*, in Socrates’ study. A physical open hardback rests on a shallow wooden reading stand on the actual study desk, with localized title, excerpt and attribution on its pages. One Read on action unlocks audio. Four narrated shots pull back into the room, introduce the illustrated Socrates and invite the visitor to walk outside. The last shot waits for Begin exploring; completion and skipping leave the visitor in the study, without a plaza teleport. This is an authored fictional encounter, not a historical quotation or live AI dialogue.

The original menu is available through City overview after the introduction. Begin with the book replays it. Skip, Escape and the controller Back action leave the introduction; ordinary exploration and saved reflections remain independent. Pause, optional voice, captions and reduced-motion support are included. Switching away from the page pauses it. A missing/blocked audio file leaves captions and navigation usable.

The nearby desk-book action opens the actual Zarathustra reader. Its optional Discuss this reading with Socrates action connects to the existing authored discovery journey. Reading and the cinematic remain independently accessible. The camera follows the desk if the source house finishes restoring after the opening starts.

## Connected city ground

A shared civic street connects the house and artist entrances. Branches connect the gallery, object gallery, park, mathematics institute and makers district. Continuous mitered paving replaces separate overlapping road boxes, with a consistent surface height. The makers route goes around the mountain footprint. The empty round plaza and its oversized Continuous city / Ideas Park sign are removed. Existing building locations and personal-home editions remain in place; this is a ground-route refinement, not a complete city redesign.

## Change the narration

Edit `src/opening-script.js`: all EN/DE/FA interface text, captions, speaker labels and minimum shot durations live there. The book excerpt is attributed separately. German is Nietzsche’s original; English is Thomas Common; the Persian excerpt is an editorial draft translation.

Replace `src/assets/opening/{language}-{beat}.mp3` using the same identifiers: page, room, socrates and city. Keep text and recordings in sync. Optional `speechLines` supply pronunciation text without changing displayed captions. Persian displays زرتشت and uses the requested vocalization زَرْتُشْتْ in its voice script. No scene rebuild or paid API integration is needed to replace the script or hire a voice performer later.

The included MP3s are synthetic neural narration, generated using edge-tts 7.3.1 (https://github.com/rany2/edge-tts). English: Sonia/Ryan; German: Katja/Conrad; Persian: Dilara/Farid. The first voice is the narrator; the second performs the fictional Socrates. Rate: -8%. No impersonation of a real speaker is intended. Only the authored public script was sent for generation. Runtime audio comes from local site assets, with no speech-generation requests or browser speech synthesis.

To regenerate, install edge-tts in a development Python environment and run `python tools/render-opening-voices.py --node <node-executable>`. This optional development tool calls the online speech service and replaces the twelve MP3s. It is not needed to run or build the city.

## Validation

`node tests/cinematic-intro.mjs` checks pause/resume, duration guards, the held final shot, replay state, complete language text and twelve nonempty MP3 assets. The root integration fixture checks that the opening installs after the existing city features. The study-book fixture checks original desk/book identity, tabletop bounds, multilingual textures and owned resource disposal; the road fixture checks continuous joints and surface height. Browser review separately checks physical book → room → Socrates → exploration, keyboard skip, pause, voice toggle and restoration of normal controls. Audio quality and physical controller/mobile hardware need human review; passing source tests is not a claim that every device has been tested.

The shared city renders Socrates’ house as one storey: no upper-floor geometry, staircase, stair signs or stairwell cutouts. This is a read-only projection; the source home archive is not rewritten. During the introduction, the ordinary resident is suppressed so only the cinematic guide is visible, then restored on exit. Presentation ownership is independent of the existing tour.

The shared-city house omits its standalone garden stepping-stone strip, which otherwise extends past the civic street into grass. Its porch landing and the connected civic approach remain. Standalone and other home renderers retain their original entry paths.

Outdoor paving is temporarily hidden with `CITY_CONFIG.showGroundPaving=false`, including shared streets, circular promenades, philosopher approaches and park ground paths. Route footprints and entry grades remain for navigation; building floors, porches and elevated walkways remain. Gallery landscaping now uses deterministic instanced forked branches and layered individual leaves, with varied crown proportions and muted greens; the oval canopy meshes and round tree plinths are removed. This is procedural foliage, not photoreal scanned vegetation.
