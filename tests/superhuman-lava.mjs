import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
const source=fs.readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),start=source.indexOf('function buildVolcano(){'),end=source.indexOf('function buildLantern(){',start);
const canvas=()=>({width:0,height:0,getContext:()=>new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]??(()=>{})})});
function build(enabled){
 const scene=new T.Scene(),mesh=(g,m,x=0,y=0,z=0,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;};
 const c={THREE:T,scene,SUPERHUMAN_ENABLED:enabled,reducedMotion:false,volcano:null,figure:null,lavaMaterial:null,emberPoints:null,smokeSprites:[],centralMeshes:[],document:{createElement:canvas},mesh,
  cylinder:(r1,r2,h,m,x,y,z,p)=>mesh(new T.CylinderGeometry(r1,r2,h,12),m,x,y,z,p),torus:(r,t,m,y,p)=>{const a=mesh(new T.TorusGeometry(r,t,8,32),m,0,y,0,p);a.rotation.x=-Math.PI/2;return a;},polar:(r,a,y)=>new T.Vector3(r*Math.cos(a),y,r*Math.sin(a))};
 vm.createContext(c);vm.runInContext(source.slice(start,end)+'\nbuildVolcano();',c);return c;
}
const off=build(false);assert(off.figure.children.length>15,'The complete source sculpture remains available');assert.equal(off.figure.visible,false);assert.equal(off.emberPoints.visible,false);assert.equal(off.volcano.getObjectByName('figure-light').visible,false);assert.equal(off.centralMeshes.length,0);
const pose=off.figure.position.clone(),particles=off.emberPoints.geometry.attributes.position.array.slice();off.updateVolcano(12);assert.deepEqual(off.figure.position.toArray(),pose.toArray());assert.deepEqual(off.emberPoints.geometry.attributes.position.array,particles);assert.equal(off.lavaMaterial.map,off.lavaMaterial.emissiveMap);assert(Math.abs(off.lavaMaterial.map.offset.y+.3)<1e-12);assert(off.lavaMaterial.color.r>off.lavaMaterial.color.b*4);assert(off.lavaMaterial.emissive.r>off.lavaMaterial.emissive.g&&off.lavaMaterial.emissive.g>off.lavaMaterial.emissive.b);assert(off.lavaMaterial.roughness>.7&&off.lavaMaterial.emissiveIntensity<1.5);
const on=build(true);assert(on.figure.visible&&on.emberPoints.visible&&on.centralMeshes.length>15);on.updateVolcano(12);assert(on.figure.position.y>3,'The preserved figure and animation can be enabled again');
const w={CITY_CONFIG:{superhumanEnabled:false}};vm.runInNewContext(fs.readFileSync(new URL('../src/summit-story.js',import.meta.url),'utf8'),{window:w});
const figure=new T.Group(),light=new T.PointLight();const story=w.createSummitStory(T,{figure,figureLight:light});assert.equal(story.state.enabled,false);assert.equal(figure.visible,false);assert.equal(light.intensity,0);for(const key of['setMode','reachSummit','beginFromRoof','replay','finish','follow','update','updateCamera'])assert.equal(story[key](),false);assert.equal(story.state.active,false);w.mountSummitStoryUI(story,{}).update();
console.log('PASS disabled Superhuman: source geometry retained, figure/particles/light/entry UI off, no animation or pick targets, enabled scene still works; real volcano uses a shared orange-red moving lava map and restrained emission.');

const configured={};vm.runInNewContext(fs.readFileSync(new URL('../src/city-config.js',import.meta.url),'utf8'),{window:configured,document:{documentElement:{dataset:{}}}});assert.equal(configured.CITY_CONFIG.superhumanEnabled,false);const solar=configured.CITY_CONFIG.daySun;assert(solar.x===0&&solar.z===0&&solar.y>100,'Daylight sun sits directly over the city centre');
