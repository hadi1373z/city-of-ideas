'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {prepareCopyExperience,installCopyExperience,page}=require('../tools/city-copies.cjs');
for(const [profile,arrival]of Object.entries({math:'proof-atelier',discovery:'escher-house',making:'origami-house'})){
 for(const explicit of[false,true]){let written;const sandbox={URL,location:{href:'https://hadi1373z.github.io/city-of-ideas/edition_test/'+(explicit?'?arrival=observatory&x=1#view':'?x=1#view')},history:{state:{keep:true},replaceState(state,title,url){assert(state.keep);written=url;}}};vm.runInNewContext('('+prepareCopyExperience.toString()+')('+JSON.stringify(profile)+')',sandbox);if(explicit)assert.equal(written,undefined,'Explicit arrivals remain unchanged');else{assert.equal(written.searchParams.get('arrival'),arrival);assert.equal(written.searchParams.get('x'),'1');assert.equal(written.hash,'#view');}}
}
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.events={};this.style={setProperty(){}};this.open=false;}
 append(...nodes){this.children.push(...nodes);}setAttribute(k,v){this[k]=v;}addEventListener(k,fn){this.events[k]=fn;}cloneNode(){return new Node(this.tag);}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){this.focused=true;}remove(){this.removed=true;}
}
for(const profile of['math','discovery','making']){
 const world=new Node('main');world.dataset.startupPhase='gallery';const body=new Node('body'),toolbar=new Node('div'),welcome=new Node('div'),events={},calls=[];let observer;
 const document={body,createElement:tag=>new Node(tag),querySelector:s=>({'#world':world,'.visit-actions':toolbar,'.welcome-secondary':welcome}[s])};
 const M={clearMovement(){calls.push('clear');},startExtra(id){calls.push(id);},cityDiscoveries:{open(id){calls.push('clues:'+id);}},ramseyHouse:{go(){calls.push('ramsey');}}};
 const sandbox={document,window:{CITY_MAIN:M},addEventListener(k,fn){events[k]=fn;},MutationObserver:class{constructor(fn){this.fn=fn;observer=this;}observe(){}disconnect(){this.disconnected=true;}}};vm.runInNewContext('('+installCopyExperience.toString()+')('+JSON.stringify(profile)+')',sandbox);
 assert.equal(toolbar.children.length,0,'Do not add controls before the city is ready');world.dataset.startupPhase='ready';observer.fn();assert.equal(toolbar.children.length,1);assert.equal(welcome.children.length,1);assert.equal(body.children.length,1);assert(observer.disconnected);assert.deepEqual(calls,[],'Starting the edition does not write progress or begin a challenge');
 const launch=toolbar.children[0],dialog=body.children[0];launch.onclick();assert(dialog.open);const sections=dialog.children.filter(n=>n.tag==='section');assert.equal(sections.length,3);const actions=sections.map(n=>n.children.at(-1));
 const expected={math:['proof-atelier','learning-lab','paper-gallery:foundations'],discovery:['artist:escher','clues:route','ramsey'],making:['origami-house','makers','seminar:cage']}[profile];
 actions.forEach((button,i)=>{button.onclick();assert.equal(calls.at(-1),expected[i]);assert(!dialog.open);});events.pagehide();assert(dialog.removed);assert(launch.removed);assert(welcome.children[0].removed);
}
const config=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../city-copies.json'),'utf8'));
assert.equal(config.copies.filter(c=>c.experience).length,3);
const original=fs.readFileSync(require('node:path').join(__dirname,'../src/index.html'),'utf8');assert(!original.includes('city-edition-journey'),'Original city never loads edition-only activities');for(const c of config.copies){const generated=page(original,c);assert.equal(generated.includes('city-edition-journey'),!!c.experience);}
console.log('PASS focused editions: mathematics, discovery and making; exact original activity hooks, distinct arrivals, preserved deep links, optional UI, no automatic progress writes and no original-city installation.');
