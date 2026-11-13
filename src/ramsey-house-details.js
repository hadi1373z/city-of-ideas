// Fixed city diagrams, independent of the original fifteen live table edges.
export const RAMSEY_FIVE_POINTS=Array.from({length:5},(_,i)=>[Math.sin(i*2*Math.PI/5)*.23,Math.cos(i*2*Math.PI/5)*.23]);
export const RAMSEY_FIVE_EDGES=Array.from({length:5},(_,a)=>Array.from({length:4-a},(_,j)=>{const b=a+j+1;return{a,b,color:b-a===1||b-a===4?0:1};})).flat();
export const RAMSEY_FAN_POINTS=[[-.27,0],...[.24,.12,0,-.12,-.24].map(y=>[.22,y])];
export const RAMSEY_FAN_EDGES=Array.from({length:5},(_,i)=>({a:0,b:i+1,color:i<3?0:1}));
export function buildRamseyDetails(T,model){
 const group=new T.Group();group.name='Ramsey · five and six reading rack';model.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const wood=mat('#78624c'),gold=mat('#b89b68'),paper=mat('#eee4cf'),red=mat('#9e483a'),blue=mat('#276b90'),ink=mat('#394f4a');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const roof=model.group.children.find(o=>o.geometry?.parameters?.width===10.45);
 for(const z of[-3.295,3.755])box(group,'Roof end fascia',10.45,.08,.05,0,3.84,z,gold);
 for(const x of[-5.225,5.225])box(group,'Roof side fascia',.05,.08,7.05,x,3.84,.23,gold);
 for(const x of[-1.265,1.265])for(const y of[.20,2.65])box(group,'Door post plate',.045,.16,.025,x,y,-3.2225,gold);
 for(const x of[-1.70,1.70])for(const y of[1.0,3.1])box(group,'Window corner plate',.09,.10,.012,x,y,3.284,gold);
 for(const x of[-4.96,4.96])for(const z of[-.95,3.4])box(group,'Column capital collar',.26,.06,.26,x,3.77,z,wood);
 const chairs=model.study.chairs,joints=[];
 for(const chair of chairs){const joinery=new T.Group();joinery.name='Supported chair joints';joinery.position.copy(chair.position);joinery.quaternion.copy(chair.quaternion);group.add(joinery);
  for(const x of[-.245,.245])for(const z of[-.22,.22])joints.push(box(joinery,'Chair leg joint',.075,.035,.075,x,.4625,z,wood));
 }
 const sideTable=model.study.group.getObjectByName('Lamp side table'),sideJoinery=new T.Group();sideJoinery.name='Lamp table joinery';sideJoinery.position.copy(sideTable.position);group.add(sideJoinery);
 for(const z of[-.285,.285])box(sideJoinery,'Side table apron',.68,.10,.035,0,.695,z,wood);
 const panel=new T.Group();panel.name='Original city five and six rack';panel.position.set(-4.81,1.7,-2.1);panel.rotation.y=Math.PI/2;panel.userData={ramseyReading:true};group.add(panel);
 const backing=box(panel,'Rack backing',1.64,.82,.052,0,0,0,wood),spacers=[];for(const x of[-.62,.62])spacers.push(box(panel,'Wall spacer',.12,.12,.044,x,0,-.048,wood));
 box(panel,'Card ledge',1.64,.045,.11,0,-.35,.029,gold);
 const cards=[],edgeGroups=[],dots=[];
 for(const [index,x]of[-.39,.39].entries()){
  cards.push(box(panel,'Original city diagram card',.70,.62,.012,x,0,.032,paper));const points=index?RAMSEY_FAN_POINTS:RAMSEY_FIVE_POINTS,edges=index?RAMSEY_FAN_EDGES:RAMSEY_FIVE_EDGES;
  for(const e of edges){const node=new T.Group();node.name=index?'Partial six-point fan edge':'Five-point counterexample edge';node.userData={...e,diagram:index};panel.add(node);const a=points[e.a],b=points[e.b];
   for(const [lo,hi]of(e.color?[[0,.42],[.58,1]]:[[0,1]])){const ax=a[0]+(b[0]-a[0])*lo,ay=a[1]+(b[1]-a[1])*lo,bx=a[0]+(b[0]-a[0])*hi,by=a[1]+(b[1]-a[1])*hi,o=box(node,'Diagram edge stroke',Math.hypot(bx-ax,by-ay),.009,.002,x+(ax+bx)/2,(ay+by)/2,.040,e.color?blue:red);o.rotation.z=Math.atan2(by-ay,bx-ax);}
   edgeGroups.push(node);
  }
  for(const [i,p]of points.entries()){const o=new T.Mesh(own(new T.CircleGeometry(.021,16)),ink);o.name='Marked diagram vertex';o.position.set(x+p[0],p[1],.043);o.userData={diagram:index,vertex:i};panel.add(o);dots.push(o);}
 }
 panel.traverse(o=>o.userData={...o.userData,ramseyReading:true});let disposed=false;
 return{group,panel,backing,spacers,cards,edgeGroups,dots,chairs,joints,roof,targets:[panel],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
