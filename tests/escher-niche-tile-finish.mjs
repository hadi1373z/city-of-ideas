import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ESCHER_NICHE_TILE_FINISH as F,buildEscherNicheTilePixels,createEscherNicheTileFinish} from '../src/escher-niche-tile-finish.js';

const start=performance.now(),size=2048,hash=a=>createHash('sha256').update(a).digest('hex');
assert.equal(F.size,size);assert.equal(F.regionSize,1024);
assert.deepEqual(F.regions,{panel:[0,0,.5,.5],floral:[.5,0,.5,.5],border:[0,.5,.5,.5],cell:[.5,.5,.5,.5]});
assert(Object.isFrozen(F)&&Object.isFrozen(F.regions));for(const r of Object.values(F.regions))assert(Object.isFrozen(r));
const p=buildEscherNicheTilePixels();assert.equal(buildEscherNicheTilePixels(),p,'Expensive2048px raster is generated once per module/process');
// A fresh module instance re-rasterizes independently. Comparing a cached
// object with itself would not prove deterministic ornament generation.
const fresh=await import('../src/escher-niche-tile-finish.js?independent-atlas-raster');
const independent=fresh.buildEscherNicheTilePixels();assert.notEqual(independent,p);
assert.equal(hash(p.map),hash(independent.map));assert.equal(hash(p.bump),hash(independent.bump));
assert.equal(hash(p.map),'e86113c100ee310ce29d74a8beddb161ae11056b9a1ce358ac514ad8deab19ce','Reviewed original dense atlas bytes');
let clipped=0,nonOpaque=0,nonNeutral=0,minBump=255,maxBump=0;
for(let i=0;i<p.map.length;i+=4){
 for(let k=0;k<3;k++)if(p.map[i+k]===0||p.map[i+k]===255)clipped++;
 if(p.map[i+3]!==255||p.bump[i+3]!==255)nonOpaque++;
 if(p.bump[i]!==p.bump[i+1]||p.bump[i]!==p.bump[i+2])nonNeutral++;
 minBump=Math.min(minBump,p.bump[i]);maxBump=Math.max(maxBump,p.bump[i]);
}
assert.equal(p.map.length,size*size*4);assert.equal(p.bump.length,p.map.length);assert(p.map instanceof Uint8Array&&p.bump instanceof Uint8Array);
assert.equal(clipped,0,'No unsigned-byte wrap or clipped black/white decoration');assert.equal(nonOpaque,0);assert.equal(nonNeutral,0);assert(minBump>=130&&maxBump<=146,'Only shallow glaze variation; real geometry supplies recess depth');
const stats={},regionHashes=[];
for(const[name,r]of Object.entries(F.regions)){
 const ox=r[0]*size,oy=r[1]*size;let detail=0,gold=0,turquoise=0,ivory=0;
 const bytes=new Uint8Array(1024*1024*4);
 for(let y=0;y<1024;y++){
  bytes.set(p.map.subarray(((oy+y)*size+ox)*4,((oy+y)*size+ox+1024)*4),y*1024*4);
  for(let x=0;x<1024;x++){
   const i=((oy+y)*size+ox+x)*4,R=p.map[i],G=p.map[i+1],B=p.map[i+2];
   if(R>45)detail++;if(R>145&&G>115&&B<135)gold++;if(G>R*1.5&&B>R*1.5&&G>B*.6)turquoise++;if(R>202&&G>198)ivory++;
   if(x<4||x>1019||y<4||y>1019){assert.deepEqual(p.map.subarray(i,i+4),Uint8Array.of(22,38,92,255),'Exact cobalt gutters prevent discontinuous repeat edges');assert.deepEqual(p.bump.subarray(i,i+4),Uint8Array.of(132,132,132,255));}
  }
 }
 stats[name]={detail,gold,turquoise,ivory};regionHashes.push(hash(bytes));
 assert(detail>120000&&detail<360000,`${name} has fine dense ornament and readable lapis negative space`);
 assert(gold>30000&&gold<130000,`${name} uses restrained gold tracery, not an all-gold field`);assert(turquoise>30000&&ivory>12000,`${name} retains real turquoise/ivory details`);
}
assert.equal(new Set(regionHashes).size,4,'Panel, floral field, border and cell are distinct authored compositions');
const red=(zone,x,y)=>{const r=F.regions[zone];return p.map[((r[1]*size+y)*size+r[0]*size+x)*4];};
for(const x of[220,512,804])assert(red('panel',x,301)>100,'Three LOWER pointed ogives are present in lowUVy panel area');
for(const[dx,dy]of[[0,257],[257,0],[0,-257],[-257,0]])assert(red('panel',512+dx,650+dy)>100,'Main sixteen-point medallion is centred above the three ogives');
assert(red('cell',512,168)>100&&red('cell',512,872)>100,'Tiny cell has an actual tapered droplet outline');
for(const y of[24,48,976,1000])assert(red('border',512,y)>100,'Border has paired continuous gold edges');
const first=createEscherNicheTileFinish(T),second=createEscherNicheTileFinish(T);let a=0,b=0;
first.map.addEventListener('dispose',()=>a++);first.bumpMap.addEventListener('dispose',()=>b++);
for(const t of[first.map,first.bumpMap,second.map,second.bumpMap]){
 assert(t.isDataTexture);assert.equal(t.image.width,size);assert.equal(t.image.height,size);assert.equal(t.format,T.RGBAFormat);assert.equal(t.type,T.UnsignedByteType);assert.equal(t.flipY,false,'Data rows correspond to low-to-highUVy, not PNG screen rows');assert.equal(t.wrapS,T.RepeatWrapping);assert.equal(t.wrapT,T.RepeatWrapping);assert.equal(t.magFilter,T.LinearFilter);assert.equal(t.minFilter,T.LinearMipmapLinearFilter);assert(t.generateMipmaps);assert.equal(t.anisotropy,4);assert.equal(t.repeat.x,1);assert.equal(t.repeat.y,1);assert.equal(t.userData.atlasRegions,F.regions);
}
assert.equal(first.map.colorSpace,T.SRGBColorSpace);assert.equal(first.bumpMap.colorSpace,T.NoColorSpace);assert.notEqual(first.map,second.map,'Each scene owns separate GPU resources');assert.equal(first.map.image.data,second.map.image.data,'CPU raster is shared without extra startup work');assert.notEqual(first.map.image.data,first.bumpMap.image.data);
first.dispose();first.dispose();assert.equal(a,1);assert.equal(b,1);assert.equal(second.map.image.data,p.map,'Disposing one finish cannot destroy another scene CPU raster');second.dispose();
console.log(`PASS ornate Escher ceramic atlas:4 distinct1024px regions in2048px RGBA, lower3ogives/16point medallion/scrolls/droplet, dense muted lapis palette, exact gutters, independent deterministic validbytes, shallowneutralbump, cachedCPU/separateGPU and exactly-once disposal (${Math.round(performance.now()-start)}ms).`);
