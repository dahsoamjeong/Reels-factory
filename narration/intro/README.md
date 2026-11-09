# 소개 영상 (내레이션 풀버전)

1. `lines.py`에 문장마다 (화면 자막, 읽는 대본)을 적어요. 영어·숫자는 읽는 대본에서 한글 발음으로 풀어요. (예: GPA 4.5 → 지피에이 사 점 오)
2. 목소리 만들기 (무료 AI, MeloTTS 한국어 기본 목소리, 1.2배속):
   `python ../../scripts/tts/gen_base.py spoken.json wav 1.2`
3. `build.py`: 문장 음성을 이어 붙이고, 자막 시간과 장면 목록을 계산해서 `episodes/intro-full.json`을 만들어요.
4. 렌더링: `npx remotion render src/index.jsx Narration out/intro-full.mp4 --props=episodes/intro-full.json`

설치는 `scripts/tts/setup.sh` (PyTorch CPU 버전, MeloTTS, OpenVoice). 실제로는 MeloTTS 기본 목소리만 사용해요.
영상·사진·음성 파일은 `public/intro/`, `public/narration-intro.wav`에 두고 저장소에는 올리지 않아요.
