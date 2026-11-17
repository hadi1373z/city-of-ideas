import {readFileSync} from 'node:fs';import vm from 'node:vm';
import assert from 'node:assert/strict';import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';import {HOUSE as H,HOUSE_LEVELS,stairPoint,stairY,houseRailLayout,houseSurface,walkHouse,houseBlocked,cutHouseWell} from '../src/transformation-house-model.js';import {buildTransformationHouse} from '../src/transformation-house-scene.js';
const near=(a,b,e=1e-5)=>assert(Math.abs(a-b)<e,a+' != '+b);const eye=1.8;let p={...stairPoint(0),y:16+eye,houseTheta:0};
for(let t=.005;t<14*Math.PI;t+=.005){const q=stairPoint(t);walkHouse(p,q.x-p.x,q.z-p.z,{eye});near(p.x,q.x);near(p.z,q.z);near(p.y,q.y+eye);}const bottom=stairPoint(14*Math.PI);walkHouse(p,bottom.x-p.x,bottom.z-p.z,{eye});near(p.y,-40+eye);walkHouse(p,3.8,0,{eye});for(let a=.005;a<=Math.PI;a+=.005){const x=125+12*Math.cos(a),z=12*Math.sin(a);walkHouse(p,x-p.x,z-p.z,{eye});}walkHouse(p,113-p.x,-p.z,{eye});walkHouse(p,71-p.x,0,{eye});near(p.x,71);assert(houseSurface(p.x,p.z,-40));walkHouse(p,113-p.x,0,{eye});for(let a=Math.PI-.005;a>0;a-=.005){const x=125+12*Math.cos(a),z=12*Math.sin(a);walkHouse(p,x-p.x,z-p.z,{eye});}walkHouse(p,133.2-p.x,-p.z,{eye});for(let t=14*Math.PI-.005;t>0;t-=.005){const q=stairPoint(t);walkHouse(p,q.x-p.x,q.z-p.z,{eye});near(p.x,q.x);near(p.z,q.z);near(p.y,q.y+eye);}near(p.y,16+eye);assert(houseBlocked(125,14,-16));assert(!houseBlocked(125,14,-16,{shelfOpen:true}));
const ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})});const built=buildTransformationHouse(T,{canvas:()=>({getContext:()=>ctx})});built.group.updateMatrixWorld(true);let draws=0;built.group.traverse(o=>{if(o.geometry){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}});assert(draws<180,'Static joinery is batched');for(const l of HOUSE_LEVELS){const hits=new T.Raycaster(new T.Vector3(139,l.y+1,0),new T.Vector3(0,-1,0),0,1.1).intersectObject(built.walking,true);assert(hits.length,'floor '+l.y);near(hits[0].point.y,l.y,.001);}for(let i=4;i<448;i+=9){const q=stairPoint((i+.5)/448*14*Math.PI),hits=new T.Raycaster(new T.Vector3(q.x,q.y+1,q.z),new T.Vector3(0,-1,0),0,1.1).intersectObject(built.walking,true);assert(hits.length,'tread '+i);near(hits[0].point.y,q.y,.001);}
const {tiling}=built;assert.equal(tiling.floors.length,8);assert.equal(tiling.ceilings.length,8);assert.equal(tiling.borders.length,8);
const tiledLevels=new Set(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
for(const [index,l]of HOUSE_LEVELS.entries()){
 const floor=tiling.floors[index],ceiling=tiling.ceilings[index],fp=floor.geometry.attributes.position,cp=ceiling.geometry.attributes.position;tiledLevels.add(floor.userData.houseTiling.level);assert.equal(floor.userData.houseTiling.level,l.y);assert.equal(ceiling.userData.houseTiling.level,l.y);assert.equal(fp.count,cp.count,'The ceiling and floor share one rhomb layout');assert(fp.count>3000,'The full annulus has a real mosaic rather than one decorative rug');
 for(const [mesh,up]of[[floor,true],[ceiling,false]]){
  const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;
  for(let i=0;i<p.count;i+=3){a.fromBufferAttribute(p,i);b.fromBufferAttribute(p,i+1).sub(a);c.fromBufferAttribute(p,i+2).sub(a);const signedY=b.cross(c).y;assert(up?signedY>0:signedY<0,'Every tile triangle faces the room on level '+l.y);}
  for(let i=0;i<p.count;i++){assert(up?n.getY(i)>0:n.getY(i)<0,'Lighting normals face the room');near(Math.hypot(n.getX(i),n.getY(i),n.getZ(i)),1,1e-6);assert(Math.hypot(p.getX(i)-125,p.getZ(i))>=10.69999,'No mosaic covers the stair well');}
 }
 for(let i=0;i<fp.count;i++){const local=i%3,opposite=i-local+(local===0?0:3-local);near(fp.getX(i),cp.getX(opposite),1e-7);near(fp.getZ(i),cp.getZ(opposite),1e-7);near(fp.getY(i),l.y+.022,2e-6);assert(cp.getY(i)>=l.y+7.29999&&cp.getY(i)<=l.y+7.65001,'The shallow ceiling stays below the next structural floor');}
 // Sample inside actual inset cells, not the grout. Front-side rays prove that
 // each mosaic is visible from the inhabited room in the intended direction.
 const cells=tiling.patch.cells.filter(cell=>cell.insetPolygons.length);for(let i=0;i<cells.length;i+=Math.ceil(cells.length/12)){
  const points=cells[i].insetPolygons[0],x=125+points.reduce((n,p)=>n+p[0],0)/points.length,z=points.reduce((n,p)=>n+p[1],0)/points.length;
  assert(new T.Raycaster(new T.Vector3(x,l.y+1,z),new T.Vector3(0,-1,0),0,1.1).intersectObject(floor).length,'Floor visible from above');
  assert(new T.Raycaster(new T.Vector3(x,l.y+1,z),new T.Vector3(0,1,0),0,7).intersectObject(ceiling).length,'Vault visible from below');
 }
 for(const radius of[0,6.6,9.8,10.2])for(let j=0;j<24;j++){
  const angle=j*Math.PI/12,x=125+radius*Math.cos(angle),z=radius*Math.sin(angle);
  assert.equal(new T.Raycaster(new T.Vector3(x,l.y+1,z),new T.Vector3(0,-1,0),0,1.1).intersectObjects([floor,tiling.borders[index]]).length,0,'Floor framing leaves the real shaft open');
  assert.equal(new T.Raycaster(new T.Vector3(x,l.y+1,z),new T.Vector3(0,1,0),0,7).intersectObject(ceiling).length,0,'Ceiling keeps the real light well open');
 }
}
assert.equal(tiledLevels.size,8);
// Every room joins the same flat landing across the full safe walking width,
// in both radial directions. Actual geometry must support every sampled pose.
for(const l of HOUSE_LEVELS)for(const z of[-1.26,-.6,0,.6,1.26]){
 const theta=(16-l.y)/8*2*Math.PI+Math.atan2(z,8.2),visitor={x:133.2,z,y:l.y+eye,houseTheta:theta};
 for(const direction of[1,-1])for(let j=0;j<=76;j++){const x=direction>0?133.2+j*.05:137-j*.05;walkHouse(visitor,x-visitor.x,0,{eye});near(visitor.x,x,1e-6);near(visitor.y,l.y+eye,1e-7);if(j%8===0||x>134.6&&x<135.5){const hits=new T.Raycaster(new T.Vector3(visitor.x,l.y+.65,z),new T.Vector3(0,-1,0),0,1).intersectObject(built.walking,true);assert(hits.length,'Landing support '+l.y+'/'+z+'/'+x);near(hits[0].point.y,l.y,.001);}}
}
for(let i=0;i<448;i++){const a=stairY(i*H.stepAngle),b=stairY((i+1)*H.stepAngle);assert(a>=b-1e-9);assert(a-b<=8/61+1e-8,'No double-height rise at a landing');}
// The former sharp, disconnected rail ends now form closed return paths.
const rail=houseRailLayout(),ends=rail.paths.flatMap((p,i)=>[{i,p:p.points[0]},{i,p:p.points.at(-1)}]);
for(const endpoint of ends)assert(ends.some(other=>other.i!==endpoint.i&&Math.hypot(...endpoint.p.map((v,i)=>v-other.p[i]))<1e-7),'Every guard end connects to another rounded path');
for(const path of rail.paths.filter(p=>p.kind==='rounded landing return'))for(const point of path.points){const floorY=point[1]-1.1,hits=new T.Raycaster(new T.Vector3(point[0]+125,floorY+.65,point[2]),new T.Vector3(0,-1,0),0,1).intersectObject(built.walking,true);assert(hits.length,'A landing guard has real floor below it');near(hits[0].point.y,floorY,.001);assert(Math.abs(point[2])>=1.599,'Rails remain outside the walking corridor');}
for(let i=4;i<448;i+=9){const q=stairPoint((i+.5)*H.stepAngle),hits=new T.Raycaster(new T.Vector3(q.x,q.y-.7,q.z),new T.Vector3(0,1,0),0,1).intersectObject(built.walking,true);assert(hits.length,'Solid tread underside '+i);near(hits[0].point.y,q.y-.22,.001);}
assert.equal(tiling.landings.length,1);assert.equal(tiling.crowns.length,1);const crown=tiling.crowns[0];assert(crown.userData.houseCrown);assert(crown.geometry.attributes.normal.array.every((v,i)=>i%3!==1||v<0),'Crown faces down into the house');
for(const cell of tiling.landingPatch.crown.filter((_,i)=>i%3===0)){const points=cell.polygon,x=125+points.reduce((n,p)=>n+p[0],0)/points.length,z=points.reduce((n,p)=>n+p[1],0)/points.length,hit=new T.Raycaster(new T.Vector3(x,18,z),new T.Vector3(0,1,0),0,7).intersectObject(crown);assert(hit.length,'A real tiled ceiling closes the former star disk');assert(hit[0].point.y>=23.29&&hit[0].point.y<24);}
let fakeHouseStars=0;built.group.traverse(o=>{if(o.isInstancedMesh&&o.geometry.type==='SphereGeometry'&&o.count===40)fakeHouseStars++;});assert.equal(fakeHouseStars,0,'The house has a tiled crown rather than decorative fake sky stars');
// The gallery's153m plinth reaches under this house. Use its actual source
// helper AND creation statement, followed by the real entrance quarter-turn:
// testing only the house/lawn misses an opaque disk atY-.25 across the well.
const gallerySource=readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),annulusSource=gallerySource.slice(gallerySource.indexOf('function annulus('),gallerySource.indexOf('\nfunction galleryRing(')),plinthSource=gallerySource.match(/const galleryPlinth=annulus[^\n]+/)[0],R={};
vm.runInNewContext(readFileSync(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:R,module:{exports:R},console:{warn(){}}});assert.equal(R.REVISION,'160');
const completeScene=new R.Scene(),holeConfig={x:H.x,z:H.z,radius:H.well},scope={THREE:R,scene:completeScene,inner:28,outer:58,mainBuildingTargets:[],materials:{dark:new R.MeshLambertMaterial({color:0x303939})},window:{CITY_CONFIG:{houseWell:holeConfig}},mesh(geometry,material,x=0,y=0,z=0,parent=completeScene){const m=new R.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;}};
vm.runInNewContext(annulusSource+'\n'+plinthSource+'\nresult=galleryPlinth;',scope);const actualPlinth=scope.result;actualPlinth.applyMatrix4(new R.Matrix4().makeRotationY(Math.PI/2));completeScene.add(built.group);completeScene.updateMatrixWorld(true);
const plinthHits=(x,z)=>new R.Raycaster(new R.Vector3(x,1.8,z),new R.Vector3(0,-1,0),0,3).intersectObject(actualPlinth);
for(const radius of[0,4,8,9.9,10.25])for(let i=0;i<24;i++){const angle=(i+.17)*Math.PI/12;assert.equal(plinthHits(H.x+radius*Math.cos(angle),radius*Math.sin(angle)).length,0,'The actual gallery plinth cannot cap any part of the neighbouring house shaft');}
for(const[x,z]of[[110,0],[140,0],[125,12],[0,-125],[0,125],[-125,0]]){const hits=plinthHits(x,z);assert(hits.length,'Unrelated plinth remains solid; the house hole must not be rotated to another city district');near(hits[0].point.y,-.25,.0001);}
assert.equal(plinthHits(0,0).length,0,'The original Babel aperture is unchanged');
for(let angle=.2;angle<2*Math.PI-.3;angle+=.23){const q=stairPoint(4*Math.PI+angle),hits=new R.Raycaster(new R.Vector3(q.x,.08,q.z),new R.Vector3(0,-1,0),0,10).intersectObjects([actualPlinth,built.walking],true);assert(hits.length);assert.notEqual(hits[0].object,actualPlinth,'The next real descending tread is visible through every side of the ground-floor well');near(hits[0].point.y,q.y,.0001);}
const basinRay=new R.Raycaster(new R.Vector3(H.x,1.8,4),new R.Vector3(0,-1,0),0,45).intersectObject(completeScene,true);assert.equal(basinRay[0].object.name,'Closed mosaic basin at the bottom of the house well');near(basinRay[0].point.y,-40.4,.0001);
const plane=new T.PlaneGeometry(50,50,8,8).rotateX(-Math.PI/2).translate(125,0,0),cut=cutHouseWell(T,plane);cut.computeBoundingSphere();const surface=new T.Mesh(cut,new T.MeshBasicMaterial({side:T.DoubleSide}));surface.updateMatrixWorld();assert.equal(new T.Raycaster(new T.Vector3(125,2,0),new T.Vector3(0,-1,0)).intersectObject(surface).length,0);assert(new T.Raycaster(new T.Vector3(140,2,0),new T.Vector3(0,-1,0)).intersectObject(surface).length);built.dispose();console.log('PASS transformation house: all 448 treads, eight real floors and matched front-facing Penrose vaults, clear shaft, full descent to passage, secret-room collision, finite batched architecture and genuine interpolated ground aperture.');
