import assert from 'node:assert/strict';
import fs from 'node:fs';
const file=new URL('../src/ramsey-film/assets/nietzsche.glb',import.meta.url),bytes=fs.readFileSync(file),length=bytes.readUInt32LE(12),d=JSON.parse(bytes.subarray(20,20+length)),bin=bytes.subarray(28+length);
const size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},types={5126:Float32Array,5125:Uint32Array,5123:Uint16Array};
function read(index){const a=d.accessors[index],v=d.bufferViews[a.bufferView],C=types[a.componentType];return new C(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*size[a.type]);}
function part(name){const n=d.nodes.find(n=>n.name===name);assert(n,'Missing '+name);return {node:n,primitive:d.meshes[n.mesh].primitives[0]};}
assert(!d.nodes.some(n=>n.name==='nietzsche-supplied-head-neck-collar-base'),'Remove the artificial portrait collar base');
const head=part('nietzsche-supplied-head-neck'),neck=part('nietzsche-continuous-neck-extension'),ha=head.primitive.attributes,na=neck.primitive.attributes;
assert.equal(head.node.skin,neck.node.skin);assert.notEqual(head.primitive.material,neck.primitive.material);
const hp=read(ha.POSITION),hj=read(ha.JOINTS_0),hw=read(ha.WEIGHTS_0),hn=read(ha.NORMAL),np=read(na.POSITION),nj=read(na.JOINTS_0),nw=read(na.WEIGHTS_0),nn=read(na.NORMAL);
const info=JSON.parse(fs.readFileSync(new URL('../src/ramsey-film/neck-fit-report.json',import.meta.url))),N=info.cut.contourVertices,stride=N+1;
const key=(p,i)=>[0,1,2].map(k=>Math.round(p[i*3+k]*1e6)).join(','),heads=new Map();
for(let i=0;i<hp.length/3;i++){const k=key(hp,i);if(!heads.has(k))heads.set(k,[]);heads.get(k).push(i);}
function influence(j,w,i){const map=new Map();for(let k=0;k<4;k++)if(w[i*4+k]>0)map.set(j[i*4+k],w[i*4+k]);return map;}
for(let i=0;i<=N;i++){
 const candidates=heads.get(key(np,i));assert(candidates?.length,'Neck must meet an actual vertex of the clipped portrait');
 const weights=influence(nj,nw,i);
 assert(candidates.some(k=>{const h=influence(hj,hw,k);return [...new Set([...weights.keys(),...h.keys()])].every(j=>Math.abs((weights.get(j)||0)-(h.get(j)||0))<1e-6)&&[0,1,2].every(j=>Math.abs(nn[i*3+j]-hn[k*3+j])<1e-5);}),
  'Join must retain matching normals and bone weights, so speaking and seated poses cannot open a seam');
}
const spine=d.skins[neck.node.skin].joints.findIndex(i=>d.nodes[i].name==='Spine');
for(let i=0;i<np.length/3;i++){
 assert(Math.abs(nw[i*4]+nw[i*4+1]+nw[i*4+2]+nw[i*4+3]-1)<1e-6);
 if(i>=np.length/3-stride){assert(Math.abs(np[i*3+1]-1.38)<1e-6);assert.equal(influence(nj,nw,i).get(spine),1);assert(np[i*3+2]<.0401,'Neck must tuck inside the rear coat collar');}
}
assert(d.animations.some(a=>a.name==='Seated at hexagonal table'));assert(d.animations.some(a=>a.name==='Standing idle'));
// The complete person grows together; preserve the approved portrait/suit
// ratio and the contact points with the floor and chair.
const fitIndex=d.nodes.findIndex(n=>n.name==='nietzsche-whole-character-fit'),fit=d.nodes[fitIndex];
assert(fit,'Whole-character sizing must be part of the portable GLB');
assert.deepEqual(fit.scale,[1.1,1.1,1.1]);
assert.equal(info.headScale,.792,'Keep the approved internal head-to-suit proportion');
const descendants=new Set();function visit(i){descendants.add(i);for(const c of d.nodes[i].children||[])visit(c);}visit(fitIndex);
for(const node of d.nodes.filter(n=>n.skin!==undefined)){
 assert(d.scenes[d.scene||0].nodes.includes(d.nodes.indexOf(node)),'Skinned meshes stay at scene root');
 assert(d.skins[node.skin].joints.every(i=>descendants.has(i)),'Portrait and suit must follow the same scaled skeleton');
}
for(const [pose,anchor,y] of [['Standing idle',.0673,fit.extras.characterFit.standingY],['Seated at hexagonal table',.56,fit.extras.characterFit.seatedY]]){
 assert(Math.abs(anchor*fit.scale[1]+y-anchor)<1e-8,pose+' must keep its contact anchor fixed');
 const animation=d.animations.find(a=>a.name===pose),channel=animation.channels.find(c=>c.target.node===fitIndex&&c.target.path==='translation');
 assert(channel,'Exported '+pose+' needs the same fit as the live actor');
 const positions=read(animation.samplers[channel.sampler].output);
 assert(Math.abs(positions[1]-y)<1e-7&&Math.abs(positions[4]-y)<1e-7);
}
const skin=d.materials[neck.primitive.material];
for(const texture of [skin.pbrMetallicRoughness.baseColorTexture,skin.emissiveTexture,skin.pbrMetallicRoughness.metallicRoughnessTexture])assert(Number.isInteger(d.images[d.textures[texture.index].source].bufferView),'Neck transition maps must be embedded');
console.log('PASS continuous portrait/suit seam, portable skin maps, uniform whole-character scale, fixed floor/chair anchors and retained pose clips');
