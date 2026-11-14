// Public source-room additions own their resources and never join the source disposer tree.
const PUBLIC_KEYS=['rooms','doors','residence','stairs','sharedCityApproach'];
function sameData(a,b){
 if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const x=Object.getOwnPropertyDescriptors(a),y=Object.getOwnPropertyDescriptors(b),keys=Object.keys(x);return keys.length===Object.keys(y).length&&keys.every(k=>Object.hasOwn(y,k)&&Object.hasOwn(x[k],'value')&&Object.hasOwn(y[k],'value')&&sameData(x[k].value,y[k].value));
}
export function publicStudyParts(owner,template){
 const house=owner?.house;if(!house||!template||!owner.group)return null;
 const data=Object.getOwnPropertyDescriptors(house),expected=Object.getOwnPropertyDescriptors(template);
 // Private ideas, learning and resident records belong to the source application:
 // none of their values is inspected, even when a companion is opened.
 if(Object.keys(data).some(k=>![...PUBLIC_KEYS,'ideas','learning','resident'].includes(k)))return null;
 if(!PUBLIC_KEYS.every(k=>data[k]&&expected[k]&&Object.hasOwn(data[k],'value')&&sameData(data[k].value,expected[k].value)))return null;
 const room=owner.group.getObjectByName('home-interior-math'),desk=room?.getObjectByName('home-desk'),chair=room?.getObjectByName('home-armchair');
 if(!room||!desk||!chair||!room.getObjectByName('home-bookshelf')||!room.getObjectByName('home-plant'))return null;
 let custom=false;room.traverse(o=>{if(o.userData.ideaId||o.userData.designId)custom=true;});if(custom)return null;
 for(const[o,x,z]of[[desk,-9.55500001192093,-7.13],[chair,-9.54499999165535,-5.729999999701977]])if(Math.abs(o.position.x-x)>1e-6||Math.abs(o.position.z-z)>1e-6||o.position.y!==0||Math.abs(o.rotation.y-Math.PI/2)>1e-6||o.scale.x!==1||o.scale.y!==1||o.scale.z!==1)return null;
 let top=false,book=false;desk.traverse(o=>{const p=o.geometry?.parameters;if(p?.width===1.5&&p.height===.055&&p.depth===.65)top=true;if(o.userData.homeAction==='read'&&o.userData.bookInstanceId==='home-book-math-1')book=true;});
 return top&&book?{room,desk,chair}:null;
}
export function buildSocratesStudyDetails(T,parts){
 const group=new T.Group();group.name='Socrates study · public reason cards and joinery';group.userData={animated:true};
 const deskRoot=new T.Group(),chairRoot=new T.Group();for(const root of[deskRoot,chairRoot]){root.matrixAutoUpdate=false;group.add(root);}const resources=new Set(),aprons=[],joints=[],chairJoints=[],posts=[],cards=[];
 const material=(color)=>{const m=new T.MeshStandardMaterial({color,roughness:.9});resources.add(m);return m;},wood=material('#765c43'),pale=material('#eadbc2'),ink=material('#375863');
 function box(root,name,w,h,d,x,y,z,mat=wood){const g=new T.BoxGeometry(w,h,d);resources.add(g);const mesh=new T.Mesh(g,mat);mesh.name=name;mesh.position.set(x,y,z);root.add(mesh);return mesh;}
 for(const z of[-.24,.24])aprons.push(box(deskRoot,'Study desk apron',1.38,.05,.035,0,.7075,z));
 for(const x of[-.67,.67])for(const z of[-.24,.24])joints.push(box(deskRoot,'Study leg joint',.08,.035,.08,x,.715,z));
 for(const x of[-.26,.26])for(const z of[-.23,.23])chairJoints.push(box(chairRoot,'Supported chair joint',.07,.09,.07,x,.295,z));
 const rack=new T.Group();rack.name='Claim and reasons · original city cards';deskRoot.add(rack);
 const backing=box(rack,'Backed reason-card rack',.76,.52,.035,.11,1.385,-.303);
 for(const x of[-.21,.43])posts.push(box(rack,'Desk-supported rack post',.035,.3375,.033,x,.95625,-.303));
 for(const x of[-.08,.30])cards.push(box(rack,'Original city prompt card',.32,.42,.012,x,1.385,-.2795,pale));
 const mark=(w,h,x,y)=>box(rack,'Original city rule',w,h,.007,x,y,-.270,ink);
 mark(.23,.014,-.08,1.44);mark(.13,.009,-.08,1.32);
 // An open fork asks for more than one possible reason; it is not a historical notation.
 mark(.015,.18,.24,1.405);mark(.13,.014,.30,1.495);mark(.13,.014,.30,1.315);
 rack.traverse(o=>{if(o.isMesh)o.userData={socratesStudyReading:true,animated:true};});
 let disposed=false;function sync(){for(const[root,source]of[[deskRoot,parts.desk],[chairRoot,parts.chair]]){source.updateWorldMatrix(true,false);root.matrix.copy(source.matrixWorld);}group.updateMatrixWorld(true);}
 sync();return{group,deskRoot,chairRoot,rack,backing,posts,cards,aprons,joints,chairJoints,targets:[rack],sync,dispose(){if(disposed)return;disposed=true;group.removeFromParent();resources.forEach(r=>r.dispose());group.clear();}};
}
