import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {LIGHT_HOUSE as H,lightPolygon} from '../src/house-of-light-model.js';
import {buildHouseOfLight} from '../src/house-of-light-scene.js';

const url=new URL('../src/house-of-light-scene.js',import.meta.url),canvasFactory=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})});
const source=readFileSync(url,'utf8'),oldNormalLine="if(list===metals)g.setAttribute('normal',new T.Float32BufferAttribute(metalNormals,3));else g.computeVertexNormals();";
assert(source.includes(oldNormalLine));
// Independent comparison with the previous flat-normal batching path: shading
// must not change even one position/colour/index or instance matrix anywhere.
const baselineSource=source.replace(oldNormalLine,'g.computeVertexNormals();').replace(/from '(\.\/[^']+)'/g,(_,p)=>'from '+JSON.stringify(new URL(p,url).href));
const baselineModule=await import('data:text/javascript;base64,'+Buffer.from(baselineSource).toString('base64'));
const before=baselineModule.buildHouseOfLight(T,{canvasFactory}),after=buildHouseOfLight(T,{canvasFactory});
const meshes=root=>{const out=[];root.traverse(o=>{if(o.isMesh)out.push(o);});return out;},a=meshes(before.group),b=meshes(after.group);
assert.equal(a.length,b.length);
for(let i=0;i<a.length;i++){
 assert.equal(a[i].name,b[i].name);
 for(const key of['position','color','uv'])assert.deepEqual(a[i].geometry.attributes[key]?.array,b[i].geometry.attributes[key]?.array,'Every '+key+' byte stays fixed in '+a[i].name);
 assert.deepEqual(a[i].geometry.index?.array,b[i].geometry.index?.array);
 assert.deepEqual(a[i].instanceMatrix?.array,b[i].instanceMatrix?.array);
}
const metal=after.group.getObjectByName('House of Light · supported bronze structure'),normals=metal.geometry.attributes.normal,oldNormals=before.group.getObjectByName(metal.name).geometry.attributes.normal;
assert.equal(normals.count,metal.geometry.attributes.position.count);let changed=0;
for(let i=0;i<normals.count;i++){const n=new T.Vector3().fromBufferAttribute(normals,i);assert(Math.abs(n.length()-1)<1e-5,'Every transformed normal remains unit length');if(n.distanceTo(new T.Vector3().fromBufferAttribute(oldNormals,i))>.001)changed++;}
assert(changed>1000,'The cylindrical structure has a genuine shading change');
const p=lightPolygon()[0],matrix=new T.Matrix4().compose(new T.Vector3(p[0]-H.x,.13+H.eave/2,p[1]-H.z),new T.Quaternion(),new T.Vector3(.18,H.eave,.18));
const expected=new T.CylinderGeometry(1,1,1,12).applyMatrix4(matrix),ix=expected.index.array,normal=expected.attributes.normal;
for(let i=0;i<ix.length;i++)assert(new T.Vector3().fromBufferAttribute(normals,i).distanceTo(new T.Vector3().fromBufferAttribute(normal,ix[i]))<1e-7,'Source cylinder smooth walls and sharp flat caps survive nonuniform batching');
expected.dispose();before.dispose();after.dispose();
console.log('PASS House of Light metal shading: all mesh/instance positions, colours, UVs and indices byte-identical; original inverse-transpose cylinder normals and sharp caps retained; '+changed+' faceted normals repaired.');
