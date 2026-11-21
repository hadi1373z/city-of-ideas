import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildDeChiricoExhibit} from '../src/de-chirico-exhibit.js';
import {INHABITED_MIND as H,MIND_TOWERS,MIND_FIGURES,MIND_COLUMNS,mindCanStand,mindLoopSamples} from '../src/de-chirico-model.js';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),built=buildDeChiricoExhibit(T,{canvas}),meshes=[],resources=new Set();built.group.updateMatrixWorld(true);
built.group.traverse(m=>{if(!m.isMesh)return;meshes.push(m);if(m.isInstancedMesh)resources.add(m);resources.add(m.geometry);for(const mat of(Array.isArray(m.material)?m.material:[m.material])){resources.add(mat);if(mat.map)resources.add(mat.map);}
 for(const key of['position','normal'])assert(Array.from(m.geometry.attributes[key].array).every(Number.isFinite),m.name+' finite '+key);
 const normal=m.geometry.attributes.normal;for(let i=0;i<normal.count;i++)assert(Math.hypot(normal.getX(i),normal.getY(i),normal.getZ(i))>.9,'No collapsed normals');
});
assert.equal(built.entry.x,226);assert.equal(built.entry.z,191);assert.equal(built.towers.length,4);assert.equal(built.figures.length,2);assert.equal(MIND_COLUMNS.length,4);assert.equal(built.targets.length,1);assert(built.targets[0].userData.deChirico);
assert.equal(meshes.length,built.stats.draws);assert(meshes.length<=32,'Shared detail geometry stays within a bounded draw budget');assert(built.stats.instances>180,'Actual articulated details and masonry, not an unchanged labelled box');
const bounds=new T.Box3().setFromObject(built.group);assert(bounds.min.x>=H.x-6.6&&bounds.max.x<=H.x+6.6,'Existing sculpture footprint preserved');assert(bounds.min.z>=H.z-14.2&&bounds.max.z<=H.z+5.2,'Only the small engraved viewpoint extends along the public approach');
assert.deepEqual([...MIND_TOWERS].sort((a,b)=>b.x-a.x).map(t=>t.id),['yellow','teal','terracotta','dark'],'Negative-Z frontal camera reads the sketch colour order left to right');assert(H.plaque.x<0,'Plaque appears on the right of the actual frontal camera');assert.equal(H.viewpoint.z,-14,'Marked view includes the full tall columns');
let portalRays=0;
for(const [index,c]of MIND_TOWERS.entries()){
 const tower=built.towers[index];
 for(const x of[-.12,-.06,0,.06,.12])for(const height of[.15,.4,.7]){
  const start=new T.Vector3(H.x+c.x+x,H.y+.215+height,H.z+c.z-c.depth/2-.25),ray=new T.Raycaster(start,new T.Vector3(0,0,1),0,c.depth+.5);
  assert.equal(ray.intersectObject(tower).length,0,c.id+' portal is a real aperture through the whole tower');portalRays++;
 }
 const jamb=new T.Vector3(H.x+c.x+c.width*.4,H.y+.65,H.z+c.z-c.depth/2-.25);assert(new T.Raycaster(jamb,new T.Vector3(0,0,1),0,c.depth+.5).intersectObject(tower).length,'Jamb remains solid around aperture');
 const winY=H.y+.215+c.windowY+c.windowHeight*.4,winStart=new T.Vector3(H.x+c.x,winY,H.z+c.z-c.depth/2-.25),windowRay=new T.Raycaster(winStart,new T.Vector3(0,0,1),0,c.depth+.5);assert.equal(windowRay.intersectObject(tower).length,0,'Upper opening is geometry');const actual=windowRay.intersectObjects(meshes);assert(actual.length&&actual[0].distance>.4,'Window has a genuinely recessed inner backing');
 assert(!mindCanStand(H.x+c.x,H.z+c.z,H.y),'Miniature openings do not falsely permit a human through a sub-45cm arch');
}
for(const f of MIND_FIGURES){
 const body=built.figures.find(m=>m.userData.mindFigure===f.id),origin=new T.Vector3(H.x+f.x,H.y+1.4,H.z+f.z-2),hits=new T.Raycaster(origin,new T.Vector3(0,0,1),0,3).intersectObject(body);
 assert(hits.length&&hits[0].face.normal.z<0,'Robe has outward-facing front surfaces');
 const head=meshes.find(m=>m.userData.mindHead===f.id),from=new T.Vector3(built.viewpoint.x,H.y+1.8,built.viewpoint.z),target=head.getWorldPosition(new T.Vector3()),ray=new T.Raycaster(from,target.sub(from).normalize());
 assert.equal(ray.intersectObjects(meshes)[0]?.object,head,'Both heads are visible from the marked frontal composition; no central sign blocks them');
}
let bodyRays=0,supportRays=0;
const loop=mindLoopSamples(.10);for(const point of loop){
 assert(mindCanStand(point.x,point.z,H.y),'Whole visitor loop is physically clear');
 for(const height of[.4,1.1,1.78])for(let i=0;i<8;i++){const a=i/8*Math.PI*2,start=new T.Vector3(point.x,H.y+height,point.z),ray=new T.Raycaster(start,new T.Vector3(Math.cos(a),0,Math.sin(a)),.001,.22);assert.equal(ray.intersectObjects(meshes).length,0,'No real geometry intrudes into walking body');bodyRays++;}
 if(Math.abs(point.z-H.z)<4.72){const ray=new T.Raycaster(new T.Vector3(point.x,H.y+.3,point.z),new T.Vector3(0,-1,0),0,.32),hit=ray.intersectObjects(meshes)[0];assert(hit&&Math.abs(hit.point.y-H.y)<.02,'Perimeter loop has flush physical stone support');supportRays++;}
}
assert(mindCanStand(H.x,H.z,-95.9),'Upper installation does not block the lower world');assert(mindCanStand(0,0,H.y),'Unrelated city routes stay clear');assert(!mindCanStand(NaN,H.z));
const from=new T.Vector3(H.entry.x,H.y+1.8,H.entry.z),to=built.targets[0].getWorldPosition(new T.Vector3()),ray=new T.Raycaster(from,to.sub(from).normalize());assert(ray.intersectObjects(built.targets).length,'Low plaque remains selectable from original arrival');
const calls=new Map();for(const r of resources)r.addEventListener('dispose',()=>calls.set(r,(calls.get(r)||0)+1));built.dispose();built.dispose();assert.equal(built.group.children.length,0);assert.equal(built.targets.length,0);for(const r of resources)assert.equal(calls.get(r),1,'Every shared geometry/material/texture is disposed exactly once');
console.log(`PASS Inhabited Mind: ${portalRays} real portal rays, recessed window backs, outward robe normals, both clear frontal heads, ${bodyRays} body-clearance and ${supportRays} support rays, height-aware solids, ${meshes.length} draws and idempotent owned cleanup.`);
