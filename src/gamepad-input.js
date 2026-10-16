/* Standard browser gamepad layout. Button labels vary by controller mode. */
(()=>{'use strict';
window.createCityGamepad=function(getPads=()=>navigator.getGamepads?.()||[]){
 let previous=[],activeIndex=null;
 const axis=value=>{value=Number.isFinite(value)?Math.max(-1,Math.min(1,value)):0;return Math.abs(value)<=.18?0:Math.sign(value)*Math.min(1,(Math.abs(value)-.18)/.82);};
 return {poll(blocked=false){
  const pads=Array.from(getPads()),active=pads.find(p=>p?.connected&&p.index===activeIndex),pad=active||pads.find(p=>p?.connected);
  if(!pad){previous=[];activeIndex=null;return {connected:false,forward:0,strafe:0,lookX:0,lookY:0,sprint:false,interact:false,start:false};}
  if(activeIndex!==pad.index){previous=pad.buttons.map(b=>!!b.pressed);activeIndex=pad.index;}
  const buttons=pad.buttons.map(b=>!!b.pressed),edge=i=>!!buttons[i]&&!previous[i];
  const result={connected:true,forward:blocked?0:-axis(pad.axes[1]),strafe:blocked?0:axis(pad.axes[0]),lookX:blocked?0:axis(pad.axes[2]),lookY:blocked?0:axis(pad.axes[3]),sprint:!blocked&&!!buttons[10],interact:!blocked&&edge(0),start:!blocked&&edge(9)};
  previous=buttons;return result;
 }};
};
})();
