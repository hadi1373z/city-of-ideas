from pathlib import Path
import json,wave,hashlib,subprocess,shutil
import numpy as np
import argparse
parser=argparse.ArgumentParser(description='Assemble the locally generated 46-line cast without trimming or speeding speech.')
parser.add_argument('--clips',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1];folder=args.clips;assets=root/'src/ramsey-film/assets'
m=json.loads((folder/'generation.json').read_text(encoding='utf-8'))
assert len(m['cues'])==46,'Wait for the full cast before assembling'
backup=folder/'previous-recordings';backup.mkdir(exist_ok=True)
for i in [1,2]:shutil.copy2(assets/f'conversation-{i}.mp3',backup/f'conversation-{i}.mp3')
rate=24000;scheduled=[]
for part in [0,1]:
 audio=np.zeros(rate*300,dtype='<i2');cursor=part*300
 for c in [c for c in m['cues'] if (c['start']>=300)==bool(part)]:
  start=max(c['start'],cursor);end=start+c['duration'];assert end<=(part+1)*300,f'Chapter overflow at cue {c["index"]}'
  with wave.open(str(folder/c['file']),'rb') as w:
   assert w.getframerate()==rate and w.getnchannels()==1
   pcm=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2')
  offset=round((start-part*300)*rate);assert offset+len(pcm)<=len(audio)
  audio[offset:offset+len(pcm)]=pcm;cursor=end+.35
  scheduled.append({**c,'authoredStart':c['start'],'authoredEnd':c['end'],'start':start,'audioEnd':end})
 wav=folder/f'chapter-{part+1}.wav'
 with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(audio.tobytes())
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-c:a','libmp3lame','-q:a','2',str(assets/f'conversation-{part+1}.mp3')],check=True)
for i,c in enumerate(scheduled):c['end']=scheduled[i+1]['start'] if i<45 else 600
# Preserve approved words and all camera directions, adjusting only start/end when a full line needs it.
config={'duration':600,'cues':[{k:c[k] for k in ['start','end','speaker','shot','text','direction']} for c in scheduled]}
(assets/'conversation.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
for f in ['index.html','film.html']:
 p=root/'src/ramsey-film'/f;s=p.read_text(encoding='utf-8');import re
 s,n=re.subn(r'const filmScript=\[[\s\S]*?\];',lambda _: 'const filmScript='+json.dumps(config['cues'],ensure_ascii=False)+';',s);assert n==1
 import re
 s=re.sub(r'assets/(conversation-[12]\.mp3)(?:\?v=[a-z0-9-]+)?',r'assets/\1?v=kokoro-1',s)
 p.write_text(s,encoding='utf-8',newline='\n')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
old=json.loads((assets/'voice-cast.json').read_text(encoding='utf-8'))
registry={'schemaVersion':2,'updated':'2026-11-03','status':'All 46 lines generated locally; six persistent voices active.','policy':'Keep one fixed voice and settings per character across all English scenes.','generation':{k:v for k,v in m.items() if k not in ['cues','cast']},'characters':{},'recordings':[],'cues':scheduled,'previousProvider':'HeyGen quota exhausted; partial recordings retained outside release.'}
for id,voice in m['cast'].items():
 c=next(c for c in scheduled if c['speaker']==id);part=1 if c['start']<300 else 2
 registry['characters'][id]={'voiceKey':'city.'+id+'.kokoro.v1','provider':'Local Kokoro','providerVoiceId':voice['voice'],'model':'Kokoro-82M v1.0','generationSettings':{'language':voice['lang'],'speed':1.0},'character':voice['character'],'reference':{'file':f'conversation-{part}.mp3','startSeconds':c['start']-(part-1)*300,'endSeconds':c['audioEnd']-(part-1)*300,'transcript':c['text'],'sha256':sha(assets/f'conversation-{part}.mp3')}}
for part in [1,2]:registry['recordings'].append({'file':f'conversation-{part}.mp3','sha256':sha(assets/f'conversation-{part}.mp3'),'duration':300})
registry['openingRecordings'] = []
for clip in m.get('opening',[]):
 source=folder/clip['file'];name=clip['file'].replace('opening-','').replace('.wav','.mp3');dest=root/'src/assets/opening'/name
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source),'-c:a','libmp3lame','-q:a','2',str(dest)],check=True)
 registry['openingRecordings'].append({**clip,'file':'../../assets/opening/'+name,'sha256':sha(dest)})
(assets/'voice-cast.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
# A six-voice preview uses each character's first complete line.
parts=[]
for id in m['cast']:
 c=next(c for c in scheduled if c['speaker']==id)
 with wave.open(str(folder/c['file']),'rb') as w:parts.extend([w.readframes(w.getnframes()),bytes(rate*2)])
with wave.open(str(folder/'six-voices.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(parts))
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(folder/'six-voices.wav'),'-c:a','libmp3lame','-q:a','2',str(folder/'six-voices.mp3')],check=True)
print('Assembled all 46 lines, complete six-voice preview and both chapters. Shifted cues:',sum(c['start']!=c['authoredStart'] for c in scheduled))
