const LABELS=Object.freeze({
 en:'Mathematics Atlas · working wing · 8 floors',
 de:'Mathematik-Atlas · Arbeitsflügel · 8 Geschosse',
 fa:'اطلس ریاضیات · بالِ کاری · ۸ طبقه',
 cs:'Matematický atlas · pracovní křídlo · 8 pater'
});
const near=(a,b)=>Math.abs(a-b)<1e-5;
// Read only the original public working-wing meshes; custom/missing rooms yield.
export function mathEntranceSource(model){
 if(model?.floor!==0||model.height!==0||!['Mathematics City','Mathematics original level 1'].includes(model.group?.name)||!['sets','numbers','functions'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const meshes=[];model.group.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh)meshes.push(o);});
 const box=(w,h,d,x,y,z)=>meshes.find(o=>{const p=o.geometry?.parameters||{},v=o.position;return near(p.width,w)&&near(p.height,h)&&near(p.depth,d)&&near(v.x,x)&&near(v.y,y)&&near(v.z,z);});
 const canopy=box(5.4,.27,2.1,0,3.15,8.45),plinth=box(50,.12,54,0,-.1,9),columns=[-2.22,2.22].map(x=>box(.38,3.15,.7,x,1.575,8.35));
 const signs=[['THE MATHEMATICS ATLAS',5.3,.58,2.74],['Eight floors of ideas · Enter here',4.9,.4,2.27]].map(([label,w,h,y])=>meshes.find(o=>o.userData.label===label&&!o.userData.mathAction&&!o.userData.cityAction&&near(o.position.x,0)&&near(o.position.y,y)&&near(o.position.z,9.52)&&near(o.scale.x,w)&&near(o.scale.y,h)&&o.geometry?.type==='PlaneGeometry'));
 const roof=meshes.find(o=>o.name==='Mathematics building roof'&&o.userData.roof===true),ceiling=box(25.8,.24,19.8,0,31.95,-1);
 if(!canopy||!plinth||columns.some(o=>!o)||signs.some(o=>!o)||!roof||!ceiling)return null;
 return{canopy,plinth,columns,signs,roof,ceiling,plinthTop:plinth.position.y+plinth.geometry.parameters.height/2,columnBase:0};
}
export function facultyEntranceSource(T,model,faculty){
 if(faculty?.group?.userData.mathFaculty!==true)return null;
 const meshes=[],parts=[],v=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();faculty.group.traverse(o=>{if(!o.isMesh)return;if(!o.isInstancedMesh){meshes.push(o);return;}for(let i=0;i<o.count;i++){const matrix=new T.Matrix4();o.getMatrixAt(i,matrix);matrix.decompose(v,q,scale);parts.push({mesh:o,index:i,matrix,position:v.clone(),scale:scale.clone(),straight:Math.abs(q.x)+Math.abs(q.y)+Math.abs(q.z)<1e-5,bounds:new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(matrix)});}});
 const part=(w,h,d,x,y,z)=>parts.find(p=>p.straight&&near(p.scale.x,w)&&near(p.scale.y,h)&&near(p.scale.z,d)&&near(p.position.x,x)&&near(p.position.y,y)&&near(p.position.z,z));
 const label=meshes.find(o=>o.name==='FACULTY OF MATHEMATICS'&&!o.userData.mathAction&&near(o.geometry?.parameters?.width,7.2)&&near(o.geometry?.parameters?.height,.55)&&near(o.position.x,-80)&&near(o.position.y,3.4)&&near(o.position.z,9.65));
 const porch=part(8.6,.24,12.6,-80,4.06,15.2),ceiling=part(26.8,.25,20.6,-80,32.12,-1),front=part(25.4,.29,.52,-80,31.82,8.45),back=part(25.4,.29,.52,-80,31.82,-10.45),left=part(.48,.29,19.5,-92.5,31.82,-1),right=part(.48,.29,19.5,-67.5,31.82,-1),rail=part(6.9,.08,.10,-80,3.03,9.67);
 if(!label||!porch||!ceiling||!front||!back||!left||!right||!rail)return null;
 model.group.updateWorldMatrix(true,false);faculty.group.updateWorldMatrix(true,false);const mapping=model.group.matrixWorld.clone().invert().multiply(faculty.group.matrixWorld);mapping.decompose(v,q,scale);if(Math.abs(q.x)+Math.abs(q.y)+Math.abs(q.z)>1e-5||![scale.x,scale.y,scale.z].every(n=>near(n,1)))return null;
 const toSource=p=>new T.Vector3(...p).applyMatrix4(mapping),inverse=mapping.clone().invert(),walks=parts.filter(p=>near(p.scale.y,.08)&&near(p.bounds.max.y,.13));
 const covered=[-2.22,2.22].map(x=>{const foot=new T.Box3(new T.Vector3(x-.19,0,8),new T.Vector3(x+.19,0,8.7)).applyMatrix4(inverse);return walks.some(p=>p.bounds.min.x<=foot.min.x+1e-5&&p.bounds.max.x>=foot.max.x-1e-5&&p.bounds.min.z<=foot.min.z+1e-5&&p.bounds.max.z>=foot.max.z-1e-5&&near(p.bounds.max.y,foot.min.y));});
 const gap=ceiling.bounds.min.y-front.bounds.max.y;if(gap<-.00001||gap>.04||![back,left,right].every(p=>near(p.bounds.max.y,front.bounds.max.y)))return null;
 return{label,porch,ceiling,front,back,left,right,rail,mapping,toSource,covered,gap};
}
export function buildMathWingEntrance(T,model,{canvas=()=>globalThis.document?.createElement('canvas'),faculty}={}){
 const source=mathEntranceSource(model);if(!source)return null;
 const installed=faculty?facultyEntranceSource(T,model,faculty):null;if(faculty&&!installed)return null;
 const c=canvas(),ctx=c?.getContext?.('2d');if(!ctx)return null; // Keep original signs if replacement text cannot be drawn.
 const group=new T.Group();group.name='Working-wing entrance · supported canopy identification';group.userData={animated:true,mathWingEntrance:true};
 const owned=new Set(),own=r=>(owned.add(r),r),unit=own(new T.BoxGeometry(1,1,1)),wood=own(new T.MeshStandardMaterial({color:'#806d55',roughness:.9})),stone=own(new T.MeshStandardMaterial({color:'#c3b69a',roughness:.9})),soles=[],braces=[],hangers=[],clips=[],bearings=[];
 function box(name,w,h,d,x,y,z,material=wood){const m=new T.Mesh(unit,material);m.name=name;m.scale.set(w,h,d);m.position.set(x,y,z);m.userData={mathEntranceDetail:true,animated:true};group.add(m);return m;}
 function bar(name,a,b,width=.08){const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from),mid=from.add(to).multiplyScalar(.5),m=box(name,width,delta.length(),width,mid.x,mid.y,mid.z);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
 for(const[i,x]of[-2.22,2.22].entries()){
  if(!installed?.covered[i])soles.push(box('Canopy column sole · meets existing plinth',.38,-source.plinthTop,.7,x,source.plinthTop/2,8.35,stone));
  braces.push(bar('Canopy transverse knee joint',[x,2.55,8.35],[Math.sign(x)*1.62,3.02,8.35]));
  braces.push(bar('Canopy front-overhang knee joint',[x,2.55,8.35],[x,3.02,9.32]));
 }
 let backing,faceSize,facePoint;
 if(installed){
  const p=installed.toSource([-80,3.4,9.62]);backing=box('Working-wing identification · suspended below actual porch roof',7.2,.55,.08,p.x,p.y,p.z);faceSize=[7.02,.47];facePoint=installed.toSource([-80,3.4,9.6608]);
  for(const x of[-82.9,-77.1]){const a=installed.toSource([x,3.66,9.62]),b=installed.toSource([x,installed.porch.bounds.min.y+.015,9.62]);hangers.push(bar('Porch-roof-supported identification hanger',a.toArray(),b.toArray(),.025));const c=installed.toSource([x,3.03,9.67]),d=installed.toSource([x,3.14,9.67]);clips.push(bar('Identification lower rail attachment',c.toArray(),d.toArray(),.035));}
  if(installed.gap>1e-5){const y=(installed.front.bounds.max.y+installed.ceiling.bounds.min.y)/2,midWidth=installed.right.bounds.min.x-installed.left.bounds.max.x;for(const part of[installed.left,installed.right]){const p=installed.toSource([part.position.x,y,part.position.z]);bearings.push(box('Installed roof bearing · side header contact',part.scale.x,installed.gap,part.scale.z,p.x,p.y,p.z,stone));}for(const part of[installed.front,installed.back]){const p=installed.toSource([-80,y,part.position.z]);bearings.push(box('Installed roof bearing · end header contact',midWidth,installed.gap,part.scale.z,p.x,p.y,p.z,stone));}}
 }else{backing=box('Identification backing · fitted to original canopy fascia',5.3,.24,.045,0,3.15,9.5075);faceSize=[5.15,.20];facePoint=new T.Vector3(0,3.15,9.5308);}
 c.width=1536;c.height=128;const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;
 const material=own(new T.MeshBasicMaterial({map:texture,side:T.FrontSide,toneMapped:false})),face=new T.Mesh(own(new T.PlaneGeometry(...faceSize)),material);face.name='Entry-facing working-wing identification';face.position.copy(facePoint);group.add(face);
 let language=null;function setLanguage(next){next=LABELS[next]?next:'en';if(next===language)return;language=next;ctx.fillStyle='#354c48';ctx.fillRect(0,0,1536,128);ctx.fillStyle='#efe2bd';ctx.font='bold 44px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=next==='fa'?'rtl':'ltr';ctx.fillText(LABELS[next],768,66,1450);texture.needsUpdate=true;}setLanguage('en');
 const retired=[...source.signs,...(installed?[installed.label]:[])].map(o=>({o,visible:o.visible}));for(const r of retired)r.o.visible=false;
 model.group.add(group);let disposed=false;
 return{group,source,installed,soles,braces,hangers,clips,bearings,backing,face,texture,retired,setLanguage,get language(){return language;},dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of retired)r.o.visible=r.visible;for(const r of owned)r.dispose();group.clear();}};
}
export function installMathWingEntrance(M,T,E,options={}){
 let owner=null,facultyOwner=null,built=null,disposed=false;const prior=M.city.update;
 function sync(){const f=M.worldCylinder?.faculty;if(disposed||owner===E.mathModels?.[0]&&facultyOwner===f)return;built?.dispose();built=null;owner=E.mathModels?.[0];facultyOwner=f;if(owner)built=buildMathWingEntrance(T,owner,{...options,faculty:f});}
 function render(){built?.setLanguage(globalThis.CITY_I18N?.lang||'en');}
 const update=(...args)=>{prior(...args);sync();render();};M.city.update=update;
 const api={sync,dispose(){if(disposed)return;disposed=true;built?.dispose();built=null;if(M.city.update===update)M.city.update=prior;globalThis.removeEventListener?.('city-language',render);if(M.mathWingEntrance===api)delete M.mathWingEntrance;},get built(){return built;}};
 sync();render();M.mathWingEntrance=api;globalThis.addEventListener?.('city-language',render);globalThis.addEventListener?.('pagehide',api.dispose,{once:true});return api;
}
