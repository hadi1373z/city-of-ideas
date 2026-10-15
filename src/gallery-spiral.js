// Shared geometry and navigation for the four gallery levels, at the snake head.
(function(g){'use strict';
 g.createGallerySpiral=function(T){
  const radius=43,width=6,spacing=8,base=.395,max=Math.PI*6,gap=2.1,clamp=T.MathUtils.clamp;
  const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
  const pointAt=(theta,r=radius)=>({x:Math.cos(theta)*r,z:Math.sin(theta)*r,y:base+theta/(Math.PI*2)*spacing});
  const headingAt=(theta,direction=1)=>Math.atan2(Math.sin(theta)*direction,-Math.cos(theta)*direction);
  const nearLanding=theta=>Math.abs(theta-Math.round(theta/(Math.PI*2))*Math.PI*2)<.12;
  function resolve(x,z,theta,previous){const next=clamp(theta+wrap(Math.atan2(z,x)-Math.atan2(previous.z,previous.x)),0,max),r=clamp(Math.hypot(x,z),radius-width/2+.28,radius+width/2-.28);return{...pointAt(next,r),theta:next};}
  function holeAt(x,z,floor){const r=Math.hypot(x,z),a=wrap(Math.atan2(z,x));return floor>0&&r>39.3&&r<46.7&&a> -gap&&a<0;}
  function build(parent){
   const owned=[],mats=[],mat=(c,extra={})=>{const m=new T.MeshLambertMaterial({color:c,...extra});mats.push(m);return m;},stone=mat(0xc8b98e),bronze=mat(0x786946),gold=mat(0xdfc27e),count=1080,positions=[],indices=[];
   const add=(x,y,z)=>positions.push(x,y,z);
   for(let i=0;i<=count;i++){const theta=max*i/count,a=pointAt(theta,radius-width/2),b=pointAt(theta,radius+width/2);add(a.x,a.y,a.z);add(b.x,b.y,b.z);add(a.x,a.y-.18,a.z);add(b.x,b.y-.18,b.z);if(i<count){const k=i*4;indices.push(k,k+4,k+1,k+1,k+4,k+5,k+2,k+3,k+6,k+3,k+7,k+6,k,k+2,k+4,k+2,k+6,k+4,k+1,k+5,k+3,k+3,k+5,k+7);}}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();owned.push(geometry);const ramp=new T.Mesh(geometry,stone);ramp.name='Continuous gallery spiral · snake head to fourth level';parent.add(ramp);
   const tube=(points,r,material,name)=>{const geo=new T.TubeGeometry(new T.CatmullRomCurve3(points),points.length-1,r,6,false);owned.push(geo);const mesh=new T.Mesh(geo,material);mesh.name=name;parent.add(mesh);return mesh;};
   for(let turn=0;turn<3;turn++)for(const r of [radius-width/2,radius+width/2])for(const h of [.55,1.08])tube(Array.from({length:361},(_,i)=>{const theta=turn*Math.PI*2+.07+i*(Math.PI*2-.14)/360,p=pointAt(theta,r);return new T.Vector3(p.x,p.y+h,p.z);}),h>1?.045:.025,bronze,'Spiral handrail with open floor landing');
   const postGeo=new T.CylinderGeometry(.028,.028,1.08,6);owned.push(postGeo);const poses=[];for(let i=0;i<=181;i++){const theta=max*i/181;if(nearLanding(theta))continue;for(const r of [radius-width/2,radius+width/2])poses.push(pointAt(theta,r));}const posts=new T.InstancedMesh(postGeo,bronze,poses.length),dummy=new T.Object3D();poses.forEach((p,i)=>{dummy.position.set(p.x,p.y+.54,p.z);dummy.updateMatrix();posts.setMatrixAt(i,dummy.matrix);});posts.instanceMatrix.needsUpdate=true;parent.add(posts);
   // Thin contrasting centre line helps a visitor read the rising path.
   tube(Array.from({length:count+1},(_,i)=>{const p=pointAt(max*i/count);return new T.Vector3(p.x,p.y+.015,p.z);}),.025,gold,'Gallery ascent wayfinding line');
   // Upper floor openings are guarded on their inner, outer and trailing edges.
   for(let floor=1;floor<4;floor++)for(const r of [39.3,46.7]){const points=Array.from({length:81},(_,i)=>new T.Vector3(Math.cos(-gap+i*(gap-.07)/80)*r,floor*spacing+base+1.08,Math.sin(-gap+i*(gap-.07)/80)*r));tube(points,.035,bronze,'Guard around gallery spiral opening');}
   for(let floor=1;floor<4;floor++)tube([39.3,46.7].map(r=>new T.Vector3(Math.cos(-gap)*r,floor*spacing+base+1.08,Math.sin(-gap)*r)),.035,bronze,'Trailing edge guard at gallery floor opening');
   return{ramp,dispose(){for(const geo of owned)geo.dispose();for(const m of mats)m.dispose();posts.dispose?.();}};
  }
  return{radius,width,spacing,base,max,gap,pointAt,headingAt,nearLanding,resolve,holeAt,build,entrance:{x:58,z:0},head:{x:43,z:0},levels:[0,1,2,3].map(f=>({...pointAt(f*Math.PI*2),floor:f}))};
 };
})(window);
