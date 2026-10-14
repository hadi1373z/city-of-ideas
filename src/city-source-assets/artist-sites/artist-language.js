/* Reversible authored-content dictionary hook. User-entered values are untouched. */
(function(g){'use strict';
const d=g.document,texts=new WeakMap(),attrs=new WeakMap();let scheduled=false;
let lang=new URLSearchParams(g.location.search).get('lang')==='fa'?'fa':'en';
const normalize=s=>String(s).replace(/\s+/g,' ').trim();
const artistId=()=>d.body?.dataset.artist||g.location.pathname.split('/').slice(-2,-1)[0];
function translate(value){const key=normalize(value),data=g.CITY_ARTIST_SITE_FA||{},publicData=g.CITY_ARTIST_PUBLIC_FA||{},dict=data.artists?.[artistId()]||{},publicDict=publicData.artists?.[artistId()]||{};const exact=publicDict[key]??publicData.common?.[key]??dict[key]??data.common?.[key];if(exact)return exact;
 const count=key.match(/^(\d+) of (\d+) works$/);if(count)return count[1]+' اثر از '+count[2]+' اثر';
 const interval=key.match(/^(\d+)%$/);if(interval)return interval[1]+'٪';
 return value;
}
function update(){scheduled=false;if(!d.body)return;let translated=0;
 d.documentElement.lang=lang;d.documentElement.dir=lang==='fa'?'rtl':'ltr';d.body.dataset.language=lang;
 const walker=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,textarea,input,code,pre'))continue;
  let record=texts.get(node);if(!record||node.nodeValue!==record.last)record={en:node.nodeValue,last:node.nodeValue};
  const next=lang==='fa'?translate(record.en):record.en;if(next!==record.en)translated++;
  if(node.nodeValue!==next)node.nodeValue=next;record.last=next;texts.set(node,record);
 }
 for(const element of d.body.querySelectorAll('[placeholder],[aria-label],[alt],[title]')){
  let record=attrs.get(element)||{};
  for(const key of ['placeholder','aria-label','alt','title']){if(!element.hasAttribute(key))continue;const value=element.getAttribute(key),entry=record[key];if(!entry||value!==entry.last)record[key]={en:value,last:value};const original=record[key].en,next=lang==='fa'?translate(original):original;if(next!==value)element.setAttribute(key,next);record[key].last=next;}
  attrs.set(element,record);
 }
 d.body.dataset.translatedStrings=String(translated);
}
function schedule(){if(!scheduled){scheduled=true;g.setTimeout(update,0);}}
function setLanguage(value){lang=value==='fa'?'fa':'en';update();}
g.addEventListener('message',event=>{if(event.source!==g.parent||event.origin!==g.location.origin)return;if(event.data?.type==='city-language')setLanguage(event.data.lang);});
g.addEventListener('hashchange',schedule);
d.addEventListener('DOMContentLoaded',()=>{const style=d.createElement('style');style.textContent='html[lang="fa"] body{font-family:Tahoma,Arial,sans-serif}html[lang="fa"] .prose,html[lang="fa"] .reading-note,html[lang="fa"] .letter-box{line-height:1.9}html[lang="fa"] input[type="range"],html[lang="fa"] .composition-stage,html[lang="fa"] .proportion-stage{direction:ltr}';d.head.append(style);new MutationObserver(schedule).observe(d.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','alt','title']});update();});
g.CITY_ARTIST_LANGUAGE={setLanguage,getLanguage:()=>lang,translate,refresh:update};
})(window);
