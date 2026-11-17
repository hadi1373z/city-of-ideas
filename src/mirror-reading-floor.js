import {MIRROR_READING_FLOOR as C,readingFloorPlane,reflectionCamera} from './mirror-reading-floor-model.js';
import {isLowerCoordinate} from './world-cylinder-model.js';

/** A single live planar reflection on the existing annular walking mesh. */
export function installMirrorReadingFloor(M,T,{now=()=>performance.now(),mobile=globalThis.matchMedia?.('(max-width: 800px), (pointer: coarse)')?.matches===true,document:doc=globalThis.document,events=globalThis}={}){
 const floor=M.worldCylinder?.lower?.walking?.children.find(o=>o.userData?.gallerySurface==='floor');if(!floor)throw Error('Install the lower Mathematics floor before its mirror.');
 const size=mobile?C.mobileSize:C.desktopSize,target=new T.WebGLRenderTarget(size,size,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,stencilBuffer:false});target.texture.generateMipmaps=false;target.texture.name='Live reflection of the Mathematics reading hall';
 const textureMatrix=new T.Matrix4(),plane=new T.Plane(),virtualCamera=new T.PerspectiveCamera(),viewport=new T.Vector4(),scissor=new T.Vector4(),clearColor=new T.Color();virtualCamera.name='Physical Mathematics-floor reflection camera';virtualCamera.userData.mirrorReadingFloor=true;
 const material=new T.ShaderMaterial({name:'One live annular mirror · real room reflection',uniforms:{reflection:{value:target.texture},textureMatrix:{value:textureMatrix},mirrorNormal:{value:new T.Vector3(0,1,0)},ready:{value:0}},side:T.FrontSide,depthWrite:true,depthTest:true,toneMapped:false,
  vertexShader:'uniform mat4 textureMatrix;varying vec4 vReflection;varying vec3 vWorld;void main(){vec4 world=modelMatrix*vec4(position,1.0);vWorld=world.xyz;vReflection=textureMatrix*world;gl_Position=projectionMatrix*viewMatrix*world;}',
  fragmentShader:'uniform sampler2D reflection;uniform vec3 mirrorNormal;uniform float ready;varying vec4 vReflection;varying vec3 vWorld;void main(){vec2 uv=vReflection.xy/vReflection.w;float valid=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0)*step(0.0,vReflection.w)*ready;vec3 live=texture2D(reflection,clamp(uv,vec2(.001),vec2(.999))).rgb;float cosine=abs(dot(normalize(cameraPosition-vWorld),normalize(mirrorNormal)));float strength=.88+.10*pow(1.0-cosine,5.0);vec3 base=vec3(.105,.135,.145);gl_FragColor=vec4(mix(base,live*vec3(.985,.995,1.0),strength*valid),1.0);\n#include <colorspace_fragment>\n}'
 });
 const borrowed={material:floor.material,before:floor.onBeforeRender,after:floor.onAfterRender},originalGeometry=floor.geometry,originalIndex=floor.geometry.index;floor.material=material;
 let rendering=false,disposed=false,captures=0,lastRender=-Infinity,lastSignature='',lastCamera=null,ready=false,drawReady=0,failed=false;
 const debug=doc?.getElementById?.('world');if(debug)debug.dataset.mirrorFloor='ready';
 const signature=camera=>camera.matrixWorld.elements.map(x=>x.toFixed(5)).join(',')+'|'+camera.projectionMatrix.elements.map(x=>x.toFixed(5)).join(',');
 function allowed(camera){
  if(disposed||failed||rendering||!camera?.isPerspectiveCamera||camera===virtualCamera||doc?.hidden||M.pondWorldWindow?.rendering||M.mode!=='city'||!isLowerCoordinate(M.player)||M.nightSky?.observing)return false;
  readingFloorPlane(T,floor,plane);camera.updateWorldMatrix(true,false);const eye=camera.getWorldPosition(new T.Vector3()),distance=plane.distanceToPoint(eye),centre=floor.localToWorld(new T.Vector3(0,C.floorY,0));
  if(distance<.04||distance>45||eye.distanceTo(centre)>130)return false;
  const forward=new T.Vector3(0,0,-1).applyQuaternion(camera.getWorldQuaternion(new T.Quaternion()));return forward.dot(plane.normal)<=Math.sin((camera.fov/2+3)*Math.PI/180);
 }
 function renderReflection(renderer,scene=M.scene,camera=M.camera,{time=now(),force=false}={}){
  if(!renderer||!allowed(camera))return false;
  const key=signature(camera),moving=key!==lastSignature||camera!==lastCamera,interval=(moving?C.movingInterval:C.stillInterval)*(mobile?1.6:1);if(!force&&ready&&camera===lastCamera&&time-lastRender<interval)return false;
  reflectionCamera(T,camera,plane,virtualCamera,textureMatrix);material.uniforms.mirrorNormal.value.copy(plane.normal);
  const oldTarget=renderer.getRenderTarget(),oldFace=renderer.getActiveCubeFace?.()??0,oldMip=renderer.getActiveMipmapLevel?.()??0,oldViewport=renderer.getViewport(viewport).clone(),oldScissor=renderer.getScissor(scissor).clone(),oldScissorTest=renderer.getScissorTest(),oldColor=renderer.getClearColor(clearColor).clone(),oldAlpha=renderer.getClearAlpha(),oldAutoClear=renderer.autoClear,oldXR=renderer.xr?.enabled,oldShadow=renderer.shadowMap?.autoUpdate,oldVisible=floor.visible,oldClipping=renderer.clippingPlanes,oldClipRefs=oldClipping?.slice(),oldClipValues=oldClipping?.map(p=>p.clone()),oldLocalClipping=renderer.localClippingEnabled,gl=renderer.getContext?.(),oldDepthMask=gl?.getParameter?.(gl.DEPTH_WRITEMASK);
  const sky=M.nightSky?.sky?.group,skyPosition=sky?.position.clone(),skyQuaternion=sky?.quaternion.clone(),skyScale=sky?.scale.clone();rendering=true;
  try{
   floor.visible=false;if(renderer.xr)renderer.xr.enabled=false;if(renderer.shadowMap)renderer.shadowMap.autoUpdate=false;renderer.autoClear=true;renderer.setRenderTarget(target);renderer.setViewport(0,0,size,size);renderer.setScissorTest(false);if(typeof oldDepthMask==='boolean')renderer.state?.buffers?.depth?.setMask?.(true);renderer.clear(true,true,true);renderer.render(scene,virtualCamera);
   ready=true;lastRender=time;lastSignature=key;lastCamera=camera;captures++;if(debug){debug.dataset.mirrorFloorFrames=String(captures);debug.dataset.mirrorFloorSize=String(size);}return true;
  }finally{
   floor.visible=oldVisible;if(sky){sky.position.copy(skyPosition);sky.quaternion.copy(skyQuaternion);sky.scale.copy(skyScale);sky.updateMatrixWorld(true);}renderer.setRenderTarget(oldTarget,oldFace,oldMip);renderer.setViewport(oldViewport);renderer.setScissor(oldScissor);renderer.setScissorTest(oldScissorTest);renderer.setClearColor(oldColor,oldAlpha);renderer.autoClear=oldAutoClear;if(renderer.xr)renderer.xr.enabled=oldXR;if(renderer.shadowMap)renderer.shadowMap.autoUpdate=oldShadow;if(oldClipping){for(let i=0;i<oldClipRefs.length;i++)oldClipRefs[i].copy(oldClipValues[i]);oldClipping.splice(0,oldClipping.length,...oldClipRefs);}renderer.clippingPlanes=oldClipping;renderer.localClippingEnabled=oldLocalClipping;if(typeof oldDepthMask==='boolean')renderer.state?.buffers?.depth?.setMask?.(oldDepthMask);rendering=false;
  }
 }
 function before(renderer,scene,camera,...args){borrowed.before?.call(floor,renderer,scene,camera,...args);drawReady=material.uniforms.ready.value;const visible=allowed(camera);if(visible){try{renderReflection(renderer,scene,camera);}catch(error){failed=true;if(debug)debug.dataset.mirrorFloor='unavailable';console.warn('Mathematics mirror unavailable',error);}}material.uniforms.ready.value=visible&&ready&&!failed?1:0;}
 function after(...args){material.uniforms.ready.value=drawReady;borrowed.after?.apply(floor,args);}
 floor.onBeforeRender=before;floor.onAfterRender=after;
 function dispose(){if(disposed)return;disposed=true;if(floor.material===material)floor.material=borrowed.material;if(floor.onBeforeRender===before)floor.onBeforeRender=borrowed.before;if(floor.onAfterRender===after)floor.onAfterRender=borrowed.after;material.dispose();target.dispose();if(M.mirrorReadingFloor===api)delete M.mirrorReadingFloor;events.removeEventListener?.('pagehide',dispose);}
 const api={floor,material,target,camera:virtualCamera,textureMatrix,renderReflection,dispose,get frames(){return captures;},get rendering(){return rendering;},get originalGeometry(){return originalGeometry;},get originalIndex(){return originalIndex;}};M.mirrorReadingFloor=api;events.addEventListener?.('pagehide',dispose,{once:true});return api;
}
