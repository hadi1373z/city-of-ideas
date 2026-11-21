import {createHouseTiling} from './house-tiling-model.js?v=makers-passages-20261118';

// The approved garden sketch uses pale, nearly level, individually tiled roofs.
// Dimensions remain in the unchanged source-house frame, centred at X125.
export const SIXFOLD_GARDEN_ROOF=Object.freeze({
 sourceX:125,outerRadius:25,fieldRadius:23.75,parapetInnerRadius:24,
 undersideY:23.97,slabTopY:24.31,tileBottomY:24.315,tileTopY:24.415,
 parapetTopY:24.88,capTopY:24.905,lanternRadius:3.8,lanternBorderRadius:4.1,lanternSides:48,
 lanternSillY:24.55,lanternShoulderY:25.25,lanternPeakY:25.9,
 jointWidth:.065,patternScale:2
});
export const roofHexagon=radius=>Array.from({length:6},(_,i)=>[radius*Math.cos(i*Math.PI/3),radius*Math.sin(i*Math.PI/3)]);

/** Reuse the exact parent polygons and original pre-crop grout. The coarser
 * roof field is legible from the garden aerial view; it is not a texture,
 * arbitrary polygon decoration, or proof of infinite Penrose aperiodicity.
 */
export function createSixfoldHouseRoof(pattern='penrose'){
 const r=SIXFOLD_GARDEN_ROOF,s=r.patternScale;
 const patch=createHouseTiling({pattern,depth:4,radius:36/s,outerRadius:r.fieldRadius/s,wellRadius:r.lanternBorderRadius/s,wellSides:r.lanternSides,grout:r.jointWidth/s});
 const scale=p=>p.map(([x,z])=>[x*s,z*s]);
 const tiles=patch.cells.map(c=>({id:c.id,kind:c.kind,parent:scale(c.rhomb),polygons:c.insetPolygons.map(scale)})).filter(c=>c.polygons.length);
 const opening=Array.from({length:r.lanternSides},(_,i)=>{const a=i*Math.PI*2/r.lanternSides,v=r.lanternRadius/Math.cos(Math.PI/r.lanternSides);return[v*Math.cos(a),v*Math.sin(a)];});
 return{pattern,roof:r,outer:roofHexagon(r.outerRadius),field:scale(patch.outer),opening,fieldOpening:scale(patch.well),tiles,
  fullArea:patch.area*s*s,tileArea:patch.insetArea*s*s,
  credit:'Original roof architecture using the existing exact '+pattern+' parent polygons; finite clipped field.'};
}
