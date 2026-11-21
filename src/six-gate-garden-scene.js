import {SIX_GATE_GARDEN as G,GARDEN_GATES,GARDEN_ARCADE_BAYS,GARDEN_COLUMNS,GARDEN_ROUTES,GARDEN_SEATS,GARDEN_BEDS,GARDEN_COLLIDERS,gardenPolar,gardenWorld,gardenCanStand,gardenTreeBedPlan} from './six-gate-garden-model.js';

export function buildSixGateGarden(T,{paving=true,planting=true}={}){
 const group=new T.Group();group.name='Six Gate Garden · shaded loop, open loggias and real house approaches';
 group.userData.surfaceOnly=true;group.userData.gardenId=G.id;
 const owned=new Set(),own=x=>(owned.add(x),x),batches=new Map(),stamp=new T.Object3D();
 const materials={stone:own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})),roof:own(new T.MeshPhongMaterial({vertexColors:true,side:T.DoubleSide,shininess:28,specular:0x7d8f89})),bronze:own(new T.MeshPhongMaterial({vertexColors:true,shininess:60,specular:0xb3a27c,side:T.DoubleSide})),plant:own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}))};
 const unitBox=own(new T.BoxGeometry(1,1,1)),unitCylinder=own(new T.CylinderGeometry(1,1,1,12)),unitFineBeam=own(new T.CylinderGeometry(1,1,1,6));
 const rows=name=>{if(!batches.has(name))batches.set(name,[]);return batches.get(name);};
 function triangle(a,b,c,colour=0xd9cfb6,name='stone'){
  const rgb=new T.Color(colour),out=rows(name);for(const p of[a,b,c])out.push(...p,rgb.r,rgb.g,rgb.b);
 }
 function face(points,colour,name){for(let i=1;i<points.length-1;i++)triangle(points[0],points[i],points[i+1],colour,name);}
 function transformed(source,matrix,colour,name){
  const p=source.attributes.position,ix=source.index?.array||Array.from({length:p.count},(_,i)=>i),out=rows(name),c=new T.Color(colour),v=new T.Vector3();
  for(const i of ix){v.fromBufferAttribute(p,i).applyMatrix4(matrix);out.push(v.x,v.y,v.z,c.r,c.g,c.b);}
 }
 function box(x,y,z,w,h,d,colour=0xd7cdb3,angle=0,name='stone'){
  stamp.position.set(x,y,z);stamp.rotation.set(0,-angle,0);stamp.scale.set(w,h,d);stamp.updateMatrix();transformed(unitBox,stamp.matrix,colour,name);
 }
 function cylinder(x,y,z,r,h,colour=0xd7cdb3,name='stone'){
  stamp.position.set(x,y,z);stamp.rotation.set(0,0,0);stamp.scale.set(r,h,r);stamp.updateMatrix();transformed(name==='plant'?unitFineBeam:unitCylinder,stamp.matrix,colour,name);
 }
 function beam(a,b,r=.035,colour=0xae9258,name='bronze'){
  const A=new T.Vector3(...a),B=new T.Vector3(...b),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),B.clone().sub(A).normalize()),m=new T.Matrix4().compose(A.clone().add(B).multiplyScalar(.5),q,new T.Vector3(r,A.distanceTo(B),r));transformed(unitFineBeam,m,colour,name);
 }
 function slab(points,top=G.floor,bottom=-.035,colour=0xd8cfb9){
  face(points.map(p=>[p[0],top,p[1]]),colour);face([...points].reverse().map(p=>[p[0],bottom,p[1]]),colour);
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];face([[a[0],bottom,a[1]],[b[0],bottom,b[1]],[b[0],top,b[1]],[a[0],top,a[1]]],0xb8ae94);}
 }
 if(paving){
  // Every walking surface is real supported masonry, not a floating decal.
  for(const r of GARDEN_ROUTES){
   if(r.id==='garden-inner-promenade'||r.id==='garden-shaded-loop'){
    const radius=Math.hypot(...r.points[0]);for(let i=1;i<r.points.length;i++){
     const a=Math.atan2(r.points[i-1][1],r.points[i-1][0]),b=Math.atan2(r.points[i][1],r.points[i][0]);
     slab([gardenPolar(radius-r.width/2,a),gardenPolar(radius+r.width/2,a),gardenPolar(radius+r.width/2,b),gardenPolar(radius-r.width/2,b)]);
    }continue;
   }
   for(let i=1;i<r.points.length;i++){
    const a=r.points[i-1],b=r.points[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);if(length<1e-8)continue;
    const nx=-dz/length*r.width/2,nz=dx/length*r.width/2,ex=dx/length*.035,ez=dz/length*.035;
    // Small real overlaps close quantised triangle seams at rotated joins.
    slab([[a[0]-ex+nx,a[1]-ez+nz],[a[0]-ex-nx,a[1]-ez-nz],[b[0]+ex-nx,b[1]+ez-nz],[b[0]+ex+nx,b[1]+ez+nz]]);
    if(i<r.points.length-1){const p=b,polygon=Array.from({length:12},(_,j)=>[p[0]+r.width/2*Math.cos(j*Math.PI/6),p[1]+r.width/2*Math.sin(j*Math.PI/6)]);slab(polygon);}
   }
  }
  for(const g of GARDEN_GATES){const p=g.court;slab(Array.from({length:6},(_,i)=>[p[0]+6*Math.cos(g.angle+i*Math.PI/3),p[1]+6*Math.sin(g.angle+i*Math.PI/3)]),G.floor,-.035,0xe1d6bd);}
  // Fine joints make the broad walking stone human-scaled without 3D ridges.
  for(let i=0;i<144;i++){const a=i*Math.PI/72,p=gardenPolar(101,a),q=gardenPolar(109,a),n=[-Math.sin(a)*.018,Math.cos(a)*.018];face([[p[0]+n[0],.132,p[1]+n[1]],[q[0]+n[0],.132,q[1]+n[1]],[q[0]-n[0],.132,q[1]-n[1]],[p[0]-n[0],.132,p[1]-n[1]]],0xb4b2a0);}
  // Six original inset motif families. These restrained bands are ornamental
  // samples, not a claim that this entire ring is an exact aperiodic tiling.
  const colours=[0xa98c58,0x718d89,0xb18b70,0x7a8996,0x9a8570,0x8c9b75];
  for(const[gIndex,g]of GARDEN_GATES.entries())for(let i=0;i<28;i++){
   const a=g.angle+.10+i*(Math.PI/3-.20)/27,p=gardenPolar(108.15,a),U=[Math.cos(a),Math.sin(a)],V=[-U[1],U[0]],at=(u,v)=>[p[0]+U[0]*u+V[0]*v,.134,p[1]+U[1]*u+V[1]*v],c=colours[gIndex];
   const n=[4,6,3,4,8,6][gIndex],radius=gIndex===2?.42:.38;
   if(gIndex===0)face([[0,-.55],[.32,0],[0,.55],[-.32,0]].map(([u,v])=>at(u,v)),c);
   else face(Array.from({length:n},(_,j)=>at(radius*Math.cos(j*Math.PI*2/n+(gIndex===3?Math.PI/4:0)),radius*Math.sin(j*Math.PI*2/n+(gIndex===3?Math.PI/4:0)))),c);
   if(gIndex===5)for(const s of[-1,1])face([[.02,s*.44],[.28,s*.69],[-.24,s*.68]].map(([u,v])=>at(u,v)),c);
  }
 }

 // Column bases occupy only the outside edges of the continuous walking band.
 // Their shared model also shifts the six sector-bisector pairs away from the
 // retained block streets; the arches/roof below consume those same boundaries.
 for(const c of GARDEN_COLUMNS){
  cylinder(c.x,.23,c.z,G.columnBaseRadius,.20,0xc3b797);
  cylinder(c.x,2.51,c.z,G.columnRadius,4.36,0xddd2b6);
  cylinder(c.x,4.72,c.z,.34,.20,0xe8ddc3);
  cylinder(c.x,4.85,c.z,.39,.10,0xc2b38f);
 }

 // A genuine masonry arch ring extrudes around a clear elliptical aperture.
 // There is no wall or fence below its spring line and no head-height beam.
 function arch(a,b,spring=2.75,rise=1.62,depth=.32,thickness=.25){
  const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),u=[dx/length,dz/length],n=[-u[1],u[0]],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],half=length/2;
  const point=(theta,outer,side)=>[mid[0]+u[0]*(half+(outer?thickness:0))*Math.cos(theta)+n[0]*side*depth/2,spring+(rise+(outer?thickness:0))*Math.sin(theta),mid[1]+u[1]*(half+(outer?thickness:0))*Math.cos(theta)+n[1]*side*depth/2];
  for(let j=0;j<20;j++){const t=j*Math.PI/20,q=(j+1)*Math.PI/20;for(const side of[-1,1])face([point(t,false,side),point(q,false,side),point(q,true,side),point(t,true,side)],0xe0d5ba);face([point(t,false,-1),point(q,false,-1),point(q,false,1),point(t,false,1)],0xc8bca0);face([point(t,true,-1),point(q,true,-1),point(q,true,1),point(t,true,1)],0xd9cdb1);}
 }
 for(const bay of GARDEN_ARCADE_BAYS){
  for(const r of[G.innerColumnRadius,G.outerColumnRadius]){
   const a=gardenPolar(r,bay.a),b=gardenPolar(r,bay.b);arch(a,b);
   beam([a[0],4.92,a[1]],[b[0],4.92,b[1]],.07,0xb2a078);
  }
  const ai=gardenPolar(G.roofInner,bay.a),bi=gardenPolar(G.roofInner,bay.b),ao=gardenPolar(G.roofOuter,bay.a),bo=gardenPolar(G.roofOuter,bay.b),ar=gardenPolar(G.ringRadius,bay.a),br=gardenPolar(G.ringRadius,bay.b);
  for(const[edgeA,edgeB]of[[ai,bi],[ao,bo]]){
   face([[edgeA[0],G.roofEave,edgeA[1]],[edgeB[0],G.roofEave,edgeB[1]],[br[0],G.roofRidge,br[1]],[ar[0],G.roofRidge,ar[1]]],0x6f8883,'roof');
   face([[edgeA[0],G.roofEave-.16,edgeA[1]],[edgeB[0],G.roofEave-.16,edgeB[1]],[br[0],G.roofRidge-.16,br[1]],[ar[0],G.roofRidge-.16,ar[1]]],0xb8af94,'stone');
   beam([edgeA[0],G.roofEave,edgeA[1]],[edgeB[0],G.roofEave,edgeB[1]],.045);
  }
  beam([ar[0],G.roofRidge,ar[1]],[br[0],G.roofRidge,br[1]],.045);
 }

 // Six open four-column loggias; both radial faces remain real apertures.
 for(const g of GARDEN_GATES){
  for(const u of[G.gateInner,G.gateOuter]){const a=gardenWorld(g,u,-G.gateWidth/2),b=gardenWorld(g,u,G.gateWidth/2);arch(a,b,2.8,1.70,.43,.30);beam([a[0],4.9,a[1]],[b[0],4.9,b[1]],.07);}
  const corners=g.roof,peak=gardenWorld(g,(G.gateInner+G.gateOuter)/2,0);
  for(let i=0;i<4;i++){const a=corners[i],b=corners[(i+1)%4];face([[a[0],5.02,a[1]],[b[0],5.02,b[1]],[peak[0],6.12,peak[1]]],0x738b84,'roof');face([[a[0],4.86,a[1]],[b[0],4.86,b[1]],[peak[0],5.96,peak[1]]],0xd7cbb0,'stone');beam([a[0],5.02,a[1]],[b[0],5.02,b[1]],.055);beam([a[0],5.02,a[1]],[peak[0],6.12,peak[1]],.035);}
  cylinder(peak[0],6.16,peak[1],.15,.18,0xae9258,'bronze');
 }

 for(const s of GARDEN_SEATS){const p=s.point;
  box(p[0],.63,p[1],s.depth,.20,s.width,0xa88b5a,s.angle);
  for(const v of[-1.35,1.35]){const q=[p[0]-Math.sin(s.angle)*v,p[1]+Math.cos(s.angle)*v];box(q[0],.35,q[1],.72,.44,.22,0xbcb399,s.angle);}
  const q=[p[0]-.37*Math.cos(s.angle),p[1]-.37*Math.sin(s.angle)];box(q[0],.92,q[1],.13,.44,s.width,0xbead88,s.angle);
 }
 for(const b of GARDEN_BEDS){const p=b.point;
  box(p[0],.29,p[1],b.depth,.31,b.width,0xbeb394,b.angle);
  box(p[0],.47,p[1],b.depth-.32,.08,b.width-.32,0x675b41,b.angle);
  if(planting)for(let i=0;i<19;i++){
   const u=(((i*7)%13)/12-.5)*(b.depth-.7),v=(i/18-.5)*(b.width-.6),x=p[0]+u*Math.cos(b.angle)-v*Math.sin(b.angle),z=p[1]+u*Math.sin(b.angle)+v*Math.cos(b.angle),height=.18+(i%4)*.05;
   cylinder(x,.52+height/2,z,.18,height,i%3?0x7d906c:0xa6a578,'plant');
   // Two crossed leaf clusters, entirely inside the planted bed's reserve.
   for(const angle of[0,Math.PI/2])box(x,.58,z,.36,.12,.22,i%3?0x748567:0xa4a473,b.angle+angle,'plant');
  }
 }

 for(const[name,rows]of batches){
  const positions=[],colours=[];for(let i=0;i<rows.length;i+=6){positions.push(rows[i],rows[i+1],rows[i+2]);colours.push(rows[i+3],rows[i+4],rows[i+5]);}
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,materials[name]);mesh.name={stone:'Garden masonry · supported paving, real arches, columns and seats',roof:'Garden slate · shaded arcade and six open loggia roofs',bronze:'Garden bronze · fine supported roof seams',plant:'Garden planting · contained low native-colour beds'}[name];group.add(mesh);
 }
 let disposed=false;return{group,colliders:GARDEN_COLLIDERS,canStand:gardenCanStand,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const resource of owned)resource.dispose();owned.clear();group.clear();}};
}

// Dress existing trees only. The root installer gathers actual upper-city
// tree positions and chooses radii with the combined route/roof clearance.
// No natural-tree builder, placement mutation, light or collider is introduced.
export function buildGardenTreeBeds(T,positions){
 const beds=gardenTreeBedPlan(positions),group=new T.Group(),owned=new Set(),own=x=>(owned.add(x),x),surfaces=[],flowers=[];
 group.name='Existing trees · organic flower and groundcover beds';group.userData.gardenTreeBeds=true;group.userData.beds=beds;
 const materials=[own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})),own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}))];
 function face(points,colour,buffer=surfaces){
  const c=new T.Color(colour);for(let i=1;i<points.length-1;i++)for(const p of[points[0],points[i],points[i+1]])buffer.push(...p,c.r,c.g,c.b);
 }
 for(const bed of beds){
  const {x,z,floorY:y,trunkGap,outline,phase,radius}=bed;
  // The trunk remains in an honest clear opening, not buried by a soil disk.
  // All organic edging and flowers stay within the caller's clearance circle.
  for(let i=0;i<outline.length;i++){
   const a=outline[i],b=outline[(i+1)%outline.length],ta=Math.atan2(a[1]-z,a[0]-x),tb=Math.atan2(b[1]-z,b[0]-x),ai=[x+trunkGap*Math.cos(ta),z+trunkGap*Math.sin(ta)],bi=[x+trunkGap*Math.cos(tb),z+trunkGap*Math.sin(tb)],inner=(p,t)=>[x+(p[0]-x)*t,z+(p[1]-z)*t],aLip=inner(a,1-.14/radius),bLip=inner(b,1-.14/radius);
   face([[ai[0],y+.009,ai[1]],[bi[0],y+.009,bi[1]],[bLip[0],y+.009,bLip[1]],[aLip[0],y+.009,aLip[1]]],i%3?0x788362:0x697653);
   face([[a[0],y+.02,a[1]],[b[0],y+.02,b[1]],[b[0],y+bed.edgeHeight,b[1]],[a[0],y+bed.edgeHeight,a[1]]],0xc8bda3);
   face([[a[0],y+bed.edgeHeight,a[1]],[b[0],y+bed.edgeHeight,b[1]],[bLip[0],y+bed.edgeHeight,bLip[1]],[aLip[0],y+bed.edgeHeight,aLip[1]]],0xe0d3b8);
   face([[aLip[0],y+.009,aLip[1]],[bLip[0],y+.009,bLip[1]],[bLip[0],y+bed.edgeHeight,bLip[1]],[aLip[0],y+bed.edgeHeight,aLip[1]]],0xb5aa90);
  }
  const clumps=Math.max(12,Math.round(radius*9)),palette=[0x9c83b8,0xb2a0ca,0xe4c46a,0xeee6ce];
  for(let i=0;i<clumps;i++){
   const a=phase+i*2.399963229728653,r=trunkGap+.27+(radius*.79-trunkGap-.27)*Math.sqrt((i+.5)/clumps),cx=x+r*Math.cos(a),cz=z+r*Math.sin(a),colour=palette[Math.floor(i/3)%palette.length];
   // Crossed tapered leaves give each low groundcover clump volume from
   // ordinary walking eye level, without an external sprite/texture asset.
   for(let j=0;j<4;j++){
    const angle=a+j*Math.PI/2,u=[Math.cos(angle),Math.sin(angle)],v=[-u[1],u[0]],spread=.16+.025*(i%3);
    face([[cx-v[0]*.07,y+.025,cz-v[1]*.07],[cx+u[0]*spread,y+.16,cz+u[1]*spread],[cx+v[0]*.07,y+.025,cz+v[1]*.07]],j%2?0x6d8257:0x4e7154,flowers);
   }
   for(let j=0;j<3;j++){
    const angle=a+j*Math.PI*2/3,px=cx+.10*Math.cos(angle),pz=cz+.10*Math.sin(angle),height=.27+.055*((i+j)%4),top=y+height;
    // Two thin crossed stem ribbons and five real petal fans per blossom.
    face([[px-.012,y+.02,pz],[px+.012,y+.02,pz],[px+.009,top,pz],[px-.009,top,pz]],0x688052,flowers);
    face([[px,y+.02,pz-.012],[px,y+.02,pz+.012],[px,top,pz+.009],[px,top,pz-.009]],0x688052,flowers);
    for(let k=0;k<5;k++){
     const p=k*Math.PI*2/5+angle,U=[Math.cos(p),Math.sin(p)],V=[-U[1],U[0]],size=.095+.015*(j%2);
     face([[px,top+.02,pz],[px+U[0]*size+V[0]*.043,top, pz+U[1]*size+V[1]*.043],[px+U[0]*size*1.35,top+.014,pz+U[1]*size*1.35],[px+U[0]*size-V[0]*.043,top,pz+U[1]*size-V[1]*.043]],colour,flowers);
    }
    face([[px-.026,top+.024,pz-.026],[px+.026,top+.024,pz-.026],[px+.026,top+.024,pz+.026],[px-.026,top+.024,pz+.026]],0xe1cb76,flowers);
   }
  }
 }
 for(const[i,buffer]of[surfaces,flowers].entries()){
  if(!buffer.length)continue;const positions=[],colours=[];for(let j=0;j<buffer.length;j+=6){positions.push(buffer[j],buffer[j+1],buffer[j+2]);colours.push(buffer[j+3],buffer[j+4],buffer[j+5]);}
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,materials[i]);mesh.name=i?'Low lavender, yellow and ivory flowers around existing trees':'Organic groundcover and low stone edging · open trunk gaps';group.add(mesh);
 }
 let disposed=false;return{group,beds,positions:Object.freeze(beds.map(b=>Object.freeze({x:b.x,z:b.z,radius:b.radius,floorY:b.floorY,trunkGap:b.trunkGap}))),dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();owned.clear();group.clear();}};
}
