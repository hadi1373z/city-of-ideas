import {RULE_CARDS,TRANSFER_CARDS} from './learning-lab-state.js';
import {buildMakersLibraryDetails} from './makers-library-scene.js';
export function buildLearningLab(T,makers,{canvas=()=>document.createElement('canvas')}={}){
 const owned=new Set(),groups=[],decks=[],colliders=[],own=r=>(owned.add(r),r),wood=own(new T.MeshLambertMaterial({color:0x80674d})),paper=own(new T.MeshLambertMaterial({color:0xe5ddc5}));
 function box(parent,w,h,d,x,y,z,material){const mesh=new T.Mesh(own(new T.BoxGeometry(w,h,d)),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function face(parent,w,h,x,y,z,reverse=false){const c=canvas();c.width=512;c.height=640;const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));mesh.position.set(x,y,z);if(reverse)mesh.rotation.y=Math.PI;parent.add(mesh);return{c,texture,mesh};}
 function paint(label,text,selected=false){const c=label.c,ctx=c.getContext('2d');ctx.fillStyle='#f5ecd6';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=selected?'#af7e2d':'#597369';ctx.lineWidth=selected?28:12;ctx.strokeRect(15,15,c.width-30,c.height-30);ctx.fillStyle='#243e34';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=/[\u0600-\u06ff]/.test(text)?'rtl':'ltr';const words=text.split(' '),lines=words.length>1?words:[text];ctx.font=(text.length<3?'bold 240px':'bold 66px')+' Tahoma';lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,256,320+(i-(Math.min(3,lines.length)-1)/2)*90,460));label.texture.needsUpdate=true;}
 const library=makers.houses.find(h=>h.id==='makers-library'),book=new T.Group();book.position.set(.36,.89,.25);book.userData={learningLab:'library',dynamic:true};library.group.add(book);groups.push(book);box(book,.46,.06,.30,0,0,0,wood);const cover=face(book,.43,.27,0,.032,0);cover.mesh.rotation.x=-Math.PI/2;cover.mesh.rotation.y=0;book.traverse(o=>o.userData={learningLab:'library',dynamic:true});
 const details=buildMakersLibraryDetails(T,{home:library.group,box,wood,paper,ink:own(new T.MeshLambertMaterial({color:0x36564a}))});groups.push(details.group);
 for(const [kind,id,items]of[['workshop','makers-workshop',RULE_CARDS],['dialogue','makers-dialogue',TRANSFER_CARDS]]){
  const home=makers.houses.find(h=>h.id===id),group=new T.Group();group.name='Learning experiment · '+kind;group.position.set(0,kind==='workshop'?1.7:1.9,-3.07);group.userData={learningLab:kind,dynamic:true};home.group.add(group);groups.push(group);box(group,2.72,1.35,.08,0,0,0,paper);
  const z=home.cz-home.direction*2.83;colliders.push({kind,minX:home.cx-1.4,maxX:home.cx+1.4,minZ:z-.34,maxZ:z+.34});
  const cards=items.map((item,index)=>{const x=-.93+index*.62,pivot=new T.Group();pivot.position.set(x,-.13,.30);pivot.userData={learningLab:kind,learningCard:index,dynamic:true};group.add(pivot);box(group,.05,.045,.27,x,-.13,.15,wood);box(pivot,.54,.72,.03,0,0,0,wood);const front=face(pivot,.51,.69,0,0,.017),back=face(pivot,.51,.69,0,0,-.017,true);pivot.traverse(o=>o.userData={learningLab:kind,learningCard:index,dynamic:true});return{pivot,front,back};});
  decks.push({kind,group,cards});
 }
 let key='',last=0;function update(time,state,words,selection=0,reduced=false){
  const next=[words.title,state.revealed,state.transfer,selection].join('|');if(next!==key){paint(cover,'A → 4');for(const deck of decks)for(const [i,c]of deck.cards.entries()){paint(c.front,deck.kind==='workshop'?RULE_CARDS[i].front:words.parcelCards[i],!!(selection&1<<i));paint(c.back,deck.kind==='workshop'?RULE_CARDS[i].back:words.parcelCards[TRANSFER_CARDS[i].back]);}key=next;}
  const dt=last?Math.min(.1,Math.max(0,time-last)):.1;last=time;for(const deck of decks){deck.group.visible=state.step>=(deck.kind==='workshop'?2:3);for(const [i,c]of deck.cards.entries()){const turn=((deck.kind==='workshop'?state.revealed:state.transfer)&1<<i)?Math.PI:0;c.pivot.rotation.y=reduced?turn:c.pivot.rotation.y+(turn-c.pivot.rotation.y)*Math.min(1,dt*8);}}
 }
 return{book,guide:details.rack,decks,groups,colliders,update,paint,dispose(){for(const g of groups)g.removeFromParent();for(const r of owned)r.dispose();}};
}
