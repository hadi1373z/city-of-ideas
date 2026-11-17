/* One spatial plan for every public artist home. Saved designs are not rewritten. */
(function(g){'use strict';
 const galleries={monet:[88,80],'van-gogh':[116,80],'hilma-af-klint':[88,112],morris:[116,112],kandinsky:[176,82],hokusai:[202,82],rodin:[244,104],mondrian:[176,126],lange:[202,146],klee:[244,146]};
 const fronts={monet:[88,96],'van-gogh':[116,96],'hilma-af-klint':[88,96],morris:[116,96],kandinsky:[176,104],hokusai:[202,104],rodin:[244,126],mondrian:[176,104],lange:[202,126],klee:[244,126],escher:[228,126],dali:[250,216],cezanne:[176,216],morisot:[208,216],seurat:[192,216]};
 const plan={version:3,galleries,fronts,escher:{x:228,z:115},dali:{x:250,z:198},studios:{cezanne:{x:176,z:194,turn:0},morisot:{x:208,z:194,turn:0},seurat:{x:192,z:234,turn:Math.PI}},bounds:{minX:70,maxX:284,minZ:70,maxZ:246},arrival:{x:96,z:98,y:.13,yaw:0},
  courts:[{id:'garden',title:{en:'The garden court',de:'Der Gartenhof',fa:'حیاط باغ'},artists:['monet','van-gogh','hilma-af-klint','morris'],arrival:{x:96,z:98,y:.13,yaw:0}},
   {id:'form',title:{en:'The form and perspective court',de:'Der Hof für Form und Perspektive',fa:'حیاط فرم و پرسپکتیو'},artists:['kandinsky','hokusai','rodin','mondrian','lange','klee','escher'],arrival:{x:190,z:104,y:.13,yaw:0}},
   {id:'studio',title:{en:'The studio court',de:'Der Atelierhof',fa:'حیاط آتلیه‌ها'},artists:['cezanne','morisot','seurat','dali'],arrival:{x:208,z:216,y:.13,yaw:0}}],
  routes:[[[74,110],[74,96],[96,98],[138,96],[160,96],[176,104],[204,104],[216,126],[228,126],[254,126],[280,126]],[[160,96],[160,216],[250,216],[280,216]],[[160,160],[280,160],[280,216]],[[280,126],[280,76]],[[202,126],[216,126]]],
  plants:[[102,88],[102,105],[188,96],[188,115],[238,133],[190,207],[226,210]],
  seats:[[102,90],[102,105],[188,96],[188,115],[238,132],[188,207],[226,212]],
  trees:[[102,87],[102,108],[138,106],[152,120],[152,144],[152,166],[190,92],[190,116],[238,135],[270,142],[190,188],[236,229],[176,231],[250,234]]};
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
  Object.assign(art.spawn,{x:(plan.arrival.x-118)/1.35,z:(plan.arrival.z-108)/1.35,yaw:plan.arrival.yaw});Object.assign(art.guideAnchor,{x:(96-118)/1.35,z:(98-108)/1.35});art.bounds.minX=Math.min(art.bounds.minX,art.spawn.x-2);
  art.quarterLayout={version:3,plan};art.group.updateMatrixWorld(true);return art;
 };
 g.layoutArtistDali=function(T,art){
  const h=art.houses.find(h=>h.artistId==='dali');if(!h||h.quarterRelocated)return;
  const dx=(plan.dali.x-118)/1.35-h.cx,dz=(plan.dali.z-108)/1.35-h.cz;
  for(const c of art.colliders)if(c.artistId==='dali'){c.minX+=dx;c.maxX+=dx;c.minZ+=dz;c.maxZ+=dz;}
  moveHouse(h,dx,dz);h.quarterRelocated=true;
  art.bounds.minX=Math.min(art.bounds.minX,h.minX-2);art.bounds.maxX=Math.max(art.bounds.maxX,h.maxX+2);art.bounds.minZ=Math.min(art.bounds.minZ,h.minZ-2);art.bounds.maxZ=Math.max(art.bounds.maxZ,h.maxZ+2);
  art.group.updateMatrixWorld(true);
 };
})(typeof window!=='undefined'?window:globalThis);
