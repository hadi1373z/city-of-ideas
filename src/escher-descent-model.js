// Eight real switchback flights join the original surface alcove to the museum.
export const DESCENT=Object.freeze({top:.13,bottom:-40,flights:8,steps:40,north:92,south:104,lanes:[228,225],width:1.8,
 shaft:{minX:223.8,maxX:229.2,minZ:90.6,maxZ:106.6},cut:{minX:226.8,maxX:229.2,minZ:96.4,maxZ:105.4},
 entry:{x:228,z:105.5,y:.13},exit:{x:225,z:106.6,y:-40}});
export const STAIR_PORTAL=Object.freeze({x:225,z:106.8,floor:-40,halfWidth:1.5,opening:1.05,height:4,depth:.5,spring:2.55,radius:1.1});
export const DESCENT_ANNEX=Object.freeze({polygon:Object.freeze([[226.5,104],[226.5,98],[227.2,96.1],[228.8,96.1],[229.5,98],[229.5,104]].map(Object.freeze)),bottom:-.4,eave:3.5,apex:4.55,centre:[228,100.3]});
export function annexContains(x,z,padding=.28){const p=DESCENT_ANNEX.polygon;return p.every((a,i)=>{const b=p[(i+1)%p.length],dx=b[0]-a[0],dz=b[1]-a[1];return dx*(z-a[1])-dz*(x-a[0])>=-padding*Math.hypot(dx,dz);});}
export const flightY=i=>DESCENT.top+(DESCENT.bottom-DESCENT.top)*i/DESCENT.flights;
export function descentParts(){const out=[];for(let i=0;i<8;i++){
 const north=i%2===0,x=DESCENT.lanes[i%2],start=north?104:92,end=north?92:104;
 out.push({id:'flight-'+i,kind:'flight',i,x,start,end,top:flightY(i),bottom:flightY(i+1)});
 if(i<7)out.push({id:'landing-'+i,kind:'landing',minX:224.1,maxX:228.9,minZ:north?90.6:104,maxZ:north?92:105.4,y:flightY(i+1)});
 }out.push({id:'entry',kind:'landing',minX:227.1,maxX:228.9,minZ:104,maxZ:106,y:.13},{id:'exit',kind:'landing',minX:224.1,maxX:225.9,minZ:104,maxZ:107,y:-40});return out;}
export const DESCENT_PARTS=descentParts();
export function descentSurface(x,z,fromY,tolerance=.32){const matches=[];for(const p of DESCENT_PARTS){let y;
 if(p.kind==='landing'){if(x<p.minX+.20||x>p.maxX-.20||z<(p.minZ===90.6?p.minZ+.3:p.minZ-.02)||z>p.maxZ+.02)continue;y=p.y;}
 else{if(Math.abs(x-p.x)>.60||z<92-.02||z>104+.02)continue;const t=Math.max(0,Math.min(1,(z-p.start)/(p.end-p.start)));y=p.top+(p.bottom-p.top)*Math.ceil(t*40-1e-8)/40;}
 if(Math.abs(y-fromY)<=tolerance)matches.push({...p,y});
 }return matches.sort((a,b)=>Math.abs(a.y-fromY)-Math.abs(b.y-fromY))[0]||null;}
export function walkDescent(player,dx,dz,eye=1.8){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));for(let i=0;i<n;i++){
 let p=descentSurface(player.x+dx/n,player.z,player.y-eye);if(p){player.x+=dx/n;player.y=p.y+eye;}
 p=descentSurface(player.x,player.z+dz/n,player.y-eye);if(p){player.z+=dz/n;player.y=p.y+eye;}
 }return player;}
export function outsideRectangle(r,h){const a=Math.max(r.minX,h.minX),b=Math.min(r.maxX,h.maxX),c=Math.max(r.minZ,h.minZ),d=Math.min(r.maxZ,h.maxZ);if(a>=b||c>=d)return[r];return[
 {minX:r.minX,maxX:a,minZ:r.minZ,maxZ:r.maxZ},{minX:b,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ},{minX:a,maxX:b,minZ:r.minZ,maxZ:c},{minX:a,maxX:b,minZ:d,maxZ:r.maxZ}
 ].filter(p=>p.maxX-p.minX>1e-6&&p.maxZ-p.minZ>1e-6);}
// Attribute-preserving cut in a world-XZ surface; unlike a hidden overlay this
// removes the actual triangles above the first flight.
export function cutDescentGround(T,g,h=DESCENT.cut){const attrs=Object.keys(g.attributes).filter(k=>k!=='normal'),out=Object.fromEntries(attrs.map(k=>[k,[]])),idx=g.index?.array||Array.from({length:g.attributes.position.count},(_,i)=>i),vertex=i=>Object.fromEntries(attrs.map(k=>[k,Array.from({length:g.attributes[k].itemSize},(_,j)=>g.attributes[k].array[i*g.attributes[k].itemSize+j])]));
 const groups=[];let materialIndex=0,emitted=0;
 const clip=(poly,axis,bound,less)=>{const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=p=>less?p.position[axis]<=bound:p.position[axis]>=bound,ai=inside(a),bi=inside(b);if(ai)result.push(a);if(ai!==bi){const t=(bound-a.position[axis])/(b.position[axis]-a.position[axis]);result.push(Object.fromEntries(attrs.map(k=>[k,a[k].map((v,j)=>v+(b[k][j]-v)*t)])));}}return result;},emit=poly=>{const count=Math.max(0,poly.length-2)*3;if(count){const last=groups.at(-1);if(last?.materialIndex===materialIndex)last.count+=count;else groups.push({start:emitted,count,materialIndex});emitted+=count;}for(let i=1;i<poly.length-1;i++)for(const p of[poly[0],poly[i],poly[i+1]])for(const k of attrs)out[k].push(...p[k]);};
 for(let i=0;i<idx.length;i+=3){materialIndex=g.groups.find(q=>i>=q.start&&i<q.start+q.count)?.materialIndex??0;let p=Array.from(idx.slice(i,i+3),vertex);const xs=p.map(v=>v.position[0]),zs=p.map(v=>v.position[2]);if(Math.max(...xs)<h.minX||Math.min(...xs)>h.maxX||Math.max(...zs)<h.minZ||Math.min(...zs)>h.maxZ){emit(p);continue;}for(const [axis,bound,less]of[[0,h.minX,true],[0,h.maxX,false],[2,h.minZ,true],[2,h.maxZ,false]]){emit(clip(p,axis,bound,less));p=clip(p,axis,bound,!less);if(!p.length)break;}}
 const result=new T.BufferGeometry();for(const k of attrs)result.setAttribute(k,new T.Float32BufferAttribute(out[k],g.attributes[k].itemSize));if(g.groups.length)for(const q of groups)result.addGroup(q.start,q.count,q.materialIndex);result.computeVertexNormals();return result;
}
