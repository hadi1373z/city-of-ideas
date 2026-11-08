// An original sculptural reservoir under the gallery's existing central volcano.
// All dimensions use the library's ordinary +Y-up city frame.
export const BABEL_THERMAL_VAULT=Object.freeze({mouthRadius:21,mouthY:-.55,tipY:-20,innerRadius:20.86,innerTipY:-19.8,fluidRadius:20.5,fluidTopY:-.78,fluidTipY:-19.55,collarBottomY:-3.3,segments:160,meridians:10});
export function thermalVaultHeightAt(radius){const c=BABEL_THERMAL_VAULT;return Number.isFinite(radius)&&radius>=0&&radius<=c.mouthRadius?c.tipY+(c.mouthY-c.tipY)*radius/c.mouthRadius:null;}

export function buildBabelThermalVault(T){
 const c=BABEL_THERMAL_VAULT,group=new T.Group();group.name='Babel · glass cone beneath the central volcano';group.userData.babelThermalVault=true;
 const owned=new Set(),own=r=>(owned.add(r),r),glassMaterial=own(new T.MeshPhysicalMaterial({color:0x94aaa7,roughness:.10,metalness:.035,clearcoat:.85,clearcoatRoughness:.10,transparent:true,opacity:.075,depthWrite:false,side:T.DoubleSide})),metal=own(new T.MeshStandardMaterial({color:0x3a433f,roughness:.52,metalness:.68}));glassMaterial.forceSinglePass=true;
 const fluidMaterial=own(new T.ShaderMaterial({toneMapped:false,transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0}},vertexShader:`varying vec3 vLocal;varying vec3 vNormal;
 void main(){vLocal=position;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform float time;varying vec3 vLocal;varying vec3 vNormal;
 void main(){
  float a=atan(vLocal.z,vLocal.x),r=length(vLocal.xz),h=(vLocal.y+19.55)/18.77;
  float drift=time*.055;
  float fold=sin(a*7.0+h*10.0+sin(h*13.0-a*3.0-drift)*.75+drift);
  float vein=sin(a*13.0-h*19.0+sin(a*5.0+h*8.0+drift)*1.10-drift*.7);
  float broad=.5+.5*sin(a*3.0+h*7.0+fold*.7+drift*.45);
  float hot=smoothstep(.48,.96,fold*.55+vein*.30+broad*.35);
  vec3 rust=vec3(.31,.085,.025),amber=vec3(.82,.30,.065),lightAmber=vec3(1.0,.64,.19);
  vec3 color=mix(rust,amber,.35+broad*.46);color=mix(color,lightAmber,hot*.72);
  float edge=.80+.20*abs(vNormal.z);color*=edge;
  gl_FragColor=vec4(color,.80+hot*.12);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`}));fluidMaterial.forceSinglePass=true;
 function mesh(geometry,material,name){const o=new T.Mesh(own(geometry),material);o.name=name;group.add(o);return o;}
 // This closed profile has real outer/inner walls and a narrow horizontal lip.
 // A separate transparent lid seals the mouth above the contained liquid.
 const profile=[new T.Vector2(0,c.tipY),new T.Vector2(c.mouthRadius,c.mouthY),new T.Vector2(c.innerRadius,c.mouthY),new T.Vector2(0,c.innerTipY)];
 const glass=mesh(new T.LatheGeometry(profile,c.segments),glassMaterial,'Closed conical glass vessel · outer wall, inner wall and lip');glass.renderOrder=4;
 const lid=mesh(new T.CircleGeometry(c.innerRadius,c.segments),glassMaterial,'Transparent glass lid below the volcano');lid.rotation.x=-Math.PI/2;lid.position.y=c.mouthY;lid.renderOrder=4;
 const collar=mesh(new T.CylinderGeometry(c.mouthRadius,c.mouthRadius,c.mouthY-c.collarBottomY,c.segments,1,true),glassMaterial,'Glass collar joining the existing annular ceiling');collar.position.y=(c.mouthY+c.collarBottomY)/2;collar.renderOrder=4;
 const fluidProfile=[new T.Vector2(0,c.fluidTipY),new T.Vector2(c.fluidRadius,c.fluidTopY),new T.Vector2(0,c.fluidTopY)],fluid=mesh(new T.LatheGeometry(fluidProfile,c.segments),fluidMaterial,'Contained amber and rust fluid · slow original procedural flow');fluid.renderOrder=3;
 const cylinder=own(new T.CylinderGeometry(1,1,1,6)),ribs=new T.InstancedMesh(cylinder,metal,c.meridians),stamp=new T.Object3D(),up=new T.Vector3(0,1,0);
 for(let i=0;i<c.meridians;i++){
  const a=(i+.5)*Math.PI*2/c.meridians,lowerR=.25,start=new T.Vector3(Math.cos(a)*lowerR,thermalVaultHeightAt(lowerR)-.018,Math.sin(a)*lowerR),end=new T.Vector3(Math.cos(a)*c.mouthRadius,c.mouthY-.018,Math.sin(a)*c.mouthRadius),delta=end.clone().sub(start);
  stamp.position.copy(start).add(end).multiplyScalar(.5);stamp.quaternion.setFromUnitVectors(up,delta.clone().normalize());stamp.scale.set(.022,delta.length(),.022);stamp.updateMatrix();ribs.setMatrixAt(i,stamp.matrix);
 }
 ribs.name='Ten thin dark metal meridians on the glass';ribs.instanceMatrix.needsUpdate=true;ribs.computeBoundingSphere?.();group.add(ribs);
 for(const[y,radius]of[[c.mouthY,.055],[c.collarBottomY,.035]]){const rim=mesh(new T.TorusGeometry(c.mouthRadius,radius,6,c.segments),metal,'Restrained circular metal glass seal');rim.rotation.x=Math.PI/2;rim.position.y=y;}
 let disposed=false;const counts={drawMeshes:0,triangles:0,meridians:c.meridians};group.traverse(o=>{if(o.isMesh){counts.drawMeshes++;counts.triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});
 return{group,glass,lid,collar,fluid,glassMaterial,fluidMaterial,contract:c,counts,update(time,reduced=false){if(!disposed)fluidMaterial.uniforms.time.value=reduced||!Number.isFinite(time)?0:time;},dispose(){if(disposed)return;disposed=true;group.removeFromParent();ribs.dispose?.();for(const r of owned)r.dispose();group.clear();}};
}
