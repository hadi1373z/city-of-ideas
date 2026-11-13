import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {FOUNDATION_HOUSES,FOUNDATION_ROUTES,FOUNDATION_COPY,houseWorld} from '../src/foundation-houses-data.js';
import {buildFoundationHouses} from '../src/foundation-houses-scene.js';
import {BORGES_ROOM} from '../src/borges-house-copy.js';
import {ADA_ROOM} from '../src/ada-house-copy.js';
import {adaTrace} from '../src/ada-house-model.js';
import {CALVINO_ROOM} from '../src/calvino-house-copy.js';
import {CALVINO_LENSES,calvinoViewingPose} from '../src/calvino-house-model.js';
import {CHOMSKY_ROOM} from '../src/chomsky-house-copy.js';
import {CHOMSKY_GROUPINGS,chomskyTree,chomskyWords,chomskyScope,chomskyBrackets,chomskyLayout} from '../src/chomsky-house-model.js';
import {LEGUIN_ROOM,LEGUIN_SOURCES} from '../src/leguin-house-copy.js';
import {LEGUIN_OBJECTS,leguinContents,leguinToggle,leguinObjectPose} from '../src/leguin-house-model.js';
import {FREUD_ROOM,FREUD_SOURCE} from '../src/freud-house-copy.js';
import {FREUD_PHASES,freudLayers} from '../src/freud-house-model.js';
import {installHouseFoundations} from '../src/foundation-houses.js';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),built=buildFoundationHouses(T,{canvas});assert.equal(built.houses.length,6);assert.equal(new Set(FOUNDATION_HOUSES.map(h=>h.style)).size,6);built.group.updateMatrixWorld(true);let draws=0;
for(const h of built.houses){
 assert(Math.hypot(h.data.x,h.data.z)<500);assert(!h.inside(h.entry.x,h.entry.z));assert(h.inside(h.insideEntry.x,h.insideEntry.z));
 for(let z=13;z>=-5;z-=.05){const p=houseWorld(h.data,0,z);assert(built.canStand(p.x,p.z),'Clear central entrance and aisle: '+h.data.id);}
 for(const p of[[9,0],[-9,0],[0,-8]]){const q=houseWorld(h.data,...p);assert(!h.canStand(q.x,q.z),'A wall must stop walking');}
 const p=houseWorld(h.data,0,18),ray=new T.Raycaster(new T.Vector3(p.x,4.04,p.z),new T.Vector3(-Math.sin(h.data.turn),0,-Math.cos(h.data.turn)));assert(ray.intersectObject(h.group,true).some(hit=>hit.object.userData.foundationHouse===h.data.id),'Name plaque is pickable from the lane');
 h.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}});for(const locale of['en','de','fa','cs']){assert(h.data.names[locale]);h.paint(locale);}assert(h.feature.children.length);
}
assert(draws<140,'Six furnished studies must stay batched, rather than hundreds of box draw objects');
for(const route of FOUNDATION_ROUTES)for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);for(let j=0;j<=n;j++)assert(built.canStand(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n),'The connected lane reaches every doorway');}
built.dispose();assert.equal(built.group.children.length,0);
class Element{constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this._text='';}set textContent(v){this._text=v;this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}setAttribute(k,v){this.attributes[k]=v;}addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}getContext(){return canvas().getContext();}querySelector(s){const visit=n=>{for(const c of n.children){if(s.startsWith('#')&&c.id===s.slice(1)||s.startsWith('.')&&c.className===s.slice(1)||s==='dialog[open]'&&c.tagName==='dialog'&&c.open)return c;const found=visit(c);if(found)return found;}};return visit(this);}}
const body=new Element('body');for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};globalThis.window={CITY_I18N:{lang:'en'}};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};const sentinel=new T.Group();let delegated=0;const M={scene:new T.Scene(),mode:'city',player:{x:0,z:0},clearMovement(){},arrive(p){Object.assign(this.player,p);},city:{targets:[sentinel],buildingTargets:[sentinel],canStand:()=>true,region:()=>({id:'old'}),targetInfo:()=>({kind:'old'}),update(){}},startExtra:()=>++delegated,showExtra:()=>++delegated};
const api=installHouseFoundations(M,T),dialog=body.querySelector('#house-foundations');api.open();assert(dialog.textContent.includes(FOUNDATION_COPY.en.intro));assert(dialog.textContent.includes('Freud'));assert(api.visit('freud',true));assert.equal(M.city.region(M.player.x,M.player.z).houseId,'freud');M.city.update(M.player,1);assert.equal(body.querySelector('#house-foundations-context').hidden,false);M.showExtra({kind:'house-foundation',data:{foundationHouse:'ada'}});assert(dialog.textContent.includes('Ada Lovelace'));window.CITY_I18N.lang='fa';events.get('city-language')();assert.equal(dialog.dir,'rtl');assert(dialog.textContent.includes(FOUNDATION_HOUSES.find(h=>h.id==='ada').names.fa));M.startExtra('house:chomsky');assert.equal(M.city.region(M.player.x,M.player.z).id,'old');M.showExtra({kind:'other'});M.startExtra('other');assert.equal(delegated,2);
api.visit('borges',true);assert.equal(api.interact(),true);assert.equal(api.interact(),false,'No interaction behind a modal');dialog.close();M.mode='aerial';assert.equal(api.interact(),false);M.mode='city';api.visit('freud',true);assert.equal(api.interact(),true,'Freud now has its own reading encounter');dialog.close();api.visit('freud');assert.equal(api.interact(),false,'The inside-room E hook does not intercept an outside interaction');
const allNodes=(n)=>[n,...n.children.flatMap(allNodes)];
for(const locale of ['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('borges',true);M.city.update(M.player,1);
 assert.equal(body.querySelector('#house-foundations-context').hidden,false,'Reading action stays available inside Borges');
 api.open('borges');const copy=BORGES_ROOM[locale];assert(dialog.textContent.includes(copy.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');
 assert.equal(allNodes(dialog).filter(n=>n.tagName==='h4').length,4);
 for(let i=0;i<2;i++){const choice=allNodes(dialog).find(n=>n.tagName==='button'&&n.textContent===copy.contexts[i]);choice.onclick();assert.equal(choice.attributes['aria-pressed'],'true');assert(dialog.textContent.includes(copy.responses[i]));}
 const link=allNodes(dialog).find(n=>n.tagName==='a');assert(link.href.startsWith('https://'));assert.equal(link.rel,'noopener noreferrer');
}
allNodes(dialog).find(n=>n.tagName==='button'&&n.textContent===BORGES_ROOM.cs.babel).onclick();assert.equal(dialog.open,false);assert.equal(delegated,3,'Babel action delegates to the real existing entrance');

assert.deepEqual(adaTrace('double-add',0),[2]);assert.deepEqual(adaTrace('double-add',1),[2,4]);assert.deepEqual(adaTrace('double-add'),[2,4,7]);assert.deepEqual(adaTrace('add-double'),[2,5,10]);
for(const bad of[-1,3,1.5,NaN])assert.throws(()=>adaTrace('double-add',bad),RangeError);
assert.throws(()=>adaTrace('__proto__'),RangeError);
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('ada',true);M.city.update(M.player,1);
 assert.equal(body.querySelector('#house-foundations-context').hidden,false,'Ada reading is available inside the workshop');
 assert(api.interact());assert(!api.interact(),'No interaction behind an open dialog');
 const c=ADA_ROOM[locale];assert(dialog.textContent.includes(c.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');assert.equal(dialog.lang,locale);
 const control=key=>allNodes(dialog).find(n=>n.dataset.houseFocus===key);
 const cells=()=>allNodes(dialog).filter(n=>n.tagName==='td').map(n=>n.textContent);
 for(const [order,expected]of[['double-add',['2','4','7']],['add-double',['2','5','10']]]){
  control(order).onclick();assert.equal(control(order).attributes['aria-pressed'],'true');
  for(let step=0;step<2;step++)control('ada-next').onclick();
  assert.deepEqual(cells().filter((_,i)=>i%2===1),expected,'The shown trace is the actual ordered calculation');
  assert.equal(control('ada-next').attributes['aria-disabled'],'true');control('ada-next').onclick();assert.equal(cells().length,6,'Finished cards do not run again');
 }
 control('ada-reset').focus();control('ada-reset').onclick();assert.deepEqual(cells(),[c.start,'2']);
 control('ada-next').focus();control('ada-next').onclick();events.get('city-language')();assert.equal(document.activeElement.dataset.houseFocus,'ada-next');assert.equal(cells().at(-1),'5','Language refresh retains current order and progress');
 const link=allNodes(dialog).find(n=>n.tagName==='a');assert.equal(link.href,'https://psychclassics.yorku.ca/Lovelace/lovelace.htm');
 assert.equal(link.rel,'noopener noreferrer');dialog.close();
}
const adaModel=api.built.houses.find(h=>h.data.id==='ada');
const cards=[];adaModel.feature.traverse(n=>{if(n.userData.cardOperation)cards.push(n);});assert.equal(cards.length,2);assert(cards.every(n=>n.geometry.type==='ExtrudeGeometry'&&n.geometry.parameters.shapes.holes.length===8),'Cards have actual punched holes');
for(const [x,z]of[[4.6,-3.4],[-4.6,-3.4]]){const p=houseWorld(adaModel.data,x,z);assert(!adaModel.canStand(p.x,p.z),'Both tables are solid');}
for(let x=-7;x<=7;x+=.1){const p=houseWorld(adaModel.data,x,1.5);assert(adaModel.canStand(p.x,p.z),'A clear cross-aisle reaches both benches');}

const calvinoModel=api.built.houses.find(h=>h.data.id==='calvino'),mark=calvinoViewingPose(calvinoModel.data);
assert(calvinoModel.inside(mark.x,mark.z));assert(M.city.canStand(mark.x,mark.z));
for(let t=0;t<=1;t+=.01){const a=calvinoModel.insideEntry;assert(M.city.canStand(a.x+(mark.x-a.x)*t,a.z+(mark.z-a.z)*t),'The walking approach to the mark is clear');}
for(const [x,z]of[[-7.9,-2],[4.5,1],[4,-4.5]]){const p=houseWorld(calvinoModel.data,x,z);assert(!calvinoModel.canStand(p.x,p.z),'Calvino model, desk and bench are solid');}
const modelGeometry=()=>{const shapes=[];calvinoModel.exhibit.buildings.traverse(n=>{if(n.isMesh)shapes.push([Array.from(n.geometry.attributes.position.array),n.position.toArray(),n.isInstancedMesh?Array.from(n.instanceMatrix.array):null]);});return shapes;};
const fixedBuildings=modelGeometry();assert.equal(calvinoModel.exhibit.buildings.children[0].count,3,'One miniature city with three buildings');
for(const id of CALVINO_LENSES){assert(calvinoModel.exhibit.setLens(id));assert.equal(calvinoModel.exhibit.lens,id);assert.deepEqual(modelGeometry(),fixedBuildings,'A reading changes emphasis, never model geometry');const colours=Object.fromEntries(CALVINO_LENSES.map(key=>[key,calvinoModel.exhibit.layers[key].children[0].material.color.getHex()]));assert.notEqual(colours[id],0xaaa38e);for(const key of CALVINO_LENSES.filter(k=>k!==id))assert.equal(colours[key],0xaaa38e);}
assert(!calvinoModel.exhibit.setLens('__proto__'));
api.visit('freud',true);api.open('calvino');
const beforeView={x:M.player.x,z:M.player.z};allNodes(dialog).find(n=>n.dataset.houseFocus==='calvino-look').onclick();
assert.deepEqual({x:M.player.x,z:M.player.z},beforeView,'Viewing mark cannot bypass the room entry guard');assert(dialog.open);dialog.close();
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('calvino',true);M.city.update(M.player,1);assert(!body.querySelector('#house-foundations-context').hidden);
 assert(api.interact());assert(!api.interact(),'Do not open behind another dialog');const c=CALVINO_ROOM[locale];assert(dialog.textContent.includes(c.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');
 const control=key=>allNodes(dialog).find(n=>n.dataset.houseFocus===key);
 for(const id of CALVINO_LENSES){control('calvino-'+id).focus();control('calvino-'+id).onclick();assert.equal(control('calvino-'+id).attributes['aria-pressed'],'true');assert(dialog.querySelector('#calvino-lens-reading').textContent.includes(c.views[id].story));assert.equal(calvinoModel.exhibit.lens,id);}
 const compare=control('calvino-compare');if(compare.attributes['aria-pressed']==='true')compare.onclick();assert(dialog.querySelector('#calvino-comparison').hidden);compare.focus();compare.onclick();assert(!dialog.querySelector('#calvino-comparison').hidden);
 events.get('city-language')();assert.equal(document.activeElement.dataset.houseFocus,'calvino-compare');assert(!dialog.querySelector('#calvino-comparison').hidden);assert.equal(calvinoModel.exhibit.lens,'measure');
 assert(allNodes(dialog).find(n=>n.tagName==='a').href.startsWith('https://www.arsenal.arch.ethz.ch/'));
 control('calvino-look').onclick();assert(!dialog.open);assert.equal(M.player.x,mark.x);assert.equal(M.player.z,mark.z);assert.equal(M.player.yaw,mark.yaw);assert.equal(M.player.pitch,mark.pitch);
}
const words=['small','birds','and','butterflies'];
assert.deepEqual(chomskyWords(chomskyTree('both')),words);assert.deepEqual(chomskyWords(chomskyTree('birds')),words);
assert.deepEqual(chomskyScope('both'),['birds','butterflies']);assert.deepEqual(chomskyScope('birds'),['birds']);
assert.equal(chomskyBrackets('both'),'[small [birds and butterflies]]');assert.equal(chomskyBrackets('birds'),'[[small birds] and butterflies]');
for(const id of[undefined,'__proto__','other',1])assert.throws(()=>chomskyTree(id),RangeError);
const leafPositions=id=>chomskyLayout(id).nodes.filter(n=>n.kind==='word').map(n=>[n.text,n.x,n.y]);
assert.deepEqual(leafPositions('both'),leafPositions('birds'),'Different groupings retain the same word order and positions');
assert.notDeepEqual(chomskyLayout('both').edges,chomskyLayout('birds').edges);
for(const id of CHOMSKY_GROUPINGS){const layout=chomskyLayout(id);assert.equal(layout.nodes.length,6);assert.equal(layout.edges.length,5);assert.equal(new Set(layout.nodes.map(n=>n.key)).size,6);assert(layout.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));}
const chomskyModel=api.built.houses.find(h=>h.data.id==='chomsky'),study=chomskyModel.exhibit;
assert.equal(study.boards.length,2);assert.deepEqual(study.tiles.map(n=>n.userData.wordToken),words);
const tilePositions=()=>study.tiles.map(n=>n.position.toArray()),fixedTiles=tilePositions();
const relief=chomskyModel.feature.children.find(n=>n.position.y===2.5&&n.position.z===-7.75);assert(relief);assert.equal(relief.children.filter(n=>n.geometry?.type==='CylinderGeometry').length,6,'The original relief is retained');
for(const id of CHOMSKY_GROUPINGS){assert(study.setGrouping(id));assert.equal(study.grouping,id);assert.deepEqual(tilePositions(),fixedTiles);for(const b of study.boards)assert.equal(b.frame.material.color.getHex(),b.id===id?0xc4a24c:0x8b8067);}
assert(!study.setGrouping('__proto__'));
for(const [x,z]of[[-4.7,-1.5],[-4.7,.75],[4.5,-2.5]]){const p=houseWorld(chomskyModel.data,x,z);assert(!chomskyModel.canStand(p.x,p.z),'Desk, chair and bench are solid');}
for(let x=-7;x<=7;x+=.1){const p=houseWorld(chomskyModel.data,x,4.5);assert(chomskyModel.canStand(p.x,p.z),'The front cross-aisle stays clear');}
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('chomsky',true);M.city.update(M.player,1);assert(!body.querySelector('#house-foundations-context').hidden);assert(api.interact());assert(!api.interact());
 const c=CHOMSKY_ROOM[locale];assert(dialog.textContent.includes(c.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');
 const control=id=>allNodes(dialog).find(n=>n.dataset.houseFocus==='chomsky-'+id);
 for(const id of CHOMSKY_GROUPINGS){control(id).focus();control(id).onclick();assert.equal(control(id).attributes['aria-pressed'],'true');assert.equal(study.grouping,id);const result=dialog.querySelector('#chomsky-grouping-result');assert.equal(result.attributes['aria-live'],'polite');assert(result.textContent.includes(chomskyBrackets(id)));assert(result.textContent.includes(c.texts[id][1]));const picture=allNodes(dialog).find(n=>n.tagName==='img');assert(picture.src.startsWith('data:image/svg+xml;'));assert(picture.alt.includes(c.labels[CHOMSKY_GROUPINGS.indexOf(id)]));}
 assert.equal(allNodes(dialog).find(n=>n.className==='chomsky-example').lang,'en');assert.equal(allNodes(dialog).find(n=>n.className==='chomsky-brackets').dir,'ltr','English brackets are readable within Persian RTL');
 events.get('city-language')();assert.equal(document.activeElement.dataset.houseFocus,'chomsky-birds');assert.equal(study.grouping,'birds');
 assert.equal(allNodes(dialog).find(n=>n.tagName==='a').href,'https://chomsky.info/wp-content/uploads/195609-.pdf');dialog.close();api.open('chomsky');assert.equal(study.grouping,'birds');dialog.close();
}

const courtyard=api.built.houses.find(h=>h.data.id==='leguin'),gathering=courtyard.exhibit;
assert.deepEqual(leguinContents(['cup','seeds','cup']),['seeds','cup']);
const prior=['seeds'];assert.deepEqual(leguinToggle(prior,'cup'),['seeds','cup']);assert.deepEqual(prior,['seeds'],'Toggle does not mutate caller state');assert.deepEqual(leguinToggle(prior,'seeds'),[]);
for(const bad of[undefined,null,{},['__proto__'],['seeds','other']])assert.throws(()=>leguinContents(bad),RangeError);
assert.throws(()=>leguinToggle([],'__proto__'),RangeError);assert.throws(()=>leguinObjectPose('unknown',false),RangeError);
const fixedTable=gathering.table.position.toArray(),hearth=courtyard.feature.children.find(n=>n.geometry?.type==='TorusGeometry');
assert.deepEqual(hearth.position.toArray(),[-4,.14,-2]);assert.equal(hearth.geometry.parameters.radius,.9);
for(const collider of[[-4,-2,2.2,2.2],[-4,-5,2.8,1],[-4,1,2.8,1]])assert(courtyard.colliders.some(b=>[b.x,b.z,b.w,b.d].every((v,i)=>v===collider[i])),'Original hearth and seats stay fixed');
for(const [x,z]of[[5.8,-3.2],[-4,-2],[-4,-5],[-4,1]]){const p=houseWorld(courtyard.data,x,z);assert(!courtyard.canStand(p.x,p.z),'Table, hearth and seats remain solid');}
for(let x=-7;x<=7;x+=.1){const p=houseWorld(courtyard.data,x,4.5);assert(courtyard.canStand(p.x,p.z),'Front cross-aisle remains clear');}
for(let z=4.5;z>=-2;z-=.1){const p=houseWorld(courtyard.data,2,z);assert(courtyard.canStand(p.x,p.z),'The gathering table has a reachable side approach');}
for(let bits=0;bits<8;bits++){
 const ids=['seeds','thread','cup'].filter((_,i)=>bits&(1<<i));assert(gathering.setContents([...ids].reverse()));assert.deepEqual(gathering.selected,ids);
 const boxes=[];api.built.group.updateMatrixWorld(true);
 for(const [i,id]of['seeds','thread','cup'].entries()){
  const p=gathering.objects[id].position;assert.equal(p.x,ids.includes(id)?-.58+i*.58:-1.35+i*1.35);assert.equal(p.z,ids.includes(id)?-.4:.5);
  const bounds=new T.Box3().setFromObject(gathering.objects[id]);assert(!bounds.isEmpty());assert([bounds.min.x,bounds.min.y,bounds.min.z,bounds.max.x,bounds.max.y,bounds.max.z].every(Number.isFinite));boxes.push(bounds);
 }
 for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert(!boxes[i].intersectsBox(boxes[j]),'Every selection keeps the three objects physically separate');
 assert.deepEqual(gathering.table.position.toArray(),fixedTable);assert.deepEqual(hearth.position.toArray(),[-4,.14,-2]);
}
assert(!gathering.setContents(['unknown']));assert.deepEqual(gathering.selected,['seeds','thread','cup']);const detached=gathering.selected;detached.pop();assert.equal(gathering.selected.length,3);
const cupMesh=gathering.objects.cup.children.find(n=>n.geometry?.type==='LatheGeometry');assert(cupMesh);assert(cupMesh.geometry.parameters.points.some(p=>p.x===.155&&p.y===.4),'Cup has an inner lip and open top');
const foldedCloth=gathering.objects.thread.children.find(n=>n.isInstancedMesh&&n.count===2);assert(foldedCloth,'Paired decorative boxes share one draw object');
for(let i=0;i<2;i++){const m=new T.Matrix4();foldedCloth.getMatrixAt(i,m);const p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();m.decompose(p,q,s);assert(Math.abs(p.y-[.025,.075][i])<1e-6);assert(Math.abs(p.x)<1e-6&&Math.abs(p.z-.18)<1e-6);assert(s.toArray().every((v,j)=>Math.abs(v-[.42,.045,.3][j])<1e-6),'The accepted cloth layers keep their original transforms after paired instancing');}
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('leguin',true);M.city.update(M.player,1);assert(!body.querySelector('#house-foundations-context').hidden);assert(api.interact());assert(!api.interact());
 const c=LEGUIN_ROOM[locale];assert(dialog.textContent.includes(c.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');
 const control=id=>allNodes(dialog).find(n=>n.dataset.houseFocus==='leguin-'+id);control('reset').onclick();assert.deepEqual(gathering.selected,[]);assert(dialog.textContent.includes(c.empty));
 for(const id of['cup','seeds','thread']){control(id).focus();control(id).onclick();assert.equal(control(id).attributes['aria-pressed'],'true');assert(dialog.querySelector('#leguin-collection').textContent.includes(c.objects[id].story));}
 assert.deepEqual(gathering.selected,['seeds','thread','cup']);assert.equal(dialog.querySelector('#leguin-collection').attributes['aria-live'],'polite');
 const passage=allNodes(dialog).find(n=>n.className==='leguin-gathered');assert.equal(passage.textContent,['seeds','thread','cup'].map(id=>c.objects[id].line).join(' '));
 control('thread').onclick();assert.equal(control('thread').attributes['aria-pressed'],'false');assert(!dialog.querySelector('#leguin-collection').textContent.includes(c.objects.thread.story));control('thread').onclick();
 events.get('city-language')();assert.equal(document.activeElement.dataset.houseFocus,'leguin-thread');assert.deepEqual(gathering.selected,['seeds','thread','cup']);
 const links=allNodes(dialog).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>n.href),LEGUIN_SOURCES.map(n=>n.url));assert(links.every(n=>n.rel==='noopener noreferrer'));
 dialog.close();api.open('leguin');assert.deepEqual(gathering.selected,['seeds','thread','cup']);control('reset').focus();control('reset').onclick();assert.deepEqual(gathering.selected,[]);assert.equal(document.activeElement.dataset.houseFocus,'leguin-reset');dialog.close();
}

const freudModel=api.built.houses.find(h=>h.data.id==='freud'),studyFolio=freudModel.exhibit;
assert.deepEqual(freudLayers('report'),{report:true,context:false,question:false});assert.deepEqual(freudLayers('context'),{report:true,context:true,question:false});assert.deepEqual(freudLayers('limits'),{report:true,context:true,question:true});
for(const bad of[undefined,null,'__proto__','other',1])assert.throws(()=>freudLayers(bad),RangeError);
const fixedReport=studyFolio.report.position.toArray(),fixedFolio=studyFolio.folio.position.toArray();
for(const from of FREUD_PHASES)for(const to of FREUD_PHASES){assert(studyFolio.setPhase(from));assert(studyFolio.setPhase(to));assert.equal(studyFolio.phase,to);assert(studyFolio.report.visible);assert.equal(studyFolio.context.visible,to!=='report');assert.equal(studyFolio.question.visible,to==='limits');assert.deepEqual(studyFolio.report.position.toArray(),fixedReport);assert.deepEqual(studyFolio.folio.position.toArray(),fixedFolio);}
assert(!studyFolio.setPhase('__proto__'));assert.equal(studyFolio.phase,'limits');
const couchParts=[];freudModel.feature.traverse(n=>{if(n.isInstancedMesh&&n.material.color.getHex()===0x8c3f3d)for(let i=0;i<n.count;i++){const m=new T.Matrix4();n.getMatrixAt(i,m);const p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();m.decompose(p,q,s);couchParts.push([...p.toArray(),...s.toArray()]);}});
for(const original of[[-4.6,.57,-3.2,3.8,.36,1.3],[-4.6,.9,-3.8,3.8,.72,.23],[-6.4,.78,-3.2,.25,.62,1.4],[-2.8,.78,-3.2,.25,.62,1.4]])assert(couchParts.some(part=>part.every((v,i)=>Math.abs(v-original[i])<1e-5)),'Original couch seat, back and arms retain their exact positions/dimensions');
assert(freudModel.colliders.some(b=>b.x===-4.6&&b.z===-3.2&&b.w===4.1&&b.d===1.5));
for(const [x,z]of[[-4.8,-7.4],[-7.35,-1.1],[4.8,-3.3],[4.8,-.7]]){const p=houseWorld(freudModel.data,x,z);assert(!freudModel.canStand(p.x,p.z),'Freud shelves, side table, desk and chair are solid');}
for(let x=-7;x<=7;x+=.1){const p=houseWorld(freudModel.data,x,3.5);assert(freudModel.canStand(p.x,p.z),'Front cross-aisle remains clear');}
for(let z=3.5;z>=-2;z-=.1){const p=houseWorld(freudModel.data,2,z);assert(freudModel.canStand(p.x,p.z),'Writing desk has a reachable side approach');}
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;events.get('city-language')();api.visit('freud',true);M.city.update(M.player,1);assert(!body.querySelector('#house-foundations-context').hidden);assert(api.interact());assert(!api.interact());
 const c=FREUD_ROOM[locale];assert(dialog.textContent.includes(c.title));assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');
 const control=id=>allNodes(dialog).find(n=>n.dataset.houseFocus==='freud-'+id);
 for(const phase of['limits','report','context']){control(phase).focus();control(phase).onclick();assert.equal(control(phase).attributes['aria-pressed'],'true');assert.equal(studyFolio.phase,phase);assert(dialog.textContent.includes(c.report));assert(dialog.querySelector('#freud-reading-stage').textContent.includes(c.stages[phase].text));assert.equal(dialog.querySelector('#freud-background').hidden,phase==='report');assert.equal(dialog.querySelector('#freud-reading-stage').attributes['aria-live'],'polite');}
 events.get('city-language')();assert.equal(document.activeElement.dataset.houseFocus,'freud-context');assert.equal(studyFolio.phase,'context');assert(!dialog.querySelector('#freud-background').hidden);
 const link=allNodes(dialog).find(n=>n.tagName==='a');assert.equal(link.href,FREUD_SOURCE.url);assert.equal(link.rel,'noopener noreferrer');assert(dialog.textContent.includes(c.sourceNote));assert(dialog.textContent.includes(c.notice));
 dialog.close();api.open('freud');assert.equal(studyFolio.phase,'context');assert(!dialog.querySelector('#freud-background').hidden);control('report').onclick();assert(dialog.querySelector('#freud-background').hidden);dialog.close();
}

events.get('pagehide')();assert.deepEqual(M.city.targets,[sentinel]);assert.deepEqual(M.city.buildingTargets,[sentinel]);assert.equal(M.scene.children.length,0);
console.log('PASS six foundation houses: distinct roofs, readable/pickable names, clear rotated entrances and aisles, connected lanes, batched details, directory/entry routing, EN/DE/FA/CS, six reading encounters and owned cleanup; '+draws+' draw objects');
