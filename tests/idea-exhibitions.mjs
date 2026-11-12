import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {IDEA_EXHIBITIONS,IDEA_EXHIBITION_COPY} from '../src/idea-exhibitions.js';
import {DE_CHIRICO_SOURCE,DE_CHIRICO_COPY,buildDeChiricoExhibit} from '../src/de-chirico-exhibit.js';

assert.deepEqual(IDEA_EXHIBITIONS.map(x=>x.id),['philosophy','time','perception','representation']);
assert.equal(IDEA_EXHIBITIONS[0].artist,'Giorgio de Chirico');
assert.equal(IDEA_EXHIBITIONS[0].artwork,'Le trouble du philosophe');
assert.equal(IDEA_EXHIBITIONS[0].source,DE_CHIRICO_SOURCE);
assert(IDEA_EXHIBITIONS.every(e=>/^https:\/\//.test(e.source)));
for(const lang of['de','fa']){
 assert.deepEqual(Object.keys(IDEA_EXHIBITION_COPY[lang]).sort(),Object.keys(IDEA_EXHIBITION_COPY.en).sort());
 assert.deepEqual(Object.keys(DE_CHIRICO_COPY[lang]).sort(),Object.keys(DE_CHIRICO_COPY.en).sort());
 for(const item of IDEA_EXHIBITIONS){
  for(const key of['title','thought','experience','questions'])assert(item[key][lang],item.id+' missing '+key+' in '+lang);
 }
}
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})});
const exhibit=buildDeChiricoExhibit(T,{canvas});
assert.equal(exhibit.targets.length,1);
assert.equal(exhibit.targets[0].userData.deChirico,true);
assert.equal(exhibit.entry.x,226);
assert.equal(exhibit.entry.z,191);
assert.equal(exhibit.center.z,202);
const meshes=[];exhibit.group.traverse(o=>{if(o.isMesh)meshes.push(o);});
assert(meshes.length>20,'An actual 3D installation, not just a label');
assert(meshes.every(m=>Array.from(m.geometry.attributes.position.array).every(Number.isFinite)));
exhibit.group.updateMatrixWorld(true);
const plaque=exhibit.targets[0],from=new T.Vector3(exhibit.entry.x,1.8,exhibit.entry.z),to=plaque.getWorldPosition(new T.Vector3());
const ray=new T.Raycaster(from,to.sub(from).normalize());
assert(ray.intersectObjects(exhibit.targets,true).some(hit=>hit.object===plaque),'Artwork plaque should be selectable');
exhibit.dispose();
assert.equal(exhibit.group.children.length,0);
console.log('PASS idea exhibitions: four themes, philosophy attribution, 3D de Chirico interpretation, selectable plaque, language parity and owned cleanup');
