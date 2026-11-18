// Public submissions live in a dedicated service; private House data is unrelated.
(()=>{
 const origin='https://city-of-ideas-guestbook.nutmeg-ibex-4408.chatgpt.site';
 const button=document.createElement('button');button.id='city-comment-open';button.className='glass';button.type='button';button.textContent='Leave a comment';
 const dialog=document.createElement('dialog');dialog.id='city-guestbook';dialog.setAttribute('aria-labelledby','city-guestbook-title');
 dialog.innerHTML='<header><h2 id="city-guestbook-title">City guestbook</h2><button type="button" aria-label="Close guestbook">×</button></header><iframe title="Send a comment to the city’s creator" referrerpolicy="no-referrer"></iframe><footer><a target="_blank" rel="noopener noreferrer">Open guestbook in a new tab</a></footer>';
 const frame=dialog.querySelector('iframe'),close=dialog.querySelector('button'),link=dialog.querySelector('a');link.href=origin+'/';
 button.onclick=()=>{window.CITY_MAIN?.clearMovement();if(document.pointerLockElement)document.exitPointerLock();if(!frame.src)frame.src=origin+'/';dialog.showModal();};
 close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{window.CITY_MAIN?.clearMovement();button.focus();});
 document.body.append(dialog);document.querySelector('.visit-actions')?.append(button);
 // Overview visitors can leave feedback without first starting a walking mode.
 const overviewButton=button.cloneNode(true);overviewButton.id='city-comment-overview';overviewButton.onclick=button.onclick;document.querySelector('.welcome-secondary')?.append(overviewButton);
 if(new URLSearchParams(location.search).get('feedback')==='open')button.click();
})();
