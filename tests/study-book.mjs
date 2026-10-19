import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {starter} from '../src/city-source-assets/home-tools/model.js';
import {buildInterior} from '../src/city-source-assets/home-tools/residence-interior-v1.js';
import {findStudyDesk,findReadingBook,buildZarathustraBook,arrangeStudyNotebook} from '../src/study-book.js';
const house=starter(),room=house.rooms.find(r=>r.id==='math'),source=buildInterior(house,room,T),desk=findStudyDesk(source.group),original=findReadingBook(desk);assert(desk&&original);const paint=[];
const undoNotebook=arrangeStudyNotebook(T,desk);let journal=null;desk.traverse(o=>{if(!journal&&o.userData.homeAction==='journal')journal=o;});while(journal.parent!==desk)journal=journal.parent;desk.updateMatrixWorld(true);const inverse=desk.matrixWorld.clone().invert(),journalBounds=new T.Box3();journal.traverse(o=>{if(o.isMesh){o.geometry.computeBoundingBox();journalBounds.union(o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)));}});assert(journalBounds.max.x<-.10,'Notebook has a clear gap beside the reading stand');assert(journalBounds.max.z<.325&&journalBounds.min.z>-.325,'Notebook remains supported by the desk');assert(journalBounds.min.y>=.787,'Notebook rests on the tabletop');undoNotebook();assert.equal(journal.position.x,0);assert.equal(journal.position.z,0);

const canvas=()=>({width:0,height:0,getContext:()=>({fillRect(){},strokeRect(){},measureText:s=>({width:s.length*15}),fillText:s=>paint.push(s)})});
const book=buildZarathustraBook(T,original.data,canvas);book.setLanguage('fa');assert(paint.some(s=>s.includes('زرتشت')),'The physical page carries the Persian title');book.setLanguage('de');assert(paint.some(s=>s.includes('Zarathustra')));book.setLanguage('en');
const bounds=new T.Box3().setFromObject(book.group);assert(bounds.min.y>.787&&bounds.max.y<1.02,'The reading stand rests on the tabletop and supports the inclined book');assert(bounds.min.x>-.75&&bounds.max.x<.75&&bounds.min.z>-.325&&bounds.max.z<.325,'The open pages fit on the desk');
assert(book.group.getObjectByName('Inclined open pages').rotation.x>.3,'Pages face the standing visitor');assert(book.group.getObjectByName('Table-supported reading stand'));
let panels=0;book.group.traverse(o=>{if(o.isMesh){panels++;assert.equal(o.userData.cityBook,'zarathustra');assert.equal(o.userData.bookInstanceId,original.data.bookInstanceId);assert.equal(o.userData.homeAction,'read');}});assert(panels>=6);
let sourceDisposals=0;desk.traverse(o=>o.geometry?.addEventListener('dispose',()=>sourceDisposals++));book.dispose();assert.equal(sourceDisposals,0,'Presentation owns only its own resources');assert.equal(book.group.children.length,0);
console.log('PASS: real study-desk identity, readable EN/DE/FA page textures, physical tabletop fit, preserved interaction IDs and owned resource disposal.');
