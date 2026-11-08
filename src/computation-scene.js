import {LIFE_W,LIFE_H,CA_W} from './computation-models.js?v=1';
export function paintComputation(canvas,id,s,cursor=-1){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.fillStyle='#142f33';c.fillRect(0,0,w,h);c.textAlign='left';c.textBaseline='middle';c.font='24px Tahoma';c.fillStyle='#f0e4bd';
 if(id==='life'){
  c.fillText('CONWAY’S LIFE · B3/S23',24,35);const size=Math.min((w-48)/LIFE_W,(h-122)/LIFE_H),x0=(w-size*LIFE_W)/2,y0=72;
  s.cells.forEach((alive,k)=>{c.fillStyle=k===cursor?'#e5b75f':alive?'#a9ceab':'#24474b';c.fillRect(x0+(k%LIFE_W)*size+1,y0+Math.floor(k/LIFE_W)*size+1,size-2,size-2);});
  c.fillStyle='#f0e4bd';c.font='20px Tahoma';c.fillText('Generation '+s.generation+' · live '+s.cells.filter(Boolean).length+' · '+(s.boundary==='wrap'?'wrapped edges':'dead edges'),24,h-25);
 }else if(id==='ca'){
  c.fillText('RULE '+s.rule+' · TIME FLOWS DOWN',24,35);const cw=(w-48)/CA_W,ch=(h-122)/41;s.rows.forEach((row,y)=>row.forEach((alive,x)=>{c.fillStyle=alive?'#e6c17d':'#24474b';c.fillRect(24+x*cw,72+y*ch,cw-.5,ch-.5);}));c.fillStyle='#f0e4bd';c.font='20px Tahoma';c.fillText('Generations '+(s.generation-s.rows.length+1)+'–'+s.generation+' · 61 cells · '+(s.boundary==='wrap'?'wrapped':'dead edges'),24,h-25);
 }else{
  c.fillText('TURING TAPE · '+s.program.toUpperCase()+' INCREMENT',24,35);c.font='28px Consolas';c.fillText('State: '+s.state+'    Head: '+s.head+'    Steps: '+s.steps,24,110);
  const size=(w-48)/15;for(let i=-7;i<=7;i++){const x=24+(i+7)*size;c.fillStyle=i===0?'#e5b75f':'#34575b';c.fillRect(x+1,190,size-2,100);c.fillStyle=i===0?'#213c3e':'#f0e4bd';c.textAlign='center';c.fillText(s.tape[s.head+i]||'_',x+size/2,238);c.font='15px Consolas';c.fillStyle='#b8cfc4';c.fillText(String(s.head+i),x+size/2,312);c.font='28px Consolas';}c.textAlign='left';c.font='22px Tahoma';c.fillStyle='#f0e4bd';const last=s.trace.at(-1);c.fillText(last?last.state+' / '+last.read+' → write '+last.write+', '+(last.move===1?'right':last.move===-1?'left':'stay')+', '+last.next:'Read one symbol; apply one transition.',24,390);c.fillText(s.halted?'HALTED · this run has finite evidence':s.steps>=4096?'BUDGET REACHED · not a non-halting proof':'Fifteen visible cells · tape extends both ways',24,h-30);
 }
}
export function buildComputationScene(T,home,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Computation models · three working exhibits';home.add(group);const owned=new Set(),own=r=>(owned.add(r),r),cube=own(new T.BoxGeometry(1,1,1)),wood=own(new T.MeshLambertMaterial({color:0x5a5142})),brass=own(new T.MeshLambertMaterial({color:0xbca16e})),boards={},targets=[];
 function box(p,w,h,d,x,y,z,m){const o=new T.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);p.add(o);}
 for(const[id,x,z,yaw]of[['life',-7.72,-1.4,Math.PI/2],['ca',7.72,-1.4,-Math.PI/2],['tape',0,-5.62,0]]){
  const p=new T.Group();p.position.set(x,0,z);p.rotation.y=yaw;group.add(p);box(p,4.8,3.15,.12,0,2.2,0,wood);for(const x of[-2.33,2.33])box(p,.1,3.75,.16,x,1.875,0,brass);
  const c=canvas();c.width=1024;c.height=640;const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(4.55,2.94)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));mesh.position.set(0,2.2,.075);p.add(mesh);p.traverse(o=>o.userData={computationModel:id,dynamic:true});targets.push(p);boards[id]={group:p,canvas:c,texture};
 }
 const point=new T.Vector3();let last='';return {group,boards,targets,canStand(x,z){if(!Number.isFinite(x)||!Number.isFinite(z))return false;home.updateWorldMatrix(true,false);point.set(x,home.position.y,z);home.worldToLocal(point);return ![-7.72,7.72].some(side=>Math.abs(point.x-side)<.34&&Math.abs(point.z+1.4)<2.64);},update(s){const key=JSON.stringify([s.life.cells,s.life.generation,s.life.boundary,s.ca.rows,s.ca.generation,s.ca.rule,s.ca.boundary,s.tape]);if(key===last)return;last=key;for(const id of['life','ca','tape']){paintComputation(boards[id].canvas,id,s[id]);boards[id].texture.needsUpdate=true;}},dispose(){group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
