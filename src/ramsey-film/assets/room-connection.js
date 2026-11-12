// Same-origin room protocol. No arbitrary return URLs are accepted.
function installConversationRoom({T,scene,player,keys,getMode,explore,watch,pause,turn,walk,playPause}) {
  const embedded=new URLSearchParams(location.search).get('cityRoom')==='1'&&parent!==window;
  let active=!embedded,leaving=false,previousButtons=[];
  const exit=document.createElement('button');exit.id='leave-room';exit.textContent='Return to city';
  exit.style.cssText='position:fixed;right:16px;top:90px;z-index:30;padding:12px 18px;background:#263b35;color:#f4e6cb;border:1px solid #b8a47e;border-radius:6px;cursor:pointer';document.body.append(exit);
  function leave(){if(leaving)return;leaving=true;pause();if(embedded)parent.postMessage({type:'city-room-exit'},location.origin);else location.href=new URL('../?arrival=ramsey',location.href).href;}
  exit.onclick=leave;
  // A visible door at the open front of the set is also a walk-through exit.
  const door=new T.Group();door.name='Door back to the city';scene.add(door);
  const wood=new T.MeshStandardMaterial({color:'#6d5740',roughness:.84});
  for(const [w,h,d,x,y,z]of [[.12,2.5,.18,-.85,1.25,-2.9],[.12,2.5,.18,.85,1.25,-2.9],[1.82,.14,.18,0,2.5,-2.9]]){const m=new T.Mesh(new T.BoxGeometry(w,h,d),wood);m.position.set(x,y,z);door.add(m);}
  const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#263b35';ctx.fillRect(0,0,512,96);ctx.fillStyle='#eee0bf';ctx.font='36px Georgia';ctx.textAlign='center';ctx.fillText('City  ·  Exit',256,62);
  const sign=new T.Mesh(new T.PlaneGeometry(1.5,.28),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide}));sign.position.set(0,2.22,-2.79);door.add(sign);
  function enter(){active=true;leaving=false;previousButtons=[];explore();player.set(0,1.62,-2.35);}
  addEventListener('message',e=>{if(!embedded||e.source!==parent||e.origin!==location.origin)return;if(e.data?.type==='city-room-leave'){active=false;pause();keys.clear();}if(e.data?.type==='city-room-enter')enter();});
  addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(getMode()==='film')explore();else leave();}if(e.key.toLowerCase()==='e'&&getMode()==='explore'&&!e.repeat){e.preventDefault();watch();}},true);
  document.querySelector('#watch').textContent='Start / resume conversation';
  const instruction=document.querySelector('#explore-instruction');
  function update(dt){
    door.visible=getMode()==='explore';if(!active)return;
    const pad=Array.from(navigator.getGamepads?.()||[]).find(p=>p?.connected);
    if(pad){const down=pad.buttons.map(b=>!!b.pressed),edge=i=>down[i]&&!previousButtons[i],axis=i=>Math.abs(pad.axes[i]||0)>.18?pad.axes[i]:0;
      if(edge(0)){if(getMode()==='film')playPause();else watch();}
      if(edge(1)){if(getMode()==='film')explore();else leave();}
      if(getMode()==='explore'){turn(-axis(2)*dt*1.8,-axis(3)*dt*1.3);walk(-axis(1),axis(0),dt);}
      previousButtons=down;
    }else previousButtons=[];
    if(getMode()==='explore'){
      instruction.textContent='WASD / left stick: walk · drag / right stick: look · E / A: join the conversation · walk back through the door to leave';
      if(Math.abs(player.x)<.72&&player.z< -2.62)leave();
    }
  }
  if(embedded){enter();parent.postMessage({type:'city-room-ready'},location.origin);}
  addEventListener('pagehide',pause);
  return {update,get active(){return active;},leave};
}
