// Owned additions in the original Monet house's local coordinates.
export function buildMonetDetails(T,house){
 const group=new T.Group();group.name='Monet · looking folio and house details';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.88}));
 const wood=mat('#62766f'),pale=mat('#e4dcc5'),paper=mat('#f7efd9'),ink=mat('#507258'),rose=mat('#bf8d9d');
 function box(name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);group.add(o);return o;}
 // Follow the existing gable. No replacement roof, aperture or floor geometry.
 for(const z of[-3.375,3.375])for(const side of[-1,1]){const length=Math.hypot(3.83,1.35),o=box('Gable edge',length,.07,.07,side*1.915,3.675,z,pale);o.rotation.z=-side*Math.atan2(1.35,3.83);}
 for(const x of[-3.84,3.84])box('Eave fascia',.075,.10,6.75,x,3.005,0,pale);
 box('Window sill',1.55,.075,.25,-2.2,1.005,3.12,pale);box('Window header',1.55,.07,.14,-2.2,2.235,3.15,pale);
 for(const x of[-.88,0,.88])box('Bench joint cap',.07,.12,.57,x,.38,.5,wood);
 for(const z of[.28,.50,.72])box('Bench seat slat',2.01,.016,.18,0,.533,z,pale);
 box('Worktable apron',1.12,.13,.055,2.03,.665,1.95,wood);
 const folio=new T.Group();folio.name='Looking folio';folio.position.set(2.35,.82,1.91);folio.userData={monetGuide:true};group.add(folio);
 const add=(name,w,h,d,x,y,z,m)=>{const o=box(name,w,h,d,x,y,z,m);folio.attach(o);o.position.set(x,y,z);return o;};
 // attach followed by local placement keeps every piece on the unchanged tabletop.
 add('Folio cover',.5,.018,.14,0,.009,0,wood);add('Folio paper',.47,.006,.125,0,.021,0,paper);
 add('Folio fold',.009,.002,.119,0,.025,0,pale);
 for(let i=0;i<3;i++){add('Colour mark',.045,.003,.022,-.16+i*.055,.026,-.025+i*.018,i===1?rose:ink);add('Broken reflection',.05,.003,.008,.055+i*.045,.026,-.03+i*.025,ink);}
 // No colliders or stored state: additions stay on furniture or above head height.
 let disposed=false;return{group,folio,targets:[folio],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
