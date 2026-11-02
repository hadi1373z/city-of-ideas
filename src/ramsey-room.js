// A room boundary keeps the city alive while the larger conversation scene loads.
export function crossedRamseyDoor(previous, current, origin) {
  return !!previous && previous.z >= origin.z + 8 && current.z < origin.z + 8 &&
    current.z > origin.z + 5 && Math.abs(current.x - origin.x) < 1.5;
}
export function installRamseyRoom(M) {
  const house=M.ramseyHouse, lang=()=>window.CITY_I18N.lang;
  const label=(en,de,fa)=>lang()==='fa'?fa:lang()==='de'?de:en;
  const dialog=document.createElement('dialog');dialog.id='ramsey-room';
  dialog.setAttribute('aria-label','Ramsey House conversation room');
  const exit=document.createElement('button');exit.className='glass';exit.dataset.close='';
  const status=document.createElement('p');status.setAttribute('role','status');
  const frame=document.createElement('iframe');frame.title='Ramsey House · ten-minute conversation';frame.allow='autoplay; gamepad';
  dialog.append(exit,status,frame);document.body.append(dialog);
  let previous=null,ready=false,timer=null,closedAt=0,musicWasPlaying=false;
  const outside=()=>({x:house.origin.x,z:house.origin.z+9.6,y:house.origin.y,yaw:Math.PI});
  function visit(){document.querySelector('#welcome')?.setAttribute('hidden','');M.arrive({...outside(),yaw:0});}
  function enter(){
    if(dialog.open)return;
    M.clearMovement();musicWasPlaying=document.querySelector("#music-toggle")?.getAttribute("aria-pressed")==="true";if(musicWasPlaying)document.querySelector("#music-toggle").click();dialog.showModal();status.hidden=ready;
    if(!frame.hasAttribute('src'))frame.src=new URL('./ramsey-film/index.html?cityRoom=1',import.meta.url).href;
    else frame.contentWindow?.postMessage({type:'city-room-enter'},location.origin);
    if(ready)frame.focus();else exit.focus();exit.hidden=ready;clearTimeout(timer);timer=setTimeout(()=>{if(!ready)status.textContent=label('The room is still loading. You can return to the city and try again.','Der Raum lädt noch. Du kannst zur Stadt zurückkehren.','اتاق هنوز در حال بارگذاری است. می‌توانی به شهر برگردی.');},25000);
  }
  function leave(){if(dialog.open)dialog.close();}
  dialog.addEventListener('close',()=>{
    clearTimeout(timer);frame.contentWindow?.postMessage({type:'city-room-leave'},location.origin);
    if(musicWasPlaying){document.querySelector("#music-toggle")?.click();musicWasPlaying=false;}closedAt=performance.now();previous=null;M.arrive(outside());M.clearMovement();
    document.querySelector('#world')?.focus();
  });
  exit.onclick=leave;
  const message=e=>{
    if(e.origin!==location.origin||e.source!==frame.contentWindow)return;
    if(e.data?.type==='city-room-ready'){ready=true;exit.hidden=true;clearTimeout(timer);status.hidden=true;if(dialog.open){frame.contentWindow.postMessage({type:'city-room-enter'},location.origin);frame.focus();}}
    if(e.data?.type==='city-room-exit')leave();
  };addEventListener('message',message);
  const oldUpdate=M.city.update;
  M.city.update=(...args)=>{oldUpdate(...args);const current={x:M.player.x,z:M.player.z};
    if(!dialog.open&&M.mode==='city'&&!document.querySelector('dialog[open]')&&performance.now()-closedAt>700&&crossedRamseyDoor(previous,current,house.origin))enter();
    if(dialog.open)M.clearMovement();previous=current;
  };
  const link=document.querySelector('#ramsey-film-link');
  if(link){link.href='#ramsey-house';link.onclick=e=>{e.preventDefault();visit();};}
  const join=document.querySelector('#ramsey-join');if(join)join.onclick=enter;
  const map=document.createElement('button');map.onclick=()=>{document.querySelector('#map-panel').hidden=true;visit();};document.querySelector('.map-directions')?.append(map);
  function locale(){exit.textContent=label('Return to city','Zurück zur Stadt','بازگشت به شهر');status.textContent=label('Entering Ramsey House…','Ramsey-Haus wird geöffnet…','در حال ورود به خانهٔ رمزی…');const title=label('Visit Ramsey’s conversation','Ramsays Gespräch besuchen','دیدار از گفت‌وگوی رمزی');if(link)link.textContent=title;map.textContent=label('Ramsey House','Ramsey-Haus','خانهٔ رمزی');if(join)join.textContent=label('Enter conversation room','Gesprächsraum betreten','ورود به اتاق گفت‌وگو');}
  addEventListener('city-language',locale);locale();
  M.ramseyRoom={enter,leave,visit,get active(){return dialog.open;}};
  if(new URLSearchParams(location.search).get('arrival')==='ramsey')visit();
  addEventListener('pagehide',()=>{clearTimeout(timer);removeEventListener('message',message);removeEventListener('city-language',locale);dialog.remove();},{once:true});
  return M.ramseyRoom;
}
