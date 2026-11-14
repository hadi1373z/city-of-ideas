import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{buildGalleryLiftAuditFixture}from'./gallery-lift-landings.mjs';
export function measureGalleryLiftFrameContacts(T,root){
 const check=(v,m)=>{if(!v)throw Error(m);},near=(a,b,e=2e-6)=>Math.abs(a-b)<e,box=o=>new T.Box3().setFromObject(o);
 root.updateWorldMatrix(true,true);const posts=[],panes=[],landings=[],floors=[];
 for(const o of root.children){if(!o.isMesh)continue;const p=o.geometry.parameters;if(o.geometry.type==='BoxGeometry'){if(p.width===.1&&p.height===32.1&&p.depth===.1)posts.push(o);if(p.height===32&&(p.width===4.4&&p.depth===.035||p.width===.035&&p.depth===3.8))panes.push(o);if(p.width===4.3&&p.height===.18&&p.depth===6.2&&near(box(o).getCenter(new T.Vector3()).z,12))landings.push(o);}if(o.geometry.type==='ExtrudeGeometry'&&o.userData.cityDestination==='gallery')floors.push(o);}
 check(posts.length===4&&panes.length===3&&landings.length===4&&floors.length===10,'Exact original structural owners required');
 const triangles=o=>{const a=o.geometry.attributes.position,ix=o.geometry.index,out=[];for(let i=0;i<(ix?.count||a.count);i+=3)out.push([0,1,2].map(j=>new T.Vector3().fromBufferAttribute(a,ix?ix.getX(i+j):i+j).applyMatrix4(o.matrixWorld)));return out;},
 planes=o=>{const ts=triangles(o),centre=box(o).getCenter(new T.Vector3());return ts.map(t=>{const p=new T.Plane().setFromCoplanarPoints(...t);if(p.distanceToPoint(centre)>0)p.negate();return p;});},
 inside=(ps,p)=>ps.every(a=>a.distanceToPoint(p)<1e-7),
 coreVertices=p=>[-.001,.001].flatMap(x=>[-.001,.001].flatMap(y=>[-.001,.001].map(z=>p.clone().add(new T.Vector3(x,y,z))))),
 meshInside=(ts,p)=>{const ray=new T.Ray(p,new T.Vector3(1,.273,.119).normalize()),hits=ts.map(t=>ray.intersectTriangle(...t,false,new T.Vector3())).filter(h=>h&&h.distanceTo(p)>1e-8).map(h=>h.distanceTo(p)).sort((a,b)=>a-b),unique=hits.filter((d,i)=>!i||d-hits[i-1]>1e-7);return unique.length%2===1;};
 const glassJoints=[],sideContacts=[],outerClearances=[],glassClearances=[],floorCores=[];let capCorners=0,glassCoreVertices=0,floorCoreVertices=0;
 for(const pane of panes){
  const b=box(pane),size=b.getSize(new T.Vector3()),axis=size.x>size.z?'x':'z',other=axis==='x'?'z':'x',pp=planes(pane);
  for(const end of['min','max']){
   const corners=[b.min.y,b.max.y].flatMap(y=>[b.min[other],b.max[other]].map(v=>{const p=b.getCenter(new T.Vector3());p[axis]=b[end][axis];p[other]=v;p.y=y;return p;})),post=posts.find(o=>{const ps=planes(o);return corners.every(p=>inside(ps,p));});check(post,'Whole original glass edge cap must remain within an upright');const ps=planes(post);corners.forEach(p=>{check(inside(ps,p),'Glass edge corner');capCorners++;});
   const p=b.getCenter(new T.Vector3());p[axis]=b[end][axis]+(end==='min'?.01:-.01);for(const v of coreVertices(p)){check(inside(pp,v)&&inside(ps,v),'Positive .002 m glass/upright core');glassCoreVertices++;}
   glassJoints.push({axis,end,post:box(post).getCenter(new T.Vector3()).toArray(),glassBottom:b.min.y,glassTop:b.max.y,postBottom:box(post).min.y,postTop:box(post).max.y});
  }
 }
 for(const landing of landings){
  const b=box(landing),floor=Math.round((b.getCenter(new T.Vector3()).y-.37)/8),base=floor*8,lp=planes(landing);
  for(const post of posts){const p=box(post),z=p.getCenter(new T.Vector3()).z<12?b.min.z-p.max.z:p.min.z-b.max.z,xOverlap=Math.min(b.max.x,p.max.x)-Math.max(b.min.x,p.min.x),yOverlap=Math.min(b.max.y,p.max.y)-Math.max(b.min.y,p.min.y);
   if(xOverlap>0&&yOverlap>0&&Math.abs(z)<2e-6){const centre=new T.Vector3((Math.max(b.min.x,p.min.x)+Math.min(b.max.x,p.max.x))/2,(Math.max(b.min.y,p.min.y)+Math.min(b.max.y,p.max.y))/2,p.getCenter(new T.Vector3()).z<12?(b.min.z+p.max.z)/2:(b.max.z+p.min.z)/2),positive=coreVertices(centre).every(v=>inside(lp,v)&&inside(planes(post),v));check(!positive,'Side-touch is not a positive-volume bearing seat');sideContacts.push({floor,post:p.getCenter(new T.Vector3()).toArray(),signedSeparation:z,area:xOverlap*yOverlap,positiveTwoMillimetreCore:false});}
   else{const gap=p.min.x-b.max.x;check(gap>.74999&&gap<.75001,'Retained outer-post clearance');outerClearances.push({floor,post:p.getCenter(new T.Vector3()).toArray(),gap});}
  }
  for(const pane of panes){const p=box(pane),s=p.getSize(new T.Vector3()),gap=s.x>s.z?(p.getCenter(new T.Vector3()).z<12?b.min.z-p.max.z:p.min.z-b.max.z):p.min.x-b.max.x;check(near(gap,s.x>s.z?.0325:.7825),'Actual glass/landing gap');glassClearances.push({floor,side:s.x>s.z?'side':'back',gap});}
  for(const [kind,y,top]of[['body',base+.315,base+.35],['cap',base+.3825,base+.395]]){const owner=floors.find(o=>near(box(o).max.y,top));check(owner,'Original matching annular solid');const ts=triangles(owner);for(const z of[10,12,14]){const p=new T.Vector3(55.6,y,z);for(const v of coreVertices(p)){check(inside(lp,v)&&meshInside(ts,v),'Positive .002 m core in original floor and landing');floorCoreVertices++;}floorCores.push({floor,kind,centre:p.toArray()});}}
 }
 check(glassJoints.length===6&&sideContacts.length===8&&outerClearances.length===8&&glassClearances.length===12&&floorCores.length===24,'Complete retained contact counts');
 return{owners:{posts:posts.length,panes:panes.length,landings:landings.length,scopeMeshes:11},glassJoints,glassCapCorners:capCorners,glassPositiveCores:glassJoints.length,glassCoreVertices,sideContacts,outerClearances,glassClearances,floorCores,floorCoreVertices,postBottom:box(posts[0]).min.y,postTop:box(posts[0]).max.y,glassBottom:box(panes[0]).min.y,glassTop:box(panes[0]).max.y,fullUndersideBearingOrCapacityClaim:false,physicalUpperDoorClaim:false,newProductionGeometryOrState:0};
}

export async function auditGalleryLiftFrame(T){
 const f=await buildGalleryLiftAuditFixture(T),saved=['document','localStorage','sessionStorage','fetch'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]);let result;
 try{for(const[k]of saved)Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Private/render access '+k);}});result=measureGalleryLiftFrameContacts(T,f.scene);}finally{for(const[k,d]of saved)if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k];}
 const scope=f.scene.children.filter(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&(o.geometry.parameters.height>=32||o.geometry.parameters.width===4.3&&o.geometry.parameters.height===.18&&Math.abs(new T.Box3().setFromObject(o).getCenter(new T.Vector3()).z-12)<1e-5));
 assert.equal(scope.length,11);const rows=scope.map(o=>({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),index:Array.from(o.geometry.index.array),attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))}));
 const hash=createHash('sha256').update(JSON.stringify(rows)).digest('hex');assert.equal(hash,'f1401ad0cf6b1ec59d2f20767f3aa85d865855f28e91254daa2cc8c7f2c14f05','All eleven original shaft/landing mesh profiles and matrices stay exact');const gs=new Set(),ms=new Set();f.scene.traverse(o=>{if(o.isMesh){gs.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>ms.add(m));}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());return{...result,staticElevenMeshHash:hash,privateAndDOMDenied:true};
}
