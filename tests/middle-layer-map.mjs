import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {middleMapPoint,middleLayerMapSvg,mountMiddleLayerMap} from '../src/middle-layer-map.js';
import {SIXFOLD_HOUSES,NETWORK_PASSAGES,houseToWorld} from '../src/sixfold-house-network-model.js';
import {GALLERY_TUNNEL} from '../src/world-cylinder-model.js';
import {ESCHER_DEPTH} from '../src/escher-depth-model.js';
const svg=middleLayerMapSvg(),pointList=a=>a.map(p=>middleMapPoint(...p).map(n=>n.toFixed(2)).join(',')).join(' ');
assert.equal(svg,middleLayerMapSvg());assert(!/NaN|undefined/.test(svg));
assert.deepEqual(middleMapPoint(0,0),[410,355]);assert(middleMapPoint(0,-10)[1]<355);assert(middleMapPoint(10,0)[0]>410);
assert.equal((svg.match(/data-house=/g)||[]).length,6);
for(const h of SIXFOLD_HOUSES){const polygon=Array.from({length:6},(_,i)=>{const p=houseToWorld(h,{x:125+23.45*Math.cos(i*Math.PI/3),z:23.45*Math.sin(i*Math.PI/3)});return[p.x,p.z];});assert(svg.includes(`data-house="${h.id}"`));assert(svg.includes(`points="${pointList(polygon)}"`));}
for(const p of NETWORK_PASSAGES)assert(svg.includes(`data-passage="${p.id}" points="${pointList([p.a,p.b])}"`));
assert(svg.includes(`data-gallery-tunnel="true" points="${pointList(GALLERY_TUNNEL.points)}"`));
for(const r of ESCHER_DEPTH.rooms)assert(svg.includes(`data-museum-room="${r.id}" points="${pointList(r.polygon)}"`));
for(const s of ESCHER_DEPTH.stairs)assert(svg.includes(`data-museum-stair="${s.id}"`));
assert(svg.includes("gallery −34 m")&&svg.includes('data-museum-well="loop"'));
assert(svg.includes('−8 to −24 m')&&svg.includes('−46 m')&&svg.includes('Basement −40 m'),'Different physical depths must not be presented as one floor');
class Node{constructor(tag){assert(/^[a-z][a-z-]*$/.test(tag));this.children=[];this.dataset={};this.attributes={};this.tagName=tag;}append(...children){this.children.push(...children);}setAttribute(k,v){this.attributes[k]=v;}}
const old=globalThis.document;globalThis.document={createElement:t=>new Node(t)};
try{const container=new Node('div'),calls=[],root=mountMiddleLayerMap(container,{onVisit:id=>calls.push(id)});assert.equal(container.children[0],root);assert.equal(root.lang,'en');assert.equal(root.dir,'ltr');const buttons=root.children[1].children;assert.equal(buttons.length,4);for(const b of buttons)b.onclick();assert.deepEqual(calls,['middle-basements','middle-babel','middle-escher','middle-section']);}finally{if(old)globalThis.document=old;else delete globalThis.document;}
const map=readFileSync(new URL('../src/coastal-map.js',import.meta.url),'utf8');assert(map.includes("state.layer=id;updateLayer()"));assert(map.includes('layout.hidden=route.hidden=below||atNight;middle.hidden=!below;night.hidden=!atNight'));
console.log('PASS middle-layer map: six exact house footprints, every real corridor and museum room, honest depth labels, fixed compass and existing visit actions');
