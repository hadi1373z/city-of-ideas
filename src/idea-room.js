(()=>{'use strict';
const $=id=>document.getElementById(id),KEY='city-idea-room-v1';
const fallback={description:'A solitary reader in a quiet study, an open notebook on a wooden desk, and a window toward the mountains.',thought:'',elapsedMs:0,lightMode:'evening',updatedAt:0};
let state;try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');state={...fallback,...(saved&&typeof saved==='object'?saved:{})};}catch{state={...fallback};}
const incoming=new URLSearchParams(location.search).get('idea');
if(incoming&&incoming.length<=400)state.description=incoming;
$('description').value=String(state.description||fallback.description).slice(0,400);
$('thought').value=String(state.thought||'').slice(0,350);
const T=window.THREE;
if(!T){$('status').textContent='The three-dimensional renderer is unavailable in this browser.';return;}
const scene=new T.Scene();scene.background=new T.Color('#485e66');scene.fog=new T.Fog('#485e66',18,80);
const camera=new T.PerspectiveCamera(72,innerWidth/innerHeight,.1,105),renderer=new T.WebGLRenderer({antialias:true,powerPreference:'low-power'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=T.SRGBColorSpace;
$('world').append(renderer.domElement);
const ambient=new T.HemisphereLight('#b7d6ed','#534331',1.3),sun=new T.DirectionalLight('#f7c87f',1.6);sun.position.set(-7,13,-8);scene.add(ambient,sun);
const world=new T.Group();scene.add(world);let room=new T.Group(),theta=0;
const mat=color=>new T.MeshStandardMaterial({color,roughness:.82}),wood=mat('#79583c'),stone=mat('#89928b'),gold=mat('#b9a16a'),paper=mat('#e1d6bb'),dark=mat('#263638'),fabric=mat('#49615f');
function block(group,w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);group.add(o);return o;}
function sphere(group,r,x,y,z,m){const o=new T.Mesh(new T.SphereGeometry(r,16,12),m);o.position.set(x,y,z);group.add(o);return o;}
function label(group,text,x,y,z,width=5){const c=document.createElement('canvas');c.width=1024;c.height=128;const a=c.getContext('2d');a.fillStyle='#f3dfb5';a.textAlign='center';a.font='44px Georgia';a.fillText(text,512,81);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(width,.64),new T.MeshBasicMaterial({map:t,transparent:true,side:T.DoubleSide}));o.position.set(x,y,z);group.add(o);}
function themeFor(text){const v=String(text).toLowerCase();if(/forest|tree|garden|flowers|plants|nature/.test(v))return 'garden';if(/star|sky|telescope|observatory|cosmos|planet/.test(v))return 'observatory';if(/library|shelves|books/.test(v))return 'library';return 'study';}
function build(description){
 world.remove(room);room.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map)o.material.map.dispose();if(o.material)o.material.dispose?.();});room=new T.Group();world.add(room);
 const theme=themeFor(description),wall=mat(theme==='garden'?'#65776b':theme==='observatory'?'#354251':'#9a9686'),floor=mat(theme==='garden'?'#657352':'#aaa18a');
 block(room,12,.25,12,0,-.18,0,floor);block(room,12,4,.25,0,2,6,wall);
 block(room,.25,4,12,-6,2,0,wall);block(room,.25,4,12,6,2,0,wall);
 block(room,4.4,4,.25,-3.8,2,-6,wall);block(room,4.4,4,.25,3.8,2,-6,wall);block(room,3.2,.8,.25,0,3.6,-6,wall);
 // A window toward the city; the street and exit remain visible through the front doorway.
 block(room,1.9,1.25,.08,3.0,2.1,5.82,dark);
 block(room,1.6,.99,.05,3,2.1,5.78,new T.MeshBasicMaterial({color:'#7fabc0'}));
 block(room,3.4,.19,1.5,0,.86,-1.6,wood);for(const x of [-1.45,1.45])for(const z of [-2.1,-1.1])block(room,.16,.85,.16,x,.42,z,wood);
 block(room,.85,.12,.85,-2,.55,-.4,wood);block(room,.15,.9,.15,-2,.46,-.4,dark);
 block(room,.85,1,.14,-2,1,-.75,wood);
 // The solitary reader is an intentionally simple, non-photoreal character.
 const coat=mat('#414e68'),face=mat('#cfb19a');
 block(room,.85,1.15,.55,-2,1.22,-.3,coat);sphere(room,.38,-2,2,-.3,face);
 block(room,.55,.035,.42,-.65,.99,-1.55,paper);block(room,.55,.035,.42,-.08,.99,-1.55,paper);
 block(room,.22,.6,.22,2.3,.3,-3.6,gold);sphere(room,.26,2.3,.72,-3.6,gold);
 if(theme==='library'){for(const x of [-4.8,-3.5,3.5,4.8]){block(room,.85,2.7,.7,x,1.35,3,wood);for(let h=0;h<3;h++)block(room,.74,.24,.54,x,.65+h*.72,2.97,paper);}}
 if(theme==='garden'){for(const x of [-4.7,4.7]){block(room,.4,.6,.4,x,.3,1.8,wood);sphere(room,.8,x,1.2,1.8,mat('#44664c'));}}
 if(theme==='observatory'){const scope=block(room,1,.4,.4,3,1.7,1.8,gold);scope.rotation.z=-.45;block(room,.1,1.2,.1,3,.7,1.8,wood);}
 const street=mat('#646b64'),edge=mat('#c2b293');
 block(room,11,.18,25,0,-.18,-18.5,street);for(let k=0;k<10;k++)block(room,10,.03,.13,0,-.065,-8-k*2,edge);
 for(const z of [-10,-17,-25])for(const x of [-4.9,4.9]){block(room,.12,3,.12,x,1.5,z,dark);sphere(room,.24,x,3.08,z,gold);}
 for(const x of [-11,11])for(let n=0;n<4;n++)block(room,3,5+n%2*1.8,3,x,2.3,-11-n*5,dark);
 block(room,3.7,4,.28,0,2,-30,dark);label(room,'CITY OF IDEAS',0,3,-29.79,4.1);
 label(room,'IMAGINE  ·  EXPERIENCE',0,2.85,5.73,4.8);
 $('place').textContent='Imagined '+theme;
}
const format=ms=>{const s=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
const savedElapsed=Number.isFinite(Number(state.elapsedMs))?Math.max(0,Math.min(86400000,Number(state.elapsedMs))):0;
let baseElapsed=savedElapsed,lastSave=performance.now(),start=performance.now(),pos={x:0,z:3.3},yaw=0,pitch=0,drag=false,oldX=0,oldY=0,keys={};
function elapsed(){return baseElapsed+performance.now()-start;}
function persist(){state.description=$('description').value.trim().slice(0,400)||fallback.description;state.thought=$('thought').value.trim().slice(0,350);state.elapsedMs=elapsed();state.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{$('status').textContent='Local storage is blocked; your progress may not persist.';return false;}}
function message(text){$('status').textContent=text;}
function updateLight(){const day=state.lightMode==='day';ambient.intensity=day?2:1.1;sun.intensity=day?2.4:1.0;scene.background.set(day?'#829fa6':'#344957');scene.fog.color.copy(scene.background);$('light').textContent=day?'Time: morning':'Time: evening';}
function city(){persist();location.href='index.html?from=idea-room';}
$('imagine').onclick=()=>{const d=$('description').value.trim();if(!d){message('Describe a person or place first.');return;}build(d);pos={x:0,z:3.3};yaw=0;persist();message('Created a '+themeFor(d)+' from simple shapes. Walk toward the door to find the city street.');};
$('reader').onclick=()=>message('The reader looks up: “If this place could remember one thought of yours, what would you want it to carry?” Write your response below.');
$('notebook').onclick=()=>{$('thought').focus();message('The notebook is open. Leave one thought for the city to remember.');};
$('save').onclick=()=>{persist();message(state.thought?'Your idea is saved locally. Take it through the door.':'Write a thought first, or take the question from the reader with you.');};
$('street').onclick=()=>{pos.x=0;pos.z=-7.7;message('You crossed the threshold. Follow the lamps to the City of Ideas portal.');};
$('light').onclick=()=>{state.lightMode=state.lightMode==='day'?'evening':'day';updateLight();persist();};
$('share').onclick=async()=>{const d=$('description').value.trim()||fallback.description;const link=new URL('idea-room.html',location.href);link.searchParams.set('idea',d.slice(0,400));try{if(navigator.share)await navigator.share({title:'A room in City of Ideas',url:link.href});else if(navigator.clipboard){await navigator.clipboard.writeText(link.href);message('Room-description link copied. Personal notebook text is not included.');}else message('Copy this room description to share it.');}catch(e){if(e.name!=='AbortError')message('Could not share. Your room is still saved locally.');}};
const surface=renderer.domElement;
surface.addEventListener('pointerdown',e=>{drag=true;oldX=e.clientX;oldY=e.clientY;surface.setPointerCapture?.(e.pointerId);});
surface.addEventListener('pointerup',()=>drag=false);
surface.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-oldX)*.004;pitch=Math.max(-.8,Math.min(.8,pitch-(e.clientY-oldY)*.003));oldX=e.clientX;oldY=e.clientY;});
addEventListener('keydown',e=>{if(['TEXTAREA','INPUT'].includes(document.activeElement?.tagName))return;keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&pos.z<-24)city();});
addEventListener('keyup',e=>keys[e.code]=false);
document.querySelectorAll('[data-move]').forEach(b=>{const name=b.dataset.move;const set=value=>{keys['touch-'+name]=value;};b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);set(true);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>set(false));});
function inAllowed(x,z){const withinRoom=Math.abs(x)<5.65&&z>-5.65&&z<5.65;const threshold=Math.abs(x)<1.4&&z>=-6.5&&z<=-5.5;const outside=Math.abs(x)<5.3&&z<=-6.0&&z>-30;return withinRoom||threshold||outside;}
function movement(dt){const forward=Number(!!(keys.KeyW||keys.ArrowUp||keys['touch-forward']))-Number(!!(keys.KeyS||keys.ArrowDown||keys['touch-back']));const right=Number(!!(keys.KeyD||keys.ArrowRight||keys['touch-right']))-Number(!!(keys.KeyA||keys.ArrowLeft||keys['touch-left']));if(!forward&&!right)return;const speed=Math.min(dt,.05)*3.8/Math.max(1,Math.hypot(forward,right));const nx=pos.x+(Math.sin(yaw)*forward+Math.cos(yaw)*right)*speed,nz=pos.z+(-Math.cos(yaw)*forward+Math.sin(yaw)*right)*speed;if(inAllowed(nx,pos.z))pos.x=nx;if(inAllowed(pos.x,nz))pos.z=nz;if(pos.z<-29)city();}
function frame(now){requestAnimationFrame(frame);const dt=(now-(theta||now))/1000;theta=now;movement(dt);camera.position.set(pos.x,1.65,pos.z);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;renderer.render(scene,camera);$('elapsed').textContent=format(elapsed());if(now-lastSave>8000){persist();lastSave=now;}}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
addEventListener('pagehide',persist);build(state.description);updateLight();message('Walk forward (W / ↑) through the doorway. Your idea and journey time can travel into the city.');
setInterval(()=>{$('local-time').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Prague',hour:'2-digit',minute:'2-digit'}).format(new Date())+' Prague';},500);
requestAnimationFrame(frame);
})();