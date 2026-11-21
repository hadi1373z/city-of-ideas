import {SOCRATES_SITE} from './socrates-site-model.js?v=shore-niches-20261121';
import {MAKERS_SITE,MAKERS_ACCESS,MAKERS_ROOFS} from './makers-site.js?v=makers-block-20261118';
import {IDEAS_PARK_SITE} from './city-hex-layout.js?v=makers-passages-20261118';
import {SEMINAR_HOUSES} from './seminar-houses-data.js?v=cloister-20261120';
import {SHORE,HEX_COAST_WALK,COAST_PROMENADE_WALK} from './island-layout.js?v=makers-passages-20261118';

// The same world-to-SVG projection used by the original coastal plan.
export const coastMapPoint = (x, z) => [460 + x * .7, 460 + z * .7];
export const COAST_LANDMARKS = [
  {id: 'gallery', number: 1, point: [0, 0]},
  {id: 'park', number: 2, point: [IDEAS_PARK_SITE.x, IDEAS_PARK_SITE.z]},
  {id: 'socrates', number: 3, point: [SOCRATES_SITE.x, SOCRATES_SITE.z]},
  // The existing garden-court arrival, rather than a new district position.
  {id: 'artists', number: 4, point: [-398.3716857408417, 138]},
  {id: 'shore', number: 5, point: [SHORE.x, SHORE.z]}
];

const A=Math.sqrt(3)*46;
export const COAST_MAIN_PATHS = [
 // The original house now occupies the eastern boat-side hexagon.
 ...SOCRATES_SITE.approaches,
 // The original park/pond entrance meets the northern shared hex edge.
 [[0,-92],[0,IDEAS_PARK_SITE.z+135]],
 // Makers and the existing Origami/Proof approaches meet a real block vertex.
 MAKERS_ACCESS.points,
 [[2*A,-92],[199,-92],[199,65],[203.5,65]]
];
// The guide follows the source court approaches, real hex edges, existing
// eastern coast gate and shoreline promenade. It creates no cross-cell road.
export const COAST_WALK = [[64,0],[A,0],[A,-46],[2*A,-92],[199,-92],[199,65],[203.5,65],[215,65],[249,65],...HEX_COAST_WALK,...COAST_PROMENADE_WALK.slice(1),[SHORE.x,SHORE.z]];


export function coastWalkSvg() {
  const points = COAST_WALK.map(p => coastMapPoint(...p).map(n => n.toFixed(1)).join(',')).join(' ');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke-linejoin="round" stroke-linecap="round"><polyline points="' + points + '" stroke="#fff9e8" stroke-width="12"/><polyline points="' + points + '" stroke="#963c26" stroke-width="6" stroke-dasharray="10 7"/></g></svg>';
}

export const COAST_EXPLORER_COPY = {
  en: {
    title: 'City Map 2 · Explore the honeycomb',
    intro: 'Choose a numbered place on the map or in the list. Read about it, then visit when you are ready.',
    places: 'Five places to explore', information: 'About this place', visit: 'Visit this place',
    route: 'Walking route · Gallery → Origami → Coast', shown: 'Walking route shown.', hidden: 'Walking route hidden.',
    routeHelp: 'The dashed rust-coloured line follows existing paths. It starts at the gallery’s east approach; it is a map guide, not automatic movement.',
    steps: ['From the gallery’s east approach, follow the central hex edge north to the shared vertex, then continue along the next hex edge to the east-side lane.', 'Follow the east-side lane south, then turn east past the north side of the House of Origami. The artists’ garden court is a separate destination in the western blocks.', 'Follow the honeycomb street edges to the eastern coast gate, then follow the shoreline promenade to the paper-boat lookout.'],
    more: 'More city destinations',
    landmarks: {
      gallery: {name: 'Zarathustra Gallery', area: 'The island centre', description: 'Explore the gallery and its philosophical artworks. Zarathustra stands at the exact centre of this circular island.'},
      park: {name: 'Ideas Park', area: 'The northern park', description: 'A green place for reflection, ideas and hands-on exploration. The park lies north of the central gallery.'},
      socrates: {name: 'Socrates’ House', area: 'Eastern boat-side hexagon', description: 'Visit Socrates’ house and its spaces for questions and conversation. Select Visit to approach the existing entrance.'},
      artists: {name: 'Artists’ Quarter', area: 'The western garden block', description: 'Discover Monet, Van Gogh, Hilma af Klint and Morris around a shared garden court. The form galleries and working studios have their own marked blocks.'},
      shore: {name: 'Paper-Boat Lookout', area: 'The eastern shore', description: 'Look out over the ocean from the existing paper-boat landing. The coastal promenade connects this shore to the rest of the island.'}
    }
  },
  de: {
    title: 'Stadtplan 2 · Die Wabenstadt erkunden',
    intro: 'Wähle einen nummerierten Ort auf der Karte oder in der Liste. Lies mehr darüber und besuche ihn, wenn du bereit bist.',
    places: 'Fünf Orte zum Erkunden', information: 'Über diesen Ort', visit: 'Diesen Ort besuchen',
    route: 'Spazierweg · Galerie → Origami → Küste', shown: 'Spazierweg eingeblendet.', hidden: 'Spazierweg ausgeblendet.',
    routeHelp: 'Die rostrote gestrichelte Linie folgt bestehenden Wegen. Sie beginnt am östlichen Zugang der Galerie und dient zur Orientierung; sie bewegt dich nicht automatisch.',
    steps: ['Gehe vom östlichen Zugang der Galerie entlang der nördlichen Hexagonkante zum gemeinsamen Eckpunkt und weiter in Richtung der Werkstätten.', 'Folge der Werkstattgasse nach Süden und gehe dann nach Osten an der Nordseite des Hauses des Origami vorbei. Der Gartenhof der Künstler liegt separat in den westlichen Stadtblöcken.', 'Folge den Wabenstraßen zum östlichen Küstentor und dann der Uferpromenade zur Papierboot-Aussicht.'],
    more: 'Weitere Ziele in der Stadt',
    landmarks: {
      gallery: {name: 'Zarathustra-Galerie', area: 'Die Inselmitte', description: 'Erkunde die Galerie und ihre philosophischen Kunstwerke. Zarathustra steht genau im Mittelpunkt dieser kreisrunden Insel.'},
      park: {name: 'Ideenpark', area: 'Der nördliche Park', description: 'Ein grüner Ort zum Nachdenken, für Ideen und zum Ausprobieren. Der Park liegt nördlich der zentralen Galerie.'},
      socrates: {name: 'Haus des Sokrates', area: 'Östlicher Wabenhof beim Boot', description: 'Besuche das Haus des Sokrates mit seinen Räumen für Fragen und Gespräche. Mit „Diesen Ort besuchen“ erreichst du den bestehenden Eingang.'},
      artists: {name: 'Künstlerviertel', area: 'Der westliche Gartenblock', description: 'Entdecke Monet, Van Gogh, Hilma af Klint und Morris am gemeinsamen Gartenhof. Die Formgalerien und Arbeitsateliers haben eigene markierte Stadtblöcke.'},
      shore: {name: 'Papierboot-Aussicht', area: 'Das östliche Ufer', description: 'Blicke von der bestehenden Papierboot-Anlegestelle auf den Ozean. Die Uferpromenade verbindet diesen Ort mit dem Rest der Insel.'}
    }
  },
  fa: {
    title: 'نقشهٔ شهر ۲ · گردش در شهر شش‌ضلعی',
    intro: 'یک مکان شماره‌دار را روی نقشه یا در فهرست انتخاب کنید. درباره‌اش بخوانید و هر وقت آماده بودید به آنجا بروید.',
    places: 'پنج مکان برای گردش', information: 'دربارهٔ این مکان', visit: 'رفتن به این مکان',
    route: 'مسیر پیاده‌روی · گالری ← اوریگامی ← ساحل', shown: 'مسیر پیاده‌روی نمایش داده شد.', hidden: 'مسیر پیاده‌روی پنهان شد.',
    routeHelp: 'خط‌چین آجری‌رنگ مسیرهای موجود را دنبال می‌کند. آغاز آن ورودی شرقی گالری است؛ این راهنمای نقشه است و شما را خودکار جابه‌جا نمی‌کند.',
    steps: ['از ورودی شرقی گالری لبهٔ شش‌ضلعی را به شمال تا رأس مشترک دنبال کنید و در امتداد لبهٔ بعدی به سوی کارگاه‌ها بروید.', 'گذرگاه کارگاه‌ها را به جنوب بروید و سپس به شرق، از کنار بخش شمالی خانهٔ اوریگامی بگذرید. حیاط باغ هنرمندان مقصدی جداگانه در بلوک‌های غربی شهر است.', 'لبه‌های خیابان‌های شش‌ضلعی را تا دروازهٔ شرقی ساحل دنبال کنید و سپس از پیاده‌راه ساحلی به سکوی قایق کاغذی بروید.'],
    more: 'مقصدهای دیگر شهر',
    landmarks: {
      gallery: {name: 'گالری زرتشت', area: 'مرکز جزیره', description: 'گالری و آثار فلسفی آن را ببینید. زرتشت درست در مرکز این جزیرهٔ دایره‌ای قرار دارد.'},
      park: {name: 'پارک ایده‌ها', area: 'پارک شمالی', description: 'فضایی سبز برای اندیشیدن، ایده‌ها و تجربه کردن. پارک در شمال گالری مرکزی قرار دارد.'},
      socrates: {name: 'خانهٔ سقراط', area: 'شش‌ضلعی شرقی کنار قایق', description: 'به خانهٔ سقراط و فضاهای پرسش و گفت‌وگو سر بزنید. با انتخاب «رفتن به این مکان» به ورودی موجود خانه می‌رسید.'},
      artists: {name: 'محلهٔ هنرمندان', area: 'بلوک باغ در غرب', description: 'مونه، ون‌گوگ، هیلما آف کلینت و موریس را پیرامون حیاط باغ مشترک کشف کنید. گالری‌های فرم و آتلیه‌های کار، بلوک‌های نشانه‌گذاری‌شدهٔ خود را دارند.'},
      shore: {name: 'سکوی تماشای قایق کاغذی', area: 'ساحل شرقی', description: 'از سکوی موجود قایق کاغذی به اقیانوس نگاه کنید. پیاده‌راه ساحلی اینجا را به دیگر بخش‌های جزیره پیوند می‌دهد.'}
    }
  }
};

for(const [i,h]of SEMINAR_HOUSES.entries())COAST_LANDMARKS.push({id:h.id,number:h.mapNumber,point:[h.x,h.z],seminarHouse:true});
const seminarMapCopy={
 en:{places:'Seven places to explore',area:'The southeastern seminar court',descriptions:['Enter a stone rotunda and test how breaking rotational symmetry changes an exact oscillator model. Read the assumptions behind its conserved quantities.','Explore a turquoise ribbon-roof house, compare paths in the Poincaré disk and follow the question toward Mirzakhani’s research on closed geodesics.','Enter a timber listening house, change an original seeded score and question the roles of chance, constraints and authorship. Sound is optional.']},
 de:{places:'Sieben Orte zum Erkunden',area:'Der südöstliche Seminarhof',descriptions:['Betritt die Steinrotunde und prüfe an exakten Oszillatoren, was beim Brechen der Rotationssymmetrie erhalten bleibt. Lies die Voraussetzungen des Arguments.','Erkunde das Haus unter dem türkisen Banddach, vergleiche Wege in der Poincaré-Scheibe und folge der Frage zu Mirzakhanis Forschung über geschlossene Geodäten.','Betritt das hölzerne Haus des Zuhörens, verändere eine eigenständige gesetzte Partitur und befrage Zufall, Regeln und Autorschaft. Klang ist freiwillig.']},
 fa:{places:'هفت مکان برای گردش',area:'حیاط سمینار در جنوب‌شرق',descriptions:['وارد روتوندای سنگی شو و در مدل دقیق نوسانگر بررسی کن شکست تقارن دورانی چه چیزی را تغییر می‌دهد. فرض‌های کمیت پایسته را بخوان.','زیر سقف نواری فیروزه‌ای، مسیرهای دیسک پوانکاره را مقایسه کن و پرسش را تا پژوهش میرزاخانی دربارهٔ ژئودزیک‌های بسته دنبال کن.','وارد خانهٔ چوبی شنیدن شو؛ پارتیتور تازهٔ بذردار را تغییر بده و نقش تصادف، قید و مؤلف را بسنج. پخش صدا اختیاری است.']}
};
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang],extra=seminarMapCopy[lang];c.places=extra.places;SEMINAR_HOUSES.forEach((h,i)=>c.landmarks[h.id]={name:h.names[lang],area:extra.area,description:extra.descriptions[{noether:0,mirzakhani:1,cage:2}[h.id]]});}

// Both vertical world connections use existing landmark coordinates.
export function coastFaceLinksSvg(){const[x,y]=coastMapPoint(IDEAS_PARK_SITE.x,IDEAS_PARK_SITE.z);return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke="#8c6f40" stroke-width="2"><circle cx="460" cy="460" r="18"/><path d="M455 450v19m-5 -6l5 6 5 -6M465 470v-19m-5 6l5 -6 5 6"/></g><g fill="none" stroke="#3b7081" stroke-width="2"><ellipse cx="'+x+'" cy="'+y+'" rx="19" ry="12"/><path d="M'+x+' '+(y-10)+'v21m-5 -6l5 6 5 -6"/></g><g font-family="Tahoma,Arial,sans-serif" text-anchor="middle" font-size="15" paint-order="stroke" stroke="#f0eddb" stroke-width="4"><text x="460" y="519" fill="#7a5c2d">Through-gallery · both faces</text><text x="'+x+'" y="'+(y+51)+'" fill="#326577">Pond · other-face crossing</text></g></svg>';}
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang];c.landmarks.gallery.description+=' The gallery now continues beneath Babel to the opposite face of the cylindrical world.';c.landmarks.park.name='Ideas Park · Pond crossing';c.landmarks.park.description='The park pond looks into the real lower face of the universe. Visit the pond shore to look through its centre or choose Travel to the other face. The boats remain on the water; the crossing arrives beside the Graveyard and Mathematics.';}
