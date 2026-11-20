// Public submissions live in a dedicated service; private House data is unrelated.
(()=>{
 const origin='https://city-of-ideas-guestbook.nutmeg-ibex-4408.chatgpt.site';
 const button=document.createElement('button');button.id='city-comment-open';button.className='glass';button.type='button';button.textContent='Leave a comment';
 const dialog=document.createElement('dialog');dialog.id='city-guestbook';dialog.setAttribute('aria-labelledby','city-guestbook-title');
 dialog.innerHTML='<header><h2 id="city-guestbook-title">A note to the city</h2><button type="button" aria-label="Close comment form">×</button></header><form><p>What surprised you? What should we improve?</p><label for="city-comment-name">Name <small>Optional · a nickname is fine</small></label><input id="city-comment-name" name="name" maxlength="60" autocomplete="nickname" dir="auto"><label for="city-comment-body">Your comment</label><textarea id="city-comment-body" name="body" required minlength="5" maxlength="2000" dir="auto" placeholder="Tell us about your visit…"></textarea><small id="city-comment-count">0 / 2000</small><div class="comment-trap" aria-hidden="true"><label for="city-comment-website">Leave empty</label><input id="city-comment-website" name="website" tabindex="-1" autocomplete="off"></div><p class="comment-privacy">Sent privately to the city’s creator. Other visitors cannot see your comment. No account is needed.</p><button class="comment-send" type="submit">Send comment</button><p id="city-comment-status" role="status" aria-live="polite"></p></form>';
 const form=dialog.querySelector('form'),close=dialog.querySelector('header button'),name=form.elements.name,body=form.elements.body,send=form.querySelector('[type=submit]'),status=dialog.querySelector('#city-comment-status'),count=dialog.querySelector('#city-comment-count');
 let pending=false,attempt=null,opener=button;
 function open(event){opener=event?.currentTarget||button;window.CITY_MAIN?.clearMovement();if(document.pointerLockElement)document.exitPointerLock();if(!dialog.open)dialog.showModal();(body.value?body:name).focus();}
 button.onclick=open;close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{window.CITY_MAIN?.clearMovement();opener.focus();});
 body.addEventListener('input',()=>{count.textContent=body.value.length+' / 2000';});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  const payload={name:name.value.trim(),body:body.value.trim(),website:form.elements.website.value};
  if(payload.body.length<5){status.textContent='Please write at least five characters.';body.focus();return;}
  const key=JSON.stringify(payload);if(attempt?.key!==key)attempt={key,id:crypto.randomUUID()};
  pending=true;for(const field of[name,body,send])field.disabled=true;status.textContent='Sending…';
  try{
   const response=await fetch(origin+'/api/comments',{method:'POST',mode:'cors',credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json','X-City-Guestbook':'1'},body:JSON.stringify({...payload,id:attempt.id}),signal:AbortSignal.timeout(20000)});
   const result=await response.json();if(!response.ok)throw Error(result.error||'Could not send your comment.');
   if(result.saved!==true||result.receipt!==attempt.id)throw Error('Delivery could not be confirmed. Your text is still here; please try again.');
   status.textContent='Thank you. Your comment has been delivered to the city’s creator.';form.reset();count.textContent='0 / 2000';attempt=null;
  }catch(error){status.textContent=error.name==='TimeoutError'||error instanceof TypeError||error instanceof SyntaxError?'We could not confirm delivery. Your text is still here; try Send again.':error.message;}
  finally{pending=false;for(const field of[name,body,send])field.disabled=false;}
 });
 document.body.append(dialog);document.querySelector('.visit-actions')?.append(button);
 // Overview visitors can leave feedback without first starting a walking mode.
 const overviewButton=button.cloneNode(true);overviewButton.id='city-comment-overview';overviewButton.onclick=open;document.querySelector('.welcome-secondary')?.append(overviewButton);
 if(new URLSearchParams(location.search).get('feedback')==='open')button.click();
})();
