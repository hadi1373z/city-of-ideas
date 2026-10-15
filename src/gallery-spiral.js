// Straight gallery flights; the old factory name remains for saved diagnostic clients.
(function(g){'use strict';
g.createGallerySpiral=function(T){
 const headWidth=(351-263)/596*96,width=headWidth,spacing=8,base=.395,steps=40,rise=spacing/steps,tread=.28,run=steps*tread,startX=43,endX=startX-run,edge=width/2+1.2,clamp=T.MathUtils.clamp;
 const segments=[],starts=[],landings=[];let length=0;
 function segment(a,b,kind,floor){const distance=Math.hypot(b.x-a.x,b.z-a.z);segments.push({a,b,kind,floor,start:length,end:length+distance,length:distance});length+=distance;}
 for(let floor=0;floor<4;floor++){
  const y=base+floor*spacing;starts.push(length);segment({x:startX,z:0,y},{x:endX,z:0,y:y+spacing},'steps',floor);
  landings.push({x:endX,z:0,y:y+spacing,floor:floor+1,progress:length});
  if(floor<3){let a={x:endX,z:0,y:y+spacing};for(const [x,z]of [[endX-1.5,0],[endX-1.5,edge],[startX+1.5,edge],[startX+1.5,0],[startX,0]]){const b={x,z,y:y+spacing};segment(a,b,'landing',floor+1);a=b;}}
 }
 const max=length,at=p=>segments.find(s=>p<s.end-1e-8)||segments.at(-1);
 function localPointAt(p){p=clamp(p,0,max);const s=at(p),u=clamp((p-s.start)/s.length,0,1);return{x:s.a.x+(s.b.x-s.a.x)*u,z:s.a.z+(s.b.z-s.a.z)*u,y:s.kind==='steps'?s.a.y+Math.ceil(Math.max(0,u*steps-1e-7))*rise:s.a.y};}
 function localHeadingAt(p,direction=1){const s=at(clamp(p,0,max));return Math.atan2(-(s.b.x-s.a.x)*direction,-(s.b.z-s.a.z)*direction);}
 function floorAt(p){const s=at(clamp(p,0,max));return s.kind==='landing'?s.floor:s.floor+(p>=s.end-1e-6?1:0);}
 function nearLanding(p){const s=at(p);return s.kind==='landing'||p-s.start<.45||s.end-p<.45;}
 function localContains(x,z,margin=0){return x>endX-margin&&x<startX+margin&&Math.abs(z)<width/2+margin;}
 function localHoleAt(x,z,floor){return floor>0&&localContains(x,z,.08);}
 function localEntryAt(x,z,floor,previous){if(Math.abs(z)>width/2-.28)return null;if(floor<4&&previous.x>=startX-.02&&x<startX&&x>endX)return starts[floor]+startX-x;if(floor>0&&previous.x<=endX+.02&&x>endX&&x<startX)return starts[floor-1]+startX-x;return null;}
 function localResolve(x,z,p){const s=at(p);if(s.kind!=='steps')return{...localPointAt(p),theta:p};const theta=s.start+clamp(startX-x,0,run),q=localPointAt(theta);return{...q,z:clamp(z,-width/2+.28,width/2-.28),theta};}
 function localExitAt(x,z,p){const s=at(p);if(s.kind==='landing')return s.floor;if(s.end-p<.5&&x<endX)return s.floor+1;if(p-s.start<.5&&x>startX)return s.floor;return null;}
 const toWorld=p=>({...p,x:43+p.z,z:43-p.x}),toLocal=(x,z)=>({x:43-z,z:x-43});
 const opening={minX:43-width/2-.08,maxX:43+width/2+.08,minZ:-.08,maxZ:run+.08};
 function pointAt(p){return toWorld(localPointAt(p));}
 function headingAt(p,direction=1){return localHeadingAt(p,direction)+Math.PI/2;}
 function contains(x,z,margin=0){const p=toLocal(x,z);return localContains(p.x,p.z,margin);}
 function holeAt(x,z,floor){return floor>0&&contains(x,z,.08);}
 function entryAt(x,z,floor,previous){const p=toLocal(x,z),q=toLocal(previous.x,previous.z);return localEntryAt(p.x,p.z,floor,q);}
 function resolve(x,z,progress){const p=toLocal(x,z);return toWorld(localResolve(p.x,p.z,progress));}
 function exitAt(x,z,progress){const p=toLocal(x,z);return localExitAt(p.x,p.z,progress);}
 function build(parent,{drawing=null}={}){
  const group=new T.Group();group.name='Head-width staircase along snake direction';group.position.set(43,0,43);group.rotation.y=Math.PI/2;parent.add(group);parent=group;
  const owned=[],mats=[],stone=new T.MeshLambertMaterial({color:0xc8b98e}),bronze=new T.MeshLambertMaterial({color:0x786946}),gold=new T.MeshLambertMaterial({color:0xe2c47e});mats.push(stone,bronze,gold);
  let surface=stone;
  if(drawing){surface=new T.ShaderMaterial({uniforms:{reference:{value:drawing}},vertexShader:'varying vec3 vWorld;varying float vLight;void main(){vec4 world=modelMatrix*vec4(position,1.0);vWorld=world.xyz;vec3 n=normalize(mat3(modelMatrix)*normal);vLight=.72+.28*max(dot(n,normalize(vec3(1.0,2.0,1.0))),0.0);gl_Position=projectionMatrix*viewMatrix*world;}',fragmentShader:'uniform sampler2D reference;varying vec3 vWorld;varying float vLight;void main(){vec2 uv=vec2(.5+vWorld.z/96.0,.5+vWorld.x/96.0);vec4 sampleColor=texture2D(reference,uv);float ink=clamp((1.0-dot(sampleColor.rgb,vec3(.299,.587,.114)))*sampleColor.a,0.0,1.0);vec3 color=mix(vec3(.69,.71,.65),vec3(.21,.27,.22),ink)*vLight;gl_FragColor=vec4(color,1.0);\n#include <colorspace_fragment>\n}'});mats.push(surface);}

  const positions=[],indices=[];function quad(a,b,c,d){const k=positions.length/3;for(const p of[a,b,c,d])positions.push(...p);indices.push(k,k+1,k+2,k,k+2,k+3);}
  const z0=-width/2,z1=width/2;
  for(let floor=0;floor<4;floor++)for(let i=0;i<steps;i++){
   const x0=startX-i*tread,x1=x0-tread,y0=base+floor*spacing+i*rise,y=y0+rise;
   quad([x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]);
   quad([x0,y0,z0],[x0,y,z0],[x0,y,z1],[x0,y0,z1]);
   quad([x0,y0-.18,z0],[x0,y,z0],[x1,y,z0],[x1,y0-.18,z0]);
   quad([x1,y0-.18,z1],[x1,y,z1],[x0,y,z1],[x0,y0-.18,z1]);
   quad([x1,y0-.18,z0],[x1,y0-.18,z1],[x0,y0-.18,z1],[x0,y0-.18,z0]);
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();owned.push(geometry);const ramp=new T.Mesh(geometry,surface);ramp.name='Gallery staircase · 160 real treads and vertical risers';ramp.userData={galleryStairs:true,stepCount:160,headWidth,width,widthRatio:1,snakeDrawing:!!drawing,alongSnake:true};parent.add(ramp);
  function beam(a,b,r,mat,name){const delta=new T.Vector3().subVectors(b,a),geo=new T.CylinderGeometry(r,r,delta.length(),8);owned.push(geo);const mesh=new T.Mesh(geo,mat);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());mesh.name=name;parent.add(mesh);}
  const vector=(x,y,z)=>new T.Vector3(x,y,z);
  for(let floor=0;floor<4;floor++){
   const y=base+floor*spacing;
   for(const z of[z0,z1]){beam(vector(startX,y+1.08,z),vector(endX,y+spacing+1.08,z),.045,bronze,'Straight stair handrail');for(let i=0;i<=steps;i+=4){const x=startX-i*tread,h=y+i*rise;beam(vector(x,h,z),vector(x,h+1.08,z),.028,bronze,'Stair rail post');}}
   for(let i=0;i<steps;i++){const x=startX-i*tread,h=y+(i+1)*rise+.008;beam(vector(x,h,z0),vector(x,h,z1),.014,gold,'Visible stair nosing');}
  }
  // Opening guards follow both sides; full-width ends remain open for landing access.
  for(let floor=1;floor<5;floor++)for(const z of[z0-.08,z1+.08]){const y=base+floor*spacing;beam(vector(startX,y+1.08,z),vector(endX,y+1.08,z),.035,bronze,'Gallery stairwell guard');for(const x of[startX,endX,(startX+endX)/2])beam(vector(x,y,z),vector(x,y+1.08,z),.025,bronze,'Landing guard post');}
  return{ramp,group,dispose(){for(const geo of owned)geo.dispose();for(const mat of mats)mat.dispose();}};
 }
 return{headWidth,width,widthRatio:1,spacing,base,steps,rise,tread,run,startX,endX,starts,max,segments,opening,toWorld,toLocal,pointAt,headingAt,floorAt,nearLanding,contains,holeAt,entryAt,resolve,exitAt,build,direction:{x:0,z:1},entrance:{x:58,z:0},head:{x:43,z:0},levels:[0,1,2,3,4].map(f=>toWorld(f===4?landings[3]:{x:startX,z:0,y:base+f*spacing,floor:f,progress:starts[f]}))};
};
})(window);
