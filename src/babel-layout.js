/* Shared geometry for the physical gallery opening and its underground library. */
(function(g){'use strict';
const levels=[49,39,29,19,9].map((r,i)=>({id:i,r,y:-8-i*4,angle:-Math.PI*.75+i*Math.PI/2}));
// One more flight in the same stairwell, directly under the gallery flights.
// Its lower end is at the snake head; its upper end meets the ground-floor landing.
const x=(306-54.5)/612*96,width=(351-263)/596*96,steps=40,run=steps*.28;
const flight={x,z0:run,z1:0,width,top:.395,bottom:-8,steps};
const landing={minX:x-width/2,maxX:49.3,minZ:-6.4,maxZ:0,y:-8};
g.CITY_BABEL_LAYOUT=Object.freeze({levels,opening:{minX:x-width/2-.08,maxX:x+width/2+.08,minZ:-.08,maxZ:run+.08},entry:{x,z:run+.8,y:.395,yaw:0},flight,landing,floorRadius:58,base:-26.5});
})(globalThis);
