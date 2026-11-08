// Exact, bounded teaching models. Display state is reconstructed from small saved inputs.
export const INVESTIGATION_KEY='city-of-ideas:house-investigations:v1';
export const SEQUENCES={Squares:[0,1,4,9],Cubes:[0,1,8,27],'Triangular numbers':[0,1,3,6],'Four powers of two':[1,2,4,8]};
export function grammarTree(n){return n?{label:'S',children:[{label:'a'},grammarTree(n-1),{label:'b'}]}:{label:'S',children:[{label:'ε'}]};}
export function startScan(input='aabb'){return {input,cursor:0,stack:0,phase:'push',status:'ready',steps:0,trace:[]};}
export function scanStep(s){
 if(['accepted','rejected'].includes(s.status))return s;
 let {cursor,stack,phase}=s,status='reading',message;
 if(cursor===s.input.length){status=stack===0?'accepted':'rejected';message=stack===0?'End of input and empty stack: accept.':'End of input, but '+stack+' unmatched a symbols remain: reject.';}
 else{const c=s.input[cursor];if(c==='a'&&phase==='push'){stack++;message='Read a: push A.';}else if(c==='b'&&stack>0){stack--;phase='pop';message='Read b: pop A.';}else{status='rejected';message=c==='a'?'An a after the b phase cannot be generated: reject.':'No matching A for this b: reject.';}cursor++;}
 return {...s,cursor,stack,phase,status,steps:s.steps+1,trace:[...s.trace,message+' Stack height '+stack+'.']};
}
export function expressionTrees(raw,precedence=false){
 const text=String(raw).replace(/\s/g,'').replaceAll('×','*');if(!/^\d(?:[+*]\d){0,5}$/.test(text))return {error:'Use one to six single digits joined by + or *, for example 1+2*3.',trees:[]};
 const leaf=n=>({label:n,value:Number(n)}),join=(op,a,b)=>({label:op,children:[a,b],value:op==='+'?a.value+b.value:a.value*b.value});
 if(precedence){let pos=0;const factor=()=>leaf(text[pos++]),term=()=>{let a=factor();while(text[pos]==='*'){pos++;a=join('*',a,factor());}return a;};let a=term();while(pos<text.length){pos++;a=join('+',a,term());}return {text,trees:[a]};}
 function parse(lo,hi){if(lo===hi)return[leaf(text[lo])];const out=[];for(let i=lo+1;i<hi;i+=2)for(const a of parse(lo,i-1))for(const b of parse(i+1,hi))out.push(join(text[i],a,b));return out;}
 return {text,trees:parse(0,text.length-1)};
}
export function treeFormula(tree){return tree.children?'('+treeFormula(tree.children[0])+' '+tree.label+' '+treeFormula(tree.children[1])+')':tree.label;}
export function layoutTree(tree){const nodes=[],edges=[];let leaves=0,depthMax=0;function walk(t,depth,parent=-1){const i=nodes.length;nodes.push({label:t.label,depth,x:0,y:0,leaf:!t.children});depthMax=Math.max(depthMax,depth);if(parent>=0)edges.push([parent,i]);if(t.children){const children=t.children.map(c=>walk(c,depth+1,i));nodes[i].x=children.reduce((s,j)=>s+nodes[j].x,0)/children.length;}else nodes[i].x=leaves++;return i;}walk(tree,0);for(const n of nodes){n.x=leaves>1?(n.x/(leaves-1)-.5)*7.5:0;n.y=n.leaf?.8:3.6-n.depth*2.6/Math.max(1,depthMax);}return {nodes,edges};}
export function differenceTable(samples){const rows=[[...samples]];while(rows.at(-1).length>1){const row=rows.at(-1);rows.push(row.slice(1).map((v,i)=>v-row[i]));}return rows;}
export function startEngine(samples=SEQUENCES.Squares){return {samples:[...samples],registers:differenceTable(samples).map(r=>r[0]),n:0,phase:0,additions:0,last:'No addition yet.',history:[{n:0,value:samples[0]}]};}
export function additionStep(s){if(s.n>=12)return s;const registers=[...s.registers],i=s.phase,a=registers[i],b=registers[i+1];registers[i]=a+b;const end=i===2,n=s.n+Number(end);return {...s,registers,n,phase:end?0:i+1,additions:s.additions+1,last:'D'+i+' ← '+a+' + '+b+' = '+registers[i],history:end?[...s.history,{n,value:registers[0]}]:s.history};}
export function crankRow(s){const target=s.n+1;for(let i=0;i<3&&s.n<target;i++)s=additionStep(s);return s;}
function binomial(n,k){let r=1;for(let j=1;j<=k;j++)r=r*(n-j+1)/j;return r;}
export function continuation(samples,n,k=0){const d=differenceTable(samples).map(r=>r[0]);return d.reduce((sum,v,i)=>sum+v*binomial(n,i),0)+k*n*(n-1)*(n-2)*(n-3);}
export function initialInvestigations(){return {active:'chomsky',chomsky:{mode:'recursion',n:2,scan:startScan(),expression:'1+2*3',precedence:false,parse:0},ada:{machine:startEngine(),k:0},notes:{},claims:{}};}
export function investigationMemory(storage){
 let state=initialInvestigations(),saved=!!storage;const bounded=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 try{const raw=JSON.parse(storage?.getItem(INVESTIGATION_KEY)||'null'),s=raw?.version===1&&raw.state;if(s){if(['chomsky','ada'].includes(s.active))state.active=s.active;const c=s.chomsky;if(c){if(['recursion','ambiguity'].includes(c.mode))state.chomsky.mode=c.mode;if(bounded(c.n,0,5))state.chomsky.n=c.n;if(typeof c.expression==='string'&&!expressionTrees(c.expression).error)state.chomsky.expression=c.expression;if(typeof c.precedence==='boolean')state.chomsky.precedence=c.precedence;const count=expressionTrees(state.chomsky.expression,state.chomsky.precedence).trees.length;if(bounded(c.parse,0,count-1))state.chomsky.parse=c.parse;if(typeof c.scan?.input==='string'&&/^[ab]{0,12}$/.test(c.scan.input)&&bounded(c.scan.steps,0,13)){state.chomsky.scan=startScan(c.scan.input);for(let i=0;i<c.scan.steps;i++)state.chomsky.scan=scanStep(state.chomsky.scan);}}
 const a=s.ada;if(a){if(bounded(a.k,-2,2))state.ada.k=a.k;const m=a.machine;if(Array.isArray(m?.samples)&&m.samples.length===4&&m.samples.every(v=>bounded(v,-99,99))&&bounded(m.additions,0,36)){state.ada.machine=startEngine(m.samples);for(let i=0;i<m.additions;i++)state.ada.machine=additionStep(state.ada.machine);}}
 for(const id of['chomsky','ada']){if(typeof s.notes?.[id]==='string')state.notes[id]=s.notes[id].slice(0,3000);const claim=s.claims?.[id];if(typeof claim?.text==='string'&&typeof claim.context==='string')state.claims[id]={text:claim.text.slice(0,1000),context:claim.context.slice(0,300)};}
 }}catch{}
 return {state,get saved(){return saved;},save(){try{if(!storage)throw Error();storage.setItem(INVESTIGATION_KEY,JSON.stringify({version:1,state}));saved=true;}catch{saved=false;}return saved;}};
}
