import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL, stairs, surfaceAt} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';

const canvas = () => ({getContext: () => new Proxy({}, {get: () => () => {}})});
const priorHash = '00134a70d3f15c950cdec2935c0d59f8cc412fff4786f77cabe7e7b45754bbb1';
const near = (a, b, e = 2e-5) => assert(Math.abs(a - b) < e, a + ' != ' + b);
const visible = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
const active = root => { const list = []; root.traverse(o => { if (o.isMesh && visible(o)) list.push(o); }); return list; };
const snapshot = (T, root, nodes = active(root)) => babelGuardSnapshot(T, {
  updateMatrixWorld: () => root.updateMatrixWorld(true), traverse: fn => nodes.forEach(fn)
});
function fixture(T) {
  const G = {...T}, resources = new Map(), buffers = new Map();
  for (const key of Object.keys(T)) if (/Geometry$|Material$|Texture$/.test(key) && typeof T[key] === 'function')
    G[key] = class extends T[key] { constructor(...args) { super(...args); resources.set(this, 0);
      this.addEventListener('dispose', () => resources.set(this, resources.get(this) + 1)); } };
  G.InstancedMesh = class extends T.InstancedMesh { constructor(...args) { super(...args); buffers.set(this, 0);
    this.addEventListener('dispose', () => buffers.set(this, buffers.get(this) + 1)); } };
  const drawing = new T.Texture(); let drawingDisposals = 0;
  drawing.addEventListener('dispose', () => drawingDisposals++);
  const b = buildBabelLibrary(G, {canvas, drawing}), scene = new T.Scene(), nodes = [];
  scene.add(b.group); b.group.traverse(o => nodes.push(o)); b.lamps.visible = true;
  const raw = snapshot(T, b.group, nodes);
  const adapters = [fitBabelRadialMouths(G, b), mountBabelSpokes(G, b), fitBabelPerimeter(G, b),
    fitBabelEntryReveals(G, b), seatBabelEntryLamps(G, b)];
  b.group.updateMatrixWorld(true);
  return {G, b, scene, nodes, raw, adapters, resources, buffers, drawing,
    borrowed: () => drawingDisposals, prior: snapshot(T, b.group)};
}
function inside(T, m, p) {
  const q = p.clone().applyMatrix4(m.clone().invert());
  assert(Math.max(...q.toArray().map(Math.abs)) <= .500001, 'Actual member containment');
}
function corners(T, m) {
  const points = [];
  for (const x of [-.5, .5]) for (const y of [-.5, .5]) for (const z of [-.5, .5])
    points.push(new T.Vector3(x, y, z).applyMatrix4(m));
  return points;
}
function separated(T, a, b) {
  const aa = [0, 1, 2].map(i => new T.Vector3().setFromMatrixColumn(a, i).normalize());
  const ba = [0, 1, 2].map(i => new T.Vector3().setFromMatrixColumn(b, i).normalize());
  const axes = [...aa, ...ba, ...aa.flatMap(x => ba.map(y => x.clone().cross(y)))];
  const ac = corners(T, a), bc = corners(T, b);
  return axes.some(axis => {
    if (axis.lengthSq() < 1e-12) return false;
    axis.normalize();
    const av = ac.map(p => p.dot(axis)), bv = bc.map(p => p.dot(axis));
    return Math.max(...av) < Math.min(...bv) - 1e-7 || Math.max(...bv) < Math.min(...av) - 1e-7;
  });
}
export function validateBabelGlobeMounts(T) {
  const f = fixture(T), {b, G, adapters, nodes} = f, root = b.group, targets = [...b.targets];
  assert.deepEqual(f.prior, {hash: priorHash, meshes: 68, instances: 41925});
  assert.equal(f.raw.hash, '7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');
  const lights = b.lamps.children.filter(o => o.isLight).map(o => [o, o.type, o.color.getHex(),
    o.intensity, o.position.toArray(), o.distance, o.decay]);
  const originalBounds = adapters[0].bindings.map(r => [r.clone, r.clone.boundingSphere,
    r.clone.boundingSphere?.clone()]);
  const deny = () => { throw Error('Globe rendering may not create resources or read private state'); };
  const guarded = {...G};
  for (const key of Object.keys(T)) if (/Geometry$|Material$|Texture$/.test(key)) guarded[key] = deny;
  const globals = ['localStorage', 'sessionStorage', 'document'];
  const descriptors = globals.map(k => Object.getOwnPropertyDescriptor(globalThis, k));
  for (const name of globals) Object.defineProperty(globalThis, name, {configurable: true, get: deny});
  let mount;
  try { mount = mountBabelTerraceGlobes(guarded, b, adapters[0]); mount.sync(); }
  finally { globals.forEach((key, i) => descriptors[i] ? Object.defineProperty(globalThis, key, descriptors[i])
    : delete globalThis[key]); }
  assert(mount.group && !mount.disposed);
  assert.equal(mount.frames.length, 2); assert.equal(mount.parts.length, 4); assert.equal(mount.changes.length, 2);
  assert.equal(f.resources.size, 86); assert.equal(f.buffers.size, 37);
  assert.equal(mount.mesh.geometry, mount.frames[0].stem.source.geometry);
  assert.equal(mount.mesh.material, mount.frames[0].stem.source.material);
  assert.equal(mountBabelTerraceGlobes(G, b, adapters[0]).group, null, 'No competing mount owner');
  root.updateMatrixWorld(true);
  const display = active(root), installed = snapshot(T, root);
  assert.deepEqual(installed, {hash: '3a06700f3902dea7051535bf29ecf6fc787bd374259582c99ba28077649f1399',
    meshes: 69, instances: 41929});
  assert.deepEqual(snapshot(T, root, nodes), f.raw);
  assert.deepEqual(b.targets, targets);
  assert.deepEqual(b.lamps.children.filter(o => o.isLight).map(o => [o, o.type, o.color.getHex(),
    o.intensity, o.position.toArray(), o.distance, o.decay]), lights);
  for (const [owner, reference, value] of originalBounds) {
    assert.equal(owner.boundingSphere, reference);
    if (value) assert(reference.equals(value), 'Keep borrowed conservative bounds');
  }
  const partMatrices = mount.parts.map((p, id) => {
    const m = new T.Matrix4(); mount.mesh.getMatrixAt(id, m); assert(m.equals(p.matrix)); return m;
  });
  let coreVertices = 0, capCorners = 0, envelopePairs = 0, floorRays = 0, bodyRays = 0, filledOldFootprints = 0;
  const records = [];
  const sphere = b.lamps.children.find(o => o.isInstancedMesh && o.geometry.type === 'SphereGeometry');
  const spherePlanes = [];
  for (let i = 0; i < sphere.geometry.index.count; i += 3) {
    const v = [0, 1, 2].map(j => new T.Vector3().fromBufferAttribute(sphere.geometry.attributes.position,
      sphere.geometry.index.getX(i + j)));
    const p = new T.Plane().setFromCoplanarPoints(...v);
    if (p.normal.lengthSq() < .5) continue;
    if (p.distanceToPoint(new T.Vector3()) > 0) p.negate();
    spherePlanes.push(p);
  }
  for (const frame of mount.frames) {
    const c = frame.stem, stem = new T.Matrix4(), original = new T.Matrix4(), sm = new T.Matrix4();
    c.owner.getMatrixAt(c.id, stem); c.source.getMatrixAt(c.id, original);
    assert(original.equals(c.before)); assert(stem.equals(c.after));
    for (let i = 0; i < 16; i++) if (![5, 13].includes(i)) assert.equal(stem.elements[i], original.elements[i]);
    assert.equal(stem.elements[13] + stem.elements[5] / 2,
      original.elements[13] + original.elements[5] / 2, 'Exact old upper face');
    near(stem.elements[5], .16);
    const rise = partMatrices[frame.riseIndex], arm = partMatrices[frame.armIndex];
    const pp = frame.post.p, sp = new T.Vector3().setFromMatrixPosition(stem), ay = arm.elements[13];
    const joints = [[frame.post.m, rise, new T.Vector3(pp.x, frame.postTop - .02, pp.z)],
      [rise, arm, new T.Vector3(pp.x, ay, pp.z)], [arm, stem, new T.Vector3(sp.x, ay, sp.z)]];
    for (const [a, d, centre] of joints) for (const x of [-.008, .008])
      for (const y of [-.008, .008]) for (const z of [-.008, .008]) {
        const p = centre.clone().add(new T.Vector3(x, y, z)); inside(T, a, p); inside(T, d, p); coreVertices++;
      }
    for (const x of [-.5, .5]) for (const z of [-.5, .5]) {
      inside(T, frame.post.m, new T.Vector3(x, -.5, z).applyMatrix4(rise));
      inside(T, arm, new T.Vector3(x, .5, z).applyMatrix4(rise));
      inside(T, arm, new T.Vector3(x, -.5, z).applyMatrix4(stem));
      capCorners += 3;
    }
    const riseBounds = new T.Box3().setFromPoints(corners(T, rise));
    const armBounds = new T.Box3().setFromPoints(corners(T, arm));
    near(frame.postTop - riseBounds.min.y, .04);
    near(armBounds.max.y - riseBounds.max.y, .02);
    near(frame.bottom - armBounds.min.y, .02);
    // These recessed caps have no coincident horizontal visible faces.
    assert(armBounds.max.y - riseBounds.max.y > .0199);
    assert(frame.bottom - armBounds.min.y > .0199);
    sphere.getMatrixAt(frame.globeId, sm);
    const inSphere = p => assert(spherePlanes.every(plane =>
      plane.distanceToPoint(p.clone().applyMatrix4(sm.clone().invert())) < 2e-7));
    for (const x of [-.5, .5]) for (const z of [-.5, .5]) {
      inSphere(new T.Vector3(x, .5, z).applyMatrix4(stem)); capCorners++;
    }
    for (const x of [-.008, .008]) for (const y of [-.005, .005]) for (const z of [-.008, .008]) {
      const p = new T.Vector3(sp.x + x, frame.top - .01 + y, sp.z + z);
      inside(T, stem, p); inSphere(p); coreVertices++;
    }
    for (const component of [stem, rise, arm]) for (const s of stairs) for (let i = 0; i < s.steps; i++) {
      const r = s.outer - (i + .5) * (s.outer - s.inner) / s.steps, feet = s.top - (i + 1) / 6;
      const m = new T.Matrix4().compose(new T.Vector3(Math.cos(s.a) * r, feet + 1.09, Math.sin(s.a) * r),
        new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), -s.a),
        new T.Vector3((s.outer - s.inner) / s.steps, 2.02, s.width));
      assert(separated(T, component, m), 'New part intersects a complete tread standing envelope');
      envelopePairs++;
    }
    const s = stairs[frame.flight];
    const r = sp.x * Math.cos(s.a) + sp.z * Math.sin(s.a);
    const feet = s.top - Math.ceil((s.outer - r) * 24 / 10) / 6;
    for (const dx of [-.03, -.015, 0, .015, .03]) for (const dz of [-.03, -.015, 0, .015, .03]) {
      const p = new T.Vector3(sp.x + dx, feet, sp.z + dz); near(surfaceAt(p.x, p.z, feet), feet);
      assert(new T.Raycaster(p.clone().add(new T.Vector3(0, .05, 0)), new T.Vector3(0, -1, 0), 0, .1)
        .intersectObjects(display, false).some(h => Math.abs(h.point.y - feet) < 1e-5)); floorRays++;
      assert.equal(new T.Raycaster(p.clone().add(new T.Vector3(0, .08, 0)), new T.Vector3(0, 1, 0), 0, 2.02)
        .intersectObjects(display, false).length, 0); bodyRays++;
    }
    const samples = Math.ceil(frame.distance / .02);
    for (let i = 0; i <= samples; i++) for (const lane of [-.045, 0, .045]) {
      const p = new T.Vector3(i / samples - .5, 0, lane / .10).applyMatrix4(arm);
      const rr = p.x * Math.cos(s.a) + p.z * Math.sin(s.a);
      const side = -p.x * Math.sin(s.a) + p.z * Math.cos(s.a);
      if (Math.abs(side) >= s.width / 2 - .23) continue;
      const yy = s.top - Math.ceil((s.outer - rr) * 24 / 10) / 6;
      near(surfaceAt(p.x, p.z, yy), yy);
      assert.equal(new T.Raycaster(p.clone().setY(yy + .08), new T.Vector3(0, 1, 0), 0, 2.02)
        .intersectObjects(display, false).length, 0); bodyRays++;
    }
    assert(armBounds.min.y - feet > 2.5199);
    // Original removed low end is genuinely absent in the installed source copy.
    assert.equal(new T.Raycaster(new T.Vector3(sp.x - .1, original.elements[13] - .35, sp.z),
      new T.Vector3(1, 0, 0), 0, .2).intersectObjects(display, false).length, 0);
    filledOldFootprints++;
    records.push({globe: frame.globeId, stem: c.id, post: frame.post.id, distance: frame.distance,
      stemHeight: stem.elements[5], oldTop: frame.top, stemBottom: frame.bottom,
      armBottom: armBounds.min.y, feet, lowestAboveTread: armBounds.min.y - feet});
  }
  assert.equal(coreVertices, 64); assert.equal(capCorners, 32); assert.equal(envelopePairs, 576);
  assert.equal(floorRays, 50); assert.equal(filledOldFootprints, 2);
  // Recover the entire 09ce2a installed result, not a hash with unaffected IDs omitted.
  for (const c of mount.changes) c.owner.setMatrixAt(c.id, c.before);
  mount.group.visible = false;
  assert.deepEqual(snapshot(T, root), f.prior);
  for (const c of mount.changes) c.owner.setMatrixAt(c.id, c.after);
  mount.group.visible = true;
  assert.deepEqual(snapshot(T, root), installed);
  mount.sync(); assert(!mount.disposed);
  b.dispose(); for (const a of [...adapters, mount]) { a.sync(); a.dispose(); a.dispose(); }
  assert([...f.resources.values()].every(n => n === 1));
  assert([...f.buffers.values()].every(n => n === 1)); assert.equal(f.borrowed(), 0); f.drawing.dispose();
  return {records, coreVertices, capCorners, envelopePairs, floorRays, bodyRays, filledOldFootprints,
    prior: f.prior, installed, resources: 86, buffers: 37, releasedOnce: true, borrowedDisposals: 0};
}

export function validateBabelGlobeMountLifecycle(T) {
  const modes = ['repeat', 'parent-first', 'root-detached', 'built-replaced', 'mouth-replaced',
    'lights-detached', 'sphere-detached', 'sphere-geometry', 'sphere-material', 'sphere-buffer',
    'sphere-version', 'sphere-count', 'source-version', 'clone-buffer', 'clone-array',
    'clone-version', 'post-edit', 'stem-edit', 'source-geometry', 'position-version', 'index-array',
    'own-group-moved', 'own-mesh-moved', 'own-buffer', 'own-array', 'own-version', 'own-count'];
  for (const mode of modes) {
    const f = fixture(T), {b, G, adapters} = f, root = b.group;
    const mount = mountBabelTerraceGlobes(G, b, adapters[0]); assert(mount.group, mode);
    const sphere = b.lamps.children.find(o => o.isInstancedMesh && o.geometry.type === 'SphereGeometry');
    const stem = mount.frames[0].stem, post = mount.frames[0].post;
    const buffer = stem.owner.instanceMatrix, array = buffer.array, own = mount.mesh.instanceMatrix;
    const geometry = stem.source.geometry, position = geometry.attributes.position, index = geometry.index;
    const restore = [];
    const set = (object, key, value) => { const before = object[key]; object[key] = value;
      restore.push(() => { object[key] = before; }); };
    const detach = object => { const parent = object.parent, index = parent.children.indexOf(object);
      object.removeFromParent(); restore.push(() => { parent.add(object);
        parent.children.splice(parent.children.indexOf(object), 1); parent.children.splice(index, 0, object); }); };
    const foreign = {geometry: 0, material: 0, buffer: 0};
    const foreignGeometry = {get attributes() { throw Error('Foreign geometry inspected'); },
      dispose() { foreign.geometry++; }};
    const foreignMaterial = {get map() { throw Error('Foreign material inspected'); },
      dispose() { foreign.material++; }};
    const replacement = () => { const a = new T.InstancedBufferAttribute(new Float32Array(array), 16);
      a.dispose = () => foreign.buffer++; return a; };
    if (mode === 'root-detached') { root.removeFromParent(); restore.push(() => f.scene.add(root)); }
    if (mode === 'built-replaced') set(b, 'group', {get children() { throw Error('Private replacement read'); }});
    if (mode === 'mouth-replaced') set(adapters[0], 'group', {get parent() { throw Error('Private replacement read'); }});
    if (mode === 'lights-detached') detach(b.lamps);
    if (mode === 'sphere-detached') detach(sphere);
    if (mode === 'sphere-geometry') set(sphere, 'geometry', foreignGeometry);
    if (mode === 'sphere-material') set(sphere, 'material', foreignMaterial);
    if (mode === 'sphere-buffer') set(sphere, 'instanceMatrix', replacement());
    if (mode === 'sphere-version') { const old = sphere.instanceMatrix.version;
      sphere.instanceMatrix.needsUpdate = true; restore.push(() => { sphere.instanceMatrix.version = old; }); }
    if (mode === 'sphere-count') set(sphere, 'count', 29);
    if (mode === 'source-version') { const old = stem.source.instanceMatrix.version;
      stem.source.instanceMatrix.needsUpdate = true; restore.push(() => { stem.source.instanceMatrix.version = old; }); }
    if (mode === 'clone-buffer') set(stem.owner, 'instanceMatrix', replacement());
    if (mode === 'clone-array') set(buffer, 'array', new Float32Array(array));
    if (mode === 'clone-version') buffer.needsUpdate = true;
    if (mode === 'post-edit') { const m = post.m.clone(); m.elements[12] += .05;
      post.binding.clone.setMatrixAt(post.id, m); restore.push(() => post.binding.clone.setMatrixAt(post.id, post.m)); }
    if (mode === 'stem-edit') { const m = stem.after.clone(); m.elements[12] += .05;
      stem.owner.setMatrixAt(stem.id, m); restore.push(() => stem.owner.setMatrixAt(stem.id, stem.before)); }
    if (mode === 'source-geometry') set(stem.source, 'geometry', foreignGeometry);
    if (mode === 'position-version') { const old = position.version;
      position.needsUpdate = true; restore.push(() => { position.version = old; }); }
    if (mode === 'index-array') set(index, 'array', index.array.slice());
    if (mode === 'own-group-moved') mount.group.position.x = .1;
    if (mode === 'own-mesh-moved') mount.mesh.position.z = .1;
    if (mode === 'own-buffer') set(mount.mesh, 'instanceMatrix', replacement());
    if (mode === 'own-array') set(own, 'array', own.array.slice());
    if (mode === 'own-version') own.needsUpdate = true;
    if (mode === 'own-count') mount.mesh.count = 3;
    if (mode === 'parent-first') b.dispose();
    else if (mode === 'repeat') mount.dispose();
    else mount.sync();
    assert(mount.disposed, mode);
    mount.sync(); mount.dispose(); mount.dispose();
    assert.equal(f.buffers.get(mount.mesh), 1, mode + ': release own buffer once');
    assert.deepEqual(foreign, {geometry: 0, material: 0, buffer: 0}, mode);
    if (mode !== 'parent-first') {
      assert([...f.resources.values()].every(n => n === 0), mode + ': no borrowed resource disposal');
      assert([...f.buffers.entries()].filter(([o]) => o !== mount.mesh).every(([, n]) => n === 0));
      if (mode !== 'stem-edit') for (const c of mount.changes) {
        const m = new T.Matrix4().fromArray(array, c.id * 16);
        assert(m.equals(c.before), mode + ': original borrowed array restored');
      }
    }
    for (const undo of restore.reverse()) undo();
    // Own buffer replacements are put back by the component, not by the caller.
    if (mode === 'own-buffer' || mode === 'own-array') mount.mesh.instanceMatrix = own;
    if (mode !== 'parent-first') {
      assert.deepEqual(snapshot(T, root), f.prior, mode + ': full preceding rendering restored');
      b.dispose();
    }
    for (const a of [...adapters, mount]) { a.sync(); a.dispose(); a.dispose(); }
    assert([...f.resources.values()].every(n => n === 1), mode + ': source owner cleanup');
    assert([...f.buffers.values()].every(n => n === 1), mode + ': all instance owners cleanup');
    assert.equal(f.borrowed(), 0); f.drawing.dispose();
  }
  // Unrecognized source profiles yield without editing any displayed record.
  for (const mode of ['sphere-count', 'missing-mouth', 'custom-position', 'private-api']) {
    const f = fixture(T), {b, G, adapters} = f;
    const sphere = b.lamps.children.find(o => o.isInstancedMesh && o.geometry.type === 'SphereGeometry');
    let undo = () => {}, supplied = adapters[0];
    if (mode === 'sphere-count') { sphere.count = 29; undo = () => { sphere.count = 30; }; }
    if (mode === 'missing-mouth') supplied = {};
    if (mode === 'custom-position') { sphere.position.x = .1; undo = () => { sphere.position.x = 0; }; }
    if (mode === 'private-api') supplied = Object.defineProperty({}, 'group', {
      get() { throw Error('Private API getter inspected'); }
    });
    const m = mountBabelTerraceGlobes(G, b, supplied);
    assert.equal(m.group, null, mode); m.sync(); m.dispose(); undo();
    assert.deepEqual(snapshot(T, b.group), f.prior, mode);
    b.dispose(); for (const a of adapters) a.dispose(); f.drawing.dispose();
  }
  return {programs: modes.length + 4, ownBufferReleasedOnce: true, borrowedDisposals: 0,
    originalBorrowedArraysRestored: true, foreignResourcesUntouched: true};
}
