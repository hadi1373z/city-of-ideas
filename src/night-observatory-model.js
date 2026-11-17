// All coordinates are ordinary lower-local +Y-up. The existing world frame
// supplies the physical half-turn, including the skyward direction.
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const NIGHT_OBSERVATORY=Object.freeze({baseY:12.13,deckY:22.13,deckThickness:.24,steps:80,rise:.125,endTheta:TAU,landingEnd:.18,
 stairRadius:16,stairInner:14.4,stairOuter:17.6,navInset:.055,feetTolerance:.27,maxThetaDelta:.28,
 deckRadius:7.2,deckWalkRadius:6.86,bridgeInner:6.65,bridgeOuter:14.4,bridgeHalfWidth:1.6,
 roofOuter:61,roofJoin:21.5,roofOuterY:16.4,roofJoinY:20.55,roofApex:29,
 station:Object.freeze({x:0,y:22.13,z:-2.5,radius:1.3}),bench:Object.freeze({x:-4.8,z:3.5,width:2.2,depth:.72})});
export const observatoryStairY=theta=>NIGHT_OBSERVATORY.baseY+Math.floor(clamp(theta,0,TAU)/TAU*80+1e-8)*.125;
export const observatoryPoint=theta=>{const t=clamp(theta,0,TAU+.18);return{x:16*Math.cos(t),z:-16*Math.sin(t),y:observatoryStairY(t),theta:t};};
export function observatoryRoofY(radius){const c=NIGHT_OBSERVATORY,r=Math.max(0,radius);if(r>c.roofOuter)return null;if(r<=c.roofJoin)return c.roofJoinY+(c.roofApex-c.roofJoinY)*Math.sqrt(Math.max(0,1-(r/c.roofJoin)**2));const t=(r-c.roofJoin)/(c.roofOuter-c.roofJoin);return c.roofOuterY+(c.roofJoinY-c.roofOuterY)*Math.sqrt(Math.max(0,1-t*t));}
export function observatoryCanStand(x,z){const c=NIGHT_OBSERVATORY;return Math.hypot(x-c.station.x,z-c.station.z)>c.station.radius+.23&&!(Math.abs(x-c.bench.x)<c.bench.width/2+.23&&Math.abs(z-c.bench.z)<c.bench.depth/2+.23);}
export function observatorySurface(x,z,feet,{lastTheta=null,layer=null}={}){
 if(![x,z,feet].every(Number.isFinite))return null;const c=NIGHT_OBSERVATORY,r=Math.hypot(x,z),tol=c.feetTolerance;let angle=Math.atan2(-z,x);if(angle<0)angle+=TAU;
 const nearTop=!Number.isFinite(lastTheta)||lastTheta>TAU-.3,nearBottom=!Number.isFinite(lastTheta)||lastTheta<.3,topHeight=Math.abs(feet-c.deckY)<=tol;
 // The post-turn landing occupies only the next sector, never the incoming
 // lower treads. Its exact inner arc meets the inward bridge without a slab
 // laid across the previous step.
 if(topHeight&&nearTop&&angle<=c.landingEnd&&r>=c.stairInner+c.navInset&&r<=c.stairOuter-c.navInset)return{layer:'landing',kind:'landing',theta:TAU+angle,y:c.deckY};
 if(r>=c.stairInner+c.navInset&&r<=c.stairOuter-c.navInset){
  const theta=angle,y=observatoryStairY(theta);
  if(Math.abs(feet-y)<=tol&&(!Number.isFinite(lastTheta)||Math.abs(theta-lastTheta)<=c.maxThetaDelta)&&!['deck','bridge','landing'].includes(layer))return{layer:'stair',kind:'tread',theta,y};
  if(Math.abs(feet-y)<=tol&&nearTop&&theta>TAU-.24)return{layer:'stair',kind:'tread',theta,y};
 }
 const atTop=topHeight&&nearTop,arrived=layer!=='stair'||angle<=c.landingEnd;
 if(atTop&&arrived&&x>=c.bridgeInner-.1&&Math.abs(z)<=c.bridgeHalfWidth-.055&&r<=c.bridgeOuter+.13)return{layer:'bridge',kind:'bridge',theta:TAU+.08,y:c.deckY};
 if(atTop&&r<=c.deckWalkRadius&&observatoryCanStand(x,z))return{layer:'deck',kind:'deck',theta:TAU+.08,y:c.deckY};
 if(nearBottom&&Math.abs(feet-c.baseY)<=tol&&x>0&&r>=17.50&&r<=20.10&&Math.abs(z)<=1.72)return{layer:'approach',kind:'approach',theta:0,y:c.baseY};
 return null;
}
export function walkObservatory(player,dx,dz,{eye=1.8,canStand=observatoryCanStand}={}){
 if(![player.x,player.z,player.y,dx,dz,eye].every(Number.isFinite))throw new TypeError('Finite observatory position and motion required');
 const options=()=>({lastTheta:player.observatoryTheta??null,layer:player.observatoryLayer??null});let surface=observatorySurface(player.x,player.z,player.y-eye,options());if(!surface)return{moved:false,surface:null};
 const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.075));let moved=false;
 for(let i=0;i<n;i++)for(const[ax,az]of[[dx/n,0],[0,dz/n]]){const x=player.x+ax,z=player.z+az,next=observatorySurface(x,z,player.y-eye,options());if(!next||next.layer==='deck'&&!canStand(x,z))continue;player.x=x;player.z=z;player.y=next.y+eye;player.observatoryTheta=next.theta;player.observatoryLayer=next.layer;surface=next;moved=moved||!!(ax||az);}
 return{moved,surface};
}
