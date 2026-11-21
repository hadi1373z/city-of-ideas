import {createSixfoldHouseRoof,roofHexagon,SIXFOLD_GARDEN_ROOF as R} from './sixfold-house-roof-model.js?v=garden-pattern-roofs-20261121';
import {tilingParentColourIndex} from './sixfold-tiling-scene.js?v=makers-passages-20261118';

/** One persistent roof per house, shared by its near/far presentation. Three
 * small material batches own all geometry; source floors, crown and routes
 * never participate in roof construction or cleanup.
 */
export function buildSixfoldHouseRoof(T,{pattern='penrose'}={}){
 const model=createSixfoldHouseRoof(pattern),group=new T.Group(),owned=new Set();
 group.name=pattern+' · inset tiled limestone garden roof';group.userData.sixfoldGardenRoof={pattern};
 const positions=[[],[],[]],colours=[[],[],[]],own=o=>(owned.add(o),o);
 const limestone=new T.Color(0xd7c8a8),pale=new T.Color(0xe9ddbf),grout=new T.Color(0x93856a),brass=new T.Color(0xbca374),glass=new T.Color(0xb5cbd0);
 const palette=[new T.Color(0xe5d9b9),new T.Color(0xc7b594)];
 function tri(batch,a,b,c,color){positions[batch].push(...a,...b,...c);for(let i=0;i<3;i++)colours[batch].push(color.r,color.g,color.b);}
 const point=([x,z],y)=>[R.sourceX+x,y,z];
 function top(batch,p,y,color){for(let i=1;i<p.length-1;i++)tri(batch,point(p[0],y),point(p[i+1],y),point(p[i],y),color);}
 function prism(p,lo,hi,color){top(0,p,hi,color);for(let i=1;i<p.length-1;i++)tri(0,point(p[0],lo),point(p[i],lo),point(p[i+1],lo),color);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],A=point(a,lo),B=point(b,lo),C=point(b,hi),D=point(a,hi),shade=color.clone().multiplyScalar(.91);tri(0,A,B,C,shade);tri(0,A,C,D,shade);}}
 function shapeRing(outer,inner,lo,hi,topColour=pale,sideColour=limestone,batch=0){
  const shape=new T.Shape();outer.forEach(([x,z],i)=>shape[i?'lineTo':'moveTo'](x,-z));shape.closePath();
  const hole=new T.Path();[...inner].reverse().forEach(([x,z],i)=>hole[i?'lineTo':'moveTo'](x,-z));hole.closePath();shape.holes.push(hole);
  const source=new T.ExtrudeGeometry(shape,{depth:hi-lo,bevelEnabled:false,curveSegments:1}),geometry=source.index?source.toNonIndexed():source;
  geometry.rotateX(-Math.PI/2).translate(R.sourceX,lo,0);const p=geometry.attributes.position,n=geometry.attributes.normal;
  for(let i=0;i<p.count;i++){positions[batch].push(p.getX(i),p.getY(i),p.getZ(i));const c=n.getY(i)>.8?topColour:sideColour;colours[batch].push(c.r,c.g,c.b);}
  geometry.dispose();if(geometry!==source)source.dispose();
 }
 // A solid bearing slab replaces the former cone, with a true lantern cut.
 shapeRing(model.outer,model.opening,R.undersideY,R.slabTopY,grout);
 shapeRing(model.outer,roofHexagon(R.parapetInnerRadius),R.slabTopY,R.parapetTopY);
 shapeRing(roofHexagon(24.83),roofHexagon(24.73),R.parapetTopY,R.capTopY,brass,brass,1);
 shapeRing(roofHexagon(24),model.field,R.slabTopY,R.tileTopY+.012,pale,pale);
 shapeRing(model.fieldOpening,model.opening,R.slabTopY,R.tileTopY+.012,pale,pale);
 for(const tile of model.tiles){const shade=1+Math.sin(tilingParentColourIndex(tile.id)*17.31)*.018,color=palette[tile.kind%2].clone().multiplyScalar(shade);for(const p of tile.polygons)prism(p,R.tileBottomY,R.tileTopY,color);}
 const ring=(radius,y)=>model.opening.map(([x,z])=>{const a=Math.atan2(z,x);return[R.sourceX+radius*Math.cos(a),y,radius*Math.sin(a)];});
 const apertureRadius=R.lanternRadius/Math.cos(Math.PI/R.lanternSides),sillOuter=model.opening.map(([x,z])=>[x*1.07,z*1.07]);
 shapeRing(sillOuter,model.opening,R.slabTopY,R.lanternSillY,pale,pale);
 const bottom=ring(apertureRadius,R.lanternSillY),shoulder=ring(apertureRadius,R.lanternShoulderY),peak=[R.sourceX,R.lanternPeakY,0];
 for(let i=0;i<bottom.length;i++){const j=(i+1)%bottom.length;tri(2,bottom[i],shoulder[i],shoulder[j],glass);tri(2,bottom[i],shoulder[j],bottom[j],glass);tri(2,shoulder[i],peak,shoulder[j],glass);}
 const openingRing=model.opening.map(([x,z])=>[x*1.008,z*1.008]);
 shapeRing(openingRing,model.opening,R.lanternShoulderY-.045,R.lanternShoulderY+.045,brass,brass,1);
 // Six narrow, genuinely supported lantern mullions and cap ribs.
 function beam(a,b,r=.035){const A=new T.Vector3(...a),B=new T.Vector3(...b),d=B.clone().sub(A),g=new T.CylinderGeometry(r,r,d.length(),5);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());const q=g.toNonIndexed(),p=q.attributes.position;for(let i=0;i<p.count;i++){positions[1].push(p.getX(i),p.getY(i),p.getZ(i));colours[1].push(brass.r,brass.g,brass.b);}q.dispose();g.dispose();}
 for(let i=0;i<48;i+=8){beam(bottom[i],shoulder[i]);beam(shoulder[i],peak);}
 const materials=[own(new T.MeshLambertMaterial({vertexColors:true})),own(new T.MeshLambertMaterial({vertexColors:true})),own(new T.MeshPhongMaterial({vertexColors:true,transparent:true,opacity:.27,shininess:68,side:T.DoubleSide,depthWrite:false}))],meshes=[];
 for(let i=0;i<positions.length;i++){const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(positions[i],3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours[i],3));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();const mesh=new T.Mesh(geometry,materials[i]);mesh.name=['Raised limestone rim, exact inset tile prisms and bearing slab','Quiet brass edge cap and lantern framing','Transparent central lantern · real roof opening'][i];mesh.userData.sixfoldGardenRoof={pattern,batch:i};group.add(mesh);meshes.push(mesh);}
 let disposed=false;
 return{group,model,meshes,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();owned.clear();}};
}
