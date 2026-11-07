import {HILMA_NUMBERS} from './hilma-gallery-copy.js';
// Own local additions follow the original house, including its opposite-row turn.
export function buildHilmaDetails(T,house){
 const group=new T.Group();group.name='Hilma af Klint · numbered ledge and gallery details';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const plum=mat('#735b7b'),pale=mat('#e2cfac'),wood=mat('#806b59'),paper=mat('#f5edda'),ink=mat('#475c65');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 for(const z of[-3.375,3.375])for(const side of[-1,1]){const o=box(group,'High gable edging',Math.hypot(3.83,1.7),.065,.065,side*1.915,3.85,z,pale);o.rotation.z=-side*Math.atan2(1.7,3.83);}
 for(const x of[-3.84,3.84])box(group,'Eave fascia',.07,.09,6.75,x,3.005,0,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,wood);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,wood);
 const pad=box(group,'Supported woven bench pad',1.72,.035,.52,0,.5425,.5,plum);
 for(const z of[.25,.75])box(group,'Pad binding',1.69,.003,.009,0,.5615,z,pale);
 for(const x of[-.6,-.2,.2,.6])box(group,'Pad tuft',.025,.003,.025,x,.5615,.5,pale);
 for(const x of[-.96,.96])box(group,'Bench end joint',.07,.12,.5,x,.36,.5,wood);
 for(const x of[1.49,2.57])box(group,'Worktable joint cap',.07,.12,.53,x,.65,1.65,plum);
 const ledge=new T.Group();ledge.name='Six selected numbers';ledge.position.set(-2.2,.76,2.82);ledge.rotation.y=Math.PI;ledge.userData={hilmaGuide:true};group.add(ledge);
 box(ledge,'Reading ledge shelf',1.42,.06,.22,0,-.065,0,wood);
 box(ledge,'Wall mounted backing',1.42,.30,.035,0,.03,-.08,wood);
 const segments={a:[0,.055,.052,.008],b:[.03,.028,.008,.045],c:[.03,-.028,.008,.045],d:[0,-.055,.052,.008],e:[-.03,-.028,.008,.045],f:[-.03,.028,.008,.045],g:[0,0,.052,.008]};
 const digits={2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',7:'abc',9:'abfgcd'};
 for(const [i,number]of HILMA_NUMBERS.entries()){
  const card=new T.Group();card.name='Index card '+number;card.position.set(-.55+i*.22,.06,.005);ledge.add(card);
  box(card,'City index card',.19,.19,.014,0,0,0,i%2?plum:ink);
  for(const s of digits[number]){const [x,y,w,h]=segments[s];box(card,'Index numeral',w,h,.003,x,y,.0095,paper);}
 }
 // All ledge parts occupy the original padded wall zone below the real window.
 let disposed=false;return{group,ledge,pad,targets:[ledge],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
