// Original warm illustrated host. Front faces -Z, matching the city actors.
// The canonical source visitor remains in home-editions-scene.js.
export function buildSocratesGuide(T){
 const group=new T.Group();group.name='Socrates · illustrated city host';
 const geometries=new Set(),materials=new Set();
 const mat=color=>{const m=new T.MeshToonMaterial({color});materials.add(m);return m;};
 const palette={skin:mat('#bd896b'),cheek:mat('#cd8e73'),linen:mat('#d8c294'),fold:mat('#d4c69e'),cloak:mat('#395f61'),trim:mat('#a18150'),hair:mat('#b4b9b1'),hairShade:mat('#aeb6a9'),ink:mat('#36433f'),eye:mat('#fff3d9'),leather:mat('#79644c')};
 const mesh=(parent,geometry,material,x=0,y=0,z=0)=>{geometries.add(geometry);const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const ball=(p,r,x,y,z,m,sx=1,sy=1,sz=1)=>{const n=mesh(p,new T.SphereGeometry(r,20,14),m,x,y,z);n.scale.set(sx,sy,sz);return n;};
 const tube=(p,points,r,m)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),20,r,6,false),m);
 const body=new T.Group();group.add(body);
 // Rounded silhouette with irregular cloth folds, rather than a rigid cylinder.
 const robe=new T.CylinderGeometry(.235,.36,.98,40,12);const a=robe.attributes.position;
 for(let i=0;i<a.count;i++){const y=a.getY(i),theta=Math.atan2(a.getZ(i),a.getX(i)),f=1+.035*Math.sin(theta*9+.6)*(1-(y+.49)/1.2);a.setXYZ(i,a.getX(i)*f,y,a.getZ(i)*f);}robe.computeVertexNormals();
 mesh(body,robe,palette.linen,0,.82,0);ball(body,.28,0,1.28,0,palette.linen,1,.65,.77);
 // A teal himation crosses the shoulder and falls along one side.
 const drape=new T.Shape();drape.moveTo(-.29,1.4);drape.bezierCurveTo(-.13,1.35,.12,1.11,.3,1.05);drape.lineTo(.3,.35);drape.bezierCurveTo(.1,.36,-.11,.56,-.25,.67);drape.closePath();
 mesh(body,new T.ExtrudeGeometry(drape,{depth:.12,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.03}),palette.cloak,0,0,-.26);
 tube(body,[[-.23,1.4,-.3],[-.04,1.28,-.32],[.17,1.12,-.32],[.26,.6,-.32]],.012,palette.trim);
 for(let i=0;i<4;i++)tube(body,[[.02+i*.052,.82,-.3],[.07+i*.045,.65,-.33],[.12+i*.04,.43,-.33]],.008,palette.fold);
 const limbs=[],arms=[];
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(side*.285,1.29,0);body.add(arm);
  ball(arm,.12,0,-.09,0,side<0?palette.cloak:palette.linen,.88,1.35,.95);
  ball(arm,.075,side*.025,-.3,-.015,palette.skin,.95,1.75,1);
  const hand=ball(arm,.08,side*.03,-.46,-.035,palette.skin,.8,1.15,.6);ball(arm,.028,-side*.025,-.43,-.07,palette.skin,.9,1.2,1);
  arms.push(arm);limbs.push({part:arm,sign:side});
  const leg=new T.Group();leg.position.set(side*.145,.41,0);group.add(leg);
  ball(leg,.085,0,-.15,0,palette.skin,.8,1.6,.8);ball(leg,.13,0,-.32,-.055,palette.leather,.8,.33,1.4);
  tube(leg,[[-.07,-.295,-.13],[0,-.27,-.11],[.07,-.295,-.13]],.016,palette.trim);limbs.push({part:leg,sign:-side});
 }
 const head=new T.Group();head.position.set(0,1.63,-.012);body.add(head);
 ball(head,.244,0,0,0,palette.skin,1,1.06,.92);ball(head,.19,0,-.1,-.025,palette.skin,1.03,.8,1.05);
 for(const side of [-1,1]){
  ball(head,.054,side*.232,-.015,0,palette.skin,.62,1,.8);ball(head,.024,side*.249,-.018,-.025,palette.cheek,.55,1,1);
  ball(head,.06,side*.13,-.07,-.18,palette.cheek,1,.48,.2);
  // Small warm eyes and raised brows keep the expression kind at video distance.
  ball(head,.047,side*.091,.012,-.207,palette.eye,1.1,.63,.35);
  ball(head,.023,side*.091,.01,-.223,palette.ink,.7,.9,.35);ball(head,.007,side*.086,.018,-.232,palette.eye);
  tube(head,[[side*.045,.074,-.205],[side*.085,.087,-.216],[side*.137,.067,-.198]],.014,palette.hairShade);
 }
 ball(head,.051,0,-.035,-.228,palette.skin,1.12,.9,1);ball(head,.032,0,-.061,-.248,palette.cheek,1,.5,.5);
 // Bald crown, silver side curls and a softly layered beard.
 for(const side of [-1,1])for(let i=0;i<8;i++){const theta=.1+i*.22;ball(head,.049,side*(.215+Math.sin(theta)*.018),.13-i*.032,.065+Math.cos(theta)*.025,palette.hair,1,.9,.85);}
 ball(head,.19,0,-.157,-.12,palette.hair,1,1.04,.69);
 for(let row=0;row<3;row++)for(let i=-2;i<=2;i++){const width=1-Math.abs(i)*.1;ball(head,.047,i*.062*width,-.12-row*.053,-.222+Math.abs(i)*.014+row*.009,row===2?palette.hairShade:palette.hair,.95,1.12,.5);}
 const jaw=new T.Group();jaw.position.set(0,-.104,-.237);head.add(jaw);
 tube(jaw,[[-.042,0,0],[0,-.013,-.005],[.042,0,0]],.009,palette.ink);
 for(const side of [-1,1])ball(head,.064,side*.048,-.089,-.248,palette.hair,1,.42,.44);
 const eyes=head.children.filter(o=>o.isMesh&&o.material===palette.eye);
 group.traverse(o=>{o.userData={...o.userData,resident:true,socratesGuide:true,animated:true};});
 let disposed=false;
 function animate(time,{walking=false,talking=false,reducedMotion=false}={}){
  const gait=walking&&!reducedMotion?Math.sin(time*5.7)*.19:0;
  for(const limb of limbs)limb.part.rotation.x=gait*limb.sign;
  body.position.y=reducedMotion?0:Math.sin(time*1.7)*.006;
  head.rotation.z=talking&&!reducedMotion?Math.sin(time*1.8)*.025:0;head.rotation.y=talking&&!reducedMotion?Math.sin(time*.7)*.045:0;
  arms[1].rotation.z=talking&&!reducedMotion?-.25-Math.sin(time*2.2)*.07:0;
  arms[1].rotation.x+=talking&&!reducedMotion?-.36:0;
  jaw.scale.y=talking&&!reducedMotion?1.1+Math.abs(Math.sin(time*9))*.7:1;
  const blink=!reducedMotion&&time%5.7>5.52?.18:1;for(const eye of eyes)eye.scale.y=(eye.geometry.parameters.radius===.047?.63:1)*blink;
 }
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());group.clear();}
 return{group,head,body,limbs,animate,dispose,style:'warm-illustrated-v1'};
}
