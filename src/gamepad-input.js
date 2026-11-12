/* Standard browser controls, with a learnable per-controller photo button. */
(()=>{'use strict';
window.createCityGamepad=function(getPads=()=>navigator.getGamepads?.()||[],storage){
 if(storage===undefined)try{storage=window.localStorage;}catch{}
 const storageKey='city-photo-buttons:v1';let profiles={};
 try{const value=JSON.parse(storage?.getItem(storageKey)||'null');if(value?.version===1&&value.buttons&&typeof value.buttons==='object')for(const [key,index]of Object.entries(value.buttons).slice(0,32))if(/^pad-[0-9a-f]+$/.test(key)&&Number.isInteger(index)&&index>=0&&index<32)profiles[key]=index;}catch{}
 let previous=[],activeIndex=null,activeKey=null,neutral=[],photoButton=4,learning=false,armed=false,mappingSaved=!!storage;
 const axis=value=>{value=Number.isFinite(value)?Math.max(-1,Math.min(1,value)):0;return Math.abs(value)<=.18?0:Math.sign(value)*Math.min(1,(Math.abs(value)-.18)/.82);};
 const readAxis=(pad,i)=>{const value=Number.isFinite(pad.axes[i])?pad.axes[i]:0,center=neutral[i]||0,delta=value-center,range=delta>=0?1-center:1+center;return axis(delta/Math.max(.05,range));};
 const profileKey=pad=>{let h=2166136261;for(const c of String(pad.id||'controller')+'|'+String(pad.mapping||'')+'|'+pad.buttons.length)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return'pad-'+h.toString(16);};
 const persist=()=>{try{if(!storage)throw Error();storage.setItem(storageKey,JSON.stringify({version:1,buttons:profiles}));mappingSaved=true;}catch{mappingSaved=false;}};
 const empty=()=>({connected:false,forward:0,strafe:0,lookX:0,lookY:0,sprint:false,interact:false,start:false,confirm:false,back:false,menu:false,fast:false,light:false,music:false,photo:false,next:false,previous:false,scroll:0,uiX:0,uiY:0,uiLookY:0,photoLearning:false,photoAssigned:false,photoButton:4,photoMappingSaved:mappingSaved,controllerName:''});
 return{
  calibrate(){const pad=Array.from(getPads()).find(p=>p?.connected&&p.index===activeIndex);if(!pad)return false;neutral=pad.axes.map(v=>Number.isFinite(v)?v:0);return true;},
  beginPhotoBinding(){if(activeKey===null)return false;learning=true;armed=false;return true;},
  cancelPhotoBinding(){learning=false;armed=false;},
  resetPhotoBinding(){learning=false;armed=false;photoButton=4;if(activeKey){delete profiles[activeKey];persist();}},
  poll(blocked=false){
   const pads=Array.from(getPads()),active=pads.find(p=>p?.connected&&p.index===activeIndex),pad=active||pads.find(p=>p?.connected);
   if(!pad){previous=[];activeIndex=null;activeKey=null;neutral=[];learning=false;armed=false;return empty();}
   const key=profileKey(pad);
   if(activeIndex!==pad.index||activeKey!==key){previous=pad.buttons.map(b=>!!b.pressed);activeIndex=pad.index;activeKey=key;neutral=[];learning=false;armed=false;photoButton=Number.isInteger(profiles[key])&&profiles[key]<pad.buttons.length?profiles[key]:4;}
   const buttons=pad.buttons.map(b=>!!b.pressed),edge=i=>!!buttons[i]&&!previous[i];
   const firstEdge=buttons.findIndex((down,i)=>down&&!previous[i]);let assigned=false;
   const learningFrame=learning;
   if(learning){if(!armed){if(buttons.every(down=>!down))armed=true;}else if(firstEdge>=0&&firstEdge<32){photoButton=firstEdge;profiles[activeKey]=firstEdge;persist();learning=false;armed=false;assigned=true;}}
   // Learning consumes the entire press, so binding a shoulder cannot also
   // toggle music, confirm a menu, or immediately take an unintended photo.
   if(learningFrame){previous=buttons;return{...empty(),connected:true,photoLearning:learning,photoAssigned:assigned,photoButton,photoMappingSaved:mappingSaved,controllerName:String(pad.id||'Controller')};}
   const action=i=>i!==photoButton&&edge(i);
   const result={connected:true,forward:blocked?0:-readAxis(pad,1),strafe:blocked?0:readAxis(pad,0),lookX:blocked?0:readAxis(pad,2),lookY:blocked?0:readAxis(pad,3),sprint:!blocked&&photoButton!==10&&!!buttons[10],interact:!blocked&&action(0),start:!blocked&&action(9),music:action(7),photo:edge(photoButton),confirm:action(0),back:action(1),menu:action(9),fast:!blocked&&action(3),light:!blocked&&action(2),next:action(13)||action(15),previous:action(12)||action(14),scroll:action(5)?1:0,uiX:readAxis(pad,0),uiY:readAxis(pad,1),uiLookY:readAxis(pad,3),photoLearning:false,photoAssigned:false,photoButton,photoMappingSaved:mappingSaved,controllerName:String(pad.id||'Controller')};
   previous=buttons;return result;
  }
 };
};
})();
