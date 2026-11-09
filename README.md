# Reels Factory · SOAMING LAB.

SOAMING LAB 릴스를 **같은 디자인으로 공장처럼** 찍어내는 편집 템플릿이에요.
영상마다 바꾸는 건 `episodes/` 폴더의 설정 파일(JSON) 하나뿐이에요.

## 스타일

| | A. 클린 랩 (기본) | B. 에디토리얼 |
|---|---|---|
| 글꼴 | Pretendard | Pretendard + Oswald(영어) |
| 이름표 | 가운데 검은 박스 안에 [로고 \| 시리즈 제목] | 왼쪽 정렬 [로고 \| 시리즈 제목] + 빨간 밑줄 + 회차 제목 |
| 어울리는 영상 | 대부분의 인터뷰 | 감성적인 이야기, 가끔 변화 줄 때 |

브랜드 색·이름은 `src/Reel.jsx` 맨 위 `BRAND`에서 한 번에 바꿔요. (빨강: 로고 점 색 `#CD2E1D`)

## 영상 한 편 만들기

1. 원본 영상을 `public/` 폴더에 넣어요. (예: `public/ep07.mp4`, 세로 1080×1920 권장)
2. `episodes/sample.json`을 복사해서 내용을 바꿔요.

```json
{
  "video": "ep07.mp4",
  "style": "A",
  "durationSec": 12,
  "seriesTitle": "Move to Find Yourself",
  "episode": 1,
  "episodeTitle": "기세와 에너지",
  "captions": [
    {"start": 0.3, "end": 3.6, "small": "작은 줄", "big": "크게 보여줄 핵심 문장", "en": "English translation"}
  ],
  "pops": [
    {"start": 1.6, "end": 3.4, "text": "강조단어"},
    {"start": 7.6, "end": 11.6, "scatter": ["흩어지는 문구1", "문구2", "문구3"]}
  ]
}
```

- `style`: `"A"` 또는 `"B"`
- **포인트 글꼴(가끔 쓰기)**: 자막 한 줄이나 강조 단어에 `"font": "myeongjo"`를 붙이면 그 부분만 나눔명조로 바뀌어요.
  작은 줄과 영어 번역은 읽기 쉽게 항상 Pretendard로 남아요.
  예: `{"start": 1.6, "end": 3.4, "text": "완벽", "font": "myeongjo"}`
- `font` (영상 전체, 선택): `"pretendard"` · `"myeongjo"` · `"dohyeon"` — 스타일 기본 글꼴을 통째로 바꿀 때만 써요
- `episode`, `episodeTitle`: 넣으면 이름표 아래에 `Ep1. 기세와 에너지`처럼 회차 제목이 붙어요 (빼도 돼요)
- 자막 줄바꿈 위치를 직접 정하려면 `big` 안에 `\n`을 넣어요 (예: `"안 죽었으면\n하나님 뜻이 있다"`)
- `pops`: `text`는 큰 강조 단어, `scatter`는 화면 곳곳에 떠오르는 짧은 문구 (A·B 모두 사용 가능)

3. 렌더링해요.

```bash
npm install
npx remotion render src/index.jsx Reel out/ep07.mp4 --props=episodes/ep07.json
```

미리보기(브라우저에서 보면서 확인): `npm run studio`

## 클라우드 세션 참고

- 렌더링용 브라우저는 `remotion.config.js`에서 환경에 미리 깔린 Chromium을 쓰도록 지정돼 있어요. 다른 컴퓨터에서는 이 줄을 지워도 돼요.
- 자막·편집 도구 설치: `scripts/setup-tools.sh`

## 라이선스 참고

Remotion은 개인과 3인 이하 회사는 무료이고, 그보다 큰 회사는 회사용 라이선스가 필요해요. (https://remotion.dev/license)

## 다음에 만들 것

- [ ] 원본 영상 → Whisper 자동 받아 적기 (음악·무음 구간 먼저 걸러내기)
- [ ] 말버릇("아, 어, 음")·숨소리·멈춤 자동 제거
- [ ] 자막 다듬기 + 영어 번역 → 설정 파일 자동 생성
- [ ] 인트로 카드 이미지 템플릿
- [ ] 게시글 초안 자동 작성
