import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {starter} from '../src/city-source-assets/home-tools/model.js';
import {buildInterior} from '../src/city-source-assets/home-tools/home-interior.js';
import {buildInterior as residenceInterior} from '../src/city-source-assets/home-tools/residence-interior-v1.js';
import {canOccupy} from '../src/city-source-assets/home-tools/navigation.js';
for(const build of [buildInterior,residenceInterior]){
 const house=starter(),room=house.rooms.find(r=>r.id==='math'),built=build(house,room,T),desk=built.group.getObjectByName('home-desk');
 assert(desk,'The study retains a real desk');
 const aisle=desk.userData.approach;assert(aisle,'The desk reserves a standing approach');
 const goal={x:(aisle.minX+aisle.maxX)/2,z:(aisle.minZ+aisle.maxZ)/2};
 assert(canOccupy(built.obstacles,goal.x,goal.z,.22),'A person fits at the desk');
 // Flood-fill through real furniture footprints from the preserved room centre.
 const step=.1,left=room.x-10,top=room.y-8,key=(x,z)=>x+':'+z,queue=[[Math.round(room.w/2/step),Math.round(room.h/2/step)]],seen=new Set();let reached=false;
 for(let i=0;i<queue.length;i++){const [ix,iz]=queue[i],id=key(ix,iz);if(seen.has(id))continue;seen.add(id);const x=left+ix*step,z=top+iz*step;if(x<left+.22||x>left+room.w-.22||z<top+.22||z>top+room.h-.22||!canOccupy(built.obstacles,x,z,.22))continue;if(Math.hypot(x-goal.x,z-goal.z)<.15){reached=true;break;}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([ix+dx,iz+dz]);}
 assert(reached,'The desk approach connects to the room centre without crossing furniture');
 const questionRoom=house.rooms.find(r=>r.id==='questions'),dialogue=build(house,questionRoom,T);assert(dialogue.group.getObjectByName('home-dialogue'),'The question room contains a shared dialogue table');assert(dialogue.interactions.filter(a=>a.homeAction==='sit').length>=2,'Both dialogue seats are usable');
 for(const item of [built,dialogue])item.group.traverse(o=>{o.geometry?.dispose();});
}
console.log('PASS: desk approaches fit a visitor and connect to the room centre; both dialogue seats have usable anchors in both home editions.');
