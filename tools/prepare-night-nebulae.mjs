// Primary-source metadata only. No generated image, cookie or source bypass.
import fs from 'node:fs/promises';
import {NEBULAE} from '../src/night-nebulae-data.js';
const destination=new URL('../src/assets/night-nebulae/',import.meta.url);await fs.mkdir(destination,{recursive:true});
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#8217;/g,'’').replace(/\s+/g,' ').trim();const records=[];
for(const n of NEBULAE){const response=await fetch(n.source),text=await response.text(),tags=text.match(/<meta\b[^>]+>/g)||[],og=tags.find(t=>/property=["']og:image["']/.test(t)),image=og?.match(/content=["']([^"']+)/)?.[1]?.replaceAll('&amp;','&')||null,credits=[...text.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)].map(m=>strip(m[1])).filter(Boolean);records.push({id:n.id,source:n.source,http_status:response.status,checked_on:'2026-11-21',image_url:image,caption_candidates:credits.slice(0,3),metadata_only:true});console.log(n.id,response.status,image,JSON.stringify(credits.slice(0,2)).slice(0,450));if(!response.ok){console.log('Stopped after source error; no retry.');break;}await new Promise(r=>setTimeout(r,700));}
await fs.writeFile(new URL('source-audit.json',destination),JSON.stringify(records,null,2)+'\n');
