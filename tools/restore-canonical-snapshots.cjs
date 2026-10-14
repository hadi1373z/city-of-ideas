'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),base=path.resolve(__dirname,'..','src/city-source-assets/home-tools');
for(const [name,expected,bytes]of [['math-city/atlas/index.html','bd07240709cc2626f581556f1b272bc8e118a20a98da4ce2e3b711f3aa4d2da4',977348],['artists-websites.html','5fa732497902c19009f7164612846345c513888f2f21436f1bb93dd8cca168d6',29473162]]){
 const file=path.join(base,name),raw=fs.readFileSync(file),canonical=Buffer.from(raw.toString('utf8').replace(/\r\n/g,'\n'),'utf8');
 const digest=crypto.createHash('sha256').update(canonical).digest('hex');
 if(digest!==expected||canonical.length!==bytes)throw Error('Source differs from its pinned Git blob: '+name);
 if(!raw.equals(canonical))fs.writeFileSync(file,canonical);console.log(name+': '+bytes+' bytes, exact pinned SHA-256.');
}
