import {PUBLIC_FA} from './city-tools-merged-public-fa.js';
import {collectPrivateStrings,protectedText,protectedAttribute,createPublicTranslator,markPublicText,markPrivateText} from './city-tools-observer-core.js';
export {markPublicText,markPrivateText};
// Drop-in replacement for the copied tools observer. Single observer; no owner locale globals.
export function initToolsLanguage({button,getState=()=>null,documentLike=document,windowLike=window}){
 const doc=documentLike,w=windowLike;let lang='en';try{lang=new URL(w.location.href).searchParams.get('lang')||w.localStorage.getItem('zarathustra-city-language')||'en';}catch{}lang=lang==='fa'?'fa':'en';
 const translate=createPublicTranslator(PUBLIC_FA),textRecords=new WeakMap(),attributeRecords=new WeakMap();let applying=false,pending=false,initialized=false;
 function apply(){if(applying)return;applying=true;try{
  const privateStrings=collectPrivateStrings(getState());doc.documentElement.lang=lang;doc.documentElement.dir=lang==='fa'?'rtl':'ltr';doc.body.dataset.language=lang;
  const walker=doc.createTreeWalker(doc.body,w.NodeFilter?.SHOW_TEXT??4);let node;
  while(node=walker.nextNode()){if(protectedText(node,privateStrings))continue;const record=textRecords.get(node),raw=record&&node.nodeValue===record.last?record.raw:node.nodeValue,target=translate(raw,lang);textRecords.set(node,{raw,last:target});if(target!==node.nodeValue)node.nodeValue=target;}
  for(const el of doc.querySelectorAll('[title],[aria-label],[placeholder]')){const records=attributeRecords.get(el)||{};for(const name of ['title','aria-label','placeholder']){if(!el.hasAttribute(name))continue;const now=el.getAttribute(name),record=records[name],raw=record?.last===now?record.raw:now;if(protectedAttribute(el,name,raw,privateStrings))continue;const target=translate(raw,lang);records[name]={raw,last:target};if(target!==now)el.setAttribute(name,target);}attributeRecords.set(el,records);}
  const title=doc.querySelector('title');if(title){const record=textRecords.get(title),raw=record&&title.textContent===record.last?record.raw:title.textContent,target=translate(raw,lang);textRecords.set(title,{raw,last:target});title.textContent=target;}
  const description=doc.querySelector('meta[name="description"]');if(description){const raw=description.dataset.originalPublicContent??description.getAttribute('content');description.dataset.originalPublicContent=raw;description.setAttribute('content',translate(raw,lang));}
 }finally{applying=false;}}
 function schedule(){if(pending)return;pending=true;w.queueMicrotask(()=>{pending=false;apply();});}
 const observer=new w.MutationObserver(schedule);observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','data-public-authored','data-private-text','data-home-private']});
 function set(value){const next=value==='fa'?'fa':'en';if(initialized&&next===lang)return false;lang=next;initialized=true;if(button){const text=lang==='en'?'Switch to Persian':'تغییر به انگلیسی';button.textContent=text;button.setAttribute('aria-label',text);button.setAttribute('data-public-authored','');}apply();return true;}
 if(button)button.onclick=()=>set(lang==='en'?'fa':'en');set(lang);return {set,apply,get language(){return lang;},dispose:()=>observer.disconnect()};
}
