import {HUMANITY_COMMONS as C,CARE_NEEDS} from './humanity-commons-model.js?v=makers-passages-20261118';

// Original garden architecture and abstract figures; no borrowed character,
// sculpture mesh, image, recording, dynamic light or reflection pass.
export function buildHumanityCommons(T,{canvasFactory=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Commons of Care · a table for deciding together';group.position.set(C.x,C.y,C.z);const owned=new Set(),own=x=>(owned.add(x),x),mat=(color,options={})=>own(new T.MeshLambertMaterial({color,...options}));
 const stone=mat(0xc9bea5),ivory=mat(0xe2d8bf),teal=mat(0x376f70),brass=mat(0xb49a61),earth=mat(0x7b6047),leaf=mat(0x68816a),water=mat(0x76aaa8),cloth=mat(0xd7cfb5,{side:T.DoubleSide});
 const mesh=(g,m,name,x=0,y=0,z=0)=>{const o=new T.Mesh(own(g),m);o.name=name;o.position.set(x,y,z);group.add(o);return o;},cylinder=(r,h,m,name,x,y,z)=>mesh(new T.CylinderGeometry(r,r,h,32),m,name,x,y,z),box=(w,h,d,m,name,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,name,x,y,z);
 function beam(a,b,r=.055){const p=new T.Vector3(...a),q=new T.Vector3(...b),v=q.clone().sub(p),o=cylinder(r,v.length(),brass,'Canopy rib',0,0,0);o.position.copy(p.add(q).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());}
 cylinder(9.2,.045,stone,'Circular civic garden paving',0,-.0225,0);
 // A sixfold linen canopy rises to one open-looking crown. The front has a
 // clear central approach between the two posts, rather than a blocked door.
 const roof=[];for(let i=0;i<6;i++){const a=i*Math.PI/3,b=(i+1)*Math.PI/3,p=[8.4*Math.cos(a),4.55,8.4*Math.sin(a)],q=[8.4*Math.cos(b),4.55,8.4*Math.sin(b)];roof.push(0,5.65,0,...p,...q);beam([0,5.62,0],p);cylinder(.105,4.5,brass,'Slender canopy support',7.2*Math.cos(a),2.25,7.2*Math.sin(a));}
 const canopy=new T.BufferGeometry();canopy.setAttribute('position',new T.Float32BufferAttribute(roof,3));canopy.computeVertexNormals();mesh(canopy,cloth,'Folded shade for the shared table');
 cylinder(3.2,.18,stone,'Shared round table',0,1.06,0);cylinder(.65,1.02,ivory,'Table pedestal',0,.51,0);cylinder(.5,.45,brass,'Six-unit common reservoir',0,1.36,-1.5);
 const bowls=[];for(let i=0;i<3;i++){const x=(i-1)*2.05,z=.15;
  cylinder(.64,.16,ivory,'Household '+String.fromCharCode(65+i)+' bowl',x,1.23,z);const rim=mesh(new T.RingGeometry(.51,.64,40),brass,'Stone bowl rim',x,1.31,z);rim.rotation.x=-Math.PI/2;
  const column=cylinder(.47,.2,water,'Allocated water · household '+String.fromCharCode(65+i),x,1.42,z);bowls.push(column);
  // A separate narrow need gauge makes comparison visible after closing the
  // reader. Its height is fixed by the openly stated fictional need.
  box(.22,.18*CARE_NEEDS[i],.22,teal,'Reported need '+CARE_NEEDS[i],x,1.15+.09*CARE_NEEDS[i],-.78);
 }
 // Three differently poised stone forms suggest listening participants rather
 // than another historical character or an uncredited realistic model.
 for(let i=0;i<3;i++){const x=(i-1)*4,z=-4.7; cylinder(.36,1.05,i===1?teal:stone,'Abstract listening figure',x,.675,z);cylinder(.12,.35,ivory,'Figure neck',x,1.365,z);const head=mesh(new T.SphereGeometry(.3,14,10),ivory,'Abstract figure head',x,1.8,z);head.scale.set(.9,1.08,.9);cylinder(.6,.15,stone,'Figure footing',x,.075,z);beam([x-.2,1.15,z],[x-.57,1.08,z+.25],.08);beam([x+.2,1.15,z],[x+.55,1.4+(i-1)*.08,z+.18],.08);}
 for(const x of[-5.4,5.4]){box(1.3,.2,2.6,stone,'Garden bench',x,.6,1.4);for(const z of[.5,2.3])box(.35,.55,.35,brass,'Bench support',x,.275,z);cylinder(1,.48,earth,'Garden planter',x,.24,-2.1);for(let i=0;i<4;i++){const a=i*Math.PI/2,o=mesh(new T.IcosahedronGeometry(.7,1),leaf,'Quiet garden foliage',x+.35*Math.cos(a),1.02,-2.1+.35*Math.sin(a));o.scale.y=1.25;}}
 function label(lines,w,h,x,y,z){const c=canvasFactory();c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#254644';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#eee4c6';ctx.textAlign='center';lines.forEach((s,i)=>{ctx.font=(i===0?'54':'38')+'px Georgia';ctx.fillText(s,512,96+i*76,960);});const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,h),own(new T.MeshLambertMaterial({map:texture,side:T.DoubleSide})),lines[0],x,y,z);}
 for(let i=0;i<3;i++)label([String.fromCharCode(65+i)+' · need '+CARE_NEEDS[i],'Allocation changes with the rule'],1.55,.39,(i-1)*2.05,1.22,.87);
 const plaque=label(['COMMONS OF CARE','Six units. Three households. Who decides?'],4.6,1.15,0,1.12,6.15);plaque.userData.humanityCommons='human-care';for(const x of[-2,2])box(.1,.65,.1,brass,'Commons sign support',x,.42,6.1);
 let disposed=false;return{group,targets:[plaque],bowls,update(allocation){if(disposed)return;allocation.forEach((n,i)=>{const h=.08+.15*n;bowls[i].scale.y=h/.2;bowls[i].position.y=1.31+h/2;});},dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
