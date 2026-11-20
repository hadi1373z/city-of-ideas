import {chanceScore} from './seminar-house-models.js?v=city-night-20261117';
// Original teaching procedures, not a Cage composition or I Ching simulation.
// Both reorderings preserve every generated pitch and rest exactly.
export function arrangeListeningScore(seed=1,arrangement='chance'){
 const original=chanceScore(seed);if(!['chance','spread','cluster'].includes(arrangement))throw new RangeError('Unknown listening arrangement');
 if(arrangement==='chance')return original;
 const notes=original.filter(n=>n>0),rests=16-notes.length;if(arrangement==='cluster')return [...Array(rests).fill(0),...notes];
 let cursor=0;return Array.from({length:16},(_,i)=>Math.floor((i+1)*rests/16)>Math.floor(i*rests/16)?0:notes[cursor++]);
}
export function listeningMeasure(score){
 if(!Array.isArray(score)||score.length!==16||score.some(n=>!Number.isInteger(n)||n<0||n>3))throw new RangeError('Sixteen original events required');
 const counts=[0,0,0,0];let rest=0,note=0,maxRest=0,maxNote=0;for(const event of score){counts[event]++;rest=event===0?rest+1:0;note=event>0?note+1:0;maxRest=Math.max(maxRest,rest);maxNote=Math.max(maxNote,note);}return {counts,sounding:16-counts[0],rests:counts[0],maxRest,maxNote,seconds:4};
}
export function compareListeningScores(seed){const spread=listeningMeasure(arrangeListeningScore(seed,'spread')),cluster=listeningMeasure(arrangeListeningScore(seed,'cluster'));return {spread,cluster,longerRest:spread.maxRest===cluster.maxRest?'equal':spread.maxRest>cluster.maxRest?'spread':'cluster'};}
