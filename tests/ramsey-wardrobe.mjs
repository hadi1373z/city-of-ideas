import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildCharacterStudyScene} from '../src/ramsey-room-scene.js';
const ids=['socrates','nietzsche','zarathustra','anonymous','ramsey','turing'];
const known=new Set(['nietzsche|zarathustra','nietzsche|socrates','ramsey|socrates','ramsey|turing','turing|zarathustra']);
const key=(a,b)=>[a,b].sort().join('|'),room=buildCharacterStudyScene(T),map=room.acquaintanceMap;
assert.equal(room.tableSides,6);assert.deepEqual(room.tableProps,{coffee:0,notebooks:0,deskBooks:0});
let papers=0;room.group.traverse(o=>{if(o.userData.role==='central-graph-paper')papers++;});assert.equal(papers,1);assert.deepEqual(map.group.position.toArray(),[0,room.tableTopHeight+.016,room.tableCentreZ]);
for(const time of [0,65,125,165,305,425,515]){
 map.update(time,true);const {nodes,edges}=map.state,five=time===165;assert.equal(nodes.length,five?5:6);assert.equal(edges.length,five?10:15);
 for(const node of nodes){const seat=room.seats[ids.indexOf(node.id)],v=new T.Vector2(seat.x,seat.z-room.tableCentreZ).normalize(),n=new T.Vector2(node.position[0],node.position[2]).normalize();assert(v.dot(n)>1-1e-10,'Node must be on the side of its person: '+node.id);}
 for(const e of edges)assert.equal(e.relation,e.people.includes('anonymous')?'unknown':known.has(key(...e.people))?'knows':'does-not-know');
 for(const relation of ['knows','does-not-know'])assert.equal(edges.filter(e=>e.relation===relation).length,5);
 assert.equal(edges.filter(e=>e.relation==='unknown').length,five?0:5);
 const people=nodes.filter(n=>n.id!=='anonymous').map(n=>n.id),relation=(a,b)=>edges.find(e=>key(...e.people)===key(a,b)).relation;
 for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)for(let k=j+1;k<5;k++)assert(new Set([relation(people[i],people[j]),relation(people[j],people[k]),relation(people[k],people[i])]).size>1,'The specified five-person cycle has no monochromatic triangle');
}
const base=new URL('../src/ramsey-film/',import.meta.url),report=JSON.parse(fs.readFileSync(new URL('wardrobe-report.json',base)));
for(const id of ['turing','ramsey','nietzsche']){
 const b=fs.readFileSync(new URL('assets/'+id+'.glb',base)),len=b.readUInt32LE(12),d=JSON.parse(b.subarray(20,20+len)),bin=b.subarray(28+len),read=i=>{const a=d.accessors[i],v=d.bufferViews[a.bufferView],C={5126:Float32Array,5123:Uint16Array,5125:Uint32Array}[a.componentType],size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];return new C(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*size);};
 assert(b.length<25*1024*1024);assert(d.skins.length>0);assert(d.animations.some(a=>a.name==='Seated at hexagonal table'));assert(d.animations.some(a=>a.name==='Standing idle'));
 const garments=d.nodes.filter(n=>n.name?.startsWith(id+'-wardrobe-'));assert(garments.length>15);assert(d.meshes.some(m=>m.extras?.targetNames?.includes('seatedDrape')));
 for(const node of garments)for(const p of d.meshes[node.mesh].primitives){const weights=read(p.attributes.WEIGHTS_0),joints=read(p.attributes.JOINTS_0),positions=read(p.attributes.POSITION);for(const n of positions)assert(Number.isFinite(n));for(let j=0;j<weights.length;j+=4){assert(Math.abs(weights[j]+weights[j+1]+weights[j+2]+weights[j+3]-1)<1e-5);for(let k=0;k<4;k++)if(weights[j+k])assert(joints[j+k]<d.skins[node.skin].joints.length);}}
 if(id==='nietzsche'){assert(d.nodes.some(n=>n.name==='nietzsche-supplied-head-neck-collar-base'));assert(!d.animations.some(a=>a.name==='Blink'));assert(d.asset.extras.lowerFaceCorrection);}
 else for(const [name,attributes]of Object.entries(report.preservedHeadAttributes[id])){const node=d.nodes.find(n=>n.name===name);assert(node,'Retained head component '+name);for(const [semantic,hash]of Object.entries(attributes)){const a=d.meshes[node.mesh].primitives[0].attributes[semantic];assert.equal(createHash('sha256').update(Buffer.from(read(a).buffer,read(a).byteOffset,read(a).byteLength)).digest('hex'),hash,'Preserve accepted head / spectacles: '+name+' '+semantic);}}
}
assert(report.lowerFaceCorrection.meanMirrorDistanceAfterMm<report.lowerFaceCorrection.meanMirrorDistanceBeforeMm*.5);
room.dispose();console.log('PASS requested acquaintance pairs, unknown Anonymous, centered single paper, seat alignment, unchanged Turing/Ramsey heads, garment rigs and Nietzsche lower-face correction');
