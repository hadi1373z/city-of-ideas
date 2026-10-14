// Fake parent/backend tests. No live account, inference, backend or browser data is used.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {createSceneProtocol,createHomeCommandRouter,HomeSceneError} from '../src/city-source-assets/home-tools/city-home-protocol.js';
import {installHomeMessages} from '../src/city-source-assets/home-tools/city-home-messages.js';
import {cloudHouseFetch,readHouseResponse} from '../src/city-source-assets/home-tools/city-house-cloud-transport.js';
const origin='https://hadi1373z.github.io';
function fixtureWindow(){const listeners=new Set(),messages=[],peer={postMessage(data,target,transfer){messages.push({data,target,transfer});}};const w={parent:peer,location:{origin},crypto,setTimeout,clearTimeout,addEventListener(type,fn){if(type==='message')listeners.add(fn);},removeEventListener(type,fn){listeners.delete(fn);}};return {w,messages,peer,async send(data,{source=peer,from=origin}={}){await Promise.all([...listeners].map(fn=>fn({source,origin:from,data})));}};}
const f=fixtureWindow(),states=[],errors=[];
const protocol=createSceneProtocol({windowLike:f.w,onState:x=>states.push(x),onError:x=>errors.push(x),timeoutMs:40});
const privateText='FAKE authored note: پرسش من / English';
await f.send({type:'city-home-state',state:{roomId:'study',cityId:'home',x:1,y:1.65,z:2,residentState:{near:false},roomInventory:{study:[{label:privateText}]},supportedSceneMethods:['load','travelToCity','select']}});
assert.equal(states[0].position.x,1);assert.equal(states[0].resident.near,false);assert.equal(states[0].roomInventory.study[0].label,privateText);
await f.send({type:'CITY_HOME_CONTEXT',context:{roomId:'library'}});assert.equal(states.at(-1).roomId,'library');
const navigation=protocol.request('travelToCity',['artists']);assert.equal(f.messages.at(-1).data.type,'city-home-tool');assert.equal(f.messages.at(-1).data.action,'travelToCity');assert(!f.messages.some(x=>x.data.type==='CITY_HOME_SCENE'));
const navId=f.messages.at(-1).data.id;
await f.send({type:'city-home-scene-result',id:navId,action:'travelToCity',ok:true,value:true},{source:{}});assert.equal(f.messages.length,1);
await f.send({type:'city-home-scene-result',id:navId,action:'travelToCity',ok:true,value:true});assert.equal(await navigation,true);
const failed=protocol.request('select',['study']);await f.send({type:'city-home-scene-result',id:f.messages.at(-1).data.id,action:'select',ok:false,status:409,error:'FAKE safe-target conflict'});await assert.rejects(failed,error=>error.status===409);
await assert.rejects(protocol.request('enterMathCity'),error=>error.status===501);
await assert.rejects(protocol.request('load',[{note:privateText}]),/did not confirm/);assert.equal(f.messages.at(-1).data.args[0].note,privateText);protocol.destroy();

const called=[],callbacks=Object.fromEntries(['chooseObject','openActivity','openResidence','openMap','openJournal','openResident','openArchive','openMathematics','openCollection','visitHome','interact','openIdea','inspectIdea','inspectPainting','floorPlan','exportHouse','reload'].map(name=>[name,(...args)=>{called.push({name,args});return ['reload','visitHome'].includes(name)?true:undefined;}]));
const object={id:'known-object',description:privateText};
const execute=createHomeCommandRouter({callbacks,findObject:id=>id===object.id?object:null,hasIdea:id=>id==='idea-stable',hasPainting:id=>id==='painting-stable',hasBook:id=>id==='definitions',hasHome:id=>id==='home-stable',getSelected:()=> 'study'});
for(const action of ['openResidence','openMap','openJournal','openResident','openArchive','openMathematics','openCollection','floorPlan','exportHouse','reload'])await execute(action);
await execute('visitHome',['home-stable',true]);assert.deepEqual(called.at(-1).args,['home-stable',true]);await assert.rejects(execute('visitHome',['other-home']),error=>error.status===400);
await execute('chooseObject',['known-object']);assert.equal(called.at(-1).args[0],object);
await execute('openActivity',['known-object']);assert.equal(called.at(-1).name,'openActivity');
await execute('readBook',['definitions']);assert.deepEqual(called.at(-1).args[0],{homeAction:'read',roomId:'study',bookId:'definitions'});
await execute('openIdea',['idea-stable']);await execute('inspectIdea',['idea-stable']);await execute('inspectPainting',['painting-stable','study']);
const interaction={homeAction:'read',roomId:'study',text:privateText};await execute('interact',[interaction]);assert.equal(called.at(-1).args[0].text,privateText);assert.notEqual(called.at(-1).args[0],interaction);
await assert.rejects(execute('openActivity',['unknown']),error=>error.status===400);await assert.rejects(execute('unknown'),error=>error.status===400);

const ui=fixtureWindow(),seen=[],notices=[],languageChanges=[];let executions=0,picks=0;
const tools={ready:Promise.resolve(true),async execute(action,args){executions++;seen.push({action,args});if(action==='reload'){const e=new HomeSceneError('FAKE revision conflict',409);e.outcomeUnknown=true;throw e;}},open:async()=>{executions++;},pick:async data=>{picks++;seen.push(data);},assetIds:()=>[],residentVisit:visit=>seen.push(visit)};
const uiBridge=installHomeMessages({windowLike:ui.w,getTools:()=>tools,language:{set:lang=>languageChanges.push(lang)},notify:text=>notices.push(text),readAsset:async()=>{throw Error('No fixture asset');}});
await ui.send({type:'city-home-command',id:'cmd1',action:'openJournal',args:[]},{from:'https://example.invalid'});assert.equal(executions,0);
await Promise.all([ui.send({type:'city-home-command',id:'cmd1',action:'openJournal',args:[]}),ui.send({type:'city-home-command',id:'cmd1',action:'openJournal',args:[]})]);assert.equal(executions,1);assert.equal(ui.messages.filter(m=>m.data.id==='cmd1').length,2);
await ui.send({type:'CITY_HOME_OPEN',id:'upper1',tool:'home',payload:{}});assert.equal(executions,2);
await ui.send({type:'city-home-interaction',data:{ideaId:'idea-stable',text:privateText}});assert.equal(picks,1);assert.equal(seen.at(-1).text,privateText);
await ui.send({type:'CITY_HOME_PICK',data:{homeAction:'read'}});assert.equal(picks,2);
await ui.send({type:'city-home-state',state:{lang:'fa',notes:privateText}});await ui.send({type:'city-language',lang:'en'});assert.deepEqual(languageChanges,['fa','en']);assert.equal(interaction.text,privateText);
await ui.send({type:'city-home-command',id:'conflict',action:'reload',args:[]});const errorSignal=ui.messages.at(-1).data;assert.equal(errorSignal.ok,false);assert.equal(errorSignal.status,409);assert.equal(errorSignal.outcomeUnknown,true);assert.equal(errorSignal.error,'FAKE revision conflict');
await ui.send({type:'city-home-asset-request',id:'asset1',assetId:'a'.repeat(64)});assert.equal(ui.messages.at(-1).data.ok,false);assert.equal(ui.messages.at(-1).data.status,400);
uiBridge.announceReady();assert.deepEqual(ui.messages.at(-1).data,{type:'city-home-tool',action:'ready',args:[]});uiBridge.close();assert.equal(ui.messages.at(-1).data.action,'closeTools');uiBridge.destroy();

let backendCalls=0;const mockCloud={connected:true,async fetch(path,options){backendCalls++;assert(!Object.hasOwn(options,'credentials'));assert.equal(options.body,JSON.stringify({revision:7,note:privateText}));return {ok:false,status:409,json:async()=>({error:'FAKE stale revision',outcomeUnknown:false})};}};
const response=await cloudHouseFetch(mockCloud,'/api/house',{method:'PUT',credentials:'same-origin',body:JSON.stringify({revision:7,note:privateText})});assert.equal(response.status,409);await assert.rejects(readHouseResponse(response),error=>error.status===409&&!error.outcomeUnknown);assert.equal(backendCalls,1);
await assert.rejects(cloudHouseFetch(mockCloud,'/api/house',{credentials:'include'}),error=>error.status===400);assert.equal(backendCalls,1);
mockCloud.connected=false;await assert.rejects(cloudHouseFetch(mockCloud,'/api/house'),error=>error.status===428);assert.equal(backendCalls,1);
const unknown=Object.assign(Error('FAKE lost response'),{status:504,outcomeUnknown:true});const brokenCloud={connected:true,fetch:async()=>{throw unknown;}};await assert.rejects(cloudHouseFetch(brokenCloud,'/api/house',{method:'PUT',body:'{}'}),error=>error===unknown);assert.equal(backendCalls,1);

const staged=await fs.readFile(new URL('../src/city-source-assets/home-tools/city-scene-bridge.js',import.meta.url),'utf8');assert(staged.includes("from './scene-original.js'"));assert(staged.includes('objectPreview'));assert(!staged.includes("type:'CITY_HOME_SCENE'"));assert(!/new\s+(?:THREE\.)?(?:WebGLRenderer|PerspectiveCamera)|requestAnimationFrame/.test(staged));
const app=await fs.readFile(new URL('../src/city-source-assets/home-tools/app.js',import.meta.url),'utf8');for(const binding of ['constructionUI.show(item)','objectStoreUI.show(null,item.id)','residenceUI.open()','residenceUI.openMap()','homeUI.journal(true)','residentUI.show()','conversationUI.show()','homeUI.interact(data)','homeUI.inspectIdea(id)','residenceUI.inspectPainting(id,roomId)','setPlan(true)','CITY_HOME_EXPORT_COMPLETE()'])assert(app.includes(binding),binding);
const entry=await fs.readFile(new URL('../src/city-source-assets/home-tools/city-tools-entry.js',import.meta.url),'utf8');assert(!entry.includes("window.addEventListener('message',event=>"));assert(entry.includes('validateGlb(bytes)'));assert(entry.includes('homeMessages.announceReady()'));
console.log('PASS: fake-only Home protocol compatibility — one scene wire, legacy/current commands, callback routing, same-origin guards, async failures, private strings, status409, credentials stripping, no cloud fallback and retained preview geometry.');
