import {createStaticMeshBatches} from './static-mesh-batches.js';
// This owns only render proxies. Original nodes remain the action/collision source.
while(!window.CITY_MAIN?.homeState||!window.CITY_EXTRAS||!window.CITY_ACTIVITIES)await new Promise(resolve=>setTimeout(resolve,25));
const M=window.CITY_MAIN,E=window.CITY_EXTRAS,A=window.CITY_ACTIVITIES,T=window.THREE;
const roots=()=>[M.city.homeBuilt?.group,M.city.art?.group,E.group,...A.groups,window.CITY_PHILOSOPHERS?.group].filter(Boolean);
const batches=createStaticMeshBatches(T,{roots:roots(),includeStaticActions:true,mergeEquivalentMaterials:true,batchDescendants:true,validationMode:'fast'});window.CITY_RENDER_BATCHES=batches;
let disposed=false,pending=false;const watched=new WeakSet();
const rescan=()=>{if(disposed)return;batches.rescan(roots());watchReady();};
const schedule=()=>{if(pending||disposed)return;pending=true;queueMicrotask(()=>{pending=false;rescan();});};
function watchReady(){const owner=M.city.homeBuilt;if(owner?.ready&&!watched.has(owner)){watched.add(owner);Promise.resolve(owner.ready).then(schedule,error=>console.warn('Source home render readiness failed',error.message));}}
watchReady();
const suspend=()=>batches.setRoots([]);
const oldSetHome=M.city.setHome;M.city.setHome=(...args)=>{suspend();return oldSetHome(...args);};
for(const name of ['updateNetwork','updateNeighborhood']){const previous=E[name];E[name]=async(...args)=>{suspend();try{return await previous(...args);}finally{rescan();}};}
const originalUpdate=M.city.update;M.city.update=(...args)=>{originalUpdate(...args);batches.update();};
const originalHandle=M.homeBridge.handle;M.homeBridge.handle=async(event,data)=>{
 const trusted=event.origin===location.origin&&CITY_TOOL_FRAMES.isHome(event.source),result=await originalHandle(event,data);
 if(trusted&&data?.type==='city-home-tool'&&['load','setNeighborhood','setEdition','setCityNetwork','setFloor','useFloorLanding','focusRoom','select','toggleHomeLight'].includes(data.action))rescan();
 return result;
};
const originalShow=M.showExtra;M.showExtra=info=>{const result=originalShow(info);if(result&&(info.data?.homeAction==='light'||info.data?.homeAction==='stairs'))rescan();return result;};
const originalStart=M.startExtra;M.startExtra=(...args)=>{const result=originalStart(...args);if(result)rescan();return result;};
addEventListener('city-language',schedule);
addEventListener('pagehide',()=>{disposed=true;batches.dispose();},{once:true});
