import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ARCHETYPES_QUARTER,ARCHETYPE_HOUSES,ARCHETYPE_FOOTPRINTS,ARCHETYPE_PATHS,ARCHETYPE_CONNECTOR,archetypeWorld,archetypeLocal,archetypeEntry,archetypeCanStand,archetypeInteractionAllowed,createArchetypeState,setArchetypeStage} from '../src/archetypes-quarter-model.js';
import {ARCHETYPE_CONTENT} from '../src/archetypes-quarter-content.js';
import {buildArchetypesQuarter} from '../src/archetypes-quarter-scene.js';

const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),loads=[],loader={load(url,done,progress,error){const texture=new T.Texture();texture.image={width:600,height:600};loads.push({url,done,error,texture,disposed:0});texture.addEventListener('dispose',()=>loads.find(l=>l.texture===texture).disposed++);return texture;}};
const built=buildArchetypesQuarter(T,{canvas,loader});built.group.updateMatrixWorld(true);assert.equal(built.houses.length,4);assert.equal(new Set(ARCHETYPE_HOUSES.map(h=>h.style)).size,4);assert.equal(loads.length,4);let draws=0,lights=0;built.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}if(o.isLight)lights++;});assert(draws<190,'Moderate batched draw budget: '+draws);assert.equal(lights,0);
const rayLocal=(h,origin,direction,far)=>{const p=archetypeWorld(h.data,origin[0],origin[2]),dir=new T.Vector3(direction[0],direction[1],direction[2]).applyAxisAngle(new T.Vector3(0,1,0),h.data.turn),ray=new T.Raycaster(new T.Vector3(p.x,origin[1]+.13,p.z),dir,0,far);return ray.intersectObject(h.group,true);};
for(const h of built.houses){
 const d=h.data,c=ARCHETYPE_CONTENT[d.id];assert.equal(archetypeEntry(d).yaw,d.turn);assert(!h.inside(h.entry.x,h.entry.z));assert(h.inside(h.insideEntry.x,h.insideEntry.z));
 for(let z=18;z>=-7;z-=.08)for(const x of[-1.2,0,1.2]){const p=archetypeWorld(d,x,z);assert(built.canStand(p.x,p.z),'Door/body route '+d.id+' at '+x+','+z);assert(built.canStand(p.x,p.z),'Reverse exit '+d.id);}
 for(const head of[1.7,3.35])assert.equal(rayLocal(h,[0,head,13],[0,0,-1],7.3).length,0,'Actual full-height open door and interior aisle: '+d.id);
 assert(rayLocal(h,[7,1.7,13],[0,0,-1],5).length,'Actual solid front wall: '+d.id);
 assert(rayLocal(h,[0,2.2,0],[1,0,0],9.3).length,'A genuine glazed side aperture: '+d.id);
 assert(rayLocal(h,[7,2.2,-7],[0,0,-1],2.3).length,'Actual rear wall: '+d.id);
 assert(rayLocal(h,[0,3.7,0],[0,1,0],5).length,'Real overhead roof: '+d.id);
 for(const [x,z]of[[9,0],[-9,0],[0,-9],[5.3,9],[1.6,9],[6.9,11.1],[3.9,-2.5],[-5.4,-2]]){const p=archetypeWorld(d,x,z);assert(!archetypeCanStand(d,p.x,p.z),'Rendered obstacle stops walking '+d.id+' '+x+','+z);}
 const q=archetypeWorld(d,.8,4),back=archetypeLocal(d,q.x,q.z);assert(Math.abs(back.x-.8)<1e-8&&Math.abs(back.z-4)<1e-8);assert(archetypeInteractionAllowed(d,{...q,y:1.83}));for(const options of[{mode:'gallery'},{modal:true}])assert(!archetypeInteractionAllowed(d,{...q,y:1.83},options));assert(!archetypeInteractionAllowed(d,{...q,y:7}));
 assert.equal(c.stages.length,3);const count=text=>text.trim().split(/\s+/).length;assert(count(c.stages.map(s=>s[1]).join(' '))>=140&&count(c.stages.map(s=>s[1]).join(' '))<=180);assert(count(c.concept)>=60&&count(c.concept)<=85);assert(count(c.reading)>=80&&count(c.reading)<=100);assert(c.alternative&&c.question&&c.sources.length>=2);
 assert(Math.abs(h.artSize.width/h.artSize.height-c.art.width/c.art.height)<1e-10,'Uncropped picture aspect');
 for(const n of[1,2,0]){assert(h.setStage(n));assert.equal(h.symbol.userData.stage,n);}assert(!h.setStage(7));
}
// Every exported door path and the southeast street spur is physically reversible.
for(const route of[...ARCHETYPE_PATHS,ARCHETYPE_CONNECTOR])for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.06);for(let j=0;j<=steps;j++){const f=j/steps;assert(built.canStand(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f),'Public connector '+route.id);}}
for(const footprint of ARCHETYPE_FOOTPRINTS)for(const p of footprint.polygon)assert(Math.hypot(p[0]-ARCHETYPES_QUARTER.x,p[1]-ARCHETYPES_QUARTER.z)<55);
const state=createArchetypeState();assert(setArchetypeStage(state,'persona',2));assert(!setArchetypeStage(state,'constructor',1));assert(!setArchetypeStage(state,'persona',-1));
const assetDir=new URL('../src/assets/archetypes-quarter/',import.meta.url),credits=JSON.parse(fs.readFileSync(new URL('credits.json',assetDir),'utf8').replace(/^\uFEFF/,''));assert.equal(credits.objects.length,4);
function jpegSize(bytes){let offset=2;while(offset<bytes.length){if(bytes[offset++]!==255)continue;let code=bytes[offset++];while(code===255)code=bytes[offset++];if(code===216||code===217)continue;const size=bytes.readUInt16BE(offset);if([192,193,194].includes(code))return{height:bytes.readUInt16BE(offset+3),width:bytes.readUInt16BE(offset+5)};offset+=size;}throw Error('No JPEG size');}
for(const c of credits.objects){assert.equal(c.isPublicDomain,true);assert.equal(c.licence,'CC0 1.0');assert(c.title&&c.culture&&c.date&&c.creditLine&&c.objectURL&&c.sourceImageURL&&c.modifications);assert(c.apiURL.endsWith('/'+c.objectId));for(const [file,hash,w,h]of[[c.original,c.sha256,c.width,c.height],[c.display,c.displaySha256,c.displayWidth,c.displayHeight]]){const bytes=fs.readFileSync(new URL(file,assetDir));assert(bytes.length>5000);assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,'Preserved source bytes '+file);assert.deepEqual(jpegSize(bytes),{width:w,height:h});}assert.equal(c.width/c.height,c.displayWidth/c.displayHeight);}
assert(ARCHETYPE_CONTENT.shadow.art.caption.includes('uncertain'));assert(ARCHETYPE_CONTENT.transformation.art.caption.includes('does not depict'));assert(ARCHETYPE_CONTENT.transformation.stages[2][1].includes('substitute'));
loads.forEach(l=>l.done(l.texture));assert.deepEqual(await built.ready,[true,true,true,true]);assert(built.houses.every(h=>h.picture.userData.loaded&&h.picture.material.map));built.dispose();built.dispose();assert.equal(built.group.children.length,0);assert(loads.every(l=>l.disposed===1));
const late=[],second=buildArchetypesQuarter(T,{canvas,loader:{load(url,done){const tex=new T.Texture();let count=0;tex.addEventListener('dispose',()=>count++);late.push({done,tex,count:()=>count});return tex;}}});second.dispose();assert.deepEqual(await second.ready,[false,false,false,false]);late.forEach(l=>l.done(l.tex));assert(late.every(l=>l.count()===1),'Late textures released exactly once');
console.log('PASS archetypes quarter: four real houses, body/head doors, roofs, solid glazing, furniture, reversible court/street/door paths, height/mode gates, 3-stage content, image aspects/CC0/source bytes, batched draw budget ('+draws+'), and late-load cleanup');
