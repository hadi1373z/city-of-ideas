/* A glazed gallery entrance, held open for an uninterrupted walking route. */
(()=>{'use strict';
 window.createGalleryEntrance=function(THREE,{glass,textSign}){
  const group=new THREE.Group();group.name='Glazed gallery entrance';
  const bronze=new THREE.MeshStandardMaterial({color:0x51544c,metalness:.65,roughness:.4});
  const marking=new THREE.MeshBasicMaterial({color:0xd5d8cc,transparent:true,opacity:.6});
  const add=(name,w,h,d,material,x,y,z,parent=group)=>{
   const part=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
   part.name=name;part.position.set(x,y,z);parent.add(part);return part;
  };
  // The jambs run into the transom rather than ending as a detached portal.
  for(const side of[-1,1]){
   add('Facade entrance mullion',.075,6.755,.13,bronze,side*2.65,3.3775,0);
   add('Fixed entrance sidelight',1.31,3.06,.035,glass,side*1.955,1.57,0);
   add('Sidelight inner jamb',.055,3.10,.10,bronze,side*1.275,1.55,0);
   add('Sidelight sill',1.38,.045,.12,bronze,side*1.96,.025,0);
   const leaf=new THREE.Group();leaf.name='Retracted sliding glass door';
   leaf.position.set(side*1.865,0,.105);group.add(leaf);
   add('Sliding door glass',1.13,2.97,.035,glass,0,1.555,0,leaf);
   for(const x of[-.59,.59])add('Sliding door stile',.05,3.07,.07,bronze,x,1.555,0,leaf);
   for(const y of[.045,3.065])add('Sliding door rail',1.23,.06,.07,bronze,0,y,0,leaf);
   // Narrow safety markings make clear glass visible without opaque kick panels.
   for(const y of[1.15,1.65])for(const z of[-.024,.024]){
    add('Glass safety marking',.76,.025,.004,marking,0,y,z,leaf);
    add('Sidelight safety marking',.84,.025,.004,marking,side*1.955,y,z);
   }
  }
  add('Flush entrance threshold',5.34,.018,.22,bronze,0,.009,0);
  add('Sliding door header',5.38,.40,.32,bronze,0,3.28,0);
  add('Door running track',5.18,.075,.12,bronze,0,3.04,.105);
  // Independent front-facing text on each side avoids mirrored lettering inside.
  for(const face of[-1,1]){
   const label=textSign('گالری زرتشت','#eee9db',3.7,.40,group);
   label.name=face>0?'Gallery name outside':'Gallery name inside';
   label.position.set(0,3.28,face*.166);label.rotation.y=face<0?Math.PI:0;
   label.material=label.material.clone();label.material.side=THREE.FrontSide;
  }
  return group;
 };
})();
