/* One spatial plan for every public artist home. Saved designs are not rewritten. */
(function(g){'use strict';
 const galleries={monet:[85,82],'van-gogh':[108,84],'hilma-af-klint':[84,112],morris:[108,115],kandinsky:[159,98],hokusai:[181,95],rodin:[203,99],mondrian:[161,132],lange:[182,134],klee:[204,137]};
 const plan={version:2,galleries,escher:{x:228,z:115},dali:{x:220,z:177},studios:{cezanne:{x:171,z:161,turn:0},morisot:{x:196,z:159,turn:0},seurat:{x:182,z:196,turn:Math.PI}},bounds:{minX:70,maxX:249,minZ:72,maxZ:211},arrival:{x:96,z:98,y:.13,yaw:0},
  courts:[{id:'garden',title:{en:'The garden court',de:'Der Gartenhof',fa:'حیاط باغ'},artists:['monet','van-gogh','hilma-af-klint','morris'],arrival:{x:96,z:98,y:.13,yaw:0}},
   {id:'form',title:{en:'The form and perspective court',de:'Der Hof für Form und Perspektive',fa:'حیاط فرم و پرسپکتیو'},artists:['kandinsky','hokusai','rodin','mondrian','lange','klee','escher'],arrival:{x:174,z:116,y:.13,yaw:0}},
   {id:'studio',title:{en:'The studio court',de:'Der Atelierhof',fa:'حیاط آتلیه‌ها'},artists:['cezanne','morisot','seurat','dali'],arrival:{x:184,z:179,y:.13,yaw:0}}],
  routes:[[[76,110],[74,100],[96,98],[126,104],[145,116],[174,116],[204,118],[228,126]],[[171,116],[171,148],[156,148],[156,179],[182,179],[209,187],[229,187]],[[228,126],[242,145],[242,187],[229,187]]],
  plants:[[96,91],[96,105],[171,108],[193,110],[173,125],[195,126],[184,173],[205,178],[179,184],[236,169]],
  seats:[[96,93],[97,104],[193,111],[174,126],[185,173],[205,180],[237,160]],
  trees:[[96,89],[96,107],[127,99],[144,106],[171,106],[193,108],[173,127],[195,128],[160,173],[184,171],[205,176],[233,165],[234,193]]};
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
  art.quarterLayout={version:2,plan};art.group.updateMatrixWorld(true);return art;
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
