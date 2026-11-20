/* One spatial plan for every public artist home. Saved designs are not rewritten. */
(function(g){'use strict';
 const garden={x:-398.3716857408417,z:138},form={x:398.3716857408417,z:-138},studio={x:159.3486742963367,z:276};
 const galleries={monet:[garden.x-18,114],'van-gogh':[garden.x+18,114],'hilma-af-klint':[garden.x-18,162],morris:[garden.x+18,162],kandinsky:[form.x-30,-162],hokusai:[form.x,-162],rodin:[form.x+30,-162],mondrian:[form.x-30,-114],lange:[form.x,-114],klee:[form.x+30,-114]};
 const fronts=Object.fromEntries(Object.entries(galleries).map(([id,[x,z]])=>[id,[x,id==='monet'||id==='van-gogh'||id==='hilma-af-klint'||id==='morris'?138:-138]]));
 Object.assign(fronts,{escher:[228,140.41569860407205],dali:[studio.x,276],cezanne:[studio.x-30,276],morisot:[studio.x+30,276],seurat:[studio.x,276]});
 const plan={version:4,galleries,fronts,escher:{x:228,z:115},dali:{x:studio.x,z:246},studios:{cezanne:{x:studio.x-30,z:246,turn:0},morisot:{x:studio.x+30,z:246,turn:0},seurat:{x:studio.x,z:310,turn:Math.PI}},bounds:{minX:-480,maxX:480,minZ:-200,maxZ:330},arrival:{x:garden.x,z:138,y:.13,yaw:0},
 courts:[{id:'garden',title:{en:'The garden court',de:'Der Gartenhof',fa:'حیاط باغ'},artists:['monet','van-gogh','hilma-af-klint','morris'],arrival:{x:garden.x,z:138,y:.13,yaw:0}},
 {id:'form',title:{en:'The form court',de:'Der Formhof',fa:'حیاط فرم'},artists:['kandinsky','hokusai','rodin','mondrian','lange','klee','escher'],arrival:{x:form.x,z:-138,y:.13,yaw:0}},
 {id:'studio',title:{en:'The studio court',de:'Der Atelierhof',fa:'حیاط آتلیه‌ها'},artists:['cezanne','morisot','seurat','dali'],arrival:{x:studio.x,z:276,y:.13,yaw:0}}],
 routes:[[[garden.x-79.67433714816835,138],[garden.x+45,138]],[[form.x-45,-138],[form.x+79.67433714816835,-138]],[[studio.x-79.67433714816835,276],[studio.x+45,276]],[[228,140.41569860407205],[239.023011444505,138],[318.6973485926734,138]]],
 plants:[[garden.x,124],[garden.x,152],[form.x-15,-151],[form.x+15,-125],[studio.x-15,262],[studio.x+15,290]],
 seats:[[garden.x,122],[garden.x,154],[form.x-15,-153],[form.x+15,-123],[studio.x-15,260],[studio.x+15,292]],
 trees:[[garden.x-48,114],[garden.x+48,162],[form.x-55,-162],[form.x+55,-114],[studio.x-55,246],[studio.x+55,310]]};
 g.ARTIST_QUARTER_PLAN=plan;
 function moveHouse(h,dx,dz){h.cx+=dx;h.cz+=dz;h.minX+=dx;h.maxX+=dx;h.minZ+=dz;h.maxZ+=dz;h.group.position.x+=dx;h.group.position.z+=dz;for(const p of[h.entry,h.spawnInside,...h.approaches]){p.x+=dx;p.z+=dz;if(p.lookAt){p.lookAt.x+=dx;p.lookAt.z+=dz;}}}
 g.layoutArtistQuarter=function(T,art){
  if(art.quarterLayout)return art;
  const moves=art.houses.map(h=>({h,x:h.cx,z:h.cz,dx:(galleries[h.artistId][0]-118)/1.35-h.cx,dz:(galleries[h.artistId][1]-108)/1.35-h.cz}));
  const owner=(x,z)=>moves.find(m=>Math.abs(x-m.x)<4.1&&Math.abs(z-m.z)<3.8);
  // Furniture legs and brushes were batched outside their house groups.
  for(const node of art.group.children){
   if(node.isInstancedMesh){const matrix=new T.Matrix4();for(let i=0;i<node.count;i++){node.getMatrixAt(i,matrix);const m=owner(matrix.elements[12],matrix.elements[14]);if(m){matrix.elements[12]+=m.dx;matrix.elements[14]+=m.dz;node.setMatrixAt(i,matrix);}}node.instanceMatrix.needsUpdate=true;node.computeBoundingBox?.();node.computeBoundingSphere?.();}
   // Remove the old display slab, disconnected threshold strips and shared lane.
   else if(node.isMesh&&node.geometry.type==='BoxGeometry'&&node.position.y<.02&&!node.userData.artAction)node.visible=false;
  }
  for(const collider of art.colliders){const m=owner((collider.minX+collider.maxX)/2,(collider.minZ+collider.maxZ)/2);if(m){collider.minX+=m.dx;collider.maxX+=m.dx;collider.minZ+=m.dz;collider.maxZ+=m.dz;}}
  for(const {h,dx,dz}of moves)moveHouse(h,dx,dz);
  Object.assign(art.bounds,{minX:Math.min(...art.houses.map(h=>h.minX))-2,maxX:Math.max(...art.houses.map(h=>h.maxX))+2,minZ:Math.min(...art.houses.map(h=>h.minZ))-2,maxZ:Math.max(...art.houses.map(h=>h.maxZ))+2});
  Object.assign(art.spawn,{x:(plan.arrival.x-118)/1.35,z:(plan.arrival.z-108)/1.35,yaw:plan.arrival.yaw});Object.assign(art.guideAnchor,{x:(plan.arrival.x-118)/1.35,z:(plan.arrival.z-108)/1.35});art.bounds.minX=Math.min(art.bounds.minX,art.spawn.x-2);
  art.quarterLayout={version:4,plan};art.group.updateMatrixWorld(true);return art;
 };
 g.layoutArtistDali=function(T,art){
  const h=art.houses.find(h=>h.artistId==='dali');if(!h||h.quarterRelocated)return;
  const dx=(plan.dali.x-118)/1.35-h.cx,dz=(plan.dali.z-108)/1.35-h.cz;
  for(const c of art.colliders)if(c.artistId==='dali'){c.minX+=dx;c.maxX+=dx;c.minZ+=dz;c.maxZ+=dz;}
  moveHouse(h,dx,dz);h.quarterRelocated=true;
  art.bounds.minX=Math.min(art.bounds.minX,h.minX-2);art.bounds.maxX=Math.max(art.bounds.maxX,h.maxX+2);art.bounds.minZ=Math.min(art.bounds.minZ,h.minZ-2);art.bounds.maxZ=Math.max(art.bounds.maxZ,h.maxZ+2);
  art.bounds.minZ=Math.min(art.bounds.minZ,...art.houses.map(h=>h.minZ-2));art.bounds.maxZ=Math.max(art.bounds.maxZ,...art.houses.map(h=>h.maxZ+2));
  art.group.updateMatrixWorld(true);
 };
})(typeof window!=='undefined'?window:globalThis);
