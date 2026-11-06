import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {createSixthGuest,validSixthGuest,TRIAL_EDGES,fiveCycle,trialTriangles,SIXTH_GUEST_KEY} from '../src/sixth-guest-state.js';
import {buildTrialDiagram,buildTriangleBoats} from '../src/sixth-guest-scene.js';
import {DISCOVERY_COPY} from '../src/city-discoveries-copy.js';
const data=new Map([['unrelated-private-note','keep me']]),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},table={table:true};
const trial=createSixthGuest(storage);assert(validSixthGuest(trial.state));assert(trial.begin());
assert(!trial.readClue({alcove:false}));assert(!trial.applyClue(table));assert(!trial.flip(0,{}));assert(!trial.admitSix(0,table));assert(!trial.finish(0,{fountain:true}));
assert(trial.readClue({alcove:true}));assert(trial.applyClue(table));assert.equal(trialTriangles(trial.state.colors,5).length,0);
assert(!trial.flip(TRIAL_EDGES.findIndex(e=>e[1]===5),table),'Cannot colour a point not yet introduced');
assert(!trial.admitSix(3,table));assert(trial.admitSix(0,table));assert.equal(trial.state.count,6);assert.deepEqual(trial.state.fiveExample,fiveCycle());
const witness=trialTriangles(trial.state.colors)[0];assert(witness);assert(!trial.witness([0,0,1],table));assert(!trial.witness(witness.vertices,{}));assert(trial.witness(witness.vertices,table));
const preserved=trial.state.witness;trial.flip(witness.edges[0],table);assert.deepEqual(trial.state.witness,preserved,'Preserve observed evidence while trying later colours');
assert(!trial.finish(0,{}));assert(trial.finish(2,{fountain:true}));assert(!trial.state.active);assert(!trial.finish(0,{fountain:true}));assert(validSixthGuest(trial.state));
const restored=createSixthGuest(storage);assert.deepEqual(restored.state,trial.state);assert.equal(data.get('unrelated-private-note'),'keep me');
for(const mutate of [s=>s.colors[0]=4,s=>s.witness.vertices=[0,0,1],s=>s.prediction='yes',s=>s.conclusion=9,s=>s.fiveExample=Array(15).fill(0),s=>s.active=true]){const s=trial.state;mutate(s);assert(!validSixthGuest(s));data.set(SIXTH_GUEST_KEY,JSON.stringify(s));assert.equal(createSixthGuest(storage).state.count,5,'Corrupt progress must not create a completed discovery');}
const failed=createSixthGuest({getItem(){throw Error();},setItem(){throw Error();}});assert(!failed.saved);failed.begin();assert(failed.state.active&&!failed.saved);
// Exhaust the actual finite experiment: five has counterexamples, six never does.
let fiveSolutions=0;for(let mask=0;mask<1024;mask++){const colors=Array(15).fill(0);TRIAL_EDGES.filter(e=>e[1]<5).forEach(([a,b],bit)=>colors[TRIAL_EDGES.findIndex(e=>e[0]===a&&e[1]===b)]=(mask>>bit)&1);if(!trialTriangles(colors,5).length)fiveSolutions++;}
assert.equal(fiveSolutions,12);for(let mask=0;mask<32768;mask++)assert(trialTriangles(Array.from({length:15},(_,i)=>(mask>>i)&1),6).length>0);
const diagram=buildTrialDiagram(T);diagram.update(fiveCycle(),5);let visible=0;diagram.group.traverseVisible(o=>{if(o.isMesh)visible++;});assert.equal(visible,16,'One paper, five nodes, ten edges');diagram.update(fiveCycle(),6);visible=0;diagram.group.traverseVisible(o=>{if(o.isMesh)visible++;});assert.equal(visible,22);diagram.dispose();assert.equal(diagram.group.children.length,0);
const park={x:12,z:30,scale:.5},boats=buildTriangleBoats(T,park);
for(const time of[0,10,25,60,100]){boats.update(time,{visible:true,color:1});for(const b of boats.group.children){const radius=Math.hypot(b.position.x/park.scale,b.position.z/park.scale);assert(radius>3.3&&radius<10);assert(Math.abs(b.position.y)<.02*park.scale);assert(b.userData.paperOnly);}}
boats.update(22,{visible:true,reducedMotion:true});const p=boats.group.children.map(b=>b.position.toArray());boats.update(44,{visible:true,reducedMotion:true});assert.deepEqual(boats.group.children.map(b=>b.position.toArray()),p);boats.dispose();assert.equal(boats.group.children.length,0);
for(const lang of['en','de','fa']){assert.deepEqual(Object.keys(DISCOVERY_COPY[lang]).sort(),Object.keys(DISCOVERY_COPY.en).sort());assert(DISCOVERY_COPY[lang].predict.length===3&&DISCOVERY_COPY[lang].answers.length===3);}
console.log('PASS complete exploration state, physical-context gates, persistence/privacy, corrupt saves, all five/six colourings, real paper geometry, floating/reduced-motion boats and three locales');
