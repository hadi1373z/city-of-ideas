'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/artist-quarter-layout.js'),'utf8'),scope);const plan=scope.window.ARTIST_QUARTER_PLAN;
function render(p=plan){
 const x=n=>80+(n-70)*4.7,y=n=>65+(n-72)*4.7,escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;'),south=new Set(['hilma-af-klint','morris','mondrian','lange','klee']),names={monet:'Monet','van-gogh':'Van Gogh','hilma-af-klint':'Hilma af Klint',morris:'Morris',kandinsky:'Kandinsky',hokusai:'Hokusai',rodin:'Rodin',mondrian:'Mondrian',lange:'Lange',klee:'Klee',escher:'Escher',dali:'Dalí',cezanne:'Cézanne',morisot:'Morisot',seurat:'Seurat'};
 const out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 780" role="img" aria-labelledby="title desc">','<title id="title">Artists’ quarter: three connected courtyards</title>','<desc id="desc">Fifteen houses around a garden court, a form and perspective court, and a studio court. The walking route forms a continuous loop.</desc>','<rect width="1000" height="780" rx="18" fill="#e8eddc"/>','<text x="34" y="34" font-family="Georgia,serif" font-size="22" fill="#294639">Artists’ quarter · three connected courtyards</text>'];
 const route=(points,width=4)=>out.push('<polyline points="'+points.map(a=>x(a[0])+','+y(a[1])).join(' ')+'" fill="none" stroke="#b5c79f" stroke-width="'+width*4.7+'" stroke-linecap="round" stroke-linejoin="round"/>');
 p.routes.forEach(r=>route(r));
 for(const[id,[cx,cz]]of Object.entries(p.galleries)){const z=cz+(south.has(id)?-4.995:4.995),court=p.courts.find(c=>c.artists.includes(id));route([[cx,z],[cx,court.id==='garden'?98:['rodin','klee'].includes(id)?118:116]],2.5);}
 route([[p.escher.x,p.escher.z+8.4],[p.escher.x,126]],3);route([[p.dali.x,p.dali.z+7.83],[p.dali.x,187]],3);
 for(const a of Object.values(p.studios))route([[a.x,a.z+(a.turn?-6:6)],[a.x,179]],3);
 for(const [tx,tz]of p.trees)out.push('<path d="M '+x(tx)+' '+(y(tz)-6)+' l -7 10 5 -1 -5 8 14 0 -5 -8 5 1 Z" fill="#7c956f"/>');
 const places=[...Object.entries(p.galleries).map(([id,[cx,cz]])=>({id,x:cx,z:cz,w:9.45,d:8.1,dir:south.has(id)?-1:1})),{id:'escher',...p.escher,w:8,d:20,offset:-3,dir:1},{id:'dali',...p.dali,w:16.2,d:13.5,dir:1},...Object.entries(p.studios).map(([id,a])=>({id,...a,w:14,d:12,dir:a.turn?-1:1}))];
 for(const a of places){const cx=x(a.x),cy=y(a.z+(a.offset||0)),w=a.w*4.7,d=a.d*4.7;out.push('<g data-artist="'+a.id+'" data-x="'+a.x+'" data-z="'+a.z+'"><rect x="'+(cx-w/2)+'" y="'+(cy-d/2)+'" width="'+w+'" height="'+d+'" rx="2" fill="#fff9e9" stroke="#536f62" stroke-width="2"/><path d="M '+(cx-4)+' '+(cy+a.dir*d/2)+' h 8" stroke="#a77d48" stroke-width="4"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#263e35">'+escape(names[a.id])+'</text></g>');}
 for(const[cx,cz,label]of[[96,98,'GARDEN'],[174,113,'FORM & PERSPECTIVE'],[184,177,'WORKING STUDIOS']])out.push('<text x="'+x(cx)+'" y="'+y(cz)+'" text-anchor="middle" font-family="sans-serif" font-size="12" letter-spacing="1" fill="#294639">'+escape(label)+'</text>');
 out.push('<path d="M 944 100 V 65 m -6 8 6 -8 6 8" fill="none" stroke="#294639" stroke-width="2"/><text x="944" y="57" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#294639">N</text>','<text x="34" y="754" font-family="sans-serif" font-size="13" fill="#536756">Open doorways face the courts · the same arrangement is built in the walkable city</text>','</svg>');return out.join('\n')+'\n';
}
if(require.main===module)fs.writeFileSync(path.join(root,'src/assets/artist-quarter-plan.svg'),render());
module.exports={render,plan};
