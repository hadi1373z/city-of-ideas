'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const root=path.resolve(__dirname,'..'),source=path.resolve(process.argv[2]||''),dest=path.join(root,'src');
if(path.dirname(source)!==root||!/^source-backup-\d+\.local$/.test(path.basename(source))||!fs.existsSync(source))throw Error('Pass the importer-preserved backup inside this repository.');
const names=['city-source-assets/home-tools','city-source-assets/park-tools/reader-public-fa.js','service','service-init.js','progress.js','favicon.svg','tool-frames.js','city-integration.js','extra-districts.js','home-editions-scene.js','district-navigation.js','shared-residents.js','shared-activities.js','integration.css','version-info.js'];
for(const name of names){if(!fs.existsSync(path.join(source,name)))throw Error('Missing retained integration: '+name);}
const stableHomeDictionary=path.join(dest,'city-source-assets/home-tools/public-fa.js');if(fs.existsSync(stableHomeDictionary)){const dictionary=fs.readFileSync(stableHomeDictionary);fs.mkdirSync(path.join(root,'work'),{recursive:true});fs.writeFileSync(path.join(root,'work/owner-stable-home-public-fa.js'),dictionary);console.log('Stable Home dictionary SHA256 '+crypto.createHash('sha256').update(dictionary).digest('hex'));}
const home=path.join(dest,'city-source-assets/home-tools');if(path.relative(dest,home)!==path.join('city-source-assets','home-tools')||fs.lstatSync(home).isSymbolicLink())throw Error('Unexpected copied Home source path.');fs.rmSync(home,{recursive:true});
for(const name of names)fs.cpSync(path.join(source,name),path.join(dest,name),{recursive:true});
// Public record IDs and private authored strings come from the preserved source adapter.
const p=path.join(dest,'progress.js');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace("throw Error('Invalid note versions.');","throw Error(tx('نسخه‌های یادداشت معتبر نیستند.','Invalid note versions.'));"));
const translations=fs.readFileSync(path.join(dest,'city-source-assets/home-tools/city-tools-merged-public-fa.js'),'utf8');if(!translations.includes('OWNER_PUBLIC_KEY_COUNT'))throw Error('Full authored public translations were not retained.');
console.log('Original service, exact district geometry, public translation adapter and persistent tools restored.');
