// Original ceramic ornament, drawn directly into pixels; no external image,
// canvas, borrowed monument decoration, or simulated architectural depth.
export const ESCHER_NICHE_TILE_FINISH=Object.freeze({size:512,repeatMetres:.8,medallionMetres:.2,medallionsPerSide:4});
const C={cobalt:[20,49,128],blue:[27,65,151],turquoise:[32,150,162],pale:[112,196,191],ivory:[231,223,186],gold:[191,159,88],deep:[22,61,115]};
const clamp=(n,a=0,b=255)=>Math.max(a,Math.min(b,n));

export function buildEscherNicheTilePixels(){
 const size=ESCHER_NICHE_TILE_FINISH.size,map=new Uint8Array(size*size*4),bump=new Uint8Array(map.length);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/(size-1),v=y/(size-1),i=(y*size+x)*4,
   glaze=1+.028*Math.sin(u*Math.PI*16)*Math.sin(v*Math.PI*16)+.012*Math.cos((u+v)*Math.PI*64),
   relief=Math.round(132+2*Math.sin(u*Math.PI*32)*Math.sin(v*Math.PI*32));
  for(let k=0;k<3;k++){map[i+k]=clamp(Math.round(C.cobalt[k]*glaze));bump[i+k]=relief;}map[i+3]=bump[i+3]=255;
 }
 // Bounded antialiased raster primitives also write a neutral, shallow glaze
 // height field. The carved niche itself is separate real scene geometry.
 function paint(x,y,colour,height,coverage=1){
  if(x<0||x>=size||y<0||y>=size||coverage<=0)return;
  const i=(y*size+x)*4,a=clamp(coverage,0,1);
  for(let k=0;k<3;k++){map[i+k]=Math.round(map[i+k]*(1-a)+colour[k]*a);bump[i+k]=Math.round(bump[i+k]*(1-a)+height*a);}
 }
 function line(ax,ay,bx,by,width,colour,height=142){
  const dx=bx-ax,dy=by-ay,d=dx*dx+dy*dy,pad=width/2+1;
  for(let y=Math.max(0,Math.floor(Math.min(ay,by)-pad));y<=Math.min(size-1,Math.ceil(Math.max(ay,by)+pad));y++)
   for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-pad));x<=Math.min(size-1,Math.ceil(Math.max(ax,bx)+pad));x++){
    const t=d?clamp(((x-ax)*dx+(y-ay)*dy)/d,0,1):0;
    paint(x,y,colour,height,clamp(width/2+.65-Math.hypot(x-ax-t*dx,y-ay-t*dy),0,1));
   }
 }
 function path(points,width,colour,height=142,closed=false){for(let i=1;i<points.length;i++)line(...points[i-1],...points[i],width,colour,height);if(closed)line(...points.at(-1),...points[0],width,colour,height);}
 function polygon(points,colour,height=138){
  const minX=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0])))),maxX=Math.min(size-1,Math.ceil(Math.max(...points.map(p=>p[0])))),
   minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),maxY=Math.min(size-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
   let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
    const a=points[i],b=points[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
   }if(inside)paint(x,y,colour,height);
  }
 }
 function ring(cx,cy,r,width,colour,height=144){const pts=Array.from({length:33},(_,i)=>[cx+Math.cos(i*Math.PI/16)*r,cy+Math.sin(i*Math.PI/16)*r]);path(pts,width,colour,height);}
 function leaf(cx,cy,a,length,width,colour=C.turquoise){
  const dx=Math.cos(a),dy=Math.sin(a),points=Array.from({length:18},(_,i)=>{const t=i<9?i/8:(17-i)/8,along=(t-.5)*length,across=Math.sin(t*Math.PI)*width*(i<9?1:-1);return[cx+along*dx-across*dy,cy+along*dy+across*dx];});
  polygon(points,colour,140);path(points,.8,C.gold,145,true);
 }
 function flower(cx,cy,r){
  for(let k=0;k<4;k++)leaf(cx+Math.cos(k*Math.PI/2)*r*.46,cy+Math.sin(k*Math.PI/2)*r*.46,k*Math.PI/2,r, r*.2,k%2?C.pale:C.turquoise);
  ring(cx,cy,r*.2,1.1,C.ivory);line(cx,cy,cx,cy,2,C.gold,149);
 }
 const tile=size/4;
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){
  const x0=col*tile,y0=row*tile,cx=x0+tile/2,cy=y0+tile/2;
  // A cobalt ceramic field, two hairline borders, and scrolling stems around
  // each20cm eight-point medallion, rather than isolated oversized stars.
  path([[x0+4,y0+4],[x0+124,y0+4],[x0+124,y0+124],[x0+4,y0+124]],1.05,C.gold,140,true);
  path([[x0+10,y0+10],[x0+118,y0+10],[x0+118,y0+118],[x0+10,y0+118]],.7,C.pale,138,true);
  for(let side=0;side<4;side++){
   const pts=Array.from({length:45},(_,i)=>{const t=i/44,q=18+t*92,w=17+3.2*Math.sin(t*Math.PI*4);return side===0?[x0+q,y0+w]:side===1?[x0+128-w,y0+q]:side===2?[x0+128-q,y0+128-w]:[x0+w,y0+128-q];});
   path(pts,1,C.gold,144);
   for(let n=0;n<4;n++){
    const q=26+n*25,w=19,px=side===0?x0+q:side===1?x0+128-w:side===2?x0+128-q:x0+w,
     py=side===0?y0+w:side===1?y0+q:side===2?y0+128-w:y0+128-q;
    leaf(px,py,side*Math.PI/2+(n%2?.65:-.65),9,1.8,n%2?C.ivory:C.turquoise);
   }
  }
  const outer=Array.from({length:16},(_,i)=>{const a=i*Math.PI/8-Math.PI/2,r=i%2?23:37;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];});
  polygon(outer,(row+col)%2?C.blue:C.deep);path(outer,1.55,C.gold,149,true);
  for(let k=0;k<8;k++){
   const a=k*Math.PI/4,dx=Math.cos(a),dy=Math.sin(a);
   leaf(cx+dx*19,cy+dy*19,a,29,6.6,k%2?C.pale:C.turquoise);
   line(cx+dx*7,cy+dy*7,cx+dx*30,cy+dy*30,.85,C.ivory,145);
   const b=a+Math.PI/8;
   flower(cx+Math.cos(b)*42,cy+Math.sin(b)*42,4.2);
  }
  ring(cx,cy,8,1.25,C.ivory,148);ring(cx,cy,4,1.1,C.gold,150);
  // A second continuous arabesque curls between the eight floral stations.
  const scroll=Array.from({length:129},(_,i)=>{const a=i*Math.PI/64,r=45+2.5*Math.cos(a*8);return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];});
  path(scroll,.8,C.turquoise,139);
  for(const[sx,sy]of[[-1,-1],[1,-1],[1,1],[-1,1]])flower(cx+sx*40,cy+sy*40,6.2);
 }
 // Match the periodic raster boundary exactly, including the glaze field.
 // No motif is clipped at the seam: each medallion has its own inset border.
 for(const data of[map,bump]){
  for(let y=0;y<size;y++)data.copyWithin((y*size+size-1)*4,y*size*4,y*size*4+4);
  data.copyWithin((size-1)*size*4,0,size*4);
 }
 return {map,bump};
}

export function createEscherNicheTileFinish(T){
 const pixels=buildEscherNicheTilePixels(),size=ESCHER_NICHE_TILE_FINISH.size;
 function texture(data,name,colour){
  const t=new T.DataTexture(data,size,size,T.RGBAFormat,T.UnsignedByteType);t.name=name;t.colorSpace=colour?T.SRGBColorSpace:(T.NoColorSpace??'');
  t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;
  t.userData={originalProcedural:true,repeatMetres:.8,medallionMetres:.2,medallionsPerSide:4};return t;
 }
 const map=texture(pixels.map,'Original cobalt ceramic · eight-point medallions and arabesques',true),bumpMap=texture(pixels.bump,'Original ceramic glaze · shallow neutral relief',false);let disposed=false;
 return{map,bumpMap,dispose(){if(disposed)return;disposed=true;map.dispose();bumpMap.dispose();}};
}
