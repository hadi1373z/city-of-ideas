// Detail meshes attach to existing roof/walls/furniture, with no extra walking obstacle.
export function buildUncertaintyDetails(T,{home,box,wood,paper,trim,dark,targets}){
 const group=new T.Group();group.name='Uncertainty house details';home.add(group);
 for(const x of[-4.04,4.04])box(group,.16,.16,3.24,x,4.49,-1,wood);
 for(const z of[-2.54,.54])box(group,8.24,.16,.16,0,4.49,z,wood);
 for(const x of[-4.04,4.04])for(const z of[-2.54,.54])box(group,.12,.65,.12,x,4.8,z,wood);
 for(const x of[-7.96,7.96])box(group,.36,.08,6.2,x,.96,0,paper);
 for(const x of[-4.8,4.8])box(group,6.2,.08,.32,x,.96,5.96,paper);
 box(group,3.1,.08,.36,0,4.24,6.03,wood);
 for(const z of[-1.58,-.42])box(group,2.45,.15,.07,5,.87,z,trim);
 for(const x of[3.81,6.19])box(group,.07,.15,1.05,x,.87,-1,trim);
 for(const x of[-4.5,4.5]){box(group,2.25,.07,.58,x,.595,2,paper);for(const z of[2.24,2.36])box(group,2.22,.32,.03,x,.81,z,paper);}
 const reports=new T.Group();reports.name='Observation report cards';reports.position.set(5,1.07,-1);group.add(reports);
 function card(x){const c=new T.Group();c.position.x=x;reports.add(c);box(c,.56,.035,.56,0,.0175,0,wood);box(c,.50,.012,.50,0,.041,0,paper);box(c,.18,.012,.045,0,.053,.015,dark);box(c,.045,.012,.18,0,.053,.015,dark);return c;}
 const first=card(-.35),second=card(.35);box(first,.16,.012,.035,-.12,.053,-.18,trim);
 const copyMark=new T.Group(),separateMark=new T.Group();second.add(copyMark,separateMark);box(copyMark,.16,.012,.035,-.12,.053,-.18,trim);for(const x of[-.18,-.08])box(separateMark,.06,.012,.035,x,.053,-.18,trim);
 reports.traverse(o=>o.userData={studyHouse:'uncertainty',dynamic:true});targets.push(reports);
 function setEvidence(repeats,independent){if(![1,2].includes(repeats)||typeof independent!=='boolean')return false;second.visible=repeats===2;copyMark.visible=!independent;separateMark.visible=independent;return true;}
 setEvidence(1,true);return{group,reports,first,second,copyMark,separateMark,setEvidence};
}
