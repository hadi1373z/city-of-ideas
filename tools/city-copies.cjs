'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),guard=require('./source-guard.cjs');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validate(config){
 if(config.schemaVersion!==1||!Array.isArray(config.copies)||config.copies.length!==4)throw Error('Exactly four named city copies are required.');
 const slugs=new Set(),names=new Set();for(const copy of config.copies){
  if(!/^city-of-[a-z]+(?:-[a-z]+)*$/.test(copy.slug)||slugs.has(copy.slug)||typeof copy.name!=='string'||!copy.name.trim()||names.has(copy.name)||!/^[a-f0-9]{40}$/.test(copy.baseline)||typeof copy.description!=='string')throw Error('Invalid or duplicate city copy.');
  slugs.add(copy.slug);names.add(copy.name);
 }return config.copies;
}
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
 return html.replace('<html ','<html'+attrs+' ').replace('</head>','<base href="../_city-baselines/'+copy.baseline+'/">\n</head>')
  // The base must precede every URL-bearing element, not merely finish the head.
  .replace(/(<head>)([\s\S]*?)(<base[^>]+>)/,(_,head,rest,base)=>head+'\n'+base+rest)
  .replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(copy.name)+' · City of Ideas</title>')
  .replace('</body>','<script>('+installCopyIdentity.toString().replace(/\r\n/g,'\n')+')();</script>\n</body>');
}
function catalog(copies){return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Four cities · City of Ideas</title><style>body{margin:0;background:#152621;color:#f5efdd;font:17px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(22px,5vw,64px)}h1,h2{font-family:Georgia,serif;font-weight:400}h1{font-size:clamp(2rem,5vw,3.4rem);margin:0}p{max-width:65ch}.cities{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px;margin:36px 0}article{padding:24px;background:#203b32;border:1px solid #607b69;border-radius:12px}article h2{margin:0 0 12px;font-size:1.7rem}a{color:#f4d477}article a{display:inline-block;padding:10px 18px;min-height:24px;background:#f4d477;color:#172c24;text-decoration:none;border-radius:5px}a:focus-visible{outline:3px solid #fff;outline-offset:4px}small{color:#d0dacb}</style><main><h1>Four cities to explore</h1><p>Four separately named, playable copies of City of Ideas. Each begins with the same preserved city; their proposed concept redesigns can be developed separately.</p><div class="cities">'+copies.map(c=>'<article><h2>'+escape(c.name)+'</h2><p>'+escape(c.description)+'</p><p><a href="../'+c.slug+'/">Enter '+escape(c.name)+'</a></p><small>Starting version '+c.baseline.slice(0,7)+'</small></article>').join('')+'</div><p><a href="../">Return to the original City of Ideas</a></p></main></html>\n';}
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
 for(const copy of copies){const target=path.join(dest,copy.slug);fs.mkdirSync(target,{recursive:true});const html=fs.readFileSync(path.join(dest,'_city-baselines',copy.baseline,'index.html'),'utf8');fs.writeFileSync(path.join(target,'index.html'),page(html,copy));fs.writeFileSync(path.join(target,'copy.json'),JSON.stringify({...copy,kind:'named-city-copy',scene:'Preserved starting city; concept redesign pending.'},null,2)+'\n');}
 const compare=path.join(dest,'city-copies');fs.mkdirSync(compare,{recursive:true});fs.writeFileSync(path.join(compare,'index.html'),catalog(copies));
 return copies;
}
module.exports={validate,page,catalog,installCopyIdentity,publishCopies};
