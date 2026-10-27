import {installVisitMemory} from './visit-memory.js?v=question1';
import {installQuestionWalk} from './question-walk.js';
import {artistLineOfSight} from './artist-line-of-sight.js';
import {installPhilosopherQuarter} from './philosopher-ui.js';
import {installSocratesTour} from './socrates-tour.js';
import {installOrigamiPark} from './origami-park.js';
import {createExtraDistricts} from './extra-districts.js';
import {buildHome} from './home-editions-scene.js';
import {buildArtistResidents} from './city-source-assets/home-tools/artist-residents.js';
import {ARTISTS} from './city-source-assets/home-tools/artist-catalog.js';
import {createDistrictNavigation} from './district-navigation.js';
import {createSharedResidents} from './shared-residents.js';
import {createSharedActivities} from './shared-activities.js';
import {installIdeasGraveyard} from './ideas-graveyard.js';
import {installEscherHouse} from './escher-house.js';
import {installStudyBook} from './study-book.js';
import {installCinematicIntro} from './cinematic-intro.js';
import {installDiscoveryStory} from './discovery-story.js';
const waitMain=()=>new Promise(resolve=>{if(window.CITY_MAIN?.city)resolve(window.CITY_MAIN);else addEventListener('gallery-ready',()=>resolve(window.CITY_MAIN),{once:true});});
const M=await waitMain(),T=window.THREE,frame=()=>CITY_TOOL_FRAMES.get('home'),originalHome={...window.CITY_HOME_SCENE};let selectedEdition='residence';
const reply=(d,value,error)=>frame().contentWindow?.postMessage({type:'city-home-scene-result',id:d.id,action:d.action,ok:!error&&value!==false,value,error},location.origin);
let E,mathJourney=null;const homeOwners=new Map();
function current(x=M.player.x,z=M.player.z){let r=E?.region(x,z,{y:M.player.y-M.eye});if(r?.id==='mathematics'&&CITY_I18N.lang==='fa'){const names=['مبانی','جبر','هندسه','حسابان و تحلیل','ریاضیات گسسته','احتمال و آمار','توپولوژی','رصدخانهٔ منطق و محاسبه'];r={...r,title:r.inside?'اطلس ریاضیات · '+names[r.floor]:'مؤسسهٔ ریاضیات · میدان'};}if(r?.id==='makers'&&CITY_I18N.lang==='fa'){const halls={'makers-library':'کتابخانه','makers-workshop':'کارگاه','makers-dialogue':'خانهٔ گفت‌وگو'};r={...r,title:'شهر سازندگان · '+(halls[r.hallId]||'حیاط مشترک')};}if(r?.artistId==='dali'&&!r.artistEditionId&&CITY_I18N.lang==='fa')r={...r,title:'سالوادور دالی · اقامتگاه رؤیا'};if(!r?.homeId)return r;const owner=homeOwners.get(r.homeId);if(!owner)return r;const origin=E.toWorld('home',{x:0,y:0,z:0},{homeId:r.homeId}),roomId=owner.roomAt((x-origin.x)/1.35,(z-origin.z)/1.35,owner.floor);return{...r,floor:owner.floor,height:origin.y+owner.height*1.35,roomId,inside:!!roomId};}
try{
 E=await createExtraDistricts(T,{scene:M.scene,city:M.city,buildHome:(T,house,options)=>{const priorFloor=homeOwners.get(options.homeId)?.floor||0,owner=buildHome(T,house,{...options,owner:originalHome,resolveAsset:id=>M.homeBridge.resolveAsset(id)});owner.setFloor(priorFloor);homeOwners.set(options.homeId,owner);owner.ready.then(()=>owner.group.traverse(o=>{if(o.userData.designId)o.userData={...o.userData,extraHomeId:options.homeId};}));return owner;}});window.CITY_EXTRAS=E;
 CITY_HOME_SCENE.buildHouse=(house,walk,exterior,options)=>selectedEdition==='residence'?originalHome.buildHouse(house,walk,exterior,options):buildHome(T,house,{edition:selectedEdition,walk,exterior,owner:originalHome,...options});
 const oldRegion=M.city.region,oldCan=M.city.canStand,oldTarget=M.city.targetInfo,oldUpdate=M.city.update;
 const navigation=await createDistrictNavigation(E,{baseCanStand:oldCan});
 const activities=createSharedActivities(T,{main:M,extras:E,navigation});window.CITY_ACTIVITIES=activities;const originalArrival=M.arrive;M.cancelActivity=()=>activities.cancel(false);M.arrive=p=>{activities.cancel(false);return originalArrival(p);};
 M.city.region=(x,z)=>activities.stationAt(x,z)||current(x,z)||oldRegion(x,z);
 M.city.canStand=(x,z)=>{if(!activities.canStand(x,z))return false;const mainHome=M.city.homeBuilt;if(mainHome?.floor>0&&oldRegion(M.player.x,M.player.z).id==='socrates'){const local={x:(x-M.city.SOC.x)/M.city.SOC.scale,z:(z-M.city.SOC.z)/M.city.SOC.scale};return!!CITY_HOME_SCENE.roomAtPoint(mainHome.navigationHouse,local.x,local.z)&&oldCan(x,z)&&E.canStand(x,z,{y:M.player.y-M.eye});}const r=current(),context={y:M.player.y-M.eye};if(r?.homeId){context.floor=r.floor;const owner=homeOwners.get(r.homeId),p=E.toWorld('home',{x:0,z:0},{homeId:r.homeId});if(owner?.floor>0&&!owner.roomAt((x-p.x)/1.35,(z-p.z)/1.35,owner.floor))return false;}if(r?.id==='mathematics'&&r.floor>0)Object.assign(context,{cityId:'mathematics',floor:r.floor});return navigation.canStand(x,z,context);};
 M.city.targetInfo=d=>{if(d.sharedFacility)return{kind:'home-source',data:d,title:d.label||''};if(d.artAction==='enter')return null;if((d.artistId==='dali'||d.artistEditionId)&&!d.workId&&!d.daliObjectId&&!d.artistResidentId&&!d.artAction)return null;if(d.extraHomeId&&!d.homeAction&&!d.ideaId&&!d.designId&&!d.bookId&&!d.featureId&&!d.resident&&!d.door)return null;return d.artistResidentId||d.resident||d.door?{kind:'home-source',data:d}:E.targetInfo(d)||oldTarget(d);};
 let ownedTargets=new Set(),ownedBuildings=new Set();const refreshTargets=()=>{for(let i=M.city.targets.length-1;i>=0;i--)if(ownedTargets.has(M.city.targets[i]))M.city.targets.splice(i,1);for(let i=M.city.buildingTargets.length-1;i>=0;i--)if(ownedBuildings.has(M.city.buildingTargets[i]))M.city.buildingTargets.splice(i,1);ownedTargets=new Set(E.targets);ownedBuildings=new Set(E.buildingTargets);for(const group of ownedTargets)if(!M.city.targets.includes(group))M.city.targets.push(group);for(const group of ownedBuildings)if(!M.city.buildingTargets.includes(group))M.city.buildingTargets.push(group);};refreshTargets();
 let residents,sceneQueue=Promise.resolve();function rebuildResidents(){if(residents){const i=M.city.targets.indexOf(residents.group);if(i>=0)M.city.targets.splice(i,1);residents.group.removeFromParent();residents.dispose();}residents=buildArtistResidents(T,ARTISTS,E.art);M.city.art.group.add(residents.group);M.city.targets.push(residents.group);}rebuildResidents();let lastTime=0,talkingId=null;
 const socrates=createSharedResidents(T,{main:M,extras:E,navigation});
 const artistState=id=>{const state=residents.state(id),p=M.player,near=state&&M.city.region(p.x,p.z)?.artistId===id&&Math.hypot((p.x-M.city.ART.x)/M.city.ART.scale-state.position.x,(p.z-M.city.ART.z)/M.city.ART.scale-state.position.z)<=3.2&&artistLineOfSight(T,{scene:M.scene,artGroup:M.city.art.group,residentGroup:residents.group,player:p,state});return{...state,artistId:id,available:!!state,near:!!near,talking:talkingId===id};};
 M.city.update=(...args)=>{
  if(mathJourney){M.clearMovement();const q=Math.min(1,(performance.now()-mathJourney.start)/mathJourney.duration),e=q*q*(3-2*q);Object.assign(M.player,{x:mathJourney.to.x,z:mathJourney.to.z,y:mathJourney.fromY+(mathJourney.to.y+M.eye-mathJourney.fromY)*e,yaw:-Math.PI/2,pitch:0});if(q===1)mathJourney=null;}
  oldUpdate(...args);E.update(...args);const time=args[1],p=M.player;activities.update(time);
  residents.update(lastTime?time-lastTime:0,{player:{x:(p.x-M.city.ART.x)/M.city.ART.scale,z:(p.z-M.city.ART.z)/M.city.ART.scale},talkingId});socrates.update(time);lastTime=time;
 };
 M.homeState=body=>{if(body.type!=='city-home-state')return body;const p=M.player,r=M.city.region(p.x,p.z),source=body.state;return{...body,state:{...source,cityId:r.id==='socrates'?'home':r.id,floor:r.floor??M.city.homeBuilt?.floor??0,roomId:r.room?.id||r.roomId,artistId:r.artistId||null,artistEditionId:r.artistEditionId||null,position:{x:p.x,y:p.y,z:p.z},outside:!r.inside&&r.id!=='socrates',inside:r.id==='socrates'||!!r.inside,seated:activities.seated||source.seated,residentState:socrates.state()||source.residentState,artistResident:r.artistId?artistState(r.artistId):null}};};
 M.extraGround=(x,z)=>{const r=current(x,z);if(r?.id==='mathematics'&&r.inside)return r.height;if(r?.id==='home')return r.height;};
 M.startExtra=destination=>{const p=E.entryFor(destination);if(!p)return false;if(p.cityId==='mathematics')E.selectMathFloor(p.floor||0);M.arrive(p);return true;};
 const lift=floor=>{const journey=E.selectMathFloor(Number(floor)),fromY=M.player.y;M.arrive({...journey.to,yaw:-Math.PI/2});mathJourney={...journey,start:performance.now(),fromY};M.player.y=fromY;M.status(CITY_I18N.tx('طبقهٔ ریاضیات ','Mathematics level ')+(Number(floor)+1));return true;};
 const neighborFloor=(id,level,roomId)=>{const owner=homeOwners.get(id);if(!owner?.setFloor(Number(level)))throw Error('This preserved home has no requested floor.');const p=owner.entryFor(roomId,Number(level));if(!p)throw Error('This preserved room has no safe arrival.');M.arrive(E.toWorld('home',p,{homeId:id}));return true;};
 M.showExtra=info=>{if(M.storyJourney?.handle(info))return true;if(!['home-source','home'].includes(info.kind))return false;const data=info.data,owner=data.extraHomeId?homeOwners.get(data.extraHomeId):M.city.homeBuilt;if(data.door){owner?.toggleDoor();return true;}if(data.homeAction==='light'){owner?.toggleLight(data.homeLightId);return true;}if(data.extraHomeId&&data.homeAction==='stairs'){const stairs=owner.house.stairs?.find(s=>s.id===data.stairsId),from=data.fromFloor??owner.floor,other=[stairs?.a,stairs?.b].map(id=>owner.house.rooms.find(r=>r.id===id)).find(r=>r&&(r.floor||0)!==from);if(other)neighborFloor(data.extraHomeId,other.floor||0,other.id);return true;}if(info.kind==='home')return false;if(data.mathAction==='floor'){lift(data.targetFloor);return true;}if(info.homeId)M.homeCommand('inspectHome',info.homeId);M.homePick(data);return true;};
 M.toolsExtra=()=>{if(activities.stationAt(M.player.x,M.player.z)){M.homeCommand('openCollection');return true;}const r=current();if(!r)return false;if(r.id==='mathematics'){M.homeCommand('openMathematics');return true;}if(r.id==='makers'){M.homeCommand('openCollection');return true;}if(r.id==='home'){M.homeCommand('inspectHome',r.homeId);M.homeCommand('openResidence');return true;}if(r.artistId==='dali'||r.artistEditionId){M.homePick({artistId:r.artistId,artistEditionId:r.artistEditionId,artAction:r.artistEditionId?'edition-study':'study'});return true;}return false;};
 if(M.homeBridge){
  const original=M.homeBridge.handle,extraMethods=['prepareCity','enterMathCity','visitMathFloor','showNeighborhood','greetArtistResident','setArtistTalking','setSocrates','restoreResidentState','useFloorLanding'];M.homeBridge.supported.push(...extraMethods);
  M.homeBridge.handle=async(event,d)=>{
   if(event.origin!==location.origin||event.source!==frame().contentWindow)return false;
   if(d?.type!=='city-home-tool')return original(event,d);
   const [a,b]=d.args||[];try{
    const place=current(),neighbor=place?.homeId&&homeOwners.get(place.homeId);
    if(neighbor&&['setFloor','focusRoom','select','useFloorLanding','toggleHomeLight','seatAt','stand'].includes(d.action)){
     let value=true;if(d.action==='setFloor')value=neighborFloor(place.homeId,a);else if(['focusRoom','select'].includes(d.action)){const roomId=typeof a==='string'?a:a?.roomId,room=neighbor.house.rooms.find(r=>r.id===roomId);value=!!room&&neighborFloor(place.homeId,room.floor||0,roomId);}else if(d.action==='useFloorLanding'){const stairs=neighbor.house.stairs?.find(s=>s.id===a),room=[stairs?.a,stairs?.b].map(id=>neighbor.house.rooms.find(r=>r.id===id)).find(r=>r&&(r.floor||0)!==Number(b));value=!!room&&neighborFloor(place.homeId,room.floor||0,room.id);}else if(d.action==='toggleHomeLight')value=neighbor.toggleLight(a);else if(d.action==='seatAt'){const anchor=a?.anchor||a;if(!Number.isFinite(anchor?.x)||!Number.isFinite(anchor?.z)||!neighbor.canStand(anchor.x,anchor.z,neighbor.floor))throw Error('This preserved seat has no safe source anchor.');const p=E.toWorld('home',{...anchor,y:neighbor.height},{homeId:place.homeId});M.arrive(p);M.player.y-=.65;}else M.player.y=M.cityGroundHeight(M.player.x,M.player.z)+M.eye;reply(d,value);return true;
    }
    const activity=activities.handle(d.action,d.args||[]);if(activity.handled){reply(d,activity.value);return true;}
    const remote=socrates.handle(d.action,d.args||[]);if(remote.handled){reply(d,remote.value);return true;}
    if(d.action==='load'){const floor=M.city.homeBuilt?.floor||0,p={...M.player},wasHome=oldRegion(p.x,p.z).id==='socrates',roomId=oldRegion(p.x,p.z).room?.id,result=await original(event,d);if(wasHome&&floor>0&&M.city.homeBuilt?.setFloor(floor)){Object.assign(M.player,p);if(!M.city.canStand(p.x,p.z)){const room=M.city.house.rooms.find(r=>r.id===roomId&&(r.floor||0)===floor)||M.city.house.rooms.find(r=>(r.floor||0)===floor);if(room)M.homeBridge.focusRoom(room.id);}}socrates.refreshHome();return result;}
    if(d.action==='setEdition'){if(!['legacy','inhabited','atelier','residence'].includes(a))throw Error('Choose an original home edition.');selectedEdition=a;return original(event,d);}
    if(d.action==='setCityNetwork'){const job=sceneQueue.then(async()=>{const result=await E.updateNetwork(a);activities.updateNetwork(a);if(result.geometryChanged)rebuildResidents();refreshTargets();await original(event,d);});sceneQueue=job.catch(()=>{});await job;return true;}
    if(d.action==='setNeighborhood'){const job=sceneQueue.then(async()=>{await E.updateNeighborhood(a,b);refreshTargets();await original(event,d);});sceneQueue=job.catch(()=>{});await job;return true;}
    if(['travelToCity','visitCityLandmark','enterArtistHouse','enterMathCity','visitMathFloor','showNeighborhood','prepareCity'].includes(d.action)){
     let result;if(d.action==='visitMathFloor')result=lift(a);else if(d.action==='prepareCity'){if(!['home','artists','makers','mathematics','objects'].includes(a))throw Error(CITY_I18N.tx('یک محلهٔ متصل انتخاب کنید.','Choose a connected source district.'));result=true;}else{const dest=d.action==='enterMathCity'?'mathematics':d.action==='showNeighborhood'?'city':d.action==='enterArtistHouse'?(b?'artist-edition:'+b:'artist:'+a):a;result=M.startExtra(dest);if(!result)return original(event,d);}reply(d,result);return true;
    }
    if(d.action==='useFloorLanding'){const H=CITY_HOME_SCENE,stairs=M.city.house.stairs?.find(s=>s.id===a);if(!stairs)throw Error('Unknown house stair.');const rooms=[stairs.a,stairs.b].map(id=>M.city.house.rooms.find(r=>r.id===id)),other=rooms.find(r=>H.floorOf(r)!==Number(b));if(!other)throw Error('The source staircase has no other floor.');const ok=M.homeBridge.setFloor(H.floorOf(other));reply(d,ok);return true;}
    if(d.action==='greetArtistResident'){const ok=M.city.region(M.player.x,M.player.z)?.artistId===a&&residents.greet(a);reply(d,!!ok);return true;}
    if(d.action==='setArtistTalking'){talkingId=b&&artistState(a).near?a:null;if(talkingId)M.clearMovement();reply(d,true);return true;}
    if(d.action==='restoreResidentState'){const p=a?.position,H=CITY_HOME_SCENE;if(!p||!M.city.homeBuilt?.canStand(p.x,p.z,.2)){reply(d,false);return true;}M.city.resident.position.set(p.x,M.city.homeBuilt.floor*H.FLOOR_HEIGHT+.02,p.z);reply(d,true);return true;}
    if(['focusRoom','select','setFloor','enterHouse','startOutside','reset','returnDesign','tourDesign','visitMarketObject','enterArtCity','leaveArtCity'].includes(d.action))activities.cancel(false);
    return original(event,d);
   }catch(error){reply(d,undefined,error.message);M.status(error.message);return true;}
  };
  // Public frame context, with private room titles/notes passed verbatim only in memory.
  const post=frame().contentWindow?.postMessage;
  if(post){/* State normalization is performed in the child protocol adapter. */}
 }
 addEventListener('message',e=>{if(e.origin!==location.origin||!CITY_TOOL_FRAMES.isHome(e.source))return;if(e.data?.type==='city-home-tool'&&e.data.action==='ready')refreshTargets();});
 addEventListener('pagehide',()=>{activities.dispose();socrates.dispose();residents.dispose();E.dispose();M.homeBridge?.dispose();},{once:true});
 if(!frame().hasAttribute('src'))frame().src=new URL('./city-source-assets/home-tools/index.html?lang='+CITY_I18N.lang,import.meta.url).href;
 installPhilosopherQuarter(M,T);
 installIdeasGraveyard(M,T);
 installVisitMemory(M);
 installEscherHouse(M,T);
 installSocratesTour(M,T,socrates);
 installOrigamiPark(M,T);
 M.storyJourney=installDiscoveryStory(M);
 M.studyBook=installStudyBook(M,T);
 installQuestionWalk(M,T);
 M.status('ready');
 installCinematicIntro(M,T,socrates);
}catch(error){document.body.classList.remove('cinematic-pending');console.error('Original district integration failed',error);M.status(error.message);}
