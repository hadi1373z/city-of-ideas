/* Idea-led curation layered over the existing artists’ quarter.
 * Existing artworks stay in their source galleries; de Chirico gets an original,
 * walkable interpretation, not an unlicensed reproduction.
 */
import {QUARTER_ARTISTS} from './artist-quarter-data.js?v=artists2';
import {DE_CHIRICO_COPY,DE_CHIRICO_SOURCE,buildDeChiricoExhibit} from './de-chirico-exhibit.js';

const byArtist=id=>QUARTER_ARTISTS.find(a=>a.id===id);
export const IDEA_EXHIBITIONS=[
 {id:'philosophy',artist:'Giorgio de Chirico',artwork:'Le trouble du philosophe',date:'1925–26',
  source:DE_CHIRICO_SOURCE,
  title:{en:'Philosophy',de:'Philosophie',fa:'فلسفه'},
  thought:{en:'The inhabited mind',de:'Der bewohnte Geist',fa:'ذهنِ مسکون'},
  question:DE_CHIRICO_COPY.en.question,
  questions:{en:DE_CHIRICO_COPY.en.question,de:DE_CHIRICO_COPY.de.question,fa:DE_CHIRICO_COPY.fa.question},
  experience:{en:'Walk among anonymous figures and a miniature city. Change your viewpoint: are those buildings a landscape, a memory or part of a person?',
   de:'Gehe zwischen anonymen Figuren und einer Miniaturstadt hindurch. Sind die Bauten eine Landschaft, eine Erinnerung oder Teil einer Person?',
   fa:'میان پیکره‌های بی‌نام و شهرِ کوچک قدم بزن. از زاویه‌ای دیگر نگاه کن: بناها منظره‌اند، خاطره‌اند یا بخشی از یک انسان؟'},
  original:true},
 {id:'time',artist:'Salvador Dalí',artwork:'The Persistence of Memory',date:'1931',
  source:'https://www.moma.org/collection/works/79018',artistId:'dali',
  title:{en:'Time',de:'Zeit',fa:'زمان'},
  thought:{en:'The hours we remember',de:'Die Stunden, an die wir uns erinnern',fa:'ساعت‌هایی که به یاد می‌آوریم'},
  questions:{en:'Does time pass differently in memory than it does on a clock?',
   de:'Vergeht Zeit in der Erinnerung anders als auf einer Uhr?',
   fa:'آیا زمان در خاطره با زمانِ روی ساعت متفاوت می‌گذرد؟'},
  experience:{en:'Visit Dalí’s existing dream residence and compare the painting’s soft clocks with measured time.',
   de:'Besuche Dalís bestehendes Traumhaus und vergleiche die weichen Uhren des Bildes mit gemessener Zeit.',
   fa:'به اقامتگاه رؤیایی دالی برو و ساعت‌های نرمِ نقاشی را با زمانِ اندازه‌گیری‌شده مقایسه کن.'}},
 {id:'perception',artist:'Georges Seurat',artwork:byArtist('seurat').work.title,date:'1884',
  source:byArtist('seurat').work.source,artistId:'seurat',
  title:{en:'Perception',de:'Wahrnehmung',fa:'ادراک'},
  thought:{en:'Distance makes an image',de:'Abstand macht ein Bild',fa:'فاصله تصویر را می‌سازد'},
  questions:{en:'At what distance do separate marks begin to look like one colour?',
   de:'Ab welcher Entfernung erscheinen einzelne Farbpunkte als eine Farbe?',
   fa:'از چه فاصله‌ای لکه‌های جداگانهٔ رنگ به یک رنگِ واحد تبدیل می‌شوند؟'},
  experience:{en:'Enter Seurat’s colour workshop. Change dot spacing and compare near and far floor marks.',
   de:'Betritt Seurats Farbwerkstatt. Ändere die Punktabstände und vergleiche die Bodenmarkierungen aus der Nähe und Ferne.',
   fa:'وارد کارگاه رنگ سورا شو. فاصلهٔ نقطه‌ها را تغییر بده و از دو جای نزدیک و دور نگاه کن.'}},
 {id:'representation',artist:'Paul Cézanne',artwork:byArtist('cezanne').work.title,date:'ca. 1890',
  source:byArtist('cezanne').work.source,artistId:'cezanne',
  title:{en:'Representation',de:'Darstellung',fa:'بازنمایی'},
  thought:{en:'More than one viewpoint',de:'Mehr als ein Blickwinkel',fa:'بیش از یک زاویهٔ دید'},
  questions:{en:'Can a picture tell the truth about an object without using a single fixed viewpoint?',
   de:'Kann ein Bild ein Objekt wahrheitsgemäß zeigen, ohne einen einzigen festen Blickwinkel zu verwenden?',
   fa:'آیا تصویری بدون تکیه بر یک زاویهٔ دیدِ ثابت هم می‌تواند حقیقتِ یک شیء را نشان دهد؟'},
  experience:{en:'Visit Cézanne’s still-life studio. Turn its objects and compare them with the painted table.',
   de:'Besuche Cézannes Stillleben-Atelier. Drehe die Objekte und vergleiche sie mit dem gemalten Tisch.',
   fa:'به آتلیهٔ طبیعت بی‌جان سزان برو. اشیا را بچرخان و با میزِ نقاشی‌شده مقایسه کن.'}}
];
const COPY={
 en:{open:'Exhibitions of Ideas',intro:'Four artworks, four questions. Follow a theme rather than an artist. Existing paintings and studios stay in place; the de Chirico stop is a new, original spatial interpretation.',visit:'Visit this artwork',save:'Keep the question',saved:'Question added to your private notebook.',notSaved:'Your browser did not save this question.',notebook:'Open my notebook',source:'Artwork reference',close:'Close',date:'Artwork',status:'An idea-led route through the city',category:'Theme'},
 de:{open:'Ausstellungen der Ideen',intro:'Vier Kunstwerke, vier Fragen. Folge einem Thema statt einem Künstler. Bestehende Werke bleiben am Ort; die Station zu de Chirico ist eine neue, eigenständige räumliche Interpretation.',visit:'Zum Kunstwerk gehen',save:'Frage behalten',saved:'Frage im privaten Notizbuch gespeichert.',notSaved:'Der Browser konnte die Frage nicht speichern.',notebook:'Mein Notizbuch öffnen',source:'Kunstwerk-Quelle',close:'Schließen',date:'Kunstwerk',status:'Ein Weg durch die Ideen der Stadt',category:'Thema'},
 fa:{open:'نمایشگاه‌های ایده‌ها',intro:'چهار اثر هنری و چهار پرسش. این بار به‌جای هنرمند، یک ایده را دنبال کن. آثار و آتلیه‌های موجود در جای خود می‌مانند؛ ایستگاه کیریکو برداشتی فضایی و تازه است.',visit:'رفتن به اثر',save:'نگه‌داشتن پرسش',saved:'پرسش در دفترچهٔ خصوصی ذخیره شد.',notSaved:'مرورگر نتوانست پرسش را ذخیره کند.',notebook:'باز کردن دفترچه‌ام',source:'منبع اثر',close:'بستن',date:'اثر هنری',status:'مسیر ایده‌محور در شهر',category:'موضوع'}
};
export const IDEA_EXHIBITION_COPY=COPY;

export function installIdeaExhibitions(M,T){
 const exhibit=buildDeChiricoExhibit(T);
 M.scene.add(exhibit.group);M.city.targets.push(...exhibit.targets);
 const lang=()=>window.CITY_I18N?.lang||'en',copy=()=>COPY[lang()]||COPY.en,pick=v=>v?.[lang()]||v?.en||'';
 const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 const button=(text,fn)=>{const e=el('button',text);e.type='button';e.className='glass';e.onclick=fn;return e;};
 const dialog=el('dialog');dialog.id='idea-exhibitions';dialog.dataset.confirmFocused='true';
 dialog.setAttribute('aria-labelledby','idea-exhibitions-title');
 const header=el('header'),heading=el('h2'),close=button('×',()=>dialog.close());heading.id='idea-exhibitions-title';close.setAttribute('data-close','');
 header.append(heading,close);const body=el('div');body.className='idea-exhibitions-body';
 dialog.append(header,body);document.body.append(dialog);
 const launch=button('',()=>open()),map=button('',()=>open());
 launch.id='idea-exhibitions-welcome';map.id='idea-exhibitions-map';
 document.querySelector('.welcome-secondary')?.append(launch);
 document.querySelector('.map-directions')?.append(map);

 const old={startExtra:M.startExtra,targetInfo:M.city.targetInfo,showExtra:M.showExtra};
 const navigate=id=>{
  const item=IDEA_EXHIBITIONS.find(e=>e.id===id);
  if(!item)return false;
  dialog.close();
  M.clearMovement();
  if(id==='philosophy'){M.arrive(exhibit.entry);return true;}
  const p=M.artistQuarter?.entry(item.artistId);
  if(p){M.arrive(p);return true;}
  return old.startExtra?.('artist:'+item.artistId)||false;
 };
 const reflect=id=>{
  const item=IDEA_EXHIBITIONS.find(e=>e.id===id),store=M.visitorMemory?.store;
  if(!item||!store)return false;
  store.question('idea-exhibition-'+id,'personal',pick(item.questions));
  store.discover('idea-exhibition-'+id);return true;
 };
 function render(){
  const c=copy();dialog.dir=lang()==='fa'?'rtl':'ltr';
  close.setAttribute('aria-label',c.close);
  heading.textContent=c.open;
  body.replaceChildren(el('p',c.intro));
  const grid=el('div');grid.className='idea-exhibitions-grid';body.append(grid);
  for(const item of IDEA_EXHIBITIONS){
   const card=el('article');card.className='idea-exhibitions-card';card.dataset.exhibition=item.id;
   const kicker=el('p',c.category);kicker.className='idea-exhibitions-kicker';
   const title=el('h3',pick(item.title)),thought=el('h4',pick(item.thought));
   const attribution=el('p',item.artist+' · '+item.artwork+' ('+item.date+')');
   attribution.className='idea-exhibitions-attribution';
   const description=el('p',pick(item.experience)),question=el('blockquote',pick(item.questions));
   const actions=el('div');actions.className='idea-exhibitions-actions';
   actions.append(button(c.visit,()=>navigate(item.id)),button(c.save,()=>{
    const ok=reflect(item.id),status=el('p',ok?(M.visitorMemory.store.saved?c.saved:c.notSaved):c.notSaved);
    status.setAttribute('role','status');
    card.append(status);
   }));
   if(M.visitorMemory?.open)actions.append(button(c.notebook,()=>{dialog.close();M.visitorMemory.open('idea-exhibition-'+item.id);}));
   const link=el('a',c.source);link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';
   actions.append(link);card.append(kicker,title,thought,attribution,description,question,actions);
   if(item.original)card.append(el('p',DE_CHIRICO_COPY[lang()]?.rights||DE_CHIRICO_COPY.en.rights));
   grid.append(card);
  }
 }
 function open(id){
  M.clearMovement();
  const mapPanel=document.querySelector('#map-panel');if(mapPanel)mapPanel.hidden=true;
  render();if(!dialog.open)dialog.showModal();
  if(id){const item=body.querySelector('[data-exhibition="'+id+'"]');item?.scrollIntoView?.({block:'nearest'});}
  body.querySelector('button')?.focus();
 }
 function refresh(){launch.textContent=map.textContent=copy().open;if(dialog.open)render();}
 M.startExtra=destination=>{
  if(destination==='ideas-gallery'||destination==='idea-exhibitions'){open();return true;}
  if(typeof destination==='string'&&destination.startsWith('idea:'))return navigate(destination.slice(5));
  return old.startExtra?.(destination);
 };
 M.city.targetInfo=data=>data?.deChirico?{kind:'idea-art',data,title:'Giorgio de Chirico · '+pick(IDEA_EXHIBITIONS[0].title)}:old.targetInfo(data);
 M.showExtra=info=>{if(info?.kind==='idea-art'){open('philosophy');return true;}return old.showExtra?.(info);};
 if(M.city.landmarks)M.city.landmarks.ideaExhibitions={...exhibit.entry};
 refresh();
 const query=new URLSearchParams(globalThis.location?.search||'');
 if(query.get('arrival')==='ideas-gallery')open(query.get('theme'));
 if(query.get('arrival')==='philosophy-art')navigate('philosophy');
 return {exhibit,open,reflect,navigate,refresh,dispose(){
  launch.remove();map.remove();dialog.remove();
  for(const target of exhibit.targets){const i=M.city.targets.indexOf(target);if(i>=0)M.city.targets.splice(i,1);}
  exhibit.dispose();
 }};
}
