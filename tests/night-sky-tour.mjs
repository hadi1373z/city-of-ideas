import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CONSTELLATION_GUIDES as GUIDES,NIGHT_SKY_DEFAULTS,equatorialToHorizontal,horizontalVector} from '../src/night-sky-model.js';
import {CONSTELLATION_TOUR as TOUR,constellationCandidates,constellationDirection,constellationName,nextConstellation,tickConstellationTour} from '../src/constellation-tour-model.js';
const stars=JSON.parse(await readFile(new URL('../src/night-sky-catalogue.json',import.meta.url))).stars,byHip=new Map(stars.map(s=>[s.hip,s]));
const direction=utc=>hip=>horizontalVector(equatorialToHorizontal(byHip.get(hip),{utc}));
const current=direction(NIGHT_SKY_DEFAULTS.utc),eligible=constellationCandidates(GUIDES,current);
assert.deepEqual(eligible.map(g=>g.id),['orion','cassiopeia','ursa-major','cygnus']);
let id='cassiopeia';const visited=new Set();for(let i=0;i<4;i++){id=nextConstellation(eligible,id).id;visited.add(id);}assert.equal(visited.size,4);assert.equal(id,'cassiopeia');
assert.equal(nextConstellation([],id),null);assert.equal(nextConstellation([eligible[0]],'unknown'),eligible[0]);
for(const utc of new Set(GUIDES.map(g=>g.chartUTC))){const d=direction(utc);for(const g of constellationCandidates(GUIDES,d)){assert(d(g.focusHip).y>Math.sin(5*Math.PI/180));assert(g.hips.filter(hip=>d(hip).y>0).length>=3);assert(g.edges.filter(([a,b])=>d(a).y>0&&d(b).y>0).length>=2);}}
assert.equal(constellationCandidates(GUIDES,()=>({x:0,y:-1,z:0})).length,0);
assert.equal(constellationName(GUIDES[2]),'Big Dipper · Ursa Major');
const sample={hips:[1]};for(const [v,word]of[[{x:1,y:.5,z:0},'east'],[{x:0,y:.5,z:1},'south'],[{x:0,y:.5,z:-1},'north'],[{x:-1,y:.5,z:0},'west']])assert(constellationDirection(sample,()=>v).startsWith(word));
assert.equal(constellationDirection(sample,()=>({x:0,y:1,z:0})),'Almost overhead');assert(constellationDirection(sample,()=>({x:0,y:-1,z:0})).includes('horizon'));
let state={elapsed:0,fadeIn:false},advances=0,sawFade=false;
for(let i=0;i<TOUR.seconds*4;i++){state=tickConstellationTour(state,.25);if(state.opacity<1)sawFade=true;if(state.advance)advances++;assert(state.opacity>=0&&state.opacity<=1);}
assert.equal(advances,1);assert(sawFade);assert.equal(state.elapsed,0);assert.equal(state.opacity,0);
state=tickConstellationTour(state,.6);assert(Math.abs(state.opacity-.5)<1e-9);
state=tickConstellationTour(state,1,{playing:false});assert.equal(state.opacity,1);assert(!state.advance);assert.equal(state.elapsed,0,'Pausing restores a fully visible pattern');
for(const options of[{active:false},{playing:false},{reducedMotion:true}]){const frozen=tickConstellationTour({elapsed:9,fadeIn:false},1000,options);assert.equal(frozen.elapsed,9);assert.equal(frozen.opacity,1);assert(!frozen.advance);}
assert.equal(tickConstellationTour({elapsed:9},1000).elapsed,9,'A suspended device cannot skip many figures');
assert.equal(tickConstellationTour({elapsed:9},-1).elapsed,9);
console.log('PASS constellation sequence: four real default figures, horizon-safe seasonal eligibility, complete distinct cycle, fixed direction cues, 24-second dwell/fades, full-opacity pause, reduced-motion hold and no suspended-device catch-up.');
