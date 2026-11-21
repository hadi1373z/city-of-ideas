// Original low, open coastal terraces. Local v points out to sea; u runs
// tangentially along the shore. The original Listening Court stays behind us.
const frozen=p=>Object.freeze(p.map(Object.freeze));
export const SEA_TERRACES=Object.freeze({id:'sea-terraces',name:'Sea Terraces',x:239.023011444505,z:-414,floor:.13,cell:Object.freeze({q:3,r:-3}),out:Object.freeze([.5,-Math.sqrt(3)/2]),along:Object.freeze([Math.sqrt(3)/2,.5]),bounds:Object.freeze({minU:-34,maxU:34,minV:22,maxV:47}),levels:Object.freeze([.13,.37,.61]),rampWidth:6,rampRun:6});
const S=SEA_TERRACES;
export function seaTerraceWorld(u,v,y){const p={x:S.x+S.along[0]*u+S.out[0]*v,z:S.z+S.along[1]*u+S.out[1]*v};if(y!==undefined)p.y=y;return p;}
export function seaTerraceLocal(x,z){return{u:(x-S.x)*S.along[0]+(z-S.z)*S.along[1],v:(x-S.x)*S.out[0]+(z-S.z)*S.out[1]};}
const rectangle=(u0,u1,v0,v1)=>frozen([[u0,v0],[u1,v0],[u1,v1],[u0,v1]]);
const worldPolygon=p=>frozen(p.map(([u,v])=>{const w=seaTerraceWorld(u,v);return[w.x,w.z];}));
export const SEA_TERRACE_FOOTPRINT=Object.freeze({id:S.id,points:worldPolygon(rectangle(-34,34,22,47)),polygon:worldPolygon(rectangle(-34,34,22,47)),kind:'open-court'});
export const SEA_TERRACE_PERGOLAS=Object.freeze([-1,1].map(sign=>Object.freeze({id:'pergola-'+(sign<0?'west':'east'),u:24*sign,v:35,width:11,depth:7.4,eave:3.55,top:3.82})));
export const SEA_TERRACE_VIEW_FRAMES=Object.freeze([-16,0,16].map((u,i)=>Object.freeze({id:'sea-frame-'+i,u,v:43,width:6,height:3.65,depth:.64})));
export const SEA_TERRACE_BENCHES=Object.freeze([24.5,30.5,40].flatMap((v,j)=>[-1,1].map(sign=>Object.freeze({id:'bench-'+j+'-'+sign,u:sign*13,v,width:3.8,depth:.86}))));
export const SEA_TERRACE_PLANTERS=Object.freeze([26,35,41.3].flatMap((v,j)=>[-1,1].map(sign=>Object.freeze({id:'sea-planter-'+j+'-'+sign,u:sign*8,v,width:1.2,depth:3.6,height:.36}))));
export const SEA_TERRACE_FOOTPRINTS=Object.freeze([
 SEA_TERRACE_FOOTPRINT,
 ...SEA_TERRACE_PERGOLAS.map(p=>Object.freeze({id:p.id,points:worldPolygon(rectangle(p.u-p.width/2,p.u+p.width/2,p.v-p.depth/2,p.v+p.depth/2)),kind:'roof'}))
]);
const path=(id,points,width=3.2)=>Object.freeze({id,kind:'civic-spur',width,points:worldPolygon(points)});
// Root owns the longer unchanged-street and shore-promenade connections.
export const SEA_TERRACE_PATHS=Object.freeze([
 path('sea-terrace-central-ramp',[[0,22],[0,44.5]],6),
 ...[-1,1].map(sign=>path('sea-terrace-level-return-'+sign,[[sign*34,22.5],[sign*31.5,24],[sign*31.5,44.5],[sign*24,44.5],[0,44.5]],1.8)),
 path('sea-terrace-inner-aisle',[[-33,22.7],[33,22.7]],1.4)
]);
export const SEA_TERRACE_ENTRY=Object.freeze({...seaTerraceWorld(0,22,.13),yaw:-Math.PI/6,pitch:.02});

const rampV=[22,23,29,32,38,47],rampH=[.13,.13,.37,.37,.61,.61];
const split=(a,b,step=1.7)=>{const n=Math.ceil((b-a)/step);return Array.from({length:n+1},(_,i)=>a+(b-a)*i/n);};
const patches=[];
function addBand(u0,u1,v0,v1,height,kind){const us=split(u0,u1),vs=split(v0,v1);for(let i=1;i<us.length;i++)for(let j=1;j<vs.length;j++){const a=us[i-1],b=us[i],c=vs[j-1],d=vs[j];patches.push(Object.freeze({minU:a,maxU:b,minV:c,maxV:d,kind,points:frozen([[a,height(a,c),c],[b,height(b,c),c],[b,height(b,d),d],[a,height(a,d),d]])}));}}
for(let k=1;k<rampV.length;k++){
 const v0=rampV[k-1],v1=rampV[k],h0=rampH[k-1],h1=rampH[k],h=v=>h0+(h1-h0)*(v-v0)/(v1-v0);
 addBand(-3,3,v0,v1,(_,v)=>h(v),h0===h1?'level':'central-ramp');
 for(const sign of[-1,1])addBand(sign<0?-34:24,sign<0?-24:34,v0,v1,(u,v)=>.13+(h(v)-.13)*(34-Math.abs(u))/10,'side-return-ramp');
}
for(const[v0,v1,y]of[[22,29,.13],[29,38,.37],[38,47,.61]])for(const[u0,u1]of[[-24,-3],[3,24]])addBand(u0,u1,v0,v1,()=>y,'level');
export const SEA_TERRACE_SURFACES=Object.freeze(patches);
function localPatchHeight(p,u,v){const tx=(u-p.minU)/(p.maxU-p.minU),tz=(v-p.minV)/(p.maxV-p.minV),[a,b,c,d]=p.points;return tx+tz<=1?a[1]+(b[1]-a[1])*tx+(d[1]-a[1])*tz:c[1]+(d[1]-c[1])*(1-tx)+(b[1]-c[1])*(1-tz);}
export function seaTerraceFloorAt(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;const{u,v}=seaTerraceLocal(x,z);if(u< -34-1e-7||u>34+1e-7||v<22-1e-7||v>47+1e-7)return null;
 // Shared boundaries choose the higher top; no new floor is invented outside.
 let y=null;for(const p of patches)if(u>=p.minU-1e-7&&u<=p.maxU+1e-7&&v>=p.minV-1e-7&&v<=p.maxV+1e-7){const h=localPatchHeight(p,u,v);if(y===null||h>y)y=h;}return y;
}
const obstacles=[];
function obstacle(id,u,v,width,depth,base,height){obstacles.push(Object.freeze({id,u,v,width,depth,minY:base,maxY:base+height,points:worldPolygon(rectangle(u-width/2,u+width/2,v-depth/2,v+depth/2))}));}
for(const p of SEA_TERRACE_PERGOLAS)for(const du of[-4.7,4.7])for(const dv of[-2.9,2.9]){const w=seaTerraceWorld(p.u+du,p.v+dv);obstacle(p.id+'-post-'+du+'-'+dv,p.u+du,p.v+dv,.62,.62,seaTerraceFloorAt(w.x,w.z),3.55);}
for(const b of SEA_TERRACE_BENCHES){const w=seaTerraceWorld(b.u,b.v);obstacle(b.id,b.u,b.v,b.width+.16,b.depth+.14,seaTerraceFloorAt(w.x,w.z),.96);}
for(const b of SEA_TERRACE_PLANTERS){const w=seaTerraceWorld(b.u,b.v);obstacle(b.id,b.u,b.v,b.width,b.depth,seaTerraceFloorAt(w.x,w.z),b.height+.38);}
for(const f of SEA_TERRACE_VIEW_FRAMES)for(const sign of[-1,1])obstacle(f.id+'-pier-'+sign,f.u+sign*(f.width/2-.26),f.v,.64,.84,.61,3.85);
// A local guard protects the raised front lip only; both end ramps stay open.
obstacle('sea-terrace-front-guard',0,46.6,48,.12,.61,1.05);
export const SEA_TERRACE_OBSTACLES=Object.freeze(obstacles);
export function seaTerraceCanStand(x,z,feet=.13,{radius=.26,maxStep=.10}={}){
 if(![x,z,feet,radius,maxStep].every(Number.isFinite)||radius<0||maxStep<0)return false;
 const floor=seaTerraceFloorAt(x,z);if(floor===null)return true;if(Math.abs(floor-feet)>maxStep+1e-6)return false;
 const{u,v}=seaTerraceLocal(x,z);return !obstacles.some(o=>feet<o.maxY+.02&&feet+1.8>o.minY&&Math.abs(u-o.u)<o.width/2+radius&&Math.abs(v-o.v)<o.depth/2+radius);
}
export const SEA_TERRACE_WORLD_PLAN=Object.freeze({site:S,footprint:SEA_TERRACE_FOOTPRINT,footprints:SEA_TERRACE_FOOTPRINTS,entry:SEA_TERRACE_ENTRY,paths:SEA_TERRACE_PATHS,obstacles:SEA_TERRACE_OBSTACLES});
