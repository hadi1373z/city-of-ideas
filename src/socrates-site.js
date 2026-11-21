/* Shared rigid placement of Socrates' original public house. No saved contents. */
(function(root){'use strict';
 const x=507,z=40,scale=1.7,entry=Object.freeze({x:x-scale,z:z+8,y:.13,yaw:0});
 const site=Object.freeze({x,z,scale,cell:Object.freeze({q:3,r:0}),entry,
  footprint:Object.freeze({id:'socrates',x:x-scale,z:z-3*scale,width:18.8*scale,depth:10.8*scale}),
  approaches:Object.freeze([Object.freeze([[x-scale,z+3.8],[entry.x,entry.z],[entry.x,63],[Math.sqrt(3)*276,63],[Math.sqrt(3)*276,92]].map(Object.freeze))])});
 root.CITY_SOCRATES_SITE=site;if(root.window&&root.window!==root)root.window.CITY_SOCRATES_SITE=site;
})(globalThis);
