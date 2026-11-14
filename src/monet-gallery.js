import {MONET_COPY,MONET_SOURCES,MONET_WORKS} from './monet-gallery-copy.js';
import {buildMonetDetails} from './monet-gallery-scene.js';
export function installMonetGallery(M,T){
 const house=M.city.art.houses.find(h=>h.artistId==='monet'&&!h.editionId);if(!house?.group)return null;
 const details=buildMonetDetails(T,house);M.city.targets.push(...details.targets);
 const lang=()=>window.CITY_I18N?.lang||'en',copy=()=>MONET_COPY[lang()]||MONET_COPY.en;
 const inside=()=>{const r=M.city.region(M.player.x,M.player.z);return M.mode==='city'&&r.artistId==='monet'&&!r.artistEditionId;};
 const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const button=(text,fn)=>{const n=el('button',text);n.type='button';n.className='glass';n.onclick=fn;return n;};
 const dialog=el('dialog');dialog.id='monet-guide';dialog.dataset.confirmFocused='true';dialog.setAttribute('aria-labelledby','monet-guide-title');
 const head=el('header'),title=el('h2'),close=button('×',()=>dialog.close());title.id='monet-guide-title';close.setAttribute('data-close','');head.append(title,close);
 const body=el('div');body.className='monet-guide-body';dialog.append(head,body);document.body.append(dialog);
 const panel=el('aside');panel.id='monet-guide-context';panel.hidden=true;const launch=button('',()=>open());panel.append(launch);document.body.append(panel);
 const world=p=>({...p,x:M.city.ART.x+p.x*M.city.ART.scale,z:M.city.ART.z+p.z*M.city.ART.scale,y:.13});
 function arrive(p){dialog.close();M.clearMovement();M.arrive(p);if(Number.isFinite(p.pitch))M.player.pitch=p.pitch;}
 let returnFocus=null;
 function render(){
  const c=copy();dialog.lang=MONET_COPY[lang()]?lang():'en';dialog.dir=lang()==='fa'?'rtl':'ltr';title.textContent=c.title;close.setAttribute('aria-label',c.close);body.replaceChildren(el('p',c.intro),el('p',c.folio),el('h3',c.history));
  for(const key of['lilies','bridge']){const p=el('p',c[key]),a=el('a',c[key==='lilies'?'sourceLilies':'sourceBridge']);a.href=MONET_SOURCES[key];a.target='_blank';a.rel='noopener noreferrer';body.append(p,a);}
  body.append(el('h3',c.activity));
  if(!inside())body.append(el('p',c.outside),button(c.enter,()=>arrive(world(house.entry))));
  for(const [i,id]of MONET_WORKS.entries()){
   const card=el('article');card.append(el('h4',c.titles[i]),el('p',c.prompts[i]));const actions=el('div');actions.className='monet-guide-actions';
   if(inside())actions.append(button(c.look,()=>{if(!inside())return;const p=house.approaches.find(p=>p.workId===id);if(!p)return;const target=world(p.lookAt),point=world(p),height=M.city.art.group.position.y+p.lookAt.y*M.city.ART.scale;point.pitch=Math.atan2(height-(point.y+M.eye),Math.hypot(point.x-target.x,point.z-target.z));arrive(point);}));
   actions.append(button(c.catalog,()=>{dialog.close();M.clearMovement();M.homePick({artistId:'monet',workId:id});}));card.append(actions);body.append(card);
  }
  body.append(el('p',c.boundary));body.scrollTop=0;
 }
 function open(){document.querySelector('#artist-quarter[open]')?.close();returnFocus=document.activeElement;M.clearMovement();render();if(!dialog.open)dialog.showModal();close.focus();body.scrollTop=0;}
 dialog.addEventListener('close',()=>{M.clearMovement();if(returnFocus?.isConnected)returnFocus.focus();});
 const old={targetInfo:M.city.targetInfo,showExtra:M.showExtra,update:M.city.update};
 M.city.targetInfo=data=>data?.monetGuide?{kind:'monet-guide',data,title:copy().open}:old.targetInfo(data);
 M.showExtra=info=>{if(info?.kind!=='monet-guide')return old.showExtra?.(info);if(inside())open();return true;};
 M.city.update=(...args)=>{old.update(...args);panel.hidden=!inside()||!!document.querySelector('dialog[open]');};
 const locale=()=>{panel.dir=lang()==='fa'?'rtl':'ltr';launch.textContent=copy().open;if(dialog.open)render();};locale();addEventListener('city-language',locale);
 let disposed=false;const api={details,open,inside,dispose(){if(disposed)return;disposed=true;removeEventListener('city-language',locale);dialog.remove();panel.remove();for(const t of details.targets){const i=M.city.targets.indexOf(t);if(i>=0)M.city.targets.splice(i,1);}details.dispose();}};M.monetGallery=api;return api;
}
