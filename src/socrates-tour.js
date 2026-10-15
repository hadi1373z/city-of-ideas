import {buildSocratesGuide} from './socrates-character.js';
import {SOCRATES_EPISODES} from './socrates-episodes.js';
import {findCityPath} from './city-source-assets/home-tools/art-city-navigation.js';
import {stepAlongPath} from './city-source-assets/home-tools/navigation.js';

export function clearHostSegment(canStand,a,b){const n=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06));for(let i=0;i<=n;i++)if(!canStand(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;return true;}
export function findHostSpot(player,canStand){for(const d of [3.8,3,2.3])for(const offset of [.27,-.27,.65,-.65,1,-1]){const yaw=player.yaw+offset,p={x:player.x-Math.sin(yaw)*d,z:player.z-Math.cos(yaw)*d};if(canStand(p.x,p.z)&&clearHostSegment(canStand,player,p))return p;}return null;}

export function installSocratesTour(M,T,residents){
 const actor=buildSocratesGuide(T);actor.group.visible=false;actor.group.traverse(o=>o.userData.socratesHost=true);M.scene.add(actor.group);M.city.targets.push(actor.group);
 const canStand=(x,z)=>[[0,0],[.2,0],[-.2,0],[0,.2],[0,-.2]].every(([dx,dz])=>M.city.canStand(x+dx,z+dz));
 const tx=(fa,en)=>CITY_I18N.tx(fa,en),pick=pair=>CITY_I18N.translatePublic(pair[CITY_I18N.lang==='fa'?0:1]);
 let active=false,index=0,beat=0,playing=false,deadline=0,lastTime=0,repathAt=0,path=[],voice=false,speechSerial=0,warning='';
 const panel=document.createElement('aside');panel.id='socrates-studio';panel.hidden=true;panel.setAttribute('aria-labelledby','socrates-series-title');
 panel.innerHTML='<header><div><p class="socrates-kicker"></p><h2 id="socrates-series-title"></h2></div><button class="glass" data-host="close" type="button"></button></header><p class="socrates-intro"></p><label for="socrates-episode" class="socrates-episode-label"></label><div class="socrates-selector"><select id="socrates-episode"></select><button class="glass" data-host="visit" type="button"></button></div><div class="socrates-caption"><p class="socrates-beat"></p><p id="socrates-subtitle" aria-live="polite"></p></div><div class="socrates-buttons"><button class="primary" data-host="play" type="button"></button><button class="glass" data-host="next" type="button"></button><button class="glass" data-host="call" type="button"></button><button class="glass" data-host="frame" type="button"></button><button class="glass" data-host="cinema" type="button"></button></div><label class="socrates-voice"><input type="checkbox"><span></span></label><p class="socrates-status" role="status"></p><p class="socrates-note"></p>';
 document.body.append(panel);
 const n=s=>panel.querySelector(s),button=id=>n(`[data-host="${id}"]`),select=n('select'),subtitle=n('#socrates-subtitle');
 const launcher=document.createElement('button');launcher.className='glass';launcher.type='button';launcher.id='socrates-tour-open';launcher.onclick=()=>open();document.querySelector('.visit-actions').append(launcher);
 const welcome=document.createElement('button');welcome.className='glass';welcome.type='button';welcome.id='socrates-tour-welcome';welcome.onclick=()=>{M.quickStart('city');open();};document.querySelector('.welcome-secondary').append(welcome);
 const exit=document.createElement('button');exit.type='button';exit.id='socrates-cinema-exit';exit.className='glass';exit.hidden=true;document.body.append(exit);
 function cinema(value){document.body.classList.toggle('socrates-cinema',value);exit.hidden=!value;M.clearMovement();}
 exit.onclick=()=>cinema(false);
 function stopSpeech(){speechSerial++;if(window.speechSynthesis)window.speechSynthesis.cancel();}
 function pause(){playing=false;deadline=0;stopSpeech();render();}
 function speak(){stopSpeech();if(!voice||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;const prefix=['fa','de'].includes(CITY_I18N.lang)?CITY_I18N.lang:'en',voices=speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith(prefix));if(!voices.length){warning=tx('صدای مناسبِ این زبان در مرورگر نیست؛ زیرنویس فعال است.','This browser has no voice for this language; captions remain available.');render();return;}const utterance=new SpeechSynthesisUtterance(pick(SOCRATES_EPISODES[index].beats[beat]));utterance.voice=voices[0];utterance.lang=voices[0].lang;utterance.rate=.88;const serial=speechSerial;utterance.onerror=()=>{if(serial!==speechSerial)return;warning=tx('پخش صدا در مرورگر ممکن نشد؛ زیرنویس در دسترس است.','Browser speech could not play; captions remain available.');render();};speechSynthesis.speak(utterance);}
 function duration(){return Math.max(8,pick(SOCRATES_EPISODES[index].beats[beat]).split(/\s+/).length*.48+2);}
 function start(){if(!active&&!place())return;playing=true;warning='';deadline=performance.now()/1000+duration();speak();render();}
 function next(){stopSpeech();if(beat<SOCRATES_EPISODES[index].beats.length-1){beat++;if(playing){deadline=performance.now()/1000+duration();speak();}}else{playing=false;deadline=0;}render();}
 function render(){
  launcher.textContent=welcome.textContent=tx('هم‌قدم با سقراط','Walk with Socrates');n('.socrates-kicker').textContent=tx('سقراط · میزبانِ شهر','SOCRATES · YOUR CITY HOST');n('h2').textContent=tx('تمرینِ قسمت‌ها','Episode rehearsal');n('.socrates-intro').textContent=tx('یک توقف را انتخاب کنید؛ با سقراط قدم بزنید و روایتِ پیشنهادی را مرور کنید.','Choose a stop, walk with Socrates and rehearse a proposed narration.');
  n('.socrates-episode-label').textContent=tx('قسمت و مقصد','Episode and destination');select.replaceChildren(...SOCRATES_EPISODES.map((ep,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+' · '+pick(ep.title);return o;}));select.value=index;
  n('.socrates-beat').textContent=tx('بخش ','BEAT ')+(beat+1)+' / '+SOCRATES_EPISODES[index].beats.length;subtitle.textContent=pick(SOCRATES_EPISODES[index].beats[beat]);
  const labels={close:['بستن','Close'],visit:['رفتن به توقف','Go to stop'],play:playing?['مکث','Pause']:['پخش تمرین','Play rehearsal'],next:['بخش بعد','Next beat'],call:['سقراط را صدا کن','Call Socrates'],frame:['قابِ میزبان','Frame host'],cinema:['نمای سینمایی','Cinema view']};for(const [id,pair]of Object.entries(labels))button(id).textContent=pick(pair);
  n('.socrates-voice span').textContent=tx('خواندن با صدای مرورگر','Read aloud with a browser voice');n('input').checked=voice;n('input').disabled=!window.speechSynthesis;n('.socrates-status').textContent=warning;n('.socrates-note').textContent=tx('پیش‌نویسِ داستانی و قابل تمرین برای مجموعهٔ آینده؛ نقل‌قول تاریخی نیست. صدا اختیاری است؛ این حالت فایل ویدیو ضبط نمی‌کند.','An original fictional narration draft for the future series, rather than historical quotations. Voice is optional; this mode does not record a video file.');exit.textContent=tx('خروج از نمای سینمایی · Esc','Exit cinema · Esc');
 }
 function place(){const p=findHostSpot(M.player,(x,z)=>canStand(x,z)&&Math.abs(M.cityGroundHeight(x,z)-(M.player.y-M.eye))<.3);if(!p){warning=tx('برای حضور سقراط، کمی به فضای بازتر بروید.','Move to a more open spot so Socrates can stand beside you.');render();return false;}actor.group.position.set(p.x,M.cityGroundHeight(p.x,p.z),p.z);path=[];active=true;actor.group.visible=true;residents.setPresentation(true);warning='';return true;}
 function open(){if(M.mode!=='city')M.quickStart('city');panel.hidden=false;if(!active)place();render();}
 function close(){pause();active=false;actor.group.visible=false;residents.setPresentation(false);panel.hidden=true;cinema(false);}
 function visit(){pause();beat=0;M.quickStart(SOCRATES_EPISODES[index].destination);place();render();}
 button('close').onclick=close;button('visit').onclick=visit;button('play').onclick=()=>playing?pause():start();button('next').onclick=next;button('call').onclick=()=>{place();render();};button('frame').onclick=()=>{if(!active)place();M.pointToward(actor.group.position);M.player.pitch=-.08;M.clearMovement();};button('cinema').onclick=()=>{if(!active&&!place())return;cinema(true);};
 select.onchange=()=>{const nextIndex=Number(select.value);pause();index=nextIndex;beat=0;render();};n('input').onchange=e=>{voice=e.target.checked;if(!voice)stopSpeech();else if(playing)speak();};
 const oldTarget=M.city.targetInfo;M.city.targetInfo=d=>d.socratesHost?{kind:'socrates-host',data:d,title:tx('سقراط · راهنمای شهر','Socrates · City guide')}:oldTarget(d);
 const oldShow=M.showExtra;M.showExtra=info=>{if(info.kind!=='socrates-host')return oldShow(info);open();return true;};
 const oldUpdate=M.city.update;M.city.update=(...args)=>{
  oldUpdate(...args);const time=args[1],dt=Math.min(.1,lastTime?time-lastTime:0);lastTime=time;if(!active)return;
  const p=M.player,distance=Math.hypot(p.x-actor.group.position.x,p.z-actor.group.position.z),height=M.cityGroundHeight(p.x,p.z);
  const sameLevel=Math.abs(height-actor.group.position.y)<.35&&M.mode==='city';actor.group.visible=sameLevel&&distance<22;
  if(playing&&performance.now()/1000>=deadline&&!window.speechSynthesis?.speaking)next();
  if(!actor.group.visible)return;
  if(!playing&&distance>5&&distance<18&&time>=repathAt){repathAt=time+.6;const target=findHostSpot(p,canStand);if(target){const from=actor.group.position;if(clearHostSegment(canStand,from,target))path=[target];else{const bounds={minX:Math.min(from.x,target.x)-3,maxX:Math.max(from.x,target.x)+3,minZ:Math.min(from.z,target.z)-3,maxZ:Math.max(from.z,target.z)+3};path=findCityPath({bounds,canStand},from,target);}}}
  if(playing)path=[];const motion=stepAlongPath(actor.group.position,path,dt*4.2,canStand);actor.group.rotation.y=motion.heading??Math.atan2(actor.group.position.x-p.x,actor.group.position.z-p.z);actor.animate(time,{walking:motion.moved>0,talking:playing,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});
 };
 const languageChanged=()=>{pause();render();};addEventListener('city-language',languageChanged);addEventListener('keydown',e=>{if(e.key==='Escape')cinema(false);});
 addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause();});
 addEventListener('pagehide',()=>{stopSpeech();residents.setPresentation(false);actor.dispose();panel.remove();exit.remove();removeEventListener('city-language',languageChanged);},{once:true});
 render();window.CITY_SOCRATES_TOUR={open,close,visit,actor,episodes:SOCRATES_EPISODES,get active(){return active;},get playing(){return playing;}};
 return window.CITY_SOCRATES_TOUR;
}
