/* The original park batches the fountain with other scenery by material.
 * Keep the basin and every shared source resource; remove only its raised center. */
export function replaceFountainCenter(T,park){
 const group=park?.group,swaps=[],hidden=[];let removedTriangles=0,disposed=false;
 if(!group)return{stats:{removedTriangles:0,replacedBatches:0,hiddenObjects:0},dispose(){}};
 const central=(x,y,z)=>Math.hypot(x,z)<=5.051&&y>=.949;
 const p=new T.Vector3();
 // These are the exact original fountain objects, retained as layer-1 pick proxies.
 for(const node of park.targets??[]){if(!node.isMesh||node.userData?.select?.type!=='landmark'||node.userData.select.id!=='fountain')continue;const position=node.geometry?.attributes.position;if(!position)continue;if(node.matrixAutoUpdate)node.updateMatrix();let center=true;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i).applyMatrix4(node.matrix);if(!central(p.x,p.y,p.z)){center=false;break;}}if(center){hidden.push({node,visible:node.visible,mask:node.layers.mask});node.visible=false;node.layers.disableAll();}}
 // Static merged buffers are already in park-local space. Do not touch other meshes.
 if(hidden.length)for(const node of group.children){if(!node.isMesh||node.isInstancedMesh||!node.geometry?.attributes.position)continue;const source=node.geometry,a=source.attributes.position,index=source.index,count=index?.count??a.count,kept=[];let removed=0;for(let i=0;i<count;i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);if(ids.every(id=>central(a.getX(id),a.getY(id),a.getZ(id))))removed++;else kept.push(...ids);}if(!removed)continue;const replacement=source.clone();replacement.setIndex(kept);replacement.computeBoundingSphere();node.geometry=replacement;swaps.push({node,source,replacement});removedTriangles+=removed;}
 const fountain=group.getObjectByName('Central Question Fountain');fountain?.traverse(node=>{if(node.isPoints){hidden.push({node,visible:node.visible,mask:node.layers.mask});node.visible=false;}});
 const stats=Object.freeze({removedTriangles,replacedBatches:swaps.length,hiddenObjects:hidden.length});
 return{stats,dispose(){if(disposed)return;disposed=true;for(const{node,source,replacement}of swaps){if(node.geometry===replacement)node.geometry=source;replacement.dispose();}for(const{node,visible,mask}of hidden){node.visible=visible;node.layers.mask=mask;}}};
}
