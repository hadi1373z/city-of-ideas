import {ADA_ROOM, ADA_SOURCE} from './ada-house-copy.js';
import {ADA_PROGRAMS, adaTrace} from './ada-house-model.js';

export function mountAdaReading(body, language, state, focusKey) {
  const c = ADA_ROOM[language] || ADA_ROOM.en;
  const el = (tag, text) => {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    return n;
  };
  const button = (label, key, fn) => {
    const b = el('button', label);
    b.type = 'button';
    b.dataset.houseFocus = key;
    b.onclick = fn;
    return b;
  };
  const room = el('section');
  room.className = 'ada-reading';
  room.lang = Object.hasOwn(ADA_ROOM, language) ? language : 'en';
  room.append(el('h3', c.title), el('p', c.intro));
  for (const [heading, paragraph] of c.sections) {
    const section = el('section');
    section.append(el('h4', heading), el('p', paragraph));
    room.append(section);
  }
  const experiment = el('section');
  experiment.className = 'ada-experiment';
  experiment.append(el('h4', c.experiment));
  const orders = Object.keys(ADA_PROGRAMS).map((id, i) => button(c.orders[i], id, () => {
    state.order = id;
    state.completed = 0;
    update();
  }));
  const table = el('table');
  table.setAttribute('aria-label', c.experiment);
  const status = el('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const next = button(c.next, 'ada-next', () => {
    if (state.completed < 2) state.completed++;
    update();
  });
  const reset = button(c.reset, 'ada-reset', () => {
    state.completed = 0;
    update();
  });
  experiment.append(...orders, table, next, reset, status);
  const link = el('a', c.sources + ' · ' + ADA_SOURCE.label);
  link.href = ADA_SOURCE.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  room.append(experiment, link, el('small', ADA_SOURCE.edition), el('small', c.notice));
  if (language === 'cs') room.append(el('small', c.locale));
  body.append(room);
  function update() {
    const values = adaTrace(state.order, state.completed);
    orders.forEach((b, i) => b.setAttribute('aria-pressed', String(Object.keys(ADA_PROGRAMS)[i] === state.order)));
    table.replaceChildren();
    const header = el('tr');
    for (const label of [c.card, c.value]) { const th = el('th', label); th.setAttribute('scope', 'col'); header.append(th); }
    const head = el('thead'); head.append(header);
    const rows = el('tbody');
    values.forEach((value, i) => {
      const row = el('tr');
      row.append(el('td', i === 0 ? c.start : i + ' · ' + c.operations[ADA_PROGRAMS[state.order][i-1]]), el('td', String(value)));
      rows.append(row);
    });
    table.append(head, rows);
    // Keep the completed action focusable for predictable keyboard/controller use.
    next.setAttribute('aria-disabled', String(state.completed === 2));
    status.textContent = c.value + ': ' + values.at(-1) + '. ' + (state.completed === 2 ? c.done : c.ready);
  }
  update();
  [...orders, next, reset].find(b => b.dataset.houseFocus === focusKey)?.focus({preventScroll: true});
  return room;
}
