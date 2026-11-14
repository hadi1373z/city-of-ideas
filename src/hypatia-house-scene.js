import {HYPATIA_STAGES,HYPATIA_RADIUS,HYPATIA_POINTS,HYPATIA_CENTRES} from './hypatia-house-model.js';
export function buildHypatiaStudy(T,{root,home,box,cylinder,ring,block,action}){
 const wood=0x71573e,brass=0xb08a46;
 for(const x of[-8,8]){box(root,.58,.12,.58,x,.19,-8,home.color);cylinder(root,.3,.1,x,4.5,-8,home.color);const beam=box(root,.12,.12,Math.hypot(8-7/Math.SQRT2,8-7/Math.SQRT2),x/2+Math.sign(x)*7/Math.SQRT2/2,4.55,(-8-7/Math.SQRT2)/2,wood);beam.rotation.y=-Math.sign(x)*Math.PI/4;}
 for(let i=0;i<24;i++){const angle=i*Math.PI/12,tick=box(root,.045,.045,i%3===0?.3:.16,7*Math.sin(angle),4.6,7*Math.cos(angle),brass);tick.rotation.y=angle;}
 const table=new T.Group();table.name='Hypatia drafting table';root.add(table);box(table,3.6,.14,2.8,4.2,1,-1.8,wood);for(const x of[2.75,5.65])for(const z of[-2.95,-.65])box(table,.12,.8,.12,x,.53,z,wood);block(home,4.2,-1.8,3.6,2.8);
 action(box(table,3.1,.035,2.5,4.2,1.09,-1.8,0xeee5cf),home,'reading');
 const drawing=new T.Group();drawing.name='Hypatia two-circle construction';drawing.position.set(4.2,1.16,-1.8);table.add(drawing);
 const circles=HYPATIA_CENTRES.map((c,i)=>ring(drawing,HYPATIA_RADIUS,c.x,0,c.z,i?0x597e86:brass,Math.PI/2));
 const centres=HYPATIA_CENTRES.map(c=>cylinder(drawing,.035,.035,c.x,.02,c.z,0x344248));
 for(const p of HYPATIA_POINTS.slice(0,2))cylinder(drawing,.06,.08,p.x,.025,p.z,0x344248);
 const evidence=new T.Group();evidence.name='Hypatia third point and equal radii';drawing.add(evidence);const c=HYPATIA_POINTS[2];cylinder(evidence,.06,.08,c.x,.025,c.z,0x344248);
 for(const p of HYPATIA_POINTS){const centre=HYPATIA_CENTRES[0],dx=p.x-centre.x,dz=p.z-centre.z,line=box(evidence,.018,.02,Math.hypot(dx,dz),(p.x+centre.x)/2,.015,(p.z+centre.z)/2,brass);line.rotation.y=Math.atan2(dx,dz);}
 for(const side of[-1,1]){const arm=box(table,.025,.035,.65,5.45+side*.11,1.145,-.95,brass);arm.rotation.y=side*.35;}cylinder(table,.05,.06,5.45,1.16,-.64,brass);const roll=cylinder(table,.075,.65,5.4,1.18,-2.75,0xd5c8a7);roll.rotation.z=Math.PI/2;
 let stage='two';const exhibit={table,drawing,circles,centres,evidence,get stage(){return stage;},setStage(id){if(!HYPATIA_STAGES.includes(id))return false;stage=id;circles[1].visible=centres[1].visible=id==='two';evidence.visible=id==='third';return true;}};exhibit.setStage(stage);return exhibit;
}
