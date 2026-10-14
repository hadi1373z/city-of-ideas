/* The original bounded path planner, adapted to shared world coordinates.
   This owns no renderer, actor, controls, storage, or alternate scene. */
const inside=(b,x,z)=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;
const transformBounds=(b,t)=>({minX:t.x+b.minX*t.scale,maxX:t.x+b.maxX*t.scale,minZ:t.z+b.minZ*t.scale,maxZ:t.z+b.maxZ*t.scale});
const point=(p,t)=>({...p,x:t.x+p.x*t.scale,y:t.y+(p.y||0)*t.scale,z:t.z+p.z*t.scale});
export async function createDistrictNavigation(extras,{baseCanStand,baseBounds={minX:-270,maxX:260,minZ:-500,maxZ:215},sourceBaseUrl=new URL('./city-source-assets/home-tools/',import.meta.url).href,findCityPath}={}){
 if(!extras?.canStand||!extras?.mathModels||!extras?.makers)throw Error('Provide the original appended district layer.');
 const planner=findCityPath||(await import(new URL('art-city-navigation.js',sourceBaseUrl).href)).findCityPath;
 if(typeof planner!=='function')throw Error('The original city path planner is unavailable.');
 function canStand(x,z,{y=.13,cityId,floor}={}){
  if(![x,z,y].every(Number.isFinite)||!inside(extras.bounds,x,z))return false;
  // Every added collider applies even when the point is a shared outdoor path.
  if(!extras.canStand(x,z,{y,...(floor===undefined?{}:{floor})}))return false;
  const region=extras.region(x,z,{y});
  if(cityId==='mathematics'){
   const model=extras.mathModels[floor??region?.floor??extras.activeMathFloor];
   if(!model||!region||region.id!=='mathematics'||region.floor!==model.floor||Math.abs(y-extras.transforms.mathematics.y-model.height)>.25)return false;
  }else if(Math.abs(y-.13)>.6&&region?.id!=='home')return false;
  // Apply the previous city's collisions only within its original world limits.
  return !baseCanStand||!inside(baseBounds,x,z)||baseCanStand(x,z)!==false;
 }
 function worldFor(cityId,{floor=cityId==='mathematics'?extras.activeMathFloor:0}={}){
  const mathematics=cityId==='mathematics',owner=mathematics?extras.mathModels[floor]:cityId==='makers'?extras.makers:null;
  if(!owner)return null;
  const t=extras.transforms[cityId],y=t.y+(mathematics?owner.height:0)*t.scale,context={cityId,floor,y},bounds=transformBounds(owner.bounds,t);
  const colliders=(owner.colliders||[]).map(c=>transformBounds(c,t));
  const world={cityId,floor,height:y,bounds,colliders,collisionRadius:.22,canStand:(x,z)=>inside(bounds,x,z)&&canStand(x,z,context),guideAnchor:point(owner.guideAnchor,t),spawn:point(owner.floorSpawn||owner.spawn,t),anchors:(owner.anchors||[]).map(a=>({...a,...point(a,t),approach:a.approach?point(a.approach,t):undefined})),approaches:(owner.approaches||owner.houses.flatMap(h=>h.approaches)).map(a=>point({...a,y:mathematics?owner.height:0},t))};
  world.findPath=(from,to)=>planner(world,from,to);
  return world;
 }
 return{canStand,worldFor,findPath:(cityId,from,to,context)=>worldFor(cityId,context)?.findPath(from,to)||[]};
}
