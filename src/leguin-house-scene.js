import {LEGUIN_OBJECTS, leguinContents, leguinObjectPose} from './leguin-house-model.js';

export function buildLeguinTable(T, {feature, own, mat, box, wood, paper, furniture}) {
  const weave = mat(0xa88855), green = mat(0x44695a), clay = mat(0xa65f42);
  const table = new T.Group(); table.name = 'Le Guin gathering table'; table.position.set(5.8, 1.17, -3.2); feature.add(table);
  box(feature, 4.5, .12, 3.2, 5.8, 1.1, -3.2, wood);
  for (const x of [3.85, 7.75]) for (const z of [-4.45, -1.95]) box(feature, .14, 1.04, .14, x, .52, z, wood);
  furniture(5.8, -3.2, 4.5, 3.2);
  const basket = new T.Group(); basket.name = 'Open woven carrying basket'; table.add(basket);
  box(basket, 2.25, .045, 1.15, 0, .025, -.5, weave);
  for (const y of [.12, .26, .4, .54]) {
    for (const z of [-1.075, .075]) box(basket, 2.3, .065, .045, 0, y, z, weave);
    for (const x of [-1.125, 1.125]) box(basket, .045, .065, 1.15, x, y, -.5, weave);
  }
  for (let i = 0; i <= 10; i++) for (const z of [-1.075, .075]) box(basket, .045, .56, .04, -1.1 + i * .22, .3, z, weave);
  for (let i = 0; i <= 4; i++) for (const x of [-1.125, 1.125]) box(basket, .04, .56, .045, x, .3, -1.05 + i * .275, weave);
  // Two raised half-ring handles, with a genuinely open basket top.
  for (const x of [-1.13, 1.13]) {
    const handle = new T.Mesh(own(new T.TorusGeometry(.3, .035, 5, 16, Math.PI)), weave);
    handle.rotation.y = Math.PI / 2; handle.position.set(x, .55, -.5); basket.add(handle);
  }
  const objects = {};
  for (const id of LEGUIN_OBJECTS) {const o = new T.Group(); o.name = 'Le Guin object · ' + id; table.add(o); objects[id] = o;}
  const seeds = objects.seeds;
  box(seeds, .44, .11, .4, 0, .055, 0, paper);
  for (const x of [-.21, .21]) box(seeds, .04, .1, .4, x, .15, 0, paper);
  for (const z of [-.18, .18]) box(seeds, .44, .1, .04, 0, .15, z, paper);
  for (let i = 0; i < 5; i++) box(seeds, .07, .06, .11, -.12 + (i % 3) * .12, .14, -.08 + Math.floor(i / 3) * .15, weave);
  const thread = objects.thread;
  for (const y of [.035, .4]) {
    const rim = new T.Mesh(own(new T.CylinderGeometry(.19, .19, .045, 12)), wood); rim.position.y = y; thread.add(rim);
  }
  const spool = new T.Mesh(own(new T.CylinderGeometry(.14, .14, .32, 12)), green); spool.position.y = .22; thread.add(spool);
  for (const y of [.025, .075]) box(thread, .42, .045, .3, 0, y, .18, paper);
  box(thread, .1, .012, .25, 0, .105, .18, green);
  const cup = objects.cup;
  const profile = [[0, .025], [.14, .025], [.18, .07], [.19, .4], [.155, .4], [.145, .085], [0, .085]].map(([x, y]) => new T.Vector2(x, y));
  const vessel = new T.Mesh(own(new T.LatheGeometry(profile, 20)), clay); vessel.name = 'Open cup with inner wall'; cup.add(vessel);
  const handle = new T.Mesh(own(new T.TorusGeometry(.12, .035, 6, 16)), clay); handle.position.set(.22, .23, 0); cup.add(handle);
  // A woven wall panel and seat cushions add material detail without closing the roof opening.
  box(feature, 4.8, 2.4, .06, 4.9, 2.8, -7.8, paper);
  for (let i = 0; i < 10; i++) box(feature, 4.6, .065, .035, 4.9, 1.8 + i * .21, -7.75, green);
  for (const x of [2.8, 3.85, 4.9, 5.95, 7]) box(feature, .07, 2.15, .035, x, 2.8, -7.72, weave);
  for (const z of [-5, 1]) box(feature, 2.4, .075, .7, -4, .69, z, green);
  let selected = [];
  const exhibit = {table, basket, objects, get selected() {return [...selected];}, setContents(ids) {
    let next; try {next = leguinContents(ids);} catch {return false;}
    for (const id of LEGUIN_OBJECTS) {const p = leguinObjectPose(id, next.includes(id)); objects[id].position.set(p.x, p.y, p.z);}
    selected = next; return true;
  }};
  exhibit.setContents([]); return exhibit;
}
