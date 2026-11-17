import {NIGHT_OBSERVATORY as C,observatoryRoofY,observatoryStairY} from './night-observatory-model.js?v=city-night-20261117';

export function buildNightObservatory(T){
 const group=new T.Group(),walking=new T.Group(),lamps=new T.Group(),owned=new Set(),own=o=>(owned.add(o),o),batches=new Map();group.name='Central observatory · a real stair under the curved glass sky';walking.name='Observatory deck, inner bridge and 80 real rising treads';group.add(walking,lamps);
 const mat=(color,extra={})=>own(new T.MeshLambertMaterial({color,...extra})),stone=mat(0xc7bca1),dark=mat(0x5e7275),brass=mat(0xb19a67),timber=mat(0x705b45),tubeMat=mat(0x526e76),glass=own(new T.MeshPhongMaterial({color:0xc2dfe2,transparent:true,opacity:.115,depthWrite:false,side:T.DoubleSide,forceSinglePass:true,shininess:90,specular:0x9fc9d1}));
 const mesh=(g,m,name,parent=group)=>{const o=new T.Mesh(own(g),m);o.name=name;parent.add(o);return o;};
 const beam=(a,b,r,m=brass)=>{const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p);if(d.length()<1e-7)return;const list=batches.get(m)||[];list.push({p:p.add(q).multiplyScalar(.5),q:new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize()),r,h:d.length()});batches.set(m,list);};
 const vertices=[],indices=[],quad=(a,b,c,d)=>{const i=vertices.length/3;vertices.push(...a,...b,...c,...d);indices.push(i,i+1,i+2,i,i+2,i+3);};
 const polar=(r,t,y)=>[r*Math.cos(t),y,-r*Math.sin(t)];
 function cap(a,b,y){const n=6;for(let j=0;j<n;j++){const u=a+(b-a)*j/n,v=a+(b-a)*(j+1)/n;quad(polar(C.stairInner,v,y),polar(C.stairInner,u,y),polar(C.stairOuter,u,y),polar(C.stairOuter,v,y));for(const r of[C.stairInner,C.stairOuter])quad(polar(r,u,y-.20),polar(r,v,y-.20),polar(r,v,y),polar(r,u,y));}quad(polar(C.stairInner,b,y),polar(C.stairOuter,b,y),polar(C.stairOuter,b,y+.125),polar(C.stairInner,b,y+.125));}
 for(let i=0;i<C.steps;i++)cap(i/C.steps*2*Math.PI,(i+1)/C.steps*2*Math.PI,observatoryStairY(i/C.steps*2*Math.PI));
 cap(0,C.landingEnd,C.deckY);
 const stairGeo=own(new T.BufferGeometry());stairGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));stairGeo.setIndex(indices);stairGeo.computeVertexNormals();const stair=mesh(stairGeo,stone,'80 real observatory treads and the exact post-turn landing',walking);
 const deck=mesh(new T.CylinderGeometry(C.deckRadius,C.deckRadius,.24,128),stone,'Central walkable observatory deck',walking);deck.position.y=C.deckY-.12;
 const shape=new T.Shape(),a=Math.asin(C.bridgeHalfWidth/C.bridgeOuter);shape.moveTo(C.bridgeInner,-C.bridgeHalfWidth);shape.lineTo(Math.sqrt(C.bridgeOuter**2-C.bridgeHalfWidth**2),-C.bridgeHalfWidth);shape.absarc(0,0,C.bridgeOuter,-a,a,false);shape.lineTo(C.bridgeInner,C.bridgeHalfWidth);shape.closePath();
 const bridge=mesh(new T.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:false,curveSegments:32}),stone,'Inner bridge with exact circular stair join',walking);bridge.rotation.x=-Math.PI/2;bridge.position.y=C.deckY-.22;
 // Floor is structural stone here; the original bird-flight installation can
 // lay its reassembled mosaic at y22.15 without changing these support surfaces.
 const rim=mesh(new T.TorusGeometry(C.deckRadius-.04,.075,8,128),brass,'Thin bronze edge of the central deck');rim.rotation.x=Math.PI/2;rim.position.y=C.deckY-.015;
 for(let i=0;i<96;i++){const a=i*Math.PI/48,b=(i+1)*Math.PI/48;if(Math.abs(Math.atan2(Math.sin((a+b)/2),Math.cos((a+b)/2)))<.25)continue;const p=t=>[7.15*Math.cos(t),C.deckY+1.04,7.15*Math.sin(t)];beam(p(a),p(b),.035);if(i%4===0)beam([7.15*Math.cos(a),C.deckY,7.15*Math.sin(a)],p(a),.032);}
 for(const z of[-C.bridgeHalfWidth,C.bridgeHalfWidth]){beam([7.25,C.deckY+1.04,z],[14.0,C.deckY+1.04,z],.035);for(const x of[7.35,9.5,11.65,13.8])beam([x,C.deckY,z],[x,C.deckY+1.04,z],.032);}
 for(let i=0;i<C.steps;i++){const a=i/C.steps*2*Math.PI,b=(i+1)/C.steps*2*Math.PI,y=observatoryStairY(a);for(const r of[14.35,17.65]){if(r>16&&a<.14)continue;beam(polar(r,a,y+1.04),polar(r,b,y+1.04),.032);if(i%4===0)beam(polar(r,a,y),polar(r,a,y+1.04),.03);}}
 for(const r of[14.35,17.65])for(let i=0;i<8;i++){const a=i/8*C.landingEnd,b=(i+1)/8*C.landingEnd;if(r<16&&(a+b)/2<.115)continue;beam(polar(r,a,C.deckY+1.04),polar(r,b,C.deckY+1.04),.032);}
 beam(polar(14.35,C.landingEnd,C.deckY+1.04),polar(17.65,C.landingEnd,C.deckY+1.04),.035);
 // Curved glazing continues from the Faculty eaves to a genuine hemisphere
 // over the central well. No opaque disk is inserted above the observatory.
 const roofV=[],roofI=[],surface=(ri,ro,radial,angular,height)=>{const start=roofV.length/3;for(let j=0;j<=angular;j++){const a=j/angular*2*Math.PI;for(let i=0;i<=radial;i++){const r=ri+(ro-ri)*i/radial;roofV.push(r*Math.cos(a),height(r),r*Math.sin(a));}}for(let j=0;j<angular;j++)for(let i=0;i<radial;i++){const k=start+j*(radial+1)+i,l=k+radial+1;roofI.push(k,k+1,l,k+1,l+1,l);}};
 surface(C.roofJoin,C.roofOuter,24,128,observatoryRoofY);surface(0,C.roofJoin,24,128,observatoryRoofY);
 const roofGeo=own(new T.BufferGeometry());roofGeo.setAttribute('position',new T.Float32BufferAttribute(roofV,3));roofGeo.setIndex(roofI);roofGeo.computeVertexNormals();const roof=mesh(roofGeo,glass,'Curved transparent Faculty roof and central observatory dome');roof.renderOrder=1;
 for(let i=0;i<24;i++){const a=i/24*2*Math.PI;for(const[ri,ro,n]of[[0,C.roofJoin,20],[C.roofJoin,C.roofOuter,20]])for(let j=0;j<n;j++){const r=ri+(ro-ri)*j/n,s=ri+(ro-ri)*(j+1)/n;beam([r*Math.cos(a),observatoryRoofY(r)+.018,r*Math.sin(a)],[s*Math.cos(a),observatoryRoofY(s)+.018,s*Math.sin(a)],.035);}}
 for(const r of[7.2,15,28,42,54])for(let i=0;i<96;i++){const a=i*Math.PI/48,b=(i+1)*Math.PI/48,y=observatoryRoofY(r)+.016;beam([r*Math.cos(a),y,r*Math.sin(a)],[r*Math.cos(b),y,r*Math.sin(b)],.025);}
 // A full-sized fork-mounted reflector is the centre of the room. Its real
 // azimuth and elevation axes agree with pointTelescope; the observing controls
 // remain below the moving tube and outside the visitor's circulation line.
 const station=new T.Group();station.name='Observatory telescope · learn the real sky';station.position.set(C.station.x,C.deckY,C.station.z);group.add(station);
 const scopeWhite=mat(0xcbd0c5),scopeDark=mat(0x263e47,{side:T.DoubleSide}),objective=own(new T.MeshPhongMaterial({color:0x5d8c9e,specular:0xc0edf2,shininess:115,transparent:true,opacity:.38,depthWrite:false,side:T.DoubleSide,forceSinglePass:true}));
 const baseParts=new Map(),forkParts=new Map(),tubeParts=new Map(),partStamp=new T.Object3D();
 function part(list,g,m,position=[0,0,0],rotation=[0,0,0]){partStamp.position.set(...position);partStamp.rotation.set(...rotation);partStamp.scale.set(1,1,1);partStamp.updateMatrix();g.applyMatrix4(partStamp.matrix);const b=list.get(m)||{vertices:[],indices:[]},offset=b.vertices.length/3;b.vertices.push(...g.attributes.position.array);if(g.index)b.indices.push(...Array.from(g.index.array,i=>i+offset));else for(let i=0;i<g.attributes.position.count;i++)b.indices.push(offset+i);list.set(m,b);g.dispose();}
 function finishParts(list,parent,name){const result=[];for(const[m,p]of list){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p.vertices,3));g.setIndex(p.indices);g.computeVertexNormals();g.computeBoundingSphere();const o=mesh(g,m,name,parent);result.push(o);}return result;}
 const cylinder=(radius,height)=>new T.CylinderGeometry(radius,radius,height,32);
 part(baseParts,new T.CylinderGeometry(.71,.80,.20,32),scopeDark,[0,.10,0]);
 part(baseParts,new T.CylinderGeometry(.43,.57,1.20,24),scopeWhite,[0,.73,0]);
 part(baseParts,cylinder(.60,.075),brass,[0,1.29,0]);
 part(baseParts,cylinder(.68,.16),scopeDark,[0,1.39,0]);
 // The nearby console is a physical instrument control, with no fake live sky
 // painted onto it. The actual catalogue/map opens through the existing action.
 part(baseParts,new T.BoxGeometry(.18,1.03,.18),scopeDark,[1.02,.515,.42]);
 part(baseParts,new T.BoxGeometry(.66,.16,.46),scopeWhite,[1.02,1.13,.42],[-.30,0,0]);
 part(baseParts,new T.BoxGeometry(.48,.018,.28),scopeDark,[1.02,1.226,.405],[-.30,0,0]);
 for(let i=0;i<3;i++)part(baseParts,cylinder(.041,.035),brass,[.83+i*.19,1.24,.61]);
 finishParts(baseParts,station,'Batched reflector pier and observer control console');
 const azimuth=new T.Group();azimuth.name='Reflector azimuth turntable and split fork';station.add(azimuth);
 part(forkParts,new T.BoxGeometry(1.52,.18,.67),scopeWhite,[0,1.50,0]);
 const forkShape=new T.Shape();forkShape.moveTo(-.31,1.41);forkShape.lineTo(.31,1.41);forkShape.lineTo(.23,2.42);forkShape.quadraticCurveTo(.22,2.69,0,2.69);forkShape.quadraticCurveTo(-.22,2.69,-.23,2.42);forkShape.closePath();
 for(const sign of[-1,1]){
  part(forkParts,new T.ExtrudeGeometry(forkShape,{depth:.16,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:2,curveSegments:12}),scopeWhite,[sign*.69-.08,0,0],[0,Math.PI/2,0]);
  part(forkParts,cylinder(.235,.23),brass,[sign*.63,2.45,0],[0,0,Math.PI/2]);
  part(forkParts,cylinder(.117,.045),scopeDark,[sign*.775,2.45,0],[0,0,Math.PI/2]);
  part(forkParts,new T.TorusGeometry(.185,.023,6,28),brass,[sign*.805,2.45,0],[0,Math.PI/2,0]);
 }
 finishParts(forkParts,azimuth,'Batched twin fork arms, brass trunnions and adjustment wheels');
 const tubePivot=new T.Group();tubePivot.name='Reflector elevation axis · 2.45 metres above deck';tubePivot.position.y=2.45;azimuth.add(tubePivot);
 // Local +Y is the optical axis. Nothing projects behind y=-.4, and all tube
 // hardware remains within .518m transversely: horizontal aiming is overhead.
 part(tubeParts,new T.CylinderGeometry(.485,.465,4.2,40,1,true),scopeWhite,[0,1.7,0]);
 part(tubeParts,new T.CylinderGeometry(.443,.443,4.08,40,1,true),scopeDark,[0,1.66,0]);
 for(const y of[-.28,.14,2.65,3.735])part(tubeParts,cylinder(y>3?.50:.496,y>3?.13:.105),brass,[0,y,0]);
 // Open front corrector with a central secondary mirror and restrained spider.
 part(tubeParts,new T.TorusGeometry(.495,.023,8,40),scopeDark,[0,3.806,0],[Math.PI/2,0,0]);
 part(tubeParts,new T.CircleGeometry(.44,40),objective,[0,3.805,0],[-Math.PI/2,0,0]);
 part(tubeParts,cylinder(.105,.075),scopeDark,[0,3.76,0]);
 for(const turn of[0,Math.PI/2])part(tubeParts,new T.BoxGeometry(.80,.025,.016),scopeDark,[0,3.75,0],[0,turn,0]);
 part(tubeParts,new T.CircleGeometry(.459,40),scopeDark,[0,-.395,0],[-Math.PI/2,0,0]);
 // A short rear diagonal and eyepiece sit within the safe transverse envelope.
 const opticalSegment=(a,b,r)=>{const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p),g=new T.CylinderGeometry(r,r,d.length(),16);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()));part(tubeParts,g,scopeDark,p.add(q).multiplyScalar(.5).toArray());};
 opticalSegment([0,-.26,0],[.16,-.26,.20],.06);opticalSegment([.16,-.26,.20],[.23,-.26,.30],.07);
 const moving=finishParts(tubeParts,tubePivot,'Batched four-metre reflector tube, corrector and rear eyepiece');for(const o of moving)o.userData={nightObservatory:'telescope'};const tube=moving.find(o=>o.material===scopeWhite);tube.name='Four-metre fork-mounted reflector · constellation instrument';
 const telescope={group:station,azimuth,elevation:tubePivot,moving,pivotHeight:2.45,length:4.2,radius:.485,objectiveRadius:.44};
 function pointTelescope(direction){const d=new T.Vector3(direction.x,direction.y,direction.z);if(!Number.isFinite(d.lengthSq())||d.lengthSq()<1e-12)return;d.normalize();if(d.y<0)d.y=0;d.normalize();azimuth.rotation.y=Math.atan2(d.x,d.z);tubePivot.rotation.x=Math.acos(Math.max(0,Math.min(1,d.y)));}
 pointTelescope({x:.2,y:.65,z:-.75});
 const seat=mesh(new T.BoxGeometry(2.2,.17,.72),timber,'A quiet sky-watching seat');seat.position.set(C.bench.x,C.deckY+.43,C.bench.z);for(const x of[-.8,.8])beam([C.bench.x+x,C.deckY,C.bench.z],[C.bench.x+x,C.deckY+.38,C.bench.z],.07,timber);
 const unit=own(new T.CylinderGeometry(1,1,1,7)),stamp=new T.Object3D();for(const[m,list]of batches){const batch=new T.InstancedMesh(unit,m,list.length);batch.name='Batched dome ribs, safe rails and telescope tripod';list.forEach((p,i)=>{stamp.position.copy(p.p);stamp.quaternion.copy(p.q);stamp.scale.set(p.r,p.h,p.r);stamp.updateMatrix();batch.setMatrixAt(i,stamp.matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);}
 const light=new T.PointLight(0xffd4a0,22,32,1.5);light.position.set(0,C.deckY+3.1,0);lamps.add(light);lamps.visible=false;
 let disposed=false;return{group,walking,roof,deck,bridge,stair,lamps,targets:moving,station:C.station,telescope,pointTelescope,dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const o of owned)o.dispose();group.clear();}};
}
