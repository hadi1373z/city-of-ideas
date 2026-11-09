import {WING_STAIRS as S,stairTreads,stairLandings} from './math-wing-stairs-model.js';
import {MATH_CONCEPTS} from './city-source-assets/home-tools/math-city-data.js';
// A reversible architectural adapter around verified public source objects.
export function buildMathWingStairs(T,models,{canvas=()=>globalThis.document?.createElement('canvas')}={}){
  if(models?.length!==8||Array.from({length:8},(_,i)=>models[i]).some((m,i)=>m?.floor!==i||m.height!==i*4||!m.group?.traverse||!Array.isArray(m.colliders)||!MATH_CONCEPTS.filter(c=>c.floor===i).every(c=>m.approaches?.some(a=>a.conceptId===c.id))))return null;
  const group=new T.Group();group.name='Mathematics working wing · continuous two-flight stairwell';group.userData={animated:true,mathWingStairs:true};
  const owned=new Set(),retired=[],removed=[],added=[],slabs=[],treads=[],risers=[],landings=[],rails=[],posts=[],strings=[],piers=[],directions=[],batches=[],parts=new Map();
  const own=r=>(owned.add(r),r),stone=own(new T.MeshStandardMaterial({color:'#c3b69a',roughness:.9})),timber=own(new T.MeshStandardMaterial({color:'#705b40',roughness:.85})),metal=own(new T.MeshStandardMaterial({color:'#8f7952',roughness:.75}));
  function box(name,w,h,d,x,y,z,material=stone){const m=new T.Object3D();m.name=name;m.position.set(x,y,z);m.scale.set(w,h,d);m.updateMatrix();if(!parts.has(material))parts.set(material,[]);parts.get(material).push(m);return m;}
  function bar(name,a,b,width,depth,material=timber){const from=new T.Vector3(...a),to=new T.Vector3(...b),v=to.clone().sub(from),mid=from.add(to).multiplyScalar(.5),m=box(name,width,v.length(),depth,mid.x,mid.y,mid.z,material);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());m.updateMatrix();return m;}
  const near=(a,b)=>Math.abs(a-b)<1e-5,hide=o=>{retired.push({o,visible:o.visible});o.visible=false;};
  for(const model of models){
    model.group.traverse(o=>{
      if(!o.isMesh||o.isInstancedMesh)return;const p=o.geometry?.parameters||{},v=o.position,d=o.userData||{};
      if(d.floorSurface===true&&d.mathLevel>0&&near(p.width,24)&&near(p.height,.22)&&near(p.depth,18)){hide(o);return;}
      if(d.mathAction==='floor'&&near(v.x,5.7)&&near(v.z,7.18)){hide(o);return;}
      if(near(v.x,5.7)&&near(p.width,1.7)&&near(p.depth,.44)&&Array.from({length:5},(_,i)=>i).some(i=>near(v.z,6.2-i*.43)&&near(p.height,.18+i*.17)&&near(v.y,model.height+(.18+i*.17)/2))){hide(o);return;}
      if([4.72,6.68].some(x=>near(v.x,x))&&near(v.y,model.height+1.05)&&near(v.z,5.34)&&near(p.width,.055)&&near(p.height,1.3)&&near(p.depth,2.45))hide(o);
    });
    for(let i=model.colliders.length-1;i>=0;i--){const c=model.colliders[i];if(c.label==='Stair landmark'&&near(c.minX,4.85)&&near(c.maxX,6.55)&&near(c.minZ,4.115)&&near(c.maxZ,6.565)){removed.push({list:model.colliders,index:i,value:c});model.colliders.splice(i,1);}}
  }
  const b=S.opening;
  // Four real slab bands surround each opening. The ground slab stays intact.
  for(let k=1;k<8;k++){
    const y=k*4-.11;
    slabs.push(box('Stair opening · west slab',b.minX+12,.22,18,(-12+b.minX)/2,y,-1));
    slabs.push(box('Stair opening · east slab',12-b.maxX,.22,18,(12+b.maxX)/2,y,-1));
    slabs.push(box('Stair opening · back slab',b.maxX-b.minX,.22,b.minZ+10,(b.minX+b.maxX)/2,y,(-10+b.minZ)/2));
    slabs.push(box('Stair opening · front landing slab',b.maxX-b.minX,.22,8-b.maxZ,(b.minX+b.maxX)/2,y,(8+b.maxZ)/2));
  }
  for(const s of stairTreads())treads.push(box('Walking tread '+s.floor+':'+s.flight+':'+s.index,s.maxX-s.minX,.12,s.maxZ-s.minZ,(s.minX+s.maxX)/2,s.y-.06,(s.minZ+s.maxZ)/2));
  for(const l of stairLandings())landings.push(box('Full-width half-storey landing',l.maxX-l.minX,.14,l.maxZ-l.minZ,(l.minX+l.maxX)/2,l.y-.07,(l.minZ+l.maxZ)/2));
  for(let k=0;k<7;k++){
    const y=k*4;
    for(let i=1;i<=11;i++){
      risers.push(box('Closed lower-flight riser',1.4,S.rise,.035,4.4,y+(i-.5)*S.rise,S.front-(i-1)*S.run-.0175-(i===11?.002:0)));
      risers.push(box('Closed upper-flight riser',1.4,S.rise,.035,6.2,y+2+(i-.5)*S.rise,S.turn+(i-1)*S.run+.0175+(i===11?.002:0)));
    }
    for(const x of[3.68,5.12])strings.push(bar('Lower flight side stringer',[x,y-.055,S.front],[x,y+2-.055,S.turn],.12,.18));
    for(const x of[5.48,6.92])strings.push(bar('Upper flight side stringer',[x,y+2-.055,S.turn],[x,y+4-.055,S.front],.12,.18));
    for(const[x,a,c]of[[3.68,y,y+2],[5.12,y,y+2],[5.48,y+4,y+2],[6.92,y+4,y+2]]){
      rails.push(bar('Continuous flight handrail',[x,a+1.02,S.front],[x,c+1.02,S.turn],.045,.045,metal));
      for(let i=0;i<=5;i++){const z=S.front-(S.front-S.turn)*i/5,h=a+(c-a)*i/5;posts.push(bar('Flight rail post',[x,h,z],[x,h+1.02,z],.035,.035,metal));}
    }
    for(const x of[3.68,6.92])rails.push(bar('Half-storey landing side guard',[x,y+3.02,S.back],[x,y+3.02,S.turn],.045,.045,metal));
    rails.push(bar('Half-storey landing back guard',[3.68,y+3.02,S.back],[6.92,y+3.02,S.back],.045,.045,metal));
    for(const x of[3.68,5.3,6.92])posts.push(bar('Landing guard post',[x,y+2,S.back],[x,y+3.02,S.back],.04,.04,metal));
  }
  // The landing frame bears on the intact ground and meets every slab edge.
  for(const x of[3.65,6.95])for(const z of[2.05,3.35])posts.push(bar('Continuous landing frame',[x,0,z],[x,27.05,z],.12,.12));
  for(let k=0;k<8;k++){
    const y=k*4+1.02;
    for(const x of[3.6,7])rails.push(bar('Floor void side guard',[x,y,S.back],[x,y,S.front],.045,.045,metal));
    rails.push(bar('Floor void back guard',[3.6,y,S.back],[7,y,S.back],.045,.045,metal));
    for(const[x,z]of[[3.6,2],[7,2],[3.6,4.1],[7,4.1],[3.6,6.2],[7,6.2]])posts.push(bar('Floor void guard post',[x,k*4,z],[x,y,z],.04,.04,metal));
  }
  // A continuous front bay makes the actual stairwell legible on the building.
  // Feet meet the existing plaza plinth; tops meet the retained facade soffit.
  for(const x of[2.2,7]){
    piers.push(box('Stair-bay stone foot',.38,.15,.38,x,.035,8.68));
    piers.push(box('Continuous stair-bay timber pier',.18,31.755,.20,x,15.9875,8.68,timber));
    const collider={minX:x-.19,maxX:x+.19,minZ:8.49,maxZ:8.87,label:'Stair-bay pier',floor:0};models[0].colliders.push(collider);added.push({list:models[0].colliders,value:collider});
  }
  for(let k=0;k<8;k++){
    const y=k*4,ceiling=k===7?31.865:y+3.78;
    box('Backed corridor direction board',4.4,.32,.055,0,y+2.7,2.02);
    for(const x of[-1.8,1.8])posts.push(bar('Ceiling-supported direction rod',[x,y+2.86,2],[x,ceiling,2],.025,.025));
    const c=canvas(),ctx=c?.getContext?.('2d');if(!ctx)continue;c.width=1024;c.height=128;
    const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const material=own(new T.MeshBasicMaterial({map:texture,side:T.FrontSide,toneMapped:false})),mesh=new T.Mesh(own(new T.PlaneGeometry(4.25,.27)),material);mesh.name='Entry-facing library / walking stairs and lift directions';mesh.position.set(0,y+2.7,2.05);group.add(mesh);directions.push({canvas:c,ctx,texture,mesh});
  }
  let labelLanguage=null;function setLanguage(lang){const labels={en:['Library','Stairs · lift'],de:['Bibliothek','Treppe · Aufzug'],fa:['کتابخانه','پلکان · آسانسور'],cs:['Knihovna','Schodiště · výtah']};lang=labels[lang]?lang:'en';if(lang===labelLanguage)return;labelLanguage=lang;for(const d of directions){const c=d.ctx;c.fillStyle='#354c48';c.fillRect(0,0,1024,128);c.fillStyle='#efe2bd';c.textBaseline='middle';c.textAlign='center';c.font='bold 41px Georgia';c.direction='ltr';c.fillText('←',50,66);c.fillText('→',974,66);c.direction=lang==='fa'?'rtl':'ltr';c.fillText(labels[lang][0],270,66,370);c.fillText(labels[lang][1],740,66,385);d.texture.needsUpdate=true;}}setLanguage('en');
  for(let k=0;k<8;k++){
    const y=k*4+1.02;rails.push(bar('Guard between the two flights',[5.1,y,S.front],[5.5,y,S.front],.045,.045,metal));
    if(k===0||k===7){const lane=k===0?S.right:S.left;rails.push(bar('Closed end of staircase',[lane.minX,y,S.front],[lane.maxX,y,S.front],.045,.045,metal));for(const x of[lane.minX,lane.maxX])posts.push(bar('End guard post',[x,k*4,S.front],[x,y,S.front],.04,.04,metal));}
  }
  const unit=own(new T.BoxGeometry(1,1,1));for(const[material,rows]of parts){const mesh=new T.InstancedMesh(unit,material,rows.length);mesh.name='Batched walking-stair structure';rows.forEach((row,i)=>mesh.setMatrixAt(i,row.matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();group.add(mesh);batches.push(mesh);}
  let disposed=false;
  return{group,slabs,treads,risers,landings,rails,posts,strings,piers,directions,setLanguage,batches,retired,removed,added,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of retired)r.o.visible=r.visible;for(const r of added){const i=r.list.indexOf(r.value);if(i>=0)r.list.splice(i,1);}for(const r of removed)if(!r.list.includes(r.value))r.list.splice(Math.min(r.index,r.list.length),0,r.value);for(const b of batches)b.dispose();for(const r of owned)r.dispose();group.clear();}};
}
