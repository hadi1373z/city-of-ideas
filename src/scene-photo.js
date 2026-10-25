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
      try{save(blob,filename);encoding=false;emit('ready',{filename,width,height});}catch{fail();}
     },'image/png');
    }catch{fail();}
    return true;
   },
   dispose(){disposed=true;pending=false;encoding=false;}
  };
 };
 window.mountCityPhotoControl=function({container,world,copy,canCapture,reducedMotion=false}){
  const button=document.createElement('button'),status=document.createElement('output'),flash=document.createElement('div');
  button.id='take-photo';button.className='glass';button.type='button';status.id='city-photo-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
  flash.id='photo-shutter';flash.setAttribute('aria-hidden','true');container.append(button);document.body.append(status,flash);
  let state='',receipt={},statusTimer,flashTimer,lastFlash=-Infinity;
  function paint(){
   const busy=state==='queued'||state==='capturing';button.disabled=busy;button.setAttribute('aria-busy',String(busy));
   button.textContent=busy?copy('Taking photo…','Foto wird aufgenommen…','در حال گرفتن عکس…'):copy('Take photo · L1','Foto aufnehmen · L1','عکس بگیر · L1');
   button.title=copy('Save a clean first-person photo · P · L1 / LB','Foto aus der Ich-Perspektive speichern · P · L1 / LB','ذخیرهٔ عکس از دید اول‌شخص · P · L1 / LB');
   const messages={queued:copy('Taking your photo…','Dein Foto wird aufgenommen…','در حال گرفتن عکس…'),capturing:copy('Taking your photo…','Dein Foto wird aufgenommen…','در حال گرفتن عکس…'),ready:copy('Photo ready · PNG download started','Foto bereit · PNG-Download gestartet','عکس آماده است · دریافت PNG آغاز شد'),walk:copy('Return to walking to take a first-person photo.','Zum Gehen zurückkehren, um ein Foto aus der Ich-Perspektive aufzunehmen.','برای گرفتن عکس از دید اول‌شخص، به حالت پیاده‌روی برگردید.'),error:copy('Could not create the photo. Please try again.','Das Foto konnte nicht erstellt werden. Bitte erneut versuchen.','گرفتن عکس ممکن نشد. دوباره تلاش کنید.')};
   status.textContent=messages[state]||'';
   if(state==='ready')status.textContent+=' · '+receipt.width+' × '+receipt.height;
  }
  const capture=window.createCityPhotoCapture({canCapture,onState:(next,detail)=>{
   state=next;receipt=detail;world.dataset.photoState=next;paint();status.hidden=false;clearTimeout(statusTimer);
   if(next==='ready'){world.dataset.photoFile=detail.filename;world.dataset.photoWidth=String(detail.width);world.dataset.photoHeight=String(detail.height);}
   if(next==='capturing'&&!reducedMotion&&performance.now()-lastFlash>600){lastFlash=performance.now();flash.classList.add('firing');clearTimeout(flashTimer);flashTimer=setTimeout(()=>flash.classList.remove('firing'),220);}
   if(!['queued','capturing'].includes(next))statusTimer=setTimeout(()=>status.hidden=true,5500);
  }});
  button.onclick=()=>capture.request();paint();addEventListener('city-language',paint);
  const dispose=()=>{capture.dispose();clearTimeout(statusTimer);clearTimeout(flashTimer);removeEventListener('city-language',paint);button.remove();status.remove();flash.remove();};
  addEventListener('pagehide',dispose,{once:true});
  return{request:()=>capture.request(),afterRender:canvas=>capture.afterRender(canvas),dispose};
 };
})();
