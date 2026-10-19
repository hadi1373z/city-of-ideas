"""Optional development-only regeneration of the authored opening's audio."""
import argparse
import asyncio
import json
from pathlib import Path
import subprocess
import edge_tts

parser = argparse.ArgumentParser()
parser.add_argument('--node', default='node')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
script = "import {OPENING_SCRIPT} from './src/opening-script.js'; console.log(JSON.stringify(OPENING_SCRIPT));"
config = json.loads(subprocess.check_output([args.node, '--input-type=module', '-e', script], cwd=root))
output = root / 'src' / 'assets' / 'opening'
output.mkdir(exist_ok=True)
voices = {'en': ['en-GB-SoniaNeural', 'en-GB-RyanNeural'], 'de': ['de-DE-KatjaNeural', 'de-DE-ConradNeural'], 'fa': ['fa-IR-DilaraNeural', 'fa-IR-FaridNeural']}
limit = asyncio.Semaphore(2)

async def render(lang, index, beat):
    async with limit:
        voice = voices[lang][0 if beat['speaker'] == 'narrator' else 1]
        await edge_tts.Communicate(config['languages'][lang].get('speechLines', config['languages'][lang]['lines'])[index], voice, rate='-8%').save(str(output / (lang + '-' + beat['id'] + '.mp3')))
        print(lang + ' ' + beat['id'], flush=True)

async def main():
    await asyncio.gather(*(render(lang, i, beat) for lang in voices for i, beat in enumerate(config['beats'])))

asyncio.run(main())
