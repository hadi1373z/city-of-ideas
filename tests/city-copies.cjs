'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const {validate,page,installCopyIdentity,publishCopies}=require('../tools/city-copies.cjs');
const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(path.join(root,'city-copies.json'),'utf8')),copies=validate(config),sha=copies[0].baseline;
assert.equal(new Set(copies.map(c=>c.name)).size,7);assert.equal(new Set(copies.map(c=>c.slug)).size,7);
assert.throws(()=>validate({...config,copies:[copies[0],copies[0],copies[2],copies[3]]}),/duplicate/);
assert.throws(()=>validate({...config,copies:copies.map((c,i)=>i?c:{...c,baseline:'main'})}),/Invalid/,'A branch is not a frozen copy');
const html='<!doctype html><html lang="en"><head><title>Original</title><meta charset="utf-8"><link href="style.css"><script src="gallery.js"></script></head><body><main id="world"></main></body></html>';
for(const c of copies){const text=page(html,c),base=text.match(/<base href="([^"]+)"/)[1],url=new URL('https://hadi1373z.github.io/city-of-ideas/'+c.slug+'/');assert(text.indexOf('<base')<text.indexOf('<link'),'Base must be parsed before relative assets');assert.equal(new URL('gallery.js',new URL(base,url)).pathname,'/city-of-ideas/_city-baselines/'+sha+'/gallery.js');assert(text.includes('<title>'+c.name+' · City of Ideas</title>'));assert(text.includes('data-city-copy="'+c.slug+'"'));assert(text.includes('<script src="gallery.js"></script>'),'Real game still loads');}
assert.throws(()=>page(html.replace('<head>','<head><base href="/">'),copies[0]),/Unsupported/);
// The package fixture has a genuinely separate baseline and live scene.
const fixture=fs.mkdtempSync(path.join(root,'city-copy-fixture-'));try{
 const dest=path.join(fixture,'_site');fs.mkdirSync(dest);fs.writeFileSync(path.join(fixture,'city-copies.json'),JSON.stringify(config));fs.writeFileSync(path.join(dest,'index.html'),'MAIN UNCHANGED');
 let extracted=0;publishCopies({root:fixture,dest,extract(id,target){assert.equal(id,sha);extracted++;fs.writeFileSync(path.join(target,'index.html'),html);fs.writeFileSync(path.join(target,'gallery.js'),'/* original scene */');}});
 assert.equal(extracted,1,'Four copies share one immutable baseline, not four huge asset trees');assert.equal(fs.readFileSync(path.join(dest,'index.html'),'utf8'),'MAIN UNCHANGED');
 for(const c of copies)for(const route of [c.path,c.slug]){assert(fs.readFileSync(path.join(dest,route,'index.html'),'utf8').includes(c.name));assert.equal(JSON.parse(fs.readFileSync(path.join(dest,route,'copy.json'))).baseline,sha);}
 const catalog=fs.readFileSync(path.join(dest,'city-copies/index.html'),'utf8');for(const c of copies)assert(catalog.includes('../'+(c.path||c.slug)+'/'));
 assert(fs.existsSync(path.join(dest,'editions/index.html')));const baseline=JSON.parse(fs.readFileSync(path.join(dest,'_city-baselines',sha,'version.json')));assert.equal(baseline.commit,sha);assert.equal(baseline.files,2);
}finally{if(path.dirname(fixture)!==root||!path.basename(fixture).startsWith('city-copy-fixture-'))throw Error('Invalid cleanup target');fs.rmSync(fixture,{recursive:true,force:true});}
// Identity survives the original language renderer; no storage or scene calls.
for(const c of copies){const nodes=Object.fromEntries(['.identity strong','.identity small','#loading p','#world','.identity'].map(s=>[s,{textContent:'Original',setAttribute(k,v){this[k]=v;}}]));const events={},document={title:'Original',documentElement:{dataset:{cityCopy:c.slug,cityCopyName:c.name,cityCopyDescription:c.description}},querySelector:s=>nodes[s]};let observer;
 const sandbox={document,location:{href:'https://hadi1373z.github.io/city-of-ideas/'+c.slug+'/?arrival=escher-house#x'},addEventListener(k,fn){events[k]=fn;},removeEventListener(k){delete events[k];},MutationObserver:class{constructor(fn){this.callback=fn;observer=this;}observe(){}disconnect(){this.disconnected=true;}}};vm.runInNewContext('('+installCopyIdentity.toString()+')()',sandbox);
 assert.equal(document.title,c.name+' · City of Ideas');assert.equal(nodes['.identity strong'].textContent,c.name);assert(nodes['.identity'].href.includes(c.slug+'/?arrival=escher-house#'));
 nodes['.identity strong'].textContent='شهر ایده‌ها';events['city-language']();assert.equal(nodes['.identity strong'].textContent,c.name);events.pagehide();assert(observer.disconnected);
}
console.log('PASS four named playable copies: immutable source pin, complete relative asset paths, unchanged main city, single baseline packaging, per-copy metadata, language-stable identity and cleanup.');
