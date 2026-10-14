'use strict';
// The existing safe publisher's Windows Credential Manager pattern is reused here.
// Tokens stay in memory and never enter argv, files, repository content or logs.
const {spawnSync}=require('node:child_process');
class GitHub {
  constructor(owner){this.owner=owner;const p=spawnSync('git',['-c','credential.interactive=never','credential','fill'],{input:`protocol=https\nhost=github.com\nusername=${owner}\n\n`,encoding:'utf8',windowsHide:true,timeout:30000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'}});if(p.status!==0)throw Error('Existing GitHub login is unavailable.');const fields=Object.fromEntries(p.stdout.split(/\r?\n/).filter(s=>s.includes('=')).map(s=>{const i=s.indexOf('=');return[s.slice(0,i),s.slice(i+1)];}));if(!fields.password)throw Error('Existing GitHub login is unavailable.');this.token=fields.password;}
  async api(route,method='GET',body,allow404=false){const r=await fetch('https://api.github.com/'+route,{method,headers:{Authorization:'Bearer '+this.token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'city-of-ideas-publisher'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});if(r.status===404&&allow404)return null;if(!r.ok)throw Error(`GitHub ${method} ${route}: HTTP ${r.status}`);return r.status===204?null:r.json();}
  async identity(){const u=await this.api('user');if(u.login.toLowerCase()!==this.owner.toLowerCase())throw Error('Stored GitHub account differs from the project owner.');return{login:u.login,id:u.id};}
}
module.exports={GitHub};
