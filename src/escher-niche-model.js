import {DESCENT,DESCENT_PARTS} from './escher-descent-model.js';

// Reserve masonry OUTSIDE the immutable stair enclosure. No tread, landing,
// walking band, rail or original niche centre is moved to obtain real depth.
export const ESCHER_NICHE_SILL=.93;
export const ESCHER_NICHE_DEPTH=.60;
export const ESCHER_NICHE_WALL=.74;
const shaft=DESCENT.shaft;
export const ESCHER_NICHE_ENCLOSURE=Object.freeze({minX:shaft.minX-.74,maxX:shaft.maxX+.74,minZ:shaft.minZ-.74,maxZ:shaft.maxZ+.74});
export const ESCHER_NICHE_FINISH_CUT=Object.freeze({minX:shaft.minX-.64,maxX:shaft.maxX+.64,minZ:shaft.minZ-.64,maxZ:shaft.maxZ+.64});
export const ESCHER_SHAFT_NICHES=Object.freeze([
 ...DESCENT_PARTS.filter(p=>p.id.startsWith('landing-')).map(p=>({id:p.id,origin:[226.5,p.y+ESCHER_NICHE_SILL,p.minZ<92?90.62:106.58],along:[1,0],out:[0,p.minZ<92?1:-1],w:2.8,spring:1.25,depth:.60,profile:'pointed'})),
 ...DESCENT_PARTS.filter(p=>p.kind==='flight').flatMap(p=>(p.i===0?[.72,.86,1]:[.2,.5,.8]).map(t=>{const side=p.x>226?1:-1;return{id:p.id+'-'+t,origin:[side>0?229.185:223.815,p.top+(p.bottom-p.top)*t+ESCHER_NICHE_SILL,p.start+(p.end-p.start)*t],along:[0,1],out:[-side,0],w:p.i===0?1.4:1.45,spring:1.05,depth:.60,profile:'pointed'};}))
].map(n=>Object.freeze({...n,origin:Object.freeze(n.origin),along:Object.freeze(n.along),out:Object.freeze(n.out)})));
export function nicheVoid(n){const corners=[-.5,.5].flatMap(s=>[-n.depth-.01,.045].map(d=>[n.origin[0]+n.along[0]*n.w*s+n.out[0]*d,n.origin[2]+n.along[1]*n.w*s+n.out[1]*d]));return{minX:Math.min(...corners.map(p=>p[0])),maxX:Math.max(...corners.map(p=>p[0])),minZ:Math.min(...corners.map(p=>p[1])),maxZ:Math.max(...corners.map(p=>p[1])),minY:n.origin[1],maxY:n.origin[1]+n.spring+n.w/2};}
export const nicheWorld=(n,[u,v,d])=>[n.origin[0]+n.along[0]*u+n.out[0]*d,n.origin[1]+v,n.origin[2]+n.along[1]*u+n.out[1]*d];
export function nicheArchHeight(n,u,extra=0){const r=n.w/2+extra;return n.spring+r*Math.pow(Math.max(0,1-Math.abs(u)/r),.65);}
export function nicheOutline(n,{inset=0,steps=40}={}){const r=n.w/2-inset,p=[[-r,inset],[r,inset],[r,n.spring]];for(let i=1;i<=steps;i++){const u=r*(1-2*i/steps);p.push([u,nicheArchHeight(n,u,-inset)]);}return p;}

// Three equal LENGTH wall facets in the lower cavity, fitted to its unchanged
// broad landing/flight aperture. Small vault pockets below use regular120°
// half-hexagons; this wider outer chamber is honestly hexagon-like, not regular.
export function nicheWallPlan(n){const width=n.w-.055,depth=n.depth-.025,setback=.045,b=(-width+2*Math.sqrt(width*width+3*(depth-setback)**2))/3;return[[-width/2,-setback],[-b/2,-depth],[b/2,-depth],[width/2,-setback]];}
export function nicheWallDepth(n,u){const p=nicheWallPlan(n);for(let i=1;i<p.length;i++)if(u<=p[i][0]){const a=p[i-1],b=p[i],t=Math.max(0,Math.min(1,(u-a[0])/(b[0]-a[0])));return a[1]+(b[1]-a[1])*t;}return p.at(-1)[1];}
export const NICHE_COURSES=6;
export function nicheCells(n){
 const bottom=n.spring*.66,top=n.spring+n.w/2*.96,step=(top-bottom)/6,cells=[],rows=[];
 for(let row=0;row<6;row++){
  const y=bottom+row*step,height=step*.94,cap=y+height+.010,half=n.w/2*Math.max(0,1-Math.pow(Math.max(0,(cap-n.spring)/(n.w/2)),1/.65)),span=Math.max(.075,2*half*.93),count=Math.max(1,Math.round(span/.18)),pitch=span/count;
  const course={row,y,top:y+step,span,count,frontDepth:.047+(5-row)*.035};rows.push(course);
  for(let i=0;i<count;i++){
   const u=-span/2+pitch*(i+.5),width=pitch-.012,front=course.frontDepth+.05*(1-Math.abs(u)/(n.w/2)),r=width/2,pocket=Math.sqrt(3)*r/2;
   cells.push({id:n.id+'-course-'+row+'-cell-'+i,row,index:i,u,y:y+.010,height,width,pitch,spring:height*.38,rise:height*.62,frontDepth:front,pocketDepth:pocket,
    plan:[[-r,-front],[-r/2,-front-pocket],[r/2,-front-pocket],[r,-front]],panel:[u-pitch/2,u+pitch/2,y,y+step]});
  }
 }
 return{bottom,top,step,cells,rows};
}
export function nicheCellMouth(c,{rear=false,steps=12}={}){const r=c.width/(rear?4:2),rise=c.rise*(rear?.80:1),p=[[c.u-r,c.y],[c.u+r,c.y],[c.u+r,c.y+c.spring]];for(let i=1;i<=steps;i++){const u=r*(1-2*i/steps);p.push([c.u+u,c.y+c.spring+rise*Math.pow(Math.max(0,1-Math.abs(u)/r),.65)]);}return p;}
export function nicheCellRoof(c,t,s){const r=c.width/2*(1-s/2),u=r*(1-2*t);return[c.u+u,c.y+c.spring+c.rise*(1-s*.2)*Math.pow(Math.max(0,1-Math.abs(1-2*t)),.65),-c.frontDepth-s*c.pocketDepth];}
