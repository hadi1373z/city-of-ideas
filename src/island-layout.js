// The gallery is the origin of one circular world with two inhabited faces.
export const CITY_ISLAND=Object.freeze({x:0,z:0,radius:570,lawnRadius:552,walkRadius:565,promenadeRadius:536});
export const islandRadius=(x,z)=>Math.hypot(x-CITY_ISLAND.x,z-CITY_ISLAND.z);
export const onCityIsland=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&islandRadius(x,z)<=CITY_ISLAND.walkRadius;
export const coastX=z=>Math.sqrt(Math.max(0,CITY_ISLAND.radius**2-z**2));
export const SHORE={x:coastX(76)-9,z:76,y:.13,yaw:-Math.PI/2};
export const ringPoint=(angle,r=CITY_ISLAND.promenadeRadius)=>[Math.cos(angle)*r,Math.sin(angle)*r];
export const ISLAND_ROUTES=[
 // The real paper-boat launch retains its source approach. Six deliberate
 // honeycomb gates replace the former unrelated north/west/south spokes.
 {id:'east',width:6,points:[[256.5,76],[350,76],ringPoint(Math.asin(76/CITY_ISLAND.promenadeRadius)),[SHORE.x,76]]}
];
