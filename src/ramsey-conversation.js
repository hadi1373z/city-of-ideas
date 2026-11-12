// The audio clock drives captions and character gestures; leaving pauses it.
export function createConversation({tracks,cues,onChange=()=>{},onError=()=>{}}){
 let time=0,playing=false,index=0,disposed=false,generation=0;
 const emit=()=>onChange({time,playing,cue:cues.find(c=>time>=c.start&&time<c.end)||cues.at(-1)});
 function sample(){if(playing)time=Math.min(600,index*300+(Number(tracks[index].currentTime)||0));return time;}
 function pause(){sample();generation++;playing=false;tracks.forEach(a=>a.pause());emit();}
 async function play(){
  if(disposed)return;if(time>=600)time=0;
  tracks.forEach(a=>a.pause());index=time>=300?1:0;const audio=tracks[index],request=++generation;
  audio.currentTime=time-index*300;
  try{await audio.play();if(disposed||request!==generation)return;playing=true;emit();}catch(error){if(disposed||request!==generation)return;playing=false;onError(error);emit();}
 }
 function seek(value){const resume=playing;pause();time=Math.max(0,Math.min(600,Number(value)||0));emit();if(resume)void play();}
 tracks.forEach((audio,i)=>{audio.preload='metadata';audio.volume=.85;audio.onended=()=>{if(disposed||!playing||i!==index)return;playing=false;time=i===0?300:600;emit();if(i===0)void play();};audio.onerror=()=>{if(!disposed&&i===index){pause();onError(new Error('The recording could not be loaded. Try again.'));}};});
 return {play,pause,seek,toggle(){return playing?(pause(),Promise.resolve()):play();},update(){sample();emit();},mute(value){tracks.forEach(a=>a.muted=value);},get state(){return{time,playing,index};},dispose(){pause();disposed=true;for(const a of tracks){a.onended=a.onerror=null;a.removeAttribute?.('src');a.load?.();}}};
}
