import {createHouseTiling,createHouseWallTiling,houseWallPoint,createHouseStairTiling,createHouseLandingTiling,withoutHouseLanding} from './house-tiling-model.js?v=sixfold-city-20261118c';
import {HOUSE_LEVELS} from './transformation-house-model.js?v=sixfold-city-20261118c';
import {SIXFOLD_TILINGS} from './sixfold-tiling-model.js?v=sixfold-city-20261118c';
import {tilingParentColourIndex,tilingPatternPalette,compactTilingMeshes} from './sixfold-tiling-scene.js?v=sixfold-city-20261118c';

// A finite Robinson substitution patch, paired into genuine thick/thin rhombs.
// Tile faces share one finish per storey; clipped fragments never get fake seams.
const PALETTES = [
 {floor:[0x526b7b,0xc4ab70],ceiling:[0xb2b9b3,0x819392],border:0x394c58},
 {floor:[0x73918a,0xd2c7a9],ceiling:[0xd3c9ae,0x9da991],border:0x3c605d},
 {floor:[0x547b79,0xd7c9a7],ceiling:[0xe1d4b7,0x9caf9f],border:0x3d5c5c},
 {floor:[0x53677f,0xc4b794],ceiling:[0xc5c3b4,0x879597],border:0x394955},
 {floor:[0x865a50,0xc7af7e],ceiling:[0xd0bba1,0xa38a71],border:0x583f39},
 {floor:[0x647371,0xcbb47b],ceiling:[0xc3c3aa,0x8a9890],border:0x3d5052},
 {floor:[0x728174,0xc4bb9c],ceiling:[0xc5c6ac,0x8a9b87],border:0x4c5c50},
 {floor:[0x526266,0xbd9d70],ceiling:[0xc4b99f,0x87938e],border:0x344b4e}
];

export function buildHouseTiling(T,{pattern='penrose',compact=false}={}){
 const info=SIXFOLD_TILINGS.find(p=>p.id===pattern);if(!info)throw new RangeError('Unknown mathematical tiling');const palettes=PALETTES.map(p=>tilingPatternPalette(T,pattern,p));
 const patch=createHouseTiling({outerRadius:22.4,wellRadius:10.7,grout:.035,pattern});
 const group=new T.Group();group.name=(pattern==='penrose'?'Penrose':info.name)+' stonework · continuous floors, walls and shallow vaulted ceilings';
 const owned=new Set(),floors=[],ceilings=[],borders=[],walls=[],own=o=>(owned.add(o),o);
 const tileMaterial=own(new T.MeshLambertMaterial({vertexColors:true}));
 const borderMaterial=own(new T.MeshLambertMaterial({vertexColors:true}));
 const hex=radius=>Array.from({length:6},(_,i)=>[radius*Math.cos(i*Math.PI/3),radius*Math.sin(i*Math.PI/3)]);
 function finish(positions,colors,name,material=tileMaterial){
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new T.Mesh(geometry,material);mesh.name=name;group.add(mesh);return mesh;
 }
 function triangle(out,colors,a,b,c,color){out.push(...a,...b,...c);for(let i=0;i<3;i++)colors.push(color.r,color.g,color.b);}
 function polygon(out,colors,points,y,color,up){
  const p=points.map(([x,z])=>[125+x,y(x,z),z]);
  for(let j=1;j<p.length-1;j++)triangle(out,colors,p[0],p[up?j+1:j],p[up?j:j+1],color);
 }
 for(const [index,level] of HOUSE_LEVELS.entries()){
  const palette=palettes[index],floorY=level.y+.022;
  const ceilingY=(x,z)=>{const r=Math.hypot(x,z),gauge=Math.max(Math.abs(z)*2/Math.sqrt(3),Math.abs(x)+Math.abs(z)/Math.sqrt(3)),edge=22.4*r/gauge,u=Math.max(0,Math.min(1,(r-10.7)/(edge-10.7)));return level.y+7.3+.35*Math.sin(Math.PI*u);};
  for(const [isFloor,colorsHex,y] of [[true,palette.floor,()=>floorY],[false,palette.ceiling,ceilingY]]){
   const positions=[],colors=[];
   for(const [i,cell] of patch.cells.entries()){
    const shade=1+Math.sin(i*17.31)*.025,color=new T.Color(colorsHex[cell.kind]).multiplyScalar(shade);
    for(const piece of cell.insetPolygons)polygon(positions,colors,piece,y,color,isFloor);
   }
   const mesh=finish(positions,colors,level.name+(isFloor?(pattern==='penrose'?' · matched Penrose rhomb floor':' · matched '+info.name+' floor'):' · tiled shallow vault'));
   mesh.userData.houseTiling={pattern,level:level.y,upward:isFloor,thin:patch.counts.thin,thick:patch.counts.thick};
   (isFloor?floors:ceilings).push(mesh);
  }
  // Quiet perimeter bands frame the intricate field and keep the well legible.
  const positions=[],colors=[],border=new T.Color(palette.border),brass=new T.Color(0xb69b66),outer=hex(23),inner=hex(22.4);
  const strip=(a,b,c,d,color,gap=false)=>{for(const piece of gap?withoutHouseLanding([a,b,c,d]):[[a,b,c,d]])polygon(positions,colors,piece,()=>floorY+.002,color,true);};
  for(let i=0;i<6;i++){const j=(i+1)%6;strip(inner[i],outer[i],outer[j],inner[j],border);}
  for(let i=0;i<192;i++){
   const a=i*Math.PI/96,b=(i+1)*Math.PI/96,p=(r,t)=>[r*Math.cos(t),r*Math.sin(t)];
   strip(p(10.3,a),p(10.7,a),p(10.7,b),p(10.3,b),border,true);
   strip(p(10.63,a),p(10.66,a),p(10.66,b),p(10.63,b),brass,true);
  }
  borders.push(finish(positions,colors,level.name+' · quiet stone and brass borders',borderMaterial));
 }
 // One rhomb field is unfolded over the entire six-sided perimeter and the
 // full height of the house, then folded at its corners. Storeys share the
 // same parent tile ids and cuts rather than restarting a pattern per wall.
 const wallPatch=createHouseWallTiling({levels:HOUSE_LEVELS.map(l=>l.y),pattern}),wallPositions=[],wallColors=[],wallNormals=[];
 const calmStone=new T.Color(0xe1d5ba);
 for(const panel of wallPatch.panels){
  const index=HOUSE_LEVELS.findIndex(l=>l.y===panel.level),palette=palettes[index];
  for(const cell of panel.cells){
   const shade=1+Math.sin(tilingParentColourIndex(cell.id)*17.31)*.018;
   const color=new T.Color(palette.floor[cell.kind]).lerp(calmStone,.67).multiplyScalar(shade);
   for(const piece of cell.insetPolygons){const p=piece.map(q=>houseWallPoint(panel,q));for(let j=1;j<p.length-1;j++){triangle(wallPositions,wallColors,p[0],p[j],p[j+1],color);for(let k=0;k<3;k++)wallNormals.push(panel.inward[0],0,panel.inward[1]);}}
  }
 }
 const tiledWalls=finish(wallPositions,wallColors,'All 48 interior walls · one folded '+(pattern==='penrose'?'Penrose':info.name)+' field');
 // Analytic planar normals avoid float32 sliver noise at clipped window corners.
 tiledWalls.geometry.setAttribute('normal',new T.Float32BufferAttribute(wallNormals,3));
 tiledWalls.userData.houseWallTiling={pattern,panels:48,pairedRhombs:pattern==='penrose',offset:wallPatch.offset,unfolded:true};walls.push(tiledWalls);
 // A slender vertical corner joint makes the folding deliberate and provides
 // an honest architectural closing seam for the finite aperiodic patch.
 const jointPositions=[],jointColors=[],joint=new T.Color(0x8f886d),warmJoint=new T.Color(0xc4ad74);
 for(const panel of wallPatch.panels){
  const seam=panel.wall===0,color=seam?warmJoint:joint;
  const u0=panel.s0,u1=panel.s0+.035;
  const p=[[u0,panel.v0+.60],[u1,panel.v0+.60],[u1,panel.v1-.24],[u0,panel.v1-.24]].map(q=>{
   const v=houseWallPoint(panel,q);v[0]+=panel.inward[0]*.008;v[2]+=panel.inward[1]*.008;return v;
  });
  // Deep west apertures meet at the corner: no trim crosses their jambs.
  if(panel.level===-40&&(panel.wall===2||panel.wall===3))continue;
  triangle(jointPositions,jointColors,p[0],p[1],p[2],color);triangle(jointPositions,jointColors,p[0],p[2],p[3],color);
 }
 const wallJoint=finish(jointPositions,jointColors,'Continuous folded corner joints · quiet closing seam',borderMaterial);
 const stairPatch=createHouseStairTiling({pattern}),stairPositions=[],stairColors=[];
 const stairColours=[new T.Color(0x6e8586),new T.Color(0xccbb94)],nosing=new T.Color(0xd8ccb2),riserGold=new T.Color(0xb29a67),riserSage=new T.Color(0x788a83);
 for(const tread of stairPatch.treads){
  if(!tread.landing)for(const cell of tread.cells)polygon(stairPositions,stairColors,cell.piece,()=>tread.y+tread.capOffset,stairColours[cell.kind],true);
  if(tread.y-tread.nextY<1e-7)continue;
  polygon(stairPositions,stairColors,tread.nosing,()=>tread.y+.024,nosing,true);
  // Thin inset ceramic riser bands catch the descent rhythm. Their geometry is
  // independent of the existing caps, risers, rails and exact navigation height.
  const a=tread.riserAngle,p=(r,y)=>[125+r*Math.cos(a),y,r*Math.sin(a)];
  for(const[ri,ro,color]of[[6.80,7.26,riserGold],[7.26,9.14,riserSage],[9.14,9.58,riserGold]]){
   const v=[p(ri,tread.y-.090),p(ro,tread.y-.090),p(ro,tread.y-.040),p(ri,tread.y-.040)];
   triangle(stairPositions,stairColors,v[0],v[1],v[2],color);triangle(stairPositions,stairColors,v[0],v[2],v[3],color);
  }
 }
 const stairInlays=finish(stairPositions,stairColors,pattern==='penrose'?'448 rhomb-inlaid treads · ivory nosings and ceramic risers':'448 '+info.name+' inlaid treads · ivory nosings and ceramic risers');
 stairInlays.userData.houseStairTiling={pattern,treads:448,capOffset:.022,sharedLandingProfile:true};
 const landingPatch=createHouseLandingTiling(patch.well,{pattern}),landingPositions=[],landingColors=[],patchIndices=new Map(patch.cells.map((c,i)=>[c.id,i])),matchedShade=id=>1+Math.sin((patchIndices.get(id)??tilingParentColourIndex(id))*17.31)*.025;
 for(const[index,level]of HOUSE_LEVELS.entries())for(const cell of landingPatch.cells){const color=new T.Color(palettes[index].floor[cell.kind]).multiplyScalar(matchedShade(cell.id));for(const piece of cell.polygons)polygon(landingPositions,landingColors,piece,()=>level.y+.022,color,true);}
 const landingFinish=finish(landingPositions,landingColors,'Eight continuous '+(pattern==='penrose'?'rhomb':info.name)+' landings · stair to room with no threshold stripe');
 const crownPositions=[],crownColors=[];for(const cell of landingPatch.crown){const color=new T.Color(palettes[0].ceiling[cell.kind]).multiplyScalar(matchedShade(cell.id));polygon(crownPositions,crownColors,cell.polygon,(x,z)=>23.3+.65*Math.max(0,1-(x*x+z*z)/(10.7*10.7)),color,false);}
 const crown=finish(crownPositions,crownColors,'Complete tiled crown · the house ceiling above the light well');crown.userData.houseCrown=true;
 const wallJoints=[wallJoint],stairs=[stairInlays],landings=[landingFinish],crowns=[crown];let packing=null;
 if(compact){packing=compactTilingMeshes(T,group,{own,release:g=>{owned.delete(g);g.dispose();}});for(const list of[floors,ceilings,borders,walls,wallJoints,stairs,landings,crowns])for(let i=0;i<list.length;i++)list[i]=packing.records.get(list[i]);}
 const geometryBytes=packing?.geometryBytes??[...owned].filter(o=>o.isBufferGeometry).reduce((sum,g)=>sum+Object.values(g.attributes).reduce((n,a)=>n+a.array.byteLength,0)+(g.index?.array.byteLength??0),0);let disposed=false;
 return{pattern,compact,group,floors,ceilings,borders,walls,wallJoints,stairs,landings,crowns,batches:packing?.batches??null,surfaceRecords:packing?[...packing.records.values()]:null,geometryBytes,patch,wallPatch,stairPatch,landingPatch,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const resource of owned)resource.dispose();owned.clear();}};
}
