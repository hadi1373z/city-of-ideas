import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {ESCHER_DEPTH as D,depthFloorAt,canWalkDepth,walkDepth} from '../src/escher-depth-model.js';

const near=(a,b,e=5e-6)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateEscherStairJoins(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper +Y frame');
 assert.equal(createHash('sha256').update(readFileSync(new URL('../src/escher-depth-model.js',import.meta.url),'utf8').replace(/\r\n/g,'\n')).digest('hex'),'57bb3a803e8c3870efae87bcb9000bc4e52ab08de6c452b009b2677e41ab4b39');
 const brass=b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0xaa9868);
 assert.equal(brass.count,327);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const records=[];let instances=0;
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===brass)rows=rows.slice(0,233);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent 4da1f36 pre-edit snapshot, no image-loader stand-ins. Only the
 // exact 94 appended IDs are removed; all 643 original instances and every
 // noninstance profile/pose retain their original order and fingerprint.
 assert.equal(records.length,32);assert.equal(instances,737);
 assert.equal(hash(records),'dce0c53eb9eb4ab81a43e5249d18128ea07585e4f57af0b6325ca1bbdd7abb2c');
 const boxes=o=>matrices(o).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(m)};});
 const rows=boxes(brass),rails=rows.slice(0,233).filter(r=>Math.abs(r.s.x-.12)<1e-5&&Math.abs(r.s.y-.08)<1e-5&&Math.abs(r.s.z-.5)<1e-5),posts=rows.slice(0,233).filter(r=>Math.abs(r.s.x-.06)<1e-5&&Math.abs(r.s.y-1.1)<1e-5),links=rows.slice(233);
 assert.equal(rails.length,96);assert.equal(posts.length,96);assert.equal(links.length,94);
 const stone=b.interior.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3),treads=boxes(stone).filter(r=>Math.abs(r.s.x-7)<1e-5&&Math.abs(r.s.y-.18)<1e-5&&Math.abs(r.s.z-.512)<1e-5).sort((a,b)=>a.p.z-b.p.z);
 assert.equal(treads.length,48);
 const ray=(owner,x,y,z,dx,dy,dz,far)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(owner,true);
 const positiveIntersection=(a,b)=>{const s=a.clone().intersect(b).getSize(new T.Vector3());assert(s.x>0&&s.y>0&&s.z>0,'Real positive-volume join');return s;};
 let capContacts=0,footContacts=0,treadJoins=0,landingJoins=0,headroom=0,gapRays=0;
 for(const x of[181.22,187.78]){
  const run=rails.filter(r=>Math.abs(r.p.x-x)<1e-4).sort((a,b)=>a.p.z-b.p.z),joined=new Set([run[0].id]);
  for(let i=1;i<run.length;i++){
   const a=run[i-1],c=run[i],link=links.find(r=>Math.abs(r.p.x-x)<1e-4&&Math.abs(r.p.z-(a.box.max.z+c.box.min.z)/2)<1e-5);assert(link);
   near(a.p.y-c.p.y,.125);near(a.box.min.y-c.box.max.y,.045);near(link.s.x,.1);near(link.s.y,.185);near(link.s.z,.1);
   near(link.p.y,(a.p.y+c.p.y)/2);near(link.box.min.x-a.box.min.x,.01);near(a.box.max.x-link.box.max.x,.01);
   for(const rail of[a,c]){const s=positiveIntersection(link.box,rail.box);near(s.x,.1);near(s.y,.07);near(s.z,.05);capContacts++;}
   assert(joined.has(a.id));joined.add(c.id);
   const hit=ray(brass,x,link.p.y,link.p.z-.15,0,0,1,.3)[0];assert.equal(hit?.instanceId,link.id);gapRays++;
  }
  assert.equal(joined.size,48,'Both original runs connect through exactly 47 internal links');
 }
 near(Math.min(...links.map(r=>r.p.z)),132.5);near(Math.max(...links.map(r=>r.p.z)),155.5);
 for(const post of posts){
  const tread=treads.find(t=>Math.abs(t.p.z-post.p.z)<1e-5);assert(tread);near(post.box.min.y,tread.box.max.y);
  for(const x of[post.box.min.x,post.box.max.x])for(const z of[post.box.min.z,post.box.max.z]){
   const hit=ray(stone,x,post.box.min.y+.1,z,0,-1,0,.2)[0];assert.equal(hit?.instanceId,tread.id);near(hit.point.y,tread.box.max.y);footContacts++;
  }
  const rail=rails.find(r=>Math.abs(r.p.x-post.p.x)<1e-5&&Math.abs(r.p.z-post.p.z)<1e-5);assert(rail);positiveIntersection(rail.box,post.box);
 }
 for(let i=1;i<treads.length;i++){const s=positiveIntersection(treads[i-1].box,treads[i].box);near(s.x,7);near(s.y,.055);near(s.z,.012);treadJoins++;}
 const floor=b.interior.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0x8e968b),floors=boxes(floor);
 for(const[tread,z]of[[treads[0],131.998],[treads.at(-1),156.002]]){
  const landing=floors.find(f=>f.box.containsPoint(new T.Vector3(184.5,tread.p.y,z)));assert(landing);const s=positiveIntersection(tread.box,landing.box);near(s.x,7);near(s.y,.18);near(s.z,.006);landingJoins++;
 }
 for(const x of[181.48,182,184.5,187,187.52])for(let i=0;i<=280;i++){
  const z=130+i*.1,y=depthFloorAt(x,z);assert(canWalkDepth(x,z));
  const floorHit=ray(b.group,x,y+1,z,0,-1,0,1.2)[0],roofHit=ray(b.group,x,y+1.8,z,0,1,0,20)[0];assert(floorHit&&roofHit);near(floorHit.point.y,y,1e-5);
  assert(roofHit.point.y-y>6,'Actual landing frames, ceiling and lighting stay above the walk');
  assert.equal(ray(b.group,x,y+.01,z,0,1,0,2.2).length,0,'Clear standing-centre ray');headroom++;
 }
 // Original source movement: all 48 heights in both directions on three lanes.
 for(const x of[181.48,184.5,187.52]){const p={x,z:130.8,y:-38.2},visited=new Set();
  for(let i=0;i<300;i++){const old=p.y;walkDepth(p,0,.09);assert(Math.abs(p.y-old)<=.125001);visited.add(Number((p.y-1.8).toFixed(3)));}
  assert(p.z>157);near(p.y-1.8,-46);for(let i=1;i<=48;i++)assert(visited.has(-40-i*.125));
  for(let i=0;i<300;i++){const old=p.y;walkDepth(p,0,-.09);assert(Math.abs(p.y-old)<=.125001);}assert(p.z<132);near(p.y-1.8,-40);
 }
 return{capContacts,footContacts,treadJoins,landingJoins,headroom,gapRays,runs:2,oldInstances:643,added:94};
}

export function watchEscherResources(b){
 const resources=new Map(),buffers=new Map();
 function scan(){b.group.traverse(o=>{if(!o.isMesh)return;const add=r=>{if(r&&!resources.has(r)){resources.set(r,0);r.addEventListener('dispose',()=>resources.set(r,resources.get(r)+1));}};add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){add(m);add(m.map);}if(o.isInstancedMesh&&!buffers.has(o)){buffers.set(o,0);o.addEventListener('dispose',()=>buffers.set(o,buffers.get(o)+1));}});}
 scan();assert.equal(resources.size,60);assert.equal(buffers.size,14);
 return{scan,assertReleased(){for(const count of[...resources.values(),...buffers.values()])assert.equal(count,1,'Only original owned resources/buffers, each released once');assert.equal(resources.size,62);assert.equal(buffers.size,17);}};
}
