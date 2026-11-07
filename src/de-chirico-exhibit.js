/* A walkable, original architectural study inspired by Giorgio de Chirico's
 * Le trouble du philosophe (1925–26). No reproduction of the painting is bundled.
 * The linked museum/gallery record is the reference, not an image licence.
 */
export const DE_CHIRICO_SOURCE='https://rabinovichgallery.com/artworks/giorgio-de-chirico-1888-1978-le-trouble-du-philosophe-le-repos-du-philosophe-mannequins-on-the-seashore-the-philosopher-s-rest-1925-1926-museo-del-novecento';
export const DE_CHIRICO_COPY={
 en:{
  title:'The metaphysical shore',
  subtitle:'Giorgio de Chirico · Le trouble du philosophe · 1925–26',
  intro:'An original walkable interpretation of de Chirico’s painting: anonymous figures, a miniature city, tall columns and a still horizon. This is not a reconstruction of the painting.',
  observation:'Move between the columns. From one side the structures seem to belong to the figures; from another they seem to be a city behind them.',
  question:'Can a city become part of a person, rather than merely the place where they live?',
  visit:'Walk to the metaphysical shore',
  reflect:'Keep this question',
  saved:'Question added to your private notebook.',
  source:'See the painting and its attribution',
  rights:'The original painting is held by the Museo del Novecento, Milan. This pavilion uses new geometry instead of republishing a copyrighted reproduction.'
 },
 de:{
  title:'Das metaphysische Ufer',
  subtitle:'Giorgio de Chirico · Le trouble du philosophe · 1925–26',
  intro:'Eine eigenständige, begehbare Interpretation von de Chiricos Gemälde: anonyme Figuren, eine Miniaturstadt, hohe Säulen und ein stiller Horizont. Keine Rekonstruktion des Bildes.',
  observation:'Gehe zwischen den Säulen hindurch. Von einer Seite scheinen die Bauten zu den Figuren zu gehören, von einer anderen wie eine Stadt dahinter.',
  question:'Kann eine Stadt Teil eines Menschen werden und nicht nur der Ort sein, an dem er lebt?',
  visit:'Zum metaphysischen Ufer gehen',
  reflect:'Diese Frage behalten',
  saved:'Frage im privaten Notizbuch gespeichert.',
  source:'Gemälde und Quellenangabe ansehen',
  rights:'Das Original befindet sich im Museo del Novecento in Mailand. Dieser Pavillon verwendet neue Geometrie statt einer urheberrechtlich geschützten Reproduktion.'
 },
 fa:{
  title:'ساحل متافیزیکی',
  subtitle:'جورجو دِ کیریکو · آشفتگی فیلسوف · ۱۹۲۵–۱۹۲۶',
  intro:'برداشتی مستقل و قابل‌قدم‌زدن از نقاشی کیریکو: پیکره‌های بی‌نام، شهری کوچک، ستون‌های بلند و افقی ساکن. این بازسازی خود نقاشی نیست.',
  observation:'میان ستون‌ها حرکت کن. از یک سو بناها بخشی از پیکره‌ها به نظر می‌رسند و از سوی دیگر گویی شهری در پشت آن‌ها هستند.',
  question:'آیا شهر می‌تواند بخشی از وجود انسان شود، نه فقط جایی که در آن زندگی می‌کند؟',
  visit:'رفتن به ساحل متافیزیکی',
  reflect:'نگه‌داشتن این پرسش',
  saved:'پرسش در دفترچهٔ خصوصی ذخیره شد.',
  source:'دیدن نقاشی و مشخصات اثر',
  rights:'اثر اصلی در موزهٔ نووچنتو در میلان نگهداری می‌شود. این غرفه به‌جای بازنشر تصویر دارای حق نشر، از شکل‌های سه‌بعدی تازه استفاده می‌کند.'
 }
};

export function buildDeChiricoExhibit(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();
 group.name='Metaphysical shore · de Chirico interpretation';
 const exhibit=new T.Group();exhibit.position.set(226,.13,202);group.add(exhibit);
 const owned=new Set(),targets=[];
 const own=value=>(owned.add(value),value);
 const material=color=>own(new T.MeshLambertMaterial({color}));
 const sandstone=material(0xb3a68e),stoneDark=material(0x675b51),
  wood=material(0x705d49),sea=material(0x526b70),gold=material(0xb8a06b),
  ivory=material(0xd5c7a8),rust=material(0xb3764f),teal=material(0x567e75),
  indigo=material(0x3d525e),cloak=material(0x8d8b76);
 function box(w,h,d,x,y,z,mat,parent=exhibit){
  const mesh=new T.Mesh(own(new T.BoxGeometry(w,h,d)),mat);
  mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 function sphere(radius,x,y,z,mat,sx=1,sy=1,sz=1){
  const mesh=new T.Mesh(own(new T.SphereGeometry(radius,20,14)),mat);
  mesh.scale.set(sx,sy,sz);mesh.position.set(x,y,z);exhibit.add(mesh);return mesh;
 }
 // Open to the walkway at z=-5; the paving remains flush and walkable.
 box(13,.065,10,0,-.025,0,sandstone);
 for(const x of[-5.85,5.85]){
  for(const z of[-4.1,4.1]){
   box(.66,5.8,.66,x,2.9,z,stoneDark);
   for(let i=0;i<4;i++)box(.74,.17,.74,x,.55+i*1.45,z,sandstone);
   box(.95,.42,.95,x,5.8,z,sandstone);
  }
 }
 // A painted architectural horizon, deliberately not the real coastline.
 box(12.2,.05,1.3,0,.035,4.25,sea);
 box(12.2,.19,.13,0,.17,4.9,ivory);
 for(const [x,h,col]of[[-1.75,2.4,teal],[-.65,3.55,rust],[.7,4.5,indigo],[1.8,2.9,gold]]){
  box(.75,h,.7,x,h/2+.12,.8,col);
  box(1.02,.14,.78,x,h+.15,.8,stoneDark);
 }
 function mannequin(x,z,scale){
  const root=new T.Group();root.position.set(x,0,z);root.scale.setScalar(scale);exhibit.add(root);
  const body=new T.Mesh(own(new T.CylinderGeometry(.75,1.03,2.45,14)),ivory);
  body.position.y=1.55;root.add(body);
  const head=new T.Mesh(own(new T.SphereGeometry(.77,20,16)),ivory);
  head.scale.set(.88,1.17,.62);head.position.set(.08,3.35,0);head.rotation.z=.22;root.add(head);
  const seam=new T.Mesh(own(new T.TorusGeometry(.6,.017,7,48,Math.PI*1.4)),stoneDark);
  seam.position.set(.08,3.37,-.49);seam.rotation.z=.15;root.add(seam);
  for(const s of[-1,1]){
   const arm=new T.Mesh(own(new T.CylinderGeometry(.18,.25,1.65,9)),rust);
   arm.position.set(s*.97,2.23,-.02);arm.rotation.z=s*.9;root.add(arm);
  }
  for(let i=0;i<5;i++){
   const fold=new T.Mesh(own(new T.BoxGeometry(.28,1.3,.24)),cloak);
   fold.position.set(-.61+i*.3,.64,-.15);fold.rotation.z=(i-2)*.08;root.add(fold);
  }
 }
 mannequin(-3.35,.15,1.03);
 mannequin(3.4,1.8,.83);
 // A place to stop rather than a barrier; the sign can be selected by raycast.
 box(3.2,.22,1.15,0,.4,-3.55,wood);
 for(const x of[-1.33,1.33])box(.12,.42,.85,x,.18,-3.55,stoneDark);
 const c=canvas();c.width=1024;c.height=192;
 const ctx=c.getContext('2d');if(ctx){
  ctx.fillStyle='#e8ddc5';ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#253d40';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='58px Georgia, serif';ctx.fillText('GIORGIO DE CHIRICO',512,74,940);
  ctx.font='31px Georgia, serif';ctx.fillText('Le trouble du philosophe · 1925–26',512,136,940);
 }
 const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;
 const plaque=new T.Mesh(own(new T.PlaneGeometry(5.5,1.03)),own(new T.MeshBasicMaterial({map:texture,side:T.DoubleSide,toneMapped:false})));
 plaque.position.set(0,2.25,-5.05);plaque.rotation.y=Math.PI;
 plaque.userData={deChirico:true};plaque.name='Giorgio de Chirico · open exhibit';
 exhibit.add(plaque);targets.push(plaque);
 return{
  group,targets,
  entry:{x:226,z:191,y:.13,yaw:Math.PI},
  center:{x:226,z:202},
  dispose(){group.removeFromParent();for(const resource of owned)resource.dispose?.();group.clear();}
 };
}
