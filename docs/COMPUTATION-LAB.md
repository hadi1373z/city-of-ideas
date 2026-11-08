# House of Computation · working models

The existing house at (229, −129) now contains three connected, pickable exhibits.
Life stands against the left wall, elementary automata against the right, and
the tape machine uses the original back-board position. Frames reach the floor.
The reading desk moves to the front-right window, leaving both side displays
and the centre aisle approachable. No new building lot or island surface is added.

Entry from a room interaction or its study controls opens the laboratory.
`?arrival=computation-lab` enters the same house and opens the last used model.
Tabs turn toward the selected physical board without moving the visitor.
The original counter/halting/diagonal lesson remains a separate button. It restores
its original physical board; returning to the new laboratory restores the tape.

## Three models

- **Conway’s Life:** simultaneous B3/S23 on 24 × 16 cells, with dead or wrapped
  edges. Block, blinker, glider and R-pentomino presets; pointer, keyboard and
  numeric-coordinate editing; cell/neighbour/next-state inspection; exact
  full-board repeat detection within the last 128 generations. Editing makes
  the current board a new seed. A boundary change starts a new experiment.
- **Elementary automata:** 61 cells, arbitrary rule 0…255, named 30/90/110 choices,
  centred binary seed, eight-entry rule table, simultaneous updates, dead or
  wrapped edges. The latest 41 rows retain an explicit generation range. A text
  version of the current row accompanies the diagram.
- **Tape machines:** fully listed unary and binary increment transition tables,
  sparse tape extending to negative or positive positions, head/state/step count,
  visible read/write/move transitions, next-transition highlighting and a live
  text version of nonblank tape cells. At most 4,096 transitions per run.

All animation is initiated by Play. Step applies one update; Step × 10 applies
up to ten, stopping at a tape halt. Closing the controls, leaving the house,
switching models, loading a preset and hiding the page pause playback. No
background wall-clock catch-up occurs. A complete Life state repeating is
evidence for a cycle under its fixed finite rules; no observed repeat is not
evidence for nonperiodicity. Finite automata diagrams do not demonstrate Rule
110’s infinite-system universality construction. These are fixed teaching
machines, not an arbitrary-code runner or a general halting solver.

English investigations cover synchronous updates, information loss, finite-state
recurrence, Rule 90 over GF(2), special initial conditions in universality proofs,
complete machine configurations, binary carry and termination measures. Links
point to Golly’s own rule/boundary documentation, Cook’s published paper,
Wolfram’s elementary-automaton reference and Turing’s original paper. Architecture,
diagrams, examples and text are original; no third-party images or voices added.

## Persistence and checks

`city-of-ideas:computation-lab:v1` stores each experiment independently and the
active exhibit. Loading validates dimensions, alphabets, rule numbers and bounds.
Repeat and short tape trace histories restart on reload; saved configurations
and generation/step counts remain. Note drafts remain in memory until the explicit
Keep button writes the observation to this key and the existing personal notebook.
No earlier study notes, voices, credentials, asset credits or account data change.

Model checks enumerate all 3 × 3 Life states under both edge conventions, every
elementary rule neighbourhood, Rule 90 superposition and more than a thousand
increment inputs. UI checks exercise actual controls, persistence, pause paths,
legacy study and disposal. Geometry checks bound added draws, verify physical
targets and ensure the centre and side approach lines stay clear. Browser QA
checks rendered boards, models, input handling, walking and small-screen fit.

## House-detail review reconciliation

The review branch retains the three classic houses' fifteen EN/DE/FA/CS advanced
sections, experiments, first predictions, private drafts/carets and existing
notebook keys. Computation's hourly run journal and leg joints now follow main's
desk relocation to local (5, 4.3); the journal remains on the original sheet.
Its symbols/marker still follow only the classic countdown/cycle/long-run state.

Journal picks open the full original reader and restore its physical board;
room work and new model boards open this laboratory. The explicit legacy action
and the original-reader handoff retain each model's configuration and unsaved
classic drafts. Original-reader language changes do not write the lab key.

Only the open/legacy handoffs and English-content notice support EN/DE/FA/CS.
The new model UI, instructions and investigations remain English. This does not
claim full lab or city localization. The laboratory retains its separate key
and main's explicit experiment/save/pause behavior. Co-installation tests cover
all four handoff languages, model retention, journal/full-reader routing,
separate stores and unchanged classic first predictions/drafts/carets.

The computation shell/collider baseline was independently measured from main
975ed0dcfed3ea4621e5ca3da02afd76874b493e, including its intentional desk move.
Proof's e2598f0 baseline and Uncertainty's baseline remain unchanged.
