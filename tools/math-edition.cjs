'use strict';
const fs=require('node:fs'),path=require('node:path');
function publishMathEdition({root,target,baseline}){
 const source=path.join(root,'editions','mathematics');
 if(!/^[a-f0-9]{40}$/.test(baseline))throw Error('Mathematics requires an immutable public baseline');
 fs.cpSync(source,target,{recursive:true});
 const html=fs.readFileSync(path.join(source,'index.html'),'utf8').replaceAll('__BASELINE__',baseline);
 fs.writeFileSync(path.join(target,'index.html'),html);
}
module.exports={publishMathEdition};
