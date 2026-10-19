/* Genuine multi-floor home rendering and custom-design layer.
 * House of Ideas commit 48ccb361e8e64857f4e9f94f4598d8dc97970e00.
 * Existing global Three r160 only; no renderer, iframe, backend or private state.
 * buildHouse(house,walk=true,exterior=true,{resolveAsset?,assetUrl?,onError?})
 * returns the original structure immediately plus ready Promise for actual GLBs.
 * resolveAsset(assetId) returns local/blob/data URL or Promise; default resolves
 * genuine bundled GLBs. Original limits/collision checks remain. No placeholders.
 * Rooms/ideas/doors/furniture/paintings/brightness/floors/stairwells/stairs retained.
 * built.setFloor/navigationHouse/walls/obstacles address the active floor; levels
 * retain every floor. All local coordinates use source grid x-10,z-8.
 * built.update(dt,{x,z}) animates its original front door, opening near visitors.
 * built.dispose releases owned resources; shared source procedural textures stay
 * cached until disposeSurfaceCache at application exit. Source rights remain
 * in the original CITY_SOURCES catalogue and source provenance below.
 */
(function(g){'use strict';
const THREE=g.THREE,S=g.CITY_SOURCES;
if(!S||THREE?.REVISION!=='160')throw Error('Load existing Three r160 and CITY_SOURCES before home-scene.js.');
const GLTFLoader=S.GLTFLoader,ARTISTS=S.ARTISTS;
const {sharedEdge,ideaDisplays,buildInterior,toggleHomeLight}=S;
let globalAssetResolver=null,houseAssetOptions={};
const centerOf=r=>({x:r.x+r.w/2-10,z:r.y+r.h/2-8,roomId:r.id});
function houseBounds(house){const minX=Math.min(...house.rooms.map(r=>r.x))-10,maxX=Math.max(...house.rooms.map(r=>r.x+r.w))-10,minZ=Math.min(...house.rooms.map(r=>r.y))-8,maxZ=Math.max(...house.rooms.map(r=>r.y+r.h))-8;return {minX,maxX,minZ,maxZ,w:maxX-minX,d:maxZ-minZ,cx:(minX+maxX)/2,cz:(minZ+maxZ)/2};}
function entranceFor(house){const ground=house.rooms.filter(room=>(room.floor??0)===0),rooms=ground.length?ground:house.rooms,b=houseBounds({...house,rooms}),room=rooms.filter(r=>r.y+r.h-8===b.maxZ).sort((a,c)=>Math.abs(centerOf(a).x-b.cx)-Math.abs(centerOf(c).x-b.cx))[0];return {roomId:room.id,x:centerOf(room).x,z:b.maxZ,width:1.5};}
function roomAtPoint(house,x,z,padding=0){return house.rooms.find(r=>x+10>=r.x+padding&&x+10<=r.x+r.w-padding&&z+8>=r.y+padding&&z+8<=r.y+r.h-padding)?.id||null;}
function reachableIds(house,start){const seen=new Set([start]),queue=[start];while(queue.length){const id=queue.shift();for(const d of house.doors){const next=d.a===id?d.b:d.b===id?d.a:null;if(next&&!seen.has(next)){seen.add(next);queue.push(next);}}}return [...seen];}
function roomRoute(house,start,end){
 if(start===end)return [start];const parents=new Map([[start,null]]),queue=[start];
 while(queue.length){const id=queue.shift();for(const d of house.doors){const next=d.a===id?d.b:d.b===id?d.a:null;if(!next||parents.has(next))continue;parents.set(next,id);if(next===end){const route=[end];while(parents.get(route[0])!==null)route.unshift(parents.get(route[0]));return route;}queue.push(next);}}
 return [];
}
function walkingRoute(house,start,roomId,target){
 const destination=house.rooms.find(r=>r.id===roomId);if(!destination)return [];
 const entrance=entranceFor(house),startRoom=roomAtPoint(house,start.x,start.z)||entrance.roomId,route=roomRoute(house,startRoom,roomId);if(!route.length)return [];
 const points=[];if(!roomAtPoint(house,start.x,start.z)){points.push({x:entrance.x,z:entrance.z+1.1,roomId:null},{x:entrance.x,z:entrance.z-.55,roomId:entrance.roomId});}
 for(let n=0;n<route.length;n++){
  const room=house.rooms.find(r=>r.id===route[n]);points.push(centerOf(room));if(n===route.length-1)continue;
  const next=house.rooms.find(r=>r.id===route[n+1]),edge=sharedEdge(room,next),mid=(edge.lo+edge.hi)/2;
  points.push({x:edge.axis==='x'?mid-10:edge.fixed-10,z:edge.axis==='z'?mid-8:edge.fixed-8,roomId:next.id,door:true});
 }
 if(target)points.push({x:target.x,z:target.z,roomId});return points;
}
function yardBounds(house){const b=houseBounds(house);return {minX:b.minX-8,maxX:b.maxX+8,minZ:b.minZ-5,maxZ:b.maxZ+14};}
function canExploreAt(house,walls,x,z,radius=.2){const b=yardBounds(house);if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(z+8-w.fixed):Math.abs(x+10-w.fixed),along=w.axis==='x'?x+10:z+8;return dist<radius&&along>w.lo-radius&&along<w.hi+radius;});}
// Furniture has a footprint: both residents and players use the same solid space.
function canOccupy(obstacles,x,z,radius=.2){return !obstacles.some(o=>x>o.minX-radius&&x<o.maxX+radius&&z>o.minZ-radius&&z<o.maxZ+radius);}
// Advance one small frame along already validated doorway waypoints.
function stepAlongPath(position,path,distance,canStand=()=>true){
 let remaining=distance,moved=0,heading=null;
 while(path.length&&remaining>0){const next=path[0],dx=next.x-position.x,dz=next.z-position.z,length=Math.hypot(dx,dz);if(length<.025){position.x=next.x;position.z=next.z;path.shift();continue;}
  const step=Math.min(remaining,length),nx=position.x+dx/length*step,nz=position.z+dz/length*step;if(!canStand(nx,nz))break;position.x=nx;position.z=nz;heading=Math.atan2(-dx,-dz);moved+=step;remaining-=step;if(step>=length-.001)path.shift();
 }return {moved,heading,finished:path.length===0};
}
// A bounded yard/doorway search is used only when entering from an arbitrary
// outdoor position. Residents use the smaller, explicit room-and-door graph.
function findWalkingPath(house,walls,start,target,spacing=.35,passable=null){
 const b=yardBounds(house),cols=Math.ceil((b.maxX-b.minX)/spacing),rows=Math.ceil((b.maxZ-b.minZ)/spacing),key=(x,z)=>z*cols+x;
 const cell=p=>({x:Math.max(0,Math.min(cols-1,Math.round((p.x-b.minX)/spacing))),z:Math.max(0,Math.min(rows-1,Math.round((p.z-b.minZ)/spacing)))}),world=p=>({x:b.minX+p.x*spacing,z:b.minZ+p.z*spacing});
 const from=cell(start),to=cell(target),queue=[from],parents=new Map([[key(from.x,from.z),null]]);let reached=false;
 for(let n=0;n<queue.length;n++){const current=queue[n];if(current.x===to.x&&current.z===to.z){reached=true;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const next={x:current.x+dx,z:current.z+dz},id=key(next.x,next.z);if(next.x<0||next.x>=cols||next.z<0||next.z>=rows||parents.has(id))continue;const p=world(next);if(!canExploreAt(house,walls,p.x,p.z,.22)||(passable&&!passable(p.x,p.z)))continue;parents.set(id,current);queue.push(next);}}
 if(!reached)return [];const route=[],cursor={...to};let prev;while((prev=parents.get(key(cursor.x,cursor.z)))!==null){route.unshift(world(cursor));cursor.x=prev.x;cursor.z=prev.z;}
 // Keep only turns to avoid a stop at every grid cell.
 const turns=[];for(let n=0;n<route.length;n++){if(n===route.length-1||n===0||Math.abs((route[n].x-route[n-1].x)*(route[n+1].z-route[n].z)-(route[n].z-route[n-1].z)*(route[n+1].x-route[n].x))>.001)turns.push(route[n]);}turns.push({x:target.x,z:target.z});return turns;
}

const PAINTINGS=Object.freeze(ARTISTS.flatMap(artist=>artist.works.map(work=>Object.freeze({...work,artistId:artist.id,artistName:artist.name}))));
const WORKS=new Map(PAINTINGS.map(work=>[work.id,work]));
const copy=value=>JSON.parse(JSON.stringify(value));
const identifier=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,60}$/.test(value);
const floorOf=room=>room?.floor??0;
const roomBrightness=room=>room?.brightness??75;
const floorLabel=level=>['Ground floor','First floor','Second floor'][level]??'Unknown floor';
const paintingWork=id=>WORKS.get(id)??null;


const {validateGlb,validateDesignObjects,isAssetId,DESIGN_LIMITS,DESIGN_ACTIONS}=(function(){
// Local designer contributions are data, never executable code or remote links.
const DESIGN_LIMITS=Object.freeze({bytes:12*1024*1024,objects:24,nodes:512,meshes:128,primitives:256,vertices:200000,triangles:200000,materials:128,images:32,textures:64,imagePixels:16777216,lights:4,drawCalls:512});
const DESIGN_ACTIONS=['read','question','experiment','reflect'];
const isAssetId=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const identifier=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,60}$/.test(value);
const finite=(value,min,max)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
function validateDesignObjects(input,rooms){
 if(!Array.isArray(input)||input.length>DESIGN_LIMITS.objects)throw Error('A home can display up to 24 designer objects.');
 const roomIds=new Set(rooms.map(room=>room.id)),ids=new Set();
 return input.map(item=>{
  if(!item||!identifier(item.id)||ids.has(item.id))throw Error('Every designer object needs a unique identifier.');ids.add(item.id);
  if(typeof item.title!=='string'||!item.title.trim()||item.title.length>100)throw Error('Designer titles need 1–100 characters.');
  if(!isAssetId(item.assetId))throw Error('Choose an imported local GLB asset.');
  if(!['room','garden'].includes(item.placement)||!['object','house'].includes(item.kind))throw Error('Choose an object in a room or a garden exhibit.');
  if(item.placement==='room'&&!roomIds.has(item.roomId))throw Error('Choose a room for the designer object.');
  if(item.kind==='house'&&item.placement!=='garden')throw Error('Imported houses belong in the garden as exhibits.');
  const action=item.action??'reflect',note=item.note??'',scale=item.scale??1,rotation=item.rotation??0,position=item.position??[0,0,0];
  if(!DESIGN_ACTIONS.includes(action))throw Error('Choose reading, questioning, experimenting or reflection.');
  if(typeof note!=='string'||note.length>6000)throw Error('Designer notes must be under 6,000 characters.');
  if(!finite(scale,.05,8)||!finite(rotation,-Math.PI,Math.PI))throw Error('Keep the object scale between 0.05 and 8 and rotation within one turn.');
  if(!Array.isArray(position)||position.length!==3||!finite(position[0],-40,40)||!finite(position[1],-2,8)||!finite(position[2],-40,40))throw Error('Keep the object position inside the local exhibit area.');
  return {id:item.id,title:item.title.trim(),assetId:item.assetId,placement:item.placement,kind:item.kind,...(item.placement==='room'?{roomId:item.roomId}:{}),action,note,scale,rotation,position:[...position]};
 });
}

const ALLOWED_EXTENSIONS=new Set(['KHR_materials_variants','KHR_materials_unlit','KHR_materials_clearcoat','KHR_materials_ior','KHR_materials_specular','KHR_materials_transmission','KHR_materials_volume','KHR_materials_sheen','KHR_materials_iridescence','KHR_materials_anisotropy','KHR_materials_emissive_strength','KHR_texture_transform','KHR_materials_pbrSpecularGlossiness','EXT_texture_webp','KHR_lights_punctual']);
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
function list(value,name,limit){if(value===undefined)return [];if(!Array.isArray(value)||value.length>limit)throw Error(`The GLB has too many or invalid ${name}.`);return value;}
function integer(value,min,max,message){if(!Number.isSafeInteger(value)||value<min||value>max)throw Error(message);return value;}
function extensionCheck(value,depth=0){
 if(depth>64)throw Error('The GLB metadata is nested too deeply.');
 if(typeof value==='number'&&!Number.isFinite(value))throw Error('The GLB metadata contains a non-finite number.');
 if(!value||typeof value!=='object')return;
 for(const [key,entry] of Object.entries(value)){
  if(key==='uri')throw Error('Export a self-contained GLB with embedded geometry and images; external or encoded URLs are not accepted.');
  if(['script','scripts','javascript'].includes(key.toLowerCase()))throw Error('Designer imports cannot contain scripts.');
  if(key==='extensions'){
   if(!object(entry)||Object.keys(entry).some(name=>!ALLOWED_EXTENSIONS.has(name)))throw Error('Export the GLB without compression or unsupported extensions.');
  }
  extensionCheck(entry,depth+1);
 }
}
function imageDimensions(bytes,mime){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(mime==='image/png'){
  if(bytes.length<24||view.getUint32(0)!==0x89504e47||view.getUint32(4)!==0x0d0a1a0a||view.getUint32(12)!==0x49484452)throw Error('The embedded PNG is invalid.');
  return [view.getUint32(16),view.getUint32(20)];
 }
 if(mime==='image/jpeg'){
  if(bytes.length<4||bytes[0]!==255||bytes[1]!==216)throw Error('The embedded JPEG is invalid.');
  let offset=2;
  while(offset+3<bytes.length){
   if(bytes[offset++]!==255)throw Error('The embedded JPEG header is invalid.');
   while(offset<bytes.length&&bytes[offset]===255)offset++;
   const marker=bytes[offset++];if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=215))continue;
   if(offset+2>bytes.length)break;const length=view.getUint16(offset);if(length<2||offset+length>bytes.length)break;
   if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){if(length<8)break;return [view.getUint16(offset+5),view.getUint16(offset+3)];}offset+=length;
  }
  throw Error('The embedded JPEG dimensions could not be read.');
 }
 // WebP dimensions use either the extended, lossless or lossy bitstream header.
 if(bytes.length<30||view.getUint32(0,true)!==0x46464952||view.getUint32(8,true)!==0x50424557)throw Error('The embedded WebP is invalid.');
 const kind=view.getUint32(12,true);
 if(kind===0x58385056)return [1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16),1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16)];
 if(kind===0x4c385056&&bytes[20]===0x2f){const bits=view.getUint32(21,true);return [(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];}
 if(kind===0x20385056&&bytes[23]===0x9d&&bytes[24]===1&&bytes[25]===0x2a)return [view.getUint16(26,true)&0x3fff,view.getUint16(28,true)&0x3fff];
 throw Error('The embedded WebP dimensions could not be read.');
}

/** Inspect bytes before GLTFLoader sees them. No browser or filesystem is needed. */
function validateGlb(input){
 const bytes=input instanceof Uint8Array?input:input instanceof ArrayBuffer?new Uint8Array(input):null;
 if(!bytes||bytes.byteLength<20||bytes.byteLength>DESIGN_LIMITS.bytes)throw Error('Choose a self-contained GLB file no larger than 12 MiB.');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==bytes.byteLength)throw Error('Choose a valid GLB version 2 file.');
 let offset=12,json=null,binary=null,chunks=0;
 while(offset<bytes.length){
  if(offset+8>bytes.length)throw Error('The GLB chunk header is incomplete.');
  const length=view.getUint32(offset,true),type=view.getUint32(offset+4,true);offset+=8;
  if(length%4||offset+length>bytes.length)throw Error('The GLB chunk length is invalid.');
  const chunk=bytes.subarray(offset,offset+length);offset+=length;
  if(chunks===0&&type===0x4e4f534a){try{json=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(chunk));}catch{throw Error('The GLB JSON chunk is invalid.');}}
  else if(chunks===1&&type===0x004e4942)binary=chunk;
  else throw Error('Use one GLB JSON chunk followed by one embedded binary chunk.');
  chunks++;
 }
 if(!object(json)||!object(json.asset)||json.asset.version!=='2.0'||!binary)throw Error('The GLB needs version 2 geometry embedded in its binary chunk.');
 extensionCheck(json);
 const lights=list(json.extensions?.KHR_lights_punctual?.lights,'lights',DESIGN_LIMITS.lights);
 for(const light of lights){if(!object(light)||!['point','spot','directional'].includes(light.type)||(light.intensity!==undefined&&!finite(light.intensity,0,10000))||(light.color!==undefined&&(!Array.isArray(light.color)||light.color.length!==3||light.color.some(value=>!finite(value,0,1)))))throw Error('Keep GLB lights within the local display limits.');}
 for(const name of [...list(json.extensionsUsed,'extensions',32),...list(json.extensionsRequired,'required extensions',32)])if(!ALLOWED_EXTENSIONS.has(name))throw Error('Export the GLB without compression or unsupported extensions.');
 if(json.animations!==undefined||json.skins!==undefined)throw Error('Export a static GLB without animations or skins for this exhibit.');
 const buffers=list(json.buffers,'buffers',1);
 if(buffers.length!==1||!object(buffers[0]))throw Error('The GLB needs one embedded binary buffer.');
 integer(buffers[0].byteLength,1,binary.length,'The embedded buffer length is invalid.');
 if(binary.length-buffers[0].byteLength>3)throw Error('The GLB binary padding is invalid.');
 const bufferViews=list(json.bufferViews,'buffer views',1024),accessors=list(json.accessors,'accessors',1024);
 for(const item of bufferViews){
  if(!object(item)||item.buffer!==0)throw Error('The GLB buffer view is invalid.');
  integer(item.byteOffset??0,0,buffers[0].byteLength,'The GLB buffer offset is invalid.');integer(item.byteLength,1,buffers[0].byteLength,'The GLB buffer view length is invalid.');
  if((item.byteOffset??0)+item.byteLength>buffers[0].byteLength)throw Error('The GLB buffer view exceeds its embedded buffer.');
  if(item.byteStride!==undefined&&(item.byteStride%4||item.byteStride<4||item.byteStride>252))throw Error('The GLB vertex stride is invalid.');
 }
 const components={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4},types={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};
 for(const item of accessors){
  if(!object(item)||!components[item.componentType]||!types[item.type]||item.sparse!==undefined)throw Error('Export GLB accessors without sparse or unsupported geometry.');
  const target=bufferViews[integer(item.bufferView,0,bufferViews.length-1,'The GLB accessor buffer view is invalid.')];
  const count=integer(item.count,1,DESIGN_LIMITS.vertices*3,'The GLB accessor count exceeds the geometry budget.'),element=components[item.componentType]*types[item.type];
  const start=integer(item.byteOffset??0,0,target.byteLength,'The GLB accessor offset is invalid.'),stride=target.byteStride??element;
  if(((target.byteOffset??0)+start)%components[item.componentType]||stride%components[item.componentType])throw Error('The GLB accessor component alignment is invalid.');
  if(stride<element||start+(count-1)*stride+element>target.byteLength)throw Error('The GLB accessor exceeds its buffer view.');
  for(const bounds of [item.min,item.max])if(bounds!==undefined&&(!Array.isArray(bounds)||bounds.length!==types[item.type]||bounds.some(value=>!Number.isFinite(value))))throw Error('The GLB accessor bounds are invalid.');
  if(item.componentType===5126){const source=new DataView(binary.buffer,binary.byteOffset,binary.byteLength),base=(target.byteOffset??0)+start;for(let row=0;row<count;row++)for(let component=0;component<types[item.type];component++)if(!finite(source.getFloat32(base+row*stride+component*4,true),-100000,100000))throw Error('The GLB contains invalid or excessively large vertex values.');}
 }
 const materials=list(json.materials,'materials',DESIGN_LIMITS.materials),images=list(json.images,'images',DESIGN_LIMITS.images),textures=list(json.textures,'textures',DESIGN_LIMITS.textures);
 let imagePixels=0;
 for(const item of images){
  if(!object(item)||!['image/png','image/jpeg','image/webp'].includes(item.mimeType))throw Error('Embed PNG, JPEG or WebP images in the GLB.');
  const target=bufferViews[integer(item.bufferView,0,bufferViews.length-1,'The embedded image buffer view is invalid.')],start=target.byteOffset??0;
  const [width,height]=imageDimensions(binary.subarray(start,start+target.byteLength),item.mimeType);imagePixels+=width*height;
  if(width<1||height<1||width>4096||height>4096||imagePixels>DESIGN_LIMITS.imagePixels)throw Error('Keep embedded textures within a total of 16 million pixels and 4096 pixels per side.');
 }
 for(const item of textures){if(!object(item))throw Error('The GLB texture is invalid.');const source=item.source??item.extensions?.EXT_texture_webp?.source;integer(source,0,images.length-1,'The GLB texture image is invalid.');}
 const meshes=list(json.meshes,'meshes',DESIGN_LIMITS.meshes),meshBudget=[],checkedPositions=new Set();let primitives=0,meshVertices=0,meshTriangles=0;
 if(!meshes.length)throw Error('The GLB needs at least one visible mesh.');
 for(const mesh of meshes){
  const parts=list(mesh?.primitives,'mesh primitives',DESIGN_LIMITS.primitives);if(!parts.length)throw Error('The GLB mesh needs geometry.');let vertices=0,triangles=0;
  for(const part of parts){
   if(++primitives>DESIGN_LIMITS.primitives)throw Error('The GLB has too many mesh primitives.');
   if(!object(part)||!object(part.attributes)||(part.mode??4)!==4||part.targets!==undefined)throw Error('Export static triangle geometry without morph targets.');
   const position=accessors[integer(part.attributes.POSITION,0,accessors.length-1,'Every GLB primitive needs positions.')];
   if(position.type!=='VEC3'||position.componentType!==5126)throw Error('GLB positions must be floating-point 3D vectors.');
   if(!checkedPositions.has(part.attributes.POSITION)){
    if(!position.min||!position.max)throw Error('GLB positions need accurate minimum and maximum bounds.');
    const target=bufferViews[position.bufferView],base=(target.byteOffset??0)+(position.byteOffset??0),stride=target.byteStride??12,source=new DataView(binary.buffer,binary.byteOffset,binary.byteLength),low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
    for(let row=0;row<position.count;row++)for(let axis=0;axis<3;axis++){const value=source.getFloat32(base+row*stride+axis*4,true);low[axis]=Math.min(low[axis],value);high[axis]=Math.max(high[axis],value);}
    for(let axis=0;axis<3;axis++)if(Math.abs(low[axis]-position.min[axis])>1e-4*Math.max(1,Math.abs(low[axis]))||Math.abs(high[axis]-position.max[axis])>1e-4*Math.max(1,Math.abs(high[axis])))throw Error('The GLB declared bounds do not match its vertex geometry.');
    checkedPositions.add(part.attributes.POSITION);
   }
   for(const [name,index] of Object.entries(part.attributes)){const accessor=accessors[integer(index,0,accessors.length-1,'The GLB vertex attribute is invalid.')];if(accessor.count!==position.count||name.startsWith('JOINTS_')||name.startsWith('WEIGHTS_'))throw Error('Export static matching vertex attributes without skeletal data.');}
   let indices=position.count;
   if(part.indices!==undefined){const accessor=accessors[integer(part.indices,0,accessors.length-1,'The GLB index accessor is invalid.')];if(accessor.type!=='SCALAR'||![5121,5123,5125].includes(accessor.componentType))throw Error('GLB triangle indices must be unsigned integers.');indices=accessor.count;const source=new DataView(binary.buffer,binary.byteOffset,binary.byteLength),target=bufferViews[accessor.bufferView],start=(target.byteOffset??0)+(accessor.byteOffset??0),size=components[accessor.componentType],stride=target.byteStride??size;for(let row=0;row<indices;row++){const at=start+row*stride,index=size===1?source.getUint8(at):size===2?source.getUint16(at,true):source.getUint32(at,true);if(index>=position.count)throw Error('A GLB triangle index points outside its vertex array.');}}
   if(indices%3)throw Error('The GLB triangle index count is invalid.');
   if(part.material!==undefined)integer(part.material,0,materials.length-1,'The GLB material reference is invalid.');
   vertices+=position.count;triangles+=indices/3;
  }
  meshBudget.push({vertices,triangles,drawCalls:parts.length});
  meshVertices+=vertices;meshTriangles+=triangles;
 }
 if(meshVertices>DESIGN_LIMITS.vertices||meshTriangles>DESIGN_LIMITS.triangles)throw Error('Keep all exhibit meshes under 200,000 vertices and 200,000 triangles.');
 const nodes=list(json.nodes,'nodes',DESIGN_LIMITS.nodes),scenes=list(json.scenes,'scenes',32);if(!nodes.length||!scenes.length)throw Error('The GLB needs a scene containing its mesh.');
 const parents=new Set();let vertices=0,triangles=0,drawCalls=0;
 for(const node of nodes){
  if(!object(node)||node.skin!==undefined||node.weights!==undefined)throw Error('Export static GLB nodes without skeletal or morph data.');
  for(const [name,size] of [['matrix',16],['translation',3],['rotation',4],['scale',3]])if(node[name]!==undefined&&(!Array.isArray(node[name])||node[name].length!==size||node[name].some(value=>!finite(value,-100000,100000))))throw Error('The GLB node transform is invalid.');
  if(node.matrix&&(node.matrix[3]!==0||node.matrix[7]!==0||node.matrix[11]!==0||node.matrix[15]!==1))throw Error('GLB node matrices must be affine transforms.');
  if(node.rotation&&Math.abs(node.rotation.reduce((total,value)=>total+value*value,0)-1)>1e-4)throw Error('GLB node rotations must be normalized quaternions.');
  if(node.extensions?.KHR_lights_punctual!==undefined)integer(node.extensions.KHR_lights_punctual.light,0,lights.length-1,'The GLB light reference is invalid.');
  if(node.mesh!==undefined){const budget=meshBudget[integer(node.mesh,0,meshes.length-1,'The GLB mesh reference is invalid.')];vertices+=budget.vertices;triangles+=budget.triangles;drawCalls+=budget.drawCalls;}
  for(const child of list(node.children,'child nodes',DESIGN_LIMITS.nodes)){integer(child,0,nodes.length-1,'The GLB child node is invalid.');if(parents.has(child))throw Error('A GLB node cannot have more than one parent.');parents.add(child);}
 }
 if(vertices<3||vertices>DESIGN_LIMITS.vertices||triangles>DESIGN_LIMITS.triangles)throw Error('Keep the exhibit under 200,000 vertices and 200,000 triangles.');
 if(drawCalls>DESIGN_LIMITS.drawCalls)throw Error('Keep the exhibit within 512 instanced mesh primitives (draw calls). Combine objects sharing a material before exporting.');
 const visited=new Set(),visiting=new Set();function visit(index,depth){if(depth>64||visiting.has(index))throw Error('The GLB node hierarchy is cyclic or too deep.');if(visited.has(index))return;visiting.add(index);for(const child of nodes[index].children??[])visit(child,depth+1);visiting.delete(index);visited.add(index);}
 for(let index=0;index<nodes.length;index++)visit(index,0);
 for(const scene of scenes){if(!object(scene))throw Error('The GLB scene is invalid.');const roots=list(scene.nodes,'scene roots',DESIGN_LIMITS.nodes),seen=new Set();for(const index of roots){integer(index,0,nodes.length-1,'The GLB scene root is invalid.');if(seen.has(index)||parents.has(index))throw Error('The GLB scene root is duplicated or also a child.');seen.add(index);}}
 const active=integer(json.scene??0,0,scenes.length-1,'The GLB active scene is invalid.');
 const visible=new Set();function visibleNode(index){if(visible.has(index))return;visible.add(index);for(const child of nodes[index].children??[])visibleNode(child);}for(const index of scenes[active].nodes??[])visibleNode(index);
 if(![...visible].some(index=>nodes[index].mesh!==undefined))throw Error('The active GLB scene needs a visible mesh.');
 return {bytes:bytes.byteLength,meshes:meshes.length,nodes:nodes.length,vertices,triangles,drawCalls,materials:materials.length,images:images.length};
}

return {validateGlb,validateDesignObjects,isAssetId,DESIGN_LIMITS,DESIGN_ACTIONS};})();
const toWorld=(x,y)=>new THREE.Vector3(x-10,0,y-8);
function roomCenter(r){return toWorld(r.x+r.w/2,r.y+r.h/2);}
function canStandAt(house,walls,x,z){const gx=x+10,gz=z+8,inside=house.rooms.some(r=>gx>=r.x&&gx<=r.x+r.w&&gz>=r.y&&gz<=r.y+r.h);if(!inside)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(gz-w.fixed):Math.abs(gx-w.fixed),along=w.axis==='x'?gx:gz;return dist<.2&&along>w.lo-.2&&along<w.hi+.2;});}
const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const surfaceTextures=new Map();
function surface(type,color,repeatX=1,repeatY=1){
 const material=mat(color,type==='wood'?.62:.88);if(typeof document==='undefined')return material;
 const cacheKey=[type,color,repeatX,repeatY].join(':');if(surfaceTextures.has(cacheKey)){material.color.set('#ffffff');material.map=material.bumpMap=surfaceTextures.get(cacheKey);material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;return material;}
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');let seed=913;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle=color;ctx.fillRect(0,0,512,512);
 if(type==='wood')for(let row=0;row<8;row++){const y=row*64;ctx.fillStyle=`rgba(${120+random()*50},${83+random()*30},${48+random()*25},.24)`;ctx.fillRect(0,y,512,64);for(let n=0;n<28;n++){ctx.beginPath();ctx.strokeStyle=`rgba(73,47,24,${.025+random()*.075})`;ctx.lineWidth=.4+random();let gy=y+random()*62;ctx.moveTo(0,gy);for(let x=0;x<=512;x+=24)ctx.lineTo(x,gy+Math.sin(x*.028+n)*1.7);ctx.stroke();}ctx.strokeStyle='rgba(74,49,29,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();const joint=(row%3)*170+45;ctx.fillStyle='rgba(75,45,22,.35)';ctx.fillRect(joint,y,1,64);}
 else if(type==='clay'||type==='stone'){const rows=type==='clay'?12:4,cols=type==='clay'?10:5,cw=512/cols,ch=512/rows;for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){const shade=random()*35,offset=row%2?cw/2:0;ctx.fillStyle=type==='clay'?`rgb(${135+shade},${74+shade*.7},${52+shade*.5})`:`rgb(${156+shade},${151+shade},${139+shade})`;ctx.fillRect(col*cw+offset+1,row*ch+1,cw-2,ch-2);ctx.strokeStyle='rgba(255,243,215,.09)';ctx.strokeRect(col*cw+offset+2,row*ch+2,cw-4,ch-4);}}
 for(let n=0;n<12000;n++){const alpha=type==='plaster'?.025:.05;ctx.fillStyle=random()>.5?`rgba(255,255,255,${alpha})`:`rgba(45,32,21,${alpha})`;ctx.fillRect(random()*512,random()*512,1+random()*2,1+random()*2);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.anisotropy=8;texture.userData.retainedSurface=true;surfaceTextures.set(cacheKey,texture);material.color.set('#ffffff');material.map=texture;material.bumpMap=texture;material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;material.userData.procedural=true;return material;
}
function box(group,w,h,d,x,y,z,material,data){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(data)o.userData=data;group.add(o);return o;}
function sphere(group,r,x,y,z,material){const o=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;}
function cylinder(group,r,h,x,y,z,material){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function beam(group,a,b,r,material){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),material);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());o.castShadow=true;group.add(o);return o;}
function label(text,color,scale=3){
 if(typeof document==='undefined')return new THREE.Group();
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.font='600 44px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text.length>30?text.slice(0,28)+'…':text,384,64,740);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:true}));sprite.scale.set(scale,scale/6,1);sprite.renderOrder=5;return sprite;
}
const bounds=houseBounds;
const layoutSignature=house=>JSON.stringify({rooms:house.rooms.map(({id,x,y,w,h})=>({id,x,y,w,h})),doors:house.doors});
function outside(house,r,axis,fixed,mid){const epsilon=.02;return !house.rooms.some(other=>other!==r&&(axis==='x'?mid>other.x&&mid<other.x+other.w&&((fixed===r.y&&fixed-epsilon>other.y&&fixed-epsilon<other.y+other.h)||(fixed===r.y+r.h&&fixed+epsilon>other.y&&fixed+epsilon<other.y+other.h)):mid>other.y&&mid<other.y+other.h&&((fixed===r.x&&fixed-epsilon>other.x&&fixed-epsilon<other.x+other.w)||(fixed===r.x+r.w&&fixed+epsilon>other.x&&fixed+epsilon<other.x+other.w))));}
function windowFrame(group,axis,fixed,center,side,width=1.52){
 const frame=surface('wood','#c2ab87'),glass=new THREE.MeshStandardMaterial({color:'#c5d9d9',roughness:.07,metalness:.14,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide}),cream=mat('#eee6d7'),shutter=surface('wood','#52664e'),x=axis==='x'?center-10:fixed-10+side*.025,z=axis==='z'?center-8:fixed-8+side*.025;
 const orient=(w,h,d,y,m,offset=0)=>box(group,axis==='x'?w:d,h,axis==='z'?w:d,x+(axis==='x'?offset:0),y,z+(axis==='z'?offset:0),m);
 for(const offset of [-width/2,width/2])orient(.075,1.2,.2,1.65,frame,offset);
 for(const y of [1.08,2.22])orient(width+.09,.09,.2,y,cream);
 const pane=orient(width-.07,1.04,.014,1.65,glass);pane.castShadow=false;pane.receiveShadow=false;pane.userData={window:true};
 orient(.045,1.12,.19,1.65,cream);orient(width,.04,.19,1.65,cream);orient(width+.3,.075,.35,1.015,cream);
 for(const direction of [-1,1]){const sx=x+(axis==='x'?direction*(width/2+.23):0),sz=z+(axis==='z'?direction*(width/2+.23):0);box(group,axis==='x'?.31:.11,1.15,axis==='z'?.31:.11,sx,1.65,sz,shutter);for(let n=0;n<7;n++)box(group,axis==='x'?.29:.13,.014,axis==='z'?.29:.13,sx,1.2+n*.14,sz,mat('#687a5d'));}
 const inside=-side*.17,linen=surface('plaster','#f3ebd9');linen.side=THREE.DoubleSide;
 for(const direction of [-1,1]){const cloth=new THREE.PlaneGeometry(.28,1.3,14,4),positions=cloth.attributes.position;for(let n=0;n<positions.count;n++)positions.setZ(n,Math.sin(positions.getX(n)*94)*.035);cloth.computeVertexNormals();const curtain=new THREE.Mesh(cloth,linen);curtain.position.set(x+(axis==='x'?direction*(width/2-.1):inside),1.65,z+(axis==='z'?direction*(width/2-.1):inside));if(axis==='z')curtain.rotation.y=Math.PI/2;curtain.castShadow=true;curtain.userData={curtain:true};group.add(curtain);}
 beam(group,new THREE.Vector3(x+(axis==='x'?-width/2-.18:inside),2.34,z+(axis==='z'?-width/2-.18:inside)),new THREE.Vector3(x+(axis==='x'?width/2+.18:inside),2.34,z+(axis==='z'?width/2+.18:inside)),.021,mat('#76614a'));
}
function plant(group,x,z,size=.5){const terracotta=mat('#a96548'),leaf=mat('#5e8462');cylinder(group,size*.48,size*.55,x,size*.275,z,terracotta);for(let n=0;n<3;n++){const a=n*2.1;sphere(group,size*.48,x+Math.cos(a)*size*.22,size*.7+Math.abs(Math.sin(a))*size*.25,z+Math.sin(a)*size*.22,leaf);}}
function physicalPlaque(group,text,w,x,y,z){
 box(group,w,.18,.045,x,y,z,mat('#81694e'));if(typeof document==='undefined')return;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#e8dfcb';ctx.fillRect(0,0,512,96);ctx.fillStyle='#554832';ctx.font='500 34px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,49,480);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.045,.145),new THREE.MeshBasicMaterial({map:texture}));face.position.set(x,y,z+.025);group.add(face);
}
function flowerBed(group,x,z,w,d){const soil=mat('#77654e'),leaf=mat('#617451');box(group,w,.08,d,x,-.09,z,soil);for(let n=0;n<Math.max(4,Math.floor(w*d*5));n++){const fx=x-w/2+.16+(n*.47)%(w-.24),fz=z-d/2+.12+(n*.31)%(d-.18);cylinder(group,.024,.24,fx,.12,fz,leaf);const petals=mat(['#e2cd8d','#d39981','#c0c5ad'][n%3]);for(let p=0;p<4;p++){const a=p*Math.PI/2;sphere(group,.06,fx+Math.cos(a)*.05,.26,fz+Math.sin(a)*.05,petals);}}}
function chair(group,x,z,color){const wood=mat('#99704c'),fabric=mat(color);box(group,.55,.13,.55,x,.48,z,fabric);box(group,.55,.6,.1,x,.81,z+.25,fabric);for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(group,.055,.45,.055,x+dx,.225,z+dz,wood);}
function bookshelf(group,x,z,width,color){const wood=mat('#9a7652');box(group,width,1.8,.3,x,.9,z,wood);for(const y of [.4,.9,1.4]){box(group,width+.04,.055,.4,x,y,z+.05,mat('#eddcc1'));for(let n=0;n<Math.floor(width*7);n++)box(group,.08,.28+(n%3)*.04,.21,x-width/2+.1+n*.14,y+.19,z+.18,mat([color,'#d6ad62','#526e69','#e4d4ac'][n%4]));}}
function furniture(group,r,walk){
 const x=r.x-10,z=r.y-8,c=roomCenter(r),wood=mat('#9a7652'),cream=mat('#eadfca'),accent=mat(r.color);
 const rug=box(group,Math.min(r.w-1,3.7),.018,Math.min(r.h-1,2.6),c.x,.015,c.z,mat(new THREE.Color(r.color).lerp(new THREE.Color('#ede2ca'),.55)));rug.userData={roomId:r.id};
 const deskX=x+.85,deskZ=z+r.h-.8;
 box(group,1.25,.11,.72,deskX,.76,deskZ,wood);for(const dx of [-.45,.45])for(const dz of [-.23,.23])box(group,.07,.72,.07,deskX+dx,.36,deskZ+dz,wood);
 chair(group,deskX,deskZ-.67,r.color);for(let n=0;n<3;n++)box(group,.34,.055,.24,deskX+.25,.84+n*.055,deskZ,mat(n===1?r.color:'#e5dcc8'));
 plant(group,x+r.w-.47,z+.48,.44);
 const theme=(r.id+' '+r.name).toLowerCase();
 if(/math|proof|pattern/.test(theme)){
  box(group,2.3,1.3,.11,c.x,1.5,z+.15,wood);box(group,2.15,1.15,.13,c.x,1.5,z+.17,mat('#304a43'));for(const dx of [-.93,.93])box(group,.075,.86,.075,c.x+dx,.43,z+.15,wood);
  const chalk=mat('#eee8d4');beam(group,new THREE.Vector3(c.x-.65,1.13,z+.25),new THREE.Vector3(c.x+.6,1.15,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x+.6,1.15,z+.25),new THREE.Vector3(c.x-.1,1.92,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x-.1,1.92,z+.25),new THREE.Vector3(c.x-.65,1.13,z+.25),.017,chalk);
 }else if(/art|image|design/.test(theme)){
  const ex=x+r.w-.9,ez=z+r.h-.85;beam(group,new THREE.Vector3(ex-.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);beam(group,new THREE.Vector3(ex+.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);box(group,.95,.95,.09,ex,1.3,ez-.04,cream);box(group,.68,.65,.02,ex,1.3,ez-.095,accent);sphere(group,.19,ex-.12,1.36,ez-.11,mat('#e7c26e'));
 }else if(/learning|read|knowledge/.test(theme)){
  bookshelf(group,x+.9,z+.28,Math.min(r.w*.3,1.5),r.color);chair(group,x+r.w-.9,z+r.h-1.1,'#75968b');cylinder(group,.37,.47,x+r.w-1.75,.235,z+r.h-1.1,wood);
 }else if(/question|philos|reflect/.test(theme)){
  const seatX=x+r.w-1.4;chair(group,seatX-.6,z+1.2,r.color);chair(group,seatX+.55,z+1.2,'#d7bd83');cylinder(group,.45,.6,seatX,.3,z+1.7,wood);cylinder(group,.5,.08,seatX,.64,z+1.7,cream);
 }else if(/connect|together/.test(theme)){
  const lounge=new THREE.Group();lounge.position.set(x+r.w-.5,0,z+r.h/2);lounge.rotation.y=-Math.PI/2;group.add(lounge);box(lounge,2.5,.65,.78,0,.46,0,accent);box(lounge,2.5,.62,.2,0,.85,-.34,accent);for(const dx of [-.7,.7])box(lounge,.48,.15,.48,dx,.84,.01,cream);cylinder(lounge,.6,.42,0,.21,.86,wood);
 }else{
  box(group,1.55,1,.13,c.x,1.55,z+.13,wood);box(group,1.42,.88,.15,c.x,1.55,z+.15,cream);for(const dx of [-.65,.65])box(group,.06,1.05,.06,c.x+dx,.525,z+.13,wood);for(let n=0;n<6;n++)box(group,.27,.23,.02,c.x-.5+(n%3)*.5,1.32+Math.floor(n/3)*.4,z+.24,mat(['#cc9f65',r.color,'#a7baa5'][n%3]));
 }
 if(walk){const plaque=label(r.name,'#253c35',Math.min(r.w*.68,3.2));plaque.position.set(c.x,2.4,z+.32);group.add(plaque);}
}
function architecture(group,house,enclosed,obstacles=[]){
 const b=bounds(house),e=entranceFor(house),floor=house.residenceFloor||0;
 if(floor===0)box(group,b.w+.22,.2,b.d+.22,b.cx,-.15,b.cz,mat('#bdb09b'));
 let door=null;
 if(floor===0){
  box(group,3.1,.12,1.6,e.x,-.01,e.z+.8,mat('#c6bda8'));for(let n=0;n<12;n++)box(group,1.5,.04,.6,e.x,-.06,e.z+1.9+n*.62,mat('#c6bda8'));
  plant(group,e.x-1.3,e.z+.9,.52);plant(group,e.x+1.3,e.z+.9,.52);obstacles.push({minX:e.x-1.58,maxX:e.x-1.02,minZ:e.z+.62,maxZ:e.z+1.18,label:'Porch planter'},{minX:e.x+1.02,maxX:e.x+1.58,minZ:e.z+.62,maxZ:e.z+1.18,label:'Porch planter'});
  if(enclosed){const leaf=new THREE.Group();leaf.position.set(e.x-.74,0,e.z+.075);group.add(leaf);box(leaf,1.43,2.13,.095,.715,1.065,0,mat('#58614c'));box(leaf,1.08,.37,.028,.715,1.77,.061,mat('#ccd9d5'));sphere(leaf,.05,1.2,1.08,.1,mat('#c4ad74'));leaf.traverse(o=>o.userData={door:true,label:'Front door'});door={leaf,x:e.x,z:e.z+.075,open:false};physicalPlaque(group,'Socrates · House of Ideas',1.9,e.x+1.75,1.5,e.z+.13);}
 }
 if(enclosed){for(const roofRoom of house.residenceRoofRooms||[null]){const rb=roofRoom?bounds({rooms:[roofRoom]}):b;
  if(floor<(house.residenceFloors||1)-1){box(group,rb.w-.08,.12,rb.d-.08,rb.cx,2.985,rb.cz,surface('clay','#a98a6c',rb.w/2,rb.d/2),{roof:true,flatRoof:true});continue;}
  const half=rb.d/2+.28,rise=Math.min(2.7,Math.max(1.15,rb.d*.23)),angle=Math.atan2(rise,half),length=Math.hypot(half,rise),roofY=3.05;
  for(const side of [-1,1]){const roof=box(group,rb.w+.36,.15,length,rb.cx,roofY+rise/2,rb.cz+side*half/2,surface('clay','#ab7151',(rb.w+.36)/2,length/2),{roof:true});roof.rotation.x=side*angle;}
  const shape=new THREE.Shape();shape.moveTo(-rb.d/2,2.85);shape.lineTo(rb.d/2,2.85);shape.lineTo(0,roofY+rise-.08);shape.closePath();for(const x of [rb.minX,rb.maxX]){const gable=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:false}),mat('#e4d5ba'));gable.rotation.y=Math.PI/2;gable.position.set(x,0,rb.cz);gable.userData={roof:true};group.add(gable);}}
 }
 return door;
}
function buildFloor(house,walk=false,exterior=false){
 const group=new THREE.Group(),interior=new THREE.Group(),walls=[],floors=[],objects=[],ceilings=[],obstacles=[],interactions=[],entry=entranceFor(house);group.add(interior);interior.visible=!exterior||walk;
 const wallMaterial=surface('plaster','#e9e0cf',3,2),trim=mat('#eee7d9'),skirting=surface('wood','#a8916e'),height=walk||exterior?2.8:.78;
 const edges=house.doors.map(d=>({edge:sharedEdge(house.rooms.find(r=>r.id===d.a),house.rooms.find(r=>r.id===d.b)),...d})),wallKeys=new Set();
 function wall(axis,fixed,lo,hi,room){
  const relevant=edges.filter(d=>(d.a===room.id||d.b===room.id)&&d.edge?.axis===axis&&d.edge.fixed===fixed);
  const holes=relevant.map(d=>{const center=(d.edge.lo+d.edge.hi)/2;return [center-.75,center+.75];});if(!house.residenceFloor&&axis==='x'&&fixed===entry.z+8&&room.id===entry.roomId)holes.push([entry.x+10-.75,entry.x+10+.75]);holes.sort((a,b)=>a[0]-b[0]);
  const segments=[];let cursor=lo;for(const [a,b] of holes){if(a>cursor)segments.push([cursor,a]);cursor=Math.max(cursor,b);}if(cursor<hi)segments.push([cursor,hi]);
  for(const [a,b] of segments){const key=[axis,fixed,a,b].join(':');if(wallKeys.has(key)||b-a<.02)continue;wallKeys.add(key);const center=(a+b)/2,x=axis==='x'?center-10:fixed-10,z=axis==='z'?center-8:fixed-8;
   const paintingWall=(house.residencePaintingPlacements||[]).some(p=>p.axis===axis&&p.fixed===fixed&&p.center>a&&p.center<b),window=!paintingWall&&(walk||exterior)&&b-a>=2.2&&outside(house,room,axis,fixed,center),windowWidth=Math.min(1.6,b-a-1.1);
   const wallBox=(from,to,bottom,top)=>{const m=(from+to)/2;return box(group,axis==='x'?to-from:.15,top-bottom,axis==='z'?to-from:.15,axis==='x'?m-10:x,(top+bottom)/2,axis==='z'?m-8:z,wallMaterial,{roomId:room.id});};
   if(window){const half=windowWidth/2;wallBox(a,center-half,0,height);wallBox(center+half,b,0,height);wallBox(center-half,center+half,0,1.08);wallBox(center-half,center+half,2.22,height);const side=axis==='x'?(fixed===room.y?-1:1):(fixed===room.x?-1:1);windowFrame(group,axis,fixed,center,side,windowWidth);}else wallBox(a,b,0,height);
   box(group,axis==='x'?b-a+.03:.2,.06,axis==='z'?b-a+.03:.2,x,height+.03,z,trim);box(group,axis==='x'?b-a:.17,.11,axis==='z'?b-a:.17,x,.055,z,skirting);walls.push({axis,fixed,lo:a,hi:b});
  }
  for(const [a,b] of holes){const key='door:'+axis+fixed+':'+a;if(wallKeys.has(key))continue;wallKeys.add(key);const c=(a+b)/2,x=axis==='x'?c-10:fixed-10,z=axis==='z'?c-8:fixed-8;
   if(walk||exterior)box(group,axis==='x'?1.5:.18,.65,axis==='z'?1.5:.18,x,2.475,z,wallMaterial);
   box(group,axis==='x'?1.5:.18,.025,axis==='z'?1.5:.18,x,.04,z,mat('#e0b46c'));
   for(const direction of [-1,1])box(group,axis==='x'?.09:.19,Math.min(height,2.15),axis==='z'?.09:.19,x+(axis==='x'?direction*.75:0),Math.min(height,2.15)/2,z+(axis==='z'?direction*.75:0),trim);
  }
 }
 for(const r of house.rooms){
  const c=roomCenter(r),tile=r.id==='work'||r.id==='learning',floor=box(group,r.w-.03,.12,r.h-.03,c.x,-.055,c.z,surface(tile?'stone':'wood',tile?'#c4bcaa':'#b19a73',r.w/(tile?2.2:3),r.h/(tile?2.2:2)),{roomId:r.id});floors.push(floor);
  wall('x',r.y,r.x,r.x+r.w,r);wall('x',r.y+r.h,r.x,r.x+r.w,r);wall('z',r.x,r.y,r.y+r.h,r);wall('z',r.x+r.w,r.y,r.y+r.h,r);
  if(!walk){const roomLabel=label(r.name.toUpperCase(),'#334d42',Math.min(r.w*.78,4.6));roomLabel.position.set(c.x,.15,r.y-8+.6);roomLabel.userData={roomId:r.id};interior.add(roomLabel);}const domestic=buildInterior(house,r,THREE,{walk});domestic.group.userData.roomId=r.id;interior.add(domestic.group);obstacles.push(...domestic.obstacles);interactions.push(...domestic.interactions);
  if(walk||exterior){const ceiling=box(group,r.w+.025,.13,r.h+.025,c.x,2.865,c.z,surface('plaster','#f2eadc',2,2));ceiling.userData={ceiling:true,roomId:r.id};ceilings.push(ceiling);const stairRoom=(house.stairs||[]).some(s=>s.a===r.id||s.b===r.id),lightX=c.x+(stairRoom?Math.min(.9,r.w/2-.45):0),lightZ=c.z+(stairRoom?Math.min(1.1,r.h/2-.45):0);cylinder(group,.22,.065,lightX,2.73,lightZ,mat('#766a55'));cylinder(group,.17,.045,lightX,2.69,lightZ,new THREE.MeshStandardMaterial({color:'#f3e6c5',emissive:'#ffdfac',emissiveIntensity:.8,roughness:.5}));const lamp=new THREE.PointLight('#ffe1b5',5.5,8,2);lamp.position.set(lightX,2.58,lightZ);lamp.userData={roomId:r.id,roomLight:true};group.add(lamp);}
  const display=ideaDisplays(house,r);for(const cabinet of display.cabinets){const rack=new THREE.Group();rack.position.set(cabinet.x,0,cabinet.z);rack.rotation.y=cabinet.yaw;interior.add(rack);const wood=surface('wood','#9c7d57');box(rack,cabinet.width,2.2,.035,0,1.15,-cabinet.depth/2,wood);for(const dx of [-cabinet.width/2,cabinet.width/2])box(rack,.025,2.24,cabinet.depth,dx,1.14,0,wood);for(const y of [.1,.55,1.17,1.79,2.24])box(rack,cabinet.width,.035,cabinet.depth,0,y,0,wood);obstacles.push({...cabinet,roomId:r.id,label:'Idea display cabinet'});}
  display.slots.forEach(slot=>{
   const {idea,x,z,y,scale}=slot,data={ideaId:idea.id,roomId:r.id};
   const base=slot.pedestal?box(interior,.65,.46,.65,x,.23,z,surface('wood','#b1a080'),data):box(interior,.4,.025,.32,x,slot.shelf+.027,z,mat('#bda785'),data);objects.push(base);if(slot.pedestal)obstacles.push({minX:x-.33,maxX:x+.33,minZ:z-.33,maxZ:z+.33,roomId:r.id,label:idea.title});
   let geometry,rotation=null;if(idea.cue==='crystal')geometry=new THREE.OctahedronGeometry(.43);if(idea.cue==='sphere')geometry=new THREE.SphereGeometry(.34,24,16);if(idea.cue==='ring')geometry=new THREE.TorusGeometry(.32,.095,14,40);if(idea.cue==='book'){geometry=new THREE.BoxGeometry(.54,.13,.4);rotation=[.1,0,.13];}
   const object=new THREE.Mesh(geometry,idea.cue==='book'?mat('#e4dbc5'):mat(r.color,.28,.2));object.position.set(x,y,z);object.scale.setScalar(scale);if(rotation)object.rotation.set(...rotation);object.castShadow=true;object.userData=data;interior.add(object);objects.push(object);
   if(idea.cue==='book'){for(const direction of [-1,1])box(object,.575,.017,.43,0,direction*.078,0,mat(r.color));box(object,.028,.17,.43,-.276,0,0,mat(r.color));for(let n=0;n<4;n++)box(object,.49,.003,.007,.015,-.035+n*.023,.203,mat('#bdb397'));for(let n=0;n<3;n++)box(object,.27-n*.03,.003,.012,.04,.09,-.075+n*.055,mat('#cab886'));}
   if(idea.cue==='sphere'){for(const tilt of [0,Math.PI/2]){const band=new THREE.Mesh(new THREE.TorusGeometry(.343,.01,6,36),mat('#b6a47c',.35,.5));band.rotation.x=tilt;object.add(band);}}
   object.traverse(part=>{part.userData=data;});const title=label(idea.title,'#1d3744',display.dense?.85:Math.min(r.w/3*.93,3.3));title.position.set(x,y+.6*scale,z);title.userData=data;title.visible=!walk;interior.add(title);objects.push(title);
  });
 }
 // Approved additions get separate free floor slots. Existing furnishings are
 // soft obstacles; door openings and previously installed additions stay clear.
 const installedBounds=[],baseBounds=[];interior.updateMatrixWorld(true);interior.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o);if(b.max.y>.1)baseBounds.push(b);}});
 const overlaps=(a,b,padding=0)=>a.min.x<b.max.x+padding&&a.max.x>b.min.x-padding&&a.min.z<b.max.z+padding&&a.max.z>b.min.z-padding;
 for(const feature of house.resident?.roomFeatures||[]){const r=house.rooms.find(room=>room.id===feature.roomId);if(!r)continue;const x=0,z=0,wood=mat('#93714e'),linen=mat('#e4d7be'),accent=mat(r.color);const installed=new THREE.Group();installed.userData={featureId:feature.id,roomId:r.id};interior.add(installed);
  if(feature.type==='reflection_lamp'){cylinder(installed,.23,.05,x,.03,z,wood);cylinder(installed,.035,1.65,x,.87,z,wood);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.38,.32,20),linen);shade.position.set(x,1.7,z);installed.add(shade);sphere(installed,.1,x,1.6,z,new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#eab466',emissiveIntensity:1}));const glow=new THREE.PointLight('#ffd49a',3,3,2);glow.position.set(x,1.45,z);installed.add(glow);}
  if(feature.type==='question_board'){box(installed,1.15,1.03,.11,x,1.38,z,wood);box(installed,1.02,.9,.13,x,1.38,z-.015,linen);for(const dx of [-.44,.44])box(installed,.07,.9,.07,x+dx,.45,z,wood);for(let n=0;n<3;n++)box(installed,.2,.16,.02,x-.3+n*.3,1.36,z-.09,accent);}
  if(feature.type==='experiment_table'){box(installed,1.25,.1,.75,x,.73,z,wood);for(const dx of [-.47,.47])for(const dz of [-.23,.23])box(installed,.06,.68,.06,x+dx,.34,z+dz,wood);sphere(installed,.15,x-.3,.94,z,accent);cylinder(installed,.12,.32,x+.25,.94,z,linen);}
  if(feature.type==='discussion_circle'){chair(installed,x-.4,z, r.color);chair(installed,x+.38,z-.65,'#b69b77');cylinder(installed,.36,.44,x-.25,.22,z-.5,wood);}
  const local=new THREE.Box3().setFromObject(installed),size=local.getSize(new THREE.Vector3()),center=local.getCenter(new THREE.Vector3()),left=r.x-10,top=r.y-8;
  const portals=house.doors.filter(d=>d.a===r.id||d.b===r.id).map(d=>sharedEdge(r,house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)))).filter(Boolean);
  if(r.id===entry.roomId)portals.push({axis:'x',fixed:entry.z+8,lo:entry.x+10-.75,hi:entry.x+10+.75,entry:true});
  const doorBounds=portals.map(edge=>{const c=(edge.lo+edge.hi)/2;return edge.axis==='x'?{min:{x:c-10-.8,z:edge.fixed-8-.48},max:{x:c-10+.8,z:edge.fixed-8+.48}}:{min:{x:edge.fixed-10-.48,z:c-8-.8},max:{x:edge.fixed-10+.48,z:c-8+.8}};});
  for(const area of house.residenceKeepouts||[])if(area.roomId===r.id)doorBounds.push({min:{x:area.minX-.2,z:area.minZ-.2},max:{x:area.maxX+.7,z:area.maxZ+.2}});
  for(const action of interactions){const data=action.userData||action;if(data.roomId===r.id&&data.anchor)doorBounds.push({min:{x:data.anchor.x-.34,z:data.anchor.z-.34},max:{x:data.anchor.x+.34,z:data.anchor.z+.34}});}
  const base=baseBounds.filter(b=>b.max.x>left&&b.min.x<left+r.w&&b.max.z>top&&b.min.z<top+r.h),preferred={question_board:[.18,.24],reflection_lamp:[.83,.8],experiment_table:[.73,.25],discussion_circle:[.3,.7]}[feature.type]||[.5,.5];
  let placement=null;
  for(let attempt=0;attempt<8&&!placement;attempt++){
   const scale=Math.min(1,Math.min(r.w,r.h)/5)*Math.pow(.87,attempt),hw=size.x*scale/2,hd=size.z*scale/2,minX=left+.16+hw,maxX=left+r.w-.16-hw,minZ=top+.16+hd,maxZ=top+r.h-.16-hd;
   const xs=[minX,maxX,THREE.MathUtils.clamp(left+r.w*preferred[0],minX,maxX)],zs=[minZ,maxZ,THREE.MathUtils.clamp(top+r.h*preferred[1],minZ,maxZ)];for(let px=minX;px<=maxX;px+=.28)xs.push(px);for(let pz=minZ;pz<=maxZ;pz+=.28)zs.push(pz);
   let best=null;for(const px of xs)for(const pz of zs){const b={min:{x:px-hw,z:pz-hd},max:{x:px+hw,z:pz+hd}};if(installedBounds.some(other=>overlaps(b,other,.04))||doorBounds.some(door=>overlaps(b,door)))continue;
    const overlapArea=base.reduce((sum,other)=>sum+(overlaps(b,other)?Math.max(0,Math.min(b.max.x,other.max.x)-Math.max(b.min.x,other.min.x))*Math.max(0,Math.min(b.max.z,other.max.z)-Math.max(b.min.z,other.min.z)):0),0),score=overlapArea*100+Math.hypot(px-(left+r.w*preferred[0]),pz-(top+r.h*preferred[1]));
    if(!best||score<best.score)best={px,pz,scale,score,b};
   }placement=best;
  }
  if(placement){installed.scale.set(placement.scale,Math.max(.8,placement.scale),placement.scale);installed.position.set(placement.px-center.x*placement.scale,0,placement.pz-center.z*placement.scale);installedBounds.push(placement.b);installed.userData.anchor={x:placement.px,z:placement.pz};obstacles.push({minX:placement.b.min.x,maxX:placement.b.max.x,minZ:placement.b.min.z,maxZ:placement.b.max.z,roomId:r.id,label:feature.type});}
  else{interior.remove(installed);}
 }
 const frontDoor=architecture(group,house,exterior||walk,obstacles);return {group,walls,floors,objects,ceilings,obstacles,interactions,frontDoor,entrance:entry};
}

const FLOOR_HEIGHT=3.4;
function floorHouse(house,level=0){const rooms=house.rooms.filter(r=>floorOf(r)===level),ids=new Set(rooms.map(r=>r.id));return {...house,rooms,doors:house.doors.filter(d=>ids.has(d.a)&&ids.has(d.b)),ideas:house.ideas.filter(i=>ids.has(i.roomId)),resident:house.resident?{...house.resident,roomFeatures:(house.resident.roomFeatures||[]).filter(f=>ids.has(f.roomId))}:undefined,residenceFloor:level,residenceFloors:house.residence?.floors||1};}
function stairLanding(house,stairs,level){
 const a=house.rooms.find(r=>r.id===stairs.a),b=house.rooms.find(r=>r.id===stairs.b);if(!a||!b||![floorOf(a),floorOf(b)].includes(level))return null;
 const left=Math.max(a.x,b.x)-10,right=Math.min(a.x+a.w,b.x+b.w)-10,top=Math.max(a.y,b.y)-8,bottom=Math.min(a.y+a.h,b.y+b.h)-8,x=(left+right)/2,z=(top+bottom)/2;
 return {x:x+.5,z,centerX:x,centerZ:z,floor:level,roomId:floorOf(a)===level?a.id:b.id,toFloor:floorOf(a)===level?floorOf(b):floorOf(a),stairsId:stairs.id};
}
function cutSlab(mesh,room,cuts){
 if(!cuts.length)return;const width=room.w-.025,depth=room.h-.025,thickness=.13,cx=room.x+room.w/2-10,cz=room.y+room.h/2-8,shape=new THREE.Shape();shape.moveTo(-width/2,-depth/2);shape.lineTo(width/2,-depth/2);shape.lineTo(width/2,depth/2);shape.lineTo(-width/2,depth/2);shape.closePath();
 for(const cut of cuts){const x=cut.centerX-.4-cx,z=-(cut.centerZ-cz),w=.78,d=1.78;if(Math.abs(x)+w/2>=width/2||Math.abs(z)+d/2>=depth/2)continue;const hole=new THREE.Path();hole.moveTo(x-w/2,z-d/2);hole.lineTo(x-w/2,z+d/2);hole.lineTo(x+w/2,z+d/2);hole.lineTo(x+w/2,z-d/2);hole.closePath();shape.holes.push(hole);}
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:false});geometry.rotateX(-Math.PI/2);geometry.translate(0,-thickness/2,0);mesh.geometry.dispose();mesh.geometry=geometry;mesh.userData.stairwell=true;
}
function roomOfNode(node){for(let n=node;n;n=n.parent)if(n.userData.roomId)return n.userData.roomId;return null;}
function applyBrightness(built,house){
 const copies=new Map();built.group.traverse(node=>{const room=house.rooms.find(r=>r.id===roomOfNode(node));if(!room)return;const fraction=roomBrightness(room)/100;node.userData.brightness=roomBrightness(room);
 if(node.isPointLight){node.intensity*=fraction*1.3;node.userData.configuredIntensity=node.intensity;return;}if(!node.material)return;const single=Array.isArray(node.material)?node.material:[node.material],next=single.map(material=>{const key=room.id+':'+material.uuid;if(!copies.has(key)){const copy=material.clone();copy.color?.multiplyScalar(.2+fraction*.8);if(copy.emissiveIntensity){copy.emissiveIntensity*=fraction;node.userData.configuredEmissive=copy.emissiveIntensity;}copies.set(key,copy);}return copies.get(key);});node.material=Array.isArray(node.material)?next:next[0];
 });
}
function paintingPlacements(house,room){
 const entry=entranceFor(house),edges=[{axis:'z',fixed:room.x+room.w,lo:room.y,hi:room.y+room.h,side:-1},{axis:'x',fixed:room.y,lo:room.x,hi:room.x+room.w,side:1},{axis:'z',fixed:room.x,lo:room.y,hi:room.y+room.h,side:1},{axis:'x',fixed:room.y+room.h,lo:room.x,hi:room.x+room.w,side:-1}],result=[];let workIndex=0;
 for(const wall of edges){
  const holes=house.doors.filter(d=>d.a===room.id||d.b===room.id).map(d=>sharedEdge(room,house.rooms.find(r=>r.id===(d.a===room.id?d.b:d.a)))).filter(edge=>edge?.axis===wall.axis&&edge.fixed===wall.fixed).map(edge=>{const center=(edge.lo+edge.hi)/2;return [center-.75,center+.75];});if(!house.residenceFloor&&wall.axis==='x'&&wall.fixed===entry.z+8&&room.id===entry.roomId)holes.push([entry.x+10-.75,entry.x+10+.75]);holes.sort((a,b)=>a[0]-b[0]);
  const spans=[];let cursor=wall.lo;for(const [a,b] of holes){if(a>cursor)spans.push([cursor,a]);cursor=Math.max(cursor,b);}if(cursor<wall.hi)spans.push([cursor,wall.hi]);
  for(const [lo,hi]of spans){const available=Math.max(0,Math.floor((hi-lo-.18)/1.15)),count=Math.min(available,(room.paintings||[]).length-workIndex);for(let n=0;n<count;n++)result.push({...wall,lo,hi,roomId:room.id,workId:room.paintings[workIndex++],center:lo+(n+.5)*(hi-lo)/count});if(workIndex===(room.paintings||[]).length)return result;}
 }
 return result;
}
function painting(group,room,placement){
 const {workId,axis,fixed,center,side}=placement,work=paintingWork(workId);if(!work)return null;const data={homeAction:'painting',workId,roomId:room.id,label:'Inspect “'+work.title+'”',paintingWall:{axis,fixed,center,lo:placement.lo,hi:placement.hi}},x=axis==='z'?fixed-10+side*.115:center-10,z=axis==='x'?fixed-8+side*.115:center-8,root=new THREE.Group();root.position.set(x,1.72,z);root.rotation.y=axis==='z'?side*Math.PI/2:side>0?0:Math.PI;root.userData=data;group.add(root);
 box(root,1.04,.98,.075,0,0,0,mat('#806144'),data);box(root,.91,.85,.04,0,0,.044,mat('#f6eee1'),data);const face=new THREE.Mesh(new THREE.PlaneGeometry(.81,.75),new THREE.MeshBasicMaterial({color:'#c3c0a2',toneMapped:false}));face.position.z=.07;face.userData=data;root.add(face);
 if(typeof document!=='undefined'){const texture=new THREE.TextureLoader().load(S.assetUrl(work.imageUrl,houseAssetOptions));texture.colorSpace=THREE.SRGBColorSpace;face.material.map=texture;face.material.color.set('#ffffff');}
 return data;
}
function buildHouseOriginal(house,walk=false,exterior=false){
 const group=new THREE.Group(),levels=[],objects=[],floors=[],ceilings=[],interactions=[],stairGroups=[];const count=house.residence?.floors||1;
 for(let level=0;level<count;level++){
  const projected=floorHouse(house,level);if(!projected.rooms.length)continue;const landings=(house.stairs||[]).map(s=>stairLanding(house,s,level)).filter(Boolean);projected.residenceRoofRooms=projected.rooms.filter(room=>!house.rooms.some(upper=>floorOf(upper)>level&&upper.x<room.x+room.w&&upper.x+upper.w>room.x&&upper.y<room.y+room.h&&upper.y+upper.h>room.y));projected.residenceKeepouts=landings.map(p=>({roomId:p.roomId,minX:p.centerX-.8,maxX:p.centerX,minZ:p.centerZ-.9,maxZ:p.centerZ+.9}));projected.residencePaintingPlacements=projected.rooms.flatMap(room=>paintingPlacements(projected,room));for(const p of projected.residencePaintingPlacements){const along=p.center-(p.axis==='z'?8:10),fixed=p.fixed-(p.axis==='z'?10:8);projected.residenceKeepouts.push(p.axis==='z'?{roomId:p.roomId,minX:Math.min(fixed,fixed+p.side*.55),maxX:Math.max(fixed,fixed+p.side*.55),minZ:along-.6,maxZ:along+.6}:{roomId:p.roomId,minX:along-.6,maxX:along+.6,minZ:Math.min(fixed,fixed+p.side*.55),maxZ:Math.max(fixed,fixed+p.side*.55)});}const built=buildFloor(projected,walk,exterior);built.group.position.y=level*FLOOR_HEIGHT;built.group.userData.floor=level;group.add(built.group);if(level>0){const masonry=mat('#e9e0cf');for(const room of projected.rooms){const c=roomCenter(room);for(const side of [-1,1]){box(built.group,room.w+.14,.6,.18,c.x,-.285,c.z+side*room.h/2,masonry,{floor:level,structural:true});box(built.group,.18,.6,room.h+.14,c.x+side*room.w/2,-.285,c.z,masonry,{floor:level,structural:true});}}}
  for(const mesh of [...built.floors,...built.ceilings]){const room=projected.rooms.find(r=>r.id===mesh.userData.roomId),cuts=landings.filter(c=>c.roomId===room?.id&&(mesh.userData.ceiling?c.toFloor>level:c.toFloor<level)).filter((c,index,all)=>all.findIndex(other=>other.centerX===c.centerX&&other.centerZ===c.centerZ)===index);if(room)cutSlab(mesh,room,cuts);}
  built.group.traverse(node=>{if(node.userData.roof&&!walk&&!exterior)node.visible=false;});
  for(const placement of projected.residencePaintingPlacements){const room=projected.rooms.find(r=>r.id===placement.roomId),data=painting(built.group,room,placement);if(data)built.interactions.push(data);}
  built.group.traverse(node=>{if(node.userData.homeAction){node.userData.floor=level;if(Number.isFinite(node.userData.height))node.userData.height+=level*FLOOR_HEIGHT;}});applyBrightness(built,projected);for(const item of built.interactions){item.floor=level;if(item.height!==undefined)item.height+=level*FLOOR_HEIGHT;}
  built.obstacles=built.obstacles.map(o=>({...o,floor:level}));built.walls=built.walls.map(w=>({...w,floor:level}));levels[level]={...built,house:projected};objects.push(...built.objects);floors.push(...built.floors);ceilings.push(...built.ceilings);interactions.push(...built.interactions);
 }
 for(const stairs of house.stairs||[]){const a=house.rooms.find(r=>r.id===stairs.a),b=house.rooms.find(r=>r.id===stairs.b);if(!a||!b)continue;const low=Math.min(floorOf(a),floorOf(b)),high=low+1,landing=stairLanding(house,stairs,low),root=new THREE.Group();root.position.y=low*FLOOR_HEIGHT;group.add(root);stairGroups.push({group:root,low,high});
  const stone=mat('#c5b699'),rail=mat('#6f5a42'),sx=landing.centerX-.4,sz=landing.centerZ;for(let n=0;n<14;n++){const h=(n+1)*FLOOR_HEIGHT/14;box(root,.74,h,.135,sx,h/2,sz+.84-n*.127,stone,{stairsId:stairs.id,stairStep:true,structural:true});}
  for(const side of [-1,1]){const x=sx+side*.38;beam(root,new THREE.Vector3(x,FLOOR_HEIGHT/14+.85,sz+.84),new THREE.Vector3(x,FLOOR_HEIGHT+.85,sz-.811),.027,rail);for(const n of [0,4,8,13]){const h=(n+1)*FLOOR_HEIGHT/14;box(root,.035,.85,.035,x,h+.425,sz+.84-n*.127,rail,{stairsId:stairs.id,stairSupport:true});}}
  for(const level of [low,high]){const toFloor=level===low?high:low;let mark=label(level===low?'UPSTAIRS ↑':'DOWNSTAIRS ↓','#263d34',1.05);if(mark.isSprite){const source=mark;mark=new THREE.Mesh(new THREE.PlaneGeometry(.53,.145),new THREE.MeshBasicMaterial({map:source.material.map,transparent:true,side:THREE.DoubleSide}));source.material.dispose();}mark.position.set(landing.centerX+.46,(level-low)*FLOOR_HEIGHT+1.17,sz+(level===low?.75:-.75)+.075);root.add(mark);const signZ=sz+(level===low?.75:-.75);box(root,.16,.035,.16,landing.centerX+.46,(level-low)*FLOOR_HEIGHT+.0175,signZ,rail,{stairsId:stairs.id,stairSignSupport:true});box(root,.045,1.15,.045,landing.centerX+.46,(level-low)*FLOOR_HEIGHT+.575,signZ,rail,{stairsId:stairs.id,stairSignSupport:true});const data={homeAction:'stairs',stairsId:stairs.id,fromFloor:level,toFloor,roomId:stairLanding(house,stairs,level).roomId,label:toFloor>level?'Go upstairs · floor '+(toFloor+1):'Go downstairs · floor '+(toFloor+1)},panel=box(root,.57,.32,.12,landing.centerX+.46,(level-low)*FLOOR_HEIGHT+1.15,sz+(level===low?.75:-.75),mat('#bcc49c'),data);mark.userData=data;levels[level].interactions.push(data);interactions.push(data);levels[level].obstacles.push({floor:level,roomId:data.roomId,minX:sx-.4,maxX:sx+.4,minZ:sz-.9,maxZ:sz+.9,label:'Staircase'});objects.push(panel);}
 }
 let currentFloor=0;function setFloor(level){if(!levels[level])return false;currentFloor=level;for(const [id,built]of levels.entries())if(built)built.group.visible=walk||exterior||id===level;for(const stair of stairGroups)stair.group.visible=walk||exterior||stair.low===level||stair.high===level;return true;}setFloor(0);
 return {group,levels,objects,floors,ceilings,interactions,toggleLight:id=>toggleHomeLight(group,id),frontDoor:levels[0]?.frontDoor||null,entrance:levels[0]?.entrance,setFloor,get floor(){return currentFloor;},get walls(){return levels[currentFloor]?.walls||[];},get obstacles(){return levels[currentFloor]?.obstacles||[];},get navigationHouse(){return levels[currentFloor]?.house||house;},roomInventory(id){return interactions.filter(item=>item.roomId===id);}};
}

const DISPLAY_BUDGET=Object.freeze({vertices:600000,triangles:600000,texturePixels:33554432,drawCalls:1024});
function instancedPrimitives(input){const bytes=input instanceof Uint8Array?input:new Uint8Array(input),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),json=JSON.parse(new TextDecoder().decode(bytes.subarray(20,20+view.getUint32(12,true))));return json.nodes.reduce((total,node)=>total+(node.mesh===undefined?0:json.meshes[node.mesh].primitives.length),0);}

async function parseDesign(bytes,kind='object',scale=1){
 const summary=validateGlb(bytes),drawCalls=summary.drawCalls??instancedPrimitives(bytes);if(drawCalls>512)throw Error('Export fewer than 513 mesh parts or instances for a responsive local exhibit.');const buffer=bytes instanceof ArrayBuffer?bytes:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),gltf=await new GLTFLoader().parseAsync(buffer,'');const root=gltf.scene,images=new Set();let texturePixels=0;
 try{root.traverse(o=>{if(o.isLight||o.isCamera)o.visible=false;if(o.isMesh){for(const a of Object.values(o.geometry.attributes))for(let row=0;row<a.count;row++)for(let component=0;component<a.itemSize;component++)if(!Number.isFinite(a.getComponent(row,component)))throw Error('The model contains non-finite geometry.');for(const material of Array.isArray(o.material)?o.material:[o.material])for(const value of Object.values(material))if(value?.isTexture&&value.image&&!images.has(value.image)){images.add(value.image);texturePixels+=(value.image.width||0)*(value.image.height||0);}o.castShadow=o.receiveShadow=true;}});
 const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3());if(![size.x,size.y,size.z].every(Number.isFinite)||Math.max(size.x,size.y,size.z)<=0)throw Error('The model has no visible finite geometry.');
 const dimension=kind==='house'?Math.max(size.x,size.z):Math.max(size.x,size.y,size.z);if(!Number.isFinite(dimension)||dimension<1e-7||!Number.isFinite(scale)||scale<=0)throw Error('The model needs a visible footprint and positive finite scale.');const factor=(kind==='house'?12:1)*scale/dimension;root.position.sub(new THREE.Vector3((bounds.min.x+bounds.max.x)/2,bounds.min.y,(bounds.min.z+bounds.max.z)/2));const wrapper=new THREE.Group();wrapper.add(root);wrapper.scale.setScalar(factor);wrapper.updateMatrixWorld(true);return {group:wrapper,size:size.multiplyScalar(factor),budget:{vertices:summary.vertices,triangles:summary.triangles,texturePixels,drawCalls}};}catch(error){disposeTemplate({group:root});throw error;}
}
const overlaps=(a,b,margin=0)=>a.maxX+margin>b.minX&&a.minX-margin<b.maxX&&a.maxZ+margin>b.minZ&&a.minZ-margin<b.maxZ;
function doorKeepouts(house,roomId){const areas=[];for(const door of house.doors){if(door.a!==roomId&&door.b!==roomId)continue;const a=house.rooms.find(r=>r.id===door.a),b=house.rooms.find(r=>r.id===door.b),edge=a&&b&&sharedEdge(a,b);if(!edge)continue;const x=edge.axis==='x'?(edge.lo+edge.hi)/2-10:edge.fixed-10,z=edge.axis==='x'?edge.fixed-8:(edge.lo+edge.hi)/2-8,rx=edge.axis==='x'?.85:1.1,rz=edge.axis==='x'?1.1:.85;areas.push({minX:x-rx,maxX:x+rx,minZ:z-rz,maxZ:z+rz});}const e=entranceFor(house);if(e.roomId===roomId)areas.push({minX:e.x-.9,maxX:e.x+.9,minZ:e.z-1.15,maxZ:e.z+1.15});return areas;}
function findDesignPosition(house,roomId,scale,obstacles=[]){const room=house.rooms.find(r=>r.id===roomId);if(!room||!Number.isFinite(scale)||scale<=0)return null;const radius=Math.max(.2,scale/2),cx=room.x+room.w/2-10,cz=room.y+room.h/2-8,keepouts=[...obstacles,...doorKeepouts(house,roomId)],candidates=[];for(let x=room.x-10+radius+.3;x<=room.x+room.w-10-radius-.3;x+=.4)for(let z=room.y-8+radius+.3;z<=room.y+room.h-8-radius-.3;z+=.4){if(Math.abs(x-cx)<.9&&Math.abs(z-cz)<.9)continue;const area={minX:x-radius,maxX:x+radius,minZ:z-radius,maxZ:z+radius};if(keepouts.some(o=>overlaps(area,o,.22)))continue;candidates.push({x,z,d:Math.hypot(x-cx,z-cz)});}candidates.sort((a,b)=>b.d-a.d);const c=candidates[0];return c?[+(c.x-cx).toFixed(3),0,+(c.z-cz).toFixed(3)]:null;}
function disposeTemplate(template){const geometries=new Set(),materials=new Set(),textures=new Set();template.group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const material of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])materials.add(material);});for(const material of materials){for(const value of Object.values(material))if(value?.isTexture)textures.add(value);material.dispose();}for(const texture of textures)texture.dispose();for(const geometry of geometries)geometry.dispose();}
function clearDisplays(group){group.traverse(o=>{if(o.userData.designOwned){o.geometry?.dispose();for(const material of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])material.dispose();}});group.clear();}
function createDesignLayer(scene,{resolveAsset,onError}){
 const group=new THREE.Group();scene.add(group);const cache=new Map(),tourReferences=new Map();let activeAssets=new Set(),signature='',generation=0,obstacles=[],house=null,activeFloor=0,residenceMode=false;
 function discard(id){const promise=cache.get(id);if(!promise)return;cache.delete(id);promise.then(disposeTemplate).catch(()=>{});}
 function prune(){for(const id of cache.keys())if(!activeAssets.has(id)&&!tourReferences.has(id))discard(id);}
 async function template(meta){if(!cache.has(meta.assetId)){const promise=(async()=>{const response=await fetch(await resolveAsset(meta.assetId));if(!response.ok)throw Error('The imported model is missing from this computer.');return parseDesign(await response.arrayBuffer());})();cache.set(meta.assetId,promise);promise.catch(()=>{if(cache.get(meta.assetId)===promise)cache.delete(meta.assetId);});}return cache.get(meta.assetId);}
 function setFloor(level){activeFloor=level;for(const child of group.children)child.visible=!residenceMode||(child.userData.floor||0)===level;}
 async function load(next,built,edition){house=next;residenceMode=edition==='residence';const allBuiltObstacles=residenceMode?(built?.levels||[]).flatMap(level=>level?.obstacles||[]):built?.obstacles||[],designs=['atelier','residence'].includes(edition)?next.designObjects||[]:[],key=JSON.stringify([designs,next.rooms.map(r=>[r.id,r.x,r.y,r.w,r.h,r.floor]),next.doors,allBuiltObstacles]);if(key===signature)return;signature=key;const epoch=++generation;clearDisplays(group);obstacles=[];activeAssets=new Set(designs.map(meta=>meta.assetId));prune();const renderedAssets=new Set(),budget={vertices:0,triangles:0,texturePixels:0,drawCalls:0};
  for(const meta of designs){let loaded=false;try{const original=await template(meta);loaded=true;if(epoch!==generation)return;const addedPixels=renderedAssets.has(meta.assetId)?0:original.budget.texturePixels;if(budget.vertices+original.budget.vertices>DISPLAY_BUDGET.vertices||budget.triangles+original.budget.triangles>DISPLAY_BUDGET.triangles||budget.texturePixels+addedPixels>DISPLAY_BUDGET.texturePixels||budget.drawCalls+original.budget.drawCalls>DISPLAY_BUDGET.drawCalls)throw Error('The active display is too detailed. Reduce model detail or display fewer designs in this house.');const object=original.group.clone(true),room=next.rooms.find(r=>r.id===meta.roomId),e=entranceFor(next),pos=meta.position,level=residenceMode&&meta.placement==='room'?(room?.floor||0):0,height=level*3.4;object.rotation.y=meta.rotation;
    if(meta.placement==='room'){if(!room)throw Error('Choose an existing room for this design.');const x=room.x+room.w/2-10+pos[0],z=room.y+room.h/2-8+pos[2];object.position.set(x,height+pos[1],z);object.scale.multiplyScalar(meta.scale);object.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(object),area={minX:box.min.x,maxX:box.max.x,minZ:box.min.z,maxZ:box.max.z,label:meta.title,...(residenceMode?{floor:level}:{} )};if(area.minX<room.x-10+.2||area.maxX>room.x+room.w-10-.2||area.minZ<room.y-8+.2||area.maxZ>room.y+room.h-8-.2||box.min.y<height-.1||box.max.y>height+2.6)throw Error('This model does not fit inside its room. Edit its scale or placement.');if([...allBuiltObstacles,...obstacles].filter(o=>!residenceMode||(o.floor||0)===level).concat(doorKeepouts(next,room.id)).some(o=>overlaps(area,o,.1)))throw Error('This design overlaps furniture or a doorway. Choose a clear position.');obstacles.push(area);}
    else{const index=designs.filter(d=>d.placement==='garden').indexOf(meta);object.scale.multiplyScalar(meta.kind==='house'?.8:meta.scale);object.position.set(e.x+2.4+(index%3)*1.4+pos[0],.5+pos[1],e.z+3.2+Math.floor(index/3)*1.3+pos[2]);object.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(object),area={minX:Math.min(box.min.x,object.position.x-.58),maxX:Math.max(box.max.x,object.position.x+.58),minZ:Math.min(box.min.z,object.position.z-.58),maxZ:Math.max(box.max.z,object.position.z+.58),label:meta.title,...(residenceMode?{floor:0}:{} )},yard=yardBounds(next),rooms=next.rooms.filter(r=>!residenceMode||!r.floor).map(r=>({minX:r.x-10,maxX:r.x+r.w-10,minZ:r.y-8,maxZ:r.y+r.h-8}));if(area.minX<yard.minX+.3||area.maxX>yard.maxX-.3||area.minZ<yard.minZ+.3||area.maxZ>yard.maxZ-.3)throw Error('Keep the garden exhibit inside the reachable garden.');if([...rooms,...allBuiltObstacles,...obstacles].filter(o=>!residenceMode||!o.floor).concat(doorKeepouts(next,e.roomId)).some(o=>overlaps(area,o,.15)))throw Error('This exhibit blocks the house, a doorway or another object. Choose a clear garden position.');const table=new THREE.Mesh(new THREE.CylinderGeometry(.58,.48,.5,16),new THREE.MeshStandardMaterial({color:'#b9ac92'}));table.position.set(object.position.x,.25,object.position.z);table.userData={designId:meta.id,label:'Explore '+meta.title,designOwned:true,...(residenceMode?{floor:0}:{} )};group.add(table);obstacles.push(area);}
    object.traverse(o=>{o.userData={designId:meta.id,roomId:meta.roomId,label:meta.title+' · inspect',...(residenceMode?{floor:level}:{} )};});group.add(object);setFloor(activeFloor);group.updateMatrixWorld(true);budget.vertices+=original.budget.vertices;budget.triangles+=original.budget.triangles;budget.texturePixels+=addedPixels;budget.drawCalls+=original.budget.drawCalls;renderedAssets.add(meta.assetId);
   }catch(error){if(epoch===generation){if(!loaded)signature='';if(!renderedAssets.has(meta.assetId)&&!tourReferences.has(meta.assetId))discard(meta.assetId);onError?.(error.message);}}}
 }
 return {group,load,setFloor,dispose(){generation++;signature="";clearDisplays(group);activeAssets=new Set();tourReferences.clear();for(const id of [...cache.keys()])discard(id);group.removeFromParent();},get obstacles(){return residenceMode?obstacles.filter(o=>(o.floor||0)===activeFloor):obstacles;},async tour(id){const meta=house?.designObjects?.find(o=>o.id===id);if(!meta)throw Error('Choose an imported design.');tourReferences.set(meta.assetId,(tourReferences.get(meta.assetId)||0)+1);let released=false;const release=()=>{if(released)return;released=true;const count=tourReferences.get(meta.assetId)-1;if(count)tourReferences.set(meta.assetId,count);else tourReferences.delete(meta.assetId);prune();};try{const original=await template(meta),copy=original.group.clone(true),size=original.size.clone(),dimension=Math.max(size.x,size.z);if(meta.kind==='house'&&dimension<1e-7)throw Error('The imported house needs a visible floor footprint.');const factor=meta.kind==='house'?12/dimension*meta.scale:meta.scale;copy.scale.multiplyScalar(factor);copy.userData={designId:id};copy.updateMatrixWorld(true);return {group:copy,size:size.multiplyScalar(factor),meta,release};}catch(error){release();throw error;}},position(house,roomId,scale,built){const level=house.rooms.find(r=>r.id===roomId)?.floor||0,roomsBuilt=residenceMode?built?.levels?.[level]:built;return findDesignPosition(house,roomId,scale,[...(roomsBuilt?.obstacles||[]),...obstacles.filter(o=>!residenceMode||(o.floor||0)===level)]);}};
}

const PROVENANCE={"houseCommit":"48ccb361e8e64857f4e9f94f4598d8dc97970e00","files":{"residence-scene-v1.js":{"source":"house-of-ideas-online/web/residence-scene-v1.js","sha256":"930273b7256c435a0ff7d809e7ccdb033010f3e23bc044a8d39612e046d4bf23"},"navigation.js":{"source":"house-of-ideas-online/web/navigation.js","sha256":"cfba29bb6572a8eada433593535446b0e942f97db2eb9aae86c748d017d4997f"},"residence-data.js":{"source":"house-of-ideas-online/web/residence-data.js","sha256":"c9f0bb6da9f42657a1ea3ffc127db5cb91175e8aaea6e3ce7a95a151d1a3f6e1"},"design-scene.js":{"source":"house-of-ideas-online/web/design-scene.js","sha256":"e797b33412a8861da00d4c2b02e181f1454941de4151f5276f88e0f896da2799"},"design-objects.js":{"source":"house-of-ideas-online/web/design-objects.js","sha256":"19d45082f7345fcaed8a6a5804fe9cb5b8aacbde9ea09eae9671f6fda23f9fbb"},"residence-interior-v1.js":{"source":"house-of-ideas-online/web/residence-interior-v1.js","sha256":"b96e69db98ee493784ad04b4a3bf518d99f5ad8d2b536be6b301a6438a8d7c19"},"idea-display.js":{"source":"house-of-ideas-online/web/idea-display.js","sha256":"db025f204420eb4b30b746793aebc9d3b44ffbad5d8e2d6c46b32077e9eafada"}},"adaptation":"Classic globals with actual source functions; local asset hook, async resolver support, bounded design disposal. No renderer/backend/private state."};

function setAssetResolver(fn){globalAssetResolver=typeof fn==='function'?fn:null;}
function resolveBundledAsset(id){const item=S.GLB_OBJECTS.find(i=>i.assetId===id);if(!item)return null;return S.assetUrl(item.assetPath);}
function releaseHouse(group){const resources=new Set();group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture&&!value.userData.retainedSurface)resources.add(value);}});for(const r of resources)r.dispose();group.clear();}
function buildHouse(house,walk=true,exterior=true,options={}){
 const previous=houseAssetOptions;houseAssetOptions=options;let built;
 try{built=buildHouseOriginal(house,walk,exterior);}finally{houseAssetOptions=previous;}
 const errors=[],resolve=options.resolveAsset||globalAssetResolver||resolveBundledAsset;
 const designs=createDesignLayer(built.group,{resolveAsset:resolve,onError:text=>{errors.push(text);options.onError?.(text);}});
 const structureObstacles=Object.getOwnPropertyDescriptor(built,'obstacles').get;
 Object.defineProperty(built,'obstacles',{configurable:true,get(){return [...structureObstacles.call(built),...designs.obstacles];}});
 const sourceSetFloor=built.setFloor;built.setFloor=level=>{const changed=sourceSetFloor(level);if(changed)designs.setFloor(level);return changed;};
 built.house=house;built.designLayer=designs;built.designErrors=errors;
 built.ready=designs.load(house,built,'residence').then(()=>{built.group.updateMatrixWorld(true);return built;});
 built.suggestDesignPosition=(roomId,scale)=>designs.position(house,roomId,scale,built);
 built.tourDesign=id=>designs.tour(id);
 built.setDoor=open=>{if(built.frontDoor)built.frontDoor.open=Boolean(open);return !!built.frontDoor?.open;};
 built.toggleDoor=()=>built.setDoor(!built.frontDoor?.open);
 built.canStand=(x,z,radius=.2)=>canExploreAt(built.navigationHouse,built.walls,x,z,radius)&&canOccupy(built.obstacles,x,z,radius)&&!(built.frontDoor&&!built.frontDoor.open&&Math.abs(z-built.frontDoor.z)<radius&&Math.abs(x-built.frontDoor.x)<.8);
 built.update=(dt,point)=>{const door=built.frontDoor;if(!door)return;if(point&&Math.hypot(point.x-door.x,point.z-door.z)<1.5)built.setDoor(true);const target=door.open?-Math.PI*.47:0;door.leaf.rotation.y+=(target-door.leaf.rotation.y)*Math.min(1,Math.max(0,Number(dt)||0)*7);};
 let disposed=false;built.dispose=()=>{if(disposed)return;disposed=true;designs.dispose();releaseHouse(built.group);};
 return built;
}
function disposeSurfaceCache(){for(const texture of surfaceTextures.values())texture.dispose();surfaceTextures.clear();}
g.CITY_HOME_SCENE={ready:true,buildHouse,buildHouseOriginal,roomCenter,canStandAt,houseBounds,entranceFor,roomAtPoint,centerOf,reachableIds,roomRoute,walkingRoute,yardBounds,canExploreAt,canOccupy,stepAlongPath,findWalkingPath,floorHouse,stairLanding,paintingPlacements,floorOf,roomBrightness,floorLabel,paintingWork,PAINTINGS,FLOOR_HEIGHT,setAssetResolver,resolveBundledAsset,parseDesign,createDesignLayer,findDesignPosition,validateGlb,validateDesignObjects,isAssetId,DESIGN_LIMITS,DESIGN_ACTIONS,DISPLAY_BUDGET,disposeSurfaceCache,provenance:PROVENANCE};
Object.assign(S,{buildHouse,roomCenter,canStandAt});
})(window);
