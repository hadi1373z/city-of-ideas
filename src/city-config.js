/* Configure only a separately authenticated, trusted home service origin.
   No tokens, cookies, private state or API keys belong in this static file. */
window.CITY_CONFIG=Object.freeze({sixfoldHouses:true,houseWell:null,houseWells:Array.from({length:6},(_,i)=>({x:Math.sqrt(3)*92*Math.cos(i*Math.PI/3),z:Math.sqrt(3)*92*Math.sin(i*Math.PI/3),radius:10.3})),edition:2,mountainEnabled:false,homeBackendOrigin:null,showGroundPaving:false,pondTransitionVideo:null});

// Optional future pond-crossing film: set pondTransitionVideo to a published video path.
// With null the crossing uses the live 3D journey, with no replacement voices.

document.documentElement.dataset.cityEdition=String(window.CITY_CONFIG.edition);
