import {GRAVITY_STAIR as G,gravityStairFrame,gravityStairCenter,gravityStairTread} from './gravity-stair-model.js?v=gravity-ant-20261117';

/** Original full-turn ribbon, planar treads and rails roll through a half-turn. */
export function buildGravityStair(T){
 const group=new T.Group(),walking=new T.Group(),owned=new Set(),own=x=>(owned.add(x),x),material=(color)=>own(new T.MeshLambertMaterial({color,side:T.DoubleSide}));group.name='Gradual half-turn stair between the two faces';walking.name='Exact supported gravity-turn treads';group.add(walking);
 const stone=material(0xafa68e),brass=material(0xab9459),v=[],ix=[],add=(p,b,s)=>new T.Vector3(p.x,p.y,p.z).addScaledVector(new T.Vector3(b.x,b.y,b.z),s),quad=(a,b,c,d)=>{const i=v.length/3;v.push(...a.toArray(),...b.toArray(),...c.toArray(),...d.toArray());ix.push(i,i+1,i+2,i,i+2,i+3);};
 for(let i=0;i<G.steps;i++){
  const q=gravityStairTread(i),f=gravityStairFrame((i+1)/G.steps),a=add(q.start,q.right,-G.width/2),b=add(q.start,q.right,G.width/2),c=add(q.end,q.right,G.width/2),d=add(q.end,q.right,-G.width/2),an=add(q.next,f.right,-G.width/2),bn=add(q.next,f.right,G.width/2),bottom=p=>add(p,q.up,-G.depth);
  quad(a,b,c,d);quad(bottom(d),bottom(c),bottom(b),bottom(a));quad(a,d,bottom(d),bottom(a));quad(c,b,bottom(b),bottom(c));quad(d,c,bn,an);
 }
 const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();const treads=new T.Mesh(geo,stone);treads.name='240 gradually inverted stone treads and closed risers';walking.add(treads);
 const cylinder=own(new T.CylinderGeometry(1,1,1,8)),beams=[],Y=new T.Vector3(0,1,0),beam=(a,b,r)=>{const d=b.clone().sub(a);beams.push({p:a.clone().add(b).multiplyScalar(.5),q:new T.Quaternion().setFromUnitVectors(Y,d.clone().normalize()),r,length:d.length()});};
 function railPoint(u,edge,height){const f=gravityStairFrame(u);return add(add(gravityStairCenter(u),f.right,edge),f.up,height);}
 for(const edge of[-G.width/2-.06,G.width/2+.06]){
  for(let i=0;i<G.steps;i++){const a=i/G.steps,b=(i+1)/G.steps;beam(railPoint(a,edge,G.railHeight),railPoint(b,edge,G.railHeight),.04);if(i%8===0)beam(railPoint(a,edge,-.03),railPoint(a,edge,G.railHeight),.035);}
  beam(railPoint(1,edge,-.03),railPoint(1,edge,G.railHeight),.035);
 }
 const rails=new T.InstancedMesh(cylinder,brass,beams.length),dummy=new T.Object3D();rails.name='Continuous rounded handrails through the gravity turn';beams.forEach((p,i)=>{dummy.position.copy(p.p);dummy.quaternion.copy(p.q);dummy.scale.set(p.r,p.length,p.r);dummy.updateMatrix();rails.setMatrixAt(i,dummy.matrix);});rails.instanceMatrix.needsUpdate=true;rails.computeBoundingSphere?.();group.add(rails);
 let disposed=false;return{group,walking,treads,rails,counts:{treads:G.steps,drawMeshes:2,railSegments:beams.length},dispose(){if(disposed)return;disposed=true;group.removeFromParent();rails.dispose?.();for(const x of owned)x.dispose();group.clear();}};
}
