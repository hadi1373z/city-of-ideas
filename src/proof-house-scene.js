// Additive details stay on the original walls and furniture, without new obstacles.
export function buildProofDetails(T,{home,box,wood,paper,trim,dark,targets}){
 const group=new T.Group();group.name='Proof house details';home.add(group);
 for(const x of[-7.96,7.96])for(const y of[.94,3.36])box(group,.38,.12,6.2,x,y,0,wood);
 for(const x of[-4.8,4.8])box(group,6.2,.12,.38,x,.94,5.96,wood);
 for(const side of[-1,1]){const fascia=box(group,8.7,.30,.18,side*4,4.92,6.43,wood);fascia.rotation.z=-side*.18;}
 for(const x of[-4.5,4.5])for(const z of[1.78,2,2.22])box(group,2.35,.035,.18,x,.5775,z,wood);
 box(group,1.7,.18,.09,5,.88,-.33,trim);box(group,.13,.07,.1,5,.88,-.25,wood);
 const sample=new T.Group();sample.name='Two-colour domino sample';sample.position.set(5,1.07,-1);group.add(sample);
 box(sample,.76,.035,.4,0,.0175,0,wood);
 for(const[x,m]of[[-.18,dark],[.18,paper]])box(sample,.35,.025,.34,x,.0475,0,m);
 box(sample,.014,.01,.34,0,.065,0,trim);
 const pencil=box(group,.065,.065,.75,5.98,1.0825,-1,trim);pencil.rotation.y=-.15;
 box(group,.055,.055,.09,5.92,1.0825,-.59,wood);
 sample.traverse(o=>o.userData={studyHouse:'proof',studyReading:true,dynamic:true});targets.push(sample);
 return group;
}
