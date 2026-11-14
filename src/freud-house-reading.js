import {FREUD_ROOM, FREUD_SOURCE} from './freud-house-copy.js';
import {FREUD_PHASES, freudLayers} from './freud-house-model.js';

export function mountFreudReading(body, language, state, {onPhase, focusKey}) {
  const c = FREUD_ROOM[language] || FREUD_ROOM.en;
  if (!FREUD_PHASES.includes(state.phase)) state.phase = 'report';
  const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
  const room = el('section'); room.className = 'freud-reading'; room.lang = language;
  room.append(el('h3', c.title), el('p', c.intro), el('h4', c.sourceTitle), el('p', c.sourceText), el('h4', c.exercise), el('p', c.help));
  const controls = FREUD_PHASES.map((id, i) => {
    const b = el('button', c.labels[i]); b.type = 'button'; b.dataset.houseFocus = 'freud-' + id;
    b.setAttribute('aria-controls', 'freud-reading-stage'); b.onclick = () => {state.phase = id; update();}; return b;
  });
  const report = el('section'); report.className = 'freud-report'; report.append(el('h4', c.reportTitle), el('p', c.report));
  const stage = el('section'); stage.id = 'freud-reading-stage'; stage.setAttribute('aria-live', 'polite'); stage.setAttribute('aria-atomic', 'true');
  const background = el('section'); background.id = 'freud-background'; background.append(el('h5', c.backgroundTitle), el('p', c.background));
  const title = el('h4'), explanation = el('p'), prompt = el('p'); stage.append(background, title, explanation, prompt);
  const link = el('a', c.source + ' · ' + FREUD_SOURCE.label); link.href = FREUD_SOURCE.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  room.append(...controls, report, stage, link, el('small', c.sourceNote), el('small', c.notice)); body.append(room);
  function update() {
    const layers = freudLayers(state.phase), text = c.stages[state.phase];
    controls.forEach((b, i) => b.setAttribute('aria-pressed', String(FREUD_PHASES[i] === state.phase)));
    background.hidden = !layers.context; title.textContent = text.title; explanation.textContent = text.text; prompt.textContent = text.prompt;
    onPhase(state.phase);
  }
  update(); controls.find(b => b.dataset.houseFocus === focusKey)?.focus({preventScroll: true}); return room;
}
