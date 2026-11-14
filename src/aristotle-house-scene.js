import {ARISTOTLE_CASES} from './aristotle-house-copy.js';
export function buildAristotlePorch(T,{root,home,box,cylinder,block,action}) {
 // Plinths fit within the existing column footprints; collars are overhead.
 for(const z of[-8,-4,0,4,8]){box(root,.58,.12,.58,-8.3,.19,z,home.color);cylinder(root,.32,.1,-8.3,3.38,z,home.color);}
 const table=new T.Group();table.name='Aristotle discussion table';root.add(table);
 box(table,3.8,.14,2.2,4.2,1,-1.8,0x71573e);for(const x of[2.65,5.75])for(const z of[-2.65,-.95])box(table,.12,.8,.12,x,.53,z,0x71573e);block(home,4.2,-1.8,3.8,2.2);
 const cards=[],clips=[];
 for(const [i,id]of ARISTOTLE_CASES.entries()){
  const x=3+i*1.2,card=new T.Group();card.name='Aristotle case · '+id;card.position.set(x,1.1,-1.8);table.add(card);cards.push(card);
  action(box(card,1,.04,1.1,0,0,0,0xf2e6ca),home,'reading');clips.push(box(card,1,.04,.07,0,.035,.63,0xd3ad60));
 }
 for(const x of[-.24,.24])box(cards[0],.055,.45,.07,x,.25,0,0x71573e);box(cards[0],.53,.055,.07,0,.5,0,0x71573e);
 for(const side of[-1,1]){box(cards[1],.2,.08,.2,0,.06,side*.26,0x71573e);box(cards[1],.28,.06,.25,0,.13,side*.26,0x71573e);box(cards[1],.28,.22,.05,0,.23,side*.36,home.color);}
 box(cards[2],.85,.04,.7,0,.04,0,0x71573e);
 for(const side of[-1,1]){const page=box(cards[2],.39,.035,.65,side*.2,.07,0,0xe2dcc5);page.rotation.z=side*.08;for(let row=0;row<3;row++)box(cards[2],.28,.012,.02,side*.2,.105,-.2+row*.16,0x526a59);}
 let caseId='discussion';const exhibit={table,cards,clips,get caseId(){return caseId;},selectCase(id){if(!ARISTOTLE_CASES.includes(id))return false;caseId=id;clips.forEach((clip,i)=>clip.visible=ARISTOTLE_CASES[i]===id);return true;}};exhibit.selectCase(caseId);return exhibit;
}
