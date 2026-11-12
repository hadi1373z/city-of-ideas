import {createOceanMaterial,updateOceanMaterial} from './ocean-surface.js';
import {FOUNDATION_HOUSES,FOUNDATION_ROUTES} from './foundation-houses-data.js';
import {COAST_ROUTES,HOUSE_ORIGAMI} from './origami-house-math.js';
import {CITY_ISLAND as I,islandRadius} from './island-layout.js';
export function buildCityCoast(T,{cityPaths=[],heightAt=()=>0,naturalTrees=globalThis.window?.buildNaturalCityTrees}={}){
 const group=new T.Group();group.name='Circular island and surrounding ocean';const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c})),sand=mat(0xcbbd96),wood=mat(0x846d50),pathMat=mat(0xc6bd9e);
 function box(w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);group.add(o);return o;}
 function polarBand(inner,outer,radial,angular,height,material,name,colours){
  const pos=[],indices=[],cols=[];for(let j=0;j<=angular;j++){const a=j/angular*Math.PI*2;for(let i=0;i<=radial;i++){const u=i/radial,r=inner+(outer-inner)*u;const x=Math.cos(a)*r,z=Math.sin(a)*r;pos.push(x,height(r,u),z);if(colours)cols.push(...colours(x,z,r));}}
  for(let j=0;j<angular;j++)for(let i=0;i<radial;i++){const a=j*(radial+1)+i,b=a+radial+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(colours)g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(indices);g.computeVertexNormals();const m=new T.Mesh(g,material);m.name=name;group.add(m);return m;
 }
 const grass=own(new T.MeshLambertMaterial({vertexColors:true})),base=new T.Color(0x84916d);
 const land=polarBand(58,I.lawnRadius,64,192,()=>.005,grass,'Continuous circular lawn centred on the gallery',(x,z)=>{const n=.035*Math.sin(x*.018+Math.sin(z*.011))+.018*Math.cos(z*.043-x*.021),c=base.clone().offsetHSL(0,0,n);return[c.r,c.g,c.b];});
 const beach=polarBand(I.lawnRadius,I.radius,5,256,(_,u)=>.005-.05*u,sand,'Unbroken beach around the entire island');
 const water=own(createOceanMaterial(T)),uniforms=water.uniforms;
 const sea=polarBand(I.radius,3600,100,256,()=>-.015,water,'Ocean surrounding all 360 degrees of the island');sea.frustumCulled=false;
 const promenade=polarBand(I.promenadeRadius-3,I.promenadeRadius+3,1,256,()=>.017,pathMat,'Continuous shoreline walking loop');
 function road(points,width){const v=[],ix=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],p=points[i],b=points[Math.min(points.length-1,i+1)],before=new T.Vector2(p[0]-a[0],p[1]-a[1]).normalize(),after=new T.Vector2(b[0]-p[0],b[1]-p[1]).normalize();if(i===0)before.copy(after);if(i===points.length-1)after.copy(before);const normal=new T.Vector2(-after.y,after.x),miter=new T.Vector2(-before.y,before.x).add(normal).normalize(),distance=Math.min(width,width/2/Math.max(.5,miter.dot(normal)));v.push(p[0]+miter.x*distance,Math.max(.018,(heightAt(p[0],p[1])||0)+.003),p[1]+miter.y*distance,p[0]-miter.x*distance,Math.max(.018,(heightAt(p[0],p[1])||0)+.003),p[1]-miter.y*distance);if(i<points.length-1){const k=i*2;ix.push(k,k+2,k+1,k+1,k+2,k+3);}}const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();const o=new T.Mesh(g,pathMat);o.name='Continuous unpatterned island path';group.add(o);return o;}
 const paths=[...COAST_ROUTES.map(points=>({points,width:4})),...cityPaths,...FOUNDATION_ROUTES].filter(p=>p.points.length>1&&p.points.every(([x,z])=>islandRadius(x,z)<I.radius));for(const p of paths)road(p.points,p.width||4);
 // A loose coastal woodland frames the city; the park and future western home lots stay clear.
 const trees=[];for(let n=0;n<150;n++){const a=n*2.399963,r=390+((n*41)%105),x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x,z+330)<179||x<0&&z>125||FOUNDATION_HOUSES.some(h=>Math.hypot(x-h.x,z-h.z)<30))continue;const clear=paths.every(p=>p.points.slice(1).every((b,i)=>{const a=p.points[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*u,z-a[1]-dz*u)>(p.width||4)/2+3;}));if(clear)trees.push({x,z});}if(naturalTrees)naturalTrees(T,group,trees);
 const shore=HOUSE_ORIGAMI.shore,dx=shore.x-256.5;
 for(let i=0;i<12;i++)box(4,.09,.48,257+dx,.085,73.1+i*.5,wood);
 for(const z of[73,76,79])box(.12,.85,.12,259.05+dx,.5,z,wood);box(.12,.10,6.2,259.05+dx,.88,76,wood);
 const launch=box(.5,.06,.42,258.85+dx,.95,76,mat(0xe3d6af));launch.name='Paper boat launch rest';launch.userData={origamiHouse:'shore',dynamic:true};
 return{group,sea,land,beach,promenade,launch,paths:COAST_ROUTES,treePositions:trees,canStand:(x,z)=>!trees.some(p=>Math.hypot(x-p.x,z-p.z)<.45),uniforms,update(time,{reduced=false,fog}={}){updateOceanMaterial(water,time,{reduced,fog});},dispose(){group.removeFromParent();group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])owned.add(m);if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
