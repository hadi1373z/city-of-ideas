import {cutDescentGround} from './escher-descent-model.js?v=wall-rails-20261121';
import {createParkGrassMaterial,COURT_GRASS_HEX,isCoastalLawnCell,courtGrassIndex} from './city-lawn-palette.js?v=makers-passages-20261118';
import {URBAN_COURTS,HONEYCOMB_CITY,urbanPlanting,urbanRoutes,segmentDistance,urbanLawnCells} from './city-urban-plan-model.js?v=house-light-20261121';
import {INHABITED_BLOCKS} from './city-hex-layout.js?v=makers-passages-20261118';
export function buildCityUrbanPlan(T,{naturalTrees=globalThis.window?.buildNaturalCityTrees,parkGrass=null}={}){
 const group=new T.Group();group.name='Honeycomb city · gated mathematical courts and connected learning houses';const owned=new Set(),own=x=>(owned.add(x),x),box=own(new T.BoxGeometry(1,1,1)),stamp=new T.Object3D(),batches=new Map(),colliders=[],treePositions=urbanPlanting().filter(p=>HONEYCOMB_CITY.walls.every(w=>segmentDistance(p.x,p.z,w.a,w.b)>1.7)),routes=urbanRoutes();
 const mats={paving:own(new T.MeshLambertMaterial({color:0xc5baa1})),edge:own(new T.MeshLambertMaterial({color:0xaaa58d})),wood:own(new T.MeshLambertMaterial({color:0x795d45})),leaf:own(new T.MeshLambertMaterial({color:0x667d5d}))};
 function add(mat,x,y,z,w,h,d,turn=0){if(!batches.has(mat))batches.set(mat,[]);batches.get(mat).push({x,y,z,w,h,d,turn});}
 const onRoad=(x,z,margin)=>routes.some(r=>r.points.slice(1).some((b,i)=>segmentDistance(x,z,r.points[i],b)<r.width/2+margin));
 // Quiet lawn tones make the real regular courts legible at island scale.
 // Only whole cells that clear both protected circles receive this thin
 // surface. The Gallery/Babel and park/pond keep their original floor holes.
 const lawnCells=urbanLawnCells(),lawnPositions=[],lawnColours=[],lawnIndices=[[],[]],coastalCellIds=[],lawnPalette=COURT_GRASS_HEX.map(c=>new T.Color(c));
 for(const c of lawnCells){const colour=lawnPalette[courtGrassIndex(c)],coastal=isCoastalLawnCell(c);if(coastal)coastalCellIds.push(c.id);for(let i=0;i<6;i++){const a=c.vertices[i],b=c.vertices[(i+1)%6],offset=lawnPositions.length/3;lawnPositions.push(c.x,.012,c.z,b[0],.012,b[1],a[0],.012,a[1]);lawnIndices[coastal?1:0].push(offset,offset+1,offset+2);for(let k=0;k<3;k++)lawnColours.push(colour.r,colour.g,colour.b);}}
 // Reuse the existing surface and exactly two material groups. Coast-facing
 // cells match the park's actual grass; inner courts retain their old palette.
 // No extra coplanar skin or per-triangle draw calls are introduced.
 const coastalGrass=own(createParkGrassMaterial(T,parkGrass));
 const lawnGeometry=own(new T.BufferGeometry());lawnGeometry.setAttribute('position',new T.Float32BufferAttribute(lawnPositions,3));lawnGeometry.setAttribute('color',new T.Float32BufferAttribute(lawnColours,3));lawnGeometry.setIndex(lawnIndices.flat());let first=0;for(const [i,indices]of lawnIndices.entries()){if(indices.length)lawnGeometry.addGroup(first,indices.length,i);first+=indices.length;}lawnGeometry.computeVertexNormals();const lawn=new T.Mesh(lawnGeometry,[own(new T.MeshLambertMaterial({vertexColors:true})),coastalGrass]);if(globalThis.window?.CITY_CONFIG?.escherEntryCut)lawn.geometry=own(cutDescentGround(T,lawnGeometry,window.CITY_CONFIG.escherEntryCut));lawn.name='Regular outer honeycomb lawn courts · one protected surface batch';lawn.userData.coastalCellIds=coastalCellIds;group.add(lawn);
 const hexes=URBAN_COURTS.filter(c=>c.shape==='hex');
 for(const [radiusDelta,material,y,height]of[[0,mats.edge,.026,.032],[-.23,mats.paving,.045,.018]]){const geometry=own(new T.CylinderGeometry(1,1,1,6)),mesh=new T.InstancedMesh(geometry,material,hexes.length);mesh.name=radiusDelta===0?'Shared hexagonal civic and neighbourhood court borders':'Open hexagonal civic and neighbourhood courts';hexes.forEach((c,i)=>{stamp.position.set(c.x,y,c.z);stamp.rotation.set(0,Math.PI/2-c.turn,0);stamp.scale.set(c.radius+radiusDelta,height,c.radius+radiusDelta);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 stamp.rotation.set(0,0,0);
 for(const c of URBAN_COURTS){if(c.shape==='hex')continue;add(mats.paving,c.x,.022,c.z,c.width,.028,c.depth);for(const side of[-1,1])add(mats.edge,c.x+side*(c.width/2-.15),.04,c.z,.22,.06,c.depth);
  for(const side of[-1,1]){const x=c.x+side*(c.width/2-2),z=c.z+c.depth/2-2;if(onRoad(x,z,2))continue;add(mats.wood,x,.46,z,3,.14,.75);add(mats.wood,x,.79,z+.31,3,.55,.1);for(const dx of[-1.15,1.15])add(mats.wood,x+dx,.22,z,.13,.44,.55);colliders.push({x,z,w:3.15,d:.9});add(mats.leaf,x,.2,z-1.8,3.4,.36,1.2);colliders.push({x,z:z-1.8,w:3.4,d:1.2});}
 }
 // Six inhabited blocks have real covered perimeter arcades. Their roofs
 // frame the public houses; open columns keep every source doorway and
 // courtyard-to-street passage visible and physically passable.
 for(const c of INHABITED_BLOCKS){const vertices=Array.from({length:6},(_,i)=>[c.x+82.5*Math.cos(Math.PI/6+i*Math.PI/3),c.z+82.5*Math.sin(Math.PI/6+i*Math.PI/3)]);for(let i=0;i<6;i++){const a=vertices[i],b=vertices[(i+1)%6],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),turn=Math.atan2(dx,dz);add(mats.wood,(a[0]+b[0])/2,4.55,(a[1]+b[1])/2,6.2,.24,length+.4,turn);for(let d=4;d<length;d+=9)for(const side of[-1,1]){const x=a[0]+dx*d/length-dz/length*side*2.8,z=a[1]+dz*d/length+dx/length*side*2.8;if(onRoad(x,z,.6))continue;add(mats.edge,x,2.2,z,.4,4.4,.4);add(mats.edge,x,.18,z,.7,.36,.7);colliders.push({x,z,w:.7,d:.7});}}}
 for(const[material,rows]of batches){const mesh=new T.InstancedMesh(box,material,rows.length);mesh.name='Batched civic courts, seats and inhabited block arcades';rows.forEach((p,i)=>{stamp.position.set(p.x,p.y,p.z);stamp.rotation.set(0,p.turn,0);stamp.scale.set(p.w,p.h,p.d);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 const wallMaterial=own(new T.MeshLambertMaterial({color:0xc3b48f})),capMaterial=own(new T.MeshLambertMaterial({color:0x6b6047}));
 // The same real wall segments carry a low 2.4m stone foot. It resolves at
 // overview scale while remaining below the walking feet and keeping every
 // source-clipped gateway open. Copings and feet share one instance batch.
 for(const[material,cap]of[[wallMaterial,false],[capMaterial,true]]){const mesh=new T.InstancedMesh(box,material,HONEYCOMB_CITY.walls.length*(cap?2:1));mesh.name=cap?'Continuous warm-stone honeycomb copings and flush feet':'Real gated honeycomb court walls';HONEYCOMB_CITY.walls.forEach((w,i)=>{const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],length=Math.hypot(dx,dz);stamp.position.set((w.a[0]+w.b[0])/2,cap?w.height+.055:w.height/2,(w.a[1]+w.b[1])/2);stamp.rotation.set(0,Math.atan2(dx,dz),0);stamp.scale.set(cap?.95:w.thickness,cap?.11:w.height,length);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);if(cap){stamp.position.y=.025;stamp.scale.set(2.4,.05,length);stamp.updateMatrix();mesh.setMatrixAt(i+HONEYCOMB_CITY.walls.length,stamp.matrix);}});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 stamp.rotation.set(0,0,0);
 if(naturalTrees)naturalTrees(T,group,treePositions);
 return{group,lawn,treePositions,colliders,walls:HONEYCOMB_CITY.walls,canStand:(x,z)=>!treePositions.some(p=>Math.hypot(x-p.x,z-p.z)<.5)&&!colliders.some(p=>Math.abs(x-p.x)<p.w/2+.25&&Math.abs(z-p.z)<p.d/2+.25)&&!HONEYCOMB_CITY.walls.some(w=>segmentDistance(x,z,w.a,w.b)<w.thickness/2+.25),dispose(){group.removeFromParent();group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])owned.add(m);if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
