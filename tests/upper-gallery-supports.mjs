import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {UPPER} from '../src/two-face-gallery-model.js';
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex'),round=x=>Math.round(x*1e6)/1e6;
export function verifyUpperGallery(T,b){
 const upper=b.side==='upper',ignored=new Map(),rows=[],non=[],old=[],added=[],m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();
 b.group.updateMatrixWorld(true);
 function visit(o){if(o.userData.paperMonitors)return;if(o.isMesh){
  if(o.isInstancedMesh){const box=upper&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0x6b6e67,cyl=upper&&o.geometry.type==='CylinderGeometry'&&o.material.color.getHex()===0xab9459,count=box?92:cyl?865:o.count;
   if(box||cyl)assert.equal(o.count,count+(box?141:461));const ids=new Set();
   for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);m.decompose(p,q,s);const a={mesh:o,index:i,matrix:m.clone(),p:p.clone(),q:q.clone(),s:s.clone()};
    if(i>=count){ids.add(i);added.push(a);}else{old.push(a);rows.push(JSON.stringify({name:o.name,color:o.material.color.getHex(),matrix:[...m.elements].map(round)}));}
   }if(ids.size)ignored.set(o,ids);
  }else non.push({name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),data:o.userData,color:o.material.color.getHex(),geometry:hash({position:Array.from(o.geometry.attributes.position.array),index:o.geometry.index?Array.from(o.geometry.index.array):null})});
 }for(const c of o.children)visit(c);}
 visit(b.group);
 assert.equal(rows.length,upper?1460:2843);
 assert.equal(hash(rows),upper?'9d096f9bad3988fc6d31f666d4bd9dc87cc6d36e6b2915e22295c1af7dc9e5b6':'89b225f3de0689baaf2e716ae252b2b43457139d9b1f4537bbb00ae1c7580249','Independent 687f351 original per-batch IDs/order/matrices');
 assert.equal(hash([...rows].sort()),upper?'5cc7764898f9f663d1bbae21faeaaa3b55e45e9197b66d21650be35052a90026':'f947dd68a7df2c9d63c4526ebe38f28edc3ca3fe8d8bc511a46ee5dd8b099850');
 assert.equal(hash(non),upper?'320847feff889d378bdf008ae56847e2128d5e7b5f833d5bc032c7581aa0e2e5':'8d404e8c1569aa4458c0473bd02d82a014d146eca5cc6c3e50fa0045065c6520');
 if(!upper){assert.equal(added.length,0);return{ignored};}
 const is=(a,c)=>Math.abs(a-c)<1e-5,near=(a,c,t=6e-5)=>assert(Math.abs(a-c)<t,`${a} != ${c}`),shoes=added.filter(a=>is(a.s.x,.44)&&is(a.s.y,.18)&&is(a.s.z,.82)),
  clips=added.filter(a=>is(a.s.x,.16)&&is(a.s.z,.24)&&[.06,.14].some(h=>is(a.s.y,h))),sleeves=added.filter(a=>a.mesh.geometry.type==='CylinderGeometry'),
  feet=old.filter(a=>a.mesh.geometry.type==='BoxGeometry'&&is(a.s.x,.3)&&is(a.s.y,.28)&&is(a.s.z,.3)),
  vertical=old.filter(a=>a.mesh.geometry.type==='CylinderGeometry'&&is(a.s.x,.035)&&is(a.s.y,1.05)),radial=a=>[14.34,17.66].find(r=>Math.abs(Math.hypot(a.p.x,a.p.z)-r)<.02),posts=vertical.filter(radial);
 assert.equal(added.length,602);assert.equal(shoes.length,26);assert.equal(clips.length,115);assert.equal(sleeves.length,461);assert.equal(feet.length,26);assert.equal(posts.length,115);
 assert.equal(clips.filter(a=>is(a.s.y,.06)).length,24);assert.equal(clips.filter(a=>is(a.s.y,.14)).length,91);
 const proxies=new Map(),proxy=a=>{if(!proxies.has(a)){const mesh=new T.Mesh(a.mesh.geometry,a.mesh.material);mesh.matrixAutoUpdate=false;mesh.matrix.copy(a.matrix);mesh.updateMatrixWorld(true);proxies.set(a,mesh);}return proxies.get(a);},
  corners=a=>{const out=[];for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5])out.push(new T.Vector3(x,y,z).applyMatrix4(a.matrix));return out;},down=new T.Vector3(0,-1,0);
 const seat=(point,a)=>{const h=new T.Raycaster(point.clone().add(new T.Vector3(0,.03,0)),down,0,.06).intersectObject(proxy(a))[0];assert(h);near(h.point.y,point.y);};
 let feetHits=0,postHits=0,anchors=0,shared=0,caps=0,postCaps=0,body=0,mouths=0,physical=0;
 for(const foot of feet){const a=shoes.find(a=>Math.hypot(a.p.x-foot.p.x,a.p.z-foot.p.z)<.20&&Math.abs(a.p.y-(foot.p.y-.23))<1e-4);assert(a);for(const p of corners(foot).filter(p=>p.y<foot.p.y)){seat(p,a);feetHits++;}}
 for(const post of posts){const a=clips.find(a=>Math.hypot(a.p.x-post.p.x,a.p.z-post.p.z)<.061&&Math.abs(a.p.y+a.s.y/2-(post.p.y-.525))<1e-4);assert(a);for(let i=0;i<8;i++){const t=i*Math.PI/4;seat(new T.Vector3(post.p.x+Math.cos(t)*.035,post.p.y-.525,post.p.z+Math.sin(t)*.035),a);postHits++;}}
 const treadSource=b.group.getObjectByName('240 real annular stone treads'),treads=new T.Mesh(treadSource.geometry,treadSource.material);treads.updateMatrixWorld(true);
 for(const a of [...shoes,...clips]){
  const r=Math.hypot(a.p.x,a.p.z),theta=Math.atan2(a.p.z,a.p.x),inner=r<16,shoe=shoes.includes(a),H=a.p.y+(shoe?.15:a.s.y/2),i=Math.round((-24-H)/.1),d=UPPER.endTheta/240,unwrapped=theta+Math.PI*2*Math.round(((i+.5)*d-theta)/(Math.PI*2)),limit=shoe?.012:.003,lo=Math.max(-limit,i*d-unwrapped+.0002),hi=Math.min(limit,(i+1)*d-unwrapped-.0002),inv=a.matrix.clone().invert();assert(lo<hi);
  for(const offset of[lo+(hi-lo)/3,lo+(hi-lo)*2/3]){const t=theta+offset,R=r+(inner?-1:1)*(a.s.z/2+.02),dir=new T.Vector3(Math.cos(t),0,Math.sin(t)).multiplyScalar(inner?1:-1),h=new T.Raycaster(new T.Vector3(Math.cos(t)*R,a.p.y,Math.sin(t)*R),dir,0,1).intersectObject(treads)[0];assert(h);const p=h.point.clone().applyMatrix4(inv);assert(Math.max(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z))<=.5001);anchors++;}
  if(clips.includes(a)&&is(a.s.y,.06)){const under=shoes.find(s=>Math.abs(s.p.y+s.s.y/2-(a.p.y-a.s.y/2))<1e-4&&Math.hypot(s.p.x-a.p.x,s.p.z-a.p.z)<.35);assert(under);for(const p of corners(a).filter(p=>p.y<a.p.y)){seat(p,under);shared++;}}
  const v=new T.Vector3(a.p.x,0,a.p.z).normalize();for(const p of corners(a))assert(p.dot(v)>=13.7&&Math.hypot(p.x,p.z)<=18.3&&p.y>=-48&&p.y<=-24);
 }
 const key=(r,i)=>r.toFixed(2)+':'+i,segments=new Map(),stringers=new Map(),postMap=new Map(),newMap=new Map();
 for(const a of old){const r=radial(a);if(!r||a.mesh.geometry.type!=='CylinderGeometry')continue;const A=new T.Vector3(0,-.5,0).applyMatrix4(a.matrix),B=new T.Vector3(0,.5,0).applyMatrix4(a.matrix);
  if(is(A.y,B.y)&&a.s.y>1&&[.035,.085].some(R=>is(a.s.x,R))){const top=a.s.x<.05,i=Math.round((-24-(a.p.y-(top?1.05:-.16)))/.1);(top?segments:stringers).set(key(r,i),{...a,r,i,A,B});}
  if(is(a.s.x,.035)&&is(a.s.y,1.05))postMap.set(key(r,Math.round((-24-(a.p.y-.525))/.1)),a);
 }
 assert.equal(segments.size,464);assert.equal(stringers.size,464);assert.equal(postMap.size,115);
 for(const a of sleeves){const r=radial(a),i=Math.round((-24-(a.p.y-1.05-.05))/.1);assert(r);near(a.s.x,.04);near(a.s.z,.04);near(a.s.y,.18);assert(!newMap.has(key(r,i)));newMap.set(key(r,i),a);}
 const cap=(a,end)=>{const points=new Map(),pos=a.mesh.geometry.attributes.position;for(let i=0;i<pos.count;i++)if(is(pos.getY(i),end)){const p=new T.Vector3().fromBufferAttribute(pos,i);points.set(p.toArray().map(round).join(','),p);}assert.equal(points.size,8);return[...points.values()];},
  polygon=cap(sleeves[0],.5).filter(p=>Math.hypot(p.x,p.z)>.5).sort((a,c)=>Math.atan2(a.z,a.x)-Math.atan2(c.z,c.x));assert.equal(polygon.length,7);
 const inside=(point,a)=>{const p=point.clone().applyMatrix4(a.matrix.clone().invert());assert(Math.abs(p.y)<.5-1e-4);const signs=polygon.map((v,i)=>{const w=polygon[(i+1)%polygon.length];return(w.x-v.x)*(p.z-v.z)-(w.z-v.z)*(p.x-v.x);});assert(signs.every(n=>n>=-1e-4)||signs.every(n=>n<=1e-4));};
 const parents=new Map([...segments.keys()].map(k=>[k,k])),root=k=>{while(parents.get(k)!==k)k=parents.get(k);return k;};
 for(const[k,a]of newMap){const c=segments.get(k);assert(c);const prev=segments.get(key(c.r,c.i-1));assert(prev,'Never span the Escher/first/last portal break');near(prev.B.x,c.A.x);near(prev.B.z,c.A.z);near(prev.B.y-c.A.y,.1);near(a.p.x,c.A.x);near(a.p.z,c.A.z);near(a.p.y,(prev.B.y+c.A.y)/2);
  for(const[s,end]of[[prev,.5],[c,-.5]])for(const p of cap(s,end)){inside(p.applyMatrix4(s.matrix),a);caps++;}
  if(postMap.has(k))for(const p of cap(postMap.get(k),.5)){inside(p.applyMatrix4(postMap.get(k).matrix),a);postCaps++;}
  parents.set(root(k),root(key(c.r,c.i-1)));
 }
 const groups=new Set([...parents.keys()].map(root)),roots=new Set([...postMap.keys()].map(root));assert.equal(groups.size,3);assert.deepEqual(groups,roots);
 assert.equal([...newMap.keys()].filter(k=>k.startsWith('14.34:')).length,233);assert.equal([...newMap.keys()].filter(k=>k.startsWith('17.66:')).length,228);
 // Retained stringer caps already have vertical overlap; no lower-rise housing
 // is added or claimed necessary. This checks that measured sign independently.
 let overlap=0;for(const[k,c]of stringers){const p=stringers.get(key(c.r,c.i-1));if(!p)continue;const high=cap(p,.5).map(v=>v.applyMatrix4(p.matrix).y),low=cap(c,-.5).map(v=>v.applyMatrix4(c.matrix).y);assert(Math.min(...high)-Math.max(...low)<-.061);overlap++;}assert.equal(overlap,461);
 const all=added.map(proxy);
 const axes=a=>[new T.Vector3(1,0,0).applyQuaternion(a.q),new T.Vector3(0,0,1).applyQuaternion(a.q)],overlaps=(a,c)=>{if(Math.min(a.p.y+a.s.y/2,c.p.y+c.s.y/2)-Math.max(a.p.y-a.s.y/2,c.p.y-c.s.y/2)<6e-5)return false;const A=axes(a),C=axes(c);for(const v of[...A,...C]){const ea=Math.abs(v.dot(A[0]))*a.s.x/2+Math.abs(v.dot(A[1]))*a.s.z/2,ec=Math.abs(v.dot(C[0]))*c.s.x/2+Math.abs(v.dot(C[1]))*c.s.z/2;if(ea+ec-Math.abs(v.dot(a.p.clone().sub(c.p)))<6e-5)return false;}return true;};
 const boxes=[...shoes,...clips];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert(!overlaps(boxes[i],boxes[j]),'New upper shoes/clips butt without overlapping visible volumes');
 for(let i=0;i<240;i++)for(const f of[.05,.5,.95])for(const r of[14.455,16,17.545]){const a=(i+f)/240*UPPER.endTheta,H=-24-i*.1;assert.equal(new T.Raycaster(new T.Vector3(Math.cos(a)*r,H+.002,Math.sin(a)*r),new T.Vector3(0,1,0),0,1.8).intersectObjects(all,false).length,0);body++;}
 const clear=(a,c)=>{const p=new T.Vector3(...a),v=new T.Vector3(...c).sub(p);assert.equal(new T.Raycaster(p,v.clone().normalize(),.001,v.length()-.001).intersectObjects(all,false).length,0);mouths++;};
 for(const z of[-.6,0,.6]){clear([9.2,-23.35,z],[16,-23.35,z]);clear([16,-39.35,z],[22,-39.35,z]);}
 for(const x of[15.3,16,16.7])clear([x,-47.35,-2.8],[x,-47.35,2.8]);
 for(const z of[-1.7,-.85,0,.85,1.7])clear([15.8,-39.35,z],[22,-39.35,z]);
 // Source meshes remain under their real upper owner; no lower half-turn here.
 b.group.updateMatrixWorld(true);for(const a of sleeves){const r=radial(a),i=Math.round((-24-(a.p.y-1.1))/.1);if(i%20&&i!==3&&i!==235)continue;const theta=Math.atan2(a.p.z,a.p.x),sign=r<16?1:-1,start=b.group.localToWorld(new T.Vector3(a.p.x-Math.cos(theta)*.2*sign,a.p.y,a.p.z-Math.sin(theta)*.2*sign)),dir=new T.Vector3(Math.cos(theta)*sign,0,Math.sin(theta)*sign).transformDirection(b.group.matrixWorld),h=new T.Raycaster(start,dir,0,.4).intersectObject(a.mesh)[0];assert(h);assert.equal(h.instanceId,a.index);physical++;}
 assert.deepEqual([feetHits,postHits,anchors,shared,caps,postCaps,body,mouths,physical],[104,920,282,96,7376,920,2160,14,25]);
 return{ignored,feetHits,postHits,anchors,shared,caps,postCaps,body,mouths,physical,components:3,stringerOverlaps:overlap};
}
