// Original daytime limestone finish. One repeat spans the unchanged2.6m
// geometric tile, with four smaller65cm staggered courses and quiet grain.
export const GARDEN_STONE_FINISH=Object.freeze({repeatMetres:2.6,courseMetres:.65,size:256,jointMetres:.012});
const mod=(a,n)=>((a%n)+n)%n;
function hash(x,y){let n=Math.imul(x+1747,374761393)^Math.imul(y+931,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function gardenStoneSample(u,v){
 u=mod(u,1);v=mod(v,1);const row=Math.floor(v*4),shift=row%2?.5:0,x=u*4+shift,col=Math.floor(x),fx=x-col,fy=v*4-row;
 const distance=Math.min(fx,1-fx,fy,1-fy)*GARDEN_STONE_FINISH.courseMetres,
  grain=hash(Math.floor(u*256),Math.floor(v*256))-.5,
  stone=.974+.018*(hash(mod(col,4),row)-.5)+.006*grain,
  mortar=.901+.004*grain,
  weight=smooth(.004,.009,distance);
 return mortar+(stone-mortar)*weight;
}
export function createGardenStoneTexture(T){
 const size=GARDEN_STONE_FINISH.size,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const n=Math.round(gardenStoneSample((x+.5)/size,(y+.5)/size)*255),i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=n;data[i+3]=255;}
 const texture=new T.DataTexture(data,size,size,T.RGBAFormat,T.UnsignedByteType);texture.name='Original65cm coursed limestone · daytime garden';texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=4;texture.needsUpdate=true;texture.userData={originalProcedural:true,repeatMetres:GARDEN_STONE_FINISH.repeatMetres,courseMetres:GARDEN_STONE_FINISH.courseMetres};return texture;
}
