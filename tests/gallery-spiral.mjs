import assert from 'node:assert/strict';import vm from 'node:vm';import{readFile}from'node:fs/promises';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});const w={};vm.runInNewContext(await readFile(new URL('../src/gallery-spiral.js',import.meta.url),'utf8'),{window:w});const route=w.createGallerySpiral(T);
assert.equal(route.levels.length,5);assert.equal(route.entrance.x,58);assert.equal(route.entrance.z,0);assert.equal(route.width,route.headWidth);assert.equal(route.headingAt(0),Math.PI);assert.equal(route.direction.z,1);assert.equal(route.steps,40);assert.equal(route.rise,.2);
let built,scene;for(let floor=0;floor<4;floor++){
 const start=route.starts[floor],heights=new Set();
 for(let step=0;step<40;step++){
  const p=route.pointAt(start+(step+.5)*route.tread);heights.add(p.y.toFixed(5));assert.equal(p.x,43);assert(Math.abs(p.y-(route.base+floor*8+(step+1)*.2))<1e-6);
  const q=route.resolve(43.5,p.z,start+(step+.1)*route.tread);assert(Math.abs(q.theta-(start+(step+.5)*route.tread))<1e-6);assert.equal(q.x,43.5);
  const ray=new T.Raycaster(new T.Vector3(p.x,p.y+2,p.z),new T.Vector3(0,-1,0),0,2.01);const hits=ray.intersectObject(builtStairs(),false);assert(hits.length,'Each tread is real walkable geometry');assert(Math.abs(hits[0].point.y-p.y)<1e-5);
 }
 assert.equal(heights.size,40);assert(route.holeAt(43,5,floor+1));
 assert(route.entryAt(43,.1,floor,{x:43,z:-.1})!==null);
 assert(route.entryAt(43,route.run-.1,floor+1,{x:43,z:route.run+.1})!==null);
}
function builtStairs(){if(!built){scene=new T.Scene();built=route.build(scene,{drawing:new T.Texture()});scene.updateMatrixWorld(true);}return built.ramp;}
for(let p=0;p<route.max;p+=.07){const a=route.pointAt(p),b=route.pointAt(Math.min(route.max,p+.07));assert(b.y>=a.y-1e-7);assert(Math.hypot(a.x,a.z)>29.5&&Math.hypot(a.x,a.z)<56.3,'Landings remain inside gallery walking bounds');}
assert.equal(route.floorAt(route.max),4);assert(Math.abs(route.pointAt(route.max).y-32.395)<1e-7);assert.equal(built.ramp.userData.stepCount,160);assert.equal(built.ramp.userData.snakeDrawing,true);assert(built.ramp.material.uniforms.reference.value.isTexture);built.dispose();console.log('PASS: four straight 40-step flights, one head-width along the snake, real horizontal treads, vertical risers, four book levels and roof and reversible entrances.');