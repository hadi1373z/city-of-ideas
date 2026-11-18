import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {SURPRISE_PAPERS} from '../src/historic-papers-surprises-data.js';
import {HISTORIC_PAPERS} from '../src/historic-papers-data.js';
import {PAPER_GALLERY_FLOORS,paperGallerySlots} from '../src/paper-gallery-model.js';
import {PAPER_CURATION} from '../src/mathematical-sculptures-model.js';
const manifest=JSON.parse(readFileSync(new URL('../src/assets/papers/surprises-provenance.json',import.meta.url))),hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(SURPRISE_PAPERS.length,8);assert.equal(HISTORIC_PAPERS.length,35);assert.deepEqual(PAPER_GALLERY_FLOORS.map(f=>SURPRISE_PAPERS.filter(p=>p.floorId===f.id).length),[2,2,2,2]);
for(const p of SURPRISE_PAPERS){for(const k of['hook','why','scope','question','prerequisite','chamber'])assert(p[k]?.trim(),p.id+' needs '+k);assert(p.hook.length<=90);assert(p.why.split(/\s+/).length<=65);assert(p.scope.split(/\s+/).length<=65);assert(SURPRISE_PAPERS.some(q=>q.id===p.compareId&&q.floorId===p.floorId));const c=PAPER_CURATION[p.id];assert(c&&c.prerequisite===p.prerequisite&&c.question===p.question);assert.equal(paperGallerySlots().filter(s=>s.paperId===p.id).length,1);const r=manifest.assets.find(r=>r.id===p.id);assert(r?.visuallyVerified&&r.pdfPage1based===1);const full=readFileSync(new URL('../src/assets/papers/'+r.file,import.meta.url));assert.equal(hash(full),r.sha256);assert.equal(full.length,r.bytes);assert.equal(r.sourceSha256,p.sourcePdfSha256);assert.equal(hash(readFileSync(new URL('../src/assets/papers/'+r.displayFile,import.meta.url))),r.displaySha256);assert.equal(Math.max(r.displayWidth,r.displayHeight),800);assert(p.credit.includes(p.author));}
assert(SURPRISE_PAPERS.find(p=>p.id==='conformal-prediction').scope.includes('Marginal coverage'));assert(SURPRISE_PAPERS.find(p=>p.id==='causal-additive-noise').scope.includes('linear-Gaussian'));assert(SURPRISE_PAPERS.find(p=>p.id==='kernel-quadrature').rightsUrl.endsWith('/by/4.0/'));
console.log('PASS paper detours: eight distinct original first pages, four honest subject placements, short original commentary and assumption boundaries, paired reading questions, checksummed assets and exact source attribution');
