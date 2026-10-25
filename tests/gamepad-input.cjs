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

// Music is reachable even when an open panel blocks movement; L2 has no language action.
pads=[pad];pad.axes=[0,0,0,0];pad.buttons.forEach(b=>b.pressed=false);input.poll(true);pad.buttons[7].pressed=true;assert.equal(input.poll(true).music,true);assert.equal(input.poll(true).music,false);pad.buttons[7].pressed=false;pad.buttons[6].pressed=true;const l2=input.poll();assert.equal(l2.music,false);assert.equal(l2.confirm,false);assert.equal(l2.menu,false);

// L1 / LB takes one photo per press, including while menus block walking.
pad.buttons.forEach(b=>b.pressed=false);pad.axes=[0,0,0,0];input.poll(true);pad.buttons[4].pressed=true;state=input.poll(true);assert.equal(state.photo,true);assert.equal(state.scroll,0);assert.equal(input.poll(true).photo,false);pad.buttons[4].pressed=false;input.poll(true);pad.buttons[5].pressed=true;state=input.poll(true);assert.equal(state.scroll,1);assert.equal(state.photo,false);pad.axes[3]=-.8;state=input.poll(true);assert.ok(state.uiLookY<-.7);assert.equal(state.lookY,0);
vm.runInNewContext(fs.readFileSync('src/scene-photo.js','utf8'),{window});let photos=0;const capture=window.createCityPhotoCapture({save(){photos++;}}),canvas={width:100,height:50,toBlob(fn){fn({type:'image/png'});}};pad.buttons.forEach(b=>b.pressed=false);input.poll();pad.buttons[4].pressed=true;for(let i=0;i<4;i++){if(input.poll().photo)capture.request();capture.afterRender(canvas);}assert.equal(photos,1);pad.buttons[4].pressed=false;input.poll();pad.buttons[4].pressed=true;if(input.poll(true).photo)capture.request();capture.afterRender(canvas);assert.equal(photos,2);pads=[];state=input.poll();assert.equal(state.photo,false);assert.equal(state.uiLookY,0);console.log('L1 takes first-person photos without scrolling or repeats; R1 and right-stick panel scrolling remain available.');
