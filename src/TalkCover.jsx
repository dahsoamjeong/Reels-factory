import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRAND} from './Reel';
import '@fontsource/noto-serif-kr/900.css';

// 말하는 영상용 표지: 머리 위 빈 벽에 로고 + 제목(검은 글씨)
// 위치는 Instagram 프로필 그리드(가운데 3:4, 위아래 240px 잘림)와
// 릴스 화면(아래 설명글·오른쪽 버튼) 모두에서 가리지 않는 위쪽 가운데
const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
`;
const Dot = () => (
  <span style={{display: 'inline-block', width: '0.18em', height: '0.18em', borderRadius: '50%', background: BRAND.red, marginLeft: '0.06em'}} />
);

export const TalkCover = ({image, title, subtitle, top = 300, titleSize = 108, dark = true, imagePosition = '50% 50%', fadeEnd = 760,
  font = 'sans', layout = 'top', bottom = 300}) => {
  const lines = title.split('\n');
  const serif = font === 'serif';
  const family = serif ? '"Noto Serif KR", serif' : 'Pretendard, sans-serif';
  const isBottom = layout === 'bottom';
  const light = isBottom || !dark;   // 흰 글씨
  const ink = light ? BRAND.white : BRAND.black;
  const shadow = light ? '0 3px 6px rgba(0,0,0,.55), 0 6px 28px rgba(0,0,0,.55)' : 'none';
  const block = (
    <>
      <Img src={staticFile(light ? BRAND.logoWhite : BRAND.logoBlack)} style={{height: 30, width: 'auto', filter: light ? 'drop-shadow(0 2px 6px rgba(0,0,0,.6))' : 'none'}} />
      <div style={{marginTop: 30, fontFamily: family, fontWeight: 900, fontSize: titleSize, lineHeight: serif ? 1.2 : 1.16,
        letterSpacing: serif ? '-0.03em' : '-0.045em', textShadow: shadow}}>
        {lines.map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}{i === lines.length - 1 ? <Dot /> : null}</div>)}
      </div>
      {subtitle && <div style={{marginTop: 24, fontFamily: 'Pretendard', fontWeight: 800, fontSize: Math.min(42, Math.floor(1900 / Math.max(1, subtitle.length))),
        letterSpacing: '-0.01em', color: light ? '#f4f4f4' : '#2a2a2a', whiteSpace: 'nowrap', textShadow: shadow}}>{subtitle}</div>}
    </>
  );
  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: 'Pretendard, sans-serif'}}>
      <style>{fontCss}</style>
      <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition}} />
      {isBottom
        ? <AbsoluteFill style={{background: `linear-gradient(to top, rgba(0,0,0,.6) 0, rgba(0,0,0,.45) ${bottom + 200}px, rgba(0,0,0,0) ${bottom + 560}px)`}} />
        : <AbsoluteFill style={{background: dark
            ? `linear-gradient(to bottom, rgba(255,255,255,.92) 0, rgba(255,255,255,.88) ${fadeEnd - 260}px, rgba(255,255,255,0) ${fadeEnd}px)`
            : `linear-gradient(to bottom, rgba(0,0,0,.6) 0, rgba(0,0,0,.5) ${fadeEnd - 260}px, rgba(0,0,0,0) ${fadeEnd}px)`}} />}
      <div style={{position: 'absolute', ...(isBottom ? {bottom} : {top}), left: 70, right: 70, textAlign: 'center', color: ink}}>{block}</div>
    </AbsoluteFill>
  );
};
