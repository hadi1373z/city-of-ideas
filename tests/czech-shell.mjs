import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const stored=new Map([['zarathustra-city-language','cs'],['private-notebook','Keep my exact wording.']]);
const doc={documentElement:{},body:{dataset:{}},querySelector:()=>null,querySelectorAll:()=>[]};
const ctx={document:doc,localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)},CustomEvent:class{},dispatchEvent(){},console};ctx.window=ctx;vm.createContext(ctx);
for(const file of ['content.js','public-de.js','public-cs.js','i18n.js'])vm.runInContext(fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8'),ctx);
assert.equal(ctx.CITY_I18N.lang,'cs');assert.equal(doc.documentElement.lang,'cs');assert.equal(doc.documentElement.dir,'ltr');assert.equal(ctx.CITY_I18N.t('overview'),'Přehled města');assert.equal(ctx.CITY_I18N.sign('گالری زرتشت'),'Zarathustrova galerie');
assert.equal(vm.runInContext('GALLERY_CONTENT.floors[0].title===GALLERY_CONTENT.english.floors[0].title',ctx),true,'Untranslated gallery content falls back to English');
for(const lang of ['fa','de','en','cs']){ctx.CITY_I18N.set(lang);assert.equal(ctx.CITY_I18N.lang,lang);assert.equal(doc.documentElement.dir,lang==='fa'?'rtl':'ltr');}
assert.equal(stored.get('private-notebook'),'Keep my exact wording.');assert.deepEqual([...stored.keys()].sort(),['private-notebook','zarathustra-city-language']);
console.log('PASS Czech shell selection, reload, English content fallback, four-language switching and private text preservation');

assert(fs.readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8').includes('houseFoundations?.interact()'),'Keyboard and controller share the existing interaction entry point');
