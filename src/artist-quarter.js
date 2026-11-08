import {QUARTER_ARTISTS,QUARTER_COPY} from './artist-quarter-data.js?v=artists2';
import {installIdeaExhibitions} from './idea-exhibitions.js';
import {installMonetGallery} from './monet-gallery.js';
import {MONET_COPY} from './monet-gallery-copy.js';
import {installVanGoghGallery} from './van-gogh-gallery.js';
import {VAN_GOGH_COPY} from './van-gogh-gallery-copy.js';
import {installHilmaGallery} from './hilma-gallery.js';
import {HILMA_COPY} from './hilma-gallery-copy.js';
import {installMorrisGallery} from './morris-gallery.js';
import {MORRIS_COPY} from './morris-gallery-copy.js';
import {installKandinskyGallery} from './kandinsky-gallery.js';
import {KANDINSKY_COPY} from './kandinsky-gallery-copy.js';
import {installHokusaiGallery} from './hokusai-gallery.js';
import {HOKUSAI_COPY} from './hokusai-gallery-copy.js';
import {installRodinGallery} from './rodin-gallery.js';
import {RODIN_COPY} from './rodin-gallery-copy.js';
import {installMondrianGallery} from './mondrian-gallery.js';
import {MONDRIAN_COPY} from './mondrian-gallery-copy.js';
import {installLangeGallery} from './lange-gallery.js';
import {LANGE_COPY} from './lange-gallery-copy.js';
import {installKleeGallery} from './klee-gallery.js';
import {KLEE_COPY} from './klee-gallery-copy.js';
import {buildArtistStudios,buildQuarterGarden} from './artist-quarter-scene.js?v=artists2';
const PLAN=globalThis.ARTIST_QUARTER_PLAN;

export function installArtistQuarter(M,T){
 const studios=buildArtistStudios(T),garden=buildQuarterGarden(T,M.city.art);M.scene.add(studios.group,garden.group);M.city.targets.push(...studios.targets);M.city.buildingTargets.push(...studios.houses.map(h=>h.group));
 // Dalí's old display base extended beyond its rooms. Keep the house floor,
 // retire only its shallow landscape slab and disconnected paving strips.
 const hidden=[];const dali=M.city.art.houses.find(h=>h.artistId==='dali');dali?.group.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height<.09&&o.position.y<0){hidden.push([o,o.visible]);o.visible=false;}});
 const lang=()=>window.CITY_I18N?.lang||'en',w=()=>QUARTER_COPY[lang()]||QUARTER_COPY.en,pick=v=>v[lang()]||v.en;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(tag==='summary')n.tabIndex=0;return n;};
 const button=(text,fn)=>{const b=el('button',text);b.type='button';b.className='glass';b.onclick=fn;return b;};
 const dialog=el('dialog');dialog.id='artist-quarter';dialog.dataset.confirmFocused='true';dialog.setAttribute('aria-labelledby','artist-quarter-title');
 const head=el('header'),heading=el('h2'),close=button('×',()=>dialog.close());close.setAttribute('data-close','');heading.id='artist-quarter-title';head.append(heading,close);const body=el('div');body.className='quarter-body';dialog.append(head,body);document.body.append(dialog);
 let selected=null,detail=false,lastKey='',lastTime=0;
 const houseFor=id=>studios.houses.find(h=>h.artist.id===id);
 function arrive(p){dialog.close();M.clearMovement();M.arrive(p);if(Number.isFinite(p.pitch))M.player.pitch=p.pitch;}
 function entry(id){const studio=houseFor(id);if(studio)return studio.entry;if(id==='escher')return window.CITY_ESCHER?.entry;const h=M.city.art.houses.find(h=>h.artistId===id&&!h.editionId);if(!h)return null;const a=M.city.ART;return{x:a.x+h.entry.x*a.scale,z:a.z+h.entry.z*a.scale,y:.13,yaw:h.entry.yaw};}
 function inside(id){return houseFor(id)?.inside(M.player.x,M.player.z);}
 function reflect(id){const artist=houseFor(id)?.artist,store=M.visitorMemory?.store;if(!artist||!inside(id)||!store)return false;const key='studio-'+id;store.question(key,'personal',pick(artist.question));store.discover(key);return true;}
 function render(){
  dialog.dir=lang()==='fa'?'rtl':'ltr';close.setAttribute('aria-label',w().close);body.replaceChildren();heading.textContent=selected?selected.name+' · '+pick(selected.title):w().title;
  if(!selected){
   body.append(el('p',w().intro),button(w().walk,()=>M.startExtra('artists-quarter')));
   const mapImage=el('img');mapImage.className='quarter-plan';mapImage.src=new URL('./assets/artist-quarter-plan.svg?v=artists2',import.meta.url).href;mapImage.alt=w().title;body.append(mapImage);
   const places=[...M.city.art.houses.filter(h=>!h.editionId).map(h=>({id:h.artistId,name:h.name,title:h.artistId==='dali'?w().daliTitle:w().original})),{id:'escher',name:w().escher,title:w().escherTitle},...QUARTER_ARTISTS.map(a=>({id:a.id,name:a.name,title:pick(a.title),theme:pick(a.theme)}))];
   for(const court of PLAN.courts){body.append(el('h3',pick(court.title)),button(pick(court.title)+' \u2192',()=>arrive(court.arrival)));const grid=el('div');grid.className='quarter-directory';for(const id of court.artists){const item=places.find(p=>p.id===id);if(!item)continue;const card=el('article');card.append(el('h4',item.name),el('p',item.title));if(item.theme)card.append(el('p',item.theme));const p=entry(item.id);if(p)card.append(button(w().visit,()=>arrive(p)));if(item.id==='monet'&&M.monetGallery)card.append(button((MONET_COPY[lang()]||MONET_COPY.en).open,()=>M.monetGallery.open()));if(item.id==='van-gogh'&&M.vanGoghGallery)card.append(button((VAN_GOGH_COPY[lang()]||VAN_GOGH_COPY.en).open,()=>M.vanGoghGallery.open()));if(item.id==='hilma-af-klint'&&M.hilmaGallery)card.append(button((HILMA_COPY[lang()]||HILMA_COPY.en).open,()=>M.hilmaGallery.open()));if(item.id==='morris'&&M.morrisGallery)card.append(button((MORRIS_COPY[lang()]||MORRIS_COPY.en).open,()=>M.morrisGallery.open()));if(item.id==='kandinsky'&&M.kandinskyGallery)card.append(button((KANDINSKY_COPY[lang()]||KANDINSKY_COPY.en).open,()=>M.kandinskyGallery.open()));if(item.id==='hokusai'&&M.hokusaiGallery)card.append(button((HOKUSAI_COPY[lang()]||HOKUSAI_COPY.en).open,()=>M.hokusaiGallery.open()));if(id==='rodin'&&M.rodinGallery)card.append(button((RODIN_COPY[lang()]||RODIN_COPY.en).open,()=>M.rodinGallery.open()));if(id==='mondrian'&&M.mondrianGallery)card.append(button((MONDRIAN_COPY[lang()]||MONDRIAN_COPY.en).open,()=>M.mondrianGallery.open()));if(id==='lange'&&M.langeGallery)card.append(button((LANGE_COPY[lang()]||LANGE_COPY.en).open,()=>M.langeGallery.open()));if(id==='klee'&&M.kleeGallery)card.append(button((KLEE_COPY[lang()]||KLEE_COPY.en).open,()=>M.kleeGallery.open()));grid.append(card);}body.append(grid);}
   body.append(el('p',w().fiction));
  }else{
   const a=selected,house=houseFor(a.id);body.append(button(w().back,()=>{selected=null;detail=false;render();}),el('p',pick(a.theme)));
   const figure=el('figure'),viewport=el('div');viewport.className='quarter-art'+(detail?' quarter-detail':'');const image=el('img');image.src=new URL('./assets/artist-quarter/'+(detail?a.work.image.replace('.jpg','-detail.jpg'):a.work.image),import.meta.url).href;image.alt=a.work.title+' — '+a.name;image.decoding='async';viewport.append(image);const caption=el('figcaption',a.work.title+' · '+a.work.date);figure.append(viewport,caption);body.append(figure,el('p',pick(a.prompt)));
   const actions=el('div');actions.className='quarter-buttons';actions.append(button(detail?w().whole:w().detail,()=>{detail=!detail;render();}));
   if(inside(a.id)){
    actions.append(button(pick(a.activity),()=>{house.change();dialog.close();M.clearMovement();}),button(w().near,()=>arrive(house.viewpoint(false))),button(w().far,()=>arrive(house.viewpoint(true))),button(w().reflect,()=>{if(reflect(a.id)){const status=el('p',M.visitorMemory.store.saved?w().saved:w().failed);status.setAttribute('role','status');body.append(status);}}),button(w().note,()=>{dialog.close();M.visitorMemory?.open('studio-'+a.id);}));
   }else actions.append(button(w().enter,()=>arrive(house.insideEntry)));
   body.append(actions);const credits=el('details');credits.append(el('summary',w().credits),el('p',w().rights),el('p',w().fiction));const link=el('a',w().source);link.href=a.work.source;link.target='_blank';link.rel='noopener noreferrer';credits.append(link);body.append(credits);
  }
  body.scrollTop=0;
 }
 function open(id){selected=QUARTER_ARTISTS.find(a=>a.id===id)||null;detail=false;M.clearMovement();const mapPanel=document.querySelector('#map-panel');if(mapPanel)mapPanel.hidden=true;render();if(!dialog.open)dialog.showModal();body.querySelector('button')?.focus();}
 dialog.addEventListener('close',()=>M.clearMovement());
 const launch=button('',()=>open());launch.id='artist-quarter-welcome';document.querySelector('.welcome-secondary')?.append(launch);const map=button('',()=>open());document.querySelector('.map-directions')?.append(map);
 const panel=el('aside');panel.id='artist-quarter-context';panel.hidden=true;const name=el('strong'),hint=el('p'),context=el('div');panel.append(name,hint,context);document.body.append(panel);
 function contextRender(house,near){panel.dataset.location=house?'studio':'garden';name.textContent=house?house.artist.name:w().garden;hint.textContent=house?pick(house.artist.theme):'';context.replaceChildren(button(w().open,()=>open()));if(house)context.prepend(button(near?w().look:w().enter,()=>near?open(house.artist.id):arrive(house.insideEntry)));}
 const old={canStand:M.city.canStand,region:M.city.region,targetInfo:M.city.targetInfo,showExtra:M.showExtra,startExtra:M.startExtra,update:M.city.update};
 M.city.canStand=(x,z)=>studios.canStand(x,z)&&!garden.colliders.some(b=>x>b.minX-.22&&x<b.maxX+.22&&z>b.minZ-.22&&z<b.maxZ+.22)&&old.canStand(x,z);
 M.city.region=(x,z)=>{const house=studios.houses.find(h=>h.inside(x,z));if(house)return{id:'artists',artistId:house.artist.id,title:house.artist.name+' · '+pick(house.artist.title),inside:true};const r=old.region(x,z);return r.id==='city'&&x>PLAN.bounds.minX&&x<PLAN.bounds.maxX&&z>PLAN.bounds.minZ&&z<PLAN.bounds.maxZ?{id:'artists',title:w().garden,inside:false}:r;};
 M.city.targetInfo=data=>data?.quarterArtist?{kind:'artist-quarter',data,title:QUARTER_ARTISTS.find(a=>a.id===data.quarterArtist)?.name}:old.targetInfo(data);
 M.showExtra=info=>{if(info?.kind!=='artist-quarter')return old.showExtra?.(info);const id=info.data.quarterArtist;if(!inside(id))return true;if(info.data.quarterAction==='activity'){houseFor(id).change();M.clearMovement();return true;}if(info.data.quarterAction==='reflect'){reflect(id);M.visitorMemory?.open('studio-'+id);return true;}open(id);return true;};
 if(M.city.landmarks)M.city.landmarks.artists={...PLAN.arrival};
 M.startExtra=destination=>{if(['artists-quarter','artists'].includes(destination)){arrive(PLAN.arrival);return true;}const studio=houseFor(destination?.replace(/^artist:/,''));if(studio){arrive(studio.entry);return true;}return old.startExtra?.(destination);};
 M.city.update=(...args)=>{old.update(...args);const time=args[1];if(time-lastTime<.15)return;lastTime=time;const p=M.player,r=M.city.region(p.x,p.z),house=studios.houses.find(h=>h.inside(p.x,p.z)||Math.hypot(p.x-h.entry.x,p.z-h.entry.z)<6),near=house&&house.inside(p.x,p.z),b=PLAN.bounds,area=p.x>b.minX&&p.x<b.maxX&&p.z>b.minZ&&p.z<b.maxZ;const active=M.mode==='city'&&area&&(!r.artistId||!!house)&&!['escher','dali'].includes(r.artistId)&&!document.querySelector('dialog[open]');panel.hidden=!active;if(active){const key=(house?.artist.id||'garden')+':'+!!near+':'+lang();if(key!==lastKey){lastKey=key;contextRender(house,near);}}};
 let ideas=null;
 const locale=()=>{launch.textContent=map.textContent=w().open;panel.dir=lang()==='fa'?'rtl':'ltr';lastKey='';if(dialog.open)render();ideas?.refresh();};locale();addEventListener('city-language',locale);
 const api={studios,garden,entry,open,reflect};M.artistQuarter=api;
 ideas=installIdeaExhibitions(M,T);
 const monet=installMonetGallery(M,T);
 const vanGogh=installVanGoghGallery(M,T);
 const hilma=installHilmaGallery(M,T);
 const morris=installMorrisGallery(M,T);
 const kandinsky=installKandinskyGallery(M,T);
 const hokusai=installHokusaiGallery(M,T);
 const rodin=installRodinGallery(M,T);
 const mondrian=installMondrianGallery(M,T);
 const lange=installLangeGallery(M,T);
 const klee=installKleeGallery(M,T);
 addEventListener('pagehide',()=>{klee?.dispose();lange?.dispose();mondrian?.dispose();rodin?.dispose();hokusai?.dispose();kandinsky?.dispose();morris?.dispose();hilma?.dispose();vanGogh?.dispose();monet?.dispose();ideas?.dispose();removeEventListener('city-language',locale);dialog.remove();panel.remove();launch.remove();map.remove();for(const [o,v]of hidden)o.visible=v;for(const target of studios.targets){const i=M.city.targets.indexOf(target);if(i>=0)M.city.targets.splice(i,1);}for(const h of studios.houses){const i=M.city.buildingTargets.indexOf(h.group);if(i>=0)M.city.buildingTargets.splice(i,1);}studios.dispose();garden.dispose();},{once:true});
 const query=new URLSearchParams(globalThis.location?.search||'');if(query.get('arrival')==='artists-quarter'){const court=PLAN.courts.find(c=>c.id===query.get('court'));if(court)arrive(court.arrival);else M.startExtra('artists-quarter');}
 return api;
}
