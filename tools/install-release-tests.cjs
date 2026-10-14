'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..'),source=path.join(root,'integrations/home-language-addon/release-tests'),dest=path.join(root,'tests');
for(const [name,target]of [['protocol-smoke.mjs','home-protocol.mjs'],['language-smoke.mjs','home-language.mjs'],['scene-restore-smoke.mjs','home-restore.mjs']]){let text=fs.readFileSync(path.join(source,name),'utf8').replaceAll('../../../src/','../src/');fs.writeFileSync(path.join(dest,target),text);}
console.log('Installed source-backed synthetic protocol, language and restore checks.');
