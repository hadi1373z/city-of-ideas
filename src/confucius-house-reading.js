import {CONFUCIUS_STEPS,CONFUCIUS_ROOM,CONFUCIUS_SOURCE} from './confucius-house-copy.js';
export function mountConfuciusReading(host,language,state,{onStep,focusKey}){
 const c=CONFUCIUS_ROOM[language]||CONFUCIUS_ROOM.en;if(!CONFUCIUS_STEPS.includes(state.step))state.step='notice';host.replaceChildren();host.lang=language;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};host.append(el('h4',c.title),el('p',c.intro),el('h4',c.sourceTitle),el('p',c.sourceText),el('h4',c.exercise));
 const controls=CONFUCIUS_STEPS.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.confuciusFocus=id;b.setAttribute('aria-controls','confucius-learning-reading');b.onclick=()=>{state.step=id;update();};return b;});
 const result=el('section');result.id='confucius-learning-reading';result.setAttribute('aria-live','polite');result.setAttribute('aria-atomic','true');const heading=el('h4'),scene=el('p'),text=el('p'),question=el('p'),practice=el('p');scene.className='confucius-scene';result.append(heading,scene,text,question,practice);host.append(...controls,result,el('p',c.help));
 const link=el('a',c.source);link.href=CONFUCIUS_SOURCE;link.target='_blank';link.rel='noopener noreferrer';host.append(link,el('small',c.sourceNote),el('small',c.notice));
 function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(CONFUCIUS_STEPS[i]===state.step)));const r=c.readings[state.step];heading.textContent=r.title;scene.textContent=r.scene;text.textContent=r.text;question.textContent=r.question;practice.textContent=r.practice;onStep(state.step);}
 update();controls.find(b=>b.dataset.confuciusFocus===focusKey)?.focus({preventScroll:true});
}
