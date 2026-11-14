import {HYPATIA_STAGES,hypatiaDiagram} from './hypatia-house-model.js';
import {HYPATIA_ROOM,HYPATIA_SOURCES} from './hypatia-house-copy.js';
export function mountHypatiaReading(host,language,state,{onStage,focusKey}){
 const c=HYPATIA_ROOM[language]||HYPATIA_ROOM.en;if(!HYPATIA_STAGES.includes(state.stage))state.stage='two';host.replaceChildren();host.lang=language;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};host.append(el('h4',c.title),el('p',c.intro),el('h4',c.historyTitle),el('p',c.history),el('h4',c.exercise));
 const controls=HYPATIA_STAGES.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.hypatiaFocus=id;b.setAttribute('aria-controls','hypatia-construction-reading');b.onclick=()=>{state.stage=id;update();};return b;});
 const result=el('section');result.id='hypatia-construction-reading';result.setAttribute('aria-live','polite');result.setAttribute('aria-atomic','true');const heading=el('h4'),text=el('p'),question=el('p');result.append(heading,text,question);
 const figure=el('figure'),image=el('img'),caption=el('figcaption');figure.append(image,caption);host.append(...controls,result,figure,el('p',c.geometry),el('p',c.help));
 for(const id of['history','geometry']){const link=el('a',c[id+'Link']);link.href=HYPATIA_SOURCES[id];link.target='_blank';link.rel='noopener noreferrer';host.append(link);}host.append(el('small',c.notice));
 function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(HYPATIA_STAGES[i]===state.stage)));const r=c.readings[state.stage];heading.textContent=r.title;text.textContent=r.text;question.textContent=r.question;image.alt=c.diagram+' · '+c.labels[HYPATIA_STAGES.indexOf(state.stage)]+'. '+r.caption;image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(hypatiaDiagram(state.stage));caption.textContent=r.caption;onStage(state.stage);}
 update();controls.find(b=>b.dataset.hypatiaFocus===focusKey)?.focus({preventScroll:true});
}
