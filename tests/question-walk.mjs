import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {QUESTION_WALK_KEY,QUESTION_WALK_TEXT,QUESTION_PAPERS,createQuestionWalk,validQuestionWalk,buildQuestionCrane} from '../src/question-walk.js';
const data=new Map([['private-notebook','unchanged']]),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
let walk=createQuestionWalk(storage);
assert.equal(walk.state.stage,0);assert(!walk.predict(0,{study:true}));assert(!walk.sync({aligned:true}));assert(!walk.finish(1,0,{fountain:true}));
assert(walk.begin());assert(!walk.begin());assert(!walk.predict(0));assert(!walk.predict(3,{study:true}));assert(walk.predict(0,{study:true}));
assert.equal(walk.state.claim,0);assert(!walk.observe(0,{escher:true,viewed:true}));assert(!walk.sync({aligned:false}));
walk.pause();assert(!walk.state.active);walk=createQuestionWalk(storage);assert.equal(walk.state.stage,2);assert(!walk.state.active);assert(walk.resume());assert(walk.sync({aligned:true}));
assert(!walk.observe(0,{escher:true,aligned:true}));assert(!walk.observe(0,{aligned:true,viewed:true}));assert(walk.observe(1,{escher:true,aligned:true,viewed:true}));
assert(!walk.finish(1,0));assert(!walk.finish(1,8,{fountain:true}));assert(walk.finish(1,2,{fountain:true}));assert(!walk.state.active);assert(!walk.resume());assert(!walk.finish(0,0,{fountain:true}));
walk=createQuestionWalk(storage);assert.equal(walk.state.stage,5);assert.equal(walk.state.claim,0);assert.equal(walk.state.observation,1);assert.equal(walk.state.conclusion,1);assert.equal(walk.state.paper,2);assert(validQuestionWalk(walk.state));
const copy=walk.state;copy.claim=2;assert.equal(walk.state.claim,0,'Returned snapshots cannot rewrite the first claim');assert.equal(data.get('private-notebook'),'unchanged');assert(data.has(QUESTION_WALK_KEY));
for(const bad of [{...walk.state,observation:null},{...walk.state,stage:6},{...walk.state,active:true},{...walk.state,paper:-1},{...walk.state,version:2}]){
 assert(!validQuestionWalk(bad));assert.equal(createQuestionWalk({getItem:()=>JSON.stringify(bad)}).state.stage,0,'Malformed or inconsistent saves cannot skip the journey');
}
assert.equal(createQuestionWalk({getItem:()=>JSON.stringify({...walk.state,unrelated:'ignored'})}).state.unrelated,undefined);
const transient=createQuestionWalk({getItem(){throw Error('Disabled');},setItem(){throw Error('Disabled');}});assert(!transient.saved);transient.begin();assert.equal(transient.state.stage,1);assert(!transient.saved);assert(transient.predict(2,{study:true}));assert.equal(transient.state.claim,2);
for(const [lang,t]of Object.entries(QUESTION_WALK_TEXT)){
 assert.deepEqual(Object.keys(t),Object.keys(QUESTION_WALK_TEXT.en),'Complete UI copy for '+lang);
 for(const [key,value]of Object.entries(t)){assert(Array.isArray(value)?value.length===3&&value.every(v=>typeof v==='string'&&v.trim()):typeof value==='string'&&value.trim(),lang+' '+key);}
}
const crane=buildQuestionCrane(T,{x:0,z:-330,scale:.65});assert(!crane.group.visible);assert.equal(crane.group.userData.paperOnly,true);assert.equal(crane.group.userData.sourceSheets,1);assert.equal(crane.group.userData.addedParts,0);
let first,maxDistance=0;for(let time=0;time<85;time+=.25){crane.update(time,{released:true,paper:2});assert(crane.group.visible);assert(Number.isFinite(crane.group.position.x+crane.group.position.y+crane.group.position.z));assert(Math.abs(crane.group.position.x)<55);assert(Math.abs(crane.group.position.z+330)<50);assert(crane.group.position.y>2);if(!first)first=crane.group.position.clone();maxDistance=Math.max(maxDistance,first.distanceTo(crane.group.position));}
assert(maxDistance>50,'The released crane travels through the park');
const view=new T.PerspectiveCamera(66,16/9,.08,1000);view.position.set(0,1.93,-330+17*.65);view.rotation.set(.14,0,0,'YXZ');view.updateMatrixWorld(true);
for(const time of[0,6,12,18,23]){crane.update(time,{released:true,paper:2});const point=crane.group.position.clone().project(view);assert(Math.abs(point.x)<.6&&Math.abs(point.y)<.6&&point.z>-1&&point.z<1,'The introductory flight stays visible from the fountain arrival');}
crane.group.traverse(o=>{if(o.userData.paperPanel)assert.equal(o.material.color.getHexString(),QUESTION_PAPERS[2].slice(1));});
crane.update(0,{released:true,reducedMotion:true});const still=crane.group.position.clone();crane.update(100,{released:true,reducedMotion:true});assert.equal(still.distanceTo(crane.group.position),0,'Reduced motion keeps a visible still paper sculpture');
const resources=new Set();crane.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);});let disposed=0;for(const r of resources)r.addEventListener('dispose',()=>disposed++);crane.dispose();assert.equal(disposed,resources.size);assert.equal(crane.group.children.length,0);
console.log('PASS: place/evidence-gated question walk, pause/reload, immutable first claim, safe saved-data validation, isolated storage failure, complete EN/DE/FA and a paper-only park-wide crane with reduced motion and owned disposal.');
