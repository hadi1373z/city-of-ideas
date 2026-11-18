// Original periodic 60°/120° rhombi: three lozenges read as one ambiguous cube.
// The same field bends continuously over the entrance vault; this is not Penrose tiling.
function clip(poly,axis,bound,keepLess){
 const out=[];for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],inside=p=>keepLess?p[axis]<=bound:p[axis]>=bound,ai=inside(a),bi=inside(b);
  if(ai)out.push(a);if(ai!==bi){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}
 }return out;
}
export function buildEscherEntranceArchitecture(T){
 const group=new T.Group();group.name='Escher · continuous lozenge entrance';const owned=[];
 const palettes={floor:[0xe1ddc8,0x49736a,0xb49a68],vault:[0xe0dcc9,0xb5c1b1,0xc3b18a]};
 function field(name,halfWidth,halfLength,map,palette){
  const vertices=[[],[],[]],s=.62;
  for(let r=-20;r<=20;r++)for(let q=-20;q<=20;q++){
   const centre=[Math.sqrt(3)*s*(q+r/2),1.5*s*r];
   if(Math.abs(centre[0])>halfWidth+2*s||Math.abs(centre[1])>halfLength+2*s)continue;
   const v=Array.from({length:6},(_,i)=>[centre[0]+s*Math.cos(Math.PI/6+i*Math.PI/3),centre[1]+s*Math.sin(Math.PI/6+i*Math.PI/3)]);
   for(let j=0;j<3;j++){
    let p=[centre,v[j*2],v[(j*2+1)%6],v[(j*2+2)%6]];
    for(const [axis,bound,less]of[[0,-halfWidth,false],[0,halfWidth,true],[1,-halfLength,false],[1,halfLength,true]])p=clip(p,axis,bound,less);
    for(let k=1;k<p.length-1;k++)for(const point of[p[0],p[k],p[k+1]])vertices[j].push(...map(...point));
   }
  }
  const geometry=new T.BufferGeometry(),positions=vertices.flat();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));let offset=0;
  vertices.forEach((v,i)=>{geometry.addGroup(offset,v.length/3,i);offset+=v.length/3;});geometry.computeVertexNormals();
  const materials=palette.map(color=>new T.MeshLambertMaterial({color,side:T.DoubleSide})),mesh=new T.Mesh(geometry,materials);mesh.name=name;group.add(mesh);owned.push(geometry,...materials);return mesh;
 }
 const floor=field('Escher · rhomb floor',3.87,6.88,(x,z)=>[x,.018,z],palettes.floor);
 const roofY=x=>4.94+.95*(1-(x/4.18)**2);
 const vault=field('Escher · sealed tiled vault',4.18,7.35,(x,z)=>[x,roofY(x),z],palettes.vault);
 // Opaque curved end cheeks meet the existing lintels, closing the old sky gap.
 const cheekPositions=[];for(const z of[-7,7])for(let i=0;i<48;i++){
  const a=-4.18+i*8.36/48,b=-4.18+(i+1)*8.36/48;
  cheekPositions.push(a,4.7,z,b,4.7,z,b,roofY(b),z,a,4.7,z,b,roofY(b),z,a,roofY(a),z);
 }
 const cheekGeometry=new T.BufferGeometry();cheekGeometry.setAttribute('position',new T.Float32BufferAttribute(cheekPositions,3));cheekGeometry.computeVertexNormals();const cheekMat=new T.MeshLambertMaterial({color:0xb5c1b1,side:T.DoubleSide}),cheeks=new T.Mesh(cheekGeometry,cheekMat);cheeks.name='Escher · vault end cheeks';group.add(cheeks);owned.push(cheekGeometry,cheekMat);
 // Close the spring line to the existing 4.7m walls, including grazing views.
 const fasciaGeometry=new T.BoxGeometry(.22,.38,14.05);owned.push(fasciaGeometry);
 for(const x of[-4,4]){const fascia=new T.Mesh(fasciaGeometry,cheekMat);fascia.position.set(x,4.87,0);group.add(fascia);}
 const trim=new T.MeshLambertMaterial({color:0xa68c55});owned.push(trim);
 for(const z of[-7.36,7.36]){
  const points=Array.from({length:49},(_,i)=>{const x=-4.18+i*8.36/48;return new T.Vector3(x,roofY(x)+.025,z);}),curve=new T.CatmullRomCurve3(points),g=new T.TubeGeometry(curve,64,.045,5,false),rib=new T.Mesh(g,trim);group.add(rib);owned.push(g);
 }
 return{group,floor,vault,roofY,dispose(){group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
