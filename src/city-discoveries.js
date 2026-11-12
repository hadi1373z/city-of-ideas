import {createSixthGuest,TRIAL_EDGES,trialTriangles,fiveCycle} from './sixth-guest-state.js';
import {buildTrialDiagram,buildTriangleBoats} from './sixth-guest-scene.js';
import {DISCOVERY_COPY} from './city-discoveries-copy.js';

export function installCityDiscoveries(M,T){
 let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('Unavailable');},setItem(){throw Error('Unavailable');}};}
 const trial=createSixthGuest(storage),lang=()=>window.CITY_I18N.lang,w=()=>DISCOVERY_COPY[lang()]||DISCOVERY_COPY.en;
 const el=(tag,text)=>{const node=document.createElement(tag);if(tag==='summary')node.tabIndex=0;if(text)node.textContent=text;return node;};
 const dialog=el('dialog');dialog.id='city-discoveries';dialog.dataset.confirmFocused='true';dialog.setAttribute('aria-labelledby','city-discoveries-title');
 const header=el('header'),title=el('h2'),close=el('button','×'),body=el('main'),status=el('p');title.id='city-discoveries-title';close.type='button';close.className='glass';close.dataset.close='';status.setAttribute('role','status');header.append(title,close);dialog.append(header,body,status);document.body.append(dialog);
 let view='hub',selected=[],conclusion=0,feedback='',opener=null,last=0,clock=0,lastContext='',disposed=false;
 const clue=buildTrialDiagram(T),paper=buildTrialDiagram(T),boats=buildTriangleBoats(T,M.city.PARK),escher=window.CITY_ESCHER,room=M.ramseyRoom;
 clue.group.name='Five-point sketch in Escher’s hidden alcove';clue.group.position.set(-1.455,1.65,-10.2);clue.group.rotation.z=-Math.PI/2;clue.group.traverse(o=>o.userData={...o.userData,sixthGuestClue:true});escher.group.add(clue.group);
 paper.group.position.copy(room.house.study.acquaintanceMap.group.position);paper.group.visible=false;room.house.study.group.add(paper.group);
 const nativePaper=room.house.study.acquaintanceMap.paper;nativePaper.userData.sixthGuestTable=true;
 M.scene.add(boats.group);M.city.targets.push(nativePaper);
 function registerVisible(target){const index=M.city.targets.indexOf(target);if(target.visible&&index<0)M.city.targets.push(target);else if(!target.visible&&index>=0)M.city.targets.splice(index,1);}
 const context=()=>({table:M.mode==='city'&&room.house.inside(M.player.x,M.player.z),alcove:M.mode==='city'&&escher.passageOpen&&Math.abs(M.player.x-escher.entry.x)<1.5&&M.player.z<escher.entry.z-15.5&&M.player.z>escher.entry.z-21.1,fountain:M.mode==='city'&&Math.hypot(M.player.x-M.city.PARK.x,M.player.z-M.city.PARK.z)<18*M.city.PARK.scale});
 function action(label,fn,key,parent=body,primary=false){const b=el('button',label);b.type='button';b.className=primary?'primary':'glass';if(key)b.dataset.trial=key;b.onclick=fn;parent.append(b);return b;}
 function paperVisibility(){const active=dialog.open&&view==='table'&&context().table;paper.group.visible=active;room.house.study.acquaintanceMap.group.visible=!active;}
 function recordPrediction(){const memory=M.visitorMemory.store,q=memory.question('sixth-guest','personal',w().question);if(q&&!q.history.length&&trial.state.prediction!==null)memory.answer(q.id,w().predict[trial.state.prediction]);}
 function recordFinish(){recordPrediction();const s=trial.state;M.visitorMemory.store.answer('sixth-guest',w().answers[s.conclusion],w().reason+w().evidenceText);M.visitorMemory.discover('sixth-guest-complete');}
 function open(next='hub'){if(!dialog.open)opener=document.activeElement;view=next;feedback='';M.clearMovement();if(context().table)room.pause();if(!dialog.open)dialog.showModal();render();}
 function visit(place){
  dialog.close();M.clearMovement();
  if(place==='escher')M.quickStart('artist:escher');
  else if(place==='ramsey'){if(M.player.x>-1000){M.quickStart('graveyard-door');M.status(w().edgeDoor);}else room.visit();}
  else if(place==='book'){M.quickStart('socrates');M.homeBridge?.focusRoom('math');}
  else if(M.player.x<-1000){const entry=window.CITY_GRAVEYARD?.returnEntry;if(entry){M.arrive(entry);M.status(w().exitDoor);}}
  else{const p=M.city.PARK;M.arrive({x:p.x,z:p.z+14*p.scale,y:.13,yaw:0});M.player.pitch=-.18;}
 }
 function graph(parent,colors,count,interactive=false,highlight=[]){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 360 330');svg.setAttribute('role','img');svg.setAttribute('aria-label',w().board);svg.classList.add('discovery-graph');
  const points=Array.from({length:count},(_,i)=>[180+Math.sin(i/count*Math.PI*2)*126,163-Math.cos(i/count*Math.PI*2)*126]);
  TRIAL_EDGES.forEach(([a,b],i)=>{if(b>=count)return;const line=document.createElementNS(svg.namespaceURI,'line');for(const[k,v]of Object.entries({x1:points[a][0],y1:points[a][1],x2:points[b][0],y2:points[b][1],stroke:colors[i]?'#477ea4':'#b95345','stroke-width':4,'stroke-dasharray':colors[i]?'8 5':'none'}))line.setAttribute(k,v);if(highlight.length){line.setAttribute('opacity',highlight.includes(a)&&highlight.includes(b)?'1':'.22');if(highlight.includes(a)&&highlight.includes(b))line.setAttribute('stroke-width',7);}svg.append(line);
   if(interactive){const hit=line.cloneNode();hit.setAttribute('stroke','transparent');hit.setAttribute('stroke-width',18);hit.removeAttribute('stroke-dasharray');hit.style.cursor='pointer';hit.onclick=()=>flip(i);svg.append(hit);}
  });
  points.forEach(([x,y],i)=>{const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('cx',x);circle.setAttribute('cy',y);circle.setAttribute('r',19);circle.setAttribute('fill',selected.includes(i)&&interactive||highlight.includes(i)?'#d5ac54':'#263f38');if(interactive&&count===6){circle.dataset.point=String(i);circle.style.cursor='pointer';circle.onclick=()=>choosePoint(i);}svg.append(circle);const text=document.createElementNS(svg.namespaceURI,'text');text.setAttribute('x',x);text.setAttribute('y',y+5);text.setAttribute('text-anchor','middle');text.setAttribute('fill','#fff8e6');text.textContent=String(i+1);svg.append(text);});parent.append(svg);
 }
 function flip(index){if(!trial.flip(index,context()))return;selected=[];feedback='';render('edge-'+index);}
 function choosePoint(i){if(selected.includes(i))selected=selected.filter(n=>n!==i);else{if(selected.length===3)selected=[];selected.push(i);}feedback='';render('point-'+i);}
 function source(parent){const details=el('details'),summary=el('summary',w().why);details.append(summary,el('p',w().proof));const a=el('a',w().source);a.href='https://ayong.web.illinois.edu/Fall2026Math413/lecture9-2026zoom.html';a.target='_blank';a.rel='noopener noreferrer';details.append(a);parent.append(details);}
 function route(){
  const s=trial.state,c=context();title.textContent=s.complete?w().complete:w().sixth;
  if(s.complete){body.append(el('p',w().completeText));graph(body,s.witness.colors,6,false,s.witness.vertices);action(w().watch,()=>visit('park'),'watch',body,true);action(w().notebook,()=>{dialog.close();M.visitorMemory.open('sixth-guest');},'notebook');action(w().table,()=>open('table'),'free-play');source(body);return;}
  if(!s.active)action(s.fiveExample?w().resume:w().begin,()=>{trial.begin();render();},'begin',body,true);
  if(s.witness){body.append(el('h3',w().return),el('p',w().found));if(!c.fountain){action(w().visitPark,()=>visit('park'),'park',body,true);return;}
   body.append(el('p',w().fountain),el('h3',w().first),el('p',w().predict[s.prediction]),el('h3',w().evidence),el('p',w().evidenceText));source(body);body.append(el('h3',w().last));const choices=el('div');choices.className='discovery-answers';w().answers.forEach((label,i)=>{const b=action(label,()=>{conclusion=i;for(const[n,other]of[...choices.children].entries())other.setAttribute('aria-pressed',String(n===i));},'answer-'+i,choices);b.setAttribute('aria-pressed',String(conclusion===i));});body.append(choices);action(w().release,()=>{if(trial.finish(conclusion,context())){recordFinish();render();}},'release',body,true);return;
  }
  body.append(el('h3',w().next));
  if(!s.clue&&!s.fiveExample){body.append(el('h4',w().escher),el('p',w().escherHint));action(w().visitEscher,()=>visit('escher'),'escher',body,true);if(c.alcove)action(w().clue,()=>open('clue'),'clue');}
  else if(s.clue)body.append(el('p',w().clueRead));
  body.append(el('h4',w().ramsey),el('p',w().atTable));if(c.table)action(w().table,()=>open('table'),'table',body,true);else action(w().visitRamsey,()=>visit('ramsey'),'ramsey',body,s.clue||!!s.fiveExample);
  if(s.active)action(w().pause,()=>{trial.pause();dialog.close();},'pause');
 }
 function table(){
  title.textContent=w().sixth;const s=trial.state;
  if(!context().table){body.append(el('p',w().atTable));action(w().visitRamsey,()=>visit('ramsey'),'ramsey',body,true);return;}
  body.append(el('p',s.count===5?w().five:w().six),el('p',s.count===5?w().fiveHint:w().sixHint));
  const area=el('div');area.className='discovery-trial';graph(area,s.colors,s.count,true);const controls=el('section');controls.setAttribute('aria-label',w().controls);const count=el('p',w().triangles+': '+trialTriangles(s.colors,s.count).length);count.className='discovery-triangle-count';controls.append(count);
  if(s.count===6){const points=el('div');points.className='discovery-points';for(let i=0;i<6;i++){const b=action(String(i+1),()=>choosePoint(i),'point-'+i,points);b.setAttribute('aria-label',w().point+' '+(i+1));b.setAttribute('aria-pressed',String(selected.includes(i)));}controls.append(points,el('p',w().selected+': '+selected.map(n=>n+1).join(' · ')));const keep=action(w().check,()=>{if(trial.witness(selected,context())){M.visitorMemory.discover('sixth-guest-witness');open('route');}else{feedback=w().tryAgain;render('witness');}},'witness',controls,true);keep.disabled=selected.length!==3;}
  const links=el('div');links.className='discovery-connections';TRIAL_EDGES.forEach(([a,b],i)=>{if(b>=s.count)return;const btt=action((a+1)+'–'+(b+1)+' · '+(s.colors[i]?w().blue:w().red),()=>flip(i),'edge-'+i,links);btt.dataset.color=String(s.colors[i]);btt.setAttribute('aria-label',w().edge+' '+btt.textContent);});if(s.count===6){const edits=el('details');edits.append(el('summary',w().editConnections),links);controls.append(edits);}else controls.append(links);area.append(controls);body.append(area);
  if(s.count===5){if(s.clue)action(w().useClue,()=>{trial.applyClue(context());render();},'apply-clue');if(!trialTriangles(s.colors,5).length){body.append(el('p',w().fiveDone));w().predict.forEach((text,i)=>action(text,()=>{if(trial.admitSix(i,context())){trial.begin();recordPrediction();selected=[];render();}},'predict-'+i));}}
  if(s.witness)action(w().return,()=>open('route'),'return',body,true);if(feedback){const message=el('p',feedback);message.setAttribute('role','status');body.append(message);}body.append(el('small',w().original));
 }
 function render(focusKey){
  if(disposed)return;body.replaceChildren();dialog.dir=lang()==='fa'?'rtl':'ltr';close.setAttribute('aria-label',w().close);title.textContent=w().title;
  if(view!=='hub')action(w().back,()=>open('hub'),'back');
  if(view==='hub'){
   body.append(el('p',w().intro));const cards=el('div');cards.className='discovery-cards';
   if(M.studyHouses){const learning=el('article');learning.append(el('h3',M.studyHouses.title),el('p',M.studyHouses.intro));action(M.studyHouses.label,()=>{dialog.close();M.studyHouses.open();},'advanced-study',learning,true);cards.append(learning);}if(M.learningLab){const learning=el('article');learning.append(el('h3',M.learningLab.title),el('p',M.learningLab.intro));action(M.learningLab.label,()=>{dialog.close();M.learningLab.open();},'learning-lab',learning,true);cards.append(learning);}
   for(const [name,text,label,fn]of [[w().sixth,w().summary,trial.state.complete?w().revisit:trial.state.active?w().resume:w().begin,()=>{trial.begin();view='route';render();}],[w().qWalk,w().qWalkText,w().startWalk,()=>{dialog.close();M.questionWalk.open();}],[w().book,w().bookText,w().startBook,()=>visit('book')]]){const card=el('article');card.append(el('h3',name),el('p',text));action(label,fn,null,card,true);cards.append(card);}body.append(cards);
  }else if(view==='table')table();else if(view==='clue'){
   title.textContent=w().clue;graph(body,fiveCycle(),5);body.append(el('p',w().clueRead));if(context().alcove)action(w().readClue,()=>{if(trial.readClue(context()))M.visitorMemory.discover('sixth-guest-sketch');view='route';render();},'read-clue',body,true);
  }else route();
  status.textContent=trial.saved&&M.visitorMemory.store.saved?w().saved:w().failed;paper.update(trial.state.colors,trial.state.count);paperVisibility();
  if(focusKey)body.querySelector('[data-trial="'+focusKey+'"]')?.focus();else (body.querySelector('button.primary:not([disabled])')||body.querySelector('[data-trial="edge-0"]')||body.querySelector('button:not([disabled])'))?.focus();
 }
 close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{paperVisibility();M.clearMovement();opener?.focus?.();});
 const launch=action('',()=>open(),'launch',document.querySelector('.visit-actions'),true);launch.id='city-discoveries-open';
 const welcome=action('',()=>open(),'welcome',document.querySelector('.welcome-secondary'),true);welcome.id='city-discoveries-welcome';document.querySelector('#enter').after(welcome);
 const mapAction=action('',()=>{document.querySelector('#map-panel').hidden=true;open();},'map',document.querySelector('.map-directions'));mapAction.id='city-discoveries-map';
 const tableAction=el('button');tableAction.type='button';tableAction.className='glass';tableAction.onclick=()=>open('table');tableAction.id='ramsey-trial-open';document.querySelector('#ramsey-conversation div')?.append(tableAction);
 const tracker=el('button');tracker.id='city-discoveries-tracker';tracker.className='glass';tracker.type='button';tracker.hidden=true;tracker.onclick=()=>open('route');document.body.append(tracker);
 const oldTarget=M.city.targetInfo,oldShow=M.showExtra;
 M.city.targetInfo=data=>data.sixthGuestClue?{kind:'sixth-guest-clue',title:w().clue,data}:data.sixthGuestTable?{kind:'sixth-guest-table',title:w().table,data}:data.sixthGuestBoats?{kind:'sixth-guest-boats',title:w().complete,data}:oldTarget(data);
 M.showExtra=info=>{if(info.kind==='sixth-guest-clue'){if(context().alcove)open('clue');return true;}if(info.kind==='sixth-guest-table'){if(context().table){trial.begin();open('table');}return true;}if(info.kind==='sixth-guest-boats'){if(trial.state.complete)open('route');return true;}return oldShow(info);};
 const update=M.city.update;M.city.update=(...args)=>{update(...args);const time=args[1],dt=last?Math.min(.1,Math.max(0,time-last)):0;last=time;if(!document.hidden&&!document.querySelector('dialog[open]'))clock+=dt;const s=trial.state;boats.update(clock,{visible:s.complete&&M.mode==='city'&&M.player.x>-1000,color:s.witness?.color||0,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});clue.group.visible=escher.passageOpen&&M.mode==='city'&&M.player.x>-1000;registerVisible(clue.group);registerVisible(boats.group);paperVisibility();
  const c=context(),key=[c.table,c.alcove,c.fountain,lang()].join(':');if(key!==lastContext){lastContext=key;if(dialog.open)render();}tracker.hidden=!s.active||s.complete||M.mode!=='city'||document.hidden||!!document.querySelector('dialog[open]')||!!M.questionWalk?.state.active||document.body.classList.contains('cinematic-running');tracker.textContent=w().carry;
 };
 const locale=()=>{launch.textContent=welcome.textContent=mapAction.textContent=w().open;tableAction.textContent=w().table;if(dialog.open)render();};locale();addEventListener('city-language',locale);
 const api={open,trial,clue,paper,boats,context,appendNotebook(parent){const card=el('article');card.append(el('h3',w().sixth),el('p',trial.state.complete?w().completeText:trial.state.clue?w().copied:w().summary));action(trial.state.complete?w().watch:w().resume,()=>{document.querySelector('#visit-notebook')?.close();open('route');},'notebook-route',card);parent.append(card);}};M.cityDiscoveries=api;
 addEventListener('pagehide',()=>{disposed=true;removeEventListener('city-language',locale);for(const target of[clue.group,nativePaper,boats.group]){const i=M.city.targets.indexOf(target);if(i>=0)M.city.targets.splice(i,1);}delete nativePaper.userData.sixthGuestTable;room.house.study.acquaintanceMap.group.visible=true;clue.dispose();paper.dispose();boats.dispose();[dialog,launch,welcome,mapAction,tableAction,tracker].forEach(n=>n.remove());},{once:true});return api;
}
