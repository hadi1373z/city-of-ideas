const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../src/ramsey-film/prototypes');
const bytes=fs.readFileSync(path.join(root,'nietzsche-a.glb'));
assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(8),bytes.length);
const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
assert(!json.skins?.length&&!json.animations?.length,'This is explicitly a static study, not a finished animated actor');
assert(json.meshes.length>10);assert(json.buffers.every(b=>!b.uri),'Model must be self-contained');
const binary=bytes.subarray(28+bytes.readUInt32LE(12));let triangles=0;
for(const mesh of json.meshes)for(const primitive of mesh.primitives){
 const position=json.accessors[primitive.attributes.POSITION],normal=json.accessors[primitive.attributes.NORMAL];
 assert(position.count>0);assert.equal(normal.count,position.count);
 for(const accessor of [position,normal]){
  assert.equal(accessor.componentType,5126);const view=json.bufferViews[accessor.bufferView];
  for(let i=0;i<accessor.count;i++)for(let c=0;c<3;c++)assert(Number.isFinite(binary.readFloatLE((view.byteOffset||0)+(accessor.byteOffset||0)+i*(view.byteStride||12)+c*4)));
 }
 triangles+=(json.accessors[primitive.indices]?.count||position.count)/3;
}
assert(triangles>20000&&triangles<250000,'Keep the single-character study practical for web review');
const names=json.nodes.map(n=>n.name||'').join(' ');
assert(names.includes('anatomical'));assert(names.includes('spectacle'));assert(names.includes('Moustache'));
const info=JSON.parse(fs.readFileSync(path.join(root,'model-study.json')));
assert.equal(info.voice,'am_fenrir (existing, unchanged)');assert.equal(info.triangles,triangles);
assert.equal(info.anatomicalBase.sha256.length,64);
const bounds=name=>{
 const node=json.nodes.find(n=>(n.name||'').startsWith(name));assert(node,'Missing model part: '+name);
 const accessors=json.meshes[node.mesh].primitives.map(p=>json.accessors[p.attributes.POSITION]);
 return {min:[0,1,2].map(i=>Math.min(...accessors.map(a=>a.min[i]))),max:[0,1,2].map(i=>Math.max(...accessors.map(a=>a.max[i])))};
};
const head=bounds('Nietzsche A anatomical Mesh_0'),shoulders=bounds('Tailored wool shoulders'),collar=bounds('Fitted ivory neck collar');
const ratio=(shoulders.max[0]-shoulders.min[0])/(head.max[0]-head.min[0]);
assert(ratio>2.05&&ratio<2.6,'Shoulders must have adult proportions relative to the anatomical head');
assert(collar.min[1]<shoulders.max[1]&&collar.max[1]>shoulders.max[1],'Collar must overlap the jacket neckline');
assert(head.min[1]<collar.min[1]&&head.max[1]>collar.max[1],'Anatomical neck must continue inside the collar');
for(const groom of ['Eyebrow groom','Moustache groom','Scalp hair groom'])bounds(groom);
const skin=json.materials.find(m=>m.name==='Skin - baked complexion and pores');
assert(skin?.pbrMetallicRoughness.baseColorTexture&&skin.normalTexture,'Skin detail must survive GLB export');
assert(json.images.every(i=>Number.isInteger(i.bufferView)),'Skin maps must be embedded');
assert.equal(info.groom.eyebrow,480);
console.log('PASS self-contained bust, portable skin detail, mesh grooms, head/shoulder proportions, overlapping neck/collar and preserved voice');
