import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherHouse} from '../src/escher-house.js';
import {buildPerspectiveStairs,measurePerspective} from '../src/escher-perspective.js';
import {DESCENT} from '../src/escher-descent-model.js';
import {inPavilion} from '../src/escher-pavilion-model.js';
const ctx=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),canvas=()=>({getContext:()=>ctx});
const house=buildEscherHouse(T,{x:228,z:115,canvas,loadTexture:()=>new T.Texture()});house.group.updateWorldMatrix(true,true);
const cast=(x,y,z,dx,dy,dz,far=40)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(house.group,true);
assert.equal(house.targets.length,3);assert.equal(house.architecture.polygon.length,6);let floors=0,roofs=0;
for(let x=202;x<255;x+=1.3)for(let z=91;z<138;z+=1.3){if(!inPavilion(x,z,228,114,-1))continue;const cut=DESCENT.cut;if(x>cut.minX-.2&&x<cut.maxX+.2&&z>cut.minZ-.2&&z<cut.maxZ+.2)continue;assert(cast(x,.7,z,0,-1,0,1).length,'Every walking slab is supported');floors++;if(Math.abs(x-228)<2&&z>101&&z<109)continue;const roof=cast(x,4,z,0,1,0,12);assert(roof.length,'Every interior point has roof or real glazing');roofs++;}
// The complete open doorway carries three body lanes into the experiment court.
for(const x of[227.3,228,228.7])for(const y of[.6,1.15,1.93])assert.equal(cast(x,y,141,0,0,-1,24).length,0,'Clear front door and court approach');
for(const [x,z] of [[255.5,114],[235,137.82],[228,90.18]])assert(!house.canStand(x,z),'Boundary masonry is solid');
for(const z of[98,101,103])assert.equal(cast(228,1,z,0,-1,0,2).length,0,'The pavilion floor does not cap the true descent');
const sculpture=house.architecture.sculpture,eye=new T.Vector3(...sculpture.eye),directions=new Map();for(const edge of sculpture.edges)for(const a of edge){const d=new T.Vector3(...a).sub(eye).normalize(),key=d.toArray().map(n=>n.toFixed(7)).join(',');directions.set(key,(directions.get(key)||0)+1);}assert.equal(directions.size,8,'All twelve separated frame edges project to exactly eight cube corners');assert([...directions.values()].every(n=>n===3));
const glass=house.architecture.glazed;assert(glass.material.transparent&&glass.material.opacity>0&&glass.geometry.attributes.position.count===36);
for(const painting of house.paintings.slice(0,3)){const origin=painting.localToWorld(new T.Vector3(0,0,2)),target=painting.getWorldPosition(new T.Vector3()),dir=target.clone().sub(origin).normalize();const hits=new T.Raycaster(origin,dir,0,2.1).intersectObject(house.group,true);assert.equal(hits[0]?.object,painting,'Original print is visible in front of its wall');}
const stairs=buildPerspectiveStairs(T,house.group,house.experimentOrigin),camera=new T.PerspectiveCamera(66,16/9,.08,650);camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);camera.lookAt(new T.Vector3(stairs.focus.x,stairs.focus.y,stairs.focus.z));assert(measurePerspective(T,stairs,camera).aligned);
house.setPassage(true);assert(!house.gateBlocks(228,108));assert.deepEqual(house.paintings.map(p=>p.userData.escherWork),['relativity','drawing-hands','ascending-descending','waterfall']);assert(house.routePanel.position.z>-7.5);
let triangles=0;house.group.traverse(o=>{if(o.geometry){const p=o.geometry.attributes.position;assert(p.array.every(Number.isFinite));triangles+=(o.geometry.index?.count??p.count)/3;}});assert(triangles<55000,'Bounded pavilion geometry');stairs.dispose();house.dispose();console.log('PASS hexagonal Escher pavilion: '+floors+' floor rays, '+roofs+' roof/glass rays, open front approach, clear original shaft, visible genuine prints and preserved perspective alignment.');
