async function loadAcademicGLB(id) {
 if(['socrates','nietzsche','zarathustra'].includes(id)){
  const actor=id==='socrates'?buildSocratesGuide(THREE):buildLiteraryCharacter(THREE,id);
  actor.id=id;actor.restored=true;actor.face=null;actor.animations=[];actor.style='restored-illustrated-v1';return actor;
 }
 const encoded=window.CITY_CHARACTER_ASSETS[id],raw=atob(encoded),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 const gltf=await new GLTFLoader().parseAsync(bytes.buffer,'');
 return academicActorFromGLTF(gltf,id);
}
function academicActorFromGLTF(gltf,id){
 const group=gltf.scene,body=group.getObjectByName('Spine'),head=group.getObjectByName('Head');
 const names=['Arms','Elbows','Legs','Knees'],parts=Object.fromEntries(names.map(k=>[k.toLowerCase(),['Left','Right'].map(s=>group.getObjectByName(s+k))]));
 const face=group.getObjectByName(id+'-continuous-face-neck')||null,drapes=[];
 group.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.frustumCulled=false;if(o.morphTargetDictionary?.seatedDrape!==undefined)drapes.push(o);}});
 const bases=new Map();parts.legs.forEach(b=>bases.set(b,b.position.clone()));
 function animate(time,{seated=false,talking=false,walking=false,reducedMotion=false}={}){
  const t=Number.isFinite(time)?time:0,motion=!reducedMotion,gait=walking&&!seated&&motion?Math.sin(t*5.6)*.17:0;
  body.position.y=(seated?-.32:0)+(motion?Math.sin(t*1.6)*.0015:0);
  head.rotation.set(talking&&motion?Math.sin(t*1.3)*.012:0,talking&&motion?Math.sin(t*.8)*.025:0,talking&&motion?Math.sin(t*1.9)*.014:0);
  for(let i=0;i<2;i++){
   parts.legs[i].position.copy(bases.get(parts.legs[i]));if(seated)parts.legs[i].position.y=.64;
   parts.legs[i].rotation.set(seated?1.277:gait*(i?1:-1),0,0);parts.knees[i].rotation.set(seated?-1.277:0,0,0);
   parts.arms[i].rotation.set(seated?.3:-gait*(i?1:-1),0,0);parts.elbows[i].rotation.set(seated?1.64:0,0,0);
  }
  if(talking&&motion){parts.arms[0].rotation.x-=Math.sin(t*1.7)*.014;parts.arms[0].rotation.z=.02+Math.sin(t*2)*.012;}
  const phase=((t+(id==='ramsey'?.7:2.3))%6+6)%6,blink=motion?Math.max(0,1-Math.abs(phase-5.85)/.10):0;
  if(face){face.morphTargetInfluences[0]=blink;face.morphTargetInfluences[1]=blink;
  face.morphTargetInfluences[2]=talking&&motion?.045+Math.abs(Math.sin(t*6.4))*.09:0;
  face.morphTargetInfluences[3]=talking?.045:0;}
  for(const m of drapes)m.morphTargetInfluences[m.morphTargetDictionary.seatedDrape]=seated?1:0;
 }
 function dispose(){const geometries=new Set(),materials=new Set(),skeletons=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);if(o.skeleton)skeletons.add(o.skeleton);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());skeletons.forEach(s=>s.dispose());group.removeFromParent();}
 animate(0,{reducedMotion:true});
 return{group,body,head,face,drapes,...parts,animate,dispose,id,animations:gltf.animations,style:'unified-glb-cast-v3'};
}
