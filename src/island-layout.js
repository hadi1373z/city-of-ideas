// The gallery is the origin of one circular island. The graveyard remains a separate world.
export const CITY_ISLAND=Object.freeze({x:0,z:0,radius:570,lawnRadius:552,walkRadius:565,promenadeRadius:536});
export const islandRadius=(x,z)=>Math.hypot(x-CITY_ISLAND.x,z-CITY_ISLAND.z);
export const onCityIsland=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&islandRadius(x,z)<=CITY_ISLAND.walkRadius;
export const coastX=z=>Math.sqrt(Math.max(0,CITY_ISLAND.radius**2-z**2));
export const SHORE={x:coastX(76)-9,z:76,y:.13,yaw:-Math.PI/2};
export const ringPoint=(angle,r=CITY_ISLAND.promenadeRadius)=>[Math.cos(angle)*r,Math.sin(angle)*r];
export const ISLAND_ROUTES=[
 {id:'east',width:6,points:[[256.5,76],[350,76],ringPoint(Math.asin(76/CITY_ISLAND.promenadeRadius)),[SHORE.x,76]]},
 {id:'north',width:5,points:[[0,-486],[0,-536]]},
 {id:'west',width:5,points:[[-138,-32],[-170,-32],[-170,80],[-350,80],[-Math.sqrt(536**2-80**2),80]]},
 {id:'south',width:5,points:[[182,210],[182,310],[182,Math.sqrt(536**2-182**2)]]}
];
