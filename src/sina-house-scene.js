import {SINA_VIEWS} from './sina-house-copy.js';
export function buildSinaStudy(T,{root,home,box,cylinder,ring,action}){
 const wood=0x71573e,ink=0x425c50;
 for(const x of[-8,8]){box(root,.58,.12,.58,x,.19,7.5,home.color);cylinder(root,.28,.12,x,3.65,7.5,home.color);box(root,.65,.08,.65,x,3.75,7.5,wood);}
 box(root,.04,1.8,3,9.8,2,-4,0xa5c6bd);for(const y of[1.1,2.9])box(root,.06,.06,3,9.77,y,-4,wood);for(const z of[-5.5,-2.5])box(root,.06,1.8,.06,9.77,2,z,wood);
 for(const z of[-5,-4,-3])for(const sy of[-1,1])for(const sz of[-1,1]){const bar=box(root,.04,Math.hypot(.5,.35),.035,9.74,2+sy*.25,z+sz*.175,home.color);bar.rotation.x=Math.atan2(-sz*.35,sy*.5);}
 const sheet=new T.Group();sheet.name='Ibn Sina outline and miniature';sheet.position.set(4.95,1.29,-6);root.add(sheet);action(box(sheet,1.7,.035,1.3,0,.0175,0,0xeee5cf),home,'reading');
 const outline=new T.Group();outline.name='Flat arch outline';outline.position.set(-.4,.035,0);sheet.add(outline);for(const x of[-.28,.28])box(outline,.11,.01,.5,x,.005,.1,ink);const drawnArc=ring(outline,.28,0,.006,-.15,ink,-Math.PI/2,Math.PI);drawnArc.scale.z=.09;
 const model=new T.Group();model.name='Optional arch miniature';model.position.set(.4,.035,0);sheet.add(model);box(model,.76,.05,.4,0,.025,0,wood);for(const x of[-.28,.28])box(model,.11,.5,.14,x,.3,0,wood);ring(model,.28,0,.55,0,wood,0,Math.PI);
 let view='outline';const exhibit={sheet,outline,model,get view(){return view;},setView(id){if(!SINA_VIEWS.includes(id))return false;view=id;model.visible=id==='model';return true;}};exhibit.setView(view);return exhibit;
}
