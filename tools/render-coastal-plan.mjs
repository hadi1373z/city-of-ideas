import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import {coastalPlanSvg} from '../src/coastal-city-plan.js';
const scope={window:{}};vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);
for(const lang of['en','de','fa'])writeFileSync(new URL('../src/assets/city-coast-'+lang+'.svg',import.meta.url),coastalPlanSvg(scope.window.ARTIST_QUARTER_PLAN,lang),'utf8');
console.log('Rendered EN, DE and FA plans with the gallery at the centre and the ocean to the east.');
