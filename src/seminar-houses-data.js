import {HEX_DISTRICTS} from './city-hex-layout.js';
export const SEMINAR_HOUSES=[
 {id:'noether',x:HEX_DISTRICTS.symmetry.x-45,z:168,names:{en:'Emmy Noether · House of Symmetry',de:'Emmy Noether · Haus der Symmetrie',fa:'امی نوتر؛ خانهٔ تقارن',cs:'Emmy Noether · Dům symetrie'},colour:0xa58245,style:'oculus',sources:[['Emmy Noether · Invariant Variation Problems (1918), M. A. Tavel translation','https://arxiv.org/abs/physics/0503066']]},
 {id:'mirzakhani',x:HEX_DISTRICTS.curvedSpace.x,z:168,names:{en:'Maryam Mirzakhani · House of Curved Space',de:'Maryam Mirzakhani · Haus des gekrümmten Raums',fa:'مریم میرزاخانی؛ خانهٔ فضای خمیده',cs:'Maryam Mirzakhani · Dům zakřiveného prostoru'},colour:0x48848c,style:'ribbon',sources:[['Maryam Mirzakhani · Growth of the number of simple closed geodesics (2008)','https://annals.math.princeton.edu/wp-content/uploads/annals-v168-n1-p03.pdf'],['Maryam Mirzakhani · Simple geodesics and Weil–Petersson volumes','https://www.math.stonybrook.edu/~mlyubich/Archive/Geometry/Teichmuller%20Space/Mirz3.pdf']]},
 {id:'cage',x:HEX_DISTRICTS.listening.x+45,z:168,names:{en:'John Cage · House of Listening',de:'John Cage · Haus des Zuhörens',fa:'جان کیج؛ خانهٔ شنیدن',cs:'John Cage · Dům naslouchání'},colour:0x8b684b,style:'fins',sources:[["MoMA · John Cage, 4′33″ (In Proportional Notation)",'https://www.moma.org/collection/works/163616']]}
];
export const seminarWorld=(h,x,z)=>({x:h.x-x,z:h.z-z});
export const seminarEntry=h=>({...seminarWorld(h,0,20),y:.13,yaw:Math.PI});
export const SEMINAR_PATHS=[[[194.023011444505,138],[318.6973485926734,138]],...SEMINAR_HOUSES.map(h=>[[h.x,138],[h.x,h.z-12]])];
export function seminarPathsSvg(){const points=p=>p.map(([x,z])=>(460+x*.7).toFixed(1)+','+(460+z*.7).toFixed(1)).join(' ');return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke="#9d8c65" stroke-width="3" stroke-linejoin="round">'+SEMINAR_PATHS.map(p=>'<polyline points="'+points(p)+'"/>').join('')+'</g></svg>';}
