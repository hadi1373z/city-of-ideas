import {EPICURUS_SETTINGS,EPICURUS_ROOM,EPICURUS_SOURCES} from './epicurus-house-copy.js';
export function mountEpicurusReading(host,language,state,{onSetting,focusKey}){
 const c=EPICURUS_ROOM[language]||EPICURUS_ROOM.en;if(!EPICURUS_SETTINGS.includes(state.setting))state.setting='pause';
 host.replaceChildren();host.lang=language;const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 host.append(el('h4',c.title),el('p',c.intro),el('h4',c.sourceTitle),el('p',c.sourceText),el('h4',c.exercise));
 const controls=EPICURUS_SETTINGS.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.epicurusFocus=id;b.setAttribute('aria-controls','epicurus-setting-reading');b.onclick=()=>{state.setting=id;update();};return b;});
 const reading=el('section');reading.id='epicurus-setting-reading';reading.setAttribute('aria-live','polite');reading.setAttribute('aria-atomic','true');
 const heading=el('h4'),scene=el('p'),text=el('p'),question=el('p'),practice=el('p');scene.className='epicurus-scene';reading.append(heading,scene,text,question,practice);host.append(...controls,reading,el('p',c.help));
 for(const id of['letter','doctrines']){const link=el('a',c[id]);link.href=EPICURUS_SOURCES[id];link.target='_blank';link.rel='noopener noreferrer';host.append(link);}
 host.append(el('small',c.sourceNote),el('small',c.notice));
 function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(EPICURUS_SETTINGS[i]===state.setting)));const s=c.readings[state.setting];heading.textContent=s.title;scene.textContent=s.scene;text.textContent=s.reading;question.textContent=s.question;practice.textContent=s.practice;onSetting(state.setting);}
 update();controls.find(b=>b.dataset.epicurusFocus===focusKey)?.focus({preventScroll:true});
}
