import {HEX_DISTRICTS,PAPER_SEMINAR_COURT as COURT} from './city-hex-layout.js?v=six-gate-city-20261121';
export const SEMINAR_HOUSE_ARCHIVE=[
 {id:'noether',x:COURT.x-34,z:COURT.z+23,names:{en:'Emmy Noether · House of Symmetry',de:'Emmy Noether · Haus der Symmetrie',fa:'امی نوتر؛ خانهٔ تقارن',cs:'Emmy Noether · Dům symetrie'},colour:0xa58245,style:'oculus',sources:[['Emmy Noether · Invariant Variation Problems (1918), M. A. Tavel translation','https://arxiv.org/abs/physics/0503066']]},
 {id:'mirzakhani',x:HEX_DISTRICTS.curvedSpace.x,z:168,names:{en:'Maryam Mirzakhani · House of Curved Space',de:'Maryam Mirzakhani · Haus des gekrümmten Raums',fa:'مریم میرزاخانی؛ خانهٔ فضای خمیده',cs:'Maryam Mirzakhani · Dům zakřiveného prostoru'},colour:0x48848c,style:'ribbon',sources:[['Maryam Mirzakhani · Growth of the number of simple closed geodesics (2008)','https://annals.math.princeton.edu/wp-content/uploads/annals-v168-n1-p03.pdf'],['Maryam Mirzakhani · Simple geodesics and Weil–Petersson volumes','https://www.math.stonybrook.edu/~mlyubich/Archive/Geometry/Teichmuller%20Space/Mirz3.pdf']]},
 {id:'cage',x:COURT.x+34,z:COURT.z+23,names:{en:'John Cage · House of Listening',de:'John Cage · Haus des Zuhörens',fa:'جان کیج؛ خانهٔ شنیدن',cs:'John Cage · Dům naslouchání'},colour:0x8b684b,style:'fins',sources:[["MoMA · John Cage, 4′33″ (In Proportional Notation)",'https://www.moma.org/collection/works/163616']]}
];
// The Curved Space house is retired from the main city; retain its lesson data and saved IDs.
export const SEMINAR_HOUSES=SEMINAR_HOUSE_ARCHIVE.map((h,i)=>({...h,mapNumber:6+i})).filter(h=>h.id!=='mirzakhani');
export const seminarWorld=(h,x,z)=>({x:h.x-x,z:h.z-z});
export const seminarEntry=h=>({...seminarWorld(h,0,20),y:.13,yaw:Math.PI});
export const SEMINAR_PATHS=[[[COURT.x-34,COURT.z],[COURT.eastX,COURT.z]],...SEMINAR_HOUSES.map(h=>[[h.x,COURT.z],[h.x,h.z-12]])];
export function seminarPathsSvg(){const points=p=>p.map(([x,z])=>(460+x*.7).toFixed(1)+','+(460+z*.7).toFixed(1)).join(' ');return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 920"><g fill="none" stroke="#9d8c65" stroke-width="3" stroke-linejoin="round">'+SEMINAR_PATHS.map(p=>'<polyline points="'+points(p)+'"/>').join('')+'</g></svg>';}
