# Touch movement and compact controls

The final 22 November direction is **two matched translucent joysticks with no
visible writing**: left moves, right looks. This supersedes the earlier drag-only
right side, its disappearing text hint and the temporary steering-only idea.

Up/down moves forward/back; left/right strafes without changing the view.
Distance controls input after a 12% dead zone, with small orthogonal finger
wobble ignored and diagonal magnitude capped at one. Releasing stops movement.
CITY_TOUCH.poll(blocked) feeds the original movement axes in gallery.js.
CITY_LOOK uses the same bounded, pointer-owned joystick factory; its axes merge
only into the existing gamepad lookX/lookY axes and original pitch limits. Both
sticks work simultaneously and releasing either stops only its own action.
All walking, stairs, collisions and world transitions remain native. Keyboard
and physical gamepad mappings stay unchanged; never synthesize key events.

bindViewControls retains native canvas look sensitivity and pitch limits.
During a walking visit, touch drags look only on the right half; genuine taps
can still select artwork anywhere. Mouse drag and overview orbit remain native.
Both movement and looking own their pointer IDs. Another finger cannot steal or
release a gesture. Touch focus changes do not release a captured movement finger;
keyboard blur, window blur, resize, hidden page, pointer cancellation/lost capture,
blocked input and native clearMovement still reset the appropriate controls.
Both control-circle centres align horizontally and their bases/thumbs are
translucent. There is no visible instruction label. Screen-reader labels and
instructions remain available in all three languages. No preference is stored.

At widths up to 800px, or landscape screens up to 960px wide and 500px high,
the top three-line button opens a scrollable controls panel. It transports the
original header and visit-toolbar nodes, including later-added visitor buttons.
The owner-only Admin destination has no link in the public game controls. The
location badge is hidden at the owner's request. Returning to desktop restores
those same visitor-control nodes; never clone them.
The nonmodal controls dialog pauses native movement through the open-dialog
guard. Backdrop, close button, hamburger and Escape dismiss it. Selecting an
action closes it before that action opens another reader or dialog. Ordinary
dismissal returns focus to the hamburger. FA/EN/DE labels share the city language.

Validation: tests/mobile-controls.mjs executes the real root input and canvas
handlers. It covers simultaneous movement/look pointers, focus retention,
unrelated pointer release, left-scene drag versus artwork tap, modal suppression,
native stair-axis delivery, independent look-only yaw/pitch and stop behavior,
analog/diagonal bounds, resets and menu transport.
Also run tests/gamepad-input.cjs, tests/root-controls.mjs,
tests/default-language.cjs and source integrity checks.

Earlier mobile-joystick-20261122.jpg / mobile-menu-20261122.jpg screenshots
record the initial right-side movement control, before the approved two-hand
layout. They are historical rather than proof of the final positions.
