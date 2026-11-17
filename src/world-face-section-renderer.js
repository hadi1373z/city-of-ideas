/** A single cutaway with two real lighting passes, not a dark label over one
 * daytime scene. All geometry remains in the existing physical world frame.
 */
export function createWorldFaceSectionRenderer(M,T,{built,upper,lower,withLowerEnvironment}={}){
 const background=new T.Scene(),camera=new T.OrthographicCamera(-1,1,1,-1,0,1),geometry=new T.PlaneGeometry(2,2),material=new T.ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,uniforms:{day:{value:new T.Color(0xc2d6df)},night:{value:new T.Color(0x091522)},split:{value:.5}},vertexShader:'varying vec2 sectionUv;void main(){sectionUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',fragmentShader:'uniform vec3 day;uniform vec3 night;uniform float split;varying vec2 sectionUv;void main(){float daylight=smoothstep(split-.012,split+.012,sectionUv.y);gl_FragColor=vec4(mix(night,day,daylight),1.0);\n#include <colorspace_fragment>\n}'}),quad=new T.Mesh(geometry,material),upperHeight=new T.Plane(new T.Vector3(0,1,0),48),lowerHeight=new T.Plane(new T.Vector3(0,-1,0),-48),projection=new T.Vector3(),viewport=new T.Vector4(),scissor=new T.Vector4();background.add(quad);background.name='Section background · upper day and lower night';let rendering=false,disposed=false;
 function render(renderer,scene=M.scene,view=M.camera){
  if(disposed||rendering||!renderer||!scene||!view)return false;rendering=true;
  const saved={background:scene.background,fog:scene.fog,autoClear:renderer.autoClear,clipping:renderer.clippingPlanes,local:renderer.localClippingEnabled,viewport:renderer.getViewport?.(viewport)?.clone(),scissor:renderer.getScissor?.(scissor)?.clone(),scissorTest:renderer.getScissorTest?.()},visible=new Map(),lights=new Map();
  const show=(node,value)=>{if(!node)return;if(!visible.has(node))visible.set(node,node.visible);node.visible=value;},restoreVisibility=()=>{for(const[node,value]of visible)node.visible=value;};
  const ownLower=node=>{for(let p=node;p;p=p.parent)if(p===built.lamps)return true;return false;};
  try{
   if(saved.background?.isColor)material.uniforms.day.value.copy(saved.background);else material.uniforms.day.value.set(0xc2d6df);
   view.updateMatrixWorld?.(true);projection.set(0,-48,0).project(view);material.uniforms.split.value=Math.max(.03,Math.min(.97,projection.y*.5+.5));
   renderer.autoClear=false;renderer.clippingPlanes=[];renderer.clear(true,true,true);renderer.render(background,camera);
   // Upper inhabitants retain the established daylight, while the lower city
   // and its lights contribute nothing to this pass.
   scene.background=null;show(built.lowerFrame,false);show(built.lamps,false);show(lower.lamps,false);show(built.sea,false);show(M.nightSky?.sky?.group,false);
   renderer.clippingPlanes=[...(saved.clipping||[]),upperHeight];renderer.localClippingEnabled=true;renderer.render(scene,view);
   restoreVisibility();
   // Keep the same depth buffer. A true height clip partitions both the shell
   // and shared interior at the middle plane without duplicating the city.
   for(const root of scene.children)if(root!==built.group&&!root.isLight)show(root,false);
   show(built.lowerFrame,true);show(built.lamps,true);show(lower.lamps,true);show(upper.group,false);show(upper.lamps,false);show(built.sea,false);show(M.nightSky?.sky?.group,false);
   scene.traverse(node=>{if((node.isHemisphereLight||node.isDirectionalLight)&&!ownLower(node)){lights.set(node,node.intensity);node.intensity=0;}});
   renderer.clippingPlanes=[...(saved.clipping||[]),lowerHeight];
   withLowerEnvironment(()=>{scene.background=null;renderer.render(scene,view);},{density:.00015});
   return true;
  }finally{
   for(const[node,intensity]of lights)node.intensity=intensity;restoreVisibility();scene.background=saved.background;scene.fog=saved.fog;renderer.autoClear=saved.autoClear;renderer.clippingPlanes=saved.clipping;renderer.localClippingEnabled=saved.local;if(saved.viewport)renderer.setViewport?.(saved.viewport);if(saved.scissor)renderer.setScissor?.(saved.scissor);if(saved.scissorTest!==undefined)renderer.setScissorTest?.(saved.scissorTest);rendering=false;
  }
 }
 return{render,background,upperHeight,lowerHeight,get rendering(){return rendering;},dispose(){if(disposed)return;disposed=true;geometry.dispose();material.dispose();background.clear();}};
}
