import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {ESCHER_DEPTH as D,canWalkDepth,roomCeilingAt,insidePolygon} from '../src/escher-depth-model.js';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),m=buildEscherDepth(T,{canvas,loadTexture:null}),s=buildEscherDescent(T),root=new T.Group();root.add(m.interior,s.group);root.updateMatrixWorld(true);
const probes=[],ray=new T.Raycaster();for(const r of [...D.rooms,...D.galleries].filter(r=>r.radius||r.corridor))for(let x=Math.ceil(r.minX);x<r.maxX;x+=5)for(let z=Math.ceil(r.minZ);z<r.maxZ;z+=5){if(canWalkDepth(x,z,{fromY:r.y}))probes.push({x,z,y:r.y+1.8,room:r.id});}
const directions=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return[Math.cos(a),0,Math.sin(a)];}).concat([[0,1,0],[.5,.707,.5],[-.5,.707,.5],[.5,.707,-.5],[-.5,.707,-.5]]);
let tested=0,tunnelRays=0;
for(const p of probes)for(const d of directions){
 ray.set(new T.Vector3(p.x,p.y,p.z),new T.Vector3(...d).normalize());ray.far=180;const hits=ray.intersectObject(root,true);tested++;
 if(hits.length)continue;
 const t=(134.4-p.x)/d[0],z=p.z+t*d[2],y=p.y+t*d[1];
 assert(d[0]<0&&t>=0&&z>112&&z<118&&y>=-40&&y<=-34.7,'Every sightline must meet actual masonry or the true gallery tunnel mouth: '+JSON.stringify({p,d}));tunnelRays++;
}
assert(probes.some(p=>p.room==='tessellation-gallery'));assert(probes.some(p=>p.room==='hall-gallery'));assert(tested>8000&&tunnelRays>0);
// Upper arcade caps must fit under their own vault instead of piercing it.
const arcades=root.getObjectByName('Two-storey hexagonal vaulted arcades'),matrix=new T.Matrix4(),point=new T.Vector3(),origin=new T.Vector3();let capVertices=0;
for(let i=0;i<arcades.count;i++){arcades.getMatrixAt(i,matrix);origin.setFromMatrixPosition(matrix);if(Math.abs(origin.y+34)>.01)continue;const room=D.rooms.filter(r=>r.gallery).sort((a,b)=>Math.hypot(origin.x-a.centre[0],origin.z-a.centre[1])-Math.hypot(origin.x-b.centre[0],origin.z-b.centre[1]))[0];const attr=arcades.geometry.attributes.position;for(let j=0;j<attr.count;j++){point.fromBufferAttribute(attr,j).applyMatrix4(matrix);if(!insidePolygon(room.polygon,point.x,point.z))continue;assert(point.y<=roomCeilingAt(room,point.x,point.z)+.015,'Upper arcade cap cannot protrude through '+room.id+' vault');capVertices++;}}
assert(capVertices>1000);
m.dispose();s.dispose();console.log('PASS cloister shell: '+tested+' actual horizontal/diagonal/upward rays across all three levels; only the real west tunnel mouth stays open, no balcony/short-corridor voids.');
