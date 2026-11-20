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
  videoShiftY = 0,      // 영상을 위로 올릴 만큼(px). 얼굴이 목록에 가리지 않게
  fillBottom = '#000',  // 영상을 올려서 아래 비는 곳 색
  titleSize = 56, itemSize = 34,
  panelOpacity = 0.55, itemGap = 6, lineHeight = 1.36,
  textRight = 150,      // 오른쪽 여백: Instagram 좋아요·댓글 버튼과 겹치지 않게
  muted = false,
}) => (
  <AbsoluteFill style={{background: fillBottom, fontFamily: 'Pretendard, sans-serif'}}>
    <style>{fontCss}</style>
    <OffthreadVideo src={staticFile(video)} muted={muted}
      style={{width: '100%', height: '100%', objectFit: 'cover',
        transform: videoShiftY ? `translateY(${-videoShiftY}px)` : undefined}} />
    {videoShiftY > 0 && (
      <AbsoluteFill style={{background: `linear-gradient(to top, ${fillBottom} 0, ${fillBottom} ${videoShiftY}px, transparent ${videoShiftY + 160}px)`}} />
    )}
    <div style={{position: 'absolute', top, left: 0, right: 0}}>
      <div style={{display: 'inline-block', marginLeft: 12, background: '#0A0A0A', color: '#fff',
        padding: '18px 30px 20px', fontWeight: 900, fontSize: titleSize, lineHeight: 1.25, letterSpacing: '-0.04em'}}>
        {title.split('\n').map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>)}
      </div>
      <div style={{margin: '0 12px', background: `rgba(40,40,40,${panelOpacity})`, padding: `26px ${textRight}px 30px 36px`,
        color: '#fff', fontWeight: 500, fontSize: itemSize, lineHeight, letterSpacing: '-0.02em'}}>
        {items.map((it, i) => (
          <div key={i} style={{display: 'flex', marginTop: i ? itemGap : 0}}>
            <div style={{width: '1.55em', flexShrink: 0}}>{i + 1}.</div>
            {/* 한 줄에 안 들어가면 단어 단위로 자동 줄바꿈. \n으로 직접 나눌 수도 있어요 */}
            <div style={{wordBreak: 'keep-all'}}>{it.split('\n').map((l, j) => <div key={j}>{l}</div>)}</div>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
