# 한국어 문장 -> MeloTTS(KR) 기본 목소리 (목소리 색깔 변환 없음)
import sys, os, json
from melo.api import TTS
TTS_DIR = os.path.expanduser('~/video-tools/tts')
lines_json, out_dir, speed = sys.argv[1], sys.argv[2], float(sys.argv[3])
os.makedirs(out_dir, exist_ok=True)
tts = TTS(language='KR', device='cpu', config_path=f'{TTS_DIR}/melo_ko/config.json', ckpt_path=f'{TTS_DIR}/melo_ko/checkpoint.pth')
spk = tts.hps.data.spk2id['KR']
for i, text in enumerate(json.load(open(lines_json))):
    out = os.path.join(out_dir, f'{i:03d}.wav')
    if not os.path.exists(out):
        tts.tts_to_file(text, spk, out, speed=speed, quiet=True)
        print(i, text[:30], flush=True)
