import {cutDescentGround} from './escher-descent-model.js?v=wall-rails-20261121';
import {createParkGrassMaterial} from './city-lawn-palette.js?v=makers-passages-20261118';
import {FORMER_IDEAS_PARK_SITE as IDEAS_PARK_SITE} from './city-hex-layout.js?v=night-garden-20261121';
import {cutHouseWell,configuredHouseWells} from './transformation-house-model.js?v=makers-passages-20261118';
import {createOceanMaterial,updateOceanMaterial} from './ocean-surface.js?v=makers-passages-20261118';
import {FOUNDATION_HOUSES,FOUNDATION_ROUTES} from './foundation-houses-data.js?v=night-garden-20261121';
import {COAST_ROUTES,HOUSE_ORIGAMI} from './origami-house-math.js?v=night-garden-20261121';
import {CITY_ISLAND as I,islandRadius} from './island-layout.js?v=makers-passages-20261118';
import {urbanRoutes,visibleUrbanRoutes,SIXFOLD_CITY,segmentDistance,streetTreeClear} from './city-urban-plan-model.js?v=night-garden-20261121';
import {subtractGardenPaving} from './six-gate-garden-paving.js?v=night-garden-20261121';
import {buildCityUrbanPlan} from './city-urban-plan-scene.js?v=visual-polish-20261121';
export function buildCityCoast(T,{cityPaths=[],heightAt=()=>0,naturalTrees=globalThis.window?.buildNaturalCityTrees,parkGrass=null}={}){
 const group=new T.Group();group.name='Circular island and surrounding ocean';const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c})),sand=mat(0xcbbd96),wood=mat(0x846d50),pathMat=mat(0xc6bd9e),laneMat=mat(0x9b9e83);
 function box(w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);group.add(o);return o;}
 function polarBand(inner,outer,radial,angular,height,material,name,colours){
  const pos=[],indices=[],cols=[];for(let j=0;j<=angular;j++){const a=j/angular*Math.PI*2;for(let i=0;i<=radial;i++){const u=i/radial,r=inner+(outer-inner)*u;const x=Math.cos(a)*r,z=Math.sin(a)*r;pos.push(x,height(r,u),z);if(colours)cols.push(...colours(x,z,r));}}
  for(let j=0;j<angular;j++)for(let i=0;i<radial;i++){const a=j*(radial+1)+i,b=a+radial+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(colours)g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(indices);g.computeVertexNormals();const m=new T.Mesh(g,material);m.name=name;group.add(m);return m;
 }
 const grass=own(createParkGrassMaterial(T,parkGrass));
 const land=polarBand(58,I.lawnRadius,64,192,()=>.005,grass,'Continuous park-green circular lawn centred on the gallery');
 const wells=configuredHouseWells(globalThis.window?.CITY_CONFIG);if(wells.length){const original=land.geometry;land.geometry=own(cutHouseWell(T,original,wells));}
 if(globalThis.window?.CITY_CONFIG?.escherEntryCut){const g=land.geometry;land.geometry=own(cutDescentGround(T,g,window.CITY_CONFIG.escherEntryCut));}
 const beach=polarBand(I.lawnRadius,I.radius,5,256,(_,u)=>.005-.05*u,sand,'Unbroken beach around the entire island');
 const water=own(createOceanMaterial(T)),uniforms=water.uniforms;
 const sea=polarBand(I.radius,3600,100,256,()=>-.015,water,'Ocean surrounding all 360 degrees of the island');sea.frustumCulled=false;
 const promenade=polarBand(I.promenadeRadius-3,I.promenadeRadius+3,1,256,()=>.017,pathMat,'Continuous shoreline walking loop');
 const roadBatches=new Map([[pathMat,{positions:[],indices:[]}],[laneMat,{positions:[],indices:[]}]]);
 function road(points,width,material){
  // Door grades retain their real shape even when the route is specified by
  // just polygon corners. Ordinary flat block edges stay two-point strips.
  const expanded=[];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(a[0]-b[0],a[1]-b[1]),probes=Math.max(1,Math.ceil(length/4));let raised=false;for(let j=0;j<=probes;j++){const y=heightAt(a[0]+(b[0]-a[0])*j/probes,a[1]+(b[1]-a[1])*j/probes);if(Number.isFinite(y)&&y>.03){raised=true;break;}}const n=raised?Math.ceil(length/.5):1,cuts=Array.from({length:n},(_,j)=>j/n);if(raised){for(const x of[-67,-64,56,64,67,179,183,192]){const t=(x-a[0])/(b[0]-a[0]);if(t>0&&t<1)cuts.push(t);}for(const z of[-47,-34,-20,7,25,27]){const t=(z-a[1])/(b[1]-a[1]);if(t>0&&t<1)cuts.push(t);}}for(const t of[...new Set(cuts)].sort((a,b)=>a-b))expanded.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}expanded.push(points.at(-1));points=expanded;
  const closed=Math.hypot(points[0][0]-points.at(-1)[0],points[0][1]-points.at(-1)[1])<1e-6;const {positions,indices}=roadBatches.get(material),v=[],ix=[];for(let i=0;i<points.length;i++){const a=points[i===0&&closed?points.length-2:Math.max(0,i-1)],p=points[i],b=points[i===points.length-1&&closed?1:Math.min(points.length-1,i+1)],before=new T.Vector2(p[0]-a[0],p[1]-a[1]).normalize(),after=new T.Vector2(b[0]-p[0],b[1]-p[1]).normalize();if(i===0&&!closed)before.copy(after);if(i===points.length-1&&!closed)after.copy(before);const normal=new T.Vector2(-after.y,after.x),miter=new T.Vector2(-before.y,before.x).add(normal).normalize(),distance=Math.min(width,width/2/Math.max(.5,miter.dot(normal)));v.push(p[0]+miter.x*distance,Math.max(.018,(heightAt(p[0],p[1])||0)+.003),p[1]+miter.y*distance,p[0]-miter.x*distance,Math.max(.018,(heightAt(p[0],p[1])||0)+.003),p[1]-miter.y*distance);if(i<points.length-1){const k=i*2;ix.push(k,k+2,k+1,k+1,k+2,k+3);}}const offset=positions.length/3;positions.push(...v);indices.push(...ix.map(i=>i+offset));}
 const paths=[...urbanRoutes(),...cityPaths].filter(p=>p.points.length>1&&p.points.every(([x,z])=>islandRadius(x,z)<I.radius));
 // The garden owns its continuous tiled field and curved paths. Subtract the
 // retired precinct from every old source strip rather than hiding it below
 // a decorative overlay. The shared mask preserves the actual Gallery floor;
 // matching-height stone tiles now replace its exterior doorway road grades.
 for(const p of paths)if(!SIXFOLD_CITY||!p.id?.startsWith('garden-'))road(p.points,p.width||4,p.kind==='lane'?laneMat:pathMat);
 for(const[material,{positions,indices}]of roadBatches){const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const mesh=new T.Mesh(SIXFOLD_CITY?own(subtractGardenPaving(T,geometry)):geometry,material);if(globalThis.window?.CITY_CONFIG?.escherEntryCut)mesh.geometry=own(cutDescentGround(T,mesh.geometry,window.CITY_CONFIG.escherEntryCut));mesh.name=material===laneMat?'Quiet narrow honeycomb lanes · one paving batch':'Continuous campus and coast gateways · one paving batch';group.add(mesh);}
 const urban=buildCityUrbanPlan(T,{naturalTrees,parkGrass});group.add(urban.group);
 // A loose coastal woodland frames the city; the park and future western home lots stay clear.
 const trees=[];for(let n=0;n<150;n++){const a=n*2.399963,r=390+((n*41)%105),x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x-IDEAS_PARK_SITE.x,z-IDEAS_PARK_SITE.z)<IDEAS_PARK_SITE.radius||x<0&&z>125||FOUNDATION_HOUSES.some(h=>Math.hypot(x-h.x,z-h.z)<30))continue;const clear=paths.every(p=>p.points.slice(1).every((b,i)=>{const a=p.points[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*u,z-a[1]-dz*u)>(p.width||4)/2+3;}));if(clear&&streetTreeClear(x,z)&&!urban.walls.some(w=>segmentDistance(x,z,w.a,w.b)<1.2))trees.push({x,z});}if(naturalTrees)naturalTrees(T,group,trees);
 const shore=HOUSE_ORIGAMI.shore,dx=shore.x-256.5;
 for(let i=0;i<12;i++)box(4,.09,.48,257+dx,.085,73.1+i*.5,wood);
 for(const z of[73,76,79])box(.12,.85,.12,259.05+dx,.5,z,wood);box(.12,.10,6.2,259.05+dx,.88,76,wood);
 const launch=box(.5,.06,.42,258.85+dx,.95,76,mat(0xe3d6af));launch.name='Paper boat launch rest';launch.userData={origamiHouse:'shore',dynamic:true};
 return{group,sea,land,beach,promenade,launch,urban,paths:COAST_ROUTES,pavedRoutes:visibleUrbanRoutes(paths),treePositions:trees,canStand:(x,z,feet=.13)=>urban.canStand(x,z,feet)&&!trees.some(p=>Math.hypot(x-p.x,z-p.z)<.45),uniforms,update(time,{reduced=false,fog}={}){updateOceanMaterial(water,time,{reduced,fog});},dispose(){urban.dispose();group.removeFromParent();group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])owned.add(m);if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
