import { hexagon } from './mathematical-pavilions-model.js?v=city-night-20261117';
import {HOUSE as HOUSE_JOIN,stairY,houseLandingLevel} from './transformation-house-model.js?v=makers-passages-20261118';
import {createSixfoldTilingPatch,createPenroseRhombPatch} from './sixfold-tiling-model.js?v=makers-passages-20261118';
export {createPenroseRhombPatch} from './sixfold-tiling-model.js?v=makers-passages-20261118';

// Geometry only: a finite substitution patch, not a test of infinite aperiodicity.
// Coordinates are [x, z], with counterclockwise polygons as viewed on a plan.
const EPS = 1e-10;
const cross = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const tilingArea = polygon => polygon.reduce((sum, p, i) => {
  const q = polygon[(i + 1) % polygon.length];
  return sum + p[0] * q[1] - p[1] * q[0];
}, 0) / 2;

function tidy(polygon) {
  const clean = [];
  for (const p of polygon) {
    const q = clean.at(-1);
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > EPS) clean.push(p);
  }
  if (clean.length > 1 && Math.hypot(clean[0][0] - clean.at(-1)[0], clean[0][1] - clean.at(-1)[1]) <= EPS) clean.pop();
  if (clean.length < 3 || Math.abs(tilingArea(clean)) < EPS) return [];
  return tilingArea(clean) < 0 ? clean.reverse() : clean;
}

// Partition on the exact same line for inside and outside; tolerance is used
// only when discarding duplicate vertices/zero-area fragments, never to grow tiles.
function halfPlane(polygon, a, b, inside = true, inset = 0) {
  if (!polygon.length) return [];
  const sign = inside ? 1 : -1;
  const side = p => sign * (cross(a, b, p) - inset);
  const out = [];
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i], q = polygon[(i + 1) % polygon.length];
    const u = side(p), v = side(q);
    if (u >= 0) out.push(p);
    if ((u < 0) !== (v < 0)) out.push(mix(p, q, u / (u - v)));
  }
  return tidy(out);
}

export function clipTilingPolygon(polygon, boundary) {
  let result = tidy(polygon);
  for (let i = 0; i < boundary.length && result.length; i++) {
    result = halfPlane(result, boundary[i], boundary[(i + 1) % boundary.length]);
  }
  return result;
}

// Successive outside pieces are disjoint convex fragments. This avoids joining
// the two sides of a shaft with an invalid triangle fan.
function subtractWell(polygon, well) {
  let remaining = polygon;
  const pieces = [];
  for (let i = 0; i < well.length && remaining.length; i++) {
    const a = well[i], b = well[(i + 1) % well.length];
    const outside = halfPlane(remaining, a, b, false);
    if (outside.length) pieces.push(outside);
    remaining = halfPlane(remaining, a, b);
  }
  return pieces;
}

function insetPolygon(polygon, distance) {
  let result = polygon;
  for (let i = 0; i < polygon.length && result.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length];
    result = halfPlane(result, a, b, true, distance * Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  return result;
}

function segmentInterval(a, b, boundary) {
  let lo = 0, hi = 1;
  for (let i = 0; i < boundary.length; i++) {
    const p = boundary[i], q = boundary[(i + 1) % boundary.length];
    const start = cross(p, q, a), end = cross(p, q, b), delta = end - start;
    if (Math.abs(delta) < 1e-14) {
      if (start < -EPS) return null;
    } else if (delta > 0) lo = Math.max(lo, -start / delta);
    else hi = Math.min(hi, -start / delta);
    if (lo > hi) return null;
  }
  return [lo, hi];
}

function visibleEdge(a, b, outer, well) {
  const span = segmentInterval(a, b, outer);
  if (!span) return [];
  const hole = segmentInterval(a, b, well);
  const intervals = !hole ? [span] : [
    [span[0], Math.min(span[1], hole[0])],
    [Math.max(span[0], hole[1]), span[1]]
  ];
  return intervals.filter(([lo, hi]) => hi - lo > EPS).map(([lo, hi]) => [mix(a, b, lo), mix(a, b, hi)]);
}

const rectangle=(a,b,lo,hi)=>[[a,lo],[b,lo],[b,hi],[a,hi]];

/** A continuous Penrose field folded around all six interior walls.
 * s is cumulative distance around the inset hex; v is actual world height +8.
 * This gives shared cut edges at five corners and every storey. An aperiodic
 * patch cannot close after one arbitrary perimeter translation; the sixth
 * corner is deliberately framed by architectural trim rather than faked.
 */
export function createHouseWallTiling({levels=[0,8,16,-8,-16,-24,-32,-40],radius=23,offset=.365,height=8,grout=.035,pattern='penrose'}={}) {
  if(!levels.length||!levels.every(Number.isFinite)||!Number.isFinite(radius)||radius<=0||!Number.isFinite(offset)||offset<.35||offset>.5||height!==8||!Number.isFinite(grout)||grout<0)throw new RangeError('Invalid house wall dimensions');
  const hex=hexagon(radius),cornerInset=offset/Math.sqrt(3),length=radius-2*cornerInset,perimeter=6*length;
  const patch=pattern==='penrose'?createPenroseRhombPatch({depth:8,radius:90}):createSixfoldTilingPatch(pattern,{edge:1.8,bounds:[-3*length,Math.min(...levels)+8,3*length,Math.max(...levels)+16]}).cells;
  const prepared=patch.map(cell=>({...cell,inset:insetPolygon(cell.rhomb,grout/2),box:[Math.min(...cell.rhomb.map(p=>p[0])),Math.max(...cell.rhomb.map(p=>p[0])),Math.min(...cell.rhomb.map(p=>p[1])),Math.max(...cell.rhomb.map(p=>p[1]))]}));
  const panels=[];
  for(const level of levels)for(let wall=0;wall<6;wall++){
    const a=hex[wall],b=hex[(wall+1)%6],dx=(b[0]-a[0])/radius,dz=(b[1]-a[1])/radius;
    const s0=(wall-3)*length,s1=s0+length,v0=level+8,v1=v0+height,boundary=rectangle(s0,s1,v0,v1),openings=[];
    if(level===0&&wall===1)openings.push({u0:radius/2-2.8,u1:radius/2+2.8,lo:0,hi:4.6,kind:'door'});
    if(level===-40&&(wall===2||wall===3))openings.push(wall===2?{u0:radius-3.2,u1:radius,lo:0,hi:4.6,kind:'door'}:{u0:0,u1:3.2,lo:0,hi:4.6,kind:'door'});
    if(level>=0)for(const u of[5.5,radius-5.5])openings.push({u0:u-1.7,u1:u+1.7,lo:1.35,hi:4.55,kind:'window'});
    // Keep the entire timber lintel, sill and jamb visible, with a small calm
    // stone reveal. Glass and the actual navigation aperture are never covered.
    const apertures=openings.map(o=>({...o,u0:o.u0-.16,u1:o.u1+.16,lo:o.kind==='window'?o.lo-.21:o.lo,hi:o.hi+.29})).map(o=>({...o,polygon:rectangle(s0+o.u0-cornerInset,s0+o.u1-cornerInset,v0+o.lo,v0+o.hi)}));
    const crop=polygon=>{
      let pieces=[clipTilingPolygon(polygon,boundary)].filter(p=>p.length);
      for(const opening of apertures)pieces=pieces.flatMap(p=>subtractWell(p,opening.polygon));
      return pieces;
    };
    const cells=[];
    for(const cell of prepared){const box=cell.box;if(box[1]<s0||box[0]>s1||box[3]<v0||box[2]>v1)continue;const polygons=crop(cell.rhomb);if(!polygons.length)continue;
      cells.push({id:cell.id,kind:cell.kind,paired:cell.paired,rhomb:cell.rhomb,polygons,insetPolygons:grout===0?polygons:crop(cell.inset)});
    }
    const area=cells.reduce((sum,c)=>sum+c.polygons.reduce((n,p)=>n+tilingArea(p),0),0);
    const openingArea=apertures.reduce((sum,o)=>sum+tilingArea(clipTilingPolygon(o.polygon,boundary)),0);
    panels.push({id:`wall-${level}-${wall}`,level,wall,a,b,length,radius,offset,cornerInset,s0,s1,v0,v1,tangent:[dx,dz],inward:[-dz,dx],apertures,cells,area,expectedArea:length*height-openingArea});
  }
  return{pattern,panels,perimeter,length,offset,grout,area:panels.reduce((sum,p)=>sum+p.area,0),expectedArea:panels.reduce((sum,p)=>sum+p.expectedArea,0),credit:pattern==='penrose'?'Finite Robinson substitution, paired into true Penrose rhombs; one unfolded perimeter-height field with a deliberate closing corner seam.':'Exact '+pattern+' parent polygons in one unfolded perimeter-height field, with an honest framed closing seam.'};
}

export function houseWallPoint(panel,[s,v]) {
  const u=s-panel.s0+panel.cornerInset;
  return[125+panel.a[0]+panel.tangent[0]*u+panel.inward[0]*panel.offset,v-8,panel.a[1]+panel.tangent[1]*u+panel.inward[1]*panel.offset];
}

/** Fine rhomb inlays fit wholly within the448 shared-profile tread caps. */
export function createHouseStairTiling({grout=.025,pattern='penrose'}={}) {
  if(!Number.isFinite(grout)||grout<0||grout>.08)throw new RangeError('Invalid stair grout');
  const raw=pattern==='penrose'?createPenroseRhombPatch({depth:7,radius:20}):createSixfoldTilingPatch(pattern,{edge:.64,bounds:[-10,-10,10,10]}).cells;
  const parents=raw.filter(c=>c.paired).map(c=>({...c,inset:insetPolygon(c.rhomb,grout/2)}));
  const step=Math.PI/32,templates=[],polar=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];
  for(let i=0;i<64;i++){
    const a=i*step+.0045,b=(i+1)*step-.0045,cap=[polar(6.78,a),polar(9.62,a),polar(9.62,b),polar(6.78,b)],cells=[];
    for(const parent of parents){const piece=clipTilingPolygon(parent.inset,cap);if(piece.length)cells.push({id:parent.id,kind:parent.kind,piece});}
    templates.push({cap,cells});
  }
  const treads=Array.from({length:448},(_,i)=>{
    const edge=(i+1)*step,a=edge-.004,b=edge-.001;
    const theta=i*step;return{i,y:stairY(theta),nextY:stairY(edge),landing:houseLandingLevel(theta+step/2)!==null,capOffset:.022,...templates[i%64],nosing:[polar(6.68,a),polar(9.73,a),polar(9.73,b),polar(6.68,b)],riserAngle:edge+.001};
  });
  return{pattern,treads,grout,templateCount:64,innerRadius:6.78,outerRadius:9.62};
}

export function withoutHouseLanding(polygon){return subtractWell(polygon,rectangle(0,40,-HOUSE_JOIN.landingHalfWidth,HOUSE_JOIN.landingHalfWidth));}

/** The same large rhombs flow across the flat cap sectors and room threshold. */
export function createHouseLandingTiling(wellBoundary,{grout=.035,pattern='penrose'}={}){
 const raw=pattern==='penrose'?createPenroseRhombPatch():createSixfoldTilingPatch(pattern,{edge:2.5,bounds:[-25,-25,25,25]}).cells;
 const parents=raw.filter(c=>c.paired).map(c=>({...c,inset:insetPolygon(c.rhomb,grout/2)})),domains=[],p=(r,a)=>[r*Math.cos(a),r*Math.sin(a)],ri=HOUSE_JOIN.bridgeInner,half=HOUSE_JOIN.landingHalfAngle;
 for(let j=0;j<24;j++){const a=-half+j/24*2*half,b=-half+(j+1)/24*2*half;domains.push([p(HOUSE_JOIN.stairInner,a),p(ri,a),p(ri,b),p(HOUSE_JOIN.stairInner,b)]);}
 const outer=clipTilingPolygon(wellBoundary,rectangle(0,40,-HOUSE_JOIN.landingHalfWidth,HOUSE_JOIN.landingHalfWidth)),inner=Array.from({length:384},(_,i)=>p(ri,i*Math.PI/192));domains.push(...subtractWell(outer,inner));
 const cells=[];for(const cell of parents){const polygons=domains.map(d=>clipTilingPolygon(cell.inset,d)).filter(p=>p.length);if(polygons.length)cells.push({id:cell.id,kind:cell.kind,polygons});}
 const crown=parents.map(cell=>({...cell,polygon:clipTilingPolygon(cell.inset,wellBoundary)})).filter(c=>c.polygon.length);
 return{pattern,cells,crown,domains,grout};
}

/**
 * A Penrose rhomb floor cropped by a regular hexagon and a clear circular well.
 * wellRadius is the well polygon's APOTHEM: its 96 sides stay outside that
 * radius, so no returned tile edge crosses the actual circular shaft.
 * polygons cover the exact annulus; insetPolygons leave grout/2 at every
 * original rhomb edge. Fragment boundaries created by clipping get no grout.
 */
export function createHouseTiling({
  depth = 5, radius = 30, outerRadius = 22.7,
  wellRadius = 10.32, wellSides = 96, grout = 0.035,pattern='penrose'
} = {}) {
  for (const [name, value] of Object.entries({ radius, outerRadius, wellRadius, grout })) {
    if (!Number.isFinite(value) || value < 0 || (name !== 'grout' && value === 0)) throw new RangeError(`${name} must be finite and positive`);
  }
  if (!Number.isInteger(depth) || depth < 0 || depth > 5) throw new RangeError('depth must be an integer from 0 to 5');
  if (!Number.isInteger(wellSides) || wellSides < 12 || wellSides > 1024) throw new RangeError('wellSides must be an integer from 12 to 1024');
  if (wellRadius / Math.cos(Math.PI / wellSides) >= outerRadius * Math.cos(Math.PI / 6)) throw new RangeError('well must fit completely inside the hexagon');
  if (pattern==='penrose'&&radius * Math.cos(Math.PI / 10) < outerRadius) throw new RangeError('seed decagon must contain the outer hexagon');

  const outer = hexagon(outerRadius);
  const wellVertexRadius = wellRadius / Math.cos(Math.PI / wellSides);
  const well = Array.from({ length: wellSides }, (_, i) => {
    const angle = (i + .5) * Math.PI * 2 / wellSides;
    return [wellVertexRadius * Math.cos(angle), wellVertexRadius * Math.sin(angle)];
  });
  const parents=pattern==='penrose'?createPenroseRhombPatch({depth,radius}):createSixfoldTilingPatch(pattern,{edge:2.5,bounds:[-outerRadius,-outerRadius,outerRadius,outerRadius]}).cells;

  const cells = [];
  const crop = polygon => subtractWell(clipTilingPolygon(polygon, outer), well);
  for (const parent of parents) {
    const {id,kind,paired,rhomb,edges,triangleIds}=parent;
    const polygons = crop(rhomb);
    if (!polygons.length) continue;
    // At default depth/radius only paired rhombs reach the hexagon. A very
    // coarse user-selected seed may expose boundary half-rhombs honestly.
    const insetPolygons = grout === 0 ? polygons : crop(insetPolygon(rhomb, grout / 2));
    cells.push({
      id,kind,paired,triangleIds,
      rhomb, edges, polygons, insetPolygons,
      visibleEdges: edges.flatMap(([p, q]) => visibleEdge(p, q, outer, well))
    });
  }
  const sumArea = key => cells.reduce((sum, cell) => sum + cell[key].reduce((n, polygon) => n + tilingArea(polygon), 0), 0);
  return {
    pattern,cells, outer, well, depth, radius, outerRadius, wellRadius, wellSides, grout,
    area: sumArea('polygons'), insetArea: sumArea('insetPolygons'),
    expectedArea: tilingArea(outer) - tilingArea(well),
    counts: { thin: cells.filter(c => c.kind === 0).length, thick: cells.filter(c => c.kind === 1).length, boundaryHalves: cells.filter(c => !c.paired).length }
  };
}
