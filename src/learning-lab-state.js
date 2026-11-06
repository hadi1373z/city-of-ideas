export const LEARNING_KEY='city-of-ideas:learning-lab:v1';
export const RULE_CARDS=[{front:'A',back:'4',role:'p'},{front:'D',back:'7',role:'not-p'},{front:'4',back:'D',role:'q'},{front:'7',back:'A',role:'not-q'}];
export const TRANSFER_CARDS=[{role:'q',back:3},{role:'p',back:0},{role:'not-q',back:1},{role:'not-p',back:2}];
export const requiredMask=cards=>cards.reduce((mask,c,i)=>mask|(['p','not-q'].includes(c.role)?1<<i:0),0);
const mask=n=>Number.isInteger(n)&&n>=0&&n<16,note=s=>typeof s==='string'?s.slice(0,1200):'';
export function createLearningLab(storage){
 let state={version:1,step:0,first:0,revealed:0,transfer:0,practice:0,reason:'',complete:false},saved=!!storage;
 try{const v=JSON.parse(storage?.getItem(LEARNING_KEY)||'null');if(v?.version===1&&Number.isInteger(v.step)&&v.step>=0&&v.step<=5&&[v.first,v.revealed,v.transfer].every(mask)){
  state={...state,step:v.step,first:v.first,revealed:v.revealed,transfer:v.transfer,practice:mask(v.practice)?v.practice:0,reason:note(v.reason),complete:v.complete===true};
  if(state.step>=2&&!state.first)state.step=1;
  if(state.step>=3&&(state.revealed&9)!==9)state.step=2;
  if(state.step>=4&&state.transfer!==6)state.step=3;
  state.complete=state.step===5&&!!state.reason.trim();
  if(state.step<5||!state.reason.trim()){state.complete=false;if(state.step===5)state.step=4;}
 }}catch{}
 function persist(){try{if(!storage)throw Error();storage.setItem(LEARNING_KEY,JSON.stringify(state));saved=true;}catch{saved=false;}return saved;}
 function begin(){if(!state.step){state.step=1;persist();}return true;}
 function predict(value,{library=false}={}){if(state.step!==1||!library||!mask(value)||!value)return false;state.first=value;state.step=2;persist();return true;}
 function reveal(index,{workshop=false}={}){if(state.step<2||!workshop||!Number.isInteger(index)||index<0||index>3)return false;state.revealed|=1<<index;persist();return true;}
 function conclude(value,{workshop=false}={}){if(state.step!==2||!workshop||(state.revealed&9)!==9)return{ok:false,why:'observe'};if(value!==1)return{ok:false,why:'counterexample'};state.step=3;persist();return{ok:true};}
 function transfer(value,{dialogue=false}={}){if(state.step!==3||!dialogue||!mask(value))return{ok:false,why:'place'};if(value!==6)return{ok:false,why:(value&6)===6?'extra':'missing'};state.transfer=value;state.step=4;persist();return{ok:true};}
 function finish(reason,{dialogue=false}={}){if(state.step!==4||!dialogue||!note(reason).trim())return false;state.reason=note(reason).trim();state.step=5;state.complete=true;persist();return true;}
 function practice(value){if(!state.complete||!mask(value))return false;state.practice=value;persist();return value===12;}
 return{get state(){return structuredClone(state);},get saved(){return saved;},begin,predict,reveal,conclude,transfer,finish,practice};
}
