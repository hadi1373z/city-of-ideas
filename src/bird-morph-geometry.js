// One continuous skin owns the wall print, the peeling sculpture and the bird.
// The caller supplies the original tile outline, avoiding a scene-module cycle.
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export function birdMorphPoint(raw,{fold=0,inflate=0,curve=[0,1],side=1}={}){
 const x=raw[0]-.56,y=raw[1]-.68,dy=y+.10,wing=(1-smooth((raw[0]-.72)/.20))*smooth((Math.abs(dy)-.10)/.38),angle=fold*wing;
 const body=Math.exp(-Math.pow((raw[0]-.52)/.50,4)-Math.pow((raw[1]-.58)/.20,2)),head=Math.exp(-Math.pow((raw[0]-1.01)/.19,2)-Math.pow((raw[1]-.55)/.15,2));
 let px=x,py=-.10+dy*Math.cos(angle),pz=Math.abs(dy)*Math.sin(angle)+side*inflate*(.012+.095*Math.max(body,head*.8));
 const[k,ratio]=curve;if(Math.abs(k)>1e-7){px=Math.sin(x*k)/k;pz+=(1-Math.cos(x*k))/k*ratio;}
 return[px,py,pz];
}
export function createBirdMorphGeometry(T,outline,{subdivision=1}={}){
 if(!Array.isArray(outline)||outline.length<3||!Number.isInteger(subdivision)||subdivision<0||subdivision>2)throw new RangeError('Supply the original outline and subdivision 0, 1 or 2');
 const positions=[],raws=[],triangle=(a,b,c)=>{for(const p of[a,b,c]){positions.push(p[0]-.56,p[1]-.68,p[2]);raws.push(p[0],p[1]);}},mid=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const subdivide=(a,b,c,n)=>{if(!n){triangle(a,b,c);return;}const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);subdivide(a,ab,ca,n-1);subdivide(ab,b,bc,n-1);subdivide(ca,bc,c,n-1);subdivide(ab,bc,ca,n-1);};
 const faces=T.ShapeUtils.triangulateShape(outline.map(p=>new T.Vector2(...p)),[]);
 for(const ids of faces){const p=ids.map(i=>[...outline[i],1]);subdivide(...p,subdivision);subdivide([p[2][0],p[2][1],-1],[p[1][0],p[1][1],-1],[p[0][0],p[0][1],-1],subdivision);}
 for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],steps=2**subdivision;for(let j=0;j<steps;j++){const u=j/steps,v=(j+1)/steps,p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],q=[a[0]+(b[0]-a[0])*v,a[1]+(b[1]-a[1])*v];triangle([...p,1],[...p,-1],[...q,-1]);triangle([...p,1],[...q,-1],[...q,1]);}}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('birdRaw',new T.Float32BufferAttribute(raws,2));geometry.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(positions.length).fill(1),3));geometry.computeVertexNormals();geometry.computeBoundingSphere();geometry.userData.birdMorph={subdivision,outline: outline.map(p=>[...p])};return geometry;
}
const deformation=`
attribute float birdFold;attribute float birdInflate;attribute float birdOpacity;attribute vec2 birdCurve;attribute vec2 birdRaw;
varying vec2 vBirdRaw;varying float vBirdOpacity;
vec3 birdDeform(vec3 p){
 vec2 raw=p.xy+vec2(.56,.68);float dy=p.y+.10;
 float wing=(1.0-smoothstep(.72,.92,raw.x))*smoothstep(.10,.48,abs(dy));float angle=birdFold*wing;
 float body=exp(-pow(abs((raw.x-.52)/.50),4.0)-pow(abs((raw.y-.58)/.20),2.0));float head=exp(-pow(abs((raw.x-1.01)/.19),2.0)-pow(abs((raw.y-.55)/.15),2.0));
 vec3 q=vec3(p.x,-.10+dy*cos(angle),abs(dy)*sin(angle)+p.z*birdInflate*(.012+.095*max(body,head*.8)));
 if(abs(birdCurve.x)>0.0000001){q.x=sin(p.x*birdCurve.x)/birdCurve.x;q.z+=(1.0-cos(p.x*birdCurve.x))/birdCurve.x*birdCurve.y;}
 return q;
}`;
export function createBirdMorphMaterial(T,options={}){
 const material=new T.MeshLambertMaterial({color:0xffffff,side:T.DoubleSide,depthWrite:true,transparent:false,...options});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=deformation+'\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
 vec3 bx=birdDeform(position+vec3(.001,0,0))-birdDeform(position-vec3(.001,0,0));vec3 by=birdDeform(position+vec3(0,.001,0))-birdDeform(position-vec3(0,.001,0));vec3 bz=birdDeform(position+vec3(0,0,.001))-birdDeform(position-vec3(0,0,.001));
 vec3 bn=normal.x*cross(by,bz)+normal.y*cross(bz,bx)+normal.z*cross(bx,by);objectNormal=dot(bn,bn)>0.00000000000001?normalize(bn):normalize(cross(bx,by))*(normal.z<0.0?-1.0:1.0);`);
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','vec3 transformed=birdDeform(position);vBirdRaw=birdRaw;vBirdOpacity=birdOpacity;');
  shader.fragmentShader='varying vec2 vBirdRaw;varying float vBirdOpacity;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 // A tiny eye follows the same head. No long feather or quill strokes.
 vec2 eye=vBirdRaw-vec2(1.025,.52);float ea=eye.x*.02-eye.y*.032;float eb=(vBirdRaw.x-1.057)*.02-(vBirdRaw.y-.54)*(-.031);float ec=(vBirdRaw.x-1.026)*(-.04)-(vBirdRaw.y-.56)*(-.001);
 if((ea>=0.0&&eb>=0.0&&ec>=0.0)||(ea<=0.0&&eb<=0.0&&ec<=0.0))diffuseColor.rgb*=.16;
 // Opaque depth-writing skin, with an ordered fade only at the hidden reset.
 float threshold=fract(dot(mod(floor(gl_FragCoord.xy),vec2(4.0)),vec2(.754877666,.569840296)));if(vBirdOpacity<=threshold)discard;`);
 };
 material.customProgramCacheKey=()=> 'city-continuous-bird-skin-v1';return material;
}
