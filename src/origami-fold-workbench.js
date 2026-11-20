import {ORIGAMI_LESSONS,lessonStates,applyPaperFold} from './origami-lessons.js';

// Exact flat-fold lessons only. Milestone boat/crane sketches are deliberately
// excluded: this workbench never morphs a square into a finished animal model.
const EPS=1e-8,ids=['dog','cat'],lessons=new Map(ORIGAMI_LESSONS.filter(l=>ids.includes(l.id)).map(l=>[l.id,l]));
const cross=(p,a,b)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
const area2=points=>Math.abs(points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
function clean(points){return points.filter((p,i)=>!i||Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1])>EPS).filter((p,i,a)=>i!==a.length-1||Math.hypot(p[0]-a[0][0],p[1]-a[0][1])>EPS);}
function clip(points,a,b,sign){const out=[];for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length],u=cross(p,a,b)*sign,v=cross(q,a,b)*sign;if(u>=-EPS)out.push([...p]);if(u>EPS&&v<-EPS||u<-EPS&&v>EPS){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return clean(out);}
const initial=()=>[{points:[[0,-1],[1,0],[0,1],[-1,0]],front:false}];
const kind=step=>step.fold?'fold':step.crease?'crease-and-unfold':step.finish?'finish':'setup';
export const FOLD_WORKBENCH_LESSONS=Object.freeze(ids.map(id=>{const l=lessons.get(id);return Object.freeze({id,name:l.name,model:l.model,color:l.color,source:l.source,stepCount:l.steps.length,steps:Object.freeze(l.steps.map((s,index)=>Object.freeze({index,kind:kind(s),motion:!!(s.fold||s.crease)})))});}));
const compiled=new Map();
function lessonStep(id,index){const lesson=lessons.get(id);if(!lesson)throw new RangeError('The 3D fold workbench supports dog and cat lessons only.');if(!Number.isInteger(index)||index<0||index>=lesson.steps.length)throw new RangeError('Invalid origami step.');const key=id+':'+index;if(compiled.has(key))return compiled.get(key);
 const states=lessonStates(lesson),step=lesson.steps[index],before=index?states[index-1]:initial(),fold=step.fold??(step.crease?{a:[step.crease[0],step.crease[1]],b:[step.crease[2],step.crease[3]],tip:[1,0]}:null),fixed=[],moving=[];
 if(fold){const sign=Math.sign(cross(fold.tip,fold.a,fold.b));if(!sign)throw new Error('A fold needs a moving side away from its crease.');for(const[layerIndex,layer]of before.entries()){
   if(fold.topLayers&&layerIndex<before.length-fold.topLayers){fixed.push({id:layerIndex+':fixed',sourceLayer:layerIndex,reference:layer.points.map(p=>[...p]),frontAtStart:layer.front,moving:false});continue;}
   for(const[move,target]of[[false,fixed],[true,moving]]){const points=clip(layer.points,fold.a,fold.b,move?sign:-sign);if(points.length>=3&&area2(points)>EPS)target.push({id:layerIndex+(move?':moving':':fixed'),sourceLayer:layerIndex,reference:points,frontAtStart:layer.front,moving:move});}
  }
  moving.reverse();
 }else for(const[i,layer]of before.entries())fixed.push({id:i+':fixed',sourceLayer:i,reference:layer.points.map(p=>[...p]),frontAtStart:layer.front,moving:false});
 const panels=fold?.behind?[...moving,...fixed]:[...fixed,...moving],result={lesson,step,fold,panels,before,after:states[index]};compiled.set(key,result);return result;
}
// Rodrigues rotation about the crease in the sheet's XZ plane. A front fold
// lifts the selected half above the plane; a behind fold goes below it.
export function rotatePaperPoint(point,fold,angle){const[a,b]=[fold.a,fold.b],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),ux=dx/length,uz=dz/length,qx=point[0]-a[0],qz=point[1]-a[1],dot=ux*qx+uz*qz,c=Math.cos(angle),s=Math.sin(angle);return[a[0]+qx*c+ux*dot*(1-c),(uz*qx-ux*qz)*s,a[1]+qz*c+uz*dot*(1-c)];}
function creaseSpan(panels,fold){const points=[];for(const panel of panels)for(const p of panel.reference)if(Math.abs(cross(p,fold.a,fold.b))<EPS)points.push(p);if(points.length<2)return null;const dx=fold.b[0]-fold.a[0],dz=fold.b[1]-fold.a[1],t=p=>(p[0]-fold.a[0])*dx+(p[1]-fold.a[1])*dz;points.sort((a,b)=>t(a)-t(b));return{a:[points[0][0],0,points[0][1]],b:[points.at(-1)[0],0,points.at(-1)[1]]};}
export function foldFrame(lessonId='dog',step=0,progress=0){if(!Number.isFinite(progress))throw new TypeError('Fold progress must be finite.');progress=Math.max(0,Math.min(1,progress));const data=lessonStep(lessonId,step),{fold}=data,temporary=!!data.step.crease,phase=temporary?1-Math.abs(2*progress-1):progress,sign=fold?Math.sign(cross(fold.tip,fold.a,fold.b)):0,angle=fold?(fold.behind?sign:-sign)*Math.PI*phase:0;
 // A guide crease ends reopened, so the completed diagram's unchanged layers
 // are retained exactly rather than being presented as an extra closed fold.
 const raw=temporary&&(progress===0||progress===1)?data.before.map((l,i)=>({id:i+':fixed',reference:l.points,moving:false,frontAtStart:l.front})):data.panels;
 const panels=raw.map((p,layer)=>({...p,layer,reference:p.reference.map(q=>[...q]),points:p.reference.map(q=>p.moving?rotatePaperPoint(q,fold,angle):[q[0],0,q[1]])}));
 const span=fold?creaseSpan(data.panels,fold):null,hinge=span?{...span,angle,axis:[(fold.b[0]-fold.a[0])/Math.hypot(fold.b[0]-fold.a[0],fold.b[1]-fold.a[1]),0,(fold.b[1]-fold.a[1])/Math.hypot(fold.b[0]-fold.a[0],fold.b[1]-fold.a[1])],behind:!!fold.behind}:null;let cue=null;
 if(fold&&span&&phase<.999999){const target=temporary&&progress>=.5?0:(fold.behind?sign:-sign)*Math.PI,remaining=target-angle;if(Math.abs(remaining)>.025){const tip=fold.tip,path=Array.from({length:25},(_,i)=>rotatePaperPoint(tip,fold,angle+remaining*i/24));cue={path,reverse:temporary&&progress>=.5};}}
 return{lessonId,step,progress,kind:kind(data.step),motion:!!fold,angle,phase,panels,hinge,cue,area:panels.reduce((sum,p)=>sum+area2(p.reference),0),color:data.lesson.color,flat:panels.every(p=>p.points.every(q=>Math.abs(q[1])<1e-7)),scope:'One zero-thickness sheet with rigid panels and ideal hinges; no paper stiffness, thickness or collision simulation.'};
}

export const FOLD_WORKBENCH_MOUNT=Object.freeze({height:1.3,tilt:55*Math.PI/180});
export function mountedPaperPoint(p){const c=Math.cos(FOLD_WORKBENCH_MOUNT.tilt),s=Math.sin(FOLD_WORKBENCH_MOUNT.tilt);return[p[0],FOLD_WORKBENCH_MOUNT.height+p[1]*c-p[2]*s,p[1]*s+p[2]*c];}

export function buildFoldWorkbench(T){
 const group=new T.Group();group.name='Origami · one-sheet 3D construction workbench';const paperPivot=new T.Group();paperPivot.name='Inclined exact-fold paper plane';paperPivot.position.y=FOLD_WORKBENCH_MOUNT.height;paperPivot.rotation.x=FOLD_WORKBENCH_MOUNT.tilt;group.add(paperPivot);
 const owned=new Set(),own=o=>(owned.add(o),o),capacity=8192,positions=new Float32Array(capacity*3),normals=new Float32Array(capacity*3),layers=new Float32Array(capacity),biasNormals=new Float32Array(capacity*3),geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('normal',new T.BufferAttribute(normals,3));geometry.setAttribute('paperLayer',new T.BufferAttribute(layers,1));geometry.setAttribute('paperBiasNormal',new T.BufferAttribute(biasNormals,3));geometry.setDrawRange(0,0);
 const bias={value:0},paperMaterial=(color,side)=>{const m=own(new T.MeshLambertMaterial({color,side,depthFunc:T.LessEqualDepth}));m.onBeforeCompile=shader=>{shader.uniforms.foldLayerBias=bias;shader.vertexShader='attribute float paperLayer;\nattribute vec3 paperBiasNormal;\nuniform float foldLayerBias;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec3 sheetNormal=normalize(mat3(modelViewMatrix)*paperBiasNormal);\nfloat sheetFacing=sign(dot(sheetNormal,-mvPosition.xyz));\ngl_Position.z-=sheetFacing*paperLayer*foldLayerBias*gl_Position.w;');};m.customProgramCacheKey=()=> 'origami-zero-thickness-layers-v1';return m;};
 const front=paperMaterial(0xce9b63,T.FrontSide),back=paperMaterial(0xfff9e9,T.BackSide);const frontMesh=new T.Mesh(geometry,front),backMesh=new T.Mesh(geometry,back);frontMesh.name='Paper coloured face';backMesh.name='Paper white reverse';paperPivot.add(frontMesh,backMesh);
 const line=(name,color,size)=>{const g=own(new T.BufferGeometry());g.setAttribute('position',new T.BufferAttribute(new Float32Array(size*3),3));g.setDrawRange(0,0);const m=own(new T.LineBasicMaterial({color})),mesh=new T.LineSegments(g,m);mesh.name=name;paperPivot.add(mesh);return mesh;},edges=line('Actual polygon and crease edges',0x3d554b,4096),crease=line('Selected real hinge',0xb64c37,2),cueLine=line('Hinge rotation direction cue',0xb64c37,64);
 const cueTip=new T.Mesh(own(new T.ConeGeometry(.045,.15,8)),own(new T.MeshBasicMaterial({color:0xb64c37})));cueTip.name='Fold direction arrow';paperPivot.add(cueTip);
 // The frame stays outside the animated sheet footprint. Its inclined outline
 // and actual feet/legs explain why a behind fold clears the table surface.
 const metal=own(new T.MeshLambertMaterial({color:0x6e8278})),barGeometry=own(new T.CylinderGeometry(.025,.025,1,8)),barItems=[],bar=(a,b)=>barItems.push([a,b]);
 for(const x of[-1.18,1.18]){bar([x,.045,-.65],[x,.045,.72]);bar([x,.045,-.5],mountedPaperPoint([x,0,-1.1]));bar(mountedPaperPoint([x,0,-1.1]),mountedPaperPoint([x,0,1.1]));}
 bar([-1.18,.045,-.5],[1.18,.045,-.5]);for(const v of[-1.1,1.04])bar(mountedPaperPoint([-1.18,0,v]),mountedPaperPoint([1.18,0,v]));
 const support=new T.InstancedMesh(barGeometry,metal,barItems.length),stamp=new T.Object3D();support.name='Supported inclined folding cradle';barItems.forEach(([a,b],i)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);stamp.position.copy(av.add(bv).multiplyScalar(.5));stamp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());stamp.scale.set(1,delta.length(),1);stamp.updateMatrix();support.setMatrixAt(i,stamp.matrix);});support.instanceMatrix.needsUpdate=true;support.computeBoundingSphere();group.add(support);
 let disposed=false,current=null;
 function writeLine(mesh,points){const a=mesh.geometry.attributes.position;let n=0;for(const p of points)a.array.set(p,n++*3);a.needsUpdate=true;mesh.geometry.setDrawRange(0,n);mesh.geometry.computeBoundingSphere();}
 function set({lessonId='dog',step=0,progress=0,yaw=0}={}){if(disposed)throw new Error('The fold workbench has been disposed.');if(!Number.isFinite(yaw))throw new TypeError('Workbench yaw must be finite.');const frame=foldFrame(lessonId,step,progress);group.rotation.y=yaw;front.color.set(frame.color);let count=0;const outline=[];
  for(const p of frame.panels){const points=p.points,closed=frame.phase>.9999999,axis=frame.hinge?.axis??[1,0,0],bn=p.moving&&!closed?[-axis[2]*Math.sin(frame.angle),Math.cos(frame.angle),axis[0]*Math.sin(frame.angle)]:[0,1,0];for(let i=1;i<points.length-1;i++){const a=new T.Vector3(...points[0]),b=new T.Vector3(...points[i]),c=new T.Vector3(...points[i+1]),normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize();for(const v of[a,b,c]){if(count>=capacity)throw new RangeError('Fold geometry exceeded its bounded buffer.');positions.set(v.toArray(),count*3);normals.set(normal.toArray(),count*3);biasNormals.set(bn,count*3);layers[count++]=closed?p.layer:p.sourceLayer;}}for(let i=0;i<points.length;i++)outline.push(points[i],points[(i+1)%points.length]);}
  geometry.setDrawRange(0,count);for(const k of['position','normal','paperLayer','paperBiasNormal'])geometry.attributes[k].needsUpdate=true;geometry.computeBoundingSphere();bias.value=2e-6;writeLine(edges,outline);writeLine(crease,frame.hinge?[frame.hinge.a,frame.hinge.b]:[]);const path=frame.cue?.path??[],segments=[];for(let i=1;i<path.length;i++)segments.push(path[i-1],path[i]);writeLine(cueLine,segments);cueTip.visible=path.length>1;if(cueTip.visible){const a=new T.Vector3(...path.at(-2)),b=new T.Vector3(...path.at(-1)),direction=b.clone().sub(a).normalize();cueTip.position.copy(b);cueTip.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction);}current=frame;group.userData.foldFrame={lessonId,step,progress:frame.progress,motion:frame.motion};return frame;
 }
 set();return{group,paperPivot,set,get frame(){return current;},dispose(){if(disposed)return;disposed=true;group.removeFromParent();support.dispose();for(const r of owned)r.dispose();group.clear();}};
}
