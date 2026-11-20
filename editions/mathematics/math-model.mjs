export const CENTRE={x:215,z:-78},RADIUS=44;
export const HOUSES=[
 {id:'symmetry',name:'House of Symmetry',short:'Symmetry',color:0x368b97,question:'When does moving a shape leave it unchanged?',next:'topology'},
 {id:'chance',name:'House of Chance',short:'Chance',color:0xba774b,question:'How many people make a shared birthday likely?',next:'algorithms'},
 {id:'infinity',name:'House of Infinity',short:'Infinity',color:0x796eae,question:'Can a list contain every infinite binary sequence?',next:'papers'},
 {id:'topology',name:'House of Topology',short:'Topology',color:0x3e8a70,question:'Can one continuous surface have only one side?',next:'symmetry'},
 {id:'algorithms',name:'House of Algorithms',short:'Algorithms',color:0x4676ae,question:'Why does Euclid’s algorithm always finish?',next:'infinity'},
 {id:'papers',name:'Mathematical Reading House',short:'Reading',color:0xa47b44,question:'Which assumption makes a theorem possible?',next:'proof'}
].map((h,i)=>({...h,angle:i*Math.PI/3,x:CENTRE.x+RADIUS*Math.cos(i*Math.PI/3),z:CENTRE.z+RADIUS*Math.sin(i*Math.PI/3)}));
export const GARDENS=HOUSES.map(h=>({...h,houseId:h.id,name:h.short+' garden',angle:h.angle+Math.PI/6,x:CENTRE.x+49*Math.cos(h.angle+Math.PI/6),z:CENTRE.z+49*Math.sin(h.angle+Math.PI/6)}));
export function localPoint(h,x,z){const dx=x-h.x,dz=z-h.z;return {x:-Math.sin(h.angle)*dx+Math.cos(h.angle)*dz,z:-Math.cos(h.angle)*dx-Math.sin(h.angle)*dz};}
export function worldPoint(h,x,z){return {x:h.x-Math.sin(h.angle)*x-Math.cos(h.angle)*z,z:h.z+Math.cos(h.angle)*x-Math.sin(h.angle)*z};}
export const doorstep=h=>({...worldPoint(h,0,9),y:.13,yaw:-Math.PI/2-h.angle});
export function canWalk(x,z){if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x-CENTRE.x,z-CENTRE.z)>72||Math.hypot(x-(CENTRE.x-9),z-(CENTRE.z-20))<2.5)return false;for(const h of HOUSES){const p=localPoint(h,x,z);if(Math.abs(p.x)<8&&Math.abs(p.z)<8){if(Math.abs(p.x)>7.2||p.z< -7.2)return false;if(p.z>6.9&&Math.abs(p.x)>2.3)return false;if(Math.hypot(p.x,p.z)<1.9||Math.abs(p.x)>4.1&&Math.abs(p.x)<7.1&&Math.abs(p.z-4.5)<.9)return false;}}const pond=GARDENS[5],p=localPoint(pond,x,z);if(Math.hypot(p.x,p.z)<2.7&&Math.abs(p.x)>.36)return false;return true;}
export function birthday(n,days=365){if(!Number.isInteger(n)||n<0||!Number.isInteger(days)||days<1)throw Error('Use nonnegative people and a positive number of days');if(n>days)return 1;let different=1;for(let i=0;i<n;i++)different*=1-i/days;return 1-different;}
export function euclid(a,b){if(![a,b].every(n=>Number.isSafeInteger(n)&&n>0&&n<=9999))throw Error('Use positive integers up to 9999');const rows=[];while(b){rows.push({a,b,q:Math.floor(a/b),r:a%b});[a,b]=[b,a%b];}return {gcd:a,rows};}
export function diagonal(rows){if(!Array.isArray(rows)||!rows.length||rows.some(r=>!Array.isArray(r)||r.length!==rows.length||r.some(n=>n!==0&&n!==1)))throw Error('Use a square binary matrix');return rows.map((r,i)=>1-r[i]);}
export function symmetry(n,step,reflected=false){if(!Number.isInteger(n)||n<3||n>12||!Number.isInteger(step))throw Error('Invalid regular polygon');return Array.from({length:n},(_,i)=>((reflected?-i:i)+step%n+n)%n);}
export function mobius(u,v,r=2.6){return {x:(r+v*Math.cos(u/2))*Math.cos(u),y:v*Math.sin(u/2),z:(r+v*Math.cos(u/2))*Math.sin(u)};}
export const NOTE_KEY='city-of-mathematics:campus-notes:v1';
export function notebook(storage){let entries={},saved=!!storage;try{const s=JSON.parse(storage?.getItem(NOTE_KEY)||'null');if(s?.version===1&&s.entries)for(const h of HOUSES){const e=s.entries[h.id];if(e&&typeof e.text==='string')entries[h.id]={text:e.text.slice(0,4000),question:h.question};}}catch{}return {entries,get saved(){return saved;},keep(id,text){if(!HOUSES.some(h=>h.id===id)||typeof text!=='string'||!text.trim())return false;entries[id]={text:text.trim().slice(0,4000),question:HOUSES.find(h=>h.id===id).question};try{storage.setItem(NOTE_KEY,JSON.stringify({version:1,entries}));saved=true;}catch{saved=false;}return true;}};}
