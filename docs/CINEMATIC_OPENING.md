# Cinematic opening

The main city begins with a first-person reading of the opening of *Thus Spoke Zarathustra*, in Socrates’ study. One Read on action unlocks audio. Four narrated shots reveal the room, introduce the illustrated Socrates, and reveal the larger city. The last shot waits for Step into the city. This is an authored fictional encounter, not a historical quotation or live AI dialogue.

The original menu is available through City overview after the introduction. Begin with the book replays it. Skip, Escape and the controller Back action leave the introduction; ordinary exploration and saved reflections remain independent. Pause, optional voice, captions and reduced-motion support are included. Switching away from the page pauses it. A missing/blocked audio file leaves captions and navigation usable.

## Change the narration

Edit `src/opening-script.js`: all EN/DE/FA interface text, captions, speaker labels and minimum shot durations live there. The book excerpt is attributed separately. German is Nietzsche’s original; English is Thomas Common; the Persian excerpt is an editorial draft translation.

Replace `src/assets/opening/{language}-{beat}.mp3` using the same identifiers: page, room, socrates and city. Keep text and recordings in sync. Optional `speechLines` supply pronunciation text without changing displayed captions. Persian displays زرتشت and uses the requested vocalization زَرْتُشْتْ in its voice script. No scene rebuild or paid API integration is needed to replace the script or hire a voice performer later.

The included MP3s are synthetic neural narration, generated using edge-tts 7.3.1 (https://github.com/rany2/edge-tts). English: Sonia/Ryan; German: Katja/Conrad; Persian: Dilara/Farid. The first voice is the narrator; the second performs the fictional Socrates. Rate: -8%. No impersonation of a real speaker is intended. Only the authored public script was sent for generation. Runtime audio comes from local site assets, with no speech-generation requests or browser speech synthesis.

To regenerate, install edge-tts in a development Python environment and run `python tools/render-opening-voices.py --node <node-executable>`. This optional development tool calls the online speech service and replaces the twelve MP3s. It is not needed to run or build the city.

## Validation

`node tests/cinematic-intro.mjs` checks pause/resume, duration guards, the held final shot, replay state, complete language text and twelve nonempty MP3 assets. The root integration fixture checks that the opening installs after the existing city features. Browser review separately checks book → room → Socrates → city, keyboard skip, pause, voice toggle and restoration of normal controls. Audio quality and physical controller/mobile hardware need human review; passing source tests is not a claim that every device has been tested.
