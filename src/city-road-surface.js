/* Continuous paving strips shared by the original city and appended districts. */
(function(g){'use strict';
 g.createCityRoad=function(T,points,width,material,parent){
  const ps=points.filter((p,i)=>!i||Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1])>.001),v=[],ix=[];
  if(ps.length<2)return null;
  for(let i=0;i<ps.length;i++){
   const a=ps[Math.max(0,i-1)],p=ps[i],b=ps[Math.min(ps.length-1,i+1)],before=new T.Vector2(p[0]-a[0],p[1]-a[1]).normalize(),after=new T.Vector2(b[0]-p[0],b[1]-p[1]).normalize();
   if(i===0)before.copy(after);if(i===ps.length-1)after.copy(before);
   const normal=new T.Vector2(-after.y,after.x),miter=new T.Vector2(-before.y,before.x).add(normal).normalize(),length=Math.min(width,width/2/Math.max(.5,miter.dot(normal))),dx=miter.x*length,dz=miter.y*length;
   v.push(p[0]+dx,.13,p[1]+dz,p[0]-dx,.13,p[1]-dz,p[0]+dx,.01,p[1]+dz,p[0]-dx,.01,p[1]-dz);
   if(i<ps.length-1){const k=i*4;ix.push(k,k+4,k+1,k+1,k+4,k+5,k+2,k+3,k+6,k+3,k+7,k+6,k,k+2,k+4,k+2,k+6,k+4,k+1,k+5,k+3,k+3,k+5,k+7);}
  }
  const end=(ps.length-1)*4;ix.push(0,1,2,1,3,2,end,end+2,end+1,end+1,end+2,end+3);
  const indexed=new T.BufferGeometry();indexed.setAttribute('position',new T.Float32BufferAttribute(v,3));indexed.setIndex(ix);const geo=indexed.toNonIndexed();indexed.dispose();geo.computeVertexNormals();
  const mesh=new T.Mesh(geo,material);mesh.name='Continuous connected city paving';mesh.userData={groundRoute:true,width,points:ps.map(p=>[...p])};parent.add(mesh);return mesh;
 };
})(typeof window!=='undefined'?window:globalThis);
