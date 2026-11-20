import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {DESCENT_PARTS,descentSurface} from '../src/escher-descent-model.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {ESCHER_DEPTH as D,depthFloorAt} from '../src/escher-depth-model.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';

const ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const surface=buildEscherDescent(T),museum=buildEscherDepth(T,{canvas});
surface.group.updateMatrixWorld(true);museum.group.updateMatrixWorld(true);
const v=p=>p.isVector3?p:new T.Vector3(...p),segment=(a,b,p)=>new T.Line3(v(a),v(b)).closestPointToPoint(v(p),true,new T.Vector3()).distanceTo(v(p));
const ray=(root,a,b)=>{a=v(a);b=v(b);const d=b.clone().sub(a),length=d.length();return new T.Raycaster(a,d.normalize(),.001,length-.001).intersectObject(root,true);};
const combined=new T.Group();combined.add(surface.group,museum.interior);combined.updateMatrixWorld(true);
let guards=0,bodyProbes=0;
function checkGuards(root,paths,posts,railRoot){
 const pieces=paths.flatMap(path=>path.slice(1).map((b,i)=>[path[i],b]));
 for(const p of posts){const point=[p.x,p.top,p.z];assert(pieces.some(([a,b])=>segment(a,b,point)<1e-7),'Every post reaches the actual continuous handrail');
  assert(ray(railRoot,[p.x,p.top+.13,p.z],[p.x,p.top-.03,p.z]).length,'The physical rail overlaps the measured post top');guards++;
 }
 for(const path of paths)for(const p of[path[0],path.at(-1)]){
  const point=v(p);assert(posts.some(q=>segment([q.x,q.base,q.z],[q.x,q.top,q.z],point)<.05)||paths.some(other=>other!==path&&other.some(q=>v(q).distanceTo(point)<1e-7)),'Each rail end joins a supported post or the next real rail');
 }
 for(const[a,b]of pieces){const p=v(a).clone().add(v(b)).multiplyScalar(.5);assert(ray(railRoot,p.clone().add(new T.Vector3(0,.13,0)),p.clone().add(new T.Vector3(0,-.08,0))).length,'No missing physical guard segment at its midpoint');}
}
checkGuards(surface.group,surface.group.userData.stairGuardPaths,[...surface.group.userData.stairGuardPosts.values()],surface.group.getObjectByName('Continuous supported eight-flight handrails'));
for(const g of museum.group.userData.museumStairGuards)checkGuards(museum.interior,g.paths,g.posts,combined.getObjectByName('Cloister · bronze ribs and balustrades'));

// Sweep actual shoulder/torso sight lines through every tread and both landing
// approaches. Vertical floor rays alone miss a wall across a flight or turn.
function clearBody(root,a,b,width=.30){const d=v(b).clone().sub(v(a)),side=new T.Vector3(-d.z,0,d.x).normalize();for(const h of[.85,1.8])for(const offset of[-width,0,width]){
 const shift=side.clone().multiplyScalar(offset).add(new T.Vector3(0,h,0));const hits=ray(root,v(a).add(shift),v(b).add(shift));assert.equal(hits.length,0,'Actual body-width stair entry/turn is obstructed '+JSON.stringify({a,b,h,offset,first:hits[0]?.point}));bodyProbes++;
}}
for(const f of DESCENT_PARTS.filter(p=>p.kind==='flight'))for(let i=0;i<40;i++){
 const za=f.start+(f.end-f.start)*(i+.25)/40,zb=f.start+(f.end-f.start)*(i+.75)/40,y=f.top+(f.bottom-f.top)*(i+1)/40;
 clearBody(combined,[f.x,y,za],[f.x,y,zb]);clearBody(surface.group,[f.x,y,zb],[f.x,y,za]);
}
for(const p of DESCENT_PARTS.filter(p=>p.id.startsWith('landing-'))){const z=p.minZ<92?91.3:104.7;clearBody(surface.group,[225,p.y,z],[228,p.y,z]);clearBody(surface.group,[228,p.y,z],[225,p.y,z]);
 for(const x of[225,228]){const near=p.minZ<92?92:104;clearBody(surface.group,[x,p.y,near],[x,p.y,z]);clearBody(surface.group,[x,p.y,z],[x,p.y,near]);}
}
clearBody(surface.group,[228,.13,105.8],[228,.13,104]);clearBody(surface.group,[225,-40,104],[225,-40,106.65]);
for(const s of D.stairs){const x=(s.minX+s.maxX)/2,run=(s.maxZ-s.minZ)/s.steps;for(let i=0;i<s.steps;i++){
 const z=s.minZ+(i+.5)*run,y=s.top+(i+1)*(s.bottom-s.top)/s.steps;clearBody(museum.interior,[x,y,z-.10],[x,y,z+.10],.5);clearBody(museum.interior,[x,y,z+.10],[x,y,z-.10],.5);
 }for(const[z,y]of[[s.minZ-.7,s.top],[s.maxZ+.7,s.bottom]])assert(Math.abs(depthFloorAt(x,z,y)-y)<1e-7,'Landing returns rest on the unchanged actual floor');
 const topInside=s.minZ+.6,bottomInside=s.maxZ-.6,ty=depthFloorAt(x,topInside,s.top),by=depthFloorAt(x,bottomInside,s.bottom);
 for(const lateral of[-.6,0,.6]){const top=[x+lateral,s.top,s.minZ-.7],first=[x,ty,topInside],last=[x,by,bottomInside],bottom=[x+lateral,s.bottom,s.maxZ+.7];clearBody(museum.interior,top,first,.25);clearBody(museum.interior,first,top,.25);clearBody(museum.interior,last,bottom,.25);clearBody(museum.interior,bottom,last,.25);}
}
for(const x of[193,195,197])assert(ray(museum.interior,[x,-32.2,136],[x,-32.2,151]).length,'Upper-gallery view cannot leak above the lower-cloister vault through the tall stair end');
// Original controller coordinates remain the authority, including both ends.
assert(descentSurface(228,105.5,.13));assert(descentSurface(225,106.65,-40));
surface.dispose();museum.dispose();console.log(`PASS Escher stair details: ${guards} supported rail-post joins, continuous turn/landing guards and ${bodyProbes} real two-way tread/entry/turn body rays; all existing tread coordinates retained.`);
