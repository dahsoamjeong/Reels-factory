#!/bin/bash
# 편집 도구 설치: yt-dlp, HyperFrames, whisper.cpp(+small 한국어 모델)
set -e
pip install -q -U yt-dlp
npm i -g hyperframes@0.9.26
mkdir -p /root/video-tools && cd /root/video-tools
[ -d whisper.cpp ] || git clone -q --depth 1 https://github.com/ggml-org/whisper.cpp
cd whisper.cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release >/dev/null
cmake --build build -j4 --config Release >/dev/null
[ -f models/ggml-small.bin ] || sh ./models/download-ggml-model.sh small
ln -sf /root/video-tools/whisper.cpp/build/bin/whisper-cli /usr/local/bin/whisper-cli
