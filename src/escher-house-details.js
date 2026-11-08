// Owned wall/door details stay inside existing collision bands; the perspective stays borrowed.
export function buildEscherDetails(T,model){
 const group=new T.Group();group.name='Escher · edge reading rail';model.group.add(group);const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c})),wood=mat(0x71614b),pale=mat(0xcbbd9c),paper=mat(0xf1e9d3),ink=mat(0x324a45);
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);p.add(o);return o;};
 for(const x of[-1.56,1.56])box(group,.08,3.45,.26,x,1.725,7,wood);
 for(const x of[-2.75,2.75])for(const y of[.12,3.1])box(group,2.35,.055,.26,x,y,7,pale);
 const roof=model.group.children.find(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===8&&o.geometry.parameters.depth===2.8),fascias=[];
 if(!roof)throw Error('Expected the original public-room roof slab');
 const {width,depth}=roof.geometry.parameters;
 for(const z of[-1,1]){const o=box(group,width,.1,.07,roof.position.x,roof.position.y-.025,roof.position.z+z*depth/2,pale);o.name='Public roof edge';fascias.push(o);}
 for(const x of[-1,1]){const o=box(group,.07,.1,depth,roof.position.x+x*width/2,roof.position.y-.025,roof.position.z,wood);o.name='Public roof side';fascias.push(o);}
 const rail=new T.Group();rail.name='Escher · one edge and two pieces';rail.position.set(3.84,.8,-1.5);rail.rotation.y=-Math.PI/2;group.add(rail);
 box(rail,1.9,.72,.06,0,.43,0,wood);box(rail,2,.065,.16,0,.05,-.01,wood);
 for(const x of[-.75,.75])box(rail,.08,.6,.02,x,.4,-.04,wood);
 const cards=[],lines=[];for(const x of[-.44,.44])cards.push(box(rail,.76,.55,.012,x,.43,.036,paper));
 lines.push(box(rail,.46,.018,.008,-.44,.46,.048,ink));for(const x of[.295,.585])lines.push(box(rail,.17,.018,.008,x,.46,.048,ink));
 for(const [cx,count]of[[-.44,1],[.44,2]])for(let j=0;j<count;j++)box(rail,.025,.055,.008,cx+(j-(count-1)/2)*.07,.25,.048,ink);
 group.traverse(o=>{o.userData={hourlyEscherDetail:true};});rail.traverse(o=>{o.userData={hourlyEscherDetail:true,escherGuide:true};});
 let disposed=false;return{group,rail,cards,lines,fascias,roof,targets:[rail],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
