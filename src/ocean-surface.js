import {CITY_ISLAND as I} from './island-layout.js';
// Both physical faces share the upper city's ocean palette, foam and fog.
export function createOceanMaterial(T){
 const uniforms={time:{value:0},fogColor:{value:new T.Color(0xc2d6df)},fogDensity:{value:.0007},islandRadius:{value:I.radius}};
 return new T.ShaderMaterial({uniforms,fog:true,side:T.DoubleSide,
 vertexShader:'uniform float time;uniform float islandRadius;varying vec3 vSea;varying float vDepth;void main(){vec3 p=position;float d=max(0.0,length(p.xz)-islandRadius);p.y+=.024*min(1.0,d/12.0)*(sin(p.x*.11+p.z*.17-time*.7)+.4*sin(p.z*.32-time*.45));vSea=p;vec4 mv=modelViewMatrix*vec4(p,1.0);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform float time;uniform float islandRadius;uniform vec3 fogColor;uniform float fogDensity;varying vec3 vSea;varying float vDepth;void main(){float d=max(0.0,length(vSea.xz)-islandRadius);float rip=sin(vSea.x*.48+vSea.z*.30-time*.65)+.45*sin(vSea.z*.83-time*.43);vec3 col=mix(vec3(.25,.56,.61),vec3(.10,.29,.40),smoothstep(0.0,220.0,d));col+=.018*rip*(1.0-smoothstep(40.0,260.0,d));float foam=1.0-smoothstep(.1,1.9,abs(d-(1.4+.6*sin(atan(vSea.z,vSea.x)*570.0*.17-time*.25))));col=mix(col,vec3(.82,.89,.83),foam*.7);float fog=1.0-exp(-fogDensity*fogDensity*vDepth*vDepth);gl_FragColor=vec4(mix(col,fogColor,clamp(fog,0.0,1.0)),1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
 });
}
export function updateOceanMaterial(material,time,{reduced=false,fog}={}){const u=material.uniforms;u.time.value=reduced?0:time;if(fog?.color)u.fogColor.value.copy(fog.color);if(Number.isFinite(fog?.density))u.fogDensity.value=fog.density;}
