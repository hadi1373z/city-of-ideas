import {CALVINO_ROOM, CALVINO_SOURCE} from './calvino-house-copy.js';
import {CALVINO_LENSES} from './calvino-house-model.js';

export function mountCalvinoReading(body, language, state, {onLens, onView, focusKey}) {
  const c = CALVINO_ROOM[language] || CALVINO_ROOM.en;
  if (!CALVINO_LENSES.includes(state.lens)) state.lens = 'memory';
  const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
  const button = (text, key, action) => {
    const b = el('button', text); b.type = 'button'; b.dataset.houseFocus = key; b.onclick = action; return b;
  };
  const room = el('section'); room.className = 'calvino-reading'; room.lang = language;
  room.append(el('h3', c.title), el('p', c.intro), el('h4', c.sourceTitle), el('p', c.sourceText), el('h4', c.experiment));
  const choices = CALVINO_LENSES.map((id, i) => {
    const b = button(c.labels[i], 'calvino-' + id, () => {state.lens = id; update();});
    b.setAttribute('aria-controls', 'calvino-lens-reading'); return b;
  });
  const reading = el('section'); reading.id = 'calvino-lens-reading'; reading.className = 'calvino-lens';
  reading.setAttribute('aria-live', 'polite'); reading.setAttribute('aria-atomic', 'true');
  const title = el('h4'), story = el('p'), detail = el('p'); reading.append(title, story, detail);
  const status = el('p'); status.setAttribute('role', 'status');
  const view = button(c.look, 'calvino-look', () => {if (!onView()) status.textContent = c.inside;});
  const compare = button(c.compare, 'calvino-compare', () => {state.compare = !state.compare; update();});
  compare.setAttribute('aria-controls', 'calvino-comparison');
  const comparison = el('section'); comparison.id = 'calvino-comparison'; comparison.append(el('h4', c.comparison));
  for (const id of CALVINO_LENSES) {comparison.append(el('h5', c.views[id].title), el('p', c.views[id].omission));}
  const link = el('a', c.source + ' · ' + CALVINO_SOURCE.label); link.href = CALVINO_SOURCE.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  room.append(...choices, reading, el('p', c.help), view, status, compare, comparison, link, el('small', CALVINO_SOURCE.edition), el('small', c.notice));
  if (language === 'cs') room.append(el('small', c.locale));
  body.append(room);
  function update() {
    choices.forEach((b, i) => b.setAttribute('aria-pressed', String(CALVINO_LENSES[i] === state.lens)));
    title.textContent = c.views[state.lens].title; story.textContent = c.views[state.lens].story; detail.textContent = c.views[state.lens].detail;
    comparison.hidden = !state.compare; compare.setAttribute('aria-pressed', String(!!state.compare));
    status.textContent = ''; onLens(state.lens);
  }
  update(); [...choices, view, compare].find(b => b.dataset.houseFocus === focusKey)?.focus({preventScroll: true});
  return room;
}
