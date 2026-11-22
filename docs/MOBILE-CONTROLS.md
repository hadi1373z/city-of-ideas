# Touch movement and compact controls

The four touch arrows are replaced by one circular joystick. Drag direction
selects forward/backward and strafe; distance controls speed after a 12% radial
dead zone. Diagonal input is normalized. Releasing the controlling pointer
stops movement. Another pointer cannot take ownership, so a second finger can
continue looking around on the canvas.

`mobile-controls.js` exposes `CITY_TOUCH.poll(blocked)` and merges these axes
with the physical controller in the original `gallery.js` input update. Native
walking, stair heights, collisions, transitions and activity interruptions still
own movement. Do not synthesize arrow-key events or create a second walking
controller. Blur, hidden page, resize, pointer cancellation, lost capture,
blocked input and native `clearMovement` all reset the joystick. A focused
joystick also accepts WASD/arrows and stops with Space, Enter or Escape.

At widths up to 800px, or landscape screens up to 960px wide and 500px high,
the top three-line button opens a scrollable controls panel. It moves the
original header controls and visit toolbar into that panel, including controls
added after startup. It never clones controls. Returning to desktop restores
the same nodes at their original placeholders.

The nonmodal dialog pauses native movement through the existing open-dialog
guard. Its backdrop, close button, hamburger and Escape close it. Selecting an
action closes the panel before that action opens another reader or dialog.
Focus returns to the hamburger on ordinary dismissal; action selection leaves
focus to the original action. Labels and instructions support FA, EN and DE.

Validation: `tests/mobile-controls.mjs`, `tests/gamepad-input.cjs`,
`tests/root-controls.mjs`, `tests/default-language.cjs` and source checks.
Actual 390×844 browser testing confirmed climbing the unchanged Escher stairs,
stopping on release, opening the menu, opening help from it, and restoring the
desktop controls at 1100×800. Screenshots:
`design/visual-walk/mobile-joystick-20261122.jpg` and
`design/visual-walk/mobile-menu-20261122.jpg`.
