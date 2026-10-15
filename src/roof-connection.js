/* The roof and summit share one elevation; the connector is wide enough for the original infant. */
(function(g){'use strict';
g.createRoofConnection=function(T,{scene,city,stairs}){
 const height=32.395,width=stairs.headWidth,half=width/2,route=[{x:125,z:0},{x:106,z:0},{x:106,z:-12},{x:46,z:-12}],group=new T.Group();group.name='Gallery roof and summit crawling path';scene.add(group);
 const stone=new T.MeshLambertMaterial({color:0xc8b98e}),bronze=new T.MeshLambertMaterial({color:0x8d7852});
 function block(w,h,d,x,y,z,name){const m=new T.Mesh(new T.BoxGeometry(w,h,d),stone);m.position.set(x,y,z);m.name=name;group.add(m);return m;}
 const railTransforms=[];
 function rail(a,b){const d=new T.Vector3().subVectors(b,a),matrix=new T.Matrix4(),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());matrix.compose(a.clone().add(b).multiplyScalar(.5),q,new T.Vector3(1,d.length(),1));railTransforms.push(matrix);}
 function edge(ax,az,bx,bz){rail(new T.Vector3(ax,height+1.15,az),new T.Vector3(bx,height+1.15,bz));const n=Math.ceil(Math.hypot(bx-ax,bz-az)/3);for(let i=0;i<=n;i++){const x=ax+(bx-ax)*i/n,z=az+(bz-az)*i/n;rail(new T.Vector3(x,height,z),new T.Vector3(x,height+1.15,z));}}
 block(106+half-50,.4,width,(50+106+half)/2,height-.2,-12,'Broad roof connector');
 block(width,.4,12+half,106,height-.2,(-12+half)/2,'Open summit junction');
 block(width,.1,1.5,43,height-.05,stairs.run+.65,'Roof stair landing');
 edge(56,-12-half,106+half,-12-half);edge(56,-12+half,106-half,-12+half);edge(106+half,-12-half,106+half,-3.5);
 // Roof guards leave a wide gateway aligned with the bridge.
 for(const radius of[28.5,57])for(let i=0;i<180;i++){const a=i*Math.PI*2/180,b=(i+1)*Math.PI*2/180,mid=(a+b)/2;if(radius===57&&Math.abs(Math.atan2(Math.sin(mid+.212),Math.cos(mid+.212)))<.14)continue;edge(Math.cos(a)*radius,Math.sin(a)*radius,Math.cos(b)*radius,Math.sin(b)*radius);}
 const rails=new T.InstancedMesh(new T.CylinderGeometry(.045,.045,1,6),bronze,railTransforms.length);railTransforms.forEach((m,i)=>rails.setMatrixAt(i,m));rails.name='Batched roof and bridge guards';group.add(rails);
 function onBridge(x,z,margin=.35){return x>=50&&x<=106+half-margin&&Math.abs(z+12)<=half-margin||Math.abs(x-106)<=half-margin&&z>=-12&&z<=2.8;}
 function canWalk(x,z){const r=Math.hypot(x,z);return onBridge(x,z)||r>=29.5&&r<=56.3&&!stairs.holeAt(x,z,4)||Math.abs(x-43)<half-.35&&z>=stairs.run&&z<stairs.run+1.4;}
 let progress=0,target=0,lastTime=null,moving=false,waiting=false;const lengths=route.slice(1).map((p,i)=>Math.hypot(p.x-route[i].x,p.z-route[i].z)),total=lengths.reduce((a,b)=>a+b,0);
 function pointAt(distance){let remaining=Math.max(0,Math.min(total,distance));for(let i=0;i<lengths.length;i++){if(remaining<=lengths[i]||i===lengths.length-1){const u=remaining/lengths[i],a=route[i],b=route[i+1];return{x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,dx:(b.x-a.x)/lengths[i],dz:(b.z-a.z)/lengths[i]};}remaining-=lengths[i];}}
 function invite(reduced=false){target=target===total?0:total;moving=true;if(reduced){progress=target;moving=false;pose(0);}return target===total;}
 function pose(time){const p=pointAt(progress),baby=city.mountain.infant,direction=target>=progress?1:-1;baby.position.set(p.x-city.A.x,height-.02,p.z-city.A.z);if(moving)baby.rotation.y=Math.atan2(p.dz*direction,-p.dx*direction);city.mountain.setCrawling(moving&&!waiting);}
 function update(time,player,mode,reduced){const dt=lastTime===null?0:Math.min(.1,time-lastTime);lastTime=time;waiting=false;if(moving&&!reduced){const sign=Math.sign(target-progress),p=pointAt(progress),ahead=(player.x-p.x)*p.dx*sign+(player.z-p.z)*p.dz*sign,side=Math.abs((player.x-p.x)*p.dz-(player.z-p.z)*p.dx),blocked=Math.abs(player.y-height)<4&&ahead>0&&ahead<9&&side<4;waiting=blocked;if(!blocked){progress+=sign*Math.min(Math.abs(target-progress),dt*2.2);if(Math.abs(target-progress)<.001)moving=false;}}pose(time);}
 return{height,width,group,route,total,pointAt,onBridge,canWalk,invite,update,dispose(){group.traverse(o=>{if(o.isMesh)o.geometry.dispose();});stone.dispose();bronze.dispose();group.removeFromParent();},get state(){return{progress,target,moving,waiting,atRoof:progress===total,position:pointAt(progress)};}};
};
})(window);
