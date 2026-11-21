set -ex
cd ~/video-tools/tts
[ -d OpenVoice ] || git clone -q --depth 1 https://github.com/myshell-ai/OpenVoice
[ -d MeloTTS ] || git clone -q --depth 1 https://github.com/myshell-ai/MeloTTS
[ -d .venv ] || uv venv -q -p /usr/bin/python3.11 .venv
. .venv/bin/activate
uv pip install -q --index-url https://download.pytorch.org/whl/cpu "torch==2.5.1" "torchaudio==2.5.1"
python -c "import torch; print('torch', torch.__version__)"
uv pip install -q "numpy<2"
uv pip install -q -e ./MeloTTS
uv pip install -q -e ./OpenVoice --no-deps
uv pip install -q wavmark==0.0.3 librosa==0.9.1 pydub inflect unidecode eng_to_ipa langid "huggingface_hub<0.26"
python - <<'PY'
from huggingface_hub import snapshot_download
snapshot_download('myshell-ai/OpenVoiceV2', local_dir='ckpt_v2')
snapshot_download('myshell-ai/MeloTTS-Korean', local_dir='melo_ko')
print('models ok')
PY
echo SETUP_DONE
