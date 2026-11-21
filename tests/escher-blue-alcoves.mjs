import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {DESCENT,DESCENT_PARTS,descentFloorBounds} from '../src/escher-descent-model.js';
import {ESCHER_SHAFT_NICHES} from '../src/escher-stone-details.js';
import * as N from '../src/escher-niche-model.js';
import {depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';
import {buildEscherNicheOrnaments} from '../src/escher-niche-ornaments.js';

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
assert(ornaments.children.reduce((sum,m)=>sum+m.geometry.attributes.position.count/3,0)<200000,'All31 richly carved niches retain a bounded shared triangle budget');
const local=(n,p)=>{const x=p.x-n.origin[0],z=p.z-n.origin[2];return[x*n.along[0]+z*n.along[1],p.y-n.origin[1],x*n.out[0]+z*n.out[1]];};
const position=(mesh,i)=>new T.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i);
function localRay(mesh,n,u,y){const from=new T.Vector3(...N.nicheWorld(n,[u,y,.4]));return new T.Raycaster(from,new T.Vector3(-n.out[0],0,-n.out[1]),0,1.1).intersectObject(mesh,false);}
let facetProbes=0,depthProbes=0;
const tolerance=3e-5;
for(const l of layouts){
 const n=l.niche;assert.equal(l.rangeUnits,'vertices');
 for(const [mesh,range]of[[tileMesh,l.tileRange],[vaultMesh,l.vaultRange]]){
  assert.equal(range[0]%3,0);assert.equal(range[1]%3,0);assert(range[1]>0);assert(range[0]+range[1]<=mesh.geometry.attributes.position.count);
  for(let i=range[0];i<range[0]+range[1];i++){
   const [u,y,d]=local(n,position(mesh,i));assert([u,y,d].every(Number.isFinite));
   assert(d>=-n.depth-tolerance&&d<=-.042,'All actual triangles remain recessed');
   assert(Math.abs(u)<=n.w/2+tolerance&&y>=.011-tolerance&&y<=N.nicheArchHeight(n,u)+.002,'Actual triangles stay inside their own fixed niche');
   const normal=mesh.geometry.attributes.normal;assert(Number.isFinite(normal.getX(i)+normal.getY(i)+normal.getZ(i)));
  }
 }
 // These separate lower wall planes are measurable from the room; the centre
 // sits more than40cm behind the sides, instead of a flat tiled backboard.
 tileMesh.geometry.setDrawRange(...l.tileRange);
 for(const u of[-.40,-.20,0,.20,.40].map(t=>t*n.w)){
  const h=localRay(tileMesh,n,u,.46);assert(h.length);near(local(n,h[0].point)[2],N.nicheWallDepth(n,u),.004);depthProbes++;
 }
 for(const c of l.cells){
  vaultMesh.geometry.setDrawRange(...c.vaultRange);
  const actual=Array.from({length:c.vaultRange[1]},(_,i)=>local(n,position(vaultMesh,c.vaultRange[0]+i)));
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
   const h=localRay(vaultMesh,n,c.u+c.width*fraction,c.y+c.spring*.26);assert(h.length,'Every carved pocket is closed at both sides');
   const d=local(n,h[0].point)[2],f=Math.min(1,(.5-Math.abs(fraction))/.25),expected=-c.frontDepth-c.pocketDepth*f;
   near(d,expected,.003);measured.push(d);depthProbes++;
  }
  assert(measured[1]<measured[0]-.015&&measured[2]<measured[3]-.015,'Actual pocket rays recede symmetrically toward the centre');
 }
}
tileMesh.geometry.setDrawRange(0,Infinity);vaultMesh.geometry.setDrawRange(0,Infinity);
// The actual low/oblique screenshot pose exposed two formerly bare stone
// arch returns as beige wedges between courses. Trace those same rays against
// the complete structural descent, so a blue back alone cannot pass this.
const screenshotCamera=new T.PerspectiveCamera(66,572/659,.08,650);screenshotCamera.position.set(225.36,-37.32,101.84);screenshotCamera.rotation.set(.02,1.280,0,'YXZ');screenshotCamera.updateMatrixWorld(true);
for(const [px,py]of[[105,100],[300,132]]){
 const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(px/572*2-1,1-py/659*2),screenshotCamera);
 const hit=ray.intersectObject(surface.group,true)[0];assert(hit?.object.userData.nicheOrnament,'Low/oblique views see blue tiled arch returns instead of bare structural wedges');
 assert.equal(hit.object.material.map?.name,'Original cobalt ceramic · eight-point medallions and arabesques','The reveal uses the real shared blue ceramic field');
}
// Materials and textures are scoped to the two owned batches and clean up
// exactly once, even if the containing scene repeats a disposal call.
const isolated=buildEscherNicheOrnaments(T,ESCHER_SHAFT_NICHES),resources=new Set(),disposed=new Map();
isolated.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});
for(const r of resources){disposed.set(r,0);r.addEventListener('dispose',()=>disposed.set(r,disposed.get(r)+1));}
isolated.dispose();isolated.dispose();for(const count of disposed.values())assert.equal(count,1,'Owned resource disposed exactly once');assert.equal(isolated.group.children.length,0);
surface.dispose();
console.log(`PASS blue alcoves:320 original treads/nosings,9 landings,98 posts,2 rail batches,31 fixed origins,${cells} real pockets,${facetProbes} actual equal facets,${depthProbes} depth rays, exact walking authority and bounded cleanup.`);
