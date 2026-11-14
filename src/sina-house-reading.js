import {SINA_VIEWS,SINA_ROOM,SINA_SOURCE} from './sina-house-copy.js';
export function mountSinaReading(host,language,state,{onView,focusKey}){
 const c=SINA_ROOM[language]||SINA_ROOM.en;if(!SINA_VIEWS.includes(state.view))state.view='outline';host.replaceChildren();host.lang=language;const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};host.append(el('h4',c.title),el('p',c.intro),el('h4',c.sourceTitle),el('p',c.sourceText),el('h4',c.exercise));
 const controls=SINA_VIEWS.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.sinaFocus=id;b.setAttribute('aria-controls','sina-description-reading');b.onclick=()=>{state.view=id;update();};return b;});
 const result=el('section');result.id='sina-description-reading';result.setAttribute('aria-live','polite');result.setAttribute('aria-atomic','true');const heading=el('h4'),scene=el('p'),text=el('p'),question=el('p'),practice=el('p');scene.className='sina-scene';result.append(heading,scene,text,question,practice);host.append(...controls,result,el('p',c.help));
 const link=el('a',c.source);link.href=SINA_SOURCE;link.target='_blank';link.rel='noopener noreferrer';host.append(link,el('small',c.sourceNote),el('small',c.notice));
 function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(SINA_VIEWS[i]===state.view)));const r=c.readings[state.view];heading.textContent=r.title;scene.textContent=r.scene;text.textContent=r.text;question.textContent=r.question;practice.textContent=r.practice;onView(state.view);}
 update();controls.find(b=>b.dataset.sinaFocus===focusKey)?.focus({preventScroll:true});
}
