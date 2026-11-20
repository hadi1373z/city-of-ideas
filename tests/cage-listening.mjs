import assert from 'node:assert/strict';
import {chanceScore} from '../src/seminar-house-models.js';
import {arrangeListeningScore,listeningMeasure,compareListeningScores} from '../src/cage-listening-model.js';
import {CAGE_LISTENING} from '../src/cage-listening-copy.js';
// Exhaust the bounded seed domain; compare the actual multisets independently.
for(let seed=1;seed<=9999;seed++){
 const raw=chanceScore(seed),expected=[...raw].sort(),notes=raw.filter(n=>n>0),rests=raw.filter(n=>n===0).length;
 for(const arrangement of['chance','spread','cluster']){const score=arrangeListeningScore(seed,arrangement),m=listeningMeasure(score);assert.deepEqual([...score].sort(),expected);assert.deepEqual(score.filter(n=>n>0),notes);assert.equal(m.rests,rests);assert.equal(m.sounding,16-rests);assert.equal(m.seconds,4);assert.deepEqual(score,arrangeListeningScore(seed,arrangement));}
 const c=compareListeningScores(seed);assert.equal(c.cluster.maxRest,rests);assert(c.spread.maxRest<=rests);assert.equal(c.longerRest,c.spread.maxRest===rests?'equal':'cluster');
}
assert.throws(()=>arrangeListeningScore(0));assert.throws(()=>arrangeListeningScore(1,'invented'));assert.throws(()=>listeningMeasure([0,1]));assert.deepEqual(listeningMeasure(Array(16).fill(0)),{counts:[16,0,0,0],sounding:0,rests:16,maxRest:16,maxNote:0,seconds:4});
for(const lang of['de','fa','cs'])assert.deepEqual(Object.keys(CAGE_LISTENING[lang]).sort(),Object.keys(CAGE_LISTENING.en).sort());
// The actual existing UI suite below exercises native install and owned cleanup.
await import('./seminar-houses-ui.mjs');
console.log('PASS Cage listening: all 9999 seeds preserve event multisets, pitch order and duration; exact gap comparisons and four-language original prompts.');
