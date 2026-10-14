import {createSceneProtocol,homeUiChanged,createVisitorPositionGuard} from './city-home-protocol.js';
import * as THREE from './vendor/three.module.js';
import {buildHouse as buildOriginalHouse} from './scene-original.js';
import {buildHouse as buildResidenceHouse,floorHouse} from './residence-scene-v1.js';
import {buildHouse as buildInhabitedHouse} from './inhabited-scene-v1.js';
import {buildArtCity} from './art-city-scene.js';
import {addDaliHouse} from './dali-house-scene.js';
import {buildMathCity} from './math-city-scene.js';
import {buildCityFacilities,buildCityCargo} from './city-facilities.js';
import {extractObjectPreview,matchesObject} from './object-preview.js';
import {storePreview} from './object-store-preview.js';
import {STORE_OBJECTS} from './object-store.js';
import {parseDesign} from './design-scene.js';
import {ARTISTS} from './artist-catalog.js';
import {MATH_FLOORS} from './math-city-data.js';

const copy=value=>JSON.parse(JSON.stringify(value));
function disposeGroup(group){if(!group)return;const resources=new Set();group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});for(const r of resources)r.dispose?.();group.clear();}
export function createScene(container,onPick){
 // Geometry below is detached and used only by the original object inspector.
 // No walking canvas, camera, WebGLRenderer, animation loop, or keyboard capture is created here.
 let house=null,edition='residence',network={},homes=[],activeId=null,assetResolver=null,built=null,previewArtists=null;
 let context={cityId:'home',roomId:'learning',floor:0,outside:false,walking:true,artistId:null,position:{x:0,y:1.65,z:0},resident:{near:true,activity:'examining the house'}},visitCallback=null;
 const protocol=createSceneProtocol({onState:setCityContext,onError:error=>onPick?.({sceneMessage:error.message})});
 const visitorPosition=createVisitorPositionGuard((method,args)=>protocol.request(method,args));
 const emit=(method,args=[])=>visitorPosition.send(method,args);
 function setCityContext(next){const before=context;if(next.floor!==undefined&&next.floor!==context.floor){disposeGroup(built?.group);built=null;}context={...context,...copy(next),resident:{...context.resident,...copy(next.resident||{})}};if(homeUiChanged(before,context))onPick?.({artAction:'city-state'});}
 const change=(method,args,update)=>{const result=emit(method,args).then(value=>{if(value===false)throw Error('The city scene could not find a safe target.');if(update&&!value?.preserveVisitorPosition)setCityContext(update);return value;});result.catch(()=>{});return result;};
 function detachedHome(){if(!house)return null;if(!built)built=edition==='residence'?buildResidenceHouse(floorHouse(house,context.cityId==='home'?context.floor||0:0),true,true):edition==='inhabited'?buildInhabitedHouse(house,true,true):buildOriginalHouse(house,true,true);return built;}
 const playerState=()=>({...context,cityName:({home:'Home neighbourhood',artists:'Artists’ City',objects:'Object Market',mathematics:'Mathematics City',makers:'Makers’ City'}[context.cityId]||'City of Ideas'),artistCity:context.cityId==='artists',artistName:ARTISTS.find(a=>a.id===context.artistId)?.name,designTour:context.designTour||null});
 const residentState=()=>({available:context.cityId!=='artists',cityId:context.cityId,roomId:context.roomId||house?.rooms[0]?.id,floor:context.floor||0,near:true,summoning:false,talking:false,activity:'examining the house',locationLabel:playerState().cityName,...context.resident});
 const artistResidentState=id=>({artistId:id,near:context.cityId==='artists'&&(!context.artistId||context.artistId===id),distance:0,activity:'studying the gallery',talking:false,...context.artistResident});
 function roomInventory(id){if(Array.isArray(context.roomInventory?.[id]))return copy(context.roomInventory[id]);const data=detachedHome(),seen=new Set(),out=[];for(const item of data?.interactions||[]){if(item.roomId!==id)continue;const key=item.bookId||item.homeLightId||item.workId||item.label;if(seen.has(key))continue;seen.add(key);out.push({...item});}for(const idea of house?.ideas||[])if(idea.roomId===id)out.push({ideaId:idea.id,roomId:id,label:idea.title});for(const object of house?.designObjects||[])if(object.roomId===id)out.push({designId:object.id,roomId:id,label:object.title});for(const feature of house?.resident?.roomFeatures||[])if(feature.roomId===id)out.push({featureId:feature.id,roomId:id,label:feature.type.replaceAll('_',' ')});return out;}
 async function objectPreview(item){
  if(item.storeObjectId){const object=STORE_OBJECTS.find(i=>i.id===item.storeObjectId);if(!object)throw Error('Unknown market object.');return storePreview(object);}
  let owner=null,root=detachedHome()?.group;
  if(item.designId){const object=house?.designObjects?.find(i=>i.id===item.designId);if(!object)throw Error('Unknown design.');const response=await fetch(assetResolver?.(object.assetId)||'');if(!response.ok)throw Error('Imported design asset is unavailable.');owner=await parseDesign(await response.arrayBuffer());return {...owner,dispose:()=>disposeGroup(owner.group)};}
  else if(item.cargoId){const facilities=buildCityFacilities(THREE,{cityId:item.city});owner=buildCityCargo(THREE,network,item.city,facilities.anchors);root=owner.group;const previous=owner.dispose;owner.dispose=()=>{previous?.();facilities.dispose();};}
  else if(item.city==='artists'){if(!previewArtists)previewArtists=addDaliHouse(THREE,buildArtCity(THREE,ARTISTS.filter(a=>a.id!=='dali'),{artworkUrl:(_,work)=>work.imageUrl}));root=previewArtists.group;}
  else if(item.city==='mathematics'&&item.conceptId){owner=buildMathCity(THREE,{floor:item.floor||0,network});root=owner.group;}
  if(!root){owner?.dispose?.();throw Error('This object geometry is unavailable.');}
  if(item.workId){const started=Date.now();let loading=true;while(loading&&Date.now()-started<5000){loading=false;root.traverse(o=>{if(o.userData.imageStatus==='loading'){let n=o;while(n){if(matchesObject(n.userData,item)){loading=true;break;}n=n.parent;}}});if(loading)await new Promise(resolve=>setTimeout(resolve,50));}}
  const preview=extractObjectPreview(root,item);if(!preview){owner?.dispose?.();throw Error('No registered mesh was found for this object.');}preview.release=()=>owner?.dispose?.();return preview;
 }
 const api={
  load(next){house=copy(next);disposeGroup(built?.group);built=null;return emit('load',[house,{edition,activeId}]);},
  setEdition(value){edition=value;return emit('setEdition',[value]);},setNeighborhood(value,id){homes=copy(value);activeId=id;emit('setNeighborhood',[homes,id]);},setCityNetwork(value){network=copy(value);emit('setCityNetwork',[network]);},setArtCityCatalog(value){return emit('setArtCityCatalog',[value||ARTISTS]);},setAssetResolver(resolve){assetResolver=resolve;},
  setCityContext,withVisitorPosition:callback=>visitorPosition.run(callback),pick:data=>onPick?.(copy(data)),residentVisit:data=>visitCallback?.(copy(data)),playerState,residentState,artistResidentState,
  roomAt:()=>context.cityId==='home'&&!context.outside?context.roomId:null,
  cityState:()=>({id:context.cityId,name:playerState().cityName}),mathState:()=>({cityId:context.cityId,floor:context.floor||0,floorName:MATH_FLOORS[context.floor||0]?.name,inside:context.cityId==='mathematics'}),
  roomInventory,objectPreview,focusedTarget:()=>context.focusedTarget||null,
  nearestArtistResident:()=>context.cityId==='artists'?artistResidentState(context.artistId||ARTISTS[0].id):null,
  onResidentVisit(callback){visitCallback=callback;},onResidentInteract(callback){api.interactResident=callback;},setResidentObserver(callback){visitCallback=callback;},
  select:id=>change('select',[id],{cityId:'home',roomId:id,floor:house?.rooms.find(r=>r.id===id)?.floor||0,outside:false}),
  focusRoom:id=>api.select(id),
  travelToCity:id=>change('travelToCity',[id],{cityId:id,artistId:null}),prepareCity:()=>true,
  enterArtistHouse:(id,editionId)=>change('enterArtistHouse',[id,editionId||null],{cityId:'artists',artistId:id,artistEditionId:editionId||null}),
  enterArtCity:()=>change('enterArtCity',[],{cityId:'artists'}),leaveArtCity:()=>emit('leaveArtCity'),
  enterMathCity:()=>change('enterMathCity',[],{cityId:'mathematics'}),visitMathFloor:floor=>change('visitMathFloor',[floor],{cityId:'mathematics',floor}),
  visitMarketObject:id=>change('visitMarketObject',[id],{cityId:'objects'}),visitCityLandmark:id=>change('visitCityLandmark',[id]),
  enterHouse:()=>change('enterHouse',[],{cityId:'home',outside:false}),arriveAtDoor:()=>change('arriveAtDoor',[],{cityId:'home',outside:false}),startOutside:()=>change('startOutside',[],{cityId:'home',outside:true}),
  setFloor:floor=>change('setFloor',[floor],{floor}),useFloorLanding:(id,floor)=>change('useFloorLanding',[id,floor]),
  setWalk:value=>emit('setWalk',[value]),setExterior:value=>emit('setExterior',[value]),reset:()=>emit('reset'),showNeighborhood:()=>emit('showNeighborhood'),
  summonResident:()=>change('summonResident',[],{resident:{near:true,summoning:false}}),greetArtistResident:id=>emit('greetArtistResident',[id]),
  setResidentTalking:value=>emit('setResidentTalking',[value]),setArtistTalking:(id,value)=>emit('setArtistTalking',[id,value]),setSocrates:value=>{context.socratesVisible=Boolean(value);return true;},
  seatAt:item=>emit('seatAt',[item]),stand:()=>emit('stand'),tourDesign:id=>change('tourDesign',[id],{designTour:id}),returnDesign:()=>change('returnDesign',[],{designTour:null}),
  suggestDesignPosition:(id)=>{if(context.designPositions?.[id])return copy(context.designPositions[id]);const r=house?.rooms.find(r=>r.id===id)||house?.rooms[0];return {x:(r?.x||0)+(r?.w||3)/2-10,z:(r?.y||0)+(r?.h||3)/2-8};},
  restoreResidentState:state=>change('restoreResidentState',[state]),
  get walking(){return context.walking!==false;},get exterior(){return Boolean(context.outside);},
 };
 window.CITY_HOME_SCENE_BRIDGE=api;
 window.addEventListener('pagehide',()=>protocol.destroy(),{once:true});
 return api;
}
