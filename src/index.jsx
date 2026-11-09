import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Reel} from './Reel';
import sample from '../episodes/sample.json';

const Root = () => (
  <Composition
    id="Reel" component={Reel} fps={30} width={1080} height={1920}
    durationInFrames={300} defaultProps={sample}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSec * 30)})}
  />
);
registerRoot(Root);
