import {buildNativeRamseyHouse} from './ramsey-native-house.js?v=proportion14b';
import {createConversation} from './ramsey-conversation.js';
import {RAMSEY_AUDIO_COPY} from './ramsey-house-copy.js';

const CAST=[['socrates','Socrates'],['nietzsche','Nietzsche'],['zarathustra','Zarathustra · زرتشت'],['anonymous','Anonymous'],['ramsey','Frank Ramsey'],['turing','Alan Turing']];
const scripts=new Map();
function loadScript(path){
 const url=new URL(path,import.meta.url).href;
 if(!scripts.has(url))scripts.set(url,new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=()=>{scripts.delete(url);script.remove();reject(new Error('Character assets could not be loaded.'));};document.head.append(script);}));
 return scripts.get(url);
}
export function installRamseyRoom(M,T=window.THREE){
 const previous=M.ramseyHouse,house=buildNativeRamseyHouse(T,previous.origin),actors=[];
 // Retire the temporary city's small stand-in interior and its collision boxes.
 const oldTargets=new Set(previous.targets);M.city.targets=M.city.targets.filter(t=>!oldTargets.has(t));M.city.buildingTargets=M.city.buildingTargets.filter(t=>t!==previous.group);
 previous.colliders.length=0;previous.dispose();M.scene.add(house.group);M.city.buildingTargets.push(house.group);
 let inside=false,near=false,ready=false,disposed=false,conversation=null,lastCue=null,musicWasPlaying=false,loading=null;
 const panel=document.createElement('section');panel.id='ramsey-conversation';panel.hidden=true;panel.setAttribute('aria-label','Conversation at Ramsey House');
 const title=document.createElement('strong'),caption=document.createElement('p'),controls=document.createElement('div'),play=document.createElement('button'),restart=document.createElement('button'),mute=document.createElement('button'),seek=document.createElement('input'),clock=document.createElement('span'),note=document.createElement('small');
 title.textContent='Ramsey House';caption.textContent='The conversation is getting ready…';play.textContent='Loading conversation…';play.disabled=true;restart.textContent='Restart';mute.textContent='Voice on';mute.setAttribute('aria-pressed','false');
 for(const b of [play,restart,mute])b.className='glass';
 caption.dir='ltr';caption.lang='en';clock.dir='ltr';seek.dir='ltr';seek.type='range';seek.min='0';seek.max='600';seek.step='.1';seek.value='0';seek.setAttribute('aria-label','Conversation time');seek.disabled=true;
 note.textContent='Red: acquainted / Blue: not acquainted / Gray dashes: unknown · E / A: start or pause · Keep walking to explore · Leaving pauses the conversation';controls.append(play,restart,mute,clock);panel.append(title,caption,controls,seek,note);document.body.append(panel);
 const a=()=>RAMSEY_AUDIO_COPY[window.CITY_I18N.lang]||RAMSEY_AUDIO_COPY.en;
 const format=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
 function updateCaption(state){caption.dir=state.cue?'ltr':panel.dir;caption.lang=state.cue?'en':panel.lang;play.textContent=state.playing?a().pause:state.time>=600?a().replay:state.time>0?a().resume:a().start;clock.textContent=format(state.time)+' / 10:00';if(document.activeElement!==seek)seek.value=String(state.time);if(state.cue!==lastCue){lastCue=state.cue;title.textContent=CAST.find(([id])=>id===state.cue?.speaker)?.[1]||'Ramsey House';caption.textContent=state.cue?.text||a().ready;}}
 function pause(){conversation?.pause();if(musicWasPlaying){document.querySelector('#music-toggle')?.click();musicWasPlaying=false;}}
 function toggle(){if(!inside||!ready)return;if(!conversation.state.playing){musicWasPlaying=document.querySelector('#music-toggle')?.getAttribute('aria-pressed')==='true';if(musicWasPlaying)document.querySelector('#music-toggle').click();}void conversation.toggle();}
 play.onclick=()=>ready?toggle():void load();restart.onclick=()=>{conversation?.pause();conversation?.seek(0);};seek.oninput=()=>conversation?.seek(seek.value);
 mute.onclick=()=>{const muted=mute.getAttribute('aria-pressed')!=='true';mute.setAttribute('aria-pressed',String(muted));mute.textContent=muted?a().voiceOff:a().voiceOn;conversation?.mute(muted);};
 const base=new URL('./ramsey-film/assets/',import.meta.url);
 async function load(){
  if(loading)return loading;
  play.disabled=true;
  loading=(async()=>{
   try{
    await loadScript('./ramsey-film/assets/legacy-actors.js?v=7');
    await loadScript('./ramsey-film/vendor/gltf-loader.js');
    await loadScript('./ramsey-film/assets/character-adapter.js?v=proportion14b');
    const response=await fetch(new URL('conversation.json',base));if(!response.ok)throw new Error('Conversation could not be loaded.');const data=await response.json();
    const loaded=await Promise.all(CAST.map(async([id,name])=>{
     const actor=id==='socrates'?window.buildSocratesGuide(T):id==='zarathustra'?window.buildLiteraryCharacter(T,id):window.academicActorFromGLTF(await new window.GLTFLoader().loadAsync(new URL(id+'.glb?v=proportion14b',base).href),id);
     return {id,name,actor};
    }));
    if(disposed){loaded.forEach(a=>a.actor.dispose());return;}
    for(const [i,a]of loaded.entries()){const seat=house.study.seats[i];a.actor.group.position.set(seat.x,0,seat.z);a.actor.group.rotation.y=seat.yaw;a.actor.group.traverse(o=>{o.userData.animated=true;});house.group.add(a.actor.group);a.actor.animate(0,{seated:true,reducedMotion:true});actors.push(a);}
    conversation=createConversation({tracks:[1,2].map(i=>new Audio(new URL('conversation-'+i+'.mp3?v=kokoro-1',base).href)),cues:data.cues,onChange:updateCaption,onError:()=>{caption.textContent=a().error;}});
    ready=true;play.disabled=false;seek.disabled=false;conversation.update();
   }catch(error){caption.textContent=error.message+' '+a().walk;play.textContent=a().retry;play.disabled=false;loading=null;}
  })();return loading;
 }
 // Load the detailed cast when approaching or visiting Ramsey House.
 const originalCanStand=M.city.canStand,originalRegion=M.city.region,originalUpdate=M.city.update;
 M.city.canStand=(x,z)=>house.canStand(x,z)&&originalCanStand(x,z);
 M.city.region=(x,z)=>house.inside(x,z)?{id:'ramsey-conversation',title:'Ramsey House · conversation',inside:true}:originalRegion(x,z);
 const join=document.querySelector('#ramsey-join');if(join)join.hidden=true;
 M.city.update=(player,time,mode)=>{
  originalUpdate(player,time,mode);
  house.group.visible=player.x<-1000;
  near=mode==='city'&&Math.hypot(player.x-house.origin.x,player.z-house.origin.z)<7;if(near&&!ready&&!loading)void load();
  const nowInside=mode==='city'&&house.inside(player.x,player.z);
  if(inside&&!nowInside)pause();inside=nowInside;
  panel.hidden=!inside||!!document.querySelector('dialog[open]');if(join)join.hidden=true;
  if(document.hidden||document.querySelector('dialog[open]')){if(conversation?.state.playing)pause();}
  conversation?.update();
  if(house.group.visible&&near){
   const state=conversation?.state;
   // The paper follows the recording even when paused or scrubbed. The second
   // argument selects the conversation presentation, not whether audio plays.
   house.study.acquaintanceMap.update(state?.time||0,!!state);
   for(const a of actors)a.actor.animate(state?.playing?state.time:time,{seated:true,talking:!!state?.playing&&lastCue?.speaker===a.id,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});
  }
 };
 function visit(){void load();document.querySelector('#welcome')?.setAttribute('hidden','');M.arrive(house.entry);M.pointToward(house.origin);}
 const link=document.querySelector('#ramsey-film-link');if(link){link.href='#ramsey-house';link.onclick=e=>{e.preventDefault();visit();};}
 const map=document.createElement('button');map.onclick=()=>{document.querySelector('#map-panel').hidden=true;visit();};document.querySelector('.map-directions')?.append(map);
 function locale(){const c=a();map.textContent=c.house;if(link)link.textContent=c.link;panel.lang=RAMSEY_AUDIO_COPY[window.CITY_I18N.lang]?window.CITY_I18N.lang:'en';panel.dir=panel.lang==='fa'?'rtl':'ltr';restart.textContent=c.restart;mute.textContent=mute.getAttribute('aria-pressed')==='true'?c.voiceOff:c.voiceOn;seek.setAttribute('aria-label',c.time);note.textContent=c.note+' · '+c.english;if(ready){const s=conversation.state;play.textContent=s.playing?c.pause:s.time>=600?c.replay:s.time>0?c.resume:c.start;caption.lang='en';caption.dir='ltr';}else{play.textContent=play.disabled?c.loading:c.retry;if(play.disabled){caption.textContent=c.gettingReady;caption.lang=panel.lang;caption.dir=panel.dir;}}}
 addEventListener('city-language',locale);locale();
 const api={house,actors,visit,toggle,pause,get inside(){return inside;},get near(){return near;},get ready(){return ready;},get state(){return conversation?.state;}};M.ramseyRoom=api;previous.attachReading?.(house);
 if(new URLSearchParams(location.search).get('arrival')==='ramsey')visit();
 addEventListener('pagehide',()=>{disposed=true;conversation?.dispose();actors.forEach(a=>a.actor.dispose());house.dispose();panel.remove();removeEventListener('city-language',locale);},{once:true});
 return api;
}
