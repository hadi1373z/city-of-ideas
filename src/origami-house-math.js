export const HOUSE_ORIGAMI={x:229,z:76,width:18,depth:16,entry:{x:229,z:99,y:.13,yaw:0,pitch:.06},threshold:{x:229,z:87},insideEntry:{x:229,z:81.5,y:.13,yaw:0},shore:{x:256.5,z:76,y:.13,yaw:-Math.PI/2}};
export const PAPER_COLOURS=['#e9dcb9','#92b9c5','#cc9584'];
export const COAST_ROUTES=[[[215,116],[215,90],[229,90],[229,84]],[[229,99],[229,84]],[[229,90],[249,90],[256.5,76]],[[243,-112],[256,-112],[256,65],[256.5,76],[256,160],[242,160]],[[203.5,65],[215,65],[249,65],[256.5,76]]];
export const coastX=z=>264+2*Math.sin(z/60)+Math.sin(z/19);
export const waterHeight=(x,z,time=0)=>-.015+.024*Math.min(1,Math.max(0,(x-coastX(z))/12))*(Math.sin(x*.11+z*.17-time*.7)+.4*Math.sin(z*.32-time*.45));
// Compatible Miura coordinates; every face stays the same rigid parallelogram.
// a,b are edge lengths; alpha is its acute sector angle, theta is fold tilt.
export function miura(theta=45,{a=.9,b=.7,alpha=60,columns=8,rows=4}={}){
 if(![theta,a,b,alpha].every(Number.isFinite)||theta<0||theta>75||a<=0||b<=0||alpha<=0||alpha>=90||!Number.isInteger(columns)||!Number.isInteger(rows)||columns<1||rows<1||columns>24||rows>24)throw Error('Use a positive finite panel, acute angle and fold tilt from 0 to 75 degrees.');
 const radians=Math.PI/180,t=theta*radians,g=alpha*radians,D=Math.sqrt(1-Math.sin(g)**2*Math.sin(t)**2),L=a*D,H=a*Math.sin(g)*Math.sin(t),S=b*Math.sin(g)*Math.cos(t)/D,V=b*Math.cos(g)/D,vertices=[],faces=[];
 for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++)vertices.push([i*S-columns*S/2,(j%2)*H,j*L+(i%2)*V-(rows*L+V)/2]);
 for(let j=0;j<rows;j++)for(let i=0;i<columns;i++){const k=j*(columns+1)+i;faces.push([k,k+1,k+columns+2,k+columns+1]);}
 return{vertices,faces,columns,rows,a,b,alpha,theta,width:columns*S,length:rows*L+V,height:H,panelArea:a*b*Math.sin(g),S,L,V};
}
export const CREASE_CASES=[{angles:[60,120,120,60],name:'A balanced vertex'},{angles:[60,120,60,120],name:'An angle obstruction'},{angles:[90,90,90,90],name:'A right-angle vertex'}];
export function vertexTests(angles,mountains){
 const valid=Array.isArray(angles)&&angles.length>=4&&angles.length%2===0&&angles.every(n=>Number.isFinite(n)&&n>0&&n<180)&&Math.abs(angles.reduce((n,a)=>n+a,0)-360)<1e-7;
 if(!valid||!Array.isArray(mountains)||mountains.length!==angles.length||!mountains.every(n=>typeof n==='boolean'))throw Error('Use positive sectors summing to 360 and one mountain/valley label for each crease.');
 const odd=angles.filter((_,i)=>i%2===0).reduce((n,a)=>n+a,0),even=360-odd,M=mountains.filter(Boolean).length,V=angles.length-M;
 return{odd,even,M,V,kawasaki:Math.abs(odd-180)<1e-7,maekawa:Math.abs(M-V)===2};
}
export function releasedBoatPose(time,{reduced=false}={}){
 const a=reduced?0:Math.max(0,time)*.055,z=76+14*Math.sin(a),x=coastX(z)+5+13*(1-Math.cos(a)),dz=14*Math.cos(a),dx=(2/60*Math.cos(z/60)+1/19*Math.cos(z/19))*dz+13*Math.sin(a);
 return{x,y:waterHeight(x,z,reduced?0:time)+.008,z,yaw:Math.atan2(-dz,dx),roll:reduced?0:.025*Math.sin(time*.7),pitch:reduced?0:.018*Math.sin(time*.9)};
}
export const FOLD_HOUSE_KEY='city-of-ideas:house-of-origami:v1';
export function foldHouseMemory(storage){
 let s={version:1,fold:45,paper:0,boatStep:0,boatDone:false,miuraSeen:0,creaseCase:0,mountains:[true,true,true,false],creaseUnderstood:false,launched:false,reflection:''},saved=!!storage;
 try{const v=JSON.parse(storage?.getItem(FOLD_HOUSE_KEY)||'null');if(v?.version===1){for(const[k,max]of[['fold',75],['paper',2],['boatStep',8],['miuraSeen',3],['creaseCase',2]])if(Number.isInteger(v[k])&&v[k]>=0&&v[k]<=max)s[k]=v[k];for(const k of['boatDone','creaseUnderstood'])s[k]=v[k]===true;if(Array.isArray(v.mountains)&&v.mountains.length===4&&v.mountains.every(n=>typeof n==='boolean'))s.mountains=[...v.mountains];s.launched=v.launched===true&&s.boatDone;s.reflection=typeof v.reflection==='string'?v.reflection.slice(0,1200):'';if(s.boatDone)s.boatStep=8;}}catch{}
 try{if(storage?.getItem('city-of-ideas:origami-made:v1:boat')==='yes'){s.boatDone=true;s.boatStep=8;}}catch{}
 const persist=()=>{try{storage.setItem(FOLD_HOUSE_KEY,JSON.stringify(s));saved=true;}catch{saved=false;}};
 return{get state(){return structuredClone(s);},get saved(){return saved;},fold(value,{inside=false}={}){if(!inside||!Number.isInteger(value)||value<0||value>75)return false;s.fold=value;s.miuraSeen|=value<=10?1:value>=60?2:0;persist();return true;},paper(index){if(!Number.isInteger(index)||index<0||index>2)return false;s.paper=index;persist();return true;},boatNext({inside=false}={}){if(!inside)return false;if(s.boatStep<8)s.boatStep++;else s.boatDone=true;persist();return true;},boatBack(){s.boatStep=Math.max(0,s.boatStep-1);persist();},creaseCase(index){if(!Number.isInteger(index)||index<0||index>2)return false;s.creaseCase=index;persist();return true;},toggleCrease(index,{inside=false}={}){if(!inside||!Number.isInteger(index)||index<0||index>3)return false;s.mountains[index]=!s.mountains[index];persist();return true;},understand(value,{inside=false}={}){if(!inside||value!==1)return false;s.creaseUnderstood=true;persist();return true;},launch({shore=false}={}){if(!shore||!s.boatDone)return false;s.launched=true;persist();return true;},reflect(text){if(typeof text!=='string'||!text.trim())return false;s.reflection=text.trim().slice(0,1200);persist();return true;}};
}
