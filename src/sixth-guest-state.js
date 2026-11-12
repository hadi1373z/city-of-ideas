// Original, local-only exploration activity. Trial colours are hypothetical;
// they never modify the gathering's recorded acquaintance relationships.
export const SIXTH_GUEST_KEY='city-of-ideas:sixth-guest:v1';
export const TRIAL_EDGES=Array.from({length:6},(_,a)=>Array.from({length:5-a},(_,b)=>[a,a+b+1])).flat();
export const fiveCycle=()=>TRIAL_EDGES.map(([a,b])=>b<5&&((b-a)===1||(a===0&&b===4))?0:1);
const colorsOK=a=>Array.isArray(a)&&a.length===15&&a.every(c=>c===0||c===1);
export function trialTriangles(colors,count=6){
 const found=[];for(let a=0;a<count-2;a++)for(let b=a+1;b<count-1;b++)for(let c=b+1;c<count;c++){
  const edges=[[a,b],[a,c],[b,c]].map(([x,y])=>TRIAL_EDGES.findIndex(e=>e[0]===x&&e[1]===y));
  if(edges.every(i=>colors[i]===colors[edges[0]]))found.push({vertices:[a,b,c],color:colors[edges[0]],edges});
 }return found;
}
const fresh=()=>({version:1,active:false,count:5,colors:Array(15).fill(0),clue:false,fiveExample:null,prediction:null,witness:null,conclusion:null,complete:false});
const choice=n=>Number.isInteger(n)&&n>=0&&n<3;
const witnessOK=w=>!!w&&colorsOK(w.colors)&&Array.isArray(w.vertices)&&w.vertices.length===3&&new Set(w.vertices).size===3&&w.vertices.every(n=>Number.isInteger(n)&&n>=0&&n<6)&&trialTriangles(w.colors).some(t=>t.color===w.color&&t.vertices.every(n=>w.vertices.includes(n)));
export function validSixthGuest(s){return !!s&&s.version===1&&typeof s.active==='boolean'&&[5,6].includes(s.count)&&colorsOK(s.colors)&&typeof s.clue==='boolean'&&typeof s.complete==='boolean'&&
 (s.fiveExample===null||colorsOK(s.fiveExample)&&trialTriangles(s.fiveExample,5).length===0)&&
 (s.count===5?s.prediction===null&&s.witness===null:choice(s.prediction)&&s.fiveExample!==null)&&
 (s.witness===null||witnessOK(s.witness))&&(s.complete?!!s.witness&&choice(s.conclusion)&&!s.active:s.conclusion===null);}
export function createSixthGuest(storage){
 let state=fresh(),saved=true;
 let raw;try{raw=storage.getItem(SIXTH_GUEST_KEY);}catch{saved=false;}
 try{const old=JSON.parse(raw);if(validSixthGuest(old))state=Object.fromEntries(Object.keys(state).map(k=>[k,structuredClone(old[k])]));}catch{}
 function persist(){try{storage.setItem(SIXTH_GUEST_KEY,JSON.stringify(state));saved=true;}catch{saved=false;}}
 const atTable=c=>c?.table===true;
 return{
  get state(){return structuredClone(state);},get saved(){return saved;},
  begin(){if(state.complete)return false;state.active=true;persist();return true;},
  pause(){state.active=false;persist();},
  readClue(c){if(c?.alcove!==true||state.clue)return false;state.clue=true;persist();return true;},
  applyClue(c){if(!atTable(c)||!state.clue||state.count!==5)return false;state.colors=fiveCycle();state.fiveExample=[...state.colors];persist();return true;},
  flip(index,c){if(!atTable(c)||!Number.isInteger(index)||!TRIAL_EDGES[index]||TRIAL_EDGES[index][1]>=state.count)return false;state.colors[index]=1-state.colors[index];if(state.count===5&&!trialTriangles(state.colors,5).length)state.fiveExample=[...state.colors];persist();return true;},
  admitSix(prediction,c){if(!atTable(c)||state.count!==5||!choice(prediction)||trialTriangles(state.colors,5).length)return false;state.fiveExample=[...state.colors];state.prediction=prediction;state.count=6;for(const [i,e]of TRIAL_EDGES.entries())if(e[1]===5)state.colors[i]=e[0]%2;persist();return true;},
  witness(vertices,c){if(!atTable(c)||state.count!==6||!Array.isArray(vertices)||vertices.length!==3||new Set(vertices).size!==3)return false;const t=trialTriangles(state.colors).find(t=>t.vertices.every(n=>vertices.includes(n)));if(!t)return false;if(!state.witness)state.witness={vertices:[...t.vertices],color:t.color,colors:[...state.colors]};persist();return true;},
  finish(conclusion,c){if(!state.witness||state.complete||c?.fountain!==true||!choice(conclusion))return false;state.conclusion=conclusion;state.complete=true;state.active=false;persist();return true;}
 };
}
