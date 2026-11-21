import {SEA_TERRACES as S,SEA_TERRACE_SURFACES,SEA_TERRACE_PERGOLAS,SEA_TERRACE_VIEW_FRAMES,SEA_TERRACE_BENCHES,SEA_TERRACE_PLANTERS,SEA_TERRACE_WORLD_PLAN,seaTerraceWorld,seaTerraceFloorAt} from './sea-terraces-model.js';

// Original architecture; no imported sculpture, invented quotation or new light.
export function buildSeaTerraces(T){
 const group=new T.Group();group.name='Sea Terraces · three low coastal courts';group.position.set(S.x,0,S.z);group.rotation.y=-Math.PI/6;
 const owned=new Set(),own=r=>(owned.add(r),r),batches=new Map(),stamp=new T.Object3D(),targets=[];
 const materials={stone:own(new T.MeshStandardMaterial({color:0xd5c8ab,roughness:.91})),edge:own(new T.MeshStandardMaterial({color:0xbbaa89,roughness:.88})),wood:own(new T.MeshStandardMaterial({color:0x806344,roughness:.76})),woodLight:own(new T.MeshStandardMaterial({color:0xad8c61,roughness:.8})),soil:own(new T.MeshLambertMaterial({color:0x5b5f46})),leaf:own(new T.MeshLambertMaterial({color:0x65775a,side:T.DoubleSide})),flower:own(new T.MeshLambertMaterial({color:0x9e90ad})),metal:own(new T.MeshPhongMaterial({color:0x9a8456,specular:0xc3b48d,shininess:33}))};
 const cube=own(new T.BoxGeometry(1,1,1)),cylinder=own(new T.CylinderGeometry(1,1,1,10)),leafGeo=own(new T.PlaneGeometry(.13,.30));
 const floor=(u,v)=>{const p=seaTerraceWorld(u,v);return seaTerraceFloorAt(p.x,p.z)??S.floor;};
 function instance(geo,mat,x,y,v,sx,sy,sz,rotation=null){stamp.position.set(x,y,-v);stamp.scale.set(sx,sy,sz);stamp.rotation.set(0,0,0);if(rotation)stamp.rotation.set(...rotation);stamp.updateMatrix();const key=geo.uuid+mat.uuid;if(!batches.has(key))batches.set(key,{geo,mat,matrices:[]});batches.get(key).matrices.push(stamp.matrix.clone());}
 const box=(w,h,d,u,y,v,key='stone')=>instance(cube,materials[key],u,y,v,w,h,d);
 const rod=(a,b,r=.035)=>{const av=new T.Vector3(a[0],a[1],-a[2]),bv=new T.Vector3(b[0],b[1],-b[2]),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),bv.clone().sub(av).normalize());stamp.position.copy(av).add(bv).multiplyScalar(.5);stamp.quaternion.copy(q);stamp.scale.set(r,av.distanceTo(bv),r);stamp.updateMatrix();const key=cylinder.uuid+materials.metal.uuid;if(!batches.has(key))batches.set(key,{geo:cylinder,mat:materials.metal,matrices:[]});batches.get(key).matrices.push(stamp.matrix.clone());};
 const positions=[],colors=[],stoneTones=[0xd9cdb4,0xe2d6bd,0xd0c1a2,0xdccfb3];
 const emit=(points,color)=>{const c=new T.Color(color);for(const p of points){positions.push(p[0],p[1],-p[2]);colors.push(c.r,c.g,c.b);}};
 // Each true flat/graded patch has a top, enclosing sides and an opaque bottom.
 // Its exact diagonal is shared with floorAt, including the side return ramps.
 for(const[pIndex,p]of SEA_TERRACE_SURFACES.entries()){
  const[a,b,c,d]=p.points,color=stoneTones[(pIndex*7)%stoneTones.length];emit([a,b,d,b,c,d],color);
  for(let i=0;i<4;i++){const q=p.points[i],r=p.points[(i+1)%4],qb=[q[0],.005,q[2]],rb=[r[0],.005,r[2]];emit([q,qb,r,r,qb,rb],0xb9aa8e);}
  emit([[a[0],.005,a[2]],[d[0],.005,d[2]],[b[0],.005,b[2]],[b[0],.005,b[2]],[d[0],.005,d[2]],[c[0],.005,c[2]]],0xb9aa8e);
 }
 const terrainGeo=own(new T.BufferGeometry());terrainGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrainGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrainGeo.computeVertexNormals();terrainGeo.computeBoundingSphere();const terrainMat=own(new T.MeshStandardMaterial({vertexColors:true,roughness:.94,side:T.DoubleSide})),terrain=new T.Mesh(terrainGeo,terrainMat);terrain.name='Sea terraces · sealed actual stone floors and gentle ramps';terrain.receiveShadow=true;group.add(terrain);
 // Restrained shallow paving joints follow the actual shared floor, without
 // painted roads or a separate plane over the ramps.
 const joints=[];
 const line=(u0,v0,u1,v1)=>{const n=Math.ceil(Math.hypot(u1-u0,v1-v0)/.55);for(let i=0;i<n;i++){const a=i/n,b=(i+1)/n,u=u0+(u1-u0)*a,v=v0+(v1-v0)*a,U=u0+(u1-u0)*b,V=v0+(v1-v0)*b;if(Math.abs(floor(u,v)-floor(U,V))>.07)continue;joints.push(u,floor(u,v)+.002,-v,U,floor(U,V)+.002,-V);}};
 for(let u=-32.3;u<34;u+=3.4)line(u,22,u,47);for(const v of[23,26,29,32,35,38,41,44,47])line(-34,v,34,v);
 const jointGeo=own(new T.BufferGeometry());jointGeo.setAttribute('position',new T.Float32BufferAttribute(joints,3));const jointMaterial=own(new T.LineBasicMaterial({color:0xb6a68a})),jointMesh=new T.LineSegments(jointGeo,jointMaterial);jointMesh.name='Sea terrace · fine stone joints';group.add(jointMesh);
 for(const p of SEA_TERRACE_PERGOLAS){
  for(const du of[-4.7,4.7])for(const dv of[-2.9,2.9]){const u=p.u+du,v=p.v+dv,y=floor(u,v);box(.62,.16,.62,u,y+.08,v,'edge');box(.35,p.eave-y-.16,.35,u,(p.eave+y+.16)/2,v);box(.56,.14,.56,u,p.eave-.06,v,'edge');}
  for(const dv of[-3.25,3.25])box(10.6,.24,.23,p.u,p.eave+.04,p.v+dv,'wood');
  for(const du of[-5.1,5.1])box(.22,.24,7.2,p.u+du,p.eave+.04,p.v,'wood');
  for(let u=-5.2;u<=5.21;u+=.62)box(.16,.16,7.4,p.u+u,p.eave+.22,p.v,'woodLight');
 }
 for(const b of SEA_TERRACE_BENCHES){const y=floor(b.u,b.v);for(const side of[-1,1]){box(.32,.39,.69,b.u+side*(b.width/2-.4),y+.195,b.v,'edge');box(.08,.64,.08,b.u+side*(b.width/2-.22),y+.50,b.v-.28,'metal');}
  for(let j=0;j<5;j++)box(b.width,.085,.125,b.u,y+.43,b.v-.32+j*.15,j%2?'wood':'woodLight');
  for(let j=0;j<3;j++)box(b.width,.11,.08,b.u,y+.64+j*.13,b.v-.34,j%2?'wood':'woodLight');
 }
 for(const f of SEA_TERRACE_VIEW_FRAMES){const y=.61;for(const sign of[-1,1]){const u=f.u+sign*(f.width/2-.26);box(.64,.18,.84,u,y+.09,f.v,'edge');box(.43,f.height-.36,.60,u,y+f.height/2,f.v);box(.66,.16,.85,u,y+f.height-.08,f.v,'edge');}box(f.width+.16,.28,.76,f.u,y+f.height+.04,f.v);box(f.width+.30,.08,.88,f.u,y+f.height+.22,f.v,'edge');}
 for(const p of SEA_TERRACE_PLANTERS){const y=floor(p.u,p.v);for(const side of[-1,1])box(.13,p.height,p.depth,p.u+side*(p.width/2-.065),y+p.height/2,p.v,'edge');for(const side of[-1,1])box(p.width-.26,p.height,.13,p.u,y+p.height/2,p.v+side*(p.depth/2-.065),'edge');box(p.width-.26,.035,p.depth-.26,p.u,y+p.height-.07,p.v,'soil');
  for(let i=0;i<26;i++){const u=p.u+Math.sin(i*2.39996)*.32,v=p.v-1.48+(i+.5)/26*2.96,h=.20+(i%5)*.035;for(let k=0;k<3;k++)instance(leafGeo,materials.leaf,u,y+p.height+h*.45,v,1,h/.30,1,[.2+k*.7,i*2.39996+k,0]);if(i%3===0)instance(cylinder,materials.flower,u,y+p.height+h,v,.035,.10,.035);}
 }
 // This guard is only at the48cm raised sea lip. The ten-metre side ramps and
 // the independently owned shore promenade remain open at both ends.
 for(let u=-24;u<=24;u+=2.4)rod([u,.61,46.6],[u,1.66,46.6],.035);
 for(const y of[1.15,1.66])rod([-24,y,46.6],[24,y,46.6],.038);
 for(const {geo,mat,matrices}of batches.values()){const mesh=new T.InstancedMesh(geo,mat,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;mesh.name='Sea terrace · batched '+(Object.entries(materials).find(([,m])=>m===mat)?.[0]??'details');group.add(mesh);}
 group.userData.seaTerraces=true;group.userData.worldPlan=SEA_TERRACE_WORLD_PLAN;group.updateMatrixWorld(true);
 let disposed=false;return{group,targets,worldPlan:SEA_TERRACE_WORLD_PLAN,terrain,floorAt:seaTerraceFloorAt,dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});for(const r of owned)r.dispose();owned.clear();group.clear();}};
}
