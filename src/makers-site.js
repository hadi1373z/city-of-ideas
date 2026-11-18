// The complete source courtyard sits inside the north-eastern hexagon (2,-1).
export const MAKERS_SITE=Object.freeze({x:Math.sqrt(3)*138,y:.13,z:-170,scale:1});
export const MAKERS_ACCESS=Object.freeze({id:'makers-courtyard-entry',width:4,points:[[MAKERS_SITE.x-13.5,MAKERS_SITE.z],[199,-170],[Math.sqrt(3)*92,-184]]});
export const MAKERS_ROOFS=Object.freeze([['library',-9,-8],['workshop',9,-8],['dialogue',0,9]].map(([id,x,z])=>({id:'makers-'+id,x:MAKERS_SITE.x+x,z:MAKERS_SITE.z+z,width:10,depth:8.4,front:[MAKERS_SITE.x+x,MAKERS_SITE.z+z+(id==='dialogue'?-4.2:4.2)]})));

export const MAKERS_DOOR_PATHS=Object.freeze(MAKERS_ROOFS.map(h=>({id:h.id+'-door',width:2.8,points:[h.front,[h.x,MAKERS_SITE.z],[MAKERS_SITE.x-13.5,MAKERS_SITE.z]]})));
