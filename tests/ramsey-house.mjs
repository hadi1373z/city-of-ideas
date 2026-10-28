import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildRamseyHouse,EDGES,CITIZENS,monochromeTriangles} from '../src/ramsey-house.js';
assert.equal(EDGES.length,15);assert.equal(new Set(CITIZENS.map(c=>c.id)).size,6);
for(let mask=0;mask<32768;mask++)assert(monochromeTriangles(EDGES.map((_,i)=>(mask>>i)&1)).length>0);
const canvas=()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)})});
const layout={mathematics:{x:-2360,z:35}};const m=buildRamseyHouse(T,layout,{canvas});
assert.equal(m.origin.x,-2401);assert.equal(m.citizens.length,6);
for(let z=3;z<11;z+=.15)for(const x of[-.65,0,.65])assert(m.canStand(m.origin.x+x,m.origin.z+z),'Entry corridor obstructed');
assert(!m.canStand(m.origin.x,m.origin.z-1),'Table must be solid');
assert(!m.canStand(m.origin.x+9,m.origin.z),'Wall must be solid');
m.group.updateMatrixWorld(true);for(const c of m.citizens){assert(m.canStand(c.seat.x,c.seat.z),'Seat overlaps table/walls');c.root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(c.root);assert(bounds.min.y>=.12&&bounds.max.y<2,'Seated proportions or floor contact wrong');}
m.setColors(EDGES.map(()=>1));let dynamicEdges=0;m.group.traverse(o=>{if(o.userData.animated&&o.geometry?.type==='CylinderGeometry')dynamicEdges++;});assert(dynamicEdges>=15,'Puzzle edges must stay mutable after static batching');m.update(3,{reducedMotion:true});for(const c of m.citizens)assert.equal(c.head.rotation.y,0);
let disposed=0;m.group.traverse(o=>o.geometry?.addEventListener('dispose',()=>disposed++));m.dispose();assert(disposed>0);assert.equal(m.group.children.length,0);
console.log('PASS Ramsey House: all 32768 graph colourings, six distinct citizens, accessible entry, solid walls/table, seated floor contact, reduced motion and disposal');
