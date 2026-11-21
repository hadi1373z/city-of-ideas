// Original limestone architecture for the six garden houses. The source
// hexagon, inhabited floor elevations and ground doorway remain authoritative.
export const SIXFOLD_FACADE=Object.freeze({sourceX:125,radius:23,levels:Object.freeze([0,8,16]),wallDepth:.7,windowWidth:4.4,sill:1.15,spring:4.25,archRise:2.2,corniceTop:23.98});
export function sixfoldFacadeOpenings(level,facet){
 const len=23,door=level===0&&facet===1;
 return[0,1,2].map(i=>{const centre=len*(i+.5)/3,isDoor=door&&i===1,width=isDoor?5.6:4.4;
  return{centre,width,sill:isDoor?0:1.15,spring:isDoor?4.6:4.25,rise:isDoor?1.35:2.2,door:isDoor};});
}
export function facadeAperture(o,{inset=0,segments=24}={}){
 const half=o.width/2-inset,lo=o.sill+inset,spring=o.spring,rise=o.rise-inset;
 return[[o.centre-half,lo],[o.centre+half,lo],...Array.from({length:segments+1},(_,i)=>{const a=i*Math.PI/segments;return[o.centre+half*Math.cos(a),spring+rise*Math.sin(a)];})];
}
export function buildSixfoldHouseFacade(T){
 const group=new T.Group();group.name='Garden house · carved limestone arcades and tall recessed windows';
 const owned=new Set(),own=r=>(owned.add(r),r),data=[[],[],[]],colours=[[],[],[]],uvs=[[],[],[]],meshes=[];
 // Neutral original mineral grain multiplies the warm, individually shaded
 // stone faces. It carries no photograph, borrowed artwork or external asset.
 const n=128,pixels=new Uint8Array(n*n*4);let seed=7319;for(let i=0;i<n*n;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const c=238+(seed>>>28);pixels.set([c,c,c,255],i*4);}
 const grain=own(new T.DataTexture(pixels,n,n,T.RGBAFormat));grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.colorSpace=T.SRGBColorSpace;grain.magFilter=T.LinearFilter;grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.anisotropy=4;grain.needsUpdate=true;
 const mats=[own(new T.MeshLambertMaterial({vertexColors:true,map:grain})),own(new T.MeshPhongMaterial({vertexColors:true,shininess:36,specular:0xb8aa83})),own(new T.MeshPhongMaterial({color:0xb3cfcc,transparent:true,opacity:.22,shininess:55,side:T.DoubleSide,depthWrite:false}))];
 const unit=new T.BoxGeometry(1,1,1),stamp=new T.Object3D(),hex=Array.from({length:6},(_,i)=>[23*Math.cos(i*Math.PI/3),23*Math.sin(i*Math.PI/3)]);let frame;
 const point=(u,y,d)=>[125+frame.a[0]+frame.tx*u+frame.nx*d,y,frame.a[1]+frame.tz*u+frame.nz*d];
 function vertex(batch,p,c,u,y){data[batch].push(...p);colours[batch].push(c.r,c.g,c.b);uvs[batch].push(u/3.2,y/3.2);}
 function triangle(batch,a,b,c,colour=0xe4d5b6){const rgb=new T.Color(colour);for(const p of[a,b,c])vertex(batch,point(...p),rgb,p[0],p[1]);}
 function polygon(points,depth,colour,batch=0){const vectors=points.map(p=>new T.Vector2(...p));for(const[a,b,c]of T.ShapeUtils.triangulateShape(vectors,[]))triangle(batch,[...points[a],depth],[...points[c],depth],[...points[b],depth],colour);}
 function solid(poly,lo,hi,colour,batch=0){
  const shape=new T.Shape();poly.forEach(([u,y],i)=>shape[i?'lineTo':'moveTo'](u,y));shape.closePath();append(new T.ExtrudeGeometry(shape,{depth:hi-lo,bevelEnabled:false,curveSegments:1}),lo,colour,batch);
 }
 function append(g,offset,colour,batch=0){const q=g.index?g.toNonIndexed():g,p=q.attributes.position,norm=q.attributes.normal,c=new T.Color(colour);
  // (tangent, up, outward) reverses orientation, hence the paired vertex swap.
  for(let i=0;i<p.count;i+=3)for(const j of[i,i+2,i+1]){const shade=norm.getZ(j)>.8?1:norm.getZ(j)<-.8?.98:.91,rgb=c.clone().multiplyScalar(shade);vertex(batch,point(p.getX(j),p.getY(j),p.getZ(j)+offset),rgb,p.getX(j),p.getY(j));}
  q.dispose();if(q!==g)g.dispose();
 }
 function box(u,y,d,w,h,depth,colour=0xe6d7ba,batch=0){
  stamp.position.set(u,y,d);stamp.scale.set(w,h,depth);stamp.rotation.set(0,0,0);stamp.updateMatrix();const g=unit.clone().applyMatrix4(stamp.matrix);append(g,0,colour,batch);
 }
 function archRing(o,lo,hi,thickness,colour,batch=0,segments=20){for(let j=0;j<segments;j++){const gap=.006,a=j*Math.PI/segments+gap,b=(j+1)*Math.PI/segments-gap,at=(t,r)=>[o.centre+(o.width/2+r)*Math.cos(t),o.spring+(o.rise+r)*Math.sin(t)];solid([at(a,0),at(b,0),at(b,thickness),at(a,thickness)],lo,hi,j%3===0?new T.Color(colour).multiplyScalar(.97).getHex():colour,batch);}}
 const layout=[];
 for(let facet=0;facet<6;facet++){
  const a=hex[facet],b=hex[(facet+1)%6],tx=(b[0]-a[0])/23,tz=(b[1]-a[1])/23;frame={a,tx,tz,nx:tz,nz:-tx};
  for(const level of SIXFOLD_FACADE.levels){
   const openings=sixfoldFacadeOpenings(level,facet),door=openings.find(o=>o.door);let outer=[[0,level],[23,level],[23,level+8],[0,level+8]];
   if(door){const boundary=facadeAperture(door).slice(2).reverse();outer=[[0,level],[door.centre-door.width/2,level],...boundary.map(([u,y])=>[u,level+y]),[door.centre+door.width/2,level],[23,level],[23,level+8],[0,level+8]];}
   const shape=new T.Shape();outer.forEach(([u,y],i)=>shape[i?'lineTo':'moveTo'](u,y));shape.closePath();
   for(const o of openings.filter(o=>!o.door)){const hole=new T.Path();facadeAperture(o).forEach(([u,y],i)=>hole[i?'lineTo':'moveTo'](u,level+y));hole.closePath();shape.holes.push(hole);}
   append(new T.ExtrudeGeometry(shape,{depth:.7,bevelEnabled:false,curveSegments:1}),-.35,facet%2?0xe4d3b1:0xe9d9b9);
   layout.push({facet,level,a:[...a],b:[...b],openings});
   for(const o of openings){
    const abs={...o,sill:o.sill+level,spring:o.spring+level};
    archRing(abs,.335,.53,.31,0xeedfc3);
    for(const sign of[-1,1]){const u=o.centre+sign*(o.width/2+.155);box(u,level+(o.sill+o.spring)/2,.425,.31,o.spring-o.sill,.21,0xe9d8b7);
     box(u,level+o.spring-.04,.45,.47,.16,.26,0xf0e2c7);}
    if(o.door)continue;
    box(o.centre,level+o.sill-.10,.38,o.width+.88,.20,.38,0xe8d7b9);
    const inner={...abs,width:abs.width-.12,sill:abs.sill+.05,rise:abs.rise-.06};polygon(facadeAperture(inner),-.235,0xffffff,2);
    // Thin recessed bronze frames follow the genuine arch; no opaque panel is
    // painted over the original small windows. The old wall is omitted here.
    archRing(inner,-.29,-.20,.055,0x8f815b,1,16);
    for(const sign of[-1,1])box(o.centre+sign*(o.width/2-.06),level+(o.sill+o.spring)/2,-.24,.07,o.spring-o.sill,.09,0x94815b,1);
    box(o.centre,level+(o.sill+o.spring)/2,-.24,.075,o.spring-o.sill,.09,0x94815b,1);
    box(o.centre,level+3.35,-.24,o.width-.10,.06,.09,0x94815b,1);
   }
   // Broad pale string courses and stepped cornices replace the dark modern
   // floor stripes. Every ground base stops at the unchanged doorway.
   const spans=door?[[0,door.centre-2.8],[door.centre+2.8,23]]:[[0,23]];
   for(const[u,v]of spans){box((u+v)/2,level+.18,.39,v-u,.36,.20,0xdac8a5);box((u+v)/2,level+.41,.40,v-u,.07,.22,0xf0e2c6);}
   for(const[y,h,d,col]of[[7.62,.16,.20,0xd5c19c],[7.78,.16,.35,0xe8d8b8],[7.92,.12,.46,0xf2e5cb]])box(11.5,level+y,.38,23.35,h,d,col);
   // Restrained cut-stone joints and corner pilasters give the wall depth at
   // ordinary eye level, with no extra roof or footprint outside the25m cap.
   for(const u of[.48,22.52]){box(u,level+4,.39,.68,7.15,.19,0xeadbbc);for(let k=1;k<10;k++)box(u,level+.5+k*.7,.495,.69,.018,.013,0xbba987);box(u,level+7.43,.44,.94,.22,.30,0xf0e2c6);}
  }
 }
 unit.dispose();
 for(let i=0;i<data.length;i++){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(data[i],3));g.setAttribute('color',new T.Float32BufferAttribute(colours[i],3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs[i],2));g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();const m=new T.Mesh(g,mats[i]);m.name=['Carved limestone walls, true arched reveals and continuous cornices','Recessed bronze arch window frames','Tall arched glass panes'][i];m.receiveShadow=true;group.add(m);meshes.push(m);}
 let disposed=false;return{group,layout,meshes,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
