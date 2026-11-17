// One regular pointy-top lattice for public districts. Positions are metres.
// Existing houses keep their identities, local rooms and saved study content.
export const CITY_HEX=Object.freeze({side:92,rings:3,row:138,column:Math.sqrt(3)*92});
export const hexCentre=(q,r)=>({x:CITY_HEX.column*(q+r/2),z:CITY_HEX.row*r});
// The northern garden occupies five adjacent cells; its pond, tools, people
// and source-local gardens keep their existing positions inside this fabric.
export const PARK_HEX_CELLS=Object.freeze([[0,-2],[1,-2],[2,-2],[1,-3],[2,-3]].map(([q,r])=>Object.freeze({q,r,...hexCentre(q,r)})));
export const HEX_DISTRICTS=Object.freeze({
 authors:Object.freeze({...hexCentre(-3,1),title:'Court of stories and language'}),
 makers:Object.freeze({...hexCentre(3,-1),title:'Court of mechanisms and imagined worlds'}),
 philosophers:Object.freeze({...hexCentre(-2,0),title:'Court of questions'}),
 symmetry:Object.freeze({...hexCentre(-2,2),title:'Court of symmetry'}),
 curvedSpace:Object.freeze({...hexCentre(-1,2),title:'Court of curved space'}),
 listening:Object.freeze({...hexCentre(0,2),title:'Court of listening'})
});
