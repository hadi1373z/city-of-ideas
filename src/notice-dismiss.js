/* Close only in-world notices, never experiments, readers or saved content. */
(()=>{
 const ids=['babel-library-context','world-cylinder-context','pond-world-window-context','escher-depth-context','artist-quarter-context','house-foundations-context','origami-house-context','study-house-context','learning-lab-tracker','city-discoveries-tracker','escher-perspective','connected-journey','question-walk-tracker','house-investigation-context','proof-atelier-context','seminar-context'];
 const selector=ids.map(id=>'#'+id).join(','),buttons=new WeakMap();
 const label=()=>({en:'Dismiss notification',de:'Hinweis schließen',fa:'بستن اعلان'}[window.CITY_I18N?.lang]||'Dismiss notification');
 function enhance(panel){
  if(!panel.matches(selector))return;
  const host=panel.tagName==='DETAILS'?panel.querySelector(':scope > summary'):panel;if(!host)return;
  let close=buttons.get(panel);if(close&&host.contains(close))return;
  close=document.createElement('button');close.type='button';close.className='city-notice-close';close.textContent='×';close.setAttribute('aria-label',label());close.title=label();
  close.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();panel.classList.add('city-notice-dismissed');const arrow=document.querySelector('.touch-pad [data-move="forward"]');if(arrow?.getClientRects().length)arrow.focus({preventScroll:true});else document.getElementById('overview')?.focus({preventScroll:true});});
  panel.classList.add('city-notice-dismissible');host.prepend(close);buttons.set(panel,close);
 }
 document.querySelectorAll(selector).forEach(enhance);
 const observer=new MutationObserver(records=>{
  const changed=new Set();for(const record of records){
   if(record.type==='attributes'){if(record.oldValue===null&&record.target.hidden)record.target.classList.remove('city-notice-dismissed');changed.add(record.target);continue;}
   const owner=record.target.closest?.(selector);if(owner)changed.add(owner);
   for(const node of record.addedNodes){if(node.nodeType!==1)continue;if(node.matches(selector))changed.add(node);node.querySelectorAll(selector).forEach(panel=>changed.add(panel));}
  }changed.forEach(enhance);
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden'],attributeOldValue:true});
 addEventListener('city-language',()=>{for(const panel of document.querySelectorAll(selector)){const close=buttons.get(panel);if(close){close.setAttribute('aria-label',label());close.title=label();}}});
})();
