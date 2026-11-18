import {DESCENT} from './escher-descent-model.js?v=escher-metal-20261118';
import {SIXFOLD_HOUSES,houseToWorld} from './sixfold-house-network-model.js?v=makers-passages-20261118';
import {sixfoldPassagePlan} from './sixfold-house-passages-scene.js?v=makers-passages-20261118';
import {ESCHER_DEPTH as D} from './escher-depth-model.js?v=escher-metal-20261118';

const EPS=1e-7,STRATA=[[0,-8,0],[-8,-22,1],[-22,-31,2],[-31,-44,0],[-44,-52,1],[-52,-65,2],[-65,-79,0],[-79,-88,1],[-88,-96,2]],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const rectangle=(minX,maxX,minZ,maxZ)=>[[minX,minZ],[maxX,minZ],[maxX,maxZ],[minX,maxZ]];
// Intersect the *actual section diameter* with each bounded convex footprint.
// This is a spatial section of the rooms, rather than their projected silhouettes.
export function sectionFootprintInterval(polygon,angle=0){const direction=[Math.cos(angle),-Math.sin(angle)];let lo=-Infinity,hi=Infinity;for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],edge=[b[0]-a[0],b[1]-a[1]],constant=cross(edge,[-a[0],-a[1]]),slope=cross(edge,direction);if(Math.abs(slope)<EPS){if(constant< -EPS)return null;continue;}const t=-constant/slope;if(slope>0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>=hi-EPS)return null;}return Number.isFinite(lo)&&Number.isFinite(hi)?[lo,hi]:null;}
const prism=(id,polygon,bottom,top)=>({id,polygon,bottom,top});
export function sectionRoomPrisms(){const passages=sixfoldPassagePlan();return[
 ...SIXFOLD_HOUSES.map(h=>prism('house-'+h.id,Array.from({length:6},(_,i)=>{const p=houseToWorld(h,{x:125+23.45*Math.cos(i*Math.PI/3),z:23.45*Math.sin(i*Math.PI/3)});return[p.x,p.z];}),-40.24,.13)),
 ...passages.rectangles.map(p=>prism('passage-'+p.id,p.polygon,-40.24,-34.875)),
 prism('escher-descent',rectangle(DESCENT.shaft.minX,DESCENT.shaft.maxX,DESCENT.shaft.minZ,DESCENT.shaft.maxZ),-40.4,.13),
 ...D.rooms.map(r=>prism('museum-'+r.id,rectangle(r.minX-.24,r.maxX+.24,r.minZ-.24,r.maxZ+.24),r.y-.4,(r.id==='loop'?D.lowerCeiling:D.ceiling)+.45)),
 prism('museum-stairwell',rectangle(D.stair.minX-.24,D.stair.maxX+.24,D.stair.minZ-.24,D.stair.maxZ+.24),D.stair.bottom-.4,D.ceiling+.45)
 ];}
const PRISMS=sectionRoomPrisms();
export function sectionVoidRectangles(angle=0){const out=[];for(const p of PRISMS){const interval=sectionFootprintInterval(p.polygon,angle);if(interval)out.push({id:p.id,minX:interval[0],maxX:interval[1],minY:p.bottom,maxY:p.top});}
 // Only the true closed well basin extends below the lowest annular floor.
 for(const h of SIXFOLD_HOUSES){const along=h.x*Math.cos(angle)-h.z*Math.sin(angle),across=h.x*Math.sin(angle)+h.z*Math.cos(angle),r=10.3;if(Math.abs(across)>=r)continue;const half=Math.sqrt(r*r-across*across);out.push({id:'basin-'+h.id,minX:along-half,maxX:along+half,minY:-40.4,maxY:-40.24});}return out;
}
function subtract(a,b){const x0=Math.max(a.minX,b.minX),x1=Math.min(a.maxX,b.maxX),y0=Math.max(a.minY,b.minY),y1=Math.min(a.maxY,b.maxY);if(x0>=x1-EPS||y0>=y1-EPS)return[a];const out=[],add=(minX,maxX,minY,maxY)=>{if(maxX-minX>EPS&&maxY-minY>EPS)out.push({...a,minX,maxX,minY,maxY});};add(a.minX,x0,a.minY,a.maxY);add(x1,a.maxX,a.minY,a.maxY);add(x0,x1,a.minY,y0);add(x0,x1,y1,a.maxY);return out;}
export function sectionEarthCells(angle=0){const voids=sectionVoidRectangles(angle),cells=[];const carve=cell=>{let pieces=[cell];for(const hole of voids)pieces=pieces.flatMap(p=>subtract(p,hole));cells.push(...pieces);};
 for(const[top,bottom,tone]of STRATA)for(const sign of[-1,1])carve({minX:sign<0?-570:58,maxX:sign<0?-58:570,minY:bottom,maxY:top,tone,depth:.34});
 // Mineral seams are cut by exactly the same void union as the earth panels;
 // a stripe must never bridge a newly revealed room or tunnel.
 for(const y of[-.08,-8,-22,-31,-44,-52,-65,-79,-88,-95.92])for(const sign of[-1,1])carve({minX:sign<0?-570:58,maxX:sign<0?-58:570,minY:y-.045,maxY:y+.045,tone:3,depth:.43});
 for(const x of[-569.92,-58.08,58.08,569.92])carve({minX:x-.08,maxX:x+.08,minY:-96,maxY:0,tone:3,depth:.43});return{angle,voids,cells};
}
export function buildSectionEarth(T){const group=new T.Group();group.name='Section earth · actual house, basement, passage and museum voids';group.userData.sectionOnly=true;group.visible=false;const unit=new T.BoxGeometry(1,1,1),materials=[0xb2a185,0x9c8b73,0xbeaf90,0x766954].map(color=>new T.MeshLambertMaterial({color,side:T.DoubleSide})),stamp=new T.Object3D();let angle=null,disposed=false,plan=null;
 function update(next=0){if(disposed||!Number.isFinite(next)||angle!==null&&Math.abs(next-angle)<1e-6)return false;angle=next;plan=sectionEarthCells(angle);for(const child of[...group.children]){child.dispose?.();group.remove(child);}for(let tone=0;tone<4;tone++){const cells=plan.cells.filter(c=>c.tone===tone);if(!cells.length)continue;const batch=new T.InstancedMesh(unit,materials[tone],cells.length);batch.name=tone===3?'Cut mineral seams around real voids':'Section mineral panels around real voids';cells.forEach((c,i)=>{stamp.position.set((c.minX+c.maxX)/2,(c.minY+c.maxY)/2,0);stamp.scale.set(c.maxX-c.minX,c.maxY-c.minY,c.depth);stamp.updateMatrix();batch.setMatrixAt(i,stamp.matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);}group.rotation.y=angle;return true;}
 update(0);return{group,update,get plan(){return plan;},dispose(){if(disposed)return;disposed=true;for(const child of group.children)child.dispose?.();unit.dispose();for(const m of materials)m.dispose();group.removeFromParent();group.clear();}};
}
