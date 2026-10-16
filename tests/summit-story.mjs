import assert from 'node:assert/strict';import vm from 'node:vm';import{readFile}from'node:fs/promises';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{warn(){}}});
const w={};for(const file of['gallery-spiral.js','roof-connection.js','summit-story.js'])vm.runInNewContext(await readFile(new URL('../src/'+file,import.meta.url),'utf8'),{window:w});
const scene=new T.Scene(),infant=new T.Group();infant.position.y=32.375;const mountain={infant,setCrawling(value){this.crawling=value;}},city={A:{x:125,z:0,radius:54.5},mountain};
const roof=w.createRoofConnection(T,{scene,city,stairs:w.createGallerySpiral(T)}),volcano=new T.Group(),figure=new T.Group(),lava={emissiveIntensity:2},figureLight=new T.PointLight(),coreLight=new T.PointLight();volcano.add(figure);scene.add(volcano);
const story=w.createSummitStory(T,{roof,mountain,figure,volcano,lava,figureLight,coreLight}),visitor={x:125,z:10,y:34.195,yaw:.8};let time=0;
function tick(seconds=.05,{mode='peak',paused=false,reduced=false}={}){time+=seconds;roof.update(time,visitor,mode,reduced,paused);story.update(seconds,time,visitor,mode,{paused,reduced});}
assert.equal(story.state.mode,'explore');assert(!story.reachSummit());roof.invite(true);tick();assert.equal(infant.position.x,-100.25,'Exploration invitation is retained');
story.setMode('story');assert.equal(story.state.phase,'armed');assert.equal(roof.state.progress,0);assert(!figure.visible);assert(story.reachSummit());assert(!story.reachSummit(),'Repeated summit entries cannot restart the event');
tick(.1,{paused:true});assert.equal(story.state.elapsed,0,'An open reader or dialog pauses the event');
const phases=new Set(),leapSamples=[];let overlap=false;
for(let i=0;i<1300;i++){tick();phases.add(story.state.phase);if(story.state.phase==='leap')leapSamples.push({x:125+infant.position.x,y:infant.position.y});if(infant.visible&&figure.visible)overlap=true;}
for(const phase of['arrival','crawl','poise','leap','flare','emerge','complete'])assert(phases.has(phase),phase+' is visited in the summit event');
assert(!overlap,'The figure is only revealed after the child disappears');assert(!infant.visible);assert(figure.visible);assert.equal(story.state.phase,'complete');assert(roof.canVisit(125,0),'The hidden child leaves no invisible collision');assert(!story.reachSummit(),'A completed event stays completed');
for(const p of leapSamples)if(p.x-5.25<15.8&&p.x+4.3>15.8)assert(p.y>roof.height+1.35,'The complete child clears the courtyard balustrade');
assert(leapSamples.some(p=>p.x<2&&p.y<20),'The child actually descends into the crater');
assert(!story.replay({x:125,z:0,y:34.195}),'Replay never places the child on the visitor');assert(story.replay(visitor));
for(let i=0;i<40;i++)tick();assert.equal(story.state.phase,'crawl');visitor.x=120;visitor.z=0;const prior=roof.state.progress;tick();assert(story.state.waiting);tick();assert.equal(roof.state.progress,prior,'The child waits instead of pushing a visitor');visitor.x=125;visitor.z=10;
story.finish();assert.equal(story.state.phase,'complete');assert(!infant.visible);assert(!mountain.crawling);assert(!volcano.getObjectByName('Summit transformation light').visible);
assert(story.replay(visitor,true));assert.equal(story.state.phase,'complete','Reduced motion reaches the same final tableau without the leap');
assert(story.replay(visitor));tick(.05,{mode:'city'});assert.equal(story.state.phase,'complete','Leaving the sequence resolves it cleanly');
assert(story.replay(visitor));story.follow(true);const pose=JSON.stringify(visitor),camera=new T.PerspectiveCamera();camera.position.set(144,34.195,0);story.updateCamera(camera,.05);assert.notEqual(camera.position.x,144);assert.equal(JSON.stringify(visitor),pose,'Following never teleports the visitor');story.follow(false);
story.setMode('explore');assert(infant.visible);assert(figure.visible);assert.equal(roof.state.progress,0);assert.equal(infant.rotation.z,0);assert.equal(story.state.phase,'explore');
story.dispose();roof.dispose();console.log('PASS: optional summit event, ordered crawl/leap/reveal, courtyard clearance, yielding, replay, skip, modal pause, reduced motion, free camera and unchanged exploration.');
