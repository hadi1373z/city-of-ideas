import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {registerHooks} from 'node:module';
import * as ORIGINAL_THREE from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {starter} from '../src/city-source-assets/home-tools/model.js';
import {createResidence} from '../src/city-source-assets/home-tools/residence-data.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/art-city-data.js';
import {buildHome,buildSocratesVisitor,HOME_EDITIONS,HOME_EDITION_PROVENANCE,disposeHomeEditionSurfaceCaches} from '../src/home-editions-scene.js';

const originalSceneURL=new URL('../src/city-source-assets/home-tools/scene-original.js',import.meta.url).href;
registerHooks({resolve(specifier,context,next){return specifier==='three'?{url:new URL('../src/city-source-assets/home-tools/vendor/three.module.js',import.meta.url).href,shortCircuit:true}:next(specifier,context);},load(url,context,next){const result=next(url,context);if(url===originalSceneURL||url===originalSceneURL+'?principal-r160'){let source=String(result.source);if(url.endsWith('?principal-r160'))source=source.replace(/^import \* as THREE from '\.\/vendor\/three\.module\.js';\r?$/m,'const THREE=globalThis.CITY_TEST_THREE_R160;');return{...result,source:source+'\nexport {socratesVisitor as originalSocratesVisitor};\n'};}return result;}});
const [{buildHouse:legacy},{buildHouse:inhabited},{buildHouse:atelier,originalSocratesVisitor},{buildHouse:residence}]=await Promise.all(['legacy-scene.js','inhabited-scene-v1.js','scene-original.js','residence-scene-v1.js'].map(name=>import(new URL('../src/city-source-assets/home-tools/'+name,import.meta.url))));

class StubCanvas {
 constructor(){this.width=0;this.height=0;this.context=new Proxy({canvas:this,measureText:text=>({width:String(text).length*16})},{get:(target,key)=>key in target?target[key]:()=>{},set:(target,key,value)=>(target[key]=value,true)});}
 getContext(kind){assert.equal(kind,'2d');return this.context;}
}
class StubImage {addEventListener(){}removeEventListener(){}set src(value){this.url=value;}}
globalThis.document={createElement:tag=>{assert.equal(tag,'canvas');return new StubCanvas();},createElementNS:()=>new StubImage()};
const THREE={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:THREE,module:{exports:THREE},console,document:globalThis.document},{filename:'main-three-r160.js'});assert.equal(THREE.REVISION,'160');
const originals={legacy,inhabited,atelier,residence},hash=value=>createHash('sha256').update(value).digest('hex');
function geometrySignature(group){group.updateMatrixWorld(true);const signature=[];group.traverse(node=>{if(!node.isMesh&&!node.isSprite&&!node.isLight)return;signature.push([node.type,node.matrixWorld.elements,node.userData,node.isLight?[node.color.getHex(),node.intensity,node.distance,node.decay]:null]);if(node.geometry)for(const [name,attribute]of Object.entries(node.geometry.attributes))signature.push([name,Array.from(attribute.array)]);for(const mat of node.material?(Array.isArray(node.material)?node.material:[node.material]):[])signature.push([mat.type,mat.color?.getHex(),mat.emissive?.getHex(),mat.emissiveIntensity,mat.opacity,mat.side,!!mat.map,mat.map?.image?.width,mat.map?.image?.height]);});return hash(JSON.stringify(signature));}
function privateHouse(edition){const house=edition==='residence'?createResidence(starter(),{floors:3}):starter();house.privateNote='یادداشت شخصی من — preserve exactly';house.resident={memory:{values:['My unchanged private aim']},roomFeatures:[{id:'reflection-lamp',roomId:'math',type:'reflection_lamp'},{id:'question-board',roomId:'questions',type:'question_board'}]};house.ideas=['book','sphere','ring','crystal'].map((cue,index)=>({id:'private-idea-'+index,roomId:'learning',title:'Owner idea '+index,text:'Never translate my private text',cue,action:'reflect'}));return house;}
function releaseSource(group){const resources=new Set();group.traverse(node=>{if(node.geometry)resources.add(node.geometry);for(const mat of node.material?(Array.isArray(node.material)?node.material:[node.material]):[]){resources.add(mat);for(const value of Object.values(mat))if(value?.isTexture&&!value.userData?.retainedSurface)resources.add(value);}});for(const value of resources)value.dispose();}
for(const [file,provenance]of Object.entries(HOME_EDITION_PROVENANCE))assert.equal(hash(await readFile(new URL('../src/city-source-assets/home-tools/'+file,import.meta.url))),provenance.sha256,'Imported source matches provenance: '+file);
let comparisons=0,meshes=0;
for(const edition of HOME_EDITIONS){
 const house=privateHouse(edition),before=JSON.stringify(house),original=originals[edition](house,true,true),copy=buildHome(ORIGINAL_THREE,house,{edition,homeId:'test-'+edition,owner:null,source:{ARTISTS},openDoor:false});await copy.ready;
 assert.equal(geometrySignature(copy.group),geometrySignature(original.group),'Exact original '+edition+' geometry, metadata, lights, and material configuration');comparisons++;copy.dispose();releaseSource(original.group);
 const forbiddenOwner={buildHouse(){throw Error('Earlier homes cannot call residence renderer');}},city=buildHome(THREE,house,{edition,homeId:'home-'+edition,owner:edition==='residence'?null:forbiddenOwner,source:{ARTISTS}});await city.ready;
 assert.equal(JSON.stringify(house),before,'Building and querying preserve owner data');assert.ok(city.entry&&city.entryFor());assert.equal(city.entryFor('missing'),null);assert.equal(city.canStand(NaN,0),false);assert.equal(city.canStand(0,Infinity),false);assert.equal(city.canStand(0,0,-1),false);assert.equal(city.canStand(city.bounds.maxX+3,city.bounds.maxZ+3,0),true,'Ground has no isolated yard-bound fence');
 city.group.traverse(node=>{if(node.isMesh){meshes++;assert.ok(node instanceof THREE.Mesh,'Original geometry uses injected principal THREE');assert.ok(node.position.toArray().every(Number.isFinite));}});
 assert.ok(city.objects.some(node=>node.userData.ideaId),'Actual private idea object metadata survives');
 if(city.frontDoor){city.setDoor(false);assert.equal(city.canStand(city.frontDoor.x,city.frontDoor.z,0),false,'Closed original door blocks walking');city.setDoor(true);assert.equal(city.canStand(city.frontDoor.x,city.frontDoor.z,0),true,'Original doorway can be walked');}
 const floorCount=edition==='residence'?3:1;
 for(let floor=0;floor<floorCount;floor++){assert.equal(city.setFloor(floor),true);const point=city.entryFor(null,floor);assert.ok(point,'Source floor has a safe room arrival');assert.ok(city.canStand(point.x,point.z,floor));assert.ok(city.roomAt(point.x,point.z,floor));assert.equal(point.y,floor*3.4);assert.ok(city.collidersAt(floor).length);if(floor>0)assert.equal(city.canStand(city.bounds.maxX+3,city.bounds.maxZ+3,floor),false,'Upper walking stays on a real floor slab');const room=city.navigationHouse.rooms[0];assert.equal(city.entryFor(room.id,floor)?.roomId,room.id);}
 assert.equal(city.setFloor(floorCount),false);assert.equal(JSON.stringify(house),before);
 const geometries=new Set(),materials=new Set();city.group.traverse(node=>{if(node.geometry)geometries.add(node.geometry);for(const material of node.material?(Array.isArray(node.material)?node.material:[node.material]):[])materials.add(material);});let events=0;for(const item of [...geometries,...materials])item.addEventListener('dispose',()=>events++);city.dispose();assert.equal(events,geometries.size+materials.size);assert.equal(city.group.children.length,0);city.dispose();assert.equal(events,geometries.size+materials.size,'Release is idempotent');assert.equal(city.canStand(0,0),false,'Disposed house cannot receive walking queries');
}
assert.throws(()=>buildHome(THREE,starter(),{edition:'invented'}),/Unknown/);

// Read-only ESM loader exposes the existing private function in the actual
// original module. The reference is not reconstructed from the adapter body.
const originalActor=originalSocratesVisitor(),sourceActor=buildSocratesVisitor(ORIGINAL_THREE),cityActor=buildSocratesVisitor(THREE);
assert.equal(geometrySignature(sourceActor.group),geometrySignature(originalActor.group),'Exact original full Socrates avatar against original module function');
globalThis.CITY_TEST_THREE_R160=THREE;const {originalSocratesVisitor:actualR160SocratesVisitor}=await import(originalSceneURL+'?principal-r160'),referenceR160Actor=actualR160SocratesVisitor();delete globalThis.CITY_TEST_THREE_R160;
assert.equal(geometrySignature(cityActor.group),geometrySignature(referenceR160Actor.group),'Principal r160 preserves original source actor geometry/materials/metadata with the same constructors');
let actorMeshes=0;cityActor.group.traverse(node=>{assert.equal(node.userData.resident,true,'Every original actor part resolves resident interaction');if(node.isMesh){actorMeshes++;assert.ok(node instanceof THREE.Mesh);}});
assert.equal(cityActor.limbs.length,4);assert.ok(cityActor.limbs.every(limb=>limb.part.isGroup&&[-1,1].includes(limb.sign)));assert.equal(cityActor.head.position.y,1.49);assert.ok(actorMeshes>=20,'The original face, beard, body and sandals remain real geometry');const actorBounds=new THREE.Box3().setFromObject(cityActor.group);assert.ok(actorBounds.max.y>1.65&&actorBounds.min.y<.2);for(const actor of [originalActor,sourceActor,cityActor,referenceR160Actor])releaseSource(actor.group);
assert.throws(()=>buildSocratesVisitor(null),/Three.js/);

// Optional final integration check uses the actual prepared owner script, not a
// replacement residence implementation. Pass its filesystem path as argv[2].
let ownerVerified=false;
if(process.argv[2]){
 const context={THREE,document:globalThis.document,console,URL,Promise,fetch:()=>{throw Error('No online or private assets in renderer unit tests');}};context.window=context;
 vm.createContext(context);vm.runInContext(await readFile(new URL('../src/city-sources.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(pathToFileURL(process.argv[2]),'utf8'),context);
 const owner=context.CITY_HOME_SCENE;assert.equal(typeof owner?.buildHouse,'function');const delegate=owner.buildHouse;let calls=0;const recorded={...owner,buildHouse(...args){calls++;return delegate(...args);}};
 for(const edition of HOME_EDITIONS){const house=privateHouse(edition),city=buildHome(THREE,house,{edition,owner:recorded,source:context.CITY_SOURCES});await city.ready;assert.equal(city.designErrors.length,0);assert.equal(calls,edition==='residence'?1:0,'Only residence calls owner residence builder');assert.ok(city.canStand(city.entryFor().x,city.entryFor().z,0));if(edition==='atelier')assert.ok(city.designLayer?.group?.parent===city.group&&typeof city.designLayer.load==='function'&&typeof city.designLayer.tour==='function','Original atelier design layer, load and tour belong to the saved original home');city.dispose();}
 owner.disposeSurfaceCache();ownerVerified=true;
}
disposeHomeEditionSurfaceCaches(THREE);disposeHomeEditionSurfaceCaches(ORIGINAL_THREE);
console.log(JSON.stringify({pass:true,originalGeometryComparisons:comparisons,editions:HOME_EDITIONS,r160Meshes:meshes,actorSourceComparisons:2,actorMeshes,stubCanvas:true,ownerVerified,checks:'Exact source geometry; full original Socrates actor; renderer identity; private state; real entrances; original walls/obstacles/doors; floor-safe arrivals; no ground fence; idempotent owned resource disposal'}));
