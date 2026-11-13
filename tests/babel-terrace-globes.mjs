import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL, stairs, surfaceAt} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';

const near = (a, b, e = 2e-5) => assert(Math.abs(a - b) < e, a + ' != ' + b);
const visible = o => {
  for (let p = o; p; p = p.parent) if (!p.visible) return false;
  return true;
};

// An audit, including two existing failures, rather than a fixture-clearance claim.
export function validateBabelTerraceGlobes(T) {
  const resources = new Map(), buffers = new Map(), G = {...T};
  for (const key of Object.keys(T)) {
    if (!/Geometry$|Material$|Texture$/.test(key) || typeof T[key] !== 'function') continue;
    G[key] = class extends T[key] {
      constructor(...args) {
        super(...args);
        resources.set(this, 0);
        this.addEventListener('dispose', () => resources.set(this, resources.get(this) + 1));
      }
    };
  }
  G.InstancedMesh = class extends T.InstancedMesh {
    constructor(...args) {
      super(...args);
      buffers.set(this, 0);
      this.addEventListener('dispose', () => buffers.set(this, buffers.get(this) + 1));
    }
  };
  const drawing = new T.Texture();
  let borrowed = 0;
  drawing.addEventListener('dispose', () => borrowed++);
  const b = buildBabelLibrary(G, {
    canvas: () => ({getContext: () => new Proxy({}, {get: () => () => {}})}),
    drawing
  });
  const root = b.group, scene = new T.Scene(), nodes = [], targets = [...b.targets];
  scene.add(root);
  root.traverse(o => nodes.push(o));
  const raw = babelGuardSnapshot(T, root);
  assert.deepEqual(raw, {
    hash: '7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66',
    meshes: 65, instances: 41893
  });
  const rawTimber = root.children.find(o => o.isInstancedMesh &&
    o.geometry.type === 'BoxGeometry' && o.material.color?.getHex() === 0x765238);
  const rawBrass = root.children.find(o => o.isInstancedMesh &&
    o.geometry.type === 'BoxGeometry' && o.material.color?.getHex() === 0xa58b56);
  const rawMounts = [];
  for (const [globeId, stemId, levelId] of [[17, 1966, 2], [26, 1975, 4]]) {
    const stemMatrix = new T.Matrix4();
    rawBrass.getMatrixAt(stemId, stemMatrix);
    const centre = new T.Vector3().setFromMatrixPosition(stemMatrix), seats = [];
    for (let id = 0; id < rawTimber.count; id++) {
      const m = new T.Matrix4(), size = new T.Vector3(), p = new T.Vector3();
      rawTimber.getMatrixAt(id, m);
      m.decompose(p, new T.Quaternion(), size);
      if (Math.abs(size.y - .11) > 1e-5 || Math.abs(size.z - 1) > 1e-5 ||
          Math.abs(p.y - BABEL.levels[levelId].y - 3.57) > 1e-5) continue;
      const local = centre.clone().setY(p.y).applyMatrix4(m.clone().invert());
      if (Math.abs(local.x) < .5 && Math.abs(local.z) < .5) seats.push(id);
    }
    assert.deepEqual(seats, globeId === 17 ? [2739] : []);
    for (const dx of [-.03, 0, .03]) for (const dz of [-.03, 0, .03]) {
      const hits = new T.Raycaster(new T.Vector3(centre.x + dx,
        BABEL.levels[levelId].y + 3.64, centre.z + dz), new T.Vector3(0, -1, 0), 0, .15)
        .intersectObject(rawTimber, false);
      if (globeId === 17) assert(hits.some(h => h.instanceId === 2739));
      else assert.equal(hits.length, 0);
    }
    rawMounts.push({globe: globeId, stemId, shelfId: seats[0] ?? null, footprintRays: 9});
  }
  const adapters = [
    fitBabelRadialMouths(G, b), mountBabelSpokes(G, b), fitBabelPerimeter(G, b),
    fitBabelEntryReveals(G, b), seatBabelEntryLamps(G, b)
  ];
  b.lamps.visible = true;
  root.updateMatrixWorld(true);
  const display = [];
  root.traverse(o => { if (o.isMesh && visible(o)) display.push(o); });
  const snapshot = list => babelGuardSnapshot(T, {
    updateMatrixWorld: () => root.updateMatrixWorld(true),
    traverse: fn => list.forEach(fn)
  });
  const installed = snapshot(display);
  assert.deepEqual(installed, {
    hash: '00134a70d3f15c950cdec2935c0d59f8cc412fff4786f77cabe7e7b45754bbb1',
    meshes: 68, instances: 41925
  });

  const lightRecords = () => b.lamps.children.filter(o => o.isLight).map(o => ({
    type: o.type, position: o.position.toArray(), color: o.color.getHex(),
    intensity: o.intensity, distance: o.distance ?? null, decay: o.decay ?? null
  }));
  const lights = lightRecords();
  assert.deepEqual(lights, [
    {type: 'AmbientLight', position: [0, 0, 0], color: 0xe4cfac, intensity: .8, distance: null, decay: null},
    ...[[0, -9, 0], [30, -5, -20], [-25, -17, 20]].map(position => ({
      type: 'PointLight', position, color: 0xffcf88, intensity: 55, distance: 100, decay: 1.7
    }))
  ]);
  const rows = [];
  for (const source of root.children.filter(o => o.isInstancedMesh && o.geometry.type === 'BoxGeometry')) {
    const owner = adapters[0].bindings.find(v => v.source === source)?.clone || source;
    for (let id = 0; id < owner.count; id++) {
      const m = new T.Matrix4(), p = new T.Vector3(), size = new T.Vector3();
      owner.getMatrixAt(id, m);
      m.premultiply(owner.matrixWorld);
      m.decompose(p, new T.Quaternion(), size);
      rows.push({source, owner, id, m, p, size, color: owner.material.color?.getHex()});
    }
  }
  const same = (a, b) => Math.abs(a - b) < 2e-4;
  const stems = rows.filter(r => r.color === 0xa58b56 &&
    r.size.toArray().every((v, i) => same(v, [.06, .8, .06][i])));
  const shelves = rows.filter(r => r.color === 0x765238 && same(r.size.y, .11) && same(r.size.z, 1));
  const globes = display.filter(o => o.isInstancedMesh && o.geometry.type === 'SphereGeometry' && o.count === 30);
  assert.equal(stems.length, 30);
  assert.equal(globes.length, 1);
  const globe = globes[0];
  assert.equal(globe.geometry.parameters.radius, .18);
  assert.equal(globe.geometry.parameters.widthSegments, 8);
  assert.equal(globe.geometry.parameters.heightSegments, 6);
  const inside = (m, point) => point.clone().applyMatrix4(m.clone().invert())
    .toArray().every(v => Math.abs(v) <= .50001);
  const spherePlanes = [];
  const pos = globe.geometry.attributes.position, index = globe.geometry.index;
  for (let i = 0; i < index.count; i += 3) {
    const vertices = [0, 1, 2].map(j => new T.Vector3().fromBufferAttribute(pos, index.getX(i + j)));
    const plane = new T.Plane().setFromCoplanarPoints(...vertices);
    if (plane.normal.lengthSq() < .5) continue;
    if (plane.distanceToPoint(new T.Vector3()) > 0) plane.negate();
    spherePlanes.push(plane);
  }
  const inSphere = (m, point) => {
    const p = point.clone().applyMatrix4(m.clone().invert());
    assert(spherePlanes.every(plane => plane.distanceToPoint(p) < 2e-7),
      'Contact must be inside the original faceted sphere, not an ideal radius');
  };
  let sphereCoreVertices = 0, sphereCapVertices = 0, shelfCoreVertices = 0;
  let shelfFaceRays = 0, missingShelfRays = 0, incomingFloorRays = 0, existingBodyHits = 0;
  const records = [];
  for (let i = 0; i < 30; i++) {
    const level = BABEL.levels[Math.floor(i / 6)], gm = new T.Matrix4();
    globe.getMatrixAt(i, gm);
    gm.premultiply(globe.matrixWorld);
    const centre = new T.Vector3().setFromMatrixPosition(gm);
    const matches = stems.filter(r => Math.hypot(r.p.x - centre.x, r.p.z - centre.z) < 2e-4);
    assert.equal(matches.length, 1);
    const stem = matches[0], original = new T.Matrix4();
    assert.notEqual(stem.owner, stem.source, 'Follow the real fitted display copy');
    stem.source.getMatrixAt(stem.id, original);
    original.premultiply(stem.source.matrixWorld);
    assert.deepEqual(stem.m.toArray(), original.toArray());
    assert.equal(stem.id, 1949 + i);
    near(centre.y, level.y + 4.32);
    near(stem.p.y, level.y + 3.8);
    const foot = stem.p.y - stem.size.y / 2, top = stem.p.y + stem.size.y / 2;
    const sphereBottom = new T.Box3().setFromBufferAttribute(pos).applyMatrix4(gm).min.y;
    near(top - sphereBottom, .06);
    for (const x of [-.5, .5]) for (const z of [-.5, .5]) {
      inSphere(gm, new T.Vector3(x, .5, z).applyMatrix4(stem.m));
      sphereCapVertices++;
    }
    for (const x of [-.012, .012]) for (const y of [-.005, .005]) for (const z of [-.012, .012]) {
      const p = stem.p.clone().setY(top - .01).add(new T.Vector3(x, y, z));
      assert(inside(stem.m, p));
      inSphere(gm, p);
      sphereCoreVertices++;
    }
    const seats = shelves.filter(r => same(r.p.y, level.y + 3.57) &&
      inside(r.m, stem.p.clone().setY(r.p.y)));
    assert.equal(seats.length, [17, 26].includes(i) ? 0 : 1);
    const shelf = seats[0], shelfCandidates = shelves.filter(r => same(r.p.y, level.y + 3.57));
    for (const dx of [-.03, 0, .03]) for (const dz of [-.03, 0, .03]) {
      const ray = new T.Raycaster(new T.Vector3(centre.x + dx, level.y + 3.64, centre.z + dz),
        new T.Vector3(0, -1, 0), 0, .15);
      const hits = ray.intersectObjects([...new Set(shelfCandidates.map(r => r.owner))], false)
        .filter(h => shelfCandidates.some(r => r.owner === h.object && r.id === h.instanceId));
      if (shelf) {
        assert(hits.some(h => h.object === shelf.owner && h.instanceId === shelf.id));
        near(hits.find(h => h.instanceId === shelf.id).point.y, level.y + 3.625);
        shelfFaceRays++;
      } else {
        assert.equal(hits.length, 0, 'Retained incoming-flight shelf opening stays empty');
        missingShelfRays++;
      }
    }
    if (shelf) {
      for (const x of [-.02, .02]) for (const y of [-.02, .02]) for (const z of [-.02, .02]) {
        const p = stem.p.clone().setY(shelf.p.y).add(new T.Vector3(x, y, z));
        assert(inside(stem.m, p) && inside(shelf.m, p));
        shelfCoreVertices++;
      }
      // The stem intersects the shelf body; its lower tip is not a shelf-top foot.
      assert(foot < shelf.p.y - shelf.size.y / 2);
      near(shelf.size.y, .11);
    }
    let incoming = null;
    if (!shelf) {
      const s = stairs[level.id - 1], r = centre.x * Math.cos(s.a) + centre.z * Math.sin(s.a);
      const side = -centre.x * Math.sin(s.a) + centre.z * Math.cos(s.a);
      const feet = s.top - Math.ceil((s.outer - r) * s.steps / (s.outer - s.inner)) / 6;
      assert(Math.abs(side) < s.width / 2 - .23);
      near(foot - feet, 1.9);
      for (const dx of [-.02, 0, .02]) for (const dz of [-.02, 0, .02]) {
        const x = centre.x + dx, z = centre.z + dz;
        near(surfaceAt(x, z, feet), feet);
        const down = new T.Raycaster(new T.Vector3(x, feet + .05, z), new T.Vector3(0, -1, 0), 0, .1)
          .intersectObjects(display, false);
        assert(down.some(h => Math.abs(h.point.y - feet) < 1e-5));
        incomingFloorRays++;
        const up = new T.Raycaster(new T.Vector3(x, feet + .08, z), new T.Vector3(0, 1, 0), 0, 2.02)
          .intersectObjects(display, false);
        assert(up.length && up[0].object === stem.owner && up[0].instanceId === stem.id);
        near(up[0].point.y - feet, 1.9);
        existingBodyHits++;
      }
      incoming = {flight: s.i, r, side, feet, footAboveTread: foot - feet,
        globeAboveTread: sphereBottom - feet};
    }
    records.push({globe: i, level: level.id, stemId: stem.id, shelfId: shelf?.id ?? null,
      sphereOverlap: top - sphereBottom, shelfOverlap: shelf ? shelf.size.y : null, incoming});
  }
  assert.equal(sphereCapVertices, 120);
  assert.equal(sphereCoreVertices, 240);
  assert.equal(shelfCoreVertices, 224);
  assert.equal(shelfFaceRays, 252);
  assert.equal(missingShelfRays, 18);
  assert.equal(incomingFloorRays, 18);
  assert.equal(existingBodyHits, 18);
  assert.deepEqual(records.filter(r => !r.shelfOverlap).map(r => r.globe), [17, 26]);
  assert.deepEqual(snapshot(nodes), raw);
  assert.deepEqual(snapshot(display), installed);
  assert.deepEqual(lightRecords(), lights);
  assert.deepEqual(b.targets, targets);
  assert.equal(resources.size, 86);
  assert.equal(buffers.size, 36);
  b.dispose();
  for (const adapter of adapters) { adapter.sync(); adapter.dispose(); adapter.dispose(); }
  assert([...resources.values()].every(n => n === 1));
  assert([...buffers.values()].every(n => n === 1));
  assert.equal(borrowed, 0);
  drawing.dispose();
  return {globes: 30, originalLights: lights, rawMounts, records, sphereCapVertices, sphereCoreVertices,
    shelfCoreVertices, shelfFaceRays, missingShelfRays, incomingFloorRays, existingBodyHits,
    supportedStems: 28, unsupportedStems: 2, raw, installed, resources: 86, buffers: 36,
    releasedOnce: true, borrowedDrawingDisposalsByOwner: 0, newParts: 0};
}
