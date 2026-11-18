import assert from 'node:assert/strict';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {buildArtistCityEditions} from '../src/city-source-assets/home-tools/artist-city-editions.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/artist-catalog.js';
import {layoutArtistEditions,ARTIST_EDITIONS_DISTRICT as D,ARTIST_EDITIONS_PATH} from '../src/artist-edition-layout.js';
import {SIXFOLD_HOUSES} from '../src/sixfold-house-network-model.js';
import {streetTreeClear,URBAN_STREETS} from '../src/city-urban-plan-model.js';

const T={...Three,TextureLoader:class{load(){return new Three.Texture();}}},base=buildArtCity(T,ARTISTS.slice(0,10));
const records=Array.from({length:20},(_,i)=>({id:'synthetic-edition-'+i,artistId:ARTISTS[i%10].id,number:2+Math.floor(i/10),title:'A preserved study '+i,reason:'Synthetic test data only',exercise:'Compare one visible interval.',feature:'composition-wall',atmosphere:'quiet'})),saved=JSON.stringify(records),frame={x:118,y:.06,z:108,scale:1.35};
const built=buildArtistCityEditions(T,ARTISTS,base,records),sourceEntries=built.houses.map(h=>({...h.entry})),sourceCentres=built.houses.map(h=>[h.cx,h.cz]),originalGeometries=new Set();built.group.traverse(o=>{if(o.geometry)originalGeometries.add(o.geometry);});
const moved=layoutArtistEditions(built,frame),root=new T.Group();root.position.set(frame.x,frame.y,frame.z);root.scale.setScalar(frame.scale);root.add(moved.group);root.updateMatrixWorld(true);
assert.equal(JSON.stringify(records),saved,'No archived title, exercise, feature, ID or design coordinate is rewritten');assert.equal(moved.houses.length,20);assert.deepEqual(built.houses.map(h=>[h.cx,h.cz]),sourceCentres,'Original source layout and its spatial index remain intact');
for(const [i,h]of moved.houses.entries()){
 assert.equal(h.editionId,records[i].id);assert.equal(h.group,built.houses[i].group);assert.equal(h.feature,records[i].feature);assert.equal(h.exercise,records[i].exercise);
 assert(Math.abs(h.entry.x-sourceEntries[i].x-moved.placement.dx)<1e-9);assert(Math.abs(h.entry.z-sourceEntries[i].z-moved.placement.dz)<1e-9);
 assert.equal(moved.insideHouseAt(h.spawnInside.x,h.spawnInside.z)?.editionId,h.editionId);assert.deepEqual(moved.houseFor(h.artistId,h.editionId),h);assert.deepEqual(moved.entryFor(h.artistId,h.editionId),h.spawnInside);
 assert(moved.canStand(h.entry.x,h.entry.z));assert(moved.canStand(h.spawnInside.x,h.spawnInside.z));
 for(const a of h.approaches){assert(moved.canStand((a.anchor||a).x,(a.anchor||a).z),'A preserved edition activity keeps its translated reachable approach');assert(Number.isFinite(a.lookAt.x)&&Number.isFinite(a.lookAt.z));}
 const box=new T.Box3().setFromObject(h.group);for(const x of[box.min.x,box.max.x])for(const z of[box.min.z,box.max.z]){assert(Math.hypot(x-D.x,z-D.z)<D.radius,'Every actual house roof and source feature fits the reserved district');assert(SIXFOLD_HOUSES.every(t=>Math.hypot(x-t.x,z-t.z)>40),'No edition returns inside a sixfold tower');}
}
const worldBounds=new T.Box3().setFromObject(moved.group);assert(worldBounds.min.x>D.x-D.radius&&worldBounds.max.x<D.x+D.radius&&worldBounds.min.z>D.z-D.radius&&worldBounds.max.z<D.z+D.radius,'All source slabs, detached roof instances and furniture fit the twenty-slot district');
let sharedGeometry=0;moved.group.traverse(o=>{if(o.geometry){assert(originalGeometries.has(o.geometry));sharedGeometry++;}if(o.userData.artistEditionId&&o.userData.anchor){const local=o.userData.anchor;assert(local.x>moved.bounds.minX&&local.x<moved.bounds.maxX);assert(local.z>moved.bounds.minZ&&local.z<moved.bounds.maxZ);}});assert(sharedGeometry>20,'The live source geometry is moved without rebuilding or changing the saved homes');
for(let a=0;a<Math.PI*2;a+=.05)for(const r of[0,30,55])assert.equal(streetTreeClear(D.x+r*Math.cos(a),D.z+r*Math.sin(a)),false,'Every current and future slot keeps whole tree crowns outside its roof reserve');
assert(URBAN_STREETS.some(r=>r.id===ARTIST_EDITIONS_PATH.id),'The saved-home approach is real shared paving, not only a navigation marker');assert.deepEqual(ARTIST_EDITIONS_PATH.points.at(-1),[D.x,46]);
const empty=buildArtistCityEditions(T,ARTISTS,base,[]);assert.equal(layoutArtistEditions(empty,frame),empty);const legacy=buildArtistCityEditions(T,ARTISTS,base,records.slice(0,1));assert.equal(layoutArtistEditions(legacy,frame,{enabled:false}),legacy);assert.equal(legacy.group.position.x,0);
empty.dispose();legacy.dispose();moved.dispose();base.dispose();
console.log('PASS artist editions: all20 source houses, roofs, activities and collisions move to one safe block; original records/index/geometry remain intact; whole-crown reserve and actual shared entry paving agree');
