import {HOUSE as H,HOUSE_LEVELS,houseSurface,houseRoomAt,houseInteractionAt,houseBlocked,inHex} from './transformation-house-model.js?v=sixfold-city-20261118b';

const EPS=1e-8,ids=['east','southeast','southwest','west','northwest','northeast'],patterns=['penrose','hexagonal','triangular','square','octagon-square','trihexagonal'],names=['Penrose House','Hexagon House','Triangle House','Square House','Octagon House','Trihexagonal House'];
export const SIXFOLD_HOUSE_NETWORK=Object.freeze({radius:159.3486742963367,loopRadius:106.3486742963367,y:-40,width:4,walkHalfWidth:1.72,floorThickness:.24,ceilingBottom:-35.2,wallTop:-35,sourceX:H.x,sourceZ:0,galleryExitX:71.1,galleryCaptureX:71.25,crossingSleeve:4.3,crossingExit:3.6,crossingCaptureOffset:1.2});
export const SIXFOLD_HOUSES=Object.freeze(ids.map((id,index)=>{const angle=index*Math.PI/3;return Object.freeze({id,index,angle,turn:-angle,x:SIXFOLD_HOUSE_NETWORK.radius*Math.cos(angle),z:SIXFOLD_HOUSE_NETWORK.radius*Math.sin(angle),radius:H.radius,well:H.well,pattern:patterns[index],name:names[index]});}));
export const SIXFOLD_INSTANCES=SIXFOLD_HOUSES;
export const sixfoldHouse=id=>SIXFOLD_HOUSES.find(h=>h.id===id);
export function houseToWorld(h,p){if(typeof h==='string')h=sixfoldHouse(h);if(!h)return null;const c=Math.cos(h.turn),s=Math.sin(h.turn),x=p.x-H.x,z=p.z;return{...p,x:h.x+x*c+z*s,z:h.z-x*s+z*c,...(Number.isFinite(p.yaw)?{yaw:p.yaw+h.turn}:{}),houseInstance:h.id};}
export function houseToSource(h,p){if(typeof h==='string')h=sixfoldHouse(h);if(!h)return null;const c=Math.cos(h.turn),s=Math.sin(h.turn),x=p.x-h.x,z=p.z-h.z;return{...p,x:H.x+x*c-z*s,z:x*s+z*c,...(Number.isFinite(p.yaw)?{yaw:p.yaw-h.turn}:{})};}
export const sixfoldHouseEntry=(h,{inside=false,feet=.13}={})=>houseToWorld(h,{x:125,z:inside?22:26,y:feet,yaw:0,pitch:0});
export const sixfoldWellHoles=()=>SIXFOLD_HOUSES.map(h=>({id:h.id,x:h.x,z:h.z,radius:H.well}));
export const SIXFOLD_LOOP_VERTICES=Object.freeze(SIXFOLD_HOUSES.map(h=>Object.freeze([SIXFOLD_HOUSE_NETWORK.loopRadius*Math.cos(h.angle),SIXFOLD_HOUSE_NETWORK.loopRadius*Math.sin(h.angle)])));
export const SIXFOLD_CROSSING=Object.freeze({id:'legacy-escher-crossing',x:70,z:Math.sqrt(3)*(SIXFOLD_HOUSE_NETWORK.loopRadius-70),y:-40,width:4,walkHalfWidth:1.72,sleeveHalfLength:4.3,exitDistance:3.6,captureOffset:1.2});
export const SIXFOLD_NETWORK=Object.freeze({...SIXFOLD_HOUSE_NETWORK,crossing:SIXFOLD_CROSSING});
const segment=(id,a,b,kind,houseId=null)=>Object.freeze({id,kind,houseId,a:Object.freeze(a),b:Object.freeze(b),width:4,walkHalfWidth:1.72,y:-40,ceilingBottom:-35.2});
export const SIXFOLD_CORRIDORS=Object.freeze([
 ...SIXFOLD_LOOP_VERTICES.map((a,i)=>segment('loop-'+i,a,SIXFOLD_LOOP_VERTICES[(i+1)%6],'loop')),
 ...SIXFOLD_HOUSES.map((h,i)=>{const b=houseToWorld(h,{x:104,z:0});return segment('spur-'+h.id,SIXFOLD_LOOP_VERTICES[i],[b.x,b.z],'house-spur',h.id);}),
 segment('gallery-east',[70.75,0],SIXFOLD_LOOP_VERTICES[0],'gallery-branch'),
 segment('legacy-crossing-sleeve',[70,SIXFOLD_CROSSING.z-4.3],[70,SIXFOLD_CROSSING.z+4.3],'legacy-junction')
]);
// Physical shell segments. Existing source-house wall apertures meet the spur
// at localX=-23..-21.8453; each walking join also overlaps the real room slab.
export const NETWORK_PASSAGES=Object.freeze(SIXFOLD_CORRIDORS.filter(s=>s.kind!=='legacy-junction').map(s=>{let a=s.a,b=s.b;if(s.kind==='house-spur'){const p=houseToWorld(s.houseId,{x:102+2/Math.sqrt(3),z:0});b=[p.x,p.z];}if(s.kind==='gallery-branch')a=[71,0];return Object.freeze({...s,a:Object.freeze([...a]),b:Object.freeze([...b])});}));
export function corridorProjection(s,x,z){const dx=s.b[0]-s.a[0],dz=s.b[1]-s.a[1],l2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-s.a[0])*dx+(z-s.a[1])*dz)/l2)),px=s.a[0]+dx*t,pz=s.a[1]+dz*t;return{t,x:px,z:pz,distance:Math.hypot(x-px,z-pz)};}
export function networkCorridorAt(x,z,feet=-40,{physical=false}={}){if(![x,z,feet].every(Number.isFinite)||Math.abs(feet+40)>.29)return null;return SIXFOLD_CORRIDORS.find(s=>corridorProjection(s,x,z).distance<=(physical?s.width/2:s.walkHalfWidth)+EPS)??null;}
export function networkCrossingAt(x,z,feet=-40){if(Math.abs(feet+40)>.3)return null;return Math.abs(x-70)<=3.4&&Math.abs(z-SIXFOLD_CROSSING.z)<=5?SIXFOLD_CROSSING:null;}
export const crossingAt=networkCrossingAt;
// This exact release predicate also excludes inactive capture. Otherwise the
// next frame can recapture the visitor on a finite sleeve and prevent an exit.
export function networkGalleryHandoff(x,z,feet=-40){if(Math.abs(feet+40)>.3)return null;if(x<71.1&&x>=69&&Math.abs(z)<1.72)return'east';if(Math.abs(x-70)<1.72&&Math.abs(z-SIXFOLD_CROSSING.z)>3.6&&Math.abs(z-SIXFOLD_CROSSING.z)<=6.05)return z<SIXFOLD_CROSSING.z?'crossing-south':'crossing-north';return null;}
export function networkGalleryCapture(x,z,feet=-40){if(Math.abs(feet+40)>.3||networkGalleryHandoff(x,z,feet))return false;if(x>71.25&&x<73.1&&Math.abs(z)<1.7)return true;return !!networkCrossingAt(x,z,feet)&&Math.abs(x-70)>1.2&&!!networkCorridorAt(x,z,feet);}
export function networkOutdoorHandoff(h,p,eye=1.8){const q=houseToSource(h,p);return !!q&&Math.abs(q.y-eye)<.3&&q.z>23.25&&Math.abs(q.x-125)<2.5;}
export function networkHouseAt(x,z,feet,{lastHouseId=null,lastTheta=null}={}){for(const h of SIXFOLD_HOUSES){if(Math.hypot(x-h.x,z-h.z)>27)continue;const q=houseToSource(h,{x,z}),s=houseSurface(q.x,q.z,feet,lastHouseId===h.id?lastTheta:null);if(s&&s.kind!=='passage')return{house:h,source:q,surface:s};}return null;}
export function networkSurface(x,z,feet,options={}){if(![x,z,feet].every(Number.isFinite))return null;const found=networkHouseAt(x,z,feet,options);if(found)return{...found.surface,houseId:found.house.id,sourceKind:found.surface.kind,source:found.source};const corridor=networkCorridorAt(x,z,feet);return corridor?{y:-40,theta:null,kind:'network',houseId:null,corridorId:corridor.id,corridor}:null;}
export function networkRoomAt(x,z,feet,options={}){const found=networkHouseAt(x,z,feet,options);if(!found)return null;const level=houseRoomAt(found.source.x,found.source.z,feet,options.lastHouseId===found.house.id?options.lastTheta:null);return level?{...level,houseId:found.house.id,house:found.house}:null;}
export function networkInteractionAt(x,z,feet,{states={},lastHouseId=null,lastTheta=null}={}){const room=networkRoomAt(x,z,feet,{lastHouseId,lastTheta});if(!room)return null;const q=houseToSource(room.house,{x,z}),action=houseInteractionAt(q.x,q.z,feet,{shelfOpen:!!states[room.houseId]?.shelfOpen,lastTheta:lastHouseId===room.houseId?lastTheta:null});return action?{action,houseId:room.houseId}:null;}
export function networkBlocked(x,z,feet,{states={}}={}){const found=networkHouseAt(x,z,feet);if(!found)return false;const state=states[found.house.id]||{},p=found.source;return houseBlocked(p.x,p.z,feet,{shelfOpen:!!state.shelfOpen})||(state.obstacles||[]).some(o=>Math.abs(feet-o.y)<.3&&(o.radius?Math.hypot(p.x-o.x,p.z-o.z)<o.radius:Math.abs(p.x-o.x)<o.w/2&&Math.abs(p.z-o.z)<o.d/2));}
export function networkShellBlocks(x,z,feet){if(Math.abs(feet)>.5)return false;return SIXFOLD_HOUSES.some(h=>{const p=houseToSource(h,{x,z}),px=p.x-125;if(Math.abs(px)>24||Math.abs(p.z)>21)return false;return inHex(px,p.z,23.45)&&!inHex(px,p.z,22.5)&&!(Math.abs(px)<2.5&&p.z>19);});}
export function createSixfoldHouseStates(){return Object.fromEntries(SIXFOLD_HOUSES.map(h=>[h.id,{shelfOpen:false,ratio:1.5,lastTheta:null,obstacles:[]}]));}
export function walkSixfoldNetwork(p,dx,dz,{eye=1.8,states={}}={}){if(![dx,dz,p.x,p.y,p.z].every(Number.isFinite))return p;const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.085));for(let i=0;i<n;i++)for(const axis of['x','z']){const x=p.x+(axis==='x'?dx/n:0),z=p.z+(axis==='z'?dz/n:0),s=networkSurface(x,z,p.y-eye,{lastHouseId:p.houseInstance,lastTheta:p.houseTheta});if(!s||networkBlocked(x,z,s.y,{states}))continue;p.x=x;p.z=z;p.y=s.y+eye;p.houseInstance=s.houseId;p.houseTheta=s.theta??null;p.houseNetworkPart=s.corridorId??null;if(s.houseId&&states[s.houseId])states[s.houseId].lastTheta=p.houseTheta;}return p;}
export function networkCanCapture(p,{eye=1.8,mode='city',worldRoute=null}={}){if(mode!=='city'||worldRoute)return null;const feet=p.y-eye;if(networkGalleryHandoff(p.x,p.z,feet))return null;const s=networkSurface(p.x,p.z,feet,{lastHouseId:p.houseInstance,lastTheta:p.houseTheta});if(!s)return null;if(s.houseId){const q=houseToSource(s.houseId,p);if(Math.abs(feet)>.3||q.z>23.1)return null;}return s;}
export {HOUSE_LEVELS};
