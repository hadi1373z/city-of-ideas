import {SIXFOLD_TILINGS} from './sixfold-tiling-model.js?v=sixfold-city-20261118d';

export function tilingParentColourIndex(id){if(/^rhomb-\d+$/.test(id))return Number(id.slice(6));let h=2166136261;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function tilingPatternPalette(T,pattern,base){
 if(!SIXFOLD_TILINGS.some(p=>p.id===pattern))throw new RangeError('Unknown mathematical tiling');if(pattern==='penrose')return base;
 const accents={hexagonal:0x6c97ac,triangular:0xad7660,square:0x6c9583,'octagon-square':0xa99463,trihexagonal:0x8d85a7},accent=new T.Color(accents[pattern]),tint=(color,amount)=>new T.Color(color).lerp(accent,amount).getHex();
 return{floor:base.floor.map(c=>tint(c,.22)),ceiling:base.ceiling.map(c=>tint(c,.13)),border:tint(base.border,.15)};
}

/** Merge owned finish meshes, keeping their supplied analytic normals. Records
 * point into the packed buffers so no original per-room arrays remain resident.
 * Materials stay owned by the caller. Geometry release is explicit and scoped.
 */
export function compactTilingMeshes(T,group,{own=x=>x,release=x=>x.dispose()}={}){
 const source=group.children.filter(o=>o.isMesh),byMaterial=new Map(),records=new Map(),batches=[];let geometryBytes=0;
 for(const mesh of source){const a=byMaterial.get(mesh.material)||[];a.push(mesh);byMaterial.set(mesh.material,a);}
 for(const[material,list]of byMaterial){
  const count=list.reduce((n,o)=>n+(o.geometry.index?.count??o.geometry.attributes.position.count),0),position=new Float32Array(count*3),normal=new Float32Array(count*3),colour=new Float32Array(count*3);let offset=0;
  for(const mesh of list){mesh.updateMatrix();const geometry=mesh.geometry,index=geometry.index,p=geometry.attributes.position,n=geometry.attributes.normal,c=geometry.attributes.color,length=index?.count??p.count,start=offset,normalMatrix=new T.Matrix3().getNormalMatrix(mesh.matrix),v=new T.Vector3();
   for(let i=0;i<length;i++){const k=index?index.getX(i):i;v.fromBufferAttribute(p,k).applyMatrix4(mesh.matrix).toArray(position,offset*3);v.fromBufferAttribute(n,k).applyNormalMatrix(normalMatrix).toArray(normal,offset*3);colour[offset*3]=c.getX(k);colour[offset*3+1]=c.getY(k);colour[offset*3+2]=c.getZ(k);offset++;}
   records.set(mesh,{name:mesh.name,userData:mesh.userData,range:{batch:batches.length,start,count:length}});
  }
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.BufferAttribute(position,3));geometry.setAttribute('normal',new T.BufferAttribute(normal,3));geometry.setAttribute('color',new T.BufferAttribute(colour,3));geometry.computeBoundingBox();geometry.computeBoundingSphere();const mesh=new T.Mesh(geometry,material);mesh.name=group.name+' · compact material batch '+batches.length;mesh.userData.houseTilingBatch=true;batches.push(mesh);group.add(mesh);geometryBytes+=position.byteLength+normal.byteLength+colour.byteLength;
 }
 for(const mesh of source){mesh.removeFromParent();release(mesh.geometry);mesh.geometry=null;}
 return{batches,records,geometryBytes,sourceMeshes:source.length};
}
