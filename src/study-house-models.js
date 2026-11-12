export const colour=i=>(Math.floor(i/4)+i%4)%2;
export const adjacent=(a,b)=>Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1;
export function neighbours(board,selection){return board.filter(i=>selection.some(j=>adjacent(i,j)));}
export function matching(board){
 const left=board.filter(i=>colour(i)===0),pairs=new Map();
 function augment(a,seen){for(const b of board.filter(b=>colour(b)===1&&adjacent(a,b))){if(seen.has(b))continue;seen.add(b);if(!pairs.has(b)||augment(pairs.get(b),seen)){pairs.set(b,a);return true;}}return false;}
 for(const a of left)augment(a,new Set());return Array.from(pairs,([b,a])=>[a,b]);
}
export function hallWitness(board){const left=board.filter(i=>colour(i)===0);for(let mask=1;mask<1<<left.length;mask++){const s=left.filter((_,i)=>mask&1<<i);if(neighbours(board,s).length<s.length)return s;}return[];}
export const BOARDS=[
 {id:'corners',label:'Opposite corners removed',cells:Array.from({length:16},(_,i)=>i).filter(i=>i!==0&&i!==15)},
 {id:'bottleneck',label:'Equal colours, hidden bottleneck',cells:[0,1,3,5,6,7,8,9,11,13]},
 {id:'control',label:'A tileable control',cells:Array.from({length:16},(_,i)=>i).filter(i=>i!==0&&i!==1)}
];
export function bayes(prior=.01,sensitivity=.9,falsePositive=.05,repeats=1,independent=true){
 if(![prior,sensitivity,falsePositive].every(n=>Number.isFinite(n)&&n>0&&n<1)||!Number.isInteger(repeats)||repeats<1||repeats>8)throw Error('Use probabilities strictly between zero and one and 1–8 observations.');
 const n=independent?repeats:1,hit=10000*prior*sensitivity**n,falseAlarm=10000*(1-prior)*falsePositive**n,odds=prior/(1-prior)*(sensitivity/falsePositive)**n;
 return{hit,falseAlarm,posterior:hit/(hit+falseAlarm),odds,likelihoodRatio:(sensitivity/falsePositive)**n,logOdds:Math.log(odds)};
}
export function startMachine(kind='countdown'){if(!['countdown','cycle','long'].includes(kind))throw Error('Unknown teaching machine');return{kind,counter:kind==='countdown'?5:kind==='long'?1000:0,steps:0,halted:false,repeated:false,trace:[]};}
export function stepMachine(machine,count=1){
 const s=structuredClone(machine),n=Math.max(0,Math.min(128,Number.isInteger(count)?count:0));
 for(let i=0;i<n&&!s.halted&&!s.repeated;i++){const before=s.counter;if(s.kind==='cycle')s.counter=1-s.counter;else if(s.counter>0)s.counter--;else s.halted=true;s.steps++;s.trace.push(before);if(s.kind==='cycle'&&s.trace.includes(s.counter))s.repeated=true;s.trace=s.trace.slice(-64);}
 return s;
}
export const diagonal=prediction=>prediction==='halts'?{action:'loop forever',contradiction:'H says D(D) halts; D deliberately loops.'}:{action:'halt immediately',contradiction:'H says D(D) does not halt; D immediately halts.'};
export const STUDY_KEY='city-of-ideas:advanced-houses:v1';
export function studyMemory(storage){
 let entries={},saved=!!storage;try{const s=JSON.parse(storage?.getItem(STUDY_KEY)||'null');if(s?.version===1)for(const id of['proof','uncertainty','computation']){const e=s.entries?.[id];if(e)entries[id]={prediction:typeof e.prediction==='string'?e.prediction.slice(0,1200):'',reason:typeof e.reason==='string'?e.reason.slice(0,1200):'',checks:Array.isArray(e.checks)?[...new Set(e.checks.filter(k=>['witness','transfer','bayes','dependence','trace','diagonal'].includes(k)))]:[]};}}catch{}
 const entry=id=>entries[id]||{prediction:'',reason:'',checks:[]},persist=()=>{try{storage.setItem(STUDY_KEY,JSON.stringify({version:1,entries}));saved=true;}catch{saved=false;}};
 return{get saved(){return saved;},get state(){return structuredClone(entries);},get: id=>structuredClone(entry(id)),predict(id,text){if(!['proof','uncertainty','computation'].includes(id)||entry(id).prediction||!text.trim())return false;entries[id]={...entry(id),prediction:text.trim().slice(0,1200)};persist();return true;},check(id,key){if(!['proof','uncertainty','computation'].includes(id)||!['witness','transfer','bayes','dependence','trace','diagonal'].includes(key))return;entries[id]={...entry(id),checks:[...new Set([...entry(id).checks,key])]};persist();},reflect(id,text){if(!['proof','uncertainty','computation'].includes(id)||!text.trim())return false;entries[id]={...entry(id),reason:text.trim().slice(0,1200)};persist();return true;}};
}
