# Idea to World — prototype v1

**Design principle:** First imagine, then experience, then carry a discovered idea into the world.

The experimental route is \`idea-room.html\`. The existing city remains in \`index.html\`; no private House archive, credentials, or live service state is transferred.

## Try the prototype

1. Open the city welcome view, choose **Imagine a room**, and describe a reader and their surroundings. The first version recognizes study, library, garden and observatory cues, constructing geometry from fixed templates. It **does not** call generative AI or create arbitrary geometry.
2. Choose **Imagine room**. Walk with WASD, arrow keys or touch controls, and drag to look around. **Talk to reader** asks a scripted question, and **Open notebook** lets you write a response.
3. Use **Keep this idea**, then walk through the front doorway, along the lit street, and through the **City of Ideas** gate. The gate loads the original city street, with the idea and elapsed journey time visible in a local arrival banner.
4. Near the bronze doorway at the original city plaza, select **Enter imagined room** or press E to return. Your room description, notebook and elapsed time are stored only in this browser through \`localStorage\`.
5. **Time: evening/morning** switches the room lighting. The HUD also shows elapsed journey time and the local Prague clock. **Share room description** creates a link containing the description, **not** the private notebook.

## Design boundaries and next increment

- The two environments are bridged with a normal navigation transition. They are **not yet one continuous shared 3D scene**. The original city mesh, controls, districts, and personal House data are unmodified.
- The resident is a non-photoreal static figure with a scripted question. No live conversational intelligence is implied.
- This is an opt-in test branch, not a deployed live feature. Desktop and Android browser interaction need human verification before merging.
- Next: replace the page transition with an in-world scene portal, add a story state that affects a second encounter, then evaluate whether remembering an idea improves compared with reading alone.

## Verification

\`node tests/idea-to-world.mjs\` checks script syntax and the local route, links, and state interface.
\`npm run check\` runs the existing suite plus the new static regression check. Manual 3D, gamepad, and mobile checks are still required.
