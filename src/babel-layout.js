/* Shared geometry for the physical gallery opening and its underground library. */
(function(g){'use strict';
const levels=[49,39,29,19,9].map((r,i)=>({id:i,r,y:-8-i*4,angle:-Math.PI*.75+i*Math.PI/2}));
g.CITY_BABEL_LAYOUT=Object.freeze({levels,opening:{minX:-10.5,maxX:10.5,minZ:-46,maxZ:-42},entry:{x:-12.5,z:-44,y:.395,yaw:-Math.PI/2},flight:{x0:-10,x1:10,z:-44,width:3.4,top:.395,bottom:-8,steps:42},floorRadius:58,base:-26.5});
})(globalThis);
