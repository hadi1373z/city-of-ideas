export const CITY_EDGE_DOOR={x:-255,z:-75};
export const inWorld=(bounds,x,z)=>x>=bounds.minX&&x<=bounds.maxX&&z>=bounds.minZ&&z<=bounds.maxZ;
export function buildWorldDoor(T,{x,z,yaw=0,returning=false}){
 const group=new T.Group();group.name=returning?'Return door · City of Ideas':'Edge door · Graveyard of Ideas';group.position.set(x,.13,z);group.rotation.y=yaw;
 const frame=new T.MeshStandardMaterial({color:0x334b40,roughness:.7}),brass=new T.MeshStandardMaterial({color:0xb49a62,metalness:.55,roughness:.4}),glow=new T.MeshStandardMaterial({color:0xb9d1ca,emissive:0x547f70,emissiveIntensity:.5,side:T.DoubleSide});
 const owned=[frame,brass,glow];
 const box=(w,h,d,mat,px,py,pz)=>{const g=new T.BoxGeometry(w,h,d),m=new T.Mesh(g,mat);owned.push(g);m.position.set(px,py,pz);group.add(m);return m;};
 for(const side of[-1,1])box(.28,4.4,.4,frame,side*1.85,2.2,0);
 box(3.98,.32,.4,frame,0,4.4,0);box(3.7,.08,.6,brass,0,.04,0);
 const door=box(3.35,4.05,.12,glow,0,2.1,-.05);door.name='Luminous door to another world';
 box(.1,.65,.18,brass,1.35,1.9,.1);
 group.traverse(o=>o.userData={...o.userData,worldDoor:returning?'city':'graveyard'});
 return{group,dispose(){group.removeFromParent();owned.forEach(o=>o.dispose());group.clear();}};
}
export function installGraveyardWorld(M,T,layout,entry){
 const bounds=layout.bounds,remote=(x=M.player.x)=>x<-1000;
 const groundGeo=new T.PlaneGeometry(bounds.maxX-bounds.minX,bounds.maxZ-bounds.minZ),groundMat=new T.MeshLambertMaterial({color:0x657464}),ground=new T.Mesh(groundGeo,groundMat);
 ground.name='Graveyard world · independent ground';ground.rotation.x=-Math.PI/2;ground.position.set((bounds.minX+bounds.maxX)/2,.005,(bounds.minZ+bounds.maxZ)/2);M.scene.add(ground);
 const doors=[buildWorldDoor(T,{...CITY_EDGE_DOOR,yaw:Math.PI/2}),buildWorldDoor(T,{x:layout.x+60,z:layout.z,yaw:-Math.PI/2,returning:true})];
 for(const d of doors){M.scene.add(d.group);M.city.targets.push(d.group);}
 const oldCan=M.city.canStand,oldGround=M.extraGround,oldTarget=M.city.targetInfo,oldShow=M.showExtra,oldUpdate=M.city.update,oldStart=M.startExtra;
 M.city.canStand=(x,z)=>remote()?!inWorld(bounds,x,z)?false:oldCan(x,z):x< -270?false:oldCan(x,z);
 M.extraGround=(x,z)=>{const y=oldGround?.(x,z);return Number.isFinite(y)?y:remote(x)?.13:undefined;};
 const go=destination=>{M.clearMovement();M.arrive(destination==='graveyard'?entry:{x:CITY_EDGE_DOOR.x+12,z:CITY_EDGE_DOOR.z,y:.13,yaw:-Math.PI/2});};
 const visitDoor=()=>M.arrive({x:CITY_EDGE_DOOR.x+12,z:CITY_EDGE_DOOR.z,y:.13,yaw:Math.PI/2});
 M.startExtra=d=>{if(!['graveyard','graveyard-door'].includes(d))return oldStart?.(d);visitDoor();return true;};
 const visit=document.createElement('button');visit.id='visit-world-door';visit.type='button';visit.className='glass';visit.onclick=visitDoor;document.querySelector('.welcome-secondary')?.append(visit);
 const languageChanged=()=>visit.textContent=CITY_I18N.lang==='fa'?'دیدار از دروازهٔ لبهٔ جهان':CITY_I18N.lang==='de'?'Die Tür am Weltrand besuchen':'Visit the door at the world’s edge';languageChanged();addEventListener('city-language',languageChanged);
 M.city.targetInfo=d=>d.worldDoor?{kind:'world-door',data:d,title:d.worldDoor==='graveyard'?CITY_I18N.tx('ورود به گورستان ایده‌ها','Enter the Graveyard of Ideas'):CITY_I18N.tx('بازگشت به شهر ایده‌ها','Return to City of Ideas')}:oldTarget(d);
 M.showExtra=info=>{if(info.kind!=='world-door')return oldShow(info);go(info.data.worldDoor);return true;};
 const hint=document.createElement('button');hint.id='world-door-enter';hint.type='button';hint.className='primary world-door-enter';hint.hidden=true;document.body.append(hint);let nearest=null,cooldown=0;
 hint.onclick=()=>{if(nearest)go(nearest.group.userData.worldDoor);};
 const objectsDirection=document.querySelector('[data-direction="objects"]');if(objectsDirection)objectsDirection.hidden=true;
 M.city.update=(...args)=>{oldUpdate(...args);const active=M.mode==='city'&&remote();document.body.dataset.cityWorld=active?'graveyard':'ideas';ground.visible=active;doors[0].group.visible=!active;doors[1].group.visible=active;
  nearest=null;if(M.mode==='city')for(const d of doors){if(!d.group.visible)continue;const distance=Math.hypot(M.player.x-d.group.position.x,M.player.z-d.group.position.z);if(distance<9)nearest=d;if(distance<1.25&&args[1]>cooldown){cooldown=args[1]+2;go(d.group.userData.worldDoor);break;}}
  hint.hidden=!nearest||!!document.querySelector('dialog[open]');if(nearest)hint.textContent=M.city.targetInfo(nearest.group.userData).title;
 };
 return{get active(){return M.mode==='city'&&remote();},doors,go,drawDoor(ctx,{s,cx,cz}){ctx.fillStyle='#dbbd7d';ctx.fillRect(cx+CITY_EDGE_DOOR.x*s-2,cz+CITY_EDGE_DOOR.z*s-3,4,6);},drawActiveMap(ctx){if(!(M.mode==='city'&&remote()))return false;const s=.65,cx=130-layout.x*s,cz=130-layout.z*s;ctx.clearRect(0,0,260,260);ctx.fillStyle='#657464';ctx.fillRect(0,0,260,260);ctx.fillStyle='#e1d4b6';ctx.font='12px Tahoma';ctx.textAlign='center';ctx.fillText(CITY_I18N.tx('گورستان ایده‌ها','Graveyard of Ideas'),130,20);for(const p of[layout.mathematics,layout.objects,...Object.values(layout.stations)]){ctx.strokeStyle='#e1d4b6';ctx.strokeRect(cx+p.x*s-5,cz+p.z*s-5,10,10);}ctx.fillStyle='#ffcf72';ctx.beginPath();ctx.arc(cx+M.player.x*s,cz+M.player.z*s,4,0,Math.PI*2);ctx.fill();return true;},dispose(){doors.forEach(d=>d.dispose());ground.removeFromParent();groundGeo.dispose();groundMat.dispose();hint.remove();visit.remove();removeEventListener('city-language',languageChanged);}};
}
