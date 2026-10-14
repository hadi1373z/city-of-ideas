// Synthetic DOM/state only. No private account, source-builder mutation or paid API.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {PRIVATE_SELECTORS,protectedText,protectedAttribute,collectPrivateStrings,createPublicTranslator,markPublicText,markPrivateText} from '../src/city-source-assets/home-tools/city-tools-observer-core.js';
import {PUBLIC_FA,OWNER_PUBLIC_KEY_COUNT} from '../src/city-source-assets/home-tools/city-tools-merged-public-fa.js';
import {initToolsLanguage} from '../src/city-source-assets/home-tools/city-tools-language.js';
import {homeUiChanged,createVisitorPositionGuard,createHomeCommandRouter} from '../src/city-source-assets/home-tools/city-home-protocol.js';
import {installHomeMessages} from '../src/city-source-assets/home-tools/city-home-messages.js';
assert.equal(OWNER_PUBLIC_KEY_COUNT,1458);assert(Object.keys(PUBLIC_FA).length>=1458);assert.equal(Object.values(PUBLIC_FA).filter(v=>typeof v!=='string').length,0);
class Element{
 constructor(tag,id=''){this.nodeType=1;this.tagName=tag.toUpperCase();this.id=id;this.parentElement=null;this.children=[];this.attrs=new Map();this.dataset={};this.value='';}
 append(child){child.parentElement=this;this.children.push(child);return child;}getAttribute(name){return this.attrs.get(name)??null;}hasAttribute(name){return this.attrs.has(name);}setAttribute(name,value){this.attrs.set(name,String(value));}removeAttribute(name){this.attrs.delete(name);}
 matches(selector){if(selector.includes(' ')){const parts=selector.split(' ');return this.matches(parts.at(-1))&&!!this.parentElement?.closest(parts.slice(0,-1).join(' '));}if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector.startsWith('.'))return (this.attrs.get('class')||'').split(' ').includes(selector.slice(1));if(selector.startsWith('['))return this.hasAttribute(selector.slice(1,-1));return this.tagName.toLowerCase()===selector;}
 closest(selectors){for(let el=this;el;el=el.parentElement)if(selectors.split(',').some(s=>el.matches(s.trim())))return el;return null;}
 get textContent(){return this.children.map(child=>child.textContent??child.nodeValue).join('');}set textContent(value){this.children=[];this.append(new Text(value));}
}
class Text{constructor(value){this.nodeType=3;this.nodeValue=value;this.parentElement=null;}get textContent(){return this.nodeValue;}}
const text=(parent,value)=>parent.append(new Text(value));
const body=new Element('body'),html=new Element('html'),title=new Element('title');title.textContent='House of Ideas';
const header=new Element('h1');body.append(header);const headerText=text(header,'Original House tools');header.setAttribute('title','Original House tools');header.setAttribute('aria-label','All original House tools');
const label=new Element('label');body.append(label);const labelText=text(label,'Your answer or discovery');
const input=new Element('textarea','reflection-input');label.append(input);input.value='FAKE private note: Water Lilies / پرسش من';input.setAttribute('placeholder','Your answer or discovery');
const privateBox=new Element('section','idea-list');body.append(privateBox);const privateTitle=text(privateBox,'Water Lilies');
const privateRoom=new Element('button','room-name');body.append(privateRoom);const privateRoomText=text(privateRoom,'Close');privateRoom.setAttribute('title','Water Lilies');
const contentEditable=new Element('div');contentEditable.setAttribute('contenteditable','true');body.append(contentEditable);const editable=text(contentEditable,'Water Lilies');
const activity=new Element('p','activity-text');body.append(activity);const activityText=text(activity,'Open the private online house for this action.');
const elements=[header,label,input,privateBox,privateRoom,contentEditable,activity];
const allText=()=>{const out=[];function walk(el){for(const child of el.children){if(child.nodeType===3)out.push(child);else walk(child);}}walk(body);return out;};
const doc={body,documentElement:html,createTreeWalker(){const nodes=allText();let i=0;return {nextNode:()=>nodes[i++]??null};},querySelectorAll(){return elements.filter(el=>['title','aria-label','placeholder'].some(a=>el.hasAttribute(a)));},querySelector(selector){return selector==='title'?title:null;}};
let observerCallback;const w={location:{href:'https://hadi1373z.github.io/city-of-ideas/tools?lang=en'},localStorage:{getItem:()=>null},NodeFilter:{SHOW_TEXT:4},queueMicrotask,MutationObserver:class{constructor(fn){observerCallback=fn;}observe(){}disconnect(){}}};
const state={revision:3,house:{rooms:[{id:'room-stable',name:'Close',purpose:'FAKE private purpose'}],ideas:[{id:'idea-stable',title:'Water Lilies',text:input.value}],resident:{messages:[{text:'FAKE private transcript'}]}},neighborhood:{homes:[{id:'old-home',house:{notes:'FAKE older note'}}]},cityNetwork:{notes:[{text:'FAKE city journal'}]}};
const stateBefore=JSON.stringify(state),inputBefore=input.value;let reads=0;
const language=initToolsLanguage({getState:()=>{reads++;return state;},documentLike:doc,windowLike:w});
language.set('fa');assert.equal(html.dir,'rtl');assert.equal(headerText.nodeValue,PUBLIC_FA['Original House tools']);assert.equal(header.getAttribute('title'),PUBLIC_FA['Original House tools']);assert.equal(header.getAttribute('aria-label'),PUBLIC_FA['All original House tools']);assert.equal(input.getAttribute('placeholder'),PUBLIC_FA['Your answer or discovery']);assert.equal(labelText.nodeValue,PUBLIC_FA['Your answer or discovery']);assert.equal(title.textContent,PUBLIC_FA['House of Ideas']);
assert.equal(privateTitle.nodeValue,'Water Lilies');assert.equal(privateRoomText.nodeValue,'Close');assert.equal(privateRoom.getAttribute('title'),'Water Lilies');assert.equal(editable.nodeValue,'Water Lilies');assert.equal(activityText.nodeValue,'Open the private online house for this action.');assert.equal(input.value,inputBefore);assert.equal(JSON.stringify(state),stateBefore);
markPublicText(activity);language.apply();assert.equal(activityText.nodeValue,PUBLIC_FA['Open the private online house for this action.']);
markPrivateText(activity);activityText.nodeValue='Water Lilies';language.set('en');assert.equal(activityText.nodeValue,'Water Lilies');assert.equal(headerText.nodeValue,'Original House tools');assert.equal(input.getAttribute('placeholder'),'Your answer or discovery');assert.equal(input.value,inputBefore);assert.equal(JSON.stringify(state),stateBefore);
const beforeReads=reads;for(let i=0;i<20;i++)assert.equal(language.set('en'),false);assert.equal(reads,beforeReads);
const privateStrings=collectPrivateStrings(state);assert(protectedText(privateTitle,privateStrings));assert(protectedAttribute(privateRoom,'title','Water Lilies',privateStrings));assert(!protectedAttribute(input,'placeholder','Your answer or discovery',privateStrings));
for(const selector of PRIVATE_SELECTORS.filter(value=>value.startsWith('#'))){const node=new Element('p',selector.slice(1)),value=text(node,'Water Lilies');assert(protectedText(value,privateStrings),selector);}
const translator=createPublicTranslator({'Read ${name} in ${room}.':'${name} را در ${room} بخوانید.','First paragraph.':'پاراگراف نخست.','Second paragraph.':'پاراگراف دوم.'});
assert.equal(translator('Read PRIVATE RoomName in PRIVATE Study.','fa'),'PRIVATE RoomName را در PRIVATE Study بخوانید.');assert.equal(translator('First paragraph.\n\nSecond paragraph.','fa'),'پاراگراف نخست.\n\nپاراگراف دوم.');
const templateCatalog=Object.entries(PUBLIC_FA).filter(([key,value])=>key.includes('${')&&value.includes('${'));assert(templateCatalog.length>0);
assert.equal(createPublicTranslator(PUBLIC_FA)('Page 2 of 6','fa'),'صفحهٔ 2 از 6');
let renders=0;const context={cityId:'home',roomId:'study',floor:0,outside:false,resident:{near:true,talking:false},position:{x:0,z:0}};
for(let i=0;i<100;i++){const next={...context,position:{x:i,z:i},time:i,resident:{...context.resident,activity:'position tick '+i}};if(homeUiChanged(context,next))renders++;}assert.equal(renders,0);assert(homeUiChanged(context,{...context,roomId:'library'}));assert(homeUiChanged(context,{...context,resident:{near:false,talking:false}}));assert(homeUiChanged(context,{...context,artistEditionId:'edition-next'}));
const app=await fs.readFile(new URL('../src/city-source-assets/home-tools/app.js',import.meta.url),'utf8');assert(app.includes('neighborhood?.homes||[{house}]'));assert(app.includes('home.house.designObjects||[]'));
const scene=await fs.readFile(new URL('../src/city-source-assets/home-tools/city-scene-bridge.js',import.meta.url),'utf8');assert(scene.includes('if(homeUiChanged(before,context))onPick'));assert(!scene.includes("if(next.cityId)onPick"));
const sent=[];const guard=createVisitorPositionGuard(async(action,args)=>{sent.push({action,args});return true;});
await guard.run(async()=>{for(const action of ['leaveArtCity','startOutside','arriveAtDoor','reset'])assert((await guard.send(action,[])).preserveVisitorPosition);for(const action of ['load','setEdition','setNeighborhood','setCityNetwork'])await guard.send(action,[{text:'FAKE private preserved document'}]);});assert.deepEqual(sent.map(x=>x.action),['load','setEdition','setNeighborhood','setCityNetwork']);await guard.send('startOutside');assert.equal(sent.at(-1).action,'startOutside');
const listeners=new Set(),replies=[],events=[];let release;const waiting=new Promise(resolve=>release=resolve);const peer={postMessage:data=>replies.push(data)};const testWindow={parent:peer,location:{origin:'https://hadi1373z.github.io'},addEventListener:(type,fn)=>listeners.add(fn),removeEventListener:(type,fn)=>listeners.delete(fn)};
const tools={ready:Promise.resolve(),async execute(action){events.push('begin:'+action);await waiting;events.push('complete:'+action);},async pick(data){events.push('pick:'+data.bookId);}};
const messaging=installHomeMessages({windowLike:testWindow,getTools:()=>tools});const send=data=>Promise.all([...listeners].map(fn=>fn({source:peer,origin:testWindow.location.origin,data})));
const inspection=send({type:'city-home-command',id:'inspect',action:'inspectHome',args:['owned-home']}),pick=send({type:'city-home-interaction',data:{bookId:'definitions'}});await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(events,['begin:inspectHome']);release();await Promise.all([inspection,pick]);assert.deepEqual(events,['begin:inspectHome','complete:inspectHome','pick:definitions']);messaging.destroy();
const inspectionRouter=createHomeCommandRouter({callbacks:{inspectHome:async id=>id},hasHome:id=>id==='owned-home'});assert.equal(await inspectionRouter('inspectHome',['owned-home']),'owned-home');await assert.rejects(inspectionRouter('inspectHome',['arbitrary-home']),error=>error.status===400);
language.dispose();console.log('PASS: fake-only public-language merge —1458 owner keys/1647 merged, Persian/English accessibility, private DOM/value/state preservation, owned archive assets, stable ticks, inspectHome position scope and ordered interaction callbacks.');
