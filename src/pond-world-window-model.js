import {lowerPhysical} from './world-cylinder-model.js';

// Source: park.js Central Question Fountain; city.js PARK and group placement.
export const POND_SOURCE=Object.freeze({localX:0,localZ:0,waterRadius:11.1,waterTop:1.35,baseY:.015,centralBowlOuterRadius:4.98,boatOrbitRadius:6.6,windowInnerRadius:0,windowOuterRadius:10.65});
export function pondDescriptor(park={x:0,z:-330,scale:.65},{destination=lowerPhysical({x:-2360,y:0,z:-65}),magnification=18,baseY=POND_SOURCE.baseY}={}){
 if(![park.x,park.z,park.scale,magnification,baseY,destination.x,destination.y,destination.z].every(Number.isFinite)||park.scale<=0||magnification<=0)throw new TypeError('Finite pond transform and positive scales required');
 const waterY=baseY+POND_SOURCE.waterTop*park.scale,y=waterY+.006;
 return Object.freeze({id:'pond-world-window',title:'Pond · the other face',x:park.x,z:park.z,y,waterY,waterRadius:POND_SOURCE.waterRadius*park.scale,innerRadius:POND_SOURCE.windowInnerRadius*park.scale,outerRadius:POND_SOURCE.windowOuterRadius*park.scale,boatRadius:POND_SOURCE.boatOrbitRadius*park.scale,magnification,destination:Object.freeze({...destination}),entry:Object.freeze({x:park.x,z:park.z+14*park.scale,y:.13,yaw:0}),interactionRadius:23*park.scale});
}
export const POND_WORLD_WINDOW=pondDescriptor();
/** Same existing lower world, magnified through the water and turned +Y to −Y. */
export function pondToLower(p,pond=POND_WORLD_WINDOW){return{x:pond.destination.x+(p.x-pond.x)*pond.magnification,y:pond.destination.y-(p.y-pond.y)*pond.magnification,z:pond.destination.z-(p.z-pond.z)*pond.magnification};}
export function lowerToPond(p,pond=POND_WORLD_WINDOW){return{x:pond.x+(p.x-pond.destination.x)/pond.magnification,y:pond.y-(p.y-pond.destination.y)/pond.magnification,z:pond.z-(p.z-pond.destination.z)/pond.magnification};}
export function withinPondWindow(x,z,pond=POND_WORLD_WINDOW){const r=Math.hypot(x-pond.x,z-pond.z);return r>=pond.innerRadius&&r<=pond.outerRadius;}
export function besidePond(player,mode,pond=POND_WORLD_WINDOW){return mode==='city'&&Number.isFinite(player?.y)&&player.y>-1&&player.y<8&&Math.hypot(player.x-pond.x,player.z-pond.z)<=pond.interactionRadius;}
