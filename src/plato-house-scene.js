import {PLATO_POSES,platoAngle} from './plato-house-model.js';
export function buildPlatoComparison(T,{root,home,box,cylinder,ring,block,action}) {
  const stand=new T.Group();stand.name='Plato comparison stand';root.add(stand);
  box(stand,3.4,.18,2.2,4,.22,-1.8,0x71573e);cylinder(stand,.12,1.0,4,.8,-1.8,0xd3ad60);
  const model=action(ring(stand,1,4,2.25,-1.8,0xd3ad60),home,'reading');model.name='Separate turning model circle';block(home,4,-1.8,3.4,2.2);
  box(root,3.4,.2,1.1,-5,.6,6,0x71573e);for(const x of[-6.3,-3.7])box(root,.15,.5,.8,x,.3,6,0x71573e);box(root,3.1,.08,.9,-5,.74,6,0x8d9d86);block(home,-5,6,3.4,1.1);
  // A small divider and rolled paper sit beside the existing interactive book.
  const tools=new T.Group();tools.name='Plato drawing tools';tools.position.set(5.1,1.29,-6);root.add(tools);
  for(const side of[-1,1]){const leg=box(tools,.035,.035,.72,side*.11,.05,0,0xd3ad60);leg.rotation.y=side*.32;}
  const roll=cylinder(tools,.1,.7,.5,.12,0,0xf2e6ca);roll.rotation.z=Math.PI/2;
  let pose='front';return {stand,model,tools,get pose(){return pose;},setPose(id){if(!PLATO_POSES.includes(id))return false;model.rotation.y=platoAngle(id);pose=id;return true;}};
}
