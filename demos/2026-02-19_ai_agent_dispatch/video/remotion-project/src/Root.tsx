import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';

export const Root = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={900} // 30 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
