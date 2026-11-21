import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {GALLERY_FORECOURT as F} from '../src/gallery-forecourt-model.js';
import {buildCityUrbanPlan} from '../src/city-urban-plan-scene.js';
import {existingGardenTrees} from '../src/garden-tree-beds.js';
import {gardenTreeBedPlan} from '../src/six-gate-garden-model.js';
import {gardenPavingHeight} from '../src/six-gate-garden-paving.js';

const index=readFileSync(new URL('../src/index.html',import.meta.url),'utf8'),dataScript=index.indexOf('<script src="gallery-forecourt-data.js?'),landscapeScript=index.indexOf('<script src="city-landscape.js?');
assert(dataScript>0&&landscapeScript>dataScript,'The actual page loads the shared native height authority before the classic landscape, not only through an ESM test import');
const source=readFileSync(new URL('../src/city-landscape.js',import.meta.url),'utf8'),nativeHeight=new Function('g','return ('+source.match(/function groundHeight\(x,z\)\{[^\n]+/)[0]+');')({CITY_GALLERY_FORECOURT:F});
const scene=new T.Scene(),publicClear=globalThis.CITY_PUBLIC_TREE_CLEAR;delete globalThis.CITY_PUBLIC_TREE_CLEAR;
const campus=globalThis.createCityLandscape(T,{parent:scene,outerRadius:58});globalThis.CITY_PUBLIC_TREE_CLEAR=publicClear;
const urban=buildCityUrbanPlan(T,{naturalTrees:globalThis.buildNaturalCityTrees});scene.add(urban.group);const trees=existingGardenTrees(T,scene),beds=gardenTreeBedPlan(trees),before=JSON.stringify(beds),field=urban.setTreeBeds(beds);scene.updateMatrixWorld(true);
assert.equal(beds.length,170);assert.equal(field.group.children.length,2);assert.equal(field.group.userData.closedGradeEdges,0);
const edges=new Map();let transitions=0;
for(const t of F.triangles){const[a,b,c]=t.points,p=a.map((v,i)=>(v+b[i]+c[i])/3),height=nativeHeight(p[0],p[1]);assert(Math.abs(height-p[2])<1e-7,'Actual classic walking function uses exact affine triangle heights');
 const va=new T.Vector3(a[0],a[2],a[1]),vb=new T.Vector3(b[0],b[2],b[1]),vc=new T.Vector3(c[0],c[2],c[1]),n=vb.sub(va).cross(vc.sub(va)).normalize();assert(Math.abs(n.y)>.975,'No skinny steep ramp triangle');
 for(let i=0;i<3;i++){const a=t.points[i],b=t.points[(i+1)%3],key=[a.slice(0,2).map(n=>n.toFixed(8)).join(','),b.slice(0,2).map(n=>n.toFixed(8)).join(',')].sort().join('|');if(edges.has(key))continue;edges.set(key,[a,b]);}
}
for(const[a,b]of edges.values()){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),x=(a[0]+b[0])/2,z=(a[1]+b[1])/2,nx=-dz/len,nz=dx/len,low=F.heightAt(x+nx*.0001,z+nz*.0001)??.13,high=F.heightAt(x-nx*.0001,z-nz*.0001)??.13;assert(Math.abs(high-low)<.00005,'Every affine/plateau/tree reserve/outer seam is continuous');transitions++;}
for(const[x,z]of[[61.75,0],[-61.75,0],[62.45,12],[60,12]])assert(Math.abs(nativeHeight(x,z)-.395)<1e-7,'Original door/lift walking anchors remain unchanged');
for(const b of beds.filter(b=>Math.abs(b.x-68)<.001&&Math.abs(b.z)<10))for(const[x,z]of b.outline){assert(Math.abs(nativeHeight(x,z)-.13)<1e-7,'Retained garden rim and soil stay at the original level');assert.equal(field.heightAt(b.x,b.z),null,'The real soil hole is still cut from both tile batches');}

// Broad-phase over the actual output triangles only, retaining real normals.
const bins=new Map(),cell=4,mat=new T.MeshBasicMaterial({side:T.DoubleSide});for(const m of field.group.children){const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=3){const tri=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j));if(!tri.some(v=>Math.abs(v.x)>53&&Math.abs(v.x)<74&&v.z>-16&&v.z<31))continue;for(let x=Math.floor(Math.min(...tri.map(v=>v.x))/cell);x<=Math.floor(Math.max(...tri.map(v=>v.x))/cell);x++)for(let z=Math.floor(Math.min(...tri.map(v=>v.z))/cell);z<=Math.floor(Math.max(...tri.map(v=>v.z))/cell);z++){const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(...tri.flatMap(v=>v.toArray()));}}}
const meshes=new Map();for(const[k,v]of bins){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));const m=new T.Mesh(g,mat);m.updateMatrixWorld();meshes.set(k,m);}let support=0;
for(const precinct of F.precincts){const xs=precinct.outer.map(p=>p[0]),zs=precinct.outer.map(p=>p[1]);for(let x=Math.min(...xs)+.09;x<Math.max(...xs);x+=.21)for(let z=Math.min(...zs)+.11;z<Math.max(...zs);z+=.23){if(!field.contains(x,z))continue;const expected=nativeHeight(x,z)??.13,m=meshes.get(Math.floor(x/cell)+','+Math.floor(z/cell)),hits=m?new T.Raycaster(new T.Vector3(x,1,z),new T.Vector3(0,-1,0),0,2).intersectObject(m):[];assert(hits.some(h=>Math.abs(h.point.y-expected)<.0001),'Actual tiled forecourt continuously supports the native controller '+[x,z]);assert(Math.abs(gardenPavingHeight(x,z)-expected)<1e-7);support++;}}
assert.equal(JSON.stringify(beds),before);for(const m of meshes.values())m.geometry.dispose();mat.dispose();urban.dispose();const resources=new Set();campus.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);if(o.isInstancedMesh)o.dispose();});for(const r of resources)r.dispose();
console.log('PASS continuous Gallery forecourt: '+transitions+' actual shared triangle-edge transitions, '+support+' real tile/native-floor support rays, exact door/lift levels, preserved170 gardens/soil and no vertical grade lips.');
