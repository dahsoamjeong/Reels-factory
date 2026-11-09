import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate,
} from 'remotion';
import {BRAND} from './Reel';

// 내레이션(목소리) 영상: 목소리 파일 + 장면(영상/사진) 목록 + 자막 목록
// 장면 전환은 짧은 페이드, 사진은 천천히 확대(zoom) 또는 옆으로 흐름(pan)

const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
`;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const Scene = ({s, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = Math.round(fps * 0.35);
  const opacity = interpolate(frame, [0, fade], [0, 1], clamp);
  const p = frame / Math.max(1, durationInFrames - 1);
  let style = {width: '100%', height: '100%', objectFit: 'cover'};
  if (s.type === 'image') {
    const motion = s.motion || 'in';
    if (motion === 'pan') {
      style = {...style, objectPosition: `${interpolate(p, [0, 1], [s.panFrom ?? 0, s.panTo ?? 100])}% 50%`};
    } else {
      const z = motion === 'out' ? interpolate(p, [0, 1], [1.1, 1.0]) : interpolate(p, [0, 1], [1.0, 1.1]);
      style = {...style, objectPosition: s.position || '50% 50%', transform: `scale(${z})`};
    }
  } else if (s.position) {
    style = {...style, objectPosition: s.position};
  }
  return (
    <AbsoluteFill style={{opacity}}>
      {s.type === 'image'
        ? <Img src={staticFile(s.src)} style={style} />
        : <OffthreadVideo src={staticFile(s.src)} muted startFrom={Math.round((s.from || 0) * fps)} style={style} />}
    </AbsoluteFill>
  );
};

const Dot = () => (
  <span style={{display: 'inline-block', width: '0.2em', height: '0.2em', borderRadius: '50%', background: BRAND.red, marginLeft: '0.06em'}} />
);

const Subtitle = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, durationInFrames - 3, durationInFrames], [0, 1, 1, 0], clamp);
  const endsSentence = /[.!?요다]$/.test(text) && !/[?!]$/.test(text);
  return (
    <div style={{position: 'absolute', left: 72, right: 72, top: 1210, opacity: o, color: BRAND.white,
      fontFamily: 'Pretendard', fontWeight: 800, fontSize: 58, lineHeight: 1.32, letterSpacing: '-0.03em',
      wordBreak: 'keep-all', textShadow: '0 2px 4px rgba(0,0,0,.55), 0 2px 18px rgba(0,0,0,.6)'}}>
      {text.replace(/\.$/, '')}{endsSentence ? <Dot /> : null}
    </div>
  );
};

const Tag = ({title}) => (
  <div style={{position: 'absolute', top: 150, left: 72, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))'}}>
    <div style={{display: 'inline-flex', alignItems: 'center', paddingBottom: 14, borderBottom: `6px solid ${BRAND.red}`, whiteSpace: 'nowrap', color: BRAND.white}}>
      <Img src={staticFile(BRAND.logoWhite)} style={{height: 30, width: 'auto'}} />
      <span style={{width: 2, height: 32, background: 'rgba(255,255,255,.5)', margin: '0 18px'}} />
      <span style={{fontFamily: 'Pretendard', fontWeight: 600, fontSize: 40, letterSpacing: '-0.01em'}}>{title}</span>
    </div>
  </div>
);

const Opening = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp);
  const s = interpolate(frame, [0, durationInFrames], [0.96, 1.02]);
  return (
    <div style={{position: 'absolute', top: 700, left: 60, right: 60, textAlign: 'center', opacity: o, transform: `scale(${s})`,
      fontFamily: '"Nanum Myeongjo"', fontWeight: 800, fontSize: 104, lineHeight: 1.18, color: BRAND.white,
      whiteSpace: 'pre-line', textShadow: '0 2px 4px rgba(0,0,0,.5), 0 4px 30px rgba(0,0,0,.55)'}}>
      {text}<Dot />
    </div>
  );
};

export const Narration = ({audio, durationSec, seriesTitle, scenes = [], subtitles = [], opening}) => {
  const {fps} = useVideoConfig();
  const f = (x) => Math.round(x * fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{fontCss}</style>
      {scenes.map((s, i) => {
        const next = scenes[i + 1];
        const end = next ? next.start + 0.35 : durationSec;
        return (
          <Sequence key={'s' + i} from={f(s.start)} durationInFrames={Math.max(1, f(end - s.start))} layout="none">
            <Scene s={s} durationInFrames={Math.max(1, f(end - s.start))} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom,rgba(0,0,0,.5) 0,rgba(0,0,0,.2) 12%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 48%,rgba(0,0,0,.5) 62%,rgba(0,0,0,.55) 80%,rgba(0,0,0,.3) 100%)'}} />
      <Tag title={seriesTitle} />
      {opening && (
        <Sequence from={f(opening.start)} durationInFrames={f(opening.end - opening.start)} layout="none">
          <Opening text={opening.text} durationInFrames={f(opening.end - opening.start)} />
        </Sequence>
      )}
      {subtitles.map((c, i) => (
        <Sequence key={'c' + i} from={f(c.start)} durationInFrames={Math.max(1, f(c.end - c.start))} layout="none">
          <Subtitle text={c.text} durationInFrames={Math.max(1, f(c.end - c.start))} />
        </Sequence>
      ))}
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
