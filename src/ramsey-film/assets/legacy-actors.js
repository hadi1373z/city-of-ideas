// Original warm illustrated host. Front faces -Z, matching the city actors.
// The canonical source visitor remains in home-editions-scene.js.
function buildSocratesGuide(T){
 const group=new T.Group();group.name='Socrates · illustrated city host';
 const geometries=new Set(),materials=new Set();
 const mat=(color,options={})=>{const m=new T.MeshToonMaterial({color,...options});materials.add(m);return m;};
 const palette={skin:mat('#ba8b6c'),cheek:mat('#be8b6c'),crease:mat('#a9795e'),linen:mat('#d0bf96'),fold:mat('#bca982'),cloak:mat('#395f61',{side:T.DoubleSide}),cloakFold:mat('#507373'),trim:mat('#a18150'),hair:mat('#a5ada3'),hairShade:mat('#829088'),ink:mat('#36433f'),iris:mat('#666e55'),eye:mat('#e5ddc8'),leather:mat('#79644c')};
 const mesh=(parent,geometry,material,x=0,y=0,z=0)=>{geometries.add(geometry);const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const ball=(p,r,x,y,z,m,sx=1,sy=1,sz=1)=>{const n=mesh(p,new T.SphereGeometry(r,20,14),m,x,y,z);n.scale.set(sx,sy,sz);return n;};
 const tube=(p,points,r,m)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),20,r,6,false),m);
 const body=new T.Group();group.add(body);
 // Rounded silhouette with irregular cloth folds, rather than a rigid cylinder.
 const robe=new T.CylinderGeometry(.235,.36,.98,40,12);const a=robe.attributes.position;
 for(let i=0;i<a.count;i++){const y=a.getY(i),theta=Math.atan2(a.getZ(i),a.getX(i)),f=1+.035*Math.sin(theta*9+.6)*(1-(y+.49)/1.2);a.setXYZ(i,a.getX(i)*f,y,a.getZ(i)*f);}robe.computeVertexNormals();
 mesh(body,robe,palette.linen,0,.82,0);ball(body,.28,0,1.28,0,palette.linen,1,.65,.77);
 // A thin, curved himation follows the body instead of forming a flat slab.
 const clothRows=[[-.29,-.11,1.41],[-.30,.10,1.31],[-.25,.27,1.12],[-.12,.32,.87],[.055,.345,.61],[.16,.345,.36]];
 const clothPoint=(row,u)=>{const x=row[0]+(row[1]-row[0])*u,y=row[2],radius=Math.max(.235+.125*Math.min(1,Math.max(0,(1.31-y)/.98)),Math.abs(x)+.018);return[x,y,-Math.sqrt(Math.max(.001,radius*radius-x*x))-.022-.006*Math.sin(u*Math.PI*8)];};
 const clothVertices=[],clothIndices=[],clothSegments=18;
 for(const row of clothRows)for(let j=0;j<=clothSegments;j++)clothVertices.push(...clothPoint(row,j/clothSegments));
 for(let i=0;i<clothRows.length-1;i++)for(let j=0;j<clothSegments;j++){const k=i*(clothSegments+1)+j;clothIndices.push(k,k+1,k+clothSegments+1,k+1,k+clothSegments+2,k+clothSegments+1);}
 const clothGeometry=new T.BufferGeometry();clothGeometry.setAttribute('position',new T.Float32BufferAttribute(clothVertices,3));clothGeometry.setIndex(clothIndices);clothGeometry.computeVertexNormals();mesh(body,clothGeometry,palette.cloak);
 tube(body,clothRows.map(row=>{const p=clothPoint(row,0);p[2]-=.006;return p;}),.009,palette.trim);
 for(const u of [.28,.57,.82])tube(body,clothRows.slice(1).map(row=>{const p=clothPoint(row,u);p[2]-=.009;return p;}),.004,palette.cloakFold);
 const standingGarments=[...body.children];
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
 // The broad, mature face and snub nose follow the classical bust tradition.
 const head=new T.Group();head.position.set(0,1.63,-.012);body.add(head);
 ball(head,.229,0,.006,0,palette.skin,1.04,1.12,.94);ball(head,.177,0,-.089,-.015,palette.skin,1.13,.83,1.01);
 const eyes=[];
 for(const side of [-1,1]){
  ball(head,.051,side*.226,-.018,.004,palette.skin,.57,1,.74);ball(head,.022,side*.243,-.021,-.02,palette.crease,.5,.95,.7);
  ball(head,.064,side*.137,-.061,-.169,palette.skin,.98,.62,.43);
  const eye=new T.Group();eye.position.set(side*.087,.012,-.207);head.add(eye);eyes.push(eye);
  ball(eye,.036,0,0,0,palette.eye,1.08,.43,.25);
  ball(eye,.015,0,-.001,-.011,palette.iris,.85,.95,.28);ball(eye,.009,0,-.001,-.015,palette.ink,.75,1,.25);
  ball(eye,.0035,-side*.003,.003,-.019,palette.eye);
  tube(head,[[side*.05,.024,-.211],[side*.086,.033,-.223],[side*.126,.022,-.205]],.008,palette.skin);
  tube(head,[[side*.051,-.002,-.21],[side*.088,-.009,-.217],[side*.125,-.001,-.204]],.005,palette.crease);
  ball(head,.061,side*.089,.058,-.182,palette.skin,1.1,.38,.5);
  tube(head,[[side*.039,.063,-.212],[side*.083,.077+(side<0?.006:0),-.215],[side*.14,.06,-.187]],.011,palette.hairShade);
  tube(head,[[side*.136,.006,-.199],[side*.157,-.003,-.186],[side*.171,-.011,-.171]],.003,palette.crease);
  tube(head,[[side*.065,-.082,-.225],[side*.097,-.105,-.207],[side*.111,-.122,-.188]],.003,palette.crease);
 }
 // The upper bridge stays short; broad wings and upturned nostrils carry the likeness.
 ball(head,.043,0,-.011,-.218,palette.skin,.91,1.12,1.08);
 ball(head,.06,0,-.047,-.248,palette.skin,1.04,.62,.82);
 for(const side of [-1,1]){ball(head,.024,side*.042,-.06,-.241,palette.skin,1.05,.7,.9);ball(head,.009,side*.033,-.071,-.268,palette.crease,1.16,.42,.45);}
 for(let i=0;i<2;i++){const y=.125+i*.042,z=-.207+Math.pow(y/.25,2)*.09;tube(head,[[-.097,y-.004,z+.012],[0,y+.008,z],[.097,y-.004,z+.012]],.0025,palette.crease);}
 // Short curls leave the high crown exposed. Smaller curls define the beard's surface.
 for(const side of [-1,1])for(let i=0;i<7;i++){
  ball(head,.034,side*(.215+Math.sin(i*.35)*.011),.13-i*.035,.04+(i>3?.025:0),i%3?palette.hair:palette.hairShade,.85,1.03,.9);
  if(i<3)ball(head,.029,side*.209,.106-i*.031,-.068,palette.hairShade,.75,1.1,.65);
 }
 ball(head,.154,0,-.172,-.083,palette.hairShade,1.11,1.09,.85);
 const curlWidths=[.165,.166,.147,.116,.072];
 for(let row=0;row<curlWidths.length;row++){
  const count=row===4?3:row===3?5:7;
  for(let i=0;i<count;i++){
   const x=(i/(count-1)*2-1)*curlWidths[row],y=-.117-row*.039,z=-.212+Math.abs(x)*.18+row*.007;
   ball(head,.031,x,y,z,(i+row)%3?palette.hair:palette.hairShade,.97,1.08,.72);
   const curl=[];for(let j=0;j<9;j++){const angle=j/8*Math.PI*1.65,r=.015-j*.0007;curl.push([x+Math.cos(angle)*r,y+Math.sin(angle)*r,z-.023-j*.00012]);}
   tube(head,curl,.0035,palette.hairShade);
  }
 }
 const jaw=new T.Group();jaw.position.set(0,-.116,-.25);head.add(jaw);
 tube(jaw,[[-.034,0,0],[0,-.007,-.004],[.034,.002,0]],.007,palette.ink);
 for(const side of [-1,1]){
  const moustache=ball(head,.05,side*.043,-.09,-.244,palette.hair,.96,.38,.42);moustache.rotation.z=side*.12;
  tube(head,[[side*.018,-.089,-.265],[side*.044,-.088,-.266],[side*.076,-.103,-.247]],.0035,palette.hairShade);
 }
 // Seated branches preserve the standing model and bend the robe over a real lap.
 const seatedGarments=new T.Group();seatedGarments.name='socrates-seated-garments';body.add(seatedGarments);seatedGarments.visible=false;
 for(const original of standingGarments){
  original.updateMatrix();const geometry=original.geometry.clone();geometry.applyMatrix4(original.matrix);
  const positions=geometry.attributes.position;
  for(let i=0;i<positions.count;i++){const y=positions.getY(i),d=.9-y;if(d>0){const along=Math.min(d,.34);positions.setY(i,d<=.34?.9-d*.15:.849-(d-.34)*1.15);positions.setZ(i,positions.getZ(i)-along*.98);}}
  geometry.computeVertexNormals();mesh(seatedGarments,geometry,original.material);
 }
 const seatedPose=new T.Group();seatedPose.name='socrates-seated-legs';group.add(seatedPose);seatedPose.visible=false;
 const seatedArms=[];
 const segment=(parent,start,end,r1,r2,material)=>{const a=new T.Vector3(...start),b=new T.Vector3(...end),d=b.clone().sub(a);const m=mesh(parent,new T.CylinderGeometry(r2,r1,d.length(),16,4),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;};
 for(const side of [-1,1]){
  segment(seatedPose,[side*.14,.61,.02],[side*.16,.58,-.33],.097,.089,palette.linen);
  ball(seatedPose,.089,side*.16,.58,-.33,palette.linen,1,1,.98);
  segment(seatedPose,[side*.16,.55,-.33],[side*.16,.13,-.35],.071,.059,palette.skin);
  ball(seatedPose,.13,side*.16,.085,-.40,palette.leather,.8,.33,1.4);
  tube(seatedPose,[[side*.16-.07,.108,-.49],[side*.16,.126,-.455],[side*.16+.07,.108,-.49]],.014,palette.trim);
  const arm=new T.Group();arm.position.set(side*.285,1.29,0);body.add(arm);arm.visible=false;seatedArms.push(arm);
  ball(arm,.103,0,-.025,0,side<0?palette.cloak:palette.linen,.92,.9,.92);
  segment(arm,[0,-.025,0],[side*.035,-.17,-.10],.09,.07,side<0?palette.cloak:palette.linen);
  ball(arm,.066,side*.035,-.17,-.10,palette.skin);
  segment(arm,[side*.035,-.17,-.10],[side*.025,-.11,-.40],.067,.049,palette.skin);
  ball(arm,.074,side*.025,-.11,-.44,palette.skin,.8,.58,1.12);
  ball(arm,.025,-side*.023,-.10,-.43,palette.skin,.75,.9,1.1);
 }
 group.traverse(o=>{o.userData={...o.userData,resident:true,socratesGuide:true,animated:true};});
 let disposed=false;
 function animate(time,{walking=false,talking=false,reducedMotion=false,seated=false}={}){
  if(disposed)return;
  const gait=walking&&!reducedMotion&&!seated?Math.sin(time*5.7)*.19:0;
  for(const garment of standingGarments)garment.visible=!seated;seatedGarments.visible=seated;seatedPose.visible=seated;
  for(const limb of limbs)limb.part.visible=!seated;
  seatedArms.forEach((arm,i)=>{arm.visible=seated;arm.rotation.set(0,0,0);if(seated&&talking&&!reducedMotion&&i===1){arm.rotation.x=.035+Math.sin(time*1.8)*.025;arm.rotation.z=-.025-Math.sin(time*1.3)*.018;}});
  group.userData.seated=seated;
  for(const limb of limbs)limb.part.rotation.x=gait*limb.sign;
  body.position.y=(seated?-.28:0)+(reducedMotion?0:Math.sin(time*1.7)*(seated?.003:.006));
  head.rotation.x=seated&&talking&&!reducedMotion?Math.sin(time*1.3)*.018:0;
  head.rotation.z=talking&&!reducedMotion?Math.sin(time*1.8)*.025:0;head.rotation.y=talking&&!reducedMotion?Math.sin(time*.7)*.045:0;
  arms[1].rotation.z=talking&&!reducedMotion?-.25-Math.sin(time*2.2)*.07:0;
  arms[1].rotation.x+=talking&&!reducedMotion?-.36:0;
  jaw.scale.y=talking&&!reducedMotion?1.1+Math.abs(Math.sin(time*9))*.7:1;
  const blink=!reducedMotion&&time%5.7>5.52?.16:1;for(const eye of eyes)eye.scale.y=blink;
 }
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());group.clear();}
 return{group,head,body,limbs,seatedPose,seatedArms,animate,dispose,style:'warm-illustrated-v1'};
}


// Warm illustrated companions for Socrates. Every character faces -Z.
// Zarathustra is a literary interpretation, not a historical portrait.
function buildLiteraryCharacter(T, id) {
  if (id !== 'nietzsche' && id !== 'zarathustra') {
    throw new Error(`Unknown literary character: ${id}`);
  }
  const isNietzsche = id === 'nietzsche';
  const group = new T.Group();
  group.name = isNietzsche ? 'Nietzsche · illustrated author' : 'Zarathustra · illustrated wanderer';
  const geometries = new Set(), materials = new Set();
  const material = (color, options = {}) => {
    const value = new T.MeshToonMaterial({ color, ...options });
    materials.add(value);
    return value;
  };
  const palette = {
    skin: material(isNietzsche ? '#bd927c' : '#b98560'),
    cheek: material(isNietzsche ? '#b78973' : '#c58f6c'),
    hair: material(isNietzsche ? '#392e27' : '#51483a'),
    hairLight: material(isNietzsche ? '#514136' : '#857861'),
    eye: material(isNietzsche ? '#e1d7c6' : '#fff3db'), ink: material(isNietzsche ? '#292a27' : '#343c39'),
    crease: material(isNietzsche ? '#8f6654' : '#a47a5d'), vest: material('#3f3b35'),
    iris: material(isNietzsche ? '#5c5645' : '#8d7345'),
    cloth: material(isNietzsche ? '#625d52' : '#c6ae7d'),
    fold: material(isNietzsche ? '#756c5d' : '#aa8d5f'),
    cloak: material('#875341', { side: T.DoubleSide }),
    linen: material(isNietzsche ? '#e5dfd0' : '#e5d5b2'), trim: material(isNietzsche ? '#958268' : '#b99a62'),
    leather: material('#594838'), wood: material('#796044')
  };
  const mesh = (parent, geometry, mat, x = 0, y = 0, z = 0) => {
    geometries.add(geometry);
    const value = new T.Mesh(geometry, mat);
    value.position.set(x, y, z);
    value.castShadow = value.receiveShadow = true;
    parent.add(value);
    return value;
  };
  const ball = (parent, radius, x, y, z, mat, sx = 1, sy = 1, sz = 1) => {
    const value = mesh(parent, new T.SphereGeometry(radius, 20, 14), mat, x, y, z);
    value.scale.set(sx, sy, sz);
    return value;
  };
  const tube = (parent, points, radius, mat) => mesh(parent,
    new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), 18, radius, 7, false), mat);
  const panel = (parent, points, mat, z) => {
    const shape = new T.Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach(p => shape.lineTo(...p));
    shape.closePath();
    return mesh(parent, new T.ExtrudeGeometry(shape, {
      depth: .024, bevelEnabled: true, bevelSize: .009,
      bevelThickness: .009, bevelSegments: 2, steps: 1
    }), mat, 0, 0, z);
  };
  const cloth = (top, bottom, height, folds = .025, open = false, start = 0, length = Math.PI * 2) => {
    const geometry = new T.CylinderGeometry(top, bottom, height, 36, 10, open, start, length);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const ripple = 1 + folds * Math.sin(Math.atan2(z, x) * 11 + .5) * (.7 - y / height * .3);
      positions.setXYZ(i, x * ripple, y, z * ripple);
    }
    geometry.computeVertexNormals();
    return geometry;
  };
  const body = new T.Group();
  body.name = `${id}-body`;
  group.add(body);
  const limbs = [], arms = [], legs = [], eyes = [];

  if (isNietzsche) {
    // A fitted jacket ends at the upper thigh, leaving two full trouser legs.
    const jacket = new T.Shape();
    jacket.moveTo(-.205, .785);
    jacket.lineTo(-.228, 1.27);
    jacket.quadraticCurveTo(-.24, 1.405, -.14, 1.43);
    jacket.lineTo(.14, 1.43);
    jacket.quadraticCurveTo(.24, 1.405, .228, 1.27);
    jacket.lineTo(.205, .785);
    jacket.lineTo(.07, .765);
    jacket.lineTo(0, .835);
    jacket.lineTo(-.07, .765);
    jacket.closePath();
    mesh(body, new T.ExtrudeGeometry(jacket, {depth:.275,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1}), palette.cloth, 0, 0, -.138);
    mesh(body, new T.CylinderGeometry(.067, .074, .13, 20), palette.skin, 0, 1.475, 0);
    mesh(body, new T.CylinderGeometry(.069,.077,.078,24), palette.linen, 0, 1.435, -.006);
    panel(body, [[-.092, 1.435], [.092, 1.435], [.063, 1.12], [-.063, 1.12]], palette.linen, -.172);
    panel(body, [[-.066, 1.31], [.066, 1.31], [.09, .9], [-.09, .9]], palette.vest, -.194);
    for (const side of [-1, 1]) {
      panel(body, [[side * .175, 1.42], [side * .079, 1.43], [side * .028, 1.14], [side * .145, 1.255]], palette.fold, -.205);
      panel(body, [[side * .079, 1.44], [side * .009, 1.425], [side * .035, 1.335]], palette.linen, -.217);
      tube(body, [[side*.12, .985, -.168], [side*.18, .98, -.155]], .005, palette.fold);
    }
    ball(body, .032, 0, 1.385, -.235, palette.ink, .95, .77, .5);
    panel(body, [[-.021,1.37],[.035,1.36],[.057,1.17],[-.035,1.125],[-.045,1.19]], palette.ink, -.235);
    for (let i = 0; i < 4; i++) ball(body, .011, 0, 1.22 - i * .075, -.222, palette.trim, 1, 1, .45);
    tube(body, [[.065, 1.06, -.219], [.105, 1.025, -.2], [.16, 1.045, -.177]], .004, palette.trim);
  } else {
    mesh(body, cloth(.22, .33, 1.03, .04), palette.cloth, 0, .825, 0);
    ball(body, .25, 0, 1.355, 0, palette.cloth, 1, .45, .74);
    // An open-front cloak leaves the lighter robe visible from the player's side.
    const gap = 1.48;
    mesh(body, cloth(.275, .395, 1.08, .035, true, Math.PI + gap / 2, Math.PI * 2 - gap), palette.cloak, 0, .88, .015);
    panel(body, [[-.285, 1.42], [-.08, 1.38], [.17, 1.13], [.1, .84], [-.26, 1.1]], palette.cloak, -.25);
    tube(body, [[-.27, 1.41, -.25], [-.08, 1.31, -.28], [.16, 1.12, -.27]], .012, palette.trim);
    for (const side of [-1, 1]) {
      tube(body, [[side * .19, 1.39, -.205], [side * .23, .92, -.242], [side * .27, .35, -.274]], .01, palette.trim);
    }
    mesh(body, new T.CylinderGeometry(.244, .246, .065, 32), palette.leather, 0, .94, 0);
    ball(body, .03, -.05, .94, -.252, palette.trim, 1, 1.05, .3);
    for (let i = -2; i <= 2; i++) tube(body,
      [[i * .063, .87, -.239], [i * .076, .63, -.27], [i * .087, .34, -.293]], .007, palette.fold);
  }

  const standingGarments = [...body.children];

  for (const side of [-1, 1]) {
    const arm = new T.Group();
    arm.name = `${id}-${side < 0 ? 'left' : 'right'}-arm`;
    arm.position.set(side * (isNietzsche ? .232 : .245), isNietzsche ? 1.385 : 1.36, 0);
    body.add(arm);
    const sleeve = !isNietzsche && side < 0 ? palette.cloak : palette.cloth;
    // Continuous tapered sleeves connect to the shoulders, avoiding toy-like beads.
    ball(arm, .087, 0, -.028, .004, sleeve, 1, .75, .93);
    const sleeveMesh = mesh(arm, new T.CylinderGeometry(.081, .059, .475, 20, 5), sleeve, side*.015, -.255, -.006);
    sleeveMesh.rotation.z = side * .055;
    if (isNietzsche) mesh(arm, new T.CylinderGeometry(.06,.061,.035,18), palette.linen, side*.028, -.501, -.009);
    ball(arm, .061, side * .031, -.553, -.024, palette.skin, .82, 1.12, .68);
    ball(arm, .024, -side * .01, -.535, -.053, palette.skin, .8, 1.15, .9);
    arms.push(arm);
    limbs.push({ part: arm, sign: side, kind: 'arm', staff: !isNietzsche && side > 0 });

    const leg = new T.Group();
    leg.name = `${id}-${side < 0 ? 'left' : 'right'}-leg`;
    leg.position.set(side * (isNietzsche ? .112 : .13), isNietzsche ? .91 : .4, 0);
    group.add(leg);
    if (isNietzsche) {
      mesh(leg, new T.CylinderGeometry(.098, .071, .745, 20, 6), palette.cloth, 0, -.373, 0);
      tube(leg, [[0,-.08,-.098],[0,-.39,-.087],[0,-.72,-.071]], .0035, palette.fold);
      ball(leg, .112, 0, -.802, -.048, palette.leather, .78, .36, 1.4);
    } else {
      ball(leg, .078, 0, -.145, 0, palette.skin, .85, 1.6, .85);
      ball(leg, .12, 0, -.3, -.049, palette.leather, .86, .35, 1.45);
      tube(leg, [[-.066, -.28, -.12], [0, -.257, -.095], [.066, -.28, -.12]], .015, palette.trim);
    }
    legs.push(leg);
    limbs.push({ part: leg, sign: -side, kind: 'leg' });
  }
  if (!isNietzsche) {
    const staffArm = arms[1];
    tube(staffArm, [[.065, -1.3, -.05], [.065, -.55, -.055], [.09, .25, -.05], [.045, .39, -.035]], .022, palette.wood);
    for (let i = 0; i < 5; i++) ball(staffArm, .027, .066, -.49 - i * .025, -.054, palette.leather, 1, .3, 1);
  }

  const head = new T.Group();
  head.name = `${id}-head`;
  head.position.set(0, isNietzsche ? 1.67 : 1.665, -.008);
  body.add(head);
  let jaw;
  if (isNietzsche) {
    // Armand Assante's Nietzsche in When Nietzsche Wept: mature planes, a severe
    // folded brow, swept-back volume and a bushy three-dimensional moustache.
    const faceGeometry=new T.SphereGeometry(.199,32,24),p=faceGeometry.attributes.position;
    for(let i=0;i<p.count;i++) {
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i),ny=y/.199;
      const plane=ny<-.22?1.045:ny>.45?.94:1;
      p.setXYZ(i,x*.84*plane,y*1.19,z*.80-(z<0&&y<-.07?.009:0));
    }
    faceGeometry.computeVertexNormals();mesh(head,faceGeometry,palette.skin);
    ball(head,.086,0,-.166,-.035,palette.skin,1.12,.73,1.03);
    ball(head,.078,0,-.202,-.068,palette.skin,1.12,.5,1.0);
    for(const side of [-1,1]) {
      ball(head,.043,side*.168,-.013,.012,palette.skin,.57,1,.72);
      ball(head,.018,side*.178,-.014,-.007,palette.cheek,.5,1,.9);
      // Cheek planes, a faint nasolabial fold and lower orbital rim.
      tube(head,[[side*.034,-.095,-.196],[side*.064,-.126,-.179],[side*.077,-.149,-.163]],.0028,palette.crease);
      const eye=new T.Group();eye.position.set(side*.066,.029,-.151);head.add(eye);eyes.push(eye);
      ball(eye,.028,0,0,0,palette.eye,1.06,.32,.27);
      ball(eye,.012,0,-.001,-.008,palette.iris,.83,.74,.35);
      ball(eye,.007,0,-.001,-.012,palette.ink,.78,.85,.28);
      ball(eye,.0025,-side*.003,.002,-.014,palette.eye);
      tube(eye,[[-.03,.003,-.008],[0,.009,-.013],[.03,.003,-.008]],.007,palette.skin);
      tube(eye,[[-.027,-.006,-.007],[0,-.012,-.01],[.026,-.006,-.007]],.0033,palette.crease);
      tube(head,[[side*.023,.063,-.155],[side*.057,.078,-.149],[side*.089,.076,-.134],[side*.12,.061,-.113]],.0065,palette.hair);
      tube(head,[[side*.038,-.006,-.16],[side*.072,-.014,-.151],[side*.109,-.004,-.136]],.0025,palette.crease);
      tube(head,[[side*.119,.023,-.139],[side*.139,.008,-.117]],.0025,palette.crease);
    }
    // Thin round wire spectacles follow the seated dialogue frames from the film.
    // There are no lens surfaces, so the small deep-set eyes remain visible.
    const spectacles=new T.Group();spectacles.name='nietzsche-wire-spectacles';head.add(spectacles);
    const wire=material('#514b40');
    for(const side of [-1,1]) {
      const rim=mesh(spectacles,new T.TorusGeometry(.04,.0026,6,36),wire,side*.066,.01,-.184);
      rim.rotation.y=-side*.08;
      tube(spectacles,[[side*.106,.017,-.181],[side*.15,.021,-.115],[side*.176,.002,.018]],.0026,wire);
    }
    tube(spectacles,[[-.026,.019,-.185],[0,.027,-.208],[.026,.019,-.185]],.0026,wire);
    // One continuous tapered nose surface, embedded into the facial mesh.
    // The rear of each cross-section penetrates the face, preventing a floating nose.
    const noseRows=[
      [ .092,.019,.018,-.137],
      [ .063,.024,.024,-.149],
      [ .020,.027,.031,-.164],
      [-.030,.027,.040,-.179],
      [-.063,.031,.044,-.188],
      [-.086,.036,.041,-.189],
      [-.104,.031,.030,-.179],
      [-.115,.017,.018,-.164]
    ];
    const noseVertices=[],noseIndices=[],noseRadial=20;
    for(let r=0;r<noseRows.length;r++){
      const [y,rx,rz,cz]=noseRows[r];
      for(let j=0;j<noseRadial;j++){
        const a=j/noseRadial*Math.PI*2;
        noseVertices.push(Math.cos(a)*rx,y,cz+Math.sin(a)*rz);
        if(r<noseRows.length-1){
          const k=r*noseRadial+j,n=r*noseRadial+(j+1)%noseRadial;
          noseIndices.push(k,k+noseRadial,n,n,k+noseRadial,(r+1)*noseRadial+(j+1)%noseRadial);
        }
      }
    }
    const noseGeometry=new T.BufferGeometry();
    noseGeometry.setAttribute('position',new T.Float32BufferAttribute(noseVertices,3));
    noseGeometry.setIndex(noseIndices);noseGeometry.computeVertexNormals();
    mesh(head,noseGeometry,palette.skin);
    for(const side of [-1,1]) {
      // Nostrils sit on the underside, not between the nose and the face.
      ball(head,.0055,side*.020,-.105,-.196,palette.crease,1,.45,.48);
    }
    jaw=new T.Group();jaw.position.set(0,-.17,-.159);head.add(jaw);
    tube(jaw,[[-.038,0,0],[0,-.003,-.009],[.038,.001,0]],.0045,palette.crease);
    ball(jaw,.029,0,-.011,-.001,palette.cheek,1.15,.13,.35);
    // Brushed-back hair has height and a visible receding temple line.
    ball(head,.177,0,.172,.054,palette.hair,1.08,.66,1.04);
    ball(head,.125,0,.014,.106,palette.hair,1.3,1.23,.63);
    for(const side of [-1,1]) {
      ball(head,.058,side*.158,.035,.065,palette.hair,.59,2.15,1.18);
      ball(head,.033,side*.159,-.043,.023,palette.hair,.38,1.3,.65);
    }
    for(let i=0;i<9;i++) {
      const x=-.137+i*.034;
      tube(head,[[x,.171+Math.cos(i*.4)*.012,-.047],[x*.84-.013,.254+Math.sin(i*.41)*.016,-.003],[x*.77-.018,.224,.127]],.007,i%4===0?palette.hairLight:palette.hair);
    }
    for(const side of [-1,1])tube(head,[[side*.132,.167,-.035],[side*.176,.138,.029],[side*.177,.025,.109],[side*.132,-.105,.13]],.009,palette.hairLight);
    // Tapered rounded sweeps supply real moustache volume and descending corners.
    const moustacheSweep=(side)=>{
      const curve=new T.CatmullRomCurve3([[.004,-.114,-.215],[.054,-.122,-.225],[.096,-.146,-.211],[.116,-.184,-.19],[.142,-.178,-.164]].map(([x,y,z])=>new T.Vector3(side*x,y,z)));
      const segments=32,radial=12,frames=curve.computeFrenetFrames(segments,false),positions=[],indices=[],radii=[.026,.037,.030,.014,.0015];
      for(let i=0;i<=segments;i++) {
        const t=i/segments,center=curve.getPointAt(t),a=t*(radii.length-1),lo=Math.min(radii.length-2,Math.floor(a)),radius=radii[lo]+(radii[lo+1]-radii[lo])*(a-lo);
        for(let j=0;j<=radial;j++) {
          const angle=j/radial*Math.PI*2;
          const n=frames.normals[i].clone().multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i],Math.sin(angle));
          positions.push(center.x+n.x*radius,center.y+n.y*radius,center.z+n.z*radius);
          if(i<segments&&j<radial){const k=i*(radial+1)+j;indices.push(k,k+radial+1,k+1,k+1,k+radial+1,k+radial+2);}
        }
      }
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();mesh(head,g,palette.hair);
    };
    ball(head,.042,0,-.123,-.218,palette.hair,1.06,.62,.63);
    for(const side of [-1,1]) {
      moustacheSweep(side);
      for(let i=0;i<5;i++) {
        const shift=i*.006;
        tube(head,[[side*(.014+shift),-.105+i*.003,-.239],[side*(.058+shift),-.125+i*.004,-.254],[side*(.097+shift*.5),-.162+i*.004,-.232],[side*(.119+shift*.25),-.186+i*.003,-.198]],.0022,i%3===0?palette.hairLight:palette.hair);
      }
    }
  } else {
  // Longer, narrower heads and a defined chin keep both figures visibly adult.
  const faceGeometry = new T.SphereGeometry(.199, 24, 18);
  const faceVertices = faceGeometry.attributes.position;
  for (let i=0;i<faceVertices.count;i++) {
    const x=faceVertices.getX(i), y=faceVertices.getY(i), z=faceVertices.getZ(i);
    const jawTaper=y<-.045 ? 1-Math.min(.1,(-y-.045)*.7) : 1;
    faceVertices.setXYZ(i,x*(isNietzsche?.84:.88)*jawTaper,y*1.1,z*.81);
  }
  faceGeometry.computeVertexNormals();
  mesh(head, faceGeometry, palette.skin);
  ball(head, .09, 0, -.143, -.029, palette.skin, 1.08, .69, 1.04);
  for (const side of [-1, 1]) {
    ball(head, .043, side * (isNietzsche?.168:.175), -.013, .004, palette.skin, .57, 1, .72);
    ball(head, .018, side * (isNietzsche?.177:.184), -.014, -.018, palette.cheek, .5, 1, .9);
    ball(head, .032, side * .11, -.068, -.131, palette.cheek, 1, .43, .13);
    const eye = new T.Group();
    eye.position.set(side * .067, .024, -.152);
    head.add(eye);
    ball(eye, .034, 0, 0, 0, palette.eye, 1.04, .43, .34);
    ball(eye, .016, 0, -.001, -.011, palette.iris, .8, .74, .3);
    ball(eye, .009, 0, -.001, -.016, palette.ink, .72, .85, .3);
    ball(eye, .0035, -side * .004, .004, -.02, palette.eye);
    tube(eye, [[-.033,.004,-.008],[0,.012,-.013],[.033,.004,-.008]], .0065, palette.skin);
    tube(eye, [[-.03,-.007,-.007],[0,-.013,-.011],[.03,-.007,-.007]], .0035, palette.cheek);
    eyes.push(eye);
    tube(head, [[side * .031, .067, -.15], [side * .068, isNietzsche ? .073 : .079, -.164], [side * .109, .059, -.143]], .011, palette.hair);
    tube(head, [[side*.047,-.005,-.155],[side*.079,-.012,-.152],[side*.107,-.005,-.139]], .0025, palette.cheek);
  }
  ball(head, .034, 0, -.02, -.177, palette.skin, .81, 1.6, 1.17);
  ball(head, .031, 0, -.064, -.21, palette.skin, .96, .67, .8);
  for(const side of [-1,1]) ball(head,.017,side*.022,-.068,-.195,palette.skin,1,.65,.8);
  jaw = new T.Group();
  jaw.position.set(0, -.158, -.139);
  head.add(jaw);
  tube(jaw, [[-.032, 0, 0], [0, -.004, -.006], [.032, 0, 0]], .005, palette.ink);

    // Broad continuous hair masses and a tapered beard replace clustered curls.
    ball(head, .178, 0, .135, .042, palette.hair, 1.06, .53, .98);
    for (const side of [-1, 1]) {
      ball(head,.061,side*.159,-.005,.067,palette.hair,.68,2.5,1.05);
      tube(head, [[side*.04,.204,.02],[side*.13,.174,.025],[side*.17,.075,.063],[side*.162,-.11,.085]], .009, palette.hairLight);
      tube(head, [[side*.08,.197,.057],[side*.163,.13,.07],[side*.171,-.065,.11]], .005, palette.hairLight);
    }
    ball(head, .127, 0, -.157, -.046, palette.hair, 1, .94, .84);
    panel(head, [[-.137,-.062],[-.139,-.142],[-.105,-.213],[0,-.251],[.105,-.213],[.139,-.142],[.137,-.062],
      [.1,-.108],[.044,-.121],[-.044,-.121],[-.1,-.108]], palette.hair, -.168);
    for(let i=-3;i<=3;i++) tube(head,
      [[i*.035,-.131,-.185],[i*.03,-.177,-.183],[i*.019,-.229+Math.abs(i)*.009,-.172]],
      .0045,Math.abs(i)%2?palette.hairLight:palette.hair);
    for(const side of [-1,1]) {
      ball(head,.05,side*.04,-.095,-.184,palette.hair,1.06,.38,.5);
      tube(head,[[side*.015,-.087,-.207],[side*.049,-.096,-.21],[side*.086,-.118,-.184]],.004,palette.hairLight);
    }
    jaw.position.z = -.199;
  }

  // The seated pose has real bent legs, table-resting arms and draped lap cloth.
  // Face and head geometry is shared unchanged with the standing character.
  const seatedGarments = new T.Group();
  seatedGarments.name = `${id}-seated-garments`;
  body.add(seatedGarments); seatedGarments.visible = false;
  for (const original of standingGarments) {
    original.updateMatrix();
    const geometry = original.geometry.clone(); geometry.applyMatrix4(original.matrix);
    const positions = geometry.attributes.position;
    for (let i=0;i<positions.count;i++) {
      const y=positions.getY(i), d=.9-y;
      if (d>0) {
        positions.setY(i,d<=.34 ? .9-d*.15 : .849-(d-.34)*1.15);
        positions.setZ(i,positions.getZ(i)-Math.min(d,.34)*.98);
      }
    }
    geometry.computeVertexNormals(); mesh(seatedGarments,geometry,original.material);
  }
  const seatedPose = new T.Group(); seatedPose.name=`${id}-seated-legs`;
  group.add(seatedPose); seatedPose.visible=false;
  const seatedArms=[];
  const segment=(parent,start,end,r1,r2,mat)=>{
    const a=new T.Vector3(...start),b=new T.Vector3(...end),d=b.clone().sub(a);
    const m=mesh(parent,new T.CylinderGeometry(r2,r1,d.length(),18,4),mat);
    m.position.copy(a).add(b).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()); return m;
  };
  for(const side of [-1,1]) {
    segment(seatedPose,[side*.14,.61,.02],[side*.16,.58,-.33],.098,.087,palette.cloth);
    ball(seatedPose,.087,side*.16,.58,-.33,palette.cloth);
    segment(seatedPose,[side*.16,.55,-.33],[side*.16,.13,-.35],isNietzsche?.083:.068,isNietzsche?.069:.057,isNietzsche?palette.cloth:palette.skin);
    ball(seatedPose,.118,side*.16,.085,-.40,palette.leather,.81,.35,1.4);
    if(!isNietzsche)tube(seatedPose,[[side*.16-.066,.105,-.485],[side*.16,.123,-.45],[side*.16+.066,.105,-.485]],.014,palette.trim);
    const arm=new T.Group(), shoulder=isNietzsche?1.385:1.36;
    arm.position.set(side*(isNietzsche?.232:.245),shoulder,0);body.add(arm);arm.visible=false;seatedArms.push(arm);
    const sleeve=!isNietzsche&&side<0?palette.cloak:palette.cloth;
    const elbow=[side*.035,1.12-shoulder,-.10],wrist=[side*.025,1.18-shoulder,-.40];
    ball(arm,.087,0,-.026,0,sleeve,1,.8,.94);
    segment(arm,[0,-.026,0],elbow,.081,.068,sleeve);
    ball(arm,.068,...elbow,sleeve);
    segment(arm,elbow,wrist,.065,.053,sleeve);
    if(isNietzsche)segment(arm,[wrist[0],wrist[1],wrist[2]+.025],[wrist[0],wrist[1],wrist[2]-.005],.054,.054,palette.linen);
    ball(arm,.066,wrist[0],wrist[1],-.445,palette.skin,.84,.55,1.1);
    ball(arm,.023,-side*.022,wrist[1]+.008,-.433,palette.skin,.8,.9,1.1);
  }
  if(!isNietzsche) {
    // Stowed beside the chair, behind the sitter's elbow and clear of the desk.
    tube(seatedPose,[[.46,.025,.24],[.48,.82,.26],[.55,1.48,.29],[.51,1.61,.29]],.022,palette.wood);
  }

  group.traverse(object => {
    object.userData = { ...object.userData, animated: true, literaryResident: id };
  });
  let disposed = false;
  function animate(time, { talking = false, walking = false, reducedMotion = false, seated = false } = {}) {
    if (disposed) return;
    const motion = !reducedMotion;
    const gait = walking && motion && !seated ? Math.sin(time * 5.6) * .17 : 0;
    for(const garment of standingGarments)garment.visible=!seated;
    seatedGarments.visible=seated;seatedPose.visible=seated;
    for(const limb of limbs)limb.part.visible=!seated;
    seatedArms.forEach((arm,i)=>{
      arm.visible=seated;arm.rotation.set(0,0,0);
      if(seated&&talking&&motion&&i===0){arm.rotation.x=.035+Math.sin(time*1.8)*.025;arm.rotation.z=.025+Math.sin(time*1.3)*.018;}
    });
    group.userData.seated=seated;
    for (const limb of limbs) {
      limb.part.rotation.x = gait * limb.sign * (limb.staff ? .2 : 1);
      limb.part.rotation.z = 0;
    }
    body.position.y = (seated?-.28:0)+(motion ? Math.sin(time * 1.6 + (isNietzsche ? 0 : 1)) * (seated?.003:.005) : 0);
    head.rotation.x = seated && talking && motion ? Math.sin(time*1.3)*.012 : 0;
    head.rotation.z = talking && motion ? Math.sin(time * 1.9) * (seated?.009:.02) : 0;
    head.rotation.y = talking && motion ? Math.sin(time * .8) * (seated?.022:.035) : 0;
    if (talking && motion) {
      const freeArm = arms[0];
      freeArm.rotation.z = .15 + Math.sin(time * 2) * .045;
      freeArm.rotation.x -= .2;
    }
    jaw.scale.y = talking && motion ? 1 + Math.abs(Math.sin(time * 8)) * (seated?.18:.6) : 1;
    const phase = ((time + (isNietzsche ? .6 : 2.1)) % 5.8 + 5.8) % 5.8;
    const blink = motion && phase > 5.63 ? .13 : 1;
    for (const eye of eyes) eye.scale.y = blink;
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    group.removeFromParent();
    geometries.forEach(value => value.dispose());
    materials.forEach(value => value.dispose());
    group.clear();
    geometries.clear();
    materials.clear();
  }
  return { group, head, body, limbs, arms, legs, eyes, seatedPose, seatedArms, animate, dispose, style: 'warm-illustrated-v1', id };
}

// A rigid Guy Fawkes mask and dark hood, facing -Z like the other companions.
function buildAnonymousCharacter(T) {
  const id = 'anonymous';
  const group = new T.Group();
  group.name = 'Anonymous · masked companion';
  const geometries = new Set(), materials = new Set();
  const material = (color, options = {}) => {
    const value = new T.MeshToonMaterial({ color, ...options });
    materials.add(value);
    return value;
  };
  const palette = {
    coat: material('#16191e'), fold: material('#32353b'),
    hood: material('#111419'), lining: material('#080a0e'),
    trousers: material('#1e2228'), leather: material('#101216'),
    mask: material('#f2f0ec', { side: T.DoubleSide }),
    ink: material('#08090c', { side: T.DoubleSide }),
    blush: material('#d7a4a1', { side: T.DoubleSide }),
    crease: material('#aaa7a4', { side: T.DoubleSide }),
    metal: material('#817d65')
  };
  const mesh = (parent, geometry, mat, x = 0, y = 0, z = 0) => {
    geometries.add(geometry);
    const value = new T.Mesh(geometry, mat);
    value.position.set(x, y, z);
    value.castShadow = value.receiveShadow = true;
    parent.add(value);
    return value;
  };
  const ball = (parent, radius, x, y, z, mat, sx = 1, sy = 1, sz = 1) => {
    const value = mesh(parent, new T.SphereGeometry(radius, 24, 16), mat, x, y, z);
    value.scale.set(sx, sy, sz);
    return value;
  };
  const tube = (parent, points, radius, mat) => mesh(parent,
    new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))),
      24, radius, 8, false), mat);
  const panel = (parent, points, mat, z) => {
    const shape = new T.Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach(point => shape.lineTo(...point));
    shape.closePath();
    return mesh(parent, new T.ExtrudeGeometry(shape, {
      depth: .022, bevelEnabled: true, bevelSize: .007,
      bevelThickness: .007, bevelSegments: 2, steps: 1
    }), mat, 0, 0, z);
  };

  const body = new T.Group();
  body.name = 'anonymous-body';
  group.add(body);
  const limbs = [], arms = [], legs = [], elbows = [], knees = [];

  // A fitted, split-front coat leaves the trouser legs and walking motion visible.
  const coat = new T.Shape();
  coat.moveTo(-.22, .64);
  coat.lineTo(-.224, 1.26);
  coat.quadraticCurveTo(-.238, 1.4, -.145, 1.425);
  coat.lineTo(.145, 1.425);
  coat.quadraticCurveTo(.238, 1.4, .224, 1.26);
  coat.lineTo(.22, .64);
  coat.lineTo(.058, .61);
  coat.lineTo(0, .765);
  coat.lineTo(-.058, .61);
  coat.closePath();
  mesh(body, new T.ExtrudeGeometry(coat, {
    depth: .28, bevelEnabled: true, bevelSize: .018,
    bevelThickness: .018, bevelSegments: 3, steps: 1
  }), palette.coat, 0, 0, -.14);
  mesh(body, new T.CylinderGeometry(.09, .115, .16, 24), palette.lining, 0, 1.465, .015);
  panel(body, [[-.10, 1.45], [.10, 1.45], [.095, .93], [-.095, .93]], palette.lining, -.164);
  for (const side of [-1, 1]) {
    // Soft, draped hooded outerwear instead of formal suit lapels.
    panel(body, [[side * .19, 1.425], [side * .105, 1.48],
      [side * .085, .88], [side * .145, .82]], palette.coat, -.183);
    tube(body, [[side * .117, 1.40, -.198], [side * .105, 1.18, -.2],
      [side * .10, .88, -.197]], .004, palette.fold);
    tube(body, [[side * .09, .985, -.172], [side * .17, .975, -.166]], .005, palette.fold);
    tube(body, [[side * .184, 1.21, -.149], [side * .181, .88, -.155],
      [side * .193, .68, -.152]], .0035, palette.fold);
  }
  for(const side of [-1,1]) {
    tube(body, [[side*.086,1.45,-.212],[side*.083,1.31,-.223],
      [side*.078,1.205,-.219]],.005,palette.fold);
    mesh(body,new T.CylinderGeometry(.006,.006,.023,8),palette.metal,
      side*.078,1.193,-.219);
    tube(body,[[side*.18,1.34,-.15],[side*.205,1.17,-.16],
      [side*.18,1.02,-.16]],.004,palette.fold);
  }

  for (const side of [-1, 1]) {
    const arm = new T.Group();
    arm.name = `anonymous-${side < 0 ? 'left' : 'right'}-arm`;
    arm.position.set(side * .233, 1.37, 0);
    body.add(arm);
    ball(arm, .083, 0, -.03, .006, palette.coat, 1, .8, .94);
    mesh(arm, new T.CylinderGeometry(.078, .065, .255, 22, 5),
      palette.coat, side * .008, -.145, -.003);
    const elbow = new T.Group();
    elbow.position.set(side * .014, -.28, -.003);
    arm.add(elbow);
    ball(elbow, .066, 0, 0, 0, palette.coat, 1, .8, 1);
    mesh(elbow, new T.CylinderGeometry(.064, .055, .225, 22, 5),
      palette.coat, side * .01, -.1125, -.003);
    mesh(elbow, new T.CylinderGeometry(.056, .055, .035, 20), palette.fold,
      side * .014, -.24, -.004);
    ball(elbow, .054, side * .015, -.29, -.019, palette.leather, .82, 1.12, .7);
    for(let finger=0;finger<4;finger++){
      const fx=side*.015+(finger-1.5)*.017;
      ball(elbow,.013,fx,-.327,-.025,palette.leather,.58,1.52,.7);
    }
    ball(elbow, .021, -side * .022, -.272, -.046, palette.leather, .8, 1.2, .86);
    elbows.push(elbow);
    arms.push(arm);
    limbs.push({ part: arm, sign: side, kind: 'arm' });

    const leg = new T.Group();
    leg.name = `anonymous-${side < 0 ? 'left' : 'right'}-leg`;
    leg.position.set(side * .112, .91, .006);
    group.add(leg);
    mesh(leg, new T.CylinderGeometry(.094, .082, .38, 22, 6), palette.trousers,
      0, -.19, 0);
    const knee = new T.Group();
    knee.position.y = -.38;
    leg.add(knee);
    ball(knee, .082, 0, 0, 0, palette.trousers, 1, .85, 1);
    mesh(knee, new T.CylinderGeometry(.081, .068, .365, 22, 6), palette.trousers,
      0, -.1825, 0);
    tube(knee, [[0, -.03, -.08], [0, -.18, -.074], [0, -.34, -.069]], .003, palette.fold);
    ball(knee, .11, 0, -.422, -.052, palette.leather, .79, .37, 1.42);
    knees.push(knee);
    legs.push(leg);
    limbs.push({ part: leg, sign: -side, kind: 'leg' });
  }

  const head = new T.Group();
  head.name = 'anonymous-head';
  head.position.set(0, 1.675, -.008);
  body.add(head);
  const hoodGeometry = new T.SphereGeometry(.255, 36, 28);
  const hoodVertices = hoodGeometry.attributes.position;
  for (let i = 0; i < hoodVertices.count; i++) {
    const x = hoodVertices.getX(i), y = hoodVertices.getY(i), z = hoodVertices.getZ(i);
    const taper = y > .1 ? 1 - (y - .1) * .75 : 1;
    hoodVertices.setXYZ(i, x * taper * (y<-.1?1.05:1), y * 1.22, z * .85);
  }
  hoodGeometry.computeVertexNormals();
  mesh(head, hoodGeometry, palette.hood, 0, -.005, .07);
  // The thick cloth rim frames the white mask without hiding its chin or cheeks.
  tube(head, [[-.115, -.305, -.105], [-.219, -.17, -.10], [-.236, .01, -.09],
    [-.205, .171, -.055], [-.113, .261, -.024], [0, .30, .003],
    [.113, .261, -.024], [.205, .171, -.055], [.236, .01, -.09],
    [.219, -.17, -.1], [.115, -.305, -.105]], .012, palette.fold);
  for(const side of [-1,1]) {
    panel(head,[[side*.21,-.12],[side*.255,-.19],[side*.285,-.36],
      [side*.09,-.39],[side*.12,-.28]],palette.hood,-.085);
    tube(head,[[side*.237,-.13,-.101],[side*.23,-.24,-.107],
      [side*.145,-.355,-.108]],.006,palette.fold);
  }

  // A convex, tapered shell with the nose and cheeks sculpted into its surface.
  const jawTaper = y => y < -.04 ? 1 - Math.min(.30, (-y - .04) * 1.42) : 1;
  const faceZ = (x, y) => {
    const rx = .187 * jawTaper(y);
    const oval = Math.sqrt(Math.max(0, 1 - (x / rx) ** 2 - (y / .242) ** 2));
    const gaussian = (cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2) - ((y - cy) / sy) ** 2);
    const noseBridge = .052 * gaussian(0, .009, .025, .086);
    const noseTip = .057 * gaussian(0, -.058, .031, .028);
    const cheeks = .027 * (gaussian(-.115, -.031, .054, .04) + gaussian(.115, -.031, .054, .04));
    const browRidge=.013*(gaussian(-.08,.091,.06,.024)+gaussian(.08,.091,.06,.024));
    const sockets=.012*(gaussian(-.074,.024,.038,.02)+gaussian(.074,.024,.038,.02));
    const lips = .013 * gaussian(0, -.131, .068, .021);
    return -.101 - .102 * oval - noseBridge - noseTip - cheeks - browRidge + sockets - lips;
  };
  const maskGeometry = new T.SphereGeometry(1, 72, 52, Math.PI, Math.PI);
  const maskVertices = maskGeometry.attributes.position;
  for (let i = 0; i < maskVertices.count; i++) {
    const y = maskVertices.getY(i) * .242;
    const x = maskVertices.getX(i) * .187 * jawTaper(y);
    maskVertices.setXYZ(i, x, y, faceZ(x, y));
  }
  maskGeometry.computeVertexNormals();
  const mask = mesh(head, maskGeometry, palette.mask);
  mask.name = 'anonymous-rigid-guy-fawkes-mask';

  const facePatch = (points, mat, offset = .0025) => {
    const shape = new T.Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach(point => shape.lineTo(...point));
    shape.closePath();
    const flat = new T.ShapeGeometry(shape);
    const positions = flat.attributes.position, indices = flat.index;
    const points3d = [];
    const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const subdivide = (a, b, c, depth) => {
      if (depth > 0) {
        const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
        subdivide(a, ab, ca, depth - 1);
        subdivide(ab, b, bc, depth - 1);
        subdivide(ca, bc, c, depth - 1);
        subdivide(ab, bc, ca, depth - 1);
      } else {
        for (const [x, y] of [a, b, c]) points3d.push(x, y, faceZ(x, y) - offset);
      }
    };
    const count = indices ? indices.count : positions.count;
    for (let i = 0; i < count; i += 3) {
      const triangle = [0, 1, 2].map(j => {
        const k = indices ? indices.getX(i + j) : i + j;
        return [positions.getX(k), positions.getY(k)];
      });
      subdivide(...triangle, 2);
    }
    flat.dispose();
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(points3d, 3));
    geometry.computeVertexNormals();
    return mesh(head, geometry, mat);
  };
  const faceLine = (points, radius, mat, offset = .004) => tube(head,
    points.map(([x, y]) => [x, y, faceZ(x, y) - offset]), radius, mat);
  for (const side of [-1, 1]) {
    // Narrow dark eye openings remain fixed: there are no visible human eyeballs.
    facePatch([[side * .031, .016], [side * .053, .033], [side * .079, .037],
      [side * .110, .025], [side * .120, .014], [side * .085, .006],
      [side * .052, .006]], palette.ink,.003);
    facePatch([[side * .023, .073], [side * .047, .102], [side * .077, .12],
      [side * .105, .119], [side * .130, .103], [side * .142, .079],
      [side * .119, .093], [side * .095, .098], [side * .072, .095],
      [side * .043, .078], [side * .026, .061]], palette.ink, .005);
    const cheekPoints = Array.from({ length: 18 }, (_, i) => {
      const angle = i / 18 * Math.PI * 2;
      return [side * .132 + Math.cos(angle) * .023, -.047 + Math.sin(angle) * .011];
    });
    facePatch(cheekPoints, palette.blush, .003);
    faceLine([[side * .034, -.009], [side * .024, -.04], [side * .031, -.061]],
      .0025, palette.crease);
    facePatch([[side * .019, -.064], [side * .025, -.06], [side * .034, -.066],
      [side * .028, -.071]], palette.ink, .003);
    // Broad swept moustache with rising outer tips, as on the photographed mask.
    facePatch([[side*.005,-.080],[side*.021,-.078],[side*.041,-.099],
      [side*.069,-.104],[side*.101,-.090],[side*.126,-.067],
      [side*.139,-.063],[side*.123,-.101],[side*.102,-.121],
      [side*.065,-.132],[side*.035,-.123],[side*.015,-.102]],palette.ink,.006);
    faceLine([[side * .024, -.129], [side * .061, -.121], [side * .095, -.1],
      [side * .112, -.079]], .0027, palette.crease, .0035);
  }
  faceLine([[-.061, -.137], [-.029, -.144], [0, -.145], [.029, -.144], [.061, -.137]],
    .0025, palette.crease, .004);
  facePatch([[-.018, -.166],[-.017,-.16],[.017,-.16],[.018,-.166],
    [.013,-.212],[0,-.239],[-.013,-.212]],palette.ink,.005);

  group.traverse(object => {
    object.userData = { ...object.userData, animated: true, literaryResident: id, masked: true };
  });
  const coatMeshes = body.children.filter(object => object.isMesh).map(object => ({
    object, positions: new Float32Array(object.geometry.attributes.position.array)
  }));
  let disposed = false, wasSeated = false;
  function animate(time, { talking = false, walking = false, seated = false, reducedMotion = false } = {}) {
    if (disposed) return;
    const t = Number.isFinite(time) ? time : 0;
    const motion = !reducedMotion;
    const gait = walking && !seated && motion ? Math.sin(t * 5.6) * .17 : 0;
    for (const limb of limbs) {
      limb.part.rotation.set(gait * limb.sign, 0, 0);
    }
    for (let i = 0; i < legs.length; i++) {
      legs[i].position.y = seated ? .64 : .91;
      legs[i].rotation.x = seated ? 1.277 : legs[i].rotation.x;
      knees[i].rotation.x = seated ? -1.277 : 0;
      elbows[i].rotation.x = seated ? 1.64 : 0;
      if (seated) arms[i].rotation.x = .3;
    }
    if (seated !== wasSeated) {
      for (const { object, positions } of coatMeshes) {
        const attribute = object.geometry.attributes.position;
        for (let i = 0; i < attribute.count; i++) {
          const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
          const height = y * object.scale.y + object.position.y;
          const depth = z * object.scale.z + object.position.z;
          if (seated && height < .95) {
            const fold = .95 - height;
            attribute.setXYZ(i, x, (.95 - fold * .25 - object.position.y) / object.scale.y,
              (depth - fold * .8 * Math.max(0, Math.min(1, (.16 - depth) / .32)) - object.position.z) / object.scale.z);
          } else attribute.setXYZ(i, x, y, z);
        }
        attribute.needsUpdate = true;
        object.geometry.computeVertexNormals();
        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();
      }
      wasSeated = seated;
    }
    body.position.y = (seated ? -.32 : 0) + (motion ? Math.sin(t * 1.6 + .7) * (seated ? .0015 : .004) : 0);
    head.rotation.set(talking && motion ? Math.sin(t * 1.3) * .012 : 0,
      talking && motion ? Math.sin(t * .8) * .03 : 0,
      talking && motion ? Math.sin(t * 1.9) * .018 : 0);
    if (talking && motion) {
      arms[0].rotation.x -= seated ? .018 + Math.sin(t * 1.7) * .012 : .16;
      arms[0].rotation.z = seated ? .025 + Math.sin(t * 2) * .015 : .12 + Math.sin(t * 2) * .035;
      if (seated) elbows[0].rotation.x += Math.sin(t * 1.6) * .025;
    }
    // Speech is expressed through posture only; the mask never blinks or deforms.
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    group.removeFromParent();
    geometries.forEach(value => value.dispose());
    materials.forEach(value => value.dispose());
    group.clear();
    geometries.clear();
    materials.clear();
  }
  return { group, head, body, mask, limbs, arms, legs, elbows, knees, eyes: [], animate, dispose,
    style: 'warm-illustrated-v1', id };
}

// Illustrated Frank Ramsey and Alan Turing, with standing and seated poses.
// Portrait references, inspected rather than inferred from modern actors:
// Turing: Elliott & Fry, 29 March 1951, NPG x27078.
// Ramsey: portraits and 1925 walking photograph in grandson Stephen Burch's
// family archive (stephenburch.com/lettice/letticefam.htm).
// Colour is an illustrative choice: both source sets are monochrome.
function buildAcademicCharacter(T, id) {
  if (id !== 'ramsey' && id !== 'turing') throw new Error(`Unknown academic character: ${id}`);
  const ramsey = id === 'ramsey';
  const group = new T.Group();
  group.name = ramsey ? 'Frank Ramsey · illustrated mathematician' : 'Alan Turing · illustrated mathematician';
  const geometries = new Set(), materials = new Set();
  const mat = color => { const m = new T.MeshToonMaterial({color}); materials.add(m); return m; };
  const p = {
    skin: mat(ramsey ? '#d4ac91' : '#cba185'), cheek: mat(ramsey ? '#d1a18b' : '#c49b83'),
    crease: mat(ramsey ? '#a77e66' : '#9c765e'), hair: mat(ramsey ? '#4a3327' : '#272a27'),
    hairLight: mat(ramsey ? '#76533c' : '#3d423b'), eye: mat('#e6dfce'), iris: mat('#677064'), ink: mat('#29302d'),
    suit: mat(ramsey ? '#303c46' : '#666f69'), fold: mat(ramsey ? '#45525e' : '#828b83'),
    shirt: mat('#eee6d4'), tie: mat(ramsey ? '#a29480' : '#333a3a'), leather: mat('#3d3c35'), button: mat('#82745c'),
    waistcoat: mat('#3d423b'), weave: mat('#736c5a'), stripe: mat('#b8b9af'), spectacle: mat('#7b7464'), lip: mat('#b27f6b')
  };
  const mesh = (parent, geometry, material, x=0, y=0, z=0) => {
    geometries.add(geometry);
    const o = new T.Mesh(geometry, material); o.position.set(x,y,z);
    o.castShadow = o.receiveShadow = true; parent.add(o); return o;
  };
  const ball = (parent,r,x,y,z,material,sx=1,sy=1,sz=1) => {
    const o=mesh(parent,new T.SphereGeometry(r,24,16),material,x,y,z);o.scale.set(sx,sy,sz);return o;
  };
  const tube = (parent,points,radius,material) => mesh(parent,
    new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),20,radius,7,false),material);
  const panel = (parent,points,material,z) => {
    const shape=new T.Shape();shape.moveTo(...points[0]);points.slice(1).forEach(v=>shape.lineTo(...v));shape.closePath();
    return mesh(parent,new T.ExtrudeGeometry(shape,{depth:.018,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,steps:1}),material,0,0,z);
  };
  const body=new T.Group();body.name=`${id}-body`;group.add(body);
  const arms=[],legs=[],elbows=[],knees=[],limbs=[],eyes=[];
  const breadth=ramsey?1.03:.98;
  const coat=new T.Shape();
  coat.moveTo(-.2*breadth,.78);coat.lineTo(-.225*breadth,1.29);
  coat.quadraticCurveTo(-.235*breadth,1.4,-.14*breadth,1.425);
  coat.lineTo(.14*breadth,1.425);coat.quadraticCurveTo(.235*breadth,1.4,.225*breadth,1.29);
  coat.lineTo(.2*breadth,.78);coat.lineTo(.055,.76);coat.lineTo(0,.815);coat.lineTo(-.055,.76);coat.closePath();
  mesh(body,new T.ExtrudeGeometry(coat,{depth:.28,bevelEnabled:true,bevelSize:.016,bevelThickness:.016,bevelSegments:3,steps:1}),p.suit,0,0,-.14);
  // Ramsey's broad, youthful build is conspicuous even when seated. Turing's
  // much narrower, layered tweed outfit follows the 1951 studio portrait.
  if(ramsey)ball(body,.16,0,1.04,-.012,p.suit,1.08,1.14,.82);
  mesh(body,new T.CylinderGeometry(.068,.078,.14,22),p.skin,0,1.472,0);
  panel(body,[[-.085,1.425],[.085,1.425],[.063,1.12],[-.063,1.12]],p.shirt,-.17);
  if(!ramsey) {
    panel(body,[[-.092,1.29],[0,1.16],[.092,1.29],[.105,.94],[-.105,.94]],p.waistcoat,-.18);
    for(let i=-3;i<=3;i++)tube(body,[[i*.018,1.41,-.194],[i*.014,1.27,-.194]],.0013,p.stripe);
  }
  for(const side of [-1,1]) {
    panel(body,[[side*.17*breadth,1.415],[side*.08,1.43],[side*.026,1.16],[side*.14,1.27]],p.fold,-.198);
    panel(body,[[side*.075,1.443],[side*.007,1.428],[side*.03,1.345]],p.shirt,-.212);
    tube(body,[[side*.095,1.0,-.168],[side*.177,1.0,-.164]],.0045,p.fold);
  }
  const tieWidth=ramsey?.039:.026;
  panel(body,[[-.021,1.35],[.021,1.35],[tieWidth,1.12],[0,1.079],[-tieWidth,1.12]],p.tie,-.22);
  ball(body,.024,0,1.365,-.231,p.tie,ramsey?.96:.74,.87,.4);
  for(let i=0;i<3;i++)ball(body,.008,0,1.06-i*.08,-.18,p.button,1,1,.5);
  if(!ramsey) {
    panel(body,[[-.18,1.17],[-.105,1.17],[-.105,1.11],[-.18,1.11]],p.fold,-.165);
    for(let i=0;i<5;i++)ball(body,.0027,(i%2?-.008:.008),1.31-i*.036,-.244,p.shirt,1,1,.4);
    // Low-contrast herringbone stitches read as tweed without a texture file.
    for(const side of [-1,1])for(let row=0;row<10;row++) {
      const y=.87+row*.038;
      tube(body,[[side*.15,y,-.17],[side*.165,y+.012,-.17],[side*.18,y,-.17]],.0017,p.weave);
    }
  } else {
    for(let i=0;i<4;i++)tube(body,[[-.025,1.30-i*.045,-.244],[.028,1.282-i*.045,-.244]],.0018,p.fold);
    tube(body,[[.17,1.13,-.18],[.23,1.13,-.18]],.004,p.fold);
  }
  for(const side of [-1,1]) {
    const arm=new T.Group();arm.name=`${id}-${side<0?'left':'right'}-arm`;
    arm.position.set(side*.232*breadth,1.37,0);body.add(arm);
    ball(arm,.084,0,-.028,.004,p.suit,1,.8,.93);
    mesh(arm,new T.CylinderGeometry(.079,.065,.255,22,5),p.suit,side*.008,-.145,0);
    const elbow=new T.Group();elbow.position.set(side*.014,-.28,0);arm.add(elbow);
    ball(elbow,.066,0,0,0,p.suit,1,.8,1);
    mesh(elbow,new T.CylinderGeometry(.064,.054,.225,22,5),p.suit,side*.01,-.1125,-.003);
    mesh(elbow,new T.CylinderGeometry(.055,.054,.03,20),p.shirt,side*.014,-.24,-.004);
    const hand=ball(elbow,.054,side*.015,-.29,-.019,p.skin,.84,1.13,.7);hand.name=`${id}-hand`;
    ball(elbow,.02,-side*.022,-.272,-.047,p.skin,.82,1.2,.9);
    arms.push(arm);elbows.push(elbow);limbs.push({part:arm,sign:side,kind:'arm'});
    const leg=new T.Group();leg.name=`${id}-${side<0?'left':'right'}-leg`;
    leg.position.set(side*.112,.91,.006);group.add(leg);
    mesh(leg,new T.CylinderGeometry(.095,.082,.38,22,6),p.suit,0,-.19,0);
    const knee=new T.Group();knee.position.y=-.38;leg.add(knee);
    ball(knee,.082,0,0,0,p.suit,1,.85,1);
    mesh(knee,new T.CylinderGeometry(.081,.068,.365,22,6),p.suit,0,-.1825,0);
    tube(knee,[[0,-.03,-.08],[0,-.18,-.075],[0,-.34,-.069]],.003,p.fold);
    ball(knee,.11,0,-.422,-.052,p.leather,.79,.37,1.42);
    legs.push(leg);knees.push(knee);limbs.push({part:leg,sign:-side,kind:'leg'});
  }
  const head=new T.Group();head.name=`${id}-head`;head.position.set(0,1.665,-.008);head.scale.set(ramsey?.82:.88,ramsey?.91:.96,ramsey?.88:.90);body.add(head);
  const faceGeometry=new T.SphereGeometry(.2,40,32),face=faceGeometry.attributes.position;
  for(let i=0;i<face.count;i++) {
    const x=face.getX(i),y=face.getY(i),z=face.getZ(i);
    const lower=Math.max(0,(-y-.025)/.175);
    const taper=ramsey?1-lower*.15:1-lower*.17;
    // Ramsey: broad cheeks and a soft, full young jaw. Turing: longer face,
    // high cheek planes, tapering lower jaw and a narrower, firmer chin.
    const cheek=ramsey?1+Math.exp(-Math.pow((y+.035)/.075,2))*.045:1;
    let front=z*.8;
    if(z<0){
      front-=Math.exp(-Math.pow((y-.055)/.10,2))*(ramsey?.008:.013);
      // Continuous cheek planes avoid separate circular pads on the face.
      front-=(ramsey?.012:.007)*Math.exp(-Math.pow((Math.abs(x)-.105)/.050,2)-Math.pow((y+.04)/.055,2));
    }
    face.setXYZ(i,x*(ramsey?.99:.86)*taper*cheek,y*(ramsey?1.045:1.25),front);
  }
  faceGeometry.computeVertexNormals();mesh(head,faceGeometry,p.skin);
  ball(head,ramsey?.069:.073,0,ramsey?-.149:-.184,-.038,p.skin,ramsey?1.30:.99,.55,.94);
  for(const side of [-1,1]) {
    const earX=side*(ramsey?.209:.174);
    ball(head,ramsey?.035:.047,earX,-.004,.008,p.skin,.65,1.18,.75);
    ball(head,ramsey?.022:.028,earX+side*.009,-.001,-.016,p.cheek,.58,1.03,.4);
    tube(head,[[earX+side*.005,.031,-.020],[earX+side*.024,.022,-.021],
      [earX+side*.022,-.018,-.021],[earX+side*.006,-.033,-.019]],.0035,p.skin);
    const eye=new T.Group();eye.position.set(side*(ramsey?.078:.066),.031,-.164);head.add(eye);
    ball(eye,ramsey?.025:.028,0,0,0,p.eye,1.04,.35,.28);
    ball(eye,.012,0,-.001,-.008,p.iris,.8,.73,.3);
    ball(eye,.0065,0,-.001,-.011,p.ink,.75,.86,.32);
    ball(eye,.0023,-.003,.003,-.014,p.eye);
    tube(eye,[[-.029,.003,-.006],[0,.011,-.01],[.029,.002,-.006]],.005,p.skin);
    tube(eye,[[-.027,-.006,-.004],[0,-.010,-.008],[.027,-.006,-.004]],.0025,p.crease);
    eyes.push(eye);
    ball(head,.037,side*(ramsey?.079:.067),.070,-.140,p.skin,1.25,.30,.63);
    tube(head,[[side*.028,.073,-.158],[side*.065,.083,-.167],[side*.111,.067,-.145]],ramsey?.0075:.009,p.hair);
    if(!ramsey) {
      tube(head,[[side*.044,-.009,-.158],[side*.074,-.018,-.152],[side*.105,-.009,-.137]],.0018,p.crease);
      tube(head,[[side*.046,-.073,-.156],[side*.064,-.105,-.139]],.0017,p.crease);
    }
  }
  // A projecting, straight nasal bridge and angled tip are vital to Turing's
  // profile; Ramsey has a shorter, broader nose above a fuller upper lip.
  if(ramsey){
    // Ramsey: embedded nasal bridge with rounded, subtle tip, rather than a protruding bead.
    ball(head,.029,0,-.015,-.159,p.skin,.80,1.60,1.10);
    ball(head,.027,0,-.060,-.180,p.skin,1.13,.62,.95);
  } else {
    // A continuous nose ridge whose base overlaps the face, avoiding a floating tip.
    ball(head,.031,0,-.023,-.150,p.skin,.77,1.92,1.12);
    ball(head,.025,0,-.071,-.183,p.skin,.94,.75,.94);
  }
  for(const side of [-1,1]) {
    ball(head,.014,side*(ramsey?.024:.019),ramsey?-.063:-.072,ramsey?-.190:-.202,p.skin,1,.65,.8);
    ball(head,.0053,side*(ramsey?.018:.016),ramsey?-.072:-.081,ramsey?-.201:-.211,p.crease,1,.38,.7);
  }
  const jaw=new T.Group();jaw.position.set(0,ramsey?-.126:-.148,ramsey?-.139:-.136);head.add(jaw);
  const mouthHalf=ramsey?.048:.038;
  tube(jaw,[[-mouthHalf,.002,0],[-.018,.004,-.005],[0,.001,-.009],[.018,.004,-.005],[mouthHalf,.002,0]],ramsey?.0048:.0039,p.lip);
  tube(jaw,[[-mouthHalf,0,-.003],[-.016,-.003,-.01],[.016,-.003,-.01],[mouthHalf,.001,-.003]],.0025,p.crease);
  ball(jaw,ramsey?.031:.024,0,-.012,-.004,p.lip,1,.19,.26);

  // Turing is deliberately without spectacles; Ramsey's fine round spectacles are documented in the original family
  // photographs. Turing's 1951 portrait has no spectacles.
  if(ramsey) {
    const glasses=new T.Group();glasses.name='ramsey-round-wire-spectacles';head.add(glasses);
    for(const side of [-1,1]) {
      mesh(glasses,new T.TorusGeometry(.036,.00135,8,56),p.spectacle,side*.073,.025,-.174);
      tube(glasses,[[side*.108,.031,-.174],[side*.145,.034,-.115],[side*.200,.012,.008]],.0018,p.spectacle);
      ball(glasses,.0045,side*.108,.030,-.174,p.spectacle);
    }
    tube(glasses,[[-.037,.030,-.174],[0,.034,-.183],[.037,.030,-.174]],.0017,p.spectacle);
  }

  // Sculpted caps follow the cranium. Fine directional strands and a part
  // replace the old bead-like hair loops. Front is negative Z.
  const hairVertices=[],hairIndices=[],hairRows=20,hairSegments=64;
  // The cap must clear the skull's extra forehead depth, not merely the
  // original ellipsoid. Its triangles face outward for WebGL backface culling.
  const hairRX=ramsey?.205:.178,hairRY=ramsey?.216:.250,hairRZ=ramsey?.168:.181;
  const hairCY=.003,hairCZ=.001;
  const hairBoundary=phi=>(ramsey?1.17:1.28)-Math.max(0,-Math.sin(phi))*(ramsey?.19:.31)+Math.max(0,Math.sin(phi))*.10;
  for(let row=0;row<=hairRows;row++)for(let seg=0;seg<=hairSegments;seg++) {
    const phi=seg/hairSegments*Math.PI*2;
    const boundary=hairBoundary(phi);
    const theta=row/hairRows*boundary;
    hairVertices.push(Math.cos(phi)*Math.sin(theta)*hairRX,
      Math.cos(theta)*hairRY+hairCY,
      Math.sin(phi)*Math.sin(theta)*hairRZ+hairCZ);
    if(row<hairRows&&seg<hairSegments) {
      const a=row*(hairSegments+1)+seg,b=a+hairSegments+1;
      hairIndices.push(a,a+1,b,b,a+1,b+1);
    }
  }
  const hairGeometry=new T.BufferGeometry();hairGeometry.setAttribute('position',new T.Float32BufferAttribute(hairVertices,3));
  hairGeometry.setIndex(hairIndices);hairGeometry.computeVertexNormals();mesh(head,hairGeometry,p.hair);
  const hairPath=(points,r,material)=>{
    const raw=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));
    const surface=[];
    for(let j=0;j<=32;j++) {
      const v=raw.getPoint(j/32),nx=v.x/hairRX,ny=(v.y-hairCY)/hairRY,nz=(v.z-hairCZ)/hairRZ;
      const length=Math.sqrt(nx*nx+ny*ny+nz*nz),phi=Math.atan2(nz,nx);
      const theta=Math.min(Math.acos(Math.max(-1,Math.min(1,ny/length))),hairBoundary(phi)-.025);
      const lift=1.007;
      surface.push([Math.cos(phi)*Math.sin(theta)*hairRX*lift,
        Math.cos(theta)*hairRY*lift+hairCY,Math.sin(phi)*Math.sin(theta)*hairRZ*lift+hairCZ]);
    }
    return tube(head,surface,r,material);
  };
  for(let i=0;i<(ramsey?17:9);i++) {
    const start=ramsey?(-.16+i*.019):(-.155+i*.025);
    hairPath([[start,ramsey?.134:.152,-.119],[start+.024,ramsey?.205:.222,-.086],
      [start+.042,ramsey?.239:.266,-.016],[start+.047,ramsey?.213:.238,.070]],ramsey?.0027:.0016,i%3===0?p.hairLight:p.hair);
  }
  hairPath([[.078,ramsey?.144:.153,-.119],[.082,ramsey?.227:.245,-.034],
    [.071,ramsey?.230:.250,.048]],.0018,p.skin);
  if(ramsey) {
    // Layered swept locks create a readable hairstyle rather than a scratched cap.
    for(let k=0;k<13;k++){
      const x=-.13+k*.021;
      const sweep=.026+Math.sin(k*.73)*.009;
      hairPath([[x,.195,-.075],[x+sweep,.185,-.105],[x+sweep*.7,.150,-.121],[x+sweep*.4,.125,-.113]],
        .0032+(k%3)*.0006,k%4===0?p.hairLight:p.hair);
    }
  }
  if(ramsey) {
    // A loose, asymmetrical forelock from the youthful portrait, not a
    // duplicated Turing side part.
    hairPath([[.022,.224,-.073],[-.028,.188,-.131],[-.071,.126,-.140],[-.075,.101,-.142]],.0045,p.hair);
    hairPath([[-.006,.224,-.079],[-.058,.180,-.130],[-.100,.143,-.136]],.0022,p.hairLight);
  }
  for(const side of [-1,1]) {
    ball(head,ramsey?.043:.034,side*(ramsey?.195:.165),.062,.025,p.hair,.40,1.5,1.04);
    ball(head,.019,side*(ramsey?.199:.170),.005,.017,p.hair,.32,1.20,.70);
  }
  const coatMeshes=body.children.filter(o=>o.isMesh).map(object=>({object,positions:new Float32Array(object.geometry.attributes.position.array)}));
  group.traverse(o=>{o.userData={...o.userData,animated:true,literaryResident:id};});
  let disposed=false,wasSeated=false;
  function animate(time,{talking=false,walking=false,seated=false,reducedMotion=false}={}) {
    if(disposed)return;
    const t=Number.isFinite(time)?time:0,motion=!reducedMotion;
    const gait=walking&&!seated&&motion?Math.sin(t*5.6)*.17:0;
    for(const limb of limbs)limb.part.rotation.set(gait*limb.sign,0,0);
    for(let i=0;i<2;i++) {
      legs[i].position.y=seated?.64:.91;legs[i].rotation.x=seated?1.277:legs[i].rotation.x;
      knees[i].rotation.x=seated?-1.277:0;elbows[i].rotation.x=seated?1.64:0;
      if(seated)arms[i].rotation.x=.3;
    }
    if(seated!==wasSeated) {
      for(const {object,positions}of coatMeshes) {
        const a=object.geometry.attributes.position;
        for(let i=0;i<a.count;i++) {
          const x=positions[i*3],y=positions[i*3+1],z=positions[i*3+2];
          const height=y*object.scale.y+object.position.y,depth=z*object.scale.z+object.position.z;
          if(seated&&height<.95) {
            const fold=.95-height;
            a.setXYZ(i,x,(.95-fold*.25-object.position.y)/object.scale.y,
              (depth-fold*.8*Math.max(0,Math.min(1,(.16-depth)/.32))-object.position.z)/object.scale.z);
          }else a.setXYZ(i,x,y,z);
        }
        a.needsUpdate=true;object.geometry.computeVertexNormals();object.geometry.computeBoundingBox();object.geometry.computeBoundingSphere();
      }
      wasSeated=seated;
    }
    body.position.y=(seated?-.32:0)+(motion?Math.sin(t*1.6+(ramsey?.3:1.6))*(seated?.0015:.004):0);
    head.rotation.set(talking&&motion?Math.sin(t*1.3)*.014:0,talking&&motion?Math.sin(t*.8)*.03:0,talking&&motion?Math.sin(t*1.9)*.018:0);
    if(talking&&motion) {
      arms[0].rotation.x-=seated?.018+Math.sin(t*1.7)*.012:.16;
      arms[0].rotation.z=seated?.025+Math.sin(t*2)*.015:.12+Math.sin(t*2)*.035;
      if(seated)elbows[0].rotation.x+=Math.sin(t*1.6)*.025;
    }
    jaw.scale.y=talking&&motion?1+Math.abs(Math.sin(t*7))*.24:1;
    const phase=((t+(ramsey?.7:2.3))%6+6)%6;
    for(const eye of eyes)eye.scale.y=motion&&phase>5.84?.16:1;
  }
  function dispose() {
    if(disposed)return;disposed=true;group.removeFromParent();
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    group.clear();geometries.clear();materials.clear();
  }
  return {group,head,body,jaw,arms,legs,elbows,knees,limbs,eyes,animate,dispose,id,style:'portrait-referenced-v2'};
}

// An imagined, warm study for the character preview; not a historical reconstruction.
// Geometry and solid material colours also work with the project's CPU renderer.
function buildCharacterStudyScene(T) {
  const group = new T.Group();
  group.name = 'Ramsey house · shared study preview';
  const geometries = new Set(), materials = new Set();
  const mat = color => {
    const value = new T.MeshLambertMaterial({color});
    materials.add(value);
    return value;
  };
  const p = {
    plaster: mat('#d1c5aa'), plasterLight: mat('#dfd5bd'), timber: mat('#69503b'),
    wood: mat('#9b7350'), oak: mat('#b48a5e'), edge: mat('#77563d'),
    floor: [mat('#a28761'), mat('#a98c66'), mat('#967b57')],
    paper: mat('#eee3c7'), ink: mat('#636254'), brass: mat('#b6995c'),
    green: mat('#556f62'), teal: mat('#476463'), blue: mat('#536976'),
    red: mat('#a26550'), cream: mat('#d0b890'), ceramic: mat('#d9cdb2'),
    sky: mat('#344f66'), garden: mat('#526b5c'), moon: mat('#ede6cb'),
    rug: mat('#91765f'), rugTrim: mat('#b4a17b'), dark: mat('#413c35')
  };
  function mesh(geometry, material, x=0, y=0, z=0, parent=group) {
    geometries.add(geometry);
    const value = new T.Mesh(geometry, material);
    value.position.set(x,y,z);
    value.castShadow = value.receiveShadow = true;
    parent.add(value);
    return value;
  }
  const box = (w,h,d,m,x,y,z,parent) => mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
  const cylinder = (top,bottom,h,m,x,y,z,parent) => mesh(new T.CylinderGeometry(top,bottom,h,16),m,x,y,z,parent);
  const ball = (r,m,x,y,z,parent) => mesh(new T.SphereGeometry(r,12,8),m,x,y,z,parent);
  function rod(a,b,r,m,parent=group) {
    const from = new T.Vector3(...a), to = new T.Vector3(...b), delta = to.clone().sub(from);
    const middle = from.clone().add(to).multiplyScalar(.5);
    const value = cylinder(r,r,delta.length(),m,...middle.toArray(),parent);
    value.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());
    return value;
  }

  // Floorboards and a woven-looking geometric rug ground the table and chairs.
  for (let i=0;i<24;i++) {
    const x = -5.04 + i*.44;
    const plank = box(.428,.065,7.2,p.floor[i%3],x,-.035,.6);
    plank.castShadow = false;
  }
  box(6.15,.012,5.45,p.rug,0,.005,.35).castShadow = false;
  for(const z of [-2.25,2.95]) box(5.9,.003,.035,p.rugTrim,0,.013,z).castShadow=false;
  for(const x of [-2.95,2.95]) box(.035,.003,5.2,p.rugTrim,x,.013,.35).castShadow=false;

  // The front is open to the camera. The window is a real gap in the rear wall.
  box(3.35,3.8,.16,p.plaster,-3.325,1.9,3.5);
  box(3.35,3.8,.16,p.plaster,3.325,1.9,3.5);
  box(3.3,.98,.16,p.plasterLight,0,.49,3.5);
  box(3.3,.72,.16,p.plaster,0,3.44,3.5);
  for(const x of [-4.96,4.96]) {
    box(.14,3.8,4.6,p.plaster,x,1.9,1.25);
    box(.22,3.8,.22,p.timber,x,1.9,3.4);
    box(.22,3.8,.22,p.timber,x,1.9,-.95);
    box(.18,.68,4.5,p.edge,x,.34,1.25);
  }
  box(9.9,.66,.09,p.edge,0,.33,3.38);
  box(9.95,.09,.14,p.oak,0,.7,3.34);
  for(const z of [-.85,1.6,3.3]) box(10.1,.23,.2,p.timber,0,3.67,z);
  box(10,.11,.18,p.oak,0,3.78,3.32);

  // A quiet garden/window view, built without texture or transparency dependencies.
  box(3.3,2.1,.035,p.sky,0,2.03,3.61).castShadow=false;
  const moon=ball(.14,p.moon,.87,2.65,3.56);moon.scale.z=.12;moon.castShadow=false;
  for(const [x,y] of [[-.96,2.72],[-.45,2.48],[.18,2.83],[1.22,2.12],[-1.24,2.1]]) {
    const star=ball(.018,p.moon,x,y,3.56);star.scale.z=.1;star.castShadow=false;
  }
  for(let i=0;i<8;i++) {
    const shrub=mesh(new T.IcosahedronGeometry(.32+(i%3)*.05,1),p.garden,-1.5+i*.43,1.12+(i%2)*.06,3.54);
    shrub.scale.set(1,.65,.18);shrub.castShadow=false;
  }
  for(const x of [-1.7,1.7]) box(.11,2.24,.16,p.timber,x,2.05,3.39);
  for(const y of [1.0,3.1]) box(3.5,.12,.18,p.timber,0,y,3.38);
  box(.075,2.12,.13,p.oak,0,2.05,3.35);
  box(3.3,.07,.13,p.oak,0,2.08,3.35);
  box(3.65,.095,.38,p.oak,0,.96,3.29);
  for(const side of [-1,1]) {
    for(let fold=0;fold<3;fold++) box(.11,2.15,.08,p.teal,side*(1.83+fold*.07),2.07,3.3-fold*.012);
  }

  const bookColors = [p.green,p.red,p.blue,p.cream,p.teal];
  function bookcase(x) {
    const shelf = new T.Group();shelf.name='Study bookcase';group.add(shelf);
    box(1.56,2.55,.1,p.edge,x,1.48,3.22,shelf);
    for(const side of [-1,1]) box(.09,2.72,.44,p.timber,x+side*.8,1.42,3.03,shelf);
    for(const y of [.12,.65,1.18,1.71,2.24,2.78]) box(1.7,.07,.5,p.oak,x,y,3.0,shelf);
    for(let row=0;row<5;row++) for(let j=0;j<10;j++) {
      const w=.085+(j%3)*.012,h=.26+((row*3+j*2)%5)*.035;
      const bx=x-.65+j*.138, by=.175+row*.53+h/2;
      const book=box(w,h,.25,bookColors[(j+row*2)%bookColors.length],bx,by,2.95,shelf);
      book.rotation.z=(j%7===0?.045:0);
      box(w*.64,.012,.008,p.brass,bx,by+h*.25,2.82,shelf);
      box(w*.64,.009,.008,p.brass,bx,by-h*.25,2.82,shelf);
    }
  }
  bookcase(-3.47);bookcase(3.47);

  // Six equal sides; one chair is centred on each side and faces the centre.
  const tableCentreZ=.35, tableRadius=1.68;
  const tableApothem=tableRadius*Math.cos(Math.PI/6), chairRadius=tableApothem+.48;
  // Cast order: Socrates, Nietzsche, Zarathustra, Anonymous, Ramsey, Turing.
  // The three revised likenesses occupy the far sides, facing the camera.
  const seatAngles=[2*Math.PI/3,Math.PI,4*Math.PI/3,0,Math.PI/3,-Math.PI/3];
  const seats=seatAngles.map((yaw,index)=>({
    x:Math.sin(yaw)*chairRadius,y:0,z:tableCentreZ+Math.cos(yaw)*chairRadius,
    yaw,seatHeight:.56,sideIndex:Math.round((yaw+Math.PI*2)%(Math.PI*2)/(Math.PI/3))
  }));
  const chairs=[];
  for(const [index,seat] of seats.entries()) {
    const chair=new T.Group();chair.name=`Hexagon study chair ${index+1}`;
    chair.position.set(seat.x,0,seat.z);chair.rotation.y=seat.yaw;group.add(chair);chairs.push(chair);
    box(.62,.08,.59,p.oak,0,.52,0,chair);
    box(.54,.035,.52,p.green,0,.565,-.008,chair);
    for(const x of [-.245,.245]) for(const z of [-.22,.22]) box(.065,.49,.065,p.timber,x,.245,z,chair);
    // Lower, open backs keep the near-side figures and table silhouette legible.
    for(const x of [-.265,.265]) box(.065,.66,.065,p.timber,x,.8,.245,chair);
    box(.59,.10,.075,p.oak,0,1.11,.245,chair);
    for(const x of [-.17,0,.17]) box(.047,.43,.045,p.oak,x,.86,.245,chair);
    box(.52,.055,.055,p.edge,0,.2,.2,chair);
  }

  const desk=new T.Group();desk.name='Six-sided shared study table';
  desk.position.z=tableCentreZ;group.add(desk);
  // Cylinder theta starts at a vertex, half a sector away from a seat normal.
  const hex=(radius,height,y,material)=>mesh(
    new T.CylinderGeometry(radius,radius,height,6,1,false,Math.PI/6),material,0,y,0,desk);
  hex(tableRadius,.105,.8275,p.oak); // Top is exactly .88.
  hex(tableRadius+.013,.045,.791,p.edge);
  hex(tableRadius-.08,.13,.735,p.wood);
  const vertices=Array.from({length:6},(_,i)=>{
    const a=Math.PI/6+i*Math.PI/3;return [Math.sin(a)*(tableRadius-.075),.883,Math.cos(a)*(tableRadius-.075)];
  });
  for(let i=0;i<6;i++) {
    rod(vertices[i],vertices[(i+1)%6],.004,p.edge,desk);
    // Fine radial joins emphasise the six sectors without covering the tabletop.
    rod([0,.881,0],[vertices[i][0],.881,vertices[i][2]],.0025,p.wood,desk);
  }
  // Four supports are set well inside the rim, leaving knees room on every side.
  for(const x of [-.64,.64])for(const z of [-.64,.64]){
    box(.12,.73,.12,p.timber,x,.385,z,desk);
    box(.17,.06,.17,p.edge,x,.06,z,desk);
  }
  box(1.4,.075,.075,p.edge,0,.23,.64,desk);
  box(1.4,.075,.075,p.edge,0,.23,-.64,desk);
  box(.075,.075,1.35,p.edge,-.64,.23,0,desk);
  box(.075,.075,1.35,p.edge,.64,.23,0,desk);

  // Six individual writing places follow the sides, rather than a straight row.
  for(const [index,yaw] of seatAngles.entries()) {
    const place=new T.Group();place.name=`Writing place ${index+1}`;
    place.position.set(Math.sin(yaw)*(tableApothem-.23),0,Math.cos(yaw)*(tableApothem-.23));
    place.rotation.y=yaw;desk.add(place);
    box(.43,.008,.30,p.paper,0,.888,0,place);
    for(let line=0;line<4;line++)box(.24-(line%2)*.04,.0015,.0035,p.ink,-.025,.893,-.08+line*.038,place);
    rod([.17,.9,-.10],[.19,.9,.10],.008,p.edge,place);
    cylinder(.054,.05,.10,p.ceramic,-.32,.935,-.03,place);
    cylinder(.044,.044,.003,p.dark,-.32,.987,-.03,place);
    const handle=mesh(new T.TorusGeometry(.033,.009,6,14),p.ceramic,-.378,.94,-.03,place);handle.rotation.y=Math.PI/2;
  }
  // A low open book and two-colour graph occupy the shared centre.
  box(.52,.025,.34,p.green,-.34,.9,.07,desk);
  for(const side of [-1,1]) {
    const page=box(.235,.012,.31,p.paper,-.34+side*.12,.921,.07,desk);page.rotation.z=side*.045;
  }
  box(.51,.006,.48,p.paper,.29,.887,-.06,desk);
  const diagram=[];
  for(let i=0;i<6;i++){const a=i*Math.PI/3;diagram.push([.29+Math.cos(a)*.185,.894,-.06+Math.sin(a)*.185]);}
  for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)rod(diagram[i],diagram[j],.0028,(i+j)%2?p.red:p.blue,desk);
  for(const point of diagram)ball(.012,p.ink,...point,desk);

  // The lamp moves to a side table so it cannot hide a face or the hexagon edge.
  const sideTable=new T.Group();sideTable.name='Lamp side table';sideTable.position.set(3.45,0,1.3);group.add(sideTable);
  box(.8,.07,.65,p.oak,0,.78,0,sideTable);
  for(const x of [-.29,.29])for(const z of [-.22,.22])box(.065,.745,.065,p.timber,x,.3725,z,sideTable);
  cylinder(.13,.16,.035,p.brass,0,.833,0,sideTable);
  cylinder(.018,.025,.43,p.brass,0,1.058,0,sideTable);
  cylinder(.12,.23,.2,p.green,0,1.342,0,sideTable);
  cylinder(.215,.215,.012,p.cream,0,1.239,0,sideTable);
  ball(.04,p.moon,0,1.222,0,sideTable);

  let disposed=false;
  function dispose(){
    if(disposed)return;disposed=true;group.removeFromParent();
    geometries.forEach(value=>value.dispose());materials.forEach(value=>value.dispose());
    group.clear();geometries.clear();materials.clear();
  }
  return {group,desk,chairs,seats,tableTopHeight:.88,seatHeight:.56,dispose,
    tableSides:6,tableRadius,tableApothem,tableCentreZ,style:'warm-illustrated-study',roomName:'Ramsey house',historicalReconstruction:false};
}
