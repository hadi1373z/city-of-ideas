import {NIGHT_PARK as P,NIGHT_PARK_ENTRY,NIGHT_PARK_LANTERNS,NIGHT_PARK_APPROACH,nightParkCanStand,nightParkGround} from './night-park-model.js';

/** Install before park companions and before urban tree-bed collection. */
export function installNightPark(M,T,{events=globalThis}={}){
 if(M.nightPark)return M.nightPark;
 const park=M.city.park;if(!park?.group)return null;
 const source=park.group,oldSite={...M.city.PARK},oldPosition=source.position.clone(),oldScale=source.scale.clone(),oldLandmark=M.city.landmarks?.park;
 Object.assign(M.city.PARK,P);source.position.set(P.x,P.baseY,P.z);source.scale.setScalar(P.scale);source.userData.worldFace='lower';
 if(M.city.landmarks)M.city.landmarks.park={x:NIGHT_PARK_ENTRY.x,z:NIGHT_PARK_ENTRY.z};
 const group=new T.Group();group.name='Ideas Park · twelve warm lanterns and arrival walk';group.userData.worldFace='lower';M.scene.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),unit=own(new T.BoxGeometry(1,1,1)),metal=own(new T.MeshLambertMaterial({color:0x3c4a43})),glass=own(new T.MeshBasicMaterial({color:0xffd99f,toneMapped:false})),pathMaterial=own(new T.MeshLambertMaterial({color:0xc6baa0}));
 const stamp=new T.Object3D(),parts=[],panes=[];
 for(const[x,z]of NIGHT_PARK_LANTERNS){for(const[w,h,d,y]of[[.18,3.55,.18,1.78],[.65,.12,.65,3.72],[.74,.15,.74,4.27],[.09,.65,.09,3.99]])parts.push([x-2160,y,z-65,w,h,d]);panes.push([x-2160,3.99,z-65,.48,.48,.48]);}
 function batch(rows,material,name){const n=new T.InstancedMesh(unit,material,rows.length);n.name=name;rows.forEach(([x,y,z,w,h,d],i)=>{stamp.position.set(x,y,z);stamp.scale.set(w,h,d);stamp.updateMatrix();n.setMatrixAt(i,stamp.matrix);});n.instanceMatrix.needsUpdate=true;n.computeBoundingSphere?.();group.add(n);return n;}
 const fixtures=batch(parts,metal,'Twelve thin bronze lantern standards'),windows=batch(panes,glass,'Twelve visibly glowing warm lantern panes');
 const v=[],indices=[],points=NIGHT_PARK_APPROACH.points,w=NIGHT_PARK_APPROACH.width;
 for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);for(const side of[-1,1])v.push(points[i][0]-2160-dz/len*w/2*side,.045,points[i][1]-65+dx/len*w/2*side);if(i<points.length-1){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2);}}
 const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(indices);g.computeVertexNormals();const walk=new T.Mesh(g,pathMaterial);walk.name='Level continuous lantern walk from the meadow circuit';walk.userData.groundRoute=true;group.add(walk);
 // Four real pooled lights keep the source park's many trees inexpensive.
 // All twelve fixtures remain visibly lit while the nearest four cast light.
 const lights=Array.from({length:4},()=>{const l=new T.PointLight(0xffd4a0,0,70,1.25);l.name='Park lantern · real local warm light';l.castShadow=false;group.add(l);return l;});
 const prior={update:M.city.update,can:M.city.canStand,extra:M.extraGround,start:M.startExtra};let disposed=false;
 function visit(){M.cancelActivity?.();M.worldCylinder?.releaseGalleryRoute?.();M.arrive({...NIGHT_PARK_ENTRY});M.player.pitch=-.04;return true;}
 function canStand(x,z,feet=M.player.y-M.eye){return nightParkCanStand(x,z,feet);}
 function update(...args){prior.update?.apply(M.city,args);if(disposed)return;const p=M.player,active=M.mode==='city'&&p.x<-1000&&Math.hypot(p.x-P.x,p.z-P.z)<245&&Math.abs(p.y-M.eye-P.groundY)<8,order=NIGHT_PARK_LANTERNS.map((a,i)=>({a,i,d:Math.hypot(p.x+2160-a[0],p.z+65-a[1])})).sort((a,b)=>a.d-b.d||a.i-b.i);for(let i=0;i<lights.length;i++){const a=order[i].a;lights[i].position.set(a[0]-2160,3.99,a[1]-65);lights[i].intensity=active?48:0;}const debug=globalThis.document?.getElementById?.('world');if(debug){debug.dataset.nightParkLanterns='12';debug.dataset.nightParkActiveLights=active?'4':'0';}}
 M.city.update=update;const can=(x,z)=>canStand(x,z)&&prior.can(x,z),extra=(x,z)=>nightParkGround(x,z)??prior.extra?.(x,z),start=id=>id==='park'||id==='night-park'?visit():prior.start?.(id);M.city.canStand=can;M.extraGround=extra;M.startExtra=start;
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();fixtures.dispose?.();windows.dispose?.();for(const r of owned)r.dispose?.();group.clear();Object.keys(M.city.PARK).forEach(k=>delete M.city.PARK[k]);Object.assign(M.city.PARK,oldSite);source.position.copy(oldPosition);source.scale.copy(oldScale);delete source.userData.worldFace;if(M.city.landmarks)M.city.landmarks.park=oldLandmark;if(M.city.update===update)M.city.update=prior.update;if(M.city.canStand===can)M.city.canStand=prior.can;if(M.extraGround===extra)M.extraGround=prior.extra;if(M.startExtra===start)M.startExtra=prior.start;if(M.nightPark===api)delete M.nightPark;events.removeEventListener?.('pagehide',dispose);}
 const api={group,source,lights,fixtures,windows,walk,site:P,entry:NIGHT_PARK_ENTRY,visit,canStand,heightAt:nightParkGround,update,dispose};M.nightPark=api;events.addEventListener?.('pagehide',dispose,{once:true});return api;
}
