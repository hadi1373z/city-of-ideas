// One source of truth for the real Jungian quarter, its map and its public lanes.
export const ARCHETYPES_QUARTER=Object.freeze({id:'archetypes-quarter',x:-318.6973486,z:276,radius:55,courtRadius:16,groundY:.13,names:{en:'Archetypes quarter',de:'Viertel der Archetypen',fa:'محلهٔ کهن‌الگوها'}});
export const ARCHETYPE_HOUSES=Object.freeze([
 {id:'persona',name:'House of Masks',conceptName:'Persona',names:{en:'Masks · Persona',de:'Masken · Persona',fa:'نقاب‌ها · پرسونا'},dx:0,dz:-31,turn:0,wall:0xe4d7b7,roof:0x547f7b,accent:0x9b674e,style:'gable'},
 {id:'shadow',name:'House of Encounter',conceptName:'Shadow',names:{en:'Encounter · Shadow',de:'Begegnung · Schatten',fa:'رویارویی · سایه'},dx:31,dz:0,turn:-Math.PI/2,wall:0xd6c7b2,roof:0x665c77,accent:0x887257,style:'paired'},
 {id:'trickster',name:'House of Crossroads',conceptName:'Trickster',names:{en:'Crossroads · Trickster',de:'Kreuzwege · Trickster',fa:'چهارراه · ترفندباز'},dx:0,dz:31,turn:Math.PI,wall:0xe6d6ac,roof:0x9b6b4d,accent:0x5c807b,style:'lyre'},
 {id:'transformation',name:'House of Seven Gates',conceptName:'Transformation',names:{en:'Seven Gates · Transformation',de:'Sieben Tore · Wandlung',fa:'هفت دروازه · دگرگونی'},dx:-31,dz:0,turn:Math.PI/2,wall:0xd7d2bd,roof:0x657b87,accent:0xad8250,style:'steps'}
].map(h=>Object.freeze({...h,x:ARCHETYPES_QUARTER.x+h.dx,z:ARCHETYPES_QUARTER.z+h.dz,width:18,depth:18,wallHeight:4.8,doorWidth:3.2,doorHeight:3.5})));
export function archetypeWorld(h,x,z){return{x:h.x+x*Math.cos(h.turn)+z*Math.sin(h.turn),z:h.z-x*Math.sin(h.turn)+z*Math.cos(h.turn)};}
export function archetypeLocal(h,x,z){const dx=x-h.x,dz=z-h.z;return{x:dx*Math.cos(h.turn)-dz*Math.sin(h.turn),z:dx*Math.sin(h.turn)+dz*Math.cos(h.turn)};}
export const archetypeHouse=id=>ARCHETYPE_HOUSES.find(h=>h.id===id);
export function archetypeEntry(h,inside=false){return{...archetypeWorld(h,0,inside?5.8:13),y:.13,yaw:h.turn+Math.PI,pitch:inside?-.04:0};}
export function archetypeInside(h,x,z){const p=archetypeLocal(h,x,z);return Math.abs(p.x)<8.7&&Math.abs(p.z)<8.7;}
export const ARCHETYPE_FOOTPRINTS=Object.freeze(ARCHETYPE_HOUSES.map(h=>Object.freeze({id:h.id,x:h.x,z:h.z,width:19.2,depth:22,turn:h.turn,polygon:[[-9.6,-9.6],[9.6,-9.6],[9.6,12.4],[-9.6,12.4]].map(([x,z])=>{const p=archetypeWorld(h,x,z);return[p.x,p.z];})})));
// Court spokes are level paths, with a clear two metre central axis in each house.
export const ARCHETYPE_PATHS=Object.freeze(ARCHETYPE_HOUSES.map(h=>Object.freeze({id:'archetype-'+h.id,width:3.4,points:[[ARCHETYPES_QUARTER.x,ARCHETYPES_QUARTER.z],...[[0,13],[0,9],[0,5.8]].map(([x,z])=>{const p=archetypeWorld(h,x,z);return[p.x,p.z];})]})));
export const ARCHETYPE_CONNECTOR=Object.freeze({id:'archetypes-quarter-spur',width:3.4,points:[[0,0],[22,22],[22,58],[0,92]].map(([x,z])=>[ARCHETYPES_QUARTER.x+x,ARCHETYPES_QUARTER.z+z])});
export function archetypeObstacles(){return[
 {id:'back-wall',x:0,z:-9,w:18,d:.28,minY:0,maxY:4.8},
 ...[-9,9].map(x=>({id:'side-wall',x,z:0,w:.28,d:18,minY:0,maxY:4.8})),
 ...[-5.3,5.3].map(x=>({id:'front-wall',x,z:9,w:7.4,d:.28,minY:0,maxY:4.8})),
 ...[-6.9,6.9].map(x=>({id:'porch-column',x,z:11.1,w:.34,d:.34,minY:0,maxY:4.8})),
 {id:'study-object',x:3.9,z:-2.5,w:3.4,d:3.4,minY:0,maxY:3.5},
 {id:'reading-bench',x:-5.4,z:-2,w:1.1,d:4.2,minY:0,maxY:1.05}
 ];}
export function archetypeCanStand(h,x,z,{radius=.23,feet=.13,height=1.85}={}){if(!Number.isFinite(x)||!Number.isFinite(z))return false;const p=archetypeLocal(h,x,z),y=feet-.13;return!archetypeObstacles().some(b=>y<b.maxY&&y+height>b.minY&&Math.abs(p.x-b.x)<b.w/2+radius&&Math.abs(p.z-b.z)<b.d/2+radius);}
export function archetypeInteractionAllowed(h,player,{mode='city',eye=1.7,modal=false,range=10.5}={}){if(!h||mode!=='city'||modal||!player||!Number.isFinite(player.y)||Math.abs(player.y-eye-.13)>.32||!archetypeInside(h,player.x,player.z))return false;const p=archetypeLocal(h,player.x,player.z);return Math.hypot(p.x-1.4,p.z+3.5)<=range;}
export function createArchetypeState(){return Object.fromEntries(ARCHETYPE_HOUSES.map(h=>[h.id,{stage:0}]));}
export function setArchetypeStage(state,id,stage){if(!archetypeHouse(id)||!Number.isInteger(stage)||stage<0||stage>2)return false;state[id].stage=stage;return true;}
