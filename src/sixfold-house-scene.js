import {buildTransformationHouse} from './transformation-house-scene.js?v=garden-house-stone-20261121';
import {buildHouseTiling} from './house-tiling-scene.js?v=garden-house-stone-20261121';
import {SIXFOLD_HOUSES} from './sixfold-house-network-model.js?v=escher-finish-20261120';
import {buildSixfoldHouseRoof} from './sixfold-house-roof-scene.js?v=garden-house-stone-20261121';

// One immutable structural prototype supplies all six houses. Only moving
// shelves, pendulums, local lamp visibility and finish buffers are independent.
// Distant houses use a small above-ground view of that same source geometry.
export function buildSixfoldTransformationHouses(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Six houses of transformations · one connected honeycomb';
 const prototype=buildTransformationHouse(T,{canvas,includeTiling:false,includeRoof:false,gardenFacade:true}),owned=new Set(),instances=[],targets=[],clonedInstances=[];
 prototype.group.updateMatrixWorld(true);
 const sourceNodes=[];prototype.group.traverse(o=>sourceNodes.push(o));
 const sourceIndex=o=>sourceNodes.indexOf(o),secretIndex=sourceIndex(prototype.secret),lampIndex=sourceIndex(prototype.lamps),walkingIndex=sourceIndex(prototype.walking),pendulumIndices=prototype.pendulums.map(sourceIndex);
 const facadeIndex=sourceNodes.findIndex(o=>o.name==='Garden house exterior title');
 const facadeTexture=name=>{const c=canvas();c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#e5dbc3';ctx.fillRect(0,0,1024,160);ctx.fillStyle='#26464b';ctx.textAlign='center';ctx.font='42px Georgia';ctx.fillText(name,512,96,980);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;owned.add(texture);return texture;};
 const coarse=new T.Group(),box=new T.Box3(),matrix=new T.Matrix4(),combined=new T.Matrix4();
 prototype.group.traverse(o=>{
  if(!o.isMesh||o.userData.sourceHouseCorridor)return;
  if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();
  if(o.isInstancedMesh){
   const kept=[];for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);combined.multiplyMatrices(o.matrixWorld,matrix);box.copy(o.geometry.boundingBox).applyMatrix4(combined);if(box.min.y>=-.3)kept.push(combined.clone());}
   if(kept.length){const copy=new T.InstancedMesh(o.geometry,o.material,kept.length);kept.forEach((m,i)=>copy.setMatrixAt(i,m));copy.computeBoundingSphere();coarse.add(copy);clonedInstances.push(copy);}
  }else{
   box.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);if(box.min.y<-.3)return;
   const copy=o.clone(false);copy.matrixAutoUpdate=false;copy.matrix.copy(o.matrixWorld);coarse.add(copy);
  }
 });
 for(const h of SIXFOLD_HOUSES){
  const wrapper=new T.Group();wrapper.name=h.name+' · '+h.id+' honeycomb cell';wrapper.position.set(h.x,0,h.z);wrapper.rotation.y=h.turn;group.add(wrapper);
  const detail=prototype.group.clone(true);detail.position.x=-125;wrapper.add(detail);
  const nodes=[];detail.traverse(o=>{nodes.push(o);if(o.isInstancedMesh)clonedInstances.push(o);});for(const o of nodes)if(o.userData.sourceHouseCorridor)o.removeFromParent();
  const distant=coarse.clone(true);distant.position.x=-125;wrapper.add(distant);distant.traverse(o=>{if(o.isInstancedMesh)clonedInstances.push(o);});
  const material=new T.MeshBasicMaterial({map:facadeTexture(h.name),toneMapped:false});owned.add(material);
  if(nodes[facadeIndex])nodes[facadeIndex].material=material;
  distant.traverse(o=>{if(o.name==='Garden house exterior title')o.material=material;});
  // Mounted outside the detail/far toggle: the actual patterned roof is the
  // same geometry at every viewing distance, never a plain coloured proxy.
  const roof=buildSixfoldHouseRoof(T,{pattern:h.pattern});roof.group.position.x=-125;wrapper.add(roof.group);
  const lamps=nodes[lampIndex],secret=nodes[secretIndex],pendulums=pendulumIndices.map(i=>nodes[i]);lamps.visible=false;
  const localTargets=prototype.targets.map(t=>nodes[sourceIndex(t)]);for(const t of localTargets){t.userData.houseInstance=h.id;targets.push(t);}
  let tiling=null,instanceDisposed=false;
  const instance={...h,group:wrapper,detail,exterior:distant,roof,lamps,secret,targets:localTargets,source:{secret,pendulums,walking:nodes[walkingIndex]},
   ensureInterior(){if(disposed||instanceDisposed)return null;if(!tiling){tiling=buildHouseTiling(T,{pattern:h.pattern,compact:true,gardenFacade:true});detail.add(tiling.group);}return tiling;},
   get tiling(){return tiling;},
   update(time,shelfOpen=false,ratio=1.5){if(disposed||instanceDisposed)return;secret.position.x=125+(shelfOpen?3:0);pendulums.forEach((p,i)=>p.rotation.z=.3*Math.sin(time*(i?ratio:1)));},
   setDetail(show){if(disposed||instanceDisposed)return;if(show)this.ensureInterior();detail.visible=!!show;distant.visible=!show;roof.group.visible=true;},
   dispose(){if(instanceDisposed)return;instanceDisposed=true;tiling?.dispose();roof.dispose();wrapper.removeFromParent();}
  };instances.push(instance);detail.visible=false;
 }
 let disposed=false;
 return{group,walking:group,instances,targets,prototype,
  // The coordinator activates only the nearby house, including its lamps.
  update(time,states={},player=null,mode='city',activeHouseId=null,section=null){if(disposed)return;for(const h of instances){const state=states[h.id]||{},near=mode==='city'&&player&&Math.abs(player.y)<45&&Math.hypot(player.x-h.x,player.z-h.z)<62,cut=section&&Math.abs(h.x*Math.sin(section.angle)+h.z*Math.cos(section.angle))<26,show=h.id===activeHouseId||near||cut;h.setDetail(show);if(mode==='city'&&player?.y<-1&&!show)h.exterior.visible=false;h.roof.group.visible=h.detail.visible||h.exterior.visible;h.update(time,state.shelfOpen,state.ratio);}},
  dispose(){if(disposed)return;disposed=true;for(const h of instances)h.dispose();for(const o of clonedInstances)o.dispose?.();prototype.dispose();for(const r of owned)r.dispose();group.clear();}
 };
}
