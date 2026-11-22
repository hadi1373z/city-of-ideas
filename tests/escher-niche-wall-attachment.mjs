import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {DESCENT,DESCENT_PARTS} from '../src/escher-descent-model.js';
import {ESCHER_SHAFT_NICHES,nicheArchHeight,nicheWorld} from '../src/escher-niche-model.js';

const built=buildEscherDescent(T);built.group.updateMatrixWorld(true);
const ray=(n,u,y)=>new T.Raycaster(new T.Vector3(...nicheWorld(n,[u,y,.4])),new T.Vector3(-n.out[0],0,-n.out[1]),0,1.2).intersectObject(built.group,true);
let flush=0,bars=0;
for(const n of ESCHER_SHAFT_NICHES){
 const axis=n.out[0]?0:2,bounds=axis===0?[DESCENT.shaft.minX,DESCENT.shaft.maxX]:[DESCENT.shaft.minZ,DESCENT.shaft.maxZ],out=n.out[0]||n.out[1],wall=bounds[out>0?0:1],expected=(wall-n.origin[axis])*out;
 for(const fraction of[-.4,.4]){
  const u=fraction*n.w,y=nicheArchHeight(n,u)+.22;
  assert(y<n.spring+n.w/2,'Probe the former rectangular infill above the curved frame');
  const hit=ray(n,u,y)[0];assert(hit,'The arch shoulder is closed');
  const depth=(hit.point[axis===0?'x':'z']-n.origin[axis])*out;
  assert(Math.abs(depth-expected)<.0001,`${n.id}: arch infill must meet the actual shaft wall plane, not float in front of it (${depth} versus ${expected})`);flush++;
 }
}
for(const p of DESCENT_PARTS.filter(p=>p.id.startsWith('landing-'))){
 const north=p.minZ<92,n={origin:[226.5,p.y,north?90.62:106.58],along:[1,0],out:[0,north?1:-1]};
 for(const x of[224.15,228.85])for(const y of[1.1,1.7]){
  const hit=ray(n,x-226.5,y)[0];assert(hit);assert(!hit.object.material.isMeshBasicMaterial,'No detached luminous landing strip remains');
  const depth=(hit.point.z-n.origin[2])*n.out[1];assert(Math.abs(depth+.02)<.0001,'Former isolated side bars now show the continuous bare wall');bars++;
 }
}
built.dispose();console.log(`PASS niche wall attachment: ${flush} flush shoulder surfaces and ${bars} former detached-strip views; no openings in the wall.`);
