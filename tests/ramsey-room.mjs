import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildNativeRamseyHouse} from '../src/ramsey-native-house.js';
import {buildCharacterStudyScene} from '../src/ramsey-room-scene.js';
import {createConversation} from '../src/ramsey-conversation.js';
const origin={x:-2400,y:.13,z:30},house=buildNativeRamseyHouse(T,origin);
const world=(x,z)=>[origin.x-x,origin.z-z];
for(let z=-5;z<=-2.3;z+=.04)for(const x of[-.65,0,.65])assert(house.canStand(...world(x,z)),'Continuous doorway corridor must remain clear');
assert(!house.inside(...world(0,-3.2)));assert(house.inside(...world(0,-2.9)));
for(const [x,z]of[[2,-3.08],[4.96,0],[0,3.5],[0,.35]])assert(!house.canStand(...world(x,z)),'Walls and table must be solid');
for(const s of house.study.seats)assert(!house.canStand(...world(s.x,s.z)),'Occupied chairs must remain solid');
// A visitor can walk round the table on either side, then back through the door.
for(const side of[-1,1])for(let z=-2.6;z<2;z+=.1)assert(house.canStand(...world(side*2.5,z)),'Side aisle obstructed');
const native=house.study.group,film=buildCharacterStudyScene(T).group;
assert(film.children.length>native.children.length,'City room must omit the fake garden backdrop');
house.group.updateMatrixWorld(true);const windowRay=new T.Raycaster(new T.Vector3(origin.x-.8,2.1,origin.z-3.3),new T.Vector3(0,0,-1));
assert.equal(windowRay.intersectObject(house.group,true).length,0,'Window must show the real city, not a backdrop');
const source=fs.readFileSync(new URL('../src/ramsey-room.js',import.meta.url),'utf8');
assert(!/iframe|showModal|location\.(?:href|assign)/.test(source),'Entry must not load another scene');
const update=source.slice(source.indexOf('M.city.update='),source.indexOf('function visit()'));
assert(!/M\.arrive|player\.[xyz]\s*=/.test(update),'Walking over the threshold must never teleport the player');
class Track{currentTime=0;paused=true;play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){}load(){}}
const tracks=[new Track(),new Track()],states=[];
const c=createConversation({tracks,cues:[{start:0,end:300,speaker:'ramsey'},{start:300,end:600,speaker:'turing'}],onChange:s=>states.push(s)});
await c.play();tracks[0].currentTime=42.5;c.update();assert.equal(c.state.time,42.5);c.pause();assert(!c.state.playing);assert(tracks.every(t=>t.paused));
await c.play();assert.equal(tracks[0].currentTime,42.5);c.seek(317);await Promise.resolve();assert.equal(c.state.index,1);assert.equal(tracks[1].currentTime,17);assert.equal(states.at(-1).cue.speaker,'turing');
c.pause();c.seek(299);await c.play();tracks[0].onended();await Promise.resolve();assert.equal(c.state.time,300);assert.equal(c.state.index,1);assert(c.state.playing);
tracks[1].onended();assert.equal(c.state.time,600);assert(!c.state.playing);await c.play();assert.equal(c.state.time,0);c.mute(true);assert(tracks.every(t=>t.muted));
c.dispose();assert(tracks.every(t=>t.paused&&t.onended===null));house.dispose();assert.equal(house.group.children.length,0);
console.log('PASS continuous native entrance, clear aisles, solid furniture, real window, pause/resume, seeking and two-part audio handoff');

const audioBase=new URL('../src/ramsey-film/assets/',import.meta.url);
const voiceCast=JSON.parse(fs.readFileSync(new URL('voice-cast.json',audioBase)));
const voiceKeys=new Set();
for(const [id,voice]of Object.entries(voiceCast.characters)){
 assert(!voiceKeys.has(voice.voiceKey));voiceKeys.add(voice.voiceKey);
 const bytes=fs.readFileSync(new URL(voice.reference.file,audioBase));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),voice.reference.sha256,'Do not overwrite a voice reference silently: '+id);
 assert(voice.reference.endSeconds>voice.reference.startSeconds);
 assert(voice.reference.transcript.length>10);
}
assert.equal(voiceKeys.size,6);
for(const name of ['index.html','film.html']){
 const html=fs.readFileSync(new URL('../src/ramsey-film/'+name,import.meta.url),'utf8');
 for(const part of[1,2])assert(html.includes('assets/conversation-'+part+'.mp3'),'Both players must share the same recordings');
 assert(!html.includes('data:audio/mpeg;base64,'),'No stale embedded voice recording');
 assert(html.includes('const speechAvailable=false;'),'Never silently switch to a different device voice');
}
console.log('PASS permanent cast references, six stable voice keys, shared player recordings and no device-voice fallback');
