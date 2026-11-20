import {miura} from './origami-house-math.js?v=cloister-details-20261120';
import {ORIGAMI_ENTRY,origamiEntrySheet,origamiEntryPosts} from './origami-house-entry-model.js?v=cloister-details-20261120';
export const ORIGAMI_ROOF=Object.freeze({profile:[[-9.7,4.15],[-5,6],[0,4.5],[5,6],[9.7,4.15]],solid:[[-8.6,-4.4],[-3.55,1.9],[2.75,8.6]],lights:[[-4.4,-3.55],[1.9,2.75]]});
// An original folded-plate roof: daylight bands are holes in the solid plates,
// closed by supported glass panes, rather than glass drawn over an opaque roof.
export function buildOrigamiArchitecture(T){
 const group=new T.Group();group.name='Origami · folded daylight roof and crease floor';const owned=[],own=o=>(owned.push(o),o);
 const mat=(c,extra={})=>own(new T.MeshLambertMaterial({color:c,...extra})),ivory=mat(0xeee9da),sage=mat(0xd9e1d8),frame=mat(0x58716c),glass=mat(0xb9d8df,{transparent:true,opacity:.3,depthWrite:false,side:T.DoubleSide}),seam=own(new T.LineBasicMaterial({color:0x83968a,transparent:true,opacity:.55}));
 function plate(a,b,z0,z1,thickness,m,name){const vertices=[];for(const d of[0,-thickness])for(const z of[z0,z1])for(const p of[a,b])vertices.push(p[0],p[1]+d,z);const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex([0,2,1,1,2,3,4,5,6,5,7,6,0,1,4,1,5,4,2,6,3,3,6,7,0,4,2,2,4,6,1,3,5,3,7,5]);g.computeVertexNormals();const mesh=new T.Mesh(g,m);mesh.name=name;group.add(mesh);return mesh;}
 const opaque=[],panes=[];
 for(let i=0;i<4;i++){const a=ORIGAMI_ROOF.profile[i],b=ORIGAMI_ROOF.profile[i+1];for(const[z0,z1]of ORIGAMI_ROOF.solid)opaque.push(plate(a,b,z0,z1,.13,i%2?ivory:sage,'Supported folded paper-coloured roof'));for(const[z0,z1]of ORIGAMI_ROOF.lights){const pane=plate(a,b,z0+.035,z1-.035,.025,glass,'Folded daylight glass');pane.userData.origamiSkylight=true;panes.push(pane);}}
 const beamGeo=own(new T.CylinderGeometry(.035,.035,1,6)),beamPoses=[];function beam(a,b){const u=new T.Vector3(...a),v=new T.Vector3(...b),d=v.clone().sub(u),mesh=new T.Object3D();mesh.position.copy(u).add(v).multiplyScalar(.5);mesh.scale.y=d.length();mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());mesh.updateMatrix();beamPoses.push(mesh.matrix.clone());}
 for(const[z0,z1]of ORIGAMI_ROOF.lights)for(let i=0;i<4;i++){const a=ORIGAMI_ROOF.profile[i],b=ORIGAMI_ROOF.profile[i+1];for(const z of[z0,z1])beam([a[0],a[1]+.025,z],[b[0],b[1]+.025,z]);}
 const frameBatch=own(new T.InstancedMesh(beamGeo,frame,beamPoses.length));beamPoses.forEach((m,i)=>frameBatch.setMatrixAt(i,m));frameBatch.name='Origami · supported daylight-band frames';group.add(frameBatch);
 // A clipped flat Miura field has the same parallelogram construction as the
 // desk. The quiet colours leave the moving paper as the room's main focus.
 const flat=miura(0,{a:1.1,b:1.05,columns:24,rows:18}),vertices=[[],[]],edgePoints=[];
 function clip(poly,axis,value,less){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=p=>less?p[axis]<=value:p[axis]>=value,ia=inside(a),ib=inside(b);if(ia)out.push(a);if(ia!==ib){const t=(value-a[axis])/(b[axis]-a[axis]);out.push(a.map((v,k)=>v+t*(b[k]-v)));}}return out;}
 for(const[f,ids]of flat.faces.entries()){let p=ids.map(i=>flat.vertices[i]);for(const[axis,v,less]of[[0,-8.97,false],[0,8.97,true],[2,-7.97,false],[2,7.97,true]])p=clip(p,axis,v,less);for(let j=1;j<p.length-1;j++)for(const q of[p[0],p[j+1],p[j]])vertices[(f+Math.floor(f/24))%2].push(q[0],.006,q[2]);for(let j=0;j<p.length;j++)for(const q of[p[j],p[(j+1)%p.length]])edgePoints.push(q[0],.009,q[2]);}
 const floorGeo=own(new T.BufferGeometry());floorGeo.setAttribute('position',new T.Float32BufferAttribute(vertices.flat(),3));let offset=0;vertices.forEach((v,i)=>{floorGeo.addGroup(offset,v.length/3,i);offset+=v.length/3;});floorGeo.computeVertexNormals();const floor=new T.Mesh(floorGeo,[ivory,sage]);floor.name='Origami · complete flat Miura floor';group.add(floor);
 const edges=own(new T.BufferGeometry());edges.setAttribute('position',new T.Float32BufferAttribute(edgePoints,3));group.add(new T.LineSegments(edges,seam));
 // A closed, supported folded-paper portico projects over the real approach.
 const entry=origamiEntrySheet(),entryPositions=[],entryColours=[],e=ORIGAMI_ENTRY;
 const addFace=(points,tone)=>{for(let i=1;i<points.length-1;i++)for(const p of[points[0],points[i],points[i+1]]){entryPositions.push(p[0],p[1],p[2]);new T.Color(tone).toArray(entryColours,entryColours.length);}};
 for(const [i,f]of entry.faces.entries()){
  const top=f.map(k=>{const p=entry.vertices[k];return[p[0],e.y+p[1],e.z+p[2]];}),bottom=top.map(p=>[p[0],p[1]-e.thickness,p[2]]);
  addFace(top,i%2?0xe8e4d3:0x9bbcb3);addFace([...bottom].reverse(),0xe8e4d3);
  for(let j=0;j<4;j++)addFace([top[j],top[(j+1)%4],bottom[(j+1)%4],bottom[j]],0x426d63);
 }
 const entryGeo=own(new T.BufferGeometry());entryGeo.setAttribute('position',new T.Float32BufferAttribute(entryPositions,3));entryGeo.setAttribute('color',new T.Float32BufferAttribute(entryColours,3));entryGeo.computeVertexNormals();
 const canopy=new T.Mesh(entryGeo,own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})));canopy.name='Origami · rigid Miura entrance canopy';group.add(canopy);
 const posts=origamiEntryPosts(),postGeo=own(new T.BoxGeometry(.18,e.y,.18));for(const p of posts){const column=new T.Mesh(postGeo,frame);column.position.set(p.x,e.y/2,p.z);column.name='Origami · real entrance support';group.add(column);}
 // Folded lines remain visible at the street and join the actual canopy vertices.
 const edgePositions=[];for(const f of entry.faces)for(let i=0;i<4;i++)for(const k of[f[i],f[(i+1)%4]]){const p=entry.vertices[k];edgePositions.push(p[0],e.y+p[1]+.008,e.z+p[2]);}
 const entryEdgeGeo=own(new T.BufferGeometry());entryEdgeGeo.setAttribute('position',new T.Float32BufferAttribute(edgePositions,3));group.add(new T.LineSegments(entryEdgeGeo,seam));
 return{group,opaque,panes,floor,canopy,posts,dispose(){group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
