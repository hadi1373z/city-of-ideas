import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import '../src/city-road-surface.js';
const group=new T.Group(),material=new T.MeshLambertMaterial();
for(const points of [[[0,0],[20,0],[20,20]],[[0,0],[0,20],[-20,40]],[[-97.7,110],[-76,110],[-76,0],[-84,0],[-84,-32],[-138,-32]]]){
 const road=globalThis.createCityRoad(T,points,6,material,group);group.updateMatrixWorld(true);
 for(let i=1;i<points.length;i++)for(let j=0;j<=100;j++){const u=T.MathUtils.clamp(j/100,.00001,.99999),x=points[i-1][0]+(points[i][0]-points[i-1][0])*u,z=points[i-1][1]+(points[i][1]-points[i-1][1])*u,ray=new T.Raycaster(new T.Vector3(x,2,z),new T.Vector3(0,-1,0),0,3);assert(ray.intersectObject(road).some(hit=>Math.abs(hit.point.y-.13)<1e-5),'Missing paving '+JSON.stringify({points,i,j,x,z,hits:ray.intersectObject(road).map(h=>h.point.toArray())}));}
 const a=road.geometry.attributes.position;for(let i=0;i<a.count;i++)assert(Number.isFinite(a.getX(i))&&Number.isFinite(a.getY(i))&&Number.isFinite(a.getZ(i)));road.geometry.dispose();
}
assert.equal(globalThis.createCityRoad(T,[[0,0],[0,0]],6,material,group),null);
console.log('PASS: continuous paving at straight, right-angle and diagonal joints, consistent surface height, finite geometry and empty-route guard.');
