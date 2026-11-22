import {nicheWorld,nicheOutline,nicheWallPlan,nicheCells,nicheCellMouth,nicheCellRoof} from './escher-niche-model.js?v=escher-ornate-final-20261122';
import {createEscherNicheTileFinish,ESCHER_NICHE_TILE_FINISH} from './escher-niche-tile-finish.js?v=escher-ornate-final-20261122';

// The floral compositions follow actual carved faces. Only the ceramic skin
// of the EXISTING stone frame is in front of the wall; all cavities stay behind it.
export function buildEscherNicheOrnaments(T,niches){
 const group=new T.Group();group.name='Escher · tiled recessed stair niches';
 const buffers=[{position:[],color:[],uv:[]},{position:[],color:[],uv:[]}],layouts=[],resources=new Set();
 const regions=ESCHER_NICHE_TILE_FINISH.regions??{panel:[0,0,.5,.5],floral:[.5,0,.5,.5],border:[0,.5,.5,.5],cell:[.5,.5,.5,.5]};
 let tileCount=0,cellCount=0,current,outline,panelRanges,goldRibRanges;
 const count=b=>buffers[b].position.length/3;
 const range=(b,start)=>({batch:b,start,count:count(b)-start});
 const regionUV=(name,u,v)=>{const r=regions[name],e=4/(ESCHER_NICHE_TILE_FINISH.size||2048);return[r[0]+e+Math.max(0,Math.min(1,u))*(r[2]-2*e),r[1]+e+Math.max(0,Math.min(1,v))*(r[3]-2*e)];};
 const clip=poly=>{for(let i=0;i<outline.length&&poly.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],side=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),next=[];for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length],s=side(p),t=side(q);if(s>=-1e-9)next.push(p);if((s>=0)!==(t>=0)){const f=s/(s-t);next.push(p.map((v,k)=>v+(q[k]-v)*f));}}poly=next;}return poly;};
 function face(poly,colour=0xffffff,batch=0,clipped=true,uv=null){if(clipped)poly=clip(poly);const b=buffers[batch],c=new T.Color(colour);for(let i=1;i<poly.length-1;i++)for(const p of[poly[0],poly[i],poly[i+1]]){b.position.push(...nicheWorld(current,p));b.color.push(c.r,c.g,c.b);b.uv.push(...(uv?uv(p):regionUV('floral',(p[0]+current.w/2)/current.w,p[1]/(current.spring+current.w/2))));}}
 const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 function quadUV(q,name,rotate=false){const a=q[0],ab=q[1].map((v,i)=>v-a[i]),ad=q[3].map((v,i)=>v-a[i]),bb=ab.reduce((s,v)=>s+v*v,0),dd=ad.reduce((s,v)=>s+v*v,0);return p=>{const u=ab.reduce((s,v,i)=>s+v*(p[i]-a[i]),0)/bb,v=ad.reduce((s,v,i)=>s+v*(p[i]-a[i]),0)/dd;return regionUV(name,rotate?v:u,rotate?u:v);};}
 function patterned(q,name,{facet=null,clipped=true,colour=0xffffff,rotate=false}={}){const start=count(0);face(q,colour,0,clipped,quadUV(q,name,rotate));panelRanges.push({batch:0,range:[start,count(0)-start],region:name,facet});}
 // A narrow, genuinely raised two-sided gold ridge, rather than a yellow line
 // printed over the blue surface. Its dark edge and crest have different normals.
 function ridge(a,b,width=.0032,{clipped=true,crest=.0026}={}){const x=b[0]-a[0],y=b[1]-a[1],len=Math.hypot(x,y);if(len<1e-8)return;const dx=-y/len*width/2,dy=x/len*width/2,A=[a[0],a[1],a[2]+crest],B=[b[0],b[1],b[2]+crest],al=[a[0]+dx,a[1]+dy,a[2]+.0002],ar=[a[0]-dx,a[1]-dy,a[2]+.0002],bl=[b[0]+dx,b[1]+dy,b[2]+.0002],br=[b[0]-dx,b[1]-dy,b[2]+.0002];face([al,bl,B,A],0xc7ab68,1,clipped);face([A,B,br,ar],0x8c6b32,1,clipped);}
 function path(points,width=.0032,opts={}){for(let i=1;i<points.length;i++)ridge(points[i-1],points[i],width,opts);}
 function panel(points,holes,depth){const contour=points.map(p=>new T.Vector2(...p)),cuts=holes.map(h=>h.map(p=>new T.Vector2(...p))),all=[...points,...holes.flat()];for(const tri of T.ShapeUtils.triangulateShape(contour,cuts))face(tri.map(i=>[...all[i],depth]),0xc4d1cb);}
 function framedWall(q,kind,facet){
  // The complete composition fits ONE physical face: a central medallion,
  // two flanking vine panels and small coherent borders, with no checker grid.
  const at=(u,v)=>mix(mix(q[0],q[1],u),mix(q[3],q[2],u),v),u=.045,v=.05;
  patterned(q,'floral',{facet,colour:0x809c9a});
  const inner=[at(u,v),at(1-u,v),at(1-u,1-v),at(u,1-v)].map(p=>[p[0],p[1],p[2]+.0008]);
  patterned(inner,kind,{facet});
  for(const band of[[at(0,0),at(1,0),at(1,v),at(0,v)],[at(0,1-v),at(1,1-v),at(1,1),at(0,1)],[at(0,v),at(u,v),at(u,1-v),at(0,1-v)],[at(1-u,v),at(1,v),at(1,1-v),at(1-u,1-v)]])patterned(band.map(p=>[p[0],p[1],p[2]+.001]),'border',{facet,rotate:Math.hypot(band[1][0]-band[0][0],band[1][2]-band[0][2])<.1});
  const start=count(1);for(let j=0;j<4;j++)ridge(inner[j],inner[(j+1)%4],.003);goldRibRanges.push({batch:1,range:[start,count(1)-start]});
 }
 function originalFrame(n){
  const r=n.w/2,outer=r+.12,crown=(radius,a)=>n.spring+radius*Math.pow(Math.max(0,1-Math.abs(Math.cos(a))),.65);
  for(const sign of[-1,1]){const l=sign<0?-outer:r,segments=Math.ceil(n.spring/.18);for(let j=0;j<segments;j++){const y0=n.spring*j/segments,y1=n.spring*(j+1)/segments,q=[[l,y0,.086],[l+.12,y0,.086],[l+.12,y1,.086],[l,y1,.086]];patterned(q,'border',{clipped:false,rotate:true});}}
  const a0=[],a1=[];
  for(let j=0;j<=32;j++){const a=j*Math.PI/32;a0.push([r*Math.cos(a),crown(r,a),.086]);a1.push([outer*Math.cos(a),crown(outer,a),.086]);}
  // Unroll the floral band continuously around the arch, instead of stamping
  // the same square tile across the crown's diagonal edges.
  for(let j=0;j<32;j++){
   const q=[a0[j],a1[j],a1[j+1],a0[j+1]],start=count(0),A=q[0],B=q[1],C=q[3],ab=B.map((v,i)=>v-A[i]),ac=C.map((v,i)=>v-A[i]),den=ab[0]*ac[1]-ab[1]*ac[0];
   face(q,0xffffff,0,false,p=>{const dx=p[0]-A[0],dy=p[1]-A[1],u=(dx*ac[1]-dy*ac[0])/den,v=(ab[0]*dy-ab[1]*dx)/den;return regionUV('border',((j%4)+v)/4,u);});panelRanges.push({batch:0,range:[start,count(0)-start],region:'border',facet:'arch-frame'});
  }
  const start=count(1);
  for(const sign of[-1,1])for(const edge of[.006,.114])path([[sign*(r+edge),.004,.086],[sign*(r+edge),n.spring,.086]],.0038,{clipped:false});
  for(const edge of[.006,.114])path(Array.from({length:49},(_,j)=>{const a=j*Math.PI/48;return[(r+edge)*Math.cos(a),crown(r+edge,a),.086];}),.0038,{clipped:false});
  const sillWidth=2*(r+.188),sillSegments=Math.ceil(sillWidth/.18);for(let j=0;j<sillSegments;j++){const x0=-r-.188+sillWidth*j/sillSegments,x1=-r-.188+sillWidth*(j+1)/sillSegments;patterned([[x0,-.098,.101],[x1,-.098,.101],[x1,-.002,.101],[x0,-.002,.101]],'border',{clipped:false});}
  for(const y of[-.093,-.007])path([[-r-.18,y,.101],[r+.18,y,.101]],.0038,{clipped:false});
  goldRibRanges.push({batch:1,range:[start,count(1)-start]});
 }
 for(const n of niches){
  current=n;outline=nicheOutline(n,{inset:.012});panelRanges=[];goldRibRanges=[];
  const first=[count(0),count(1)],layout=nicheCells(n),wallPlan=nicheWallPlan(n),wallTop=layout.bottom+.006;
  face(outline.map(([u,v])=>[u,v,-n.depth+.002]),0x718e92);
  // Tile the true arch reveal on its original cosine-spaced structural profile.
  const revealR=n.w/2-.004,reveal=[[-revealR,.012],[revealR,.012],[revealR,n.spring]];
  for(let j=1;j<=32;j++){const a=j*Math.PI/32;reveal.push([revealR*Math.cos(a),n.spring+revealR*Math.pow(Math.max(0,1-Math.abs(Math.cos(a))),.65)]);}
  for(let j=0;j<reveal.length;j++){const a=reveal[j],b=reveal[(j+1)%reveal.length];patterned([[...a,-.045],[...b,-.045],[...b,-n.depth+.003],[...a,-n.depth+.003]],'floral',{clipped:false});}
  for(let j=1;j<wallPlan.length;j++){const a=wallPlan[j-1],b=wallPlan[j];framedWall([[a[0],.026,a[1]],[b[0],.026,b[1]],[b[0],wallTop,b[1]],[a[0],wallTop,a[1]]],j===2?'panel':'floral',j-1);}
  patterned(wallPlan.map(([u,d])=>[u,.024,d]),'floral');
  const inner=nicheOutline(n,{inset:.060});
  for(let j=0;j<outline.length;j++){const k=(j+1)%outline.length;face([[...outline[j],-.050],[...outline[k],-.050],[...inner[k],-.050],[...inner[j],-.050]]);}
  for(const c of layout.cells){
   const tileStart=count(0),vaultStart=count(1),[left,right,bottom,top]=c.panel,front=-c.frontDepth,opening=nicheCellMouth(c);
   panel([[left,bottom],[right,bottom],[right,top],[left,top]],[opening],front);
   const localPlan=c.plan.map(([u,d])=>[c.u+u,d]),facetCorners=[];
   for(let k=1;k<localPlan.length;k++){
    const a=localPlan[k-1],b=localPlan[k],q=[[a[0],c.y,a[1]],[b[0],c.y,b[1]],[b[0],c.y+c.spring,b[1]],[a[0],c.y+c.spring,a[1]]];
    face(q,[0x153b53,0x102b42,0x1d5262][k-1],1);facetCorners.push(q);
    patterned(q.map(p=>[p[0],p[1],p[2]+.0008]),'cell',{facet:c.id+':'+(k-1),colour:[0x8aafa7,0x9eb8b0,0xbed2c7][k-1]});
   }
   // Narrow lancet/fluted ceilings, with true gold ridges running into their
   // depth. Their curved side edges meet the three equal vertical wall facets.
   for(let s=0;s<3;s++)for(let t=0;t<6;t++){
    const q=[nicheCellRoof(c,t/6,s/3),nicheCellRoof(c,(t+1)/6,s/3),nicheCellRoof(c,(t+1)/6,(s+1)/3),nicheCellRoof(c,t/6,(s+1)/3)];
    face(q,[0x9ab4b3,0x789b9c,0x577d8b][s],0,true,p=>regionUV('cell',(p[0]-c.u+c.width/2)/c.width,(p[1]-c.y)/c.height));
   }
   face([[c.u-c.width/2,c.y,front],[c.u+c.width/2,c.y,front],[c.u+c.width/4,c.y,front-c.pocketDepth],[c.u-c.width/4,c.y,front-c.pocketDepth]],0x708e94,0);
   const rear=nicheCellMouth(c,{rear:true}),minU=c.u-c.width/4;
   face(rear.slice(2).map(([u,v])=>[u,v,front-c.pocketDepth]),0x102e43,1);
   face(rear.map(([u,v])=>[u,v,front-c.pocketDepth+.0008]),0xaac5b9,0,true,p=>regionUV('cell',(p[0]-minU)/(c.width/2),(p[1]-c.y)/(c.spring+c.rise*.8)));
   const ribStart=count(1),mouth=opening.map(([u,v])=>[u,v,front]);
   // A tiny concave scallop joins the lip to the next cell; every ridge remains
   // recessed, with no projecting tooth entering the stair's clear volume.
   path([mouth[0],[c.u,c.y-.007,front],mouth[1]],.0034);
   path([...mouth.slice(1),mouth[0]],.0032);
   for(const t of[.16,.5,.84])path(Array.from({length:4},(_,j)=>nicheCellRoof(c,t,j/3)),.0022);
   goldRibRanges.push({batch:1,range:[ribStart,count(1)-ribStart]});
   if(c.index===0)face([[left,bottom,front],[left,top,front],[left,top,-n.depth+.003],[left,bottom,-n.depth+.003]],0x63878a);
   if(c.index===layout.rows[c.row].count-1)face([[right,top,front],[right,bottom,front],[right,bottom,-n.depth+.003],[right,top,-n.depth+.003]],0x63878a);
   face([[left,bottom,front],[right,bottom,front],[right,bottom,-n.depth+.003],[left,bottom,-n.depth+.003]],0x708f8c);
   if(c.row===5)face([[right,top,front],[left,top,front],[left,top,-n.depth+.003],[right,top,-n.depth+.003]],0x63878a);
   c.facetCorners=facetCorners;c.tileRange=[tileStart,count(0)-tileStart];c.vaultRange=[vaultStart,count(1)-vaultStart];cellCount++;
  }
  for(const row of layout.rows){const cells=layout.cells.filter(c=>c.row===row.row);for(let j=1;j<cells.length;j++){const a=cells[j-1],b=cells[j],u=b.panel[0];face([[u,row.y,-a.frontDepth],[u,row.top,-a.frontDepth],[u,row.top,-b.frontDepth],[u,row.y,-b.frontDepth]],0x789490);}}
  // Fine ribs fan from the forward crown into the deep arched return. They
  // occupy real curved roof positions and are naturally hidden behind the
  // lower carved cells, rather than drawing a flat starburst over the mouths.
  const fanStart=count(1),r=n.w/2;
  for(let j=-5;j<=5;j++)path(Array.from({length:7},(_,k)=>{const s=k/6,u=j/5*r*(.18+.82*s);return[u,n.spring+r*Math.pow(Math.max(0,1-Math.abs(u)/r),.65)-.018,-.055-.53*s];}),.0022);
  goldRibRanges.push({batch:1,range:[fanStart,count(1)-fanStart],kind:'curved-crown-fan'});
  const interiorRanges=first.map((s,b)=>range(b,s)),frameStarts=[count(0),count(1)];originalFrame(n);
  const frameRanges=frameStarts.map((s,b)=>range(b,s));tileCount+=panelRanges.length;
  layouts.push({niche:n,cells:layout.cells,rows:layout.rows,wallPlan,wallTop,rangeUnits:'vertices',tileRange:[first[0],count(0)-first[0]],vaultRange:[first[1],count(1)-first[1]],interiorRanges,frameRanges,panelRanges,goldRibRanges});
 }
 const finish=createEscherNicheTileFinish(T),materials=[new T.MeshPhongMaterial({vertexColors:true,map:finish.map,bumpMap:finish.bumpMap,bumpScale:.0009,shininess:28,specular:0x817e68,side:T.DoubleSide}),new T.MeshPhongMaterial({vertexColors:true,shininess:64,specular:0x85714f,side:T.DoubleSide})];materials.forEach(m=>resources.add(m));
 for(let i=0;i<2;i++){const b=buffers[i],g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.position,3));g.setAttribute('color',new T.Float32BufferAttribute(b.color,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));g.computeVertexNormals();g.computeBoundingSphere();resources.add(g);const m=new T.Mesh(g,materials[i]);m.name=i?'Escher · Recessed faceted niche vaults · three equal walls':'Escher · Blue geometric tile inlays · three-sided deep inner walls';m.userData.nicheOrnament=true;group.add(m);}
 group.userData.nicheCount=niches.length;group.userData.tileCount=tileCount;group.userData.vaultCellCount=cellCount;group.userData.nicheLayouts=layouts;group.userData.finishRevision='ornate-fitted-panels-20261122';
 let disposed=false;return{group,layouts,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of resources)r.dispose();finish.dispose();group.clear();}};
}
