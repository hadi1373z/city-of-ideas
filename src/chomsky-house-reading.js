import {CHOMSKY_ROOM, CHOMSKY_SOURCE} from './chomsky-house-copy.js';
import {CHOMSKY_GROUPINGS, chomskyTree, chomskyWords, chomskyScope, chomskyBrackets, chomskyDiagram} from './chomsky-house-model.js';

export function mountChomskyReading(body, language, state, {onGrouping, focusKey}) {
  const c = CHOMSKY_ROOM[language] || CHOMSKY_ROOM.en;
  if (!CHOMSKY_GROUPINGS.includes(state.grouping)) state.grouping = 'both';
  const el = (tag, text) => {const n = document.createElement(tag); if (text) n.textContent = text; return n;};
  const room = el('section'); room.className = 'chomsky-reading'; room.lang = language;
  const example = el('p', chomskyWords(chomskyTree('both')).join(' ')); example.className = 'chomsky-example'; example.lang = 'en'; example.dir = 'ltr';
  room.append(el('h3', c.title), el('p', c.intro), el('h4', c.sourceTitle), el('p', c.sourceText), el('h4', c.example), example, el('p', c.gloss));
  const controls = CHOMSKY_GROUPINGS.map((id, i) => {
    const b = el('button', c.labels[i]); b.type = 'button'; b.dataset.houseFocus = 'chomsky-' + id;
    b.setAttribute('aria-controls', 'chomsky-grouping-result'); b.onclick = () => {state.grouping = id; update();}; return b;
  });
  const figure = el('figure'), diagram = el('img'), caption = el('figcaption', c.diagram); diagram.width = 1024; diagram.height = 512; figure.append(diagram, caption);
  const result = el('section'); result.id = 'chomsky-grouping-result'; result.setAttribute('aria-live', 'polite'); result.setAttribute('aria-atomic', 'true');
  const title = el('h4'), explanation = el('p'), prompt = el('p'), scope = el('p');
  const brackets = el('p'); brackets.className = 'chomsky-brackets'; brackets.lang = 'en'; brackets.dir = 'ltr'; brackets.setAttribute('aria-label', c.bracket);
  result.append(title, explanation, brackets, scope, prompt);
  const link = el('a', c.source + ' · ' + CHOMSKY_SOURCE.label); link.href = CHOMSKY_SOURCE.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  room.append(...controls, figure, result, el('h4', c.contextTitle), el('p', c.context), link, el('small', c.sourceEdition), el('small', c.notice)); body.append(room);
  function update() {
    const i = CHOMSKY_GROUPINGS.indexOf(state.grouping);
    controls.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    const text = c.texts[state.grouping]; title.textContent = text[0]; explanation.textContent = text[1]; prompt.textContent = text[2];
    brackets.textContent = chomskyBrackets(state.grouping); scope.textContent = c.scope + ': ' + chomskyScope(state.grouping).map(n => c.nouns[n]).join(' · ');
    diagram.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(chomskyDiagram(state.grouping)); diagram.alt = c.diagram + ' · ' + c.labels[i];
    onGrouping(state.grouping);
  }
  update(); controls.find(b => b.dataset.houseFocus === focusKey)?.focus({preventScroll: true}); return room;
}
