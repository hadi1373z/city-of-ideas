import {isHomeParentEvent,HomeSceneError} from './city-home-protocol.js';
export function installHomeMessages({windowLike=window,getTools,language,notify=()=>{},readAsset,maxAssetBytes=12*1024*1024}={}){
  const w=windowLike,commands=new Map();let commandTail=Promise.resolve();
  const enqueue=callback=>{const operation=commandTail.then(callback);commandTail=operation.catch(()=>{});return operation;};
  const reply=(event,data,transfer=[])=>event.source.postMessage(data,w.location.origin,transfer);
  const fail=(event,data,error)=>{notify(error.message);reply(event,{type:'city-home-command-result',id:data.id,ok:false,error:error.message,status:Number.isInteger(error.status)?error.status:503,outcomeUnknown:Boolean(error.outcomeUnknown)});};
  const listener=async event=>{
    if(!isHomeParentEvent(event,w))return;
    const data=event.data,tools=getTools();if(!data||!tools)return;
    if(data.type==='city-language'||data.type==='CITY_HOME_LANGUAGE'){if(['fa','en'].includes(data.lang))language?.set(data.lang);return;}
    if(data.type==='city-home-state'){if(['fa','en'].includes(data.state?.lang))language?.set(data.state.lang);return;}
    if(data.type==='city-home-interaction'||data.type==='CITY_HOME_PICK'){
      await enqueue(async()=>{try{await tools.ready;await tools.pick(data.data);if(data.id)reply(event,{type:'city-home-command-result',id:data.id,ok:true});}catch(error){fail(event,data,error);}});return;
    }
    if(data.type==='city-home-resident-visit'||data.type==='CITY_HOME_RESIDENT_VISIT'){tools.residentVisit?.(data.visit??data.data);return;}
    if(data.type==='city-home-resident-interact'){tools.residentInteract?.();return;}
    if(data.type==='city-home-asset-request'){
      try{
        await tools.ready;
        if(typeof data.assetId!=='string'||!/^[a-f0-9]{64}$/.test(data.assetId)||!tools.assetIds().includes(data.assetId))throw new HomeSceneError('This model is not present in the selected House.',400);
        const bytes=await readAsset(data.assetId,maxAssetBytes);
        if(!(bytes instanceof ArrayBuffer)||bytes.byteLength>maxAssetBytes)throw new HomeSceneError('The model exceeds the shared-scene preview limit. The original asset is kept.',413);
        const glb=new DataView(bytes);if(bytes.byteLength<20||glb.getUint32(0,true)!==0x46546c67||glb.getUint32(4,true)!==2||glb.getUint32(8,true)!==bytes.byteLength)throw new HomeSceneError('Use a complete GLB 2.0 model.',400);
        const hash=[...new Uint8Array(await w.crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
        if(hash!==data.assetId)throw new HomeSceneError('The model bytes do not match their stable identifier.',409);
        reply(event,{type:'city-home-asset-result',id:data.id,assetId:data.assetId,ok:true,bytes},[bytes]);
      }catch(error){notify(error.message);reply(event,{type:'city-home-asset-result',id:data.id,assetId:data.assetId,ok:false,error:error.message,status:error.status||503});}return;
    }
    if(data.type!=='city-home-command'&&data.type!=='CITY_HOME_OPEN')return;
    if(data.id&&commands.has(data.id)){const previous=await commands.get(data.id);reply(event,previous);return;}
    if(commands.size>=5000){fail(event,data,new HomeSceneError('Home command session limit reached. Preserve drafts before reloading.',409));return;}
    const operation=enqueue(async()=>{try{await tools.ready;const value=data.type==='CITY_HOME_OPEN'?await tools.open(data.tool,data.payload):await tools.execute(data.action,Array.isArray(data.args)?data.args:[]);return {type:'city-home-command-result',id:data.id,ok:true,...(value===undefined?{}:{value})};}catch(error){notify(error.message);return {type:'city-home-command-result',id:data.id,ok:false,error:error.message,status:Number.isInteger(error.status)?error.status:503,outcomeUnknown:Boolean(error.outcomeUnknown)};}});
    if(data.id)commands.set(data.id,operation);reply(event,await operation);
  };
  w.addEventListener('message',listener);
  return {announceReady(){if(w.parent!==w)w.parent.postMessage({type:'city-home-tool',action:'ready',args:[]},w.location.origin);},close(){if(w.parent!==w)w.parent.postMessage({type:'city-home-tool',action:'closeTools',args:[]},w.location.origin);},destroy(){w.removeEventListener('message',listener);commands.clear();}};
}
