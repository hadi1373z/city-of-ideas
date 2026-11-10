import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {LOWER} from '../src/two-face-gallery-model.js';
import {lowerMatrix,WORLD_CYLINDER as W} from '../src/world-cylinder-model.js';
import {verifyUpperGallery} from './upper-gallery-supports.mjs';
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex'),round=x=>Math.round(x*1e6)/1e6;
export function verifyHelicalRails(T,b){
 const upper=verifyUpperGallery(T,b),lower=b.side==='lower',ignored=new Map([...upper.ignored].map(([o,ids])=>[o,new Set(ids)])),original=[],added=[],rows=[],non=[],m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();
 b.group.updateWorldMatrix(true,true);
 function visit(o){if(o.userData.paperMonitors)return;if(o.isMesh){
  if(o.isInstancedMesh){
   const box=lower&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0x6b6e67,cyl=lower&&o.geometry.type==='CylinderGeometry'&&o.material.color.getHex()===0xab9459,old=box?273:cyl?1045:o.count;
   if(box||cyl)assert.equal(o.count,old+466);const ids=ignored.get(o)??new Set();
   for(let i=0;i<o.count;i++){if(upper.ignored.get(o)?.has(i))continue;o.getMatrixAt(i,m);m.decompose(p,q,s);const item={mesh:o,index:i,matrix:m.clone(),p:p.clone(),q:q.clone(),s:s.clone()};
    if(i>=old){added.push(item);ids.add(i);}else{original.push(item);rows.push(JSON.stringify({name:o.name,color:o.material.color.getHex(),matrix:[...m.elements].map(round)}));}
   }if(ids.size)ignored.set(o,ids);
  }else non.push({name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),data:o.userData,color:o.material.color.getHex(),geometry:hash({position:Array.from(o.geometry.attributes.position.array),index:o.geometry.index?Array.from(o.geometry.index.array):null})});
 }for(const c of o.children)visit(c);}
 visit(b.group);
 assert.equal(rows.length,lower?1911:1460);
 assert.equal(hash(rows),lower?'1c0c4875be9b7e087e44ca2ce62695c5353f3d2d10612fbeedfc088ab15631e7':'9d096f9bad3988fc6d31f666d4bd9dc87cc6d36e6b2915e22295c1af7dc9e5b6','Independent 83a37ce per-batch IDs/order and every earlier matrix');
 assert.equal(hash([...rows].sort()),lower?'1731a9186ee8a907e5847aba3900de5f2a42a67fa4acb094f89be58351f9d440':'5cc7764898f9f663d1bbae21faeaaa3b55e45e9197b66d21650be35052a90026');
 assert.equal(hash(non),lower?'8d404e8c1569aa4458c0473bd02d82a014d146eca5cc6c3e50fa0045065c6520':'320847feff889d378bdf008ae56847e2128d5e7b5f833d5bc032c7581aa0e2e5','Every original walking/noninstance surface and pose stays exact');
 if(!lower){assert.equal(added.length,0);return{ignored};}
 const near=(a,c,t=6e-5)=>assert(Math.abs(a-c)<t,`${a} != ${c}`),is=(a,c)=>Math.abs(a-c)<1e-5,rise=48.13/240,
  tops=added.filter(a=>a.mesh.geometry.type==='CylinderGeometry'),housings=added.filter(a=>a.mesh.geometry.type==='BoxGeometry');
 assert.equal(added.length,932);assert.equal(tops.length,466);assert.equal(housings.length,466);
 const key=(r,i)=>r.toFixed(2)+':'+i,segments={top:new Map(),low:new Map()},newMap={top:new Map(),low:new Map()},posts=new Map(),clips=new Map();
 const radial=a=>[14.34,17.66].find(r=>Math.abs(Math.hypot(a.p.x,a.p.z)-r)<.02);
 for(const part of original){
  const r=radial(part);
  if(part.mesh.geometry.type==='CylinderGeometry'&&r){
   const A=new T.Vector3(0,-.5,0).applyMatrix4(part.matrix),B=new T.Vector3(0,.5,0).applyMatrix4(part.matrix);
   if(is(A.y,B.y)&&part.s.y>1&&[.035,.085].some(v=>is(part.s.x,v))){const type=part.s.x<.05?'top':'low',H=part.p.y-(type==='top'?1.05:-.16),i=Math.round((.13-H)/rise);segments[type].set(key(r,i),{...part,A,B,r,i});}
   if(is(part.s.x,.035)&&is(part.s.y,1.05)){const i=Math.round((.13-(part.p.y-.525))/rise);posts.set(key(r,i),part);}
  }
  if(part.mesh.geometry.type==='BoxGeometry'&&is(part.s.x,.16)&&is(part.s.z,.24)&&[.06,.14].some(h=>is(part.s.y,h))){
   const r=Math.hypot(part.p.x,part.p.z)<16?14.34:17.66,i=Math.round((.13-(part.p.y+part.s.y/2))/rise);clips.set(key(r,i),part);
  }
 }
 assert.equal(segments.top.size,468);assert.equal(segments.low.size,468);assert.equal(posts.size,116);assert.equal(clips.size,116);
 for(const[type,parts]of Object.entries({top:tops,low:housings}))for(const part of parts){const r=radial(part);assert(r);const i=Math.round((.13-(part.p.y-(type==='top'?1.05:-.16)-rise/2))/rise);assert(i>=3&&i<=235);
  if(type==='top'){near(part.s.x,.04);near(part.s.z,.04);near(part.s.y,rise+.08);}else{near(part.s.x,.20);near(part.s.z,.20);near(part.s.y,rise+.20);}
  assert(!newMap[type].has(key(r,i)));newMap[type].set(key(r,i),part);
 }
 const unitCaps=(part,end)=>{const attr=part.mesh.geometry.attributes.position,points=new Map();for(let i=0;i<attr.count;i++)if(is(attr.getY(i),end)){const p=new T.Vector3().fromBufferAttribute(attr,i);points.set(p.toArray().map(round).join(','),p);}assert.equal(points.size,8);return[...points.values()];};
 const polygon=unitCaps(tops[0],.5).filter(p=>Math.hypot(p.x,p.z)>.5).sort((a,c)=>Math.atan2(a.z,a.x)-Math.atan2(c.z,c.x));assert.equal(polygon.length,7);
 function contains(point,part){
  const p=point.clone().applyMatrix4(part.matrix.clone().invert());assert(Math.abs(p.y)<.5-1e-4,'Source end-cap vertices are concealed inside the new sleeve');
  if(part.mesh.geometry.type==='BoxGeometry')assert(Math.max(Math.abs(p.x),Math.abs(p.z))<.5-1e-4);
  else{const signs=polygon.map((a,i)=>{const b=polygon[(i+1)%polygon.length];return(b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x);});assert(signs.every(n=>n>=-1e-4)||signs.every(n=>n<=1e-4),'Use the real seven-sided sleeve, not a circular approximation');}
 }
 let topCaps=0,lowCaps=0,postCaps=0,clipRoots=0,body=0,physical=0;
 const parents={top:new Map([...segments.top.keys()].map(k=>[k,k])),low:new Map([...segments.low.keys()].map(k=>[k,k]))},root=(map,k)=>{while(map.get(k)!==k)k=map.get(k);return k;};
 for(const type of['top','low'])for(const[k,part]of newMap[type]){
  const current=segments[type].get(k);assert(current);const prevKey=key(current.r,current.i-1),prev=segments[type].get(prevKey);assert(prev);
  near(prev.B.x,current.A.x);near(prev.B.z,current.A.z);near(prev.B.y-current.A.y,rise);
  near(part.p.x,current.A.x);near(part.p.z,current.A.z);near(part.p.y,(prev.B.y+current.A.y)/2);
  for(const[source,end]of[[prev,.5],[current,-.5]])for(const v of unitCaps(source,end)){contains(v.applyMatrix4(source.matrix),part);if(type==='top')topCaps++;else lowCaps++;}
  const map=parents[type];map.set(root(map,k),root(map,prevKey));
  if(posts.has(k)){
   if(type==='top'){for(const v of unitCaps(posts.get(k),.5)){contains(v.applyMatrix4(posts.get(k).matrix),part);postCaps++;}}
   else{contains(clips.get(k).p,part);clipRoots++;}
  }
 }
 for(const type of['top','low']){
  const groups=new Set([...parents[type].keys()].map(k=>root(parents[type],k))),roots=new Set([...posts.keys()].map(k=>root(parents[type],k)));
  assert.equal(groups.size,2);assert.deepEqual(groups,roots,'Every retained segment and connector has a geometric path to existing tread-supported guard feet');
  for(const r of[14.34,17.66])assert.equal([...newMap[type].keys()].filter(k=>k.startsWith(r.toFixed(2)+':')).length,233);
 }
 const proxies=added.map(a=>{const p=new T.Mesh(a.mesh.geometry,a.mesh.material);p.matrixAutoUpdate=false;p.matrix.copy(a.matrix);p.updateMatrixWorld(true);return p;});
 for(const part of added){
  const r=radial(part),extent=part.mesh.geometry.type==='BoxGeometry'?.10:.04;
  if(r<16)assert(Math.hypot(r+extent,extent)<LOWER.innerRadius+LOWER.navInset-.005);
  else assert(r-extent>LOWER.outerRadius-LOWER.navInset+.005);
 }
 for(let i=0;i<240;i++)for(const f of[.05,.5,.95])for(const r of[14.455,16,17.545]){
  const a=(i+f)/240*LOWER.endTheta,H=.13-i*rise;
  assert.equal(new T.Raycaster(new T.Vector3(Math.cos(a)*r,H+.002,Math.sin(a)*r),new T.Vector3(0,1,0),0,1.8).intersectObjects(proxies,false).length,0);body++;
 }
 // Never cross the retained top/middle mouths or invent terminal closures.
 const clear=(a,c)=>{const start=new T.Vector3(...a),d=new T.Vector3(...c).sub(start);assert.equal(new T.Raycaster(start,d.clone().normalize(),.001,d.length()-.001).intersectObjects(proxies,false).length,0);};
 for(const z of[-.6,0,.6])clear([16,.78,z],[26,.78,z]);
 for(const x of[15.3,16,16.7])clear([x,-47.35,-2.8],[x,-47.35,2.8]);
 const old=b.group.position.clone(),detached=!b.group.parent;let frame;
 if(detached){frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));b.group.position.set(W.lowerOrigin.x,0,W.lowerOrigin.z);frame.add(b.group);frame.updateMatrixWorld(true);}
 b.group.updateWorldMatrix(true,true);
 for(const[type,map]of Object.entries(newMap))for(const[k,part]of map){const seg=segments[type].get(k);if(seg.i%20&&seg.i!==3&&seg.i!==235)continue;const a=Math.atan2(part.p.z,part.p.x),sign=seg.r<16?1:-1,
  start=b.group.localToWorld(new T.Vector3(part.p.x-Math.cos(a)*.2*sign,part.p.y,part.p.z-Math.sin(a)*.2*sign)),dir=new T.Vector3(Math.cos(a)*sign,0,Math.sin(a)*sign).transformDirection(b.group.matrixWorld),
  h=new T.Raycaster(start,dir,0,.4).intersectObject(part.mesh)[0];assert(h,'Actual lower-frame connector missed: '+type+' '+k);assert.equal(h.instanceId,part.index);physical++;}
 if(detached){b.group.removeFromParent();b.group.position.copy(old);b.group.updateMatrixWorld(true);}
 assert.deepEqual([topCaps,lowCaps,postCaps,clipRoots,body,physical],[7456,7456,928,116,2160,52]);
 return{ignored,topCaps,lowCaps,postCaps,clipRoots,body,physical,runComponents:4,doorRays:6};
}
