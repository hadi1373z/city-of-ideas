'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../src'),box={};box.window=box;vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'city-book.js'),'utf8'),box);
const en=box.CITY_BOOK,fa=JSON.parse(fs.readFileSync(path.join(root,'book-fa.json'),'utf8')),de=JSON.parse(fs.readFileSync(path.join(root,'book-de.json'),'utf8'));
for(const book of [fa,de]){
 assert.equal(book.chapters.length,81);
 book.chapters.forEach((c,i)=>{assert.equal(c.id,en.chapters[i].id);assert.equal(c.part,en.chapters[i].part);assert(c.title.trim());assert(c.paragraphs.length);assert(c.paragraphs.every(p=>typeof p==='string'&&p.trim()));});
}
fa.chapters.forEach((c,i)=>assert.equal(c.paragraphs.length,en.chapters[i].paragraphs.length));
assert.equal(fa.chapters.reduce((n,c)=>n+c.paragraphs.length,0),3466);
assert.equal(fa.editorialReview.paragraphs,39);assert.equal(fa.editorialReview.fullProfessionalReview,false);
assert.match(de.chapters[0].paragraphs.join(' '),/Als Zarathustra dreissig Jahr alt war/);
assert.match(fa.chapters[0].paragraphs[0],/سی‌ساله/);
vm.runInContext(fs.readFileSync(path.join(root,'public-de.js'),'utf8'),box);
for(const name of ['Cohen','Karp','Church'])assert.equal(box.CITY_PUBLIC_DE[name],name,'German UI must preserve mathematician names');
console.log('Book editions passed: all 81 stable chapter IDs, complete Persian paragraph coverage, original German opening and explicit draft provenance.');
