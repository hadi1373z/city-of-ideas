// Additive details only; the source books, furniture and collision map are borrowed.
export function buildMakersLibraryDetails(T,{home,box,wood,paper,ink}){
 const group=new T.Group();group.name='Makers Library details';home.add(group);
 box(group,8.8,.16,.12,0,3.0,3.87,wood);
 box(group,1.69,.09,.20,-2.45,.93,3.65,wood);
 box(group,1.69,.09,.12,-2.45,2.30,3.65,wood);
 for(const x of[-2.2,0,2.2]){box(group,1.92,.065,.44,x,2.2975,-3.2,wood);for(const dx of[-.85,.85])box(group,.12,.14,.42,x+dx,.105,-3.2,wood);}
 const rack=new T.Group();rack.name='Library reading rack';rack.position.set(3.86,1.58,-.4);rack.rotation.y=-Math.PI/2;group.add(rack);
 box(rack,1.48,.88,.045,0,0,0,wood);
 for(const x of[-.35,.35]){box(rack,.60,.65,.014,x,.035,.030,paper);box(rack,.10,.12,.09,x,-.30,-.045,wood);}
 for(const y of[.21,.10,-.01])box(rack,.40,.018,.012,-.35,y,.044,ink);
 // A block-drawn question mark; its meaning is also explained in the reader.
 for(const[w,h,x,y]of[[.22,.035,.35,.24],[.035,.14,.46,.185],[.14,.035,.405,.115],[.035,.13,.35,.065],[.04,.04,.35,-.075]])box(rack,w,h,.012,x,y,.044,ink);
 rack.traverse(o=>o.userData={learningLab:'library',libraryGuide:true,dynamic:true});
 return{group,rack};
}
