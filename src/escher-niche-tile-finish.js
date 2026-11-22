// Original vector-raster ceramic atlas. No photograph, DOM/canvas, external
// asset, or imitation of architectural depth. Rows start at LOW UV y.
export const ESCHER_NICHE_TILE_FINISH=Object.freeze({size:2048,regionSize:1024,
 regions:Object.freeze({panel:Object.freeze([0,0,.5,.5]),floral:Object.freeze([.5,0,.5,.5]),border:Object.freeze([0,.5,.5,.5]),cell:Object.freeze([.5,.5,.5,.5])})});
const C={lapis:[22,38,92],blue:[29,53,113],deep:[18,31,77],turquoise:[44,121,139],pale:[112,163,163],ivory:[217,211,182],gold:[174,147,91],lightGold:[200,174,112]};
const clamp=(n,a=0,b=255)=>Math.max(a,Math.min(b,n));let cachedPixels;

export function buildEscherNicheTilePixels(){
 if(cachedPixels)return cachedPixels;
 const size=2048,map=new Uint8Array(size*size*4),bump=new Uint8Array(map.length),wave=new Float32Array(size);
 for(let n=0;n<size;n++)wave[n]=Math.sin(n*Math.PI/32);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=(y*size+x)*4,glaze=1+.018*wave[x]*wave[y]+.009*Math.cos((x+y)*Math.PI/64),height=Math.round(132+1.5*wave[x]*wave[y]);
  for(let k=0;k<3;k++){map[i+k]=Math.round(C.lapis[k]*glaze);bump[i+k]=height;}map[i+3]=bump[i+3]=255;
 }
 function region(name){
  const r=ESCHER_NICHE_TILE_FINISH.regions[name],ox=r[0]*size,oy=r[1]*size;
  function paint(x,y,c,height=141,a=1){if(x<4||x>1019||y<4||y>1019||a<=0)return;const i=((y+oy)*size+x+ox)*4;a=clamp(a,0,1);for(let k=0;k<3;k++){map[i+k]=Math.round(map[i+k]*(1-a)+c[k]*a);bump[i+k]=Math.round(bump[i+k]*(1-a)+height*a);}}
  function line(ax,ay,bx,by,w,c=C.gold,h=141){
   const dx=bx-ax,dy=by-ay,d=dx*dx+dy*dy,pad=w/2+1;
   for(let y=Math.max(4,Math.floor(Math.min(ay,by)-pad));y<=Math.min(1019,Math.ceil(Math.max(ay,by)+pad));y++)for(let x=Math.max(4,Math.floor(Math.min(ax,bx)-pad));x<=Math.min(1019,Math.ceil(Math.max(ax,bx)+pad));x++){
    const t=d?clamp(((x-ax)*dx+(y-ay)*dy)/d,0,1):0;paint(x,y,c,h,clamp(w/2+.65-Math.hypot(x-ax-t*dx,y-ay-t*dy),0,1));
   }
  }
  function path(p,w=2,c=C.gold,h=141,close=false){for(let i=1;i<p.length;i++)line(...p[i-1],...p[i],w,c,h);if(close)line(...p.at(-1),...p[0],w,c,h);}
  function poly(p,c,h=136){
   const y0=Math.max(4,Math.ceil(Math.min(...p.map(v=>v[1])))),y1=Math.min(1019,Math.floor(Math.max(...p.map(v=>v[1]))));
   for(let y=y0;y<=y1;y++){const hits=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))hits.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2)for(let x=Math.max(4,Math.ceil(hits[i]));x<=Math.min(1019,Math.floor(hits[i+1]));x++)paint(x,y,c,h);}
  }
  function ring(x,y,r,w=2,c=C.gold){path(Array.from({length:97},(_,i)=>[x+Math.cos(i*Math.PI/48)*r,y+Math.sin(i*Math.PI/48)*r]),w,c);}
  function leaf(x,y,a,len,width,c=C.turquoise,outline=true){
   const dx=Math.cos(a),dy=Math.sin(a),p=Array.from({length:26},(_,i)=>{const t=i<13?i/12:(25-i)/12,s=(t-.5)*len,w=Math.sin(t*Math.PI)*width*(i<13?1:-1);return[x+s*dx-w*dy,y+s*dy+w*dx];});poly(p,c,139);if(outline)path(p,1.1,C.gold,144,true);line(x-dx*len*.33,y-dy*len*.33,x+dx*len*.33,y+dy*len*.33,.8,C.ivory,143);
   if(len>45)for(let n=-3;n<=3;n++)for(const side of[-1,1]){const t=n/10,s=t*len,w=Math.cos(t*Math.PI)*width*.72;line(x+s*dx,y+s*dy,x+(s+len*.065)*dx-w*dy*side,y+(s+len*.065)*dy+w*dx*side,.65,C.lightGold,141);}
  }
  function flower(x,y,r=12,petals=6){for(let k=0;k<petals;k++){const a=k*Math.PI*2/petals;leaf(x+Math.cos(a)*r*.47,y+Math.sin(a)*r*.47,a,r*.97,r*.22,k%2?C.ivory:C.turquoise);}ring(x,y,r*.22,1.3,C.lightGold);line(x,y,x,y,r*.18,C.gold,146);}
  function spiral(x,y,r,a=0,turns=1.15){
   const p=Array.from({length:85},(_,i)=>{const t=i/84,q=a+t*Math.PI*2*turns,rr=r*(1-.86*t);return[x+Math.cos(q)*rr,y+Math.sin(q)*rr];});path(p,1.9,C.gold);path(p.map(([a,b])=>[a+2,b+2]),.7,C.ivory,139);
   for(let i=6;i<76;i+=8){const q=p[i],n=p[i+1],angle=Math.atan2(n[1]-q[1],n[0]-q[0]);leaf(q[0]+Math.cos(angle+1)*10,q[1]+Math.sin(angle+1)*10,angle+1,27,5.6,i%3?C.turquoise:C.ivory);}flower(...p.at(-1),12);
  }
  function curve(p0,p1,p2,p3,w=2,c=C.gold,foliage=false){
   const p=Array.from({length:65},(_,i)=>{const t=i/64,s=1-t;return[s*s*s*p0[0]+3*s*s*t*p1[0]+3*s*t*t*p2[0]+t*t*t*p3[0],s*s*s*p0[1]+3*s*s*t*p1[1]+3*s*t*t*p2[1]+t*t*t*p3[1]];});path(p,w,c);
   if(foliage)for(let i=5;i<60;i+=7){const q=p[i],n=p[i+1],a=Math.atan2(n[1]-q[1],n[0]-q[0])+(i%2?1:-1);leaf(q[0]+Math.cos(a)*10,q[1]+Math.sin(a)*10,a,30,6.5,i%3?C.turquoise:C.ivory);}return p;
  }
  function frame(x0,y0,x1,y1){for(const[inset,w,c]of[[0,3,C.gold],[7,1,C.ivory],[16,1.7,C.gold]])path([[x0+inset,y0+inset],[x1-inset,y0+inset],[x1-inset,y1-inset],[x0+inset,y1-inset]],w,c,142,true);}
  function filigree(x0,y0,x1,y1,spacing=94){
   for(let lane=0;lane<Math.ceil((x1-x0)/spacing);lane++){
    const base=x0+spacing*(lane+.5),height=y1-y0,phase=lane*Math.PI;
    const p=Array.from({length:Math.ceil(height/5)+1},(_,i)=>{const y=y0+Math.min(height,i*5);return[base+spacing*.29*Math.sin((y-y0)*Math.PI*2/(spacing*2)+phase),y];});path(p,1.05,C.gold,140);
    for(let n=0;n<Math.floor(height/31);n++){
     const y=y0+18+n*31,a=(y-y0)*Math.PI*2/(spacing*2)+phase,x=base+spacing*.29*Math.sin(a),angle=(n%2?0:Math.PI)+.6*Math.cos(a);
     leaf(x+Math.cos(angle)*9,y+Math.sin(angle)*9,angle,23,4.3,n%4?C.turquoise:C.ivory);
     if(n%3===1)flower(x+Math.cos(angle)*22,y+Math.sin(angle)*22,6,6);
    }
   }
   // Fine crossing tendrils connect the winding stems into one arabesque.
   for(let row=0;row<Math.ceil((y1-y0)/(spacing*1.5));row++){
    const y=y0+spacing*(row*1.5+.7),p=Array.from({length:Math.ceil((x1-x0)/5)+1},(_,i)=>{const x=x0+Math.min(x1-x0,i*5);return[x,y+spacing*.23*Math.sin((x-x0)*Math.PI*2/(spacing*2)+row*Math.PI)];});path(p,.7,C.ivory,138);
   }
  }
  return{line,path,poly,ring,leaf,flower,spiral,curve,frame,filigree};
 }
 // MAIN PANEL: one hierarchical medallion, scrolling spandrels, and three
 // small pointed floral panels below it, instead of repeating star squares.
 {
  const d=region('panel');d.filigree(66,345,958,959,83);d.frame(22,22,1002,1002);d.frame(56,330,968,970);
  for(const[x,y,a]of[[170,450,0],[850,450,Math.PI],[170,846,-Math.PI/2],[850,846,Math.PI/2]])d.spiral(x,y,140,a,1.3);
  for(let i=0;i<7;i++){d.flower(103+i*136,949,13,8);d.flower(103+i*136,351,11,6);d.leaf(169+i*136,947,0,58,9,i%2?C.pale:C.turquoise);}
  for(const x of[83,941])for(let i=0;i<8;i++){d.flower(x,397+i*72,10);d.leaf(x,430+i*72,Math.PI/2,29,5,C.ivory);}
  const cx=512,cy=650,star=(r,inner,n=16)=>Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n-Math.PI/2,R=i%2?r*inner:r;return[cx+Math.cos(a)*R,cy+Math.sin(a)*R];});
  d.poly(star(257,.87),C.deep);d.path(star(257,.87),3,C.gold,146,true);d.path(star(246,.87),1.2,C.ivory,144,true);
  for(let k=0;k<16;k++){const a=k*Math.PI/8;d.leaf(cx+Math.cos(a)*181,cy+Math.sin(a)*181,a,105,18,k%2?C.turquoise:C.blue);const b=a+Math.PI/16;d.flower(cx+Math.cos(b)*207,cy+Math.sin(b)*207,10,6);d.path([[cx+Math.cos(a-.10)*100,cy+Math.sin(a-.10)*100],[cx+Math.cos(a)*236,cy+Math.sin(a)*236],[cx+Math.cos(a+.10)*100,cy+Math.sin(a+.10)*100]],1.2,C.lightGold);}
  d.ring(cx,cy,139,2,C.gold);d.ring(cx,cy,133,1,C.ivory);
  for(let k=0;k<12;k++){const a=k*Math.PI/6;d.leaf(cx+Math.cos(a)*85,cy+Math.sin(a)*85,a,85,16,k%2?C.pale:C.turquoise);d.flower(cx+Math.cos(a+.26)*119,cy+Math.sin(a+.26)*119,6,5);}
  d.path(star(65,.58,12),2,C.gold,146,true);d.flower(cx,cy,34,12);d.ring(cx,cy,12,2,C.ivory);
  for(let j=0;j<3;j++){
   const x=80+j*292,w=280,c=x+w/2,y=61,spring=195,top=301;
   const half=Array.from({length:25},(_,i)=>{const t=i/24,s=1-t;return[s*s*(x+w)+2*s*t*(c+w*.40)+t*t*c,s*s*spring+2*s*t*(top-35)+t*t*top];}),arch=[[x,y],[x+w,y],...half,...half.toReversed().map(([u,v])=>[2*c-u,v]),[x,y]];
   d.poly(arch,C.blue);d.path(arch,2.5,C.gold,145,true);d.line(c,y+12,c,top-28,1.8,C.gold);d.curve([c,y+30],[x+5,128],[c-95,242],[c,top-31],1.5,C.ivory,true);d.curve([c,y+30],[x+w-5,128],[c+95,242],[c,top-31],1.5,C.ivory,true);d.flower(c,178,25,8);d.flower(c,96,13,6);d.leaf(c,252,Math.PI/2,39,10,C.turquoise);
   d.spiral(c-78,137,42,Math.PI/2);d.spiral(c+78,137,42,Math.PI/2);for(let q=0;q<5;q++){d.flower(x+31+q*55,y+15,5);d.leaf(x+31+q*55,y+31,Math.PI/2,12,2.3);}
  }
 }
 // FLORAL FIELD: interlacing curving stems and small blossoms, no checker grid.
 {
  const d=region('floral');d.filigree(4,4,1019,1019,85);for(let col=0;col<4;col++)for(let row=0;row<4;row++){
   const x=128+col*256,y=row*256;d.curve([x,y],[x+125,y+90],[x-125,y+165],[x,y+256],2.4,C.gold,true);d.curve([x,y],[x-125,y+90],[x+125,y+165],[x,y+256],1.1,C.ivory,true);d.flower(x+col%2*18,y+128,22,8);d.spiral(x+(row%2?64:-64),y+69,51,row*.65,1.1);d.flower(x+(row%2?-73:73),y+213,12,6);
  }
 }
 // BORDER BAND: one continuous scrolling ribbon with paired gold edges.
 {
  const d=region('border');d.filigree(4,105,1019,919,80);for(const y of[24,48,976,1000])d.line(4,y,1019,y,y===24||y===1000?4:1.4,C.gold);for(const y of[85,939])d.line(4,y,1019,y,1,C.ivory);
  for(let k=0;k<6;k++){const x=k*171;d.curve([x,512],[x+50,175],[x+120,175],[x+171,512],3.2,C.gold,true);d.curve([x,512],[x+50,849],[x+120,849],[x+171,512],3.2,C.gold,true);d.flower(x+85,315,42,8);d.flower(x+85,709,42,8);d.flower(x,512,31,8);d.spiral(x+85,506,65,k%2?0:Math.PI,1.1);d.leaf(x+85,148,0,80,15,C.turquoise);d.leaf(x+85,876,0,80,15,C.turquoise);for(const y of[113,911]){d.flower(x+25,y,10);d.flower(x+143,y,10);}}
 }
 // CELL: tiny palmette/droplet on a fine diagonal ceramic lattice. Real scene
 // geometry owns the muqarnas silhouette and recession, never this map.
 {
  const d=region('cell');for(let k=-6;k<13;k++){d.line(k*128,4,k*128+1024,1019,.65,[90,91,104],136);d.line(k*128,1019,k*128+1024,4,.65,[90,91,104],136);}
  d.filigree(25,35,999,989,115);
  const drop=d.curve([512,168],[160,430],[215,818],[512,872],2.2,C.gold);drop.push(...d.curve([512,872],[809,818],[864,430],[512,168],2.2,C.gold));d.poly(drop,C.deep);d.path(drop,2.6,C.gold,145,true);
  for(let k=0;k<7;k++){const a=-Math.PI*.85+k*Math.PI*.1167;d.leaf(512+Math.cos(a)*145,606+Math.sin(a)*145,a,231,29,k%2?C.pale:C.turquoise);}
  d.curve([512,277],[421,421],[410,650],[512,795],1.8,C.ivory,true);d.curve([512,277],[603,421],[614,650],[512,795],1.8,C.ivory,true);d.flower(512,658,49,12);d.flower(512,764,22,8);d.leaf(512,356,Math.PI/2,112,22,C.turquoise);
  for(const[x,y,a]of[[180,220,0],[844,220,Math.PI],[160,800,0],[864,800,Math.PI]]){d.spiral(x,y,95,a);d.flower(x,y+107,14,6);}
 }
 // Exact neutral four-pixel gutters isolate regions and close repeating-strip
 // edges. Decoration never relies on a mip sample from another atlas region.
 for(const[rx,ry]of[[0,0],[1,0],[0,1],[1,1]])for(let y=0;y<1024;y++)for(let x=0;x<1024;x++)if(x<4||x>1019||y<4||y>1019){const i=((ry*1024+y)*size+rx*1024+x)*4;for(let k=0;k<3;k++){map[i+k]=C.lapis[k];bump[i+k]=132;}}
 cachedPixels=Object.freeze({map,bump});return cachedPixels;
}

export function createEscherNicheTileFinish(T){
 const p=buildEscherNicheTilePixels();function texture(data,name,colour){
  const t=new T.DataTexture(data,2048,2048,T.RGBAFormat,T.UnsignedByteType);t.name=name;t.flipY=false;t.colorSpace=colour?T.SRGBColorSpace:(T.NoColorSpace??'');t.wrapS=t.wrapT=T.RepeatWrapping;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;t.userData={originalProcedural:true,atlasRegions:ESCHER_NICHE_TILE_FINISH.regions,regionSize:1024};return t;
 }
 const map=texture(p.map,'Original lapis ceramic atlas · medallion, floral scroll, border, palmette',true),bumpMap=texture(p.bump,'Original ceramic atlas · neutral shallow glaze',false);let disposed=false;
 return{map,bumpMap,dispose(){if(disposed)return;disposed=true;map.dispose();bumpMap.dispose();}};
}
