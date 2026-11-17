import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {julianDate,localSiderealDegrees,precessJ2000,equatorialToHorizontal,horizontalVector,angularSeparationDegrees,NIGHT_SKY_DEFAULTS as DEFAULTS,CONSTELLATION_GUIDES as GUIDES,SKY_CHART_LIMITS} from '../src/night-sky-model.js';
const near=(a,b,e=1e-9)=>assert(Math.abs(a-b)<e,`${a} != ${b}`),RAD=180/Math.PI,bytes=await readFile(new URL('../src/night-sky-catalogue.json',import.meta.url)),data=JSON.parse(bytes),stars=new Map(data.stars.map(s=>[s.hip,s]));
assert(bytes.length<300000);assert.equal(data.stars.length,2848);assert.equal(stars.size,2848);assert.equal(data.metadata.count,2848);assert.equal(data.metadata.commit,'c7f7f883fe678cc7680169a50ccd7dcc49b060ce');assert.equal(data.metadata.sourceSha256,'d9f69fd86bbf90a4e4d52b4c5c53eacfa6dfc0bfdef85bfd94f095e0bebe4ebd');assert.equal(data.metadata.license,'CC BY-SA 4.0');assert.equal(data.metadata.referenceEpoch,'J2000.0');assert(data.metadata.sourceUrl.includes(data.metadata.commit));assert(data.metadata.licenseUrl.startsWith('https://creativecommons.org/'));
for(const s of data.stars){assert(Number.isInteger(s.hip)&&s.hip>0);assert(s.raHours>=0&&s.raHours<24);assert(s.decDeg>=-90&&s.decDeg<=90);assert(s.magnitude<=5.5&&Number.isFinite(s.magnitude));assert(s.colorIndex===null||Number.isFinite(s.colorIndex));}
assert.equal(stars.get(32349).name,'Sirius');assert.equal(stars.get(11767).name,'Polaris');near(julianDate('2000-01-01T12:00:00Z'),2451545);near(julianDate('1970-01-01T00:00:00Z'),2440587.5);assert.throws(()=>julianDate('not-a-time'));
near(localSiderealDegrees('2000-01-01T12:00:00Z',0),280.460618375,.00002);
// Independent USNO public service, queried 2026-11-17:
// date2026-11-17,time21:00UT1,50.1N14.42E => LMST01:45:24.1062.
near(localSiderealDegrees(),(1+45/60+24.1062/3600)*15,.000002);
near((localSiderealDegrees(DEFAULTS.utc,15)-localSiderealDegrees(DEFAULTS.utc,0)+360)%360,15);
const axes=[
 [{raHours:0,decDeg:0},{latitudeDeg:0,localSiderealDeg:0},90,null],
 [{raHours:6,decDeg:0},{latitudeDeg:0,localSiderealDeg:0},0,90],
 [{raHours:18,decDeg:0},{latitudeDeg:0,localSiderealDeg:0},0,270],
 [{raHours:0,decDeg:0},{latitudeDeg:50.1,localSiderealDeg:0},39.9,180],
 [{raHours:0,decDeg:90},{latitudeDeg:50.1,localSiderealDeg:0},50.1,0],
 [{raHours:0,decDeg:-90},{latitudeDeg:50.1,localSiderealDeg:0},-50.1,180]
];for(const [star,options,alt,az]of axes){const p=equatorialToHorizontal(star,{...options,precess:false});near(p.altitudeDeg,alt,1e-7);if(az!==null)near(p.azimuthDeg,az,1e-7);}
for(const[az,expected]of[[0,[0,0,-1]],[90,[1,0,0]],[180,[0,0,1]],[270,[-1,0,0]]]){const p=horizontalVector({altitudeDeg:0,azimuthDeg:az});near(p.x,expected[0]);near(p.y,expected[1]);near(p.z,expected[2]);}near(horizontalVector({altitudeDeg:90,azimuthDeg:0},12).y,12);
// Published ERFA eraHd2ae numerical fixture (radians), not a mirrored formula.
const h=equatorialToHorizontal({raHours:0,decDeg:1.2*RAD},{precess:false,localSiderealDeg:1.1*RAD,latitudeDeg:.3*RAD});near(h.azimuthDeg,5.916889243730066194*RAD,1e-10);near(h.altitudeDeg,.4472186304990486228*RAD,1e-10);
// Published ERFA eraPmat76 fixture at JD2400000.5+50123.9999: compare all
// three basis vectors with its independent precession rotation matrix.
const matrix=[[.9999995504328350733,.0008696632209480960785,.0003779153474959888345],[-.0008696632209485112192,.9999996218428560614,-.0000001643284776111886407],[-.0003779153474950335077,-.0000001643306746147366896,.9999999285899790119]],instant=(2400000.5+50123.9999-2440587.5)*86400000;
for(const[index,star]of[{raHours:0,decDeg:0},{raHours:6,decDeg:0},{raHours:0,decDeg:90}].entries()){const q=precessJ2000(star,instant),a=q.raHours*15/RAD,d=q.decDeg/RAD,v=[Math.cos(d)*Math.cos(a),Math.cos(d)*Math.sin(a),Math.sin(d)];for(let row=0;row<3;row++)near(v[row],matrix[row][index],1e-10);}
const positions=data.stars.map(s=>equatorialToHorizontal(s));assert(positions.some(p=>p.altitudeDeg<0)&&positions.some(p=>p.altitudeDeg>0));for(const p of positions){assert(p.azimuthDeg>=0&&p.azimuthDeg<360);const v=horizontalVector(p,100);near(Math.hypot(v.x,v.y,v.z),100,1e-8);}
for(let i=1;i<40;i++){const a=data.stars[i*47],b=data.stars[i*53],v=horizontalVector(equatorialToHorizontal(a)),w=horizontalVector(equatorialToHorizontal(b)),separation=Math.acos(Math.max(-1,Math.min(1,v.x*w.x+v.y*w.y+v.z*w.z)))*RAD;near(separation,angularSeparationDegrees(a,b),1e-7);}
assert.equal(GUIDES.length,6);for(const g of GUIDES){assert(g.explanation.includes('\n\n'));assert(g.question.length>45);assert(g.sources.every(s=>/^https:\/\//.test(s)));assert(g.lineNotice.includes('not an official'));assert(g.hips.includes(g.focusHip));for(const hip of g.hips)assert(stars.has(hip),'Every labelled guide star is a genuine retained HIP row');for(const [a,b]of g.edges){assert(g.hips.includes(a)&&g.hips.includes(b));assert(a!==b);}assert(equatorialToHorizontal(stars.get(g.focusHip),{utc:g.chartUTC}).altitudeDeg>0,'Each suggested chart shows its guide focus');}
const tail=GUIDES.find(g=>g.id==='scorpius');assert(tail.hips.some(hip=>equatorialToHorizontal(stars.get(hip),{utc:tail.chartUTC}).altitudeDeg<0),'The Prague chart honestly keeps invisible southern tail stars below the horizon');for(const hip of GUIDES.find(g=>g.id==='cassiopeia').hips)assert(stars.get(hip).decDeg>90-DEFAULTS.latitudeDeg);assert(SKY_CHART_LIMITS.includes('refraction')&&SKY_CHART_LIMITS.includes('Proper motion'));
assert.throws(()=>equatorialToHorizontal({raHours:0,decDeg:100}));assert.throws(()=>equatorialToHorizontal({raHours:0,decDeg:0},{latitudeDeg:100}));assert.throws(()=>horizontalVector({altitudeDeg:0,azimuthDeg:0},-1));
console.log(`PASS astronomical sky: ${stars.size} genuine HIP rows / ${bytes.length} bytes, frozen CC BY-SA provenance, independent USNO sidereal and ERFA precession/horizon fixtures, all cardinal axes, unit sphere/separations, six real-star guides and honest invisible horizon stars.`);
