import {CITY_PLACES,GRAPH_EDGES,GRAPH_NODES,graphAnalysis,birthdayProbability,beatSample,gridRoute,reflection,rosette,initialPlaceState} from './city-places-model.js?v=sixfold-city-20261118c';

// Original, owned procedural architecture. One vertex-colour batch per static
// pavilion and one per manual experiment; no external mesh, texture or lights.
export function buildCityPlaces(T,{canvasFactory=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Six outdoor places for trying an idea';const owned=new Set(),own=o=>(owned.add(o),o),targets=[],sites=[],obstacles=[],state=initialPlaceState();
 const solid=own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})),lineMat=own(new T.LineBasicMaterial({vertexColors:true})),unitBox=own(new T.BoxGeometry(1,1,1)),unitCylinder=own(new T.CylinderGeometry(1,1,1,10)),unitBall=own(new T.SphereGeometry(1,10,7));let disposed=false;
 const Y=new T.Vector3(0,1,0),V=a=>new T.Vector3(...a),gold=0xd4b66f,teal=0x639c99,ivory=0xe5dbc0,ink=0x3a565b;
 function batch(){const p=[],c=[],lp=[],lc=[];function colour(out,hex,count){const q=new T.Color(hex);for(let i=0;i<count;i++)out.push(q.r,q.g,q.b);}function append(g,m,hex){const a=g.attributes.position,index=g.index;for(let i=0;i<(index?.count??a.count);i++){const q=new T.Vector3().fromBufferAttribute(a,index?index.getX(i):i).applyMatrix4(m);p.push(q.x,q.y,q.z);colour(c,hex,1);}}
  const shape=(g,position,scale,hex,quaternion=new T.Quaternion())=>append(g,new T.Matrix4().compose(V(position),quaternion,V(scale)),hex);
  const box=(w,h,d,x,y,z,hex,yaw=0)=>shape(unitBox,[x,y,z],[w,h,d],hex,new T.Quaternion().setFromAxisAngle(Y,yaw));
  const cylinder=(r,h,x,y,z,hex)=>shape(unitCylinder,[x,y,z],[r,h,r],hex);
  const ball=(r,x,y,z,hex)=>shape(unitBall,[x,y,z],[r,r,r],hex);
  const beam=(a,b,r,hex)=>{const A=V(a),B=V(b),d=B.clone().sub(A);if(d.length()<1e-8)return;shape(unitCylinder,A.add(B).multiplyScalar(.5).toArray(),[r,d.length(),r],hex,new T.Quaternion().setFromUnitVectors(Y,d.normalize()));};
  const face=(points,hex)=>{for(let i=1;i<points.length-1;i++){p.push(...points[0],...points[i],...points[i+1]);colour(c,hex,3);}};
  const trace=(a,b,hex)=>{lp.push(...a,...b);colour(lc,hex,2);};
  const ring=(radius,y,cz,hex,width=.07,start=0,end=Math.PI*2,n=72)=>{for(let i=0;i<n;i++){const a=start+(end-start)*i/n,b=start+(end-start)*(i+1)/n;beam([radius*Math.cos(a),y,cz+radius*Math.sin(a)],[radius*Math.cos(b),y,cz+radius*Math.sin(b)],width,hex);}};
  function finish(name){const result=new T.Group();result.name=name;if(p.length){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.computeVertexNormals();g.computeBoundingSphere();result.add(new T.Mesh(g,solid));}if(lp.length){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(lp,3));g.setAttribute('color',new T.Float32BufferAttribute(lc,3));g.computeBoundingSphere();result.add(new T.LineSegments(g,lineMat));}return result;}
  return{box,cylinder,ball,beam,face,trace,ring,finish};
 }
 function post(b,site,x,z,h){b.cylinder(.17,h,x,.13+h/2,z,ivory);b.cylinder(.38,.18,x,.22,z,site.colour);obstacles.push({x:site.x+x,z:site.z+z,r:.43});}
 for(const place of CITY_PLACES){
  const root=new T.Group();root.name=place.name;root.position.set(place.x,0,place.z);root.userData.cityDestination='place:'+place.id;group.add(root);const b=batch();b.cylinder(14,.10,0,.08,0,0xc0b79d);b.box(3.4,.10,4,0,.08,16,0xc0b79d);b.ring(13.2,.16,0,place.colour,.055);
  // Quiet seats sit off the clear central approach, with no enclosing walls.
  for(const x of[-10.5,10.5]){b.box(1.8,.22,4,x,.75,3,place.colour);for(const z of[1.7,4.3]){b.box(1.2,.65,.22,x,.42,z,ink);obstacles.push({x:place.x+x,z:place.z+z,r:1.0});}}
  if(place.kind==='graph'){
   for(const z of[-9.5,9.5])for(let i=0;i<20;i++){const a=i*Math.PI/20,beta=(i+1)*Math.PI/20;b.beam([11*Math.cos(a),4.0+2*Math.sin(a),z],[11*Math.cos(beta),4+2*Math.sin(beta),z],.13,place.colour);}for(const x of[-11,11])for(const z of[-9.5,9.5])post(b,place,x,z,4);
   for(const x of[-11,11])b.beam([x,4,-9.5],[x,4,9.5],.18,ivory);
  }else if(place.kind==='probability'){
   for(let i=0;i<12;i++){const a=i*Math.PI/6,d=(i+1)*Math.PI/6;b.face([[11*Math.cos(a),4.4,11*Math.sin(a)],[11*Math.cos(d),4.4,11*Math.sin(d)],[3*Math.cos(d),7.6,3*Math.sin(d)],[3*Math.cos(a),7.6,3*Math.sin(a)]],i%2?place.colour:ivory);}for(let i=0;i<6;i++){const a=i*Math.PI/3;post(b,place,10.6*Math.cos(a),10.6*Math.sin(a),4.4);}
  }else if(place.kind==='listening'){
   for(let i=0;i<12;i++){const x=-11+i*22/12,X=-11+(i+1)*22/12,h=(u,z)=>7+.016*(u*u-z*z);b.face([[x,h(x,-8),-8],[X,h(X,-8),-8],[X,h(X,8),8],[x,h(x,8),8]],i%2?place.colour:0xb7b5c8);}for(const x of[-10.8,10.8])for(const z of[-7.8,7.8])post(b,place,x,z,7+.016*(x*x-z*z));
  }else if(place.kind==='map'){
   for(const x of[-10,10])for(const z of[-9,9])post(b,place,x,z,5.4);for(const x of[-10,-5,0,5,10])b.box(.14,.2,19,x,5.45,0,place.colour);for(const z of[-9,-4.5,0,4.5,9])b.box(20,.18,.14,0,5.55,z,ivory);for(const x of[-8.3,8.3]){b.beam([x,.13,-1],[x,3,-1],.15,gold);b.beam([x,3,-1],[x,3,3],.15,gold);b.beam([x,3,3],[x,.13,3],.15,gold);}
  }else if(place.kind==='light'){
   const points=[[-11,5.1,-7],[11,7.3,-7],[0,5.8,10]];b.face(points,0xe0cf99);for(const[x,h,z]of points.slice(0,2))post(b,place,x,z,h);for(const x of[-4.5,4.5]){post(b,place,x,9,5.8);b.beam([x,5.8,9],points[2],.12,place.colour);}for(let i=0;i<3;i++)b.beam(points[i],points[(i+1)%3],.12,place.colour);
  }else{
   for(let i=0;i<12;i++){const a=i*Math.PI/6,d=(i+1)*Math.PI/6,r=i%2?11:9.8,R=(i+1)%2?11:9.8;b.face([[r*Math.cos(a),5, r*Math.sin(a)],[R*Math.cos(d),5,R*Math.sin(d)],[3*Math.cos(d),7.4,3*Math.sin(d)],[3*Math.cos(a),7.4,3*Math.sin(a)]],i%2?place.colour:ivory);}for(let i=0;i<6;i++){const a=i*Math.PI/3;post(b,place,10*Math.cos(a),10*Math.sin(a),5);}
  }
  for(const x of[-5.2,5.2])post(b,place,x,12.7,4.5);b.box(11,.20,.30,0,4.55,12.7,place.colour);
  root.add(b.finish(place.name+' · original open architecture'));
  const canvas=canvasFactory();canvas.width=1024;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#24464a';ctx.fillRect(0,0,1024,192);ctx.strokeStyle='#c6b27b';ctx.lineWidth=6;ctx.strokeRect(5,5,1014,182);ctx.fillStyle='#eee6cf';ctx.textAlign='center';ctx.font='50px Georgia';ctx.fillText(place.name,512,83,970);ctx.font='26px system-ui';ctx.fillText('TRY AN IDEA · E / A',512,143,960);const texture=own(new T.CanvasTexture(canvas));texture.colorSpace=T.SRGBColorSpace;const plaque=new T.Mesh(own(new T.PlaneGeometry(8.6,1.61)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false,side:T.DoubleSide})));plaque.position.set(0,3.6,12.7);plaque.userData.cityPlace=place.id;root.add(plaque);targets.push(plaque);
  const site={...place,root,dynamic:null};sites.push(site);obstacles.push({x:place.x,z:place.z-3.3,w:13,d:13});
 }
 function update(id,next){const site=sites.find(p=>p.id===id);if(!site||disposed)return false;Object.assign(state[id],next);const s=state[id],b=batch(),z0=-3.3;b.box(13,.18,10,0,.35,z0,0xddd2b4);
  if(site.kind==='graph'){const g=graphAnalysis(s.mask);GRAPH_EDGES.forEach(([a,c],i)=>{const A=GRAPH_NODES[a],B=GRAPH_NODES[c];b.beam([A[0],.78,A[1]+z0],[B[0],.78,B[1]+z0],s.mask&(1<<i)? .11:.035,s.mask&(1<<i)?gold:0x9ba69b);});const glyphs=[[[[-.18,.2],[0,-.2],[.18,.2]],[[-.09,0],[.09,0]]],[[[-.16,.2],[-.16,-.2],[.07,-.2],[.17,-.1],[.07,0],[-.16,0]],[[.07,0],[.17,.1],[.07,.2],[-.16,.2]]],[[[.17,-.2],[-.12,-.2],[-.2,-.12],[-.2,.12],[-.12,.2],[.17,.2]]],[[[-.16,.2],[-.16,-.2],[.03,-.2],[.19,-.1],[.19,.1],[.03,.2],[-.16,.2]]]];GRAPH_NODES.forEach(([x,z],i)=>{b.cylinder(.50,.20,x,.88,z+z0,g.odd.includes(i)?gold:teal);b.ball(.25,x,1.14,z+z0,g.odd.includes(i)?gold:teal);for(const stroke of glyphs[i])for(let j=1;j<stroke.length;j++){const[a,A]=stroke[j-1],[c,C]=stroke[j];b.beam([x+a,1.7-A,z+z0],[x+c,1.7-C,z+z0],.025,ink);}});}
  else if(site.kind==='probability'){for(let i=0;i<s.people;i++){const x=(i%8-3.5)*1.22,z=z0+(Math.floor(i/8)-3)*1.10;b.cylinder(.16,.6,x,.78,z,site.colour);b.ball(.20,x,1.26,z,ivory);}const probability=birthdayProbability(s.people);b.ring(6.2,.56,z0,0x8c9a8b,.12);b.ring(6.2,.60,z0,gold,.14,-Math.PI/2,-Math.PI/2+probability*2*Math.PI,Math.max(1,Math.ceil(probability*72)));}
  else if(site.kind==='listening'){
   // The top two traces magnify 40 ms; the sum/envelope below span one second.
   for(const[y,component]of[[5.4,'first'],[4.1,'second']])for(let i=0;i<128;i++){const t=s.time+i/128*.04,T=s.time+(i+1)/128*.04;b.trace([-6+i/128*12,y+beatSample(t,220,220+s.difference)[component]*.45,z0],[-6+(i+1)/128*12,y+beatSample(T,220,220+s.difference)[component]*.45,z0],component==='first'?teal:0xae9ac4);}
   for(let i=0;i<1024;i++){const a=beatSample(s.time+i/1024,220,220+s.difference),c=beatSample(s.time+(i+1)/1024,220,220+s.difference);b.trace([-6+i/1024*12,2.2+a.sum*.62,z0],[-6+(i+1)/1024*12,2.2+c.sum*.62,z0],0xa58169);}for(let i=0;i<128;i++){const a=beatSample(s.time+i/128,220,220+s.difference),c=beatSample(s.time+(i+1)/128,220,220+s.difference);for(const sign of[-1,1])b.trace([-6+i/128*12,2.2+sign*a.envelope*.62,z0],[-6+(i+1)/128*12,2.2+sign*c.envelope*.62,z0],gold);}for(const x of[-6.3,6.3])b.beam([x,.5,z0],[x,6.2,z0],.06,ink);
  }else if(site.kind==='map'){
   const point=([x,y],h=.66)=>[(x-3.5)*1.5,h,z0+(y-2.5)*1.5],route=gridRoute(8,6,[0,0],[s.endX,s.endY],s.wrapped);for(let x=0;x<8;x++)for(let y=0;y<6;y++){const p=point([x,y]);b.ball(.08,...p,ink);if(x<7)b.beam(p,point([x+1,y]),.022,0x9caa9d);if(y<5)b.beam(p,point([x,y+1]),.022,0x9caa9d);}for(const step of route.steps){const a=point(step.from,.83),c=point(step.to,.83);if(!step.wrap)b.beam(a,c,.11,gold);else{const axis=step.from[0]!==step.to[0]?0:2,sign=a[axis]<c[axis]?-1:1,A=a.slice(),B=c.slice();A[axis]+=sign*.7;B[axis]-=sign*.7;b.beam(a,A,.13,teal);b.beam(c,B,.13,teal);b.ball(.23,...A,teal);b.ball(.23,...B,teal);}}b.ball(.23,...point([0,0],1),teal);b.ball(.23,...point([s.endX,s.endY],1),gold);
  }else if(site.kind==='light'){
   const r=reflection(s.angle),hit=[0,1.1,z0],incoming=[-r.incoming.x*4.2,1.1-r.incoming.y*4.2,z0],out=[r.outgoing.x*4.2,1.1+r.outgoing.y*4.2,z0];b.box(10,.16,.35,0,1,z0,0x7ba6a7);b.beam(hit,[0,5.6,z0],.025,ink);b.beam(incoming,hit,.09,gold);b.beam(hit,out,.09,teal);b.ball(.20,...hit,ivory);b.ball(.14,...incoming,gold);b.ball(.14,...out,teal);
  }else{
   const r=rosette(s.n,s.mirror),petal=[[[2,-.25],[4.75,-.25],[4.75,.25],[2,.25]],[[4.25,0],[4.75,0],[4.75,.6],[4.25,.6]],[[4.0,.5],[4.5,1.4],[5.0,.5]]];for(const op of r.operations)for(const polygon of petal){const points=polygon.map(([x,z])=>{if(op.reflected)z=-z;return[x*Math.cos(op.angle)-z*Math.sin(op.angle),.83,z0+x*Math.sin(op.angle)+z*Math.cos(op.angle)];});b.face(points,teal);}b.ring(5.8,.65,z0,ink,.03);for(let i=0;i<s.n;i++){const a=i*2*Math.PI/s.n;b.beam([0,.64,z0],[6*Math.cos(a),.64,z0+6*Math.sin(a)],.022,0xa6aa8c);}
  }
  if(site.dynamic){site.dynamic.traverse(o=>{if(o.geometry){owned.delete(o.geometry);o.geometry.dispose();}});site.dynamic.removeFromParent();}site.dynamic=b.finish(site.name+' · live manual experiment');site.root.add(site.dynamic);return true;
 }
 for(const place of CITY_PLACES)update(place.id,{});
 const canStand=(x,z)=>!obstacles.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+.22:Math.abs(x-o.x)<o.w/2+.22&&Math.abs(z-o.z)<o.d/2+.22);
 return{group,sites,targets,state,obstacles,update,canStand,dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const o of owned)o.dispose();owned.clear();group.clear();}};
}
