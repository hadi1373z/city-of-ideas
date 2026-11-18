import {installHousePatternGuides} from './house-pattern-guides.js?v=sixfold-city-20261118d';
import {PAVILIONS,penroseTriangles,cropHex} from './mathematical-pavilions-model.js';

// The original three public pavilion investigations move into real study rooms
// in the new west/northwest/northeast houses. Their IDs and controls survive;
// no archived home, account, personal notebook or voice is read or rewritten.
const COLLECTIONS=Object.freeze({aperiodic:'west',inflation:'northwest',symmetry:'northeast'});
export function installTransferredPavilions(M,T){
 const releaseGuides=installHousePatternGuides(M),registrations=[];let disposed=false;
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
  registrations.push(network.registerRoomObstacle?.(h.houseId,{x:109,z:0,y:8,radius:3.65}));
  h.update=()=>{if(disposed)return false;const triangles=penroseTriangles(h.depth),positions=[[],[]];
   for(const[kind,a,b,c]of triangles){const p=cropHex([a,b,c],12.9);for(let i=1;i<p.length-1;i++)for(const q of[p[0],p[i+1],p[i]])positions[kind].push(109+q[0]*.22,8.825,q[1]*.22);}
   for(let kind=0;kind<2;kind++){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions[kind],3));g.computeVertexNormals();let mesh=h.meshes[kind];if(mesh){owned.delete(mesh.geometry);mesh.geometry.dispose();mesh.geometry=g;}else{mesh=new T.Mesh(g,tiles[kind]);mesh.userData.mathPavilion=data.id;mesh.userData.houseInstance=h.houseId;patches.add(mesh);targets.push(mesh);M.city.targets.push(mesh);h.meshes[kind]=mesh;}}
   h.counts=[triangles.filter(t=>t[0]===0).length,triangles.filter(t=>t[0]===1).length];
  };h.update();
  registrations.push(network.registerRoomReader(h.houseId,({room,dialog,el,button})=>{if(!disposed&&room.y===8)dialog.append(el('h3',data.name+' · transferred collection'),el('p',data.question),el('p',data.text),button('Work with the original substitution model',()=>{if(disposed||!dialog.open||!inside(h)||pausedExcept(dialog))return;dialog.close();open(data.id);}));}));
 }
 function visit(id){const h=houses.find(h=>h.data.id===id);if(disposed||!h)return false;dialog.close();return network.enterHouse(h.houseId,{x:112.8,z:3.5,y:8,yaw:Math.PI/4,pitch:-.25});}
 function pausedExcept(own=dialog){return document.hidden||M.nightSky?.observing||!!document.querySelector('#map-panel:not([hidden]),#reader-panel:not([hidden]),#exhibit-panel:not([hidden])')||Array.from(document.querySelectorAll('dialog[open]')).some(d=>d!==own);}
 function canChange(h){return !disposed&&current===h&&dialog.open&&inside(h)&&!pausedExcept();}
 function render(){dialog.replaceChildren();const head=el('header');head.append(el('h2',current.data.name),button('Return to walking',()=>dialog.close()));dialog.append(head,el('p','This original pavilion study now lives on the first upper floor of '+current.instance.name+'. Its construction, questions and controls are preserved.'),el('h3',current.data.question),el('p',current.data.text),el('p','Substitution level '+current.depth+' · '+current.counts[0]+' thin half-rhombs · '+current.counts[1]+' thick half-rhombs before the hexagonal crop.'));
  if(inside(current))for(const[label,delta]of[['Coarser patch',-1],['One substitution',1]]){const h=current,b=button(label,()=>{const next=h.depth+delta;if(!canChange(h)||next<1||next>4)return;h.depth=next;h.update();render();});b.disabled=current.depth+delta<1||current.depth+delta>4;dialog.append(b);}
  else{const h=current;dialog.append(button('Visit the physical study table',()=>{if(disposed||current!==h||!dialog.open||pausedExcept())return;visit(h.data.id);}));}
  dialog.append(el('p','A finite original construction, not a proof of an infinite tiling’s aperiodicity. The host house has its own different tiling: compare the symmetry of the table, its room and the whole city.'));
  const link=el('a','Tilings Encyclopedia · matching rules ↗');link.href='https://tilings.math.uni-bielefeld.de/glossary/matching-rules/';link.target='_blank';link.rel='noopener noreferrer';dialog.append(link);
 }
 function open(id){if(disposed||pausedExcept())return false;const candidate=houses.find(h=>h.data.id===id);if(!candidate)return false;current=candidate;M.clearMovement();render();if(!dialog.open)dialog.showModal();return true;}
 const old={start:M.startExtra,target:M.city.targetInfo,show:M.showExtra},start=id=>id?.startsWith('math-pavilion:')?visit(id.slice(14)):old.start?.(id),target=d=>d?.mathPavilion&&PAVILIONS.some(h=>h.id===d.mathPavilion)?{kind:'math-pavilion',data:d,title:PAVILIONS.find(h=>h.id===d.mathPavilion).name}:old.target(d),show=i=>i?.kind==='math-pavilion'?open(i.data.mathPavilion):old.show?.(i);M.startExtra=start;M.city.targetInfo=target;M.showExtra=show;
 const welcome=button('Three mathematical collections',()=>visit('aperiodic'));welcome.className='glass';document.querySelector('.welcome-secondary')?.append(welcome);
 function dispose(){if(disposed)return;disposed=true;releaseGuides?.();for(const release of registrations)if(typeof release==='function')release();for(const t of targets){const i=M.city.targets.indexOf(t);if(i>=0)M.city.targets.splice(i,1);}for(const h of houses)h.group.removeFromParent();for(const r of owned)r.dispose();dialog.close();dialog.remove();welcome.remove();if(M.startExtra===start)M.startExtra=old.start;if(M.city.targetInfo===target)M.city.targetInfo=old.target;if(M.showExtra===show)M.showExtra=old.show;if(M.mathPavilions===api)delete M.mathPavilions;removeEventListener('pagehide',dispose);}
 const api={houses,root,open,visit,dispose,interact(){const h=houses.find(inside);if(disposed||!h||pausedExcept(null))return false;return open(h.data.id);}};M.mathPavilions=api;
 addEventListener('pagehide',dispose,{once:true});return api;
}
