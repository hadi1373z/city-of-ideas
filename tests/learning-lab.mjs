import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildMakersCity} from '../src/city-source-assets/home-tools/makers-city-scene.js';
import {createLearningLab,LEARNING_KEY,RULE_CARDS,TRANSFER_CARDS,requiredMask} from '../src/learning-lab-state.js';
import {LAB_COPY} from '../src/learning-lab-copy.js';
import {buildLearningLab} from '../src/learning-lab-scene.js';
import {BOOKS} from '../src/city-source-assets/home-tools/books.js';
import {LIBRARY_GUIDE} from '../src/makers-library-copy.js';
import {WORKSHOP_GUIDE} from '../src/makers-workshop-copy.js';
import {DIALOGUE_GUIDE} from '../src/makers-dialogue-copy.js';
const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
assert.equal(requiredMask(RULE_CARDS),9);assert.equal(requiredMask(TRANSFER_CARDS),6);
for(let mask=0;mask<16;mask++){
 const lab=createLearningLab();lab.begin();assert.equal(lab.predict(mask),false);assert.equal(lab.predict(mask,{library:true}),mask>0);
 if(!mask)continue;
 assert(!lab.predict(9,{library:true}));assert.equal(lab.state.first,mask);
 assert(!lab.reveal(0));assert(!lab.conclude(1,{workshop:true}).ok);
 lab.reveal(0,{workshop:true});lab.reveal(3,{workshop:true});assert(!lab.conclude(0,{workshop:true}).ok);assert(lab.conclude(1,{workshop:true}).ok);
 const result=lab.transfer(mask,{dialogue:true});assert.equal(result.ok,mask===6);
 if(mask!==6)assert.equal(result.why,(mask&6)===6?'extra':'missing');
}
const lab=createLearningLab(storage);lab.begin();lab.predict(5,{library:true});lab.reveal(0,{workshop:true});lab.reveal(3,{workshop:true});lab.conclude(1,{workshop:true});lab.transfer(6,{dialogue:true});assert(!lab.finish(''));assert(!lab.finish('I checked the possible exception.'));assert(lab.finish('I checked the possible exception.',{dialogue:true}));
assert.equal(createLearningLab(storage).state.reason,'I checked the possible exception.');for(let mask=0;mask<16;mask++)assert.equal(lab.practice(mask),mask===12);
const snapshot=lab.state;snapshot.first=15;assert.equal(lab.state.first,5);
values.set(LEARNING_KEY,JSON.stringify({...lab.state,revealed:1}));assert.equal(createLearningLab(storage).state.step,2);
values.set(LEARNING_KEY,JSON.stringify({...lab.state,first:0}));assert.equal(createLearningLab(storage).state.step,1);
values.set(LEARNING_KEY,JSON.stringify({...lab.state,transfer:1}));assert.equal(createLearningLab(storage).state.step,3);
values.set(LEARNING_KEY,JSON.stringify({...lab.state,reason:''}));assert.equal(createLearningLab(storage).state.step,4);
const failed=createLearningLab({getItem(){throw Error();},setItem(){throw Error();}});failed.begin();assert(!failed.saved);
for(const lang of['en','de','fa','cs']){assert.deepEqual(Object.keys(LAB_COPY[lang]).sort(),Object.keys(LAB_COPY.en).sort());for(const key of['cases','parcelCards','practiceCards'])assert.equal(LAB_COPY[lang][key].length,4);assert.equal(LAB_COPY[lang].conclusions.length,3);assert.equal(LAB_COPY[lang].sourceLabels.length,2);assert.deepEqual(Object.keys(LIBRARY_GUIDE[lang]).sort(),Object.keys(LIBRARY_GUIDE.en).sort());for(const value of Object.values(LIBRARY_GUIDE[lang]))assert(value.trim());}
const makers=buildMakersCity(T),before=makers.houses.map(h=>h.group.children.length),canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),model=buildLearningLab(T,makers,{canvas});
model.update(1,{step:1,revealed:0,transfer:0},LAB_COPY.en,0,true);assert(model.decks.every(d=>!d.group.visible));
model.update(2,{step:4,revealed:9,transfer:6},LAB_COPY.fa,6,true);
for(const deck of model.decks){assert(deck.group.visible);const mask=deck.kind==='workshop'?9:6;for(const[i,c]of deck.cards.entries()){assert.equal(c.pivot.rotation.y,mask&1<<i?Math.PI:0);assert.equal(c.back.mesh.rotation.y,Math.PI);}}
for(const h of makers.houses){assert(makers.canStand(h.spawnInside.x,h.spawnInside.z));assert(!model.colliders.some(b=>h.spawnInside.x>b.minX-.22&&h.spawnInside.x<b.maxX+.22&&h.spawnInside.z>b.minZ-.22&&h.spawnInside.z<b.maxZ+.22));}
for(const g of model.groups)g.traverse(o=>{if(o.geometry?.attributes.position)assert(Array.from(o.geometry.attributes.position.array).every(Number.isFinite));});
model.dispose();assert.deepEqual(makers.houses.map(h=>h.group.children.length),before);makers.dispose();
// Compare every borrowed source mesh and payload, rather than snapshotting new trim.
function signature(root,excluded=[]){const data=[];function walk(node){if(excluded.includes(node))return;const g=node.geometry,m=node.material;data.push([node.type,node.name,node.position.toArray(),node.quaternion.toArray(),node.scale.toArray(),node.userData,g&&{type:g.type,parameters:g.parameters,positions:Array.from(g.attributes.position.array)},m&&[].concat(m).map(v=>[v.type,v.color?.getHex(),v.opacity,v.transparent])]);for(const c of node.children)walk(c);}walk(root);return createHash('sha256').update(JSON.stringify(data)).digest('hex');}
const source=buildMakersCity(T),baseline=signature(source.group),collisions=JSON.stringify(source.colliders),originalBooks=JSON.stringify(BOOKS),originalChildren=source.houses.map(h=>h.group.children.slice());
const details=buildLearningLab(T,source,{canvas}),library=source.houses[0];assert.equal(signature(source.group,details.groups),baseline);assert.equal(JSON.stringify(source.colliders),collisions);assert.equal(JSON.stringify(BOOKS),originalBooks);assert.equal(details.guide.parent.name,'Makers Library details');assert.equal(details.guide.userData.libraryGuide,true);
source.group.updateMatrixWorld(true);const rackBounds=new T.Box3().setFromObject(details.guide);assert(rackBounds.min.x>library.cx+4-.09-.22,'The rack stays within the existing padded right-wall obstruction');assert(rackBounds.min.y>0&&rackBounds.max.y<3);const ids=new Set();library.group.traverse(o=>{if(o.userData.bookId)ids.add(o.userData.bookId);});assert.deepEqual([...ids].sort(),BOOKS.map(b=>b.id).sort());
for(const h of source.houses){assert(source.canStand(h.entry.x,h.entry.z));assert(source.canStand(h.spawnInside.x,h.spawnInside.z));for(const p of h.approaches)assert(source.canStand(p.x,p.z));}
for(const lang of['en','de','fa','cs']){assert.deepEqual(Object.keys(WORKSHOP_GUIDE[lang]).sort(),Object.keys(WORKSHOP_GUIDE.en).sort());for(const value of Object.values(WORKSHOP_GUIDE[lang]))assert(value.trim());}
const shop=source.houses[1],trayBounds=new T.Box3().setFromObject(details.workshop.tray);assert.equal(details.workshop.tray.userData.learningLab,'workshop');assert.equal(details.workshop.tray.userData.workshopGuide,true);assert(trayBounds.min.x>=shop.cx-1.9-1.25&&trayBounds.max.x<=shop.cx-1.9+1.25);assert(trayBounds.min.z>=shop.cz-.6&&trayBounds.max.z<=shop.cz+.6);assert(Math.abs(trayBounds.min.y-.935)<1e-6,'Tray rests on the unchanged workbench');
const originalBookBoxes=[];shop.group.traverse(o=>{if(o.userData.bookId&&o.type==='Group')originalBookBoxes.push(new T.Box3().setFromObject(o));});assert.equal(originalBookBoxes.length,2);for(const b of originalBookBoxes)assert(!trayBounds.intersectsBox(b),'Tray must not overlap either original bench book');
for(let revealed=0;revealed<16;revealed++)for(const lang of['en','de','fa','cs']){const s={step:2,revealed,transfer:0},unchanged=JSON.stringify(s);details.update(2,s,LAB_COPY[lang],0,true);assert.deepEqual(details.workshop.marks.map(m=>m.visible),[0,1,2,3].map(i=>!!(revealed&1<<i)));assert.equal(JSON.stringify(s),unchanged);}
const priorMarks=details.workshop.marks.map(m=>m.visible);for(const invalid of[-1,16,1.5,NaN,null,'9']){assert.equal(details.workshop.setRevealed(invalid),false);assert.deepEqual(details.workshop.marks.map(m=>m.visible),priorMarks);}
const room=source.houses[2],teaNodes=[],careNodes=[];room.group.traverse(o=>{if(o.type==='Group'&&o.userData.activity==='tea')teaNodes.push(o);if(o.type==='Group'&&o.userData.bookId==='care')careNodes.push(o);});assert.equal(teaNodes.length,1);assert.equal(careNodes.length,1);const teaBounds=new T.Box3().setFromObject(teaNodes[0]),table=room.group.localToWorld(new T.Vector3(0,.605,-.3));assert.equal(details.dialogue.cards.length,2);assert.equal(details.dialogue.prompt.userData.learningLab,'dialogue');assert.equal(details.dialogue.prompt.userData.dialogueGuide,true);assert.equal(details.dialogue.prompt.userData.learningCard,undefined);
for(const [i,card]of details.dialogue.cards.entries()){const b=new T.Box3().setFromObject(card);assert(Math.abs(b.min.y-table.y)<1e-6,'Each card rests on the unchanged tea table');assert(b.min.x>=table.x-.34&&b.max.x<=table.x+.34&&b.min.z>=table.z-.34&&b.max.z<=table.z+.34);assert(!b.intersectsBox(teaBounds),'The original cup stays clear');assert.equal(card.rotation.y,i===0?-Math.PI/2:Math.PI/2);}
const throwBounds=new T.Box3().setFromObject(details.dialogue.blanket);assert(Math.abs(throwBounds.min.y-.65)<1e-6);assert(!throwBounds.intersectsBox(new T.Box3().setFromObject(careNodes[0])),'The care book stays clear');
for(const lang of['en','de','fa','cs']){assert.deepEqual(Object.keys(DIALOGUE_GUIDE[lang]).sort(),Object.keys(DIALOGUE_GUIDE.en).sort());for(const value of Object.values(DIALOGUE_GUIDE[lang]))assert(value.trim());}
const owned=new Map();for(const g of details.groups)g.traverse(o=>{const mats=[].concat(o.material||[]);for(const r of[o.geometry,...mats,...mats.map(m=>m.map)])if(r&&!owned.has(r)){owned.set(r,0);const dispose=r.dispose.bind(r);r.dispose=()=>{owned.set(r,owned.get(r)+1);dispose();};}});
for(const lang of['en','de','fa','cs'])details.update(1,{step:4,revealed:9,transfer:6},LAB_COPY[lang],6,true);details.dispose();assert.equal(signature(source.group),baseline);assert.deepEqual(source.houses.map(h=>h.group.children),originalChildren);for(const count of owned.values())assert.equal(count,1);source.dispose();
console.log('PASS learning lab: conditional truth cases, every transfer/practice selection, physical-room gates, saved first reasoning, corrupt progress recovery, locale parity, hinged cards and owned cleanup');
