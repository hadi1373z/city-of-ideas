/* Original procedural mountain and metamorphosis figures for this project.
 * Procedural geometry, with the infant finish and silhouette guided by the owner reference.
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
    var rampStart=Number.isFinite(options.rampStartRadius)?options.rampStartRadius:43,rampEnd=Number.isFinite(options.rampEndRadius)?options.rampEndRadius:19,rampWidth=Number.isFinite(options.rampWidth)?options.rampWidth:7;
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
    var expansion=rampStart-43*scaleR,camelExpansion=expansion*(1-(camelY-bottom)/height),lionExpansion=expansion*(1-(lionY-bottom)/height);
    var slopeBase=Math.min(rampStart-rampWidth/2,baseRadius-.5),camelOuter=32.1*scaleR+camelExpansion,camelInner=28.7*scaleR+camelExpansion,lionOuter=25.2*scaleR+lionExpansion,lionInner=22.0*scaleR+lionExpansion;
    // Stepped cross-section supplies real flat animal ledges; all rings stay inside the ramp's inner edge.
    var rings=[[bottom,slopeBase],[camelY,camelOuter],[camelY,camelInner],[lionY,lionOuter],[lionY,lionInner],[top,summitRadius]];
    var segments=64,positions=[],colors=[],color=new T.Color();
    function radiusAtRing(ring,i){var angle=2*Math.PI*i/segments,r=ring[1],flat=ring[0]===camelY||ring[0]===lionY||ring[0]===top;var inward=flat?1:0.969+0.031*(0.5+0.5*Math.sin(angle*7+0.9*Math.sin(angle*3)));return [Math.cos(angle)*r*inward,ring[0],Math.sin(angle)*r*inward];}
    function triangle(a,b,c,grass,k){positions.push.apply(positions,a.concat(b,c));var shade=.93+.12*Math.sin(k*2.173);color.setRGB((grass ? 0.32 : 0.245)*shade,(grass ? 0.43 : 0.31)*shade,(grass ? 0.25 : 0.27)*shade);for(var q=0;q<3;q++)colors.push(color.r,color.g,color.b);}
    for(var r=0;r<rings.length-1;r++){var flat=rings[r][0]===rings[r+1][0];for(var i=0;i<segments;i++){var a=radiusAtRing(rings[r],i),b=radiusAtRing(rings[r],i+1),c=radiusAtRing(rings[r+1],i),d=radiusAtRing(rings[r+1],i+1);triangle(a,c,b,flat,r*64+i);triangle(b,c,d,flat,r*64+i+.5);}}
    for(var j=0;j<segments;j++)triangle([0,top,0],radiusAtRing(rings[rings.length-1],j+1),radiusAtRing(rings[rings.length-1],j),true,j+777);
    var terrain=new T.BufferGeometry();terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.computeVertexNormals();mesh(root,terrain,mats.terrain).name='Faceted basalt and green terraces';
    mesh(root,new T.CylinderGeometry(baseRadius,baseRadius,.28,64,1),mats.rock,0,.14,0).name='Low basalt plinth';
    var crawlLimbs=[],crawling=false;
    var infant=new T.Group();infant.name='Original giant crawling infant';infant.position.y=top-.02;infant.userData={stage:'infant',original:true};root.add(infant);
    // Smooth sculptural volumes inspired by the owner reference, with no cartoon face or diaper.
    var bronze=material('infantBronze',0x292b2d,{roughness:.44,metalness:.68});
    infant.name='Dark bronze crawling infant';infant.userData.finish='dark bronze';
    // A smooth implicit union avoids visible sphere/cylinder seams while retaining four moving limbs.
    function sculpture(parent,forms,bounds){
      var step=.19,nx=Math.ceil((bounds[1]-bounds[0])/step),ny=Math.ceil((bounds[3]-bounds[2])/step),nz=Math.ceil((bounds[5]-bounds[4])/step),dx=(bounds[1]-bounds[0])/nx,dy=(bounds[3]-bounds[2])/ny,dz=(bounds[5]-bounds[4])/nz;
      function field(x,y,z){var d=100;for(var f of forms){var q;if(f.length===6){q=(Math.hypot((x-f[0])/f[3],(y-f[1])/f[4],(z-f[2])/f[5])-1)*Math.min(f[3],f[4],f[5]);}else{var ax=x-f[0],ay=y-f[1],az=z-f[2],bx=f[3]-f[0],by=f[4]-f[1],bz=f[5]-f[2],t=Math.max(0,Math.min(1,(ax*bx+ay*by+az*bz)/(bx*bx+by*by+bz*bz)));q=Math.hypot(ax-bx*t,ay-by*t,az-bz*t)-f[6];}var k=.3,h=Math.max(k-Math.abs(d-q),0)/k;d=Math.min(d,q)-h*h*k*.25;}return Math.max(d,.02-y);}
      var grid=[],points=[],vertices=[],normals=[],stride=nx+1,layer=stride*(ny+1);
      for(var z=0;z<=nz;z++)for(var y=0;y<=ny;y++)for(var x=0;x<=nx;x++){var p=[bounds[0]+x*dx,bounds[2]+y*dy,bounds[4]+z*dz];points.push(p);grid.push(field.apply(null,p));}
      function crossing(a,b){var u=grid[a]/(grid[a]-grid[b]),p=points[a],q=points[b];return p.map(function(v,i){return v+(q[i]-v)*u;});}
      function normal(p){var e=.012,n=new T.Vector3(field(p[0]+e,p[1],p[2])-field(p[0]-e,p[1],p[2]),field(p[0],p[1]+e,p[2])-field(p[0],p[1]-e,p[2]),field(p[0],p[1],p[2]+e)-field(p[0],p[1],p[2]-e));return n.normalize();}
      function tri(a,b,c){var na=normal(a),nb=normal(b),nc=normal(c),ab=new T.Vector3().fromArray(b).sub(new T.Vector3().fromArray(a)),ac=new T.Vector3().fromArray(c).sub(new T.Vector3().fromArray(a));if(ab.cross(ac).dot(na)<0){var swap=b;b=c;c=swap;swap=nb;nb=nc;nc=swap;}vertices.push.apply(vertices,a.concat(b,c));for(var n of[na,nb,nc])normals.push(n.x,n.y,n.z);}
      var tetra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
      for(var z=0;z<nz;z++)for(var y=0;y<ny;y++)for(var x=0;x<nx;x++){var i=x+y*stride+z*layer,c=[i,i+1,i+1+stride,i+stride,i+layer,i+1+layer,i+1+stride+layer,i+stride+layer];for(var ids of tetra){var inside=[],outside=[];for(var id of ids)(grid[c[id]]<0?inside:outside).push(c[id]);if(inside.length===1||inside.length===3){var one=inside.length===1?inside[0]:outside[0],many=inside.length===1?outside:inside;tri(crossing(one,many[0]),crossing(one,many[1]),crossing(one,many[2]));}else if(inside.length===2){var a=crossing(inside[0],outside[0]),b=crossing(inside[0],outside[1]),d=crossing(inside[1],outside[0]),e=crossing(inside[1],outside[1]);tri(a,b,d);tri(b,e,d);}}}
      var geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geo.computeBoundingSphere();return mesh(parent,geo,bronze);
    }
    sculpture(infant,[[-.35,2.8,0,2.65,1.35,1.68],[1.7,2.05,0,1.55,1.45,1.55],[-1.85,3.05,0,1.1,1.3,1.62],[-2.7,3.8,0,.8,.95,.9],[-3.6,4.6,0,1.65,1.8,1.58],[-3.45,4.55,1.48,.35,.42,.2],[-3.45,4.55,-1.48,.35,.42,.2]],[-5.7,3.6,.4,6.8,-2.1,2.1]).name='Smooth bronze head and body';
    [-1,1].forEach(function(s){
      var armStart=infant.children.length;
      sculpture(infant,[[-1.8,3,s*1.32,-2.1,1.65,s*1.75,.55],[-2.1,1.65,s*1.75,-2.5,.45,s*2.08,.42],[-2.8,.25,s*2.12,.68,.23,.48]],[-3.8,-.9,0,3.7,s<0?-2.9:.6,s<0?-.6:2.9]).name='Smooth supporting arm';
      captureLimb(armStart,[-1.8,3,s*1.32],s,'arm');
      var legStart=infant.children.length;
      sculpture(infant,[[1.6,2.1,s*1.2,2.3,.65,s*1.85,.65],[2.3,.65,s*1.85,3.1,.36,s*2.02,.46],[3.65,.25,s*2.07,.7,.23,.43]],[.7,4.7,0,2.9,s<0?-2.9:.3,s<0?-.3:2.9]).name='Smooth bent knee and foot';
      captureLimb(legStart,[1.6,2.1,s*1.2],-s,'knee');
    });
    function captureLimb(start,pivot,phase,kind){var group=new T.Group();group.name='Crawling '+kind;group.position.set.apply(group.position,pivot);var parts=infant.children.slice(start);infant.add(group);parts.forEach(function(part){group.add(part);part.position.sub(group.position);});crawlLimbs.push({group:group,phase:phase,lift:kind==='arm'?-1:1});}

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
      animal.node.traverse(function(o){if(!o.isMesh)return;var rel=new T.Matrix4().copy(animal.node.matrixWorld).invert().multiply(o.matrixWorld),p=o.geometry.attributes.position,v=new T.Vector3();for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(rel);var y=footY+v.y*scale,inner=rampStart-(rampStart-rampEnd)*((y-bottom)/height)-rampWidth/2-1.5*scaleR;penalty=Math.max(penalty,Math.abs(v.z*scale)+v.x*v.x*scale*scale/(2*Math.max(1,wanted))-inner+wanted);}});
      return Math.max(1,wanted-Math.max(0,penalty)-.14*scaleR);
    }
    var lionRadius=safeOrbit(lion,lionY,(lionOuter+lionInner)/2),camelRadius=safeOrbit(camel,camelY,(camelOuter+camelInner)/2);
    function place(animal,radius,y,angle){animal.node.position.set(Math.cos(angle)*radius,y,Math.sin(angle)*radius);animal.node.rotation.y=-angle-Math.PI/2;}
    place(lion,lionRadius,lionY,.5);place(camel,camelRadius,camelY,3.1);
    var metadata={source:root.userData.source,center:{x:root.position.x,z:root.position.z},bottom:bottom,top:top,slopeBaseRadius:slopeBase,summitRadius:summitRadius,rings:rings.map(function(r){return {y:r[0],radius:r[1]};}),rampEnvelope:{startRadius:rampStart,endRadius:rampEnd,turns:4,clearance:1.5*scaleR},infant:{length:10.9*scaleR},bands:{lion:{y:lionY,radius:lionRadius},camel:{y:camelY,radius:camelRadius}},materials:ownedMaterial.size};
    root.userData.geometryContract=metadata;
    function update(seconds,reducedMotion) {if(disposed||reducedMotion)return;var t=Number.isFinite(seconds)?seconds:0;
      place(lion,lionRadius,lionY,.5-t*.036);place(camel,camelRadius,camelY,3.1+t*.022);
      lion.legs.forEach(function(l){l.joint.rotation.z=Math.sin(t*2.25+l.phase)*.14;});camel.legs.forEach(function(l){l.joint.rotation.z=Math.sin(t*1.8+l.phase)*.11;});
      crawlLimbs.forEach(function(l){l.group.rotation.z=crawling?Math.max(0,Math.sin(t*3.5+l.phase*Math.PI/2))*.12*l.lift:0;});
      infant.scale.set(scaleR,scaleR*(1+.006*Math.sin(t*.7)),scaleR);infant.rotation.z=.003*Math.sin(t*.43);
    }
    update(0,false);
    var infantExtent=new T.Box3().setFromObject(infant).getSize(new T.Vector3());metadata.infant={length:infantExtent.x,height:infantExtent.y,width:infantExtent.z,original:true,finish:'dark bronze',smooth:true};
    function dispose(){if(disposed)return;disposed=true;root.removeFromParent();ownedGeometry.forEach(function(v){v.dispose();});ownedMaterial.forEach(function(v){v.dispose();});ownedGeometry.clear();ownedMaterial.clear();root.clear();}
    return {group:root,update:update,dispose:dispose,metadata:metadata,infant:infant,setCrawling:function(value){crawling=value;if(!value)crawlLimbs.forEach(function(l){l.group.rotation.z=0;});},crawlLimbs:crawlLimbs,lion:lion.node,camel:camel.node};
  };
  g.buildSpiralMountainArt.source='Original procedural project artwork. Three.js runtime supplied by caller, MIT. No copied Zizkov or other model asset.';
})(window);
