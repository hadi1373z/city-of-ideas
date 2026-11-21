import {installEscherDescent} from './escher-descent.js?v=wall-rails-20261121';
import {PRINT_STUDIES,dependencyOrder} from './escher-print-studies.js?v=cloister-20261120';
import {ESCHER_DEPTH as D,DEPTH_VIEW,DEPTH_FOCUS,depthFloorAt,depthRoomAt,walkDepth,atGalleryHandoff,perspectiveAligned,tileMismatch,loopResult} from './escher-depth-model.js?v=wall-rails-20261121';
import {buildEscherDepth} from './escher-depth-scene.js?v=wall-rails-20261121';

const ROOM_NAMES={vestibule:'Gallery passage',hall:'Hexagonal vaulted court','hall-gallery':'Upper court gallery','perspective-gallery':'Perspective balcony','tessellation-gallery':'Tessellation balcony','reading-gallery':'Topology balcony','gallery-stair':'Stair to the upper gallery',perspective:'Perspective chamber',tessellation:'Tessellation chamber',reading:'Topology & relations wing',stair:'Stair to the loop chamber',loop:'Lower hexagonal cloister'};
export function installEscherDepth(M,T,{onGalleryExit=null}={}){
 const built=buildEscherDepth(T);M.scene.add(built.group);M.city.targets.push(...built.targets);
 let descent=null;let active=false,disposed=false,lastDoor='park',lighting=null,lastTime=0,cooldown=0,hold=0,solvedPerspective=false,selectedMark=-1;
 let selectedPrint=null;const dependency={a:true,b:true};
 const tess={motif:0,pairX:false,pairZ:false},directions=[1,1,1,1];let galleryExit=onGalleryExit;
 const old={arrive:M.arrive,update:M.city.update,region:M.city.region,target:M.city.targetInfo,show:M.showExtra};
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 const button=(text,fn)=>{const n=el('button',text);n.type='button';n.className='glass';n.onclick=fn;return n;};
 const panel=el('aside');panel.id='escher-depth-context';panel.hidden=true;panel.dir='ltr';panel.lang='en';
 const heading=el('strong','Escher · Depth & Pattern'),location=el('span'),help=el('p'),progress=el('p'),actions=el('div');progress.setAttribute('role','status');
 const examine=button('Explore this experiment',()=>openExhibit()),exit=button('Return through this door',()=>{const p=nearestDoor();if(p)leave(p.id);}),route=button('Locate the gallery passage',()=>{M.clearMovement();M.pointToward?.(D.gallery);M.status?.('Gallery passage: return to the west end of the vestibule at (135, 115).');});
 const court=button('Travel to the central court',()=>travel('court')),upper=button('Travel to the upper gallery',()=>travel('upper'));
 actions.append(examine,exit,route,court,upper);panel.append(heading,location,help,progress,actions);document.body.append(panel);
 const portalButton=button('Enter the underground museum',()=>{const p=nearestSurfaceDoor();if(p)enter(p.id);});portalButton.id='escher-depth-enter';portalButton.hidden=true;portalButton.lang='en';document.body.append(portalButton);
 const dialog=el('dialog');dialog.id='escher-depth-experiment';dialog.dir='ltr';dialog.lang='en';dialog.dataset.confirmFocused='true';const head=el('header'),title=el('h2'),close=button('Close',()=>dialog.close()),body=el('div');title.id='escher-depth-experiment-title';dialog.setAttribute('aria-labelledby',title.id);head.append(title,close);dialog.append(head,body);document.body.append(dialog);dialog.addEventListener('close',()=>M.clearMovement());
 const blocked=()=>document.hidden||!!document.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 const gateOpen=p=>!p.gated||!!globalThis.window?.CITY_ESCHER?.passageOpen;
 const valid=()=>M.mode==='city'&&depthFloorAt(M.player.x,M.player.z,M.player.y-M.eye)!==null&&Math.abs(M.player.y-M.eye-depthFloorAt(M.player.x,M.player.z,M.player.y-M.eye))<.45;
 const distance=p=>Math.hypot(M.player.x-p.x,M.player.z-p.z);
 function nearestSurfaceDoor(){
  if(active||M.mode!=='city')return null;
  return D.portals.filter(p=>Math.abs(M.player.y-M.eye-(M.cityGroundHeight?.(p.x,p.z)??p.y))<1.1&&distance(p)<3.4).sort((a,b)=>distance(a)-distance(b))[0]??null;
 }
 function nearestExhibit(){return active?D.exhibits.filter(p=>Math.abs(M.player.y-M.eye-p.y)<.4&&distance(p)<4.1).sort((a,b)=>distance(a)-distance(b))[0]??null:null;}
 function nearestDoor(){return active?D.portals.find(p=>p.id!=='escher'&&distance(p.landing)<3.2&&Math.abs(M.player.y-M.eye-p.landing.y)<.4)??null:null;}
 function restoreLight(){
  if(!lighting)return;
  if(lighting.background&&M.scene.background?.copy)M.scene.background.copy(lighting.background);
  if(lighting.fog&&M.scene.fog){M.scene.fog.color.copy(lighting.fog);M.scene.fog.density=lighting.density;}lighting=null;built.lamps.visible=false;
 }
 function setLight(){
  if(!lighting)lighting={background:M.scene.background?.clone?.(),fog:M.scene.fog?.color.clone(),density:M.scene.fog?.density};
  M.scene.background?.set?.(0x303b3b);if(M.scene.fog){M.scene.fog.color.set(0x303b3b);M.scene.fog.density=.0014;}built.lamps.visible=true;
 }
 function stop(){descent?.stop();active=false;hold=0;dialog.close();restoreLight();delete document.body.dataset.escherDepth;panel.hidden=true;portalButton.hidden=true;}
 function enter(id='gallery'){
  if(disposed||blocked())return false;if(id==='escher')return gateOpen(D.portals[0])&&descent?.approach();const p=D.portals.find(p=>p.id===id);if(id!=='gallery'&&(!p||!gateOpen(p)))return false;
  M.cancelActivity?.();if(active)stop();const landing=p?.landing??{x:136.4,z:115,y:-40,yaw:-Math.PI/2};
  M.arrive({...landing});M.setCityMode();M.clearMovement();M.player.pitch=0;active=true;if(p)lastDoor=p.id;hold=0;document.body.dataset.escherDepth='true';portalButton.hidden=true;setLight();renderPanel();return true;
 }
 function leave(id=lastDoor){
  if(!active)return false;const p=D.portals.find(p=>p.id===id)??D.portals[1];stop();cooldown=lastTime+1.5;M.clearMovement();M.arrive({x:p.x,z:p.z+2.35,y:M.cityGroundHeight?.(p.x,p.z+2.35)??p.y,yaw:Math.PI});return true;
 }
 // An explicit convenience journey, distinct from the continuous stair walk.
 function travel(destination){
  if(!active||blocked())return false;const p=destination==='upper'?{x:207,z:100,y:-34}:{x:207,z:124,y:-40};
  M.clearMovement();Object.assign(M.player,{...p,y:p.y+M.eye,pitch:0});M.camera?.position?.set?.(M.player.x,M.player.y,M.player.z);
  const target={x:197,y:-35,z:115};M.player.yaw=Math.atan2(-(target.x-p.x),-(target.z-p.z));M.player.pitch=Math.atan2(target.y-M.player.y,Math.hypot(target.x-p.x,target.z-p.z));
  M.status?.(destination==='upper'?'Travelled to the upper gallery. The west stair also connects it to the court.':'Travelled to the hexagonal court. Three wings and the south lower-cloister stair surround it.');renderPanel();return true;
 }
 function handoff(){
  if(!active||!atGalleryHandoff(M.player))return false;const p={x:134.9,z:M.player.z,y:-40,yaw:M.player.yaw,pitch:M.player.pitch};
  stop();M.clearMovement();if(typeof galleryExit==='function')galleryExit(p);else{M.arrive({x:136.4,z:115,y:-40,yaw:-Math.PI/2});active=true;document.body.dataset.escherDepth='true';setLight();M.status?.('The gallery connector is not installed. The museum remains open.');}return true;
 }
 M.arrive=function(p){if(active||descent?.active)stop();return old.arrive.call(M,p);};
 function renderPanel(){
  const paused=blocked();panel.hidden=!active||paused;if(!active)return;
  location.textContent=ROOM_NAMES[depthRoomAt(M.player.x,M.player.z,M.player.y-M.eye)]||'Underground museum';const e=nearestExhibit(),door=nearestDoor();examine.hidden=!e;exit.hidden=!door;examine.textContent=e?'Explore: '+e.name:'Explore this experiment';exit.textContent=door?'Return to '+door.name:'Return through this door';
  help.textContent='Walk with the usual keyboard or controller controls. Three hexagonal wings meet the vaulted court. Follow the west stair to the upper galleries or the south stair to the lower cloister.';
  progress.textContent=selectedPrint?PRINT_STUDIES[selectedPrint].title+' → '+PRINT_STUDIES[selectedPrint].question+' '+(e?.id===PRINT_STUDIES[selectedPrint].experiment?'You reached the experiment. Choose Explore to test it.':PRINT_STUDIES[selectedPrint].route):depthRoomAt(M.player.x,M.player.z,M.player.y-M.eye)==='perspective'?(solvedPerspective?'The triangle joined from one view. Move sideways to expose its separated depths.':hold>0?'The ends meet. Hold this view…':'Compare the three brass floor marks. Face the rods and find a view where all three corners join.'):'Gallery connection: west through the hall. Surface doors: brass floor markers in the west passage and the topology wing.';
 }
 function checkPortals(time=0){
  if(disposed)return false;if(descent?.active){portalButton.hidden=true;panel.hidden=true;return false;}if(Number.isFinite(time))lastTime=time;
  if(active){portalButton.hidden=true;if(!valid()){stop();return false;}renderPanel();return handoff();}
  const p=nearestSurfaceDoor(),paused=blocked();portalButton.hidden=!p||paused;portalButton.disabled=!!p&&!gateOpen(p);portalButton.textContent=p&&!gateOpen(p)?'Align the house stair to reveal the museum entrance':p?.id==='escher'?'Follow the real stair down to the museum':p?'Enter Escher · Depth & Pattern — '+p.name:'Enter the underground museum';
  if(p&&!paused&&gateOpen(p)&&time>=cooldown&&distance(p)<.68&&p.id!=='escher')return enter(p.id);return false;
 }
 function step(dt,{forward=0,strafe=0,turn=0,boost=false}={}){
  if(descent?.step(dt,{forward,strafe,turn,boost}))return true;if(!active)return false;if(!valid()){stop();return false;}if(blocked())return true;
  dt=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
  forward=Number.isFinite(forward)?Math.max(-1,Math.min(1,forward)):0;strafe=Number.isFinite(strafe)?Math.max(-1,Math.min(1,strafe)):0;turn=Number.isFinite(turn)?Math.max(-1,Math.min(1,turn)):0;
  M.player.yaw+=turn*dt*1.65;const n=Math.max(1,Math.hypot(forward,strafe)),speed=(boost?7.2:4.6)*dt;
  walkDepth(M.player,(-Math.sin(M.player.yaw)*forward+Math.cos(M.player.yaw)*strafe)/n*speed,(-Math.cos(M.player.yaw)*forward-Math.sin(M.player.yaw)*strafe)/n*speed,M.eye);
  if(!solvedPerspective){hold=perspectiveAligned(M.player,M.eye)?hold+dt:0;if(hold>=1.2){solvedPerspective=true;M.status?.('The triangle closes in projection. Its three rods still occupy different depths.');}}
  renderPanel();handoff();return true;
 }
 function interact(){
  if(descent?.active)return true;if(blocked())return active;
  if(active){if(nearestExhibit()){openExhibit();return true;}const p=nearestDoor();if(p){leave(p.id);return true;}return true;}
  const p=nearestSurfaceDoor();if(!p)return false;if(!gateOpen(p)){M.status?.('Align the perspective stair upstairs to open Escher’s rear alcove.');return true;}if(p.id==='escher'){M.pointToward?.({x:228,z:92});return true;}return enter(p.id);
 }
 function faceTriangle(){M.clearMovement();M.camera?.position?.set?.(M.player.x,M.player.y,M.player.z);M.pointToward?.(DEPTH_FOCUS);M.player.yaw=Math.atan2(-(DEPTH_FOCUS.x-M.player.x),-(DEPTH_FOCUS.z-M.player.z));M.player.pitch=Math.atan2(DEPTH_FOCUS.y-M.player.y,Math.hypot(DEPTH_FOCUS.x-M.player.x,DEPTH_FOCUS.z-M.player.z));}
 function moveMark(){
  if(!active||depthRoomAt(M.player.x,M.player.z,M.player.y-M.eye)!=='perspective')return false;selectedMark=(selectedMark+1)%3;
  M.clearMovement();Object.assign(M.player,{x:DEPTH_VIEW.x+[-3.5,0,3.5][selectedMark],z:DEPTH_VIEW.z,y:D.floor+M.eye});faceTriangle();dialog.close();return true;
 }
 function renderExhibit(id){
  const keep=document.activeElement?.dataset?.escherFocus;body.replaceChildren();const b=(text,fn,key=text)=>{const n=button(text,fn);n.dataset.escherFocus=key;return n;};
  if(selectedPrint&&PRINT_STUDIES[selectedPrint].experiment===id){const source=el('p','From '+PRINT_STUDIES[selectedPrint].title+' · '+PRINT_STUDIES[selectedPrint].question);source.className='escher-study-origin';body.append(source);}
  if(id==='perspective'){
   title.textContent='One triangle, several depths';body.append(el('p','Three straight rods sit at different distances. From one eye position their projected endpoints meet, although the rods do not touch.'),el('p','Compare the three brass marks, face the sculpture and hold a joined view for a moment. Then step sideways. The geometry stays fixed; its projection changes.'),b('Try the next viewing mark',moveMark),b('Face the triangle',()=>{faceTriangle();dialog.close();}),el('p',solvedPerspective?'You found the joined view. It is a view-dependent alignment, not a physically closed triangle.':'An alignment is discovered by looking in the room. A button does not mark it solved.'));
  }else if(id==='tessellation'){
   title.textContent='Edges that agree';const result=tileMismatch(tess);body.append(el('p','The wall repeats one deformed square by translation. To remove gaps and overlaps, each right edge must copy its neighbour’s left edge, and each top edge must agree with the bottom edge above it.'),el('p','Edit an edge pair and watch the wall change. Matching both pairs creates a periodic tiling in this finite patch.'));
   body.append(b('Change boundary shape',()=>{tess.motif=(tess.motif+1)%3;built.setTessellation(tess);renderExhibit(id);},'motif'));
   for(const[key,name]of[['pairX','Left / right'],['pairZ','Top / bottom']]){const n=b(name+': '+(tess[key]?'paired':'mismatched'),()=>{tess[key]=!tess[key];built.setTessellation(tess);renderExhibit(id);},key);n.setAttribute('aria-pressed',String(tess[key]));body.append(n);}
   const status=el('p',result.solved?'Both edge pairs agree. Translation repeats this tile without gaps along the shared boundaries.':'Maximum boundary discrepancy: horizontal '+result.x.toFixed(2)+' · vertical '+result.z.toFixed(2)+' units.');status.setAttribute('role','status');body.append(status,el('p','This is an original edge-pairing construction. It is not a reconstruction of an Escher print. The demonstration checks these shared translated edges, rather than classifying every possible tiling.'));
  }else if(id==='loop'){
   title.textContent='Can every flight rise?';const result=loopResult(directions);body.append(el('p','First try four rising flights. Can their final landing meet the first? Change the signed flights and watch the seam in the physical model. What constraint would any closed route have to satisfy?'),el('p','Change each flight between up and down. The model shows the physical seam instead of hiding it in a drawing. Find a route that closes, then explain what you had to give up.'));
   body.append(b('Restore four rising flights',()=>{directions.fill(1);built.setLoop(directions);renderExhibit(id);},'all-up'));
   directions.forEach((d,i)=>{const n=b('Flight '+(i+1)+': '+(d===1?'up +2':'down −2'),()=>{directions[i]*=-1;built.setLoop(directions);renderExhibit(id);},'flight'+i);n.setAttribute('aria-pressed',String(d===1));body.append(n);});
   const status=el('p',directions.map(d=>d===1?'+2':'−2').join('  ')+' = '+(result.rise>0?'+':'')+result.rise+(result.closed?' · The route closes. It includes descents.':' · The last landing misses the first by '+Math.abs(result.rise)+' units.'));status.setAttribute('role','status');body.append(status,el('p','The walkable stair outside this case is ordinary geometry and works in both directions. The small model is an original experiment about height, not an authentic historical artwork.'));
  }else if(id==='reading'){
   title.textContent='Which hand comes first?';body.append(el('p','Treat A and B as construction tasks. An arrow means a task requires the other to be complete first. Toggle the dependencies and try to name a legal first task.'),el('p','This is a finite dependency model inspired by Drawing Hands. It does not explain how Escher made the print or prove that every feedback system is impossible.'));
   for(const [key,label]of[['a','A requires B first'],['b','B requires A first']]){const n=b(label+': '+(dependency[key]?'yes':'no'),()=>{dependency[key]=!dependency[key];renderExhibit(id);},'dependency-'+key);n.setAttribute('aria-pressed',String(dependency[key]));body.append(n);}
   const order=dependencyOrder(dependency.a,dependency.b);const status=el('p',order?'Construction order: '+order.join(' → ')+'. Explain why no prerequisite is violated.':'No legal first task under these rules: A waits for B, and B waits for A. Remove one dependency and test again.');status.setAttribute('role','status');body.append(status,el('p','A circular specification can describe a relationship without supplying a sequential construction. Simultaneous equations and time-dependent feedback need different models.'));
  }else{
   title.textContent='A note on the experiments';body.append(el('p','This connected museum is a new interpretation of themes of perspective, repetition and local versus global consistency. Its geometric exhibits and English texts were made for the City of Ideas.'),el('p','The original Escher house and its viewpoint stair remain upstairs at their established location. Its reproductions, titles, links and artwork credits remain with those works. These new models are not works by M. C. Escher.'),el('p','No writing, private notes or voice recordings are used here. Experiment settings last only for this visit and are not stored.'));
  }
  if(keep)Array.from(body.querySelectorAll('button')).find(n=>n.dataset.escherFocus===keep)?.focus();
 }
 function openExhibit(id=nearestExhibit()?.id){
  const near=nearestExhibit();if(!active||!near||near.id!==id||blocked())return false;M.clearMovement();renderExhibit(id);dialog.showModal();close.focus();return true;
 }
 M.city.region=(x,z)=>descent?.active?{id:'escher-stair',title:'Escher · stair to the museum',inside:true}:active&&depthRoomAt(x,z,M.player.y-M.eye)?{id:'escher-depth',title:'Escher · '+(ROOM_NAMES[depthRoomAt(x,z,M.player.y-M.eye)]||'Depth & Pattern'),inside:true}:old.region(x,z);
 M.city.targetInfo=d=>d?.escherDepthDoor?{kind:'escher-depth-door',data:d,title:'Enter Escher · Depth & Pattern'}:d?.escherDepthExhibit?{kind:'escher-depth-exhibit',data:d,title:'Explore the experiment'}:old.target(d);
 M.showExtra=info=>info?.kind==='escher-depth-door'?(nearestSurfaceDoor()?.id===info.data.escherDepthDoor&&interact(),true):info?.kind==='escher-depth-exhibit'?(openExhibit(info.data.escherDepthExhibit),true):old.show?.(info);
 M.city.update=(...args)=>{old.update(...args);if(disposed)return;checkPortals(args[1]);if(active)setLight();};
 function followPrint(id){if(!PRINT_STUDIES[id])return false;selectedPrint=id;M.status?.(PRINT_STUDIES[id].title+': '+(globalThis.window?.CITY_ESCHER?.passageOpen?'Follow the rear alcove into the museum.':'First align the house stair, then follow the rear alcove into the museum.'));if(active)renderPanel();return true;}
 descent=installEscherDescent(M,T,{gateOpen:()=>gateOpen(D.portals[0]),onBegin:fromBelow=>{stop();if(fromBelow)globalThis.window?.CITY_ESCHER?.setPassage?.(true,1);setLight();},onStop:restoreLight,onMuseum:()=>{active=true;document.body.dataset.escherDepth='true';setLight();renderPanel();}});
 built.group.add(descent.built.group);
 const api={descent,travel,followPrint,get selectedPrint(){return selectedPrint;},built,step,checkPortals,interact,enter,leave,stop,openExhibit,moveMark,faceTriangle,setGalleryExit(fn){galleryExit=fn;},get active(){return active||!!descent?.active;},get progress(){return{perspective:solvedPerspective,tessellation:tileMismatch(tess).solved,loop:loopResult(directions).closed};},galleryBoundary:D.gallery};M.escherDepth=api;
 addEventListener('pagehide',()=>{disposed=true;stop();descent.dispose();if(M.arrive!==old.arrive)M.arrive=old.arrive;M.city.update=old.update;M.city.region=old.region;M.city.targetInfo=old.target;M.showExtra=old.show;for(const t of built.targets){const i=M.city.targets.indexOf(t);if(i>=0)M.city.targets.splice(i,1);}built.dispose();for(const n of[panel,portalButton,dialog])n.remove();},{once:true});return api;
}
