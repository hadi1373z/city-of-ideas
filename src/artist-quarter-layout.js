/* Scene-only layout adapter. Original galleries, works and saved editions stay intact. */
(function(g){'use strict';
 const lots={monet:[-23,-12],kandinsky:[-11,-12],'van-gogh':[1,-12],hokusai:[13,-14],rodin:[26,-19],'hilma-af-klint':[-23,12],mondrian:[-11,12],lange:[1,12],morris:[13,12],klee:[25,12]};
 g.layoutArtistQuarter=function(T,art){
  if(art.quarterLayout)return art;
  const moves=art.houses.map(h=>({h,x:h.cx,z:h.cz,dx:(lots[h.artistId]?.[0]??h.cx)-h.cx,dz:(lots[h.artistId]?.[1]??h.cz)-h.cz}));
  const owner=(x,z)=>moves.find(m=>Math.abs(x-m.x)<4.1&&Math.abs(z-m.z)<3.8);
  // Furniture legs and brushes were batched outside their house groups.
  for(const node of art.group.children){
   if(node.isInstancedMesh){const matrix=new T.Matrix4();for(let i=0;i<node.count;i++){node.getMatrixAt(i,matrix);const m=owner(matrix.elements[12],matrix.elements[14]);if(m){matrix.elements[12]+=m.dx;matrix.elements[14]+=m.dz;node.setMatrixAt(i,matrix);}}node.instanceMatrix.needsUpdate=true;node.computeBoundingBox?.();node.computeBoundingSphere?.();}
   // Remove the old display slab, disconnected threshold strips and shared lane.
   else if(node.isMesh&&node.geometry.type==='BoxGeometry'&&node.position.y<.02&&!node.userData.artAction)node.visible=false;
  }
  for(const collider of art.colliders){const m=owner((collider.minX+collider.maxX)/2,(collider.minZ+collider.maxZ)/2);if(m){collider.minX+=m.dx;collider.maxX+=m.dx;collider.minZ+=m.dz;collider.maxZ+=m.dz;}}
  for(const {h,dx,dz}of moves){h.cx+=dx;h.cz+=dz;h.minX+=dx;h.maxX+=dx;h.minZ+=dz;h.maxZ+=dz;h.group.position.x+=dx;h.group.position.z+=dz;for(const p of[h.entry,h.spawnInside,...h.approaches]){p.x+=dx;p.z+=dz;if(p.lookAt){p.lookAt.x+=dx;p.lookAt.z+=dz;}}}
  Object.assign(art.bounds,{minX:-29,maxX:31,minZ:-24,maxZ:17});
  art.quarterLayout={version:1,lots};art.group.updateMatrixWorld(true);return art;
 };
})(typeof window!=='undefined'?window:globalThis);
