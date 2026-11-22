import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {DESCENT_PARTS,descentFloorBounds,descentSurface} from '../src/escher-descent-model.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {ESCHER_DEPTH as D,depthFloorAt} from '../src/escher-depth-model.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';
import {ESCHER_NICHE_SILL} from '../src/escher-stone-details.js';
import {nicheArchHeight} from '../src/escher-niche-model.js';

const ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const surface=buildEscherDescent(T),museum=buildEscherDepth(T,{canvas});
surface.group.updateMatrixWorld(true);museum.group.updateMatrixWorld(true);
const v=p=>p.isVector3?p:new T.Vector3(...p),segment=(a,b,p)=>new T.Line3(v(a),v(b)).closestPointToPoint(v(p),true,new T.Vector3()).distanceTo(v(p));
const ray=(root,a,b)=>{a=v(a);b=v(b);const d=b.clone().sub(a),length=d.length();return new T.Raycaster(a,d.normalize(),.001,length-.001).intersectObject(root,true);};
const combined=new T.Group();combined.add(surface.group,museum.interior);combined.updateMatrixWorld(true);
for(const path of surface.group.userData.stairGuardPaths)for(const point of path)assert(point.x>225.8&&point.x<227.2,'Only the open inter-flight edges carry guards; no rail remains in front of wall arches');
for(const p of DESCENT_PARTS){const bounds=descentFloorBounds(p),outer=p.kind==='flight'?(p.x>226.5?bounds.maxX-.04:bounds.minX+.04):p.id==='entry'?bounds.maxX-.04:p.id==='exit'?bounds.minX+.04:null;if(outer===null)continue;
 const samples=p.kind==='flight'?40:1;for(let i=0;i<samples;i++){const z=p.kind==='flight'?p.start+(p.end-p.start)*(i+.5)/40:(p.minZ+p.maxZ)/2,y=p.kind==='flight'?p.top+(p.bottom-p.top)*(i+1)/40:p.y;
  const hits=new T.Raycaster(new T.Vector3(outer,y+.08,z),new T.Vector3(0,-1,0),0,.2).intersectObject(surface.group,true);assert(hits.some(h=>Math.abs(h.point.y-y)<.002),'Every stair and entry/exit floor closes the former wall-side gap');
 }
}
// These must be actual closed cavities, not a dark polygon laid on a wall.
assert.equal(ESCHER_NICHE_SILL,.93,'The niches are raised55cm above the previous38cm sill');
const ornaments=surface.group.getObjectByName('Escher · tiled recessed stair niches');
assert.equal(ornaments.children.length,2,'All31 decorated niches use two bounded geometry batches');
assert(ornaments.userData.tileCount>600&&ornaments.userData.vaultCellCount>400);
for(const l of ornaments.userData.nicheLayouts)for(const range of l.interiorRanges){const p=ornaments.children[range.batch].geometry.attributes.position,n=l.niche;
 for(let i=range.start;i<range.start+range.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),dx=x-n.origin[0],dz=z-n.origin[2],u=dx*n.along[0]+dz*n.along[1],d=dx*n.out[0]+dz*n.out[1],height=y-n.origin[1];assert(Number.isFinite(x+y+z));
  assert(d>=-n.depth-.001&&d<=-.042&&height>=.011&&Math.abs(u)<=n.w/2+.001&&height<=nicheArchHeight(n,u)+.002,'Every interior tile, gold rib and vault facet remains inside its carved pointed arch and behind the wall face');
 }
}
// The blue frame only coats the existing stone envelope; its detailed original
// ring/triangle footprint is independently checked in escher-blue-alcoves.mjs.
for(const l of ornaments.userData.nicheLayouts)for(const range of l.frameRanges){const p=ornaments.children[range.batch].geometry.attributes.position,n=l.niche;for(let i=range.start;i<range.start+range.count;i++){const dx=p.getX(i)-n.origin[0],dz=p.getZ(i)-n.origin[2],u=dx*n.along[0]+dz*n.along[1],d=dx*n.out[0]+dz*n.out[1],height=p.getY(i)-n.origin[1];assert(Math.abs(u)<=n.w/2+.191&&height>=-.101&&height<=n.spring+n.w/2+.121&&d>=-.001&&d<=(height<=0?.106:.091),'Frame coating remains inside the original stone bounds with only the agreed millimetre finish');}}
for(const n of surface.group.userData.stairNiches){
 const y=n.origin[1]+1.3,start=new T.Vector3(n.origin[0]+n.out[0]*.4,y,n.origin[2]+n.out[1]*.4),direction=new T.Vector3(-n.out[0],0,-n.out[1]);
 const hits=new T.Raycaster(start,direction,0,1.1).intersectObject(combined,true).filter(h=>!h.object.userData.nicheOrnament);assert(hits.length,'Every alcove has a real opaque back');
 const depth=(hits[0].point.x-n.origin[0])*n.out[0]+(hits[0].point.z-n.origin[2])*n.out[1];
 assert(Math.abs(depth+n.depth)<.004,'The combined museum/shaft must expose the full recessed depth: '+n.id+' '+depth+' '+hits[0].object.name);
 if(n.id.startsWith('flight-0-'))assert(n.origin[1]+n.spring+n.w/2<-.4,'First-flight arches fit entirely below the surface shaft lid');
 for(const offset of[-.3,0,.3]){
  const along=offset*n.w,top=n.origin[1]+nicheArchHeight(n,along)-.06;
  const a=new T.Vector3(n.origin[0]+n.along[0]*along+n.out[0]*.4,top,n.origin[2]+n.along[1]*along+n.out[1]*.4);
  const h=new T.Raycaster(a,direction,0,1.1).intersectObject(combined,true).filter(h=>!h.object.userData.nicheOrnament);assert(h.length,'The alcove crown has a closed back');
  const d=(h[0].point.x-n.origin[0])*n.out[0]+(h[0].point.z-n.origin[2])*n.out[1];
  assert(Math.abs(d+n.depth)<.004,'A real museum slab or shaft lid must not fill the arch crown: '+n.id);
 }
 const tileStart=new T.Vector3(n.origin[0]+n.out[0]*.4,n.origin[1]+.45,n.origin[2]+n.out[1]*.4),tileHits=new T.Raycaster(tileStart,direction,0,1.1).intersectObject(combined,true);
 assert(tileHits[0]?.object.userData.nicheOrnament,'Tilework is the visible first surface in every formerly empty recess');
 const layout=ornaments.userData.nicheLayouts.find(l=>l.niche.id===n.id);
 let sculpted=false;for(const c of layout.cells.filter(c=>c.row===2)){const u=c.u,a=new T.Vector3(n.origin[0]+n.along[0]*u+n.out[0]*.4,n.origin[1]+c.y+c.spring*.5,n.origin[2]+n.along[1]*u+n.out[1]*.4),h=new T.Raycaster(a,direction,0,1.1).intersectObject(combined,true)[0];if(h?.object.userData.nicheOrnament){const batch=ornaments.children.indexOf(h.object),range=batch===0?c.tileRange:c.vaultRange,d=(h.point.x-n.origin[0])*n.out[0]+(h.point.z-n.origin[2])*n.out[1];if(range&&h.faceIndex*3>=range[0]&&h.faceIndex*3<range[0]+range[1]&&d>-n.depth+.025&&d<-.04)sculpted=true;}}
 assert(sculpted,'Every niche has visible three-dimensional vault cells rather than a flat printed substitute');
}
for(const p of DESCENT_PARTS.filter(p=>p.id.startsWith('landing-'))){
 const north=p.minZ<92,z=north?p.minZ+.07:p.maxZ-.07;
 for(const x of[224,226.5,229]){const hits=new T.Raycaster(new T.Vector3(x,p.y+.15,z),new T.Vector3(0,-1,0),0,.3).intersectObject(surface.group,true);assert(hits.some(h=>Math.abs(h.point.y-p.y)<.002),'Landing floor meets the wall without a side/end gap');}
 const mid=new T.Vector3(226.5,p.y+1.08,north?p.minZ+.16:p.maxZ-.16),cross=new T.Raycaster(mid.clone().add(new T.Vector3(-1.2,0,0)),new T.Vector3(1,0,0),0,2.4).intersectObject(surface.group.getObjectByName('Continuous supported eight-flight handrails'));
 assert.equal(cross.length,0,'No cross-fence blocks the wall-backed alcove');
}
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
