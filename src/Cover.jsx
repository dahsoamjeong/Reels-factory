import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRAND} from './Reel';

// 릴스 표지 (1080×1920)
// 통일 규칙:
//  - 이름표는 모든 표지에서 같은 위치
//  - 사진은 확대하지 않고 원래 구도 그대로 (화면을 채우는 만큼만)
//  - 얼굴(face)이 이름표에 가릴 만큼 위에 있으면 사진을 아래로 내리고, 빈 곳은 가장자리 색으로 채움
//  - "Ep N." 과 제목은 모든 표지에서 같은 높이, 한 줄 (긴 제목은 글자 크기만 줄임)
const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
`;

const W = 1080, H = 1920;
export const COVER_LAYOUT = {tagTop: 330, minFaceY: 600, epTop: 1250, titleMax: 168, titleWidth: 900};

const Dot = () => (
  <span style={{display: 'inline-block', width: '0.2em', height: '0.2em', borderRadius: '50%',
    background: BRAND.red, marginLeft: '0.06em'}} />
);

// 제목 글자 폭 대략 계산(한글 0.92em, 공백 0.3em, 영문·숫자 0.6em) → 한 줄에 들어가는 글자 크기
const titleFontSize = (t) => {
  const em = [...t].reduce((a, ch) => a + (ch === ' ' ? 0.3 : /[가-힣]/.test(ch) ? 0.92 : 0.6), 0) + 0.25;
  return Math.min(COVER_LAYOUT.titleMax, Math.floor(COVER_LAYOUT.titleWidth / em));
};

// 사진은 확대하지 않고 화면을 채우는 데 필요한 만큼만 맞춤 (원래 구도 유지)
// 사진이 화면보다 넓으면 얼굴이 가운데 오게 좌우만 이동
// 얼굴이 이름표 밑으로 들어갈 만큼 위에 있으면, 그만큼만 아래로 내리고 위는 가장자리 색으로 채움
const placePhoto = ({srcW, srcH, face}) => {
  const s = Math.max(W / srcW, H / srcH);
  const w = srcW * s, h = srcH * s;
  const x = face ? Math.min(0, Math.max(W - w, W / 2 - face.x * s)) : (W - w) / 2;
  let y = (H - h) / 2;
  if (face && face.y * s + y < COVER_LAYOUT.minFaceY) y = COVER_LAYOUT.minFaceY - face.y * s;
  return {s, w, h, x, y};
};

const Background = (p) => {
  const {image, srcW, srcH, face, fillTop = '#000', fillBottom = '#000'} = p;
  if (!srcW || !srcH) {
    return <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.imagePosition || '50% 50%'}} />;
  }
  const {w, h, x, y} = placePhoto({srcW, srcH, face});
  const topGap = Math.max(0, y), bottomGap = Math.max(0, H - (y + h));
  const fadeTop = topGap > 0 ? 'transparent 0, #000 10%' : '#000 0';
  const fadeBottom = bottomGap > 0 ? '#000 90%, transparent 100%' : '#000 100%';
  return (
    <>
      <AbsoluteFill style={{background: `linear-gradient(to bottom, ${fillTop} 0, ${fillTop} 50%, ${fillBottom} 50%, ${fillBottom} 100%)`}} />
      <Img src={staticFile(image)} style={{position: 'absolute', left: x, top: y, width: w, height: h,
        WebkitMaskImage: `linear-gradient(to bottom, ${fadeTop}, ${fadeBottom})`,
        maskImage: `linear-gradient(to bottom, ${fadeTop}, ${fadeBottom})`}} />
    </>
  );
};

export const Cover = (props) => {
  const {seriesTitle, episode, episodeTitle} = props;
  const title = (episodeTitle || '').replace(/\n/g, ' ');
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Pretendard, sans-serif', color: BRAND.white}}>
      <style>{fontCss}</style>
      <Background {...props} />
      <AbsoluteFill style={{background:
        'linear-gradient(to bottom,rgba(0,0,0,.55) 0,rgba(0,0,0,.25) 20%,rgba(0,0,0,0) 32%,rgba(0,0,0,0) 52%,rgba(0,0,0,.6) 66%,rgba(0,0,0,.7) 85%,rgba(0,0,0,.55) 100%)'}} />

      {/* 이름표: [로고] | 시리즈 제목 + 빨간 밑줄 */}
      <div style={{position: 'absolute', top: COVER_LAYOUT.tagTop, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.5))'}}>
        <div style={{display: 'flex', alignItems: 'center', paddingBottom: 16, borderBottom: `6px solid ${BRAND.red}`, whiteSpace: 'nowrap'}}>
          <Img src={staticFile(BRAND.logoWhite)} style={{height: 32, width: 'auto'}} />
          <span style={{width: 2, height: 34, background: 'rgba(255,255,255,.55)', margin: '0 20px'}} />
          <span style={{fontWeight: 600, fontSize: 42, letterSpacing: '-0.01em'}}>{seriesTitle}</span>
        </div>
      </div>

      {/* 회차 + 제목 (항상 같은 높이, 한 줄) */}
      <div style={{position: 'absolute', top: COVER_LAYOUT.epTop, left: 0, right: 0, textAlign: 'center',
        textShadow: '0 2px 4px rgba(0,0,0,.45), 0 4px 30px rgba(0,0,0,.5)'}}>
        <div style={{fontWeight: 800, fontSize: 64, letterSpacing: '0.02em', opacity: 0.95, lineHeight: 1}}>Ep{episode}.</div>
        <div style={{height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
          <span style={{fontWeight: 900, fontSize: titleFontSize(title), letterSpacing: '-0.05em', lineHeight: 1, whiteSpace: 'nowrap'}}>
            {title}<Dot />
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
