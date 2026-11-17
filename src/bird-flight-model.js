import {BIRD_TILE_OUTLINE,createCylinderMetamorphosisLayout,cylinderTilePoint,cylinderDepartureCell} from './cylinder-metamorphosis-scene.js?v=bird-peel-20261117b';
const TAU=2*Math.PI,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));},mix=(a,b,t)=>a+(b-a)*t;
export const BIRD_FLIGHT=Object.freeze({coordinateSpace:'lower-local +Y up; physical wrapper (0,-96,0), rotation X=PI',count:64,duration:96,floorY:22.15,deckY:22.13,floorRadius:6.5,tileSize:.9,tileScale:.986,gateY:-8,coreRadius:11,cruiseY:25.4,telescope:{x:0,z:-2.5,radius:1.8},seat:{x:-4.8,z:3.5,radius:1.7}});
export function birdFloorPoint(tile,p){const s=tile.size*tile.scale;return{x:tile.x+(p[0]-.5)*s,y:BIRD_FLIGHT.floorY,z:tile.z-(p[1]-.5)*s};}
export function birdFloorPose(tile){return birdFloorPoint(tile,[.56,.68]);}
export function createBirdFlightLayout({count=BIRD_FLIGHT.count,duration=BIRD_FLIGHT.duration}={}){
 if(!Number.isInteger(count)||count<1||count>128||!Number.isFinite(duration)||duration<40||duration>240)throw new RangeError('Use 1..128 birds and a 40..240-second flight');
 const C=BIRD_FLIGHT,wall=createCylinderMetamorphosisLayout({birdCount:0,departureCount:count}),tiles=[];
 for(let row=-9;row<=9;row++)for(let column=-9;column<=9;column++){const tile={id:`${column}:${row}`,column,row,x:column*C.tileSize,z:-row*C.tileSize,size:C.tileSize,scale:C.tileScale,colour:((column+2*row)%3+3)%3};const points=BIRD_TILE_OUTLINE.map(p=>birdFloorPoint(tile,p));if(Math.hypot(tile.x,tile.z)>C.floorRadius+1.7)continue;tile.complete=points.every(p=>Math.hypot(p.x,p.z)<C.floorRadius-.04);tile.landing=birdFloorPose(tile);tiles.push(tile);}
 const candidates=tiles.filter(t=>t.complete&&Math.hypot(t.landing.x,t.landing.z)<5.6&&[C.telescope,C.seat].every(o=>Math.hypot(t.landing.x-o.x,t.landing.z-o.z)>o.radius+1));
 if(candidates.length<count)throw new RangeError('Not enough distinct clear deck tiles for that many landing birds');
 // A coprime stride distributes arrivals across the completed tessellation.
 const gcd=(a,b)=>b?gcd(b,a%b):a,pools=[0,1,2].map(c=>candidates.filter(t=>t.colour===c)),used=[0,0,0],strides=pools.map(pool=>{let s=Math.max(1,Math.floor(pool.length*.618));while(gcd(s,pool.length)!==1)s++;return s;});
 const birds=Array.from({length:count},(_,i)=>{const{column,row}=cylinderDepartureCell(i,{columns:wall.columns,count}),sourceTile=wall.tiles.find(t=>t.row===row&&t.column===column),p=cylinderTilePoint(sourceTile,[.56,.68],{ink:true}),source={x:p[0],y:-96-p[1],z:-p[2]},colour=sourceTile.colour,n=used[colour]++;if(n>=pools[colour].length)throw new RangeError('Not enough matching floor tiles for that cast size');const tile=pools[colour][n*strides[colour]%pools[colour].length];return{id:i,wave:i,offset:((count-i)%count)/count,phase:i*2.399963229728653,coreRadius:10.65+(i%5)*.16,source,sourceTile,sourceAngle:Math.atan2(source.z,source.x),tile,colour};});
 return{...C,count,duration,wall,tiles,birds,departureInterval:duration/count,helixTurns:2,master:BIRD_TILE_OUTLINE,credit:'Original City of Ideas opposite-edge bird tile and hinged sculpture; no Escher print reproduced.'};
}
const vectorMix=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t)});
export function birdFlightPosition(bird,phase){
 const C=BIRD_FLIGHT,p=clamp(phase),s=bird.source,d=bird.tile.landing,radius=bird.coreRadius??C.coreRadius;
 if(p<=.035)return{...s};
 if(p<.11){const u=smooth((p-.035)/.075),r=mix(Math.hypot(s.x,s.z),20.10,u);return{x:r*Math.cos(bird.sourceAngle),y:s.y,z:r*Math.sin(bird.sourceAngle)};}
 if(p<.28){const u=smooth((p-.11)/.17),turn=TAU+(bird.sourceAngle%TAU+TAU)%TAU,a=bird.sourceAngle-turn*u,r=mix(20.10,20,smooth((p-.11)/.05));return{x:r*Math.cos(a),y:mix(s.y,C.gateY,u),z:r*Math.sin(a)};}
 if(p<.40){const u=smooth((p-.28)/.12),r=mix(20,radius,u);return{x:r,y:C.gateY,z:0};}
 if(p<.48){const u=smooth((p-.40)/.08),a=-u*Math.PI*1.5;return{x:radius*Math.cos(a),y:mix(C.gateY,-4,u),z:radius*Math.sin(a)};}
 // The complete flock makes a visible cylindrical ribbon, never a vertical
 // queue. Clockwise turns put the deck-height crossing on the WEST side,
 // safely opposite the real +X bridge to the observatory floor.
 if(p<.80){const u=smooth((p-.48)/.32),a=-Math.PI*1.5-TAU*2*u;return{x:radius*Math.cos(a),y:mix(-4,C.cruiseY,u),z:radius*Math.sin(a)};}
 if(p<.89){const u=smooth((p-.80)/.09),v=vectorMix({x:0,y:C.cruiseY,z:radius},{...d,y:24.6},u);v.y+=.32*Math.sin(Math.PI*u);return v;}
 if(p<.96)return{...d,y:mix(24.6,d.y,smooth((p-.89)/.07))};
 return{...d};
}
export function birdFlightPose(bird,time=0,{duration=BIRD_FLIGHT.duration,reduced=false,phase:fixedPhase}={}){
 const seconds=Number.isFinite(time)?time:0,p=fixedPhase??((seconds/duration+bird.offset)%1+1)%1,position=birdFlightPosition(bird,p),previous=birdFlightPosition(bird,Math.max(.11,p-.008)),next=birdFlightPosition(bird,Math.min(.96,p+.008)),v={x:next.x-previous.x,y:next.y-previous.y,z:next.z-previous.z},length=Math.hypot(v.x,v.y,v.z);
 // First the skin lifts in its own wall frame, then takes its first stroke.
 // Resizing waits until it is clear of the wall and continues across the orbit.
 const peel=smooth((p-.035)/.075),departure=smooth((p-.11)/.055),landing=smooth((p-.89)/.06),resize=smooth((p-.14)/.23),floorScale=bird.tile.size*bird.tile.scale,scale=mix(1.12,floorScale,smooth((p-.75)/.20)),sourceX=bird.sourceTile.width*bird.sourceTile.scale,sourceY=bird.sourceTile.height*bird.sourceTile.scale;
 const opacity=reduced?0:smooth(p/.025)*(1-smooth((p-.975)/.025)),flap=smooth((p-.09)/.045)*(1-landing),fold=(.40*peel+flap*.20*Math.sin((seconds%(TAU/3.3))*3.3+bird.phase))*(1-landing),inflate=smooth((p-.055)/.085)*(1-landing);
 const arrival={x:bird.tile.landing.x,y:-1.805,z:bird.tile.landing.z-(bird.coreRadius??BIRD_FLIGHT.coreRadius)},arrivalLength=Math.hypot(arrival.x,arrival.y,arrival.z),tangent=length>1e-8?{x:v.x/length,y:v.y/length,z:v.z/length}:{x:1,y:0,z:0},align=smooth((p-.872)/.018),aim={x:mix(tangent.x,arrival.x/arrivalLength,align),y:mix(tangent.y,arrival.y/arrivalLength,align),z:mix(tangent.z,arrival.z/arrivalLength,align)},aimLength=Math.hypot(aim.x,aim.y,aim.z),direction={x:aim.x/aimLength,y:aim.y/aimLength,z:aim.z/aimLength},wallBank=p<.28?1:p<.4?1-smooth((20-Math.hypot(position.x,position.z)-.4)/1.4):0;
 return{...position,phase:p,direction,peel,departure,landing,wallBank,opacity,bodyOpacity:opacity*inflate,inflate,fold,scale,scaleX:mix(sourceX,scale,resize),scaleY:mix(sourceY,scale,resize),curveWeight:1-peel,stage:p<.035?'wall':p<.11?'peel':p<.28?'wall-flight':p<.40?'gate':p<.48?'core-turn':p<.80?'ascent':p<.89?'over-deck':p<.96?'landing':'floor'};
}
