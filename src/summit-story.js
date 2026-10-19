/* One optional summit event, using the existing child, roof and crater. */
(function(g){'use strict';
g.createSummitStory=function(T,{roof,mountain,figure,volcano,lava,figureLight,coreLight}){
 const child=mountain.infant,baseY=-2.16+(volcano.userData.figureRise||0),landingHeight=volcano.userData.landingHeight||12.35,coreIntensity=volcano.userData.coreIntensity||150,clamp=T.MathUtils.clamp,smooth=u=>u*u*(3-2*u);
 let mode='explore',phase='explore',elapsed=0,following=false,lastCamera=null;
 const active=()=>['arrival','crawl','poise','leap','flare','emerge'].includes(phase);
 const glowMaterial=new T.MeshBasicMaterial({color:0xffdeb0,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending});
 const glow=new T.Mesh(new T.SphereGeometry(1,24,16),glowMaterial);glow.name='Summit transformation light';glow.position.set(0,17+(volcano.userData.figureRise||0),0);glow.visible=false;volcano.add(glow);
 function setPhase(value){phase=value;elapsed=0;}
 function rest(){glow.visible=false;glowMaterial.opacity=0;mountain.setCrawling(false);child.rotation.z=0;}
 function setMode(value){if(value!==mode){mode=value==='story'?'story':'explore';roof.reset();rest();following=false;lastCamera=null;setPhase(mode==='story'?'armed':'explore');apply(0);}}
 function finish(keepView=false){if(mode!=='story')return;roof.reset();rest();setPhase('complete');following=keepView&&following;if(!following)lastCamera=null;apply(0);}
 function reachSummit(reduced=false){if(mode!=='story'||phase!=='armed')return false;roof.reset();setPhase('arrival');if(reduced)finish();return true;}
 function beginFromRoof(reduced=false){if(active()||phase==='complete')return false;mode='story';rest();following=false;lastCamera=null;if(roof.state.target!==roof.total)roof.invite(false,3.2);setPhase(roof.state.atRoof?'poise':'crawl');if(reduced)finish();else apply(0);return true;}
 function replay(player,reduced=false){if(mode!=='story'||phase!=='complete'||Math.hypot(player.x-125,player.z)<8)return false;roof.reset();rest();following=false;lastCamera=null;setPhase('armed');return reachSummit(reduced);}
 function apply(time){
  const shown=mode==='explore'||phase==='complete'||phase==='emerge';
  child.visible=mode==='explore'||!['flare','emerge','complete'].includes(phase);
  figure.visible=shown;
  const reveal=phase==='emerge'?smooth(clamp(elapsed/5,0,1)):1;
  figure.position.y=baseY-(1-reveal)*22+(shown?.12*Math.sin(time*.28)*reveal:0);
  if(figureLight)figureLight.intensity=shown?65*reveal:0;
  if(coreLight)coreLight.intensity=mode==='story'&&phase!=='complete'?coreIntensity*.65:coreIntensity;
  if(mode==='story'&&!['flare','emerge','complete'].includes(phase))lava.emissiveIntensity=2.8;
  if(phase==='poise'){child.position.y=roof.height-.02+.16*Math.sin(Math.PI*clamp(elapsed/1.6,0,1));}
  if(phase==='leap'){
   const u=clamp(elapsed/3.2,0,1),arc=Math.sin(Math.PI*u);
   child.position.set(24.75*(1-u)-125,roof.height-.02+(landingHeight-roof.height+.02)*u+14*arc,0);
   child.rotation.y=0;child.rotation.z=-.1*arc;
  }
  glow.visible=phase==='flare'||phase==='emerge';
  if(glow.visible){const pulse=phase==='flare'?Math.sin(Math.PI*clamp(elapsed/1.6,0,1)):.18*(1-clamp(elapsed/5,0,1));glow.scale.setScalar(7+5*pulse);glowMaterial.opacity=.3*pulse;if(coreLight)coreLight.intensity=coreIntensity+450*pulse;lava.emissiveIntensity=2.8+1.4*pulse;}
 }
 function update(dt,time,player,visitMode,{paused=false,reduced=false}={}){
  if(!['peak','roof','aerial'].includes(visitMode))following=false;
  if(active()&&!['peak','roof','aerial'].includes(visitMode)){finish();return;}
  if(active()&&reduced){finish();return;}
  if(active()&&!paused){elapsed+=Math.min(.1,Math.max(0,dt));
   if(phase==='arrival'&&elapsed>=1.6){roof.invite(false,3.2);setPhase('crawl');}
   else if(phase==='crawl'&&roof.state.atRoof)setPhase('poise');
   else if(phase==='poise'&&elapsed>=1.6){mountain.setCrawling(false);setPhase('leap');}
   else if(phase==='leap'&&elapsed>=3.2)setPhase('flare');
   else if(phase==='flare'&&elapsed>=1.6)setPhase('emerge');
   else if(phase==='emerge'&&elapsed>=5)finish(true);
  }
  apply(time);
 }
 function updateCamera(camera,dt,reduced=false){
  if(!following||!active()&&phase!=='complete'||reduced){lastCamera=null;return;}
  const crawling=['arrival','crawl','poise'].includes(phase),x=125+child.position.x,y=child.position.y;
  const target=new T.Vector3(crawling?x-2:0,crawling?y+2:22,0),position=new T.Vector3(crawling?x+14:24,crawling?y+9:43,19);
  if(!lastCamera)lastCamera=camera.position.clone();lastCamera.lerp(position,1-Math.exp(-Math.min(.1,dt)*2.5));camera.position.copy(lastCamera);camera.lookAt(target);
 }
 function follow(value){following=!!value;lastCamera=null;}
 function dispose(){glow.removeFromParent();glow.geometry.dispose();glowMaterial.dispose();}
 return{setMode,reachSummit,beginFromRoof,replay,finish,follow,update,updateCamera,dispose,get state(){return{mode,phase,active:active(),elapsed,following,waiting:phase==='crawl'&&roof.state.waiting};}};
};

g.mountSummitStoryUI=function(story,{language,getPlayer,getVisitMode,isPaused=()=>false,readChapter=()=>{},reduced=false}){
 const words={
  en:{begin:'Begin the story ascent',legend:'Choose your experience',explore:'Free exploration',story:'Summit story',armed:'Reach the summit to begin the transformation.',arrival:'The child turns toward the light.',crawl:'Follow the child toward the gallery opening.',waiting:'Step aside to let the child pass.',poise:'At the edge, a moment of stillness.',leap:'The child leaps into the light.',flare:'A transformation begins.',emerge:'The Übermensch emerges.',complete:'The transformation is complete.',skip:'Skip animation',follow:'Follow the scene',free:'Return to my view',replay:'Replay transformation',aside:'Step away from the child’s starting place to replay.',note:'An imagined scene for this city, inspired by Zarathustra.'},
  de:{begin:'Den Aufstieg als Geschichte beginnen',legend:'Erlebnis wählen',explore:'Frei erkunden',story:'Gipfelgeschichte',armed:'Erreiche den Gipfel, um die Verwandlung zu beginnen.',arrival:'Das Kind wendet sich dem Licht zu.',crawl:'Folge dem Kind zur Öffnung im Galeriedach.',waiting:'Tritt zur Seite und lass das Kind vorbei.',poise:'Am Rand ein Moment der Stille.',leap:'Das Kind springt ins Licht.',flare:'Eine Verwandlung beginnt.',emerge:'Der Übermensch erhebt sich.',complete:'Die Verwandlung ist vollendet.',skip:'Animation überspringen',follow:'Der Szene folgen',free:'Zu meiner Ansicht zurückkehren',replay:'Verwandlung erneut ansehen',aside:'Verlasse den Startplatz des Kindes, um die Szene erneut anzusehen.',note:'Eine für diese Stadt erdachte Szene, inspiriert von Zarathustra.'},
  fa:{begin:'آغاز صعود داستانی',legend:'شیوهٔ تجربه را انتخاب کنید',explore:'گردش آزاد',story:'داستان قله',armed:'برای آغاز دگرگونی به قله برسید.',arrival:'کودک رو به روشنایی می‌کند.',crawl:'کودک را تا گشودگی بام گالری همراهی کنید.',waiting:'کمی کنار بروید تا کودک بگذرد.',poise:'لحظه‌ای سکون در آستانه.',leap:'کودک به درون روشنایی می‌جهد.',flare:'دگرگونی آغاز می‌شود.',emerge:'ابرانسان پدیدار می‌شود.',complete:'دگرگونی به پایان رسیده است.',skip:'پایان پویانمایی',follow:'دنبال کردن صحنه',free:'بازگشت به نگاه من',replay:'بازپخش دگرگونی',aside:'برای بازپخش از جای آغاز کودک کمی فاصله بگیرید.',note:'صحنه‌ای خیالی برای این شهر، با الهام از زرتشت.'}
 };
 const choice=document.createElement('fieldset');choice.className='experience-choice';choice.id='city-experience';
 const legend=document.createElement('legend');choice.append(legend);
 const options={};for(const value of['explore','story']){const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='radio';input.name='city-experience';input.value=value;input.checked=value==='explore';input.onchange=()=>{if(input.checked)story.setMode(value);};label.append(input,span);choice.append(label);options[value]=span;}
 document.querySelector('.welcome').insertBefore(choice,document.getElementById('enter'));
 const panel=document.createElement('aside');panel.id='summit-story';panel.className='summit-story';panel.hidden=true;
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const note=document.createElement('small'),actions=document.createElement('div');actions.className='story-actions';
 function button(id,handler){const b=document.createElement('button');b.type='button';b.id=id;b.className='glass';b.onclick=handler;actions.append(b);return b;}
 const begin=button('story-begin-roof',()=>story.beginFromRoof(reduced));
 const skip=button('story-skip',()=>story.finish()),follow=button('story-follow',()=>story.follow(!story.state.following)),replay=button('story-replay',()=>story.replay(getPlayer(),reduced)),read=button('story-read',readChapter);
 panel.append(status,note,actions);document.body.append(panel);let key='',uiKey='';
 function update(){const s=story.state,p=getPlayer(),visit=getVisitMode(),w=words[language()]||words.en;
  
  const near=Math.abs(p.y-34.195)<3&&(Math.hypot(p.x-125,p.z)<25||Math.hypot(p.x,p.z)<55);
  const renderKey=[language(),s.mode,s.phase,s.waiting,s.following,visit,near,isPaused(),Math.hypot(p.x-125,p.z)<8].join(':');if(renderKey===uiKey)return;uiKey=renderKey;legend.textContent=w.legend;options.explore.textContent=w.explore;options.story.textContent=w.story;if(!document.getElementById('city-start-modes'))document.getElementById('enter').textContent=s.mode==='story'?w.begin:g.CITY_I18N.t('enter');
  document.body.dataset.storyFollowing=String(s.following);document.body.dataset.storyActive=String(s.active);
  const canBegin=['roof','peak'].includes(visit)&&s.mode==='explore';begin.hidden=!canBegin;begin.textContent=language()==='fa'?'کودک را تا آتشفشان همراهی کن':language()==='de'?'Das Kind zum Vulkan begleiten':'Begin the child’s journey to the volcano';for(const input of choice.querySelectorAll('input'))input.checked=input.value===s.mode;
  panel.hidden=isPaused()||!canBegin&&s.mode!=='story'||visit==='overview'||visit==='aerial'||visit==='return'||!(canBegin||s.active||s.phase==='complete'&&near);document.body.dataset.storyPanel=String(!panel.hidden);
  const blocked=s.phase==='complete'&&Math.hypot(p.x-125,p.z)<8,phase=s.waiting?'waiting':blocked?'aside':s.phase,next=language()+phase;
  if(next!==key){status.textContent=canBegin?(language()==='fa'?'راه روشن به آتشفشان می‌رسد.':language()==='de'?'Der helle Weg führt zum Vulkan.':'The light stone path leads straight to the volcano.'):(w[phase]||'');note.textContent=w.note;key=next;}
  skip.textContent=w.skip;follow.textContent=s.following?w.free:w.follow;replay.textContent=w.replay;
  read.textContent=language()==='fa'?'خواندن فصل':language()==='de'?'Kapitel lesen':'Read chapter';read.hidden=s.phase!=='complete';
  skip.hidden=!s.active;follow.hidden=!s.active&&s.phase!=='complete'||reduced;follow.setAttribute('aria-pressed',String(s.following));replay.hidden=s.phase!=='complete';replay.disabled=blocked;
 }
 update();return{update,dispose(){choice.remove();panel.remove();}};
};
})(window);
