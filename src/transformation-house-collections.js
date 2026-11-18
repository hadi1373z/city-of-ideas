import {installHousePatternGuides} from './house-pattern-guides.js';
import {PAVILIONS,penroseTriangles,cropHex} from './mathematical-pavilions-model.js';

// The original three public pavilion investigations move into real study rooms
// in the new west/northwest/northeast houses. Their IDs and controls survive;
// no archived home, account, personal notebook or voice is read or rewritten.
const COLLECTIONS=Object.freeze({aperiodic:'west',inflation:'northwest',symmetry:'northeast'});
export function installTransferredPavilions(M,T){
 installHousePatternGuides(M);
 const network=M.transformationHouse,owned=new Set(),own=r=>(owned.add(r),r),houses=[],targets=[],root=new T.Group();root.name='Original pavilion collections · now inside the six houses';
 const material=colour=>own(new T.MeshLambertMaterial({color:colour,side:T.DoubleSide})),tiles=[material(0x4f8586),material(0xd8b875)],stone=material(0xb4aa92),brass=material(0xb59a64);
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;},button=(text,fn)=>{const n=el('button',text);n.type='button';n.onclick=fn;return n;};
 const dialog=el('dialog');dialog.id='math-pavilion-study';dialog.lang='en';dialog.dir='ltr';dialog.setAttribute('aria-label','Mathematical pavilion collection');document.body.append(dialog);let current=null;
 const inside=h=>{const r=network.roomAtPlayer();return M.mode==='city'&&network.active&&r?.houseId===h.houseId&&r.y===8;};
 for(const data of PAVILIONS){
  const instance=network.built.instances.find(h=>h.id===COLLECTIONS[data.id]),group=new T.Group();group.name=data.name+' · preserved study collection';instance.detail.add(group);
  const pedestal=new T.Mesh(own(new T.CylinderGeometry(3.25,3.45,.8,6)),stone);pedestal.position.set(109,8.4,0);group.add(pedestal);
  const rim=new T.Mesh(own(new T.TorusGeometry(3.02,.035,5,48)),brass);rim.rotation.x=Math.PI/2;rim.position.set(109,8.83,0);group.add(rim);
  const patches=new T.Group();group.add(patches);const h={data,group,patches,depth:3,houseId:instance.id,instance,counts:[],meshes:[]};houses.push(h);
  network.registerRoomObstacle?.(h.houseId,{x:109,z:0,y:8,radius:3.65});
  h.update=()=>{const triangles=penroseTriangles(h.depth),positions=[[],[]];
   for(const[kind,a,b,c]of triangles){const p=cropHex([a,b,c],12.9);for(let i=1;i<p.length-1;i++)for(const q of[p[0],p[i+1],p[i]])positions[kind].push(109+q[0]*.22,8.825,q[1]*.22);}
   for(let kind=0;kind<2;kind++){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions[kind],3));g.computeVertexNormals();let mesh=h.meshes[kind];if(mesh){owned.delete(mesh.geometry);mesh.geometry.dispose();mesh.geometry=g;}else{mesh=new T.Mesh(g,tiles[kind]);mesh.userData.mathPavilion=data.id;mesh.userData.houseInstance=h.houseId;patches.add(mesh);targets.push(mesh);M.city.targets.push(mesh);h.meshes[kind]=mesh;}}
   h.counts=[triangles.filter(t=>t[0]===0).length,triangles.filter(t=>t[0]===1).length];
  };h.update();
  network.registerRoomReader(h.houseId,({room,dialog,el,button})=>{if(room.y===8)dialog.append(el('h3',data.name+' · transferred collection'),el('p',data.question),el('p',data.text),button('Work with the original substitution model',()=>{dialog.close();open(data.id);}));});
 }
 function visit(id){const h=houses.find(h=>h.data.id===id);if(!h)return false;dialog.close();network.enterHouse(h.houseId,{x:112.8,z:3.5,y:8,yaw:Math.PI/4,pitch:-.25});return true;}
 function render(){dialog.replaceChildren();const head=el('header');head.append(el('h2',current.data.name),button('Return to walking',()=>dialog.close()));dialog.append(head,el('p','This original pavilion study now lives on the first upper floor of '+current.instance.name+'. Its construction, questions and controls are preserved.'),el('h3',current.data.question),el('p',current.data.text),el('p','Substitution level '+current.depth+' · '+current.counts[0]+' thin half-rhombs · '+current.counts[1]+' thick half-rhombs before the hexagonal crop.'));
  if(inside(current))for(const[label,delta]of[['Coarser patch',-1],['One substitution',1]]){const b=button(label,()=>{if(!inside(current))return;current.depth+=delta;current.update();render();});b.disabled=current.depth+delta<1||current.depth+delta>4;dialog.append(b);}
  else dialog.append(button('Visit the physical study table',()=>visit(current.data.id)));
  dialog.append(el('p','A finite original construction, not a proof of an infinite tiling’s aperiodicity. The host house has its own different tiling: compare the symmetry of the table, its room and the whole city.'));
  const link=el('a','Tilings Encyclopedia · matching rules ↗');link.href='https://tilings.math.uni-bielefeld.de/glossary/matching-rules/';link.target='_blank';link.rel='noopener noreferrer';dialog.append(link);
 }
 function open(id){current=houses.find(h=>h.data.id===id);if(!current)return false;M.clearMovement();render();dialog.showModal();return true;}
 const old={start:M.startExtra,target:M.city.targetInfo,show:M.showExtra};M.startExtra=id=>id?.startsWith('math-pavilion:')?visit(id.slice(14)):old.start?.(id);M.city.targetInfo=d=>d?.mathPavilion?{kind:'math-pavilion',data:d,title:PAVILIONS.find(h=>h.id===d.mathPavilion)?.name}:old.target(d);M.showExtra=i=>i?.kind==='math-pavilion'?open(i.data.mathPavilion):old.show?.(i);
 const welcome=button('Three mathematical collections',()=>visit('aperiodic'));welcome.className='glass';document.querySelector('.welcome-secondary')?.append(welcome);
 const api={houses,root,open,visit,interact(){const h=houses.find(inside);if(!h||document.querySelector('dialog[open]'))return false;open(h.data.id);return true;}};M.mathPavilions=api;
 addEventListener('pagehide',()=>{for(const t of targets){const i=M.city.targets.indexOf(t);if(i>=0)M.city.targets.splice(i,1);}for(const h of houses)h.group.removeFromParent();for(const r of owned)r.dispose();dialog.remove();welcome.remove();},{once:true});return api;
}
