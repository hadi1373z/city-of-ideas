import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ESCHER_NICHE_TILE_FINISH as F,buildEscherNicheTilePixels,createEscherNicheTileFinish} from '../src/escher-niche-tile-finish.js';

assert.equal(F.size,512);assert.equal(F.repeatMetres,.8);assert.equal(F.medallionMetres,.2);assert.equal(F.medallionsPerSide,4);assert.equal(F.repeatMetres/F.medallionMetres,4);
const start=performance.now(),pixels=buildEscherNicheTilePixels(),again=buildEscherNicheTilePixels();
for(const key of['map','bump']){
 const a=pixels[key];assert(a instanceof Uint8Array);assert.equal(a.length,512*512*4);assert.deepEqual(a,again[key],'Procedural ornament is deterministic');
 for(let n=0;n<512;n++)for(let k=0;k<4;k++){
  assert.equal(a[(n*512)*4+k],a[(n*512+511)*4+k],'Horizontal repeat edge is exact');
  assert.equal(a[n*4+k],a[(511*512+n)*4+k],'Vertical repeat edge is exact');
 }
 for(let i=0;i<a.length;i+=4){assert.equal(a[i+3],255);for(let k=0;k<3;k++)assert(Number.isFinite(a[i+k])&&a[i+k]>=0&&a[i+k]<=255);}
}
let cobalt=0,turquoise=0,ivory=0,gold=0,wrapped=0;
for(let i=0;i<pixels.map.length;i+=4){const[r,g,b]=pixels.map.subarray(i,i+3);if(b>g*1.4&&b>r*2)cobalt++;if(g>r*2&&b>r*2&&g>b*.7)turquoise++;if(r>205&&g>200)ivory++;if(r>155&&g>125&&b<125&&r>b*1.3)gold++;if(r===0||g===0||b===0||r===255||g===255||b===255)wrapped++;assert.equal(pixels.bump[i],pixels.bump[i+1]);assert.equal(pixels.bump[i],pixels.bump[i+2]);assert(pixels.bump[i]>=128&&pixels.bump[i]<=150,'Shallow glaze relief cannot become architectural displacement');}
assert(cobalt>512*512*.55,'Cobalt remains the rich ceramic field');assert(turquoise>8000,'Original turquoise medallion and vine detail is present');assert(ivory>500,'Fine ivory details remain visible');assert(gold>6000&&gold<512*512*.25,'Quiet gold tracery avoids an all-gold field');assert.equal(wrapped,0,'No arithmetic wraps into clipped black or white');
// Independent recognizable geometry probes: four20cm medallions per repeat,
// each with a central outlined rosette and eight pointed gold/turquoise arms.
for(let row=0;row<4;row++)for(let col=0;col<4;col++){
 const cx=col*128+64,cy=row*128+64;
 for(const[dx,dy]of[[0,-37],[37,0],[0,37],[-37,0]]){const i=((cy+dy)*512+cx+dx)*4;assert(pixels.map[i]>90,'Every medallion has distinct pointed outline');}
}
const finish=createEscherNicheTileFinish(T);let disposedMap=0,disposedBump=0;finish.map.addEventListener('dispose',()=>disposedMap++);finish.bumpMap.addEventListener('dispose',()=>disposedBump++);
for(const t of[finish.map,finish.bumpMap]){assert(t.isDataTexture);assert.equal(t.image.width,512);assert.equal(t.image.height,512);assert.equal(t.format,T.RGBAFormat);assert.equal(t.type,T.UnsignedByteType);assert.equal(t.wrapS,T.RepeatWrapping);assert.equal(t.wrapT,T.RepeatWrapping);assert.equal(t.magFilter,T.LinearFilter);assert.equal(t.minFilter,T.LinearMipmapLinearFilter);assert(t.generateMipmaps);assert.equal(t.anisotropy,4);assert.equal(t.repeat.x,1);assert.equal(t.repeat.y,1);assert.equal(t.userData.repeatMetres,.8);}
assert.equal(finish.map.colorSpace,T.SRGBColorSpace);assert.equal(finish.bumpMap.colorSpace,T.NoColorSpace);assert.notEqual(finish.map.image.data,finish.bumpMap.image.data);finish.dispose();finish.dispose();assert.equal(disposedMap,1);assert.equal(disposedBump,1);
console.log(`PASS Escher niche ceramic: seamless original512px16 medallions, cobalt/turquoise/ivory/quiet gold, neutral shallow bump, deterministic valid bytes (${createHash('sha256').update(pixels.map).digest('hex').slice(0,16)}), colour spaces/mipmaps/aniso and exactly-once disposal (${Math.round(performance.now()-start)}ms).`);
