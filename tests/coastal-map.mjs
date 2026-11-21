import {SEA_TERRACE_ENTRY} from '../src/sea-terraces-model.js';
import {NIGHT_PARK} from '../src/night-park-model.js';
import {LIGHT_HOUSE} from '../src/house-of-light-model.js';
import {SOCRATES_SITE} from '../src/socrates-site-model.js';
import {coastVisitor,COAST_POSITION_COPY,coastPositionText,coastDistance} from '../src/coastal-position.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {coastalPlanSvg} from '../src/coastal-city-plan.js';
import {COAST_LANDMARKS, COAST_EXPLORER_COPY, COAST_WALK, coastMapPoint, coastWalkSvg} from '../src/coastal-map-data.js';
import {FOUNDATION_HOUSES,houseWorld} from '../src/foundation-houses-data.js';
import {PARK_HEX_CELLS,CITY_HEX} from '../src/city-hex-layout.js';
import {SEMINAR_HOUSES} from '../src/seminar-houses-data.js';
import {CIVIC_PAIRED_COURTS,URBAN_COURTS,urbanBuildingFootprints,urbanCourtOutline,urbanPavedRoutes} from '../src/city-urban-plan-model.js';
import {gardenPrecinctContains,gardenPavingContains} from '../src/six-gate-garden-paving.js';

const scope = {window: {}};
vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js', import.meta.url), 'utf8'), scope);
const plan = scope.window.ARTIST_QUARTER_PLAN;
// The approved city rearranges public houses. Its fixed island, central gallery,
// park, existing Socrates entrance and shore remain the geographic anchors.
const geometry = svg => [...svg.matchAll(/<(rect|circle|polygon|polyline|path|text)\b([^>]*)>/g)].map(m => [
  m[1], [...m[2].matchAll(/(?:^|\s)(x|y|cx|cy|r|width|height|rx|ry|d|points|transform)="([^"]*)"/g)].map(a => [a[1], a[2]])
]);
for (const lang of ['en', 'de', 'fa']) {
  const svg = readFileSync(new URL('../src/assets/city-coast-' + lang + '.svg', import.meta.url), 'utf8');
  assert.equal(svg, coastalPlanSvg(plan, lang), 'Committed SVG must match its generator');
  const shapes = geometry(svg);
  assert(shapes.length>105,'The map includes the planned civic circuit and inhabited courts');
  assert(svg.includes('data-transformation-house="true"'));assert(!svg.includes('Mountain of Becoming'),'Version 2 map must show the retained house, not the removed mountain');
  const project=points=>points.map(p=>coastMapPoint(...p).map(n=>n.toFixed(1)).join(',')).join(' ');
  for(const h of FOUNDATION_HOUSES){const footprint=[[-9,-8],[9,-8],[9,8],[-9,8]].map(([x,z])=>{const p=houseWorld(h,x,z);return[p.x,p.z];});assert(svg.includes('data-house="'+h.id+'" points="'+project(footprint)+'"'),'Each inward-facing public home must show its actual rotated 18 × 16 m floor');}
  for(const h of urbanBuildingFootprints(plan).filter(h=>h.category!=='gallery'&&h.category!=='reserve')){assert.equal([...svg.matchAll(new RegExp('data-building-footprint="'+h.id+'"','g'))].length,1,'Every existing public floor has one map outline');assert(svg.includes('data-centre="'+h.x+','+h.z+'"'));if(h.points)assert(svg.includes('points="'+project(h.points)+'"'));}
  assert.equal((svg.match(/data-vacated-park-cell=/g)||[]).length,5);for(const c of PARK_HEX_CELLS)assert(svg.includes('data-vacated-park-cell="'+c.q+','+c.r+'" points="'+project(Array.from({length:6},(_,i)=>[c.x+CITY_HEX.side*Math.cos(Math.PI/6+i*Math.PI/3),c.z+CITY_HEX.side*Math.sin(Math.PI/6+i*Math.PI/3)]))+'"'),'The map retains the five vacated daylight parcels without falsely placing the night park there');
  for(const c of URBAN_COURTS)assert(svg.includes('data-civic-court="'+c.id+'"'));
  for(const c of CIVIC_PAIRED_COURTS)assert(svg.includes('data-civic-court="'+c.id+'" points="'+project(urbanCourtOutline(c))+'"'));
  assert.equal((svg.match(/data-street="garden-door-/g)||[]).length,6,'Six canonical curved door approaches replace the retired straight source strips');assert(svg.includes('data-garden-stone-field="true"'));assert(!svg.includes('data-street="sixfold-front-'),'Retired central roads cannot survive as map-only paths');assert.equal((svg.match(/data-transformation-house="true"/g)||[]).length,6);assert(!svg.includes('data-private-home-reserve="true"'),'Personal homes now occupy the night face, not a blank upper reserve');assert(svg.includes('data-honeycomb-wall="true"'));assert(svg.includes('data-underground-link="gallery-east"'));assert(!svg.includes('NaN'));
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
  assert.equal(copy.steps.length, 3);assert(copy.route.includes(lang==='fa'?'اوریگامی':'Origami'),'The guide names the real Origami/coast route');assert(!copy.route.includes(lang==='en'?'Artists':lang==='de'?'Künstler':'هنرمندان'),'The guide must not claim to pass the separate western art court');
  assert(svg.includes('lang="' + lang + '"'));
}
const generated=['en','de','fa'].map(lang=>geometry(coastalPlanSvg(plan,lang)));assert.deepEqual(generated[0],generated[1],'Translated copy cannot alter island coordinates or mirror the map');assert.deepEqual(generated[0],generated[2]);
for(const route of urbanPavedRoutes(plan).filter(r=>!r.id.startsWith('garden-')))for(let i=1;i<route.points.length;i++){
 const a=route.points[i-1],b=route.points[i];
 for(const t of[.1,.5,.9])assert(!gardenPrecinctContains(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t),'The map cannot keep an old crossing strip inside the garden');
}
assert.deepEqual(COAST_LANDMARKS.map(p => coastMapPoint(...p.point)), [
  [460,460], coastMapPoint(NIGHT_PARK.localX,NIGHT_PARK.localZ), coastMapPoint(SOCRATES_SITE.x,SOCRATES_SITE.z), coastMapPoint(plan.arrival.x,plan.arrival.z), [849.1374286786722,513.2], ...SEMINAR_HOUSES.map(h=>coastMapPoint(h.x,h.z)),coastMapPoint(LIGHT_HOUSE.x,LIGHT_HOUSE.z),coastMapPoint(SEA_TERRACE_ENTRY.x,SEA_TERRACE_ENTRY.z)
]);
assert.deepEqual(COAST_LANDMARKS.find(p => p.id === 'artists').point, Array.from([plan.arrival.x, plan.arrival.z]));

// Independently sample the overlay against the committed base map's real path
// network. The route may retrace a lane, but may never draw a new shortcut.
const svg = coastalPlanSvg(plan);
const paths = [...svg.matchAll(/<polyline points="([^"]+)"([^>]*)>/g)].filter(m=>!m[2].includes('data-honeycomb-wall')&&!m[2].includes('data-underground-link'))
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
    assert(segments.some(([s,e]) => distance(p,s,e) < .11)||gardenPavingContains((p[0]-460)/.7,(p[1]-460)/.7)||Math.abs(Math.hypot(p[0]-460,p[1]-460)-536*.7)<.11, 'Overlay must follow an existing path or the continuous stone field: ' + p);
  }
}
assert(coastWalkSvg().includes('stroke-dasharray'), 'Route is identifiable without colour alone');
console.log('PASS coastal map: retained island/central anchors, actual relocated public houses and civic courts, deterministic EN/DE/FA SVGs/copy, and every walking-route segment on existing paths');

// Visitor position comes from the same world projection, never the chosen landmark.
assert.deepEqual(coastVisitor({x:0,z:0,yaw:0}).point,[460,460]);
for(const [yaw,bearing]of[[0,0],[-Math.PI/2,2],[Math.PI,4],[Math.PI/2,6],[-Math.PI/4,1],[Math.PI*6,0]])assert.equal(coastVisitor({x:20,z:30,yaw}).bearing,bearing);
for(const visitor of[null,{}, {x:NaN,z:1},{x:0,z:Infinity},{x:'2',z:0},{x:-24000,z:0},{x:800,z:0}])assert.equal(coastVisitor(visitor),null,'Do not clamp or invent an island position');
assert(coastVisitor({x:570,z:0}));assert.equal(coastVisitor({x:571,z:0}),null);
assert.equal(coastVisitor({x:0,z:0}).bearing,null);assert(Number.isFinite(coastVisitor({x:0,z:0,yaw:Number.MAX_VALUE}).bearing));
for(const lang of ['en','de','fa']){const c=COAST_POSITION_COPY[lang],visitor=coastVisitor({x:3,z:4,yaw:0,belowGround:true});assert(coastPositionText(visitor,c).startsWith(c.below));assert(coastPositionText(visitor,c).includes(c.directions[0]));assert.equal(coastPositionText(null,c),c.outside);assert.equal(coastDistance(null,[0,0],lang,c),'');assert(coastDistance(visitor,[0,0],lang,c).includes(new Intl.NumberFormat(lang==='fa'?'fa-IR':lang).format(5)));}
console.log('PASS map position: geographic heading and wrap, finite input guard, island/world boundaries, localized distance and underground disclosure');
