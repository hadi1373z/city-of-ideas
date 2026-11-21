// Original, visit-local blocking after the complete existing recording.
// Every coordinate is local to the unchanged native Ramsey study.
export const RAMSEY_DEPARTURE=Object.freeze({bodyRadius:.34,chairPull:.82,standInset:.08,standSeconds:1.4,stagger:2.6,speed:.78,ringRadius:2.75,tableZ:.35,exitZ:-6.2,order:Object.freeze([1,0,2,4,5,3])});
const D=RAMSEY_DEPARTURE,clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);},angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function departureRoute(seat){
 const theta=angle(seat.yaw),side=theta<0?-1:1,direction=Math.abs(theta)>Math.PI-.01?-side:side,a=theta+direction*.32,end=side*(Math.PI-.32),p=r=>[Math.sin(a)*r,D.tableZ+Math.cos(a)*r],points=[[seat.x-Math.sin(theta)*D.standInset,seat.z-Math.cos(theta)*D.standInset],p(2.3),p(D.ringRadius)];
 const count=Math.max(1,Math.ceil(Math.abs(end-a)/.075));for(let i=1;i<=count;i++){const t=a+(end-a)*i/count;points.push([Math.sin(t)*D.ringRadius,D.tableZ+Math.cos(t)*D.ringRadius]);}
 points.push([side*.8,-2.78],[0,-3.7],[0,D.exitZ]);let length=0;const segments=[];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<1e-8)continue;segments.push({a,b,start:length,end:length+d});length+=d;}
 return{points,segments,length,ringDistance:Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1])+Math.hypot(points[2][0]-points[1][0],points[2][1]-points[1][1])};
}
function sample(route,d){const s=route.segments.find(s=>d<s.end-1e-9)??route.segments.at(-1),t=clamp((d-s.start)/(s.end-s.start),0,1);return{x:s.a[0]+(s.b[0]-s.a[0])*t,z:s.a[1]+(s.b[1]-s.a[1])*t,yaw:Math.atan2(-(s.b[0]-s.a[0]),-(s.b[1]-s.a[1]))};}
export function createRamseyDeparture(seats){
 if(seats.length!==6)throw Error('The original six-person cast is required');
 const routes=seats.map(departureRoute);let active=false,elapsed=0,paused=false,people=[];
 function reset(){active=false;elapsed=0;paused=false;people=seats.map((s,i)=>({index:i,x:s.x,z:s.z,yaw:s.yaw,distance:0,rise:0,chair:0,returnTime:0,phase:'seated',seated:true,walking:false,visible:true}));}
 reset();
 function step(dt){elapsed+=dt;
  for(const index of D.order){const p=people[index],seat=seats[index],route=routes[index],local=elapsed-D.order.indexOf(index)*D.stagger;p.walking=false;if(local<0||p.phase==='gone')continue;
   p.rise=smooth(local/D.standSeconds);p.chair=D.chairPull*p.rise;
   if(local<D.standSeconds){p.phase='standing';p.seated=p.rise<1;p.x=seat.x-Math.sin(seat.yaw)*D.standInset*p.rise;p.z=seat.z-Math.cos(seat.yaw)*D.standInset*p.rise;continue;}
   p.seated=false;p.phase='turning';const target=sample(route,Math.min(route.length,p.distance+.04)),delta=angle(target.yaw-p.yaw);p.yaw+=clamp(delta,-dt*2.4,dt*2.4);
   if(Math.abs(delta)<.4){const next=Math.min(route.length,p.distance+D.speed*dt),q=sample(route,next);if(!people.some(other=>other!==p&&other.visible&&Math.hypot(q.x-other.x,q.z-other.z)<D.bodyRadius*2+.10)){p.distance=next;p.x=q.x;p.z=q.z;p.walking=true;p.phase='walking';}else p.phase='waiting';}
   if(p.distance>=route.ringDistance){p.returnTime+=dt;p.chair=D.chairPull*(1-smooth(p.returnTime/.9));}
   if(p.distance>=route.length-1e-8){p.phase='gone';p.visible=false;p.walking=false;p.chair=0;}
  }
 }
 function update(dt,{completed=false,enabled=true}={}){
  if(!completed){if(active)reset();return state();}
  if(!active){active=true;return state();}
  for(const p of people)p.walking=false;
  if(people.every(p=>!p.visible))return state();
  if(!enabled||paused)return state();let remaining=Math.max(0,Math.min(.15,Number(dt)||0));while(remaining>1e-8){const n=Math.min(1/60,remaining);step(n);remaining-=n;}return state();
 }
 function state(){return{active,elapsed,paused,complete:active&&people.every(p=>!p.visible),people:people.map(p=>({...p}))};}
 return{routes,update,reset,pause(value=true){if(active)paused=!!value;},get state(){return state();}};
}
