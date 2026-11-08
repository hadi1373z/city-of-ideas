import {computationState} from './computation-house-copy.js';
// Fixed symbols and a moving evidence marker, supported by the original desk sheet.
export function buildComputationDetails(T,{home,box,wood,paper,trim,dark,accent,targets}){
 const group=new T.Group();group.name='Computation house details';home.add(group);
 for(let i=0;i<3;i++)box(group,5.08,.20,.14,-5+i*5,4.55+i*.22,6.48,paper);
 for(const[x,y]of[[-7.48,4.55],[7.48,4.99]])box(group,.14,.20,13,x,y,0,paper);
 for(const x of[-7.96,7.96])for(const y of[.95,3.35])box(group,.32,.1,6.2,x,y,0,trim);
 for(const x of[-4.8,4.8])for(const y of[.95,3.35])box(group,6.2,.1,.32,x,y,5.96,trim);
 for(const x of[3.9,6.1])for(const z of[-1.45,-.55])box(group,.14,.16,.14,x,.85,z,trim);
 for(const x of[-4.5,4.5])for(const dx of[-.72,0,.72])box(group,.08,.38,.04,x+dx,.81,2.24,wood);
 const journal=new T.Group();journal.name='Run evidence journal';journal.position.set(5,1.07,-1);group.add(journal);box(journal,1.08,.035,.56,0,.0175,0,wood);box(journal,1.02,.012,.50,0,.041,0,paper);
 box(journal,.13,.012,.13,-.34,.053,-.02,dark);
 for(const x of[-.08,.08])box(journal,.035,.012,.195,x,.053,-.02,dark);for(const z of[-.10,.06])box(journal,.195,.012,.035,0,.053,z,dark);
 for(const x of[.26,.42])box(journal,.035,.012,.195,x,.053,-.02,dark);box(journal,.195,.012,.035,.34,.053,-.10,dark);
 const marker=box(journal,.22,.012,.04,.34,.053,.16,accent);
 journal.traverse(o=>o.userData={studyHouse:'computation',studyReading:true,dynamic:true});targets.push(journal);
 function setMachine(machine){if(!machine||typeof machine.halted!=='boolean'||typeof machine.repeated!=='boolean'||machine.halted&&machine.repeated)return false;marker.position.x={halted:-.34,repeated:0,pending:.34}[computationState(machine)];return true;}
 return{group,journal,marker,setMachine};
}
