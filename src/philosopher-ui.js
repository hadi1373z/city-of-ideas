import {PHILOSOPHERS,pickLanguage} from './philosopher-data.js';
import {createPhilosopherQuarter} from './philosopher-quarter.js';

export function installPhilosopherQuarter(M,T){
 const lang=()=>window.CITY_I18N.lang,tx=(fa,en)=>CITY_I18N.tx(fa,en);
 const quarter=createPhilosopherQuarter(T,{language:lang});M.scene.add(quarter.group);window.CITY_PHILOSOPHERS=quarter;
 M.city.targets.push(...quarter.targets);M.city.buildingTargets.push(...quarter.homes.map(h=>h.group));
 M.city.landmarks.philosophers=quarter.entryFor('philosophers');
 const oldRegion=M.city.region,oldCanStand=M.city.canStand,oldTarget=M.city.targetInfo;
 M.city.region=(x,z)=>quarter.region(x,z)||oldRegion(x,z);
 M.city.canStand=(x,z)=>quarter.canStand(x,z)&&oldCanStand(x,z);
 M.city.targetInfo=data=>data.philosopherId?{kind:'philosopher',data,title:pickLanguage(PHILOSOPHERS.find(h=>h.id===data.philosopherId).name,lang())}:oldTarget(data);
 const oldStart=M.startExtra;M.startExtra=destination=>{const p=quarter.entryFor(destination);if(!p)return oldStart(destination);if(!M.city.canStand(p.x,p.z))return false;M.arrive(p);return true;};
 const dialog=document.createElement('dialog');dialog.id='philosopher-dialog';dialog.className='philosopher-dialog';dialog.setAttribute('aria-labelledby','philosopher-heading');
 dialog.innerHTML='<header><div><p class="philosopher-kicker"></p><h2 id="philosopher-heading"></h2></div><button class="glass philosopher-close" type="button"></button></header><div class="philosopher-layout"><nav class="philosopher-homes"></nav><article class="philosopher-study"><p class="philosopher-theme"></p><h3 class="philosopher-name"></h3><p class="philosopher-intro"></p><button class="primary philosopher-visit" type="button"></button><h4 class="philosopher-object-title"></h4><p class="philosopher-idea"></p><h4 class="philosopher-reading-title"></h4><p class="philosopher-reading"></p><a class="philosopher-source" target="_blank" rel="noopener noreferrer"></a><h4 class="philosopher-exercise-title"></h4><label for="philosopher-note" class="philosopher-prompt"></label><textarea id="philosopher-note" rows="4" maxlength="20000" dir="auto"></textarea><p class="philosopher-save" role="status"></p><p class="philosopher-interpretation"></p></article></div>';
 document.body.append(dialog);
 const node=selector=>dialog.querySelector(selector),note=node('textarea'),memory=new Map();let selected=PHILOSOPHERS[0],storageError=false,opener=null;
 const key=id=>'city-of-ideas:philosopher-reflection:v1:'+id;
 function readNote(id){if(memory.has(id))return memory.get(id);try{const value=localStorage.getItem(key(id))||'';memory.set(id,value);return value;}catch{storageError=true;return '';}}
 note.addEventListener('input',()=>{memory.set(selected.id,note.value);try{localStorage.setItem(key(selected.id),note.value);storageError=false;}catch{storageError=true;}saveStatus();});
 function saveStatus(){node('.philosopher-save').textContent=storageError?tx('ذخیره‌سازی مرورگر در دسترس نیست؛ متن تا زمان بازبودن این صفحه نگه داشته می‌شود.','Browser storage is unavailable; your text is kept while this page stays open.'):tx('یادداشت فقط در همین مرورگر ذخیره می‌شود.','Your reflection is saved only in this browser.');}
 function render(){
  const wasFocused=document.activeElement===note,start=note.selectionStart,end=note.selectionEnd;
  node('.philosopher-kicker').textContent=tx('محله‌ای برای پرسیدن','A NEIGHBOURHOOD FOR QUESTIONS');node('#philosopher-heading').textContent=tx('خانه‌های فیلسوفان','Homes of philosophers');
  const close=node('.philosopher-close');close.textContent=tx('بستن','Close');close.setAttribute('aria-label',tx('بستن خانه‌های فیلسوفان','Close philosophers’ homes'));
  const nav=node('nav');nav.setAttribute('aria-label',tx('انتخاب خانهٔ فیلسوف','Choose a philosopher’s home'));nav.replaceChildren();
  for(const home of PHILOSOPHERS){const button=document.createElement('button');button.type='button';button.dataset.philosopher=home.id;button.setAttribute('aria-pressed',String(home.id===selected.id));const name=document.createElement('strong'),small=document.createElement('small');name.textContent=pickLanguage(home.name,lang());small.textContent=pickLanguage(home.home,lang());button.append(name,small);button.onclick=()=>{selected=home;render();node(".philosopher-study").scrollTop=0;node(`[data-philosopher="${home.id}"]`).focus();};nav.append(button);}
  for(const [selector,field]of [['.philosopher-theme','theme'],['.philosopher-name','name'],['.philosopher-intro','intro'],['.philosopher-object-title','object'],['.philosopher-idea','idea'],['.philosopher-reading','reading'],['.philosopher-prompt','prompt']])node(selector).textContent=pickLanguage(selected[field],lang());
  node('.philosopher-visit').textContent=tx('ورود به خانهٔ ','Visit the home of ')+pickLanguage(selected.name,lang());node('.philosopher-reading-title').textContent=tx('پیشنهاد برای خواندن','A reading to explore');node('.philosopher-exercise-title').textContent=tx('تمرینِ اندیشیدن','A question to take with you');
  const source=node('a');source.href=selected.source;source.textContent=tx('منبع و مطالعهٔ بیشتر ↗','Source and further reading ↗');source.title=selected.sourceName;
  note.value=readNote(selected.id);note.setAttribute('placeholder',tx('اندیشهٔ خود را اینجا بنویسید…','Write your reflection here…'));saveStatus();
  node('.philosopher-interpretation').textContent=tx('خانه‌ها و تمرین‌ها برای این شهر طراحی شده‌اند؛ بازسازی تاریخی یا نقل‌قول از فیلسوفان نیستند.','The homes and exercises are original interpretations for this city, rather than historical reconstructions or quotations.');
  if(wasFocused){note.focus();note.setSelectionRange(start,end);}
 }
 function open(id,section='intro'){selected=PHILOSOPHERS.find(h=>h.id===id)||selected;opener=document.activeElement;M.clearMovement();render();if(!dialog.open)dialog.showModal();node('.philosopher-study').scrollTop=0;if(section==='reading')node('.philosopher-reading-title').scrollIntoView({block:'nearest'});if(section==='idea')node('.philosopher-object-title').scrollIntoView({block:'nearest'});}
 node('.philosopher-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{M.clearMovement();opener?.focus?.();});
 node('.philosopher-visit').onclick=()=>{dialog.close();M.quickStart('philosopher:'+selected.id);};
 const oldShow=M.showExtra;M.showExtra=info=>{if(info.kind!=='philosopher')return oldShow(info);open(info.data.philosopherId,info.data.philosopherSection);return true;};
 const oldTools=M.toolsExtra;M.toolsExtra=()=>{const r=quarter.region(M.player.x,M.player.z);if(!r)return oldTools();open(r.philosopherId);return true;};
 const welcome=document.createElement('button');welcome.type='button';welcome.className='glass';welcome.id='explore-philosophers';welcome.onclick=()=>open();document.querySelector('.welcome-secondary').append(welcome);
 const toolbar=document.createElement('button');toolbar.type='button';toolbar.className='glass';toolbar.id='philosophers-open';toolbar.onclick=()=>open(quarter.region(M.player.x,M.player.z)?.philosopherId);document.querySelector('.visit-actions').append(toolbar);
 const direction=document.createElement('button');direction.type='button';direction.dataset.direction='philosophers';direction.onclick=()=>{M.pointToward(M.city.landmarks.philosophers);document.querySelector('#map-panel').hidden=true;};document.querySelector('.map-directions').append(direction);
 function languageChanged(){quarter.refreshLanguage();welcome.textContent=tx('خانه‌های فیلسوفان','Philosophers’ homes');toolbar.textContent=tx('فیلسوفان','Philosophers');direction.textContent=tx('محلهٔ فیلسوفان','Philosophers’ quarter');if(dialog.open)render();}
 addEventListener('city-language',languageChanged);languageChanged();render();
 quarter.open=open;
 addEventListener('pagehide',()=>{removeEventListener('city-language',languageChanged);quarter.dispose();dialog.remove();},{once:true});
 return quarter;
}
