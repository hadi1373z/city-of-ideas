// Original spatial interpretation of the approved Inhabited Mind study.
// All dimensions are local metres; existing world placement and arrival stay fixed.
export const INHABITED_MIND=Object.freeze({id:'de-chirico',x:226,y:.13,z:202,width:13,depth:10,entry:Object.freeze({x:226,z:191,y:.13,yaw:Math.PI}),viewpoint:Object.freeze({x:0,z:-14}),plaque:Object.freeze({x:-5.15,y:1.03,z:-5.25,width:1.36,height:.82})});
export const MIND_PALETTE=Object.freeze({ivory:0xe4d6b6,ivoryShade:0xc8b995,ochre:0xbd8745,joint:0x92673f,stone:0xc9b797,stoneEdge:0xb29d7c,column:0x454940,band:0xc6bba1,yellow:0xc59d4a,teal:0x47797b,terracotta:0xad6044,dark:0x626055,brass:0xa88a4d});
export const MIND_TOWERS=Object.freeze([
 {id:'yellow',x:1.62,z:.8,width:.86,depth:1.02,height:2.8,color:'yellow',doorWidth:.38,doorHeight:1.18,windowY:1.75,windowHeight:.65},
 {id:'teal',x:.53,z:1.05,width:.96,depth:1.12,height:4.55,color:'teal',doorWidth:.44,doorHeight:1.55,windowY:2.85,windowHeight:.9},
 {id:'terracotta',x:-.62,z:.82,width:.9,depth:1.02,height:3.55,color:'terracotta',doorWidth:.41,doorHeight:1.32,windowY:2.25,windowHeight:.68},
 {id:'dark',x:-1.65,z:1.04,width:.82,depth:.94,height:2.87,color:'dark',doorWidth:.36,doorHeight:1.1,windowY:1.73,windowHeight:.66}
].map(Object.freeze));
export const MIND_COLUMNS=Object.freeze([
 {x:-5.72,z:-3.94,height:6.45},{x:5.72,z:-3.94,height:6.45},
 {x:-5.72,z:3.9,height:4.95},{x:5.72,z:3.9,height:4.95}
].map(Object.freeze));
export const MIND_FIGURES=Object.freeze([{id:'left',x:-3.35,z:.12,side:1,tilt:-.23},{id:'right',x:3.35,z:.32,side:-1,tilt:.28}].map(Object.freeze));
export const MIND_LOOP=Object.freeze([{x:0,z:-14},{x:0,z:-4.55},{x:-4.88,z:-2.75},{x:-4.88,z:2.8},{x:0,z:3.24},{x:4.88,z:2.8},{x:4.88,z:-2.75},{x:0,z:-4.55},{x:0,z:-14}].map(Object.freeze));
export function mindObstacles(){return[
 ...MIND_COLUMNS.map((c,i)=>({id:'column-'+i,minX:c.x-.54,maxX:c.x+.54,minZ:c.z-.54,maxZ:c.z+.54,minY:0,maxY:c.height+.26})),
 ...MIND_TOWERS.map(c=>({id:'tower-'+c.id,minX:c.x-c.width/2-.09,maxX:c.x+c.width/2+.09,minZ:c.z-c.depth/2-.06,maxZ:c.z+c.depth/2+.06,minY:0,maxY:c.height+.25})),
 ...MIND_FIGURES.map(c=>({id:'figure-'+c.id,minX:c.side>0?c.x-1.1:c.x-2.27,maxX:c.side>0?c.x+2.27:c.x+1.1,minZ:c.z-.88,maxZ:c.z+.8,minY:0,maxY:4.12})),
 {id:'side-plaque',minX:INHABITED_MIND.plaque.x-.76,maxX:INHABITED_MIND.plaque.x+.76,minZ:-5.66,maxZ:-4.84,minY:0,maxY:1.4}
 ];}
export function mindCanStand(x,z,feetY=.13,{radius=.22,obstacles=mindObstacles()}={}){
 if(![x,z,feetY,radius].every(Number.isFinite)||radius<0)return false;
 const lx=x-INHABITED_MIND.x,lz=z-INHABITED_MIND.z,y=feetY-INHABITED_MIND.y;
 return !obstacles.some(c=>y<c.maxY+.02&&y+1.8>c.minY&&lx>c.minX-radius&&lx<c.maxX+radius&&lz>c.minZ-radius&&lz<c.maxZ+radius);
}
export function mindLoopSamples(spacing=.08){const points=[];for(let i=1;i<MIND_LOOP.length;i++){const a=MIND_LOOP[i-1],b=MIND_LOOP[i],n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/spacing);for(let j=0;j<=n;j++)points.push({x:INHABITED_MIND.x+a.x+(b.x-a.x)*j/n,z:INHABITED_MIND.z+a.z+(b.z-a.z)*j/n});}return points;}
