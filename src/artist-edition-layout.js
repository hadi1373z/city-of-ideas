// Presentation placement only. Approved edition records and source-local
// designs remain untouched, including their original twenty-slot ordering.
export const ARTIST_EDITIONS_DISTRICT=Object.freeze({id:'artist-editions',x:398.3716857408417,z:138,radius:56,sourceCentre:{x:0,z:44},sourceScale:1.35});
export const ARTIST_EDITIONS_PATH=Object.freeze({id:'saved-artist-editions-approach',kind:'civic-spur',width:3.4,points:[[ARTIST_EDITIONS_DISTRICT.x,102.36],[ARTIST_EDITIONS_DISTRICT.x,46]]});

export function layoutArtistEditions(built,frame,{enabled=true}={}){
 if(!enabled||!built?.houses?.length)return built;
 if(!frame||!Number.isFinite(frame.scale)||frame.scale<=0)throw Error('Use the actual artist source frame.');
 const d=ARTIST_EDITIONS_DISTRICT,dx=(d.x-frame.x)/frame.scale-d.sourceCentre.x,dz=(d.z-frame.z)/frame.scale-d.sourceCentre.z;
 const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?{...p,x:p.x+dx,z:p.z+dz}:p;
 const box=b=>({...b,minX:b.minX+dx,maxX:b.maxX+dx,minZ:b.minZ+dz,maxZ:b.maxZ+dz});
 const moveMeta=data=>{if(!data||typeof data!=='object')return data;const next={...data};for(const key of['anchor','lookAt','entry','spawnInside','stand','approach'])if(next[key])next[key]=point(next[key]);return next;};
 const houses=built.houses.map(h=>({...box(h),cx:h.cx+dx,cz:h.cz+dz,entry:point(h.entry),spawnInside:point(h.spawnInside),approaches:h.approaches.map(p=>moveMeta(point(p))),study:moveMeta(h.study)})),byId=new Map(houses.map(h=>[h.editionId,h]));
 built.group.position.x+=dx;built.group.position.z+=dz;
 built.group.userData={...built.group.userData,placementAuthority:'artist-edition-layout',worldDistrict:{x:d.x,z:d.z}};
 built.group.traverse(o=>{if(o.userData.artistEditionId)o.userData=moveMeta(o.userData);});
 const colliders=built.colliders.map(box),bounds={minX:(d.x-frame.x-d.radius)/frame.scale,maxX:(d.x-frame.x+d.radius)/frame.scale,minZ:(d.z-frame.z-d.radius)/frame.scale,maxZ:(d.z-frame.z+d.radius)/frame.scale};
 const insideHouseAt=(x,z)=>{const copy=built.insideHouseAt(x-dx,z-dz);if(copy?.editionId)return byId.get(copy.editionId)||null;const original=built.insideHouseAt(x,z);return original?.editionId?null:original;};
 return{...built,houses,colliders,bounds,placement:{dx,dz,district:d},insideHouseAt,insideAt:(x,z)=>insideHouseAt(x,z)?.artistId||null,
  houseFor:(artistId,editionId)=>editionId?houses.find(h=>h.artistId===artistId&&h.editionId===editionId)||null:built.houseFor(artistId),
  entryFor:(artistId,editionId)=>editionId?point(built.entryFor(artistId,editionId)):built.entryFor(artistId),
  canStand:(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&!colliders.some(b=>x>b.minX-.22&&x<b.maxX+.22&&z>b.minZ-.22&&z<b.maxZ+.22)
 };
}
