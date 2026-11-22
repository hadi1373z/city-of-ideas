/* Shared analog touch input. The native city controller still owns movement. */
(()=>{'use strict';
 window.createCityJoystick=function(stick,{onStart=()=>{},doc=document,events=window}={}){
  let pointerId=null,rect=null,radius=30,forward=0,strafe=0,disposed=false;const held=new Set(),bindings=[];
  const bind=(node,type,fn,options)=>{node.addEventListener(type,fn,options);bindings.push(()=>node.removeEventListener(type,fn,options));};
  function draw(x=0,y=0){stick.style.setProperty('--joystick-x',x+'px');stick.style.setProperty('--joystick-y',y+'px');stick.classList.toggle('is-active',pointerId!==null||held.size>0);stick.dataset.forward=forward.toFixed(3);stick.dataset.strafe=strafe.toFixed(3);}
  function reset(){const id=pointerId;pointerId=null;held.clear();forward=strafe=0;draw();if(id!==null)try{stick.releasePointerCapture(id);}catch{}}
  function point(e){const dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,length=Math.hypot(dx,dy),scale=length>radius?radius/length:1,x=dx*scale,y=dy*scale,magnitude=Math.min(1,length/radius),amount=Math.max(0,(magnitude-.12)/.88);const ix=Math.abs(dx)<=radius*.12?0:dx,iy=Math.abs(dy)<=radius*.12?0:dy,intent=Math.hypot(ix,iy);strafe=intent?ix/intent*amount:0;forward=intent?-iy/intent*amount:0;draw(x,y);}
  bind(stick,'pointerdown',e=>{if(disposed||pointerId!==null||e.button!==undefined&&e.button!==0)return;e.preventDefault();e.stopPropagation();onStart();held.clear();rect=stick.getBoundingClientRect();const thumb=stick.querySelector('.joystick-thumb');radius=Math.max(8,(Math.min(rect.width,rect.height)-(thumb?.offsetWidth||54))/2-9);pointerId=e.pointerId;stick.focus({preventScroll:true});try{stick.setPointerCapture(pointerId);}catch{}point(e);});
  bind(stick,'pointermove',e=>{if(e.pointerId!==pointerId)return;if(e.pointerType==='mouse'&&e.buttons===0){reset();return;}e.preventDefault();e.stopPropagation();point(e);});
  const release=e=>{if(e.pointerId===pointerId){e.preventDefault?.();reset();}};
  for(const type of['pointerup','pointercancel','lostpointercapture'])bind(stick,type,release);
  // The capture normally delivers release to the stick. This also covers a
  // browser that loses capture while another finger is looking around.
  for(const type of['pointerup','pointercancel'])bind(events,type,release);
  const keyMap={ArrowUp:'forward',KeyW:'forward',ArrowDown:'back',KeyS:'back',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
  function keyboard(){const x=(held.has('right')?1:0)-(held.has('left')?1:0),y=(held.has('back')?1:0)-(held.has('forward')?1:0),length=Math.max(1,Math.hypot(x,y));strafe=x/length;forward=-y/length;draw(strafe*radius,-forward*radius);}
  bind(stick,'keydown',e=>{const key=keyMap[e.code];if(key){e.preventDefault();e.stopPropagation();if(pointerId!==null)return;if(!held.size)onStart();held.add(key);keyboard();}else if(['Space','Enter','Escape'].includes(e.code)){e.preventDefault();e.stopPropagation();reset();}});
  bind(stick,'keyup',e=>{const key=keyMap[e.code];if(key){e.preventDefault();e.stopPropagation();held.delete(key);if(pointerId===null)keyboard();}});
  bind(stick,'blur',()=>{if(pointerId===null)reset();});bind(events,'blur',reset);bind(events,'resize',reset);bind(events,'pagehide',reset);bind(doc,'visibilitychange',()=>{if(doc.hidden)reset();});
  draw();return{poll(blocked=false){if(blocked||doc.hidden){if(pointerId!==null||held.size||forward||strafe)reset();}return{forward,strafe};},reset,dispose(){if(disposed)return;reset();disposed=true;bindings.splice(0).forEach(unbind=>unbind());}};
 };
 const stick=document.querySelector('[data-joystick]');
 if(stick)window.CITY_TOUCH=window.createCityJoystick(stick,{onStart(){for(const dialog of document.querySelectorAll('dialog[open][data-workbench="true"]'))dialog.close('movement');}});
 function initMenu(){
  const toggle=document.getElementById('city-mobile-menu'),header=document.getElementById('city-header-buttons'),actions=document.querySelector('.visit-actions');if(!toggle||!header||!actions)return null;
  const media=matchMedia('(max-width:800px), (max-width:960px) and (max-height:500px)'),headerHome=document.createComment('Desktop header controls'),actionsHome=document.createComment('Desktop visit controls');header.before(headerHome);actions.before(actionsHome);
  const menu=document.createElement('dialog');menu.id='city-controls-menu';menu.className='city-controls-menu';menu.dataset.confirmFocused='true';menu.setAttribute('aria-labelledby','city-controls-menu-title');
  const top=document.createElement('header'),title=document.createElement('h2'),close=document.createElement('button'),headerSlot=document.createElement('div'),actionsSlot=document.createElement('div');title.id='city-controls-menu-title';close.id='close-city-controls-menu';close.className='close';close.type='button';close.textContent='×';headerSlot.className='mobile-menu-header-controls';actionsSlot.className='mobile-menu-visit-controls';top.append(title,close);menu.append(top,headerSlot,actionsSlot);
  const backdrop=document.createElement('button');backdrop.type='button';backdrop.className='city-controls-backdrop';backdrop.hidden=true;backdrop.tabIndex=-1;document.body.append(backdrop,menu);
  let open=false;
  const clear=()=>{window.CITY_TOUCH?.reset();window.CITY_MAIN?.clearMovement?.();};
  function finish(focus=false){open=false;toggle.setAttribute('aria-expanded','false');delete document.body.dataset.mobileMenu;backdrop.hidden=true;clear();if(focus&&media.matches)toggle.focus();}
  function hide(focus=true){if(menu.open)menu.close();finish(focus);}
  function show(){if(!media.matches||open)return;clear();open=true;toggle.setAttribute('aria-expanded','true');document.body.dataset.mobileMenu='open';backdrop.hidden=false;menu.show();close.focus();}
  toggle.addEventListener('click',()=>open?hide():show());close.addEventListener('click',()=>hide());backdrop.addEventListener('click',()=>hide());menu.addEventListener('close',()=>finish());
  // Close before the original action handler runs, so a newly opened reader
  // owns focus and is never mistaken for this controls sheet.
  menu.addEventListener('click',e=>{const target=e.target.closest('button,a[href]');if(target&&target!==close)hide(false);},true);
  document.addEventListener('keydown',e=>{if(!open)return;if(e.code==='Escape'){e.preventDefault();e.stopPropagation();hide();return;}if(e.code==='Tab'){const nodes=[...menu.querySelectorAll('button,a[href],input,select,[tabindex]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}},true);
  function layout(){hide(false);if(media.matches){headerSlot.append(header);actionsSlot.append(actions);}else{headerHome.after(header);actionsHome.after(actions);}}
  media.addEventListener('change',layout);layout();return{menu,title,close,toggle,backdrop,show,hide,get open(){return open;}};
 }
 const menu=initMenu();if(menu)window.CITY_MOBILE_MENU=menu;
 function copy(){const lang=document.documentElement.lang,fa=lang==='fa',de=lang==='de';if(stick){stick.setAttribute('aria-label',fa?'جوی‌استیک حرکت':de?'Bewegungs-Joystick':'Movement joystick');const help=document.getElementById('city-joystick-help');if(help)help.textContent=fa?'با جوی‌استیک چپ حرکت کنید؛ برای توقف رها کنید. سمت راست تصویر را برای نگاه‌کردن بکشید.':de?'Mit dem linken Joystick bewegen; zum Anhalten loslassen. Rechts ziehen, um sich umzusehen.':'Move with the left joystick; release to stop. Drag the right side to look.';}
  const look=document.getElementById('city-look-label');if(look)look.textContent=fa?'کشیدن برای نگاه':de?'Ziehen zum Umsehen':'Drag to look';const lookHelp=document.getElementById('city-look-help');if(lookHelp)lookHelp.textContent=fa?'سمت راست تصویر را برای چرخیدن و نگاه به بالا یا پایین بکشید. می‌توانید هم‌زمان با انگشت دیگر حرکت کنید.':de?'Rechts ziehen, um sich zu drehen und nach oben oder unten zu schauen. Gleichzeitig mit dem anderen Finger bewegen.':'Drag the right side to turn and look up or down. Move with the other finger at the same time.';
  if(menu){menu.title.textContent=fa?'کنترل‌ها':de?'Steuerung':'Controls';menu.toggle.setAttribute('aria-label',fa?'باز و بسته کردن کنترل‌ها':de?'Steuerung öffnen oder schließen':'Open or close controls');const label=fa?'بستن کنترل‌ها':de?'Steuerung schließen':'Close controls';menu.close.setAttribute('aria-label',label);menu.backdrop.setAttribute('aria-label',label);}}
 copy();addEventListener('city-language',copy);
 addEventListener('city-look-used',()=>{const label=document.getElementById('city-look-label');if(label)label.hidden=true;},{once:true});
})();
