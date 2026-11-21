import {NIGHT_PARK,NIGHT_PARK_LAWNS,NIGHT_PARK_APPROACH,NIGHT_PARK_LANTERNS} from './night-park-model.js';
import {LOWER_COAST_WALKS} from './lower-landscape-model.js';
import {NIGHT_HOME_PARCELS} from './night-home-layout.js?v=night-garden-20261121';

const copy={en:{title:'Night face · Ideas Park',intro:'The original park is now on the night face. The gold walk connects its arrival to the existing night grounds. Warm lanterns mark the approach and park paths.',park:'Ideas Park',faculty:'Mathematics',homes:'Home parcel centres',visit:'Visit Ideas Park',legend:'Gold: park approach · pale lines: existing walks · small gold dots: lanterns'},fa:{title:'دنیای شب · پارک ایده‌ها',intro:'پارک اصلی اکنون در دنیای شب است. مسیر طلایی ورودی پارک را به مسیرهای موجود وصل می‌کند؛ فانوس‌ها ورودی و راه‌های پارک را روشن می‌کنند.',park:'پارک ایده‌ها',faculty:'دانشکدهٔ ریاضی',homes:'مرکز قطعات خانه‌ها',visit:'رفتن به پارک ایده‌ها',legend:'طلایی: ورودی پارک · خط روشن: مسیرهای موجود · نقطهٔ طلایی: فانوس'},de:{title:'Nachtseite · Ideenpark',intro:'Der ursprüngliche Park liegt jetzt auf der Nachtseite. Der goldene Weg verbindet seinen Eingang mit den vorhandenen Nachtwegen. Warme Laternen markieren den Zugang und die Parkwege.',park:'Ideenpark',faculty:'Mathematik',homes:'Mittelpunkte der Hausparzellen',visit:'Ideenpark besuchen',legend:'Gold: Parkzugang · helle Linien: vorhandene Wege · kleine Goldpunkte: Laternen'}};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
export function nightParkMapSvg(language='en'){
 const c=copy[language]||copy.en,s=.7,P=([x,z])=>[460+x*s,460+z*s],line=(points,colour,width)=>'<polyline fill="none" stroke="'+colour+'" stroke-width="'+width+'" stroke-linejoin="round" points="'+points.map(p=>P(p).join(',')).join(' ')+'"/>',text=(x,z,t)=>'<text x="'+P([x,z])[0]+'" y="'+P([x,z])[1]+'" fill="#f4e8bd" text-anchor="middle" font-size="17">'+escape(t)+'</text>';
 const out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920" role="img"><title>'+escape(c.title)+'</title><rect width="920" height="920" fill="#101d32"/><circle cx="460" cy="460" r="395.5" fill="#233c3c" stroke="#9cb0a5" stroke-width="2"/><g font-family="Tahoma,Arial,sans-serif">'];
 for(const p of NIGHT_PARK_LAWNS)out.push('<polygon points="'+p.map(p=>P(p).join(',')).join(' ')+'" fill="#355947" stroke="#6b8b64"/>');
 out.push('<circle cx="'+P([NIGHT_PARK.localX,NIGHT_PARK.localZ])[0]+'" cy="'+P([NIGHT_PARK.localX,NIGHT_PARK.localZ])[1]+'" r="'+NIGHT_PARK.radius*s+'" fill="#315b44"/>');
 for(const r of LOWER_COAST_WALKS)out.push(line(r.points,'#a0aea5',2));
 for(const h of NIGHT_HOME_PARCELS){const[x,z]=P([h.x,h.z]);out.push('<circle data-home-parcel="'+h.index+'" cx="'+x+'" cy="'+z+'" r="3" fill="#9aab9a"/>');}
 out.push(line(NIGHT_PARK_APPROACH.points,'#f0ca68',NIGHT_PARK_APPROACH.width*s));
 for(const p of NIGHT_PARK_LANTERNS){const[x,z]=P(p);out.push('<circle data-park-lantern="true" cx="'+x+'" cy="'+z+'" r="4" fill="#ffe19b"/>');}
 out.push('<circle cx="460" cy="460" r="36" fill="#8a8f87"/>',text(0,7,c.faculty),text(NIGHT_PARK.localX,NIGHT_PARK.localZ,c.park),text(0,596,c.homes),'</g></svg>');return out.join('');
}
export function mountNightParkMap(container,{language='en',onVisit=()=>{}}={}){
 const c=copy[language]||copy.en,section=document.createElement('section');section.className='coastal-night-map';section.lang=language;section.dir=language==='fa'?'rtl':'ltr';
 const h=document.createElement('h3');h.textContent=c.title;const p=document.createElement('p');p.textContent=c.intro;const img=document.createElement('img');img.className='coastal-plan';img.width=img.height=920;img.style.maxWidth='min(100%,720px)';img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(nightParkMapSvg(language));img.alt=c.title;
 const legend=document.createElement('p');legend.textContent=c.legend;const visit=document.createElement('button');visit.type='button';visit.className='glass';visit.textContent=c.visit;visit.onclick=()=>onVisit('park');section.append(h,p,img,legend,visit);container.append(section);return section;
}
