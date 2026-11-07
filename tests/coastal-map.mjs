import {coastVisitor,COAST_POSITION_COPY,coastPositionText,coastDistance} from '../src/coastal-position.js';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {coastalPlanSvg} from '../src/coastal-city-plan.js';
import {COAST_LANDMARKS, COAST_EXPLORER_COPY, COAST_WALK, coastMapPoint, coastWalkSvg} from '../src/coastal-map-data.js';

const scope = {window: {}};
vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js', import.meta.url), 'utf8'), scope);
const plan = scope.window.ARTIST_QUARTER_PLAN;
// Recorded from all 97 original shapes/labels at main 0d2cf6a68b1f6aad1dee4c4f62b943bafa2b00d7.
// Ignore paint/text content, but preserve every shape and all geometry/label anchors.
const geometry = svg => [...svg.matchAll(/<(rect|circle|polyline|path|text)\b([^>]*)>/g)].map(m => [
  m[1], [...m[2].matchAll(/(?:^|\s)(x|y|cx|cy|r|width|height|rx|ry|d|points|transform)="([^"]*)"/g)].map(a => [a[1], a[2]])
]);
const originalHash = '191a91baa69e18aad54e4d05b856f44ff06833b094a0220b397430afe0e7d727';
for (const lang of ['en', 'de', 'fa']) {
  const svg = readFileSync(new URL('../src/assets/city-coast-' + lang + '.svg', import.meta.url), 'utf8');
  assert.equal(svg, coastalPlanSvg(plan, lang), 'Committed SVG must match its generator');
  const shapes = geometry(svg);
  assert.equal(shapes.length, 97);
  assert.equal(createHash('sha256').update(JSON.stringify(shapes)).digest('hex'), originalHash, 'Original island, buildings, paths and labels must not move');
  assert(svg.includes('data-gallery-centre="true" cx="460" cy="460"'));
  assert(svg.includes('data-island="true" cx="460" cy="460" r="399"'));
  assert(svg.includes('cx="460" cy="460" r="375.2"'), 'Continuous coastal promenade');
  const copy = COAST_EXPLORER_COPY[lang];
  assert.deepEqual(Object.keys(copy).sort(), Object.keys(COAST_EXPLORER_COPY.en).sort());
  assert.deepEqual(Object.keys(copy.landmarks), COAST_LANDMARKS.map(p => p.id));
  for (const place of Object.values(copy.landmarks)) {
    assert(Object.values(place).every(s => typeof s === 'string' && s.length > 0));
    assert(place.description.length > 50);
  }
  assert.equal(copy.steps.length, 3);
  assert(svg.includes('lang="' + lang + '"'));
}
assert.deepEqual(COAST_LANDMARKS.map(p => coastMapPoint(...p.point)), [
  [460,460], [460,229.00000000000003], [392.8,530], [527.2,528.6], [849.1374286786722,513.2]
]);
assert.deepEqual(COAST_LANDMARKS.find(p => p.id === 'artists').point, Array.from([plan.arrival.x, plan.arrival.z]));

// Independently sample the overlay against the committed base map's real path
// network. The route may retrace a lane, but may never draw a new shortcut.
const svg = coastalPlanSvg(plan);
const paths = [...svg.matchAll(/<polyline points="([^"]+)"[^>]*stroke-width="(?:3\.5|2\.5)"/g)]
  .map(m => m[1].split(' ').map(p => p.split(',').map(Number)));
const segments = paths.flatMap(p => p.slice(1).map((b, i) => [p[i], b]));
function distance(p, a, b) {
  const dx = b[0]-a[0], dy = b[1]-a[1], t = Math.max(0, Math.min(1, ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));
  return Math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dy);
}
for (let i = 1; i < COAST_WALK.length; i++) {
  const a = coastMapPoint(...COAST_WALK[i-1]), b = coastMapPoint(...COAST_WALK[i]);
  const count = Math.ceil(Math.hypot(b[0]-a[0], b[1]-a[1]));
  for (let j = 0; j <= count; j++) {
    const p = [a[0]+(b[0]-a[0])*j/count, a[1]+(b[1]-a[1])*j/count];
    assert(segments.some(([s,e]) => distance(p,s,e) < .11), 'Overlay must follow an existing path: ' + p);
  }
}
assert(coastWalkSvg().includes('stroke-dasharray'), 'Route is identifiable without colour alone');
console.log('PASS coastal map: original 97-shape geometry fingerprint, exact centre and landmark anchors, deterministic EN/DE/FA SVGs/copy, and every walking-route segment on existing paths');

// Visitor position comes from the same world projection, never the chosen landmark.
assert.deepEqual(coastVisitor({x:0,z:0,yaw:0}).point,[460,460]);
for(const [yaw,bearing]of[[0,0],[-Math.PI/2,2],[Math.PI,4],[Math.PI/2,6],[-Math.PI/4,1],[Math.PI*6,0]])assert.equal(coastVisitor({x:20,z:30,yaw}).bearing,bearing);
for(const visitor of[null,{}, {x:NaN,z:1},{x:0,z:Infinity},{x:'2',z:0},{x:-24000,z:0},{x:800,z:0}])assert.equal(coastVisitor(visitor),null,'Do not clamp or invent an island position');
assert(coastVisitor({x:570,z:0}));assert.equal(coastVisitor({x:571,z:0}),null);
assert.equal(coastVisitor({x:0,z:0}).bearing,null);assert(Number.isFinite(coastVisitor({x:0,z:0,yaw:Number.MAX_VALUE}).bearing));
for(const lang of ['en','de','fa']){const c=COAST_POSITION_COPY[lang],visitor=coastVisitor({x:3,z:4,yaw:0,belowGround:true});assert(coastPositionText(visitor,c).startsWith(c.below));assert(coastPositionText(visitor,c).includes(c.directions[0]));assert.equal(coastPositionText(null,c),c.outside);assert.equal(coastDistance(null,[0,0],lang,c),'');assert(coastDistance(visitor,[0,0],lang,c).includes(new Intl.NumberFormat(lang==='fa'?'fa-IR':lang).format(5)));}
console.log('PASS map position: geographic heading and wrap, finite input guard, island/world boundaries, localized distance and underground disclosure');
