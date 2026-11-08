// Ordinary local +Y coordinates, before the lower face's proper half-turn frame.
export const MATH_FACULTY=Object.freeze({floor:.13,wellRadius:21.5,outerRadius:60.8,roofInner:21.5,roofOuter:61,roofInnerY:11.8,roofOuterY:7.65,
 logicalCentre:{x:-2160,z:-65},wing:{x:-80,z:0,logicalX:-2240,logicalZ:-65,minX:-93,maxX:-67,minZ:-11,maxZ:10,floors:8,floorHeight:4,entry:{x:-80,z:9.6,y:.13},spawn:{x:-80,z:32.8,y:.13},lift:{x:-70.4,z:5}},
 entrance:{x:-80,z:8.72,clearHalfWidth:1.5,leafX:1.99,leafCentreZ:9.48,leafDepth:1.72,leafHeight:2.56},
 connector:{width:5.6,points:[[-58,0],[-64,0],[-64,26],[-80,26],[-80,9.6]]}
});
export function facultyLibraryBays(){return Array.from({length:8},(_,floor)=>{const angle=(floor+.5)/8*Math.PI*2;return{floor,angle,x:Math.cos(angle)*59.35,z:Math.sin(angle)*59.35,y:.13,width:5.6,depth:1.1,height:3.6};});}
export function facultyColliders(){
 const out=[];for(const sign of[-1,1])out.push({kind:'open entrance door',shape:'obb',x:-80+sign*1.99,z:9.48,angle:0,halfTangent:.86,halfRadius:.065,minY:.13,maxY:2.69});for(const b of facultyLibraryBays())out.push({kind:'library bay',shape:'obb',x:b.x,z:b.z,angle:b.angle,halfTangent:b.width/2,halfRadius:b.depth/2,minY:.13,maxY:3.73});
 // The ring retains a genuinely open western doorway, matching the gallery.
 out.push({kind:'rotunda wall',shape:'ring',inner:59.8,outer:60.7,gapZ:4.5,minY:.13,maxY:7.5});
 for(const x of[-83.8,-76.2])for(const z of[14,20])out.push({kind:'wing portico post',shape:'circle',x,z,radius:.36,minY:.13,maxY:3.9});
 for(const x of[-67.7,-60.3])for(const z of[11,22])out.push({kind:'connector post',shape:'circle',x,z,radius:.32,minY:.13,maxY:4.2});
 return out;
}
export function facultyCanStand(x,z,feetY=.13,{radius=.28,colliders=facultyColliders()}={}){
 if(![x,z,feetY,radius].every(Number.isFinite))return false;
 return !colliders.some(b=>{if(feetY+1.8<b.minY||feetY>b.maxY+.1)return false;
  if(b.shape==='ring'){const r=Math.hypot(x,z);return r>b.inner-radius&&r<b.outer+radius&&!(x<0&&Math.abs(z)<b.gapZ-radius);}
  if(b.shape==='circle')return Math.hypot(x-b.x,z-b.z)<b.radius+radius;
  const dx=x-b.x,dz=z-b.z,t=-Math.sin(b.angle)*dx+Math.cos(b.angle)*dz,r=Math.cos(b.angle)*dx+Math.sin(b.angle)*dz;return Math.abs(t)<b.halfTangent+radius&&Math.abs(r)<b.halfRadius+radius;
 });
}
// Exact existing source flags only. Never hide a floor, partition, shelf, action
// mesh, mixed instance batch or private object when replacing the visual shell.
export function nativeMathShellNodes(models){const nodes=[];for(const model of models??[])model.group?.traverse(o=>{if(o.isMesh&&(o.userData?.window===true||o.userData?.roof===true)&&!o.userData.mathAction&&!o.userData.cityAction)nodes.push(o);});return nodes;}
