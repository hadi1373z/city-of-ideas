'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),fixture=fs.mkdtempSync(path.join(root,'publication-fixture-')),repo=path.join(fixture,'repo'),incoming=path.join(fixture,'incoming');
function run(script,args=[]){return spawnSync(process.execPath,[path.join(repo,'tools',script),...args],{cwd:repo,encoding:'utf8',windowsHide:true,env:{...process.env,GITHUB_SHA:'1'.repeat(40)}});}
function success(result){assert.equal(result.status,0,result.stderr||result.stdout);}
try{
  fs.mkdirSync(path.join(repo,'tools'),{recursive:true});fs.mkdirSync(path.join(repo,'docs'));fs.mkdirSync(incoming);
  for(const file of ['source-guard.cjs','import-source.cjs','build.cjs'])fs.copyFileSync(path.join(root,'tools',file),path.join(repo,'tools',file));
  const original=Buffer.from('<!doctype html>\r\n<p>public fixture</p>\r\n');
  fs.writeFileSync(path.join(incoming,'index.html'),original);fs.writeFileSync(path.join(incoming,'data.bin'),Buffer.from([0,10,13,255]));
  success(run('import-source.cjs',[incoming]));
  assert.deepEqual(fs.readFileSync(path.join(repo,'src/index.html')),original,'Import must preserve exact source bytes');
  success(run('build.cjs'));const version=fs.readFileSync(path.join(repo,'_site/version.json'));
  const manifest=fs.readFileSync(path.join(repo,'_site/asset-manifest.json'));
  success(run('build.cjs'));assert.deepEqual(fs.readFileSync(path.join(repo,'_site/version.json')),version);assert.deepEqual(fs.readFileSync(path.join(repo,'_site/asset-manifest.json')),manifest,'Unchanged source must produce deterministic manifest');
  fs.writeFileSync(path.join(incoming,'public.js'),'const credential="'+'github_pat_'+'A'.repeat(40)+'";');
  const rejected=run('import-source.cjs',[incoming]);assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/Possible GitHub credential/);
  assert(!rejected.stderr.includes('A'.repeat(40)),'Rejected import must not log credential contents');
  assert.deepEqual(fs.readFileSync(path.join(repo,'src/index.html')),original,'Rejected import must not modify the current source');
  assert(!fs.existsSync(path.join(repo,'src/public.js')),'Rejected credential must not reach public source');
  console.log('Import/build fixtures passed: exact bytes, deterministic artifact, credential rejection before replacing source.');
}finally{
  if(path.dirname(fixture)!==root||!path.basename(fixture).startsWith('publication-fixture-'))throw Error('Invalid fixture cleanup target');
  fs.rmSync(fixture,{recursive:true,force:true});
}
