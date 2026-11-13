export const ADA_SOURCE = {
  url: 'https://psychclassics.yorku.ca/Lovelace/lovelace.htm',
  label: 'A. A. L. · Notes A & G · 1843',
  edition: 'Scientific Memoirs, vol. 3, pp. 666–731 · York University transcription'
};
export const ADA_ROOM = {
  en: {
    read: 'Read at the instruction table', title: 'Ada’s workshop · A wheel is not a program',
    intro: 'The brass wheel is the mechanism. The punched cards on the new worktable suggest a different question: what tells a mechanism what to do, and in which order?',
    sections: [
      ['Look around the workshop', 'The original wheel remains on the left bench. Opposite it, two perforated cards rest on a new writing table. The framed board shows two sequences with the same starting number. Window ledges and timber crossbeams give the skylit room a workshop scale.'],
      ['A historical starting point', 'In her 1843 Notes on Babbage’s proposed Analytical Engine, Lovelace distinguished instructions from the quantities they act upon. Note A discusses separate classes of cards; Note G presents an ordered calculation of Bernoulli numbers. The primary text is linked below.'],
      ['The same parts, a different result', 'Start with 2. Doubling and then adding 3 gives 7. Adding 3 first and then doubling gives 10. Both sequences use the same two operations. Changing their order changes what the whole procedure does. Before advancing a card, predict the next value.']
    ],
    experiment: 'Try the two instruction cards', orders: ['Double, then add 3', 'Add 3, then double'],
    operations: {double: 'Double', add: 'Add 3'}, next: 'Apply the next card', reset: 'Reset to 2',
    start: 'Starting value', value: 'Value', card: 'Card', done: 'Both cards have run. Swap their order to compare.',
    ready: 'Predict the next value, then apply one card.', sources: 'Read the primary source',
    notice: 'Original explanations and a modern toy exercise, not a reconstruction of the Analytical Engine or Lovelace’s Bernoulli calculation. Nothing is saved.',
    locale: 'House readings and controls support Czech; other city content may use English fallback.'
  },
  de: {
    read: 'Am Anleitungstisch lesen', title: 'Adas Werkstatt · Ein Rad ist kein Programm',
    intro: 'Das Messingrad ist der Mechanismus. Die Lochkarten auf dem neuen Arbeitstisch stellen eine andere Frage: Was sagt einem Mechanismus, was er in welcher Reihenfolge tun soll?',
    sections: [
      ['Die Werkstatt betrachten', 'Das ursprüngliche Rad bleibt auf der linken Werkbank. Gegenüber liegen zwei gelochte Karten auf einem neuen Schreibtisch. Die gerahmte Tafel zeigt zwei Abläufe mit derselben Startzahl. Fensterbänke und hölzerne Querbalken gliedern den Raum unter dem Oberlicht.'],
      ['Ein historischer Ausgangspunkt', 'In ihren Notizen von 1843 zu Babbages geplanter Analytical Engine unterschied Lovelace Anweisungen von den bearbeiteten Größen. Note A behandelt verschiedene Kartenarten; Note G zeigt eine geordnete Berechnung von Bernoulli-Zahlen. Der Primärtext ist unten verlinkt.'],
      ['Gleiche Teile, anderes Ergebnis', 'Beginne mit 2. Verdoppeln und danach 3 addieren ergibt 7. Zuerst 3 addieren und dann verdoppeln ergibt 10. Beide Abläufe nutzen dieselben zwei Operationen. Ihre Reihenfolge verändert das ganze Verfahren. Sage vor jeder Karte den nächsten Wert voraus.']
    ],
    experiment: 'Zwei Anweisungskarten ausprobieren', orders: ['Verdoppeln, dann 3 addieren', '3 addieren, dann verdoppeln'],
    operations: {double: 'Verdoppeln', add: '3 addieren'}, next: 'Nächste Karte ausführen', reset: 'Auf 2 zurücksetzen',
    start: 'Startwert', value: 'Wert', card: 'Karte', done: 'Beide Karten sind ausgeführt. Vergleiche die andere Reihenfolge.',
    ready: 'Sage den nächsten Wert voraus und führe dann eine Karte aus.', sources: 'Den Primärtext lesen',
    notice: 'Eigene Erklärungen und eine moderne kleine Übung; keine Rekonstruktion der Analytical Engine oder von Lovelaces Bernoulli-Berechnung. Es wird nichts gespeichert.',
    locale: 'Hauslektüren und Bedienung sind auf Tschechisch verfügbar; andere Stadtinhalte können auf Englisch erscheinen.'
  },
  fa: {
    read: 'خواندن کنار میز دستورها', title: 'کارگاه آدا؛ چرخ، برنامه نیست',
    intro: 'چرخ برنجی سازوکار است. کارت‌های سوراخ‌دار روی میز تازه پرسش دیگری پیش می‌کشند: چه چیزی به سازوکار می‌گوید چه کند و با چه ترتیبی؟',
    sections: [
      ['به کارگاه نگاه کنید', 'چرخ نخستین بر میز سمت چپ باقی است. روبه‌روی آن دو کارت سوراخ‌دار روی میز نوشتن تازه قرار دارند. تختهٔ قاب‌دار دو دنباله را با عدد آغازین یکسان نشان می‌دهد. طاقچه‌های پنجره و تیرهای چوبی، فضای زیر نورگیر را به کارگاهی ملموس بدل می‌کنند.'],
      ['نقطهٔ آغاز تاریخی', 'لاولیس در یادداشت‌های ۱۸۴۳ دربارهٔ ماشین تحلیلی پیشنهادی ببیج، دستورها را از کمیت‌هایی که روی آن‌ها عمل می‌کنند جدا کرد. یادداشت A دربارهٔ گونه‌های کارت است؛ یادداشت G محاسبه‌ای مرتب برای اعداد برنولی دارد. پیوند متن اصلی در پایین آمده است.'],
      ['اجزای یکسان، نتیجهٔ متفاوت', 'از ۲ شروع کنید. دوبرابر کردن و سپس افزودن ۳، نتیجهٔ ۷ می‌دهد. نخست افزودن ۳ و سپس دوبرابر کردن، نتیجهٔ ۱۰ می‌دهد. هر دو دنباله همان دو عمل را دارند. جابه‌جایی ترتیب، کارِ کل روش را عوض می‌کند. پیش از اجرای هر کارت، مقدار بعدی را پیش‌بینی کنید.']
    ],
    experiment: 'دو کارت دستور را بیازمایید', orders: ['دوبرابر کردن، سپس افزودن ۳', 'افزودن ۳، سپس دوبرابر کردن'],
    operations: {double: 'دوبرابر کردن', add: 'افزودن ۳'}, next: 'اجرای کارت بعدی', reset: 'بازگشت به ۲',
    start: 'مقدار آغازین', value: 'مقدار', card: 'کارت', done: 'هر دو کارت اجرا شدند. ترتیب دیگر را برای مقایسه انتخاب کنید.',
    ready: 'مقدار بعدی را پیش‌بینی کنید و سپس یک کارت را اجرا کنید.', sources: 'خواندن منبع اصلی',
    notice: 'توضیح‌های تازه و تمرینی کوچک و امروزی؛ بازسازی ماشین تحلیلی یا محاسبهٔ برنولی لاولیس نیست. چیزی ذخیره نمی‌شود.',
    locale: 'خواندنی‌ها و کنترل‌های خانه به زبان چکی در دسترس‌اند؛ بخش‌های دیگر شهر ممکن است انگلیسی باشند.'
  },
  cs: {
    read: 'Číst u stolu s instrukcemi', title: 'Adina dílna · Kolo není program',
    intro: 'Mosazné kolo je mechanismus. Děrné karty na novém pracovním stole kladou jinou otázku: co mechanismu říká, co má dělat a v jakém pořadí?',
    sections: [
      ['Rozhlédněte se po dílně', 'Původní kolo zůstává na levém ponku. Naproti leží dvě děrované karty na novém psacím stole. Zarámovaná tabule ukazuje dva postupy se stejným počátečním číslem. Parapety a dřevěné příčné trámy člení prostor pod světlíkem.'],
      ['Historický výchozí bod', 'V poznámkách z roku 1843 k Babbageovu návrhu analytického stroje Lovelaceová odlišila instrukce od zpracovávaných veličin. Poznámka A rozebírá různé druhy karet; poznámka G předkládá uspořádaný výpočet Bernoulliho čísel. Původní text je dostupný níže.'],
      ['Stejné části, jiný výsledek', 'Začněte číslem 2. Zdvojnásobení a následné přičtení 3 dává 7. Nejprve přičíst 3 a potom zdvojnásobit dává 10. Oba postupy používají stejné dvě operace. Jejich pořadí mění význam celého postupu. Před provedením každé karty odhadněte další hodnotu.']
    ],
    experiment: 'Vyzkoušejte dvě instrukční karty', orders: ['Zdvojnásobit a přičíst 3', 'Přičíst 3 a zdvojnásobit'],
    operations: {double: 'Zdvojnásobit', add: 'Přičíst 3'}, next: 'Provést další kartu', reset: 'Zpět na 2',
    start: 'Počáteční hodnota', value: 'Hodnota', card: 'Karta', done: 'Obě karty jsou provedeny. Porovnejte opačné pořadí.',
    ready: 'Odhadněte další hodnotu a potom proveďte jednu kartu.', sources: 'Číst původní pramen',
    notice: 'Původní výklad a malá současná úloha; nejde o rekonstrukci analytického stroje ani výpočtu Bernoulliho čísel od Lovelaceové. Nic se neukládá.',
    locale: 'Čtení a ovládání domů jsou dostupné česky; ostatní obsah města může být anglicky.'
  }
};
