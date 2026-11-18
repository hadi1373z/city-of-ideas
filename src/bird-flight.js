import {buildBirdFlight} from './bird-flight-scene.js?v=escher-metal-20261118';
/** No input, storage, account or independent render loop. */
export function installBirdFlight(M,T,{events=globalThis,...options}={}){
 const parent=M.worldCylinder?.built?.group;if(!parent?.isObject3D)throw Error('The connected world must exist before its observatory flight');
 // A separate proper half-turn keeps shaft birds visible from Babel even while
 // the whole lower source district is culled. No remote source-origin offset.
 const built=buildBirdFlight(T,options),wrapper=new T.Group(),prior=M.city.update;wrapper.name='Physical bird flight · shared shaft and lower observatory';wrapper.position.set(0,-96,0);wrapper.rotation.x=Math.PI;wrapper.add(built.group);parent.add(wrapper);let disposed=false;
 function update(...args){prior.apply(M.city,args);if(!disposed)built.update(Number(args[1])||0,{reduced:globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false});}
 function dispose(){if(disposed)return;disposed=true;if(M.city.update===update)M.city.update=prior;built.dispose();wrapper.removeFromParent();if(M.birdFlight===api)delete M.birdFlight;events.removeEventListener?.('pagehide',dispose);}
 const api={built,wrapper,dispose};M.birdFlight=api;M.city.update=update;events.addEventListener?.('pagehide',dispose,{once:true});return api;
}
