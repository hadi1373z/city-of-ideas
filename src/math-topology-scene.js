// Fixed city prompts for the original public Topology floor; no source model is changed.
export const TOPOLOGY_STUDIES=Object.freeze({
  whole:Object.freeze([0,3]),
  separated:Object.freeze([[0,1],[2,3]].map(Object.freeze)),
  domain:Object.freeze([0,1]),range:Object.freeze([0,2]),
  markedInputs:Object.freeze([0,.5,1]),markedOutputs:Object.freeze([0,1,2])
});
export function buildMathTopologyDetails(T,model){
  if(model?.floor!==6||model.height!==24||!model.group||!['continuity','connectedness','homeomorphisms'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
  const group=new T.Group();group.name='Topology · supported interval folio and reading furniture';group.position.y=model.height;group.userData={animated:true,mathTopologyDetail:true};
  const owned=new Set(),aprons=[],joints=[],feet=[],pads=[],seams=[],posts=[],cards=[],strokes=[],marks=[],intervals=[],arrows=[];
  const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;};
  const wood=mat('#806d55'),linen=mat('#d6dfe6'),piping=mat('#607b8d'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
  function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
  for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
    for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Topology table front/back apron',w-.17,.10,.055,x,.74,z+dz));
    for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Topology table side apron',.055,.10,d-.17,x+dx,.74,z));
    for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13]){
      joints.push(box(group,'Topology table leg joint',.13,.08,.13,x+dx,.75,z+dz));
      feet.push(box(group,'Floor-supported table foot collar',.12,.045,.12,x+dx,.0225,z+dz,piping));
    }
  }
  for(const x of[-9.8,-5.8]){
    pads.push(box(group,'Fitted Topology reading pad',.62,.07,.57,x,.57,4.04,linen));
    for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));
    for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));
  }
  const rack=new T.Group();rack.name='Separation and reversible mapping · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
  const backing=box(rack,'Backed Topology folio',1.6,.75,.055,0,1.55,0);
  for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));
  for(const cx of[-.4,.4])cards.push(box(rack,'Original Topology card',.66,.60,.012,cx,1.55,.0335,paper));
  function line(a,b,material,name,width=.008){const m=box(rack,name,Math.hypot(b[0]-a[0],b[1]-a[1]),width,.0016,(a[0]+b[0])/2,(a[1]+b[1])/2,.0403,material);m.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);strokes.push(m);return m;}
  const disc=new T.CircleGeometry(.014,24);owned.add(disc);
  function mark(x,y){const m=new T.Mesh(disc,ochre);m.name='Included interval point · fixed city mark';m.position.set(x,y,.03955);rack.add(m);marks.push(m);return m;}
  const leftX=value=>-.67+value*.18,rightX=value=>.16+value*.24;
  function interval(a,b,y,xFor,name){const m=line([xFor(a),y],[xFor(b),y],blue,name,.012);intervals.push(m);mark(xFor(a),y);mark(xFor(b),y);return m;}
  interval(...TOPOLOGY_STUDIES.whole,1.72,leftX,'Whole real interval zero to three');
  for(const v of[1,2])line([leftX(v),1.70],[leftX(v),1.74],blue,'Shared interval unit tick',.005);
  for(const pair of TOPOLOGY_STUDIES.separated)interval(...pair,1.40,leftX,'Separated closed real interval');
  interval(...TOPOLOGY_STUDIES.domain,1.72,rightX,'Homeomorphism domain interval');
  interval(...TOPOLOGY_STUDIES.range,1.40,rightX,'Homeomorphism range interval');
  mark(rightX(TOPOLOGY_STUDIES.markedInputs[1]),1.72);mark(rightX(TOPOLOGY_STUDIES.markedOutputs[1]),1.40);
  function arrow(x,from,to,material,name){arrows.push(line([x,from],[x,to],material,name));const sign=Math.sign(to-from);for(const dx of[-.018,.018])arrows.push(line([x,to],[x+dx,to-sign*.025],material,name+' head',.006));}
  arrow(.105,1.67,1.45,blue,'Forward map · upper to lower');arrow(.695,1.45,1.67,ochre,'Inverse map · lower to upper');
  rack.traverse(o=>{if(o.isMesh)o.userData={mathTopologyReading:true,animated:true};});model.group.add(group);let disposed=false;
  return{group,rack,backing,posts,cards,strokes,marks,intervals,arrows,aprons,joints,feet,pads,seams,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
