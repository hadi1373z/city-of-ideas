'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),guard=require('./source-guard.cjs');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validate(config){
 if(config.schemaVersion!==1||!Array.isArray(config.copies)||config.copies.length<4)throw Error('Keep the four original city copies.');
 const slugs=new Set(),names=new Set(),paths=new Set();for(const copy of config.copies){
  if(!/^city-of-[a-z]+(?:-[a-z]+)*$/.test(copy.slug)||slugs.has(copy.slug)||typeof copy.name!=='string'||!copy.name.trim()||names.has(copy.name)||!/^[a-f0-9]{40}$/.test(copy.baseline)||typeof copy.description!=='string')throw Error('Invalid or duplicate city copy.');
  if(copy.path&&!/^edition_[a-z]+(?:_[a-z]+)*$/.test(copy.path)||paths.has(copy.path||copy.slug)||copy.experience&&!['math','discovery','making'].includes(copy.experience))throw Error('Invalid edition path or experience.');
  slugs.add(copy.slug);names.add(copy.name);paths.add(copy.path||copy.slug);
 }return config.copies;
}
function prepareCopyExperience(profile){
 const arrival={math:'proof-atelier',discovery:'escher-house',making:'origami-house'}[profile];if(!arrival)return;
 const url=new URL(location.href);if(!url.searchParams.has('arrival')){url.searchParams.set('arrival',arrival);history.replaceState(history.state,'',url);}
}
function installCopyExperience(profile){
 const profiles={
  math:{label:'Math journey',question:'What makes an explanation a mathematical proof?',intro:'Make a prediction, try a construction, examine a counterexample and explain what your evidence establishes.',steps:[['Proof Atelier','Build matchings, find obstructions and construct a certificate. Six workshops offer twelve deeper problems.','proof'],['The counterexample walk','Test a conditional rule in the Library, Workshop and Dialogue House.','logic'],['Mathematical paper gallery','Explore original papers and compare the assumptions behind their results.','papers']]},
  discovery:{label:'Discovery trail',question:'What would make you change your first explanation?',intro:'Follow evidence through the city. The clues belong to real experiments; reaching a place does not count as solving it.',steps:[['Escher’s viewpoint','Move until separated stair fragments align, then investigate what changes when you step aside.','escher'],['The sixth guest','Follow the sketch, test a colouring and carry the discovery back to the park.','clues'],['Ramsey’s table','Explore six people and two colours. Can you avoid every single-colour triangle?','ramsey']]},
  making:{label:'Making studio',question:'What can a small set of rules help you create?',intro:'Make something, change one constraint and compare the results. Folding preserves the paper; a composed score can vary while its rules remain fixed.',steps:[['House of Origami','Explore folding constraints, test a crease pattern and follow the paper-boat activity.','origami'],['Makers’ courtyard','Move between the Library, Workshop and Dialogue House to read, construct and discuss.','makers'],['Cage’s listening house','Change the seed and constraints of a score; listening is optional.','cage']]}
 },p=profiles[profile];if(!p)return;
 const world=document.querySelector('#world');let installed=false,dialog,launch,overview;
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 function ready(){if(installed||world?.dataset.startupPhase!=='ready'||!window.CITY_MAIN)return;installed=true;observer.disconnect();const M=window.CITY_MAIN;
  dialog=el('dialog');dialog.id='city-edition-journey';dialog.setAttribute('aria-labelledby','city-edition-journey-title');const header=el('header'),title=el('h2',p.label),close=el('button','×');title.id='city-edition-journey-title';close.type='button';close.setAttribute('aria-label','Close journey');close.onclick=()=>dialog.close();header.append(title,close);dialog.append(header,el('h3',p.question),el('p',p.intro));
  function go(action){dialog.close();M.clearMovement();if(action==='proof')M.startExtra('proof-atelier');else if(action==='logic')M.startExtra('learning-lab');else if(action==='papers')M.startExtra('paper-gallery:foundations');else if(action==='escher')M.startExtra('artist:escher');else if(action==='clues')M.cityDiscoveries.open('route');else if(action==='ramsey')M.ramseyHouse.go();else if(action==='origami')M.startExtra('origami-house');else if(action==='makers')M.startExtra('makers');else if(action==='cage')M.startExtra('seminar:cage');}
  for(const[name,detail,action]of p.steps){const section=el('section'),button=el('button','Explore '+name);button.type='button';button.dataset.editionAction=action;button.onclick=()=>go(action);section.append(el('h3',name),el('p',detail),button);dialog.append(section);}dialog.append(el('p','Wander freely between activities. The existing experiments check your work; visiting a place does not award completion.'));dialog.addEventListener('close',()=>{M.clearMovement();launch.focus();});document.body.append(dialog);
  launch=el('button',p.label);launch.id='city-edition-journey-open';launch.className='glass';launch.type='button';launch.style.setProperty('display','block','important');launch.onclick=()=>{M.clearMovement();if(document.pointerLockElement)document.exitPointerLock();dialog.showModal();};document.querySelector('.visit-actions')?.append(launch);overview=launch.cloneNode(true);overview.id='city-edition-journey-overview';overview.onclick=launch.onclick;document.querySelector('.welcome-secondary')?.append(overview);
 }
 const observer=new MutationObserver(ready);if(world)observer.observe(world,{attributes:true,attributeFilter:['data-startup-phase']});ready();addEventListener('pagehide',()=>{observer.disconnect();dialog?.remove();launch?.remove();overview?.remove();},{once:true});
}
const experienceStyle='#city-edition-journey{box-sizing:border-box;width:min(650px,calc(100vw - 20px));max-height:90dvh;overflow:auto;padding:22px;background:#f8f6ed;color:#233c35;border:1px solid #879d8d;border-radius:10px;font:16px/1.5 system-ui,sans-serif}#city-edition-journey::backdrop{background:#10251dbb}#city-edition-journey header{display:flex;align-items:center;justify-content:space-between;gap:20px}#city-edition-journey h2{font:normal 1.6rem Georgia,serif;margin:0}#city-edition-journey h3{font:600 1.12rem system-ui,sans-serif}#city-edition-journey section{padding:12px 0;border-top:1px solid #c4cfc2}#city-edition-journey button{min-height:46px;padding:10px 16px;border-radius:6px;background:#235743;color:#fff;font:inherit}';
// This client changes the copy's identity only. It never wraps storage, changes
// account connections, moves the visitor or rewrites the original scene.
function installCopyIdentity(){
 const data=document.documentElement.dataset;if(!data.cityCopy)return;
 const name=data.cityCopyName,description=data.cityCopyDescription;
 function render(){
  document.title=name+' · City of Ideas';
  for(const[selector,text]of[['.identity strong',name],['.identity small',description],['#loading p',name]]){const node=document.querySelector(selector);if(node&&node.textContent!==text)node.textContent=text;}
  document.querySelector('#world')?.setAttribute('aria-label','Three-dimensional '+name);
  const identity=document.querySelector('.identity');if(identity){identity.href=location.href.split('#')[0]+'#';identity.setAttribute('aria-label','Return to '+name+' overview');}
 }
 render();addEventListener('city-language',render);
 const identity=document.querySelector('.identity'),observer=new MutationObserver(render);if(identity)observer.observe(identity,{childList:true,characterData:true,subtree:true});
 addEventListener('pagehide',()=>{observer.disconnect();removeEventListener('city-language',render);},{once:true});
}
function page(html,copy){
 if(!/<html\s/.test(html)||!html.includes('</head>')||!html.includes('</body>')||/<base\b/i.test(html))throw Error('Unsupported baseline entry page.');
 const attrs=' data-city-copy="'+escape(copy.slug)+'" data-city-copy-name="'+escape(copy.name)+'" data-city-copy-description="'+escape(copy.description)+'"';
 const prepare=copy.experience?'<script>('+prepareCopyExperience.toString().replace(/\r\n/g,'\n')+')('+JSON.stringify(copy.experience)+');</script>\n':'',experience=copy.experience?'<style>'+experienceStyle+'</style><script>('+installCopyExperience.toString().replace(/\r\n/g,'\n')+')('+JSON.stringify(copy.experience)+');</script>\n':'';
 return html.replace('<html ','<html'+attrs+' ').replace('</head>','<base href="../_city-baselines/'+copy.baseline+'/">\n</head>')
  // The base must precede every URL-bearing element, not merely finish the head.
  .replace(/(<head>)([\s\S]*?)(<base[^>]+>)/,(_,head,rest,base)=>head+'\n'+base+'\n'+prepare+rest)
  .replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(copy.name)+' · City of Ideas</title>')
  .replace('</body>','<script>('+installCopyIdentity.toString().replace(/\r\n/g,'\n')+')();</script>\n'+experience+'</body>');
}
function catalog(copies){return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>City editions · City of Ideas</title><style>body{margin:0;background:#152621;color:#f5efdd;font:17px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(22px,5vw,64px)}h1,h2{font-family:Georgia,serif;font-weight:400}h1{font-size:clamp(2rem,5vw,3.4rem);margin:0}p{max-width:65ch}.cities{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px;margin:36px 0}article{padding:24px;background:#203b32;border:1px solid #607b69;border-radius:12px}article h2{margin:0 0 12px;font-size:1.7rem}a{color:#f4d477}article a{display:inline-block;padding:10px 18px;min-height:24px;background:#f4d477;color:#172c24;text-decoration:none;border-radius:5px}a:focus-visible{outline:3px solid #fff;outline-offset:4px}small{color:#d0dacb}</style><main><h1>Choose a city to explore</h1><p>A rebuilt City of Mathematics, two focused journeys and four preserved starting copies.</p><div class="cities">'+copies.map(c=>'<article><h2>'+escape(c.name)+'</h2><p>'+escape(c.description)+'</p><p><a href="../'+(c.path||c.slug)+'/">Enter '+escape(c.name)+'</a></p><small>'+(c.experience==='math'?'New mathematical city':c.experience?'Focused playable journey':'Preserved starting copy')+'</small></article>').join('')+'</div><p><a href="../">Return to the original City of Ideas</a></p></main></html>\n';}
function publishCopies({root,dest,extract}){
 const file=path.join(root,'city-copies.json');if(!fs.existsSync(file))return [];
 const copies=validate(JSON.parse(fs.readFileSync(file,'utf8'))),baselines=new Set(copies.map(c=>c.baseline));
 for(const sha of baselines){
  const target=path.join(dest,'_city-baselines',sha);fs.mkdirSync(target,{recursive:true});
  if(extract)extract(sha,target);else{
   const archive=path.join(dest,'.city-copy-baseline.tar');
   try{execFileSync('git',['archive','--format=tar','--output',archive,sha+':src'],{cwd:root,stdio:'pipe',windowsHide:true});execFileSync('tar',['-xf',archive,'-C',target],{cwd:root,stdio:'pipe',windowsHide:true});}finally{if(fs.existsSync(archive))fs.unlinkSync(archive);}
  }
  const files=guard.files(target);guard.checkFiles(target,files);const entries=guard.inventory(target,files),contentHash=guard.contentHash(entries);
  fs.writeFileSync(path.join(target,'version.json'),JSON.stringify({project:'City of Ideas',schemaVersion:1,commit:sha,contentHash,files:entries.length,bytes:entries.reduce((n,e)=>n+e.bytes,0)},null,2)+'\n');
  fs.writeFileSync(path.join(target,'asset-manifest.json'),JSON.stringify({contentHash,files:entries},null,2)+'\n');
 }
 for(const copy of copies){const html=fs.readFileSync(path.join(dest,'_city-baselines',copy.baseline,'index.html'),'utf8');for(const entry of new Set([copy.path||copy.slug,copy.slug])){const target=path.join(dest,entry);fs.mkdirSync(target,{recursive:true});if(copy.experience==='math')require('./math-edition.cjs').publishMathEdition({root,target,baseline:copy.baseline});else fs.writeFileSync(path.join(target,'index.html'),page(html,copy));fs.writeFileSync(path.join(target,'copy.json'),JSON.stringify({...copy,kind:copy.experience==='math'?'mathematical-campus':copy.experience?'focused-experience-edition':'named-city-copy',scene:copy.experience==='math'?'New six-house mathematical campus with connected gardens and the preserved full Proof Atelier.':copy.experience?'Existing city with a focused, optional activity journey.':'Preserved starting city; concept redesign pending.'},null,2)+'\n');}}
 for(const name of ['city-copies','editions']){const compare=path.join(dest,name);fs.mkdirSync(compare,{recursive:true});fs.writeFileSync(path.join(compare,'index.html'),catalog(copies));}
 return copies;
}
module.exports={validate,page,catalog,installCopyIdentity,prepareCopyExperience,installCopyExperience,publishCopies};
