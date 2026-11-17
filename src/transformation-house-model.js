export const HOUSE={x:125,z:0,radius:23,well:10.3,stairInner:6.6,stairOuter:9.8,stairRadius:8.2,steps:448,turns:7,top:16,bottom:-40,doorZ:23*Math.sqrt(3)/2};
export const HOUSE_LEVELS=[
 {y:16,name:'The Night Observatory',hint:'The whole descent hangs below the open well. Look for the tiny lights you passed on the way down.'},
 {y:8,name:'The Study of Symmetry',hint:'An inhabited study: books, a writing table and a ceiling that refuses to fit a repeating grid.'},
 {y:0,name:'The House of Transformations',hint:'The stair turns both ways. Up leads to the observatory; down leads through five underground rooms and toward the other face.'},
 {y:-8,name:'The Shadow Room',hint:'A brass circle on the floor marks one place to look. A convincing alignment breaks when you step sideways.'},
 {y:-16,name:'The Library with a Shallow Shelf',hint:'One bookcase has a brass handle. Perhaps it is concealing something more than books.'},
 {y:-24,name:'The Pendulum Room',hint:'Two hanging lights share a rhythm, then drift apart. Change their ratio and watch them find each other again.'},
 {y:-32,name:'The Hall of Nested Worlds',hint:'Small rooms live inside larger forms. Look upward: the rooms you visited are still part of this house.'},
 {y:-40,name:'The Passage to the Other Face',hint:'The west doorway joins the real underground passage. Turn west toward the central spiral and descend through the middle of the world to Mathematics.'}
];
const TAU=2*Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const stairY=t=>HOUSE.top-Math.floor(clamp(t,0,7*TAU)/(7*TAU)*448+1e-8)*.125;
export const stairPoint=t=>({x:125+8.2*Math.cos(t),z:8.2*Math.sin(t),y:stairY(t),theta:t});
export function inHex(x,z,r=23){return Math.abs(x)<=r&&Math.abs(z)<=r*Math.sqrt(3)/2&&Math.sqrt(3)*Math.abs(x)+Math.abs(z)<=Math.sqrt(3)*r;}
export function houseSurface(x,z,feet,lastTheta=null){const px=x-125,r=Math.hypot(px,z);if(![x,z,feet].every(Number.isFinite))return null;
 if(r>=6.66&&r<=9.74){let a=Math.atan2(z,px);if(a<0)a+=TAU;const candidates=[];for(let i=0;i<=7;i++){const t=a+i*TAU;if(t>7*TAU+1e-8)continue;const y=stairY(t);if(Math.abs(y-feet)<.29&&(!Number.isFinite(lastTheta)||Math.abs(t-lastTheta)<.25))candidates.push({y,theta:t,kind:'stair'});}if(candidates.length){candidates.sort((a,b)=>Math.abs(a.y-feet)-Math.abs(b.y-feet));return candidates[0];}}
 for(const l of HOUSE_LEVELS){if(Math.abs(l.y-feet)>.28)continue;if(inHex(px,z,22.65)&&r>=10.32||px>=9.7&&px<=11.6&&Math.abs(z)<1.45)return{y:l.y,theta:(16-l.y)/8*TAU,kind:'room',level:l};if(l.y===0&&Math.abs(px)<2.45&&z>=19.1&&z<=24)return{y:0,kind:'porch',level:l};if(l.y===-40&&x>=70.75&&x<=104&&Math.abs(z)<1.72)return{y:-40,kind:'passage',level:l};}return null;}
export function houseBlocked(x,z,y,{shelfOpen=false}={}){const px=x-125;for(const l of HOUSE_LEVELS){if(Math.abs(y-l.y)>.3)continue;
 // Furniture is physically present, with a clear circulation band at r11..14.
 if(px>15&&px<19&&z>3&&z<6||px< -15&&px> -19&&z>5&&z<7)return true;
 if(l.y===-8&&px>-19&&px< -13&&z> -5.3&&z<2.3)return true;
 if(l.y===-16){if(Math.abs(px)<4.25&&Math.abs(z-14)<.4&&!(shelfOpen&&Math.abs(px)<1.1))return true;if(Math.abs(Math.abs(px)-4)<.35&&z>14&&z<19.5)return true;}
 }return false;}
export function walkHouse(p,dx,dz,options={}){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.1));for(let i=0;i<n;i++){let s=houseSurface(p.x+dx/n,p.z,p.y-(options.eye??1.8),p.houseTheta);if(s&&!houseBlocked(p.x+dx/n,p.z,s.y,options)){p.x+=dx/n;p.y=s.y+(options.eye??1.8);p.houseTheta=s.theta??null;}s=houseSurface(p.x,p.z+dz/n,p.y-(options.eye??1.8),p.houseTheta);if(s&&!houseBlocked(p.x,p.z+dz/n,s.y,options)){p.z+=dz/n;p.y=s.y+(options.eye??1.8);p.houseTheta=s.theta??null;}}return p;}
// Subtract a convex shaft from triangles, interpolating vertex attributes.
export function cutHouseWell(T,g){const p=g.attributes.position,attrs=Object.keys(g.attributes).filter(k=>k!=='normal'),out=Object.fromEntries(attrs.map(k=>[k,[]])),idx=g.index?.array||Array.from({length:p.count},(_,i)=>i),hole=Array.from({length:48},(_,i)=>[125+10.3*Math.cos(i*TAU/48),10.3*Math.sin(i*TAU/48)]);const vertex=i=>Object.fromEntries(attrs.map(k=>[k,Array.from({length:g.attributes[k].itemSize},(_,j)=>g.attributes[k].array[i*g.attributes[k].itemSize+j])]));
 const clip=(poly,a,b,inside)=>{const side=v=>(b[0]-a[0])*(v.position[2]-a[1])-(b[1]-a[1])*(v.position[0]-a[0]),result=[];for(let i=0;i<poly.length;i++){const u=poly[i],v=poly[(i+1)%poly.length],su=side(u),sv=side(v),iu=inside?su>=0:su<=0,iv=inside?sv>=0:sv<=0;if(iu)result.push(u);if(iu!==iv){const t=su/(su-sv);result.push(Object.fromEntries(attrs.map(k=>[k,u[k].map((n,j)=>n+(v[k][j]-n)*t)])));}}return result;};const emit=poly=>{for(let i=1;i<poly.length-1;i++)for(const v of[poly[0],poly[i],poly[i+1]])for(const k of attrs)out[k].push(...v[k]);};
 for(let i=0;i<idx.length;i+=3){let poly=Array.from(idx.slice(i,i+3),vertex);const xs=poly.map(v=>v.position[0]),zs=poly.map(v=>v.position[2]);if(Math.max(...xs)<114.6||Math.min(...xs)>135.4||Math.max(...zs)<-10.4||Math.min(...zs)>10.4){emit(poly);continue;}for(let j=0;j<48&&poly.length;j++){emit(clip(poly,hole[j],hole[(j+1)%48],false));poly=clip(poly,hole[j],hole[(j+1)%48],true);}}
 const result=new T.BufferGeometry();for(const k of attrs)result.setAttribute(k,new T.Float32BufferAttribute(out[k],g.attributes[k].itemSize));result.computeVertexNormals();return result;}
