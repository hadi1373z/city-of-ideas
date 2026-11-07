export const HYPATIA_STAGES=['two','third'];
export const HYPATIA_RADIUS=Math.hypot(.55,.4);
export const HYPATIA_POINTS=[{label:'A',x:-.55,z:0},{label:'B',x:.55,z:0},{label:'C',x:0,z:-.4-HYPATIA_RADIUS}];
export const HYPATIA_CENTRES=[{x:0,z:-.4},{x:0,z:.4}];
export function hypatiaModel(stage){
 if(!HYPATIA_STAGES.includes(stage))throw new RangeError('Unknown Hypatia construction');
 const points=HYPATIA_POINTS.slice(0,stage==='two'?2:3).map(p=>({...p}));
 return{points,circles:HYPATIA_CENTRES.map(c=>({...c,radius:HYPATIA_RADIUS,fits:points.every(p=>Math.abs(Math.hypot(p.x-c.x,p.z-c.z)-HYPATIA_RADIUS)<1e-12)}))};
}
export function hypatiaDiagram(stage){
 const model=hypatiaModel(stage),s=115,xy=p=>({x:210+p.x*s,y:160+p.z*s});
 const circles=model.circles.map((c,i)=>{const p=xy(c);return`<circle cx="${p.x}" cy="${p.y}" r="${c.radius*s}" fill="none" stroke="${i?'#597e86':'#836021'}" stroke-width="3" ${c.fits?'':'stroke-dasharray="8 6"'}/><circle cx="${p.x}" cy="${p.y}" r="3" fill="#344248"/>`;}).join('');
 const origin=xy(model.circles[0]),radii=stage==='third'?model.points.map(p=>{const q=xy(p);return`<path d="M${origin.x} ${origin.y}L${q.x} ${q.y}" stroke="#836021" stroke-width="1.5"/>`;}).join(''):'';
 const points=model.points.map(p=>{const q=xy(p);return`<circle cx="${q.x}" cy="${q.y}" r="5" fill="#243b32"/><text x="${q.x+10}" y="${q.y-8}" font-family="sans-serif" font-size="16" fill="#243b32">${p.label}</text>`;}).join('');
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320"><rect width="420" height="320" fill="#eee5cf"/>${circles}${radii}${points}</svg>`;
}
