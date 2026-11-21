import {createLightMirror} from './house-of-light-mirror.js?v=live-light-niches-20261121';

// Reflect the actual mobile's geometry and instance attributes. A small isolated
// capture avoids rendering the whole city a second time or recursing into the
// passage mirror. The proxy borrows source resources; it never disposes them.
export function createSpectrumFloorReflection(T,{mobile,rods,active=()=>true}={}){
 const scene=new T.Scene(),reflectedMobile=mobile.clone(true);
 reflectedMobile.matrixAutoUpdate=false;
 const reflectedRods=reflectedMobile.children.find(o=>o.isInstancedMesh);
 scene.add(reflectedMobile);
 const reflection=createLightMirror(T,{
  width:48,height:48,active,overlay:true,strength:.48,
  captureScene(){
   reflectedMobile.matrix.copy(mobile.matrixWorld);
   reflectedMobile.visible=mobile.visible;
   reflectedRods.visible=rods.visible;
   reflectedRods.instanceMatrix=rods.instanceMatrix;
   reflectedRods.instanceColor=rods.instanceColor;
   return scene;
  }
 });
 reflection.surface.rotation.x=-Math.PI/2;
 reflection.surface.position.y=.138;
 reflection.surface.renderOrder=3;
 reflection.surface.userData.dynamic=true;
 reflection.surface.name='Suspended spectrum · live chandelier reflection on tiled stone';
 reflection.target.texture.name='House of Light · chandelier floor reflection';
 const dispose=reflection.dispose;let disposed=false;
 return{...reflection,scene,reflectedMobile,reflectedRods,get frames(){return reflection.frames;},dispose(){if(disposed)return;disposed=true;dispose();reflectedRods.dispose?.();scene.clear();reflectedMobile.clear();}};
}
