import assert from 'node:assert/strict';import vm from 'node:vm';import{readFile}from'node:fs/promises';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});const w={};vm.runInNewContext(await readFile(new URL('../src/gallery-spiral.js',import.meta.url),'utf8'),{window:w});const route=w.createGallerySpiral(T);
assert.equal(route.levels.length,4);assert.equal(route.entrance.x,58);assert.equal(route.entrance.z,0);assert.equal(route.width,route.headWidth*3);assert.equal(route.steps,40);assert.equal(route.rise,.2);
let built,scene;for(let floor=0;floor<3;floor++){
 const start=route.starts[floor],heights=new Set();
 for(let step=0;step<40;step++){
  const p=route.pointAt(start+(step+.5)*route.tread);heights.add(p.y.toFixed(5));assert.equal(p.z,0);assert(Math.abs(p.y-(route.base+floor*8+(step+1)*.2))<1e-6);
  const q=route.resolve(p.x,.5,start+(step+.1)*route.tread);assert(Math.abs(q.theta-(start+(step+.5)*route.tread))<1e-6);assert.equal(q.z,.5);
  const ray=new T.Raycaster(new T.Vector3(p.x,p.y+2,0),new T.Vector3(0,-1,0),0,2.01);const hits=ray.intersectObject(builtStairs(),false);assert(hits.length,'Each tread is real walkable geometry');assert(Math.abs(hits[0].point.y-p.y)<1e-5);
 }
 assert.equal(heights.size,40);assert(route.holeAt(37,0,floor+1));
 assert(route.entryAt(42.9,0,floor,{x:43.1,z:0})!==null);
 assert(route.entryAt(route.endX+.1,0,floor+1,{x:route.endX-.1,z:0})!==null);
}
function builtStairs(){if(!built){scene=new T.Scene();built=route.build(scene);scene.updateMatrixWorld(true);}return built.ramp;}
for(let p=0;p<route.max;p+=.07){const a=route.pointAt(p),b=route.pointAt(Math.min(route.max,p+.07));assert(b.y>=a.y-1e-7);assert(Math.hypot(a.x,a.z)>29.5&&Math.hypot(a.x,a.z)<56.3,'Landings remain inside gallery walking bounds');}
assert.equal(route.floorAt(route.max),3);assert(Math.abs(route.pointAt(route.max).y-24.395)<1e-7);assert.equal(built.ramp.userData.stepCount,120);built.dispose();console.log('PASS: three straight 40-step flights, exactly three head-widths, real horizontal treads, vertical risers, four levels and reversible entrances.');