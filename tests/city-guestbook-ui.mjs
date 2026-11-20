import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
class Node{
 constructor(){this.value='';this.disabled=false;this.events={};this.children=[];this.open=false;this.textContent='';}
 setAttribute(){}append(n){this.children.push(n);}addEventListener(k,fn){this.events[k]=fn;}focus(){document.activeElement=this;}cloneNode(){return new Node();}click(){this.onclick?.({currentTarget:this});}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}
}
const fields={name:new Node(),body:new Node(),website:new Node()},send=new Node(),close=new Node(),status=new Node(),count=new Node(),form=new Node();form.elements=fields;form.reportValidity=()=>true;form.querySelector=()=>send;form.reset=()=>{for(const field of Object.values(fields))field.value='';};
const toolbar=new Node(),overview=new Node(),root=new Node();root.querySelector=s=>({'form':form,'header button':close,'#city-comment-status':status,'#city-comment-count':count}[s]);
const document={body:new Node(),activeElement:null,pointerLockElement:null,createElement:tag=>tag==='dialog'?root:new Node(),querySelector:s=>({'.visit-actions':toolbar,'.welcome-secondary':overview}[s])};
let clears=0,requests=[],reply=()=>{throw new TypeError('offline');};const context={document,window:{CITY_MAIN:{clearMovement(){clears++;}}},location:{search:''},URLSearchParams,crypto,AbortSignal,TypeError,SyntaxError,fetch:async(url,options)=>{requests.push({url,options,payload:JSON.parse(options.body)});return reply(requests.at(-1).payload);}};
vm.runInNewContext(readFileSync(new URL('../src/city-guestbook.js',import.meta.url),'utf8'),context);assert(!/<iframe|<a[ >]/.test(root.innerHTML),'No embedded hosted page or external link');
const open=toolbar.children[0];open.click();assert(root.open);fields.body.value='A useful city visit.';fields.name.value='Test';fields.body.events.input();assert.equal(count.textContent,'20 / 2000');close.onclick();assert.equal(fields.body.value,'A useful city visit.');assert.equal(document.activeElement,open);overview.children[0].click();assert(root.open);
const submit=()=>form.events.submit({preventDefault(){}});await submit();assert.match(status.textContent,/could not confirm/i);assert.equal(fields.body.value,'A useful city visit.');const first=requests[0].payload.id;assert.equal(requests[0].options.credentials,'omit');assert.equal(requests[0].options.redirect,'error');assert(requests[0].url.endsWith('/api/comments'));
reply=payload=>({ok:true,json:async()=>({saved:true,receipt:payload.id})});await submit();assert.equal(requests[1].payload.id,first,'Retry uses the same durable receipt');assert.equal(fields.body.value,'');assert.match(status.textContent,/delivered/);assert(!send.disabled);
fields.body.value='A second comment.';reply=()=>({ok:true,json:async()=>({saved:false})});await submit();assert.equal(fields.body.value,'A second comment.','Unconfirmed success cannot erase text');assert.notEqual(requests[2].payload.id,first);
const old=requests[2].payload.id;fields.body.value='A changed second comment.';reply=payload=>({ok:true,json:async()=>({saved:true,receipt:payload.id})});await submit();assert.notEqual(requests[3].payload.id,old,'Editing after failure uses a fresh receipt');assert(clears>=3);
console.log('PASS native city feedback: no external page/links, private direct POST, close/reopen drafts, idempotent retries, edited submissions, honest delivery and focus.');
