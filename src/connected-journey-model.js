import {BABEL,babelDesk,surfaceAt as babelSurface,walkLibrary} from './babel-library-model.js?v=two-faces2';
import {UPPER,LOWER,pointAt} from './two-face-gallery-model.js';
import {ESCHER_DEPTH as D,depthRoomAt,depthFloorAt,canWalkDepth} from './escher-depth-model.js';
import {lowerLocal,lowerPhysical,GALLERY_TUNNEL,tunnelContains} from './world-cylinder-model.js';
import {MATH_FACULTY as F,facultyCanStand,facultyColliders} from './math-faculty-model.js';

const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angle=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const nearFloor=(p,y,eye)=>Math.abs(p.y-eye-y)<.5;
export const JOURNEY_QUESTIONS=Object.freeze({
 babel:{title:'A catalogue and a reason',question:'The catalogue contains every six-symbol page over four symbols. What would make one of its 4,096 pages a justified claim?',route:'Visit a reading desk, try a prefix, then follow the fifth terrace east to the open bookshelf doorway.'},
 passage:{title:'One question, connected rooms',question:'A complete list gives you possibilities. Escher’s chamber asks what a convincing view can establish about the world.',route:'At the upper spiral’s second full turn, take the level passage east. It turns north, then east into Escher’s museum.'},
 perspective:{title:'What does one image establish?',question:'Projection discards depth. Align the separated rods, then step sideways: which properties survive the change of viewpoint?',route:'Follow the main hall east through the real doorway. The three brass viewing marks are beyond the triangle case.'},
 loop:{title:'Test a global constraint',question:'For a closed spatial route, signed height changes must sum to zero. Can every flight rise and still return to the same landing?',route:'Return to the main hall and take its south stair. The lower room contains the four-flight closure experiment.'},
 shore:{title:'Reflection or rotation?',question:'As you pass to the other face, does your compass frame undergo a reflection or a rotation?',route:'Imagine carrying three arrows through the gallery: east, north and up. Predict which directions reverse before revealing the answer.'},
 working:{title:'Leave the Mathematics library',question:'To leave: return to the central hall, then go through the open front doors.',route:'From a side room, use the opening halfway along its inner wall. Turn into the hall and follow it toward the front doorway. Outside, the covered walk returns to the circular Faculty.'},
 lift:{title:'Return to the ground floor',question:'The city exit is on the ground floor. Use the lift in the exploration laboratory to return there.',route:'Use the opening in the side-room wall to reach the central hall. Cross into the laboratory through its middle opening, then follow the lift controls. Ground-floor doors lead outside.'},
 faculty:{title:'From a view to an argument',question:'Use the Logic and Computation floor to compare evidence, a counterexample and a proof. Which assumptions did your visual explanation need?',route:'The central spiral opens into the Faculty. Its Logic and Computation bay is east of the well, just north of the east-west axis.'}
});
export function connectedContext({player,eye=1.8,mode,babelActive=false,escherActive=false,worldRoute=null,region=null,progress={},catalogueOpened=false,shore=null,mathematics=null}){
 if(mode!=='city'||![player?.x,player?.y,player?.z,eye].every(Number.isFinite))return null;
 const common={player,eye,feet:player.y-eye,progress,catalogueOpened};
 if(babelActive&&babelSurface(player.x,player.z,player.y-eye)!==null){const level=BABEL.levels.reduce((a,b)=>Math.abs(a.y-common.feet)<Math.abs(b.y-common.feet)?a:b);return{...common,place:'babel',level};}
 if(escherActive&&depthFloorAt(player.x,player.z)!==null&&nearFloor(player,depthFloorAt(player.x,player.z),eye))return{...common,place:!progress.perspective?'perspective':!progress.loop?'loop':'passage',museum:true,room:depthRoomAt(player.x,player.z)};
 if(player.x<-1000&&shore&&nearFloor(player,.13,eye)){const q=lowerLocal(player);if(Math.hypot(q.x-shore.x,q.z-shore.z)<(shore.radius??8))return{...common,place:'shore',lower:true};}
 if(worldRoute?.side==='lower'&&['floor','walkout'].includes(worldRoute.layer))return{...common,place:'faculty',lower:true,region};
 if(worldRoute)return{...common,place:progress.perspective&&progress.loop?'faculty':'passage',worldRoute};
 if(player.x<-1000&&region?.id==='mathematics'){
  if(!mathematics?.model||!mathematics.transform||!Number.isInteger(mathematics.floor))return null;
  const t=mathematics.transform,y=t.y+mathematics.model.height*(t.scale??1);if(!nearFloor(player,y,eye))return null;
  return{...common,place:mathematics.floor>0?'lift':'working',lower:true,region,mathematics};
 }
 if(player.x<-1000&&Math.hypot(player.x+2160,player.z+65)<65)return{...common,place:'faculty',lower:true,region};
 return null;
}
function line(a,b,spacing=.7){const n=Math.max(1,Math.ceil(distance(a,b)/spacing));return Array.from({length:n+1},(_,i)=>({x:a.x+(b.x-a.x)*i/n,z:a.z+(b.z-a.z)*i/n,y:a.y+(b.y-a.y)*i/n}));}
function through(points,spacing=.7){return points.slice(1).flatMap((b,i)=>line(points[i],b,spacing).slice(i?1:0));}
function arc(p,r,target,y){const a=Math.atan2(p.z,p.x),d=angle(a,target),n=Math.max(1,Math.ceil(Math.abs(d)*r/.7));return[{x:p.x,y,z:p.z},...line({x:p.x,y,z:p.z},{x:Math.cos(a)*r,y,z:Math.sin(a)*r}),...Array.from({length:n},(_,i)=>{const t=a+d*(i+1)/n;return{x:Math.cos(t)*r,y,z:Math.sin(t)*r};})];}
function babelRoute(c){
 const l=c.level,p=c.player,r=l.r+.65,goal=c.catalogueOpened?(l.id===4?0:l.angle):babelDesk(l.id).a;
 let points=arc(p,r,goal,l.y),last=points.at(-1);
 const end=c.catalogueOpened?{x:Math.cos(goal)*(l.id===4?11.6:l.r),z:Math.sin(goal)*(l.id===4?11.6:l.r),y:l.y}:last;
 points.push(...line(last,end));if(c.catalogueOpened&&l.id<4){const next=BABEL.levels[l.id+1];points.push(...line(end,{x:Math.cos(goal)*next.r,z:Math.sin(goal)*next.r,y:next.y}));}
 // Reuse the real navigator so no breadcrumb cuts across a book well or desk.
 const walker={x:p.x,z:p.z,y:p.y},out=[];for(const q of points){walkLibrary(walker,q.x-walker.x,q.z-walker.z,c.eye);if(distance(walker,q)>.09)break;out.push({x:walker.x,z:walker.z,y:walker.y-c.eye});}
 return out;
}
const museumNodes=[
 [136.4,115],[154,115],[166,115],[174,115],[198,115],[200,124],[213,124],[225,124],[230,115],[240,115],[260,115],
 [213,94],[213,100],[224,100],[202,90],[202,73],[213,73],
 [184.5,130],[184.5,138],[184.5,150],[184.5,158],[184.5,162],[197,163]
].map(([x,z])=>({x,z,y:depthFloorAt(x,z)}));
function clearMuseum(a,b){let y=a.y;for(const p of line(a,b,.18)){const h=depthFloorAt(p.x,p.z);if(!canWalkDepth(p.x,p.z,{fromY:y}))return false;y=h;}return true;}
// These edges are the museum's actual door and stair sequence, not an all-pairs
// visibility graph built during startup. Each is still checked against real solids.
const museumEdges=museumNodes.map(()=>[]);for(const[a,b]of[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[7,13],[13,12],[12,11],[11,14],[14,15],[15,16],[3,17],[17,18],[18,19],[19,20],[20,21],[21,22]])if(clearMuseum(museumNodes[a],museumNodes[b])){const d=distance(museumNodes[a],museumNodes[b]);museumEdges[a].push({j:b,d});museumEdges[b].push({j:a,d});}
export function museumRoute(player,goal='perspective',eye=1.8){
 const start={x:player.x,z:player.z,y:player.y-eye},target=goal==='perspective'?6:goal==='loop'?22:0,nodes=[...museumNodes,start],edges=[...museumEdges,nodes.slice(0,-1).flatMap((q,j)=>clearMuseum(start,q)?[{j,d:distance(start,q)}]:[])],cost=nodes.map(()=>Infinity),prev=[],queue=new Set(nodes.map((_,i)=>i));cost[nodes.length-1]=0;
 while(queue.size){let i=-1;for(const j of queue)if(i<0||cost[j]<cost[i])i=j;if(!Number.isFinite(cost[i]))break;queue.delete(i);if(i===target)break;for(const e of edges[i])if(cost[i]+e.d<cost[e.j]){cost[e.j]=cost[i]+e.d;prev[e.j]=i;}}
 if(!Number.isFinite(cost[target]))return[];const path=[];for(let i=target;i!==undefined;i=prev[i])path.push(nodes[i]);return through(path.reverse()).map(p=>({...p,y:depthFloorAt(p.x,p.z)}));
}
function tunnelRoute(p,reverse=false){const knots=GALLERY_TUNNEL.points.map(([x,z])=>({x,z,y:-40}));let best=null;for(let i=1;i<knots.length;i++){const a=knots[i-1],b=knots[i],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz))),q={x:a.x+dx*t,z:a.z+dz*t,y:-40},d=distance(p,q);if(!best||d<best.d)best={i,q,d};}return through([{x:p.x,z:p.z,y:-40},best.q,...(reverse?knots.slice(0,best.i).reverse():knots.slice(best.i))]);}
function spiralRoute(c){
 const r=c.worldRoute,side=r.side,s=side==='upper'?UPPER:LOWER,theta=r.theta??0,wantsFaculty=c.place==='faculty';
 if(side==='upper'&&Math.abs(c.feet+40)<.45&&tunnelContains(c.player.x,c.player.z)&&c.player.x>21)return tunnelRoute(c.player,wantsFaculty);
 const target=side==='upper'?(wantsFaculty?s.endTheta:UPPER.spur.theta):(wantsFaculty?0:s.endTheta),n=Math.max(1,Math.ceil(Math.abs(target-theta)/.05)),points=Array.from({length:n+1},(_,i)=>pointAt(theta+(target-theta)*i/n,side));
 if(side==='upper'&&target===UPPER.spur.theta)points.push(...through([{x:16,z:0,y:-40},...GALLERY_TUNNEL.points.map(([x,z])=>({x,z,y:-40}))]));
 else if(target===s.endTheta)points.push(...line(points.at(-1),{x:18.3,z:0,y:-48}));
 else if(side==='lower')points.push(...line(points.at(-1),{x:23,z:0,y:.13}));
 return side==='lower'?points.map(p=>lowerPhysical({x:p.x-2160,z:p.z-65,y:p.y})):points;
}
const wingGraphCache=new WeakMap();
function clearWing(a,b,canStand){return line(a,b,.16).every(p=>canStand(p.x,p.z));}
function wingGraph(model){
 let cached=wingGraphCache.get(model);if(cached)return cached;
 const coords=[[0,-7.3],[0,-1],[0,0],[0,5.3],[0,7.3],[-10.8,-7.3],[-10.8,0],[-10.8,5.5],[-10.8,7.3],[-5,0],[-5,5.5],[-5,7.3],[10.5,-7.3],[10.5,-2.6],[10.5,0],[9.6,0],[9.6,2.8],[9.6,5],[9.6,7.3],[5,0],[5,2.8],[5,7.3],...(model.floor===0?[[0,9.6],[0,26],[16,26],[16,0],[22,0],[24,0]]:[])];
 const nodes=coords.map(([x,z])=>({x,z,y:model.height})).filter(p=>model.canStand(p.x,p.z)),edges=nodes.map(()=>[]);
 for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++)if(clearWing(nodes[a],nodes[b],model.canStand)){const d=distance(nodes[a],nodes[b]);edges[a].push({j:b,d});edges[b].push({j:a,d});}
 cached={nodes,edges};wingGraphCache.set(model,cached);return cached;
}
export function workingWingRoute(c){
 const math=c.mathematics;if(!math?.model?.canStand)return[];const t=math.transform,s=t.scale??1,model=math.model,start={x:(c.player.x-t.x)/s,z:(c.player.z-t.z)/s,y:model.height},nativeCan=math.canStandLocal??model.canStand,facultySolids=facultyColliders(),canStand=(x,z)=>nativeCan(x,z)&&facultyCanStand(t.x+x*s+2160,t.z+z*s+65,t.y+model.height*s,{colliders:facultySolids});
 if(!canStand(start.x,start.z))return[];
 const connector=[...F.connector.points].reverse().map(([x,z])=>({x:x-F.wing.x,z:z-F.wing.z,y:0})),inside=start.x>-12&&start.x<12&&start.z>-10&&start.z<8;
 let goal,tail=[];if(math.floor>0)goal={x:model.landings?.[math.floor]?.x??9.6,z:model.landings?.[math.floor]?.z??5,y:model.height};
 else{let index=0;if(!inside){let best=Infinity;connector.forEach((p,i)=>{const d=distance(start,p);if(d<best&&clearWing(start,p,canStand)){best=d;index=i;}});}goal=connector[index];tail=connector.slice(index+1);}
 const base=wingGraph(model),nodes=[...base.nodes,start],edges=[...base.edges,nodes.slice(0,-1).flatMap((p,j)=>clearWing(start,p,canStand)?[{j,d:distance(start,p)}]:[])],target=nodes.findIndex(p=>distance(p,goal)<.02),cost=nodes.map(()=>Infinity),prev=[],queue=new Set(nodes.map((_,i)=>i));if(target<0)return[];cost[nodes.length-1]=0;
 while(queue.size){let i=-1;for(const j of queue)if(i<0||cost[j]<cost[i])i=j;if(!Number.isFinite(cost[i]))break;queue.delete(i);if(i===target)break;for(const e of edges[i])if(cost[i]+e.d<cost[e.j]&&clearWing(nodes[i],nodes[e.j],canStand)){cost[e.j]=cost[i]+e.d;prev[e.j]=i;}}
 if(!Number.isFinite(cost[target]))return[];const path=[];for(let i=target;i!==undefined;i=prev[i])path.push(nodes[i]);const local=through([...path.reverse(),...tail]);
 // Check every cue against the authoritative current source floor, including
 // live cargo obstacles, before mapping it to the lower physical frame.
 const out=[];for(const p of local){if(!canStand(p.x,p.z))break;const logical={x:t.x+p.x*s,z:t.z+p.z*s,y:t.y+p.y*s},q=lowerLocal(logical);if(!facultyCanStand(q.x,q.z,logical.y))break;out.push(lowerPhysical(logical));}return out;
}
export function connectedRoute(c){
 if(!c)return[];if(c.place==='babel')return babelRoute(c);
 if(c.mathematics)return workingWingRoute(c);
 if(c.museum)return museumRoute(c.player,c.place,c.eye);
 if(c.worldRoute)return spiralRoute(c);
 if(c.lower&&Math.abs(c.feet-.13)<.45){const p=lowerLocal(c.player),r=Math.hypot(p.x,p.z);if(r<58||p.x<0&&r<65&&Math.abs(p.z)<2.4){const entry=r<58?p:{x:-56,z:0,y:.13},points=[...line({...p,y:.13},entry),...arc(entry,35,-Math.PI/8,.13)];points.push(...line(points.at(-1),{x:Math.cos(-Math.PI/8)*56.3,z:Math.sin(-Math.PI/8)*56.3,y:.13}));return points.map(q=>lowerPhysical({x:q.x-2160,z:q.z-65,y:q.y}));}}
 return[];
}
