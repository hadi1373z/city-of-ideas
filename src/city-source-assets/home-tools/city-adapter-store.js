import {cloudHouseFetch,readHouseResponse} from './city-house-cloud-transport.js';
import {createBrowserHouseStore,BrowserHouseError} from './city-browser-store.js';
export const browserAssets=new Map();
export const browserStore=createBrowserHouseStore();
let service=null;
export const isBrowserMode=()=>service===null;
export const storageLabel=()=>isBrowserMode()?'Saved in this browser · separate from the private online house':'Saved to the original private online house';
export function setHouseService(value){if(value!==null&&(!value.connected||typeof value.fetch!=='function'))throw Error('Connect the original service before changing storage mode.');service=value;window.dispatchEvent(new CustomEvent('city-house-storage-change',{detail:{mode:isBrowserMode()?'browser-local':'original-private-service'}}));}
export async function houseFetch(path,options={}){
 if(options.credentials!==undefined&&options.credentials!=='same-origin')throw Error('Unsupported House credential mode.');const forwarded={...options};delete forwarded.credentials;
 if(service)return cloudHouseFetch(service,path,options);
 try{const data=await browserStore.request(path,options);return {ok:true,status:200,json:async()=>data};}catch(error){return {ok:false,status:error.status||503,json:async()=>({error:error.message})};}
}
// Evaluate the response before returning it so original response.ok semantics remain reliable.
export async function requestHouse(path,options={}){return readHouseResponse(await houseFetch(path,options),BrowserHouseError);}
export async function loadBrowserAssets(){for(const [id,blob]of await browserStore.storage.assets())if(!browserAssets.has(id))browserAssets.set(id,URL.createObjectURL(blob));}
export async function importBrowserAsset(bytes){if(!isBrowserMode())throw Error('The original cloud service does not support uploading new GLB assets.');if(bytes.byteLength>12*1024*1024)throw Error('Use a GLB file no larger than 12 MiB.');const buffer=bytes instanceof ArrayBuffer?bytes:bytes.buffer;const view=new DataView(buffer);if(view.byteLength<12||view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==view.byteLength)throw Error('Use a complete binary GLB 2.0 file.');const hash=await crypto.subtle.digest('SHA-256',buffer),id=[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');await browserStore.storage.putAsset(id,buffer);if(!browserAssets.has(id))browserAssets.set(id,URL.createObjectURL(new Blob([buffer],{type:'model/gltf-binary'})));return {id};}
