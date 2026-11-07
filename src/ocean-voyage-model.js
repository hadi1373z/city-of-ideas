import {CITY_ISLAND,SHORE} from './island-layout.js';
export const VOYAGE={dock:{x:SHORE.x+37,z:SHORE.z,yaw:-Math.PI/2+.5},shore:{...SHORE,pitch:-.04},minRadius:CITY_ISLAND.radius+18,maxRadius:1550};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createVoyage(){
 const s={...VOYAGE.dock,active:false,paused:false,speed:0,time:0,distance:0,boundary:false};
 function reset(){Object.assign(s,VOYAGE.dock,{active:false,paused:false,speed:0,time:0,distance:0,boundary:false});}
 function board(){reset();s.active=true;s.speed=7;}
 function step(dt,{forward=0,steer=0,boost=false}={}){
  if(!s.active||s.paused)return;dt=clamp(Number.isFinite(dt)?dt:0,0,.1);forward=clamp(Number.isFinite(forward)?forward:0,-1,1);steer=clamp(Number.isFinite(steer)?steer:0,-1,1);s.time+=dt;
  const target=forward<-.2?0:boost||forward>.2?13:7;s.speed+=(target-s.speed)*(1-Math.exp(-dt*1.6));s.yaw-=steer*dt*.48;
  let x=s.x-Math.sin(s.yaw)*s.speed*dt,z=s.z-Math.cos(s.yaw)*s.speed*dt,r=Math.hypot(x,z);s.boundary=r<VOYAGE.minRadius||r>VOYAGE.maxRadius;
  if(s.boundary){const edge=clamp(r,VOYAGE.minRadius,VOYAGE.maxRadius);x=x/r*edge;z=z/r*edge;s.speed*=Math.exp(-dt*3);}
  s.distance+=Math.hypot(x-s.x,z-s.z);s.x=x;s.z=z;
 }
 return{state:s,board,step,reset};
}
export const poemAt=time=>Math.floor(Math.max(0,time)/24)%6;
export const POEMS={
 en:[
  ['Departure','The shore loosens its hold.','One folded page carries us','beyond the sentence of the street.'],
  ['Scale','From here, the tallest house','fits between two fingers.','A question keeps its size.'],
  ['Between','Water writes no road.','We leave a line behind us','and watch it become water.'],
  ['Paper','The fold remembers a hand.','The hand remembers a tree.','The sea asks neither for a name.'],
  ['Horizon','That far blue edge moves with us.','What seemed an answer','becomes a way of looking.'],
  ['Return','We can return to the same shore.','The room will be where we left it.','The window may mean something else.']
 ],
 de:[
  ['Aufbruch','Das Ufer lässt uns los.','Ein gefaltetes Blatt trägt uns','über den Satz der Straße hinaus.'],
  ['Maßstab','Von hier passt das höchste Haus','zwischen zwei Finger.','Eine Frage behält ihre Größe.'],
  ['Dazwischen','Wasser zeichnet keine Straße.','Wir lassen eine Linie zurück','und sehen, wie sie Wasser wird.'],
  ['Papier','Die Falte erinnert sich an eine Hand.','Die Hand erinnert sich an einen Baum.','Das Meer fragt keinen nach dem Namen.'],
  ['Horizont','Der ferne blaue Rand zieht mit uns.','Was eine Antwort schien,','wird zu einer Art zu sehen.'],
  ['Rückkehr','Wir können an dasselbe Ufer zurück.','Das Zimmer steht noch an seinem Platz.','Das Fenster kann etwas anderes bedeuten.']
 ],
 fa:[
  ['عزیمت','ساحل دست از ما می‌کشد.','برگی تاخورده ما را می‌برد','آن‌سوی جملهٔ خیابان.'],
  ['مقیاس','از اینجا بلندترین خانه','میان دو انگشت جا می‌گیرد.','پرسش هم‌اندازه می‌ماند.'],
  ['میان','آب جاده‌ای نمی‌نویسد.','خطی پشت سر می‌گذاریم','و آب شدنش را تماشا می‌کنیم.'],
  ['کاغذ','تا، دستی را به یاد دارد.','دست، درختی را.','دریا نام هیچ‌کدام را نمی‌پرسد.'],
  ['افق','آن لبهٔ دورِ آبی با ما می‌آید.','آنچه پاسخ می‌نمود','شیوه‌ای برای دیدن می‌شود.'],
  ['بازگشت','می‌توان به همان ساحل برگشت.','اتاق همان‌جاست که رهایش کردیم.','شاید پنجره معنای دیگری داشته باشد.']
 ]
};
export const VOYAGE_COPY={
 en:{title:'The paper sea',visit:'Visit the origami boat',board:'Board the origami boat · E / A',sailing:'Sailing the paper sea',pause:'Pause sailing',resume:'Continue sailing',return:'Return to the landing',poems:'Poems',on:'shown',off:'hidden',controls:'W / ↑: faster · S / ↓: slow · A / D: steer · drag: look · controller: left stick steers, right stick looks · B: landing',credit:'Original poems · City of Ideas',edge:'Shallow water or the outer current — turn along the coast.',photo:'Take photo · L1',distance:'metres sailed',steerLeft:'Steer left',steerRight:'Steer right'},
 de:{title:'Das Papiermeer',visit:'Zum Origamiboot',board:'Ins Origamiboot steigen · E / A',sailing:'Auf dem Papiermeer',pause:'Segeln anhalten',resume:'Weitersegeln',return:'Zurück zum Anleger',poems:'Gedichte',on:'sichtbar',off:'verborgen',controls:'W / ↑: schneller · S / ↓: langsam · A / D: steuern · ziehen: umsehen · Controller: links steuern, rechts schauen · B: Anleger',credit:'Originalgedichte · City of Ideas',edge:'Flaches Wasser oder Außenströmung — entlang der Küste steuern.',photo:'Foto aufnehmen · L1',distance:'Meter gesegelt',steerLeft:'Nach links steuern',steerRight:'Nach rechts steuern'},
 fa:{title:'دریای کاغذی',visit:'دیدار از قایق اوریگامی',board:'سوار قایق اوریگامی شو · E / A',sailing:'بر دریای کاغذی',pause:'توقف حرکت',resume:'ادامهٔ سفر',return:'بازگشت به اسکله',poems:'شعرها',on:'نمایان',off:'پنهان',controls:'W / ↑: تندتر · S / ↓: آهسته · A / D: هدایت · کشیدن: نگاه · دسته: حرکت با چپ، نگاه با راست · B: اسکله',credit:'شعرهای تازه برای شهر ایده‌ها',edge:'آب کم‌عمق یا جریان بیرونی؛ در امتداد ساحل بپیچید.',photo:'عکس بگیر · L1',distance:'متر سفر',steerLeft:'گردش به چپ',steerRight:'گردش به راست'}
};
