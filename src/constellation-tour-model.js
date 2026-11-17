// A teaching highlight sequence on one fixed sky chart. It never moves stars,
// changes seasons, aims the camera or treats line figures as sky boundaries.
export const CONSTELLATION_TOUR=Object.freeze({seconds:24,fadeSeconds:1.2,minAltitudeDeg:5});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const constellationName=guide=>guide.id==='ursa-major'?'Big Dipper · Ursa Major':guide.title.split(' · ')[0];
export function constellationCandidates(guides,direction){
 const horizon=Math.sin(CONSTELLATION_TOUR.minAltitudeDeg*Math.PI/180);
 return guides.filter(g=>{
  const focus=direction(g.focusHip);if(!focus||focus.y<=horizon)return false;
  const above=g.hips.filter(hip=>(direction(hip)?.y??-1)>0).length;
  const edges=g.edges.filter(([a,b])=>(direction(a)?.y??-1)>0&&(direction(b)?.y??-1)>0).length;
  return above>=3&&edges>=2;
 });
}
export function constellationDirection(guide,direction){
 let x=0,y=0,z=0,count=0;for(const hip of guide.hips){const p=direction(hip);if(p?.y>0){x+=p.x;y+=p.y;z+=p.z;count++;}}
 const length=Math.hypot(x,y,z);if(!count||!length)return 'Below this chart’s horizon';
 const altitude=Math.asin(clamp(y/length,-1,1))*180/Math.PI,azimuth=(Math.atan2(x,-z)+Math.PI*2)%(Math.PI*2);
 const bearing=['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(azimuth/(Math.PI/4))%8];
 return altitude>75?'Almost overhead':bearing+' · about '+Math.round(altitude)+'° up';
}
export function nextConstellation(candidates,currentId){
 if(!candidates.length)return null;const index=candidates.findIndex(g=>g.id===currentId);return candidates[(index+1)%candidates.length];
}
export function tickConstellationTour(state,seconds,{active=true,playing=true,reducedMotion=false}={}){
 let elapsed=Number.isFinite(state.elapsed)?state.elapsed:0,fadeIn=!!state.fadeIn;
 if(!active||!playing||reducedMotion){if(fadeIn||elapsed>CONSTELLATION_TOUR.seconds-CONSTELLATION_TOUR.fadeSeconds)elapsed=0;return{elapsed,fadeIn:false,advance:false,opacity:1};}
 // A background tab or a suspended device must not catch up through the tour.
 const dt=Number.isFinite(seconds)&&seconds>=0&&seconds<=2?seconds:0;elapsed+=dt;
 const advance=elapsed>=CONSTELLATION_TOUR.seconds;if(advance){elapsed%=CONSTELLATION_TOUR.seconds;fadeIn=true;}
 if(elapsed>=CONSTELLATION_TOUR.fadeSeconds)fadeIn=false;
 const opacity=fadeIn?elapsed/CONSTELLATION_TOUR.fadeSeconds:Math.min(1,(CONSTELLATION_TOUR.seconds-elapsed)/CONSTELLATION_TOUR.fadeSeconds);
 return{elapsed,fadeIn,advance,opacity:clamp(opacity,0,1)};
}
