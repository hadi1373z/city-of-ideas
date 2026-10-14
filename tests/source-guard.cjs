'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),guard=require('../tools/source-guard.cjs');
const root=path.resolve(__dirname,'..'),fixture=fs.mkdtempSync(path.join(root,'source-guard-fixture-'));
function write(name,data){fs.writeFileSync(path.join(fixture,name),data);}
try{
  write('index.html','<!doctype html>\r\n<p>public content</p>\r\n');
  guard.checkFiles(fixture,guard.files(fixture));
  const initial=guard.inventory(fixture);
  assert.equal(guard.contentHash(initial),guard.contentHash(guard.inventory(fixture)));
  write('unexpected.txt','extra copied asset');
  assert.throws(()=>guard.assertCopy(fixture,initial),/Copied source bytes differ/,'Unmanifested files must not be published');
  fs.unlinkSync(path.join(fixture,'unexpected.txt'));
  write('index.html','<!doctype html>\n<p>public content</p>\n');
  assert.throws(()=>guard.assertCopy(fixture,initial),/Copied source bytes differ/,'Line ending changes must invalidate byte integrity');
  write('credentials.json','{}');
  assert.throws(()=>guard.checkFiles(fixture,guard.files(fixture)),/Private runtime file/);
  fs.unlinkSync(path.join(fixture,'credentials.json'));
  const synthetic='sk-'+'proj-'+'A'.repeat(40);
  write('public.js','const key="'+synthetic+'";');
  let message='';try{guard.checkFiles(fixture,guard.files(fixture));}catch(e){message=e.message;}
  assert.match(message,/Possible OpenAI API credential/);
  assert(!message.includes(synthetic),'Credential findings must never print credential values');
  fs.unlinkSync(path.join(fixture,'public.js'));
  write('version.json','{}');
  assert.throws(()=>guard.checkFiles(fixture,guard.files(fixture)),/generated publication metadata/);
  console.log('Source publication guards passed: byte preservation, private paths, redacted credential checks, reserved metadata.');
}finally{
  if(path.dirname(fixture)!==root||!path.basename(fixture).startsWith('source-guard-fixture-'))throw Error('Invalid fixture cleanup target');
  fs.rmSync(fixture,{recursive:true,force:true});
}
