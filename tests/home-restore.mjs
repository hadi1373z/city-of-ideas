// Fake shared parent only; no account, network, renderer, paid API or saved user data.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {registerHooks} from 'node:module';
const source=new URL('../src/city-source-assets/home-tools/',import.meta.url);
// Match the browser import map for the bundled original Three.js. No dependency download.
const hooks=registerHooks({resolve(specifier,context,next){return next(specifier==='three'?new URL('vendor/three.module.js',source).href:specifier,context);}});
let moduleUrl=new URL('city-scene-bridge.js',source).href;
if(process.argv.length>2){
 assert.deepEqual(process.argv.slice(2),['--staged']);
 const candidate=await fs.readFile(new URL('../followup/city-scene-bridge.js',import.meta.url),'utf8');
 const linked=candidate.replace(/(from\s+)(['"])(\.\/[^'"]+)\2/g,(_,prefix,quote,relative)=>prefix+quote+new URL(relative,source).href+quote);
 moduleUrl='data:text/javascript;base64,'+Buffer.from(linked).toString('base64');
}
const {createScene}=await import(moduleUrl);
const origin='https://hadi1373z.github.io',listeners=new Map(),sent=[];
const parent={postMessage:(data,target)=>{assert.equal(target,origin);sent.push(data);}};
const fakeWindow={parent,location:{origin},crypto,setTimeout,clearTimeout,addEventListener(type,callback){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(callback);},removeEventListener(type,callback){listeners.get(type)?.delete(callback);}};
const previousWindow=globalThis.window;globalThis.window=fakeWindow;
const changes=[],scene=createScene(null,data=>changes.push(data));
const receive=data=>{for(const callback of listeners.get('message')||[])callback({source:parent,origin,data});};
const initial={cityId:'home',roomId:'learning',floor:0,resident:{near:false,position:{x:1,z:2}},supportedSceneMethods:['restoreResidentState']};
receive({type:'city-home-state',state:initial});changes.length=0;
const state={roomId:'study',floor:0,position:{x:7,z:8},note:'FAKE private resident note / یادداشت آزمایشی'};
const unchanged=JSON.stringify(state);
try{
 const pending=scene.restoreResidentState(state),first=sent.at(-1);
 assert.equal(typeof pending?.then,'function');assert.equal(first.type,'city-home-tool');assert.equal(first.action,'restoreResidentState');assert.deepEqual(first.args,[state]);
 assert.deepEqual(scene.residentState().position,{x:1,z:2});assert.equal(changes.length,0,'No optimistic child render before the real restore response.');
 receive({type:'city-home-scene-result',id:first.id,action:first.action,ok:true,value:true});assert.equal(await pending,true);
 assert.deepEqual(scene.residentState().position,{x:1,z:2},'Parent context owns the actual resident position.');
 receive({type:'city-home-state',state:{...initial,resident:{...initial.resident,position:{x:7,z:8}}}});assert.deepEqual(scene.residentState().position,{x:7,z:8});
 const unsafe=scene.restoreResidentState({...state,position:{x:99,z:99}}),unsafeRequest=sent.at(-1);receive({type:'city-home-scene-result',id:unsafeRequest.id,action:unsafeRequest.action,ok:true,value:false});await assert.rejects(unsafe,/safe target/);assert.deepEqual(scene.residentState().position,{x:7,z:8});
 const conflict=scene.restoreResidentState(state),request=sent.at(-1);receive({type:'city-home-scene-result',id:request.id,action:request.action,ok:false,status:409,error:'FAKE resident revision conflict'});await assert.rejects(conflict,error=>error.status===409&&error.message==='FAKE resident revision conflict');assert.deepEqual(scene.residentState().position,{x:7,z:8});
 receive({type:'city-home-state',state:{...initial,supportedSceneMethods:[]}});const count=sent.length;await assert.rejects(scene.restoreResidentState(state),error=>error.status===501);assert.equal(sent.length,count);
 assert.equal(JSON.stringify(state),unchanged);assert(!sent.some(data=>data.type==='CITY_HOME_SCENE'));
 console.log('PASS: fake-only '+(process.argv.includes('--staged')?'staged':'installed')+' resident restore uses the real parent action, preserves private input, awaits parent position and rejects unsafe/error/unsupported results.');
}finally{
 for(const callback of listeners.get('pagehide')||[])callback();globalThis.window=previousWindow;hooks.deregister();
}
