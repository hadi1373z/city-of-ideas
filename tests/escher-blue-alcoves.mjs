import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherDescent,installEscherDescent} from '../src/escher-descent.js';
import {DESCENT,DESCENT_PARTS,descentFloorBounds,descentSurface} from '../src/escher-descent-model.js';
import {ESCHER_SHAFT_NICHES} from '../src/escher-stone-details.js';
import * as N from '../src/escher-niche-model.js';
import {depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';
import {buildEscherNicheOrnaments} from '../src/escher-niche-ornaments.js';
import {ESCHER_NICHE_TILE_FINISH} from '../src/escher-niche-tile-finish.js';

// Independent geometry/pose fingerprints captured BEFORE the approved alcove
// replacement (work/escher-stair-baseline.mjs). These are actual instance
// buffers, not freshly generated expected treads from the new implementation.
const expected={treads:[320,'cc95d4091a4dc904a0b41765437b71c073364b8695a4e2627d9a866a142ba48a'],nosings:[320,'2af4249ad508c43db9965ccc1590cb0b7dab58bb05f573f7164a56c9064e7eef'],landings:[9,'22d04613614d66d04cffaba69d5cec9ddbe17dbdc11088395b973d726e1b6ab0'],posts:[98,'5c67daa56209877d32380521b45cb548620c6889c3c520a260c84820feb9bf4c'],rails:[2,'4bb0e202c7bfb63e0ae4eb5ec50b8154203d8fe25e75b7dc8185dffaa517160d']};
const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex'),surface=buildEscherDescent(T),records={treads:[],nosings:[],landings:[],posts:[],rails:[]},matrix=new T.Matrix4(),pos=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();surface.group.updateMatrixWorld(true);
surface.group.traverse(o=>{if(!o.isInstancedMesh)return;if(o.name==='Continuous supported eight-flight handrails'||o.name==='Rounded connected stair-rail joints'){records.rails.push({name:o.name,geometry:Array.from(o.geometry.attributes.position.array),index:o.geometry.index?Array.from(o.geometry.index.array):null,matrices:Array.from(o.instanceMatrix.array),count:o.count});return;}if(o.geometry.type!=='BoxGeometry')return;for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrix.decompose(pos,q,scale);let key=null;if(Math.abs(scale.y-.18)<1e-6&&Math.abs(scale.z-.304)<1e-6)key='treads';else if(Math.abs(scale.y-.018)<1e-6&&Math.abs(scale.z-.035)<1e-6)key='nosings';else if(Math.abs(scale.y-.25)<1e-6&&scale.x>2)key='landings';else if(Math.abs(scale.x-.055)<1e-6&&Math.abs(scale.z-.055)<1e-6)key='posts';if(key)records[key].push({matrix:matrix.toArray(),colour:o.material.color.getHex()});}});
for(const key of['treads','nosings','landings','posts'])records[key].sort((a,b)=>{const A=JSON.stringify(a),B=JSON.stringify(b);return A<B?-1:A>B?1:0;});
for(const [key,[count,digest]]of Object.entries(expected)){assert.equal(records[key].length,count,`All original ${key} remain`);assert.equal(hash(records[key]),digest,`Original ${key} geometry/poses/finish stay byte-for-byte unchanged`);}
assert.equal(hash({DESCENT,DESCENT_PARTS,floorBounds:DESCENT_PARTS.map(descentFloorBounds)}),'eef2252b5f74221937973bc09e6ff5fe16915a770093e76b0978f844d89b9b09');
assert.equal(hash({paths:surface.group.userData.stairGuardPaths.map(p=>p.map(v=>v.toArray())),posts:[...surface.group.userData.stairGuardPosts.values()]}),'8d6b8c1855ab5976638f42f3db77cbf63071754e612f20c5099743e33b372a79');
assert.equal(hash(ESCHER_SHAFT_NICHES.map(({id,origin,along,out,w,spring})=>({id,origin,along,out,w,spring}))),'bef223f920ad4402998caf2845e62b9c5f67d3b2a549b50002f58fb5e69cec70','All31 alcove origins/sizes remain at the established locations');
assert.equal(createHash('sha256').update(readFileSync(new URL('../src/escher-descent-model.js',import.meta.url))).digest('hex'),'1507d83b115719d5f244443e1e5038debff0797a696ad823a59b430605295ae6','The original stair/walking authority is unchanged');
assert.equal(N.ESCHER_NICHE_WALL,.74);
for(const n of ESCHER_SHAFT_NICHES)assert.equal(n.depth,.60);

// Pure construction profiles are checked independently against equal-edge
// geometry, ordered depths and the original, immovable shaft envelope.
const near=(a,b,tolerance=1e-9)=>assert(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const lengths=plan=>plan.slice(1).map((p,i)=>Math.hypot(p[0]-plan[i][0],p[1]-plan[i][1]));
let cells=0;
for(const n of ESCHER_SHAFT_NICHES){
 const wall=N.nicheWallPlan(n),edges=lengths(wall);assert.equal(wall.length,4);
 near(edges[0],edges[1]);near(edges[1],edges[2]);
 for(let i=0;i<4;i++){near(wall[i][0],-wall[3-i][0]);near(wall[i][1],wall[3-i][1]);}
 assert(wall[1][1]<wall[0][1]-.4,'Lower wall recedes symmetrically towards the centre');
 near(N.nicheWallDepth(n,0),wall[1][1]);
 const model=N.nicheCells(n);assert.equal(model.rows.length,6);
 for(let row=1;row<6;row++)assert(model.rows[row].frontDepth<model.rows[row-1].frontDepth,'Upper course is forward of the course below');
 for(const c of model.cells){
  assert(c.height/c.width>.85&&c.rise/c.height>=.6,'The refined pockets have tall lancet proportions rather than short badges');
  const e=lengths(c.plan);near(e[0],e[1]);near(e[1],e[2]);near(e[0],c.width/2);
  near(c.plan[1][1],c.plan[2][1]);near(c.plan[0][1],c.plan[3][1]);
  assert(c.plan[1][1]<c.plan[0][1]-.02,'A real half-hexagon pocket extends into the wall');
  assert(c.frontDepth>=.045&&c.frontDepth+c.pocketDepth<n.depth-.1,'Vault depth retains a real opaque rear wall');
  for(const [u,d]of c.plan){assert(Math.abs(c.u+u)<n.w/2);assert(d<=-.045&&d>=-n.depth);}
  const mirror=model.cells.find(q=>q.row===c.row&&Math.abs(q.u+c.u)<1e-9);assert(mirror);near(mirror.frontDepth,c.frontDepth);
  const rowCells=model.cells.filter(q=>q.row===c.row),outer=rowCells[0];
  assert(c.frontDepth>=outer.frontDepth-1e-9,'Each hood course also deepens from either side towards the centre');
  cells++;
 }
}
assert(cells>600);
// Museum visitors cannot enter the outward-thickened solid masonry. The
// unchanged controller still owns the inner shaft; its original landing and
// real south doorway remain open through the entire thicker wall.
for(const y of[-40,-34,-46])for(const[x,z]of[[223.3,100],[229.7,100],[226.5,90.1],[228,107.0]]){
 assert.equal(depthFloorAt(x,z,y),null);assert(!canWalkDepth(x,z,{fromY:y}));
}
for(const z of[104.5,105.5,106.6,107,107.5,108]){near(depthFloorAt(225,z,-40),-40);assert(canWalkDepth(225,z,{fromY:-40}),'The original stair-to-museum exit remains open');}

// Check the actual batched triangles, not just the metadata or depth formula.
const ornaments=surface.group.getObjectByName('Escher · tiled recessed stair niches'),layouts=ornaments.userData.nicheLayouts;
assert.equal(ornaments.children.length,2);assert.equal(layouts.length,31);
assert.equal(ornaments.userData.vaultCellCount,cells);
const [tileMesh,vaultMesh]=ornaments.children;
assert(ornaments.children.reduce((sum,m)=>sum+m.geometry.attributes.position.count/3,0)<260000,'All31 richly carved niches and real gold ribs retain a bounded shared triangle budget');
const local=(n,p)=>{const x=p.x-n.origin[0],z=p.z-n.origin[2];return[x*n.along[0]+z*n.along[1],p.y-n.origin[1],x*n.out[0]+z*n.out[1]];};
const position=(mesh,i)=>new T.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i);
function localRay(mesh,n,u,y){const from=new T.Vector3(...N.nicheWorld(n,[u,y,.4]));return new T.Raycaster(from,new T.Vector3(-n.out[0],0,-n.out[1]),0,1.1).intersectObject(mesh,false);}
const cellRanges=c=>[[tileMesh,c.tileRange],[vaultMesh,c.vaultRange]];
const cellRay=(c,n,u,y)=>cellRanges(c).flatMap(([m,r])=>{m.geometry.setDrawRange(...r);return localRay(m,n,u,y);}).sort((a,b)=>a.distance-b.distance);
const batches=ornaments.children,coverage=batches.map(m=>new Uint8Array(m.geometry.attributes.position.count));
const pointNearEdge=(p,poly)=>poly.some((a,i)=>{const b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)<3e-5;});
const inside=(p,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
function originalStoneFootprint(n,[u,y,d]){
 const r=n.w/2;
 if(y<=3e-5&&y>=-.1-3e-5&&Math.abs(u)<=r+.19+3e-5)return d>=-.001&&d<=.105+3e-5;
 const profile=radius=>[[-radius,0],[radius,0],[radius,n.spring],...Array.from({length:32},(_,i)=>{const a=(i+1)*Math.PI/32;return[radius*Math.cos(a),n.spring+radius*Math.pow(Math.max(0,1-Math.abs(Math.cos(a))),.65)];})],inner=profile(r),outer=profile(r+.12),p=[u,y];
 return d>=-.001&&d<=.090+3e-5&&(inside(p,outer)||pointNearEdge(p,outer))&&(!inside(p,inner)||pointNearEdge(p,inner));
}
let facetProbes=0,depthProbes=0;
const tolerance=3e-5;
for(const l of layouts){
 const n=l.niche;assert.equal(l.rangeUnits,'vertices');
 assert(l.interiorRanges.length&&l.frameRanges.length,'Interior and original-envelope frame have separate actual geometry ownership');
 for(const ownedRange of [...l.interiorRanges,...l.frameRanges]){
  const mesh=batches[ownedRange.batch],range=[ownedRange.start,ownedRange.count],isFrame=l.frameRanges.includes(ownedRange);
  assert.equal(range[0]%3,0);assert.equal(range[1]%3,0);assert(range[1]>0);assert(range[0]+range[1]<=mesh.geometry.attributes.position.count);
  for(let i=range[0];i<range[0]+range[1];i++){
   const [u,y,d]=local(n,position(mesh,i));assert([u,y,d].every(Number.isFinite));
   assert.equal(coverage[ownedRange.batch][i]++,0,'Every actual vertex has exactly one cavity/frame owner');
   if(isFrame)assert(originalStoneFootprint(n,[u,y,d]),'The new blue/gold frame stays on the original32-segment stone envelope');
   else{
    assert(d>=-n.depth-tolerance&&d<=-.042,'Every actual interior triangle remains recessed');
    assert(Math.abs(u)<=n.w/2+tolerance&&y>=.011-tolerance&&y<=N.nicheArchHeight(n,u)+.002,'Actual interior triangles stay inside their own fixed niche');
   }
   const normal=mesh.geometry.attributes.normal;assert(Number.isFinite(normal.getX(i)+normal.getY(i)+normal.getZ(i)));
  }
  if(isFrame)for(let i=range[0];i<range[0]+range[1];i+=3){const mid=position(mesh,i).add(position(mesh,i+1)).add(position(mesh,i+2)).multiplyScalar(1/3);assert(originalStoneFootprint(n,local(n,mid)),'Frame triangles never bridge or cap the actual aperture');}
 }
 // These separate lower wall planes are measurable from the room; the centre
 // sits more than40cm behind the sides, instead of a flat tiled backboard.
 tileMesh.geometry.setDrawRange(...l.tileRange);
 for(const u of[-.40,-.20,0,.20,.40].map(t=>t*n.w)){
  const h=localRay(tileMesh,n,u,.46);assert(h.length);near(local(n,h[0].point)[2],N.nicheWallDepth(n,u),.004);depthProbes++;
 }
 for(const c of l.cells){
  const actual=cellRanges(c).flatMap(([mesh,range])=>Array.from({length:range[1]},(_,i)=>local(n,position(mesh,range[0]+i))));
  for(let k=0;k<3;k++){
   const a=c.plan[k],b=c.plan[k+1],quad=[[c.u+a[0],c.y,a[1]],[c.u+b[0],c.y,b[1]],[c.u+b[0],c.y+c.spring,b[1]],[c.u+a[0],c.y+c.spring,a[1]]];
   for(const p of quad)assert(actual.some(q=>Math.hypot(...p.map((v,i)=>v-q[i]))<tolerance),'Every equal facet corner belongs to the rendered cell triangles');
   near(Math.hypot(quad[1][0]-quad[0][0],quad[1][2]-quad[0][2]),c.width/2);facetProbes++;
  }
  // Trace through an actual empty mouth towards both oblique vertical walls.
  // Moving towards the centre must reveal a deeper point, with no tooth in
  // front of the room wall and no flat print pretending to be a cavity.
  const measured=[];
  for(const fraction of[-.40,-.20,.20,.40]){
   const h=cellRay(c,n,c.u+c.width*fraction,c.y+c.spring*.26);assert(h.length,'Every carved pocket is closed at both sides');
   const d=local(n,h[0].point)[2],f=Math.min(1,(.5-Math.abs(fraction))/.25),expected=-c.frontDepth-c.pocketDepth*f;
   near(d,expected,.003);measured.push(d);depthProbes++;
  }
  assert(measured[1]<measured[0]-.015&&measured[2]<measured[3]-.015,'Actual pocket rays recede symmetrically toward the centre');
 }
 const regions=ESCHER_NICHE_TILE_FINISH.regions;
 for(const panel of l.panelRanges){
  const region=regions[panel.region];assert(region,'Each fitted panel has an explicit original atlas region');const mesh=batches[panel.batch],uv=mesh.geometry.attributes.uv;
  const min=[Infinity,Infinity],max=[-Infinity,-Infinity];for(let i=panel.range[0];i<panel.range[0]+panel.range[1];i++){const p=[uv.getX(i),uv.getY(i)];for(let a=0;a<2;a++){assert(p[a]>=region[a]-1e-6&&p[a]<=region[a]+region[a+2]+1e-6,'Fitted ceramic panels never repeat or bleed into a neighbouring atlas composition');min[a]=Math.min(min[a],p[a]);max[a]=Math.max(max[a],p[a]);}}
  if(panel.region==='panel'||panel.region==='floral')assert(max[0]-min[0]>region[2]*.6&&max[1]-min[1]>region[3]*.6,'Each main facet receives a whole fitted ornamental composition');
 }
 assert(l.panelRanges.some(p=>p.region==='panel')&&l.panelRanges.filter(p=>p.region==='floral').length>=2,'The three lower facets have one principal panel and two fitted floral panels');
 assert(l.goldRibRanges.length>=l.cells.length,'Every real cavity has a three-dimensional gold outline');
 for(const rib of l.goldRibRanges){const mesh=batches[rib.batch],points=Array.from({length:rib.range[1]},(_,i)=>local(n,position(mesh,rib.range[0]+i)));assert(points.length>=12);const depth=points.map(p=>p[2]);assert(Math.max(...depth)-Math.min(...depth)>.002,'Gold ribs have real raised depth rather than a flat coloured stroke');}
}
for(const owned of coverage)assert(owned.every(count=>count===1),'No unvalidated ornament or frame triangles are omitted from the physical bounds check');
tileMesh.geometry.setDrawRange(0,Infinity);vaultMesh.geometry.setDrawRange(0,Infinity);
// The actual low/oblique screenshot pose exposed two formerly bare stone
// arch returns as beige wedges between courses. Trace those same rays against
// the complete structural descent, so a blue back alone cannot pass this.
const screenshotCamera=new T.PerspectiveCamera(66,572/659,.08,650);screenshotCamera.position.set(225.36,-37.32,101.84);screenshotCamera.rotation.set(.02,1.280,0,'YXZ');screenshotCamera.updateMatrixWorld(true);
for(const [px,py]of[[105,100],[300,132]]){
 const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(px/572*2-1,1-py/659*2),screenshotCamera);
 const hit=ray.intersectObject(surface.group,true)[0];assert(hit?.object.userData.nicheOrnament,'Low/oblique views see blue tiled arch returns instead of bare structural wedges');
 assert(hit.object.material.map?.userData.originalProcedural,'The reveal uses the real shared blue ceramic atlas');
}
// Materials and textures are scoped to the two owned batches and clean up
// exactly once, even if the containing scene repeats a disposal call.
const isolated=buildEscherNicheOrnaments(T,ESCHER_SHAFT_NICHES),resources=new Set(),disposed=new Map();
isolated.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});
for(const r of resources){disposed.set(r,0);r.addEventListener('dispose',()=>disposed.set(r,disposed.get(r)+1));}
isolated.dispose();isolated.dispose();for(const count of disposed.values())assert.equal(count,1,'Owned resource disposed exactly once');assert.equal(isolated.group.children.length,0);
surface.dispose();
// Drive the actual native installer: entering the old footprint still starts
// the original stair controller, and the two pooled lights disappear on exit.
const oldDocument=globalThis.document;
try{
 let modal=false;globalThis.document={hidden:false,body:{dataset:{}},querySelector:()=>modal?{}:null};
 let open=false,stops=0;const originalStand=()=>true,M={scene:new T.Scene(),eye:1.8,mode:'city',player:{x:228,z:105.5,y:1.93,yaw:0,pitch:0},city:{canStand:originalStand},status(){}};
 const sun=new T.DirectionalLight(0xffffff,2.8);sun.position.set(0,120,0);M.scene.add(sun);
 const runtime=installEscherDescent(M,T,{gateOpen:()=>open,onStop:()=>stops++}),pool=[...runtime.built.alcoveLights];
 assert.equal(pool.length,2);assert(pool.every(l=>!l.visible&&!l.castShadow));
 assert(!runtime.captureSurfaceAt(228,105.4),'A closed original door does not capture walking');open=true;
 assert(runtime.captureSurfaceAt(228,105.4));assert(runtime.active);assert.equal(M.player.x,228);near(M.player.y,1.93);
 for(const f of DESCENT_PARTS.filter(p=>p.kind==='flight')){
  const z=(f.start+f.end)/2,y=descentSurface(f.x,z,(f.top+f.bottom)/2).y;Object.assign(M.player,{x:f.x,z,y:y+M.eye});runtime.step(0);
  const expected=ESCHER_SHAFT_NICHES.map(n=>({n,d:(n.origin[0]-M.player.x)**2+(n.origin[1]+.3-M.player.y)**2+(n.origin[2]-M.player.z)**2})).filter(p=>p.d<18).sort((a,b)=>a.d-b.d).slice(0,2);
  for(let i=0;i<pool.length;i++){const light=pool[i];assert.equal(light,runtime.built.alcoveLights[i],'Moving never reallocates the bounded light pool');assert.equal(light.visible,i<expected.length);if(expected[i]){const n=expected[i].n;near(light.position.x,n.origin[0]-n.out[0]*.32);near(light.position.y,n.origin[1]+.12);near(light.position.z,n.origin[2]-n.out[1]*.32);assert.equal(light.color.getHex(),0xffcb82);assert.equal(light.distance,2.6);}}
 }
 document.hidden=true;const paused={...M.player};runtime.step(.1,{forward:1});assert.deepEqual(M.player,paused,'Hidden-page movement remains paused');document.hidden=false;modal=true;runtime.step(.1,{forward:1});assert.deepEqual(M.player,paused,'An open reader/modal preserves the stair pause');modal=false;
 M.mode='overview';assert.equal(runtime.step(0),false);assert(!runtime.active);assert(pool.every(l=>!l.visible));assert(!runtime.built.fill.visible);assert.equal(document.body.dataset.escherDescent,undefined);
 assert.equal(sun.intensity,2.8);assert.deepEqual(sun.position.toArray(),[0,120,0],'Local alcove lights never change the fixed daylight sun');
 M.mode='city';Object.assign(M.player,{x:228,z:105.5,y:1.93});assert(runtime.captureSurfaceAt(228,105.4));runtime.dispose();assert.equal(M.city.canStand,originalStand);assert.equal(runtime.built.group.children.length,0);assert.equal(stops,2);assert(!runtime.step(.1,{forward:1}));
}finally{if(oldDocument===undefined)delete globalThis.document;else globalThis.document=oldDocument;}
console.log(`PASS blue alcoves:320 original treads/nosings,9 landings,98 posts,2 rail batches,31 fixed origins,${cells} real pockets,${facetProbes} actual equal facets,${depthProbes} depth rays, exact walking authority,2 gated pooled lights and bounded cleanup.`);
