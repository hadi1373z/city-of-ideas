import {createBirdMorphGeometry,createBirdMorphMaterial,birdMorphPoint} from './bird-morph-geometry.js?v=bird-peel-20261117b';
// Original geometric birds, built by exchanging opposite edges of a unit square.
// No Escher artwork or historical print is reproduced. The uncurved master tile
// is a translational tessellation; the cylinder is its periodic horizontal wrap.
const TAU = Math.PI * 2;
const bottom = [[0,0],[.15,-.025],[.26,.10],[.40,.58],[.52,.19],[.64,.06],[.82,-.04],[1,0]];
const right = [[1,0],[1.12,.12],[1.03,.25],[1.06,.34],[1.28,.42],[1.10,.46],[1.06,.62],[.94,.67],[.84,.72],[.94,.88],[1,1]];
const top = bottom.toReversed().map(([x,y]) => [x,y+1]);
const left = right.toReversed().map(([x,y]) => [x-1,y]);
export const BIRD_TILE_EDGES = Object.freeze({bottom, right, top, left});
export const BIRD_TILE_OUTLINE = Object.freeze([...bottom.slice(0,-1),...right.slice(0,-1),...top.slice(0,-1),...left.slice(0,-1)].map(p => Object.freeze(p)));
const palette = [0xe0d7bd, 0xb88b58, 0x56727b];
const rasterCache=new Map();
/** A small original repeating image of the very same geometric birds. Scanline
 * rasterization is deterministic and needs neither canvas nor browser globals.
 * One 512px three-by-three repeat replaces the distant extrusion geometry.
 */
export function createBirdWallPixels(size=512){
  if(!Number.isInteger(size)||size<128||size>1024||(size&(size-1)))throw new RangeError('Bird texture size must be a power of two from128 to1024');
  if(rasterCache.has(size))return rasterCache.get(size);
  const scale=2,res=size*scale,data=new Uint8Array(res*res*4),rgb=hex=>[(hex>>16)&255,(hex>>8)&255,hex&255,255],base=rgb(palette[1]),unit=res/3;
  for(let i=0;i<data.length;i+=4)data.set(base,i);
  function fill(points,colour){const poly=points.map(([x,y])=>[x*unit,y*unit]),lo=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1])))),hi=Math.min(res-1,Math.ceil(Math.max(...poly.map(p=>p[1]))));for(let y=lo;y<=hi;y++){const ys=y+.5,cuts=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if((a[1]>ys)===(b[1]>ys))continue;cuts.push(a[0]+(ys-a[1])*(b[0]-a[0])/(b[1]-a[1]));}cuts.sort((a,b)=>a-b);for(let j=0;j+1<cuts.length;j+=2){const x0=Math.max(0,Math.ceil(cuts[j]-.5)),x1=Math.min(res-1,Math.floor(cuts[j+1]-.5));for(let x=x0;x<=x1;x++)data.set(colour,(y*res+x)*4);}}}
  for(let row=-2;row<=3;row++)for(let column=-1;column<=3;column++){
    const place=p=>[column+.5+(p[0]-.5)*.986,row+.5+(p[1]-.5)*.986],colour=rgb(palette[((column+row)%3+3)%3]),ink=rgb(0x283e43);
    fill(BIRD_TILE_OUTLINE.map(place),colour);
    fill([[1.025,.52],[1.057,.54],[1.026,.56]].map(place),ink);
  }
  const pixels=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++)for(let channel=0;channel<4;channel++){let sum=0;for(let sy=0;sy<scale;sy++)for(let sx=0;sx<scale;sx++)sum+=data[((y*scale+sy)*res+x*scale+sx)*4+channel];pixels[(y*size+x)*4+channel]=Math.round(sum/(scale*scale));}
  const result={pixels,size,period:3};rasterCache.set(size,result);return result;
}
const angleDistance = a => Math.atan2(Math.sin(a),Math.cos(a));
const smooth = x => {x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};

export function cylinderDepartureCell(i,{columns=84,count=64}={}){return{column:Math.floor(i*columns/count),row:32+i%3};}
const departureCache=new Map();
/** Tile metadata remains complete; only the decorative bird field opens up.
 * The structural warm lining continues all the way to the rim. Exact living
 * flock source cells are never shrunk or moved away from their matching birds.
 */
export function cylinderTileFinish(row,column,{columns=84,departureCount=64}={}){
 const key=columns+':'+departureCount;if(!departureCache.has(key))departureCache.set(key,new Set(Array.from({length:departureCount},(_,i)=>{const p=cylinderDepartureCell(i,{columns,count:departureCount});return p.row+':'+p.column;})));const departure=departureCache.get(key).has(row+':'+column);
 const theta=column/columns*TAU,boundary=32.1+1.65*Math.sin(theta*3+.6)+.45*Math.sin(theta*6),level=smooth((row-27)/7);
 const kept=departure||row<28||row<35&&row<=boundary;
 return{departure,kept,intermediate:kept&&!departure&&row>=28&&row<35,scale:kept?.986:0,radius:20.94,progress:level};
}
// Intermediate cells belong to the two thin wing batches in both LODs. Their
// flat texture glyph is suppressed so a bird never has a second face behind it.
export function createBirdTaperPixels(layout){const width=layout.columns>128?256:128,height=64,pixels=new Uint8Array(width*height*4);for(const t of layout.tiles){const i=((t.row+1)*width+t.column)*4;pixels[i]=t.kept&&!t.intermediate&&!t.departure?255:0;pixels[i+1]=Math.round(t.scale/.986*255);pixels[i+2]=t.departure?255:t.intermediate?128:0;pixels[i+3]=255;}return{pixels,width,height,firstRow:-1};}
export function cylinderIntermediatePose(tile,time=0,{reduced=false}={}){const t=reduced?0:Number.isFinite(time)?time:0,p=cylinderTilePoint(tile,[.56,.68]),level=tile.progress,breath=reduced?0:Math.sin(t*.55+tile.theta*3)*.025*level;return{x:p[0],y:p[1],z:p[2],theta:Math.atan2(p[2],p[0]),scaleX:tile.width*tile.scale,scaleY:tile.height*tile.scale,fold:.08+.70*level+breath,inflate:.05+.32*level,lift:0};}

/** Physical upper-world coordinates. Pure metadata, shared with the checks. */
export function createCylinderMetamorphosisLayout({radius=20.94,columns=84,rows=39,topY=-28.14,rowHeight=1.86,birdCount=64,departureCount=64}={}) {
  if(!Number.isFinite(radius)||radius<20.4||radius>20.98)throw new RangeError('Relief must sit inside the existing r21.03 retaining wall');
  if(!Number.isInteger(columns)||columns<36||columns>144||columns%3)throw new RangeError('Use 36..144 columns, divisible by three for the colour seam');
  if(!Number.isInteger(rows)||rows<1||rows>48||!Number.isFinite(topY)||!Number.isFinite(rowHeight)||rowHeight<=0)throw new RangeError('Invalid wall rows');
  if(!Number.isInteger(birdCount)||birdCount<0||birdCount>128)throw new RangeError('Use at most 128 flying birds');
  if(!Number.isInteger(departureCount)||departureCount<1||departureCount>128)throw new RangeError('Use 1..128 matching departure cells');
  const width=TAU*radius/columns,tiles=[],birds=[];
  // Row zero retains its established coordinates for the departing flock.
  // The additional row -1 finishes the lining right up to the Babel landing.
  for(let slot=0;slot<rows;slot++)for(let column=0;column<columns;column++) {
    const row=slot-1;
    const finish=cylinderTileFinish(row,column,{columns,departureCount});
    tiles.push({row,column,theta:column*TAU/columns,y:topY-row*rowHeight,width,height:rowHeight,wrapRadius:radius,
      ...finish,radius:finish.radius+(radius-20.94),colour:((column+2*row)%3+3)%3});
  }
  for(let i=0;i<birdCount;i++) {
    const row=i%4,column=Math.floor(i/4),count=Math.ceil(birdCount/4);
    const theta=.52+(column+.5)/Math.max(1,count)*(TAU-1.04);
    birds.push({id:i,theta,y:-78.5-row*3.2+(column%3)*.22,phase:i*2.399963229728653,scale:1.16+(i%5)*.035,colour:(column+row)%3});
  }
  // The east side is tiled too. These are actual, HEIGHT-LIMITED openings,
  // not an empty vertical stripe around every landing in the complete cylinder.
  const apertures=[
    {id:'escher',angle0:-Math.asin(2.3/radius),angle1:Math.asin(2.3/radius),bottom:-40.2,top:-34.7},
    {id:'lower-entry',angle0:-.15,angle1:.15,bottom:-96.3,top:-92.4},
    ...[-1,1].map(sign=>({id:'middle-platform-corner-'+sign,angle0:sign<0?-.17:.12,angle1:sign<0?-.12:.17,bottom:-48.25,top:-46.75}))
  ];
  return{radius,columns,rows,width,rowHeight,topY,tiles,birds,apertures,wallTop:-24,wallBottom:-96.18,departureCount,coverage:{fullThroughRow:27,taperFirstRow:28,taperLastRow:34,plainFromRow:35,backing:'complete warm honey stone'},
    credit:'Original bird polygons and low-poly sculpture for City of Ideas; translational opposite-edge construction, not copied artwork.',
    bounds:{minRadius:18.8,maxRadius:21.03,top:-26.6,bottom:-93.5},
    routeClearance:{stairOuterRadius:17.66,archOuterRadius:18.12}};
}

function clipLine(poly,axis,value,positive=true){const out=[],sign=positive?1:-1;for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=(p[axis]-value)*sign,b=(q[axis]-value)*sign;if(a>=0)out.push(p);if((a<0)!==(b<0)){const t=a/(a-b);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}}return out.length>=3?out:[];}
function subtractRect(poly,box){let remaining=poly;const out=[];for(const[axis,value,positive]of[[0,box[0],true],[0,box[1],false],[1,box[2],true],[1,box[3],false]]){if(!remaining.length)break;const outside=clipLine(remaining,axis,value,!positive);if(outside.length)out.push(outside);remaining=clipLine(remaining,axis,value,positive);}return out;}
const wallPoint=(layout,[u,y],radius)=>[radius*Math.cos(u*TAU/layout.columns),y,radius*Math.sin(u*TAU/layout.columns)];
function apertureBoxes(layout){return layout.apertures.flatMap(a=>[-1,0,1].map(turn=>[(a.angle0/TAU+turn)*layout.columns,(a.angle1/TAU+turn)*layout.columns,a.bottom,a.top]));}
export function cylinderWallOpening(layout,angle,y){return layout.apertures.some(a=>y>a.bottom&&y<a.top&&angleDistance(angle)>a.angle0&&angleDistance(angle)<a.angle1);}

export function cylinderTilePoint(tile,p,{back=false,ink=false}={}) {
  const u=.5+(p[0]-.5)*tile.scale,v=.5+(p[1]-.5)*tile.scale;
  const theta=tile.theta+u*tile.width/tile.wrapRadius;
  const r=tile.radius+(back?.044:0)-(ink?.008:0);
  return[r*Math.cos(theta),tile.y+v*tile.height,r*Math.sin(theta)];
}

export function cylinderBirdPose(bird,time=0,{reduced=false}={}) {
  const t=reduced?0:(Number.isFinite(time)?time:0),p=bird.phase;
  const theta=bird.theta+.012*Math.sin(t*.37+p),radius=20.12+.085*Math.sin(t*.31+p*.8);
  return{theta,radius,x:radius*Math.cos(theta),y:bird.y+.12*Math.sin(t*.42+p),z:radius*Math.sin(theta),
    yaw:-theta-Math.PI/2,bank:.085*Math.sin(t*.53+p),fold:.45+.28*Math.sin(t*1.85+p),scale:bird.scale};
}

function clipWing(poly,above) {
  const out=[],level=.68;
  for(let i=0;i<poly.length;i++) {
    const p=poly[i],q=poly[(i+1)%poly.length],a=(p[1]-level)*(above?1:-1),b=(q[1]-level)*(above?1:-1);
    if(a>=0)out.push(p);
    if((a<0)!==(b<0)){const t=a/(a-b);out.push([p[0]+(q[0]-p[0])*t,level]);}
  }
  return out;
}

export function buildCylinderMetamorphosis(T,options={}) {
  const layout=createCylinderMetamorphosisLayout(options),group=new T.Group(),owned=new Set(),own=o=>(owned.add(o),o);
  group.name='Metamorphosis · interlocking wall birds become a living flock';
  group.userData.cylinderMetamorphosis=true;group.userData.credit=layout.credit;
  const material=colour=>own(new T.MeshLambertMaterial({color:colour,emissive:colour,emissiveIntensity:.065,side:T.DoubleSide}));
  const stoneMaterials=palette.map(material),inkMaterial=material(0x283e43),flightMaterial=own(new T.MeshLambertMaterial({color:0xffffff,vertexColors:true,side:T.DoubleSide,emissive:0x746b55,emissiveIntensity:.06}));
  const outline=BIRD_TILE_OUTLINE.map(p=>new T.Vector2(...p)),faces=T.ShapeUtils.triangulateShape(outline,[]),batches=Array.from({length:4},()=>({positions:[],indices:[]}));
  const tri=(batch,a,b,c)=>{const i=batch.positions.length/3;batch.positions.push(...a,...b,...c);batch.indices.push(i,i+1,i+2);};
  const holes=apertureBoxes(layout);
  function reliefPiece(batch,poly,radius,triangles=null){
    if(poly.length<3)return;const front=poly.map(p=>wallPoint(layout,p,radius)),back=poly.map(p=>wallPoint(layout,p,radius+.044));
    const offset=batch.positions.length/3,n=front.length;batch.positions.push(...front.flat(),...back.flat());
    const fs=triangles??Array.from({length:n-2},(_,j)=>[0,j+1,j+2]);for(const[a,b,c]of fs)batch.indices.push(offset+a,offset+b,offset+c,offset+n+c,offset+n+b,offset+n+a);
    for(let i=0;i<n;i++){const j=(i+1)%n,k=batch.positions.length/3;batch.positions.push(...front[i],...back[i],...back[j],...front[j]);batch.indices.push(k,k+1,k+2,k,k+2,k+3);}
  }
  function panel(tile) {
    const batch=batches[tile.colour],poly=BIRD_TILE_OUTLINE.map(p=>[tile.column+.5+(p[0]-.5)*tile.scale,tile.y+(.5+(p[1]-.5)*tile.scale)*tile.height]);
    const minU=Math.min(...poly.map(p=>p[0])),maxU=Math.max(...poly.map(p=>p[0])),minY=Math.min(...poly.map(p=>p[1])),maxY=Math.max(...poly.map(p=>p[1]));
    const relevant=holes.filter(h=>h[0]<maxU&&h[1]>minU&&h[2]<maxY&&h[3]>minY),cut=minY<layout.wallBottom||maxY>layout.wallTop||relevant.length;
    if(!cut)reliefPiece(batch,poly,tile.radius,faces);
    else for(const ids of faces){let pieces=[clipLine(clipLine(ids.map(i=>poly[i]),1,layout.wallBottom),1,layout.wallTop,false)].filter(p=>p.length);for(const hole of relevant)pieces=pieces.flatMap(p=>subtractRect(p,hole));for(const p of pieces)reliefPiece(batch,p,tile.radius);}
    const ink=p=>cylinderTilePoint(tile,p,{ink:true}),dark=batches[3];
    // An eye and two short feather cuts keep the repeating outline legible as
    // birds at walking distance. These are geometry, not a generated texture.
    const allowed=p=>p[1]>layout.wallBottom&&p[1]<layout.wallTop&&!cylinderWallOpening(layout,Math.atan2(p[2],p[0]),p[1]);
    const eye=[ink([1.025,.52]),ink([1.057,.54]),ink([1.026,.56])];if(eye.every(allowed))tri(dark,...eye);

  }
  layout.tiles.filter(tile=>tile.kept&&!tile.intermediate&&!tile.departure).forEach(panel);
  // Warm backing replaces visible grey retaining stone in every grout line and
  // behind the full-height east field. Only genuine portals interrupt it.
  const us=[...new Set([0,layout.columns,...Array.from({length:layout.columns*2+1},(_,i)=>i/2),...holes.flatMap(h=>[h[0],h[1]]).filter(u=>u>0&&u<layout.columns)])].sort((a,b)=>a-b);
  const ys=[...new Set([layout.wallBottom,layout.wallTop,...layout.apertures.flatMap(a=>[a.bottom,a.top]).filter(y=>y>layout.wallBottom&&y<layout.wallTop)])].sort((a,b)=>a-b);
  for(let i=1;i<us.length;i++)for(let j=1;j<ys.length;j++){const angle=(us[i-1]+us[i])/2*TAU/layout.columns,y=(ys[j-1]+ys[j])/2;if(cylinderWallOpening(layout,angle,y))continue;const q=[[us[i-1],ys[j-1]],[us[i],ys[j-1]],[us[i],ys[j]],[us[i-1],ys[j]]].map(p=>wallPoint(layout,p,21.012));tri(batches[1],q[0],q[1],q[2]);tri(batches[1],q[0],q[2],q[3]);}
  const meshes=[],wallMeshes=[],bandHeight=layout.rowHeight*4;
  const reliefBands=Array.from({length:Math.ceil((layout.wallTop-layout.wallBottom)/bandHeight)},(_,id)=>({id,top:layout.wallTop-id*bandHeight,bottom:Math.max(layout.wallBottom,layout.wallTop-(id+1)*bandHeight),meshes:[],triangles:0,batches:Array.from({length:4},()=>({positions:[],indices:[]}))}));
  function geometry(positions,indices,colours) {
    const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);
    if(colours)g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.computeVertexNormals();g.computeBoundingSphere();return g;
  }
  // Split the actual triangles at exact horizontal planes. Invisible bands do
  // not enter a draw call; clipping one giant mesh in its shader would retain
  // the original vertex cost. Every band includes its own warm grout backing.
  const bandAt=y=>Math.max(0,Math.min(reliefBands.length-1,Math.floor((layout.wallTop-y)/bandHeight)));
  function clipHeight(poly,height,above){const out=[],sign=above?1:-1;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],u=(a[1]-height)*sign,v=(b[1]-height)*sign;if(u>=0)out.push(a);if((u<0)!==(v<0)){const t=u/(u-v);out.push(a.map((value,k)=>value+(b[k]-value)*t));}}return out;}
  batches.forEach((batch,colour)=>{for(let i=0;i<batch.indices.length;i+=3){const points=batch.indices.slice(i,i+3).map(id=>batch.positions.slice(id*3,id*3+3)),first=bandAt(Math.max(...points.map(p=>p[1]))),last=bandAt(Math.min(...points.map(p=>p[1])));for(let id=first;id<=last;id++){const band=reliefBands[id],poly=first===last?points:clipHeight(clipHeight(points,band.bottom,true),band.top,false);for(let j=1;j+1<poly.length;j++)tri(band.batches[colour],poly[0],poly[j],poly[j+1]);}}});
  for(const band of reliefBands){band.batches.forEach((batch,i)=>{if(!batch.positions.length)return;const mesh=new T.Mesh(geometry(batch.positions,batch.indices),i===3?inkMaterial:stoneMaterials[i]);mesh.name='Local bird relief band '+band.id+' · '+(i===3?'feather and eye inlays':['ivory','ochre','slate'][i]);mesh.userData.cylinderReliefBand=band.id;group.add(mesh);meshes.push(mesh);wallMeshes.push(mesh);band.meshes.push(mesh);band.triangles+=batch.indices.length/3;});delete band.batches;}
  batches.forEach(batch=>{batch.positions.length=0;batch.indices.length=0;});
  // The distant proxy preserves the complete cylinder and the exact same real
  // portal cuts. Only its shallow extrusion is replaced by an original texture.
  const raster=createBirdWallPixels(),texture=own(new T.DataTexture(raster.pixels,raster.size,raster.size,T.RGBAFormat));texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=2;texture.needsUpdate=true;
  const proxyPositions=[],proxyIndices=[],proxyUvs=[];
  for(let i=1;i<us.length;i++)for(let j=1;j<ys.length;j++){const angle=(us[i-1]+us[i])/2*TAU/layout.columns,y=(ys[j-1]+ys[j])/2;if(cylinderWallOpening(layout,angle,y))continue;const p=[[us[i-1],ys[j-1]],[us[i],ys[j-1]],[us[i],ys[j]],[us[i-1],ys[j]]],k=proxyPositions.length/3;for(const q of p){proxyPositions.push(...wallPoint(layout,q,layout.radius));proxyUvs.push(q[0]/3,(q[1]-layout.topY)/(layout.rowHeight*3));}proxyIndices.push(k,k+1,k+2,k,k+2,k+3);}
  const proxyGeometry=geometry(proxyPositions,proxyIndices);proxyGeometry.setAttribute('uv',new T.Float32BufferAttribute(proxyUvs,2));
  const taper=createBirdTaperPixels(layout),taperTexture=own(new T.DataTexture(taper.pixels,taper.width,taper.height,T.RGBAFormat));taperTexture.magFilter=taperTexture.minFilter=T.NearestFilter;taperTexture.generateMipmaps=false;taperTexture.needsUpdate=true;
  const proxyMaterial=own(new T.MeshLambertMaterial({color:0xffffff,map:texture,side:T.DoubleSide,emissive:0x8e805e,emissiveIntensity:.04}));
  proxyMaterial.userData.birdTaper={...taper,texture:taperTexture};
  const activeHeight={value:new T.Vector2(1,0)};
  proxyMaterial.userData.activeReliefHeight=activeHeight;
  proxyMaterial.onBeforeCompile=shader=>{shader.uniforms.birdTaper={value:taperTexture};shader.uniforms.birdStone={value:new T.Color(palette[1])};shader.uniforms.birdColumns={value:layout.columns};shader.uniforms.birdTaperSize={value:new T.Vector2(taper.width,taper.height)};shader.uniforms.birdActiveHeight=activeHeight;shader.uniforms.birdTopY={value:layout.topY};shader.uniforms.birdRowHeight={value:layout.rowHeight};shader.fragmentShader='uniform sampler2D birdTaper;uniform vec3 birdStone;uniform float birdColumns;uniform vec2 birdTaperSize;uniform vec2 birdActiveHeight;uniform float birdTopY;uniform float birdRowHeight;\n'+shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
    float birdPhysicalY=birdTopY+vMapUv.y*3.0*birdRowHeight;
    if(birdPhysicalY>=birdActiveHeight.x&&birdPhysicalY<birdActiveHeight.y)discard;
    vec2 birdGrid=vMapUv*3.0;vec2 birdCell=floor(birdGrid);float birdRow=-birdCell.y;
    vec4 birdState=texture2D(birdTaper,vec2((mod(birdCell.x,birdColumns)+.5)/birdTaperSize.x,(birdRow+1.5)/birdTaperSize.y));
    vec2 birdLocal=fract(birdGrid)-.5;float birdScale=max(.001,birdState.g);
    float birdCoverage=birdState.r*(1.0-step(.5*birdScale,abs(birdLocal.x)))*(1.0-step(.5*birdScale,abs(birdLocal.y)));
    vec2 birdUv=(birdCell+.5+birdLocal/birdScale)/3.0;
    if(birdRow<28.0){birdCoverage=1.0;birdUv=vMapUv;}
    vec4 birdSample=texture2D(map,birdUv);
    diffuseColor.rgb*=mix(birdStone,birdSample.rgb,birdCoverage);
  #endif`);};proxyMaterial.customProgramCacheKey=()=> 'city-bird-taper-proxy-local-relief-v2';
  const proxy=new T.Mesh(proxyGeometry,proxyMaterial);proxy.name='Warm complete cylinder · bird field tapers into the flight';group.add(proxy);
  let detail='relief',focusY=layout.topY,activeBand=null;
  function setDetail(next,focus=focusY){if(next!=='proxy'&&next!=='relief')throw new RangeError('Use proxy or relief cylinder detail');detail=options.paintedField?'proxy':next;if(Number.isFinite(focus))focusY=focus;activeBand=detail==='relief'?reliefBands[bandAt(focusY)]:null;wallMeshes.forEach(mesh=>mesh.visible=!!activeBand&&mesh.userData.cylinderReliefBand===activeBand.id);activeHeight.value.set(activeBand?.bottom??1,activeBand?.top??0);proxy.visible=true;group.userData.cylinderDetail=detail;group.userData.cylinderReliefBand=activeBand?.id??null;}
  setDetail(detail);

  function wingGeometry(above) {
    const polygon=clipWing(BIRD_TILE_OUTLINE,above),vectors=polygon.map(p=>new T.Vector2(...p)),triangles=T.ShapeUtils.triangulateShape(vectors,[]);
    const positions=polygon.flatMap(p=>[p[0]-.56,p[1]-.68,0]);
    // Subtle per-vertex mineral variation also describes the wing plane when
    // its two hinges fold into three dimensions.
    const colours=polygon.flatMap(p=>{const v=.88+.10*Math.max(0,Math.min(1,p[0]));return[v,v,v];});
    return geometry(positions,triangles.flat(),colours);
  }
  function bodyGeometry() {
    const positions=[],indices=[],colours=[];
    const append=(g,c=1)=>{const offset=positions.length/3;positions.push(...g.attributes.position.array);indices.push(...Array.from(g.index?.array??Array.from({length:g.attributes.position.count},(_,i)=>i),i=>i+offset));for(let i=0;i<g.attributes.position.count;i++)colours.push(c,c,c);g.dispose();};
    append(new T.SphereGeometry(1,10,6).scale(.48,.105,.105).translate(-.01,-.075,.005));
    append(new T.SphereGeometry(1,8,5).scale(.115,.105,.10).translate(.49,-.025,.005));
    append(new T.ConeGeometry(.062,.22,5).rotateZ(-Math.PI/2).translate(.64,-.028,.005),.55);
    for(const sign of[-1,1])append(new T.SphereGeometry(.020,5,4).translate(.535,.007,sign*.092),.10);
    return geometry(positions,indices,colours);
  }
  // One continuous curved skin keeps the head pinned while the actual wings
  // lift. It shares its topology and inflation with the departing living bird.
  const intermediateTiles=layout.tiles.filter(t=>t.intermediate),intermediateMeshes=[];
  if(intermediateTiles.length){const g=own(createBirdMorphGeometry(T,BIRD_TILE_OUTLINE,{subdivision:0})),m=own(createBirdMorphMaterial(T)),mesh=new T.InstancedMesh(g,m,intermediateTiles.length);
    mesh.name='Continuous lifted bird relief · pinned heads and curved wings';mesh.userData={cylinderTransitionWing:true};mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    for(const[name,size]of[['birdFold',1],['birdInflate',1],['birdOpacity',1],['birdCurve',2]]){const a=new T.InstancedBufferAttribute(new Float32Array(intermediateTiles.length*size),size);a.setUsage(T.DynamicDrawUsage);g.setAttribute(name,a);}
    intermediateTiles.forEach((tile,i)=>{mesh.setColorAt(i,new T.Color(palette[tile.colour]));g.attributes.birdOpacity.setX(i,1);});mesh.instanceColor.needsUpdate=true;group.add(mesh);meshes.push(mesh);intermediateMeshes.push(mesh);
  }
  const count=layout.birds.length,flock=[];
  if(count)for(const[g,name]of[[bodyGeometry(),'Rounded bodies, beaks and eyes'],[wingGeometry(true),'Upper hinged wings from the same tile'],[wingGeometry(false),'Lower hinged wings from the same tile']]) {
    const mesh=new T.InstancedMesh(g,flightMaterial,count);mesh.name='Flying metamorphosis birds · '+name;mesh.frustumCulled=false;
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);layout.birds.forEach((bird,i)=>mesh.setColorAt(i,new T.Color(palette[bird.colour])));mesh.instanceColor.needsUpdate=true;group.add(mesh);flock.push(mesh);meshes.push(mesh);
  }
  const base=new T.Object3D(),hinge=new T.Matrix4(),rotation=new T.Quaternion(),unit=new T.Vector3(1,1,1),origin=new T.Vector3(),matrix=new T.Matrix4(),axis=new T.Vector3(1,0,0),forward=new T.Vector3(),vertical=new T.Vector3(0,1,0),normal=new T.Vector3();
  let disposed=false;
  function update(time,{reduced=options.reduced??false,detail:nextDetail,focusY:nextFocus}={}) {
    if(disposed)return;if(nextDetail||Number.isFinite(nextFocus))setDetail(nextDetail??detail,nextFocus);
    intermediateTiles.forEach((tile,i)=>{const p=cylinderIntermediatePose(tile,time,{reduced});base.position.set(p.x,p.y,p.z);forward.set(-Math.sin(p.theta),0,Math.cos(p.theta));normal.crossVectors(forward,vertical);matrix.makeBasis(forward,vertical,normal);base.quaternion.setFromRotationMatrix(matrix);base.scale.set(p.scaleX,p.scaleY,p.scaleY);base.updateMatrix();const mesh=intermediateMeshes[0],a=mesh.geometry.attributes;mesh.setMatrixAt(i,base.matrix);a.birdFold.setX(i,p.fold);a.birdInflate.setX(i,p.inflate);a.birdCurve.setXY(i,p.scaleX/tile.radius,p.scaleX/p.scaleY);});
    intermediateMeshes.forEach(mesh=>{mesh.instanceMatrix.needsUpdate=true;for(const a of Object.values(mesh.geometry.attributes))if(a.isInstancedBufferAttribute)a.needsUpdate=true;});
    if(!count)return;
    layout.birds.forEach((bird,i)=>{
      const p=cylinderBirdPose(bird,time,{reduced});base.position.set(p.x,p.y,p.z);base.rotation.set(0,p.yaw,p.bank);base.scale.setScalar(p.scale);base.updateMatrix();flock[0].setMatrixAt(i,base.matrix);
      for(let j=1;j<=2;j++){rotation.setFromAxisAngle(axis,j===1?p.fold:-p.fold);hinge.compose(origin,rotation,unit);matrix.multiplyMatrices(base.matrix,hinge);flock[j].setMatrixAt(i,matrix);}
    });
    flock.forEach(mesh=>{mesh.instanceMatrix.needsUpdate=true;});
  }
  update(0);
  return{group,layout,meshes,wallMeshes,reliefBands,intermediateTiles,intermediateMeshes,proxy,setDetail,get activeBand(){return activeBand;},get detail(){return detail;},counts:{tiles:layout.tiles.length,retainedTiles:layout.tiles.filter(t=>t.kept).length,departureTiles:layout.tiles.filter(t=>t.departure).length,transitionBirds:intermediateTiles.length,transitionWingMeshes:intermediateMeshes.length,wallProxyDrawMeshes:1+intermediateMeshes.length,wallReliefDrawMeshes:1+Math.max(...reliefBands.map(b=>b.meshes.length))+intermediateMeshes.length,birds:count,drawMeshes:meshes.length,proxyTriangles:proxyIndices.length/3,reliefTriangles:reliefBands.reduce((n,b)=>n+b.triangles,0),get activeReliefTriangles(){return activeBand?.triangles??0;}},update,dispose(){
    if(disposed)return;disposed=true;group.removeFromParent();[...flock,...intermediateMeshes].forEach(mesh=>mesh.dispose?.());for(const resource of owned)resource.dispose();group.clear();
  }};
}
