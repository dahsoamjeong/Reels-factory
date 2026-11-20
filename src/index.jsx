import React from 'react';
import {registerRoot, Composition, Still} from 'remotion';
import {Reel} from './Reel';
import {Cover} from './Cover';
import {Narration} from './Narration';
import {TalkCover} from './TalkCover';
import {QuickReel} from './QuickReel';
import sample from '../episodes/sample.json';

const Root = () => (
  <>
  <Composition
    id="Reel" component={Reel} fps={30} width={1080} height={1920}
    durationInFrames={300} defaultProps={sample}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSec * 30)})}
  />
  <Composition id="Narration" component={Narration} fps={30} width={1080} height={1920}
    durationInFrames={300} defaultProps={{audio: 'narration.wav', durationSec: 10, seriesTitle: 'Move to Find Yourself', scenes: [], subtitles: []}}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSec * 30)})}
  />
  <Still id="Cover" component={Cover} width={1080} height={1920}
    defaultProps={{image: 'cover-ep1.jpg', seriesTitle: 'Move to Find Yourself', episode: 1, episodeTitle: '기세와 에너지'}} />
  <Composition id="QuickReel" component={QuickReel} fps={30} width={1080} height={1920}
    durationInFrames={300} defaultProps={{video: 'barre-01.mp4', bg: 'barre-01-first.jpg', videoSec: 10, comments: []}}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(((props.introSec ?? 4.5) + props.videoSec) * 30)})}
  />
  <Still id="TalkCover" component={TalkCover} width={1080} height={1920}
    defaultProps={{image: 'cover-talk-01.jpg', title: '웰니스 사업가도\n본인 웰니스가 어려워'}} />
  </>
);
registerRoot(Root);
