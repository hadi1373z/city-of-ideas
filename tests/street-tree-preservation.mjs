import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ACCEPTED_STREET_TREE_SITES as accepted,ACCEPTED_STREET_TREE_SOURCE} from '../src/accepted-street-trees.js';
import {urbanPlanting,urbanRoutes,streetTreeClear,HONEYCOMB_CITY,segmentDistance} from '../src/city-urban-plan-model.js';
import {buildCityUrbanPlan} from '../src/city-urban-plan-scene.js';
import {existingGardenTrees} from '../src/garden-tree-beds.js';
import {pavilionFootprint} from '../src/escher-pavilion-model.js';
import {footprintBlocked} from '../src/honeycomb-city-model.js';

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex'),arrayHash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex'),expected='e5d8ba834e82a1996f03c7c3696662976b6868ed5e10b9e8357f5583441df293';
assert.equal(accepted.length,455);assert.equal(hash(accepted),expected);assert.equal(ACCEPTED_STREET_TREE_SOURCE.sha256,expected);assert(Object.isFrozen(accepted)&&accepted.every(Object.isFrozen));const points=urbanPlanting();assert.equal(hash(points),expected,'Current roads and the moved park cannot regenerate any accepted tree or change its renderer/RNG order');points[0].x+=100;assert.equal(hash(urbanPlanting()),expected,'Callers cannot mutate the accepted spatial authority');
const routes=urbanRoutes(),escher=pavilionFootprint();
for(const p of accepted){assert(streetTreeClear(p.x,p.z),'The full original crown reserve clears current roofs and porches');assert(!footprintBlocked(p.x,p.z,[escher],7),'The actual joined Escher pavilion/dogleg/shaft roof stays clear');assert(HONEYCOMB_CITY.walls.every(w=>segmentDistance(p.x,p.z,w.a,w.b)>1.7),'Current court walls retain the original tree');for(const r of routes)for(let i=1;i<r.points.length;i++)assert(segmentDistance(p.x,p.z,r.points[i-1],r.points[i])>=r.width/2+3-1e-8,'Every current walking route remains clear');}

// Match the real startup order: the classic source campus is built before the
// asynchronous public-district roof callback. The retained campus trees are
// read as they stand; rebuilding them with a later callback would delete them.
const scene=new T.Scene(),publicClear=globalThis.CITY_PUBLIC_TREE_CLEAR;let campus;
try{delete globalThis.CITY_PUBLIC_TREE_CLEAR;campus=globalThis.createCityLandscape(T,{parent:scene,outerRadius:58});}finally{globalThis.CITY_PUBLIC_TREE_CLEAR=publicClear;}
assert.equal(campus.trees.length,58);const urban=buildCityUrbanPlan(T,{naturalTrees:globalThis.buildNaturalCityTrees});scene.add(urban.group);const forest=urban.group.children.find(n=>n.userData.naturalTrees);assert(forest);assert.equal(forest.userData.naturalTrees.count,455);assert.deepEqual(forest.userData.naturalTrees.positions,accepted.map(({x,z})=>({x,z})),'Every original accepted tree is actually rendered, in the same order');
// These are the actual HEAD5913 renderer instance buffers, independently
// recovered and compared with the original source builder before pinning.
assert.equal(forest.children[0].count,17290);assert.equal(arrayHash(forest.children[0].instanceMatrix.array),'de1f6a2f394385b9b23b5bde2960727457a6c955c0232366c0c654ce1993e399','All original leaf poses survive');
assert.equal(forest.children[1].count,7280);assert.equal(arrayHash(forest.children[1].instanceMatrix.array),'2d6156a4d9e2e1f6bfa6162939d647f00fe1c163f81eca81849c48279d5f5b1f','All original trunk/fork poses survive');
const beds=existingGardenTrees(T,scene);assert.equal(beds.length,170);assert.equal(hash(beds),'6a36e9ed8958ef219e37c5ba3ec5ae23f3c6e5d969621705621511b8c3766a65','All170 original bed positions, radii and ownership order survive the current routes and roofs');
urban.dispose();const resources=new Set();campus.group.traverse(n=>{if(n.geometry)resources.add(n.geometry);for(const m of Array.isArray(n.material)?n.material:n.material?[n.material]:[])resources.add(m);n.isInstancedMesh&&n.dispose();});for(const r of resources)r.dispose();campus.group.clear();
console.log('PASS accepted street trees:455 exact sites/order,17,290 unchanged leaf and7,280 wood poses,170 exact mounted tree beds, current paths/walls/roofs and joined Escher dogleg clear');
