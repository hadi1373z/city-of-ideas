import {buildGardenTreeBeds} from './six-gate-garden-scene.js';
import {SIXFOLD_HOUSES} from './sixfold-house-network-model.js';
import {gardenCanStand} from './six-gate-garden-model.js';
import {urbanRoutes,urbanBuildingFootprints,segmentDistance} from './city-urban-plan-model.js?v=six-gate-city-20261121';
import {footprintBlocked} from './honeycomb-city-model.js?v=six-gate-city-20261121';

const centres=[{x:0,z:0},...SIXFOLD_HOUSES];
export function inGardenPrecinct(x,z){return centres.some(c=>{const points=Array.from({length:6},(_,i)=>[c.x+92*Math.cos(Math.PI/6+i*Math.PI/3),c.z+92*Math.sin(Math.PI/6+i*Math.PI/3)]);return points.every((a,i)=>{const b=points[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=0;});});}

// Use the tree renderer's actual local placements and mounted transforms.
// This reads the existing forest; it never rebuilds, moves or replaces a tree.
export function existingGardenTrees(T,scene,{routes=urbanRoutes(),footprints=urbanBuildingFootprints()}={}){
 scene.updateMatrixWorld(true);const trees=[],seen=new Set();
 scene.traverse(node=>{for(const p of node.userData.naturalTrees?.positions||[]){
  const q=new T.Vector3(p.x,0,p.z).applyMatrix4(node.matrixWorld),key=q.x.toFixed(3)+','+q.z.toFixed(3);
  if(seen.has(key)||Math.abs(q.y)>.45||!inGardenPrecinct(q.x,q.z))continue;seen.add(key);
  // Smaller flower rings are still useful beside a path; every ring stays
  // wholly off the shared walking width and outside the actual roof outlines.
  const radius=[3.5,3,2.5,2].find(r=>gardenCanStand(q.x,q.z,r+.25)&&!footprintBlocked(q.x,q.z,footprints,r+.25)&&routes.every(route=>route.points.slice(1).every((b,i)=>segmentDistance(q.x,q.z,route.points[i],b)>=route.width/2+r+.25))&&trees.every(t=>Math.hypot(t.x-q.x,t.z-q.z)>t.radius+r+.4));
  if(radius)trees.push({id:'existing-tree-bed-'+trees.length,x:q.x,z:q.z,y:.13,radius,trunkRadius:.4});
 }});return trees;
}

export function installGardenTreeBeds(M,T,{coast,events=globalThis}={}){
 if(M.gardenTreeBeds)return M.gardenTreeBeds;const parent=coast?.urban?.garden?.group;if(!parent)return null;
 const trees=existingGardenTrees(T,M.scene),built=buildGardenTreeBeds(T,trees);parent.add(built.group);
 let disposed=false;const api={built,trees,dispose(){if(disposed)return;disposed=true;built.dispose();events.removeEventListener?.('pagehide',api.dispose);if(M.gardenTreeBeds===api)delete M.gardenTreeBeds;}};
 M.gardenTreeBeds=api;events.addEventListener?.('pagehide',api.dispose,{once:true});return api;
}
