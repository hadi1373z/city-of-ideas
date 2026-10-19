import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {starter} from '../src/city-source-assets/home-tools/model.js';
import {buildInterior} from '../src/city-source-assets/home-tools/residence-interior-v1.js';
import {isStoryDeskBook,validStory,storyValues,STORY_TEXT} from '../src/discovery-story.js';
const h=starter(),r=h.rooms.find(r=>r.id==='math'),built=buildInterior(h,r,T);
const reading=built.interactions.filter(d=>isStoryDeskBook(d,built.group));
assert.equal(reading.length,1,'Exactly the study desk reading book starts the story');
assert(!isStoryDeskBook({...reading[0],extraHomeId:'another-house'},built.group));
assert(!isStoryDeskBook({...reading[0],roomId:'connections'},built.group));
assert(!isStoryDeskBook({...reading[0],homeAction:'journal'},built.group));
assert(!isStoryDeskBook({...reading[0],bookInstanceId:'another-book'},built.group));
for(const lang of ['en','de','fa']){const w=STORY_TEXT[lang];assert(w.opening&&w.source&&w.failed);assert.equal(storyValues({answers:[1,0,1,0,1]},w).length,5);assert.equal(w.responses.length,2);}
assert(validStory({version:1,step:0,answers:[],note:''}));
assert(validStory({version:1,step:8,answers:[0,1,0,1,1],note:'A preserved reflection — یادداشت'}));
for(const s of [{version:1,step:8,answers:[],note:''},{version:1,step:99,answers:[],note:''},{version:1,step:2,answers:[7],note:''},{version:1,step:0,answers:[],note:'x'.repeat(2001)}])assert(!validStory(s));
built.group.traverse(o=>o.geometry?.dispose());
console.log('PASS: one genuine desk-book entry; unrelated books/journals/homes excluded; complete EN/DE/FA reflections and invalid-save rejection.');
