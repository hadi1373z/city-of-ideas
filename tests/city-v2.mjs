import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
const T={};vm.runInNewContext(fs.readFileSync(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{warn(){}}});T.TextureLoader.prototype.load=()=>new T.Texture();
const w={CITY_CONFIG:{mountainEnabled:false},createCityLandscape:()=>({canStand:()=>true,groundHeight:()=>null})};w.window=w;w.matchMedia=()=>({matches:true});w.createCityRoad=()=>new T.Group();for(const f of['mountain-path.js','mountain-art.js','city.js'])vm.runInNewContext(fs.readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),w);
const scene=new T.Scene(),mesh=(g,m,x=0,y=0,z=0,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;},box=(a,b,c,m,x,y,z,p)=>mesh(new T.BoxGeometry(a,b,c),m,x,y,z,p),textSign=(a,b,c,d,p)=>{const o=new T.Group();p.add(o);return o;};
const city=w.createGalleryCity(T,{scene,mesh,box,cylinder(){},torus(){},textSign,materials:{}});assert.equal(city.mountainEnabled,false);assert(city.canStand(125,0));assert(city.canStand(150,0));assert(!city.buildingTargets.some(o=>o.userData.cityDestination==='spiral'));assert(!city.targets.some(o=>o.userData.cityChapter!==undefined));assert(!scene.getObjectByName('Continuous four-turn mountain path'));city.update({x:125,z:0},1,'city');
console.log('PASS version 2: no mountain assembly, chapter targets or building picks; former mountain footprint is walkable.');

// Exercise the actual classic source factory: live sixfold mode must not
// create a second legacy paving network for the coast installer to resurface.
vm.runInNewContext(fs.readFileSync(new URL('../src/city-road-surface.js',import.meta.url),'utf8'),w);
const roadMeshes=[];const realRoad=w.createCityRoad;w.createCityRoad=(...args)=>{const r=realRoad(...args);if(r)roadMeshes.push(r);return r;};
w.CITY_CONFIG.sixfoldHouses=true;const redesigned=w.createGalleryCity(T,{scene:new T.Scene(),mesh,box,cylinder(){},torus(){},textSign,materials:{}});assert.equal(roadMeshes.length,0,'The real source factory must not build any retired central box/diagonal road');
w.CITY_CONFIG.sixfoldHouses=false;w.createGalleryCity(T,{scene:new T.Scene(),mesh,box,cylinder(){},torus(){},textSign,materials:{}});assert.equal(roadMeshes.length,4,'The archived source layout remains available when explicitly selected');assert(roadMeshes.every(m=>m.geometry.attributes.position.count>0&&m.userData.groundRoute),'The regression observes actual paved meshes, not metadata-only stubs');
console.log('PASS actual source road ownership: no retired paving in sixfold mode, four complete source roads retained for the archived layout');
