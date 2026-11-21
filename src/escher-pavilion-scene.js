import {ESCHER_PAVILION as P,pavilionPolygon,pavilionEntry,inPavilion} from './escher-pavilion-model.js?v=academy-escher-20261120';
import {DESCENT,outsideRectangle} from './escher-descent-model.js?v=shore-niches-20261121';
import {outsidePolygonRectangle} from './escher-cloister-layout.js';

export function buildEscherPavilion(T,{x=228,z=115,works,loadTexture,canvas}){
 const group=new T.Group();group.name='Escher · House of Perspectives';group.position.set(x,.13,z);group.userData.cityDestination='artist:escher';const centreZ=-1,owned=new Set(),targets=[],paintings=[],walls=[],pillars=[],batches=new Map(),own=o=>(owned.add(o),o);
 const mat=(c,extra={})=>own(new T.MeshLambertMaterial({color:c,side:T.DoubleSide,...extra})),stone=mat(0xd6cbb3),ink=mat(0x335d5b),trim=mat(0xbaa36c),slate=mat(0x527371),vaultMat=mat(0xc8c4ad),paper=mat(0xe5dec6),cut={minX:DESCENT.cut.minX-x,maxX:DESCENT.cut.maxX-x,minZ:DESCENT.cut.minZ-z,maxZ:DESCENT.cut.maxZ-z};
 function face(poly,m){if(poly.length<3)return;let a=batches.get(m);if(!a)batches.set(m,a=[]);for(let i=1;i<poly.length-1;i++)for(const p of[poly[0],poly[i],poly[i+1]])a.push(...p);}
 const unit=own(new T.BoxGeometry(1,1,1)),o=new T.Object3D();
 function append(g,m,matrix){const a=g.attributes.position,index=g.index;let p=batches.get(m);if(!p)batches.set(m,p=[]);for(let i=0;i<(index?.count??a.count);i++){const v=new T.Vector3().fromBufferAttribute(a,index?index.getX(i):i).applyMatrix4(matrix);p.push(v.x,v.y,v.z);}}
 function box(w,h,d,px,y,pz,m=stone,yaw=0){o.position.set(px,y,pz);o.rotation.set(0,yaw,0);o.scale.set(w,h,d);o.updateMatrix();append(unit,m,o.matrix);}
 function rod(a,b,r=.04,m=trim){const g=own(new T.CylinderGeometry(r,r,1,8)),aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);o.position.copy(aa).add(bb).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());o.scale.set(1,d.length(),1);o.updateMatrix();append(g,m,o.matrix);}
 function slab(poly,y,t,m){face([...poly].reverse().map(([a,b])=>[a,y,b]),m);face(poly.map(([a,b])=>[a,y-t,b]),m);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];face([[...a.slice(0,1),y,a[1]],[b[0],y,b[1]],[b[0],y-t,b[1]],[a[0],y-t,a[1]]],m);}}
 const poly=pavilionPolygon(0,centreZ),outer=pavilionPolygon(0,centreZ,27.9),inner=pavilionPolygon(0,centreZ,8);
 // The actual walking slab and every lozenge are clipped at the real stair mouth.
 for(const q of outsidePolygonRectangle(poly,cut))slab(q,-.02,.18,stone);
 function clip(p,a,b){const out=[],side=q=>(b[0]-a[0])*(q[1]-a[1])-(b[1]-a[1])*(q[0]-a[0]);for(let i=0;i<p.length;i++){const u=p[i],v=p[(i+1)%p.length],du=side(u),dv=side(v);if(du>=0)out.push(u);if((du<0)!==(dv<0)){const t=du/(du-dv);out.push([u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t]);}}return out;}
 const colours=[paper,mat(0xa9b8a6),mat(0xc2ad7c)],s=1.1;
 for(let r=-18;r<=18;r++)for(let q=-22;q<=22;q++){const c=[Math.sqrt(3)*s*(q+r/2),centreZ+1.5*s*r],v=Array.from({length:6},(_,i)=>[c[0]+s*Math.cos(Math.PI/6+i*Math.PI/3),c[1]+s*Math.sin(Math.PI/6+i*Math.PI/3)]);for(let k=0;k<3;k++){let p=[c,v[2*k],v[(2*k+1)%6],v[(2*k+2)%6]];for(let i=0;i<6;i++)p=clip(p,poly[i],poly[(i+1)%6]);for(const t of outsidePolygonRectangle(p,cut))face([...t].reverse().map(([a,b])=>[a,0,b]),colours[k]);}}
 function wall(a,b){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);box(len,5.6,.34,(a[0]+b[0])/2,2.8,(a[1]+b[1])/2,stone,-Math.atan2(dz,dx));walls.push({a:[a[0]+x,a[1]+z],b:[b[0]+x,b[1]+z]});}
 const front=poly[1][1];
 for(let i=0;i<6;i++){const a=poly[i],b=poly[(i+1)%6],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx),nx=dz/len,nz=-dx/len;
  if(i===1){wall(a,[2.65,front]);wall([-2.65,front],b);box(5.3,.22,.4,0,5.49,front);}else wall(a,b);
  for(const[y,h,d,m]of[[.18,.35,.5,vaultMat],[.45,.12,.6,stone],[5.34,.18,.6,stone],[5.55,.12,.7,trim]]){if(i===1){for(const sign of[-1,1])box((len-5.5)/2,h,d,sign*(len+5.5)/4,y,front,m);}else box(len+.15,h,d,(a[0]+b[0])/2,y,(a[1]+b[1])/2,m,yaw);}
  // Opaque framed recesses back the print walls; they are not false glass openings.
  for(const t of[.18,.5,.82]){const px=a[0]+dx*t,pz=a[1]+dz*t;if(i===1&&Math.abs(px)<4)continue;
   const at=(u,v,depth=.205)=>[px+dx/len*u+nx*depth,v,pz+dz/len*u+nz*depth],outline=[at(-1.5,.9),at(1.5,.9),at(1.5,2.55)];
   for(let k=1;k<=24;k++){const theta=k*Math.PI/24;outline.push(at(1.5*Math.cos(theta),2.55+1.5*Math.sin(theta)));}face(outline,ink);
   for(const sign of[-1,1])box(.16,1.73,.14,px+dx/len*sign*1.59+nx*.25,1.72,pz+dz/len*sign*1.59+nz*.25,stone,yaw);
   for(let k=0;k<24;k++){const u=k*Math.PI/24,v=(k+1)*Math.PI/24;face([at(1.5*Math.cos(u),2.55+1.5*Math.sin(u),.28),at(1.5*Math.cos(v),2.55+1.5*Math.sin(v),.28),at(1.68*Math.cos(v),2.55+1.68*Math.sin(v),.28),at(1.68*Math.cos(u),2.55+1.68*Math.sin(u),.28)],stone);}
   box(3.4,.14,.3,px+nx*.27,.87,pz+nz*.27,stone,yaw);rod(at(0,.97,.29),at(0,3.97,.29),.027);rod(at(-1.45,1.65,.29),at(1.45,1.65,.29),.025);
  }
  // Original flying-bird relief unifies all six elevations with the museum below.
  for(let d=1.4;d<len-1.2;d+=2.35){const t=d/len,px=a[0]+dx*t+nx*.205,pz=a[1]+dz*t+nz*.205,bird=[[-.6,0],[-.22,.08],[-.4,.35],[0,.16],[.4,.35],[.22,.08],[.6,0],[.25,-.12],[0,-.18],[-.25,-.12]];face(bird.map(([u,v])=>[px+dx/len*u,4.84+v,pz+dz/len*u]),slate);}
  // Closed roof facets and cream soffits meet their bearing wall and inner arcade.
  const j=(i+1)%6;face([[outer[i][0],5.72,outer[i][1]],[outer[j][0],5.72,outer[j][1]],[inner[j][0],7.55,inner[j][1]],[inner[i][0],7.55,inner[i][1]]],slate);face([[outer[i][0],5.54,outer[i][1]],[outer[j][0],5.54,outer[j][1]],[inner[j][0],7.37,inner[j][1]],[inner[i][0],7.37,inner[i][1]]],vaultMat);rod([outer[i][0],5.75,outer[i][1]],[inner[i][0],7.59,inner[i][1]],.055);
 }
 function arch(cx,base,cz,half,spring,height,yaw=0){const sh=new T.Shape();sh.moveTo(-half-.35,0);sh.lineTo(-half-.35,height);sh.lineTo(half+.35,height);sh.lineTo(half+.35,0);sh.lineTo(half,0);sh.lineTo(half,spring);for(let i=1;i<=40;i++){const a=i*Math.PI/40;sh.lineTo(half*Math.cos(a),spring+Math.min(half,height-spring-.18)*Math.sin(a));}sh.lineTo(-half,0);sh.closePath();const g=own(new T.ExtrudeGeometry(sh,{depth:.34,bevelEnabled:false,curveSegments:32}));o.position.set(cx,base,cz);o.rotation.set(0,yaw,0);o.scale.set(1,1,1);o.updateMatrix();append(g,stone,o.matrix);}
 arch(0,0,front-.15,2.2,3,5.6);for(const xx of[-2.45,2.45])pillars.push({x:x+xx,z:z+front,r:.45});
 for(const xx of[-2.37,2.37])box(.28,3,.28,xx,1.5,front+.23,stone);
 for(let i=0;i<32;i++){const a=i*Math.PI/32,b=(i+1)*Math.PI/32;face([[2.2*Math.cos(a),3+2.2*Math.sin(a),front+.23],[2.2*Math.cos(b),3+2.2*Math.sin(b),front+.23],[2.48*Math.cos(b),3+2.48*Math.sin(b),front+.23],[2.48*Math.cos(a),3+2.48*Math.sin(a),front+.23]],trim);}
 // A six-column arcade bears the glazed lantern; real gaps retain free circulation.
 const column=own(new T.CylinderGeometry(.27,.36,4.8,16));
 for(let i=0;i<6;i++){const a=inner[i],b=inner[(i+1)%6],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);o.position.set(a[0],2.5,a[1]);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrix();append(column,stone,o.matrix);box(.9,.22,.9,a[0],.12,a[1]);box(.86,.28,.86,a[0],4.99,a[1]);pillars.push({x:x+a[0],z:z+a[1],r:.58});arch((a[0]+b[0])/2,4.8,(a[1]+b[1])/2,len/2-.4,.25,2.55,-Math.atan2(dz,dx));}
 const glass=own(new T.MeshPhongMaterial({color:0x9ec5c4,transparent:true,opacity:.3,shininess:95,specular:0xcbe2df,side:T.DoubleSide,depthWrite:false})),glassP=[];
 for(let i=0;i<6;i++){const a=inner[i],b=inner[(i+1)%6],aa=[a[0]*.27,9.1,centreZ+(a[1]-centreZ)*.27],bb=[b[0]*.27,9.1,centreZ+(b[1]-centreZ)*.27],quad=[[a[0],7.56,a[1]],[b[0],7.56,b[1]],bb,aa];for(const k of[0,1,2,0,2,3])glassP.push(...quad[k]);rod(quad[0],aa,.065);rod(aa,bb,.045);}
 const gg=own(new T.BufferGeometry());gg.setAttribute('position',new T.Float32BufferAttribute(glassP,3));gg.computeVertexNormals();const glazed=new T.Mesh(gg,glass);glazed.name='Escher · genuine hexagonal glazed roof lantern';group.add(glazed);const top=pavilionPolygon(0,centreZ,2.16);face([...top].reverse().map(([a,b])=>[a,9.1,b]),glass);
 // A narrow internal vestibule keeps the existing real shaft, gate and return.
 for(const side of[-1,1]){box(.18,4.7,6,side*1.6,2.35,-10);walls.push({a:[x+side*1.6,z-13],b:[x+side*1.6,z-7]});}box(.5,4.7,.22,-1.4,2.35,-13);box(.5,4.7,.22,1.4,2.35,-13);box(2.3,1.1,.22,0,4.15,-13);arch(0,0,-7,1.4,2.25,4.7);
 let passageOpen=false,progress=0;const shutterGeo=own(new T.BoxGeometry(1.4,3.65,.16)),shutters=[-1,1].map(side=>{const m=new T.Mesh(shutterGeo,ink);m.position.set(side*.7,1.825,-7);group.add(m);return{side,m};});
 function frame(work,px,py,pz,yaw,h=3){const f=new T.Group();f.position.set(px,py,pz);f.rotation.y=yaw;group.add(f);const w=h*work.ratio,back=new T.Mesh(own(new T.BoxGeometry(w+.22,h+.22,.12)),ink);f.add(back);const tx=own(loadTexture(new URL('./assets/escher/'+work.file,import.meta.url).href));tx.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:tx,toneMapped:false})));mesh.position.z=.075;mesh.userData={escherWork:work.id,...(work.id==='waterfall'?{escherRevealed:true}:{})};f.add(mesh);paintings.push(mesh);return mesh;}
 const slots=[[-20.36,2.7,centreZ+11.75,Math.PI*2/3],[-20.36,2.7,centreZ-11.75,Math.PI/3],[20.36,2.7,centreZ+11.75,-Math.PI*2/3]];
 for(let i=0;i<3;i++)targets.push(frame(works[i],...slots[i]));const revealedPainting=frame(works.find(w=>w.id==='waterfall'),-1.45,2.45,-10.5,Math.PI/2,2.35/works[3].ratio);
 const c=canvas();c.width=1024;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#e7e0cb';ctx.fillRect(0,0,1024,512);ctx.fillStyle='#294c49';ctx.textAlign='center';ctx.font='bold 52px Georgia';ctx.fillText('THE HOUSE CONTINUES BELOW',512,100,960);ctx.font='36px Georgia';for(const[i,t]of['Frame and stair · compare the brass marks','Four original prints · connected experiments','Eight real stair flights · museum at −40m'].entries())ctx.fillText(t,512,225+i*90,950);const tx=own(new T.CanvasTexture(c));tx.colorSpace=T.SRGBColorSpace;const routePanel=new T.Mesh(own(new T.PlaneGeometry(4,2)),own(new T.MeshBasicMaterial({map:tx,toneMapped:false})));routePanel.position.set(3.1,2.4,-7.2);group.add(routePanel);
 // An original anamorphic frame: edges occupy three real depths. Their
 // projections join only from the brass stud; the existing stair puzzle stays intact.
 const sculptureEye=new T.Vector3(-3,1.8,5),cube=Array.from({length:8},(_,i)=>new T.Vector3(3.8+(i&1?1:-1),1.7+(i&2?1:-1),-.5+(i&4?1:-1))),sculptureEdges=[];
 for(let i=0;i<8;i++)for(const bit of[1,2,4])if(!(i&bit)){const k=[.83,1,1.16][sculptureEdges.length%3],a=cube[i].clone().sub(sculptureEye).multiplyScalar(k).add(sculptureEye),b=cube[i|bit].clone().sub(sculptureEye).multiplyScalar(k).add(sculptureEye);sculptureEdges.push([a.toArray(),b.toArray()]);rod(a.toArray(),b.toArray(),.13,stone);}
 box(5.6,.2,4.8,4.2,.1,-.5,vaultMat);pillars.push({x:x+4.2,z:z-.5,w:6,d:5.2});
 const studGeo=own(new T.RingGeometry(.16,.22,32)),stud=new T.Mesh(studGeo,trim);stud.rotation.x=-Math.PI/2;stud.position.set(sculptureEye.x,.012,sculptureEye.z);group.add(stud);
 // Low perimeter seats leave all artwork and the central comparison route clear.
 for(const sign of[-1,1])for(const zz of[-.5,8.5]){box(3,.45,1,sign*14,.225,zz,stone);box(3,.1,1,sign*14,.51,zz,ink);pillars.push({x:x+sign*14,z:z+zz,w:3.4,d:1.4});}

 for(const[m,p]of batches){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();const mesh=new T.Mesh(g,m);mesh.name='House of Perspectives · owned stone and roof';group.add(mesh);}
 group.updateMatrixWorld(true);
 const distance=(px,pz,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t);};
 const gateBlocks=(px,pz)=>(!passageOpen||progress<.95)&&Math.abs(px-x)<1.65&&Math.abs(pz-z+7)<.35;
 function canStand(px,pz){if(!Number.isFinite(px)||!Number.isFinite(pz))return false;return!walls.some(w=>distance(px,pz,w.a,w.b)<.38)&&!pillars.some(p=>p.r?Math.hypot(px-p.x,pz-p.z)<p.r:Math.abs(px-p.x)<p.w/2&&Math.abs(pz-p.z)<p.d/2)&&!gateBlocks(px,pz);}
 return{group,architecture:{group,glazed,polygon:poly,sculpture:{eye:sculptureEye.toArray(),edges:sculptureEdges},roofY:()=>7.4},targets,paintings,routePanel,revealedPainting,colliders:[],entry:pavilionEntry(x,z-1),passageEntry:{x,z:z-7},experimentOrigin:{x,z},canStand,inside:(px,pz)=>inPavilion(px,pz,x,z-1,-.5),gateBlocks,setLanguage(lang){const lines={en:["THE HOUSE CONTINUES BELOW","Frame and stair · compare the brass marks","Four original prints · connected experiments","Eight real stair flights · museum at −40m"],de:["DAS HAUS GEHT UNTEN WEITER","Rahmen und Treppe · vergleiche die Bodenmarken","Vier Originaldrucke · verbundene Experimente","Acht Treppenläufe · Museum auf −40m"],fa:["خانه در زیر زمین ادامه دارد","قاب و پلکان · نشانه‌های برنجی را مقایسه کن","چهار اثر اصلی · تجربه‌های پیوسته","هشت بازوی پلکان · موزه در ژرفای ۴۰ متر"]}[lang]||null;if(!lines)return;ctx.fillStyle="#e7e0cb";ctx.fillRect(0,0,1024,512);ctx.fillStyle="#294c49";ctx.direction=lang==="fa"?"rtl":"ltr";ctx.font="bold 52px Georgia";ctx.fillText(lines[0],512,100,960);ctx.font="36px Georgia";lines.slice(1).forEach((t,i)=>ctx.fillText(t,512,225+i*90,950));tx.needsUpdate=true;},setPassage(open,t=1){passageOpen=!!open;progress=t;for(const s of shutters){s.m.position.x=s.side*(.7+Math.min(1,t)*1.5);s.m.visible=t<1;}const i=targets.indexOf(revealedPainting);if(open&&i<0)targets.push(revealedPainting);else if(!open&&i>=0)targets.splice(i,1);},get passageOpen(){return passageOpen;},dispose(){group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
