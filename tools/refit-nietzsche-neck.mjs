// Remove the supplied bust's clothing before joining its neck to the suit.
// Run: node tools/refit-nietzsche-neck.mjs INPUT.glb OUTPUT.glb REPORT.json
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {readGLB,writeGLB,appender,prune} from './lib/ramsey-glb.mjs';
const [input,output,reportFile]=process.argv.slice(2);
if(!input||!output||!reportFile)throw Error('Supply input, output and report paths');
const source=fs.readFileSync(input),sourceSha=createHash('sha256').update(source).digest('hex');
if(sourceSha!=='d3fac5d1def30b1e08fb5cfbbaff8ba298935a323611b6eb9440ca8233bb0a0b')throw Error('Use the preserved edition-10 source, not an already refitted model');
const {doc:d,bin}=readGLB(input),add=appender(d,bin);
const size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16},types={5126:Float32Array,5125:Uint32Array,5123:Uint16Array};
function read(i){const a=d.accessors[i],v=d.bufferViews[a.bufferView],C=types[a.componentType];if(v.byteStride)throw Error('Unexpected interleaved input');return new C(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*size[a.type]);}
const head=d.nodes.find(n=>n.name==='nietzsche-supplied-head-neck'),primitive=d.meshes[head.mesh].primitives[0];
const attrs=Object.fromEntries(Object.entries(primitive.attributes).map(([key,index])=>[key,{data:read(index),...d.accessors[index]}]));
const count=attrs.POSITION.count,records=Array.from({length:count},(_,i)=>Object.fromEntries(Object.entries(attrs).map(([key,a])=>[key,Array.from(a.data.subarray(i*size[a.type],(i+1)*size[a.type]))])));
const plane=p=>p[1]-(1.532+.17*(p[2]+.04));
const intersectionCache=new Map(),segments=[],indices=[];
function crossing(a,b){
 const key=a<b?a+','+b:b+','+a;if(intersectionCache.has(key))return intersectionCache.get(key);
 const va=records[a],vb=records[b],fa=plane(va.POSITION),fb=plane(vb.POSITION),t=fa/(fa-fb),v={};
 for(const k of Object.keys(attrs))if(!['JOINTS_0','WEIGHTS_0'].includes(k))v[k]=va[k].map((x,j)=>x+(vb[k][j]-x)*t);
 const influences=new Map();for(const [vertex,gain]of [[va,1-t],[vb,t]])for(let j=0;j<4;j++)influences.set(vertex.JOINTS_0[j],(influences.get(vertex.JOINTS_0[j])||0)+vertex.WEIGHTS_0[j]*gain);
 const sorted=[...influences].sort((a,b)=>b[1]-a[1]).slice(0,4);while(sorted.length<4)sorted.push([0,0]);const sum=sorted.reduce((s,p)=>s+p[1],0);
 v.JOINTS_0=sorted.map(x=>x[1]>0?x[0]:0);v.WEIGHTS_0=sorted.map(x=>x[1]/sum);
 v.NORMAL=new T.Vector3(...v.NORMAL).normalize().toArray();
 const tangent=new T.Vector3(...v.TANGENT.slice(0,3)),normal=new T.Vector3(...v.NORMAL);
 tangent.addScaledVector(normal,-tangent.dot(normal)).normalize();
 if(tangent.lengthSq()<.1)tangent.set(1,0,0).addScaledVector(normal,-normal.x).normalize();
 v.TANGENT=[...tangent.toArray(),v.TANGENT[3]<0?-1:1];
 const id=records.length;records.push(v);intersectionCache.set(key,id);return id;
}
const sourceIndices=read(primitive.indices);
for(let j=0;j<sourceIndices.length;j+=3){
 const tri=Array.from(sourceIndices.subarray(j,j+3)),poly=[],cuts=[];
 for(let k=0;k<3;k++){
  const a=tri[k],b=tri[(k+1)%3],insideA=plane(records[a].POSITION)>=0,insideB=plane(records[b].POSITION)>=0;
  if(insideA)poly.push(a);
  if(insideA!==insideB){const id=crossing(a,b);poly.push(id);cuts.push(id);}
 }
 for(let k=1;k<poly.length-1;k++)indices.push(poly[0],poly[k],poly[k+1]);
 if(cuts.length===2)segments.push(cuts);
}
const physical=new Map(),representatives=new Map(),adjacency=new Map();
function physicalKey(i){const key=records[i].POSITION.map(x=>Math.round(x*1e6)).join(',');physical.set(i,key);if(!representatives.has(key))representatives.set(key,i);return key;}
for(const [a,b]of segments){const ka=physicalKey(a),kb=physicalKey(b);if(ka===kb)continue;for(const [x,y]of [[ka,kb],[kb,ka]]){if(!adjacency.has(x))adjacency.set(x,new Set());adjacency.get(x).add(y);}}
const visited=new Set(),loops=[];
for(const start of adjacency.keys()){
 if(visited.has(start))continue;const loop=[];let current=start,previous=null;
 while(current&&!visited.has(current)){visited.add(current);loop.push(representatives.get(current));const options=[...(adjacency.get(current)||[])].filter(x=>x!==previous);previous=current;current=options.find(x=>!visited.has(x))||options[0];}
 if(loop.length>2)loops.push(loop);
}
loops.sort((a,b)=>b.length-a.length);
if(loops.length!==1||loops[0].length<30)throw Error('Expected one continuous anatomical cut contour; inspect loops: '+loops.map(l=>l.length));
let ring=loops[0];
let area=0;for(let i=0;i<ring.length;i++){const a=records[ring[i]].POSITION,b=records[ring[(i+1)%ring.length]].POSITION;area+=a[0]*b[2]-b[0]*a[2];}
// Increasing atan2(x,z) is clockwise when projected into x/z.
if(area>0)ring.reverse();
const headDrop=.045;
// Match the supplied portrait's scale to the existing adult suit. Anchor the
// resize at the neck so the jaw stays connected while the skull gets smaller.
const headScale=.792,scaleAnchor=new T.Vector3(0,1.475,.015);
for(const record of records){
 const p=new T.Vector3(...record.POSITION);p.y-=headDrop;
 record.POSITION=p.sub(scaleAnchor).multiplyScalar(headScale).add(scaleAnchor).toArray();
}
function attributeArray(key,ids){const a=attrs[key],C=types[a.componentType];return new C(ids.flatMap(i=>records[i][key]));}
const used=[...new Set(indices)],remap=new Map(used.map((id,i)=>[id,i]));
for(const [key,a]of Object.entries(attrs))primitive.attributes[key]=add.accessor(attributeArray(key,used),a.type,a.componentType,34962,key==='POSITION');
primitive.indices=add.accessor(new Uint32Array(indices.map(i=>remap.get(i))),'SCALAR',5125,34963);

// The original artificial collar/cravat extension is removed outright.
const removedNode=d.nodes.findIndex(n=>n.name==='nietzsche-supplied-head-neck-collar-base');
if(removedNode<0)throw Error('Expected the old portrait collar extension');
for(const scene of d.scenes)scene.nodes=scene.nodes.filter(i=>i!==removedNode);
for(const node of d.nodes)if(node.children)node.children=node.children.filter(i=>i!==removedNode);

// Extend the actual cut neck contour down inside the existing business collar.
const skin=d.skins[head.skin],headJoint=skin.joints.findIndex(i=>d.nodes[i].name==='Head'),spine=skin.joints.findIndex(i=>d.nodes[i].name==='Spine');
const rows=16,N=ring.length,stride=N+1,neck={POSITION:[],NORMAL:[],TEXCOORD_0:[],JOINTS_0:[],WEIGHTS_0:[]},neckIndices=[];
for(let row=0;row<=rows;row++)for(let col=0;col<=N;col++){
 const root=records[ring[col%N]],t=row/rows,[x,y,z]=root.POSITION,angle=Math.atan2(x,z-.025),ease=(1-Math.exp(-4*t))/(1-Math.exp(-4));
 neck.POSITION.push(T.MathUtils.lerp(x,Math.sin(angle)*.055,ease),T.MathUtils.lerp(y,1.380,t),T.MathUtils.lerp(z,-.005+Math.cos(angle)*.044,ease));
 neck.NORMAL.push(...root.NORMAL);neck.TEXCOORD_0.push(col/N,t);
 const influence=1-T.MathUtils.smoothstep(t,0,.90),influences=new Map([[spine,1-influence]]);
 for(let i=0;i<4;i++)if(root.WEIGHTS_0[i]>0)influences.set(root.JOINTS_0[i],(influences.get(root.JOINTS_0[i])||0)+root.WEIGHTS_0[i]*influence);
 const entries=[...influences].filter(p=>p[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,4);while(entries.length<4)entries.push([0,0]);
 neck.JOINTS_0.push(...entries.map(p=>p[0]));neck.WEIGHTS_0.push(...entries.map(p=>p[1]));
 if(row<rows&&col<N){const a=row*stride+col,b=a+1,c=a+stride,e=b+stride;neckIndices.push(a,c,b,b,c,e);}
}
const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(neck.POSITION,3));geometry.setIndex(neckIndices);geometry.computeVertexNormals();
for(let i=0;i<neck.POSITION.length/3;i++){
 const row=Math.floor(i/stride),t=row/rows,n=new T.Vector3().fromBufferAttribute(geometry.attributes.normal,i),root=new T.Vector3(...records[ring[(i%stride)%N]].NORMAL);
 if(row===0)n.copy(root);else n.lerp(root,1-T.MathUtils.smoothstep(t,0,.3)).normalize();
 neck.NORMAL.splice(i*3,3,...n.toArray());
}
const neckAttrs={};for(const [key,data]of Object.entries(neck)){const a=attrs[key]||{type:'VEC3',componentType:5126},C=types[a.componentType];neckAttrs[key]=add.accessor(new C(data),a.type,a.componentType,34962,key==='POSITION');}
const atlasDir=path.join(path.dirname(reportFile),'neck-atlas'),rootsFile=path.join(path.dirname(reportFile),'neck-contour-uv.json');
fs.writeFileSync(rootsFile,JSON.stringify(ring.map(i=>records[i].TEXCOORD_0)));
const baked=spawnSync('python',[fileURLToPath(new URL('./bake-nietzsche-neck.py',import.meta.url)),input,rootsFile,atlasDir],{encoding:'utf8',windowsHide:true});
if(baked.status!==0)throw Error('Neck texture bake failed: '+baked.stderr);
const atlasTextures={};for(const name of ['base','emission','roughness']){
 const image=d.images.length;d.images.push({name:'Nietzsche neck '+name,bufferView:add.view(fs.readFileSync(path.join(atlasDir,name+'.png'))),mimeType:'image/png'});
 atlasTextures[name]=d.textures.length;d.textures.push({source:image});
}
const neckMaterial=d.materials.length,skinMaterial=structuredClone(d.materials[primitive.material]);
skinMaterial.name='Nietzsche natural neck skin';delete skinMaterial.normalTexture;
skinMaterial.pbrMetallicRoughness.baseColorTexture={index:atlasTextures.base};skinMaterial.pbrMetallicRoughness.metallicRoughnessTexture={index:atlasTextures.roughness};skinMaterial.emissiveTexture={index:atlasTextures.emission};d.materials.push(skinMaterial);
const mi=d.meshes.length;d.meshes.push({name:'nietzsche-continuous-neck-extension',primitives:[{attributes:neckAttrs,indices:add.accessor(new Uint32Array(neckIndices),'SCALAR',5125,34963),material:neckMaterial,mode:4}]});
d.scenes[d.scene||0].nodes.push(d.nodes.length);d.nodes.push({name:'nietzsche-continuous-neck-extension',mesh:mi,skin:head.skin});

// Undo the earlier tuck that compressed the suit's own collar underneath the
// discarded portrait collar. No other clothing or other character is rebuilt.
let collarVertices=0;
for(const node of d.nodes.filter(n=>/^nietzsche-wardrobe-shirt/.test(n.name||'')))for(const p of d.meshes[node.mesh].primitives){
 const pos=Float32Array.from(read(p.attributes.POSITION)),normal=Float32Array.from(read(p.attributes.NORMAL)),uv=Float32Array.from(read(p.attributes.TEXCOORD_0)),changed=[];
 for(let i=0;i<pos.length/3;i++){
  const y=pos[i*3+1];if(y<1.37299||y>1.3771||Math.abs(pos[i*3])>.115)continue;
  const oy=1.36+(y-1.373)/.04,t=T.MathUtils.smoothstep(oy,1.36,1.40),factor=1-.3*t;
  pos[i*3]/=factor;pos[i*3+1]=oy;pos[i*3+2]/=factor;changed.push(i);collarVertices++;
 }
 if(!changed.length)continue;
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));g.setIndex(Array.from(read(p.indices)));g.computeVertexNormals();
 for(const i of changed)normal.set(g.attributes.normal.array.subarray(i*3,i*3+3),i*3);
 g.setAttribute('normal',new T.BufferAttribute(normal,3));g.computeTangents();
 const tangent=g.attributes.tangent.array;
 for(let i=0;i<tangent.length;i+=4){const n=new T.Vector3(...normal.subarray(i/4*3,i/4*3+3));let v=new T.Vector3(...tangent.subarray(i,i+3));if(v.lengthSq()<.01)v.set(1,0,0).addScaledVector(n,-n.x);v.normalize();tangent.set([...v.toArray(),tangent[i+3]<0?-1:1],i);}
 p.attributes.POSITION=add.accessor(pos,'VEC3',5126,34962,true);p.attributes.NORMAL=add.accessor(normal,'VEC3',5126,34962);p.attributes.TANGENT=add.accessor(tangent,'VEC4',5126,34962);
}
const report={sourceSha256:sourceSha,removed:'Original portrait clothing below the anatomical neck contour, and nietzsche-supplied-head-neck-collar-base',cut:{plane:'y = 1.532 + .17 * (z + .04)',contourVertices:N,originalTriangles:sourceIndices.length/3,retainedTriangles:indices.length/3},headAlignmentY:-headDrop,headScale,scaleAnchor:scaleAnchor.toArray(),extension:{name:'nietzsche-continuous-neck-extension',bottomY:1.380,rows,triangles:neckIndices.length/3,material:'Baked boundary-to-original-neck skin transition; no stretched portrait clothing',weights:'Original boundary weights to Spine, blended across the neck'},restoredSuitCollarVertices:collarVertices,preserved:['Portrait shape and maps above cut (uniform scale and vertical alignment only)','Existing business suit outside its previously compressed collar','Hands, shoes, skeleton and animation clips','All six fixed voice recordings']};
// Preserve the approved head-to-suit ratio and bring the complete person to
// the roughly 1.9 m scale of the other citizens. A shared parent transforms
// the portrait, suit, hands, shoes and skeleton by exactly the same amount.
const wholeScale=1.10,standingY=.0673*(1-wholeScale),seatedY=.56*(1-wholeScale);
const fitNode=d.nodes.length;
const roots=d.scenes[d.scene||0].nodes,skinnedRoots=roots.filter(i=>d.nodes[i].skin!==undefined);
// Skin vertices follow the scaled skeleton. Keep skinned mesh nodes at scene
// root, as required by glTF; a parent scale on them would be ignored.
d.nodes.push({name:'nietzsche-whole-character-fit',scale:[wholeScale,wholeScale,wholeScale],translation:[0,standingY,0],children:roots.filter(i=>!skinnedRoots.includes(i)),extras:{characterFit:{scale:wholeScale,standingY,seatedY}}});
d.scenes[d.scene||0].nodes=[...skinnedRoots,fitNode];
const fitTime=add.accessor(new Float32Array([0,1]),'SCALAR',5126,undefined,true);
for(const animation of d.animations){
 const y=animation.name==='Seated at hexagonal table'?seatedY:standingY;
 const sampler=animation.samplers.length;
 animation.samplers.push({input:fitTime,output:add.accessor(new Float32Array([0,y,0,0,y,0]),'VEC3',5126),interpolation:'LINEAR'});
 animation.channels.push({sampler,target:{node:fitNode,path:'translation'}});
}
report.wholeCharacterScale=wholeScale;
report.wholeCharacterFit={standingY,seatedY,reference:'Overall standing scale of Ramsey and Turing; seated hip remains at chair height'};
d.asset.extras={...(d.asset.extras||{}),neckFix:report};
const result=prune(d,add.bin);writeGLB(output,result.doc,result.bin);
fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
