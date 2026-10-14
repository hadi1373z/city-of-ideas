const instances=new Set();let language='en',dictionaryPromise=null;
const normalize=value=>String(value).replace(/\s+/g,' ').trim();
function publicTranslation(value){const key=normalize(value),dictionary=g.CITY_ARTIST_PUBLIC_FA;if(dictionary?.common?.[key])return dictionary.common[key];for(const dict of Object.values(dictionary?.artists||{}))if(dict[key])return dict[key];return null;}
function translate(value){if(language!=='fa')return value;const key=normalize(value),fa=g.CITY_OBJECT_TOOL_FA;
 if(fa.common[key])return fa.common[key];
 for(const item of STORE_OBJECTS)if(item.description===key&&item.descriptionFa)return item.descriptionFa;
 const authored=publicTranslation(key);if(authored)return authored;
 let match;
 if((match=key.match(/^(\d+) store objects · page (\d+) of (\d+)$/)))return match[1]+' شیء · صفحهٔ '+match[2]+' از '+match[3];
 if((match=key.match(/^(Creator|Licence \/ rights|Version|Source): (.+)$/)))return ({Creator:'پدیدآورنده','Licence / rights':'مجوز / حقوق',Version:'نسخه',Source:'منبع'})[match[1]]+': '+match[2];
 if((match=key.match(/^Now playing · (.+)$/)))return 'در حال پخش · '+match[1];
 if((match=key.match(/^Paused · (.+)$/)))return 'مکث‌شده · '+match[1];
 if((match=key.match(/^Finished · (.+)$/)))return 'پایان یافت · '+match[1];
 if((match=key.match(/^Playing (.+)\. Close the catalogue to walk while listening\.$/)))return 'در حال پخش '+match[1]+'؛ مجموعه را ببندید تا هنگام گوش‌دادن قدم بزنید.';
 if((match=key.match(/^(Preview unavailable|Could not play this local track|3D previews require WebGL): (.+)$/)))return ({'Preview unavailable':'پیش‌نمایش در دسترس نیست','Could not play this local track':'پخش قطعهٔ محلی ممکن نشد','3D previews require WebGL':'پیش‌نمایش سه‌بعدی به WebGL نیاز دارد'})[match[1]]+': '+match[2];
 if((match=key.match(/^3D preview of (.+)\. Drag to rotate\.$/)))return 'پیش‌نمایش سه‌بعدیِ '+match[1]+'؛ برای چرخاندن بکشید.';
 if((match=key.match(/^(View store object|Play) (.+)$/)))return (match[1]==='Play'?'پخش ':'نمایش شیء ')+match[2];
 const notes={'CC0 · bundled offline':'CC0 · همراه بستهٔ آفلاین','Original music · bundled offline':'موسیقی تألیفی · همراه بستهٔ آفلاین','Original sculpture · bundled offline':'پیکرهٔ تألیفی · همراه بستهٔ آفلاین','Game geometry · bundled offline':'هندسهٔ اصلی بازی · همراه بستهٔ آفلاین','Artwork source and rights included':'منبع و حقوق اثر همراه بسته است','Project object':'شیء تألیفی پروژه'};
 if(notes[key])return notes[key];
 if((match=key.match(/^(?:Last face: (\d+)\. )?(\d+) rolls\. Faces 1–6: (.+)\. Expected average per face: ([\d.]+)\. Small samples need not be balanced\.$/)))return (match[1]?'وجه آخر: '+match[1]+'. ':'')+match[2]+' پرتاب؛ وجه‌های ۱ تا ۶: '+match[3]+'؛ میانگین مورد انتظار برای هر وجه: '+match[4]+'. نمونه‌های کوچک لزوماً متعادل نیستند.';
 if((match=key.match(/^Ideal period: ([\d.]+) seconds per cycle\. T = 2π√\(L\/g\)\. Four times the length gives twice the period at fixed gravity\. Assumes small angles and no friction\.$/)))return 'دورهٔ ایدئال: '+match[1]+' ثانیه برای هر چرخه. T = 2π√(L/g). در گرانش ثابت، چهار برابر شدن طول، دوره را دو برابر می‌کند. فرض: زاویهٔ کوچک و نبود اصطکاک.';
 if((match=key.match(/^Centre-line laps: ([\d.]+)\. Cross-band direction: \(([^)]+)\)\. (.+) This is a mathematical trace; the sculpture stays still\.$/))){const statements={'One lap reverses the starting orientation.':'یک دور، جهت آغازین را وارونه می‌کند.','Two laps restore the starting orientation.':'دو دور، جهت آغازین را بازمی‌گرداند.','Trace the twist and predict the next orientation.':'پیچش را دنبال کنید و جهت بعدی را پیش‌بینی کنید.'};return 'دورهای خط میانی: '+match[1]+'؛ جهت عرض نوار: ('+match[2]+'). '+(statements[match[3]]||match[3])+' این یک مسیر ریاضی است؛ پیکره ثابت می‌ماند.';}
 if((match=key.match(/^RGB (.+) · (#[a-f0-9]+)\. Red \+ green makes yellow; all three at full strength make white\.$/i)))return 'RGB '+match[1]+' · '+match[2]+'. قرمز و سبز، زرد می‌سازند؛ هر سه کانال با شدت کامل، سفید می‌سازند.';
 if((match=key.match(/^Mixed light (#[a-f0-9]+)$/i)))return 'نور ترکیبی '+match[1];
 if((match=key.match(/^Left: (.+) \| Middle: (.+) \| Right: (.+)\. Rings shown bottom to top; 1 is smallest\. Moves: (\d+)\. (.+)$/))){const peg=s=>s==='empty'?'خالی':s;return 'چپ: '+peg(match[1])+' | میانی: '+peg(match[2])+' | راست: '+peg(match[3])+'. حلقه‌ها از پایین به بالا آمده‌اند؛ ۱ کوچک‌ترین است. حرکت‌ها: '+match[4]+'. '+(match[5]==='Goal: all rings on Right.'?'هدف: همهٔ حلقه‌ها در میلهٔ راست.':'حل شد! کمترین تعداد حرکت برای سه حلقه، ۷ است.');}
 if(key.endsWith(' No ring moved.'))return translate(key.slice(0,-' No ring moved.'.length))+' هیچ حلقه‌ای جابه‌جا نشد.';
 if((match=key.match(/^(\d+) = (\d+) × (\d+); this factor proves it is composite\.$/)))return match[1]+' = '+match[2]+' × '+match[3]+'؛ این عامل، مرکب‌بودن عدد را اثبات می‌کند.';
 if((match=key.match(/^(\d+) is prime\. No divisor from 2 to ⌊√(\d+)⌋ divides it\.$/)))return match[1]+' عدد اول است. هیچ عددی از ۲ تا ⌊√'+match[2]+'⌋ آن را تقسیم نمی‌کند.';
 return value;
}
function attachLanguage(root,doc){const textRecords=new WeakMap(),attrRecords=new WeakMap();let pending=false;
 function refresh(){pending=false;root.dataset.language=language;root.lang=language;
  const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,textarea,input,code,pre,[data-object-attribution]'))continue;let record=textRecords.get(node);if(!record||node.nodeValue!==record.last)record={en:node.nodeValue,last:node.nodeValue};const value=translate(record.en);if(node.nodeValue!==value)node.nodeValue=value;record.last=value;textRecords.set(node,record);}
  for(const element of root.querySelectorAll('[placeholder],[aria-label],[title]')){let records=attrRecords.get(element)||{};for(const key of ['placeholder','aria-label','title']){if(!element.hasAttribute(key))continue;const value=element.getAttribute(key);let record=records[key];if(!record||value!==record.last)record={en:value,last:value};const next=translate(record.en);if(next!==value)element.setAttribute(key,next);record.last=next;records[key]=record;}attrRecords.set(element,records);}
 }
 const observer=new MutationObserver(()=>{if(!pending){pending=true;g.setTimeout(refresh,0);}});observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});refresh();return {refresh,dispose:()=>observer.disconnect()};
}
function setLanguage(value){language=value==='fa'?'fa':'en';for(const entry of instances)entry.translator.refresh();return language;}
function ensureStyles(doc){if(!doc.getElementById('city-object-tools-style')){const link=doc.createElement('link');link.id='city-object-tools-style';link.rel='stylesheet';link.href=S.assetUrl('./city-source-assets/object-tools/object-tools.css');doc.head.append(link);}}
function ensureArtistDictionary(doc){if(g.CITY_ARTIST_PUBLIC_FA)return Promise.resolve(true);if(!dictionaryPromise)dictionaryPromise=new Promise(resolve=>{const script=doc.createElement('script');script.src=S.assetUrl('./city-source-assets/artist-sites/public-fa.js');script.onload=()=>resolve(true);script.onerror=()=>{dictionaryPromise=null;resolve(false);};doc.head.append(script);});return dictionaryPromise;}
g.addEventListener('message',event=>{if(event.origin===g.location.origin&&event.data?.type==='city-language')setLanguage(event.data.lang);});
