/* A single landscape system for the two equal circular buildings. */
(function(g){'use strict';
g.createCityLandscape=function(T,{parent,tiles,outerRadius=58}){
 const group=new T.Group();group.name='Paired circular promenades and entrance gardens';parent.add(group);
 const edgeMat=new T.MeshLambertMaterial({color:0xa9ac98}),bark=new T.MeshLambertMaterial({color:0x5f6959}),leaves=new T.MeshLambertMaterial({color:0x536e52}),beds=new T.MeshLambertMaterial({color:0x73836a}),metal=new T.MeshLambertMaterial({color:0x6c7967}),glow=new T.MeshStandardMaterial({color:0xe4d9b8,emissive:0xffd5a0,emissiveIntensity:.35,roughness:.8});
 const treePositions=[],lampPositions=[],paths=[];
 function groundHeight(x,z){if(Math.abs(z)<4&&x>=-67&&x<=-56)return .13+.265*Math.max(0,Math.min(1,(x+67)/3));if(Math.abs(z)<4&&x>=179&&x<=192)return .13+.29*Math.max(0,Math.min(1,(192-x)/9));if(Math.abs(x-62.5)>4.5||z< -47||z>27)return null;if(z< -20)return .13+.265*Math.max(0,Math.min(1,(z+34)/14));return .395-.265*Math.max(0,Math.min(1,(z-7)/18));}
 function surface(points,width,name){const p=[],ix=[],edge=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=new T.Vector2(b.x-a.x,b.z-a.z).normalize(),nx=-d.y,nz=d.x;for(const side of[-1,1]){const x=points[i].x+nx*width/2*side,z=points[i].z+nz*width/2*side,y=groundHeight(x,z)??.13;p.push(x,y+.003,z);edge.push(x,y-.025,z);}if(i<points.length-1){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}}function mesh(v,mat){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();const m=new T.Mesh(geo,mat);m.name=name;group.add(m);return m;}mesh(edge,edgeMat);mesh(p,tiles);paths.push({name,width,points});}
 function curve(points,width,name){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p[0],0,p[1]))),ps=c.getSpacedPoints(Math.ceil(c.getLength()/1.5));surface(ps,width,name);return c;}
 const main=curve([[0,94],[39,87],[59,69],[62.5,42],[62.5,20],[64.25,0]],6,'Tree-lined shared entrance promenade');
 curve([[62.5,-46],[62.5,-30],[62.5,-20],[62.5,-10],[64.25,0]],4,'Return lift garden path');
 for(const cx of[0,125]){const a=cx===0?Math.PI*40/180:Math.PI*220/180,b=cx===0?Math.PI*320/180:Math.PI*500/180,points=[];for(let i=0;i<=180;i++){const t=a+(b-a)*i/180;points.push(new T.Vector3(cx+Math.cos(t)*(outerRadius+6),0,Math.sin(t)*(outerRadius+6)));}surface(points,4,'Circular building promenade');for(let i=0;i<=22;i++){const t=a+(b-a)*i/22;treePositions.push({x:cx+Math.cos(t)*(outerRadius+12),z:Math.sin(t)*(outerRadius+12)});}for(const sign of[-1,1]){const x=cx===0?Math.cos(Math.PI*40/180)*(outerRadius+6):125-Math.cos(Math.PI*40/180)*(outerRadius+6),z=sign*Math.sin(Math.PI*40/180)*(outerRadius+6);curve([[x,z],[62.5,sign*46],[62.5,sign*30]],4,'Entrance garden link');}}
 curve([[-64,0],[-58,0]],7,'Gallery outside entrance');curve([[189,0],[183,0]],7,'Mountain outside entrance');
 for(let d=12;d<main.getLength()-10;d+=12){const u=d/main.getLength(),p=main.getPointAt(u),t=main.getTangentAt(u);for(const side of[-1,1]){const x=p.x-t.z*side*5,z=p.z+t.x*side*5;if(Math.hypot(x,z)>outerRadius+2&&Math.hypot(x-125,z)>outerRadius+2){lampPositions.push({x,z});if(z>35)treePositions.push({x:p.x-t.z*side*8,z:p.z+t.x*side*8});}}}
 function clearOfPaths(p,margin){for(const path of paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b.x-a.x,dz=b.z-a.z,u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));if(Math.hypot(p.x-a.x-dx*u,p.z-a.z-dz*u)<path.width/2+margin)return false;}return true;}
 const cleanLamps=lampPositions.filter(p=>clearOfPaths(p,.45));
 const trees=treePositions.filter((p,i)=>clearOfPaths(p,2)&&Math.hypot(p.x,p.z)>outerRadius+4&&Math.hypot(p.x-125,p.z)>outerRadius+4&&treePositions.findIndex(q=>Math.hypot(q.x-p.x,q.z-p.z)<5)===i);
 function instances(geo,mat,list,transform,name){const m=new T.InstancedMesh(geo,mat,list.length),o=new T.Object3D();list.forEach((p,i)=>{o.position.set(0,0,0);o.scale.set(1,1,1);transform(o,p,i);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.name=name;group.add(m);}
 instances(new T.CylinderGeometry(1.5,1.5,.18,24),beds,trees,(o,p)=>o.position.set(p.x,.15,p.z),'Consistent circular tree beds');
 instances(new T.CylinderGeometry(.15,.2,3,10),bark,trees,(o,p)=>o.position.set(p.x,1.65,p.z),'Promenade tree trunks');
 instances(new T.SphereGeometry(1,16,12),leaves,trees,(o,p)=>{o.position.set(p.x,4,p.z);o.scale.set(1.65,2.1,1.65);},'Promenade tree crowns');
 instances(new T.CylinderGeometry(.1,.12,.85,10),metal,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.425,p.z),'Aligned low path lights');
 instances(new T.CylinderGeometry(.14,.14,.16,10),glow,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.9,p.z),'Warm path light caps');
 return{group,paths,trees,lamps:cleanLamps,groundHeight,canStand:(x,z)=>!trees.some(p=>Math.hypot(x-p.x,z-p.z)<1.8)&&!cleanLamps.some(p=>Math.hypot(x-p.x,z-p.z)<.32)};
};
})(window);
