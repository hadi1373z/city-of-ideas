import {connectedContext,connectedRoute,JOURNEY_QUESTIONS} from './connected-journey-model.js';
import {BABEL,babelDesk} from './babel-library-model.js?v=two-faces2';
import {ESCHER_DEPTH as D} from './escher-depth-model.js';
export function installConnectedJourney(M,T){
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;},button=(text,fn)=>{const n=el('button',text);n.type='button';n.className='glass';n.onclick=fn;return n;};
 const panel=el('details');panel.id='connected-journey';panel.lang='en';panel.dir='ltr';panel.hidden=true;
 const summary=el('summary','Connected questions'),title=el('strong'),question=el('p'),directions=el('p'),actions=el('div'),routeButton=button('Show walking route',()=>{showRoute=!showRoute;render(true);}),actionButton=button('',()=>interact());actions.append(routeButton,actionButton);panel.append(summary,title,question,directions,actions);document.body.append(panel);
 summary.tabIndex=0;routeButton.id='connected-journey-route';actionButton.id='connected-journey-action';
 const prediction=el('div'),answer=el('p'),choices={};for(const id of['reflection','rotation']){choices[id]=button(id==='rotation'?'A rotation':'A reflection',()=>{chosen=id;render(true);});prediction.append(choices[id]);}const orientation=el('table'),caption=el('caption','Across the two faces'),header=el('tr');header.append(el('th','Before'),el('th','After'));orientation.append(caption,header);for(const[a,b]of[['East','East'],['North','South'],['Up','Down']]){const row=el('tr');row.append(el('td',a),el('td',b));orientation.append(row);}prediction.append(answer,orientation);panel.append(prediction);
 const group=new T.Group();group.name='Optional connected-question walking breadcrumbs';group.userData.connectedJourney=true;
 (M.worldCylinder?.built.group??M.scene).add(group);const geometry=new T.CylinderGeometry(.12,.12,.018,10),material=new T.MeshBasicMaterial({color:0xe4bb70,transparent:true,opacity:.82,depthWrite:false}),dots=new T.InstancedMesh(geometry,material,180),stamp=new T.Object3D();dots.name='Walking route on the existing floors';dots.raycast=()=>{};dots.count=0;dots.frustumCulled=false;group.add(dots);
 let chosen=null,context=null,showRoute=false,catalogueOpened=false,last=0,disposed=false,key='',routeAt=0;const oldUpdate=M.city.update;
 const busy=()=>document.hidden||!!document.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 function action(){
  if(!context)return null;const p=M.player,feet=p.y-M.eye;
  if(context.place==='babel'){const d=babelDesk(context.level.id);if(Math.abs(feet-d.y)<.5&&Math.hypot(p.x-d.x,p.z-d.z)<4)return{title:'Open this reading desk',run:()=>M.babelLibrary.openBook()};}
  if(context.museum){const e=D.exhibits.find(e=>Math.abs(feet-e.y)<.4&&Math.hypot(p.x-e.x,p.z-e.z)<4.1);if(e)return{title:'Open '+e.name,run:()=>M.escherDepth.openExhibit(e.id)};}
  if(context.place==='lift'){
   const m=context.mathematics,t=m.transform,s=t.scale??1,local={x:(p.x-t.x)/s,z:(p.z-t.z)/s},lift=m.model.landings?.[m.floor],data=m.model.approaches?.find(d=>d.mathAction==='floor'&&d.targetFloor===0);
   if(lift&&data&&Math.abs(feet-(t.y+m.model.height*s))<.3&&Math.hypot(local.x-lift.x,local.z-lift.z)<2.5&&(m.canStandLocal??m.model.canStand)(local.x,local.z))return{title:'Take the lift to ground floor',run:()=>M.showExtra(M.city.targetInfo(data))};
  }
  if(context.place==='faculty'&&context.lower&&Math.abs(feet-.13)<.5){const target=(M.worldCylinder?.faculty?.targets??[]).find(t=>t.userData.mathAction==='floor'&&t.userData.targetFloor===7&&Math.hypot(p.x+2160-t.position.x,p.z+65-t.position.z)<4.1);if(target)return{title:'Visit Logic and Computation · working floor',run:()=>M.showExtra(M.city.targetInfo(target.userData))};}
  return null;
 }
 function interact(){if(busy())return false;const a=action();if(!a)return false;M.clearMovement();return a.run();}
 function render(force=false){
  if(disposed)return;if(document.querySelector('#babel-library-book[open]'))catalogueOpened=true;
  const region=M.city.region(M.player.x,M.player.z),extras=globalThis.window?.CITY_EXTRAS,source=region?.id==='mathematics'?extras?.mathModels?.[region.floor]:null,t=extras?.transforms?.mathematics,mathematics=source&&t?{model:source,transform:t,floor:region.floor,canStandLocal:(x,z)=>extras.canStand(t.x+x*(t.scale??1),t.z+z*(t.scale??1),{floor:region.floor,y:t.y+source.height*(t.scale??1)})}:null;
  context=connectedContext({player:M.player,eye:M.eye,mode:M.mode,babelActive:M.babelLibrary?.active,escherActive:M.escherDepth?.active,worldRoute:M.worldCylinder?.route,region,mathematics,progress:M.escherDepth?.progress,catalogueOpened,shore:M.worldCylinder?.built.lowerLandscape?.anchors.overlook});
  panel.dataset.place=context?.place??'';panel.dataset.route=String(showRoute);panel.hidden=!context||busy();group.visible=!panel.hidden&&panel.open&&showRoute&&context?.place!=='shore';if(!context)return;
  const c=JOURNEY_QUESTIONS[context.place],working=!!context.mathematics,nextKey=context.place+':'+(context.level?.id??context.mathematics?.floor??'')+':'+catalogueOpened+':'+!!context.progress.perspective+':'+!!context.progress.loop;
  if(force||nextKey!==key){key=nextKey;summary.textContent=working?'Way out · Mathematics':'Connected questions · '+(context.place==='babel'?'Babel':context.museum?'Escher':context.place==='shore'?'the shore':context.lower?'Mathematics':'the through-gallery');title.textContent=c.title;question.textContent=c.question;directions.textContent=context.place==='babel'&&!catalogueOpened?'The optional route follows this terrace to its open reading desk. To continue without reading, walk to the fifth terrace’s east doorway.':c.route;}
  prediction.hidden=context.place!=='shore';routeButton.hidden=context.place==='shore';answer.hidden=orientation.hidden=chosen===null;answer.textContent=(chosen==='rotation'?'Yes. ':'Compare the direction pairs: ')+'East stays fixed; north and up reverse. Reversing two axes preserves handedness: (+1) × (−1) × (−1) = +1. This is a half-turn about the east–west axis.';for(const id of['reflection','rotation'])choices[id].setAttribute('aria-pressed',String(chosen===id));
  routeButton.textContent=working?(showRoute?'Hide way out':'Show way out'):(showRoute?'Hide walking route':'Show walking route');routeButton.setAttribute('aria-pressed',String(showRoute));const a=action();actionButton.hidden=!a;if(a)actionButton.textContent=a.title;
  if(group.visible&&(force||performance.now()-routeAt>700)){routeAt=performance.now();const path=connectedRoute(context);dots.count=Math.min(180,path.length);for(let i=0;i<dots.count;i++){const p=path[i],lower=context.lower||context.worldRoute?.side==='lower';stamp.position.set(p.x,p.y+(lower?-.045:.045),p.z);stamp.rotation.set(0,0,0);stamp.scale.set(1,1,1);stamp.updateMatrix();dots.setMatrixAt(i,stamp.matrix);}dots.instanceMatrix.needsUpdate=true;panel.dataset.routePoints=String(dots.count);}
 }
 panel.addEventListener('toggle',()=>render(true));M.city.update=function(...args){oldUpdate(...args);if(disposed)return;const time=args[1]??0;if(time-last>.25||last===0){last=time;render();}};const update=M.city.update;
 const dispose=()=>{if(disposed)return;disposed=true;if(M.city.update===update)M.city.update=oldUpdate;group.removeFromParent();dots.dispose?.();geometry.dispose();material.dispose();panel.remove();if(M.connectedJourney===api)delete M.connectedJourney;};
 const api={panel,group,render,interact,dispose,get context(){return context;},get routeVisible(){return showRoute;},get catalogueOpened(){return catalogueOpened;}};M.connectedJourney=api;addEventListener('pagehide',dispose,{once:true});render();return api;
}
