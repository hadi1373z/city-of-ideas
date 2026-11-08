// Bounded teaching simulations. No evaluated code, remote service or arbitrary program runner.
export const LIFE_W=24,LIFE_H=16,CA_W=61,LAB_KEY='city-of-ideas:computation-lab:v1';
export const PATTERNS={Block:[[0,0],[1,0],[0,1],[1,1]],Blinker:[[0,0],[1,0],[2,0]],Glider:[[1,0],[2,1],[0,2],[1,2],[2,2]],'R-pentomino':[[1,0],[2,0],[0,1],[1,1],[1,2]]};
export function lifeSeed(name='Glider',boundary='dead'){
 const cells=Array(LIFE_W*LIFE_H).fill(0);for(const[x,y]of PATTERNS[name]||PATTERNS.Glider)cells[(y+6)*LIFE_W+x+10]=1;
 return {cells,seed:[...cells],generation:0,boundary,history:[],period:null};
}
export function lifeNext(cells,w=LIFE_W,h=LIFE_H,boundary='dead'){
 return cells.map((_,k)=>lifeCell(cells,k,w,h,boundary).next);
}
export function lifeCell(cells,k,w=LIFE_W,h=LIFE_H,boundary='dead'){const x=k%w,y=Math.floor(k/w);let neighbours=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;let xx=x+dx,yy=y+dy;if(boundary==='wrap'){xx=(xx+w)%w;yy=(yy+h)%h;}if(xx>=0&&xx<w&&yy>=0&&yy<h)neighbours+=cells[yy*w+xx];}return {alive:cells[k],neighbours,next:Number(neighbours===3||!!cells[k]&&neighbours===2)};}
export function stepLife(s){const key=s.cells.join(''),history=[...s.history,{key,at:s.generation}].slice(-128),cells=lifeNext(s.cells,LIFE_W,LIFE_H,s.boundary),generation=s.generation+1,previous=history.findLast(p=>p.key===cells.join(''));return {...s,cells,generation,history,period:previous?generation-previous.at:null};}
export function editLife(s,index){if(!Number.isInteger(index)||index<0||index>=LIFE_W*LIFE_H)return s;const cells=[...s.cells];cells[index]=1-cells[index];return {...s,cells,seed:[...cells],generation:0,history:[],period:null};}
export function caNext(row,rule,boundary='dead'){
 return row.map((_,i)=>{const read=j=>boundary==='wrap'?row[(j+row.length)%row.length]:row[j]||0;return rule>>(4*read(i-1)+2*read(i)+read(i+1))&1;});
}
export function caSeed(rule=90,input='1',boundary='dead'){const seed=Array(CA_W).fill(0),offset=Math.floor((CA_W-input.length)/2);for(let i=0;i<input.length;i++)seed[offset+i]=Number(input[i]);return {rule,input,seed,rows:[[...seed]],generation:0,boundary};}
export function stepCA(s){return {...s,rows:[...s.rows,caNext(s.rows.at(-1),s.rule,s.boundary)].slice(-41),generation:s.generation+1};}
export const TAPE_PROGRAMS={
 unary:{name:'Unary increment',input:'111',transitions:[['scan','1','1',1,'scan'],['scan','_','1',0,'halt']]},
 binary:{name:'Binary increment',input:'111',transitions:[['scan','0','0',1,'scan'],['scan','1','1',1,'scan'],['scan','_','_',-1,'carry'],['carry','1','0',-1,'carry'],['carry','0','1',0,'halt'],['carry','_','1',0,'halt']]}
};
export function tapeSeed(program='unary',input=TAPE_PROGRAMS[program].input){return {program,input,tape:Object.fromEntries([...input].map((c,i)=>[i,c])),head:0,state:'scan',steps:0,halted:false,trace:[]};}
export function stepTape(s){
 if(s.halted||s.steps>=4096)return s;const read=s.tape[s.head]||'_',rule=TAPE_PROGRAMS[s.program].transitions.find(r=>r[0]===s.state&&r[1]===read);if(!rule)return s;
 const tape={...s.tape};if(rule[2]==='_')delete tape[s.head];else tape[s.head]=rule[2];
 const event={head:s.head,state:s.state,read,write:rule[2],move:rule[3],next:rule[4]};return {...s,tape,head:s.head+rule[3],state:rule[4],steps:s.steps+1,halted:rule[4]==='halt',trace:[...s.trace,event].slice(-16)};
}
export function newLab(){return {active:'life',life:lifeSeed(),ca:caSeed(),tape:tapeSeed(),notes:{}};}
export function labMemory(storage){
 let state=newLab(),saved=!!storage;const binary=(a,n)=>Array.isArray(a)&&a.length===n&&a.every(x=>x===0||x===1),bounded=n=>Number.isInteger(n)&&n>=0&&n<=1000000;
 try{const raw=JSON.parse(storage?.getItem(LAB_KEY)||'null'),s=raw?.version===1&&raw.state;if(s){if(['life','ca','tape'].includes(s.active))state.active=s.active;
  const l=s.life;if(l&&binary(l.cells,LIFE_W*LIFE_H)&&binary(l.seed,LIFE_W*LIFE_H)&&bounded(l.generation)&&['dead','wrap'].includes(l.boundary))state.life={...state.life,cells:l.cells,seed:l.seed,generation:l.generation,boundary:l.boundary};
  const c=s.ca;if(c&&Number.isInteger(c.rule)&&c.rule>=0&&c.rule<=255&&/^[01]{1,61}$/.test(c.input)&&binary(c.seed,CA_W)&&Array.isArray(c.rows)&&c.rows.length>0&&c.rows.length<=41&&c.rows.every(r=>binary(r,CA_W))&&bounded(c.generation)&&['dead','wrap'].includes(c.boundary))state.ca={rule:c.rule,input:c.input,seed:c.seed,rows:c.rows,generation:c.generation,boundary:c.boundary};
  const t=s.tape;if(t&&Object.hasOwn(TAPE_PROGRAMS,t.program)&&typeof t.input==='string'&&(t.program==='unary'?/^1{0,24}$/:/^[01]{1,24}$/).test(t.input)&&Number.isInteger(t.head)&&Math.abs(t.head)<=4096&&Number.isInteger(t.steps)&&t.steps>=0&&t.steps<=4096&&['scan','carry','halt'].includes(t.state)&&(t.program==='binary'||t.state!=='carry')&&typeof t.halted==='boolean'&&t.halted===(t.state==='halt')&&t.tape&&typeof t.tape==='object'&&!Array.isArray(t.tape)&&Object.keys(t.tape).length<=96&&Object.entries(t.tape).every(([k,v])=>String(Number(k))===k&&Math.abs(Number(k))<=4096&&['0','1'].includes(v)))state.tape={...tapeSeed(t.program,t.input),tape:t.tape,head:t.head,state:t.state,steps:t.steps,halted:t.halted};
  for(const id of['life','ca','tape'])if(typeof s.notes?.[id]==='string')state.notes[id]=s.notes[id].slice(0,3000);
 }}catch{}
 return {state,get saved(){return saved;},save(){try{if(!storage)throw Error();const life={...state.life,history:[],period:null};storage.setItem(LAB_KEY,JSON.stringify({version:1,state:{...state,life}}));saved=true;}catch{saved=false;}return saved;}};
}
