import {MATH_FLOORS} from './city-source-assets/home-tools/math-city-data.js';
import {MATH_FACULTY as F,facultyLibraryBays,facultyColliders,facultyCanStand,nativeMathShellNodes} from './math-faculty-model.js';
export function buildMathFaculty(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Faculty of Mathematics · central rotunda and working west wing';group.userData.mathFaculty=true;
 const owned=new Set(),own=o=>(owned.add(o),o),mat=(color,more={})=>own(new T.MeshLambertMaterial({color,...more})),targets=[],batches=new Map();
 const stone=mat(0xc3b69a),pale=mat(0xd1c6ab),timber=mat(0x705b40),roofMat=mat(0x526f65,{side:T.DoubleSide}),bronze=mat(0xa78d56),shelf=mat(0x8d7451),books=[0x526c65,0xa17b58,0x63758a,0x84755f].map(c=>mat(c));
 const glass=mat(0x92b3ac,{transparent:true,opacity:.23,side:T.DoubleSide,depthWrite:false}),glow=own(new T.MeshBasicMaterial({color:0xdcc18d})),unit=own(new T.BoxGeometry(1,1,1));
 function box(w,h,d,x,y,z,m=stone,yaw=0,roll=0){if(!batches.has(m))batches.set(m,[]);batches.get(m).push({w,h,d,x,y,z,yaw,roll});}
 const add=(g,m,name)=>{const mesh=new T.Mesh(own(g),m);mesh.name=name;group.add(mesh);return mesh;};
 function band(ri,ro,yi,yo,m,name){const v=[],ix=[],n=192;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;v.push(Math.cos(a)*ri,yi,Math.sin(a)*ri,Math.cos(a)*ro,yo,Math.sin(a)*ro);}for(let i=0;i<n;i++){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();return add(g,m,name);}
 function label(text,x,y,z,yaw,width,height,data){const c=canvas();c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#354c48';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#efe2bd';ctx.font='bold 52px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,100,970);const tex=own(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;const mesh=add(new T.PlaneGeometry(width,height),own(new T.MeshBasicMaterial({map:tex,side:T.DoubleSide,toneMapped:false})),text);mesh.position.set(x,y,z);mesh.rotation.y=yaw;if(data){mesh.userData={...data,mathFaculty:true};targets.push(mesh);}return mesh;}
 // Reuse the existing r57.8 / 7.2m gallery columns. The new roof bears on their
 // lintel; no new column or floor is inserted into the helical well.
 band(F.roofInner,F.roofOuter,F.roofInnerY,F.roofOuterY,roofMat,'Annular timber roof · open central oculus');
 band(21.5,22.0,11.81,11.81,bronze,'Thin bronze oculus rim');band(60.4,61.1,7.69,7.69,bronze,'Rotunda eaves');
 for(let i=0;i<40;i++){const a=i/40*Math.PI*2,ri=22.1,ro=59.4,dy=F.roofOuterY-F.roofInnerY,len=ro-ri;box(Math.hypot(len,dy),.17,.16,Math.cos(a)*(ri+ro)/2,(F.roofInnerY+F.roofOuterY)/2-.13,Math.sin(a)*(ri+ro)/2,timber,-a,Math.atan2(dy,len));}
 // Exterior arcade behind the retained colonnade. Its western gap is real.
 const count=80,da=Math.PI*2/count;
 for(let i=0;i<count;i++){const a=(i+.5)*da;if(Math.abs(Math.atan2(Math.sin(a-Math.PI),Math.cos(a-Math.PI)))<.085)continue;const x=Math.cos(a)*60.25,z=Math.sin(a)*60.25,yaw=Math.PI/2-a,w=60.25*da+.04;box(w,.85,.38,x,.13+.425,z,stone,yaw);box(w,.22,.52,x,7.37,z,pale,yaw);box(w,5.55,.045,x,3.78,z,glass,yaw);}
 // Twenty shallow arches articulate the circular facade between the existing
 // columns. They add framing rather than a second thick ring of columns.
 for(let i=0;i<20;i++){const a=(i+.5)/20*Math.PI*2;if(Math.abs(Math.atan2(Math.sin(a-Math.PI),Math.cos(a-Math.PI)))<.18)continue;const r=59.9,w=8.1;for(let j=0;j<12;j++){const t=j/12*Math.PI,t1=(j+1)/12*Math.PI,u0=Math.cos(t)*w/2,u1=Math.cos(t1)*w/2,h0=5.05+Math.sin(t)*1.75,h1=5.05+Math.sin(t1)*1.75,u=(u0+u1)/2,h=(h0+h1)/2,x=Math.cos(a)*r-Math.sin(a)*u,z=Math.sin(a)*r+Math.cos(a)*u;box(Math.hypot(u1-u0,h1-h0)+.035,.19,.24,x,h,z,pale,-a-Math.PI/2,Math.atan2(h1-h0,u1-u0));}}
 // The eight original disciplines give this rotunda real reader/floor actions.
 // These are links into the preserved Atlas, never substitute lesson text.
 for(const b of facultyLibraryBays()){
  const a=b.angle,tangent=[-Math.sin(a),Math.cos(a)],radial=[Math.cos(a),Math.sin(a)],yaw=-a-Math.PI/2,p=(t,r,y)=>[b.x+tangent[0]*t+radial[0]*r,y,b.z+tangent[1]*t+radial[1]*r];
  for(const t of[-2.8,2.8])box(.16,3.6,.85,...p(t,0,1.93),timber,yaw);for(let row=0;row<=4;row++)box(5.6,.10,.85,...p(0,0,.23+row*.82),shelf,yaw);
  for(let row=0;row<4;row++)for(let k=0;k<17;k++){const h=.48+(k%4)*.045;box(.22,h,.36,...p((k-8)*.303,-.20,.30+row*.82+h/2),books[(row+k+b.floor)%books.length],yaw);}
  const topic=MATH_FLOORS.find(f=>f.index===b.floor)?.name||'Mathematics',front=p(0,-.49,4.02);
  label((b.floor+1)+' · '+topic,...front,yaw,6,.55,{mathAction:'atlas',mathFloor:b.floor,floorIndex:b.floor,label:'Explore '+topic+' in the original Atlas'});
  const transfer=p(0,-.50,.87);label('Visit the working floor  →',...transfer,yaw,4.8,.40,{mathAction:'floor',mathFloor:b.floor,targetFloor:b.floor,label:'Visit '+topic+' · working west wing'});
 }
 // A real, flush, five-metre covered walk turns into the source front entrance.
 const route=F.connector;for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);box(len+route.width,.08,route.width,(a[0]+b[0])/2,.09,(a[1]+b[1])/2,pale,Math.atan2(-dz,dx));}
 for(const x of[-67.7,-60.3])for(const z of[11,22])box(.24,4.1,.24,x,2.18,z,timber);box(8.2,.22,26.5,-64,4.24,13,timber);for(let z=1;z<26;z+=1.6)box(8.1,.13,.19,-64,4.43,z,timber);box(7,.22,8.2,-61,4.24,0,timber);
 box(17,.22,7.3,-72,4.24,26,timber);for(let x=-80;x<=-64;x+=1.5)box(.17,.13,7.6,x,4.43,26,timber);
 // New warm stone / timber facade follows all eight native four-metre levels.
 // Every source room remains at its exact local coordinate behind this shell.
 for(let floor=0;floor<8;floor++){const y=floor*4;for(const z of[-10.45,8.45]){box(25.4,.29,.52,-80,y+3.82,z,stone);for(const x of[-92.5,-87,-73,-67.5])box(.36,3.75,.45,x,y+1.99,z,pale);for(const x of[-89.5,-84.5,-75.5,-70.5]){box(4.42,1.92,.045,x,y+1.94,z,glass);box(4.55,.16,.55,x,y+.94,z,timber);box(.09,1.95,.13,x,y+1.95,z+.05,timber);}if(floor||z<0)box(3.5,1.94,.045,-80,y+1.94,z,glass);}
  for(const x of[-92.5,-67.5]){box(.48,.29,19.5,x,y+3.82,-1,stone);for(const z of[-8,-4,0,4]){box(.045,1.94,3.45,x,y+1.94,z,glass);box(.55,.16,3.58,x,y+.94,z,timber);}for(const z of[-10.4,-6,-2,2,6,8.4])box(.45,3.75,.34,x,y+1.99,z,pale);}}
 for(const x of[-83.8,-76.2])for(const z of[14,20])box(.34,3.8,.34,x,2.03,z,stone);box(8.6,.24,12.6,-80,4.06,15.2,timber);for(let z=9.5;z<=21;z+=1.3)box(8.8,.15,.20,-80,4.24,z,timber);
 label('FACULTY OF MATHEMATICS',-80,3.40,9.65,0,7.2,.55);box(6.9,.08,.10,-80,3.03,9.67,glow);
 const rv=[[-93.4,32.2,-11.3],[-66.6,32.2,-11.3],[-66.6,32.2,9.3],[-93.4,32.2,9.3],[-80,35,-11.3],[-80,35,9.3]],faces=[[0,1,4],[1,2,5],[1,5,4],[2,3,5],[3,0,4],[3,4,5]],roofGeometry=new T.BufferGeometry();roofGeometry.setAttribute('position',new T.Float32BufferAttribute(faces.flatMap(f=>f.flatMap(i=>rv[i])),3));roofGeometry.computeVertexNormals();add(roofGeometry,roofMat,'West wing warm metal pitched roof');box(26.8,.25,20.6,-80,32.12,-1,stone);
 const dummy=new T.Object3D();for(const[m,items]of batches){const mesh=new T.InstancedMesh(unit,m,items.length);mesh.name='Batched faculty stone / timber / shelves';items.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(0,b.yaw,b.roll);dummy.scale.set(b.w,b.h,b.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere?.();group.add(mesh);}
 const colliders=facultyColliders();let disposed=false;
 return{group,targets,colliders,contract:F,sourceWing:F.wing,nativeShellNodes:nativeMathShellNodes,canStand:(x,z,y=.13)=>facultyCanStand(x,z,y,{colliders}),dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
