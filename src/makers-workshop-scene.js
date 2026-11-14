// Details borrow the source workshop's position; only these new meshes are owned.
export function buildMakersWorkshopDetails(T,{home,box,wood,paper,ink,trim}){
 const group=new T.Group();group.name='Makers Workshop details';home.add(group);
 box(group,8.8,.12,.12,0,3,3.88,trim);
 for(const [x,y]of[[-4.38,3],[4.38,3]]){const dx=.7-x,dy=4.45-y,beam=box(group,Math.hypot(dx,dy),.075,.08,(x+.7)/2,(y+4.45)/2,3.90,trim);beam.rotation.z=Math.atan2(dy,dx);}
 for(const y of[.93,2.30])box(group,1.69,.09,.18,-2.45,y,3.65,trim);
 box(group,2.1,.10,.065,2.14,1.99,3.40,wood);
 for(let i=0;i<5;i++){const x=1.3+i*.42;box(group,.035,.15,.035,x,1.90,3.33,trim);box(group,.035,.025,.09,x,1.8375,3.365,trim);}
 box(group,1.55,.12,.55,-2.65,.06,-2.93,wood);
 for(const x of[-3.05,-.75])for(const z of[-.5,.5])box(group,.08,.08,.08,x,.70,z,trim);
 const tray=new T.Group();tray.name='Workshop inspection tray';tray.position.set(-2.79,.935,-.27);group.add(tray);
 box(tray,.50,.024,.40,0,.012,0,wood);
 for(const x of[-.245,.245])box(tray,.01,.025,.40,x,.0365,0,trim);for(const z of[-.195,.195])box(tray,.48,.025,.01,0,.0365,z,trim);
 for(const x of[-.12,.12])box(tray,.20,.006,.31,x,.028,0,paper);
 const marks=[];for(let i=0;i<4;i++){const x=-.12+(i%2? .045:-.045),z=i<2?-.075:.065;box(tray,.06,.004,.06,x,.034,z,ink);box(tray,.046,.002,.046,x,.037,z,paper);const mark=box(tray,.032,.004,.032,x,.040,z,ink);mark.visible=false;marks.push(mark);}
 box(tray,.016,.004,.15,.12,.034,.045,ink);for(const side of[-1,1]){const branch=box(tray,.016,.004,.115,.12+side*.04,.034,-.055,ink);branch.rotation.y=side*Math.PI/4;}
 tray.traverse(o=>o.userData={learningLab:'workshop',workshopGuide:true,dynamic:true});
 function setRevealed(mask){if(!Number.isInteger(mask)||mask<0||mask>15)return false;for(const[i,mark]of marks.entries())mark.visible=!!(mask&1<<i);return true;}
 return{group,tray,marks,setRevealed};
}
