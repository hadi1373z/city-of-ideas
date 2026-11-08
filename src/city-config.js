/* Configure only a separately authenticated, trusted home service origin.
   No tokens, cookies, private state or API keys belong in this static file. */
window.CITY_CONFIG=Object.freeze({homeBackendOrigin:null,showGroundPaving:false,pondTransitionVideo:null});

// Optional future pond-crossing film: set pondTransitionVideo to a published video path.
// With null the crossing uses the live 3D journey, with no replacement voices.
