export const HUMANITY_COMMONS=Object.freeze({id:'human-care',name:'Commons of Care',x:-90,z:190,y:.13,yaw:0,radius:10,entry:Object.freeze({x:-90,z:204,y:.13,yaw:0})});
export const COMMONS_PATH=Object.freeze({id:'human-care-spur',width:3.4,points:Object.freeze([Object.freeze([-90,204]),Object.freeze([-79.67433714816835,230])]),kind:'civic-spur'});
export const CARE_NEEDS=Object.freeze([1,2,5]);
export const CARE_BUDGET=6;
export const CARE_QUESTION='Whose need did your rule leave unmet—and who should help decide?';
export const CARE_RULES=Object.freeze([
 Object.freeze({id:'equal',name:'Equal shares',explanation:'Give each household two units. Equal allocations can exceed one reported need while another remains unmet.'}),
 Object.freeze({id:'shortfall',name:'Greatest shortfall first',explanation:'Give one unit at a time to the largest remaining reported need. Ties use A, then B, then C; that tie rule is itself a choice.'}),
 Object.freeze({id:'minimum',name:'Protect a basic minimum',explanation:'First reserve one unit per household. Then complete the smallest remaining reported need first; ties use A, then B, then C.'})
]);
export function allocateCare(rule,needs=CARE_NEEDS,budget=CARE_BUDGET){
 if(!CARE_RULES.some(r=>r.id===rule)||!Array.isArray(needs)||!needs.length||needs.some(n=>!Number.isSafeInteger(n)||n<0)||!Number.isSafeInteger(budget)||budget<0||budget>10000)throw RangeError('A known rule, nonnegative integer needs and a finite unit budget are required');
 const allocations=needs.map(()=>0);let reserve=budget;
 if(rule==='equal'){const base=Math.floor(budget/needs.length);allocations.fill(base);for(let i=0;i<budget%needs.length;i++)allocations[i]++;reserve=0;}
 else{if(rule==='minimum')for(let i=0;i<needs.length&&reserve;i++)if(needs[i]>0){allocations[i]++;reserve--;}
  while(reserve){const candidates=needs.map((n,i)=>({i,left:n-allocations[i]})).filter(p=>p.left>0).sort((a,b)=>rule==='shortfall'?b.left-a.left||a.i-b.i:a.left-b.left||a.i-b.i);if(!candidates.length)break;allocations[candidates[0].i]++;reserve--;}
 }
 const unmet=needs.map((n,i)=>Math.max(0,n-allocations[i])),above=needs.map((n,i)=>Math.max(0,allocations[i]-n));
 return{rule,needs:[...needs],budget,allocations,unmet,above,reserve,totalUnmet:unmet.reduce((a,b)=>a+b,0)};
}
export function nearHumanityCommons(player,mode,eye=1.8){const c=HUMANITY_COMMONS;return mode==='city'&&Number.isFinite(player?.y)&&Math.abs(player.y-eye-c.y)<.35&&Math.hypot(player.x-c.x,player.z-c.z-5.5)<5.2;}
export function commonsCanStand(x,z,y=.13){const c=HUMANITY_COMMONS;if(Math.abs(y-c.y)>.4)return true;const a=x-c.x,b=z-c.z;if(Math.hypot(a,b)<3.45)return false;for(let i=0;i<6;i++){const t=i*Math.PI/3;if(Math.hypot(a-7.2*Math.cos(t),b-7.2*Math.sin(t))<.48)return false;}for(const px of[-4,0,4])if(Math.hypot(a-px,b+4.7)<.75)return false;for(const px of[-5.4,5.4])if(Math.abs(a-px)<.9&&Math.abs(b-1.4)<1.7||Math.hypot(a-px,b+2.1)<1.2)return false;return true;}
