// An anamorphic stair: each fragment is scaled along rays from one eye position.
// The fragments really occupy different depths; only their projections connect.
export function buildPerspectiveStairs(T,parent,{x,z}){
 const group=new T.Group();group.name='Escher · disconnected perspective stair';parent.add(group);const eye=new T.Vector3(0,1.8,4.2),owned=[],joins=[],paths=[];
 const paper=new T.MeshLambertMaterial({color:0xe0d9bf,side:T.DoubleSide}),ink=new T.LineBasicMaterial({color:0x6a5940});owned.push(paper,ink);
 const target=i=>new T.Vector3(-2.4+i*.4,2.1+i*.14,-3.7);
 const fromView=(p,k)=>p.clone().sub(eye).multiplyScalar(k).add(eye);
 for(const [part,k]of[.58,1,.76].entries()){
  const points=[];for(let i=part*4;i<(part+1)*4;i++){const a=target(i),b=new T.Vector3(a.x+.4,a.y,a.z);if(!points.length)points.push(a);points.push(b,target(i+1));}
  const physical=points.map(p=>fromView(p,k)),vertices=[],indices=[];
  for(let i=0;i<physical.length-1;i++){const a=physical[i],b=physical[i+1],direction=b.clone().sub(a),n=new T.Vector3(-direction.y,direction.x,0).normalize().multiplyScalar(.055*k),base=vertices.length/3;for(const p of[a.clone().add(n),a.clone().sub(n),b.clone().add(n),b.clone().sub(n)])vertices.push(p.x,p.y,p.z);indices.push(base,base+1,base+2,base+1,base+3,base+2);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,paper);mesh.name='Stair fragment '+(part+1);mesh.userData={escherPerspective:true};group.add(mesh);owned.push(geometry);
  const lineGeo=new T.BufferGeometry().setFromPoints(physical),line=new T.Line(lineGeo,ink);line.position.z=.004;group.add(line);owned.push(lineGeo);paths.push(physical);
 }
 for(let i=0;i<2;i++)joins.push([paths[i].at(-1),paths[i+1][0]]);
 // Three quiet floor studs invite comparison without identifying the correct one.
 const studGeo=new T.RingGeometry(.18,.24,32),studMat=new T.MeshLambertMaterial({color:0xb59c63,side:T.DoubleSide});owned.push(studGeo,studMat);
 for(const px of[-1.7,0,1.7]){const stud=new T.Mesh(studGeo,studMat);stud.rotation.x=-Math.PI/2;stud.position.set(px,.025,4.2);group.add(stud);}
 return{group,joins,paths,viewpoint:{x,y:1.93,z:z+4.2},focus:{x,y:3.07,z:z-3.7},dispose(){group.removeFromParent();owned.forEach(o=>o.dispose());group.clear();}};
}
export function measurePerspective(T,stairs,camera){
 stairs.group.updateWorldMatrix(true,false);camera.updateMatrixWorld(true);const eye=new T.Vector3(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z),distance=camera.position.distanceTo(eye),points=stairs.paths.flat().map(p=>stairs.group.localToWorld(p.clone()).project(camera));
 const visible=points.every(p=>Math.abs(p.x)<.95&&Math.abs(p.y)<.95&&p.z>-1&&p.z<1),gaps=stairs.joins.map(pair=>{const[a,b]=pair.map(p=>stairs.group.localToWorld(p.clone()).project(camera));return Math.hypot(a.x-b.x,a.y-b.y);}),gap=Math.max(...gaps),centre=points.reduce((s,p)=>s.add(p),new T.Vector3()).multiplyScalar(1/points.length);
 return{distance,gap,aligned:distance<.38&&visible&&gap<.009&&Math.abs(centre.x)<.3&&Math.abs(centre.y)<.4};
}
const COPY={
 en:{title:'A stair that depends on you',hint:'Compare the three floor marks. Move until the broken stair joins into one continuous line, then hold your view.',near:'The ends are almost meeting. Keep your view still.',solved:'The stair aligns. A passage has opened behind it.',mark:'Try the next floor mark',focus:'Look at the stair',reflect:'What changed? · Notebook',replay:'Try the viewpoint again',restored:'Welcome back. Your passage is still open.'},
 de:{title:'Eine Treppe, die von dir abhängt',hint:'Vergleiche die drei Bodenmarkierungen. Bewege dich, bis die Treppe eine durchgehende Linie bildet, und halte den Blick.',near:'Die Enden treffen fast zusammen. Halte deinen Blick ruhig.',solved:'Die Treppe passt zusammen. Dahinter öffnet sich ein Durchgang.',mark:'Die nächste Bodenmarkierung versuchen',focus:'Die Treppe ansehen',reflect:'Was hat sich verändert? · Notizbuch',replay:'Den Blickwinkel erneut suchen',restored:'Willkommen zurück. Dein Durchgang ist noch offen.'},
 fa:{title:'پلکانی که به تو وابسته است',hint:'سه نشانهٔ کف را مقایسه کن. جابه‌جا شو تا پله‌های جدا به یک خط پیوسته برسند؛ سپس نگاهت را نگه دار.',near:'لبه‌ها تقریباً به هم رسیده‌اند. نگاهت را ثابت نگه دار.',solved:'پله‌ها هم‌راستا شدند. گذرگاهی پشت آن‌ها باز شد.',mark:'آزمودن نشانهٔ بعدی کف',focus:'نگاه به پلکان',reflect:'چه چیزی تغییر کرد؟ · دفتر من',replay:'جست‌وجوی دوبارهٔ زاویهٔ دید',restored:'خوش آمدی. گذرگاهت هنوز باز است.'}
};
export function installPerspectiveActivity(M,T,model){
 const stairs=buildPerspectiveStairs(T,model.group,{x:model.entry.x,z:model.entry.z-8.4});let solved=false,restored=false,replaying=false,hold=0,last=0,opening=0;
 const panel=document.createElement('aside');panel.id='escher-perspective';panel.innerHTML='<strong></strong><p role="status"></p><progress max="1" value="0" aria-label="Stair alignment"></progress><div><button type="button" class="glass" data-mark></button><button type="button" class="glass" data-focus></button><button type="button" class="glass" data-reflect></button><button type="button" class="glass" data-replay></button></div>';panel.hidden=true;document.body.append(panel);const n=s=>panel.querySelector(s),copy=()=>COPY[CITY_I18N.lang]||COPY.en;
 let mark=-1;const faceStair=()=>{M.clearMovement();M.pointToward(stairs.focus);M.player.pitch=Math.atan2(stairs.focus.y-M.player.y,Math.hypot(stairs.focus.x-M.player.x,stairs.focus.z-M.player.z));};n('[data-focus]').onclick=faceStair;n('[data-mark]').onclick=()=>{mark=(mark+1)%3;const x=stairs.viewpoint.x+[-1.7,0,1.7][mark],z=stairs.viewpoint.z;if(!M.city.canStand(x,z))return;M.arrive({x,z,y:.13,yaw:0});faceStair();};n('[data-reflect]').onclick=()=>M.visitorMemory?.open('escher-viewpoint');n('[data-replay]').onclick=()=>{replaying=true;solved=false;restored=false;hold=0;opening=0;mark=-1;M.arrive(model.entry);model.setPassage(false,0);};
 let renderedKey='';function render(aligned=false){const key=[CITY_I18N.lang,solved,restored,!!aligned].join(':');n('progress').value=Math.min(1,hold/1.4);if(key===renderedKey)return;renderedKey=key;const c=copy();panel.dir=CITY_I18N.lang==='fa'?'rtl':'ltr';n('strong').textContent=c.title;n('p').textContent=solved?(restored?c.restored:c.solved):aligned?c.near:c.hint;n('[data-mark]').textContent=c.mark;n('[data-mark]').hidden=solved;n('[data-focus]').textContent=c.focus;n('[data-focus]').hidden=solved;n('[data-reflect]').textContent=c.reflect;n('[data-reflect]').hidden=!solved;n('[data-replay]').textContent=c.replay;n('[data-replay]').hidden=!solved;n('progress').hidden=solved;n('progress').value=hold/1.4;}
 const prior=M.city.update;M.city.update=(...args)=>{prior(...args);const time=args[1],dt=last?Math.min(.1,Math.max(0,time-last)):0;last=time;
  if(!solved&&!replaying&&M.visitorMemory?.store.has('escher-perspective')){solved=true;restored=true;opening=1;model.setPassage(true,1);}
  const inside=M.mode==='city'&&(model.inside(M.player.x,M.player.z)||Math.hypot(M.player.x-model.entry.x,M.player.z-model.entry.z)<3),modal=!!document.querySelector('dialog[open],#reader-panel:not([hidden])');panel.hidden=!inside||modal;
  if(solved){opening=Math.min(1,opening+(matchMedia('(prefers-reduced-motion: reduce)').matches?1:dt*1.1));model.setPassage(true,opening);}else if(inside&&!modal&&!document.hidden){M.camera.position.set(M.player.x,M.player.y,M.player.z);M.camera.rotation.order='YXZ';M.camera.rotation.set(M.player.pitch,M.player.yaw,0);const result=measurePerspective(T,stairs,M.camera);hold=result.aligned?hold+dt:0;if(hold>=1.4){solved=true;restored=false;M.visitorMemory?.discover('escher-perspective');}render(result.aligned);}else hold=0;
  if(solved)render();
 };
 const languageChanged=()=>render();render();addEventListener('city-language',languageChanged);addEventListener('pagehide',()=>{removeEventListener('city-language',languageChanged);stairs.dispose();panel.remove();},{once:true});return{stairs,get solved(){return solved;},get progress(){return hold/1.4;}};
}
