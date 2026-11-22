import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildSixfoldHousePassages} from '../src/sixfold-house-passages-scene.js';
import {buildSixfoldTransformationHouses} from '../src/sixfold-house-scene.js';
import {SIXFOLD_HOUSES,houseToWorld,walkSixfoldNetwork} from '../src/sixfold-house-network-model.js';

const ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const passages=buildSixfoldHousePassages(T),houses=buildSixfoldTransformationHouses(T,{canvas}),world=new T.Group();world.add(passages.group,houses.group);world.updateMatrixWorld(true);
let rays=0,steps=0;
// The old 3.2m cuts on the angled source facets reach beyond the straight 4m
// passage. These positions independently reproduce the visible side openings.
for(const h of SIXFOLD_HOUSES){
 const direction=new T.Vector3(-Math.cos(h.angle),0,-Math.sin(h.angle));
 for(const sign of[-1,1])for(const z of[2.02,2.12,2.24,2.4,2.55,2.67])for(const y of[-39.85,-39,-38.2,-37,-35.55]){
  const q=houseToWorld(h,{x:106,z:sign*z}),hit=new T.Raycaster(new T.Vector3(q.x,y,q.z),direction,0,5).intersectObject(world,true);
  assert(hit.length,`${h.id}: unclosed basement jamb at source z=${sign*z}, y=${y}`);rays++;
 }
 for(const z of[-1.65,0,1.65])for(const y of[-39.6,-38.2,-35.7]){
  const q=houseToWorld(h,{x:106,z}),hit=new T.Raycaster(new T.Vector3(q.x,y,q.z),direction,0,8).intersectObject(world,true);
  assert.equal(hit.length,0,`${h.id}: central doorway must stay open`);rays++;
 }
 for(const z of[-1.6,0,1.6])for(const reverse of[false,true]){
  const from=houseToWorld(h,{x:reverse?99:106,z,y:-38.2}),delta=(reverse?1:-1)*.07,p={...from};
  for(let i=0;i<100;i++){
   walkSixfoldNetwork(p,delta*Math.cos(h.angle),delta*Math.sin(h.angle));
   const floor=new T.Raycaster(new T.Vector3(p.x,-38.2,p.z),new T.Vector3(0,-1,0),0,2).intersectObject(world,true);
   assert(floor.some(hit=>Math.abs(hit.point.y+40)<1e-4),`${h.id}: supported floor through doorway`);assert(Math.abs(p.y+38.2)<1e-8);steps++;
  }
  const expected=houseToWorld(h,{x:reverse?106:99,z});assert(Math.hypot(p.x-expected.x,p.z-expected.z)<1e-6,'Native doorway traversal remains continuous');
 }
}
assert.equal(passages.counts.draws,3,'Jambs share the existing masonry batch');houses.dispose();passages.dispose();
console.log(`PASS basement jambs: ${rays} physical side/opening rays and ${steps} supported native steps through six unchanged doors; original passage width, floor and stairs retained.`);
