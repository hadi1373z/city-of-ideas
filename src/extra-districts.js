/* Additive source-authentic geometry for the principal City of Ideas scene.
   Copy this module to src/extra-districts.js when its controller hooks are wired. */
const copy=value=>JSON.parse(JSON.stringify(value));
const finite=Number.isFinite;
const contains=(b,x,z,margin=0)=>x>b.minX+margin&&x<b.maxX-margin&&z>b.minZ+margin&&z<b.maxZ-margin;
const blocked=(items,x,z,padding=.22)=>items.some(b=>x>b.minX-padding&&x<b.maxX+padding&&z>b.minZ-padding&&z<b.maxZ+padding);
const union=(a,b)=>({minX:Math.min(a.minX,b.minX),maxX:Math.max(a.maxX,b.maxX),minZ:Math.min(a.minZ,b.minZ),maxZ:Math.max(a.maxZ,b.maxZ)});
const transformedBounds=(b,t)=>({minX:t.x+b.minX*t.scale,maxX:t.x+b.maxX*t.scale,minZ:t.z+b.minZ*t.scale,maxZ:t.z+b.maxZ*t.scale});
const worldPoint=(p,t)=>p?{...p,x:t.x+p.x*t.scale,z:t.z+p.z*t.scale,...(p.y===undefined?{}:{y:t.y+p.y*t.scale})}:null;
const localPoint=(x,z,t)=>({x:(x-t.x)/t.scale,z:(z-t.z)/t.scale});
const hasAction=d=>!!(d?.mathAction||d?.cityAction||d?.workId||d?.daliObjectId||d?.artAction||d?.cargoId);

async function sourceFactories(base,load){
 const names=['math-city-scene.js','makers-city-scene.js','dali-house-scene.js','artist-city-editions.js','math-city-data.js','artist-catalog.js','dali-data.js','city-network.js','neighborhood.js','city-facilities.js','books.js'];
 const modules=await Promise.all(names.map(name=>load(new URL(name,base).href)));
 return Object.assign({},...modules);
}

// The original Math function returns the complete exterior for every floor.
// Exact source transform/geometry signatures remove only duplicate exterior parts;
// all interactive nodes and all level-specific original furniture are retained.
function removeRepeatedMathExterior(THREE,models){
 const regular=new Set(),instances=new Set(),round=n=>Math.round(n*1e6)/1e6;
 const material=m=>Array.isArray(m)?m.map(material).join('|'):[m.type,m.color?.getHex(),m.side,m.transparent,m.opacity,!!m.map,m.map?.image?.width,m.map?.image?.height].join(':');
 const geometry=g=>g.type+':'+JSON.stringify(g.parameters||{})+':'+(g.type==='BufferGeometry'?Array.from(g.attributes.position?.array||[]).map(round).join(','):'');
 const matrix=m=>m.elements.map(round).join(',');
 const key=o=>geometry(o.geometry)+'|'+material(o.material)+'|'+matrix(o.matrix)+'|'+JSON.stringify(o.userData||{});
 const instanceKey=(o,m)=>geometry(o.geometry)+'|'+material(o.material)+'|'+matrix(m);
 models[0].group.updateMatrixWorld(true);
 for(const o of models[0].group.children){
  if(!o.isMesh||hasAction(o.userData))continue;
  if(o.isInstancedMesh){for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);instances.add(instanceKey(o,m));}}
  else regular.add(key(o));
 }
 const stats={regularRemoved:0,instancesRemoved:0,interiors:models.length};
 for(const model of models.slice(1)){
  model.group.updateMatrixWorld(true);
  for(const o of [...model.group.children]){
   if(!o.isMesh||hasAction(o.userData))continue;
   if(!o.isInstancedMesh){if(regular.has(key(o))){model.group.remove(o);stats.regularRemoved++;}continue;}
   const kept=[];
   for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);if(instances.has(instanceKey(o,m)))stats.instancesRemoved++;else kept.push(m);}
   if(kept.length===o.count)continue;
   model.group.remove(o);o.dispose?.();
   if(kept.length){const replacement=new THREE.InstancedMesh(o.geometry,o.material,kept.length);replacement.name=o.name;replacement.userData={...o.userData};replacement.matrix.copy(o.matrix);replacement.matrixAutoUpdate=o.matrixAutoUpdate;replacement.position.copy(o.position);replacement.quaternion.copy(o.quaternion);replacement.scale.copy(o.scale);kept.forEach((m,i)=>replacement.setMatrixAt(i,m));replacement.instanceMatrix.needsUpdate=true;replacement.computeBoundingBox?.();replacement.computeBoundingSphere?.();model.group.add(replacement);}
  }
 }
 return stats;
}

export async function createExtraDistricts(THREE,options={}){
 if(!THREE?.Group||String(THREE.REVISION)!=='160')throw Error('Use the principal city Three.js r160 instance.');
 const {scene,city}=options;
 if(!scene?.isObject3D||!city?.art?.group||!Array.isArray(city.art.houses))throw Error('Provide the existing shared scene and original artist city.');
 const sourceBase=new URL(options.sourceBaseUrl||'./city-source-assets/home-tools/',import.meta.url);
 const F=options.factories||await sourceFactories(sourceBase,options.importModule||((url)=>import(url)));
 for(const name of ['buildMathCity','buildMakersCity','addDaliHouse','buildArtistCityEditions','validateCityNetwork','validateNeighborhood','buildCityCargo','buildCityFacilities'])if(typeof F[name]!=='function')throw Error('Missing original source factory: '+name);
 if(F.MATH_BUILDING?.floors!==8||F.MATH_CONCEPTS?.length!==24||F.DALI_ARTIST?.works?.length!==4||F.DALI_OBJECTS?.length!==5)throw Error('Original district collections are incomplete.');
 const root=new THREE.Group();root.name='Original appended city districts';scene.add(root);
 const transforms={mathematics:{x:-215,y:.13,z:95,scale:1},makers:{x:225,y:.13,z:-50,scale:1},artists:{x:city.ART?.x??118,y:city.art.group.position.y,z:city.ART?.z??108,scale:city.ART?.scale??1.35}};
 const baseWorldBounds={...(options.worldBounds||{minX:-270,maxX:260,minZ:-500,maxZ:215})};
 const originalArt=city.art,baseHouses=originalArt.houses.slice(),baseChildren=new Set(originalArt.group.children);
 let activeMathFloor=0,disposed=false,network=null,editions=null,cargoOwners=[],homeOwners=new Map(),homeLotIndices=new Map(),pendingNeighborhood=null,activeHomeId=null;
 let artStation=null,daliArt=null,artAggregate=null,makers=null,visualSignature=null,editionCatalog=F.ARTISTS;
 const studyBlobUrls=[];
 const roads=new THREE.Group();roads.name='Shared paths to appended originals';root.add(roads);
 const roadMaterial=new THREE.MeshLambertMaterial({color:0xd2c6af}),groundMaterial=new THREE.MeshLambertMaterial({color:0x556563}),roadGeometries=new Set();
 function road(points,width=6,parent=roads){for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],g=new THREE.BoxGeometry(width,.12,Math.hypot(dx,dz)+width*.25);roadGeometries.add(g);const m=new THREE.Mesh(g,roadMaterial);m.position.set((a[0]+b[0])/2,.07,(a[1]+b[1])/2);m.rotation.y=Math.atan2(dx,dz);parent.add(m);}}
 road([[-97.7,110],[-145,140],[-215,140],[-215,104.6]],7);
 road([[108,37],[180,37],[203.5,-32],[203.5,-50],[211.5,-50]],6);
 road([[84.5,108],[84.5,85.05],[118,85.05],[118,82.08]],3);
 const assetUrl=value=>{
  if(/^(?:data:|blob:)/i.test(value))return value;
  if(options.assetUrl)return options.assetUrl(value,sourceBase.href);
  const base=/^(?:\.\/)?city-source-assets\//.test(value)?new URL('../../',sourceBase):sourceBase;
  return new URL(value,base).href;
 };
 const AssetThree={...THREE,TextureLoader:class extends THREE.TextureLoader{load(url,...args){return super.load(assetUrl(url),...args);}}};
 const disableLights=group=>{if(!options.keepLocalLights)group.traverse(o=>{if(o.isLight)o.visible=false;});};
 const mount=(owner,transform,parent=root)=>{owner.group.position.set(transform.x,transform.y,transform.z);owner.group.scale.setScalar(transform.scale);disableLights(owner.group);parent.add(owner.group);return owner;};
 const disposeOwned=owner=>{if(!owner)return;owner.group?.removeFromParent();owner.group?.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});owner.dispose?.();};
 const mathModels=[];
 try{
  for(let floor=0;floor<8;floor++)mathModels.push(F.buildMathCity(THREE,{floor}));
  const mathDeduplication=removeRepeatedMathExterior(THREE,mathModels);
  for(const model of mathModels){model.group.name='Mathematics original level '+(model.floor+1);model.group.userData.cityDestination='mathematics';mount(model,transforms.mathematics);}
  makers=mount(F.buildMakersCity(THREE),transforms.makers);makers.group.userData.cityDestination='makers';
  for(const hall of makers.houses)hall.group.userData.cityDestination='makers:'+hall.id;
  // The source add-on's disposal normally owns its base. A facade with a no-op
  // base disposer lets this additive layer own only Dalí and protect all ten lots.
  daliArt=F.addDaliHouse(AssetThree,{...originalArt,dispose(){}});
  const daliAdded=originalArt.group.children.filter(o=>!baseChildren.has(o));
  for(const o of daliAdded)o.userData.cityDestination='artist:dali';
  const daliHouse=daliArt.houses.find(h=>h.artistId==='dali');daliHouse.group.userData.cityDestination='artist:dali';
  artStation=F.buildCityFacilities(THREE,{cityId:'artists'});disableLights(artStation.group);originalArt.group.add(artStation.group);
  const staticOwners=[...mathModels,makers],mathBounds=transformedBounds(mathModels[0].bounds,transforms.mathematics),makerBounds=transformedBounds(makers.bounds,transforms.makers);
  const homeRoads=new THREE.Group();homeRoads.name='Paths to preserved personal homes';roads.add(homeRoads);
  const collisions=owner=>[...(owner.colliders||owner.obstacles||[])];
  const artLocalCanStand=(x,z)=>finite(x)&&finite(z)&&!blocked(artAggregate?.colliders||daliArt.colliders,x,z);
  const mathFloorFor=(y,floor)=>{
   if(Number.isInteger(floor)&&floor>=0&&floor<8)return floor;
   if(finite(y)){const index=Math.round((y-transforms.mathematics.y)/F.MATH_BUILDING.floorHeight);return index>=0&&index<8&&Math.abs(y-transforms.mathematics.y-index*F.MATH_BUILDING.floorHeight)<.6?index:-1;}
   return activeMathFloor;
  };
  const ownerCargo=(cityId,floor=0)=>cargoOwners.find(o=>o.cityId===cityId&&(cityId!=='mathematics'||o.floor===floor));
  function canStand(x,z,yOrOptions){
   if(!finite(x)||!finite(z))return false;
   const opts=typeof yOrOptions==='object'&&yOrOptions?yOrOptions:{y:yOrOptions};
   if(contains(mathBounds,x,z)){const p=localPoint(x,z,transforms.mathematics),floor=mathFloorFor(opts.y,opts.floor),model=mathModels[floor];return !!model&&(floor===0?!blocked(model.colliders,p.x,p.z):model.canStand(p.x,p.z))&&!blocked(ownerCargo('mathematics',floor)?.obstacles||[],p.x,p.z);}
   if(contains(makerBounds,x,z)){const p=localPoint(x,z,transforms.makers);return !blocked(makers.colliders,p.x,p.z)&&!blocked(ownerCargo('makers')?.obstacles||[],p.x,p.z);}
   const artBounds=transformedBounds(artAggregate?.bounds||daliArt.bounds,transforms.artists);
   if(contains(artBounds,x,z)){const p=localPoint(x,z,transforms.artists);if(!artLocalCanStand(p.x,p.z))return false;}
   for(const o of homeOwners.values())if(contains(o.worldBounds,x,z)){const p=localPoint(x,z,o.transform);if(!o.built.canStand(p.x,p.z,opts.floor||0))return false;}
   return true;
  }
  function region(x,z,yOrOptions){
   const opts=typeof yOrOptions==='object'&&yOrOptions?yOrOptions:{y:yOrOptions};
   if(contains(mathBounds,x,z)){const p=localPoint(x,z,transforms.mathematics),floor=mathFloorFor(opts.y,opts.floor);if(floor<0)return null;const inside=!!mathModels[floor].insideAt(p.x,p.z);return{id:'mathematics',cityId:'mathematics',title:inside?'Mathematics Atlas · '+F.MATH_FLOORS[floor].name:'Mathematics Institute · plaza',floor,height:transforms.mathematics.y+mathModels[floor].height,inside};}
   if(contains(makerBounds,x,z)){const p=localPoint(x,z,transforms.makers),hall=makers.houses.find(h=>contains(h,p.x,p.z,.16));return{id:'makers',cityId:'makers',title:hall?'Makers’ City · '+hall.name:'Makers’ City · shared courtyard',hallId:hall?.id,inside:!!hall,floor:0};}
   const p=localPoint(x,z,transforms.artists),house=editions?.insideHouseAt(p.x,p.z);
   if(house?.artistId==='dali'||house?.editionId)return{id:'artists',cityId:'artists',title:house.name+(house.number>1?' · Home '+house.number:''),artistId:house.artistId,artistEditionId:house.editionId,inside:true,floor:0};
   if(daliArt.insideAt(p.x,p.z)==='dali')return{id:'artists',cityId:'artists',title:'Salvador Dalí · Dream residence',artistId:'dali',inside:true,floor:0};
   for(const o of homeOwners.values())if(contains(o.worldBounds,x,z)){const local=localPoint(x,z,o.transform),room=o.built.roomAt?.(local.x,local.z,opts.floor||0);return{id:'home',cityId:'home',homeId:o.record.id,edition:o.record.edition,title:o.record.title,roomId:typeof room==='string'?room:room?.id,floor:opts.floor||0,inside:!!room};}
   return null;
  }
  function toWorld(cityId,p,{homeId}={}){const transform=homeId?homeOwners.get(homeId)?.transform:transforms[cityId];return transform?worldPoint(p,transform):null;}
  function entryFor(destination,configuration={}){
   if(typeof destination!=='string'||disposed)return null;
   const opts=typeof configuration==='string'?{editionId:configuration}:configuration;
   let p,t,meta;
   if(['math','mathematics','math-building'].includes(destination)){const floor=opts.floor??0;if(!Number.isInteger(floor)||floor<0||floor>7)return null;p=opts.inside||floor>0?mathModels[floor].floorSpawn:mathModels[0].building.entry;t=transforms.mathematics;meta={cityId:'mathematics',floor};}
   else if(destination==='makers'){p=makers.spawn;t=transforms.makers;meta={cityId:'makers',floor:0};}
   else if(destination.startsWith('makers:')||destination.startsWith('makers-')){const id=destination.startsWith('makers:')?destination.slice(7):destination,hall=makers.houses.find(h=>h.id===id);if(!hall)return null;p=opts.inside?hall.spawnInside:hall.entry;t=transforms.makers;meta={cityId:'makers',hallId:id,floor:0};}
   else if(destination==='dali'||destination==='artist:dali'){p=opts.inside?daliHouse.spawnInside:daliHouse.entry;t=transforms.artists;meta={cityId:'artists',artistId:'dali',floor:0};}
   else if(destination.startsWith('artist-edition:')||opts.editionId){const editionId=opts.editionId||destination.slice(15),house=editions?.houses.find(h=>h.editionId===editionId);if(!house)return null;p=opts.inside?house.spawnInside:house.entry;t=transforms.artists;meta={cityId:'artists',artistId:house.artistId,artistEditionId:editionId,floor:0};}
   else if(destination.startsWith('home:')){const id=destination.slice(5),owner=homeOwners.get(id);if(!owner)return null;p=owner.built.entryFor?.(opts.roomId,opts.floor||0)||owner.built.entry;if(!p)return null;t=owner.transform;meta={cityId:'home',homeId:id,edition:owner.record.edition,floor:opts.floor||0};}
   if(!p||!t)return null;
   const result={...worldPoint({...p,y:p.y??0},t),...meta};return canStand(result.x,result.z,{y:result.y,floor:result.floor})?result:null;
  }
  function targetInfo(input){
   const data=input?.userData||input;if(!data||typeof data!=='object')return null;
   let cityId,kind,extra={};
   if(data.mathAction){cityId='mathematics';kind='math';extra={action:data.mathAction,floor:data.mathFloor??data.floorIndex??activeMathFloor,concept:F.MATH_CONCEPTS.find(c=>c.id===data.conceptId),targetFloor:data.targetFloor};}
   else if(data.daliObjectId){cityId='artists';kind='dali';extra={activity:F.DALI_OBJECTS.find(o=>o.id===data.daliObjectId),artist:F.DALI_ARTIST};}
   else if(data.artistId==='dali'){cityId='artists';kind='dali';extra={artist:F.DALI_ARTIST,work:F.DALI_ARTIST.works.find(w=>w.id===data.workId)};}
   else if(data.artistEditionId){cityId='artists';kind='artist-edition';extra={artist:F.ARTISTS.find(a=>a.id===data.artistId),edition:editions?.houses.find(h=>h.editionId===data.artistEditionId)};}
   else if(data.cargoId){cityId=data.cityId;kind='cargo';extra={cargo:network?.cargo.find(c=>c.id===data.cargoId)};}
   else if(data.cityAction&&data.extraCityId){cityId=data.extraCityId;kind='source-activity';extra={book:F.BOOKS.find(b=>b.id===data.bookId)};}
   else if(data.extraHomeId){cityId='home';kind='home-source';extra={homeId:data.extraHomeId};}
   else return null;
   // Source pick payload remains in its original coordinate system for the tools.
   const payload={...data,city:cityId,cityId,...(extra.floor===undefined?{}:{floor:extra.floor})};
   return{kind:'home-source',sourceKind:kind,cityId,title:data.label||extra.activity?.title||extra.work?.title||extra.concept?.title||'',data:payload,...extra,anchor:toWorld(cityId,data.anchor,{homeId:extra.homeId}),lookAt:toWorld(cityId,data.lookAt,{homeId:extra.homeId})};
  }
  const tagActivities=(group,cityId)=>group.traverse(o=>{if(o.userData.cityAction)o.userData={...o.userData,extraCityId:cityId};});
  tagActivities(makers.group,'makers');tagActivities(artStation.group,'artists');for(const model of mathModels)tagActivities(model.group,'mathematics');
  async function ensureEditionStudies(list){
   if(!list.some(e=>e.artistId==='dali')||editionCatalog!==F.ARTISTS)return;
   const urls=[];
   try{
    const works=[];
    for(const work of F.DALI_ARTIST.works){
     const response=await (options.fetch||globalThis.fetch)(assetUrl(work.imageUrl),{credentials:'omit'});
     if(!response.ok)throw Error('The original Dalí study card could not be loaded: '+work.id);
     const blob=await response.blob(),url=URL.createObjectURL(blob);urls.push(url);works.push({...work,imageUrl:url});
    }
    if(disposed)throw Error('The appended city layer has been disposed.');
    editionCatalog=F.ARTISTS.map(a=>a.id==='dali'?{...a,works}:a);studyBlobUrls.push(...urls);
   }catch(error){urls.forEach(url=>URL.revokeObjectURL(url));throw error;}
  }
  async function updateNetwork(input){
   if(disposed)throw Error('The appended city layer has been disposed.');
   const next=F.validateCityNetwork(copy(input)),list=next.artistHomes?.editions||[];
   for(const prior of network?.artistHomes?.editions||[]){const retained=list.find(e=>e.id===prior.id);if(!retained||JSON.stringify(retained)!==JSON.stringify(prior))throw Error('Preserved artist editions cannot be removed or rewritten by a scene update. The current city is kept.');}
   const signature=JSON.stringify({editions:list,cargo:next.cargo,placements:next.placements});
   if(signature===visualSignature){network=next;return{artistEditions:editions.houses.length,cargoCopies:next.placements.length,geometryChanged:false,privateStateWritten:false};}
   await ensureEditionStudies(list);
   if(disposed)throw Error('The appended city layer has been disposed.');
   let nextEditions;const nextCargo=[];
   try{
    nextEditions=F.buildArtistCityEditions(AssetThree,editionCatalog,daliArt,list);disableLights(nextEditions.group);
    for(const house of nextEditions.houses)house.group.userData.cityDestination='artist-edition:'+house.editionId;
    const definitions=[{cityId:'makers',floor:0,anchors:makers.anchors,transform:transforms.makers},{cityId:'mathematics',floor:activeMathFloor,anchors:mathModels[activeMathFloor].anchors,transform:transforms.mathematics},{cityId:'artists',floor:0,anchors:artStation.anchors,transform:transforms.artists}];
    for(const definition of definitions){const built=F.buildCityCargo(THREE,next,definition.cityId,definition.anchors);if(definition.cityId==='mathematics')built.group.position.y=mathModels[definition.floor].height;nextCargo.push({...built,...definition});}
   }catch(error){disposeOwned(nextEditions);nextCargo.forEach(disposeOwned);throw error;}
   const previousEditions=editions,previousCargo=cargoOwners;
   originalArt.group.add(nextEditions.group);
   for(const owner of nextCargo){if(owner.cityId==='artists')originalArt.group.add(owner.group);else{const y=owner.group.position.y;mount(owner,{...owner.transform,y:owner.transform.y+y});}}
   editions=nextEditions;cargoOwners=nextCargo;network=next;visualSignature=signature;
   artAggregate={...daliArt,houses:[...daliArt.houses,...editions.houses],bounds:union(daliArt.bounds,editions.bounds),colliders:[...daliArt.colliders,...editions.colliders,...artStation.obstacles,...(ownerCargo('artists')?.obstacles||[])],insideAt:(x,z)=>editions.insideAt(x,z),entryFor:(artistId,editionId)=>editionId?editions.entryFor(artistId,editionId):daliArt.entryFor(artistId),canStand:artLocalCanStand};
   city.art=artAggregate;
   disposeOwned(previousEditions);previousCargo.forEach(disposeOwned);
   return{artistEditions:editions.houses.length,cargoCopies:next.placements.length,geometryChanged:true,privateStateWritten:false};
  }
  function selectMathFloor(floor){
   if(disposed)throw Error('The appended city layer has been disposed.');
   if(!Number.isInteger(floor)||floor<0||floor>7)throw Error('Choose an original mathematics floor from 0 to 7.');
   const fromFloor=activeMathFloor,sourceLanding=mathModels[floor].landings[floor],fromLanding=mathModels[fromFloor].landings[fromFloor];
   activeMathFloor=floor;
   if(network){const previous=ownerCargo('mathematics',fromFloor),built=F.buildCityCargo(THREE,network,'mathematics',mathModels[floor].anchors),owner={...built,cityId:'mathematics',floor,transform:transforms.mathematics};mount(owner,{...transforms.mathematics,y:transforms.mathematics.y+mathModels[floor].height});cargoOwners=cargoOwners.filter(o=>o!==previous);cargoOwners.push(owner);disposeOwned(previous);}
   const to={...worldPoint(sourceLanding,transforms.mathematics),cityId:'mathematics',floor};
   if(!canStand(to.x,to.z,{y:to.y,floor}))throw Error('The original mathematics lift arrival is obstructed.');
   return{from:{...worldPoint(fromLanding,transforms.mathematics),cityId:'mathematics',floor:fromFloor},to,duration:1450,kind:'original-math-lift',sameScene:true};
  }
  async function updateNeighborhood(input,id){
   if(disposed)throw Error('The appended city layer has been disposed.');
   const normalized=Array.isArray(input)?F.validateNeighborhood({version:1,homes:copy(input),activeId:id}):F.validateNeighborhood(copy(input));
   for(const prior of pendingNeighborhood?.homes||[])if(!normalized.homes.some(h=>h.id===prior.id))throw Error('A scene update cannot discard preserved personal homes. The current neighborhood is kept.');
   const buildHome=options.buildHome||options.homeScene?.buildHouse||globalThis.CITY_HOME_SCENE?.buildHouse;
   pendingNeighborhood=normalized;activeHomeId=id||normalized.activeId;
   if(typeof buildHome!=='function')return{status:'waiting-for-home-factory',homes:normalized.homes.length,activeHomeId,privateStateWritten:false};
   const next=new Map();
   try{
    for(const record of normalized.homes){
     const previous=homeOwners.get(record.id);if(previous&&JSON.stringify(previous.record)===JSON.stringify(record)){next.set(record.id,previous);continue;}
     const built=await buildHome(THREE,copy(record.house),{edition:record.edition,homeId:record.id,walk:true});
     if(!built?.group?.isObject3D||typeof built.canStand!=='function'||!built.bounds||(!built.entry&&!built.entryFor)){disposeOwned(built);throw Error('Home factory must return source geometry, bounds, canStand and an entry for '+record.id);}
     if(!homeLotIndices.has(record.id))homeLotIndices.set(record.id,homeLotIndices.size);
     const lot=homeLotIndices.get(record.id),transform={x:-170+(lot%3)*50,y:.13,z:170+Math.floor(lot/3)*48,scale:1.35};
     built.group.userData.cityDestination='home:'+record.id;built.group.traverse(o=>{if(hasAction(o.userData)||o.userData.roomId)o.userData={...o.userData,extraHomeId:record.id};});disableLights(built.group);
     next.set(record.id,{built,group:built.group,record,transform,worldBounds:transformedBounds(built.bounds,transform)});
    }
   }catch(error){for(const [key,owner]of next)if(owner!==homeOwners.get(key))disposeOwned(owner.built);throw error;}
   for(const [key,owner]of next)if(owner!==homeOwners.get(key)){mount(owner.built,owner.transform);const previous=homeOwners.get(key);if(previous)disposeOwned(previous.built);}
   homeOwners=next;
   // Roads and parcel ground expand exactly with the preserved source lots.
   homeRoads.traverse(o=>{if(o.geometry){o.geometry.dispose();roadGeometries.delete(o.geometry);}});homeRoads.clear();
   road([[-97.7,110],[-97.7,145],[-170,145]],6,homeRoads);
   for(const owner of homeOwners.values()){const b=owner.worldBounds,g=new THREE.BoxGeometry(b.maxX-b.minX+6,.16,b.maxZ-b.minZ+6);roadGeometries.add(g);const parcel=new THREE.Mesh(g,groundMaterial);parcel.position.set((b.minX+b.maxX)/2,-.12,(b.minZ+b.maxZ)/2);homeRoads.add(parcel);const entry=entryFor('home:'+owner.record.id);if(entry)road([[-195,145],[-195,owner.transform.z+18],[entry.x,owner.transform.z+18],[entry.x,entry.z]],4,homeRoads);}
   return{status:'ready',homes:homeOwners.size,activeHomeId,privateStateWritten:false};
  }
  const bounds=()=>{let result=union(baseWorldBounds,union(mathBounds,makerBounds));result=union(result,transformedBounds(artAggregate?.bounds||daliArt.bounds,transforms.artists));for(const owner of homeOwners.values())result=union(result,{minX:Math.min(-197,owner.worldBounds.minX-3),maxX:owner.worldBounds.maxX+3,minZ:145,maxZ:owner.worldBounds.maxZ+20});return result;};
  function update(){if(disposed)return;/* Static source districts share the principal renderer and its lighting. */}
  function dispose(){
   if(disposed)return;disposed=true;
   cargoOwners.forEach(disposeOwned);disposeOwned(editions);disposeOwned(artStation);
   for(const owner of homeOwners.values())disposeOwned(owner.built);
   staticOwners.forEach(disposeOwned);daliArt.dispose();for(const o of daliAdded)o.removeFromParent();studyBlobUrls.forEach(url=>URL.revokeObjectURL(url));
   if(city.art===artAggregate)city.art=originalArt;
   for(const g of roadGeometries)g.dispose();roadMaterial.dispose();groundMaterial.dispose();root.removeFromParent();root.clear();
  }
  const api={group:root,mathModels,makers,daliHouse,transforms,source:{base:sourceBase.href,three:THREE.REVISION,mathFloors:8,mathConcepts:24,makerHalls:makers.houses.length,makerActions:makers.houses.reduce((n,h)=>n+h.approaches.length,0),daliStudies:F.DALI_ARTIST.works.length,daliActivities:F.DALI_OBJECTS.length},mathDeduplication,facilities:{artists:artStation},canStand,region,entryFor,targetInfo,toWorld,selectMathFloor,updateNetwork,updateNeighborhood,update,dispose,get activeMathFloor(){return activeMathFloor;},get bounds(){return bounds();},get art(){return artAggregate;},get neighborhoodStatus(){return{available:homeOwners.size,pending:pendingNeighborhood?.homes.length||0,activeHomeId};},get targets(){return[...mathModels.map(m=>m.group),makers.group,...daliAdded,editions?.group,artStation.group,...cargoOwners.map(o=>o.group),...homeOwners.values()].map(o=>o?.group||o).filter(Boolean);},get buildingTargets(){return[mathModels[0].group,...makers.houses.map(h=>h.group),daliHouse.group,...(editions?.houses||[]).map(h=>h.group),...homeOwners.values()].map(o=>o?.group||o);}};
  await updateNetwork(options.network||F.initialCityNetwork());
  if(options.neighborhood)await updateNeighborhood(options.neighborhood,options.activeHomeId);
  return api;
 }catch(error){
  // Source failures never dispose the borrowed original ten houses.
  for(const model of mathModels)disposeOwned(model);disposeOwned(makers);disposeOwned(editions);cargoOwners.forEach(disposeOwned);for(const o of homeOwners.values())disposeOwned(o.built);disposeOwned(artStation);daliArt?.dispose?.();studyBlobUrls.forEach(url=>URL.revokeObjectURL(url));for(const o of originalArt.group.children.filter(o=>!baseChildren.has(o)))o.removeFromParent();if(city.art===artAggregate)city.art=originalArt;for(const g of roadGeometries)g.dispose();roadMaterial.dispose();groundMaterial.dispose();root.removeFromParent();throw error;
 }
}
