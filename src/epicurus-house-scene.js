import {EPICURUS_SETTINGS} from './epicurus-house-copy.js';
export function buildEpicurusGarden(T,{root,home,box,cylinder,ring,block,action}){
 const wood=0x71573e,linen=0xe2d5b3,clay=0xa8c5bc;
 // The original pergola posts and their walking footprints remain unchanged.
 for(const x of[-7.5,7.5])for(const z of[-6,6]){box(root,.46,.12,.46,x,.19,z,home.color);cylinder(root,.22,.12,x,3.48,z,home.color);}
 for(const x of[-7.5,7.5]){box(root,.11,.12,12.4,x,3.52,0,wood);for(const z of[-4.5,-2.25,0,2.25,4.5]){cylinder(root,.025,.95,x,3.03,z,wood);for(const side of[-1,1]){const leaf=box(root,.35,.045,.18,x+side*.15,3.05+side*.12,z,home.color);leaf.rotation.z=side*.3;leaf.rotation.y=side*.45;}}}
 const bench=new T.Group();bench.name='Epicurus garden bench';root.add(bench);
 for(const x of[-8.95,-8.65,-8.35])box(bench,.26,.1,3.6,x,.68,.5,wood);
 for(const z of[-1,2]){for(const x of[-8.95,-8.35])box(bench,.12,.5,.16,x,.38,z,wood);box(bench,.12,.75,.12,-9.15,1.05,z,wood);}
 for(const y of[1.05,1.35])box(bench,.1,.15,3.8,-9.15,y,.5,wood);box(bench,.8,.08,1.1,-8.65,.77,.5,home.color);block(home,-8.65,.5,1.14,3.8);
 // Support the existing raised tabletop without moving any original mesh.
 cylinder(root,.1,.72,-5,1.19,-2,wood);for(const y of[.86,1.52])cylinder(root,.25,.06,-5,y,-2,home.color);
 action(box(root,1.6,.008,1.05,-5,1.654,-2,linen),home,'reading');
 for(const x of[-5.72,-4.28])box(root,.035,.01,1,x,1.66,-2,home.color);
 for(const z of[-2.45,-1.55])box(root,1.5,.01,.035,-5,1.66,z,home.color);
 for(let i=0;i<6;i++)box(root,1.35,.003,.012,-5,1.66,-2.36+i*.14,0xc6b894);
 for(let i=0;i<8;i++)box(root,.012,.003,.85,-5.6+i*.17,1.662,-2,0xd1c49f);
 for(const x of[-5.5,-5.3]){const score=box(root,.035,.008,.27,x,1.784,-2,0x947348);score.rotation.y=.35;}
 ring(root,.19,-4.5,2.16,-2,clay,Math.PI/2);cylinder(root,.135,.008,-4.5,2.156,-2,0x668f96);ring(root,.11,-4.25,1.94,-2,clay);
 const guest=new T.Group();guest.name='Epicurus optional guest setting';root.add(guest);
 cylinder(guest,.29,.04,-5.4,1.68,-1.3,linen);cylinder(guest,.19,.07,-5.4,1.735,-1.3,0xcaa468);
 cylinder(guest,.17,.35,-4.5,1.825,-1.3,clay);ring(guest,.16,-4.5,2.01,-1.3,clay,Math.PI/2);cylinder(guest,.11,.008,-4.5,2.008,-1.3,0x668f96);ring(guest,.09,-4.28,1.83,-1.3,clay);
 let setting='pause';const exhibit={bench,guest,get setting(){return setting;},setSetting(id){if(!EPICURUS_SETTINGS.includes(id))return false;setting=id;guest.visible=id==='invitation';return true;}};exhibit.setSetting(setting);return exhibit;
}
