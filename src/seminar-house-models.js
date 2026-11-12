// Exact oscillator solutions, Poincare-disk geometry, and an original seeded score.
export function oscillator(t=0,anisotropic=false){
 if(!Number.isFinite(t))throw new TypeError('Finite phase required');
 const w=anisotropic?2:1,x=3*Math.cos(t),y=2*Math.sin(w*t),vx=-3*Math.sin(t),vy=2*w*Math.cos(w*t);
 return {x,y,vx,vy,w,energy:.5*(vx*vx+vy*vy+x*x+w*w*y*y),momentum:x*vy-y*vx,torque:(1-w*w)*x*y};
}
const valid=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.hypot(...p)<1;
export function diskDistance(a,b){if(!valid(a)||!valid(b))throw new RangeError('Points must be inside the unit disk');return Math.acosh(Math.max(1,1+2*((a[0]-b[0])**2+(a[1]-b[1])**2)/((1-a[0]**2-a[1]**2)*(1-b[0]**2-b[1]**2))));}
export function diskGeodesic(a,b,n=80){
 diskDistance(a,b);if(!Number.isInteger(n)||n<2||n>1000)throw new RangeError('Bounded sample count required');
 const det=a[0]*b[1]-a[1]*b[0];if(Math.abs(det)<1e-10)return {points:Array.from({length:n+1},(_,i)=>a.map((v,j)=>v+(b[j]-v)*i/n)),diameter:true};
 const aa=(a[0]**2+a[1]**2+1)/2,bb=(b[0]**2+b[1]**2+1)/2,c=[(aa*b[1]-bb*a[1])/det,(a[0]*bb-b[0]*aa)/det],r=Math.sqrt(c[0]**2+c[1]**2-1),start=Math.atan2(a[1]-c[1],a[0]-c[0]);let delta=Math.atan2(b[1]-c[1],b[0]-c[0])-start;delta=Math.atan2(Math.sin(delta),Math.cos(delta));
 return {center:c,radius:r,diameter:false,points:Array.from({length:n+1},(_,i)=>[c[0]+r*Math.cos(start+delta*i/n),c[1]+r*Math.sin(start+delta*i/n)])};
}
export function chordLength(a,b,n=2048){diskDistance(a,b);if(!Number.isInteger(n)||n<2||n>16384||n%2)throw new RangeError('Even bounded quadrature count required');const length=Math.hypot(a[0]-b[0],a[1]-b[1]),f=t=>{const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;return 2*length/(1-x*x-y*y);};let sum=f(0)+f(1);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(i/n);return sum/(3*n);}
export const DISK_CASES=[{a:[-.6,0],b:[.6,0]},{a:[-.5,.15],b:[.5,.45]},{a:[-.5,.15],b:[.85,.35]}];
export function chanceScore(seed=1){if(!Number.isInteger(seed)||seed<1||seed>9999)throw new RangeError('Seed 1–9999 required');let x=seed>>>0;return Array.from({length:16},()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return (x>>>16)%4;});}
export const SCORE_FREQUENCIES=[0,220,277.1826,329.6276];
