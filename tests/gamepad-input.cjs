const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const window={};vm.runInNewContext(fs.readFileSync('src/gamepad-input.js','utf8'),{window});
let pads=[];const input=window.createCityGamepad(()=>pads);
assert.equal(input.poll().connected,false);
const pad={index:0,connected:true,axes:[.1,-.59,1,0],buttons:Array.from({length:16},()=>({pressed:false}))};pads=[pad];
let state=input.poll();assert.equal(state.strafe,0);assert.ok(Math.abs(state.forward-.5)<1e-8);assert.equal(state.lookX,1);
pad.buttons[0].pressed=true;assert.equal(input.poll().interact,true);assert.equal(input.poll().interact,false);
pad.buttons[0].pressed=false;input.poll();pad.buttons[0].pressed=true;
state=input.poll(true);assert.equal(state.forward,0);assert.equal(state.interact,false);assert.equal(input.poll().interact,false);
pads=[];state=input.poll();assert.equal(state.forward,0);assert.equal(state.connected,false);
pads=[pad];assert.equal(input.poll().interact,false);
console.log('Gamepad dead zone, analog movement, button edges, modal suppression and reconnection passed.');

// Closing and menu edges remain available when world movement is blocked.
pad.buttons.forEach(b=>b.pressed=false);input.poll(true);
pad.buttons[1].pressed=true;state=input.poll(true);assert.equal(state.back,true);assert.equal(state.forward,0);assert.equal(input.poll(true).back,false);
pad.buttons[0].pressed=true;state=input.poll(true);assert.equal(state.confirm,true);assert.equal(state.interact,false);
pad.buttons[9].pressed=true;pad.buttons[13].pressed=true;state=input.poll(true);assert.equal(state.menu,true);assert.equal(state.next,true);assert.equal(state.start,false);
pad.buttons.forEach(b=>b.pressed=false);input.poll();pad.buttons[2].pressed=true;pad.buttons[3].pressed=true;state=input.poll();assert.equal(state.light,true);assert.equal(state.fast,true);state=input.poll();assert.equal(state.light,false);assert.equal(state.fast,false);
console.log('Controller close/menu edges survive modal blocking; speed/light toggles are edge-triggered.');

pad.axes[0]=.8;state=input.poll(true);assert.equal(state.strafe,0);assert(state.uiX>.7,"Panel navigation retains the left stick while world movement is blocked");

pad.axes=[-.004,-.004,-.23,-1];input.poll();assert(input.calibrate());state=input.poll();assert.equal(state.lookX,0);assert.equal(state.lookY,0);assert.equal(Math.abs(state.forward),0);pad.axes[2]=.7;assert(input.poll().lookX>.5);pads=[];input.poll();assert.equal(input.calibrate(),false);
console.log('Explicit neutral calibration clears resting axis drift; intentional movement remains available.');
