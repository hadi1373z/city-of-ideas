'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..'),src=path.join(root,'src'),dest=path.resolve(root,'../../work/retained-integration');
if(fs.existsSync(dest))throw Error('The retained integration checkpoint already exists. Preserve it and use a new name before replacing it.');
fs.mkdirSync(dest,{recursive:true});for(const name of ['city-source-assets/home-tools','service','service-init.js','progress.js','favicon.svg','tool-frames.js','city-integration.js'])fs.cpSync(path.join(src,name),path.join(dest,name),{recursive:true});
fs.copyFileSync(path.join(src,'gallery.js'),path.join(dest,'gallery-before-import.js'));fs.copyFileSync(path.join(src,'i18n.js'),path.join(dest,'i18n-before-import.js'));fs.copyFileSync(path.join(src,'index.html'),path.join(dest,'index-before-import.html'));
console.log('Original service adapter and private-preserving UI integrations retained outside the public source.');
