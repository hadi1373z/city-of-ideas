import {CITY_ISLAND} from './island-layout.js';
import {coastMapPoint} from './coastal-map-data.js';

// A fresh, in-memory plan-view snapshot whenever the overview is opened.
// Never clamp a remote world or sailing location onto the island edge.
export function coastVisitor(visitor){
 if(!visitor||!Number.isFinite(visitor.x)||!Number.isFinite(visitor.z)||Math.hypot(visitor.x,visitor.z)>CITY_ISLAND.radius+.05)return null;
 const yaw=Number.isFinite(visitor.yaw)?Math.atan2(Math.sin(visitor.yaw),Math.cos(visitor.yaw)):null;
 return {point:coastMapPoint(visitor.x,visitor.z),x:visitor.x,z:visitor.z,yaw,belowGround:visitor.belowGround===true,bearing:yaw===null?null:((Math.round(-yaw/(Math.PI/4))%8)+8)%8};
}
export const COAST_POSITION_COPY={
 en:{here:'Your walking position',below:'Your position below the gallery',outside:'Your current position is outside this island map.',heading:'Facing {direction}',directions:['north','northeast','east','southeast','south','southwest','west','northwest'],distance:'On the map: {distance} m in a straight line. Walking distance depends on paths, entrances and floors.'},
 de:{here:'Deine Gehposition',below:'Deine Position unter der Galerie',outside:'Deine aktuelle Position liegt außerhalb dieser Inselkarte.',heading:'Blick nach {direction}',directions:['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'],distance:'Auf der Karte: {distance} m Luftlinie. Die Gehstrecke hängt von Wegen, Eingängen und Stockwerken ab.'},
 fa:{here:'جایگاه شما در مسیر پیاده',below:'جایگاه شما زیر گالری',outside:'جایگاه کنونی شما بیرون از این نقشهٔ جزیره است.',heading:'رو به {direction}',directions:['شمال','شمال‌شرق','شرق','جنوب‌شرق','جنوب','جنوب‌غرب','غرب','شمال‌غرب'],distance:'روی نقشه: {distance} متر به خط مستقیم. طول مسیر پیاده به راه‌ها، ورودی‌ها و طبقه‌ها بستگی دارد.'}
};
export function coastPositionText(visitor,copy){return !visitor?copy.outside:(visitor.belowGround?copy.below:copy.here)+(visitor.bearing===null?'':' · '+copy.heading.replace('{direction}',copy.directions[visitor.bearing]));}
export function coastDistance(visitor,point,language,copy){if(!visitor)return '';const value=Math.round(Math.hypot(visitor.x-point[0],visitor.z-point[1]));return copy.distance.replace('{distance}',new Intl.NumberFormat(language==='fa'?'fa-IR':language).format(value));}
