import {SEMINAR_HOUSES} from './seminar-houses-data.js?v=city-learning-20261118';
import {SHORE} from './island-layout.js?v=city-learning-20261118';

// The same world-to-SVG projection used by the original coastal plan.
export const coastMapPoint = (x, z) => [460 + x * .7, 460 + z * .7];
export const COAST_LANDMARKS = [
  {id: 'gallery', number: 1, point: [0, 0]},
  {id: 'park', number: 2, point: [0, -330]},
  {id: 'socrates', number: 3, point: [-96, 100]},
  // The existing garden-court arrival, rather than a new district position.
  {id: 'artists', number: 4, point: [-398.3716857408417, 138]},
  {id: 'shore', number: 5, point: [SHORE.x, SHORE.z]}
];

export const COAST_MAIN_PATHS = [
 [[-64,0],[-76,0],[-76,110],[-97.7,110],[-97.7,103.8]],
 [[-76,0],[-84,0],[-84,-32],[-138,-32],[-138,-150],[0,-185],[0,-195]],
 [[-97.7,110],[0,110]],
 [[0,94],[0,110],[74,100],[74,76],[200,76],[203.5,65],[203.5,-50],[211.5,-50]]
];
// One guided walk on existing paths only. Visit the artists' garden court,
// retrace the short approach, then continue along the existing eastern lane.
export const COAST_WALK = [[-64,0],[-76,0],[-76,110],[0,110],[74,100],[74,76],[200,76],[203.5,65],[215,65],[249,65],[256.5,76],[350,76],[Math.sqrt(536**2-76**2),76],[SHORE.x,76]];

export function coastWalkSvg() {
  const points = COAST_WALK.map(p => coastMapPoint(...p).map(n => n.toFixed(1)).join(',')).join(' ');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke-linejoin="round" stroke-linecap="round"><polyline points="' + points + '" stroke="#fff9e8" stroke-width="12"/><polyline points="' + points + '" stroke="#963c26" stroke-width="6" stroke-dasharray="10 7"/></g></svg>';
}

export const COAST_EXPLORER_COPY = {
  en: {
    title: 'City Map 1.1 · Explore the island',
    intro: 'Choose a numbered place on the map or in the list. Read about it, then visit when you are ready.',
    places: 'Five places to explore', information: 'About this place', visit: 'Visit this place',
    route: 'Walking route · Gallery → Origami → Coast', shown: 'Walking route shown.', hidden: 'Walking route hidden.',
    routeHelp: 'The dashed rust-coloured line follows existing paths. It starts at the gallery’s west approach; it is a map guide, not automatic movement.',
    steps: ['From the gallery’s west approach, follow the connected path south to the central junction, then east to the Makers’ lane.', 'Turn north briefly, then follow the lane east past the north side of the House of Origami. The artists’ garden court is a separate destination in the western blocks.', 'Continue east across the shoreline promenade to the paper-boat lookout.'],
    more: 'More city destinations',
    landmarks: {
      gallery: {name: 'Zarathustra Gallery', area: 'The island centre', description: 'Explore the gallery and its philosophical artworks. Zarathustra stands at the exact centre of this circular island.'},
      park: {name: 'Ideas Park', area: 'The northern park', description: 'A green place for reflection, ideas and hands-on exploration. The park lies north of the central gallery.'},
      socrates: {name: 'Socrates’ House', area: 'Southwest of the gallery', description: 'Visit Socrates’ house and its spaces for questions and conversation. Select Visit to approach the existing entrance.'},
      artists: {name: 'Artists’ Quarter', area: 'The western garden block', description: 'Discover Monet, Van Gogh, Hilma af Klint and Morris around a shared garden court. The form galleries and working studios have their own marked blocks.'},
      shore: {name: 'Paper-Boat Lookout', area: 'The eastern shore', description: 'Look out over the ocean from the existing paper-boat landing. The coastal promenade connects this shore to the rest of the island.'}
    }
  },
  de: {
    title: 'Stadtplan 1.1 · Die Insel erkunden',
    intro: 'Wähle einen nummerierten Ort auf der Karte oder in der Liste. Lies mehr darüber und besuche ihn, wenn du bereit bist.',
    places: 'Fünf Orte zum Erkunden', information: 'Über diesen Ort', visit: 'Diesen Ort besuchen',
    route: 'Spazierweg · Galerie → Origami → Küste', shown: 'Spazierweg eingeblendet.', hidden: 'Spazierweg ausgeblendet.',
    routeHelp: 'Die rostrote gestrichelte Linie folgt bestehenden Wegen. Sie beginnt am westlichen Zugang der Galerie und dient zur Orientierung; sie bewegt dich nicht automatisch.',
    steps: ['Gehe vom westlichen Zugang der Galerie nach Süden zur zentralen Kreuzung und dann nach Osten zur Gasse der Werkstätten.', 'Gehe kurz nach Norden und folge der Gasse nach Osten an der Nordseite des Hauses des Origami vorbei. Der Gartenhof der Künstler liegt separat in den westlichen Stadtblöcken.', 'Gehe weiter nach Osten über die Uferpromenade zur Papierboot-Aussicht.'],
    more: 'Weitere Ziele in der Stadt',
    landmarks: {
      gallery: {name: 'Zarathustra-Galerie', area: 'Die Inselmitte', description: 'Erkunde die Galerie und ihre philosophischen Kunstwerke. Zarathustra steht genau im Mittelpunkt dieser kreisrunden Insel.'},
      park: {name: 'Ideenpark', area: 'Der nördliche Park', description: 'Ein grüner Ort zum Nachdenken, für Ideen und zum Ausprobieren. Der Park liegt nördlich der zentralen Galerie.'},
      socrates: {name: 'Haus des Sokrates', area: 'Südwestlich der Galerie', description: 'Besuche das Haus des Sokrates mit seinen Räumen für Fragen und Gespräche. Mit „Diesen Ort besuchen“ erreichst du den bestehenden Eingang.'},
      artists: {name: 'Künstlerviertel', area: 'Der westliche Gartenblock', description: 'Entdecke Monet, Van Gogh, Hilma af Klint und Morris am gemeinsamen Gartenhof. Die Formgalerien und Arbeitsateliers haben eigene markierte Stadtblöcke.'},
      shore: {name: 'Papierboot-Aussicht', area: 'Das östliche Ufer', description: 'Blicke von der bestehenden Papierboot-Anlegestelle auf den Ozean. Die Uferpromenade verbindet diesen Ort mit dem Rest der Insel.'}
    }
  },
  fa: {
    title: 'نقشهٔ شهر ۱.۱ · گردش در جزیره',
    intro: 'یک مکان شماره‌دار را روی نقشه یا در فهرست انتخاب کنید. درباره‌اش بخوانید و هر وقت آماده بودید به آنجا بروید.',
    places: 'پنج مکان برای گردش', information: 'دربارهٔ این مکان', visit: 'رفتن به این مکان',
    route: 'مسیر پیاده‌روی · گالری ← اوریگامی ← ساحل', shown: 'مسیر پیاده‌روی نمایش داده شد.', hidden: 'مسیر پیاده‌روی پنهان شد.',
    routeHelp: 'خط‌چین آجری‌رنگ مسیرهای موجود را دنبال می‌کند. آغاز آن ورودی غربی گالری است؛ این راهنمای نقشه است و شما را خودکار جابه‌جا نمی‌کند.',
    steps: ['از ورودی غربی گالری به جنوب تا تقاطع مرکزی بروید و سپس به شرق، به گذرگاه کارگاه‌ها برسید.', 'کمی به شمال بروید و سپس گذرگاه را به شرق، از کنار بخش شمالی خانهٔ اوریگامی دنبال کنید. حیاط باغ هنرمندان مقصدی جداگانه در بلوک‌های غربی شهر است.', 'به شرق ادامه دهید و از پیاده‌راه ساحلی بگذرید تا به سکوی تماشای قایق کاغذی برسید.'],
    more: 'مقصدهای دیگر شهر',
    landmarks: {
      gallery: {name: 'گالری زرتشت', area: 'مرکز جزیره', description: 'گالری و آثار فلسفی آن را ببینید. زرتشت درست در مرکز این جزیرهٔ دایره‌ای قرار دارد.'},
      park: {name: 'پارک ایده‌ها', area: 'پارک شمالی', description: 'فضایی سبز برای اندیشیدن، ایده‌ها و تجربه کردن. پارک در شمال گالری مرکزی قرار دارد.'},
      socrates: {name: 'خانهٔ سقراط', area: 'جنوب‌غرب گالری', description: 'به خانهٔ سقراط و فضاهای پرسش و گفت‌وگو سر بزنید. با انتخاب «رفتن به این مکان» به ورودی موجود خانه می‌رسید.'},
      artists: {name: 'محلهٔ هنرمندان', area: 'بلوک باغ در غرب', description: 'مونه، ون‌گوگ، هیلما آف کلینت و موریس را پیرامون حیاط باغ مشترک کشف کنید. گالری‌های فرم و آتلیه‌های کار، بلوک‌های نشانه‌گذاری‌شدهٔ خود را دارند.'},
      shore: {name: 'سکوی تماشای قایق کاغذی', area: 'ساحل شرقی', description: 'از سکوی موجود قایق کاغذی به اقیانوس نگاه کنید. پیاده‌راه ساحلی اینجا را به دیگر بخش‌های جزیره پیوند می‌دهد.'}
    }
  }
};

for(const [i,h]of SEMINAR_HOUSES.entries())COAST_LANDMARKS.push({id:h.id,number:6+i,point:[h.x,h.z],seminarHouse:true});
const seminarMapCopy={
 en:{places:'Eight places to explore',area:'The southeastern seminar court',descriptions:['Enter a stone rotunda and test how breaking rotational symmetry changes an exact oscillator model. Read the assumptions behind its conserved quantities.','Explore a turquoise ribbon-roof house, compare paths in the Poincaré disk and follow the question toward Mirzakhani’s research on closed geodesics.','Enter a timber listening house, change an original seeded score and question the roles of chance, constraints and authorship. Sound is optional.']},
 de:{places:'Acht Orte zum Erkunden',area:'Der südöstliche Seminarhof',descriptions:['Betritt die Steinrotunde und prüfe an exakten Oszillatoren, was beim Brechen der Rotationssymmetrie erhalten bleibt. Lies die Voraussetzungen des Arguments.','Erkunde das Haus unter dem türkisen Banddach, vergleiche Wege in der Poincaré-Scheibe und folge der Frage zu Mirzakhanis Forschung über geschlossene Geodäten.','Betritt das hölzerne Haus des Zuhörens, verändere eine eigenständige gesetzte Partitur und befrage Zufall, Regeln und Autorschaft. Klang ist freiwillig.']},
 fa:{places:'هشت مکان برای گردش',area:'حیاط سمینار در جنوب‌شرق',descriptions:['وارد روتوندای سنگی شو و در مدل دقیق نوسانگر بررسی کن شکست تقارن دورانی چه چیزی را تغییر می‌دهد. فرض‌های کمیت پایسته را بخوان.','زیر سقف نواری فیروزه‌ای، مسیرهای دیسک پوانکاره را مقایسه کن و پرسش را تا پژوهش میرزاخانی دربارهٔ ژئودزیک‌های بسته دنبال کن.','وارد خانهٔ چوبی شنیدن شو؛ پارتیتور تازهٔ بذردار را تغییر بده و نقش تصادف، قید و مؤلف را بسنج. پخش صدا اختیاری است.']}
};
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang],extra=seminarMapCopy[lang];c.places=extra.places;SEMINAR_HOUSES.forEach((h,i)=>c.landmarks[h.id]={name:h.names[lang],area:extra.area,description:extra.descriptions[i]});}

// Both vertical world connections use existing landmark coordinates.
export function coastFaceLinksSvg(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke="#8c6f40" stroke-width="2"><circle cx="460" cy="460" r="18"/><path d="M455 450v19m-5 -6l5 6 5 -6M465 470v-19m-5 6l5 -6 5 6"/></g><g fill="none" stroke="#3b7081" stroke-width="2"><ellipse cx="460" cy="229" rx="19" ry="12"/><path d="M460 219v21m-5 -6l5 6 5 -6"/></g><g font-family="Tahoma,Arial,sans-serif" text-anchor="middle" font-size="15" paint-order="stroke" stroke="#f0eddb" stroke-width="4"><text x="460" y="519" fill="#7a5c2d">Through-gallery · both faces</text><text x="460" y="280" fill="#326577">Pond · other-face crossing</text></g></svg>';}
for(const lang of ['en','de','fa']){const c=COAST_EXPLORER_COPY[lang];c.landmarks.gallery.description+=' The gallery now continues beneath Babel to the opposite face of the cylindrical world.';c.landmarks.park.name='Ideas Park · Pond crossing';c.landmarks.park.description='The park pond looks into the real lower face of the universe. Visit the pond shore to look through its centre or choose Travel to the other face. The boats remain on the water; the crossing arrives beside the Graveyard and Mathematics.';}
