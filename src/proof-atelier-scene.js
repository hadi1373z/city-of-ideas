import {WORKSHOPS} from './proof-atelier-content.js?v=hall-bounds1';
import {TRAP,EXCHANGE,COMPLETE,COSTS,neighborhood,maximumMatching,pathStatus,priceStatus,hallInsight} from './proof-atelier-model.js?v=hall-bounds1';
import {BOARDS} from './study-house-models.js?v=workbench1';
export function buildProofAtelier(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='The Proof Atelier · six connected workshops';group.position.y=.13;
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const chalk=mat(0xe8dfc8),timber=mat(0x71513d),teal=mat(0x274e50),brass=mat(0xb69350),clay=mat(0xb36e51),blue=mat(0x6eacbc),green=mat(0x71976b),dark=mat(0x243d3e),glass=own(new T.MeshLambertMaterial({color:0xb8d1ca,transparent:true,opacity:.12,depthWrite:false,side:T.DoubleSide}));
 const cube=own(new T.BoxGeometry(1,1,1)),sphere=own(new T.SphereGeometry(.13,12,8)),rod=own(new T.CylinderGeometry(.025,.025,1,8));const colliders=[],targets=[],stations=[];
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);p.add(o);return o;};
 const obstacle=(x,z,w,d)=>colliders.push({x,z,w,d});
 function beam(p,a,b,m,r=1){const va=new T.Vector3(...a),vb=new T.Vector3(...b),delta=vb.clone().sub(va),o=new T.Mesh(rod,m);o.position.copy(va).add(vb).multiplyScalar(.5);o.scale.set(r,delta.length(),r);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());p.add(o);return o;}
 function label(p,w,h,x,y,z){const c=canvas();c.width=1024;c.height=Math.round(1024*h/w);const tex=own(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:tex,toneMapped:false})));o.position.set(x,y,z);p.add(o);return {o,paint(text){const ctx=c.getContext('2d');ctx.fillStyle='#eee4c9';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#24464a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=/[\u0600-\u06ff]/.test(text)?'rtl':'ltr';ctx.font=Math.round(c.height*.45)+'px Tahoma';ctx.fillText(text,c.width/2,c.height/2,c.width-30);tex.needsUpdate=true;}};}
 box(group,18,.1,20,215,-.05,-78,chalk);
 // The south opening connects directly to the original House of Proof foyer.
 for(const x of[206.5,223.5]){box(group,1,3.8,.2,x,1.9,-88,chalk);obstacle(x,-88,1,.2);}
 box(group,18,4.7,.2,215,2.35,-68,chalk);obstacle(215,-68,18,.2);
 for(const x of[206,224]){
  box(group,.18,.65,20,x,.325,-78,teal);box(group,.12,.55,20,x,4.42,-78,timber);box(group,.03,3.5,20,x,2.4,-78,glass);obstacle(x,-78,.18,20);
  for(const z of[-88,-84,-80,-76,-72,-68])box(group,.18,4.3,.18,x,2.15,z,timber);
 }
 for(const z of[-81.5,-75.5])for(const x of[210,220]){box(group,6.4,1.05,.18,x,.525,z,chalk);obstacle(x,z,6.4,.18);box(group,6.4,.1,.22,x,1.1,z,brass);}
 // Curved timber ribs and alternating roof bands admit actual sky/light.
 for(const z of[-88,-84,-80,-76,-72,-68]){
  const pts=Array.from({length:25},(_,i)=>new T.Vector3(206+i*.75,4.6+2.5*Math.sin(i/24*Math.PI),z)),curve=new T.CatmullRomCurve3(pts);
  group.add(new T.Mesh(own(new T.TubeGeometry(curve,32,.075,6,false)),timber));
 }
 for(let j=0;j<6;j++){
  const vertices=[],indices=[];for(let i=0;i<=24;i++){const x=206+i*.75,y=4.65+2.5*Math.sin(i/24*Math.PI);vertices.push(x,y,-88+j*(20/6),x,y,-85.6+j*(20/6));if(i<24){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const material=own(new T.MeshLambertMaterial({color:j%2?0x375d5c:0xb7ad91,side:T.DoubleSide}));group.add(new T.Mesh(geo,material));
 }
 for(const x of[213.6,216.4])box(group,.035,.012,19.7,x,.012,-78,brass);
 for(const data of WORKSHOPS){
  const p=new T.Group();p.name=data.names.en;p.position.set(data.side<0?206.35:223.65,2.35,data.z);p.rotation.y=data.side<0?Math.PI/2:-Math.PI/2;group.add(p);
  for(const x of[-2.18,2.18])box(p,.13,4.2,.16,x,-.25,-.08,timber);obstacle(p.position.x,data.z,.45,4.6);box(p,4.5,3.6,.12,0,0,-.08,timber);box(p,4.3,3.4,.08,0,0,0,dark);const title=label(p,4.15,.38,0,1.47,.065),readout=label(p,4.1,.32,0,-1.45,.065);targets.push(p);
  // Each room has a reading ledge and a seated place to work, outside the spine.
  const deskX=data.side<0?208.2:221.8;box(group,2.5,.12,2.5,deskX,.9,data.z,timber);for(const x of[deskX-1,deskX+1])box(group,.15,.84,2.1,x,.42,data.z,timber);obstacle(deskX,data.z,2.5,2.5);
  box(group,.8,.05,1.15,deskX,.985,data.z,chalk);const seatX=data.side<0?210.4:219.6;box(group,.85,.16,1.5,seatX,.48,data.z,teal);for(const dx of[-.3,.3])for(const dz of[-.55,.55])box(group,.12,.4,.12,seatX+dx,.2,data.z+dz,timber);obstacle(seatX,data.z,.9,1.5);
  const edges=[],nodes=[],tiles=[],labels=[],dominoes=[];
  if(data.id==='colour'){
   for(let i=0;i<16;i++)tiles.push(box(p,.47,.47,.08,(i%4-1.5)*.52,.12-(Math.floor(i/4)-1.5)*.52,.09,i%2?chalk:teal));
   for(let i=0;i<8;i++){const d=box(p,.95,.42,.04,0,0,.16,brass);d.visible=false;dominoes.push(d);}
  }else if(data.id==='prices'){
   for(let i=0;i<9;i++){const x=(i%3-1)*1.05,y=.15-(Math.floor(i/3)-1)*.66;tiles.push(box(p,.97,.56,.08,x,y,.09,chalk));const text=label(p,.85,.42,x,y,.14);text.paint(String(COSTS[Math.floor(i/3)][i%3]));labels.push(text);} for(let i=0;i<3;i++){label(p,.5,.28,-1.77,.15-(i-1)*.66,.14).paint('L'+(i+1));label(p,.5,.28,(i-1)*1.05,1.14,.14).paint('R'+(i+1));}label(p,3.8,.25,0,-1.04,.14).paint('cost / slack · green = tight');
  }else{
   const point=v=>[v<4?-1.45:1.45,.98-(v%4)*.65,.1];
   for(let i=0;i<16;i++){const a=Math.floor(i/4),b=i%4;edges.push(beam(p,point(a),point(4+b),timber));}
   for(let v=0;v<8;v++){const o=new T.Mesh(sphere,v<4?brass:blue);o.position.set(...point(v));o.position.z=.14;p.add(o);nodes.push(o);const text=label(p,.45,.27,(v<4?-1.84:1.84),point(v)[1],.15);text.paint((v<4?'L':'R')+(v%4+1));}
  }
  p.traverse(o=>{o.userData={...o.userData,proofStation:data.id};});
  const station={data,group:p,title,readout,edges,nodes,tiles,labels,dominoes,view:{x:215,z:data.z,y:.13,yaw:data.side<0?Math.PI/2:-Math.PI/2},paint(lang){title.paint(data.number+' · '+(data.names[lang]||data.names.en));}};stations.push(station);
 }
 // Only fixed architecture is batched. All experiment meshes remain individually
 // addressable, so edits never depend on rebuilding a whole room.
 const batches=[],byMaterial=new Map();for(const o of group.children){if(o.isMesh&&o.geometry===cube){if(!byMaterial.has(o.material))byMaterial.set(o.material,[]);byMaterial.get(o.material).push(o);}}
 for(const [material,list]of byMaterial){if(list.length<3)continue;const batch=new T.InstancedMesh(cube,material,list.length);batch.name='Fixed atelier furniture and walls';list.forEach((o,i)=>{o.updateMatrix();batch.setMatrixAt(i,o.matrix);o.removeFromParent();});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere?.();group.add(batch);batches.push(batch);}
 const entry={x:215,z:-86.5,y:.13,yaw:Math.PI};let last='';
 function update(s,lang='en'){
  const key=JSON.stringify([s.board,s.tiling,s.repairEdges,s.subset,s.hallMatching,s.exchange,s.path,s.cover,s.assignment,s.u,s.v,s.capEdges,s.capS,s.capM,s.capCover,lang]);if(key===last)return;last=key;
  for(const h of stations){h.paint(lang);const id=h.data.id;
   if(id==='colour'){const board=BOARDS[s.board===0?2:0].cells;h.tiles.forEach((o,i)=>{o.visible=board.includes(i);o.material=(Math.floor(i/4)+i%4)%2?chalk:teal;});h.dominoes.forEach((o,i)=>{const pair=s.tiling[i];o.visible=!!pair&&pair.every(n=>board.includes(n));if(pair){const[a,b]=pair;o.position.x=((a%4+b%4)/2-1.5)*.52;o.position.y=.12-((Math.floor(a/4)+Math.floor(b/4))/2-1.5)*.52;o.rotation.z=Math.floor(a/4)===Math.floor(b/4)?0:Math.PI/2;}});h.readout.paint(s.tiling.length+' dominoes · '+board.length+' squares');}
   else if(id==='prices'){const result=priceStatus(s.assignment,s.u,s.v);h.tiles.forEach((tile,i)=>{tile.material=result.violations.includes(i)?clay:s.assignment[Math.floor(i/3)]===i%3?brass:Math.abs(s.u[Math.floor(i/3)]+s.v[i%3]-COSTS[Math.floor(i/3)][i%3])<1e-9?green:chalk;});h.labels.forEach((text,i)=>{const c=COSTS[Math.floor(i/3)][i%3],slack=result.bound===null?'—':Math.round((c-s.u[Math.floor(i/3)]-s.v[i%3])*1e6)/1e6;text.paint(c+' / '+slack);});h.readout.paint('Cost '+(result.cost??'—')+' · floor '+(result.feasible?result.bound:'—')+' · gap '+(result.gap??'—'));}
   else{
    const graph=id==='hall'?s.repairEdges:id==='exchange'?EXCHANGE:id==='duality'?TRAP:s.capEdges;
    const matching=id==='hall'?(s.hallMatching||[]):id==='exchange'?s.exchange:id==='duality'?maximumMatching(TRAP):id==='studio'?s.capM:[],subset=id==='hall'?s.subset:id==='studio'?s.capS:[],cover=id==='duality'?s.cover:id==='studio'?s.capCover:[],near=neighborhood(graph,subset),path=id==='exchange'?pathStatus(EXCHANGE,s.exchange,s.path).edges||[]:[];
    h.edges.forEach((o,i)=>{o.visible=graph.includes(i);o.material=path.includes(i)?(matching.includes(i)?clay:blue):matching.includes(i)?brass:timber;o.scale.x=o.scale.z=matching.includes(i)||path.includes(i)?2.4:1;});
    h.nodes.forEach((o,i)=>{o.material=cover.includes(i)?green:i<4&&subset.includes(i)?brass:i>=4&&near.includes(i-4)?blue:chalk;});h.readout.paint(id==='hall'?'Matching '+matching.length+' ≤ maximum ≤ '+hallInsight(graph,subset,matching).upper:id==='exchange'?(pathStatus(EXCHANGE,s.exchange,s.path).complete?'Preview '+matching.length+' → '+pathStatus(EXCHANGE,s.exchange,s.path).flipped.length:'Matching '+matching.length+' · path '+s.path.length):id==='duality'?'Matching 3 · cover '+cover.length:graph.length+' edges · matching '+matching.length);
   }
  }
 }
 return {group,stations,targets,entry,inside:(x,z)=>x>206.2&&x<223.8&&z>-87.9&&z<-68.2,canStand:(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&!colliders.some(b=>Math.abs(x-b.x)<b.w/2+.22&&Math.abs(z-b.z)<b.d/2+.22),colliders,update,dispose(){group.removeFromParent();for(const b of batches)b.dispose?.();for(const r of owned)r.dispose();group.clear();}};
}
