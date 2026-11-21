import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {createGardenStoneTexture,gardenStoneSample,GARDEN_STONE_FINISH as F} from '../src/garden-stone-finish.js';
import {buildGardenPaving} from '../src/six-gate-garden-paving.js';
import {gardenTreeBedPlan} from '../src/six-gate-garden-model.js';
const hash=a=>a?createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex'):null;
// Recorded independently immediately BEFORE the finish pass. Material work
// must not change even one existing position/colour/index byte, with or without
// actual organic tree-bed cuts and the current shared entrance grades.
const expected={plain:[{position:'8a7e3a6f91a631e5a3750e82c75d979660b1cabec6408a4eec83593f9afab611',color:'97c6971fde7b45c217d0d17f6654b6f3a3f00d969ae14f72ac980c14335c7619',index:null,vertices:136617},{position:'6acec6292c759db7918f31a4858ccd3fb7a0c4370013defb0d57c5b525fa33dd',color:'e2279e1318f78073c73781dcd44a5de8940363b64e767c642ed1c2d625af2936',index:null,vertices:132987}],beds:[{position:'dbd929f3c7f9af639215fc077106cc7a6276fa30838722ca1f0626463a622ff9',color:'17d8aec0e32f61d5bc0b220a0ac5ba73523b1d93f910b2c5ae211b829a4746cc',index:null,vertices:138369},{position:'c3b38e6b2342cab57738f8348162dd40dda0e2e1f9870ac0255b559d37e464b5',color:'fa908caa01e8815b1509fb6debecc4043fc359dc9c4217f55cff674eaa50f46c',index:null,vertices:134646}]};
assert.equal(F.repeatMetres/F.courseMetres,4);assert.equal(F.courseMetres,.65);
for(const u of[0,.001,.125,.249,.5,.999,1])for(const v of[0,.003,.125,.375,.751,.999,1]){const a=gardenStoneSample(u,v);assert(a>=.895&&a<=1,'Quiet near-white modulation, no dark synthetic speckles');assert(Math.abs(a-gardenStoneSample(u+1,v))<1e-12);assert(Math.abs(a-gardenStoneSample(u,v+1))<1e-12);}
assert(gardenStoneSample(.125,.125)>gardenStoneSample(.25,.125)+.05,'Original small-course mortar is visible at65cm spacing');
assert(gardenStoneSample(.25,.375)>gardenStoneSample(.125,.375)+.05,'Alternate courses use a real half-stone stagger');
const map=createGardenStoneTexture(T),again=createGardenStoneTexture(T);assert.deepEqual(map.image.data,again.image.data,'Original texture is deterministic');assert.equal(map.image.width,256);assert.equal(map.image.height,256);assert.equal(map.colorSpace,T.SRGBColorSpace);assert(map.generateMipmaps);assert.equal(map.minFilter,T.LinearMipmapLinearFilter);assert.equal(map.wrapS,T.RepeatWrapping);assert.equal(map.wrapT,T.RepeatWrapping);assert.equal(map.anisotropy,4);
for(let i=0;i<map.image.data.length;i+=4){assert.equal(map.image.data[i],map.image.data[i+1]);assert.equal(map.image.data[i],map.image.data[i+2]);assert.equal(map.image.data[i+3],255);assert(map.image.data[i]>=228,'Fine mineral detail cannot wash the original colour palette into black noise');}
map.dispose();again.dispose();
const cases={plain:[],beds:gardenTreeBedPlan([{x:88,z:18,radius:2.7,id:'retained-tree'},{x:-65,z:18,radius:2,id:'retained-inner-tree'}])};let vertices=0;
for(const [name,treeBeds]of Object.entries(cases)){
 const input=JSON.stringify(treeBeds),p=buildGardenPaving(T,{treeBeds});assert.equal(p.group.children.length,2);assert.equal(p.group.children[0].material.map,null,'The existing major joint bed keeps its original material');assert(p.group.children[1].material.map?.isDataTexture);
 const actual=p.group.children.map(m=>({position:hash(m.geometry.attributes.position.array),color:hash(m.geometry.attributes.color.array),index:hash(m.geometry.index?.array),vertices:m.geometry.attributes.position.count}));assert.deepEqual(actual,expected[name]);
 const texture=p.group.children[1].material.map;let disposed=0;texture.addEventListener('dispose',()=>disposed++);
 for(const mesh of p.group.children){const pos=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv;assert.equal(uv.count,pos.count);for(let i=0;i<pos.count;i++){assert(Math.abs(uv.getX(i)-(pos.getX(i)+pos.getZ(i))*Math.SQRT1_2/F.repeatMetres)<.00002);assert(Math.abs(uv.getY(i)-(pos.getZ(i)-pos.getX(i))*Math.SQRT1_2/F.repeatMetres)<.00002);vertices++;}}
 assert.equal(JSON.stringify(treeBeds),input);p.dispose();p.dispose();assert.equal(disposed,1,'Tree-bed rebuilding releases each owned stone texture exactly once');
}
console.log(`PASS garden stone finish: original seamless65cm courses/quiet mineral grain, mipmapped256px texture, ${vertices} correctly scaled UVs, exact position/colour/index bytes and tree cuts in2 draws, owned texture cleanup.`);
