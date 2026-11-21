import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildInhabitedMind,mindMineralSample} from '../src/de-chirico-scene.js';
const sample=mindMineralSample(.235,.672);assert.deepEqual(sample,mindMineralSample(.235,.672));
for(const u of[0,.137,.5,.923,1])for(const v of[0,.153,.5,.913,1]){
 const s=mindMineralSample(u,v);for(const n of Object.values(s))assert(n>0&&n<1);
 for(const key of Object.keys(s)){assert(Math.abs(s[key]-mindMineralSample(u+1,v)[key])<1e-12);assert(Math.abs(s[key]-mindMineralSample(u,v+1)[key])<1e-12);}
}
let min=1,max=0;for(let i=0;i<400;i++){const n=mindMineralSample((i*.61803)%1,(i*.38197)%1).tint;min=Math.min(min,n);max=Math.max(max,n);}assert(min>=.93&&max<=1&&max-min>.025&&max-min<.07,'Near-white mineral modulation preserves warm ivory instead of dark camouflage');
const canvas=()=>({getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{})})}),built=buildInhabitedMind(T,{canvas}),textures=new Set(),materials=new Set();
built.group.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const key of['map','bumpMap','roughnessMap'])if(m[key])textures.add(m[key]);}});
const colour=[...textures].find(m=>m.name==='Original limestone mineral colour'),height=[...textures].find(m=>m.name==='Original shallow mineral height'),rough=[...textures].find(m=>m.name==='Original matte stone roughness');
assert(colour&&height&&rough);assert.equal(colour.colorSpace,T.SRGBColorSpace);assert.equal(height.colorSpace,T.NoColorSpace);assert.equal(rough.colorSpace,T.NoColorSpace);assert.equal(built.stats.draws,29);
for(const m of materials)if(m.bumpMap){assert.equal(m.map,colour);assert.equal(m.bumpMap,height);assert.equal(m.roughnessMap,rough);assert(m.bumpScale>0&&m.bumpScale<=.004);}
const disposals=new Map([...textures].map(t=>[t,0]));for(const t of textures)t.addEventListener('dispose',()=>disposals.set(t,disposals.get(t)+1));built.dispose();built.dispose();assert([...disposals.values()].every(n=>n===1),'All shared colour/height/roughness textures disposed exactly once');
let uploads=0,paints=0;const bulkCanvas=()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>{assert.equal(image.data.length,256*256*4);assert.equal(image.data[3],255);uploads++;},fillRect:()=>paints++,strokeRect(){},fillText(){}})}),bulkBuilt=buildInhabitedMind(T,{canvas:bulkCanvas});assert.equal(uploads,3,'Browser creates the three texture sheets with three bulk uploads');assert.equal(paints,1,'Only the separate plaque uses a canvas fillRect in the browser path');bulkBuilt.dispose();
console.log('PASS De Chirico mineral finish: deterministic seamless near-white field, correct colour/data spaces, shared subtle relief/roughness, three bulk canvas uploads, unchanged29 draws and exactly-once texture cleanup.');
