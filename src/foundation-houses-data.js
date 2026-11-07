// First architectural studies, not reconstructions of the writers' actual homes.
const house=(id,x,z,names,style,wall,roof,feature,next)=>({id,x,z,names,style,wall,roof,feature,next,width:18,depth:16,turn:Math.atan2(-x,-z)});
export const FOUNDATION_HOUSES=[
 house('freud',-340,-200,{en:'Freud’s house',de:'Freuds Haus',fa:'خانهٔ فروید'},'hip',0xc29c86,0x72524b,{en:'A red couch beside a quiet window.',de:'Eine rote Couch am ruhigen Fenster.',fa:'کاناپه‌ای سرخ کنار پنجره‌ای آرام.'},{en:'Rooms for dreams and memory.',de:'Räume für Traum und Erinnerung.',fa:'اتاق‌هایی برای رؤیا و خاطره.'}),
 house('chomsky',-360,-100,{en:'Chomsky’s house',de:'Chomskys Haus',fa:'خانهٔ چامسکی'},'modern',0xd4d8cd,0x526d72,{en:'A branching wooden relief in a light-filled study.',de:'Ein verzweigtes Holzrelief im hellen Arbeitszimmer.',fa:'نقشی شاخه‌وار از چوب در اتاقی روشن.'},{en:'A language and argument workshop.',de:'Eine Werkstatt für Sprache und Argumente.',fa:'کارگاهی برای زبان و استدلال.'}),
 house('borges',-360,20,{en:'Borges’ house',de:'Borges’ Haus',fa:'خانهٔ بورخس'},'library',0xb5b2a1,0x505d59,{en:'A small library with a book waiting on its desk.',de:'Eine kleine Bibliothek mit einem Buch auf dem Tisch.',fa:'کتابخانه‌ای کوچک با کتابی بر میز.'},{en:'A library of branching paths.',de:'Eine Bibliothek verzweigter Wege.',fa:'کتابخانه‌ای با مسیرهای منشعب.'}),
 house('calvino',340,-235,{en:'Calvino’s house',de:'Calvinos Haus',fa:'خانهٔ کالوینو'},'vault',0xdcd0b4,0x789b9c,{en:'A vaulted room with three nested viewing frames.',de:'Ein gewölbter Raum mit drei ineinanderliegenden Sichtrahmen.',fa:'اتاقی طاق‌دار با سه قابِ تودرتوی دیدن.'},{en:'Rooms that reinterpret the same city.',de:'Räume, die dieselbe Stadt neu deuten.',fa:'اتاق‌هایی برای دیدن دوبارهٔ یک شهر.'}),
 house('ada',365,-128,{en:'Ada Lovelace’s house',de:'Ada Lovelaces Haus',fa:'خانهٔ آدا لاولیس'},'workshop',0xb79b88,0x537d7b,{en:'A brass wheel mounted on a workbench beneath a skylight.',de:'Ein Messingrad auf der Werkbank unter einem Oberlicht.',fa:'چرخی برنجی بر میز کار، زیر نورگیر.'},{en:'A room for patterns, mechanisms and computation.',de:'Ein Raum für Muster, Mechanik und Berechnung.',fa:'اتاقی برای الگو، سازوکار و محاسبه.'}),
 house('leguin',385,-22,{en:'Ursula Le Guin’s house',de:'Ursula Le Guins Haus',fa:'خانهٔ اورسولا لو گویین'},'courtyard',0xc3b39b,0x867057,{en:'An open-roof courtyard with two seats around a stone hearth.',de:'Ein offener Hof mit zwei Sitzen an einer steinernen Feuerstelle.',fa:'حیاطی روباز با دو نشیمن پیرامون اجاقی سنگی.'},{en:'A shared room for imagined societies.',de:'Ein gemeinsamer Raum für erdachte Gesellschaften.',fa:'فضایی مشترک برای جامعه‌های خیالی.'})
];
const czechHouses={
 freud:['Freudův dům','Červená pohovka u klidného okna.','Pokoje pro sny a paměť.'],
 chomsky:['Chomského dům','Rozvětvený dřevěný reliéf ve světlé pracovně.','Dílna jazyka a argumentace.'],
 borges:['Borgesův dům','Čítárna s policemi, lampou a otevřenou knihou.','Knihovna rozvětvených cest.'],
 calvino:['Calvinův dům','Klenutý pokoj se třemi vnořenými rámy.','Pokoje, které nově vykládají stejné město.'],
 ada:['Dům Ady Lovelace','Mosazné kolo na pracovním stole pod světlíkem.','Pokoj vzorců, mechanismů a výpočtů.'],
 leguin:['Dům Ursuly Le Guin','Otevřený dvůr se dvěma místy k sezení kolem kamenného ohniště.','Společný prostor pro vymyšlené společnosti.']
};
for(const h of FOUNDATION_HOUSES){const [name,feature,next]=czechHouses[h.id];h.names.cs=name;h.feature.cs=feature;h.next.cs=next;}
Object.assign(FOUNDATION_HOUSES.find(h=>h.id==='borges').feature,{en:'A reading corner with returning shelves, a desk lamp and an open folio.',de:'Eine Leseecke mit umlaufenden Regalen, Schreibtischlampe und offenem Buch.',fa:'گوشهٔ مطالعه با قفسه‌های پیرامونی، چراغ میز و کتابی گشوده.'});
export const houseWorld=(h,x,z)=>({x:h.x+x*Math.cos(h.turn)+z*Math.sin(h.turn),z:h.z+z*Math.cos(h.turn)-x*Math.sin(h.turn)});
export const houseEntry=h=>({...houseWorld(h,0,25),y:.13,yaw:h.turn});
export const houseInside=h=>({...houseWorld(h,0,4.5),y:.13,yaw:h.turn+(['chomsky','borges'].includes(h.id)?0:.55),pitch:-.05});
const arc=(r,a,b)=>{const steps=Math.ceil((b-a)*180/Math.PI/3);return Array.from({length:steps+1},(_,i)=>{const t=a+(b-a)*i/steps;return[r*Math.cos(t),r*Math.sin(t)];});};
// The two arcs meet existing island roads, outside the established inner neighbourhoods.
export const FOUNDATION_ROUTES=[
 {width:4.8,points:arc(320,Math.PI-Math.asin(80/320),Math.PI*1.20)},
 {width:4.8,points:arc(300,-Math.PI*.22,Math.asin(76/300))},
 ...FOUNDATION_HOUSES.map(h=>{const p=houseWorld(h,0,8.15),r=h.x<0?320:300,a=Math.atan2(h.z,h.x);return{width:3.2,points:[[p.x,p.z],[Math.cos(a)*r,Math.sin(a)*r]]};})
];
export const FOUNDATION_COPY={
 cs:{title:'Nové domy · první studie',intro:'Šest malých domů na vnějších cestách. Začátky architektury: jméno, pokoj a první detaily k dalšímu rozvíjení.',notice:'Původní návrhy domů pro toto město.',close:'Zpět do města',approach:'Přijít k domu',enter:'Vstoupit',directory:'Všechny nové domy',later:'K dalšímu rozvoji',feature:'Co tu najdeš',map:'Nové domy',near:'Nový dům',stage:'První architektonická studie'},
 en:{title:'New houses · first studies',intro:'Six small houses on the outer lanes. These are early architectural beginnings: a name, a room and one feature to continue later.',notice:'Original house designs imagined for this city.',close:'Return to the city',approach:'Approach the house',enter:'Step inside',directory:'All new houses',later:'To develop later',feature:'Here now',map:'New houses',near:'A new house',stage:'First architectural study'},
 de:{title:'Neue Häuser · erste Studien',intro:'Sechs kleine Häuser an den äußeren Wegen. Erste architektonische Anfänge: ein Name, ein Raum und ein Detail für die spätere Entwicklung.',notice:'Eigenständige Hausentwürfe für diese Stadt.',close:'Zurück zur Stadt',approach:'Zum Haus gehen',enter:'Eintreten',directory:'Alle neuen Häuser',later:'Später weiterentwickeln',feature:'Jetzt zu sehen',map:'Neue Häuser',near:'Ein neues Haus',stage:'Erste Architekturstudie'},
 fa:{title:'خانه‌های تازه؛ طرح‌های نخست',intro:'شش خانهٔ کوچک در مسیرهای بیرونی؛ آغازهایی معماری با یک نام، یک اتاق و جزئی کوچک برای ادامه در آینده.',notice:'این خانه‌ها طراحی‌های تازه‌ای برای همین شهر هستند.',close:'بازگشت به شهر',approach:'رفتن به ورودی خانه',enter:'وارد شو',directory:'همهٔ خانه‌های تازه',later:'برای ادامه در آینده',feature:'اکنون در خانه',map:'خانه‌های تازه',near:'خانه‌ای تازه',stage:'طرح نخست معماری'}
};
