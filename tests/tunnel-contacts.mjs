import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {GALLERY_TUNNEL,tunnelContains} from '../src/world-cylinder-model.js';

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const near=(a,b,e=5e-6)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const matrices=(T,o)=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});

export function validateTunnelContacts(T,b){
 b.group.updateMatrixWorld(true);
 assert.deepEqual(GALLERY_TUNNEL,{width:4,y:-40,points:[[22,0],[70,0],[70,115],[135,115]]});
 assert.equal(b.tunnel.parent,b.group,'The tunnel remains in the original upper frame');
 assert(b.tunnel.matrixWorld.equals(new T.Matrix4()));
 const records=[];
 b.group.traverse(o=>{if(o.isMesh&&!b.tunnel.children.includes(o))records.push({
  name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,
   index:o.geometry.index?Array.from(o.geometry.index.array):null,
   attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},
  color:o.material?.color?.getHex(),instances:o.isInstancedMesh?matrices(T,o):null
 });});
 // Independent 90298b9 source-owner snapshot: every earth/sea/lower-land mesh,
 // vertex, instance, order and inherited pose outside the three tunnel batches.
 assert.equal(hash(records),'7fdc502f50bdefa4b6cfc9b8ebb6cc3d9a9b4143aab7ca7085d345697e26dbce');
 assert.equal(records.length,44);assert.equal(records.reduce((n,r)=>n+(r.instances?.length||0),0),7595);
 assert.equal(b.owned.size,67);assert.equal([...b.owned].filter(r=>r.isBufferGeometry).length,33);
 assert.equal([...b.owned].filter(r=>r.isMaterial).length,34);
 assert.equal(b.tunnel.children.length,3);
 const batch=color=>b.tunnel.children.find(o=>o.material.color.getHex()===color);
 const stone=batch(0xb4a58c),brass=batch(0xbba56d),warm=batch(0xe1c28d);
 assert.equal(stone.count,16);assert.equal(brass.count,20);assert.equal(warm.count,40);
 // Main now partitions the floor/roof union; original walls and lamps remain.
 assert.equal(hash(matrices(T,warm)),'ecb9c7fbb4f2279ab4fbdac981a8d2d2a7e15dda1b7bc8eab4c2af32aae0837f');
 const boxes=o=>matrices(T,o).map(a=>new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(new T.Matrix4().fromArray(a)));
 const stoneBoxes=boxes(stone),walls=stoneBoxes.filter(b=>b.max.y-b.min.y>4),floors=stoneBoxes.filter(b=>Math.abs(b.max.y+40)<1e-5),roofs=stoneBoxes.filter(b=>Math.abs(b.min.y+35.125)<1e-5),strips=boxes(brass),lamps=boxes(warm);
 assert.equal(walls.length,6);assert.equal(floors.length,5);assert.equal(roofs.length,5);
 const ray=(owner,x,y,z,dx,dy,dz,far)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(owner,true);
 const contains=(box,p)=>box.clone().expandByScalar(5e-6).containsPoint(p);
 let wallContacts=0,stripContacts=0,lampContacts=0,walking=0,mouths=0;
 const expectedWalls=[[24,68,-2.1,-1.9],[24,68,1.9,2.1],[67.9,68.1,2,113],[71.9,72.1,2,113],[72,133,112.9,113.1],[72,133,116.9,117.1]];
 walls.forEach((wall,i)=>{const e=expectedWalls[i];near(wall.min.x,e[0]);near(wall.max.x,e[1]);near(wall.min.z,e[2]);near(wall.max.z,e[3]);near(wall.min.y,-40);near(wall.max.y,-35);
  for(const floor of floors){const seat=wall.clone().intersect(new T.Box3(new T.Vector3(floor.min.x,-40,floor.min.z),new T.Vector3(floor.max.x,-35,floor.max.z)));const size=seat.getSize(new T.Vector3());if(size.x<=0||size.z<=0)continue;near(Math.min(size.x,size.z),.1);for(const x of[seat.min.x,seat.max.x])for(const z of[seat.min.z,seat.max.z]){assert(contains(floor,new T.Vector3(x,-40,z)));assert(roofs.some(roof=>contains(roof,new T.Vector3(x,-35.1,z))));wallContacts+=2;}}
 });assert(wallContacts>=48);
 for(let i=0;i<floors.length;i++)for(let j=i+1;j<floors.length;j++){const size=floors[i].clone().intersect(floors[j]).getSize(new T.Vector3());assert(size.x<=1e-5||size.z<=1e-5,'Floor partitions meet without coplanar overlap');}
 const stations=[[28,0],[39,0],[50,0],[61,0],[70,6],[70,17],[70,28],[70,39],[70,50],[70,61],[70,72],[70,83],[70,94],[70,105],[76,115],[87,115],[98,115],[109,115],[120,115],[131,115]];
 assert.equal(new Set(matrices(T,brass).map(JSON.stringify)).size,20,'No duplicate strip stamps');
 strips.forEach((box,i)=>{
  const p=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());near(p.x,stations[i][0]);near(p.z,stations[i][1]);
  near(size.y,.15);near(box.min.y,-35.27);near(box.max.y,-35.12);
  const vertical=i>=4&&i<14;near(size.x,vertical?.14:3.8);near(size.z,vertical?3.8:.14);
  near(box.max.y-roofs[0].min.y,.005);
  for(const x of[box.min.x,box.max.x])for(const z of[box.min.z,box.max.z]){
   const p=new T.Vector3(x,-35.1225,z);assert(contains(box,p)&&roofs.some(roof=>contains(roof,p)),'Full strip top seats inside the roof');stripContacts++;
  }
  const hit=ray(brass,p.x,-35.4,p.z,0,1,0,.4)[0];assert.equal(hit?.instanceId,i);near(hit.point.y,-35.27);
 });
 lamps.forEach(box=>{
  // Test a real positive-volume intersection rather than a centre-to-centre gap.
  const overlaps=walls.map(w=>box.clone().intersect(w).getSize(new T.Vector3()));
  assert(overlaps.some(s=>s.x>0&&s.y>0&&s.z>0),'Every retained lamp meets a real wall');lampContacts++;
 });
 function inspect(x,z){
  if(!tunnelContains(x,z)||x>134.4)return; // The museum owns the final floor; combined-scene rays cover that seam.
  const down=ray(b.tunnel,x,-38.2,z,0,-1,0,2),up=ray(b.tunnel,x,-38.2,z,0,1,0,5);
  assert(down.length&&up.length,`Supported covered walk at ${x},${z}`);near(down[0].point.y,-40);
  assert(up[0].point.y>=-35.270005,'Existing minimum headroom remains 4.73m');
  assert.equal(ray(b.tunnel,x,-39.99,z,0,1,0,2.2).length,0,'No wall/strip intrudes into the visitor body');walking++;
 }
 for(const[a,c]of[[[22,0],[70,0]],[[70,0],[70,115]],[[70,115],[135,115]]]){
  const n=Math.hypot(c[0]-a[0],c[1]-a[1]),vertical=a[0]===c[0];
  for(let d=0;d<=n;d++)for(const offset of[-1.74,-.9,0,.9,1.74])inspect(a[0]+(c[0]-a[0])*d/n+(vertical?offset:0),a[1]+(c[1]-a[1])*d/n+(vertical?0:offset));
 }
 for(const[x,z]of[[70,0],[70,115]])for(let i=-14;i<=14;i++)for(let j=-14;j<=14;j++)inspect(x+i*.15,z+j*.15);
 for(const[x,z,dx]of[[22,0,1],[133,115,1]])for(const offset of[-1.74,0,1.74])for(const y of[-39.8,-38.2,-37.8]){
  assert.equal(ray(b.group,x,y,z+offset,dx,0,0,4).length,0,'Original gallery/museum mouths and earth cut stay open');mouths++;
 }
 return{wallContacts,stripContacts,lampContacts,walking,mouths,draws:47,instances:7671,resources:67};
}
