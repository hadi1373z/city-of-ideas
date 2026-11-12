import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {showRoomDialog} from '../src/room-workbench.js';
const calls=[],dialog={open:false,dataset:{},returnValue:'',show(){this.open=true;calls.push('show');},showModal(){this.open=true;calls.push('modal');},close(value=''){this.open=false;this.returnValue=value;calls.push('close:'+value);}};
showRoomDialog(dialog,true);assert.deepEqual(calls,['show']);showRoomDialog(dialog,true);assert.deepEqual(calls,['show']);showRoomDialog(dialog,false);assert.deepEqual(calls,['show','close:','modal']);assert.equal(dialog.dataset.roomPresentation,'reading');showRoomDialog(dialog,true);assert.deepEqual(calls,['show','close:','modal','close:','show']);
let listener,capture;const compact=[dialog,{...dialog,dataset:{workbench:'true'},close:dialog.close}];const document={querySelector(selector){assert.equal(selector,'.touch-pad');return{addEventListener(type,fn,useCapture){assert.equal(type,'pointerdown');listener=fn;capture=useCapture;}};},querySelectorAll(selector){assert.equal(selector,'dialog[open][data-workbench="true"]');return compact;}};
vm.runInNewContext(fs.readFileSync(new URL('../src/mobile-controls.js',import.meta.url),'utf8'),{document});assert.equal(capture,true);const before=calls.length;listener({target:{closest:()=>null}});assert.equal(calls.length,before);listener({target:{closest:s=>{assert.equal(s,'[data-move]');return{};}}});assert.equal(dialog.returnValue,'movement');assert(calls.slice(-2).every(x=>x==='close:movement'));assert(compact.every(x=>!x.open));
console.log('PASS mobile controls: compact/nonmodal and full-reading/modal transitions; arrow capture closes compact work before movement without closing ordinary readers.');
