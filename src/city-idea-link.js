(()=>{'use strict';
// Public bridge between the experimental room and the existing walking city.
// The crossing reloads the existing city renderer; it does not merge house/private data.
function start(){
 const M=window.CITY_MAIN,T=window.THREE;if(!M?.scene||!T)return;
 const portal=new T.Group();portal.name='Imagined Room — public street entrance';
 const bronze=new T.MeshStandardMaterial({color:0x9e8757,metalness:.45,roughness:.6}),glow=new T.MeshStandardMaterial({color:0xc29a56,emissive:0x9d7032,emissiveIntensity:.65});
 function box(w,h,d,x,y,z,material){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);portal.add(m);return m;}
 box(3.4,.2,1.8,0,.1,0,bronze);box(.22,3,.3,-1.45,1.6,0,bronze);box(.22,3,.3,1.45,1.6,0,bronze);box(3.12,.22,.3,0,3.05,0,bronze);
 box(2.15,2.55,.06,0,1.48,0,new T.MeshBasicMaterial({color:0x6d6250,side:T.DoubleSide,transparent:true,opacity:.22,depthWrite:false}));
 box(2.6,.07,.12,0,2.6,.2,glow);
 portal.position.set(13,.13,105);M.scene.add(portal);
 const controls=document.querySelector('.visit-actions'),welcome=document.querySelector('.welcome-secondary');
 if(welcome){const a=document.createElement('a');a.href='idea-room.html';a.className='glass';a.textContent='Imagine a room';a.style.textDecoration='none';welcome.append(a);}
 const button=document.createElement('button');button.type='button';button.className='glass';button.textContent='Enter imagined room';button.hidden=true;
 const name='idea-room-portal';button.id=name;
 if(controls)controls.append(button);
 const enter=()=>{location.href='idea-room.html';};button.addEventListener('click',enter);
 const near=()=>M.mode==='city'&&Math.hypot(M.player.x-13,M.player.z-105)<8;
 const update=()=>{button.hidden=!near();};
 const interval=setInterval(update,300);update();
 // E near the visible portal acts like a door; existing E functions elsewhere remain unaffected.
 addEventListener('keydown',e=>{if(e.code==='KeyE'&&near()&&!e.repeat&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();e.stopImmediatePropagation();enter();}},{capture:true});
 // The link works on touch/click as well as E.
 const canvas=document.querySelector('#world canvas');
 canvas?.addEventListener('click',e=>{if(!near())return;const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),M.camera);if(ray.intersectObjects(portal.children,true).length)enter();},{capture:true});
 addEventListener('pagehide',()=>clearInterval(interval),{once:true});
 if(new URLSearchParams(location.search).get('from')==='idea-room'){
   M.quickStart('city');
   let data;try{data=JSON.parse(localStorage.getItem('city-idea-room-v1')||'null');}catch{}
   const banner=document.createElement('div');banner.id='idea-room-arrival';banner.setAttribute('role','status');
   const line=document.createElement('p');line.style.margin='0';line.style.fontSize='12px';
   const thought=typeof data?.thought==='string'&&data.thought.trim()?data.thought.trim():'What should a place remember?';
   const n=Number(data?.elapsedMs)||0,sec=Math.floor(Math.max(0,n)/1000);
   const elapsed=Math.floor(sec/60)+'m '+(sec%60)+'s';
   line.textContent='You brought an idea into the city: '+thought+' · Room journey '+elapsed;
   const back=document.createElement('a');back.href='idea-room.html';back.textContent='Return to room';back.style.color='#ffe0a2';back.style.marginTop='7px';back.style.display='inline-block';
   banner.append(line,back);
   Object.assign(banner.style,{position:'fixed',top:'100px',left:'max(12px, 5vw)',maxWidth:'min(390px, 84vw)',background:'#14242bf2',color:'#f5e6c9',border:'1px solid #d4ba80',padding:'14px',borderRadius:'8px',zIndex:'10',lineHeight:'1.5',boxShadow:'0 10px 30px #0008'});
   document.body.append(banner);
 }
}
if(window.CITY_MAIN?.scene)start();else addEventListener('gallery-ready',start,{once:true});
})();