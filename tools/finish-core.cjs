'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'../src'),file=path.join(root,'gallery.js');let s=fs.readFileSync(file,'utf8');
if(!s.includes('CITY_PROGRESS?.open'))s=s.replace("$('reader-title').textContent=chapter.title;","$('reader-title').textContent=chapter.title;window.CITY_PROGRESS?.open(chapter.id);");
s=s.replace("$('chapter-complete').onclick=walkNextChapter","$('chapter-complete').onclick=()=>{window.CITY_PROGRESS?.complete(CITY_BOOK.chapters[readerIndex].id);walkNextChapter()}");
if(!s.includes('CITY_PROGRESS?.position'))s=s.replace('frameCount=0;lastDebugUpdate=t}}',"if(visitMode==='spiral'||visitMode==='peak')window.CITY_PROGRESS?.position(rampTheta);frameCount=0;lastDebugUpdate=t}}");
if(!s.includes('resumeAscent:'))s=s.replace('window.gallery={','window.gallery={resumeAscent:theta=>{enterSpiral();rampTheta=THREE.MathUtils.clamp(theta,0,sharedCity.MAX);const p=sharedCity.pointAt(rampTheta);player.x=p.x;player.z=p.z;player.y=p.y+eye;player.yaw=Math.PI/2-rampTheta;if(rampTheta>=sharedCity.MAX-.0001)setVisitMode(\'peak\');updateSharedHUD();},');
// Exterior building click starts use the same safe-entry logic in every walking district.
s=s.replace("if(visitMode==='city'||!inside){const hits=",'if(true){const hits=');
fs.writeFileSync(file,s);const lang=path.join(root,'i18n.js');fs.writeFileSync(lang,fs.readFileSync(lang,'utf8').replace("name:['گالری زرتشت در شهر','Zarathustra in the City']","name:['شهر ایده‌ها','City of Ideas']"));
console.log('City identity, real reading completion/resume and shared click handling reconciled.');
