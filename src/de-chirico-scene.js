import {INHABITED_MIND as H,MIND_PALETTE as C,MIND_TOWERS,MIND_COLUMNS,MIND_FIGURES,MIND_LOOP,mindCanStand,mindObstacles} from './de-chirico-model.js?v=inhabited-mind-20261121';

// New geometry, original procedural stone grain, no reproduced artwork/scan.
export function buildInhabitedMind(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group(),exhibit=new T.Group();group.name='The inhabited mind · original de Chirico interpretation';exhibit.name='Approved sculpture court · two figures and four towers';exhibit.position.set(H.x,H.y,H.z);group.add(exhibit);
 const owned=new Set(),own=r=>(owned.add(r),r),targets=[],batches=new Map(),stamp=new T.Object3D();let disposed=false;
 const geometry={box:own(new T.BoxGeometry(1,1,1)),sphere:own(new T.SphereGeometry(1,22,14)),beam:own(new T.CylinderGeometry(.11,.15,1,8)),disc:own(new T.CylinderGeometry(1,1,1,24))};
 function stoneTexture(){const c=canvas();c.width=c.height=256;const ctx=c.getContext?.('2d');if(!ctx)return null;ctx.fillStyle='#f5f0e3';ctx.fillRect(0,0,256,256);let seed=2849;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);for(let i=0;i<1900;i++){const n=Math.floor(150+random()*85);ctx.fillStyle=`rgba(${n},${n-5},${n-12},.13)`;ctx.fillRect(random()*256,random()*256,random()*1.5+.3,random()*1.5+.3);}const map=own(new T.CanvasTexture(c));map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(2,2);map.colorSpace=T.SRGBColorSpace;return map;}
 const grain=stoneTexture(),materials={};
 for(const [key,color]of Object.entries(C))materials[key]=own(new T.MeshStandardMaterial({color,roughness:key==='brass'?.5:.88,metalness:key==='brass'?.35:0,map:['joint','ochre','brass'].includes(key)?null:grain}));
 const mesh=(geo,mat,name,parent=exhibit)=>{const m=new T.Mesh(geo,mat);m.name=name;m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 function instance(geo,mat,position,scale=[1,1,1],quaternion=null){stamp.position.set(...position);stamp.scale.set(...scale);stamp.quaternion.identity();if(quaternion)stamp.quaternion.copy(quaternion);stamp.updateMatrix();const key=geo.uuid+mat.uuid;if(!batches.has(key))batches.set(key,{geo,mat,matrices:[]});batches.get(key).matrices.push(stamp.matrix.clone());}
 const box=(w,h,d,x,y,z,key)=>instance(geometry.box,materials[key],[x,y,z],[w,h,d]);
 const ball=(x,y,z,sx,sy,sz,key='ivory')=>instance(geometry.sphere,materials[key],[x,y,z],[sx,sy,sz]);
 function bone(a,b,width=1,key='ochre'){const av=new T.Vector3(...a),bv=new T.Vector3(...b),direction=bv.clone().sub(av),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction.clone().normalize());instance(geometry.beam,materials[key],av.clone().add(bv).multiplyScalar(.5).toArray(),[width,direction.length(),width],q);}
 function hinge(x,y,z,r=.16){const q=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2);instance(geometry.disc,materials.joint,[x,y,z],[r,.12,r],q);instance(geometry.disc,materials.ochre,[x,y,z-.073],[r*.85,.035,r*.85],q);instance(geometry.disc,materials.ivoryShade,[x,y,z-.096],[r*.23,.038,r*.23],q);}
 // Real low stone plinth. Its top is flush with the source walking floor.
 box(H.width,.12,H.depth,0,-.06,0,'stone');box(13.14,.065,10.14,0,-.155,0,'stoneEdge');
 for(const x of[-6.3,6.3])box(.07,.012,9.55,x,.006,0,'stoneEdge');for(const z of[-4.78,4.78])box(12.67,.012,.07,0,.006,z,'stoneEdge');
 // Fine joints read as masonry, rather than a new raised obstacle field.
 for(let x=-5.9;x<6.2;x+=1.18)box(.012,.006,9.48,x,.003,0,'stoneEdge');for(let z=-4.7;z<4.8;z+=1.17)box(12.62,.006,.012,0,.003,z,'stoneEdge');
 for(const c of MIND_COLUMNS){
  box(.76,c.height,.76,c.x,c.height/2,c.z,'column');box(1.02,.22,1.02,c.x,.11,c.z,'stoneEdge');box(.91,.11,.91,c.x,.3,c.z,'band');
  for(const y of[.84,c.height*.35,c.height-.93])box(.86,.16,.86,c.x,y,c.z,'band');
  box(.98,.24,.98,c.x,c.height+.06,c.z,'band');box(1.04,.07,1.04,c.x,c.height+.215,c.z,'stoneEdge');
 }
 box(4.7,.15,1.69,0,.075,.94,'stoneEdge');box(4.55,.06,1.56,0,.18,.94,'stone');
 function archHole(shape,cx,bottom,width,height){const r=width/2,spring=bottom+height-r,path=new T.Path();path.moveTo(cx-r,bottom);path.lineTo(cx+r,bottom);path.lineTo(cx+r,spring);path.absarc(cx,spring,r,0,Math.PI,false);path.lineTo(cx-r,bottom);shape.holes.push(path);}
 const towers=[];
 for(const c of MIND_TOWERS){
  // Ground arch reaches the bottom edge: a true open portal, not a painted black door.
  // Build as two jambs + spandrel outline so no invalid hole touches an outer ring.
  const wall=new T.Shape(),r=c.doorWidth/2,spring=c.doorHeight-r;
  wall.moveTo(-c.width/2,0);wall.lineTo(-c.width/2,c.height);wall.lineTo(c.width/2,c.height);wall.lineTo(c.width/2,0);wall.lineTo(r,0);wall.lineTo(r,spring);wall.absarc(0,spring,r,0,Math.PI,false);wall.lineTo(-r,0);wall.closePath();
  archHole(wall,0,c.windowY,.235,c.windowHeight);
  const g=own(new T.ExtrudeGeometry(wall,{depth:c.depth,bevelEnabled:false,curveSegments:14}));
  const tower=mesh(g,materials[c.color],'Square '+c.id+' tower · open arched portal');tower.position.set(c.x,.215,c.z-c.depth/2);tower.userData={mindTower:c.id,doorWidth:c.doorWidth,doorHeight:c.doorHeight};towers.push(tower);
  // A solid inner backing makes the upper opening a recessed window, not a decal.
  box(.255,c.windowHeight+.02,.07,c.x,c.windowY+c.windowHeight/2+.215,c.z+.12,'column');
  box(c.width+.13,.10,c.depth+.13,c.x,c.height+.245,c.z,'stoneEdge');box(c.width+.2,.065,c.depth+.2,c.x,c.height+.325,c.z,'stone');
  for(const side of[-1,1])box(.035,c.height-.12,.026,c.x+side*(c.width/2-.055),c.height/2+.215,c.z-c.depth/2-.015,c.color);
 }
 function robeGeometry(){const rings=[[.31,.88,.54],[.55,.85,.53],[1.3,.72,.46],[2.15,.56,.38],[2.64,.42,.33],[2.8,.25,.24]],n=20,positions=[],colors=[],uv=[],indices=[];
  for(const [y,rx,rz]of rings)for(let i=0;i<n;i++){const angle=i/n*Math.PI*2,fold=i%2?1:.984;positions.push(Math.cos(angle)*rx*fold,y,Math.sin(angle)*rz*fold);uv.push(i/n,y/2.8);const shade=i%2?.97:1;colors.push(shade,shade,shade);}
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+(i+1)%n,d=(j+1)*n+i;indices.push(a,d,b,b,d,c);}for(let i=1;i<n-1;i++){indices.push(0,i,i+1);const top=(rings.length-1)*n;indices.push(top,top+i+1,top+i);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return own(g);
 }
 const robe=robeGeometry(),robeMaterial=own(materials.ivory.clone());robeMaterial.vertexColors=true;robeMaterial.flatShading=true;
 const figures=[];
 for(const f of MIND_FIGURES){
  box(2.18,.15,1.58,f.x,.09,f.z,'stoneEdge');box(2.05,.055,1.46,f.x,.192,f.z,'stone');
  const body=mesh(robe,robeMaterial,'Faceted ivory robe · '+f.id);body.position.set(f.x,.04,f.z);body.userData.mindFigure=f.id;figures.push(body);
  // A ring of actual narrow folds continues beneath the robe hem.
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,x=f.x+Math.cos(a)*.75,z=f.z+Math.sin(a)*.43;box(.12,.14,.12,x,.26,z,i%3?'ivoryShade':'stoneEdge');}
  const neckA=[f.x,2.72,f.z],neckB=[f.x+f.side*.13,3.01,f.z];bone(neckA,neckB,1.3,'ivoryShade');
  const head=mesh(geometry.sphere,materials.ivory,'Inclined faceless oval head · '+f.id);head.position.set(f.x+f.side*.17,3.36,f.z-.015);head.scale.set(.40,.62,.305);head.rotation.z=f.tilt;head.rotation.y=f.side*.13;head.userData.mindHead=f.id;
  // The presented arm has a shoulder, elbow and wrist, all with visible hinge pins.
  const shoulder=[f.x+f.side*.46,2.62,f.z-.26],elbow=[f.x+f.side*.99,1.94,f.z-.38],wrist=[f.x+f.side*1.62,1.84,f.z-.53];
  hinge(...shoulder,.19);bone(shoulder,elbow,1.14);hinge(...elbow,.145);bone(elbow,wrist,.85);hinge(...wrist,.108);
  // Upturned palm, four separate gently bent fingers and an opposing thumb.
  const palm=[f.x+f.side*1.80,1.86,f.z-.54];ball(...palm,.25,.075,.155,'ochre');
  for(let i=0;i<4;i++){const z=palm[2]-.108+i*.069,start=[palm[0]+f.side*.12,1.865,z],middle=[palm[0]+f.side*(.27+(i===1||i===2?.035:0)),1.89,z],end=[palm[0]+f.side*(.37+(i===1||i===2?.04:0)),1.925,z+.008];bone(start,middle,.25,'ivory');bone(middle,end,.21,'ivory');ball(...end,.031,.029,.03,'ivory');}
  const thumbA=[palm[0]-f.side*.08,1.86,palm[2]-.14],thumbB=[palm[0]+f.side*.02,1.91,palm[2]-.24],thumbC=[palm[0]+f.side*.15,1.95,palm[2]-.245];bone(thumbA,thumbB,.32,'ivory');bone(thumbB,thumbC,.25,'ivory');ball(...thumbC,.036,.032,.032,'ivory');
  // The quieter outside arm rests against the robe instead of repeating a gesture.
  const outer=[f.x-f.side*.45,2.57,f.z+.05],down=[f.x-f.side*.7,1.95,f.z+.07],rest=[f.x-f.side*.73,1.43,f.z-.02];hinge(...outer,.16);bone(outer,down,.9);hinge(...down,.12);bone(down,rest,.73);ball(rest[0],rest[1]-.1,rest[2],.10,.18,.09,'ivory');
 }
 // The main sightline stays empty: only a small low lectern sits at the right edge.
 const p=H.plaque;box(.12,.79,.12,p.x,.395,p.z,'brass');box(.52,.08,.45,p.x,.04,p.z,'stoneEdge');
 const plaqueCanvas=canvas();plaqueCanvas.width=1024;plaqueCanvas.height=616;const ctx=plaqueCanvas.getContext?.('2d');
 if(ctx){ctx.fillStyle='#eaddbe';ctx.fillRect(0,0,1024,616);ctx.strokeStyle='#8f7447';ctx.lineWidth=10;ctx.strokeRect(20,20,984,576);ctx.fillStyle='#2c3431';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='52px Georgia, serif';ctx.fillText('DE CHIRICO',512,112,900);ctx.font='46px Georgia, serif';ctx.fillText('THE INHABITED MIND',512,195,920);ctx.font='32px Georgia, serif';ctx.fillText('A walkable interpretation',512,279,900);ctx.font='29px Georgia, serif';ctx.fillText('Move around. Change the reading.',512,378,900);ctx.fillText('Original geometry · City of Ideas',512,466,900);}
 const map=own(new T.CanvasTexture(plaqueCanvas));map.colorSpace=T.SRGBColorSpace;const plaqueMaterial=own(new T.MeshBasicMaterial({map,side:T.DoubleSide,toneMapped:false}));
 const plaque=mesh(own(new T.PlaneGeometry(p.width,p.height)),plaqueMaterial,'The inhabited mind · low side plaque');plaque.position.set(p.x,p.y,p.z);plaque.rotation.set(Math.PI/4,Math.PI,0);plaque.userData={deChirico:true};targets.push(plaque);
 const backing=mesh(geometry.box,materials.brass,'Sloped plaque bronze edge');backing.position.copy(plaque.position);backing.rotation.copy(plaque.rotation);backing.scale.set(p.width+.06,p.height+.06,.045);backing.translateZ(-.027);
 // A small engraved eye marks the frontal composition without a barrier/sign.
 const eye=new T.Shape();eye.moveTo(-.39,0);eye.quadraticCurveTo(0,.24,.39,0);eye.quadraticCurveTo(0,-.24,-.39,0);const pupil=new T.Path();pupil.absarc(0,0,.084,0,Math.PI*2,true);eye.holes.push(pupil);
 const view=mesh(own(new T.ShapeGeometry(eye,24)),materials.brass,'Marked frontal viewpoint · eye inlay');view.rotation.x=-Math.PI/2;view.position.set(H.viewpoint.x,.016,H.viewpoint.z);view.receiveShadow=false;
 // Discrete inlay studs suggest the continuous perimeter route, all flush.
 for(let i=2;i<MIND_LOOP.length-2;i++){const v=MIND_LOOP[i];box(.075,.008,.075,v.x,.009,v.z,'brass');}
 for(const b of batches.values()){const m=own(new T.InstancedMesh(b.geo,b.mat,b.matrices.length));b.matrices.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.castShadow=true;m.receiveShadow=true;m.name='Shared sculpture details · '+b.matrices.length+' pieces';exhibit.add(m);}
 group.updateMatrixWorld(true);
 return{group,exhibit,targets,entry:{...H.entry},center:{x:H.x,z:H.z},towers,figures,viewpoint:{x:H.x+H.viewpoint.x,y:H.y,z:H.z+H.viewpoint.z},obstacles:mindObstacles(),canStand:mindCanStand,stats:{draws:batches.size+11,instances:[...batches.values()].reduce((s,b)=>s+b.matrices.length,0)},dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose?.();group.clear();targets.length=0;}};
}
