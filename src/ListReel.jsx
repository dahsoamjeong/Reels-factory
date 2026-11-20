import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

// 목록 릴스: 영상 위에 검은 제목 박스 + 반투명 판에 번호 목록
// (예: "대표가 되어 깨달은 것" 1~10). 화면 내내 그대로 떠 있어서
// 멈춰서 읽거나 다시 보게 만드는 형식.
const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
`;

export const ListReel = ({
  video, title, items = [],
  top = 700,            // 제목 박스 위쪽 위치(px)
  videoShiftY = 0,      // 영상을 위로 올릴 만큼(px). 아래가 비므로 가급적 videoScale을 쓰기
  videoScale = 1,       // 아래쪽 기준 확대. 화면을 꽉 채운 채 얼굴만 위로 올라감
  titleSize = 56, itemSize = 34,
  panelOpacity = 0.55, itemGap = 6, lineHeight = 1.36,
  textRight = 150,      // 오른쪽 여백: Instagram 좋아요·댓글 버튼과 겹치지 않게
  muted = false,
  numbered = true,      // false면 번호 없이 문단 글. 빈 줄("")은 문단 사이 간격
  paraGap = 24,
}) => (
  <AbsoluteFill style={{background: '#000', fontFamily: 'Pretendard, sans-serif'}}>
    <style>{fontCss}</style>
    {/* 영상을 위로 올리면 아래가 비므로, 같은 영상을 크게 흐리게 깔아 채움 */}
    {videoShiftY > 0 && (
      <OffthreadVideo src={staticFile(video)} muted
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
          transformOrigin: '50% 100%', transform: 'scale(1.35)', filter: 'blur(28px) brightness(0.8)'}} />
    )}
    <OffthreadVideo src={staticFile(video)} muted={muted}
      style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transformOrigin: '50% 100%',
        transform: `translateY(${-videoShiftY}px) scale(${videoScale})`,
        ...(videoShiftY > 0 ? {
          WebkitMaskImage: `linear-gradient(to top, transparent 0, #000 220px)`,
          maskImage: `linear-gradient(to top, transparent 0, #000 220px)`} : {})}} />
    <div style={{position: 'absolute', top, left: 0, right: 0}}>
      <div style={{display: 'inline-block', marginLeft: 12, background: '#0A0A0A', color: '#fff',
        padding: '18px 30px 20px', fontWeight: 900, fontSize: titleSize, lineHeight: 1.25, letterSpacing: '-0.04em'}}>
        {title.split('\n').map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>)}
      </div>
      <div style={{margin: '0 12px', background: `rgba(40,40,40,${panelOpacity})`, padding: `26px ${textRight}px 30px 36px`,
        color: '#fff', fontWeight: 500, fontSize: itemSize, lineHeight, letterSpacing: '-0.02em'}}>
        {items.map((it, i) => it === '' ? <div key={i} style={{height: paraGap}} /> : (
          <div key={i} style={{display: 'flex', marginTop: i ? itemGap : 0}}>
            {numbered && <div style={{width: '1.55em', flexShrink: 0}}>{items.slice(0, i + 1).filter((x) => x !== '').length}.</div>}
            {/* 한 줄에 안 들어가면 단어 단위로 자동 줄바꿈. \n으로 직접 나눌 수도 있어요 */}
            <div style={{wordBreak: 'keep-all'}}>{it.split('\n').map((l, j) => <div key={j}>{l}</div>)}</div>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
