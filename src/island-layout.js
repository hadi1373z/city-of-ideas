// The gallery is the origin of one circular world with two inhabited faces.
export const CITY_ISLAND=Object.freeze({x:0,z:0,radius:570,lawnRadius:552,walkRadius:565,promenadeRadius:536});
export const islandRadius=(x,z)=>Math.hypot(x-CITY_ISLAND.x,z-CITY_ISLAND.z);
export const onCityIsland=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&islandRadius(x,z)<=CITY_ISLAND.walkRadius;
export const coastX=z=>Math.sqrt(Math.max(0,CITY_ISLAND.radius**2-z**2));
export const SHORE={x:coastX(76)-9,z:76,y:.13,yaw:-Math.PI/2};
export const ringPoint=(angle,r=CITY_ISLAND.promenadeRadius)=>[Math.cos(angle)*r,Math.sin(angle)*r];
// The lookout keeps its source coordinates. Only this short dock approach
// crosses the beach; the journey through the city uses existing hex street edges.
const shoreAngle=Math.asin(SHORE.z/CITY_ISLAND.promenadeRadius),A=Math.sqrt(3)*46;
export const HEX_COAST_WALK=Object.freeze([[3*A,46],[4*A,92],[5*A,46],[6*A,92],[7*A,46],[7*A,-46],[CITY_ISLAND.promenadeRadius,0]]);
export const COAST_PROMENADE_WALK=Object.freeze(Array.from({length:13},(_,i)=>ringPoint(shoreAngle*i/12)));
export const ISLAND_ROUTES=[{id:'paper-boat-dock',width:6,kind:'shore-approach',points:[ringPoint(shoreAngle),[SHORE.x,SHORE.z]]}];
