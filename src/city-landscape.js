/* Polygonal campus streets shared by source landscape, city paving and maps. */
(function(g){'use strict';
 const hex=(x,z,r,turn=0)=>Array.from({length:7},(_,i)=>[x+r*Math.cos(turn+i*Math.PI/3),z+r*Math.sin(turn+i*Math.PI/3)]),sixfold=g.CITY_CONFIG?.sixfoldHouses!==false,R=Math.sqrt(3)*92,A=R/2;
 const ring=Array.from({length:6},(_,i)=>{const angle=i*Math.PI/3;return{id:['east','southeast','southwest','west','northwest','northeast'][i],x:R*Math.cos(angle),z:R*Math.sin(angle),angle};});
 const gallery=hex(0,0,92,Math.PI/6),fronts=ring.map(h=>({id:'sixfold-front-'+h.id,name:'Tangential doorway · '+h.id,width:3.6,points:[26,92].map(r=>[h.x-r*Math.sin(h.angle),h.z+r*Math.cos(h.angle)])}));
 const legacyGallery=hex(0,0,76),legacyHouse=hex(125,0,32);
 g.CITY_CAMPUS_PLAN=Object.freeze({sixfold,roads:Object.freeze(sixfold?[
 ...fronts,
 {id:'gallery-west-threshold',name:'Gallery west graded threshold',width:7,points:[[-58,0],[-A,0]]},
 {id:'gallery-east-threshold',name:'Gallery east graded threshold',width:7,points:[[58,0],[A,0]]},
 {id:'gallery-lift-spine',name:'Graded lift return to the central hex',width:4,points:[[64.25,0],[62.5,0],[62.5,-46],[A,-46]]},
 {id:'gallery-south-grade-spine',name:'Graded south doorway to the central hex',width:4.5,points:[[64.25,0],[62.5,0],[62.5,92-62.5/Math.sqrt(3)]]}
 ]:[
 {id:'sixfold-hexagon',name:'Gallery hexagonal precinct',width:6,points:legacyGallery},
 {id:'transformations-precinct',name:'Transformations compact hexagonal precinct',width:4.5,points:legacyHouse},
 ...Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return{id:'civic-view-'+(i+1),name:'Campus hexagonal view '+(i+1),width:5.2,points:[legacyGallery[i],i===0?[93,0]:[108*Math.cos(a),108*Math.sin(a)]]};}),
 {id:'gallery-west-threshold',name:'Gallery west graded threshold',width:7,points:[[-58,0],[-76,0]]},
 {id:'gallery-east-threshold',name:'Gallery east graded threshold',width:7,points:[[58,0],[76,0]]},
 {id:'gallery-lift-spine',name:'Straight return-lift garden',width:4,points:[[64.25,0],[62.5,0],[62.5,-46],[76,-46]]},
 {id:'gallery-south-grade-spine',name:'Straight graded south entrance spine',width:4.5,points:[[64.25,0],[62.5,0],[62.5,65.81793068761733]]},
 {id:'campus-south-gate',name:'South campus gateway',width:5.2,points:[[38,65.81793068761733],[62.5,65.81793068761733],[62.5,94],[0,94]]},
 {id:'transformation-south-door',name:'Transformations south doorway',width:3.2,points:[[125,19.918584287042087],[125,27.712812921102035]]}
 ])});

// Roof-aware street-tree exclusions exist before asynchronous district mounting.
 g.CITY_CORE_TREE_EXCLUSIONS=Object.freeze([{id:'gallery',x:0,z:0,shape:'circle',radius:58},...(sixfold?ring.map(h=>({...h,shape:'circle',radius:25})):[{id:'transformations',x:125,z:0,shape:'circle',radius:25},{id:'aperiodic',x:-108.25,z:-62.5,shape:'circle',radius:16},{id:'inflation',x:0,z:-125,shape:'circle',radius:16},{id:'symmetry',x:108.25,z:-62.5,shape:'circle',radius:16}]),{id:'makers',x:225,z:-50,shape:'circle',radius:29},{id:'socrates',x:-96,z:100,shape:'circle',radius:30},{id:'archetypes-reserved-ground',x:-318.6973486,z:276,shape:'circle',radius:55}]);
 g.cityStreetTreeClear=(x,z,clearance=7)=>g.CITY_CORE_TREE_EXCLUSIONS.every(h=>Math.hypot(x-h.x,z-h.z)>=h.radius+clearance)&&(!g.CITY_PUBLIC_TREE_CLEAR||g.CITY_PUBLIC_TREE_CLEAR(x,z,clearance));
// Deterministic branching trees: small individual leaves, open crowns, no spherical canopy or display plinth.
g.buildNaturalCityTrees=function(T,parent,positions){
 positions=positions.filter(p=>g.cityStreetTreeClear(p.x,p.z));
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
 branches.forEach(([a,b,r],i)=>{const d=b.clone().sub(a);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(up,d.clone().normalize());o.scale.set(r,d.length(),r);o.updateMatrix();wood.setMatrixAt(i,o.matrix);});root.add(wood);root.userData.naturalTrees={count:positions.length,leafClusters:leafIndex,branches:branches.length,crownClearance:7,positions:positions.map(p=>({x:p.x,z:p.z}))};return root;
};
g.createCityLandscape=function(T,{parent,tiles,outerRadius=58}){
 const group=new T.Group();group.name='Polygonal central campus and real graded doorways';parent.add(group);
 const edgeMat=new T.MeshLambertMaterial({color:0xa9ac98}),bark=new T.MeshLambertMaterial({color:0x5f6959}),leaves=new T.MeshLambertMaterial({color:0x536e52}),beds=new T.MeshLambertMaterial({color:0x73836a}),metal=new T.MeshLambertMaterial({color:0x6c7967}),glow=new T.MeshStandardMaterial({color:0xe4d9b8,emissive:0xffd5a0,emissiveIntensity:.35,roughness:.8});
 const treePositions=[],lampPositions=[],paths=[];
 function groundHeight(x,z){if(Math.abs(z)<4&&x>=56&&x<=67)return .13+.265*Math.max(0,Math.min(1,(67-x)/3));if(Math.abs(z)<4&&x>=-67&&x<=-56)return .13+.265*Math.max(0,Math.min(1,(x+67)/3));if(Math.abs(z)<4&&x>=179&&x<=192)return .13+.29*Math.max(0,Math.min(1,(192-x)/9));if(Math.abs(x-62.5)>4.5||z< -47||z>27)return null;if(z< -20)return .13+.265*Math.max(0,Math.min(1,(z+34)/14));return .395-.265*Math.max(0,Math.min(1,(z-7)/18));}
 function surface(points,width,name){const p=[],ix=[],edge=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=new T.Vector2(b.x-a.x,b.z-a.z).normalize(),nx=-d.y,nz=d.x;for(const side of[-1,1]){const x=points[i].x+nx*width/2*side,z=points[i].z+nz*width/2*side,y=groundHeight(x,z)??.13;p.push(x,y+.003,z);edge.push(x,y-.025,z);}if(i<points.length-1){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}}function mesh(v,mat){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();const m=new T.Mesh(geo,mat);m.name=name;m.userData.groundPaving=true;m.visible=g.CITY_CONFIG?.showGroundPaving!==false;group.add(m);return m;}mesh(edge,edgeMat);mesh(p,tiles);paths.push({name,width,points});}
 // Straight segments are sampled only to preserve the existing doorway
 // grades; the plan has genuine polygon corners, never a resampled old arc.
 for(const route of g.CITY_CAMPUS_PLAN.roads){const points=[];for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],n=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.75);for(let j=0;j<n;j++)points.push(new T.Vector3(a[0]+(b[0]-a[0])*j/n,0,a[1]+(b[1]-a[1])*j/n));}points.push(new T.Vector3(...[route.points.at(-1)[0],0,route.points.at(-1)[1]]));surface(points,route.width,route.name);paths.at(-1).id=route.id;
 for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);for(let d=10;d<length-5;d+=15)for(const side of[-1,1]){const offset=route.width/2+5,x=a[0]+dx*d/length-dz/length*offset*side,z=a[1]+dz*d/length+dx/length*offset*side;treePositions.push({x,z});if(Math.round(d)%2===0)lampPositions.push({x:a[0]+dx*d/length-dz/length*(route.width/2+1.3)*side,z:a[1]+dz*d/length+dx/length*(route.width/2+1.3)*side});}}}
 function clearOfPaths(p,margin){for(const path of paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b.x-a.x,dz=b.z-a.z,u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));if(Math.hypot(p.x-a.x-dx*u,p.z-a.z-dz*u)<path.width/2+margin)return false;}return true;}
 const cleanLamps=lampPositions.filter(p=>clearOfPaths(p,.45));
 // Dalí's residence occupies this lot; keep both trunks and foliage out of its rooms.
 const daliLot={minX:108,maxX:128,minZ:65,maxZ:83};
 const trees=treePositions.filter((p,i)=>g.cityStreetTreeClear(p.x,p.z)&&!(p.x>daliLot.minX&&p.x<daliLot.maxX&&p.z>daliLot.minZ&&p.z<daliLot.maxZ)&&!(Math.abs(p.z)<8&&(p.x< -58||p.x>183))&&clearOfPaths(p,2)&&Math.hypot(p.x,p.z)>outerRadius+4&&treePositions.findIndex(q=>Math.hypot(q.x-p.x,q.z-p.z)<5)===i);
 function instances(geo,mat,list,transform,name){const m=new T.InstancedMesh(geo,mat,list.length),o=new T.Object3D();list.forEach((p,i)=>{o.position.set(0,0,0);o.scale.set(1,1,1);transform(o,p,i);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.name=name;m.userData.groundPaving=true;m.visible=g.CITY_CONFIG?.showGroundPaving!==false;group.add(m);}
 g.buildNaturalCityTrees(T,group,trees);
 instances(new T.CylinderGeometry(.1,.12,.85,10),metal,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.425,p.z),'Aligned low path lights');
 instances(new T.CylinderGeometry(.14,.14,.16,10),glow,cleanLamps,(o,p)=>o.position.set(p.x,(groundHeight(p.x,p.z)??.13)+.9,p.z),'Warm path light caps');
 return{group,paths,trees,lamps:cleanLamps,groundHeight,canStand:(x,z)=>!trees.some(p=>Math.hypot(x-p.x,z-p.z)<1.8)&&!cleanLamps.some(p=>Math.hypot(x-p.x,z-p.z)<.32)};
};
})(typeof window!=='undefined'?window:globalThis);
