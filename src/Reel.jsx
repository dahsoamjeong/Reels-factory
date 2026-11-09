import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame,
  useVideoConfig, interpolate, spring,
} from 'remotion';
import '@fontsource/do-hyeon/400.css';
import '@fontsource/oswald/400.css';
import '@fontsource/nanum-myeongjo/400.css';
import '@fontsource/nanum-myeongjo/700.css';
import '@fontsource/nanum-myeongjo/800.css';

// ── 브랜드 설정 (여기만 바꾸면 모든 영상에 적용) ──────────────
export const BRAND = {
  red: '#CD2E1D',      // 로고 점 색
  black: '#0A0A0A',
  white: '#FFFFFF',
  name: 'SOAMING LAB',
};

// ── 스타일 A(클린 랩) / B(에디토리얼) ─────────────────────────
const STYLES = {
  A: {
    koFont: 'Pretendard', enFont: 'Pretendard',
    small: {fontWeight: 700, fontSize: 44, letterSpacing: '-0.03em'},
    big: {fontWeight: 900, fontSize: 76, letterSpacing: '-0.04em', lineHeight: 1.12},
    en: {fontWeight: 500, fontSize: 32, marginTop: 14},
    pop: {fontWeight: 900, fontSize: 200, letterSpacing: '-0.06em'},
    scatter: {fontWeight: 800, fontSize: 50, letterSpacing: '-0.03em'},
  },
  B: {
    koFont: 'Pretendard', enFont: 'Oswald', tagWeight: 800,
    small: {fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em'},
    big: {fontWeight: 900, fontSize: 80, letterSpacing: '-0.04em', lineHeight: 1.1},
    en: {fontSize: 36, marginTop: 12},
    pop: {fontWeight: 900, fontSize: 200, letterSpacing: '-0.06em'},
    scatter: {fontWeight: 800, fontSize: 50, letterSpacing: '-0.03em'},
  },
};

// ── 글꼴 바꾸기: 설정 파일에 "font": "pretendard" | "myeongjo" | "dohyeon" ──
const FONTS = {
  pretendard: {koFont: 'Pretendard', weights: {small: 700, big: 900, pop: 900, scatter: 800, tag: 900}},
  myeongjo: {koFont: '"Nanum Myeongjo"', enFont: '"Nanum Myeongjo"', weights: {small: 700, big: 800, pop: 800, scatter: 800, tag: 800}},
  dohyeon: {koFont: '"Do Hyeon"', weights: {small: 400, big: 400, pop: 400, scatter: 400, tag: 400}},
};
const withFont = (st, font) => {
  const f = FONTS[font];
  if (!f) return st;
  const w = f.weights;
  return {
    ...st, koFont: f.koFont, enFont: f.enFont || st.enFont, tagWeight: w.tag,
    small: {...st.small, fontWeight: w.small}, big: {...st.big, fontWeight: w.big},
    pop: {...st.pop, fontWeight: w.pop}, scatter: {...st.scatter, fontWeight: w.scatter},
  };
};

// 포인트 글꼴: 자막 한 줄이나 강조 단어에 "font": "myeongjo"를 붙이면 그 부분만 바뀜
// (작은 줄·영어 번역은 읽기 쉽게 항상 기본 글꼴 유지)
const ACCENT = {
  myeongjo: {fontFamily: '"Nanum Myeongjo"', fontWeight: 800, letterSpacing: '-0.02em',
    textShadow: '0 2px 3px rgba(0,0,0,.55), 0 3px 18px rgba(0,0,0,.6)'},
  dohyeon: {fontFamily: '"Do Hyeon"', fontWeight: 400, letterSpacing: '0'},
};
const accent = (font) => ACCENT[font] || {};

const fontCss = `
@font-face{font-family:Pretendard;font-weight:500;src:url(${staticFile('fonts/Pretendard-Medium.woff2')})}
@font-face{font-family:Pretendard;font-weight:700;src:url(${staticFile('fonts/Pretendard-Bold.woff2')})}
@font-face{font-family:Pretendard;font-weight:800 900;src:url(${staticFile('fonts/Pretendard-Black.woff2')})}
@font-face{font-family:ArchivoBlack;src:url(${staticFile('fonts/ArchivoBlack.woff2')})}
`;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 마지막 단어와 빨간 점이 줄바꿈으로 떨어지지 않게 묶음
const WithDot = ({text}) => {
  if (/[?!…]$/.test(text)) return <>{text}</>; // 물음표·느낌표 뒤에는 점 생략
  const i = text.lastIndexOf(' ');
  return <>{i >= 0 ? text.slice(0, i + 1) : ''}<span style={{whiteSpace: 'nowrap'}}>{text.slice(i + 1)}<Dot /></span></>;
};

const Dot = () => (
  <span style={{
    display: 'inline-block', width: '0.22em', height: '0.22em', borderRadius: '50%',
    background: BRAND.red, marginLeft: '0.06em',
  }} />
);

// 화면 위쪽 시리즈 이름표
const SeriesTag = ({title, episode, styleName, st}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}, durationInFrames: 12});
  const slide = interpolate(s, [0, 1], [-20, 0]);
  if (styleName === 'B') {
    return (
      <div style={{position: 'absolute', top: 150, left: 72, opacity: s, transform: `translateY(${slide}px)`,
        color: BRAND.white, textShadow: '0 2px 12px rgba(0,0,0,.5)'}}>
        <span style={{fontFamily: st.koFont, fontWeight: st.tagWeight || 800, fontSize: 48, letterSpacing: '-0.02em', borderBottom: `6px solid ${BRAND.red}`, paddingBottom: 6}}>{title}</span>
        <div style={{fontFamily: 'Oswald', fontSize: 28, letterSpacing: '0.08em', marginTop: 16, opacity: 0.9}}>
          {episode ? `EP.${String(episode).padStart(2, '0')} — ` : ''}{BRAND.name}<Dot />
        </div>
      </div>
    );
  }
  return (
    <div style={{
      position: 'absolute', top: 150, left: '50%',
      transform: `translateX(-50%) translateY(${slide}px)`,
      opacity: s, background: BRAND.black, padding: '22px 36px 20px',
      textAlign: 'center', whiteSpace: 'nowrap',
    }}>
      <div style={{fontFamily: st.koFont, fontWeight: st.tagWeight || 900, fontSize: 46, letterSpacing: '-0.02em', color: BRAND.white}}>{title}</div>
      <div style={{fontFamily: 'ArchivoBlack', fontSize: 22, letterSpacing: '0.12em', marginTop: 6, color: '#cfcfcf'}}>
        {episode ? `EP.${String(episode).padStart(2, '0')}  ` : ''}{BRAND.name}<Dot />
      </div>
    </div>
  );
};

// 기본 자막: 작은 줄 + 큰 줄 + 영어 번역
const Caption = ({small, big, en, font, durationInFrames, st}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 6], [0, 1], clamp);
  const exit = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], clamp);
  return (
    <div style={{
      position: 'absolute', left: 72, top: 1130, width: 900, color: BRAND.white,
      textShadow: '0 2px 4px rgba(0,0,0,.5), 0 2px 16px rgba(0,0,0,.6)', wordBreak: 'keep-all', whiteSpace: 'pre-line',
      opacity: enter * exit, transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
    }}>
      {small && <div style={{fontFamily: st.koFont, ...st.small, opacity: 0.95}}>{small}</div>}
      <div style={{fontFamily: st.koFont, ...st.big, ...accent(font)}}><WithDot text={big} /></div>
      {en && <div style={{fontFamily: st.enFont, ...st.en, opacity: 0.85}}>{en}</div>}
    </div>
  );
};

// 강조 1: 큰 단어가 화면 가운데에 튀어나옴
const Pop = ({text, font, durationInFrames, st}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 180}});
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp);
  return (
    <div style={{
      position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center',
      fontFamily: st.koFont, ...st.pop, color: BRAND.white,
      textShadow: '0 6px 30px rgba(0,0,0,.4)', opacity: Math.min(s, 1) * exit,
      transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
      ...accent(font),
    }}><WithDot text={text} /></div>
  );
};

// 강조 2: 짧은 문구들이 화면 곳곳에 차례로 떠오름 (흰색/빨강 번갈아)
const SPOTS = [[640, 470], [90, 640], [560, 820], [150, 960], [600, 380], [110, 520]];
const Scatter = ({texts, font, durationInFrames, st}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp);
  return (
    <>
      {texts.map((t, i) => {
        const appear = interpolate(frame, [i * 6, i * 6 + 6], [0, 1], clamp);
        const [x, y] = SPOTS[i % SPOTS.length];
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, whiteSpace: 'nowrap',
            fontFamily: st.koFont, ...st.scatter, color: i % 2 ? BRAND.red : BRAND.white,
            textShadow: '0 2px 4px rgba(0,0,0,.6), 0 2px 16px rgba(0,0,0,.5)',
            opacity: appear * exit, transform: `translateY(${interpolate(appear, [0, 1], [12, 0])}px)`,
            ...accent(font),
          }}>{t}</div>
        );
      })}
    </>
  );
};

export const Reel = ({video, style = 'A', font, seriesTitle, episode, captions = [], pops = []}) => {
  const {fps} = useVideoConfig();
  const st = withFont(STYLES[style] || STYLES.A, font);
  const f = (sec) => Math.round(sec * fps);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Pretendard, sans-serif'}}>
      <style>{fontCss}</style>
      <OffthreadVideo src={staticFile(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom,rgba(0,0,0,.25) 0,rgba(0,0,0,0) 18%,rgba(0,0,0,0) 45%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.55) 80%,rgba(0,0,0,.3) 100%)'}} />
      <SeriesTag title={seriesTitle} episode={episode} styleName={style} st={st} />
      {pops.map((p, i) => {
        const d = f(p.end - p.start);
        return (
          <Sequence key={'p' + i} from={f(p.start)} durationInFrames={d} layout="none">
            {p.scatter
              ? <Scatter texts={p.scatter} font={p.font} durationInFrames={d} st={st} />
              : <Pop text={p.text} font={p.font} durationInFrames={d} st={st} />}
          </Sequence>
        );
      })}
      {captions.map((c, i) => (
        <Sequence key={'c' + i} from={f(c.start)} durationInFrames={f(c.end - c.start)} layout="none">
          <Caption {...c} durationInFrames={f(c.end - c.start)} st={st} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
