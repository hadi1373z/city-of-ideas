/* A single landscape system for the two equal circular buildings. */
(function(g){'use strict';
// Deterministic branching trees: small individual leaves, open crowns, no spherical canopy or display plinth.
g.buildNaturalCityTrees=function(T,parent,positions){
 const root=new T.Group();root.name='Natural branching trees';parent.add(root);
 let seed=9173;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const verts=[],colors=[],indices=[],o=new T.Object3D(),up=new T.Vector3(0,1,0);
 for(let i=0;i<32;i++){const q=new T.Quaternion().setFromEuler(new T.Euler(random()*Math.PI,random()*Math.PI*2,random()*Math.PI)),c=new T.Vector3((random()-.5)*1.15,(random()-.5)*.95,(random()-.5)*1.15),w=.075+random()*.035,h=.14+random()*.045,col=new T.Color().setHSL(.24+random()*.065,.22+random()*.11,.18+random()*.10),base=verts.length/3;
  for(const p of [[0,h,0],[-w*.7,h*.5,.012],[-w*.9,-h*.15,.025],[0,-h,0],[w*.9,-h*.15,.025],[w*.7,h*.5,.012]]){const v=new T.Vector3(...p).applyQuaternion(q).add(c);verts.push(v.x,v.y,v.z);colors.push(col.r,col.g,col.b);}indices.push(base,base+1,base+2,base,base+2,base+3,base,base+3,base+4,base,base+4,base+5);
 }
 const leafGeo=new T.BufferGeometry();leafGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));leafGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));leafGeo.setIndex(indices);leafGeo.computeVertexNormals();
 const foliage=new T.InstancedMesh(leafGeo,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),positions.length*38),branches=[];
 foliage.name='Individual leaves in irregular layered crowns';foliage.castShadow=true;foliage.receiveShadow=true;root.add(foliage);let leafIndex=0;
 for(const [i,p]of positions.entries()){
  const size=.88+random()*.35,turn=random()*Math.PI*2,leanX=(random()-.5)*.34,leanZ=(random()-.5)*.34,point=(x,y,z)=>new T.Vector3(p.x+(x*Math.cos(turn)-z*Math.sin(turn))*size,y*size,p.z+(x*Math.sin(turn)+z*Math.cos(turn))*size);
  const base=point(0,0,0),mid=point(leanX,1.35,leanZ),fork=point(leanX*1.4,2.7,leanZ*1.4);branches.push([base,mid,.19*size],[mid,fork,.125*size]);
  for(let j=0;j<7;j++){const a=j*2.399963,reach=1+random()*.6,tip=point(Math.cos(a)*reach,3.4+random()*1.4,Math.sin(a)*reach),start=j<3?mid:fork;branches.push([start,tip,(.046+random()*.025)*size]);const twig=tip.clone().add(new T.Vector3(Math.cos(a+.6)*.4,size*.5,Math.sin(a+.6)*.4));branches.push([tip,twig,.022*size]);}
  for(let j=0;j<38;j++){const a=j*2.399963+i*.7,u=(j+.5)/38,vertical=1-2*u,r=Math.sqrt(1-vertical*vertical)*(1.35+random()*.35),center=point(Math.cos(a)*r,4.1+vertical*1.6,Math.sin(a)*r);o.position.copy(center);o.rotation.set(random(),a,random());o.scale.set(size*(.9+random()*.35),size*(.8+random()*.35),size*(.9+random()*.3));o.updateMatrix();foliage.setMatrixAt(leafIndex++,o.matrix);}
 }
 const wood=new T.InstancedMesh(new T.CylinderGeometry(.58,1,1,9),new T.MeshLambertMaterial({color:0x645747}),branches.length);wood.name='Tapered trunks and visible forked branches';wood.castShadow=true;wood.receiveShadow=true;
 branches.forEach(([a,b,r],i)=>{const d=b.clone().sub(a);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(up,d.clone().normalize());o.scale.set(r,d.length(),r);o.updateMatrix();wood.setMatrixAt(i,o.matrix);});root.add(wood);root.userData.naturalTrees={count:positions.length,leafClusters:leafIndex,branches:branches.length};return root;
};
g.createCityLandscape=function(T,{parent,tiles,outerRadius=58}){
 const group=new T.Group();group.name='Paired circular promenades and entrance gardens';parent.add(group);
 const edgeMat=new T.MeshLambertMaterial({color:0xa9ac98}),bark=new T.MeshLambertMaterial({color:0x5f6959}),leaves=new T.MeshLambertMaterial({color:0x536e52}),beds=new T.MeshLambertMaterial({color:0x73836a}),metal=new T.MeshLambertMaterial({color:0x6c7967}),glow=new T.MeshStandardMaterial({color:0xe4d9b8,emissive:0xffd5a0,emissiveIntensity:.35,roughness:.8});
 const treePositions=[],lampPositions=[],paths=[];
 function groundHeight(x,z){if(Math.abs(z)<4&&x>=56&&x<=67)return .13+.265*Math.max(0,Math.min(1,(67-x)/3));if(Math.abs(z)<4&&x>=-67&&x<=-56)return .13+.265*Math.max(0,Math.min(1,(x+67)/3));if(Math.abs(z)<4&&x>=179&&x<=192)return .13+.29*Math.max(0,Math.min(1,(192-x)/9));if(Math.abs(x-62.5)>4.5||z< -47||z>27)return null;if(z< -20)return .13+.265*Math.max(0,Math.min(1,(z+34)/14));return .395-.265*Math.max(0,Math.min(1,(z-7)/18));}
 function surface(points,width,name){const p=[],ix=[],edge=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=new T.Vector2(b.x-a.x,b.z-a.z).normalize(),nx=-d.y,nz=d.x;for(const side of[-1,1]){const x=points[i].x+nx*width/2*side,z=points[i].z+nz*width/2*side,y=groundHeight(x,z)??.13;p.push(x,y+.003,z);edge.push(x,y-.025,z);}if(i<points.length-1){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}}function mesh(v,mat){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();const m=new T.Mesh(geo,mat);m.name=name;m.userData.groundPaving=true;m.visible=g.CITY_CONFIG?.showGroundPaving!==false;group.add(m);return m;}mesh(edge,edgeMat);mesh(p,tiles);paths.push({name,width,points});}
 function curve(points,width,name){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p[0],0,p[1]))),ps=c.getSpacedPoints(Math.ceil(c.getLength()/1.5));surface(ps,width,name);return c;}
 const main=curve([[0,94],[39,87],[59,69],[62.5,42],[62.5,20],[64.25,0]],6,'Tree-lined shared entrance promenade');
 curve([[62.5,-46],[62.5,-30],[62.5,-20],[62.5,-10],[64.25,0]],4,'Return lift garden path');
 for(const cx of[0,125]){const a=cx===0?Math.PI*40/180:Math.PI*220/180,b=cx===0?Math.PI*320/180:Math.PI*500/180,points=[];for(let i=0;i<=180;i++){const t=a+(b-a)*i/180;points.push(new T.Vector3(cx+Math.cos(t)*(outerRadius+6),0,Math.sin(t)*(outerRadius+6)));}surface(points,4,'Circular building promenade');for(let i=0;i<=22;i++){const t=a+(b-a)*i/22;if(i%5!==2){treePositions.push({x:cx+Math.cos(t)*(outerRadius+12),z:Math.sin(t)*(outerRadius+12)});if(i%5===0)treePositions.push({x:cx+Math.cos(t+.065)*(outerRadius+20),z:Math.sin(t+.065)*(outerRadius+20)});}}for(const sign of[-1,1]){const x=cx===0?Math.cos(Math.PI*40/180)*(outerRadius+6):125-Math.cos(Math.PI*40/180)*(outerRadius+6),z=sign*Math.sin(Math.PI*40/180)*(outerRadius+6);curve([[x,z],[62.5,sign*46],[62.5,sign*30]],4,'Entrance garden link');}}
 curve([[-64,0],[-58,0]],7,'Gallery outside entrance');curve([[58,0],[64.25,0]],7,'Gallery mountain-facing entrance');curve([[189,0],[183,0]],7,'Mountain outside entrance');
 for(let d=12;d<main.getLength()-10;d+=12){const u=d/main.getLength(),p=main.getPointAt(u),t=main.getTangentAt(u);for(const side of[-1,1]){const x=p.x-t.z*side*5,z=p.z+t.x*side*5;if(Math.hypot(x,z)>outerRadius+2&&Math.hypot(x-125,z)>outerRadius+2){lampPositions.push({x,z});if(z>35)treePositions.push({x:p.x-t.z*side*8,z:p.z+t.x*side*8});}}}
 function clearOfPaths(p,margin){for(const path of paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b.x-a.x,dz=b.z-a.z,u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));if(Math.hypot(p.x-a.x-dx*u,p.z-a.z-dz*u)<path.width/2+margin)return false;}return true;}
 const cleanLamps=lampPositions.filter(p=>clearOfPaths(p,.45));
 // Dalí's residence occupies this lot; keep both trunks and foliage out of its rooms.
 const daliLot={minX:108,maxX:128,minZ:65,maxZ:83};
 const trees=treePositions.filter((p,i)=>!(p.x>daliLot.minX&&p.x<daliLot.maxX&&p.z>daliLot.minZ&&p.z<daliLot.maxZ)&&!(Math.abs(p.z)<8&&(p.x< -58||p.x>183))&&clearOfPaths(p,2)&&Math.hypot(p.x,p.z)>outerRadius+4&&Math.hypot(p.x-125,p.z)>outerRadius+4&&treePositions.findIndex(q=>Math.hypot(q.x-p.x,q.z-p.z)<5)===i);
 function instances(geo,mat,list,transform,name){const m=new T.InstancedMesh(geo,mat,list.length),o=new T.Object3D();list.forEach((p,i)=>{o.position.set(0,0,0);o.scale.set(1,1,1);transform(o,p,i);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.name=name;m.userData.groundPaving=true;m.visible=g.CITY_CONFIG?.showGroundPaving!==false;group.add(m);}
 g.buildNaturalCityTrees(T,group,trees);
 instances(new T.CylinderGeometry(.1,.12,.85,10),metal,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.425,p.z),'Aligned low path lights');
 instances(new T.CylinderGeometry(.14,.14,.16,10),glow,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.9,p.z),'Warm path light caps');
 return{group,paths,trees,lamps:cleanLamps,groundHeight,canStand:(x,z)=>!trees.some(p=>Math.hypot(x-p.x,z-p.z)<1.8)&&!cleanLamps.some(p=>Math.hypot(x-p.x,z-p.z)<.32)};
};
})(window);
