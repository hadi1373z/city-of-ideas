import {BABEL, stairs} from './babel-library-model.js?v=two-faces2';

// This owner edits two displayed stems, never their original source records.
// Four borrowed-resource boxes connect them to existing shelf uprights.
export function mountBabelTerraceGlobes(T, built, mouths) {
  const data = (o, key) => o && Object.getOwnPropertyDescriptor(o, key)?.value;
  const root = data(built, 'group'), fitGroup = data(mouths, 'group');
  const bindings = data(mouths, 'bindings'), fittingChanges = data(mouths, 'changes');
  const empty = () => ({group: null, frames: [], parts: [], changes: [], sync() {}, dispose() {}});
  const name = 'Babel · supported terrace globe stems';
  if (!root?.isGroup || root.name !== 'Beneath Zarathustra · circular Library of Babel' ||
      !fitGroup?.isGroup || fitGroup.parent !== root ||
      fitGroup.userData.babelMouthClearance !== true || !Array.isArray(bindings) ||
      bindings.length !== 12 || !Array.isArray(fittingChanges) || fittingChanges.length !== 398 ||
      root.children.some(o => o.name === name)) return empty();

  const near = (a, b, e = 2e-4) => Math.abs(a - b) < e;
  const identity = new T.Matrix4();
  const local = o => o.matrixAutoUpdate
    ? new T.Matrix4().compose(o.position, o.quaternion, o.scale) : o.matrix;
  if (!local(fitGroup).equals(identity)) return empty();
  const findBinding = color => bindings.filter(b => b.source?.isInstancedMesh &&
    b.source.parent === root && b.source.geometry?.type === 'BoxGeometry' &&
    b.source.material?.color?.getHex() === color);
  const metals = findBinding(0xa58b56), timbers = findBinding(0x765238);
  if (metals.length !== 1 || timbers.length !== 1) return empty();
  const metal = metals[0], timber = timbers[0], box = metal.source.geometry;
  const validBinding = b => b.clone?.isInstancedMesh && b.clone.parent === fitGroup &&
    b.clone.geometry === b.source.geometry && b.clone.material === b.source.material &&
    b.clone.count === b.source.count && local(b.source).equals(identity) &&
    local(b.clone).equals(identity) && b.source.instanceMatrix?.itemSize === 16 &&
    b.clone.instanceMatrix?.itemSize === 16;
  if (![metal, timber].every(validBinding) || timber.source.geometry !== box ||
      ['width', 'height', 'depth'].some(k => box.parameters?.[k] !== 1) ||
      box.attributes?.position?.count !== 24 || box.index?.count !== 36) return empty();
  for (let i = 0; i < box.attributes.position.array.length; i++) {
    if (Math.abs(Math.abs(box.attributes.position.array[i]) - .5) > 1e-7) return empty();
  }
  for (let face = 0; face < 6; face++) {
    const expected = [0, 2, 1, 2, 3, 1].map(i => i + face * 4);
    if (expected.some((v, i) => box.index.getX(face * 6 + i) !== v)) return empty();
  }
  const lampGroups = root.children.filter(o => o.isGroup && o.name === 'Warm underground reading lights');
  if (lampGroups.length !== 1 || !local(lampGroups[0]).equals(identity)) return empty();
  const lampGroup = lampGroups[0];
  const spheres = lampGroup.children.filter(o => o.isInstancedMesh && o.geometry?.type === 'SphereGeometry');
  if (spheres.length !== 1) return empty();
  const sphere = spheres[0], sg = sphere.geometry, sp = sg.parameters;
  if (sphere.count !== 30 || !local(sphere).equals(identity) || !sphere.instanceMatrix ||
      !near(sp?.radius, .18, 1e-8) || sp.widthSegments !== 8 || sp.heightSegments !== 6 ||
      sg.attributes?.position?.count !== 63 || sg.index?.count !== 240) return empty();
  for (let i = 0; i < 30; i++) {
    const m = new T.Matrix4(); sphere.getMatrixAt(i, m);
    const l = BABEL.levels[Math.floor(i / 6)], a = (i % 6) * Math.PI / 3 + .3;
    const expected = new T.Matrix4().makeTranslation(Math.cos(a) * (l.r + 4),
      l.y + 4.32, Math.sin(a) * (l.r + 4));
    if (m.elements.some((v, j) => !near(v, expected.elements[j]))) return empty();
  }

  const records = binding => {
    const out = [];
    for (let id = 0; id < binding.clone.count; id++) {
      const m = new T.Matrix4(), p = new T.Vector3(), size = new T.Vector3();
      binding.clone.getMatrixAt(id, m); m.decompose(p, new T.Quaternion(), size);
      out.push({binding, id, m, p, size});
    }
    return out;
  };
  const brass = records(metal), oak = records(timber), frames = [], parts = [], changes = [];
  const inside = (m, p) => p.clone().applyMatrix4(m.clone().invert()).toArray()
    .every(v => Math.abs(v) < .500001);
  const quantize = m => new T.Matrix4().fromArray(new Float32Array(m.elements));
  const makeBox = (p, size, yaw = 0) => quantize(new T.Matrix4().compose(p,
    new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw), size));
  const core = (a, b, p) => [-.008, .008].every(x => [-.008, .008].every(y =>
    [-.008, .008].every(z => {
      const q = p.clone().add(new T.Vector3(x, y, z));
      return inside(a, q) && inside(b, q);
    })));

  for (const [globeId, levelId, distanceRange] of [[17, 2, [.54, .57]], [26, 4, [1.60, 1.63]]]) {
    const l = BABEL.levels[levelId], flight = stairs[levelId - 1], sm = new T.Matrix4();
    sphere.getMatrixAt(globeId, sm);
    const centre = new T.Vector3().setFromMatrixPosition(sm);
    const candidates = brass.filter(r => near(r.p.x, centre.x) && near(r.p.z, centre.z) &&
      near(r.p.y, l.y + 3.8) && r.size.toArray().every((v, i) => near(v, [.06, .8, .06][i])));
    if (candidates.length !== 1) return empty();
    const stem = candidates[0], original = new T.Matrix4();
    metal.source.getMatrixAt(stem.id, original);
    if (!stem.m.equals(original) || [1, 2, 4, 6, 8, 9].some(i => Math.abs(original.elements[i]) > 1e-7)) return empty();
    const posts = oak.filter(r => near(r.size.y, 3.8) && near(r.size.z, .95) &&
      r.size.x > .10 && r.size.x < .16 && near(r.p.y, l.y + 1.9))
      .map(r => ({...r, distance: Math.hypot(r.p.x - centre.x, r.p.z - centre.z)}))
      .sort((a, b) => a.distance - b.distance);
    const post = posts[0];
    if (!post || post.distance < distanceRange[0] || post.distance > distanceRange[1] ||
        posts[1]?.distance - post.distance < .05) return empty();
    const top = stem.p.y + stem.size.y / 2;
    const newCentre = Math.fround(top - .08), height = Math.fround(2 * (top - newCentre));
    const after = original.clone(); after.elements[5] = height; after.elements[13] = newCentre;
    if (newCentre + height / 2 !== top || height < .15999 || height > .16001) return empty();
    const bottom = newCentre - height / 2, armY = bottom + .01;
    const postTop = post.p.y + post.size.y / 2, riserBottom = postTop - .04, riserTop = armY + .01;
    const rise = makeBox(new T.Vector3(post.p.x, (riserBottom + riserTop) / 2, post.p.z),
      new T.Vector3(.06, riserTop - riserBottom, .06));
    const dx = centre.x - post.p.x, dz = centre.z - post.p.z;
    const arm = makeBox(new T.Vector3((centre.x + post.p.x) / 2, armY, (centre.z + post.p.z) / 2),
      new T.Vector3(post.distance + .10, .06, .10), Math.atan2(-dz, dx));
    if (!core(post.m, rise, new T.Vector3(post.p.x, postTop - .02, post.p.z)) ||
        !core(rise, arm, new T.Vector3(post.p.x, armY, post.p.z)) ||
        !core(arm, after, new T.Vector3(centre.x, armY, centre.z))) return empty();
    for (const x of [-.5, .5]) for (const z of [-.5, .5]) {
      const p = new T.Vector3(x, 0, z).applyMatrix4(rise);
      const side = -p.x * Math.sin(flight.a) + p.z * Math.cos(flight.a);
      if (side < 1.725) return empty();
    }
    // Whole arm width stays above the actual stepped incoming-flight envelope.
    const samples = Math.ceil((post.distance + .10) / .02);
    const armBottom = arm.elements[13] - Math.hypot(arm.elements[4], arm.elements[5], arm.elements[6]) / 2;
    for (let i = 0; i <= samples; i++) for (const side of [-.5, 0, .5]) {
      const p = new T.Vector3(i / samples - .5, 0, side).applyMatrix4(arm);
      const r = p.x * Math.cos(flight.a) + p.z * Math.sin(flight.a);
      const lane = -p.x * Math.sin(flight.a) + p.z * Math.cos(flight.a);
      if (r < flight.inner || r > flight.outer || Math.abs(lane) > flight.width / 2 - .23) continue;
      const feet = flight.top - Math.ceil((flight.outer - r) * flight.steps /
        (flight.outer - flight.inner)) * (flight.top - flight.bottom) / flight.steps;
      if (armBottom - feet < 2.4) return empty();
    }
    const change = {source: metal.source, owner: metal.clone, id: stem.id, before: original, after};
    changes.push(change);
    frames.push({globeId, levelId, flight: flight.i, stem: change, post, top, bottom, postTop,
      distance: post.distance, riseIndex: parts.length, armIndex: parts.length + 1});
    parts.push({kind: 'upright extension', matrix: rise}, {kind: 'raised arm', matrix: arm});
  }

  const group = new T.Group(); group.name = name; group.userData.babelGlobeMounts = true;
  const mesh = new T.InstancedMesh(box, metal.source.material, parts.length);
  mesh.name = 'Four raised brass joins for two original terrace globes';
  mesh.layers.mask = metal.clone.layers.mask;
  mesh.castShadow = metal.clone.castShadow; mesh.receiveShadow = metal.clone.receiveShadow;
  parts.forEach((p, i) => mesh.setMatrixAt(i, p.matrix));
  mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere?.();
  group.add(mesh); root.add(group);
  for (const c of changes) c.owner.setMatrixAt(c.id, c.after);
  // Shortened stems remain inside the old conservative bounds; keep that cache.
  metal.clone.instanceMatrix.needsUpdate = true;
  const ownBuffer = mesh.instanceMatrix, ownArray = ownBuffer.array, ownVersion = ownBuffer.version;
  const sourceRecords = [metal.source, metal.clone, timber.source, timber.clone, sphere].map(o => ({
    object: o, parent: o.parent, geometry: o.geometry, material: o.material, buffer: o.instanceMatrix,
    version: o.instanceMatrix.version, array: o.instanceMatrix.array, count: o.count, matrix: local(o).clone()
  }));
  const geometryRecords = [...new Set(sourceRecords.map(r => r.geometry))].map(geometry => ({
    geometry, index: geometry.index, indexVersion: geometry.index.version, indexArray: geometry.index.array,
    attributes: Object.entries(geometry.attributes).map(([name, a]) => ({name, a, version: a.version, array: a.array}))
  }));
  const originalDispose = built.dispose;
  let disposed = false;
  const wrappedDispose = function(...args) { dispose(); return originalDispose.apply(this, args); };
  built.dispose = wrappedDispose;
  function dispose() {
    if (disposed) return;
    disposed = true;
    group.removeFromParent();
    const restored = new Set();
    for (const c of changes) {
      const record = sourceRecords.find(r => r.object === c.owner), offset = c.id * 16;
      // Restore only our unchanged edit in the original borrowed array. A
      // replacement attribute/array is neither read nor written by cleanup.
      if (record.array.length < offset + 16 ||
          c.after.elements.some((v, i) => record.array[offset + i] !== v)) continue;
      record.array.set(c.before.elements, offset); restored.add(record);
    }
    for (const record of restored) if (data(record.buffer, 'array') === record.array)
      record.buffer.needsUpdate = true;
    mesh.instanceMatrix = ownBuffer;
    ownBuffer.array = ownArray;
    mesh.dispose?.(); group.clear();
    if (built.dispose === wrappedDispose) built.dispose = originalDispose;
  }
  function sync() {
    if (disposed) return;
    if (data(built, 'group') !== root || data(mouths, 'group') !== fitGroup ||
        !root.parent || group.parent !== root || fitGroup.parent !== root ||
        lampGroup.parent !== root || sphere.parent !== lampGroup ||
        !local(fitGroup).equals(identity) || !local(lampGroup).equals(identity) ||
        !local(group).equals(identity) || !local(mesh).equals(identity) ||
        mesh.parent !== group || mesh.geometry !== box || mesh.material !== metal.source.material ||
        mesh.instanceMatrix !== ownBuffer || ownBuffer.array !== ownArray ||
        ownBuffer.version !== ownVersion || mesh.count !== 4 ||
        sourceRecords.some(r => r.object.parent !== r.parent || r.object.geometry !== r.geometry ||
          r.object.material !== r.material || data(r.object, 'instanceMatrix') !== r.buffer ||
          r.buffer.version !== r.version || data(r.buffer, 'array') !== r.array || r.object.count !== r.count ||
          !local(r.object).equals(r.matrix)) ||
        geometryRecords.some(r => r.geometry.index !== r.index || r.index.version !== r.indexVersion ||
          r.index.array !== r.indexArray ||
          r.attributes.some(a => r.geometry.attributes[a.name] !== a.a ||
            a.a.version !== a.version || a.a.array !== a.array))) { dispose(); return; }
    for (const frame of frames) {
      const stem = new T.Matrix4(), post = new T.Matrix4();
      frame.stem.owner.getMatrixAt(frame.stem.id, stem);
      frame.post.binding.clone.getMatrixAt(frame.post.id, post);
      if (!stem.equals(frame.stem.after) || !post.equals(frame.post.m)) { dispose(); return; }
    }
  }
  return {group, mesh, frames, parts, changes, sync, dispose, get disposed() { return disposed; }};
}
