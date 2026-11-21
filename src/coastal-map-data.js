import {LIGHT_HOUSE} from './house-of-light-model.js?v=live-light-niches-20261121';
import {SEA_TERRACES,SEA_TERRACE_ENTRY} from './sea-terraces-model.js';
import {SOCRATES_SITE} from './socrates-site-model.js?v=shore-niches-20261121';
import {MAKERS_SITE,MAKERS_ACCESS,MAKERS_ROOFS} from './makers-site.js?v=makers-block-20261118';
import {IDEAS_PARK_SITE,FORMER_IDEAS_PARK_SITE,PAPER_SEMINAR_COURT as COURT} from './city-hex-layout.js?v=night-garden-20261121';
import {SEMINAR_HOUSES} from './seminar-houses-data.js?v=night-garden-20261121';
import {SHORE,HEX_COAST_WALK,COAST_PROMENADE_WALK} from './island-layout.js?v=makers-passages-20261118';
import {GARDEN_ROUTES} from './six-gate-garden-model.js?v=coastal-terraces-20261121';

// The same world-to-SVG projection used by the original coastal plan.
export const coastMapPoint = (x, z) => [460 + x * .7, 460 + z * .7];
export const COAST_LANDMARKS = [
  {id: 'gallery', number: 1, point: [0, 0]},
  {id: 'park', number: 2, face:'lower', point: [IDEAS_PARK_SITE.localX, IDEAS_PARK_SITE.localZ]},
  {id: 'socrates', number: 3, point: [SOCRATES_SITE.x, SOCRATES_SITE.z]},
  // The existing garden-court arrival, rather than a new district position.
  {id: 'artists', number: 4, point: [-398.3716857408417, 138]},
  {id: 'shore', number: 5, point: [SHORE.x, SHORE.z]}
];

const A=Math.sqrt(3)*46;
export const COAST_MAIN_PATHS = [
 // The original house now occupies the eastern boat-side hexagon.
 ...SOCRATES_SITE.approaches,
 // Retain the level northern street to the five vacated daylight parcels.
 [[0,-92],[0,FORMER_IDEAS_PARK_SITE.z+135]],
 // Makers and the existing Proof approach meet a real block vertex.
 MAKERS_ACCESS.points,
 [[2*A,-92],[199,-92],[199,65],[203.5,65]]
];
// Follow canonical garden curves to the southeast outer-street join. Do not
// keep the old central hex zigzag as a guide across the newly green precinct.
const gardenRoute=id=>GARDEN_ROUTES.find(r=>r.id===id).points;
const inner=gardenRoute('garden-inner-promenade'),ray=gardenRoute('garden-ray-southeast'),door=gardenRoute('garden-door-southeast'),exit=gardenRoute('garden-street-southeast');
const turn=inner.findIndex(p=>Math.hypot(p[0]-ray[0][0],p[1]-ray[0][1])<1e-7);
const join=door.findIndex(p=>Math.hypot(p[0]-exit[0][0],p[1]-exit[0][1])<1e-7);
if(turn<0||join<0)throw new Error('The garden coast guide needs real shared promenade/door/street junctions');
export const COAST_GARDEN_WALK=Object.freeze([
 [64,0],...gardenRoute('garden-gallery-east'),
 ...inner.slice(1,turn+1),...ray.slice(1),
 ...door.slice(1,join+1),...exit.slice(1)
]);
// The remainder keeps the real Origami threshold, outer hex edges, eastern
// coast gate and shoreline promenade. It creates no cross-cell road.
export const COAST_WALK = [...COAST_GARDEN_WALK,[A,230],[A,322],[2*A,368],[COURT.eastX,COURT.z],[COURT.x,COURT.z],[COURT.x,COURT.z-13],[COURT.x,COURT.z],[COURT.eastX,COURT.z],[2*A,368],[A,322],[A,230],[2*A,184],[2*A,92],...HEX_COAST_WALK,...COAST_PROMENADE_WALK.slice(1),[SHORE.x,SHORE.z]];


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
    routeHelp: 'The dashed rust-coloured line follows the garden promenade and existing outer streets. It starts at the gallery’s east approach; it is a map guide, not automatic movement.',
    steps: ['From the gallery’s east approach, follow the inner garden promenade to the southeast gate, then its curved house approach to the outer hex street. Continue south to the paper, symmetry and listening court.', 'Enter the shared court from its east edge and approach the House of Origami on the north side. Return along the same court approach to the hex street.', 'Follow the honeycomb street edges to the eastern coast gate, then follow the shoreline promenade to the paper-boat lookout.'],
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
    routeHelp: 'Die rostrote gestrichelte Linie folgt der Gartenpromenade und den bestehenden äußeren Straßen. Sie beginnt am östlichen Zugang der Galerie und dient zur Orientierung; sie bewegt dich nicht automatisch.',
    steps: ['Folge vom östlichen Zugang der Galerie der inneren Gartenpromenade zum Südosttor und dem geschwungenen Hauszugang bis zur äußeren Wabenstraße. Gehe dann nach Süden zum Hof für Papier, Symmetrie und Zuhören.', 'Betritt den gemeinsamen Hof von Osten und nähere dich dem Haus des Origami an seiner Nordseite. Kehre über denselben Hofzugang zur Wabenstraße zurück.', 'Folge den Wabenstraßen zum östlichen Küstentor und dann der Uferpromenade zur Papierboot-Aussicht.'],
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
    routeHelp: 'خط‌چین آجری‌رنگ پیاده‌راه باغ و خیابان‌های بیرونی موجود را دنبال می‌کند. آغاز آن ورودی شرقی گالری است؛ این راهنمای نقشه است و شما را خودکار جابه‌جا نمی‌کند.',
    steps: ['از ورودی شرقی گالری، پیاده‌راه درونی باغ را تا دروازهٔ جنوب شرقی و سپس مسیر منحنی خانه را تا خیابان شش‌ضلعی بیرونی دنبال کنید. از آنجا به سمت جنوب تا حیاط کاغذ، تقارن و شنیدن بروید.', 'از لبهٔ شرقی وارد حیاط مشترک شوید و به خانهٔ اوریگامی در شمال حیاط نزدیک شوید. سپس از همان راه حیاط به خیابان شش‌ضلعی برگردید.', 'لبه‌های خیابان‌های شش‌ضلعی را تا دروازهٔ شرقی ساحل دنبال کنید و سپس از پیاده‌راه ساحلی به سکوی قایق کاغذی بروید.'],
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
 en:{places:'Seven places to explore',area:'The southern paper and seminar court',descriptions:['Enter a stone rotunda and test how breaking rotational symmetry changes an exact oscillator model. Read the assumptions behind its conserved quantities.','Explore a turquoise ribbon-roof house, compare paths in the Poincaré disk and follow the question toward Mirzakhani’s research on closed geodesics.','Enter a timber listening house, change an original seeded score and question the roles of chance, constraints and authorship. Sound is optional.']},
 de:{places:'Sieben Orte zum Erkunden',area:'Der südliche Papier- und Seminarhof',descriptions:['Betritt die Steinrotunde und prüfe an exakten Oszillatoren, was beim Brechen der Rotationssymmetrie erhalten bleibt. Lies die Voraussetzungen des Arguments.','Erkunde das Haus unter dem türkisen Banddach, vergleiche Wege in der Poincaré-Scheibe und folge der Frage zu Mirzakhanis Forschung über geschlossene Geodäten.','Betritt das hölzerne Haus des Zuhörens, verändere eine eigenständige gesetzte Partitur und befrage Zufall, Regeln und Autorschaft. Klang ist freiwillig.']},
 fa:{places:'هفت مکان برای گردش',area:'حیاط کاغذ و سمینار در جنوب',descriptions:['وارد روتوندای سنگی شو و در مدل دقیق نوسانگر بررسی کن شکست تقارن دورانی چه چیزی را تغییر می‌دهد. فرض‌های کمیت پایسته را بخوان.','زیر سقف نواری فیروزه‌ای، مسیرهای دیسک پوانکاره را مقایسه کن و پرسش را تا پژوهش میرزاخانی دربارهٔ ژئودزیک‌های بسته دنبال کن.','وارد خانهٔ چوبی شنیدن شو؛ پارتیتور تازهٔ بذردار را تغییر بده و نقش تصادف، قید و مؤلف را بسنج. پخش صدا اختیاری است.']}
};
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang],extra=seminarMapCopy[lang];c.places=extra.places;SEMINAR_HOUSES.forEach((h,i)=>c.landmarks[h.id]={name:h.names[lang],area:extra.area,description:extra.descriptions[{noether:0,mirzakhani:1,cage:2}[h.id]]});}

// Both vertical world connections use existing landmark coordinates.
export function coastFaceLinksSvg(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke="#8c6f40" stroke-width="2"><circle cx="460" cy="460" r="18"/><path d="M455 450v19m-5 -6l5 6 5 -6M465 470v-19m-5 6 5 -6"/></g><text x="460" y="519" text-anchor="middle" font-family="Tahoma,Arial,sans-serif" font-size="15" fill="#7a5c2d">Through-gallery · both faces</text></svg>';}
const nightParkCopy={en:{name:'Ideas Park · night face',area:'Night face · lantern walk',description:'The complete original park now lives on the night face. Follow the illuminated approach from the existing night grounds; its pond looks back toward the daylight city. Use the Night face map for its real location.'},de:{name:'Ideenpark · Nachtseite',area:'Nachtseite · Laternenweg',description:'Der vollständige ursprüngliche Park liegt jetzt auf der Nachtseite. Ein beleuchteter Zugang verbindet ihn mit den vorhandenen Nachtwegen. Sein Teich blickt zur Tagesseite; die Nachtkarte zeigt den tatsächlichen Ort.'},fa:{name:'پارک ایده‌ها · دنیای شب',area:'دنیای شب · مسیر فانوس‌ها',description:'پارک اصلی با همهٔ بخش‌هایش به دنیای شب منتقل شده است. مسیر روشن ورودی به راه‌های موجود شب وصل می‌شود و برکه رو به شهر روز دارد. جای واقعی پارک را در نقشهٔ دنیای شب ببینید.'}};
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang];Object.assign(c.landmarks.park,nightParkCopy[lang]);}

COAST_LANDMARKS.push({id:LIGHT_HOUSE.id,number:9,point:[LIGHT_HOUSE.x,LIGHT_HOUSE.z]});
const lightMapCopy={en:{name:'House of Light',area:'The southeastern light-art hexagon',description:'Enter the glass pavilion, walk around its suspended spectrum, explore colour chambers and compare a live reflection in the framed mirror passage.'},de:{name:'Haus des Lichts',area:'Die südöstliche Wabe für Lichtkunst',description:'Betritt den Glaspavillon, umrunde das schwebende Spektrum, erkunde Farbräume und vergleiche die lebendige Spiegelung im gerahmten Spiegelgang.'},fa:{name:'خانهٔ نور',area:'شش‌ضلعی هنر نور در جنوب‌شرق',description:'وارد کوشک شیشه‌ای شو، طیف معلق را از چند زاویه ببین، اتاق‌های رنگ را تجربه کن و بازتاب زندهٔ گذرگاه آینه را با فضای واقعی مقایسه کن.'}};
for(const lang of ['en','de','fa']){COAST_EXPLORER_COPY[lang].landmarks[LIGHT_HOUSE.id]=lightMapCopy[lang];COAST_EXPLORER_COPY[lang].places={en:'Eight places to explore',de:'Acht Orte zum Erkunden',fa:'هشت مکان برای گردش'}[lang];}

COAST_LANDMARKS.push({id:SEA_TERRACES.id,number:10,point:[SEA_TERRACE_ENTRY.x,SEA_TERRACE_ENTRY.z]});
const seaMapCopy={en:{name:'Sea Terraces',area:'Northeastern coastal hexagon',description:'Three low stone terraces, gentle central and side ramps, shaded pergolas and sea-view frames. Walk around the existing Listening Court to reach the terraces, or arrive from the continuous shore promenade.'},de:{name:'Meeresterrassen',area:'Nordöstliche Küstenwabe',description:'Drei niedrige Steinterrassen mit sanften mittleren und seitlichen Rampen, schattigen Pergolen und gerahmten Meerblicken. Der Weg führt um den erhaltenen Hof des Zuhörens oder von der durchgehenden Uferpromenade hierher.'},fa:{name:'ایوان تماشای دریا',area:'شش‌ضلعی ساحلی شمال‌شرق',description:'سه ایوان سنگی کم‌ارتفاع با شیب‌راه‌های ملایم، سایه‌بان‌های چوبی و قاب‌های تماشای افق. از کنار حیاط شنیدنِ موجود یا پیاده‌راه پیوستهٔ ساحل به ایوان‌ها برسید.'}};
for(const lang of ['en','de','fa']){COAST_EXPLORER_COPY[lang].landmarks[SEA_TERRACES.id]=seaMapCopy[lang];COAST_EXPLORER_COPY[lang].places={en:'Nine places to explore',de:'Neun Orte zum Erkunden',fa:'نه مکان برای گردش'}[lang];}
