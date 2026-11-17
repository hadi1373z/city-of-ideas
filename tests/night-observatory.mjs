import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {NIGHT_OBSERVATORY as C,observatoryStairY,observatoryPoint,observatoryRoofY,observatorySurface,observatoryCanStand,walkObservatory} from '../src/night-observatory-model.js';
import {buildNightObservatory} from '../src/night-observatory-scene.js';
import {installNightObservatory} from '../src/night-observatory.js';
import {WORLD_CYLINDER as W} from '../src/world-cylinder-model.js';
const eye=1.8,near=(a,b,e=1e-5)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
near(observatoryStairY(0),12.13);near(observatoryStairY(Math.PI*2),22.13);near(observatoryRoofY(0),29);near(observatoryRoofY(21.5),20.55);near(observatoryRoofY(61),16.4);assert.equal(observatoryRoofY(62),null);
for(const r of[6.75,16,17.5]){
 const p={...observatoryPoint(0),x:r,y:C.baseY+eye,observatoryTheta:0,observatoryLayer:'stair'};if(r<14.4)continue;
 for(let t=.003;t<Math.PI*2+.08;t+=.003){const q=observatoryPoint(t);q.x=r*Math.cos(t);q.z=-r*Math.sin(t);walkObservatory(p,q.x-p.x,q.z-p.z,{eye});near(p.x,q.x);near(p.z,q.z);near(p.y,q.y+eye);}
}
const p={...observatoryPoint(0),y:C.baseY+eye,observatoryTheta:0,observatoryLayer:'stair'};
function follow(end){const start=p.observatoryTheta,direction=Math.sign(end-start);for(let t=start+direction*.003;direction>0?t<end:t>end;t+=direction*.003){const q=observatoryPoint(t);walkObservatory(p,q.x-p.x,q.z-p.z,{eye});near(p.x,q.x);near(p.z,q.z);near(p.y,q.y+eye);}const q=observatoryPoint(end);walkObservatory(p,q.x-p.x,q.z-p.z,{eye});near(p.x,q.x);near(p.z,q.z);near(p.y,q.y+eye);}
follow(Math.PI*2+.08);walkObservatory(p,6.7*Math.cos(.08)-p.x,-6.7*Math.sin(.08)-p.z,{eye});near(p.y,C.deckY+eye);walkObservatory(p,3-p.x,-.5-p.z,{eye});assert.equal(p.observatoryLayer,'deck');
walkObservatory(p,6.7*Math.cos(.08)-p.x,-6.7*Math.sin(.08)-p.z,{eye});const q=observatoryPoint(Math.PI*2+.08);walkObservatory(p,q.x-p.x,q.z-p.z,{eye});follow(0);walkObservatory(p,18-p.x,-p.z,{eye});assert.equal(p.observatoryLayer,'approach');near(p.y,C.baseY+eye);
assert.equal(observatorySurface(0,0,12.13),null);assert.equal(observatorySurface(16,0,.13),null);assert.equal(observatorySurface(3,0,17),null);assert.equal(observatoryCanStand(0,-2.5),false);assert.equal(observatoryCanStand(-4.8,3.5),false);assert.equal(observatoryCanStand(3,-.5),true);
assert.equal(observatorySurface(16,0,C.deckY,{lastTheta:0,layer:'stair'}),null,'No jump from the bottom endpoint to the coincident top landing');

const built=buildNightObservatory(T);built.group.updateMatrixWorld(true);let draws=0,lights=0;
built.group.traverse(o=>{if(o.isMesh){draws++;for(const a of Object.values(o.geometry.attributes))assert.ok(a.array.every(Number.isFinite));}if(o.isLight)lights++;});assert.equal(draws,18,'Professional instrument adds only five batched material draws');assert.equal(lights,1);assert.equal(built.lamps.visible,false);assert.ok(built.roof.material.transparent&&built.roof.material.opacity<.2&&!built.roof.material.depthWrite);
assert.equal(built.telescope.length,4.2);assert.equal(built.telescope.radius,.485);assert.equal(built.telescope.objectiveRadius,.44);assert.equal(built.telescope.pivotHeight,2.45);assert.equal(built.telescope.moving.length,4);assert.equal(C.station.radius,1.3);assert.equal(observatoryCanStand(1.4,-2.5),false);assert.equal(observatoryCanStand(1.6,-2.5),true);
const tubePoint=new T.Vector3(),opticalAxis=new T.Vector3();let minRoofClearance=Infinity,minHeadroom=Infinity;
for(const altitude of[0,10,20,30,45,60,70,75,80,85,90])for(let azimuth=0;azimuth<360;azimuth+=30){
 const a=altitude*Math.PI/180,h=azimuth*Math.PI/180,direction=new T.Vector3(Math.cos(a)*Math.sin(h),Math.sin(a),Math.cos(a)*Math.cos(h));built.pointTelescope(direction);built.group.updateMatrixWorld(true);opticalAxis.set(0,1,0).transformDirection(built.telescope.elevation.matrixWorld);near(opticalAxis.distanceTo(direction),0,1e-7);
 let worst=null,clearance=Infinity;
 for(const mesh of built.telescope.moving){const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++){
  assert.ok(positions.getY(i)>=-.401,'No moving tube/eyepiece projects behind the safe rear envelope');tubePoint.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);const c=observatoryRoofY(Math.hypot(tubePoint.x,tubePoint.z))-tubePoint.y;if(c<clearance){clearance=c;worst=tubePoint.clone();}if(altitude===0)minHeadroom=Math.min(minHeadroom,tubePoint.y-C.deckY);
 }}
 const roofHits=new T.Raycaster(new T.Vector3(worst.x,35,worst.z),new T.Vector3(0,-1,0),0,20).intersectObject(built.roof);assert.ok(roofHits.length);const actualClearance=roofHits[0].point.y-worst.y;minRoofClearance=Math.min(minRoofClearance,actualClearance);assert.ok(actualClearance>.4,`Actual reflector/dome clearance at ${altitude}°/${azimuth}°: ${actualClearance}`);
}
assert.ok(minHeadroom>1.9,'Horizontal tube and rear eyepiece stay above walking head height');assert.ok(minRoofClearance>.4,'All sampled guide altitudes and azimuths remain clear of actual dome mesh');built.pointTelescope({x:.2,y:.65,z:-.75});built.group.updateMatrixWorld(true);
const down=(x,y,z,parent=built.walking,far=1)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(0,-1,0),0,far).intersectObject(parent,true);
for(let i=0;i<C.steps;i++)for(const r of[14.47,16,17.53]){const t=(i+.5)/C.steps*Math.PI*2,q=observatoryPoint(t),hits=down(r*Math.cos(t),q.y+.7,-r*Math.sin(t));assert.ok(hits.length,'Real tread '+i);near(hits[0].point.y,q.y,.0001);assert.ok(observatoryRoofY(r)-q.y>3.2,'Stair has comfortable eye/head clearance');}
// The incoming final tread is not buried under the top bridge or landing.
for(const t of[Math.PI*2-.12,Math.PI*2-.04]){const q=observatoryPoint(t);for(const r of[14.47,16,17.53]){const hits=down(r*Math.cos(t),q.y+.7,-r*Math.sin(t));near(hits[0].point.y,q.y,.0001);}}
for(const[x,z]of[[0,0],[3,-.5],[6.7,0],[10,0],[13.9,-1.2],[16*Math.cos(.08),-16*Math.sin(.08)]]){const hits=down(x,C.deckY+.7,z);assert.ok(hits.length);near(hits[0].point.y,C.deckY,.0001);}
for(const r of[0,7,10,14])assert.equal(down(r,12.8,0,built.walking,2).length,0,'Old paper well below the new observatory is not capped');
assert.ok(built.targets.some(t=>t.userData.nightObservatory==='telescope'));let disposed=0;built.roof.geometry.addEventListener('dispose',()=>disposed++);built.dispose();built.dispose();assert.equal(disposed,1);

class Element{constructor(tag){this.tagName=tag;this.children=[];this.hidden=false;this.dataset={};this.attributes={};this.open=false;this._text='';}set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}setAttribute(k,v){this.attributes[k]=String(v);}remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}querySelector(selector){if(selector.includes('dialog[open]')&&this.dialogOpen)return{};return null;}}
const body=new Element('body');globalThis.document={body,hidden:false,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);
let privateTouches=0;globalThis.localStorage=new Proxy({},{get(){privateTouches++;throw Error('No private store access');}});
const facultyGroup=new T.Group(),oldRoof=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial());oldRoof.name='Annular timber roof · open central oculus';facultyGroup.add(oldRoof);let releases=0,paperStops=0;
const M={eye,mode:'city',player:{x:W.lowerOrigin.x+16,z:W.lowerOrigin.z,y:C.baseY+eye,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},arrive(p){Object.assign(this.player,p,{y:p.y+eye});this.mode='city';},city:{targets:[],update(){},region:()=>({id:'old'})},startExtra:()=>false,worldCylinder:{lower:{group:new T.Group()},faculty:{group:facultyGroup},releaseGalleryRoute(){releases++;}},paperGallery:{stop(){paperStops++;}}};
const originals={arrive:M.arrive,update:M.city.update,region:M.city.region,start:M.startExtra},api=installNightObservatory(M,T);assert.equal(oldRoof.visible,false);assert.ok(api.step(.1,{forward:1}));assert.ok(api.active);assert.equal(releases,1);assert.equal(paperStops,1);assert.ok(M.player.z<W.lowerOrigin.z);
const pose={...M.player};body.dialogOpen=true;api.step(.1,{forward:1});assert.deepEqual(M.player,pose,'Reading or a sky dialog pauses walking');body.dialogOpen=false;
api.visit('deck');assert.ok(api.canStudy&&api.nearTelescope);near(api.station.y,22.13);assert.ok(api.lookAtDirection({x:0,y:.5,z:-1}));near(M.player.yaw,0);assert.ok(M.player.pitch>0);assert.equal(api.lookAtDirection({x:0,y:-1,z:0}),false,'No telescope aiming below the horizon');
const guidance=body.children.find(n=>n.id==='night-observatory-route'),close=guidance.children[0].children[0];assert.equal(close.attributes['aria-label'],'Close observatory guidance');close.onclick();M.city.update(.1,1);assert.ok(guidance.hidden,'A dismissed notification stays closed');
M.arrive({x:100,z:100,y:.13});assert.equal(api.active,false);assert.equal(api.canStudy,false);assert.equal(api.lookAtDirection({x:0,y:1,z:0}),false);
M.arrive({x:W.lowerOrigin.x+16,z:W.lowerOrigin.z,y:C.baseY,yaw:Math.PI});assert.equal(api.step(.1,{forward:1}),false,'Shared +Z descent returns to paper stairs');assert.equal(M.player.paperTheta,Math.PI*2);
api.dispose();api.dispose();assert.equal(oldRoof.visible,true);assert.equal(M.city.targets.length,0);assert.equal(M.arrive,originals.arrive);assert.equal(M.city.update,originals.update);assert.equal(M.city.region,originals.region);assert.equal(M.startExtra,originals.start);assert.equal(privateTouches,0);assert.equal(M.nightObservatory,undefined);
console.log(`PASS central observatory: transparent dome,80 real treads and reversible route; professional4.2m fork reflector with ${minHeadroom.toFixed(2)}m minimum horizontal headroom and ${minRoofClearance.toFixed(2)}m actual dome clearance; safe circulation,study gates,pause and cleanup in18 draws and1 scoped light.`);
