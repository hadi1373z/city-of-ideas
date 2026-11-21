import {nicheWorld,nicheOutline,nicheArchHeight,nicheWallPlan,nicheCells,nicheCellMouth,nicheCellRoof} from './escher-niche-model.js?v=escher-blue-alcoves-final-20261121';
import {createEscherNicheTileFinish} from './escher-niche-tile-finish.js?v=escher-blue-alcoves-final-20261121';

// Real recessed chambers and carved pockets. None of the former outward
// triangular teeth is used. Every decorative vertex stays behind the wall.
export function buildEscherNicheOrnaments(T,niches){
 const group=new T.Group();group.name='Escher · tiled recessed stair niches';
 const buffers=[{position:[],color:[],uv:[]},{position:[],color:[],uv:[]}],layouts=[],resources=new Set();
 let tileCount=0,cellCount=0,current,outline;
 const count=b=>buffers[b].position.length/3;
 const clip=poly=>{for(let i=0;i<outline.length&&poly.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],side=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),next=[];for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length],s=side(p),t=side(q);if(s>=-1e-9)next.push(p);if((s>=0)!==(t>=0)){const f=s/(s-t);next.push(p.map((v,k)=>v+(q[k]-v)*f));}}poly=next;}return poly;};
 function face(poly,colour=0xffffff,batch=0,clipped=true){if(clipped)poly=clip(poly);const b=buffers[batch],c=new T.Color(colour);for(let i=1;i<poly.length-1;i++)for(const p of[poly[0],poly[i],poly[i+1]]){b.position.push(...nicheWorld(current,p));b.color.push(c.r,c.g,c.b);b.uv.push((p[0]+current.w/2)/.8,(p[1]-.30*p[2])/.8);}}
 function line(a,b,width=.0032,colour=0xcdb16b){const x=b[0]-a[0],y=b[1]-a[1],len=Math.hypot(x,y);if(len<1e-8)return;const dx=-y/len*width/2,dy=x/len*width/2,A=[a[0],a[1],a[2]+.0018],B=[b[0],b[1],b[2]+.0018];face([[A[0]+dx,A[1]+dy,A[2]],[B[0]+dx,B[1]+dy,B[2]],[B[0]-dx,B[1]-dy,B[2]],[A[0]-dx,A[1]-dy,A[2]]],colour,1);}
 function panel(points,holes,depth){const contour=points.map(p=>new T.Vector2(...p)),cuts=holes.map(h=>h.map(p=>new T.Vector2(...p))),all=[...points,...holes.flat()];for(const tri of T.ShapeUtils.triangulateShape(contour,cuts))face(tri.map(i=>[...all[i],depth]));}
 for(const n of niches){
  current=n;outline=nicheOutline(n,{inset:.012});const first=[count(0),count(1)],layout=nicheCells(n),wallPlan=nicheWallPlan(n),wallTop=layout.bottom+.006;
  // The full recess remains backed even between the independently carved
  // courses. Its lower wall is three equal-length vertical planes, not a flat
  // poster or a pyramid placed over the back plane.
  face(outline.map(([u,v])=>[u,v,-n.depth+.002]));
  // The actual masonry arch has32 cosine-spaced segments. Tile its exposed
  // inner return too: from below, the bare curved reveal otherwise appears
  // as beige wedges between the recessed hood courses. A4mm inward offset
  // avoids coplanar fighting while preserving the original stone frame. This
  // exact structural profile bypasses the narrower40-step ornament clip;
  // every point still lies strictly inside the original carved aperture.
  const revealR=n.w/2-.004,reveal=[[-revealR,.012],[revealR,.012],[revealR,n.spring]];
  for(let j=1;j<=32;j++){const a=j*Math.PI/32;reveal.push([revealR*Math.cos(a),n.spring+revealR*Math.pow(Math.max(0,1-Math.abs(Math.cos(a))),.65)]);}
  for(let j=0;j<reveal.length;j++){const a=reveal[j],b=reveal[(j+1)%reveal.length];face([[...a,-.045],[...b,-.045],[...b,-n.depth+.003],[...a,-n.depth+.003]],0xffffff,0,false);}
  for(let j=1;j<wallPlan.length;j++){const a=wallPlan[j-1],b=wallPlan[j];face([[a[0],.026,a[1]],[b[0],.026,b[1]],[b[0],wallTop,b[1]],[a[0],wallTop,a[1]]]);line([a[0],.04,a[1]],[a[0],wallTop,a[1]],.004);}
  face(wallPlan.map(([u,d])=>[u,.024,d]));
  // A continuous blue tiled surround and a fine gold inner line remain INSIDE
  // the original stone jamb. No added ornament projects into the stair lane.
  const inner=nicheOutline(n,{inset:.070});
  for(let j=0;j<outline.length;j++){const k=(j+1)%outline.length;face([[...outline[j],-.050],[...outline[k],-.050],[...inner[k],-.050],[...inner[j],-.050]]);line([...inner[j],-.050],[...inner[k],-.050],.004);}
  for(const c of layout.cells){
   const tileStart=count(0),vaultStart=count(1),[left,right,bottom,top]=c.panel,front=-c.frontDepth,opening=nicheCellMouth(c);
   panel([[left,bottom],[right,bottom],[right,top],[left,top]],[opening],front);
   const localPlan=c.plan.map(([u,d])=>[c.u+u,d]);
   const facetCorners=[];
   for(let k=1;k<localPlan.length;k++){
    const a=localPlan[k-1],b=localPlan[k],quad=[[a[0],c.y,a[1]],[b[0],c.y,b[1]],[b[0],c.y+c.spring,b[1]],[a[0],c.y+c.spring,a[1]]];
    face(quad,[0x18548a,0x123c70,0x267b94][k-1],1);facetCorners.push(quad);
   }
   // Curved overhead cover recedes to the half-width back. Its side edges
   // meet the two vertical oblique walls at their exact shared spring line.
   for(let s=0;s<4;s++)for(let t=0;t<12;t++)face([nicheCellRoof(c,t/12,s/4),nicheCellRoof(c,(t+1)/12,s/4),nicheCellRoof(c,(t+1)/12,(s+1)/4),nicheCellRoof(c,t/12,(s+1)/4)],s%2?0x1c658e:0x246f94,1);
   face([[c.u-c.width/2,c.y,front],[c.u+c.width/2,c.y,front],[c.u+c.width/4,c.y,front-c.pocketDepth],[c.u-c.width/4,c.y,front-c.pocketDepth]],0x236c8d,1);
   const rear=nicheCellMouth(c,{rear:true});face(rear.slice(2).map(([u,v])=>[u,v,front-c.pocketDepth]),0x174d80,1);
   // Small ivory/gold stars on the actual recessed rear planes accompany the
   // richer original ceramic surface map on the lower walls and hood webs.
   const starY=c.y+c.spring*.52,starR=Math.min(c.width*.16,c.spring*.38),star=Array.from({length:16},(_,j)=>{const a=j*Math.PI/8,r=starR*(j%2?.55:1);return[c.u+r*Math.cos(a),starY+r*Math.sin(a),front-c.pocketDepth+.002];});face(star,0xe3d9b3,1);
   for(let j=0;j<opening.length;j++)line([...opening[j],front],[...opening[(j+1)%opening.length],front],.0026);
   // Closed returns at exposed course edges distinguish carved pockets from
   // floating sheets. Their common structural rear stays at the full depth.
   if(c.index===0)face([[left,bottom,front],[left,top,front],[left,top,-n.depth+.003],[left,bottom,-n.depth+.003]]);
   if(c.index===layout.rows[c.row].count-1)face([[right,top,front],[right,bottom,front],[right,bottom,-n.depth+.003],[right,top,-n.depth+.003]]);
   face([[left,bottom,front],[right,bottom,front],[right,bottom,-n.depth+.003],[left,bottom,-n.depth+.003]]);
   if(c.row===5)face([[right,top,front],[left,top,front],[left,top,-n.depth+.003],[right,top,-n.depth+.003]]);
   c.facetCorners=facetCorners;c.tileRange=[tileStart,count(0)-tileStart];c.vaultRange=[vaultStart,count(1)-vaultStart];cellCount++;
  }
  // Adjacent cells translate rigidly toward the centre; these small connecting
  // webs close their different front depths without distorting equal facets.
  for(const row of layout.rows){const cells=layout.cells.filter(c=>c.row===row.row);for(let j=1;j<cells.length;j++){const a=cells[j-1],b=cells[j],u=b.panel[0];face([[u,row.y,-a.frontDepth],[u,row.top,-a.frontDepth],[u,row.top,-b.frontDepth],[u,row.y,-b.frontDepth]]);}}
  tileCount+=Math.ceil(n.w/.2)*Math.ceil((n.spring+n.w/2)/.2);
  layouts.push({niche:n,cells:layout.cells,rows:layout.rows,wallPlan,wallTop,rangeUnits:'vertices',tileRange:[first[0],count(0)-first[0]],vaultRange:[first[1],count(1)-first[1]]});
 }
 const finish=createEscherNicheTileFinish(T),materials=[new T.MeshPhongMaterial({vertexColors:true,map:finish.map,bumpMap:finish.bumpMap,bumpScale:.0015,shininess:36,specular:0x638591,side:T.DoubleSide}),new T.MeshPhongMaterial({vertexColors:true,shininess:40,specular:0x789b9f,side:T.DoubleSide})];materials.forEach(m=>resources.add(m));
 for(let i=0;i<2;i++){const b=buffers[i],g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.position,3));g.setAttribute('color',new T.Float32BufferAttribute(b.color,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));g.computeVertexNormals();g.computeBoundingSphere();resources.add(g);const m=new T.Mesh(g,materials[i]);m.name=i?'Escher · Recessed faceted niche vaults · three equal walls':'Escher · Blue geometric tile inlays · three-sided deep inner walls';m.userData.nicheOrnament=true;group.add(m);}
 group.userData.nicheCount=niches.length;group.userData.tileCount=tileCount;group.userData.vaultCellCount=cellCount;group.userData.nicheLayouts=layouts;
 let disposed=false;return{group,layouts,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of resources)r.dispose();finish.dispose();group.clear();}};
}
