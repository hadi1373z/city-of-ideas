// Original procedural tilework and shallow faceted vault cells, inspired by
// the user's architectural reference. No photograph is used as a texture.
export function buildEscherNicheOrnaments(T,niches){
 const group=new T.Group();group.name='Escher · tiled recessed stair niches';
 const tiles=[],vaults=[],palette=[0x164b82,0x267f9b,0xdce4d5,0xc4a562,0x12345b].map(c=>new T.Color(c));let tileCount=0,cellCount=0;
 for(const n of niches){
  const r=n.w/2,outline=[[-r,.012],[r,.012],[r,n.spring]];
  for(let j=1;j<=32;j++){const a=j*Math.PI/32;outline.push([r*Math.cos(a),n.spring+r*Math.sin(a)]);}
  const clip=points=>{for(let j=0;j<outline.length&&points.length;j++){const a=outline[j],b=outline[(j+1)%outline.length],side=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),out=[];for(let k=0;k<points.length;k++){const p=points[k],q=points[(k+1)%points.length],d=side(p),D=side(q);if(d>=0)out.push(p);if((d>=0)!==(D>=0)){const t=d/(d-D);out.push(p.map((v,i)=>v+(q[i]-v)*t));}}points=out;}return points;};
  function face(poly,tone,list=tiles){poly=clip(poly);const c=palette[tone];for(let j=1;j<poly.length-1;j++)for(const p of[poly[0],poly[j],poly[j+1]])list.push(n.origin[0]+n.along[0]*p[0]+n.out[0]*p[2],n.origin[1]+p[1],n.origin[2]+n.along[1]*p[0]+n.out[1]*p[2],c.r,c.g,c.b);}
  face(outline.map(([u,v])=>[u,v,-n.depth+.002]),0);
  const size=n.w/(n.w>2?7:4);
  for(let row=0;row<Math.ceil((n.spring+r)/size);row++)for(let col=0;col<Math.ceil(n.w/size);col++){
   const u=-r+(col+.5)*size,v=(row+.5)*size;if(v>n.spring&&u*u+(v-n.spring)**2>r*r+size*size)continue;
   tileCount++;
   for(const[rad,inner,tone,d]of[[.47,.70,2,-n.depth+.004],[.37,.70,(row+col)%3===0?1:4,-n.depth+.006]]){
    const star=Array.from({length:16},(_,i)=>{const a=i*Math.PI/8,rr=size*rad*(i%2?inner:1);return[u+rr*Math.cos(a),v+rr*Math.sin(a),d];});
    for(let i=0;i<16;i++)face([[u,v,d],star[i],star[(i+1)%16]],tone);
   }
   const d=-n.depth+.008,a=size*.085;face([[u-a,v,d],[u,v-a,d],[u+a,v,d],[u,v+a,d]],3);
  }
  // Four nested rows of small concave cells. Every lip stays at least45mm
  // inside the wall face; the original stair headroom and width are unchanged.
  for(let row=0;row<4;row++){
   const bottom=n.spring-.12+row*r*.20,top=bottom+r*.25,span=2*Math.sqrt(Math.max(.01,r*r-(top-n.spring)**2))*.91;
   const count=Math.max(3,Math.round(span/.31)),step=span/count;
   for(let i=0;i<count;i++){
    const u=-span/2+i*step,lip=[u+step/2,bottom+r*.04,-.045-row*.023],left=[u+.008,bottom,-n.depth+.014],right=[u+step-.008,bottom,-n.depth+.014],tl=[u+.008,top,-n.depth+.014],tr=[u+step-.008,top,-n.depth+.014];
    face([tl,tr,lip],(row+i)%3===0?2:1,vaults);face([left,tl,lip],0,vaults);face([tr,right,lip],4,vaults);face([left,lip,right],(row+i)%4===0?3:0,vaults);cellCount++;
   }
  }
 }
 const material=new T.MeshPhongMaterial({vertexColors:true,shininess:55,specular:0x8faaa9,side:T.DoubleSide}),owned=[material];
 for(const[name,list]of[['Blue geometric tile inlays',tiles],['Recessed faceted niche vaults',vaults]]){
  const positions=[],colours=[];for(let i=0;i<list.length;i+=6){positions.push(...list.slice(i,i+3));colours.push(...list.slice(i+3,i+6));}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.computeVertexNormals();owned.push(geometry);
  const mesh=new T.Mesh(geometry,material);mesh.name='Escher · '+name;mesh.userData.nicheOrnament=true;group.add(mesh);
 }
 group.userData.nicheCount=niches.length;group.userData.tileCount=tileCount;group.userData.vaultCellCount=cellCount;
 let disposed=false;return{group,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
