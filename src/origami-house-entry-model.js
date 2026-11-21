import {miura} from './origami-house-math.js?v=six-gate-city-20261121';

// The entrance is the same rigid-panel construction taught at the main desk.
// Real pleated paper geometry gives the small house an identifiable threshold.
export const ORIGAMI_ENTRY=Object.freeze({tilt:35,y:3.55,z:9.55,thickness:.07});
export function origamiEntrySheet(){return miura(ORIGAMI_ENTRY.tilt,{a:1.25,b:1.7,columns:4,rows:2});}
export function origamiEntryPosts(){const m=origamiEntrySheet();return[-1,1].map(side=>({x:side*m.width/2,z:ORIGAMI_ENTRY.z+m.vertices.at(-1)[2],radius:.09}));}
export function origamiHouseOutline(x,z){const m=origamiEntrySheet(),w=m.width/2+.15,front=ORIGAMI_ENTRY.z+m.length/2+.1;return[[-9,-8],[9,-8],[9,8],[w,8],[w,front],[-w,front],[-w,8],[-9,8]].map(([a,b])=>[x+a,z+b]);}
