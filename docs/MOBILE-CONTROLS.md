# Touch movement and compact controls

The user explicitly selected the two-hand phone layout on 22 November:
**left joystick moves; dragging the right scene area looks around**. This
supersedes the temporary suggestion to steer with the movement joystick.

Up/down moves forward/back; left/right strafes without changing the view.
Distance controls input after a 12% dead zone, with small orthogonal finger
wobble ignored and diagonal magnitude capped at one. Releasing stops movement.
CITY_TOUCH.poll(blocked) feeds the original controller axes in gallery.js.
All walking, stairs, collisions and world transitions remain native. Keyboard
and physical gamepad mappings stay unchanged; never synthesize key events.

bindViewControls retains native canvas look sensitivity and pitch limits.
During a walking visit, touch drags look only on the right half; genuine taps
can still select artwork anywhere. Mouse drag and overview orbit remain native.
Both movement and looking own their pointer IDs. Another finger cannot steal or
release a gesture. Touch focus changes do not release a captured movement finger;
keyboard blur, window blur, resize, hidden page, pointer cancellation/lost capture,
blocked input and native clearMovement still reset the appropriate controls.
The noninteractive right-side look hint never intercepts scene taps or drags.
Both control-circle centres align horizontally. The look label has a translucent
backing and disappears after the first meaningful look drag in that page visit;
a tap or movement-stick use does not dismiss it. No persistent preference is
written, and accessible look instructions remain available.

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
native stair-axis delivery, analog/diagonal bounds, resets and menu transport.
Also run tests/gamepad-input.cjs, tests/root-controls.mjs,
tests/default-language.cjs and source integrity checks.

Earlier mobile-joystick-20261122.jpg / mobile-menu-20261122.jpg screenshots
record the initial right-side movement control, before the approved two-hand
layout. They are historical rather than proof of the final positions.
