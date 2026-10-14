'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..','src');
let file=path.join(root,'extra-districts.js'),s=fs.readFileSync(file,'utf8');if(!s.includes('facilities:{artists:artStation}')){const a='mathDeduplication,canStand,region,entryFor';if(!s.includes(a))throw Error('Missing source facilities API anchor.');s=s.replace(a,'mathDeduplication,facilities:{artists:artStation},canStand,region,entryFor');fs.writeFileSync(file,s);}
file=path.join(root,'city-integration.js');s=fs.readFileSync(file,'utf8');
if(s.includes('createSharedActivities'))throw Error('Activities already installed.');
function replace(a,b){if(!s.includes(a))throw Error('Missing activities hook: '+a.slice(0,100));s=s.replace(a,b);}
replace("import {createSharedResidents} from './shared-residents.js';","import {createSharedResidents} from './shared-residents.js';\nimport {createSharedActivities} from './shared-activities.js';");
replace('M.city.region=(x,z)=>current(x,z)||oldRegion(x,z);',"const activities=createSharedActivities(T,{main:M,extras:E,navigation});window.CITY_ACTIVITIES=activities;\n M.city.region=(x,z)=>activities.stationAt(x,z)||current(x,z)||oldRegion(x,z);");
replace('M.city.canStand=(x,z)=>{','M.city.canStand=(x,z)=>{if(!activities.canStand(x,z))return false;');
replace("M.city.targetInfo=d=>{","M.city.targetInfo=d=>{if(d.sharedFacility)return{kind:'home-source',data:d,title:d.label||''};");
replace('oldUpdate(...args);E.update(...args);const time=args[1],p=M.player;', 'oldUpdate(...args);E.update(...args);const time=args[1],p=M.player;activities.update(time);');
replace('residentState:socrates.state()||source.residentState,','seated:activities.seated||source.seated,residentState:socrates.state()||source.residentState,');
replace('M.toolsExtra=()=>{const r=current();','M.toolsExtra=()=>{if(activities.stationAt(M.player.x,M.player.z)){M.homeCommand(\'openCollection\');return true;}const r=current();');
replace('const remote=socrates.handle(d.action,d.args||[]);','const activity=activities.handle(d.action,d.args||[]);if(activity.handled){reply(d,activity.value);return true;}\n    const remote=socrates.handle(d.action,d.args||[]);');
replace('const result=await E.updateNetwork(a);','const result=await E.updateNetwork(a);activities.updateNetwork(a);');
replace("else if(d.action==='prepareCity')result=true;","else if(d.action==='prepareCity'){if(!['home','artists','makers','mathematics','objects'].includes(a))throw Error(CITY_I18N.tx('یک محلهٔ متصل انتخاب کنید.','Choose a connected source district.'));result=true;}");
replace('socrates.dispose();residents.dispose();E.dispose();','activities.dispose();socrates.dispose();residents.dispose();E.dispose();');
fs.writeFileSync(file,s);console.log('Source travel stations, cargo, landmarks and remote seating wired.');
