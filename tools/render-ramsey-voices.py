"""Generate the complete six-person cast locally with Kokoro; no account required.

Install kokoro-onnx, then supply the model/voices from its model-files-v1.1 release.
The originals, individual cues and cast manifest are retained for reproducibility.
"""
import argparse
import hashlib
import importlib.metadata
import json
import subprocess
from pathlib import Path
import wave

import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro

CAST = {
    'anonymous': {'voice': 'am_michael', 'lang': 'en-us', 'character': 'Grounded, direct, questioning'},
    'ramsey': {'voice': 'bm_lewis', 'lang': 'en-gb', 'character': 'Youthful, clear, conversational'},
    'turing': {'voice': 'bm_daniel', 'lang': 'en-gb', 'character': 'Restrained, analytical, reflective'},
    'socrates': {'voice': 'bm_george', 'lang': 'en-gb', 'character': 'Warm, patient, curious'},
    'nietzsche': {'voice': 'am_fenrir', 'lang': 'en-us', 'character': 'Firm, precise, thoughtful'},
    'zarathustra': {'voice': 'bm_fable', 'lang': 'en-gb', 'character': 'Resonant, reflective storyteller'},
}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model-dir', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--opening-only', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    cues = json.loads((root/'src/ramsey-film/assets/conversation.json').read_text(encoding='utf-8'))['cues']
    args.output.mkdir(parents=True, exist_ok=True)
    model = args.model_dir/'kokoro-v1.0.onnx'
    voices = args.model_dir/'voices-v1.0.bin'
    options = ort.SessionOptions()
    options.intra_op_num_threads = 4
    options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(model), options, providers=['CPUExecutionProvider'])
    kokoro = Kokoro.from_session(session, str(voices))
    # Runtime releases disagree on the speed tensor dtype. Follow the actual model.
    original_run = session.run
    speed_type = next(i.type for i in session.get_inputs() if i.name == 'speed')
    def run(names, inputs, *rest, **kwargs):
        inputs['speed'] = np.asarray(inputs['speed'], dtype=np.float32 if speed_type == 'tensor(float)' else np.int32)
        return original_run(names, inputs, *rest, **kwargs)
    session.run = run
    manifest = {'provider': 'Local Kokoro', 'model': 'Kokoro-82M v1.0',
                'engine': 'kokoro-onnx', 'engineVersion': importlib.metadata.version('kokoro-onnx'),
                'modelSha256': sha(model), 'voicesSha256': sha(voices), 'speed': 1.0,
                'cast': CAST, 'cues': [], 'license': 'Apache-2.0 (model), MIT (runtime)',
                'source': 'https://github.com/thewh1teagle/kokoro-onnx',
                'review': 'Automated waveform checks; aesthetic listening review still required.'}
    if args.opening_only:
        manifest = json.loads((args.output/'generation.json').read_text(encoding='utf-8'))
    for i, cue in enumerate([] if args.opening_only else cues):
        voice = CAST[cue['speaker']]
        samples, rate = kokoro.create(cue['text'], voice=voice['voice'], lang=voice['lang'], speed=1.0)
        assert len(samples) > 0 and np.isfinite(samples).all(), f'Invalid waveform: {i}'
        pcm = (np.clip(samples, -1, 1)*32767).astype('<i2')
        output = args.output/f'cue-{i:02d}.wav'
        with wave.open(str(output), 'wb') as audio:
            audio.setnchannels(1)
            audio.setsampwidth(2)
            audio.setframerate(rate)
            audio.writeframes(pcm.tobytes())
        duration = len(samples)/rate
        item = {**cue, 'index': i, 'file': output.name, 'voice': voice['voice'],
                'duration': duration, 'sampleRate': rate, 'sha256': sha(output)}
        manifest['cues'].append(item)
        (args.output/'generation.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
        print(f'{i+1}/46 {cue["speaker"]}: {duration:.2f}s (slot {cue["end"]-cue["start"]}s)', flush=True)

    opening = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {OPENING_SCRIPT} from './src/opening-script.js';console.log(JSON.stringify(OPENING_SCRIPT));"], cwd=root))
    manifest['opening'] = []
    for i, beat in enumerate(opening['beats']):
        if beat['speaker'] != 'socrates':
            continue
        text = opening['languages']['en'].get('speechLines', opening['languages']['en']['lines'])[i]
        samples, rate = kokoro.create(text, voice=CAST['socrates']['voice'], lang='en-gb', speed=1.0)
        output = args.output/('opening-en-'+beat['id']+'.wav')
        with wave.open(str(output),'wb') as audio:
            audio.setnchannels(1); audio.setsampwidth(2); audio.setframerate(rate)
            audio.writeframes((np.clip(samples,-1,1)*32767).astype('<i2').tobytes())
        manifest['opening'].append({'file':output.name,'text':text,'voice':'bm_george','duration':len(samples)/rate,'sha256':sha(output)})
        print('Opening '+beat['id']+' recorded', flush=True)
    (args.output/'generation.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')

if __name__ == '__main__':
    main()
