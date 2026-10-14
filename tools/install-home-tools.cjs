'use strict';
const fs=require('node:fs'),path=require('node:path'),{files,checkFiles,inventory,assertCopy}=require('./source-guard.cjs');
const root=path.resolve(__dirname,'..'),from=path.join(root,'integrations/home-tools'),to=path.join(root,'src/city-source-assets/home-tools');
if(!fs.existsSync(path.join(from,'city-tools-entry.js')))throw Error('No completed House tools adapter.');
const entries=files(from);checkFiles(from,entries);const expected=inventory(from,entries);
if(fs.existsSync(to))throw Error('House tools already installed; preserve and reconcile them before replacing.');
fs.cpSync(from,to,{recursive:true});
assertCopy(to,expected);
console.log('Installed full original House tools adapter. Run the release checks and browser QA before publication.');
