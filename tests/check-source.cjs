'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),guard=require('../tools/source-guard.cjs');
const root=path.resolve(__dirname,'..'),src=path.join(root,'src');
const jsonHash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert(fs.existsSync(src),'No stable source snapshot: import the ready builder first.');
const all=guard.files(src),read=p=>fs.readFileSync(path.join(src,p),'utf8');guard.checkFiles(src,all);
assert(all.includes('index.html'),'Missing city entrance');
const html=read('index.html');
function localRef(from,ref){
  if(!ref||ref.startsWith('#')||/^(?:https?:|data:|blob:|mailto:|tel:)/i.test(ref)||/\$\{|[<>\\]/.test(ref))return null;
  assert(!ref.startsWith('/'),'Asset escapes the Pages project base in '+from+': '+ref.split(/[?#]/)[0]);
  const decoded=decodeURIComponent(ref.split(/[?#]/)[0]);if(!decoded)return null;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(from),decoded));
  assert(target!=='..'&&!target.startsWith('../'),'Asset escapes source tree in '+from);
  // The build/import fixtures verify this generated metadata; source guards prohibit a stale src copy.
  if(target==='version.json'&&from==='version-info.js')return target;
  assert(all.includes(target),'Missing local dependency in '+from+': '+target);
  return target;
}
const reachable=new Set(),pending=[];
function enqueue(file){if(file&&!reachable.has(file)){reachable.add(file);pending.push(file);}}
for(const file of all.filter(f=>f.endsWith('.html'))){
  const text=read(file);
  for(const match of text.matchAll(/<(?:script|link|iframe|img|source)\b[^>]*(?:src|href)=["']([^"']*)["']/g))enqueue(localRef(file,match[1]));
}
while(pending.length){
  const file=pending.pop();if(!/\.(?:m?js|css)$/.test(file))continue;
  const text=read(file);
  if(file.endsWith('.css')){for(const m of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))enqueue(localRef(file,m[1]));continue;}
  // Only walk reachable modules; archival vendor source is not a runtime import.
  for(const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["'](\.{1,2}\/[^"']+)["']/g))enqueue(localRef(file,m[1]));
  for(const m of text.matchAll(/\bfetch\(\s*["']([^"']+)["']/g)){
    const ref=m[1];if(/\$\{|[?&=]$/.test(ref))continue;
    if(ref.startsWith('/api/'))throw Error('A static Pages frontend cannot execute its original Worker API: '+file+'. Reconnect and verify the authenticated backend.');
    if(ref.startsWith('./')||ref.startsWith('../')||/\.(?:json|html|glb|gltf|wasm)(?:[?#]|$)/.test(ref))enqueue(localRef(file,ref));
  }
}
// Execute only trusted public data adapters in an isolated VM, without I/O or network globals.
const sandbox={console:{warn(){},log(){}},setTimeout(){},clearTimeout(){}};sandbox.window=sandbox;sandbox.self=sandbox;vm.createContext(sandbox);
for(const p of ['assets/three.min.js','city-sources.js','city-book.js','park-data.js'])vm.runInContext(read(p),sandbox,{timeout:10000,filename:p});
const s=sandbox.CITY_SOURCES,b=sandbox.CITY_BOOK,p=sandbox.PARK_DATA;
assert.equal(s.ARTISTS.length,10);assert.equal(s.ARTISTS.reduce((n,a)=>n+a.works.length,0),60);assert.equal(s.OBJECTS.length,104);assert.equal(s.GLB_OBJECTS.length,36);assert.equal(b.chapters.length,81);assert.equal(p.catalogue.people.length,118);
assert.equal(new Set(b.chapters.map(c=>c.id)).size,81,'Book IDs must remain stable and unique');
assert.deepEqual(Array.from([1,2,3,4],part=>b.chapters.filter(c=>c.part===part).length),[23,22,16,20]);
assert(b.chapters.every(c=>Array.isArray(c.paragraphs)&&c.paragraphs.length),'Full book text is missing');
assert.equal(jsonHash(b.chapters.map(c=>[c.id,c.part,c.paragraphs])),'d39a2a41f904598df383db61bfdf1751ff78b65ba26458eb146d6b517e1c13d5','Full Thomas Common text differs from original Atlas source; do not replace complete chapters with excerpts');
assert.equal(p.catalogue.connections.length,150);assert.equal(p.catalogue.trails.length,8);assert.equal(p.districts.length,9);assert.equal(p.missions.length,12);
for(const a of s.ARTISTS)for(const w of a.works){assert(w.id&&w.description&&w.citation&&w.rights,'Artwork attribution missing');assert(fs.existsSync(path.join(src,w.imageUrl)),'Artwork file missing '+w.imageUrl);}
const glbs=all.filter(f=>f.endsWith('.glb')),songs=all.filter(f=>/object-store\/audio\/.*\.wav$/.test(f));
const bankModels=glbs.filter(f=>f.startsWith('city-source-assets/object-store/assets/')),bankSongs=songs.filter(f=>f.startsWith('city-source-assets/object-store/audio/'));
assert.equal(bankModels.length,36,'All 36 original city model files must remain');assert.equal(bankSongs.length,10,'All 10 original city songs must remain');
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(src,file))).digest('hex'),modelDigests=new Set(bankModels.map(digest)),songDigests=new Set(bankSongs.map(digest));
assert.equal(digest('city-source-assets/home-tools/math-city/atlas/index.html'),'bd07240709cc2626f581556f1b272bc8e118a20a98da4ce2e3b711f3aa4d2da4','Canonical Math reader Git blob changed');
assert.equal(digest('city-source-assets/home-tools/artists-websites.html'),'5fa732497902c19009f7164612846345c513888f2f21436f1bb93dd8cca168d6','Canonical artist websites Git blob changed');
assert.equal(modelDigests.size,36,'Original model assets must remain distinct');assert.equal(songDigests.size,10,'Original songs must remain distinct');
// The film edition has six independently authored character assets, preserved by checksum.
const filmManifest=JSON.parse(read('ramsey-film/import-provenance.json'));
const filmModels=new Set(['anonymous','nietzsche','ramsey','socrates','turing','zarathustra'].map(id=>'ramsey-film/assets/'+id+'.glb'));
assert.equal(glbs.filter(file=>filmModels.has(file)).length,6,'All six film characters must be present');
for(const [rel,sha]of Object.entries(filmManifest.files)){assert(!rel.startsWith('/')&&!rel.split('/').includes('..'));assert.equal(digest('ramsey-film/'+rel),sha,'Film edition changed: '+rel);}
for(const file of glbs)assert(filmModels.has(file)||modelDigests.has(digest(file)),'Unexpected or changed duplicate model: '+file);
for(const file of songs)assert(songDigests.has(digest(file)),'Unexpected or changed duplicate song: '+file);
for(const file of glbs){const data=fs.readFileSync(path.join(src,file));assert.equal(data.readUInt32LE(0),0x46546c67);assert.equal(data.readUInt32LE(4),2);assert.equal(data.readUInt32LE(8),data.length);const name=path.basename(file,'.glb');if(/^[0-9a-f]{64}$/.test(name))assert.equal(crypto.createHash('sha256').update(data).digest('hex'),name,'Source GLB byte integrity: '+file);}
assert(all.includes('city-source-assets/park-tools/atlas.html'),'Full Park reader must be retained');
assert(all.includes('city-source-assets/home-tools/index.html'),'Full House tools must be retained');
// Required source inventory is a necessary gate; copied modules do not certify UI/backend behavior.
const home='city-source-assets/home-tools/',requiredHouseModules=['app.js','model.js','neighborhood.js','city-network.js','home-ui.js','resident-ui.js','resident.js','learning-ui.js','socrates.js','residence-ui.js','residence-data.js','construction-ui.js','construction-data.js','designer-ui.js','design-objects.js','art-city-ui.js','art-city-data.js','artist-catalog.js','artist-resident-ui.js','artist-homes-ui.js','conversation-ui.js','conversation-data.js','conversation-import.js','city-travel-ui.js','math-city-ui.js','math-city-data.js','learning-trail-ui.js','learning-trail.js','object-store-ui.js','object-store.js'];
const capabilityPath=home+'capabilities.json',capabilities=all.includes(capabilityPath)?JSON.parse(read(capabilityPath)):null;
if(capabilities)assert.equal(capabilities.schemaVersion,1,'Unsupported House capability mapping');
for(const name of requiredHouseModules){
  const mapped=capabilities?.modules?.[name];
  const file=mapped?localRef(capabilityPath,mapped):home+name;
  assert(all.includes(file),'Original House capability module missing: '+name+' (or map its adapted implementation in home-tools/capabilities.json)');
}
const mathData=all.find(f=>/(?:^|\/)math-city-data\.js$/.test(f));assert(mathData,'Full mathematics learning data must be retained');
const mathScope={};vm.createContext(mathScope);
vm.runInContext(read(mathData).replace(/\bexport\s+(?=(?:const|function)\b)/g,'')+'\nthis.math={building:MATH_BUILDING,concepts:MATH_CONCEPTS,floors:MATH_FLOORS};',mathScope,{timeout:1000,filename:mathData});
assert.equal(mathScope.math.building.floors,8);assert.equal(mathScope.math.floors.length,8);assert.equal(mathScope.math.concepts.length,24);
const mathReader=all.find(f=>/(?:^|\/)math-city\/atlas\/index\.html$/.test(f));assert(mathReader,'The complete original Mathematics Atlas reader must be retained');
const mathHTML=read(mathReader),mathJSON=mathHTML.match(/<script\b[^>]*id=["']atlas-data["'][^>]*>([\s\S]*?)<\/script>/i);
assert(mathJSON,'Math reader embedded catalogue is absent');
const mathCatalogue=JSON.parse(mathJSON[1]);assert.equal(mathCatalogue.people.length,131);assert.equal(mathCatalogue.people.filter(person=>person.extended).length,49);assert.equal(mathCatalogue.connections.length,181);assert.equal(mathCatalogue.exploration.concepts.length,13);assert.equal(mathCatalogue.publications.length,20);assert.equal(mathCatalogue.trails.length,8);
assert.equal(jsonHash(mathCatalogue.people.map(person=>person.id).sort()),'8c47b1199d0f95f1ac4c0b27d0921764778616e7f14a9190b8d2cee87e6cb599','Original Mathematics Atlas profile IDs were lost or changed');
assert(mathCatalogue.people.every(person=>person.id&&person.bio&&Array.isArray(person.sections)&&person.sections.length),'Math reader catalogue is incomplete');
assert(html.includes('language-choice'),'Entry language choice is absent');
console.log(JSON.stringify({passed:true,files:all.length,localDependencies:reachable.size,artists:10,paintings:60,objects:104,models:36,songs:10,bookSections:81,parkPeople:118,parkConnections:150,parkTrails:8,parkMissions:12,houseCapabilityModules:requiredHouseModules.length,mathFloors:8,mathConcepts:24,mathReaderPeople:131,mathReaderExtendedProfiles:49,mathReaderConnections:181,mathReaderIdeaLenses:13,mathReaderPublications:20,limits:'Content integrity and dependency checks only; browser interaction, backend behavior and private-data migration require separate verification.'}));
