// One parent/one walking renderer. Neither this module nor its callers create a world canvas.
export class HomeSceneError extends Error { constructor(message, status = 503) { super(message); this.name = 'HomeSceneError'; this.status = status; } }
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
export function isHomeParentEvent(event, windowLike) { return windowLike.parent !== windowLike && event.source === windowLike.parent && event.origin === windowLike.location.origin; }
export function normalizeHomeState(value) {
  if (!plain(value)) throw new HomeSceneError('Invalid city home state.', 400);
  const next = structuredClone(value);
  if ([value.x,value.y,value.z].some(Number.isFinite)) next.position = {x:value.x,y:value.y,z:value.z};
  if (plain(value.residentState)) next.resident = structuredClone(value.residentState);
  if (value.floor !== undefined && (!Number.isInteger(value.floor) || value.floor < 0 || value.floor > 7)) throw new HomeSceneError('Invalid city floor.', 400);
  return next;
}
export function createSceneProtocol({windowLike = window, onState = () => {}, onError = () => {}, timeoutMs = 12000} = {}) {
  const w = windowLike, pending = new Map(); let supported = null;
  const notify = (action, args = [], id) => { const data={type:'city-home-tool',action,args:structuredClone(args),...(id?{id}:{})}; if(w.parent!==w)w.parent.postMessage(data,w.location.origin); return data; };
  const listener = event => {
    if (!isHomeParentEvent(event,w)) return;
    const data=event.data;
    if(data?.type==='city-home-state'||data?.type==='CITY_HOME_CONTEXT'){
      try{const state=normalizeHomeState(data.state??data.context); if(Array.isArray(state.supportedSceneMethods))supported=new Set(state.supportedSceneMethods.filter(x=>typeof x==='string')); onState(state);}catch(error){onError(error);} return;
    }
    if(data?.type!=='city-home-scene-result'||!pending.has(data.id))return;
    const item=pending.get(data.id); if(data.action!==undefined&&data.action!==item.action)return;
    pending.delete(data.id);w.clearTimeout(item.timer);
    if(data.ok===true)item.resolve(data.value??true);
    else item.reject(new HomeSceneError(data.error||'The original scene action could not find a safe target.',Number.isInteger(data.status)?data.status:503));
  };
  w.addEventListener('message',listener);
  function request(action,args=[]){
    let error;
    if(w.parent===w)error=new HomeSceneError('Open these tools inside City of Ideas to use the shared scene.',428);
    else if(supported&&!supported.has(action))error=new HomeSceneError('The shared city has not connected the original '+action+' scene action. Saved data is kept.',501);
    const id=w.crypto.randomUUID();
    const promise=error?Promise.reject(error):new Promise((resolve,reject)=>{const timer=w.setTimeout(()=>{pending.delete(id);reject(new HomeSceneError('The city did not confirm '+action+'. Saved data is kept.'));},timeoutMs);pending.set(id,{action,resolve,reject,timer});notify(action,args,id);});
    // Report ignored synchronous callers, while retaining rejection for callers that await navigation.
    promise.catch(onError);return promise;
  }
  return {request,notify,get supported(){return supported;},destroy(){w.removeEventListener('message',listener);for(const item of pending.values()){w.clearTimeout(item.timer);item.reject(new HomeSceneError('The home scene connection ended.'));}pending.clear();}};
}

export function createHomeCommandRouter({callbacks,findObject,hasIdea,hasPainting,hasBook,hasHome,getSelected}) {
  const invoke=(name,...args)=>{if(typeof callbacks[name]!=='function')throw new HomeSceneError('Original Home callback is unavailable: '+name,503);return callbacks[name](...args);};
  return async function execute(action,args=[]){
    if(!Array.isArray(args))throw new HomeSceneError('Use the original command arguments.',400);
    const [a,b]=args;
    switch(action){
      case 'chooseObject':case 'openActivity':{const item=findObject(a);if(!item)throw new HomeSceneError('Choose a known store object.',400);return action==='chooseObject'?invoke('chooseObject',item):invoke('openActivity',item);}
      case 'openResidence':case 'openMap':case 'openJournal':case 'openResident':case 'openArchive':case 'openMathematics':case 'openCollection':case 'floorPlan':return invoke(action);
      case 'visitHome':case 'inspectHome':if(!hasHome?.(a))throw new HomeSceneError('Choose a preserved home.',400);return invoke(action,a,Boolean(b));
      case 'readBook':if(a!==undefined&&!hasBook(a))throw new HomeSceneError('Choose an original book.',400);return invoke('interact',{homeAction:'read',roomId:getSelected(),...(a?{bookId:a}:{bookId:'definitions'})});
      case 'openIdea':if(a!=null&&!hasIdea(a))throw new HomeSceneError('Choose a saved idea.',400);return invoke('openIdea',a??null);
      case 'inspectIdea':if(!hasIdea(a))throw new HomeSceneError('Choose a saved idea.',400);return invoke('inspectIdea',a);
      case 'inspectPainting':if(!hasPainting(a))throw new HomeSceneError('Choose an original painting.',400);return invoke('inspectPainting',a,b);
      case 'interact':if(!plain(a))throw new HomeSceneError('Use an original interaction record.',400);return invoke('interact',structuredClone(a));
      case 'exportHouse':return invoke('exportHouse');
      case 'reload':{const result=await invoke('reload');if(result===false)throw new HomeSceneError('Could not reload the selected House service. Your draft and storage selection are kept.');return result;}
      default:throw new HomeSceneError('Unknown home tool command: '+String(action),400);
    }
  };
}

export function homeUiChanged(before,after){const keys=['cityId','roomId','floor','artistId','artistEditionId','outside'];return keys.some(key=>before?.[key]!==after?.[key])||Boolean(before?.resident?.near)!==Boolean(after?.resident?.near)||Boolean(before?.resident?.talking)!==Boolean(after?.resident?.talking)||Boolean(before?.artistResident?.near)!==Boolean(after?.artistResident?.near)||Boolean(before?.artistResident?.talking)!==Boolean(after?.artistResident?.talking);}

export function createVisitorPositionGuard(send){let held=0;const navigation=new Set(['leaveArtCity','startOutside','arriveAtDoor','reset']);return{send(action,args=[]){return held&&navigation.has(action)?Promise.resolve({preserveVisitorPosition:true}):send(action,args);},async run(callback){held++;try{return await callback();}finally{held--;}}};}
