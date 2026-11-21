import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';

const source=readFileSync(new URL('../src/city-landscape.js',import.meta.url),'utf8');
function build(omit){
 const w={};vm.runInNewContext(omit?source:source.replace(/const removedPlazaTree=p=>[^;]+;/,'const removedPlazaTree=p=>false;'),{window:w});
 w.cityStreetTreeClear=()=>true;
 const parent=new T.Group(),group=w.buildNaturalCityTrees(T,parent,[{x:30,z:20},{x:69.5,z:-25},{x:69.75,z:25},{x:72.5,z:-53},{x:100,z:100}]);
 return {w,group,leaves:group.children[0],wood:group.children[1]};
}
const before=build(false),after=build(true),a=new T.Matrix4(),b=new T.Matrix4();
assert.equal(before.leaves.count,190);assert.equal(after.leaves.count,76);
assert.equal(before.wood.count,80);assert.equal(after.wood.count,32);
assert.equal(after.group.userData.naturalTrees.count,2);
assert(!after.group.userData.naturalTrees.positions.some(p=>p.x===69.5&&p.z===-25));
assert(!after.group.userData.naturalTrees.positions.some(p=>p.x===69.75&&p.z===25));
assert(!after.group.userData.naturalTrees.positions.some(p=>p.x===72.5&&p.z===-53));
for(const [kind,stride] of [['leaves',38],['wood',16]])for(let i=0;i<stride*2;i++){
 before[kind].getMatrixAt(i<stride?i:i+stride*3,a);after[kind].getMatrixAt(i,b);
 assert.deepEqual(a.elements,b.elements,'Every retained leaf/branch keeps its exact original seeded pose');
}
for(const result of [before,after])result.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();o.isInstancedMesh&&o.dispose();});
console.log('PASS three specified bare plaza trees removed: exact trunk/branches/leaves absent; every neighbouring seeded instance unchanged');
