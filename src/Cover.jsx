import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRAND} from './Reel';

// 릴스 표지 (1080×1920)
// Instagram 프로필 화면에서는 가운데 부분만 보이므로
// 이름표와 제목은 가운데 안전 구역(위아래 약 290px 안쪽)에 둠
const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
`;

const Dot = () => (
  <span style={{display: 'inline-block', width: '0.2em', height: '0.2em', borderRadius: '50%',
    background: BRAND.red, marginLeft: '0.06em'}} />
);

// layout: "cover"(화면 꽉 채우기, imagePosition으로 위치 조정)
//         "inset"(사진을 아래쪽에 두고 위 빈 곳은 같은 사진을 흐리게 깔기 — 얼굴이 사진 위쪽에 있을 때)
const Background = ({image, layout, imagePosition}) => {
  if (layout === 'inset') {
    return (
      <>
        <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'blur(40px) brightness(.55)', transform: 'scale(1.15)'}} />
        <Img src={staticFile(image)} style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 'auto',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 12%)', maskImage: 'linear-gradient(to bottom, transparent 0, #000 12%)'}} />
      </>
    );
  }
  return <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition}} />;
};

export const Cover = ({image, layout = 'cover', imagePosition = '50% 50%', seriesTitle, episode, episodeTitle, titleTop = 1180}) => (
  <AbsoluteFill style={{background: '#000', fontFamily: 'Pretendard, sans-serif', color: BRAND.white}}>
    <style>{fontCss}</style>
    <Background image={image} layout={layout} imagePosition={imagePosition} />
    <AbsoluteFill style={{background:
      'linear-gradient(to bottom,rgba(0,0,0,.55) 0,rgba(0,0,0,.25) 20%,rgba(0,0,0,0) 32%,rgba(0,0,0,0) 48%,rgba(0,0,0,.6) 64%,rgba(0,0,0,.7) 85%,rgba(0,0,0,.55) 100%)'}} />

    {/* 이름표: [로고] | 시리즈 제목 + 빨간 밑줄 */}
    <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center',
      filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.5))'}}>
      <div style={{display: 'flex', alignItems: 'center', paddingBottom: 16, borderBottom: `6px solid ${BRAND.red}`, whiteSpace: 'nowrap'}}>
        <Img src={staticFile(BRAND.logoWhite)} style={{height: 32, width: 'auto'}} />
        <span style={{width: 2, height: 34, background: 'rgba(255,255,255,.55)', margin: '0 20px'}} />
        <span style={{fontWeight: 600, fontSize: 42, letterSpacing: '-0.01em'}}>{seriesTitle}</span>
      </div>
    </div>

    {/* 회차 + 제목 */}
    <div style={{position: 'absolute', top: titleTop, left: 72, right: 72, textAlign: 'center',
      textShadow: '0 2px 4px rgba(0,0,0,.45), 0 4px 30px rgba(0,0,0,.5)', wordBreak: 'keep-all'}}>
      <div style={{fontWeight: 800, fontSize: 64, letterSpacing: '0.02em', color: BRAND.white, opacity: 0.95}}>
        Ep{episode}.
      </div>
      <div style={{fontWeight: 900, fontSize: 168, letterSpacing: '-0.05em', lineHeight: 1.05, marginTop: 8, whiteSpace: 'pre-line'}}>
        {episodeTitle}<Dot />
      </div>
    </div>
  </AbsoluteFill>
);
