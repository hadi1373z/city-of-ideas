/* New path geometry is independent of historical chapter IDs and saved notes. */
window.createMountainPath=function(T){
 const A={x:125,z:0,radius:54.5,outerRadius:58,topRadius:19,width:7,start:.42,top:32.395,turns:4},MAX=Math.PI*8;
 const clamp=T.MathUtils.clamp,wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const radiusAt=theta=>A.radius+(A.topRadius-A.radius)*clamp(theta/MAX,0,1);
 const heightAt=theta=>A.start+(A.top-A.start)*clamp(theta/MAX,0,1);
 const polar=(r,a,y=0)=>new T.Vector3(A.x+Math.cos(a)*r,y,A.z+Math.sin(a)*r);
 const pointAt=(theta,r=radiusAt(theta))=>polar(r,Math.PI+theta,heightAt(theta));
 const headingAt=(theta,direction=1)=>{const a=pointAt(theta),b=pointAt(theta+direction*.001);return Math.atan2(-(b.x-a.x),-(b.z-a.z))};
 function resolveRamp(x,z,theta,previous){const lx=x-A.x,lz=z-A.z,a=Math.atan2(lz,lx),old=Math.atan2(previous.z-A.z,previous.x-A.x),next=clamp(theta+wrap(a-old),0,MAX),center=radiusAt(next),r=clamp(Math.hypot(lx,lz),center-A.width/2+.35,center+A.width/2-.35),p=pointAt(next,r);return{x:p.x,z:p.z,y:p.y,theta:next}}
 const toLocal=(x,z)=>({x:z-A.z,z:A.x-x}),localLift={x:A.x-12,z:62.5,exitZ:62.5},lift={x:62.5,z:-12,exitX:62.5,exitZ:-18},startGate={inner:A.radius-A.width/2+.35,entryOuter:A.radius+A.width/2-.35,exitOuter:A.radius+A.width/2-.26,roadEnd:A.radius+8};

 const peak={minX:lift.x-2.1,maxX:A.x-A.topRadius+.8,minZ:lift.z-3,maxZ:A.z+3,rampThreshold:A.topRadius+.3};
 return{A,MAX,radiusAt,heightAt,polar,pointAt,headingAt,resolveRamp,toLocal,localLift,lift,startGate,peak};
};
