'use strict';
const fs=require('node:fs'),path=require('node:path'),guard=require('./source-guard.cjs');
const root=path.resolve(__dirname,'..'),source=process.argv[2]&&path.resolve(process.argv[2]),dest=path.join(root,'src');
if(!source||!fs.existsSync(path.join(source,'index.html')))throw Error('Pass the stable city dist directory as the sole argument.');
if(source===dest||source.startsWith(root+path.sep))throw Error('The incoming builder source must be outside this project.');
if(fs.lstatSync(source).isSymbolicLink())throw Error('The incoming builder source must not be a symbolic link.');
const sourceReal=fs.realpathSync(source),rootReal=fs.realpathSync(root),relative=path.relative(rootReal,sourceReal);
if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('The incoming source resolves inside this project.');
const allowed=new Set(['.html','.js','.mjs','.css','.json','.webmanifest','.webp','.png','.jpg','.jpeg','.gif','.svg','.ico','.glb','.gltf','.bin','.wav','.mp3','.ogg','.mp4','.webm','.pdf','.wasm','.woff','.woff2','.ttf','.txt','.md','.map']);
function sourceFiles(){const entries=guard.files(source,{ignoreDirectories:new Set(['node_modules','.git','.openai'])});guard.checkFiles(source,entries);return entries.filter(p=>allowed.has(path.extname(p).toLowerCase()));}
function manifest(){return guard.inventory(source,sourceFiles());}
const before=manifest(),staging=path.join(root,'source-staging.local');
if(fs.existsSync(staging))throw Error('A previous source staging directory exists; review it first.');
fs.mkdirSync(staging);for(const entry of before){const target=path.join(staging,entry.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(source,entry.path),target);}
const after=manifest();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Builder source changed during transfer; staging is preserved for review.');
guard.assertCopy(staging,before);
guard.checkFiles(staging,guard.files(staging));
if(fs.existsSync(dest)&&fs.lstatSync(dest).isSymbolicLink())throw Error('Existing source snapshot must not be a symbolic link.');
if(fs.existsSync(dest)){const backup=path.join(root,'source-backup-'+Date.now()+'.local');fs.renameSync(dest,backup);console.log('Previous source preserved in '+path.basename(backup));}
fs.renameSync(staging,dest);
const metadata={project:'City of Ideas',sourceProject:'Zarathustra continuous city builder',importedAt:new Date().toISOString(),sourceContentHash:guard.contentHash(before),files:before.length,bytes:before.reduce((n,e)=>n+e.bytes,0)};
fs.writeFileSync(path.join(root,'docs/source-snapshot.json'),JSON.stringify(metadata,null,2)+'\n');
console.log(JSON.stringify(metadata));
