import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';
import {validateEscherPanelSupports} from './escher-panel-supports.mjs';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateEscherPortalContacts(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()));
 const panels=validateEscherPanelSupports(T,b);
 const brass=b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0xaa9868);assert.equal(brass.count,339+panels.added);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const timberBatch=b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0x3c5149);
 const surfaceStone=b.surface.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3);
 const records=[];let instances=0;
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===brass)rows=rows.slice(0,327);if(o===timberBatch)rows=rows.slice(0,panels.sconces.oldTimber);if(o===surfaceStone)rows=rows.slice(0,panels.sconces.thresholds.oldSurfaceStone);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent 2d39630 source snapshot, including all 94 completed rail links.
 // Surface feet, timber bearings and panel supports are validated first. This snapshot
 // excludes the twelve separately checked portal clips, retaining all old IDs.
 assert.equal(records.length,32);assert.equal(instances,749+panels.added+panels.sconces.added+panels.sconces.thresholds.added);
 assert.equal(hash(records),'071fdefde6a169d7aade28d6590549c3abe5e9c669800aab5a3dfe293348e847');
 const boxes=o=>matrices(o).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(m)};});
 const batch=color=>b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===color);
 const bronze=boxes(brass),sage=boxes(batch(0x71867c)),timber=boxes(batch(0x3c5149)),walls=boxes(batch(0xa4afa3)).slice(0,28),floors=boxes(batch(0x8e968b)),clips=bronze.slice(327,339);
 const frames=[[135.24,115,-40,true,6],[160.24,115,-40,true,6],[194.24,115,-40,true,6],[232.24,115,-40,true,6],[213,98.24,-40,false,6],[184.5,132.24,-40,false,7],[184.5,156.24,-46,false,7]];
 const intersection=(a,c)=>a.box.clone().intersect(c.box).getSize(new T.Vector3());
 const positive=(a,c)=>{const s=intersection(a,c);assert(Math.min(s.x,s.y,s.z)>1e-5,'Real positive-volume contact');return s;};
 const find=(list,x,y,z)=>{const r=list.find(r=>Math.abs(r.p.x-x)<2e-5&&Math.abs(r.p.y-y)<2e-5&&Math.abs(r.p.z-z)<2e-5);assert(r,`Missing original frame member ${x}/${y}/${z}`);return r;};
 const ray=(owner,x,y,z,dx,dy,dz,far)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(owner,true);
 let sageWallRoots=0,timberRoots=0,lintelContacts=0,flooredJambs=0,wallMountedUpperJambs=0,stripWallContacts=0,clipContacts=0,clipRays=0,clearance=0;
 const used=new Set();
 frames.forEach(([x,z,y,alongX,width],frame)=>{
  const jambPairs=[];
  for(const sign of[-1,1]){
   const a=find(sage,x+(alongX?0:sign*(width/2+.37)),y+6.35/2,z+(alongX?sign*(width/2+.37):0));
   const c=find(timber,x+(alongX?.16:sign*(width/2+.55)),y+6.7/2,z+(alongX?sign*(width/2+.55):.16));
   assert(walls.some(w=>Math.min(...intersection(a,w).toArray())>1e-5));sageWallRoots++;
   const seam=positive(a,c);near(alongX?seam.x:seam.z,.06);near(alongX?seam.z:seam.x,.1);near(seam.y,6.35);timberRoots++;
   for(const jamb of[a,c]){
    near(jamb.box.min.y,y);const corners=[];
    for(const px of[jamb.box.min.x,jamb.box.max.x])for(const pz of[jamb.box.min.z,jamb.box.max.z])corners.push(new T.Vector3(px,y,pz));
    const seated=corners.every(p=>floors.some(f=>f.box.clone().expandByScalar(2e-5).containsPoint(p)));
    if(frame===5){assert(!seated,'The upper jambs are wall-mounted beyond the hall slab');wallMountedUpperJambs++;}else{assert(seated,'Original floor seat across all four corners');flooredJambs++;}
   }
   for(const[jamb,list,h,offset]of[[a,sage,6.35,0],[c,timber,6.7,.16]]){
    const lintel=find(list,x+(alongX?offset:0),y+h,z+(alongX?0:offset));near(positive(jamb,lintel).y,.11);lintelContacts++;
   }
   jambPairs.push(c);
  }
  const strip=bronze[12+frame];near(strip.p.x,x+(alongX?.27:0));near(strip.p.z,z+(alongX?0:.27));near(strip.p.y,y+6.08);
  const oldWallContacts=walls.filter(w=>Math.min(...intersection(strip,w).toArray())>1e-5);
  if(frame===5){assert.deepEqual(oldWallContacts.map(r=>r.id),[21,22]);stripWallContacts+=2;assert(!clips.some(c=>Math.abs(c.p.z-132.48)<2e-5),'No redundant upper-stair clips');}
  else{
   assert.equal(oldWallContacts.length,0);
   for(let side=0;side<2;side++){
    const sign=side?1:-1,jamb=jambPairs[side],edge=alongX?'z':'x',normal=alongX?'x':'z';
    const gap=sign<0?strip.box.min[edge]-jamb.box.max[edge]:jamb.box.min[edge]-strip.box.max[edge];near(gap,.035);
    const middle=sign<0?(strip.box.min[edge]+jamb.box.max[edge])/2:(jamb.box.min[edge]+strip.box.max[edge])/2;
    const clip=clips.find(c=>Math.abs(c.p[edge]-middle)<2e-5&&Math.abs(c.p[normal]-(alongX?x:z)-.24)<2e-5);assert(clip);assert(!used.has(clip.id));used.add(clip.id);
    near(clip.s[edge],.055);near(clip.s[normal],.04);near(clip.s.y,.035);near(clip.p.y,strip.p.y);
    const barSeat=positive(clip,strip),jambSeat=positive(clip,jamb);near(barSeat[edge],.01);near(barSeat[normal],.03);near(jambSeat[edge],.01);near(jambSeat[normal],.02);clipContacts+=2;
    near(strip.box.max.y-clip.box.max.y,.01);near(clip.box.min.y-strip.box.min.y,.01);
    const p=clip.p.clone();p[normal]+=.06;const d=new T.Vector3();d[normal]=-1;const hit=new T.Raycaster(p,d,0,.1).intersectObject(brass)[0];assert.equal(hit?.instanceId,clip.id);clipRays++;
   }
  }
  for(const along of[-2.5,0,2.5])for(let i=-5;i<=5;i++){
   const px=x+(alongX?i*.1:along),pz=z+(alongX?along:i*.1),floor=depthFloorAt(px,pz);assert(canWalkDepth(px,pz));
   const down=ray(b.group,px,floor+1,pz,0,-1,0,1.2)[0],up=ray(b.group,px,floor+1.8,pz,0,1,0,20)[0];assert(down&&up);near(down.point.y,floor);assert(up.point.y-floor>6);
   assert.equal(ray(b.group,px,floor+.01,pz,0,1,0,2.2).length,0,'Original standing-centre aperture remains clear');clearance++;
  }
 });
 assert.equal(clips.length,12);assert.equal(used.size,12);assert.equal(flooredJambs,24);assert.equal(wallMountedUpperJambs,4);
 for(let i=0;i<clips.length;i++)for(let j=i+1;j<clips.length;j++)assert(Math.min(...intersection(clips[i],clips[j]).toArray())<=0,'New clips never overlap one another');
 return{panels,added:12,sageWallRoots,timberRoots,lintelContacts,flooredJambs,wallMountedUpperJambs,stripWallContacts,clipContacts,clipRays,clearance};
}
