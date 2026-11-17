import assert from 'node:assert/strict';
import { createHouseTiling, createHouseWallTiling, createHouseStairTiling, houseWallPoint, tilingArea, clipTilingPolygon } from '../src/house-tiling-model.js';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import { buildHouseTiling } from '../src/house-tiling-scene.js';
import {stairY} from '../src/transformation-house-model.js';

const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) <= tolerance, `${a} should equal ${b}`);
const side = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
const minRadius = (a, b) => {
  const dx = b[0] - a[0], dz = b[1] - a[1], d = dx * dx + dz * dz;
  const t = d ? Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dz) / d)) : 0;
  return Math.hypot(a[0] + t * dx, a[1] + t * dz);
};
const box = polygon => [Math.min(...polygon.map(p => p[0])), Math.min(...polygon.map(p => p[1])), Math.max(...polygon.map(p => p[0])), Math.max(...polygon.map(p => p[1]))];
const boxesOverlap = (a, b) => a[0] < b[2] - 1e-8 && b[0] < a[2] - 1e-8 && a[1] < b[3] - 1e-8 && b[1] < a[3] - 1e-8;

const model = createHouseTiling();
assert.deepEqual(model, createHouseTiling(), 'Stable tile ids, ordering and coordinates');
assert.ok(model.cells.length > 200);
assert.ok(model.counts.thin > 0 && model.counts.thick > 0);
assert.equal(model.counts.boundaryHalves, 0, 'Every visible default tile is a complete parent rhomb');
const hexArea = 3 * Math.sqrt(3) * model.outerRadius ** 2 / 2;
const holeArea = model.wellSides * model.wellRadius ** 2 * Math.tan(Math.PI / model.wellSides);
close(model.expectedArea, hexArea - holeArea);
close(model.area, model.expectedArea, 1e-7);
assert.ok(model.insetArea < model.area - 5, 'Thin grout removes real area along tile edges');
assert.ok(model.insetArea > model.area * .95, 'Grout remains a small part of the floor');

const allPolygons = [];
for (const cell of model.cells) {
  assert.equal(cell.rhomb.length, 4);
  assert.equal(cell.triangleIds.length, 2);
  assert.equal(cell.edges.length, 4);
  const lengths = cell.edges.map(([a, b]) => Math.hypot(a[0] - b[0], a[1] - b[1]));
  for (const length of lengths) close(length, lengths[0]);
  const angles = cell.rhomb.map((b, i, r) => {
    const a = r[(i + 3) % 4], c = r[(i + 1) % 4];
    return Math.acos(Math.max(-1, Math.min(1, ((a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1])) / lengths[0] ** 2))) * 180 / Math.PI;
  }).sort((a, b) => a - b);
  close(angles[0], cell.kind === 0 ? 36 : 72);
  close(angles[0], angles[1]); close(angles[2], 180 - angles[0]); close(angles[2], angles[3]);
  for (const key of ['polygons', 'insetPolygons']) for (const polygon of cell[key]) {
    assert.ok(polygon.length >= 3 && tilingArea(polygon) > 0);
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i], q = polygon[(i + 1) % polygon.length];
      assert.ok(p.every(Number.isFinite), 'Finite point coordinates');
      for (let j = 0; j < model.outer.length; j++) assert.ok(side(model.outer[j], model.outer[(j + 1) % model.outer.length], p) >= -1e-7, 'Inside hexagon');
      assert.ok(minRadius(p, q) >= model.wellRadius - 1e-8, 'Entire edge stays outside the circular shaft');
    }
    // The well's centre is never inside any convex fragment, even if all
    // fragment vertices happen to lie outside the hole.
    assert.ok(polygon.some((a, i) => side(a, polygon[(i + 1) % polygon.length], [0, 0]) < -1e-8));
    if (key === 'polygons') allPolygons.push({ id: cell.id, polygon, box: box(polygon) });
    if (key === 'insetPolygons') close(tilingArea(clipTilingPolygon(polygon, cell.rhomb)), tilingArea(polygon));
  }
  for (const [a, b] of cell.visibleEdges) {
    assert.ok(minRadius(a, b) >= model.wellRadius - 1e-8, 'Visible outlines never cross the well');
    for (const p of [a, b]) for (let i = 0; i < model.outer.length; i++) assert.ok(side(model.outer[i], model.outer[(i + 1) % model.outer.length], p) >= -1e-7);
  }
}

// Check actual polygon intersections, including disjoint subtraction fragments
// of the same rhomb; area equality alone would not catch overlapping pieces.
let intersectionChecks = 0;
for (let i = 0; i < allPolygons.length; i++) for (let j = i + 1; j < allPolygons.length; j++) {
  const a = allPolygons[i], b = allPolygons[j];
  if (!boxesOverlap(a.box, b.box)) continue;
  intersectionChecks++;
  const overlap = tilingArea(clipTilingPolygon(a.polygon, b.polygon));
  assert.ok(overlap < 1e-8, `Overlapping floor pieces ${a.id}/${b.id}: ${overlap}`);
}
assert.ok(intersectionChecks > 0);
close(createHouseTiling({ grout: 0 }).insetArea, model.area);
// An alternate depth still partitions the annulus; any seed boundary halves
// are reported as halves instead of being passed off as rhombs.
const coarse = createHouseTiling({ depth: 3, grout: .025 });
close(coarse.area, coarse.expectedArea, 1e-7);
for (const options of [{ depth: 6 }, { radius: 20 }, { grout: -1 }, { wellRadius: 22 }, { wellSides: 3 }, { outerRadius: Infinity }]) assert.throws(() => createHouseTiling(options), RangeError);
console.log(`House tiling: ${model.cells.length} true rhombs, ${allPolygons.length} convex floor fragments, ${intersectionChecks} overlap checks; annulus area ${model.area.toFixed(6)}. All checks passed.`);

const wallModel=createHouseWallTiling();assert.equal(wallModel.panels.length,48);close(wallModel.area,wallModel.expectedArea,1e-7);
let wallPieces=0,wallOverlapChecks=0;
for(const panel of wallModel.panels){
  close(panel.area,panel.expectedArea,1e-7);assert.ok(panel.cells.length>30,'Every wall is developed');
  const pieces=[];
  for(const cell of panel.cells){
    assert.equal(cell.paired,true,'Wall fragments originate in full rhombs');assert.equal(cell.rhomb.length,4);
    for(let i=1;i<4;i++)close(Math.hypot(cell.rhomb[i][0]-cell.rhomb[(i+1)%4][0],cell.rhomb[i][1]-cell.rhomb[(i+1)%4][1]),Math.hypot(cell.rhomb[0][0]-cell.rhomb[1][0],cell.rhomb[0][1]-cell.rhomb[1][1]));
    for(const polygon of cell.polygons){pieces.push({polygon,box:box(polygon)});wallPieces++;}
    for(const polygon of cell.insetPolygons){
      for(const p of polygon){assert.ok(p.every(Number.isFinite));assert.ok(p[0]>=panel.s0-1e-8&&p[0]<=panel.s1+1e-8&&p[1]>=panel.v0-1e-8&&p[1]<=panel.v1+1e-8);const world=houseWallPoint(panel,p);assert.ok(world.every(Number.isFinite));const u=p[0]-panel.s0+panel.cornerInset;close((world[0]-125-panel.a[0]-panel.tangent[0]*u)*panel.inward[0]+(world[2]-panel.a[1]-panel.tangent[1]*u)*panel.inward[1],.365);}
      for(const opening of panel.apertures)assert.ok(Math.abs(tilingArea(clipTilingPolygon(polygon,opening.polygon)))<1e-8,'No rhomb covers a door, window, sill or frame');
    }
  }
  for(let i=0;i<pieces.length;i++)for(let j=i+1;j<pieces.length;j++)if(boxesOverlap(pieces[i].box,pieces[j].box)){wallOverlapChecks++;assert.ok(Math.abs(tilingArea(clipTilingPolygon(pieces[i].polygon,pieces[j].polygon)))<1e-8,'Wall rhombs do not overlap');}
}
for(let wall=0;wall<6;wall++){
  const a=wallModel.panels.find(p=>p.level===0&&p.wall===wall),b=wallModel.panels.find(p=>p.level===0&&p.wall===(wall+1)%6);
  const p=houseWallPoint(a,[a.s1,11]),q=houseWallPoint(b,[b.s0,11]);p.forEach((v,i)=>close(v,q[i]));
  if(wall<5){const ids=new Set(a.cells.map(c=>c.id));assert.ok(b.cells.some(c=>ids.has(c.id)),'Original parent rhombs fold across adjacent wall corners');}
}
for(const level of[16,8,0,-8,-16,-24,-32]){
  const upper=wallModel.panels.find(p=>p.level===level&&p.wall===0),lower=wallModel.panels.find(p=>p.level===level-8&&p.wall===0),height=upper.v0;
  const atBoundary=panel=>new Map(panel.cells.filter(c=>
    Math.min(...c.rhomb.map(p=>p[1]))<height-1e-7&&Math.max(...c.rhomb.map(p=>p[1]))>height+1e-7&&
    c.polygons.some(p=>p.some(q=>Math.abs(q[1]-height)<1e-8))
  ).map(c=>[c.id,c]));
  const a=atBoundary(upper),b=atBoundary(lower);assert.ok(a.size>4);
  assert.deepEqual([...a.keys()].sort(),[...b.keys()].sort(),'Storeys use the same parent rhombs at their common boundary');
  for(const[id,cell]of a)assert.deepEqual(cell.rhomb,b.get(id).rhomb);
  const p=houseWallPoint(upper,[upper.s0+3,height]),q=houseWallPoint(lower,[lower.s0+3,height]);p.forEach((v,i)=>close(v,q[i]));
}
const tiled=buildHouseTiling(T);assert.equal(tiled.floors.length,8);assert.equal(tiled.ceilings.length,8);assert.equal(tiled.borders.length,8);assert.equal(tiled.walls.length,1);assert.equal(tiled.wallJoints.length,1);assert.equal(tiled.walls[0].userData.houseWallTiling.panels,48);
const stairModel=createHouseStairTiling();assert.equal(stairModel.treads.length,448);assert.equal(tiled.stairs.length,1);
for(const tread of stairModel.treads){close(tread.y,stairY(tread.i*Math.PI/32));close(tread.capOffset,.022);assert.ok(tread.cells.length>3,'Fine rhomb mosaic develops every tread');for(const cell of tread.cells)for(const p of cell.piece){assert.ok(p.every(Number.isFinite));assert.ok(Math.hypot(...p)>6.7&&Math.hypot(...p)<9.63,'Tread inlay stays inside the original cap');assert.ok(Math.abs(tilingArea(clipTilingPolygon(cell.piece,tread.cap)))-tilingArea(cell.piece)<1e-8);}for(const p of tread.nosing)assert.ok(Math.hypot(...p)>6.6&&Math.hypot(...p)<9.8,'Polished nosing stays clear of the handrails');}
for(const mesh of tiled.floors)assert.ok(mesh.geometry.attributes.normal.array.every((v,i)=>i%3!==1||v>.99));
for(const mesh of tiled.ceilings)assert.ok(mesh.geometry.attributes.normal.array.every((v,i)=>i%3!==1||v<-.8),'Every vault face points down into the room');
const wallMesh=tiled.walls[0],wp=wallMesh.geometry.attributes.position,wn=wallMesh.geometry.attributes.normal;
for(let i=0;i<wp.count;i++){const x=wp.getX(i)-125,z=wp.getZ(i),r=Math.hypot(x,z);assert.ok((wn.getX(i)*-x+wn.getZ(i)*-z)/r>.86,'All wall rhomb faces look into the house');nearZero(wn.getY(i));}
function nearZero(value){assert.ok(Math.abs(value)<1e-6);}
wallMesh.updateMatrixWorld(true);
const rayAt=(panel,u,localY)=>{const point=houseWallPoint(panel,[panel.s0+u-panel.cornerInset,panel.v0+localY]),normal=new T.Vector3(panel.inward[0],0,panel.inward[1]);return new T.Raycaster(new T.Vector3(...point).add(normal),normal.negate(),0,2).intersectObject(wallMesh);};
for(const panel of wallModel.panels){assert.ok(rayAt(panel,11.5,6.5).length,'Solid wall above the apertures is tiled');if(panel.level>=0)for(const u of[5.5,17.5])assert.equal(rayAt(panel,u,3).length,0,'Window and glass stay visible');if(panel.level===0&&panel.wall===1)assert.equal(rayAt(panel,11.5,2).length,0,'Ground entrance remains open');if(panel.level===-40&&(panel.wall===2||panel.wall===3))assert.equal(rayAt(panel,panel.wall===2?21.5:1.5,2).length,0,'Both halves of the deep corner doorway remain open');}
let tileDraws=0;tiled.group.traverse(o=>{if(o.isMesh){tileDraws++;for(const a of Object.values(o.geometry.attributes))assert.ok(a.array.every(Number.isFinite));}});assert.equal(tileDraws,29,'Walls, stair finishes, connected landings and the complete crown stay batched');
tiled.dispose();console.log(`House finishes:48 folded rhomb walls,${wallOverlapChecks} overlap checks,448 inlaid treads,flush landings and tiled crown;clear apertures,inward normals and29 batched finish meshes.`);
