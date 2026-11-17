import {writeFileSync} from 'node:fs';
import {makeHoneycombCity} from '../src/honeycomb-city-model.js';
import {honeycombInputs} from '../src/city-urban-plan-model.js';
const {clear,contains,...plan}=makeHoneycombCity(honeycombInputs());
writeFileSync(new URL('../src/honeycomb-city-layout.js',import.meta.url),'// Generated from public source house placements by tools/render-honeycomb-layout.mjs.\n// Do not calculate this graph on a visitor\'s loading path.\nexport const BUILT_HONEYCOMB_LAYOUT='+JSON.stringify(plan)+';\n','utf8');
console.log(JSON.stringify({cells:plan.cells.length,courts:plan.nodes.length,edges:plan.edges.length,connected:plan.connected,paths:plan.roads.length,walls:plan.walls.length}));
