import {NIGHT_SKY_DEFAULTS,equatorialToHorizontal,horizontalVector} from './night-sky-model.js?v=city-night-20261117';

// Real catalogue positions, no random decorative stars. The dome follows each
// render camera so walking (or looking through the pond) cannot cause parallax.
export function buildNightSky(T,catalogue,{chart=NIGHT_SKY_DEFAULTS,radius=1900,pixelRatio=1}={}){
 const group=new T.Group();group.name='Catalogue night sky · camera-centred celestial hemisphere';
 const stars=catalogue.stars,owned=new Set(),own=o=>(owned.add(o),o),byHip=new Map(stars.map(s=>[Number(s.hip),s])),directions=new Map();
 const starGeometry=own(new T.BufferGeometry()),lineGeometry=own(new T.BufferGeometry());
 const starMaterial=own(new T.ShaderMaterial({uniforms:{pixelRatio:{value:Math.min(2,pixelRatio)}},transparent:true,depthWrite:false,depthTest:true,toneMapped:false,
  vertexShader:'attribute vec3 color;attribute float pointSize;uniform float pixelRatio;varying vec3 vColor;void main(){vColor=color;gl_PointSize=pointSize*pixelRatio;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'varying vec3 vColor;void main(){float r=length(gl_PointCoord-vec2(.5))*2.0;if(r>1.0)discard;float a=1.0-smoothstep(.25,1.0,r);gl_FragColor=vec4(vColor,a);}'
 }));
 const lineMaterial=own(new T.LineBasicMaterial({color:0xaee7f5,transparent:true,opacity:.65,depthWrite:false,toneMapped:false,fog:false}));
 const points=new T.Points(starGeometry,starMaterial),lines=new T.LineSegments(lineGeometry,lineMaterial);points.name='Measured bright-star positions';lines.name='Selected constellation guide · illustrative figure';points.frustumCulled=false;lines.frustumCulled=false;group.add(points,lines);
 const cameraPosition=new T.Vector3();
 points.onBeforeRender=lines.onBeforeRender=(_renderer,_scene,camera)=>{camera.getWorldPosition(cameraPosition);group.parent?.worldToLocal(cameraPosition);group.position.copy(cameraPosition);group.updateMatrixWorld(true);};
 let currentChart={...chart},currentGuide=null,guideVisible=true,disposed=false;
 const vector=s=>{const h=equatorialToHorizontal(s,currentChart),v=horizontalVector(h,1);return new T.Vector3(v.x,v.y,v.z);};
 function updateLines(){const positions=[];if(currentGuide&&guideVisible)for(const edge of currentGuide.edges){const a=directions.get(Number(edge[0])),b=directions.get(Number(edge[1]));if(!a||!b)continue;let previous=a.clone();for(let j=1;j<=20;j++){const next=a.clone().lerp(b,j/20).normalize();if(previous.y>0&&next.y>0)positions.push(...previous.clone().multiplyScalar(radius*.999).toArray(),...next.clone().multiplyScalar(radius*.999).toArray());previous=next;}}lineGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));lineGeometry.computeBoundingSphere();lines.visible=positions.length>0;}
 function setChart(next){currentChart={...NIGHT_SKY_DEFAULTS,...next};const positions=[],colors=[],sizes=[];directions.clear();for(const s of stars){const v=vector(s);directions.set(Number(s.hip),v);if(v.y<=0)continue;positions.push(...v.clone().multiplyScalar(radius).toArray());const ci=s.colorIndex==null?NaN:Number(s.colorIndex),c=new T.Color(0xf2f1e4);if(Number.isFinite(ci)){if(ci<.2)c.lerp(new T.Color(0xa9caff),Math.min(.85,(.2-ci)/.6));else c.lerp(new T.Color(0xffba78),Math.min(.7,(ci-.2)/1.8));}colors.push(c.r,c.g,c.b);sizes.push(Math.max(1.25,4.8-Number(s.magnitude)*.62));}starGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));starGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));starGeometry.setAttribute('pointSize',new T.Float32BufferAttribute(sizes,1));starGeometry.computeBoundingSphere();updateLines();return positions.length/3;}
 setChart(chart);
 return{group,points,lines,stars,byHip,directions,get chart(){return{...currentChart};},get visibleStars(){return starGeometry.attributes.position.count;},setChart,setGuide(guide,visible=true){if(currentGuide===guide&&guideVisible===visible)return;currentGuide=guide;guideVisible=visible;updateLines();},setGuideOpacity(value=1){lineMaterial.opacity=.65*Math.max(0,Math.min(1,value));},direction(hip){return directions.get(Number(hip))?.clone()??null;},dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const resource of owned)resource.dispose();group.clear();}};
}
