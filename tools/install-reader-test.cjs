'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),stage=path.join(root,'integrations/reader-locale'),dest=path.join(root,'tests/reader-locale');fs.mkdirSync(dest,{recursive:true});
fs.copyFileSync(path.join(stage,'fixed-inventory.json'),path.join(dest,'fixed-inventory.json'));
const manifest=JSON.parse(fs.readFileSync(path.join(stage,'manifest.json'),'utf8'));delete manifest.sourceInventory;fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
let test=fs.readFileSync(path.join(stage,'test.cjs'),'utf8').replace("path.join(root, 'reader-public-fa.js')","path.resolve(root, '../../src/city-source-assets/park-tools/reader-public-fa.js')").replace('const languagePath = process.argv[2];',"const languagePath = path.resolve(root, '../../src/city-source-assets/park-tools/language.js');");fs.writeFileSync(path.join(dest,'test.cjs'),test);
console.log('Public reader inventory and real matcher checks installed for CI.');
