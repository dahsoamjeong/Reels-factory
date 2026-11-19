import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame,
  useVideoConfig, interpolate, spring,
} from 'remotion';
import {BRAND, fontCss, Dot, TitleBox} from './Reel';

// 짧은 현장 영상용 틀 (자막 없음)
//  1) intro: 영상 첫 장면을 흐리게 깔고, 사람들 반응을 말풍선으로 하나씩 띄움
//  2) 본 영상: 빨리감기한 영상 + "▶▶ ×1.6" 표시
//  3) outro: 마지막 몇 초에 한 줄 마무리 문구
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const Bubble = ({text, big, side, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 170}});
  const left = side === 'left';
  return (
    <div style={{display: 'flex', justifyContent: left ? 'flex-start' : 'flex-end', opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
      transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`, transformOrigin: left ? 'left bottom' : 'right bottom'}}>
      <div style={{position: 'relative', maxWidth: big ? 820 : 720, background: BRAND.white, color: BRAND.black,
        borderRadius: 40, padding: big ? '30px 40px 32px' : '24px 34px 26px',
        boxShadow: '0 10px 40px rgba(0,0,0,.35)',
        fontFamily: 'Pretendard', fontWeight: big ? 900 : 700, fontSize: big ? 54 : 42, lineHeight: 1.3,
        letterSpacing: '-0.03em', whiteSpace: 'pre-line', wordBreak: 'keep-all'}}>
        {text}{big ? <Dot /> : null}
        <div style={{position: 'absolute', bottom: -14, [left ? 'left' : 'right']: 46, width: 34, height: 34,
          background: BRAND.white, transform: 'rotate(45deg)', borderRadius: 6}} />
      </div>
    </div>
  );
};

const Intro = ({bg, comments, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Img src={staticFile(bg)} style={{width: '100%', height: '100%', objectFit: 'cover',
        filter: 'blur(22px) brightness(0.5)', transform: 'scale(1.12)'}} />
      <div style={{position: 'absolute', left: 80, right: 160, top: 760, display: 'flex', flexDirection: 'column', gap: 44}}>
        {comments.map((c, i) => (
          <Bubble key={i} text={c.text} big={c.big} side={c.side || (i % 2 ? 'right' : 'left')}
            delay={Math.round((0.3 + i * 0.9) * fps)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SpeedBadge = ({label}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', top: 662, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(10,10,10,.6)', color: BRAND.white, borderRadius: 999, padding: '8px 22px 9px',
        fontFamily: 'Pretendard', fontWeight: 800, fontSize: 30, letterSpacing: '0.02em'}}>{label}</div>
    </div>
  );
};

const Outro = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(0,0,0,.45)'}} />
      <div style={{position: 'absolute', top: 900, left: 80, right: 80, textAlign: 'center', color: BRAND.white,
        fontFamily: 'Pretendard', fontWeight: 900, fontSize: 64, lineHeight: 1.3, letterSpacing: '-0.03em',
        whiteSpace: 'pre-line', textShadow: '0 2px 6px rgba(0,0,0,.5), 0 4px 30px rgba(0,0,0,.5)'}}>{text}</div>
    </AbsoluteFill>
  );
};

export const QuickReel = ({video, bg, introSec = 4.5, videoSec, outroSec = 2.4, titleBox, comments = [], speedLabel, outro}) => {
  const {fps} = useVideoConfig();
  const f = (x) => Math.round(x * fps);
  const total = introSec + videoSec;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{fontCss}</style>
      <Sequence from={f(introSec)} layout="none">
        <AbsoluteFill><OffthreadVideo src={staticFile(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
        {speedLabel && <Sequence durationInFrames={f(videoSec - outroSec)} layout="none"><SpeedBadge label={speedLabel} /></Sequence>}
      </Sequence>
      <Sequence durationInFrames={f(introSec)} layout="none">
        <Intro bg={bg} comments={comments} durationInFrames={f(introSec)} />
      </Sequence>
      {outro && (
        <Sequence from={f(total - outroSec)} layout="none">
          <Outro text={outro} durationInFrames={f(outroSec)} />
        </Sequence>
      )}
      {titleBox && <TitleBox {...titleBox} />}
    </AbsoluteFill>
  );
};
