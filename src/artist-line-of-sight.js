// Original scene parity: visible opaque geometry blocks artist conversation proximity.
// Actor meshes are excluded because the original resident group was separate from remoteWorld().group.
export function artistLineOfSight(T,{scene,artGroup,residentGroup,player,state}){
 if(!scene||!artGroup||!state?.position||![player?.x,player?.y,player?.z,state.position.x,state.position.z].every(Number.isFinite))return false;
 scene.updateMatrixWorld(true);
 const from=new T.Vector3(player.x,player.y,player.z),to=artGroup.localToWorld(new T.Vector3(state.position.x,(state.position.y||0)+1.1,state.position.z)),delta=to.sub(from),distance=delta.length();
 if(distance===0)return true;
 const ray=new T.Raycaster(from,delta.normalize()),scale=artGroup.getWorldScale(new T.Vector3()).x;
 // Static batching keeps original opaque ray geometry on reserved layer31.
 ray.layers.enable(31);
 const visible=object=>{for(let node=object;node;node=node.parent)if(node.visible===false)return false;return true;};
 const actor=object=>{for(let node=object;node;node=node.parent)if(node===residentGroup)return true;return false;};
 const glass=object=>{const materials=Array.isArray(object.material)?object.material:[object.material];return materials.length&&materials.every(material=>material?.transparent&&material.opacity<.2);};
 const meshes=[];artGroup.traverse(object=>{if(object.isMesh&&!actor(object)&&visible(object))meshes.push(object);});
 const hit=ray.intersectObjects(meshes,false).find(item=>item.object.geometry&&!glass(item.object));
 return!hit||hit.distance>distance-.18*scale;
}
