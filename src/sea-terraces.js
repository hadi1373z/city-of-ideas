import {SEA_TERRACES as S,SEA_TERRACE_ENTRY,seaTerraceFloorAt,seaTerraceCanStand} from './sea-terraces-model.js';
import {buildSeaTerraces} from './sea-terraces-scene.js';
import {buildSeaTerraceAccess} from './sea-terraces-access.js';

export const SEA_TERRACE_NAMES=Object.freeze({en:'Sea Terraces',de:'Meeresterrassen',fa:'ایوان تماشای دریا'});
export function installSeaTerraces(M,T,{events=globalThis}={}){
 if(M.seaTerraces)return M.seaTerraces;
 const built=buildSeaTerraces(T),access=buildSeaTerraceAccess(T),parent=M.origamiHouse?.coast?.group??M.scene;parent.add(built.group,access.group);
 const prior={ground:M.extraGround,can:M.city.canStand,region:M.city.region,start:M.startExtra};let disposed=false;
 const name=()=>SEA_TERRACE_NAMES[globalThis.CITY_I18N?.lang]??SEA_TERRACE_NAMES.en;
 const ground=(x,z)=>seaTerraceFloorAt(x,z)??prior.ground?.(x,z);
 function can(x,z,...args){
  if(!prior.can.call(M.city,x,z,...args))return false;
  const feet=M.player.y-M.eye,current=seaTerraceFloorAt(M.player.x,M.player.z),next=seaTerraceFloorAt(x,z);
  // The sea lip is real masonry, not a teleport down to the grass. Leave by
  // the central/side ramps whose actual surfaces reach the original .13m ground.
  if(current!==null&&next===null&&Math.abs(feet-S.floor)>.10)return false;
  return seaTerraceCanStand(x,z,feet);
 }
 const region=(x,z,...args)=>M.mode==='city'&&seaTerraceFloorAt(x,z)!==null&&Math.abs(M.player.y-M.eye-(seaTerraceFloorAt(x,z)))<.35?{id:S.id,title:name(),inside:false}:prior.region.call(M.city,x,z,...args);
 function visit(){if(disposed)return false;M.clearMovement();M.setCityMode();M.arrive({...SEA_TERRACE_ENTRY});M.player.pitch=SEA_TERRACE_ENTRY.pitch;return true;}
 const start=id=>id===S.id?visit():prior.start?.call(M,id);
 M.extraGround=ground;M.city.canStand=can;M.city.region=region;M.startExtra=start;
 const api={built,access,visit,name,floorAt:seaTerraceFloorAt,dispose(){if(disposed)return;disposed=true;if(M.extraGround===ground)M.extraGround=prior.ground;if(M.city.canStand===can)M.city.canStand=prior.can;if(M.city.region===region)M.city.region=prior.region;if(M.startExtra===start)M.startExtra=prior.start;built.dispose();access.dispose();events.removeEventListener?.('pagehide',api.dispose);if(M.seaTerraces===api)delete M.seaTerraces;}};
 M.seaTerraces=api;events.addEventListener?.('pagehide',api.dispose,{once:true});return api;
}
