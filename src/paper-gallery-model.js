// Lower-local +Y-up coordinates. The existing lower frame supplies the half-turn.
import {HISTORIC_PAPERS} from './historic-papers-data.js?v=paper-detours-20261118';
const TAU=2*Math.PI;
export const PAPER_GALLERY=Object.freeze({baseY:.13,innerRadius:19,outerRadius:58,monitorRadius:48,monitorSpacing:.18,stairInner:14.4,stairOuter:17.6,stairRadius:16,steps:96,endTheta:TAU,rise:12,feetTolerance:.29,navInset:.055});
const readingOrder={foundations:['boole','frege-begriffsschrift','peano-arithmetic','dedekind','bolzano-continuity','hilbert-problems','stability-generalization','learnability-stability'],geometry:['euclid-elements','euler','euler-polyhedra','gauss-curvature','riemann','klein-erlangen','fourier','noether','persistence-landscapes','persistence-estimation'],computation:['babbage','lovelace','liblinear','adagrad','sdca','kernel-ica','universal-portfolios','kernel-quadrature'],learning:['bayes','lda','kernel-two-sample','feature-selection','random-forest-consistency','scikit-learn','dropout','conformal-prediction','causal-additive-noise']};
export const PAPER_GALLERY_FLOORS=Object.freeze([
 {id:'foundations',name:'Foundations and logic',question:'What makes a definition support a proof?',paperIds:['boole','dedekind'],color:0x6e8d86},
 {id:'geometry',name:'Geometry, analysis and symmetry',question:'Which structure survives a change of representation?',paperIds:['euler','riemann','fourier','noether','persistence-landscapes','persistence-estimation'],color:0x788ca2},
 {id:'computation',name:'Machines and symbolic computation',question:'When does a calculation become a general method?',paperIds:['babbage','lovelace'],color:0xa78462},
 {id:'learning',name:'Probability and learning',question:'Which assumptions make an inference trustworthy?',paperIds:['bayes','scikit-learn','dropout','conformal-prediction','causal-additive-noise'],color:0x91829c}
].map((f,index)=>{const ids=[...f.paperIds,...HISTORIC_PAPERS.filter(p=>p.floorId===f.id&&!f.paperIds.includes(p.id)).map(p=>p.id)],rank=id=>{const i=readingOrder[f.id].indexOf(id);return i<0?Infinity:i;};return Object.freeze({...f,index,y:.13+4*index,theta:index*TAU/3,angle:-index*TAU/3,paperIds:Object.freeze(ids.sort((a,b)=>rank(a)-rank(b)))});}));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const paperStairY=theta=>.13+Math.floor(clamp(theta,0,TAU)/TAU*96+1e-8)*.125;
export const paperStairPoint=theta=>({x:16*Math.cos(theta),z:-16*Math.sin(theta),y:paperStairY(theta),theta});
export function paperGallerySlots(){return PAPER_GALLERY_FLOORS.flatMap(f=>f.paperIds.map((paperId,i)=>{const angle=f.angle+(i-(f.paperIds.length-1)/2)*PAPER_GALLERY.monitorSpacing;return{id:'paper-slot-'+paperId,paperId,floor:f.index,floorId:f.id,floorY:f.y,angle,x:PAPER_GALLERY.monitorRadius*Math.cos(angle),z:PAPER_GALLERY.monitorRadius*Math.sin(angle),y:f.y+2.15,width:2.8,height:3.1,yaw:-angle-Math.PI/2};}));}
export function paperGallerySurface(x,z,feet,{lastTheta=null,layer=null,floor=null}={}){
 if(![x,z,feet].every(Number.isFinite))return null;const C=PAPER_GALLERY,r=Math.hypot(x,z),tol=C.feetTolerance;
 if(r>=C.stairInner+C.navInset&&r<=C.stairOuter-C.navInset){
  let angle=Math.atan2(-z,x);if(angle<0)angle+=TAU;const candidates=[angle];if(angle<1e-8)candidates.push(TAU);
  for(const theta of candidates){const y=paperStairY(theta);if(Math.abs(feet-y)>tol||Number.isFinite(lastTheta)&&Math.abs(theta-lastTheta)>.28)continue;if(layer==='floor'&&floor!=null&&Math.abs(theta-PAPER_GALLERY_FLOORS[floor].theta)>.28)continue;return{kind:'stair',layer:'stair',theta,y,floor:null};}
 }
 for(const f of PAPER_GALLERY_FLOORS){if(Math.abs(feet-f.y)>tol||layer==='stair'&&Number.isFinite(lastTheta)&&Math.abs(lastTheta-f.theta)>.28||['floor','bridge'].includes(layer)&&floor!=null&&floor!==f.index)continue;const u=Math.cos(f.angle)*x+Math.sin(f.angle)*z,v=-Math.sin(f.angle)*x+Math.cos(f.angle)*z;
  if(u>0&&u<=20.1&&r>=(f.index?17.5:16)&&Math.abs(v)<=1.78)return{kind:'bridge',layer:'bridge',theta:f.theta,y:f.y,floor:f.index};
  if(r>=19.015&&r<=57.965)return{kind:'floor',layer:'floor',theta:f.theta,y:f.y,floor:f.index};
 }
 return null;
}
export function paperGalleryGroundHandoff(x,z,feet){return Math.abs(feet-.13)<.3&&(Math.hypot(x,z)>57.2||x< -56&&Math.abs(z)<2.5);}
export function walkPaperGallery(player,dx,dz,{eye=1.8,canStand=()=>true}={}){
 const options=()=>({lastTheta:player.paperTheta??null,layer:player.paperLayer??null,floor:player.paperFloor??null});let surface=paperGallerySurface(player.x,player.z,player.y-eye,options());if(!surface)return{moved:false,surface:null};const count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.09));let moved=false;
 for(let i=0;i<count;i++)for(const[ax,az]of[[dx/count,0],[0,dz/count]]){const next=paperGallerySurface(player.x+ax,player.z+az,player.y-eye,options());if(!next||!canStand(player.x+ax,player.z+az,next.y))continue;player.x+=ax;player.z+=az;player.y=next.y+eye;player.paperTheta=next.theta;player.paperLayer=next.layer;player.paperFloor=next.floor;surface=next;moved=moved||!!(ax||az);}
 return{moved,surface};
}
