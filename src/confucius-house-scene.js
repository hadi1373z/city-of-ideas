import {CONFUCIUS_STEPS} from './confucius-house-copy.js';
export function buildConfuciusCourtyard(T,{root,home,box,cylinder,action}){
 const wood=0x71573e;
 for(const x of[-7.5,7.5]){box(root,.46,.12,.46,x,.19,7.5,home.color);cylinder(root,.22,.12,x,3.68,7.5,home.color);box(root,.14,.14,2.5,x,3.8,8.75,wood);const brace=box(root,.12,Math.hypot(.65,.7),.12,x,3.425,7.85,wood);brace.rotation.x=Math.atan2(.7,.65);}
 for(const z of[-10,10])for(const x of[-9,-6,-3,0,3,6,9])box(root,.12,.1,2.1,x,4.36,z,wood);
 for(const x of[-5.65,-4.35]){for(const dx of[-.25,.25])for(const dz of[-.24,.24])box(root,.055,.27,.055,x+dx,.965,-2+dz,wood);box(root,.65,.06,.65,x,1.23,-2,0xd4bf90);for(const dx of[-.23,.23])box(root,.035,.6,.03,x+dx,1.62,-2.29,wood);box(root,.75,.06,.12,x,1.99,-2.35,wood);}
 for(const y of[.9,2.6])box(root,3.4,.1,.08,4.2,y,-10.78,wood);for(const x of[2.5,5.9])box(root,.1,1.8,.08,x,1.75,-10.78,wood);for(const x of[3.1,3.65,4.2,4.75,5.3])box(root,.045,1.6,.06,x,1.75,-10.75,home.color);for(const y of[1.3,1.75,2.2])box(root,3.2,.045,.06,4.2,y,-10.75,home.color);
 const folio=new T.Group();folio.name='Confucius learning folio';folio.position.set(5.1,1.29,-6);root.add(folio);
 for(let i=0;i<7;i++)action(box(folio,.13,.06,1.1,-.45+i*.15,.03,0,0xd1b17c),home,'reading');for(const z of[-.38,.38])box(folio,1.08,.025,.025,0,.074,z,wood);
 const leaves=[],markers=[];
 for(const [i,id]of CONFUCIUS_STEPS.entries()){const leaf=new T.Group();leaf.name='Learning leaf · '+id;folio.add(leaf);leaves.push(leaf);box(leaf,.85,.015,.65,0,.09,0,0xeee5cf);for(let row=0;row<i+2;row++)box(leaf,.35+(row%2)*.18,.008,.022,-.08,.104,-.19+row*.12,0x425c50);markers.push(box(folio,.12,.025,.08,-.3+i*.3,.09,.48,home.color));}
 let step='notice';const exhibit={folio,leaves,markers,get step(){return step;},setStep(id){if(!CONFUCIUS_STEPS.includes(id))return false;step=id;leaves.forEach((leaf,i)=>leaf.visible=markers[i].visible=CONFUCIUS_STEPS[i]===id);return true;}};exhibit.setStep(step);return exhibit;
}
