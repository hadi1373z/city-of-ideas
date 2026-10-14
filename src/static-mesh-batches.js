/* Render-only static batching for the principal Three.js r160 scene.
 * Source nodes retain their geometry, material, parent, userData and visibility.
 * Their reserved layer 31 is for original source rays, never the render camera.
 */
export const STATIC_SOURCE_LAYER=31;
const ACTION_KEYS=['homeAction','cityAction','mathAction','artAction','bookId','workId','ideaId','designId','resident','artistResidentId','citySocrates','door','stairsId','cargoId','homeLightId','featureId','daliObjectId','select','cityChapter','cityBook','exhibit','centralArtwork'];
const DYNAMIC_KEYS=['resident','artistResidentId','citySocrates','door','designId'];
const nonEmpty=value=>value!==undefined&&value!==null&&value!==false;
export function enableStaticSourceRays(raycaster){raycaster.layers.enable(STATIC_SOURCE_LAYER);return raycaster;}

export function createStaticMeshBatches(T,{roots=[],minMeshes=2,maxVertices=65535,exclude,isInteractive,includeStaticActions=false,mergeEquivalentMaterials=false,batchDescendants=false,validationMode='full',safetyRecordsPerUpdate=64,safetyNodesPerUpdate=64}={}){
 if(String(T?.REVISION)!=='160'||!T?.BufferGeometry)throw Error('Use the principal Three.js r160 geometry API.');
 const sourceBit=1<<STATIC_SOURCE_LAYER,proxies=new WeakSet(),members=new WeakMap(),batches=new Set(),watches=new Map(),identities=new WeakMap(),materialStates=new WeakMap(),localStates=new WeakMap();
 let sourceRoots=[],disposed=false,nextIdentity=1,materialCache=new Map(),matrixCache=new Map(),visibilityCache=new Map(),syncedMatrices=new WeakSet(),localChanges=new WeakMap(),chainChanges=new Map(),geometryChecks=new Map(),interactionChecks=new WeakMap(),fastState=null,recordCursor=0,nodeCursor=0;
 if(!['full','fast'].includes(validationMode))throw Error('validationMode must be full or fast.');
 const identity=o=>{if(!identities.has(o))identities.set(o,nextIdentity++);return identities.get(o);};
 const syncMatrix=node=>{if(!syncedMatrices.has(node)){if(node.matrixAutoUpdate)node.updateMatrix();syncedMatrices.add(node);}};
 const hasRenderCallback=node=>node.isMesh&&(node.onBeforeRender!==T.Object3D.prototype.onBeforeRender||node.onAfterRender!==T.Object3D.prototype.onAfterRender||node.onBeforeShadow!==T.Object3D.prototype.onBeforeShadow||node.onAfterShadow!==T.Object3D.prototype.onAfterShadow);
 const interactive=node=>{for(let p=node;p;p=p.parent){const data=p.userData;if(isInteractive?.(p)||data?.dynamic||data?.animated||data?.staticBatchSkip||hasRenderCallback(p)||(includeStaticActions?DYNAMIC_KEYS:ACTION_KEYS).some(key=>nonEmpty(data?.[key])))return true;}return false;};
 function interactionChanged(node){if(!node)return false;if(interactionChecks.has(node))return interactionChecks.get(node);const d=node.userData,keys=includeStaticActions?DYNAMIC_KEYS:ACTION_KEYS;let own=!!(isInteractive?.(node)||d?.dynamic||d?.animated||d?.staticBatchSkip||hasRenderCallback(node));for(let i=0;!own&&i<keys.length;i++)own=nonEmpty(d?.[keys[i]]);const changed=own||interactionChanged(node.parent);interactionChecks.set(node,changed);return changed;}
 const visible=(node,scope)=>{let cache=visibilityCache.get(scope);if(!cache)visibilityCache.set(scope,cache=new WeakMap());if(!node)return false;if(cache.has(node))return cache.get(node);const result=node.visible&&(node===scope||visible(node.parent,scope));cache.set(node,result);return result;};
 function relativeMatrix(node,scope){let cache=matrixCache.get(scope);if(!cache)matrixCache.set(scope,cache=new WeakMap());if(!node)return null;if(cache.has(node))return cache.get(node);if(node===scope){const result=new T.Matrix4();cache.set(node,result);return result;}const parent=relativeMatrix(node.parent,scope);if(!parent)return null;syncMatrix(node);const result=new T.Matrix4().multiplyMatrices(parent,node.matrix);cache.set(node,result);return result;}
 function localState(node){return node.matrixAutoUpdate?{auto:true,parent:node.parent,x:node.position.x,y:node.position.y,z:node.position.z,qx:node.quaternion.x,qy:node.quaternion.y,qz:node.quaternion.z,qw:node.quaternion.w,sx:node.scale.x,sy:node.scale.y,sz:node.scale.z}:{auto:false,parent:node.parent,matrix:node.matrix.elements.slice()};}
 function watchTransforms(node,scope){for(let p=node;p&&p!==scope;p=p.parent)localStates.set(p,localState(p));}
 function localChanged(node){if(localChanges.has(node))return localChanges.get(node);const s=localStates.get(node),p=node.position,q=node.quaternion,z=node.scale;let changed=!s||node.parent!==s.parent||node.matrixAutoUpdate!==s.auto;if(!changed)changed=s.auto?p.x!==s.x||p.y!==s.y||p.z!==s.z||q.x!==s.qx||q.y!==s.qy||q.z!==s.qz||q.w!==s.qw||z.x!==s.sx||z.y!==s.sy||z.z!==s.sz:node.matrix.elements.some((v,i)=>v!==s.matrix[i]);localChanges.set(node,changed);return changed;}
 function transformChanged(node,scope){if(node===scope)return false;if(!node)return true;let cache=chainChanges.get(scope);if(!cache)chainChanges.set(scope,cache=new WeakMap());if(cache.has(node))return cache.get(node);const changed=localChanged(node)||transformChanged(node.parent,scope);cache.set(node,changed);return changed;}
 const ignoredMaterialKeys=new Set(['id','uuid','name','version','_listeners']);
 function capture(value,seen=new Set()){
  if(value===null||typeof value!=='object')return{kind:'value',value};
  if(value.isTexture)return{kind:'texture',value,version:value.version,uuid:value.uuid};
  if(value.isColor)return{kind:'color',r:value.r,g:value.g,b:value.b};
  if(value.isVector2||value.isVector3||value.isVector4||value.isQuaternion)return{kind:'vector',x:value.x,y:value.y,z:value.z,w:value.w};
  if(value.isMatrix3||value.isMatrix4)return{kind:'matrix',values:Array.from(value.elements)};
  if(seen.has(value))return{kind:'value',value};seen.add(value);
  const keys=Object.keys(value).sort(),state={kind:'object',keys,values:keys.map(key=>capture(value[key],seen))};seen.delete(value);return state;
 }
 function unchanged(value,state){
  switch(state.kind){
   case 'value':return Object.is(value,state.value);
   case 'texture':return value===state.value&&value.version===state.version&&value.uuid===state.uuid;
   case 'color':return !!value?.isColor&&value.r===state.r&&value.g===state.g&&value.b===state.b;
   case 'vector':return !!value&&(value.isVector2||value.isVector3||value.isVector4||value.isQuaternion)&&value.x===state.x&&value.y===state.y&&value.z===state.z&&value.w===state.w;
   case 'matrix':{if(!value?.elements||value.elements.length!==state.values.length)return false;for(let i=0;i<state.values.length;i++)if(value.elements[i]!==state.values[i])return false;return true;}
   default:{if(!value||typeof value!=='object'||Object.keys(value).length!==state.keys.length)return false;for(let i=0;i<state.keys.length;i++)if(!Object.hasOwn(value,state.keys[i])||!unchanged(value[state.keys[i]],state.values[i]))return false;return true;}
  }
 }
 function valueSignature(value,seen=new Set()){
  if(value===null)return 'null';const kind=typeof value;
  if(kind==='number')return Object.is(value,-0)?'-0':String(value);
  if(kind==='string')return JSON.stringify(value);if(kind==='boolean'||kind==='undefined')return String(value);
  if(kind==='function')return 'fn:'+identity(value);
  if(value.isTexture)return 'tex:'+identity(value)+':'+value.uuid+':'+value.version;
  if(value.isColor)return 'rgb:'+value.r+','+value.g+','+value.b;
  if(value.isVector2||value.isVector3||value.isVector4||value.isQuaternion)return value.toArray().join(',');
  if(value.isMatrix3||value.isMatrix4)return value.elements.join(',');
  if(seen.has(value))return 'cycle:'+identity(value);seen.add(value);
  const signature=Array.isArray(value)||ArrayBuffer.isView(value)?'['+Array.from(value,v=>valueSignature(v,seen)).join(',')+']':'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+valueSignature(value[key],seen)).join(',')+'}';seen.delete(value);return signature;
 }
 function materialSignature(material){
  if(!mergeEquivalentMaterials)return material.uuid;
  if(materialCache.has(material))return materialCache.get(material);
  const ownKeys=Object.keys(material),keys=[];for(let i=0;i<ownKeys.length;i++)if(!ignoredMaterialKeys.has(ownKeys[i]))keys.push(ownKeys[i]);const previous=materialStates.get(material);let same=!!previous&&keys.length===previous.keys.length;if(same)for(let i=0;i<previous.keys.length;i++)if(!Object.hasOwn(material,previous.keys[i])||!unchanged(material[previous.keys[i]],previous.values[i])){same=false;break;}
  if(same){materialCache.set(material,previous.signature);return previous.signature;}
  keys.sort();const signature=material.type+';'+keys.map(key=>key+':'+valueSignature(material[key])).join(';');materialStates.set(material,{keys,values:keys.map(key=>capture(material[key])),signature});materialCache.set(material,signature);return signature;
 }
 function eligible(node,scope,requireVisible=true){
  if(!node?.isMesh||node.isSkinnedMesh||node.isInstancedMesh||proxies.has(node)||!node.parent||exclude?.(node)||interactive(node)||requireVisible&&!visible(node,scope))return false;
  const material=node.material,g=node.geometry;
  if(!material||Array.isArray(material)||material.transparent||material.opacity<1||!material.visible||material.displacementMap||material.normalMap&&material.normalMapType===T.ObjectSpaceNormalMap||material.isShaderMaterial||material.isRawShaderMaterial||material.onBeforeCompile!==T.Material.prototype.onBeforeCompile||material.customProgramCacheKey!==T.Material.prototype.customProgramCacheKey||!g?.isBufferGeometry||g.attributes.position?.itemSize!==3)return false;
  if(node.customDepthMaterial||node.customDistanceMaterial||node.morphTargetInfluences?.length||Object.values(g.morphAttributes||{}).some(a=>a?.length)||g.attributes.skinIndex||g.attributes.skinWeight)return false;
  if(node.onBeforeRender!==T.Object3D.prototype.onBeforeRender||node.onAfterRender!==T.Object3D.prototype.onAfterRender||node.onBeforeShadow!==T.Object3D.prototype.onBeforeShadow||node.onAfterShadow!==T.Object3D.prototype.onAfterShadow)return false;
  const available=g.index?.count??g.attributes.position.count;
  if(g.drawRange.start!==0||g.drawRange.count!==Infinity&&g.drawRange.count!==available||available%3)return false;
  if(!members.has(node)&&(node.layers.mask&sourceBit)||!originalMask(node))return false;
  return Object.values(g.attributes).every(a=>a?.count===g.attributes.position.count&&a.itemSize>0&&ArrayBuffer.isView(a.array||a.data?.array));
 }
 function layout(g){return Object.keys(g.attributes).sort().map(name=>{const a=g.attributes[name];return[name,a.itemSize,a.normalized,a.gpuType,(a.array||a.data.array).constructor.name].join(':');}).join('|');}
 function originalMask(node){const record=members.get(node);if(!record)return node.layers.mask;return node.layers.mask===sourceBit?record.mask:node.layers.mask&sourceBit?(node.layers.mask&~sourceBit)|record.mask:node.layers.mask;}
 function groupOrder(node){for(let p=node.parent;p;p=p.parent)if(p.isGroup)return p.renderOrder;return 0;}
 function key(node,scope){return[materialSignature(node.material),originalMask(node),node.castShadow,node.receiveShadow,node.renderOrder,node.frustumCulled,groupOrder(node,scope),layout(node.geometry)].join(';');}
 function geometryState(g){return{geometry:g,index:g.index,indexVersion:g.index?.version,indexDataVersion:g.index?.data?.version,rangeStart:g.drawRange.start,rangeCount:g.drawRange.count,attrs:Object.entries(g.attributes).map(([name,a])=>({name,attribute:a,data:a.data,version:a.version,dataVersion:a.data?.version,count:a.count}))};}
 function geometryChanged(g,s){if(g!==s.geometry)return true;if(geometryChecks.has(s))return geometryChecks.get(s);let changed=g.index!==s.index||g.index?.version!==s.indexVersion||g.index?.data?.version!==s.indexDataVersion||g.drawRange.start!==s.rangeStart||g.drawRange.count!==s.rangeCount||Object.keys(g.attributes).length!==s.attrs.length;for(let i=0;!changed&&i<s.attrs.length;i++){const a=s.attrs[i];changed=g.attributes[a.name]!==a.attribute||a.attribute.data!==a.data||a.attribute.version!==a.version||a.attribute.data?.version!==a.dataVersion||a.attribute.count!==a.count;}geometryChecks.set(s,changed);return changed;}
 function stateChanged(record){
  const n=record.node;return n.parent!==record.parent||!visible(n,record.scope)||interactionChanged(n)||n.material!==record.material||n.layers.mask!==sourceBit||n.castShadow!==record.castShadow||n.receiveShadow!==record.receiveShadow||n.renderOrder!==record.renderOrder||n.frustumCulled!==record.frustumCulled||groupOrder(n,record.scope)!==record.groupOrder||materialSignature(n.material)!==record.materialSignature||n.material.version!==record.materialVersion||transformChanged(n,record.scope)||geometryChanged(n.geometry,record.geometryState)||n.morphTargetInfluences?.length||Object.values(n.geometry.morphAttributes||{}).some(a=>a?.length)||n.geometry.attributes.skinIndex||n.geometry.attributes.skinWeight||n.onBeforeRender!==T.Object3D.prototype.onBeforeRender||n.onAfterRender!==T.Object3D.prototype.onAfterRender||n.onBeforeShadow!==T.Object3D.prototype.onBeforeShadow||n.onAfterShadow!==T.Object3D.prototype.onAfterShadow||n.customDepthMaterial||n.customDistanceMaterial;
 }
 function rawComponent(a,index,component){return a.isInterleavedBufferAttribute?a.data.array[index*a.data.stride+a.offset+component]:a.array[index*a.itemSize+component];}
 function mergedGeometry(nodes,scope){
  const specs=Object.entries(nodes[0].geometry.attributes).map(([name,a])=>({name,itemSize:a.itemSize,normalized:a.normalized,gpuType:a.gpuType,ArrayType:(a.array||a.data.array).constructor}));
  const vertexCount=nodes.reduce((sum,n)=>sum+n.geometry.attributes.position.count,0),indexCount=nodes.reduce((sum,n)=>sum+(n.geometry.index?.count??n.geometry.attributes.position.count),0);
  const arrays=Object.fromEntries(specs.map(s=>[s.name,new s.ArrayType(vertexCount*s.itemSize)])),indices=new (vertexCount>65535?Uint32Array:Uint16Array)(indexCount);let vertexOffset=0,indexOffset=0;
  for(const node of nodes){
   const matrix=relativeMatrix(node,scope),g=node.geometry.clone();g.applyMatrix4(matrix);const count=g.attributes.position.count;
   for(const spec of specs){const a=g.attributes[spec.name],out=arrays[spec.name];for(let i=0;i<count;i++)for(let c=0;c<spec.itemSize;c++)out[(vertexOffset+i)*spec.itemSize+c]=rawComponent(a,i,c);}
   const n=g.index?.count??count,mirrored=matrix.determinant()<0;
   for(let i=0;i<n;i+=3){const a=g.index?g.index.getX(i):i,b=g.index?g.index.getX(i+1):i+1,c=g.index?g.index.getX(i+2):i+2;indices[indexOffset++]=vertexOffset+a;indices[indexOffset++]=vertexOffset+(mirrored?c:b);indices[indexOffset++]=vertexOffset+(mirrored?b:c);}
   vertexOffset+=count;g.dispose();
  }
  const result=new T.BufferGeometry();for(const s of specs){const a=new T.BufferAttribute(arrays[s.name],s.itemSize,s.normalized);if(s.gpuType!==undefined)a.gpuType=s.gpuType;result.setAttribute(s.name,a);}result.setIndex(new T.BufferAttribute(indices,1));result.computeBoundingBox();result.computeBoundingSphere();return result;
 }
 function addBatch(scope,nodes){
  if(nodes.length<minMeshes)return;
  const first=nodes[0],mask=originalMask(first),geometry=mergedGeometry(nodes,scope),proxy=new T.Mesh(geometry,first.material),order=groupOrder(first,scope),container=new T.Group(),record={scope,container,proxy,geometry,geometryDisposed:false,records:[]};
  container.name='Static render order';container.renderOrder=order;container.userData={staticRenderBatch:true};proxies.add(container);scope.add(container);
  proxy.name='Static render batch';proxy.userData={staticRenderBatch:true};proxy.layers.mask=mask;proxy.castShadow=first.castShadow;proxy.receiveShadow=first.receiveShadow;proxy.renderOrder=first.renderOrder;proxy.frustumCulled=first.frustumCulled;proxy.raycast=()=>{};proxies.add(proxy);
  geometry.addEventListener('dispose',()=>{record.geometryDisposed=true;});
  const sharedGeometryStates=new Map();for(const node of nodes){watchTransforms(node,scope);if(!sharedGeometryStates.has(node.geometry))sharedGeometryStates.set(node.geometry,geometryState(node.geometry));const member={node,parent:node.parent,scope,mask:originalMask(node),material:node.material,materialSignature:materialSignature(node.material),materialVersion:node.material.version,castShadow:node.castShadow,receiveShadow:node.receiveShadow,renderOrder:node.renderOrder,frustumCulled:node.frustumCulled,groupOrder:order,geometryState:sharedGeometryStates.get(node.geometry)};record.records.push(member);members.set(node,member);node.layers.mask=sourceBit;}
  container.add(proxy);batches.add(record);
 }
 function removeBatch(batch){
  for(const record of batch.records){record.node.layers.mask=originalMask(record.node);members.delete(record.node);}
  batch.proxy.removeFromParent();if(batch.container!==batch.scope)batch.container.removeFromParent();if(!batch.geometryDisposed)batch.geometry.dispose();batches.delete(batch);
 }
 function batchScope(scope){
  const groups=new Map(),watch=new Map(),candidates=[];if(batchDescendants)scope.traverse(node=>{if(node!==scope&&!proxies.has(node))candidates.push(node);});else candidates.push(...scope.children);
  for(const node of candidates)if(eligible(node,scope,false)){const shown=visible(node,scope);watch.set(node,shown);if(shown&&!members.has(node)){const k=key(node,scope);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(node);}}
  watches.set(scope,watch);
  for(const group of groups.values()){let chunk=[],count=0;for(const node of group){const vertices=node.geometry.attributes.position.count;if(count+vertices>maxVertices&&chunk.length){addBatch(scope,chunk);chunk=[];count=0;}chunk.push(node);count+=vertices;}addBatch(scope,chunk);}
 }
 function collectScopes(){if(batchDescendants)return new Set(sourceRoots);const scopes=new Set();for(const root of sourceRoots)root.traverse(node=>{if(!proxies.has(node)&&node.children?.length)scopes.add(node);});return scopes;}
 function compactMaterial(material){const c=material.color,e=material.emissive;return[c?.r,c?.g,c?.b,e?.r,e?.g,e?.b,material.emissiveIntensity,material.opacity,material.transparent,material.visible,material.version];}
 function sameCompactMaterial(material,s){const c=material.color,e=material.emissive;return c?.r===s[0]&&c?.g===s[1]&&c?.b===s[2]&&e?.r===s[3]&&e?.g===s[4]&&e?.b===s[5]&&material.emissiveIntensity===s[6]&&material.opacity===s[7]&&material.transparent===s[8]&&material.visible===s[9]&&material.version===s[10];}
 function sourceChildCount(node){let count=0;for(let i=0;i<node.children.length;i++)if(!proxies.has(node.children[i]))count++;return count;}
 function sourceChildren(node){return node.children.filter(child=>!proxies.has(child));}
 function sameSourceChildren(node,children){let cursor=0;for(let i=0;i<node.children.length;i++)if(!proxies.has(node.children[i])){if(node.children[i]!==children[cursor++])return false;}return cursor===children.length;}
 function buildFastState(){
  if(validationMode!=='fast')return;const transforms=new Map(),visibility=new Map(),materials=new Map(),records=[],structure=new Map();
  function watch(map,node,scope,state){let record=map.get(node);if(!record){record={node,state,scopes:new Set()};map.set(node,record);}record.scopes.add(scope);}
  for(const [scope,candidates] of watches)for(const node of candidates.keys())for(let p=node;p;p=p.parent){watch(visibility,p,scope,p.visible);if(p===scope)break;}
  for(const batch of batches)for(const r of batch.records){records.push(r);watch(materials,r.material,r.scope,compactMaterial(r.material));for(let p=r.node;p&&p!==r.scope;p=p.parent)watch(transforms,p,r.scope,localState(p));}
  for(const scope of collectScopes())if(batchDescendants)scope.traverse(node=>{if(!proxies.has(node))watch(structure,node,scope,{parent:node.parent,children:sourceChildren(node)});});else{watch(structure,scope,scope,{parent:scope.parent,children:sourceChildren(scope)});}
  fastState={transforms:[...transforms.values()],visibility:[...visibility.values()],materials:[...materials.values()],records,structure:[...structure.values()]};recordCursor%=Math.max(1,records.length);nodeCursor%=Math.max(1,fastState.structure.length);
 }
 function markScopes(changed,record){for(const scope of record.scopes)changed.add(scope);}
 function fastUpdate(){
  resetCaches();const changed=new Set(),s=fastState;
  for(let i=0;i<s.visibility.length;i++){const r=s.visibility[i];if(r.node.visible!==r.state)markScopes(changed,r);}
  for(let i=0;i<s.materials.length;i++){const r=s.materials[i];if(!sameCompactMaterial(r.node,r.state))markScopes(changed,r);}
  for(let i=0;i<s.transforms.length;i++){const r=s.transforms[i],n=r.node,a=r.state,p=n.position,q=n.quaternion,z=n.scale;let dirty=n.parent!==a.parent||n.matrixAutoUpdate!==a.auto;if(!dirty)if(a.auto)dirty=p.x!==a.x||p.y!==a.y||p.z!==a.z||q.x!==a.qx||q.y!==a.qy||q.z!==a.qz||q.w!==a.qw||z.x!==a.sx||z.y!==a.sy||z.z!==a.sz;else for(let j=0;j<16;j++)if(n.matrix.elements[j]!==a.matrix[j]){dirty=true;break;}if(dirty)markScopes(changed,r);}
  for(let i=0;i<s.records.length;i++){const r=s.records[i],n=r.node;if(n.material!==r.material||n.layers.mask!==sourceBit||n.castShadow!==r.castShadow||n.receiveShadow!==r.receiveShadow||n.renderOrder!==r.renderOrder||n.frustumCulled!==r.frustumCulled)changed.add(r.scope);}
  for(let i=0,count=Math.min(s.records.length,Math.max(1,safetyRecordsPerUpdate|0));i<count;i++){const r=s.records[recordCursor++%s.records.length];if(!changed.has(r.scope)&&stateChanged(r))changed.add(r.scope);}
  for(let i=0,count=Math.min(s.structure.length,Math.max(1,safetyNodesPerUpdate|0));i<count;i++){const r=s.structure[nodeCursor++%s.structure.length];if(r.node.parent!==r.state.parent||!sameSourceChildren(r.node,r.state.children))markScopes(changed,r);}
  for(const batch of batches)if(batch.geometryDisposed||batch.proxy.parent!==batch.container||batch.container.parent!==batch.scope)changed.add(batch.scope);
  if(changed.size){for(const batch of [...batches])if(changed.has(batch.scope))removeBatch(batch);for(const scope of changed)batchScope(scope);buildFastState();}
 }
 function resetCaches(){materialCache=new Map();matrixCache=new Map();visibilityCache=new Map();syncedMatrices=new WeakSet();localChanges=new WeakMap();chainChanges=new Map();geometryChecks=new Map();interactionChecks=new WeakMap();}
 function refresh(){if(disposed)return api.stats();resetCaches();for(const batch of [...batches])removeBatch(batch);watches.clear();for(const scope of collectScopes())batchScope(scope);buildFastState();return api.stats();}
 function update(){
  if(disposed)return;if(validationMode==='fast'){fastUpdate();return;}resetCaches();const changed=new Set();for(const batch of batches)if(batch.geometryDisposed||batch.proxy.parent!==batch.container||batch.container!==batch.scope&&batch.container.parent!==batch.scope||batch.records.some(stateChanged))changed.add(batch.scope);
  for(const [scope,watch] of watches)if(!changed.has(scope))for(const [node,wasVisible] of watch)if(visible(node,scope)!==wasVisible){changed.add(scope);break;}
  for(const batch of [...batches])if(changed.has(batch.scope))removeBatch(batch);for(const scope of changed)batchScope(scope);
 }
 function setRoots(next){if(disposed)throw Error('Static batches have been disposed.');for(const batch of [...batches])removeBatch(batch);const unique=[...new Set(next)].filter(root=>root?.isObject3D);sourceRoots=unique.filter(root=>!unique.some(other=>{if(other===root)return false;for(let p=root.parent;p;p=p.parent)if(p===other)return true;return false;}));return refresh();}
 const api={update,refresh,setRoots,rescan(next){return next?setRoots(next):refresh();},register(...next){return setRoots([...sourceRoots,...next.flat()]);},unregister(root){return setRoots(sourceRoots.filter(item=>item!==root));},enableRaycaster:enableStaticSourceRays,get roots(){return sourceRoots.slice();},stats(){let originals=0,visibleOriginals=0,visibleBatches=0;for(const batch of batches){originals+=batch.records.length;visibleOriginals+=batch.records.filter(r=>visible(r.node,r.scope)).length;if(visible(batch.proxy,batch.scope))visibleBatches++;}return{batches:batches.size,visibleBatches,originalsBatched:originals,drawCallsSaved:visibleOriginals-visibleBatches,sourceLayer:STATIC_SOURCE_LAYER,sourceNodesRetained:true,includeStaticActions,mergeEquivalentMaterials,batchDescendants,validationMode,safetyRecordsPerUpdate,safetyNodesPerUpdate};},dispose(){if(disposed)return;for(const batch of [...batches])removeBatch(batch);sourceRoots=[];watches.clear();materialCache.clear();fastState=null;disposed=true;}};
 setRoots(roots);return api;
}
