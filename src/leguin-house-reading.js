import {LEGUIN_ROOM, LEGUIN_SOURCES} from './leguin-house-copy.js';
import {LEGUIN_OBJECTS, leguinContents, leguinToggle} from './leguin-house-model.js';

export function mountLeguinReading(body, language, state, {onContents, focusKey}) {
  const c = LEGUIN_ROOM[language] || LEGUIN_ROOM.en;
  state.selected = leguinContents(state.selected);
  const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
  const room = el('section'); room.className = 'leguin-reading'; room.lang = language;
  room.append(el('h3', c.title), el('p', c.intro), el('h4', c.sourceTitle), el('p', c.sourceText), el('h4', c.exercise), el('p', c.help));
  const controls = LEGUIN_OBJECTS.map((id, i) => {
    const b = el('button', c.labels[i]); b.type = 'button'; b.dataset.houseFocus = 'leguin-' + id;
    b.setAttribute('aria-controls', 'leguin-collection'); b.onclick = () => {state.selected = leguinToggle(state.selected, id); update();}; return b;
  });
  const reset = el('button', c.clear); reset.type = 'button'; reset.dataset.houseFocus = 'leguin-reset';
  reset.setAttribute('aria-controls', 'leguin-collection'); reset.onclick = () => {state.selected = []; update();};
  const collection = el('section'); collection.id = 'leguin-collection'; collection.setAttribute('aria-live', 'polite'); collection.setAttribute('aria-atomic', 'true');
  room.append(...controls, reset, collection);
  for (const source of LEGUIN_SOURCES) {
    const link = el('a', c.source + ' · ' + source.label); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; room.append(link);
  }
  room.append(el('small', c.notice)); body.append(room);
  function update() {
    controls.forEach((b, i) => b.setAttribute('aria-pressed', String(state.selected.includes(LEGUIN_OBJECTS[i]))));
    collection.replaceChildren(el('h4', c.collection));
    if (!state.selected.length) collection.append(el('p', c.empty));
    else {
      const passage = el('p', state.selected.map(id => c.objects[id].line).join(' ')); passage.className = 'leguin-gathered'; collection.append(passage);
      for (const id of state.selected) {const s = el('section'), text = c.objects[id]; s.append(el('h5', text.title), el('p', text.story), el('p', text.detail)); collection.append(s);}
    }
    collection.append(el('p', c.question)); onContents([...state.selected]);
  }
  update(); [...controls, reset].find(b => b.dataset.houseFocus === focusKey)?.focus({preventScroll: true}); return room;
}
