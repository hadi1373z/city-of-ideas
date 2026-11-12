// Original lower-face landscape. Coordinates are local +Y-up, before the rigid
// world-cylinder half-turn. Walking stays on the existing .13m reference floor.
const smooth=(points,steps=12)=>{const out=[];for(let i=0;i<points.length-1;i++){const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];for(let j=0;j<steps;j++){const t=j/steps,t2=t*t,t3=t2*t;out.push([0,1].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)));}}out.push([...points.at(-1)]);return out;};
export const LOWER_COAST_WALKS=Object.freeze([
 {id:'meadow-circuit',name:'Meadow and inlet circuit',width:7,points:smooth([[-191,-4],[-235,0],[-270,0],[-300,0],[-340,-60],[-355,-140],[-300,-225],[-160,-300],[0,-335],[150,-300],[250,-210],[290,-90],[290,-65],[290,-40],[290,10],[290,50],[215,100],[140,150],[70,175],[-30,175],[-78,145],[-101,85]])},
 {id:'ocean-overlook',name:'Inlet bridge to the ocean',width:6.8,points:smooth([[290,50],[370,75],[455,120],[490,126],[510,131],[520,134]])}
]);
const riverControls=[[65,-125,7],[120,-90,12],[180,-50,17],[235,-40,26],[300,-30,24],[360,-55,22],[420,-80,28],[500,-75,42],[565,-70,60]];
const riverXY=smooth(riverControls.map(p=>p.slice(0,2)),16);
export const LOWER_INLET=Object.freeze({points:riverXY.map((p,i)=>{const n=i/16,k=Math.min(riverControls.length-2,Math.floor(n)),u=Math.min(1,n-k);return{x:p[0],z:p[1],width:riverControls[k][2]+(riverControls[k+1][2]-riverControls[k][2])*u};}),waterY:.018,bankY:.012});
export const LOWER_COAST=Object.freeze({floor:.13,bridge:{minX:283.8,maxX:297.2,minZ:-80,maxZ:18},shoreBridge:{radius:536,width:9,minAngle:-.24,maxAngle:-.025},overlook:{x:520,z:134,y:.13,yaw:-Math.atan2(520,134),radius:11},anchors:{circuit:{x:-101,z:85},inlet:{x:292,z:10},overlook:{x:520,z:134}},promenadeRadius:536});
export function segmentDistance(x,z,a,b){const ax=a.x??a[0],az=a.z??a[1],bx=b.x??b[0],bz=b.z??b[1],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1)));return{distance:Math.hypot(x-ax-dx*t,z-az-dz*t),t};}
export function routeDistance(x,z,route){let d=Infinity;for(let i=1;i<route.points.length;i++)d=Math.min(d,segmentDistance(x,z,route.points[i-1],route.points[i]).distance);return d;}
export function inLowerInlet(x,z,margin=0){if(!Number.isFinite(x)||!Number.isFinite(z))return false;const p=LOWER_INLET.points;for(let i=1;i<p.length;i++){const q=segmentDistance(x,z,p[i-1],p[i]),width=p[i-1].width+(p[i].width-p[i-1].width)*q.t;if(q.distance<width/2+margin)return true;}return false;}
export function lowerLandscapeCanStand(x,z){if(!Number.isFinite(x)||!Number.isFinite(z))return false;const b=LOWER_COAST.bridge,s=LOWER_COAST.shoreBridge,a=Math.atan2(z,x),bridge=x>b.minX+.28&&x<b.maxX-.28&&z>b.minZ&&z<b.maxZ,shoreBridge=Math.abs(Math.hypot(x,z)-s.radius)<s.width/2-.28&&a>s.minAngle&&a<s.maxAngle;return bridge||shoreBridge||!inLowerInlet(x,z,.28);}
