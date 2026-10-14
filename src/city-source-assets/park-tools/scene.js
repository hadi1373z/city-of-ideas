/* Renderer-free bridge: these original tools act on the shared city canvas. */
let current={x:0,z:223,districtId:null,floor:0,yaw:0};
const send=(action,args=[])=>parent.postMessage({type:'ideas-park-tool',action,args},location.origin);
export async function createPark(options){
 window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin)return;const d=e.data;if(d?.type==='ideas-park-state'){current=d.state;options.onMove?.({...current,view:'wander',labels:[]});options.onWorldFrame?.(d.frame||{});}if(d?.type==='ideas-park-select')options.onSelect?.(d.selection);});
 const api={getPosition:()=>({...current}),worldState:()=>({...current,edition:'unified-v1'}),restoreWorld:p=>{send('restoreWorld',[p]);return true},getStats:()=>({trees:620,sculptures:118,districts:9,seeds:0,area:'480 × 480m original scale'}),worldInteract:d=>{send('worldInteract',[d]);return true}};
 for(const name of ['setMovement','setView','teleport','focus','zoom','setTime','addSeed','removeSeed','updateSeed','setSeeds','goHome'])api[name]=(...args)=>send(name,args);
 options.onReady?.();send('ready');return api;
}
