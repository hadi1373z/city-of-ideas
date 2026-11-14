import {PLATO_ROOM,PLATO_SOURCE} from './plato-house-copy.js';
import {PLATO_POSES,platoDiagram} from './plato-house-model.js';
export function mountPlatoReading(host,language,state,{onPose,focusKey}) {
  const c=PLATO_ROOM[language]||PLATO_ROOM.en;
  if(!PLATO_POSES.includes(state.pose))state.pose='front';
  host.replaceChildren();host.lang=language;
  const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
  host.append(el('h4',c.title),el('p',c.intro),el('h4',c.sourceTitle),el('p',c.sourceText));
  const controls=PLATO_POSES.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.platoFocus=id;b.setAttribute('aria-controls','plato-comparison-reading');b.onclick=()=>{state.pose=id;update();};return b;});
  const diagram=el('img');diagram.width=1024;diagram.height=512;
  const figure=el('figure');figure.append(diagram,el('figcaption',c.diagram));
  const reading=el('section');reading.id='plato-comparison-reading';reading.setAttribute('aria-live','polite');reading.setAttribute('aria-atomic','true');
  const heading=el('h4'),text=el('p');reading.append(heading,text,el('p',c.question));
  const source=el('a',c.source+' · '+PLATO_SOURCE.label);source.href=PLATO_SOURCE.url;source.target='_blank';source.rel='noopener noreferrer';
  host.append(...controls,figure,reading,el('p',c.help),source,el('small',c.sourceNote),el('small',c.notice));
  function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(PLATO_POSES[i]===state.pose)));const t=c.readings[state.pose];heading.textContent=t[0];text.textContent=t[1];diagram.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(platoDiagram(state.pose));diagram.alt=c.diagram+' · '+c.labels[PLATO_POSES.indexOf(state.pose)];onPose(state.pose);}
  update();controls.find(b=>b.dataset.platoFocus===focusKey)?.focus({preventScroll:true});
}
