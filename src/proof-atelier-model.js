// Small, exact teaching models. Edge a*n+b joins La to Rb.
export const SIZE=4;
export const TRAP=[0,4,9,10,14,15];
export const EXCHANGE=[0,1,4,9,10,14,15];
export const INITIAL_MATCHING=[0,9,14];
export const COSTS=[[1,2,9],[1,8,9],[9,1,2]];
export const COMPLETE=Array.from({length:16},(_,i)=>i);
export const PROOF_KEY='city-of-ideas:proof-atelier:v1';
const unique=a=>[...new Set(a)];
export function tilingStatus(board,tiles){const flat=tiles.flat(),valid=tiles.every(p=>p.length===2&&p.every(i=>board.includes(i))&&Math.abs(Math.floor(p[0]/4)-Math.floor(p[1]/4))+Math.abs(p[0]%4-p[1]%4)===1)&&unique(flat).length===flat.length;return {valid,complete:valid&&flat.length===board.length};}
export function neighborhood(edges,subset,n=4){return unique(edges.filter(e=>subset.includes(Math.floor(e/n))).map(e=>e%n)).sort((a,b)=>a-b);}
export function validMatching(edges,m,n=4){return unique(m).length===m.length&&m.every(e=>edges.includes(e))&&new Set(m.map(e=>Math.floor(e/n))).size===m.length&&new Set(m.map(e=>e%n)).size===m.length;}
// Compare a visitor-built matching with the ceiling proved by their chosen subset.
// No search for an optimum or strongest subset is performed here.
export function hallInsight(edges,subset,m=[],n=4){
 const near=neighborhood(edges,subset,n),shortage=Math.max(0,subset.length-near.length),upper=n-shortage,lower=validMatching(edges,m,n)?m.length:null;
 return {near,shortage,upper,lower,gap:lower===null?null:upper-lower,exact:lower!==null&&lower===upper};
}
export function maximumMatching(edges,n=4){
 const right=new Map();
 function augment(a,seen){for(const e of edges){if(Math.floor(e/n)!==a)continue;const b=e%n;if(seen.has(b))continue;seen.add(b);if(!right.has(b)||augment(right.get(b),seen)){right.set(b,a);return true;}}return false;}
 for(let a=0;a<n;a++)augment(a,new Set());
 return [...right].map(([b,a])=>a*n+b);
}
export function coverStatus(edges,cover,m=[],n=4){const uncovered=edges.filter(e=>!cover.includes(Math.floor(e/n))&&!cover.includes(n+e%n));return {uncovered,valid:!uncovered.length,optimal:!uncovered.length&&validMatching(edges,m,n)&&cover.length===m.length};}
export function alternatingReach(edges,m,n=4){
 const left=Array.from({length:n},(_,i)=>i).filter(a=>!m.some(e=>Math.floor(e/n)===a)),right=[];
 for(let i=0;i<left.length;i++){const a=left[i];for(const e of edges.filter(e=>Math.floor(e/n)===a&&!m.includes(e))){const b=e%n;if(right.includes(b))continue;right.push(b);const mate=m.find(e=>e%n===b);if(mate!==undefined&&!left.includes(Math.floor(mate/n)))left.push(Math.floor(mate/n));}}
 return {left,right,cover:[...Array.from({length:n},(_,i)=>i).filter(a=>!left.includes(a)),...right.map(b=>n+b)]};
}
export function pathStatus(edges,m,path,n=4){
 const fail=error=>({valid:false,complete:false,error});
 if(!validMatching(edges,m,n))return fail('Restore a legal matching before tracing an exchange.');
 if(!path.length)return {valid:true,complete:false};
 if(path.some(v=>!Number.isInteger(v)||v<0||v>=2*n)||unique(path).length!==path.length)return fail('Use each vertex at most once.');
 if(path[0]>=n||m.some(e=>Math.floor(e/n)===path[0]))return fail('Begin at an unmatched left vertex.');
 const used=[];
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i];if((a<n)===(b<n))return fail('Cross from left to right or right to left.');
  const edge=a<n?a*n+b-n:b*n+a-n;if(!edges.includes(edge))return fail('Those vertices are not joined by an available edge.');
  if(m.includes(edge)!==(i%2===0))return fail(i%2===0?'Return along a matched edge.':'Go forward along an unmatched edge.');used.push(edge);
 }
 const last=path.at(-1),complete=path.length>1&&last>=n&&!m.some(e=>e%n===last-n);
 return {valid:true,complete,edges:used,flipped:complete?[...m.filter(e=>!used.includes(e)),...used.filter(e=>!m.includes(e))]:m};
}
export function connected(edges,n=4){const seen=new Set([0]);let previous=-1;while(previous!==seen.size){previous=seen.size;for(const e of edges){const a=Math.floor(e/n),b=n+e%n;if(seen.has(a)||seen.has(b)){seen.add(a);seen.add(b);}}}return seen.size===2*n;}
export function assignmentCost(choice,costs=COSTS){if(choice.length!==costs.length||choice.some(j=>!Number.isInteger(j)||j<0||j>=costs.length)||unique(choice).length!==choice.length)return null;return choice.reduce((sum,j,i)=>sum+costs[i][j],0);}
export function priceStatus(choice,u,v,costs=COSTS){
 const cost=assignmentCost(choice,costs),finite=u.length===costs.length&&v.length===costs.length&&[...u,...v].every(x=>Number.isFinite(x)&&Math.abs(x)<=20);
 const violations=finite?costs.flatMap((row,i)=>row.flatMap((c,j)=>u[i]+v[j]>c+1e-9?[i*costs.length+j]:[])):[];
 const bound=finite?[...u,...v].reduce((a,b)=>a+b,0):null,feasible=finite&&!violations.length;
 return {cost,bound,violations,feasible,gap:cost!==null&&feasible?cost-bound:null,optimal:cost!==null&&feasible&&Math.abs(cost-bound)<1e-9};
}
// Explain the certificate without solving the visitor's assignment for them.
export function priceInsight(choice,u,v,costs=COSTS){
 const result=priceStatus(choice,u,v,costs),n=costs.length;
 const cells=costs.flatMap((row,i)=>row.map((cost,j)=>({i,j,cost,price:result.bound===null?null:u[i]+v[j],slack:result.bound===null?null:cost-u[i]-v[j],selected:choice[i]===j})));
 const missing=Array.from({length:n},(_,i)=>i).filter(i=>!Number.isInteger(choice[i])||choice[i]<0||choice[i]>=n),repeated=Array.from({length:n},(_,j)=>j).filter(j=>choice.filter(v=>v===j).length>1);
 const terms=result.cost===null||result.bound===null?null:cells.filter(c=>c.selected).map(c=>c.slack);
 let shortage=null;
 if(result.feasible){const tight=cells.filter(c=>Math.abs(c.slack)<1e-9);for(let mask=1;mask<(1<<n);mask++){const rows=Array.from({length:n},(_,i)=>i).filter(i=>mask&(1<<i)),columns=unique(tight.filter(c=>rows.includes(c.i)).map(c=>c.j));if(rows.length>columns.length){shortage={rows,columns};break;}}}
 return {...result,cells,missing,repeated,terms,shortage};
}
export function capstoneStatus(s){const edges=s.capEdges,near=neighborhood(edges,s.capS),m=s.capM,cover=coverStatus(edges,s.capCover,m);return {edges:edges.length,connected:connected(edges),shortage:s.capS.length>near.length,near,matching:validMatching(edges,m),cover,valid:edges.length===7&&connected(edges)&&s.capS.length>near.length&&m.length===3&&cover.optimal};}
export function initialWorkshop(){return {active:0,lastWorkbench:0,board:0,tiling:[],repairEdges:[...TRAP],subset:[],hallMatching:[],exchange:[...INITIAL_MATCHING],path:[],cover:[],assignment:[-1,-1,-1],u:[0,0,0],v:[0,0,0],capEdges:[...COMPLETE],capS:[],capM:[],capCover:[],capstoneRecord:null,notes:{},checks:{},hints:{},revealed:[]};}
export function workshopMemory(storage){
 let saved=true,state=initialWorkshop();
 const ints=(a,max,length=32)=>Array.isArray(a)&&a.length<=length&&a.every(v=>Number.isInteger(v)&&v>=0&&v<max);
 try{const raw=JSON.parse(storage?.getItem(PROOF_KEY)||'null');if(raw?.version===1){const p=raw.state;if(p&&typeof p==='object'){
  if(Number.isInteger(p.active)&&p.active>=0&&p.active<6)state.active=p.active;state.lastWorkbench=Number.isInteger(p.lastWorkbench)&&p.lastWorkbench>=0&&p.lastWorkbench<6?p.lastWorkbench:state.active;if(p.board===0||p.board===1)state.board=p.board;
  for(const [k,max]of[['repairEdges',16],['subset',4],['exchange',16],['path',8],['cover',8],['capEdges',16],['capS',4],['capM',16],['capCover',8],['revealed',12]])if(ints(p[k],max))state[k]=unique(p[k]);
  if(ints(p.hallMatching,16,4)&&validMatching(state.repairEdges,p.hallMatching))state.hallMatching=[...p.hallMatching];
  if(Array.isArray(p.tiling)&&p.tiling.length<=8&&p.tiling.every(a=>ints(a,16,2)&&a.length===2&&Math.abs(Math.floor(a[0]/4)-Math.floor(a[1]/4))+Math.abs(a[0]%4-a[1]%4)===1)&&unique(p.tiling.flat()).length===p.tiling.length*2)state.tiling=p.tiling;
  if(Array.isArray(p.assignment)&&p.assignment.length===3&&p.assignment.every(v=>Number.isInteger(v)&&v>=-1&&v<3))state.assignment=p.assignment;
  for(const k of['u','v'])if(Array.isArray(p[k])&&p[k].length===3&&p[k].every(x=>Number.isFinite(x)&&Math.abs(x)<=20))state[k]=p[k];
  if(p.capstoneRecord&&['capEdges','capS','capM','capCover'].every(k=>ints(p.capstoneRecord[k],k==='capS'?4:k==='capCover'?8:16)&&unique(p.capstoneRecord[k]).length===p.capstoneRecord[k].length)&&capstoneStatus(p.capstoneRecord).valid)state.capstoneRecord=Object.fromEntries(['capEdges','capS','capM','capCover'].map(k=>[k,[...p.capstoneRecord[k]]]));
  for(const k of['notes','checks','hints'])if(p[k]&&typeof p[k]==='object'&&!Array.isArray(p[k]))for(let i=0;i<6;i++){const value=p[k][i];if(k==='notes'&&typeof value==='string')state.notes[i]=value.slice(0,4000);if(k==='checks'&&Array.isArray(value))state.checks[i]=value.filter(v=>typeof v==='string'&&v.length<40).slice(0,12);if(k==='hints'&&Number.isInteger(value)&&value>=0&&value<=3)state.hints[i]=value;}
 }} }catch{}
 function save(){try{if(!storage)throw Error();storage.setItem(PROOF_KEY,JSON.stringify({version:1,state}));saved=true;}catch{saved=false;}return saved;}
 return {state,save,mark(i,key){state.checks[i]=unique([...(state.checks[i]||[]),key]);save();},get saved(){return saved;}};
}
