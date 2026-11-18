export const HOUSE={x:125,z:0,radius:23,well:10.3,stairInner:6.6,stairOuter:9.8,stairRadius:8.2,steps:448,turns:7,top:16,bottom:-40,doorZ:23*Math.sqrt(3)/2,stepAngle:Math.PI/32,landingHalfAngle:Math.PI/16,landingHalfWidth:1.75,landingRailZ:1.60,landingWalkHalfWidth:1.28,bridgeInner:9.76};
export const HOUSE_LEVELS=[
 {y:16,name:'The Light-Well Observatory',hint:'The tiled crown gathers the patterns of the house above one open well. Follow the flat landing to look down through the rooms you passed.'},
 {y:8,name:'The Study of Symmetry',hint:'An inhabited study: books, a writing table and a ceiling that refuses to fit a repeating grid.'},
 {y:0,name:'The House of Transformations',hint:'The stair turns both ways. Up leads to the observatory; down leads through five underground rooms and toward the other face.'},
 {y:-8,name:'The Shadow Room',hint:'A brass circle on the floor marks one place to look. A convincing alignment breaks when you step sideways.'},
 {y:-16,name:'The Library with a Shallow Shelf',hint:'One bookcase has a brass handle. Perhaps it is concealing something more than books.'},
 {y:-24,name:'The Pendulum Room',hint:'Two hanging lights share a rhythm, then drift apart. Change their ratio and watch them find each other again.'},
 {y:-32,name:'The Hall of Nested Worlds',hint:'Small rooms live inside larger forms. Look upward: the rooms you visited are still part of this house.'},
 {y:-40,name:'The Passage to the Other Face',hint:'The west doorway joins the real underground passage. Turn west toward the central spiral and descend through the middle of the world to Mathematics.'}
];
const TAU=2*Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Four cap sectors around each east landing are level. The remaining descent
// uses equal 8/61m risers, preserving all448 caps, seven turns and floor heights.
export const stairY=t=>{const i=Math.floor(clamp(t,0,7*TAU)/HOUSE.stepAngle+1e-8),turn=Math.floor(i/64),j=i%64;return HOUSE.top-8*turn-(j<=1?0:j>=62?8:(j-1)*8/61);};
// Handrail profile remains level through the complete flat landing before
// following the flight. It never slopes away from a room's horizontal guard.
export const stairContinuousY=t=>{const q=clamp(t,0,7*TAU)/HOUSE.stepAngle,turn=Math.floor(q/64),j=q-turn*64;return HOUSE.top-8*turn-(j<=2?0:j>=62?8:(j-2)*8/60);};
export const houseLandingLevel=t=>{const k=Math.round(t/TAU);return k>=0&&k<=7&&Math.abs(t-k*TAU)<=HOUSE.landingHalfAngle+1e-8?HOUSE.top-8*k:null;};
export const stairPoint=t=>({x:125+8.2*Math.cos(t),z:8.2*Math.sin(t),y:stairY(t),theta:t});
export function inHex(x,z,r=23){return Math.abs(x)<=r&&Math.abs(z)<=r*Math.sqrt(3)/2&&Math.sqrt(3)*Math.abs(x)+Math.abs(z)<=Math.sqrt(3)*r;}
export function houseSurface(x,z,feet,lastTheta=null){const px=x-125,r=Math.hypot(px,z);if(![x,z,feet].every(Number.isFinite))return null;
 if(r>=6.66&&r<=9.800001){let a=Math.atan2(z,px);if(a<0)a+=TAU;const candidates=[];for(let i=-1;i<=7;i++){const t=a+i*TAU;if(t< -HOUSE.landingHalfAngle-1e-8||t>7*TAU+HOUSE.landingHalfAngle+1e-8||r>9.74&&(houseLandingLevel(t)===null||Math.abs(z)>HOUSE.landingWalkHalfWidth))continue;const y=stairY(t);if(Math.abs(y-feet)<.29&&(!Number.isFinite(lastTheta)||Math.abs(t-lastTheta)<.25))candidates.push({y,theta:t,kind:'stair'});}if(candidates.length){candidates.sort((a,b)=>Math.abs(a.y-feet)-Math.abs(b.y-feet));return candidates[0];}}
 for(const l of HOUSE_LEVELS){if(Math.abs(l.y-feet)>.28)continue;if(inHex(px,z,22.65)&&r>=10.32||px>0&&r>=9.74&&px<=11.6&&Math.abs(z)<HOUSE.landingWalkHalfWidth)return{y:l.y,theta:(16-l.y)/8*TAU,kind:'room',level:l};if(l.y===0&&Math.abs(px)<2.45&&z>=19.1&&z<=24)return{y:0,kind:'porch',level:l};if(l.y===-40&&x>=70.75&&x<=104&&Math.abs(z)<1.72)return{y:-40,kind:'passage',level:l};}return null;}
// A stair passing a room's height is not that room. Only the broad floor or its
// shared radial landing enables room interactions and room-specific guidance.
export function houseRoomAt(x,z,feet,lastTheta=null){const s=houseSurface(x,z,feet,lastTheta);if(!s)return null;if(s.level)return s.level;const px=x-HOUSE.x;if(px>=9.7&&px<=11.6&&Math.abs(z)<HOUSE.landingWalkHalfWidth)return HOUSE_LEVELS.find(l=>Math.abs(l.y-feet)<.14)??null;return null;}

/** Connected, round rail paths. Every free path endpoint meets another path;
 * the bridge sides are filleted into both circular guards at the same height. */
export function houseRailLayout(){const paths=[],posts=[],h=HOUSE.landingRailZ,delta=.012,bS=Math.asin(h/9.8)+delta,bA=Math.asin(h/10.4)+delta,half=HOUSE.landingHalfAngle,end=7*TAU;
 const radial=(r,t,y)=>[r*Math.cos(t),y,r*Math.sin(t)],sample=(a,b,fn,spacing=HOUSE.stepAngle/2)=>{const n=Math.max(1,Math.ceil(Math.abs(b-a)/spacing));return Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));},add=(kind,points)=>paths.push({kind,points,radius:.035});
 add('inner helical guard',sample(-half,end+half,t=>radial(6.6,t,stairContinuousY(t)+1.1)));
 for(let k=0;k<7;k++)add('outer helical guard',sample(k*TAU+bS,(k+1)*TAU-bS,t=>radial(9.8,t,stairContinuousY(t)+1.1)));
 add('upper end guard arc',sample(-half,-bS,t=>radial(9.8,t,17.1)));add('lower end guard arc',sample(end+bS,end+half,t=>radial(9.8,t,-38.9)));
 for(const t of[-half,end+half]){const y=stairY(t);add('closed end return',[radial(6.6,t,y+1.1),radial(9.8,t,y+1.1)]);posts.push({a:radial(8.2,t,y),b:radial(8.2,t,y+1.1)});}
 const quad=(a,b,c,t)=>a.map((v,i)=>(1-t)**2*v+2*(1-t)*t*b[i]+t*t*c[i]);
 for(const l of HOUSE_LEVELS){const y=l.y+1.1;add('annular room guard',sample(bA,TAU-bA,t=>radial(10.4,t,y),Math.PI/64));for(const sign of[-1,1]){const pS=radial(9.8,sign*bS,y),pA=radial(10.4,sign*bA,y),qS=[pS[0]+.15,y,sign*h],qA=[pA[0]-.15,y,sign*h],cS=[pS[0]+.02,y,sign*h],cA=[pA[0]+.02,y,sign*h];const points=[...sample(0,1,t=>quad(pS,cS,qS,t),.125),qA,...sample(.125,1,t=>quad(qA,cA,pA,t),.125)];add('rounded landing return',points);for(const p of[pS,pA,[(qS[0]+qA[0])/2,y,sign*h]])posts.push({a:[p[0],l.y,p[2]],b:p});}for(let i=0;i<96;i+=4){const t=i*TAU/96;if(t<bA||t>TAU-bA)continue;posts.push({a:radial(10.4,t,l.y),b:radial(10.4,t,y)});}}
 for(let i=0;i<=448;i+=4){const t=i*HOUSE.stepAngle,y=stairY(t),signed=Math.atan2(Math.sin(t),Math.cos(t));for(const r of[6.6,9.8]){if(r>8&&Math.abs(signed)<bS)continue;posts.push({a:radial(r,t,y),b:radial(r,t,y+1.1)});}}
 return{paths,posts};}
export function houseInteractionAt(x,z,feet,{shelfOpen=false,lastTheta=null}={}){const l=houseRoomAt(x,z,feet,lastTheta);if(l?.y===-16&&Math.hypot(x-(HOUSE.x+.9+(shelfOpen?3:0)),z-14.5)<=2.4)return'shelf';if(l?.y===-24&&Math.hypot(x-(HOUSE.x-16.5),z+3)<=3.2)return'pendulums';return null;}
export function houseBlocked(x,z,y,{shelfOpen=false}={}){const px=x-125;for(const l of HOUSE_LEVELS){if(Math.abs(y-l.y)>.3)continue;
 // Furniture is physically present, with a clear circulation band at r11..14.
 if(px>15&&px<19&&z>3&&z<6||px< -15&&px> -19&&z>5&&z<7)return true;
 if(px>=-17.5&&px<=-12.5&&z>=-10.5&&z<=-9.5)return true;
 if(l.y===-8&&px>-19&&px< -13&&z> -5.3&&z<2.3)return true;
 if(l.y===-16){if(Math.abs(px)<4.25&&Math.abs(z-14)<.4&&!(shelfOpen&&Math.abs(px)<1.1))return true;if(Math.abs(Math.abs(px)-4)<.35&&z>14&&z<19.5)return true;}
 }return false;}
export function walkHouse(p,dx,dz,options={}){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.1));for(let i=0;i<n;i++){let s=houseSurface(p.x+dx/n,p.z,p.y-(options.eye??1.8),p.houseTheta);if(s&&!houseBlocked(p.x+dx/n,p.z,s.y,options)){p.x+=dx/n;p.y=s.y+(options.eye??1.8);p.houseTheta=s.theta??null;}s=houseSurface(p.x,p.z+dz/n,p.y-(options.eye??1.8),p.houseTheta);if(s&&!houseBlocked(p.x,p.z+dz/n,s.y,options)){p.z+=dz/n;p.y=s.y+(options.eye??1.8);p.houseTheta=s.theta??null;}}return p;}
// Configured live shafts are separate from the retained125m source prototype.
export function configuredHouseWells(config){const list=Array.isArray(config?.houseWells)?config.houseWells:config?.houseWell?[config.houseWell]:[];if(list.length>64||list.some(h=>![h.x,h.z,h.radius].every(Number.isFinite)||h.radius<=0))throw Error('House wells need bounded finite positive circles.');return list;}
// Subtract all convex shafts from actual triangles, interpolating every vertex
// attribute. No intermediate geometry is retained or disposed by this helper.
export function cutHouseWell(T,g,wells=[{x:HOUSE.x,z:HOUSE.z,radius:HOUSE.well}]){wells=Array.isArray(wells)?wells:[wells];configuredHouseWells({houseWells:wells});if(!wells.length)return g.clone();const p=g.attributes.position,attrs=Object.keys(g.attributes).filter(k=>k!=='normal'),out=Object.fromEntries(attrs.map(k=>[k,[]])),idx=g.index?.array||Array.from({length:p.count},(_,i)=>i),holes=wells.map(h=>({...h,points:Array.from({length:48},(_,i)=>[h.x+h.radius*Math.cos(i*TAU/48),h.z+h.radius*Math.sin(i*TAU/48)])}));const vertex=i=>Object.fromEntries(attrs.map(k=>[k,Array.from({length:g.attributes[k].itemSize},(_,j)=>g.attributes[k].array[i*g.attributes[k].itemSize+j])]));
 const clip=(poly,a,b,inside)=>{const side=v=>(b[0]-a[0])*(v.position[2]-a[1])-(b[1]-a[1])*(v.position[0]-a[0]),result=[];for(let i=0;i<poly.length;i++){const u=poly[i],v=poly[(i+1)%poly.length],su=side(u),sv=side(v),iu=inside?su>=0:su<=0,iv=inside?sv>=0:sv<=0;if(iu)result.push(u);if(iu!==iv){const t=su/(su-sv);result.push(Object.fromEntries(attrs.map(k=>[k,u[k].map((n,j)=>n+(v[k][j]-n)*t)])));}}return result;},emit=poly=>{for(let i=1;i<poly.length-1;i++)for(const v of[poly[0],poly[i],poly[i+1]])for(const k of attrs)out[k].push(...v[k]);},outside=(poly,h)=>{const xs=poly.map(v=>v.position[0]),zs=poly.map(v=>v.position[2]);return Math.max(...xs)<h.x-h.radius-.01||Math.min(...xs)>h.x+h.radius+.01||Math.max(...zs)<h.z-h.radius-.01||Math.min(...zs)>h.z+h.radius+.01;};
 for(let i=0;i<idx.length;i+=3){let pieces=[Array.from(idx.slice(i,i+3),vertex)];for(const h of holes){const next=[];for(let poly of pieces){if(outside(poly,h)){next.push(poly);continue;}for(let j=0;j<48&&poly.length;j++){const part=clip(poly,h.points[j],h.points[(j+1)%48],false);if(part.length>=3)next.push(part);poly=clip(poly,h.points[j],h.points[(j+1)%48],true);}}pieces=next;}for(const poly of pieces)emit(poly);}
 const result=new T.BufferGeometry();for(const k of attrs)result.setAttribute(k,new T.Float32BufferAttribute(out[k],g.attributes[k].itemSize));result.computeVertexNormals();return result;}
