// Physical two-face geometry; lower-world logical coordinates remain stable for tools and notes.
export const WORLD_CYLINDER=Object.freeze({radius:570,thickness:96,middle:-48,lowerOrigin:{x:-2160,z:-65},lowerShift:{x:2160,z:65}});
export const isLowerCoordinate=p=>Number.isFinite(p?.x)&&p.x<-1000;
export const lowerLocal=p=>({x:p.x+2160,z:p.z+65,y:p.y??0});
export const lowerPhysical=p=>({x:p.x+2160,y:-96-(p.y??0),z:-p.z-65});
export const physicalToLower=p=>({x:p.x-2160,y:-96-p.y,z:-p.z-65});
export const lowerRadius=(x,z)=>Math.hypot(x+2160,z+65);
export const lowerOnLand=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&lowerRadius(x,z)<=565;
export const inBounds=(b,x,z)=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;
export const GALLERY_TUNNEL=Object.freeze({width:4,y:-40,points:[[22,0],[70,0],[70,115],[135,115]]});
export function tunnelContains(x,z,margin=.25){const half=GALLERY_TUNNEL.width/2-margin;return GALLERY_TUNNEL.points.slice(1).some((b,i)=>{const a=GALLERY_TUNNEL.points[i],dx=b[0]-a[0],dz=b[1]-a[1],q=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*q,z-a[1]-dz*q)<half;});}
export function lowerMatrix(T){return new T.Matrix4().set(1,0,0,2160,0,-1,0,-96,0,0,-1,-65,0,0,0,1);}
export function canWalkLower(x,z,layout,delegate){if(!lowerOnLand(x,z))return false;if(inBounds(layout.bounds,x,z))return !!delegate(x,z);return true;}
