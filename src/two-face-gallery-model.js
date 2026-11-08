/* Shared, local-coordinate geometry and navigation for the island's central well. */
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const GALLERY_THICKNESS=96;
export const GRAVITY_TURN_Y=-48;
const common={radius:16,width:3.2,innerRadius:14.4,outerRadius:17.6,navInset:.055,turns:3,endTheta:TAU*3,steps:240,treadDepth:.24,feetTolerance:.43,maxThetaDelta:.34,mid:Object.freeze({minX:12.8,maxX:20.8,minZ:-3.2,maxZ:3.2,y:-48})};
export const UPPER=Object.freeze({...common,id:'upper',topY:-24,bottomY:-48,topBridge:Object.freeze({minX:9,maxX:18,minZ:-1.8,maxZ:1.8,y:-24}),spur:Object.freeze({minX:15.7,maxX:22,minZ:-2,maxZ:2,y:-40,theta:TAU*2})});
export const LOWER=Object.freeze({...common,id:'lower',topY:.13,bottomY:-48,topBridge:Object.freeze({minX:16,maxX:20,minZ:-1.8,maxZ:1.8,y:.13}),floor:Object.freeze({innerRadius:19,outerRadius:58,y:.13}),walkout:Object.freeze({minX:-64,maxX:-56,minZ:-2.5,maxZ:2.5,y:.13})});
export const TWO_FACE_GALLERY_CONTRACT=Object.freeze({thickness:GALLERY_THICKNESS,turnY:GRAVITY_TURN_Y,stepsPerSide:240,coordinateSpace:'local +Y up',upperTunnelEndpoint:Object.freeze({x:22,y:-40,z:0}),lowerWestEndpoint:Object.freeze({x:-64,y:.13,z:0}),lowerPhysicalTransform:'X=logicalX+2160; Y=-96-logicalY; Z=-logicalZ-65'});
export function gallerySide(side='upper'){if(side===UPPER||side==='upper')return UPPER;if(side===LOWER||side==='lower')return LOWER;throw new RangeError('Unknown gallery side');}
/** The top of the real tread, including exact top and middle endpoints. */
export function heightAt(theta,side='upper',{continuous=false}={}){const s=gallerySide(side),u=clamp(theta,0,s.endTheta)/s.endTheta,n=continuous?u:Math.floor(u*s.steps+1e-9)/s.steps;return s.topY+(s.bottomY-s.topY)*n;}
export function pointAt(theta,side='upper',{radius,continuous=false}={}){const s=gallerySide(side),a=clamp(theta,0,s.endTheta),r=radius??s.radius;return{x:r*Math.cos(a),y:heightAt(a,s,{continuous}),z:r*Math.sin(a),theta:a};}
/** Tangent for increasing theta. Its Y slope is continuous, unlike the treads. */
export function headingAt(theta,side='upper'){const s=gallerySide(side),slope=(s.bottomY-s.topY)/s.endTheta,length=Math.hypot(s.radius,slope);return{x:-s.radius*Math.sin(theta)/length,y:slope/length,z:s.radius*Math.cos(theta)/length,yaw:Math.atan2(Math.sin(theta),-Math.cos(theta))};}
/** Unwrap the angle only onto a tread near the current feet and previous coil. */
export function nearestTheta(x,z,side='upper',{feetY,lastTheta=null,maxThetaDelta,feetTolerance}={}){const s=gallerySide(side);if(!Number.isFinite(feetY)||!Number.isFinite(x)||!Number.isFinite(z))return null;const r=Math.hypot(x,z);if(r<s.innerRadius+s.navInset||r>s.outerRadius-s.navInset)return null;let a=Math.atan2(z,x);if(a<0)a+=TAU;const candidates=[];for(let turn=0;turn<=s.turns;turn++){const theta=a+turn*TAU;if(theta>s.endTheta+1e-8)continue;const t=clamp(theta,0,s.endTheta),y=heightAt(t,s);if(Math.abs(y-feetY)>(feetTolerance??s.feetTolerance))continue;if(Number.isFinite(lastTheta)&&Math.abs(t-lastTheta)>(maxThetaDelta??s.maxThetaDelta))continue;candidates.push(t);}if(!candidates.length)return null;candidates.sort((a,b)=>Number.isFinite(lastTheta)?Math.abs(a-lastTheta)-Math.abs(b-lastTheta):Math.abs(heightAt(a,s)-feetY)-Math.abs(heightAt(b,s)-feetY));return candidates[0];}
const inside=(p,x,z,inset=0)=>x>=p.minX+inset&&x<=p.maxX-inset&&z>=p.minZ+inset&&z<=p.maxZ-inset;
function endpointAllows(theta,layer,s){if(layer==='floor'||layer==='top'||layer==='walkout')return theta<=.30;if(layer==='spur')return !!s.spur&&Math.abs(theta-s.spur.theta)<=.30;if(layer==='mid')return theta>=s.endTheta-.30;return true;}
/** Feet height is mandatory. Omitted/incorrect height never selects another floor. */
export function surfaceAt(x,z,feetY,{side='upper',lastTheta=null,layer=null,maxThetaDelta,feetTolerance}={}){const s=gallerySide(side),tol=feetTolerance??s.feetTolerance;if(!Number.isFinite(feetY))return null;const theta=nearestTheta(x,z,s,{feetY,lastTheta,maxThetaDelta,feetTolerance:tol});if(theta!==null&&endpointAllows(theta,layer,s))return{side:s.id,layer:'spiral',kind:'tread',theta,y:heightAt(theta,s)};
 const deck=(p,name,t,allowed)=>p&&allowed&&inside(p,x,z,.015)&&Math.abs(feetY-p.y)<=tol?{side:s.id,layer:name,kind:name,theta:t,y:p.y}:null;
 const nearTop=!Number.isFinite(lastTheta)||lastTheta<=.34,nearMid=!Number.isFinite(lastTheta)||lastTheta>=s.endTheta-.34,nearSpur=s.spur&&(!Number.isFinite(lastTheta)||Math.abs(lastTheta-s.spur.theta)<=.34);
 const mid=deck(s.mid,'mid',s.endTheta,nearMid);if(mid)return mid;
 const spur=deck(s.spur,'spur',s.spur?.theta,nearSpur);if(spur)return spur;
 const top=deck(s.topBridge,'top',0,nearTop);if(top)return top;
 const walkout=deck(s.walkout,'walkout',0,nearTop);if(walkout)return walkout;
 if(s.floor&&nearTop&&Math.abs(feetY-s.floor.y)<=tol){const r=Math.hypot(x,z);if(r>=s.floor.innerRadius+.015&&r<=s.floor.outerRadius-.035)return{side:s.id,layer:'floor',kind:'floor',theta:0,y:s.floor.y};}
 return null;
}
/** Mutates x/y/z and galleryTheta/galleryLayer; subdivides frames for rail/edge safety. */
export function walkGallery(player,dx,dz,{side=player.gallerySide??'upper',eye=1.8,lastTheta=player.galleryTheta??null,layer=player.galleryLayer??null,canStand=()=>true}={}){const s=gallerySide(side);if(![player.x,player.y,player.z,dx,dz,eye].every(Number.isFinite))throw new TypeError('Finite position, movement and eye height required');const distance=Math.hypot(dx,dz),count=Math.max(1,Math.ceil(distance/.12));let surface=surfaceAt(player.x,player.z,player.y-eye,{side:s,lastTheta,layer}),moved=false,blocked=false;if(!surface)return{moved:false,blocked:true,side:s.id,theta:lastTheta,layer,surface:null,feetY:player.y-eye};for(let i=0;i<count;i++){const x=player.x+dx/count,z=player.z+dz/count,next=surfaceAt(x,z,player.y-eye,{side:s,lastTheta:surface.theta,layer:surface.layer});if(!next||!canStand(x,z,next.y)){blocked=true;break;}player.x=x;player.z=z;player.y=next.y+eye;surface=next;moved=moved||distance>0;}
 player.galleryTheta=surface.theta;player.galleryLayer=surface.layer;player.gallerySide=s.id;return{moved,blocked,side:s.id,theta:surface.theta,layer:surface.layer,surface,feetY:surface.y};}
