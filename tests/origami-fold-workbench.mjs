import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ORIGAMI_LESSONS,lessonStates,applyPaperFold} from '../src/origami-lessons.js';
import {FOLD_WORKBENCH_LESSONS,foldFrame,mountedPaperPoint,buildFoldWorkbench} from '../src/origami-fold-workbench.js';
const near=(a,b,e=1e-8)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`),distance=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
const area3=points=>{const a=new T.Vector3(...points[0]);let area=0;for(let i=1;i<points.length-1;i++)area+=new T.Vector3(...points[i]).sub(a).cross(new T.Vector3(...points[i+1]).sub(a)).length()/2;return area;};
const canonical=points=>{const keys=points.map(p=>p.map(n=>Math.round(n*1e8)/1e8).join(','));return[...new Set(keys)].sort();};
let frames=0,edges=0,minY=Infinity,maxY=-Infinity,maxRadius=0;
assert.deepEqual(FOLD_WORKBENCH_LESSONS.map(l=>l.id),['dog','cat']);
for(const meta of FOLD_WORKBENCH_LESSONS){const lesson=ORIGAMI_LESSONS.find(l=>l.id===meta.id),states=lessonStates(lesson);assert.equal(meta.stepCount,lesson.steps.length);
 for(let step=0;step<meta.stepCount;step++){
  const source=lesson.steps[step],end=foldFrame(meta.id,step,1);assert.equal(end.motion,!!(source.fold||source.crease));assert.equal(end.panels.length,states[step].length);
  for(let i=0;i<end.panels.length;i++){const p=end.panels[i],expected=states[step][i];assert.deepEqual(canonical(p.points.map(([x,y,z])=>{near(y,0);return[x,z];})),canonical(expected.points),'Completed rigid folds agree with the existing exact diagrams');
   const a=new T.Vector3(...p.points[0]),b=new T.Vector3(...p.points[1]),c=new T.Vector3(...p.points[2]),normal=b.sub(a).cross(c.sub(a));if(Math.abs(normal.y)>1e-9)assert.equal(normal.y>0,expected.front,'Physical front/back winding matches the diagram layer');
  }
  if(source.fold)assert.deepEqual(states[step],applyPaperFold(step?states[step-1]:[{points:[[0,-1],[1,0],[0,1],[-1,0]],front:false}],source.fold));
  if(source.crease){near(foldFrame(meta.id,step,0).angle,0);near(Math.abs(foldFrame(meta.id,step,.5).angle),Math.PI);near(foldFrame(meta.id,step,1).angle,0);assert.deepEqual(foldFrame(meta.id,step,0).panels,foldFrame(meta.id,step,1).panels,'Guide crease reopens exactly');}
  for(let i=0;i<=100;i++){const frame=foldFrame(meta.id,step,i/100);near(frame.area,2);let total=0;for(const panel of frame.panels){total+=area3(panel.points);for(let j=0;j<panel.points.length;j++){const next=(j+1)%panel.points.length;near(distance(panel.points[j],panel.points[next]),distance(panel.reference[j],panel.reference[next]));edges++;const mounted=mountedPaperPoint(panel.points[j]);minY=Math.min(minY,mounted[1]);maxY=Math.max(maxY,mounted[1]);maxRadius=Math.max(maxRadius,Math.abs(mounted[0]),Math.abs(mounted[2]));assert(mounted[1]>.1&&mounted[1]<3,'Behind folds stay above the tabletop and below the roof');assert(Math.abs(mounted[0])<1.7&&Math.abs(mounted[2])<1.7);}}near(total,2);if(source.fold?.behind&&i===50)assert(frame.panels.some(p=>p.moving&&p.points.some(q=>q[1]<-.1)),'Behind fold genuinely moves behind the sheet');frames++;}
  const forward=Array.from({length:21},(_,i)=>foldFrame(meta.id,step,i/20));for(let i=20;i>=0;i--)assert.deepEqual(foldFrame(meta.id,step,i/20),forward[i],'Reversing the scrub is exact and history independent');
 }
}
assert.throws(()=>foldFrame('boat'),RangeError);assert.throws(()=>foldFrame('bird'),RangeError);assert.throws(()=>foldFrame('dog',-1),RangeError);assert.throws(()=>foldFrame('cat',7),RangeError);assert.throws(()=>foldFrame('dog',0,NaN),TypeError);
const untouched=foldFrame('dog',3,.5);untouched.panels[0].points[0][0]=999;assert.notEqual(foldFrame('dog',3,.5).panels[0].points[0][0],999,'Callers cannot corrupt the cached construction');
const built=buildFoldWorkbench(T);let draws=0,disposed=0;built.group.traverse(o=>{if(o.isMesh||o.isLine)draws++;o.geometry?.addEventListener('dispose',()=>disposed++);});assert(draws<12,`Workbench uses ${draws} draws`);assert(built.paperPivot);const identities=[];built.group.traverse(o=>{if(o.geometry)identities.push(o.geometry);});
for(const id of['dog','cat'])for(let step=0;step<7;step++)for(const progress of[0,.25,.5,.75,1]){const frame=built.set({lessonId:id,step,progress,yaw:.4});near(built.group.rotation.y,.4);assert.equal(built.frame,frame);built.group.traverse(o=>{if(o.geometry)assert(o.geometry.attributes.position.array.every(Number.isFinite));});}
const after=[];built.group.traverse(o=>{if(o.geometry)after.push(o.geometry);});assert.deepEqual(after,identities,'Scrubbing reuses bounded geometry buffers');const paper=built.group.getObjectByName('Paper coloured face'),shader={uniforms:{},vertexShader:'#include <project_vertex>'};paper.material.onBeforeCompile(shader);assert(shader.vertexShader.includes('paperBiasNormal')&&shader.vertexShader.includes('gl_Position.z-='),'Coplanar readability uses depth bias, not paper deformation');assert(shader.uniforms.foldLayerBias);
built.dispose();assert.equal(built.group.children.length,0);assert(disposed>0);built.dispose();assert.throws(()=>built.set(),/disposed/);
console.log(`PASS 3D origami: ${frames} rigid fold frames / ${edges} panel edges, exact dog/cat diagram endpoints, guide fold-and-unfold, behind-fold clearance Y${minY.toFixed(3)}..${maxY.toFixed(3)} and ±${maxRadius.toFixed(3)} footprint, reversible scrub, ${draws} draws and owned cleanup.`);
