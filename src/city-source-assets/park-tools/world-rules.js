export const WORLD = Object.freeze({edition:'unified-v1',humanHeight:1.75,eyeHeight:1.65,speed:4,galleryHeight:12,cityRadius:85});
export function mountainPoint(progress) {
  const t=Math.max(0,Math.min(1,progress)),r=56-24*t,a=2*Math.PI*t;
  return {x:r*Math.sin(a),y:WORLD.galleryHeight*t,z:r*Math.cos(a),progress:t};
}
export function nearestPath(x,z) {
  let best={distance:Infinity,progress:0,y:0};
  for(let i=0;i<240;i++) {const a=mountainPoint(i/240),b=mountainPoint((i+1)/240),dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz))),distance=Math.hypot(x-a.x-t*dx,z-a.z-t*dz);if(distance<best.distance)best={distance,progress:(i+t)/240,y:a.y+(b.y-a.y)*t};}
  return best;
}
export function narrationAdvances(previous,next,moving) {
  return !!moving && Number.isFinite(previous)&&Number.isFinite(next)&&next>previous+0.00002&&next-previous<0.05;
}
export function savedPosition(value) {
  if(!value||value.edition!==WORLD.edition||!Number.isFinite(value.x)||!Number.isFinite(value.z)||Math.hypot(value.x,value.z)>234||!Number.isInteger(value.floor)||value.floor<0||value.floor>3)return null;
  if(value.floor>0&&Math.hypot(value.x,value.z)>30)return null;
  return {edition:WORLD.edition,x:value.x,z:value.z,floor:value.floor,yaw:Number.isFinite(value.yaw)?value.yaw:0};
}
export function transferHash(value) {
  const valid=savedPosition(value);return valid?'#world='+encodeURIComponent(JSON.stringify(valid)):'';
}
export function readTransfer(hash) {try{return hash.startsWith('#world=')?savedPosition(JSON.parse(decodeURIComponent(hash.slice(7)))):null;}catch{return null;}}
