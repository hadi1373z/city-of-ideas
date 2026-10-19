# City of Ideas — Development Notes

**Project:** City of Ideas / House of Ideas  
**Repository:** `hadi1373z/city-of-ideas`  
**Suggested note filename:** `docs/CITY_OF_IDEAS_IDEA_BACKLOG.md`

## 1. Central vision

**First imagine, then experience.**

City of Ideas is an explorable philosophical world where visitors can create spaces, encounter thinkers, explore knowledge, and contribute their own imagination to a growing environment.

It should feel like a living world, not a conventional educational website or a collection of disconnected demonstrations.

The main experience connects five elements:

**Imagination → Creation → Exploration → Interaction → Memory**

Experiences should have consequences that persist within the world.

## 2. The City

The city contains interconnected places, each representing a different approach to knowledge, art, or philosophy.

Ideas discussed:

- **Academy of Socrates:** A place where visitors engage in questions, dialogue, and Socratic learning.
- **House of Ideas:** A space where visitors can imagine, create, and experiment.
- **House of Zarathustra:** An architectural interpretation of Nietzsche's *Thus Spoke Zarathustra*.
- **Park of Ideas:** A landscape containing sculptures, artworks, philosophical objects, and interactive installations.
- **Mathematical University:** A place for exploring mathematical problems and concepts.
- **Row of Artists and Galleries:** Spaces for visual works and encounters with artists.
- **Forests and Nature:** Surrounding landscapes where users may eventually add their own structures and environments.
- **Personal homes:** Individually created spaces that can become part of the city.

These places should form a coherent geography, with streets, paths, landmarks, and understandable navigation.

## 3. The House of Zarathustra

We discussed a distinctive structure based on Nietzsche's book.

**Architectural concept:**
- Four circular floors corresponding to the four parts of *Thus Spoke Zarathustra*.
- Rooms corresponding to passages, verses, or ideas.
- An ascending route through the building, representing intellectual and philosophical progression.
- Lantern lighting and a deliberately atmospheric environment.
- Opportunities to read, listen, explore, and experience philosophical ideas spatially.

The building should not merely display quotations. Its design, changing spaces, and interactions should convey something meaningful about the text.

## 4. Beginning the experience — cinematic introduction

We discussed making the opening more narrative.

A possible introduction:

The visitor begins alone, reading *Thus Spoke Zarathustra*. The surrounding scene slowly reveals itself. A narrator introduces the world, and Socrates becomes an early guiding presence.

The visitor moves from an apparently ordinary moment into a much larger city of ideas.

**Design principles:**
- Begin with one person, not a crowded interface.
- Use cinematic presentation rather than introductory menus alone.
- Let movement and discovery reveal the city.
- Give Socrates a natural, expressive voice instead of relying only on default browser text-to-speech.
- Allow the narration to be rewritten or replaced without changing the entire project.

The exact opening script remains undecided.

## 5. Imagine a room, then enter it

One of our most concrete ideas was to let a visitor create a room through imagination.

The visitor describes a space in words, and eventually may provide reference images or a 3D model.

The system converts that description into a navigable environment.

Inside the room, the visitor can:

- Walk around and inspect objects.
- Read or listen to something.
- Interact with lighting and the environment.
- Record a thought in a private notebook.
- Experience the passage of time.
- Leave through a doorway or street leading to the wider City of Ideas.

The key principle is that the experience should carry something forward.

For example, after spending time reading in a room, the visitor might enter the city carrying a remembered thought and a record of the time spent there.

This is more meaningful than simply generating a room and forgetting it.

### Current prototype

A draft implementation was developed on branch `prototype/idea-to-world-v1` in pull request #2:

https://github.com/hadi1373z/city-of-ideas/pull/2

It includes a basic imagined-room experience, navigation, notebook and time state, and a connection to the main city.

**Status:** Draft and not verified as a fully working experience. It is not confirmed merged or deployed.

The room-to-city transition currently uses page navigation rather than one continuous 3D world.

## 6. Socrates and interactive inhabitants

The city should eventually contain residents who can interact with visitors.

Socrates is the central early example.

We discussed connecting selected characters to AI models with carefully designed character instructions.

Possible interactions:

- Ask Socrates a philosophical question.
- Let Socrates challenge an assumption through dialogue.
- Meet an artist who explains a technique or work.
- Discuss mathematics with a researcher.
- Return to a character and continue an earlier conversation.

Residents should not simply recite biographies. Their behavior should reflect a distinct intellectual perspective.

Historical accuracy, transparency about AI-generated dialogue, and avoiding misleading claims of authenticity are important.

## 7. A ceremony as a complete first encounter

We discussed introducing people gathered for a ceremony.

This could become the first complete narrative event in the city.

The idea is not yet fully specified, but it offers a way to connect:

1. Arrival in the world.
2. Encountering other inhabitants.
3. Listening, observing, and participating.
4. Making a meaningful choice.
5. Remembering the consequences afterward.

**Proposed direction:** Design a small, complete ceremony in an existing square or park before building a large event system.

The ceremony should have a purpose within the philosophical world, not simply provide visual spectacle.

## 8. Creating personal homes and expanding the city

Visitors could eventually generate their own homes or environments.

Inputs may include:

- A text description.
- One or several reference images.
- Existing 2D or 3D objects.
- A combination of visual and written instructions.

The generated space becomes a place the visitor can explore.

A visitor might add a house near the city, a sculpture in the park, or an extension to the forest.

User contributions should be placed coherently so the city doesn't become an arbitrary collection of objects.

## 9. Navigation, scale, and visual design

Problems identified in earlier versions included inconsistent scale: people appeared very small, and the representation of Socrates was disproportionately large.

Development requirements:

- Establish consistent human, building, furniture, and environmental scales.
- Support keyboard, mouse, touch, joystick, and eventually gamepad navigation.
- Test on desktop and mobile devices.
- Improve entrances, paths, lighting, and interaction prompts.
- Consider top, side, and street-level views when evaluating the city design.
- Make navigation intuitive without requiring detailed instructions.

## 10. Offline-first development and future multiplayer

**Current direction:** Build the experience offline or as a standalone single-player prototype first.

**Future direction:** Allow visitors to enter a shared world.

An early multiplayer experiment could involve three phones, each with its own user identity, simultaneously contributing to the city.

Longer-term possibilities include shared construction, conversations, visits to personal homes, and synchronized events.

A shared world must distinguish public creations from private notes, memories, and conversations.

Do not introduce a full online multiplayer architecture before the essential single-player experience works reliably.

## 11. Other connected ideas

A separate concept discussed was a game in which a creature progresses from one-dimensional to two-dimensional and eventually three-dimensional existence through discovery.

This could become an independent experiment or an installation within the Park of Ideas.

It should remain an optional idea rather than being forced into the main storyline.

We also discussed making new discoveries and encounters feel surprising while retaining coherent rules and a meaningful purpose.

## 12. Recommended development priorities

### Phase 1 — Make the current experience work

- Review draft pull request #2.
- Run the existing project checks.
- Test the imagined room in a browser.
- Verify that the portal is visible and accessible in city mode; check whether existing CSS hides its action button.
- Check mobile and keyboard navigation.
- Fix scene transitions, movement, and state persistence.
- Correct major scale inconsistencies.

**Success condition:** A visitor can describe a room, enter it, record a thought, and reach the city without a broken interaction.

### Phase 2 — Make the experience meaningful

- Introduce Socrates as an interactive guide.
- Add a short cinematic introduction.
- Improve the room's atmosphere and interactivity.
- Carry the visitor's memory and time into the city.
- Design and prototype the first ceremony.

**Success condition:** The visitor completes a coherent experience with a beginning, a discovery, and a consequence.

### Phase 3 — Develop the larger world

- Build the four-floor House of Zarathustra.
- Improve the Academy, Park of Ideas, galleries, and mathematical spaces.
- Allow custom homes and objects.
- Expand the landscape and city architecture.

### Phase 4 — Explore multiplayer

- Prototype a small shared world with three mobile devices.
- Give each participant a separate identity.
- Test synchronized movement and object creation.
- Define permissions and persistence.

## 13. Instructions for Codex

Use this note as the project's design backlog.

Before implementing new functionality:

1. Inspect the existing repository and open pull requests.
2. Identify which features already exist and which are only proposals.
3. Fix broken interactions and preserve working functionality.
4. Select one small, testable feature from the backlog.
5. Implement that feature in the existing architecture where practical.
6. Run available tests and verify the relevant interactions.
7. Explain what changed, what remains untested, and what should be developed next.

Avoid adding large, disconnected systems before the core visitor experience becomes coherent.

**Guiding principle:** Every new feature should contribute to the visitor's ability to imagine, experience, understand, create, or remember something.

## 14. Verified status and next action — 19 October 2026

The sections above preserve the supplied design notes. This dated section distinguishes the current build from proposals; it supersedes older implementation status, not the vision.

### Already on main

- Four-floor Zarathustra gallery, chapter text, roof connection, mountain trail and optional summit event.
- Keyboard/controller movement, fast movement, light and music controls; desktop and touch controls exist, though this is not a claim that every device is verified.
- A desk-book → Socrates question → Dalí observation → saved local reflection journey.
- Existing personal-home tools and editions, philosophical homes, artist galleries and mathematical/maker spaces. These are separate from unrestricted generation from a description.
- Central park fountain, three floating paper birds and thirteen flying origami exploring distributed routes.

### Draft PR #2 review

- PR #2 remains open and draft; the imagined-room prototype is not merged or deployed.
- It uses four procedural templates and a scripted reader; it is not AI room generation or AI character conversation.
- A normal page navigation connects the room and city. Browser-local storage carries the thought and room timer. No seamless shared world or multiplayer is implemented by this PR.
- Confirmed defect: the city-mode CSS hides toolbar actions other than speed/light/music, including the return-portal button.
- Selected small feature: restore the contextual return doorway. The draft now places its 44px action outside the filtered toolbar, hides it while panels are open, protects text entry from E navigation, and arrives facing an unobstructed doorway. Its nearby labels support English, German and Persian.
- Verified locally: release suite; create a library template; save a synthetic thought; enter city; see the thought/time; return with E; retain the room and thought; keep the help dialog open when E is pressed. Automated tests also cover proximity, overview hiding, click navigation and editing/modal guards.
- Still unverified: real mobile/touch hardware, controller traversal of the imagined room and return door, and all room themes/scales. The room interface/arrival narrative still need complete German/Persian coverage.

### Critical review and sequence

1. Finish the existing imagined-room loop before adding ceremony or multiplayer. Check furniture collisions, movement direction after turning, lost-focus input release and resource ownership when rebuilding a room.
2. Verify mobile and controller operation end to end, with a visible way to leave every interaction. Test storage failure honestly; the prototype must not report success when storage is blocked.
3. Keep private thoughts out of description-sharing links and public contributions. Browser-local persistence is not account synchronization or a secure shared archive.
4. Once those pass, connect a carried thought to one authored Socrates response or a meaningful choice in an existing city space.
5. Only then prototype one short ceremony with a remembered consequence. Keep free exploration available.

Offline-first remains a design direction. Browser-local notes do not by themselves make the website installable or fully usable without a network. Cinematic narration, AI residents, arbitrary image/model generation and multiplayer remain proposals.


### Main-city cinematic opening — 19 October 2026

The cinematic introduction is implemented directly to the main city independently of draft PR #2: begin alone with Zarathustra, reveal the existing study, meet an illustrated Socrates and enter the wider city. Authored EN/DE/FA narration and twelve packaged neural voice recordings are separate from scene code. See `docs/CINEMATIC_OPENING.md` for editing and verification. This implements a draft introduction; the script remains revisable, and no live AI resident is implied.

Persian naming: use **زرتشت** in ordinary text and **زَرْتُشْتْ** as the user-supplied pronunciation in spoken scripts. The opening audio uses this vocalization.


### Ground coherence and physical desk opening — 19 October 2026

The user clarified that coherence concerns the ground shapes and their relationship to buildings throughout the city. Removed the empty circular plaza and large Continuous city / Ideas Park sign. Replaced separate road boxes with joined paving strips, connected the civic street to real entrances and district branches, and routed the makers approach around the mountain. Building positions and personal home editions are preserved. Further planting, signage and whole-city composition still need visual refinement; connected paving alone does not complete that design.

The opening now frames a physical localized Zarathustra book on Socrates’ actual desk. The camera remains aligned when the source home restores, pulls back into the study, and leaves the visitor there to walk out. The nearby book opens the complete reader, with an optional discussion action into the existing discovery journey. Completion no longer teleports to the former center. Persian display remains زرتشت; the authored voice script retains زَرْتُشْتْ.


### Western Graveyard of Ideas and Escher house — 19 October 2026

Implemented a quiet western district around x=-360, z=-65, with six authored markers for retired or unfinished ideas. Mathematics moves to (-360,35), the Object Market to (-360,-160), and all three public travel pavilions to the eastern edge of that district. Their source identities, eight mathematics floors, source actions and carried-copy placements remain intact. The ground stays unpaved.

Escher’s House of Perspective occupies the former artists’ travel-station site, with four locally packaged official-gallery study images: Relativity (1953), Drawing Hands (1948), Ascending and Descending (1960), and Waterfall (1961). The house/relief are original interpretations. Image sources and reserved rights are recorded in src/assets/escher/SOURCES.md; observation prompts support EN/DE/FA. This adds a dedicated study house, not a generated Escher resident.

Removed the large Artists’ neighborhood board and House of Ideas return gateway/sign. Gallery doorway gaps exist only on the ground floor, with recognizable open double doors and continuous upper-floor glazing. The four freestanding return-lift poles are removed.

The city now opens at the overview on every visit. The desk-book cinematic is an explicit optional choice.


### Fountain paper boats
- Replaced all three floating bird shapes with connected, open paper-boat hulls, pointed ends and a central paper fold. No attached sails, masts or animal parts.
- Boats sit at the fountain waterline, drift slowly and bob gently; flying origami keep exploring the park.
- Selecting a boat opens its own nine-step rectangular-paper guide in English, Persian and German.
- Verified all three hulls stay inside the basin and touch the water throughout their drifting motion.
