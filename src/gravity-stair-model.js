import {UPPER,LOWER,heightAt,pointAt} from './two-face-gallery-model.js';

const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const add=(a,b,s=1)=>({x:a.x+b.x*s,y:a.y+b.y*s,z:a.z+b.z*s}),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
/** One physical supported stair replaces the last half-turn of both old helices. */
export const GRAVITY_STAIR=Object.freeze({joinTheta:Math.PI*5,startAngle:Math.PI*5,endAngle:Math.PI*7,radius:16,width:3.2,navHalfWidth:1.54,steps:240,depth:.18,railHeight:1.05,entryLead:.10,upperY:heightAt(Math.PI*5,UPPER),lowerY:-96-heightAt(Math.PI*5,LOWER)});
const G=GRAVITY_STAIR;
const y0=G.upperY,y1=G.lowerY,m0=(UPPER.bottomY-UPPER.topY)/3,m1=(LOWER.bottomY-LOWER.topY)/3;
const ease=t=>t*t*t*(10+t*(-15+6*t));
/** Endpoint slopes agree with the unchanged helices; roll has zero endpoint speed. */
export function gravityStairFrame(progress){
 const u=clamp(progress,0,1),angle=G.startAngle+TAU*progress,roll=Math.PI*ease(u),c=Math.cos(angle),s=Math.sin(angle),cr=Math.cos(roll),sr=Math.sin(roll);
 return{progress,angle,roll,forward:{x:-s,y:0,z:c},right:{x:-c*cr,y:-sr,z:-s*cr},up:{x:-c*sr,y:cr,z:-s*sr}};
}
export function gravityStairCenter(progress){
 if(progress<0){const p=pointAt(G.joinTheta+TAU*progress,UPPER);return{x:p.x,y:p.y,z:p.z};}
 if(progress>1){const p=pointAt(G.joinTheta-TAU*(progress-1),LOWER);return{x:p.x,y:-96-p.y,z:-p.z};}
 const u=progress,u2=u*u,u3=u2*u,y=(2*u3-3*u2+1)*y0+(u3-2*u2+u)*m0+(-2*u3+3*u2)*y1+(u3-u2)*m1,a=G.startAngle+TAU*u;
 return{x:G.radius*Math.cos(a),y,z:G.radius*Math.sin(a)};
}
/** Exact planar tread used by both mesh and walking, with closed riser seams. */
export function gravityStairTread(index){
 const i=clamp(index,0,G.steps-1),u=i/G.steps,f=gravityStairFrame(u),start=gravityStairCenter(u),next=gravityStairCenter((i+1)/G.steps),delta=add(next,start,-1),rise=dot(delta,f.up),run=add(delta,f.up,-rise);
 return{index:i,progress:u,start,end:add(start,run),next,run,rise,...f};
}
export function gravityStairPoint(progress,offset=0){
 if(progress<0||progress>=1){const f=gravityStairFrame(progress);return add(gravityStairCenter(progress),f.right,offset);}
 const i=Math.floor(progress*G.steps),t=progress*G.steps-i,q=gravityStairTread(i);return add(add(q.start,q.run,t),q.right,offset);
}
export function gravityStairPose(progress,offset=0,eye=1.8){const frame=gravityStairFrame(progress),feet=gravityStairPoint(progress,offset);return{...frame,offset,feet,eye:add(feet,frame.up,eye)};}
/** Input is expressed in the moving local frame, shared by keys and touch sticks. */
export function walkGravityStair(state,distance,strafe){
 if(![state.progress,state.offset,distance,strafe].every(Number.isFinite))throw new TypeError('Finite gravity-stair movement required');
 const progress=state.progress+distance/(TAU*G.radius),offset=clamp(state.offset+strafe,-G.navHalfWidth,G.navHalfWidth);return{...state,progress,offset};
}
