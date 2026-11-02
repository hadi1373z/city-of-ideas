// Shared furniture and room geometry for the city and standalone film.
export function buildCharacterStudyScene(T, {openToCity=false}={}) {
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
    const plank = box(.428,.065,openToCity?6.6:7.2,p.floor[i%3],x,-.035,openToCity?.2:.6);
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

  if(!openToCity){
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
