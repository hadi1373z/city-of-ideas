import {ORIGAMI_LESSONS} from './origami-lessons.js?v=city-night-20261117';
import {FOLD_WORKBENCH_COPY} from './origami-fold-workbench-copy.js?v=cloister-details-20261120';

// Visit-local construction controls. Only the existing notebook explicitly saves.
export function createFoldWorkbenchControls({model,language,el,button,rerender,reduced=()=>false}){
 const state={lessonId:'dog',step:0,progress:0,yaw:0};let playing=false,direction=1,nodes=null;
 const words=()=>FOLD_WORKBENCH_COPY[language()]||FOLD_WORKBENCH_COPY.en;
 const lesson=()=>ORIGAMI_LESSONS.find(l=>l.id===state.lessonId);
 const motion=()=>!!(lesson().steps[state.step].fold||lesson().steps[state.step].crease);
 const pick=a=>a[language()==='fa'?0:language()==='de'?2:1]||a[1];
 function sync(){
  model.set({...state});if(!nodes)return;const c=words();
  nodes.slider.value=String(Math.round(state.progress*100));nodes.value.textContent=c.progress+' · '+Math.round(state.progress*100)+'%';
  nodes.play.textContent=playing&&direction===1?c.pause:c.play;
  nodes.reverse.textContent=playing&&direction===-1?c.pause:c.reverse;
 }
 function stop(){playing=false;sync();}
 function start(sign){if(!motion()||reduced())return;if(playing&&direction===sign){stop();return;}direction=sign;if(sign===1&&state.progress>=1)state.progress=0;if(sign===-1&&state.progress<=0)state.progress=1;playing=true;sync();}
 function render(parent,{compact=false}={}){
  nodes=null;const controls=el('section');controls.className='fold-construction-controls';parent.append(controls);parent=controls;const c=words(),l=lesson(),step=l.steps[state.step],translated=c.instructions?.[l.id]?.[state.step];
  if(!compact)parent.append(el('h3',c.title),el('p',c.intro));const choices=el('nav');choices.setAttribute('aria-label',c.title);
  for(const id of['dog','cat']){const b=button(c[id],()=>{playing=false;Object.assign(state,{lessonId:id,step:0,progress:0,yaw:0});sync();rerender();});b.setAttribute('aria-pressed',String(id===state.lessonId));choices.append(b);}parent.append(choices);
  const stepTitle=c.step+' '+(state.step+1)+' / '+l.steps.length+' · '+(translated?.[0]||pick(step.title));if(compact){const instruction=el('details');instruction.append(el('summary',stepTitle),el('p',translated?.[1]||pick(step.text)));parent.append(instruction);}else parent.append(el('h4',stepTitle),el('p',translated?.[1]||pick(step.text)));
  const label=el('label'),value=el('span'),slider=el('input');slider.type='range';slider.min=0;slider.max=100;slider.step=1;slider.disabled=!motion();slider.setAttribute('aria-label',c.progress);slider.oninput=()=>{playing=false;state.progress=Math.max(0,Math.min(1,Number(slider.value)/100));sync();};label.append(value,slider);parent.append(label);
  const play=button(c.play,()=>start(1)),reverse=button(c.reverse,()=>start(-1));play.disabled=reverse.disabled=!motion()||reduced();parent.append(play,reverse);
  const previous=button(c.previous,()=>{playing=false;state.step=Math.max(0,state.step-1);state.progress=0;sync();rerender();}),next=button(c.next,()=>{playing=false;state.step=Math.min(l.steps.length-1,state.step+1);state.progress=0;sync();rerender();});previous.disabled=state.step===0;next.disabled=state.step===l.steps.length-1;parent.append(previous,next);
  parent.append(button(c.left,()=>{state.yaw-=Math.PI/8;sync();}),button(c.right,()=>{state.yaw+=Math.PI/8;sync();}),button(c.viewReset,()=>{state.yaw=0;sync();}));
  parent.append(el('small',reduced()?c.reduced:motion()?c.motion:c.stationary),button(c.reset,()=>{playing=false;Object.assign(state,{step:0,progress:0,yaw:0});sync();rerender();}));
  const source=el('a',c.source+' ↗');source.href=l.source;source.target='_blank';source.rel='noopener noreferrer';const scope=el('details');scope.append(el('summary',c.scopeTitle),el('p',c.scope));parent.append(source,scope);
  nodes={slider,value,play,reverse};sync();
 }
 function tick(dt,eligible){if(!eligible||reduced()){if(playing)stop();return;}if(!playing)return;state.progress=Math.max(0,Math.min(1,state.progress+direction*Math.min(.08,Math.max(0,dt))/3));if(state.progress===0||state.progress===1)playing=false;sync();}
 return{render,tick,stop,get state(){return{...state,playing};},dispose(){playing=false;nodes=null;}};
}
