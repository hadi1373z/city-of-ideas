/* Original procedural mountain and metamorphosis figures for this project.
 * No external sculpture/model is copied; this is not the Zizkov infant asset.
 * Uses the caller's THREE r160 (MIT). No renderer, lights, shadows, ramp or colliders.
 * buildSpiralMountainArt(THREE, options) -> {group, update(seconds,reducedMotion), dispose(), metadata}
 */
(function (g) {
  'use strict';
  g.buildSpiralMountainArt = function (T, options) {
    if (!T || !T.BufferGeometry) throw new Error('buildSpiralMountainArt requires the existing THREE namespace.');
    options = options || {};
    var center = options.center || {x:125,z:0};
    var bottom = Number.isFinite(options.baseHeight) ? options.baseHeight : 0.42;
    var top = Number.isFinite(options.topHeight) ? options.topHeight : 24.5;
    if (top <= bottom + 4) throw new Error('Mountain top must be above its base.');
    var baseRadius = Number.isFinite(options.baseRadius) ? options.baseRadius : 47;
    var summitRadius = Number.isFinite(options.topRadius) ? options.topRadius : 15.5;
    var height = top-bottom, scaleH = height/24.08, scaleR = summitRadius/15.5;
    var ownedGeometry = new Set(), ownedMaterial = new Set(), supplied = options.materials || {}, disposed = false;
    var root = new T.Group(); root.name='Original spiral mountain art';root.position.set(Number(center.x)||0,0,Number(center.z)||0);
    root.userData={kind:'mountain-art',source:'Original procedural geometry created for this project; no external sculpture/model copied.'};
    function material(key,color,extra) {
      if(supplied[key])return supplied[key];
      var m=new T.MeshStandardMaterial(Object.assign({color:color,roughness:0.9,metalness:0},extra||{}));ownedMaterial.add(m);return m;
    }
    var mats={terrain:material('terrain',0xffffff,{vertexColors:true,flatShading:true}),rock:material('basalt',0x3f4943),skin:material('skin',0xe6b898),cloth:material('cloth',0xe9e6d2),dark:material('dark',0x302b29),rose:material('rose',0xb8796c),gold:material('lion',0xc59b55),mane:material('mane',0x70553c),camel:material('camel',0xb89b72)};
    function geometry(v){ownedGeometry.add(v);return v;}
    function mesh(parent,geo,mat,x,y,z){var m=new T.Mesh(geometry(geo),mat);m.position.set(x||0,y||0,z||0);m.castShadow=false;m.receiveShadow=false;parent.add(m);return m;}
    function ball(parent,mat,x,y,z,sx,sy,sz,detail){var m=mesh(parent,new T.IcosahedronGeometry(1,detail==null?2:detail),mat,x,y,z);m.scale.set(sx,sy==null?sx:sy,sz==null?sx:sz);return m;}
    function round(parent,mat,x,y,z,sx,sy,sz){var m=mesh(parent,new T.SphereGeometry(1,14,10),mat,x,y,z);m.scale.set(sx,sy==null?sx:sy,sz==null?sx:sz);return m;}
    function bone(parent,mat,a,b,r1,r2){var start=new T.Vector3(a[0],a[1],a[2]),end=new T.Vector3(b[0],b[1],b[2]),d=end.clone().sub(start);var m=mesh(parent,new T.CylinderGeometry(r2==null?r1:r2,r1,d.length(),8,1),mat);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
    function tube(parent,mat,points,radius){var curve=new T.CatmullRomCurve3(points.map(function(p){return new T.Vector3(p[0],p[1],p[2]);}));return mesh(parent,new T.TubeGeometry(curve,12,radius,6,false),mat);}
    // Combine only static parts by shared material; moving leg groups remain separate.
    function combine(parent) {
      parent.updateMatrixWorld(true);var inv=new T.Matrix4().copy(parent.matrixWorld).invert(),byMaterial=new Map(),children=[];
      parent.traverse(function(o){if(o.isMesh){var a=byMaterial.get(o.material)||[];a.push(o);byMaterial.set(o.material,a);children.push(o);}});
      byMaterial.forEach(function(items,mat){var ps=[],ns=[],uv=[];
        items.forEach(function(item){var relative=new T.Matrix4().multiplyMatrices(inv,item.matrixWorld);var raw=item.geometry.index?item.geometry.toNonIndexed():item.geometry.clone();raw.applyMatrix4(relative);var p=raw.attributes.position,n=raw.attributes.normal,u=raw.attributes.uv;
          for(var i=0;i<p.count;i++){ps.push(p.getX(i),p.getY(i),p.getZ(i));ns.push(n?n.getX(i):0,n?n.getY(i):1,n?n.getZ(i):0);uv.push(u?u.getX(i):0,u?u.getY(i):0);}raw.dispose();});
        var out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(ps,3));out.setAttribute('normal',new T.Float32BufferAttribute(ns,3));out.setAttribute('uv',new T.Float32BufferAttribute(uv,2));out.computeBoundingSphere();mesh(parent,out,mat);
      });
      children.forEach(function(item){item.parent.remove(item);item.geometry.dispose();ownedGeometry.delete(item.geometry);});
    }
    var camelY=bottom+4.58*scaleH,lionY=bottom+12.08*scaleH;
    var slopeBase=Math.min(39.5*scaleR,baseRadius-0.5),camelOuter=32.1*scaleR,camelInner=28.7*scaleR,lionOuter=25.2*scaleR,lionInner=22.0*scaleR;
    // Stepped cross-section supplies real flat animal ledges; all rings stay inside the ramp's inner edge.
    var rings=[[bottom,slopeBase],[camelY,camelOuter],[camelY,camelInner],[lionY,lionOuter],[lionY,lionInner],[top,summitRadius]];
    var segments=64,positions=[],colors=[],color=new T.Color();
    function radiusAtRing(ring,i){var angle=2*Math.PI*i/segments,r=ring[1],flat=ring[0]===camelY||ring[0]===lionY||ring[0]===top;var inward=flat?1:0.969+0.031*(0.5+0.5*Math.sin(angle*7+0.9*Math.sin(angle*3)));return [Math.cos(angle)*r*inward,ring[0],Math.sin(angle)*r*inward];}
    function triangle(a,b,c,grass,k){positions.push.apply(positions,a.concat(b,c));var shade=.93+.12*Math.sin(k*2.173);color.setRGB((grass ? 0.32 : 0.245)*shade,(grass ? 0.43 : 0.31)*shade,(grass ? 0.25 : 0.27)*shade);for(var q=0;q<3;q++)colors.push(color.r,color.g,color.b);}
    for(var r=0;r<rings.length-1;r++){var flat=rings[r][0]===rings[r+1][0];for(var i=0;i<segments;i++){var a=radiusAtRing(rings[r],i),b=radiusAtRing(rings[r],i+1),c=radiusAtRing(rings[r+1],i),d=radiusAtRing(rings[r+1],i+1);triangle(a,c,b,flat,r*64+i);triangle(b,c,d,flat,r*64+i+.5);}}
    for(var j=0;j<segments;j++)triangle([0,top,0],radiusAtRing(rings[rings.length-1],j+1),radiusAtRing(rings[rings.length-1],j),true,j+777);
    var terrain=new T.BufferGeometry();terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.computeVertexNormals();mesh(root,terrain,mats.terrain).name='Faceted basalt and green terraces';
    mesh(root,new T.CylinderGeometry(baseRadius,baseRadius,.28,64,1),mats.rock,0,.14,0).name='Low basalt plinth';
    var infant=new T.Group();infant.name='Original giant crawling infant';infant.position.y=top-.02;infant.userData={stage:'infant',original:true};root.add(infant);
    // Oversized head, round belly, diaper, bent crawling elbows and grounded knees.
    ball(infant,mats.skin,-.2,2.35,0,3.05,1.6,1.95);
    ball(infant,mats.cloth,2.0,1.95,0,1.7,1.42,1.72);
    ball(infant,mats.skin,-3.65,3.45,0,2.35,2.4,2.2);
    [-1,1].forEach(function(s){
      ball(infant,mats.skin,-3.5,3.45,s*2.18,.52,.65,.35);
      ball(infant,mats.rose,-3.61,3.42,s*2.45,.2,.32,.08,1);
      bone(infant,mats.skin,[-1.9,2.3,s*1.5],[-2.65,.66,s*2.04],.48,.5);
      ball(infant,mats.skin,-2.65,.66,s*2.04,.51,.5,.51);
      bone(infant,mats.skin,[-2.65,.66,s*2.04],[-3.7,.3,s*2.43],.44,.43);
      round(infant,mats.skin,-3.82,.26,s*2.48,.69,.23,.51);
      for(var finger=0;finger<3;finger++)round(infant,mats.skin,-4.2-.1*finger,.2,s*(2.23+.19* finger),.26,.16,.12);
      bone(infant,mats.skin,[1.65,1.75,s*1.32],[2.75,.6,s*1.83],.69,.53);
      ball(infant,mats.skin,2.75,.6,s*1.83,.57,.53,.6);
      bone(infant,mats.skin,[2.75,.6,s*1.83],[1.73,.3,s*2.49],.46,.35);
      round(infant,mats.skin,1.64,.23,s*2.56,.7,.21,.42);
      round(infant,mats.cloth,-5.54,3.99,s*.79,.29,.43,.43);
      round(infant,mats.dark,-5.82,3.97,s*.82,.075,.19,.21);
      round(infant,mats.skin,-5.31,3.07,s*1.24,.45,.47,.47);
    });
    round(infant,mats.skin,-6.04,3.44,0,.46,.43,.42);
    tube(infant,mats.rose,[[-5.86,2.82,-.43],[-5.99,2.72,0],[-5.86,2.82,.43]],.085);
    tube(infant,mats.dark,[[-3.54,5.81,0],[-3.8,6.05,.04],[-4.0,5.92,.12]],.11);
    combine(infant);
    function leg(parent,coat,x,z,length,phase,hoof) {var joint=new T.Group();joint.position.set(x,length,z);parent.add(joint);
      bone(joint,coat,[0,0,0],[.12,-length*.54,0],.16,.135);round(joint,coat,.12,-length*.54,0,.17,.2,.17);bone(joint,coat,[.12,-length*.54,0],[0,-length+.14,0],.13,.1);round(joint,hoof,0,-length+.1,0,.27,.12,.16);combine(joint);return {joint:joint,phase:phase};}
    function lionBody() {var animal=new T.Group(),body=new T.Group();animal.add(body);animal.name='Original orbiting lion';animal.userData={stage:'lion',original:true};
      ball(body,mats.gold,0,1.15,0,1.65,.73,.65);ball(body,mats.gold,-1.3,1.1,0,.76,.73,.67);
      ball(body,mats.mane,1.25,1.57,0,.92,1.0,.93);round(body,mats.gold,1.75,1.7,0,.57,.65,.58);round(body,mats.gold,2.2,1.49,0,.49,.33,.43);round(body,mats.dark,2.58,1.62,0,.12,.11,.16);
      [-1,1].forEach(function(s){round(body,mats.gold,1.41,2.43,s*.57,.23,.26,.19);round(body,mats.dark,1.46,2.45,s*.7,.1,.12,.035);round(body,mats.dark,2.08,1.94,s*.38,.065,.085,.06);});
      tube(body,mats.gold,[[-1.6,1.15,0],[-2.15,1.47,.36],[-2.63,1.87,.68],[-2.85,2.02,.77]],.095);round(body,mats.mane,-2.85,2.02,.77,.24,.26,.23);combine(body);
      var legs=[];[-1,1].forEach(function(s){legs.push(leg(animal,mats.gold,1.1,s*.46,.88,s===1?0:Math.PI,mats.gold));legs.push(leg(animal,mats.gold,-1.16,s*.45,.88,s===1?Math.PI:0,mats.gold));});animal.scale.setScalar(.64*scaleR);return {node:animal,legs:legs};}
    function camelBody() {var animal=new T.Group(),body=new T.Group();animal.add(body);animal.name='Original orbiting camel';animal.userData={stage:'camel',original:true};
      ball(body,mats.camel,0,1.84,0,1.65,.87,.6);ball(body,mats.camel,-.27,2.68,0,.96,.95,.57);
      tube(body,mats.camel,[[1.15,1.84,0],[1.66,2.38,0],[1.77,3.05,0],[2.17,3.56,0]],.31);round(body,mats.camel,2.43,3.52,0,.63,.36,.33);round(body,mats.camel,2.94,3.33,0,.43,.23,.3);
      [-1,1].forEach(function(s){round(body,mats.camel,2.12,3.86,s*.32,.13,.3,.1);round(body,mats.dark,2.63,3.68,s*.285,.055,.07,.032);});round(body,mats.dark,3.2,3.35,0,.085,.08,.16);
      tube(body,mats.camel,[[-1.53,1.91,0],[-1.8,1.42,.18],[-1.86,.91,.27]],.074);round(body,mats.dark,-1.86,.86,.27,.12,.22,.12);combine(body);
      var legs=[];[-1,1].forEach(function(s){legs.push(leg(animal,mats.camel,1.1,s*.41,1.63,s===1?0:Math.PI,mats.dark));legs.push(leg(animal,mats.camel,-1.13,s*.41,1.63,s===1?Math.PI:0,mats.dark));});animal.scale.setScalar(.64*scaleR);return {node:animal,legs:legs};}
    var lion=lionBody(),camel=camelBody();root.add(lion.node,camel.node);
    // Clearance uses every actual mesh vertex at its elevation, including raised heads/tails.
    function safeOrbit(animal,footY,wanted) {animal.node.updateMatrixWorld(true);var penalty=0,scale=animal.node.scale.x;
      animal.node.traverse(function(o){if(!o.isMesh)return;var rel=new T.Matrix4().copy(animal.node.matrixWorld).invert().multiply(o.matrixWorld),p=o.geometry.attributes.position,v=new T.Vector3();for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(rel);var y=footY+v.y*scale,inner=43*scaleR-24*scaleR*((y-bottom)/height)-3.5*scaleR-1.5*scaleR;penalty=Math.max(penalty,Math.abs(v.z*scale)+v.x*v.x*scale*scale/(2*Math.max(1,wanted))-inner+wanted);}});
      return Math.max(1,wanted-Math.max(0,penalty)-.14*scaleR);
    }
    var lionRadius=safeOrbit(lion,lionY,24.8*scaleR),camelRadius=safeOrbit(camel,camelY,33.5*scaleR);
    function place(animal,radius,y,angle){animal.node.position.set(Math.cos(angle)*radius,y,Math.sin(angle)*radius);animal.node.rotation.y=-angle-Math.PI/2;}
    place(lion,lionRadius,lionY,.5);place(camel,camelRadius,camelY,3.1);
    var metadata={source:root.userData.source,center:{x:root.position.x,z:root.position.z},bottom:bottom,top:top,slopeBaseRadius:slopeBase,summitRadius:summitRadius,rings:rings.map(function(r){return {y:r[0],radius:r[1]};}),rampEnvelope:{startRadius:43*scaleR,endRadius:19*scaleR,turns:4,clearance:1.5*scaleR},infant:{length:10.9*scaleR},bands:{lion:{y:lionY,radius:lionRadius},camel:{y:camelY,radius:camelRadius}},materials:ownedMaterial.size};
    root.userData.geometryContract=metadata;
    function update(seconds,reducedMotion) {if(disposed||reducedMotion)return;var t=Number.isFinite(seconds)?seconds:0;
      place(lion,lionRadius,lionY,.5-t*.036);place(camel,camelRadius,camelY,3.1+t*.022);
      lion.legs.forEach(function(l){l.joint.rotation.z=Math.sin(t*2.25+l.phase)*.14;});camel.legs.forEach(function(l){l.joint.rotation.z=Math.sin(t*1.8+l.phase)*.11;});
      infant.scale.set(scaleR,scaleR*(1+.006*Math.sin(t*.7)),scaleR);infant.rotation.z=.003*Math.sin(t*.43);
    }
    update(0,false);
    var infantExtent=new T.Box3().setFromObject(infant).getSize(new T.Vector3());metadata.infant={length:infantExtent.x,height:infantExtent.y,width:infantExtent.z,original:true};
    function dispose(){if(disposed)return;disposed=true;root.removeFromParent();ownedGeometry.forEach(function(v){v.dispose();});ownedMaterial.forEach(function(v){v.dispose();});ownedGeometry.clear();ownedMaterial.clear();root.clear();}
    return {group:root,update:update,dispose:dispose,metadata:metadata,infant:infant,lion:lion.node,camel:camel.node};
  };
  g.buildSpiralMountainArt.source='Original procedural project artwork. Three.js runtime supplied by caller, MIT. No copied Zizkov or other model asset.';
})(window);
