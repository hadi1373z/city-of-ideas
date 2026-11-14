import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildGalleryLiftAuditFixture} from './gallery-lift-landings.mjs';

export function measureGalleryCeilingBearings(T, root) {
  const check = (v, message) => { if (!v) throw Error(message); };
  const near = (a, b, epsilon = 2e-6) => Math.abs(a - b) < epsilon;
  root.updateWorldMatrix(true, true);
  const columns = root.children.filter(o => o.isInstancedMesh && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.radiusTop === .24 && o.geometry.parameters.radiusBottom === .28 && o.geometry.parameters.height === 7.3);
  const spokes = root.children.filter(o => o.isInstancedMesh && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.radiusTop === .07 && o.geometry.parameters.radiusBottom === .07 && o.geometry.parameters.height === 1);
  const floors = root.children.filter(o => o.isMesh && o.geometry.type === 'ExtrudeGeometry' && o.userData.cityDestination === 'gallery');
  check(columns.length === 1 && columns[0].count === 174 && spokes.length === 1 && spokes[0].count === 164 && floors.length === 10, 'Exact original column, spoke and floor owners required');
  const triangles = (o, matrix = o.matrixWorld) => {
    const p = o.geometry.attributes.position, ix = o.geometry.index;
    return Array.from({length: (ix?.count || p.count) / 3}, (_, i) => [0, 1, 2].map(j => new T.Vector3().fromBufferAttribute(p, ix ? ix.getX(i * 3 + j) : i * 3 + j).applyMatrix4(matrix)));
  };
  const flat = (ts, y) => ts.filter(t => t.every(p => near(p.y, y, 1e-7)));
  const vertices = ts => [...new Map(ts.flat().map(p => [p.toArray().map(v => v.toFixed(9)).join(','), p])).values()];
  const matrixAt = (batch, id) => { const m = new T.Matrix4(); batch.getMatrixAt(id, m); return m.premultiply(batch.matrixWorld); };
  const records = batch => Array.from({length: batch.count}, (_, id) => {
    const matrix = matrixAt(batch, id), ts = triangles(batch, matrix), ps = vertices(ts), centre = new T.Vector3().setFromMatrixPosition(matrix);
    return {id, matrix, ts, ps, centre, minY: Math.min(...ps.map(p => p.y)), maxY: Math.max(...ps.map(p => p.y))};
  });
  const cs = records(columns[0]), ss = records(spokes[0]);
  const decks = Array.from({length: 5}, (_, floor) => {
    const body = floors.find(o => near(new T.Box3().setFromObject(o).min.y, floor * 8) && near(o.geometry.parameters.options.depth, .35));
    const cap = floors.find(o => near(new T.Box3().setFromObject(o).min.y, floor * 8 + .37));
    check(body && cap, 'Actual original floor body/cap required');
    const ts = triangles(body), box = new T.Box3().setFromObject(body);
    const capBox = new T.Box3().setFromObject(cap);
    return {body, cap, capBox, capTop: flat(triangles(cap), capBox.max.y), ts, under: flat(ts, box.min.y), top: flat(ts, box.max.y), minY: box.min.y, maxY: box.max.y};
  });
  const area = poly => poly.reduce((sum, p, i) => { const q = poly[(i + 1) % poly.length]; return sum + p.x * q.z - q.x * p.z; }, 0) / 2;
  const clip = (subject, boundary) => {
    let out = subject;
    const sign = Math.sign(area(boundary));
    for (let i = 0; i < boundary.length && out.length; i++) {
      const a = boundary[i], b = boundary[(i + 1) % boundary.length], distance = p => sign * ((b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)), input = out;
      out = []; let p = input.at(-1), dp = distance(p);
      for (const q of input) {
        const dq = distance(q);
        if ((dp >= -1e-11) !== (dq >= -1e-11)) { const u = dp / (dp - dq); out.push({x: p.x + (q.x - p.x) * u, z: p.z + (q.z - p.z) * u}); }
        if (dq >= -1e-11) out.push(q); p = q; dp = dq;
      }
    }
    return out;
  };
  const coverage = (subject, target) => {
    let total = 0, covered = 0;
    for (const tri of subject) {
      total += Math.abs(area(tri));
      const x0 = Math.min(...tri.map(p => p.x)), x1 = Math.max(...tri.map(p => p.x)), z0 = Math.min(...tri.map(p => p.z)), z1 = Math.max(...tri.map(p => p.z));
      for (const t of target) {
        if (Math.max(...t.map(p => p.x)) < x0 || Math.min(...t.map(p => p.x)) > x1 || Math.max(...t.map(p => p.z)) < z0 || Math.min(...t.map(p => p.z)) > z1) continue;
        covered += Math.abs(area(clip(tri, t)));
      }
    }
    return covered / total;
  };
  const verticalHit = (ts, x, z, y, direction) => {
    const ray = new T.Ray(new T.Vector3(x, y, z), new T.Vector3(0, direction, 0));
    const hits = ts.map(t => ray.intersectTriangle(...t, false, new T.Vector3())).filter(Boolean);
    check(hits.length, 'Actual triangle surface ray must hit');
    return hits.sort((a, b) => direction > 0 ? a.y - b.y : b.y - a.y)[0];
  };
  const contains = (record, point) => record.ts.every(t => {
    const plane = new T.Plane().setFromCoplanarPoints(...t);
    if (plane.distanceToPoint(record.centre) > 0) plane.negate();
    return plane.distanceToPoint(point) <= 1e-7;
  });
  const cube = p => [-.001, .001].flatMap(x => [-.001, .001].flatMap(y => [-.001, .001].map(z => p.clone().add(new T.Vector3(x, y, z)))));
  const columnResults = [], spokeResults = [], ranges = values => ({min: Math.min(...values), max: Math.max(...values)});
  let topRays = 0, footRays = 0, capVertices = 0, rootCoreVertices = 0, facetRays = 0, projectedMinMargin = Infinity, minBodyClearance = Infinity;
  for (const c of cs) {
    const floor = Math.round((c.centre.y - 4) / 8), deck = decks[floor], above = decks[floor + 1], upper = flat(c.ts, c.maxY), lower = flat(c.ts, c.minY);
    check(upper.length === 12 && lower.length === 12, 'Actual twelve-facet column caps');
    const topCoverage = coverage(upper, above.under), footCoverage = coverage(lower, deck.top);
    check(Math.abs(topCoverage - 1) < 1e-8 && Math.abs(footCoverage - 1) < 1e-8, 'Whole cap projections remain inside actual floor triangles');
    const gaps = vertices(upper).map(p => { topRays++; return verticalHit(above.under, p.x, p.z, c.maxY, 1).y - p.y; });
    const footDifferences = vertices(lower).map(p => { footRays++; return p.y - verticalHit(deck.top, p.x, p.z, c.minY + .01, -1).y; });
    check(gaps.every(g => g > .34999 && g < .35001), 'Retained column/slab gap, not a bearing');
    check(footDifferences.every(g => Math.abs(g) < 1e-6), 'Retained floor-body foot contact');
    const core = new T.Vector3(c.centre.x, floor * 8 + .3825, c.centre.z);
    for (const p of cube(core)) { check(contains(c, p) && deck.capBox.containsPoint(p) && near(verticalHit(deck.capTop, p.x, p.z, p.y, 1).y, deck.capBox.max.y), 'Positive column/finish embed against actual cap triangles'); rootCoreVertices++; }
    const outline = vertices(lower).filter(p => Math.hypot(p.x - c.centre.x, p.z - c.centre.z) > .1).sort((a, b) => Math.atan2(a.z - c.centre.z, a.x - c.centre.x) - Math.atan2(b.z - c.centre.z, b.x - c.centre.x));
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], dx = b.x - a.x, dz = b.z - a.z, u = Math.max(0, Math.min(1, -(a.x * dx + a.z * dz) / (dx * dx + dz * dz)));
      projectedMinMargin = Math.min(projectedMinMargin, Math.hypot(a.x + u * dx, a.z + u * dz) - 56.3);
    }
    columnResults.push({id: c.id, floor, topY: c.maxY, gap: ranges(gaps), topProjectedCoverage: topCoverage, footProjectedCoverage: footCoverage, footPlaneDifference: ranges(footDifferences)});
  }
  for (const s of ss) {
    const floor = Math.round((s.centre.y - 7.18) / 8), above = decks[floor + 1], ends = [-.5, .5].map(y => new T.Vector3(0, y, 0).applyMatrix4(s.matrix)).sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z)), inner = ends[0], outer = ends[1], axis = outer.clone().sub(inner).normalize(), lateral = new T.Vector3(-axis.z, 0, axis.x), span = inner.distanceTo(outer);
    const match = cs.find(c => Math.round((c.centre.y - 4) / 8) === floor && Math.hypot(c.centre.x - outer.x, c.centre.z - outer.z) < .00002);
    if (match) {
      const cap = s.ps.filter(p => Math.abs(p.clone().sub(outer).dot(axis)) < 1e-6);
      check(cap.length === 11 && cap.every(p => contains(match, p)), 'Whole original outer spoke cap inside its matching column');
      capVertices += cap.length;
      for (const p of cube(outer.clone().addScaledVector(axis, -.01))) { check(contains(s, p) && contains(match, p), 'Positive outer spoke/column joint'); rootCoreVertices++; }
    }
    const gaps = [];
    for (const station of [.1, span / 2, span - .1]) for (const offset of [-.035, 0, .035]) {
      const p = inner.clone().addScaledVector(axis, station).addScaledVector(lateral, offset), slab = verticalHit(above.under, p.x, p.z, s.centre.y + .2, 1), face = verticalHit(s.ts, p.x, p.z, slab.y - .001, -1), gap = slab.y - face.y;
      check(gap > .74 && gap < .79, 'Retained spoke/slab gap, not a bearing');
      gaps.push(gap); facetRays++;
    }
    minBodyClearance = Math.min(minBodyClearance, s.minY - (floor * 8 + .395 + 2.1));
    spokeResults.push({id: s.id, floor, matchingColumn: match?.id ?? null, outer: outer.toArray(), upperFaceGap: ranges(gaps)});
  }
  const missing = spokeResults.filter(s => s.matchingColumn === null);
  check(missing.length === 1 && missing[0].floor === 0 && missing[0].id === 30, 'Retained ground doorway-side spoke has no matching outer column');
  check(projectedMinMargin > .7199 && minBodyClearance > 4.61, 'Original radial and overhead separation remain');
  return {scopeMeshes: 12, scopeInstances: 338, columns: 174, spokes: 164, perFloor: [0, 1, 2, 3].map(floor => ({floor, columns: columnResults.filter(c => c.floor === floor).length, spokes: spokeResults.filter(s => s.floor === floor).length})), topRays, footRays, columnCapTriangles: 174 * 12, columnGap: ranges(columnResults.flatMap(c => [c.gap.min, c.gap.max])), wholeCapProjectionMaxError: Math.max(...columnResults.flatMap(c => [Math.abs(c.topProjectedCoverage - 1), Math.abs(c.footProjectedCoverage - 1)])), facetRays, spokeGap: ranges(spokeResults.flatMap(s => [s.upperFaceGap.min, s.upperFaceGap.max])), outerCapColumnJoints: 163, capVertices, positiveRootCores: 174 + 163, rootCoreVertices, missingOuterColumn: missing, projectedMinMargin, minBodyClearance, columnResults, spokeResults, newGeometryOrState: 0, repairedBearingClaim: false, capacityClaim: false};
}

export async function auditGalleryCeilingBearings(T) {
  const f = await buildGalleryLiftAuditFixture(T);
  const scope = f.scene.children.filter(o => o.isMesh && (o.geometry.type === 'ExtrudeGeometry' && o.userData.cityDestination === 'gallery' || o.isInstancedMesh && o.geometry.type === 'CylinderGeometry' && (o.geometry.parameters.height === 7.3 || o.geometry.parameters.radiusTop === .07)));
  const snapshot = () => createHash('sha256').update(JSON.stringify(scope.map(o => ({
    name: o.name, matrix: o.matrix.toArray(), world: o.matrixWorld.toArray(), index: o.geometry.index ? Array.from(o.geometry.index.array) : null,
    attributes: Object.fromEntries(Object.entries(o.geometry.attributes).map(([k, a]) => [k, Array.from(a.array)])),
    instances: o.isInstancedMesh ? Array.from(o.instanceMatrix.array) : null
  })))).digest('hex');
  const before = snapshot(), globals = ['document', 'localStorage', 'sessionStorage', 'fetch'].map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]), locked = {...T};
  assert.equal(scope.length, 12);
  assert.equal(before, '6dc4df6f5e051fd77905fe1f3a83584b3a559523c32d10c87f483b9209b1a737', 'All original column/spoke/floor profiles and instance IDs stay exact');
  for (const k of Object.keys(T)) if (/Geometry$|Material$|Texture$|Light$/.test(k) || k === 'InstancedMesh') locked[k] = class { constructor() { throw Error('New render resource ' + k); } };
  let result;
  try {
    for (const [k] of globals) Object.defineProperty(globalThis, k, {configurable: true, get() { throw Error('Private/DOM access ' + k); }});
    result = measureGalleryCeilingBearings(locked, f.scene);
    assert.equal(snapshot(), before, 'Every original profile, ID and matrix remains exact');
  } finally {
    for (const [k, descriptor] of globals) if (descriptor) Object.defineProperty(globalThis, k, descriptor); else delete globalThis[k];
    const geometry = new Set(), material = new Set(), buffers = new Set();
    f.scene.traverse(o => { if (!o.isMesh) return; geometry.add(o.geometry); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => material.add(m)); if (o.isInstancedMesh) buffers.add(o); });
    geometry.forEach(g => g.dispose()); material.forEach(m => m.dispose()); buffers.forEach(m => m.dispose());
  }
  return {...result, sourceScopeHash: before, privateAndResourceDenied: true};
}
