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
console.log('PASS real self-contained static bust, finite geometry, bounded polygon count, truthful metadata and preserved voice assignment');
