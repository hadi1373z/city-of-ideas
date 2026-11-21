import {buildInhabitedMind} from './de-chirico-scene.js?v=inhabited-mind-20261121';
/* A walkable, original architectural study inspired by Giorgio de Chirico's
 * Le trouble du philosophe (1925–26). No reproduction of the painting is bundled.
 * The linked museum/gallery record is the reference, not an image licence.
 */
export const DE_CHIRICO_SOURCE='https://rabinovichgallery.com/artworks/giorgio-de-chirico-1888-1978-le-trouble-du-philosophe-le-repos-du-philosophe-mannequins-on-the-seashore-the-philosopher-s-rest-1925-1926-museo-del-novecento';
export const DE_CHIRICO_COPY={
 en:{
  title:'The inhabited mind',
  subtitle:'Giorgio de Chirico · Le trouble du philosophe · 1925–26',
  intro:'An original walkable interpretation of de Chirico’s painting: anonymous figures, a miniature city, tall columns and a still horizon. This is not a reconstruction of the painting.',
  observation:'Move between the columns. From one side the structures seem to belong to the figures; from another they seem to be a city behind them.',
  question:'Can a city become part of a person, rather than merely the place where they live?',
  visit:'Walk to the inhabited mind',
  reflect:'Keep this question',
  saved:'Question added to your private notebook.',
  source:'See the painting and its attribution',
  rights:'The original painting is held by the Museo del Novecento, Milan. This pavilion uses new geometry instead of republishing a copyrighted reproduction.'
 },
 de:{
  title:'Der bewohnte Geist',
  subtitle:'Giorgio de Chirico · Le trouble du philosophe · 1925–26',
  intro:'Eine eigenständige, begehbare Interpretation von de Chiricos Gemälde: anonyme Figuren, eine Miniaturstadt, hohe Säulen und ein stiller Horizont. Keine Rekonstruktion des Bildes.',
  observation:'Gehe zwischen den Säulen hindurch. Von einer Seite scheinen die Bauten zu den Figuren zu gehören, von einer anderen wie eine Stadt dahinter.',
  question:'Kann eine Stadt Teil eines Menschen werden und nicht nur der Ort sein, an dem er lebt?',
  visit:'Zum bewohnten Geist gehen',
  reflect:'Diese Frage behalten',
  saved:'Frage im privaten Notizbuch gespeichert.',
  source:'Gemälde und Quellenangabe ansehen',
  rights:'Das Original befindet sich im Museo del Novecento in Mailand. Dieser Pavillon verwendet neue Geometrie statt einer urheberrechtlich geschützten Reproduktion.'
 },
 fa:{
  title:'ذهنِ مسکون',
  subtitle:'جورجو دِ کیریکو · آشفتگی فیلسوف · ۱۹۲۵–۱۹۲۶',
  intro:'برداشتی مستقل و قابل‌قدم‌زدن از نقاشی کیریکو: پیکره‌های بی‌نام، شهری کوچک، ستون‌های بلند و افقی ساکن. این بازسازی خود نقاشی نیست.',
  observation:'میان ستون‌ها حرکت کن. از یک سو بناها بخشی از پیکره‌ها به نظر می‌رسند و از سوی دیگر گویی شهری در پشت آن‌ها هستند.',
  question:'آیا شهر می‌تواند بخشی از وجود انسان شود، نه فقط جایی که در آن زندگی می‌کند؟',
  visit:'رفتن به ذهنِ مسکون',
  reflect:'نگه‌داشتن این پرسش',
  saved:'پرسش در دفترچهٔ خصوصی ذخیره شد.',
  source:'دیدن نقاشی و مشخصات اثر',
  rights:'اثر اصلی در موزهٔ نووچنتو در میلان نگهداری می‌شود. این غرفه به‌جای بازنشر تصویر دارای حق نشر، از شکل‌های سه‌بعدی تازه استفاده می‌کند.'
 }
};

export function buildDeChiricoExhibit(T,options={}){return buildInhabitedMind(T,options);}
