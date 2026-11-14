// Additive furnishings; source seats, books, cup and collision footprints are borrowed.
export function buildMakersDialogueDetails(T,{home,box,wood,paper,ink,trim,cloth}){
 const group=new T.Group();group.name='Makers Dialogue details';home.add(group);
 for(const z of[-3.88,3.88])box(group,8.8,.12,.12,0,3,z,trim);
 for(const x of[-4.4,4.4])box(group,.10,.12,7.76,x,3,0,trim);
 box(group,.12,.08,3.3,0,4.49,0,trim);
 for(const x of[-4.38,4.38])for(const z of[-3.86,3.86]){const a=new T.Vector3(x,3,z),b=new T.Vector3(0,4.45,Math.sign(z)*1.65),d=b.clone().sub(a),m=a.clone().add(b).multiplyScalar(.5),beam=box(group,.06,d.length(),.06,m.x,m.y,m.z,trim);beam.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());}
 for(const y of[.93,2.30])box(group,1.69,.09,.18,-2.45,y,3.65,trim);
 for(const side of[-1,1]){const seat=new T.Group();seat.position.set(side*1.7,0,-.3);seat.rotation.y=side<0?Math.PI/2:-Math.PI/2;group.add(seat);box(seat,.68,.03,.14,0,1.105,-.3,wood);for(const x of[-.20,0,.20])box(seat,.018,.30,.009,x,.85,-.235,trim);for(const z of[-.26,.26])box(seat,.54,.04,.04,0,.18,z,wood);}
 box(group,1.35,.06,.38,2.7,1.2575,-3.08,trim);
 for(const x of[2.23,3.17])box(group,.10,.82,.04,x,.52,-2.95,trim);
 box(group,1.04,.08,.05,2.7,.79,-2.95,trim);box(group,1.2,.08,.32,2.7,.04,-3.11,wood);
 const blanket=new T.Group();blanket.name='Folded dialogue throw';blanket.position.set(-2.2,.65,1.52);group.add(blanket);box(blanket,.39,.035,.42,0,.0175,0,cloth);box(blanket,.39,.025,.20,0,.0475,-.11,cloth);for(const x of[-.13,0,.13])box(blanket,.012,.003,.41,x,.0365,0,trim);
 const prompt=new T.Group();prompt.name='Facing dialogue cards';prompt.position.set(0,.605,-.3);group.add(prompt);const cards=[];
 for(const side of[-1,1]){const card=new T.Group();card.position.x=side*.22;card.rotation.y=side*Math.PI/2;prompt.add(card);cards.push(card);box(card,.16,.006,.20,0,.003,0,paper);box(card,.012,.025,.20,.074,.0185,0,paper);for(const[i,z]of[-.055,0,.055].entries())box(card,[.10,.08,.12][i],.003,.013,0,.0075,z,ink);}
 prompt.traverse(o=>o.userData={learningLab:'dialogue',dialogueGuide:true,dynamic:true});
 return{group,prompt,cards,blanket};
}
