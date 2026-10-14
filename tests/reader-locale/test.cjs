'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = __dirname;
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'fixed-inventory.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const source = fs.readFileSync(path.resolve(root, '../../src/city-source-assets/park-tools/reader-public-fa.js'), 'utf8');
const sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
assert.equal(sha(source), manifest.dictionarySHA256);
assert.equal(sha(fs.readFileSync(path.join(root, 'fixed-inventory.json'))), manifest.inventorySHA256);
const window = { CITY_PARK_READER_FA: { 'Prior public entry': 'متنِ عمومیِ قبلی' } };
vm.runInNewContext(source, { window });
const dictionary = window.CITY_PARK_READER_FA;
assert(Object.isFrozen(dictionary));
assert.equal(Object.keys(dictionary).length, 953);
assert.equal(dictionary['Prior public entry'], 'متنِ عمومیِ قبلی');
for (const key of inventory.strings) assert.equal(typeof dictionary[key], 'string');
const unchanged = inventory.strings.filter(key => dictionary[key] === key);
assert.deepEqual(unchanged.sort(), manifest.unchangedPublicTokens.slice().sort());
// Key mathematical expressions and source identifiers must remain literal, not transliterated.
const expressions = {
  6: ['Σgᵢfᵢ=1', '0=1'], 8: ['xᵢ²−xᵢ=0','x∨y∨¬z','(1−x)(1−y)z=0'],
  24: ['D(M)','M(M)'], 28: ['G(n,1/2)','2^{1−C(k,2)}','C(n,k)'],
  34: ['−log₂p'], 46: ['x=0','x²=0','k[x]/(x²)'], 48: ['Spec(A)','Spec(Z)'],
  50: ['X=Spec(A)','A→R'], 54: ['NP'], 56: ['(G,k)','(Ḡ,n−k)'], 58: ['P=NP'],
  60: ['ep(d+1)≤1'], 62: ['⟨J,X⟩','tr(X)=1','X⪰0','Xᵢⱼ=0','α(G)≤ϑ(G)'],
  68: ['VP','VNP'], 72: ['1−x','xy','x+y−xy'], 74: ['x=0','x=1'],
  84: ['G₀','G₁'], 90: ['MIP=NEXP'], 92: ['AND','OR','NOT'], 94: ['MOD-p','Fₚ'],
  100: ['O(S log R)'], 106: ['BPP','O(log n)'], 110: ['P/poly'],
  112: ['SAT','∀y∃z R(x,y,z)','R(x,y,C(y))'], 114: ['Π₂ᴾ','Σ₂ᴾ','PH'],
  116: ['Zᵈ','n^{−d/2}'], 118: ['(a₁⁴+a₂²+2a₄)/4','aᵢ=2'],
  134: ['7m/8'], 136: ['MAX-E3SAT','MAX-E3LIN'], 138: ['f(x)=xᵢ'],
  140: ['xᵥ=π(xᵤ)'], 142: ['1−ε','δ'], 144: ['MAX-CUT','UGC'],
  146: ['χS(x)=∏ᵢ∈Sxᵢ','{−1,1}ⁿ'], 148: ['ΣSρ^{|S|}f̂(S)²','|ρ|<1','ΣS∋ᵢf̂(S)²'],
  152: ['Σwᵢⱼ(1−xᵢxⱼ)/2','SDP'], 154: ['⟨g,vᵢ⟩','θ/π','(1−cosθ)/2'],
  156: ['αGW'], 164: ['2d','Ẽ'], 166: ['xᵅ','Mᵅᵝ=Ẽ[xᵅ⁺ᵝ]','Ẽ[p²]≥0'],
  168: ['n^{O(d)}'], 178: ['NL'], 182: ['NL','P'], 186: ['FO'],
  194: ['FO','CSP'], 242: ['src/catalogue.json'], 579: ['hadi1373z/atlas-of-ideas'],
  835: ['http','https'], 913: ['WASD','E']
};
for (const [index, literals] of Object.entries(expressions)) for (const literal of literals) {
  assert(inventory.strings[index].includes(literal), `Fixture is not a source literal at ${index}: ${literal}`);
  assert(dictionary[inventory.strings[index]].includes(literal), `Changed source literal at ${index}: ${literal}`);
}
// Exercise the real matcher with public/private/formula fixtures and an EN→FA→EN round trip.
const languagePath = path.resolve(root, '../../src/city-source-assets/park-tools/language.js');
if (languagePath) {
  const textNodes = [], elements = [];
  function fixture(text, opts = {}) {
    const attrs = { ...(opts.attrs || {}) };
    const element = { tagName: opts.tag || 'P', innerHTML: text,
      closest(selector) {
        if (opts.private && selector.includes('[data-city-private]')) return this;
        if (this.tagName === 'TEXTAREA' && selector.includes('textarea')) return this;
        if (opts.formula && (selector.includes('.formula') || selector.includes('[role="math"]'))) return this;
        if (Object.hasOwn(attrs, 'data-city-public-key') && selector.includes('[data-city-public-key]')) return this;
        return null;
      }, hasAttribute: name => Object.hasOwn(attrs, name), getAttribute: name => attrs[name],
      setAttribute: (name, value) => { attrs[name] = value; }
    };
    const node = { nodeType: 3, nodeValue: text, parentElement: element };
    textNodes.push(node); elements.push(element);
    return { element, node, attrs };
  }
  const publicText = fixture('My shelf');
  const paragraph = fixture(inventory.strings[4], { attrs: { 'data-city-public-key': inventory.strings[4] } });
  const privateText = fixture('My shelf', { private: true });
  const textarea = fixture('My shelf', { tag: 'TEXTAREA', attrs: { placeholder: 'A question worth keeping' } });
  const formula = fixture('xᵢ²−xᵢ=0', { formula: true });
  const doc = { readyState: 'loading', documentElement: { lang: 'en', dir: 'ltr' }, body: { dataset: {} },
    addEventListener() {}, dispatchEvent() {}, querySelectorAll: selector => selector === '*' ? elements : [],
    createTreeWalker() { let i = 0; return { nextNode: () => textNodes[i++] || null }; }
  };
  const context = { window: { ...window, document: doc, location: { search: '', origin: 'https://example.test' }, addEventListener() {} },
    URLSearchParams, WeakMap, NodeFilter: { SHOW_TEXT: 4 }, clearTimeout() {}, setTimeout() { return 1; },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  };
  vm.runInNewContext(fs.readFileSync(languagePath, 'utf8'), context);
  const language = context.window.CITY_PARK_LANGUAGE;
  assert.equal(language.coverage().reader, 953);
  for (const key of inventory.strings) {
    assert.equal(language.translate(key, 'fa').trim(), dictionary[key]);
    assert.equal(language.translate(key, 'en'), key);
  }
  language.setLanguage('fa');
  assert.equal(publicText.node.nodeValue, dictionary['My shelf']);
  assert.equal(paragraph.element.innerHTML, dictionary[inventory.strings[4]]);
  assert.equal(privateText.node.nodeValue, 'My shelf');
  assert.equal(textarea.node.nodeValue, 'My shelf');
  assert.equal(textarea.attrs.placeholder, dictionary['A question worth keeping']);
  assert.equal(formula.node.nodeValue, 'xᵢ²−xᵢ=0');
  language.setLanguage('en');
  assert.equal(publicText.node.nodeValue, 'My shelf');
  assert.equal(paragraph.element.innerHTML, inventory.strings[4]);
  assert.equal(privateText.node.nodeValue, 'My shelf');
  assert.equal(textarea.node.nodeValue, 'My shelf');
  assert.equal(textarea.attrs.placeholder, 'A question worth keeping');
  assert.equal(doc.documentElement.dir, 'ltr');
}
console.log(JSON.stringify({ status: 'PASS', inventoryKeys: 952, unchangedTechnicalTokens: unchanged.length,
  sourceLiteralGroups: Object.keys(expressions).length, matcherTested: Boolean(languagePath),
  privateFixturesUnchanged: Boolean(languagePath), dictionarySHA256: manifest.dictionarySHA256 }));
