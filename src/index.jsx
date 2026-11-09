import React from 'react';
import {registerRoot, Composition, Still} from 'remotion';
import {Reel} from './Reel';
import {Cover} from './Cover';
import sample from '../episodes/sample.json';

const Root = () => (
  <>
  <Composition
    id="Reel" component={Reel} fps={30} width={1080} height={1920}
    durationInFrames={300} defaultProps={sample}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSec * 30)})}
  />
  <Still id="Cover" component={Cover} width={1080} height={1920}
    defaultProps={{image: 'cover-ep1.jpg', seriesTitle: 'Move to Find Yourself', episode: 1, episodeTitle: '기세와 에너지'}} />
  </>
);
registerRoot(Root);
