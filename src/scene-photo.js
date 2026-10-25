/* Export the freshly rendered first-person view, never the surrounding UI. */
(()=>{'use strict';
 function downloadPNG(blob,filename){
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=filename;link.hidden=true;document.body.append(link);
  try{link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 }
 window.createCityPhotoCapture=function({canCapture=()=>true,onState=()=>{},save=downloadPNG,now=()=>new Date()}={}){
  let pending=false,encoding=false,disposed=false;
  const emit=(state,detail={})=>onState(state,detail);
  function fail(){pending=false;encoding=false;emit('error');}
  return{
   get busy(){return pending||encoding;},
   get pending(){return pending;},
   request(){
    if(disposed||pending||encoding)return false;
    if(!canCapture()){emit('walk');return false;}
    pending=true;emit('queued');return true;
   },
   // Called synchronously just after renderer.render. Waiting until another
   // browser task can read a cleared WebGL buffer when preservation is off.
   afterRender(canvas){
    if(disposed||!pending)return false;
    pending=false;if(!canCapture()){emit('walk');return false;}
    encoding=true;
    try{
     const width=canvas.width,height=canvas.height,stamp=now().toISOString().replace(/[:.]/g,'-'),filename='city-of-ideas-photo-'+stamp+'.png';
     emit('capturing');
     canvas.toBlob(blob=>{
      if(disposed)return;
      if(!blob){fail();return;}
      try{save(blob,filename);encoding=false;emit('ready',{filename,width,height,blob});}catch{fail();}
     },'image/png');
    }catch{fail();}
    return true;
   },
   dispose(){disposed=true;pending=false;encoding=false;}
  };
 };
 window.mountCityPhotoControl=function({container,world,copy,canCapture,beforeRequest=()=>{},clearMovement=()=>{},controller,help,reducedMotion=false}){
  const button=document.createElement('button'),status=document.createElement('output'),flash=document.createElement('div');
  button.id='take-photo';button.className='glass';button.type='button';status.id='city-photo-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
  flash.id='photo-shutter';flash.setAttribute('aria-hidden','true');container.append(button);document.body.append(status,flash);
  const preview=document.createElement('dialog'),title=document.createElement('h2'),image=document.createElement('img'),caption=document.createElement('p'),save=document.createElement('button'),close=document.createElement('button');
  preview.id='city-photo-preview';preview.dataset.confirmFocused='true';preview.setAttribute('aria-labelledby','city-photo-title');title.id='city-photo-title';image.id='city-photo-image';caption.id='city-photo-caption';save.id='save-city-photo';save.type='button';save.className='primary';close.id='close-city-photo';close.type='button';close.className='close';close.textContent='×';preview.append(close,title,image,caption,save);document.body.append(preview);
  const setup=document.createElement('section'),setupTitle=document.createElement('h3'),info=document.createElement('p'),learn=document.createElement('button'),reset=document.createElement('button');
  setup.id='photo-controller-setup';info.id='photo-controller-status';info.setAttribute('role','status');learn.id='bind-photo-button';reset.id='reset-photo-button';learn.type=reset.type='button';learn.className=reset.className='glass';setup.append(setupTitle,info,learn,reset);help.append(setup);
  let state='',statusTimer,flashTimer,lastFlash=-Infinity,photo=null,photoURL=null,learning=false,connected=false,setupMessage='';
  function paint(){
   const busy=state==='queued'||state==='capturing';button.disabled=busy;button.setAttribute('aria-busy',String(busy));
   button.textContent=busy?copy('Taking photo…','Foto wird aufgenommen…','در حال گرفتن عکس…'):copy('Take photo · L1','Foto aufnehmen · L1','عکس بگیر · L1');
   button.title=copy('Take a first-person photo · P · L1 / LB','Foto aus der Ich-Perspektive aufnehmen · P · L1 / LB','گرفتن عکس از دید اول‌شخص · P · L1 / LB');
   const messages={queued:copy('Taking your photo…','Dein Foto wird aufgenommen…','در حال گرفتن عکس…'),capturing:copy('Taking your photo…','Dein Foto wird aufgenommen…','در حال گرفتن عکس…'),ready:copy('Photo taken · choose Save PNG to keep it.','Foto aufgenommen · Zum Behalten PNG speichern.','عکس گرفته شد · برای نگه‌داشتن، ذخیرهٔ PNG را بزنید.'),walk:copy('The city is still loading. Try again in a moment.','Die Stadt lädt noch. Bitte gleich erneut versuchen.','شهر هنوز در حال بارگذاری است. کمی بعد دوباره تلاش کنید.'),error:copy('Could not create the photo. Please try again.','Das Foto konnte nicht erstellt werden. Bitte erneut versuchen.','گرفتن عکس ممکن نشد. دوباره تلاش کنید.')};
   status.textContent=messages[state]||'';title.textContent=copy('Your first-person photo','Dein Foto aus der Ich-Perspektive','عکس شما از دید اول‌شخص');image.alt=title.textContent;save.textContent=copy('Save PNG · A','PNG speichern · A','ذخیرهٔ PNG · A');close.setAttribute('aria-label',copy('Close photo','Foto schließen','بستن عکس'));
   caption.textContent=photo?photo.width+' × '+photo.height+' · '+copy('B / Esc to return to the city','B / Esc zurück zur Stadt','B / Esc برای بازگشت به شهر'):'';
   setupTitle.textContent=copy('Photo button on your controller','Fototaste am Controller','دکمهٔ عکس روی دسته');
   info.textContent=learning?copy('Release all buttons, then press L1 / LB once.','Alle Tasten loslassen, dann L1 / LB einmal drücken.','همهٔ دکمه‌ها را رها کنید، سپس یک بار L1 / LB را بزنید.'):setupMessage||(!connected?copy('Keep this city tab focused, connect your controller and press a button.','Diesen Tab im Vordergrund lassen, Controller verbinden und eine Taste drücken.','این زبانهٔ شهر را فعال نگه دارید، دسته را وصل کنید و یک دکمه بزنید.'):copy('If L1 does not respond, select Set L1, then press your actual L1 button.','Wenn L1 nicht reagiert, L1 zuweisen wählen und die eigene L1-Taste drücken.','اگر L1 کار نمی‌کند، تنظیم L1 را انتخاب کنید و دکمهٔ L1 دستهٔ خود را بزنید.'));
   learn.textContent=learning?copy('Waiting for L1…','Warte auf L1…','منتظر L1…'):copy('Set L1 / LB','L1 / LB zuweisen','تنظیم L1 / LB');learn.disabled=learning;reset.textContent=copy('Use standard L1 / LB','Standard-L1 / LB verwenden','استفاده از L1 / LB استاندارد');
  }
  function showPhoto(detail){
   photo=detail;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(detail.blob);image.src=photoURL;clearMovement();paint();
   if(!preview.open)preview.showModal();save.focus();
  }
  const capture=window.createCityPhotoCapture({canCapture,save:()=>{},onState:(next,detail)=>{
   state=next;world.dataset.photoState=next;paint();status.hidden=false;clearTimeout(statusTimer);
   if(next==='ready'){world.dataset.photoFile=detail.filename;world.dataset.photoWidth=String(detail.width);world.dataset.photoHeight=String(detail.height);showPhoto(detail);}
   if(next==='capturing'&&!reducedMotion&&performance.now()-lastFlash>600){lastFlash=performance.now();flash.classList.add('firing');clearTimeout(flashTimer);flashTimer=setTimeout(()=>flash.classList.remove('firing'),220);}
   if(!['queued','capturing'].includes(next))statusTimer=setTimeout(()=>status.hidden=true,5500);
  }});
  function request(){beforeRequest();return capture.request();}
  button.onclick=request;close.onclick=()=>{preview.close();clearMovement();};preview.addEventListener('close',clearMovement);
  save.onclick=()=>{if(!photo)return;try{downloadPNG(photo.blob,photo.filename);caption.textContent=copy('PNG download started.','PNG-Download gestartet.','دریافت PNG آغاز شد.');}catch{caption.textContent=copy('Download did not start. Try clicking Save PNG.','Download nicht gestartet. Bitte PNG speichern anklicken.','دریافت آغاز نشد. روی ذخیرهٔ PNG کلیک کنید.');}};
  learn.onclick=()=>{clearMovement();setupMessage='';learning=controller.beginPhotoBinding();if(!learning)setupMessage=copy('Press any controller button first, then choose Set L1 again.','Zuerst eine Controller-Taste drücken, dann L1 zuweisen wählen.','ابتدا یک دکمهٔ دسته را بزنید، سپس دوباره تنظیم L1 را انتخاب کنید.');paint();};
  reset.onclick=()=>{controller.resetPhotoBinding();learning=false;setupMessage=copy('Standard L1 / LB restored.','Standard-L1 / LB wiederhergestellt.','L1 / LB استاندارد بازگردانده شد.');paint();};
  const cancelBinding=()=>{controller.cancelPhotoBinding();learning=false;paint();};help.addEventListener('close',cancelBinding);addEventListener('blur',cancelBinding);
  function updateController(input){
   const changed=connected!==input.connected||learning!==input.photoLearning||input.photoAssigned;connected=input.connected;learning=input.photoLearning;
   world.dataset.photoButton=String(input.photoButton);world.dataset.photoBinding=String(learning);
   if(input.photoAssigned)setupMessage=input.photoMappingSaved?copy('L1 assigned and saved. Press L1 again to take a photo.','L1 zugewiesen und gespeichert. Für ein Foto L1 erneut drücken.','L1 تنظیم و ذخیره شد. برای گرفتن عکس دوباره L1 را بزنید.'):copy('L1 assigned for this visit. Press it again to take a photo.','L1 für diesen Besuch zugewiesen. Für ein Foto erneut drücken.','L1 برای این بازدید تنظیم شد. برای عکس دوباره آن را بزنید.');
   if(!connected)setupMessage='';if(changed)paint();
  }
  paint();addEventListener('city-language',paint);
  const dispose=()=>{capture.dispose();clearTimeout(statusTimer);clearTimeout(flashTimer);if(photoURL)URL.revokeObjectURL(photoURL);removeEventListener('city-language',paint);removeEventListener('blur',cancelBinding);button.remove();status.remove();flash.remove();preview.remove();setup.remove();};
  addEventListener('pagehide',dispose,{once:true});
  return{request,get pending(){return capture.pending;},get busy(){return capture.busy;},afterRender:canvas=>capture.afterRender(canvas),updateController,dispose};
 };
})();
