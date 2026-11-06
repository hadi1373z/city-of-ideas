import {coastX,COAST_ROUTES,HOUSE_ORIGAMI} from './origami-house-math.js';
export function buildCityCoast(T){
 const group=new T.Group();group.name='Eastern ocean and connected coastal walk';const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c})),sand=mat(0xc9bd96),wood=mat(0x826e50),grass=mat(0x6b8069),rock=mat(0x8c9381);
 function box(w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);group.add(o);return o;}
 const positions=[],ix=[],nx=64,nz=128;
 for(let j=0;j<=nz;j++){const z=-850+j/nz*1400;for(let i=0;i<=nx;i++)positions.push(coastX(z)+i/nx*1900,-.015,z);}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i;ix.push(a,a+nx+1,a+1,a+1,a+nx+1,a+nx+2);}
 const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(ix);geo.computeVertexNormals();
 const uniforms={time:{value:0},fogColor:{value:new T.Color(0x8d9e9b)},fogDensity:{value:.0015}};
 const water=own(new T.ShaderMaterial({uniforms,fog:true,side:T.DoubleSide,
 vertexShader:'uniform float time; varying vec3 vSea; varying float vDepth; void main(){vec3 p=position;float shore=264.0+2.0*sin(p.z/60.0)+sin(p.z/19.0);float d=max(0.0,p.x-shore);p.y+=.024*min(1.0,d/12.0)*(sin(p.x*.11+p.z*.17-time*.7)+.4*sin(p.z*.32-time*.45));vSea=p;vec4 mv=modelViewMatrix*vec4(p,1.0);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform float time;uniform vec3 fogColor;uniform float fogDensity;varying vec3 vSea;varying float vDepth;void main(){float shore=264.0+2.0*sin(vSea.z/60.0)+sin(vSea.z/19.0);float d=max(0.0,vSea.x-shore);float rip=sin(vSea.x*.48+vSea.z*.30-time*.65)+.45*sin(vSea.z*.83-time*.43);vec3 col=mix(vec3(.24,.48,.52),vec3(.12,.27,.36),smoothstep(0.0,180.0,d));col+=.025*rip;float swash=1.0-smoothstep(.1,1.9,abs(d-(1.4+.6*sin(vSea.z*.17-time*.25))));col=mix(col,vec3(.77,.83,.73),swash*.7);float fleck=smoothstep(1.15,1.43,rip)*.12;col+=vec3(fleck);float fog=1.0-exp(-fogDensity*fogDensity*vDepth*vDepth);gl_FragColor=vec4(mix(col,fogColor,clamp(fog,0.0,1.0)),1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
 }));const sea=new T.Mesh(geo,water);sea.name='Ocean · moving swells and shoreline foam';sea.frustumCulled=false;group.add(sea);
 const beach=[],bi=[];for(let j=0;j<=180;j++){const z=-540+j/180*800;beach.push(258,.105,z,coastX(z)+.5,-.035,z);if(j<180){const k=j*2;bi.push(k,k+2,k+1,k+1,k+2,k+3);}}const bg=own(new T.BufferGeometry());bg.setAttribute('position',new T.Float32BufferAttribute(beach,3));bg.setIndex(bi);bg.computeVertexNormals();const bank=new T.Mesh(bg,sand);bank.name='Continuous sandy coast at the eastern city edge';group.add(bank);
 // Low stone coping makes the walking boundary visible rather than an invisible wall.
 for(let z=-500;z<=215;z+=5.5){const lip=box(.65,.28,5.55,259.55,.05,z,rock);lip.name='Low coastal stone edge';}
 for(const points of COAST_ROUTES)for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),g=own(new T.PlaneGeometry(3.1,len+.025)),o=new T.Mesh(g,grass);o.rotation.x=-Math.PI/2;o.rotation.z=-Math.atan2(b[0]-a[0],b[1]-a[1]);o.position.set((a[0]+b[0])/2,.014,(a[1]+b[1])/2);o.name='Mown route to the coast';group.add(o);}
 for(let i=0;i<12;i++)box(4,.09,.48,257,.085,73.1+i*.5,wood);
 for(const z of[73,76,79])box(.12,.85,.12,259.05,.5,z,wood);box(.12,.10,6.2,259.05,.88,76,wood);
 const launch=box(.5,.06,.42,258.85,.95,76,mat(0xe3d6af));launch.name='Paper boat launch rest';launch.userData={origamiHouse:'shore',dynamic:true};
 return{group,sea,launch,paths:COAST_ROUTES,uniforms,update(time,{reduced=false,fog}={}){uniforms.time.value=reduced?0:time;if(fog?.color)uniforms.fogColor.value.copy(fog.color);if(Number.isFinite(fog?.density))uniforms.fogDensity.value=fog.density;},dispose(){group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
