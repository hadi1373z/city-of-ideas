import {ARISTOTLE_CASES,ARISTOTLE_ROOM,ARISTOTLE_SOURCE} from './aristotle-house-copy.js';
export function mountAristotleReading(host,language,state,{onCase,focusKey}) {
 const c=ARISTOTLE_ROOM[language]||ARISTOTLE_ROOM.en;if(!ARISTOTLE_CASES.includes(state.caseId))state.caseId='discussion';
 host.replaceChildren();host.lang=language;const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 host.append(el('h4',c.title),el('p',c.intro),el('h4',c.sourceTitle),el('p',c.sourceText),el('h4',c.exercise));
 const controls=ARISTOTLE_CASES.map((id,i)=>{const b=el('button',c.labels[i]);b.type='button';b.dataset.aristotleFocus=id;b.setAttribute('aria-controls','aristotle-case-reading');b.onclick=()=>{state.caseId=id;update();};return b;});
 const reading=el('section');reading.id='aristotle-case-reading';reading.setAttribute('aria-live','polite');reading.setAttribute('aria-atomic','true');
 const heading=el('h4'),scene=el('p'),text=el('p'),question=el('p'),practice=el('p');scene.className='aristotle-scene';reading.append(heading,scene,text,question,practice);
 const source=el('a',c.source+' · '+ARISTOTLE_SOURCE.label);source.href=ARISTOTLE_SOURCE.url;source.target='_blank';source.rel='noopener noreferrer';host.append(...controls,reading,el('p',c.help),source,el('small',c.sourceNote),el('small',c.notice));
 function update(){controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(ARISTOTLE_CASES[i]===state.caseId)));const s=c.situations[state.caseId];heading.textContent=s.title;scene.textContent=s.scene;text.textContent=s.reading;question.textContent=s.question;practice.textContent=s.practice;onCase(state.caseId);}
 update();controls.find(b=>b.dataset.aristotleFocus===focusKey)?.focus({preventScroll:true});
}
