import {createPenroseRhombPatch} from './house-tiling-model.js?v=garden-house-stone-20261121';
import {WORLD_CYLINDER as W} from './world-cylinder-model.js';

export const READING_FLOOR_PENROSE=Object.freeze({innerRadius:19,outerRadius:58,floorY:.13,tileInner:24.2,tileOuter:52,extent:60,textureSize:2048,depth:7,seedRadius:90,joint:.045,palette:Object.freeze({thin:'#d8d0b5',thick:'#78978e',joint:'#ac9763',stone:'#bcb39c'})});

const edgeRadius=(a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,-(a[0]*dx+a[1]*dz)/d)):0;return Math.hypot(a[0]+t*dx,a[1]+t*dz);};
/** Full parent rhombs; the material crops their continuous field at two circles.
 * No tile is repositioned, stretched or randomly rotated to fill the annulus.
 */
export function createReadingFloorPenrose(){
 const c=READING_FLOOR_PENROSE,patch=createPenroseRhombPatch({depth:c.depth,radius:c.seedRadius});
 const cells=patch.filter(cell=>Math.min(...cell.edges.map(([a,b])=>edgeRadius(a,b)))<=c.tileOuter&&Math.max(...cell.rhomb.map(p=>Math.hypot(...p)))>=c.tileInner);
 if(cells.some(cell=>!cell.paired||cell.rhomb.length!==4))throw Error('A seed boundary half-rhomb reached the reading floor');
 const p=cells[0].rhomb,edgeLength=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);
 return{cells,edgeLength,counts:{thin:cells.filter(cell=>cell.kind===0).length,thick:cells.filter(cell=>cell.kind===1).length},construction:'Finite Robinson substitution; paired bases form true thin and thick Penrose rhombs.'};
}

/** The exact borrowed ground annulus gains only an owned stone finish.
 * The three glazed upper floors, open stair well and movement are untouched.
 */
export function installPenroseReadingFloor(M,T,{canvasFactory=()=>document.createElement('canvas'),events=globalThis}={}){
 if(M.penroseReadingFloor)return M.penroseReadingFloor;
 const floor=M.worldCylinder?.lower?.walking?.children.find(o=>o.userData.gallerySurface==='floor');
 if(!floor)throw Error('Install the lower Mathematics ground floor before its Penrose finish');
 const c=READING_FLOOR_PENROSE,model=createReadingFloorPenrose(),canvas=canvasFactory();canvas.width=canvas.height=c.textureSize;const ctx=canvas.getContext('2d');if(!ctx)throw Error('A 2D canvas is required for the Penrose floor');
 // A full square texture has one global coordinate frame. Annular clipping is
 // performed by the material, so circular crops do not invent rhomb seams.
 const scale=c.textureSize/(2*c.extent),point=p=>[(p[0]+c.extent)*scale,(c.extent-p[1])*scale];
 ctx.fillStyle=c.palette.stone;ctx.fillRect(0,0,c.textureSize,c.textureSize);ctx.lineJoin='miter';ctx.miterLimit=8;ctx.lineWidth=c.joint*scale;ctx.strokeStyle=c.palette.joint;
 for(const cell of model.cells){ctx.fillStyle=cell.kind===0?c.palette.thin:c.palette.thick;ctx.beginPath();cell.rhomb.forEach((p,i)=>i?ctx.lineTo(...point(p)):ctx.moveTo(...point(p)));ctx.closePath();ctx.fill();ctx.stroke();}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(4,M.renderer?.capabilities?.getMaxAnisotropy?.()??1);texture.wrapS=texture.wrapT=T.ClampToEdgeWrapping;
 const originalMaterial=floor.material,hadFlag=Object.prototype.hasOwnProperty.call(floor.userData,'penroseReadingFloor'),originalFlag=floor.userData.penroseReadingFloor;
 const material=new T.MeshLambertMaterial({name:'Mathematics · paired Penrose stone floor',color:0xffffff,map:texture,side:originalMaterial.side,fog:originalMaterial.fog});
 // Lambert retains the renderer's ordinary clipping, fog, physical lower
 // transform and night lights. Only the map UV calculation is replaced.
 material.onBeforeCompile=shader=>{
  shader.uniforms.readingFloorExtent={value:c.extent};shader.uniforms.readingFloorBands={value:new T.Vector2(c.tileInner,c.tileOuter)};shader.uniforms.readingFloorStone={value:new T.Color(c.palette.stone)};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vReadingFloor;').replace('#include <begin_vertex>','#include <begin_vertex>\nvReadingFloor=position.xz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vReadingFloor;uniform float readingFloorExtent;uniform vec2 readingFloorBands;uniform vec3 readingFloorStone;').replace('#include <map_fragment>','vec2 readingFloorUv=vReadingFloor/(2.0*readingFloorExtent)+.5;\nvec3 readingFloorTile=texture2D(map,readingFloorUv).rgb;float readingFloorRadius=length(vReadingFloor);float readingFloorMask=step(readingFloorBands.x,readingFloorRadius)*(1.0-step(readingFloorBands.y,readingFloorRadius));\ndiffuseColor*=vec4(mix(readingFloorStone,readingFloorTile,readingFloorMask),1.0);');
 };
 material.customProgramCacheKey=()=> 'penrose-reading-floor-v1';
 let disposed=false;floor.material=material;floor.userData.penroseReadingFloor=true;
 function visit(){if(disposed)return false;M.paperGallery?.visit?.('foundations');M.clearMovement();M.setCityMode();M.arrive({x:W.lowerOrigin.x+29,z:W.lowerOrigin.z,y:c.floorY,yaw:-Math.PI/2,pitch:-.35});M.player.pitch=-.35;return true;}
 const api={floor,material,texture,canvas,model,visit,dispose(){if(disposed)return;disposed=true;if(floor.material===material)floor.material=originalMaterial;if(floor.userData.penroseReadingFloor===true){if(hadFlag)floor.userData.penroseReadingFloor=originalFlag;else delete floor.userData.penroseReadingFloor;}texture.dispose();material.dispose();events.removeEventListener?.('pagehide',api.dispose);if(M.penroseReadingFloor===api)delete M.penroseReadingFloor;}};
 M.penroseReadingFloor=api;events.addEventListener?.('pagehide',api.dispose,{once:true});return api;
}
