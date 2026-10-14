import {clone,validateHouse} from './model.js';
import {initialNeighborhood,validateNeighborhood,createEdition,selectEdition,saveEdition} from './neighborhood.js';
import {createResidence} from './residence-data.js';
import {initialCityNetwork,validateCityNetwork} from './city-network.js';
import {conversationRecords,validateConversationFile,CONVERSATION_ARCHIVE_LIMIT} from './conversation-data.js';

export class BrowserHouseError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const initial=()=>{const n=initialNeighborhood();return {schemaVersion:1,transactionVersion:0,revision:0,neighborhood:createEdition(n,createResidence(n.homes.at(-1).house),{edition:'residence',title:'Socrates’ residence'}),messages:[],briefs:[],rawImports:[]};};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const conflict=()=>new BrowserHouseError('This house changed in another tab. Your draft is kept. Reload saved state before trying again.',409);
const envelope=s=>({house:clone(s.neighborhood.homes.find(h=>h.id===s.neighborhood.activeId).house),neighborhood:clone(s.neighborhood),revision:s.revision});
function retainArchive(before,next){
 for(const [id,turns]of Object.entries(before?.artistConversations||{}))if(!same(turns,next.artistConversations?.[id]?.slice(0,turns.length)))throw new BrowserHouseError('Preserve earlier artist conversations before saving. Nothing was removed.',409);
 if(before?.learningTrail&&!same(before.learningTrail.records,next.learningTrail?.records?.slice(0,before.learningTrail.records.length)))throw new BrowserHouseError('Preserve earlier learning attempts before saving. Nothing was removed.',409);
 if(before?.artistHomes){if(!same(before.artistHomes.editions,next.artistHomes?.editions?.slice(0,before.artistHomes.editions.length)))throw new BrowserHouseError('Preserve earlier artist home editions before saving.',409);for(let i=0;i<before.artistHomes.proposals.length;i++){const a=before.artistHomes.proposals[i],b=next.artistHomes?.proposals?.[i];if(!b||['id','artistId','date','sourceMessageId'].some(k=>a[k]!==b[k])||(a.decision!=='pending'&&!same(a,b)))throw new BrowserHouseError('Preserve earlier artist decisions before saving.',409);}}
}

export function createIndexedDBStorage(indexedDBLike=globalThis.indexedDB){
 let connection;
 function db(){return connection||=new Promise((resolve,reject)=>{if(!indexedDBLike)return reject(new BrowserHouseError('Browser storage is unavailable. Nothing has been saved; export your draft before leaving.',503));const req=indexedDBLike.open('city-of-ideas-house-tools-v1',1);req.onupgradeneeded=()=>{req.result.createObjectStore('state');req.result.createObjectStore('assets');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new BrowserHouseError('Browser storage could not be opened. Your saved data was not replaced.',503));});}
 async function transact(store,mode,action){const connection=await db();return new Promise((resolve,reject)=>{const tx=connection.transaction(store,mode),object=tx.objectStore(store);let result;tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(tx.error||new BrowserHouseError('Browser save failed. Your previous data is kept.',503));action(object,value=>{result=value;},()=>tx.abort());});}
 return {
  read:()=>transact('state','readwrite',(store,done)=>{const req=store.get('document');req.onsuccess=()=>{if(req.result)done(req.result);else{const value=initial();store.put(value,'document');done(value);}};}),
  compareAndSet:(revision,value)=>transact('state','readwrite',(store,done)=>{const req=store.get('document');req.onsuccess=()=>{if(req.result?.transactionVersion!==revision){done(false);return;}store.put(value,'document');done(true);};}),
  putAsset:(id,bytes)=>transact('assets','readwrite',(store,done)=>{store.put(new Blob([bytes],{type:'model/gltf-binary'}),id);done(true);}),
  assets:()=>transact('assets','readonly',(store,done)=>{const values=[];const req=store.openCursor();req.onsuccess=()=>{const c=req.result;if(c){values.push([c.key,c.value]);c.continue();}else done(values);};}),
 };
}

export function createBrowserHouseStore({storage=createIndexedDBStorage(),onSave=()=>{}}={}){
 async function state(){const value=await storage.read();if(value.schemaVersion!==1)throw new BrowserHouseError('This saved browser document needs a newer adapter. Export it before editing.',409);return value;}
 async function commit(before,neighborhood,extra={}){
  const validated=validateNeighborhood(neighborhood),basis=extra.messages||before.messages,known=new Set(basis.map(m=>m.id)),records=await conversationRecords(validated),additions=records.filter(m=>!known.has(m.id));
  if(known.size+additions.length>CONVERSATION_ARCHIVE_LIMIT)throw new BrowserHouseError('Conversation storage is full. Export the archive; no messages were removed.',409);
  const next={...before,...extra,neighborhood:validated,transactionVersion:before.transactionVersion+1,revision:before.revision+1,messages:[...basis,...additions.map((m,i)=>({...m,sequence:basis.length+i+1}))]};
  if(!await storage.compareAndSet(before.transactionVersion,next))throw conflict();onSave(envelope(next));return envelope(next);
 }
 async function request(path,options={}){
  const url=new URL(path,'https://city.invalid'),method=(options.method||'GET').toUpperCase(),body=options.body?JSON.parse(options.body):{},before=await state();
  const requireRevision=()=>{if(!Number.isSafeInteger(body.revision)||body.revision!==before.revision)throw conflict();};
  if(['/api/config','/api/gpt/config'].includes(url.pathname))return {mode:'browser-local',storage:'this-browser',gpt:{ready:false},chatgpt:{ready:false,connected:false,planEnabled:false},capabilities:{conversationArchive:true,conversationImport:true,glbImport:true,artistGpt:false}};
  if(['/api/gpt/chat','/api/artists/chat','/api/chatgpt/chat'].includes(url.pathname))throw new BrowserHouseError('Generated conversations require the original local House connection. No paid AI request was made; your draft is kept.',409);
  if(['/api/house','/api/neighborhood','/api/house/export'].includes(url.pathname)&&method==='GET')return {...envelope(before),...(url.pathname.endsWith('/export')?{exportedAt:new Date().toISOString(),storage:'browser-local',rawImports:clone(before.rawImports)}:{})};
  if(url.pathname==='/api/house'&&method==='PUT'){requireRevision();return commit(before,saveEdition(before.neighborhood,validateHouse(body.house)));}
  if(url.pathname==='/api/neighborhood/select'&&method==='POST'){requireRevision();return commit(before,selectEdition(before.neighborhood,body.homeId));}
  if(url.pathname==='/api/neighborhood/create'&&method==='POST'){requireRevision();return commit(before,createEdition(before.neighborhood));}
  if(url.pathname==='/api/neighborhood/import'&&method==='POST'){requireRevision();const imported=validateHouse(body.house);return commit(before,createEdition(before.neighborhood,imported,{edition:'atelier',title:body.title||'Imported designer home'}),{rawImports:[...before.rawImports,{at:new Date().toISOString(),kind:'home',document:clone(body.house)}]});}
  if(url.pathname==='/api/cities'&&method==='GET')return {cityNetwork:clone(before.neighborhood.cityNetwork||initialCityNetwork()),revision:before.revision};
  if(url.pathname==='/api/cities'&&method==='PUT'){requireRevision();const cityNetwork=validateCityNetwork(body.cityNetwork);retainArchive(before.neighborhood.cityNetwork,cityNetwork);return {...await commit(before,{...before.neighborhood,cityNetwork}),cityNetwork};}
  if(url.pathname==='/api/conversations/import'&&method==='POST'){const valid=await validateConversationFile(body.file,{maxMessages:1000,maxBytes:1300000}),records=Array.isArray(valid)?valid:valid.messages,known=new Set(before.messages.map(m=>m.id));const additions=records.filter(m=>!known.has(m.id));if(before.messages.length+additions.length>CONVERSATION_ARCHIVE_LIMIT)throw new BrowserHouseError('The archive is full. Export it before importing more.',409);const next={...before,transactionVersion:before.transactionVersion+1,messages:[...before.messages,...additions.map((m,i)=>({...m,imported:true,sequence:before.messages.length+i+1}))],rawImports:[...before.rawImports,{at:new Date().toISOString(),kind:'conversations',document:clone(body.file)}]};if(!await storage.compareAndSet(before.transactionVersion,next))throw conflict();return {imported:additions.length,duplicates:records.length-additions.length,total:next.messages.length};}
  if(['/api/conversations','/api/conversations/file'].includes(url.pathname)&&method==='GET'){const all=url.pathname.endsWith('/file'),cursor=url.searchParams.has('before')?Number(url.searchParams.get('before')):Infinity,limit=all?CONVERSATION_ARCHIVE_LIMIT:Number(url.searchParams.get('limit')||200),messages=before.messages.filter(m=>m.sequence<cursor),page=messages.slice(-limit);return {format:'house-of-ideas-private-conversations',version:1,storage:'browser-local',messages:clone(page),briefs:clone(before.briefs),nextCursor:messages.length>page.length?page[0].sequence:null,exportedAt:new Date().toISOString()};}
  if(url.pathname==='/api/improvements'&&method==='POST'){for(const [key,max]of Object.entries({problem:1000,proposal:2000,criteria:1500}))if(typeof body[key]!=='string'||!body[key].trim()||body[key].length>max)throw new BrowserHouseError('Complete the problem, proposal and acceptance check.');if(!Array.isArray(body.evidenceIds)||!body.evidenceIds.length||body.evidenceIds.length>20||new Set(body.evidenceIds).size!==body.evidenceIds.length||body.evidenceIds.some(id=>!before.messages.some(m=>m.id===id)))throw new BrowserHouseError('Choose 1–20 distinct messages from this archive.');const brief={...clone(body),id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:'draft',sourceContext:{storage:'browser-local',houseRevision:before.revision,activeHomeId:before.neighborhood.activeId}},next={...before,transactionVersion:before.transactionVersion+1,briefs:[...before.briefs,brief]};if(!await storage.compareAndSet(before.transactionVersion,next))throw conflict();return {brief};}
  const match=url.pathname.match(/^\/api\/improvements\/([a-f0-9-]{36})\/(approve|file)$/);if(match){const brief=before.briefs.find(b=>b.id===match[1]);if(!brief)throw new BrowserHouseError('This proposal was not found.',404);if(match[2]==='file'){if(brief.status!=='approved')throw new BrowserHouseError('Review and approve this proposal before exporting it.',409);return clone(brief);}if(method!=='POST')throw new BrowserHouseError('Use an explicit approval.',405);const approved={...brief,status:'approved',approvedAt:new Date().toISOString()},next={...before,transactionVersion:before.transactionVersion+1,briefs:before.briefs.map(b=>b.id===brief.id?approved:b)};if(!await storage.compareAndSet(before.transactionVersion,next))throw conflict();return {brief:approved};}
  throw new BrowserHouseError('This original service route is not available in browser storage: '+url.pathname,404);
 }
 async function importNeighborhood(input){
  const before=await state(),incoming=input.neighborhood||input,valid=validateNeighborhood(incoming);let combined=clone(before.neighborhood);
  const idMap=new Map();for(const home of valid.homes){if(combined.homes.some(h=>h.id===home.id&&same(h,home))){idMap.set(home.id,home.id);continue;}const id=combined.homes.some(h=>h.id===home.id)?'import-'+crypto.randomUUID().slice(0,36):home.id;idMap.set(home.id,id);combined.homes.push({...clone(home),id});}
  combined.activeId=idMap.get(valid.activeId);if(combined.homes.length>128)throw new BrowserHouseError('Too many home editions. Existing homes were kept.',409);
  // An existing independently developed collection is never overwritten by an archive.
  // Conflicting complete networks remain intact in the unmodified source backup.
  if(valid.cityNetwork&&!combined.cityNetwork)combined.cityNetwork=clone(valid.cityNetwork);
  let messages=clone(before.messages);if(Array.isArray(input.messages)){const imported=await validateConversationFile({format:'house-of-ideas-private-conversations',version:1,messages:input.messages},{maxMessages:CONVERSATION_ARCHIVE_LIMIT,maxBytes:32*1024*1024});const known=new Set(messages.map(m=>m.id));for(const m of imported.messages)if(!known.has(m.id)){messages.push({...clone(m),sequence:messages.length+1});known.add(m.id);}}
  let briefs=clone(before.briefs);if(Array.isArray(input.briefs)){for(const b of input.briefs){if(!b||!['draft','approved'].includes(b.status)||typeof b.problem!=='string'||typeof b.proposal!=='string'||typeof b.criteria!=='string'||!Array.isArray(b.evidenceIds))throw new BrowserHouseError('Use a complete proposal archive. Existing proposals are kept.');if(briefs.some(v=>same(v,b)))continue;const id=briefs.some(v=>v.id===b.id)?crypto.randomUUID():b.id;briefs.push({...clone(b),id});}}
  const raw=clone(input);delete raw.assets;return commit(before,combined,{messages,briefs,rawImports:[...before.rawImports,{at:new Date().toISOString(),kind:'neighborhood',document:raw}]});
 }
 return {request,importNeighborhood,state,storage};
}
