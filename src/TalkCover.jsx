import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRAND} from './Reel';

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

export const TalkCover = ({image, title, subtitle, top = 300, titleSize = 104, dark = true, imagePosition = '50% 50%'}) => {
  const ink = dark ? BRAND.black : BRAND.white;
  const lines = title.split('\n');
  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: 'Pretendard, sans-serif'}}>
      <style>{fontCss}</style>
      <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition}} />
      <div style={{position: 'absolute', top, left: 70, right: 70, textAlign: 'center', color: ink}}>
        <Img src={staticFile(dark ? BRAND.logoBlack : BRAND.logoWhite)} style={{height: 30, width: 'auto'}} />
        <div style={{marginTop: 34, fontWeight: 900, fontSize: titleSize, lineHeight: 1.16, letterSpacing: '-0.045em', wordBreak: 'keep-all'}}>
          {lines.map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}{i === lines.length - 1 ? <Dot /> : null}</div>)}
        </div>
        {subtitle && <div style={{marginTop: 22, fontWeight: 600, fontSize: 30, letterSpacing: '-0.01em', opacity: 0.6}}>{subtitle}</div>}
      </div>
    </AbsoluteFill>
  );
};
