const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('src/i18n.js','utf8');
function boot(saved,denied=false){
 const data=new Map([['private-note','Keep this exact text']]);if(saved!==undefined)data.set('zarathustra-city-language',saved);
 let prompts=0;const document={documentElement:{},body:{dataset:{}},querySelector:s=>s==='#language-choice'?{showModal(){prompts++;},close(){}}:null,querySelectorAll:()=>[]},content={persian:{floors:[]},english:{floors:[]},setLanguage(lang){this.lang=lang;}};
 const scope={document,GALLERY_CONTENT:content,localStorage:{getItem:k=>{if(denied)throw Error('denied');return data.get(k)??null;},setItem:(k,v)=>{if(denied)throw Error('denied');data.set(k,v);}},CustomEvent:class{},dispatchEvent(){}};scope.window={GALLERY_CONTENT:content};vm.createContext(scope);vm.runInContext(source,scope);
 return {i18n:scope.window.CITY_I18N,document,data,content,prompts};
}
for(const [saved,want]of[[undefined,'en'],['','en'],['unknown','en'],['en','en'],['fa','fa'],['de','de']]){const run=boot(saved);assert.equal(run.i18n.lang,want);assert.equal(run.document.documentElement.lang,want);assert.equal(run.document.documentElement.dir,want==='fa'?'rtl':'ltr');assert.equal(run.content.lang,want);assert.equal(run.prompts,0);assert.equal(run.data.get('private-note'),'Keep this exact text');assert.equal(run.data.get('zarathustra-city-language'),saved);}
const denied=boot(undefined,true);assert.equal(denied.i18n.lang,'en');denied.i18n.set('fa');assert.equal(denied.i18n.lang,'fa');assert.equal(denied.document.documentElement.dir,'rtl');
const selected=boot();selected.i18n.set('de');assert.equal(selected.data.get('zarathustra-city-language'),'de');selected.i18n.set('en');assert.equal(selected.document.documentElement.dir,'ltr');
const html=fs.readFileSync('src/index.html','utf8');assert(html.includes('<html lang="en" dir="ltr">'));assert(/id="loading"[^>]*>[\s\S]*?<p>City of Ideas<\/p>/.test(html));assert(html.includes('id="overview" class="glass">City overview'));
console.log('PASS default English: fresh, invalid, denied storage; saved FA/DE preserved; explicit choices persist; no forced first-visit language modal; English initial shell');
