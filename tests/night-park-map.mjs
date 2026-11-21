import assert from 'node:assert/strict';
import {nightParkMapSvg,mountNightParkMap} from '../src/night-park-map.js';
import {NIGHT_PARK,NIGHT_PARK_LAWNS,NIGHT_PARK_LANTERNS,NIGHT_PARK_APPROACH} from '../src/night-park-model.js';
import {NIGHT_HOME_PARCELS} from '../src/night-home-layout.js';
import {COAST_LANDMARKS,COAST_EXPLORER_COPY} from '../src/coastal-map-data.js';
for(const lang of ['fa','en','de']){
 const svg=nightParkMapSvg(lang);assert(!svg.includes('NaN'));
 assert.equal((svg.match(/data-park-lantern=/g)||[]).length,NIGHT_PARK_LANTERNS.length);
 assert.equal((svg.match(/data-home-parcel=/g)||[]).length,NIGHT_HOME_PARCELS.length);
 assert(svg.includes('points="'+NIGHT_PARK_APPROACH.points.map(([x,z])=>[460+x*.7,460+z*.7].join(',')).join(' ')+'"'));
 for(const p of NIGHT_PARK_LAWNS)assert(svg.includes(p.map(([x,z])=>[460+x*.7,460+z*.7].join(',')).join(' ')));
 if(lang==='fa')assert(svg.includes('پارک ایده‌ها'));
}
const pin=COAST_LANDMARKS.find(p=>p.id==='park');assert.equal(pin.face,'lower');assert.deepEqual(pin.point,[NIGHT_PARK.localX,NIGHT_PARK.localZ]);assert(COAST_EXPLORER_COPY.fa.landmarks.park.description.includes('دنیای شب'));
class Element{constructor(tag){this.tagName=tag;this.children=[];this.style={};}append(...nodes){this.children.push(...nodes);}}
const old=globalThis.document;globalThis.document={createElement:t=>new Element(t)};
try{const calls=[],container=new Element('div'),section=mountNightParkMap(container,{language:'fa',onVisit:id=>calls.push(id)});assert.equal(section.dir,'rtl');assert.equal(container.children[0],section);section.children.at(-1).onclick();assert.deepEqual(calls,['park']);}finally{if(old)globalThis.document=old;else delete globalThis.document;}
console.log('PASS night park map: exact lower-local lawns, approach, all lanterns/home centres, Persian names and explicit visit action');
