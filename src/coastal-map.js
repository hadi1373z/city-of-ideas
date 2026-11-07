import {COAST_LANDMARKS, COAST_EXPLORER_COPY, coastMapPoint, coastWalkSvg} from './coastal-map-data.js';

import {coastVisitor,COAST_POSITION_COPY,coastPositionText,coastDistance} from './coastal-position.js';

// Native buttons keep map selection available to touch, keyboard and controllers.
// The SVG remains an ordinary image, with the same geometry in every language.
export function mountCoastalMap(container, {language = 'en', state, onVisit, visitor}) {
  const lang = Object.hasOwn(COAST_EXPLORER_COPY, language) ? language : 'en';
  const c = COAST_EXPLORER_COPY[lang], positionCopy=COAST_POSITION_COPY[lang], position=coastVisitor(visitor);
  state ||= {selected: 'gallery', route: true};
  if (!COAST_LANDMARKS.some(p => p.id === state.selected)) state.selected = 'gallery';
  const el = (tag, text, className) => {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    if (className) n.className = className;
    return n;
  };
  const button = (text, action) => {
    const n = el('button', text);
    n.type = 'button';
    n.onclick = action;
    return n;
  };
  const root = el('section', '', 'coastal-explorer');
  root.lang = lang;
  root.dir = lang === 'fa' ? 'rtl' : 'ltr';
  const intro = el('p', c.intro, 'coastal-intro');
  const layout = el('div', '', 'coastal-explorer-layout');
  const figure = el('figure', '', 'coastal-map-figure');
  const stage = el('div', '', 'coastal-map-stage');
  // Physical east and west stay fixed when the surrounding interface is RTL.
  stage.dir = 'ltr';
  const image = el('img', '', 'coastal-plan');
  image.src = new URL('./assets/city-coast-' + lang + '.svg', import.meta.url).href;
  image.alt = c.title;
  image.width = image.height = 920;
  const overlay = el('img', '', 'coastal-walk-overlay');
  overlay.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coastWalkSvg());
  overlay.alt = '';
  overlay.setAttribute('aria-hidden', 'true');
  stage.append(image, overlay);
  const list = el('div', '', 'coastal-place-list');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', c.places);
  const controls = [];
  for (const place of COAST_LANDMARKS) {
    const name = c.landmarks[place.id].name;
    const marker = button(String(place.number), () => select(place.id));
    marker.className = 'coastal-landmark';
    marker.setAttribute('aria-label', place.number + '. ' + name);
    marker.title = name;
    const [x, y] = coastMapPoint(...place.point);
    marker.style.left = x / 920 * 100 + '%';
    marker.style.top = y / 920 * 100 + '%';
    const item = button(place.number + '. ' + name, () => select(place.id));
    for (const [control, prefix] of [[marker, 'marker-'], [item, 'place-']]) {
      control.dataset.coastFocus = prefix + place.id;
      control.dataset.landmark = place.id;
      control.setAttribute('aria-controls', 'coastal-location-info');
      controls.push(control);
    }
    stage.append(marker);
    list.append(item);
  }
  const caption = el('figcaption', c.places);
  const positionSummary=el('p',coastPositionText(position,positionCopy),'coastal-position-summary');
  positionSummary.id='coastal-position-summary';
  if(position){
    const marker=el('span','','coastal-visitor-position');marker.id='coastal-visitor-position';
    marker.setAttribute('role','img');marker.setAttribute('aria-label',positionSummary.textContent);
    marker.style.left=position.point[0]/920*100+'%';marker.style.top=position.point[1]/920*100+'%';
    if(position.yaw!==null){marker.dataset.heading='true';marker.style.transform='translate(-50%,-50%) rotate('+(-position.yaw*180/Math.PI)+'deg)';}
    marker.dataset.underground=String(position.belowGround);stage.append(marker);
  }
  figure.append(stage, caption, positionSummary);
  const sidebar = el('div', '', 'coastal-map-sidebar');
  const heading = el('h3', c.places);
  const info = el('section', '', 'coastal-location-info');
  info.id = 'coastal-location-info';
  info.setAttribute('aria-live', 'polite');
  info.setAttribute('aria-atomic', 'true');
  info.setAttribute('aria-labelledby', 'coastal-location-name');
  const kicker = el('p', c.information, 'coastal-kicker');
  const name = el('h3');
  name.id = 'coastal-location-name';
  const area = el('p', '', 'coastal-location-area');
  const description = el('p'),distance=el('p');distance.id='coastal-position-distance';distance.className='coastal-position-distance';
  const visit = button(c.visit, () => onVisit(state.selected));
  visit.dataset.coastFocus = 'visit';
  info.append(kicker, name, area, description, distance);
  // Keep the focused action outside the live region so selection is announced once.
  sidebar.append(heading, list, info, visit);
  layout.append(figure, sidebar);

  const route = el('section', '', 'coastal-route');
  const toggle = button(c.route, () => {
    state.route = !state.route;
    updateRoute();
  });
  toggle.dataset.coastFocus = 'route';
  toggle.setAttribute('aria-controls', 'coastal-route-guide');
  const status = el('span', '', 'coastal-route-status');
  status.setAttribute('role', 'status');
  const guide = el('div');
  guide.id = 'coastal-route-guide';
  const help = el('p', c.routeHelp);
  const steps = el('ol');
  for (const step of c.steps) steps.append(el('li', step));
  guide.append(help, steps);
  route.append(toggle, status, guide);
  root.append(intro, layout, route);
  container.append(root);

  function select(id) {
    if (!Object.hasOwn(c.landmarks, id)) return;
    state.selected = id;
    const place = c.landmarks[id];
    name.textContent = place.name;
    area.textContent = place.area;
    description.textContent = place.description;
    distance.textContent=coastDistance(position,COAST_LANDMARKS.find(p=>p.id===id).point,lang,positionCopy);distance.hidden=!position;
    visit.setAttribute('aria-label', c.visit + ' · ' + place.name);
    for (const n of controls) n.setAttribute('aria-pressed', String(n.dataset.landmark === id));
  }
  function updateRoute() {
    toggle.setAttribute('aria-pressed', String(state.route));
    overlay.hidden = guide.hidden = !state.route;
    status.textContent = state.route ? c.shown : c.hidden;
  }
  select(state.selected);
  updateRoute();
  return {root, state};
}
